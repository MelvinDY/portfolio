export interface BlogPost {
  id: string
  title: string
  excerpt: string
  date: string
  tags: string[]
  content?: string
  readTime?: string
}