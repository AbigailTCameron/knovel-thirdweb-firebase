import initializeFirebaseServer from "../lib/initFirebaseAdmin";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const { db } = initializeFirebaseServer();

/**
 * Compute popularityLast30d, trendingScore and ratingWeighted
 * from the book data. You can tune the weights/constants any time.
 */
function computeScoresForBook(data: FirebaseFirestore.DocumentData, nowMs: number) {
  const {
    views_30d = 0,
    likes_30d = 0,
    comments_30d = 0,
    finishes_30d = 0,
    rating = 0,
    rating_nums = 0,
    created_at,
  } = data;

  // ---- Popularity over last 30 days ----
  const VIEW_W = 1;
  const LIKE_W = 3;
  const COMMENT_W = 4;
  const FINISH_W = 5;

  const engagement =
    VIEW_W * views_30d +
    LIKE_W * likes_30d +
    COMMENT_W * comments_30d +
    FINISH_W * finishes_30d;

  const popularityLast30d = Math.log1p(engagement); // dampen huge counts

  // ---- RatingWeighted (Bayesian) ----
  // Helps avoid "5★ from 2 votes" beating "4.7★ from 200 votes"
  const v = typeof rating_nums === "number" ? rating_nums : 0; // votes
  const R = typeof rating === "number" ? rating : 0;             // average rating (0–5)
  const m = 5;                                                   // minimum votes for confidence
  const C = 3.5;                                                 // global prior mean rating
  const ratingWeighted =
    v + m > 0 ? (v / (v + m)) * R + (m / (v + m)) * C : C;       // default to C if no ratings

  // ---- TrendingScore: popularity * quality * recency ----
  let recencyBoost = 1;
  if (created_at && (created_at as any).toMillis) {
    const createdMs = (created_at as admin.firestore.Timestamp).toMillis();
    const ageDays = (nowMs - createdMs) / (1000 * 60 * 60 * 24);
    // ~30-day half-life – newer books get more boost
    recencyBoost = Math.exp(-ageDays / 30);
  }

  const qualityBoost = 0.5 + (R / 5) * 0.5; // 0.5–1.0 depending on rating

  const trendingScore = popularityLast30d * qualityBoost * recencyBoost;

  return { popularityLast30d, trendingScore, ratingWeighted };
}


async function main() {

  console.log("🚀 Starting backfill of engagement + scoring fields on books…");

  const snap = await db.collection("books").get();
  console.log(`Found ${snap.size} book documents`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  const nowMs = Date.now();

  for (const docSnap of snap.docs){

    try{
      const data = docSnap.data();

      // Prepare default engagement fields if missing
      const updates: any = {};

      const hasViews30d = typeof data.views_30d === "number";
      const hasLikes30d = typeof data.likes_30d === "number";
      const hasComments30d = typeof data.comments_30d === "number";
      const hasFinishes30d = typeof data.finishes_30d === "number";

      if (!hasViews30d) {
        if (typeof data.views === "number") {
          updates.views_30d = data.views;
        } else {
          updates.views_30d = 0;
        }
      }
      if (!hasLikes30d) updates.likes_30d = 0;
      if (!hasComments30d) updates.comments_30d = 0;
      if (!hasFinishes30d) updates.finishes_30d = 0;

      // Compute scores using either existing or defaulted engagement
      const mergedForScoring = {
        ...data,
        views_30d: hasViews30d
          ? data.views_30d
          : (typeof data.views === "number" ? data.views : 0),
        likes_30d: hasLikes30d ? data.likes_30d : 0,
        comments_30d: hasComments30d ? data.comments_30d : 0,
        finishes_30d: hasFinishes30d ? data.finishes_30d : 0,
      };

      const {
        popularityLast30d,
        trendingScore,
        ratingWeighted,
      } = computeScoresForBook(mergedForScoring, nowMs);

      if (typeof data.popularityLast30d !== "number") {
        updates.popularityLast30d = popularityLast30d;
      }
      if (typeof data.trendingScore !== "number") {
        updates.trendingScore = trendingScore;
      }
      if (typeof data.ratingWeighted !== "number") {
        updates.ratingWeighted = ratingWeighted;
      }

      if (Object.keys(updates).length === 0) {
        console.log(`⏭ Skipped ${docSnap.id} (already has all fields)`);
        skipped++;
        continue;
      }

      await docSnap.ref.update(updates);
      console.log(`✅ Updated ${docSnap.id}`, updates);
      updated++;

    }catch(err:any){
      console.error(`❌ Failed to update ${docSnap.id}:`, err?.message || err);
      failed++;
    }
  }

  console.log(
    `\n🎯 Done. updated=${updated}, skipped=${skipped}, failed=${failed}`
  );
  process.exit(0);

}

import admin from "firebase-admin";

main().catch((err) => {
  console.error(err);
  process.exit(1);
});