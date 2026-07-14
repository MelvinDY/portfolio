export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  content?: string
  readTime?: string
  /** Extra search terms that don't appear verbatim in the title or excerpt. */
  keywords?: string
}

/** A post flattened for the blog index: search haystack and tag slugs precomputed. */
export interface PostCard {
  href: string
  /** Lowercased haystack: title + excerpt + tag labels + keywords. */
  text: string
  /** Comma-joined tag slugs, e.g. "hackathon,software-engineering". */
  tags: string
  date: string
  rt: string
  title: string
  excerpt: string
  tagLabels: string[]
}
