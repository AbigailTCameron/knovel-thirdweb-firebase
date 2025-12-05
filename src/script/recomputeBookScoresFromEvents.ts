import initializeFirebaseServer from "../lib/initFirebaseAdmin";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const { db } = initializeFirebaseServer();

// describe the shape of the per-book engagement counts we're computing from events
type Counters = {
  views_30d: number;
  likes_30d: number;
  comments_30d: number;
  finishes_30d: number;
};


/**
 * Compute popularityLast30d, trendingScore, and ratingWeighted
 * using:
 *  - 30d counters (views_30d, likes_30d, comments_30d, finishes_30d)
 *  - rating, rating_nums
 *  - created_at (for recency)
 */
function computeScoresForBook(baseData: FirebaseFirestore.DocumentData, counters: Counters, nowMs: number){
  const { rating = 0, rating_nums = 0, created_at } = baseData;
  const { views_30d, likes_30d, comments_30d, finishes_30d } = counters;

  // ---- Popularity over last 30 days ----

  //  define weights for each type of engagement 
  const VIEW_W = 1;
  const LIKE_W = 3;
  const COMMENT_W = 4;
  const FINISH_W = 5;

  // weighted sum over last 30 days
  const engagement =
    VIEW_W * views_30d +
    LIKE_W * likes_30d +
    COMMENT_W * comments_30d +
    FINISH_W * finishes_30d;

  const popularityLast30d = Math.log1p(engagement); // dampen huge counts.	Keeps small numbers roughly the same but squashes huge engagement so viral books don’t absolutely dominate.

  // ---- RatingWeighted (Bayesian) ----
  // Helps avoid "5★ from 2 votes" beating "4.7★ from 200 votes"
  // If v is large → ratingWeighted ≈ R (book has enough data).
	//If v is small → ratingWeighted is pulled toward C (global mean).
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

  const qualityBoost = 0.5 + (R / 5) * 0.5; // 0.5–1.0 depending on rating. Linearly maps rating (0–5) into [0.5, 1.0].
  const trendingScore = popularityLast30d * qualityBoost * recencyBoost;

  return { popularityLast30d, trendingScore, ratingWeighted };
}

async function main(){
    console.log("🚀 Recomputing 30-day engagement and scores from book_events…");

    const nowMs = Date.now();
    const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;
    const since = admin.firestore.Timestamp.fromMillis(nowMs - THIRTY_DAYS_MS);

    // 1) Load all books so we can reset 30d counters even if no recent events
    const booksSnap = await db.collection("books").get();
    console.log(`Found ${booksSnap.size} book documents`);

    const countersByBook: Record<string, Counters> = {};
    for (const doc of booksSnap.docs) {
      /**
       * Guarantees that even if a book has no events in the last 30 days, it still gets its 30d 
       * fields reset to 0 (so you don’t keep stale values forever).
      */ 
      countersByBook[doc.id] = {
        views_30d: 0,
        likes_30d: 0,
        comments_30d: 0,
        finishes_30d: 0,
      };
    }

    // 2) Load events from last 30 days
    const eventsSnap = await db
      .collection("book_events")
      .where("timestamp", ">=", since)
      .get();

    console.log(`📈 Found ${eventsSnap.size} events since ${since.toDate().toISOString()}`);

    // 3) Aggregate into counters
    for (const eventDoc of eventsSnap.docs) {
      const data = eventDoc.data();
      const bookId = data.bookId as string | undefined;
      const type = data.type as string | undefined;
      if (!bookId || !type) continue;

      // If there is an event for a book that doesn't exist anymore, skip it
      if (!countersByBook[bookId]) {
        countersByBook[bookId] = {
          views_30d: 0,
          likes_30d: 0,
          comments_30d: 0,
          finishes_30d: 0,
        };
      }

      const counters = countersByBook[bookId];

      if (type === "view") counters.views_30d++;
      if (type === "like") counters.likes_30d++;
      if (type === "comment") counters.comments_30d++;
      if (type === "finish") counters.finishes_30d++;
    }

    let updated = 0;
    let failed = 0;
    let batch = db.batch();
    let batchCount = 0;
    const BATCH_LIMIT = 450;

    for (const doc of booksSnap.docs) {
      const bookId = doc.id;
      const bookData = doc.data();
      const counters = countersByBook[bookId] || {
        views_30d: 0,
        likes_30d: 0,
        comments_30d: 0,
        finishes_30d: 0,
      };

      try{
          const {popularityLast30d, trendingScore, ratingWeighted} = computeScoresForBook(bookData, counters, nowMs);
          batch.update(doc.ref, {
            ...counters,
            popularityLast30d,
            trendingScore,
            ratingWeighted,
          });

          batchCount++;
          updated++;

           if (batchCount >= BATCH_LIMIT) {
            await batch.commit();
            console.log(`✅ Committed batch of ${batchCount} updates`);
            batch = db.batch();
            batchCount = 0;
          }
      }catch (err: any) {
        console.error(`❌ Failed to update book ${bookId}:`, err?.message || err);
        failed++;
      }
    }
    

    if (batchCount > 0) {
      await batch.commit();
      console.log(`✅ Committed final batch of ${batchCount} updates`);
    }

    console.log(`\n🎯 Done. updated=${updated}, failed=${failed}`);
    process.exit(0);

}

import admin from "firebase-admin";

main().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});