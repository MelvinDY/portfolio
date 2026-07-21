import type { MetadataRoute } from "next"
import { getAllPosts } from "./lib/blog"
import { SITE_URL } from "./lib/site"

/** Static routes worth indexing, most important first. */
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1.0, changeFrequency: "monthly" },
  { path: "/about", priority: 0.9, changeFrequency: "monthly" },
  { path: "/projects", priority: 0.8, changeFrequency: "monthly" },
  { path: "/projects/software", priority: 0.7, changeFrequency: "monthly" },
  { path: "/projects/data", priority: 0.7, changeFrequency: "monthly" },
  { path: "/projects/data/grocery", priority: 0.6, changeFrequency: "yearly" },
  { path: "/projects/data/labour-market", priority: 0.6, changeFrequency: "yearly" },
  { path: "/projects/data/saas", priority: 0.6, changeFrequency: "yearly" },
  { path: "/projects/data/youtube", priority: 0.6, changeFrequency: "yearly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
]

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticEntries = ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const postEntries = getAllPosts().map(post => {
    const parsed = new Date(post.date)
    return {
      url: `${SITE_URL}/blog/${post.id}`,
      // Frontmatter dates like "June 2026" parse fine; fall back if one doesn't.
      lastModified: isNaN(parsed.getTime()) ? now : parsed,
      changeFrequency: "yearly" as const,
      priority: 0.6,
    }
  })

  return [...staticEntries, ...postEntries]
}
