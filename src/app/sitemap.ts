import type { MetadataRoute } from 'next';
import initializeFirebaseServer from "@/lib/initFirebaseAdmin";


const { db } = initializeFirebaseServer();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://knovelprotocol.com"; 
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/search`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/collection`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  const booksSnap = await db.collection("books").get();
  const bookRoutes: MetadataRoute.Sitemap = booksSnap.docs.map((doc) => {
      const data = doc.data() as any;

    const updated =
      (data.updated_at && data.updated_at.toDate?.()) ||
      (data.created_at && data.created_at.toDate?.()) ||
      now;

    const bookUrl = `${baseUrl}/book/${doc.id}`;
    const rawImageUrl = data.book_image as string | undefined;

    const entry: MetadataRoute.Sitemap[number] = {
      url: bookUrl,
      lastModified: updated,
      changeFrequency: "weekly",
      priority: 0.7,
    };


    if (rawImageUrl && typeof rawImageUrl === "string") {
      // 🔍 Strip query params to avoid & in XML (common with Firebase URLs)
      const [cleanUrl] = rawImageUrl.split("?");

      // Optional: only keep absolute http(s) URLs
      if (cleanUrl.startsWith("http")) {
        entry.images = [cleanUrl];
      } else {
        console.warn("Skipping non-absolute image URL in sitemap:", rawImageUrl);
      }
    }
    return entry;
  })


  return [...staticRoutes, ...bookRoutes]
}