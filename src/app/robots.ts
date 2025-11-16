import type { MetadataRoute } from 'next'
import sitemap from './sitemap';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://knovelprotocol.com';

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/actions/", "/api/", "/editChapter/", "/editPublish/", "/newChapter/", "newChapterPublished/", "/dashboard", "/draft/"]
      }
    ],
    sitemap: `${baseUrl}/sitemap.xml`
  }
}