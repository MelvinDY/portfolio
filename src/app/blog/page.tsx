import type { Metadata } from 'next'
import { getPostCards } from '../lib/blog'
import BlogIndex from './blog-index'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Writing by Melvin Darial Yogiana on data engineering, analytics, and full-stack development — build notes, tool reviews, and things learned the hard way.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: 'Blog — Melvin Darial Yogiana',
    description: 'Writing on data engineering, analytics, and full-stack development.',
    url: '/blog',
  },
}

export default function BlogPage() {
  // Single source of truth: content/blog/*.mdx. Adding a post is adding a file.
  return <BlogIndex posts={getPostCards()} />
}
