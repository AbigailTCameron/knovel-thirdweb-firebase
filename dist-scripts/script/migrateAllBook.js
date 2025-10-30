"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const initFirebase_1 = __importDefault(require("@/lib/initFirebase"));
const firestore_1 = require("firebase/firestore");
const ethers_1 = require("ethers");
const { db } = (0, initFirebase_1.default)();
// ABI must include migrateBook (onlyOwner) *or* publishBookFor (onlyAuthorized)
const PublishRegistryV1_json_1 = __importDefault(require("./abi/PublishRegistryV1.json"));
// --------- CONFIG ----------
const PROXY_ADDRESS = "0x0016404CCCf31605294dD86c1c39e65B4D882c82";
const RPC_URL = process.env.RPC_URL;
const PK = process.env.PRIVATE_KEY;
const OLD_ADDRESS = "0x...OLD_CONTRACT"; // optional: set your legacy addr
const BATCH_DELAY_MS = 250; // gentle pacing
const DRY_RUN = true; // set true to test without sending tx
// ---- ethers provider & signer ----
const provider = new ethers_1.ethers.JsonRpcProvider(RPC_URL);
const signer = new ethers_1.ethers.Wallet(PK, provider);
const contract = new ethers_1.ethers.Contract(PROXY_ADDRESS, PublishRegistryV1_json_1.default.abi, signer);
const sleep = (ms) => new Promise(res => setTimeout(res, ms));
async function main() {
    console.log("Migrator:", await signer.getAddress());
    console.log("Using proxy:", PROXY_ADDRESS);
    // ⚠️ sanity: check we really are owner
    // (optional) const isOwner = (await contract.owner()) === (await signer.getAddress());
    const snap = await (0, firestore_1.getDocs)((0, firestore_1.collection)(db, "books"));
    console.log(`Found ${snap.size} books`);
    let migrated = 0;
    let skipped = 0;
    let failed = 0;
    for (const d of snap.docs) {
        const book = d.data();
        const docId = d.id;
        // 1) already migrated?
        if (book.migrated === true) {
            console.log(`[SKIP][${docId}] already migrated`);
            skipped++;
            continue;
        }
        // 2) required fields
        if (!book.title || !book.author || !book.authorId || !book.hash) {
            console.warn(`[SKIP][${docId}] missing fields (title/author/authorId/hash)`);
            skipped++;
            continue;
        }
        // 3) authorId must be an address — if not, fall back to signer
        let authorAddr = String(book.authorId);
        if (!authorAddr.startsWith("0x") || authorAddr.length !== 42) {
            const fallbackAddr = await signer.getAddress();
            console.warn(`[WARN][${docId}] authorId is not a valid EVM address (${authorAddr}); using signer address ${fallbackAddr}`);
            authorAddr = fallbackAddr;
        }
        // 4) normalize price
        let priceWei = 0n;
        if (typeof book.price === "number") {
            priceWei = BigInt(book.price); // assuming already in wei
        }
        else if (typeof book.price === "string" && book.price.trim() !== "") {
            // if you stored "0.01" as ETH, change this to: ethers.parseEther(book.price)
            try {
                priceWei = BigInt(book.price);
            }
            catch {
                priceWei = 0n;
            }
        }
        // price handling (assume wei number or default 0)
        //const priceWei: ethers.BigNumberish = book.price ?? 0;
        const legacyBookId = book.bytesId; // fallback if you didn't store it
        console.log(`→ Migrating ${docId}: "${book.title}" → author=${authorAddr}`);
        if (DRY_RUN) {
            console.log(`[DRY RUN] would call migrateBook(${book.title}, ${book.author}, ${authorAddr}, ${book.hash}, ${priceWei}, ${legacyBookId})`);
            continue;
        }
        try {
            const tx = await contract.migrateBook(book.title, book.author, authorAddr, // address
            book.hash, priceWei, legacyBookId);
            const receipt = await tx.wait();
            // Find BookMigrated event
            const ev = receipt.events?.find((e) => e.event === "BookMigrated");
            if (!ev || !ev.args || !ev.args.newBookId) {
                throw new Error(`BookMigrated event not found for doc ${docId}`);
            }
            const newBookId = ev.args.newBookId;
            const legacyEmitted = ev.args?.legacyBookId;
            await (0, firestore_1.updateDoc)((0, firestore_1.doc)(db, "books", docId), {
                bytesId: newBookId,
                txhash: receipt.transactionHash,
                migrated: true
            });
            console.log(`   ✅ migrated ${docId} legacy=${legacyEmitted} → new=${newBookId} tx=${receipt.transactionHash}`);
            migrated++;
        }
        catch (err) {
            console.error(`   ❌ failed ${docId}:`, err?.message || err);
            failed++;
        }
        await sleep(BATCH_DELAY_MS);
    }
    console.log(`\nDone. migrated=${migrated}, skipped=${skipped}, failed=${failed}`);
    process.exit(0);
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
