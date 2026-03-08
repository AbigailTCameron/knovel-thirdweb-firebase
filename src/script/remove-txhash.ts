import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import initializeFirebaseServer from "../lib/initFirebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

const { db } = initializeFirebaseServer();

const DRY_RUN = false;

async function main() {
  console.log("Starting txhash cleanup");
  console.log("Dry run:", DRY_RUN);

  const snapshot = await db.collection("books").get();
  console.log(`Found ${snapshot.size} documents`);

  let cleaned = 0;
  let skipped = 0;

  for (const doc of snapshot.docs) {
    const data = doc.data();

    if (!("txhash" in data)) {
      skipped++;
      continue;
    }

    console.log(`Cleaning doc: ${doc.id}`);

    if (!DRY_RUN) {
      await doc.ref.update({
        txhash: FieldValue.delete(),
      });
    }

    cleaned++;
  }

  console.log("\n===== DONE =====");
  console.log("Cleaned:", cleaned);
  console.log("Skipped:", skipped);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
