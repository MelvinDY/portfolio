import { getPostCards } from '../lib/blog'
import BlogIndex from './blog-index'

export default function BlogPage() {
  // Single source of truth: content/blog/*.mdx. Adding a post is adding a file.
  return <BlogIndex posts={getPostCards()} />
}
