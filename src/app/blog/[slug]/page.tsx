import { notFound } from 'next/navigation'
import { getPostById, getAllPosts } from '../../lib/blog'
import BlogPostTE from './blog-post-te'

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostById(slug)

  if (!post) {
    notFound()
  }

  // sorted newest-first; "next" nav goes toward newer post (lower index)
  const allPosts = getAllPosts()
  const idx = allPosts.findIndex(p => p.id === slug)
  const next = idx > 0 ? allPosts[idx - 1] : null

  return <BlogPostTE post={post} next={next} />
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.id }))
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostById(slug)
  if (!post) return { title: 'Post Not Found' }
  return {
    title: `${post.title} — Melvin Yogiana`,
    description: post.excerpt,
  }
}
