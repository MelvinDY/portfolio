import type { MetadataRoute } from "next"
import { SITE_URL } from "./lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Only API routes are blocked here. /dungeon and /stats are kept
      // crawlable on purpose and carry `robots: noindex` in their own
      // metadata — blocking them here would stop Google reading that noindex,
      // which is how pages end up indexed as bare URLs with no snippet.
      disallow: "/api/",
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  }
}
