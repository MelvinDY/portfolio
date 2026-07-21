import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getPostById, getAllPosts } from '../../lib/blog'
import { FULL_NAME, SITE_URL } from '../../lib/site'
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

  const published = new Date(post.date)
  const articleLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    url: `${SITE_URL}/blog/${post.id}`,
    mainEntityOfPage: `${SITE_URL}/blog/${post.id}`,
    ...(isNaN(published.getTime()) ? {} : { datePublished: published.toISOString() }),
    keywords: post.tags,
    inLanguage: 'en-AU',
    // Points at the Person node declared on the homepage, so every post
    // reinforces the same author entity rather than creating a new one.
    author: { '@type': 'Person', '@id': `${SITE_URL}/#person`, name: FULL_NAME, url: SITE_URL },
    publisher: { '@id': `${SITE_URL}/#person` },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
      <BlogPostTE post={post} next={next} />
    </>
  )
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map(post => ({ slug: post.id }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostById(slug)
  if (!post) return { title: 'Post Not Found' }

  const published = new Date(post.date)
  const url = `/blog/${post.id}`

  return {
    // The root layout's title template appends the full name.
    title: post.title,
    description: post.excerpt,
    authors: [{ name: FULL_NAME, url: SITE_URL }],
    keywords: [...post.tags, FULL_NAME],
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url,
      authors: [FULL_NAME],
      ...(isNaN(published.getTime()) ? {} : { publishedTime: published.toISOString() }),
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
    },
  }
}
