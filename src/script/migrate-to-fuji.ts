import initializeFirebaseServer from "../lib/initFirebaseAdmin";
import { ethers } from "ethers";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const { db } = initializeFirebaseServer();
import PublishRegistryV1Abi from "./abi/PublishRegistryV1.json";

const PROXY_ADDRESS =
  process.env.PUBLISH_REGISTRY_PROXY_ADDRESS ||
  "0x1AAD889B2bF25926fC76e79250674F33AEe5E5bC";
const RPC_URL = process.env.RPC_URL!;
const PK = process.env.PRIVATE_KEY!;

// Set to "true" to only log what would happen without sending txs / updating Firestore
const DRY_RUN = false;

// ---- ethers provider & signer ----
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PK, provider);
const contract = new ethers.Contract(
  PROXY_ADDRESS,
  PublishRegistryV1Abi.abi,
  signer,
);

type FirestoreBook = {
  author?: string;
  authorId?: string;
  title?: string;
  hash?: string;
  price?: number | string;
  bytesId?: string;
  txHash?: string;
  currency?: string;
  network?: string;
  chainId?: number;
  [key: string]: any;
};

function normalizePrice(rawPrice: FirestoreBook["price"]): bigint {
  if (rawPrice === undefined || rawPrice === null) return 0n;

  if (typeof rawPrice === "number") {
    if (!Number.isFinite(rawPrice) || rawPrice < 0) {
      throw new Error(`Invalid numeric price: ${rawPrice}`);
    }
    return BigInt(Math.trunc(rawPrice));
  }

  if (typeof rawPrice === "string") {
    const trimmed = rawPrice.trim();
    if (!trimmed) return 0n;
    return BigInt(trimmed);
  }
  return 0n;
}

function resolveAuthorAddress(
  rawAuthorId: string | undefined,
  fallbackSignerAddress: string,
) {
  const trimmed = rawAuthorId?.trim();

  if (trimmed && ethers.isAddress(trimmed)) {
    return {
      authorAddr: trimmed,
      usedFallback: false,
    };
  }

  return {
    authorAddr: fallbackSignerAddress,
    usedFallback: true,
  };
}

async function main() {
  const signerAddress = await signer.getAddress();

  console.log("Migrator:", signerAddress);
  console.log("Using proxy:", PROXY_ADDRESS);
  console.log("Dry run:", DRY_RUN);
  console.log("Fallback author address:", signerAddress);

  const isAuthorized = await contract.authorizedAccounts(signerAddress);
  if (!isAuthorized) {
    throw new Error(
      `Signer ${signerAddress} is not authorized on PublishRegistryV1`,
    );
  }

  const snapshot = await db.collection("books").get();
  console.log(`Found ${snapshot.size} book docs`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  const skippedItems: any[] = [];
  const failedItems: any[] = [];

  for (const doc of snapshot.docs) {
    const data = doc.data();
    const docId = doc.id;

    try {
      if (data.chainId === 43113) {
        console.log(`Skipping ${doc.id}: already migrated to Fuji`);
        skippedItems.push({
          docId: doc.id,
          reason: "already migrated",
          data,
        });
        skipped++;
        continue;
      }

      const title = data.title?.trim();
      const author = data.author?.trim();
      const ipfsHash = data.hash?.trim();
      const price = normalizePrice(data.price);

      if (!title || !author || !ipfsHash) {
        console.log(`Skipping ${doc.id}: missing required fields`);
        skippedItems.push({
          docId: doc.id,
          reason: "missing required fields",
          data,
        });
        skipped++;
        continue;
      }

      const { authorAddr, usedFallback } = resolveAuthorAddress(
        data.authorId,
        signerAddress,
      );

      const currentNonce: bigint = await contract.authorNonces(authorAddr);
      const expectedBookId = ethers.solidityPackedKeccak256(
        ["address", "uint256"],
        [authorAddr, currentNonce],
      );

      console.log("\n------------------------------");
      console.log("Doc ID:", doc.id);
      console.log("Title:", title);
      console.log("Author:", author);
      console.log("Original authorId:", data.authorId ?? "(none)");
      console.log("Resolved authorAddr:", authorAddr);
      console.log("Used fallback:", usedFallback);
      console.log("Old bytesId:", data.bytesId ?? "(none)");
      console.log("Expected new bytesId:", expectedBookId);
      console.log("IPFS hash:", ipfsHash);
      console.log("Price:", price.toString());

      if (DRY_RUN) {
        migrated++;
        continue;
      }

      const tx = await contract.publishBookFor(
        title,
        author,
        ipfsHash,
        price,
        authorAddr,
      );

      console.log("Submitted tx:", tx.hash);
      const receipt = await tx.wait();

      if (!receipt) {
        throw new Error(`No receipt returned for doc ${doc.id}`);
      }

      let emittedBookId: string | null = null;

      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog({
            topics: [...log.topics],
            data: log.data,
          });

          if (parsed && parsed.name === "BookRegistered") {
            emittedBookId = parsed.args.bookId;
            break;
          }
        } catch {
          // ignore unrelated logs
        }
      }

      const finalBookId = emittedBookId ?? expectedBookId;
      await doc.ref.update({
        bytesId: finalBookId,
        txHash: receipt.hash,
        network: "fuji",
        chainId: 43113,
        contractAddress: PROXY_ADDRESS,
        currency: "AVAX",
        migratedAt: new Date(),
      });

      console.log("Updated Firestore doc:", docId);
      console.log("New bytesId:", finalBookId);
      console.log("New txHash:", receipt.hash);

      migrated++;
    } catch (error) {
      failed++;
      console.error(`Failed for doc ${doc.id}:`, error);
      failedItems.push({
        docId: doc.id,
        error: String(error),
        data,
      });
    }
  }

  fs.writeFileSync(
    "./migration-skipped.json",
    JSON.stringify(skippedItems, null, 2),
  );

  fs.writeFileSync(
    "./migration-failed.json",
    JSON.stringify(failedItems, null, 2),
  );

  console.log("\n========== DONE ==========");
  console.log("Migrated:", migrated);
  console.log("Skipped:", skipped);
  console.log("Failed:", failed);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
