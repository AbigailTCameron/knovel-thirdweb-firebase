import initializeFirebaseServer from "../lib/initFirebaseAdmin";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const { db } = initializeFirebaseServer();

async function main() {
  console.log("🚀 Starting reset of 'migrated' flags…");

  const snap = await db.collection("books").get();
  console.log(`Found ${snap.size} book documents`);

  let updated = 0;
  let failed = 0;

  for (const docSnap of snap.docs) {
    try {
      // Only update if the field exists
      const data = docSnap.data();
      if ("migrated" in data) {
        await docSnap.ref.update({
          migrated: admin.firestore.FieldValue.delete(), // ❗ removes the field
        });
        console.log(`✅ Removed 'migrated' from ${docSnap.id}`);
        updated++;
      } else {
        console.log(`⏭ Skipped ${docSnap.id} (no migrated field)`);
      }
    } catch (err: any) {
      console.error(`❌ Failed to update ${docSnap.id}:`, err.message);
      failed++;
    }
  }

  console.log(`\n🎯 Done. updated=${updated}, failed=${failed}`);
  process.exit(0);
}

import admin from "firebase-admin";

main().catch((err) => {
  console.error(err);
  process.exit(1);
});