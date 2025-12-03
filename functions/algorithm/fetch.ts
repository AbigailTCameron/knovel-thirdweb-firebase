import { BookFeatures, UserBookProfile } from "../..";

function scoreBookForUser(user: UserBookProfile, book: BookFeatures, now: number): number {

  // 1. Genre affinity (0–1)
  const genreAffinity = book.genres.reduce((sum, g) => sum + (user.preferredGenres[g] || 0), 0);

  // 2. Author follow (0 or 1)
  const authorFollowScore = user.followingAuthors.has(book.authorId) ? 1 : 0;

  // 3. Social proof: people they follow engaging
  const socialEngagementScore = Math.log1p(book.interactionsFromFollowing); // log dampening

  // 4. Global popularity (bounded)
  const popularityScore = Math.log1p(book.totalReads + book.totalLikes + book.totalComments);

  // 5. Quality (ratings)
  const ratingScore = book.avgRating / 5; // 0–1

  // 6. Recency (time decay)
  const daysSinceAdded = (now - book.addedAt) / (1000 * 60 * 60 * 24);
  const recencyScore = Math.exp(-daysSinceAdded / 30); // ~30-day half-life

  // 7. Novelty (prefer books they haven’t interacted with)
  const hasInteracted = user.interactedBooks.has(book.id);
  const noveltyScore = hasInteracted ? -1 : 0; // penalize already seen
  
  // 8. Tiny exploration noise
  const epsilon = (Math.random() - 0.5) * 0.1; // -0.05 to +0.05

  // Weighted sum
  const score =
    2.0 * genreAffinity +
    1.5 * authorFollowScore + 
    1.2 * socialEngagementScore +
    0.8 * popularityScore +
    1.0 * ratingScore +
    0.7 * recencyScore +
    1.0 * noveltyScore +
    epsilon;

  return score;
}