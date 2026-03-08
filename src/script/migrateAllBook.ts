import initializeFirebaseServer from "../lib/initFirebaseAdmin";
import { ethers } from "ethers";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const { db } = initializeFirebaseServer();

// ABI must include migrateBook (onlyOwner) *or* publishBookFor (onlyAuthorized)
import PublishRegistryV1Abi from "./abi/PublishRegistryV1.json";

// --------- CONFIG ----------
const PROXY_ADDRESS = "0x0016404CCCf31605294dD86c1c39e65B4D882c82";
const RPC_URL = process.env.RPC_URL!;
const PK = process.env.PRIVATE_KEY!;
const OLD_ADDRESS = "0x...OLD_CONTRACT"; // optional: set your legacy addr
const BATCH_DELAY_MS = 250; // gentle pacing
const DRY_RUN = false; // set true to test without sending tx

// ---- ethers provider & signer ----
const provider = new ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers.Wallet(PK, provider);
const contract = new ethers.Contract(
  PROXY_ADDRESS,
  PublishRegistryV1Abi.abi,
  signer,
);

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

async function main() {
  console.log("Migrator:", await signer.getAddress());
  console.log("Using proxy:", PROXY_ADDRESS);

  // ⚠️ sanity: check we really are owner
  // (optional) const isOwner = (await contract.owner()) === (await signer.getAddress());

  const snap = await db.collection("books").get();

  //const snap = await getDocs(collection(db, "books"));
  console.log(`Found ${snap.size} books`);

  let migrated = 0;
  let skipped = 0;
  let failed = 0;

  for (const docSnap of snap.docs) {
    const book = docSnap.data();
    const docId = docSnap.id;

    // 1) already migrated?
    if (book.migrated === true) {
      console.log(`[SKIP][${docId}] already migrated`);
      skipped++;
      continue;
    }

    // 2) required fields
    if (!book.title || !book.author || !book.authorId || !book.hash) {
      console.warn(
        `[SKIP][${docId}] missing fields (title/author/authorId/hash)`,
      );
      skipped++;
      continue;
    }

    // 3) authorId must be an address — if not, fall back to signer
    let authorAddr = String(book.authorId);

    if (!authorAddr.startsWith("0x") || authorAddr.length !== 42) {
      const fallbackAddr = await signer.getAddress();
      console.warn(
        `[WARN][${docId}] authorId is not a valid EVM address (${authorAddr}); using signer address ${fallbackAddr}`,
      );
      authorAddr = fallbackAddr;
    }

    // 4) normalize price
    let priceWei: bigint = 0n;
    if (typeof book.price === "number") {
      priceWei = BigInt(book.price); // assuming already in wei
    } else if (typeof book.price === "string" && book.price.trim() !== "") {
      // if you stored "0.01" as ETH, change this to: ethers.parseEther(book.price)
      try {
        priceWei = BigInt(book.price);
      } catch {
        priceWei = 0n;
      }
    }

    // price handling (assume wei number or default 0)
    //const priceWei: ethers.BigNumberish = book.price ?? 0;

    const legacyBookId = book.bytesId; // fallback if you didn't store it

    console.log(`→ Migrating ${docId}: "${book.title}" → author=${authorAddr}`);

    if (DRY_RUN) {
      console.log(
        `[DRY RUN] would call migrateBook(${book.title}, ${book.author}, ${authorAddr}, ${book.hash}, ${priceWei}, ${legacyBookId})`,
      );
      continue;
    }

    try {
      const tx = await contract.migrateBook(
        book.title,
        book.author,
        authorAddr, // address
        book.hash,
        priceWei,
        legacyBookId,
      );
      const receipt = await tx.wait();

      let newBookId: string | null = null;
      let legacyEmitted: string | null = null;

      // Print all parsed event names for debugging
      for (const log of receipt.logs) {
        try {
          const parsed = contract.interface.parseLog(log);
          console.log(`Parsed event: ${parsed?.name}`);

          // If we found BookMigrated, extract args[1] (newBookId)
          if (parsed?.name === "BookMigrated") {
            // both positional (0,1) and named access work in ethers v6
            legacyEmitted = parsed.args[0];
            newBookId = parsed.args[1]; // ✅ THIS IS THE VALUE YOU WANT
            console.log(
              `🆕 BookMigrated → legacy=${legacyEmitted}, new=${newBookId}`,
            );
            break; // ✅ stop searching once found
          }
        } catch (err) {
          // ignore unrelated logs
        }
      }

      if (!newBookId) {
        // ❗️couldn't find event — stop the loop
        console.error(
          `   ❌ BookMigrated event not found for doc ${docId}. Stopping migration here.`,
        );
        failed++;
        break; // <---- this breaks out of the for(...) loop
      }

      await docSnap.ref.update({
        bytesId: newBookId,
        txHash: receipt.hash ?? receipt.transactionHash,
        migrated: true,
      });

      console.log(
        `   ✅ migrated ${docId} legacy=${legacyEmitted} → new=${newBookId} tx=${receipt.transactionHash}`,
      );
      migrated++;
    } catch (err) {
      console.error(`   ❌ failed ${docId}:`, err?.message || err);
      failed++;
    }

    await sleep(BATCH_DELAY_MS);
  }

  console.log(
    `\nDone. migrated=${migrated}, skipped=${skipped}, failed=${failed}`,
  );
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
