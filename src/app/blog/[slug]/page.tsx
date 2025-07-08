import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import React, { JSX } from "react"
import SiteHeader from "../../components/site-header"
import { getPostById, getRelatedPosts, getAllPosts } from "../../lib/blog"
import BlogCard from "@/app/components/blog-card"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostById(slug)

  if (!post) {
    notFound()
  }

  const relatedPosts = getRelatedPosts(post, 2)

  // Convert markdown-like content to JSX
  const formatContent = (content: string) => {
    const lines = content.split('\n')
    const elements: JSX.Element[] = []
    let i = 0
    let inCodeBlock = false
    let codeLines: string[] = []
    let codeLanguage = ''
    let inList = false
    let listItems: string[] = []

    const flushList = () => {
      if (listItems.length > 0) {
        elements.push(
          <ul key={`list-${elements.length}`} className="list-disc list-inside space-y-2 mb-6 ml-4">
            {listItems.map((item, idx) => (
              <li key={idx} className="leading-relaxed">{item}</li>
            ))}
          </ul>
        )
        listItems = []
        inList = false
      }
    }

    const flushCodeBlock = () => {
      if (codeLines.length > 0) {
        elements.push(
          <div key={`code-${elements.length}`} className="mb-6">
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code className={`language-${codeLanguage} text-sm`}>
                {codeLines.join('\n')}
              </code>
            </pre>
          </div>
        )
        codeLines = []
        codeLanguage = ''
        inCodeBlock = false
      }
    }

    while (i < lines.length) {
      const line = lines[i]
      const trimmedLine = line.trim()

      // Handle code blocks
      if (trimmedLine.startsWith('```')) {
        if (inCodeBlock) {
          flushCodeBlock()
        } else {
          flushList()
          inCodeBlock = true
          codeLanguage = trimmedLine.replace('```', '') || 'text'
        }
        i++
        continue
      }

      if (inCodeBlock) {
        codeLines.push(line)
        i++
        continue
      }

      // Handle lists
      if (trimmedLine.startsWith('- ')) {
        if (!inList) {
          inList = true
        }
        listItems.push(trimmedLine.replace('- ', ''))
        i++
        continue
      } else if (inList && trimmedLine === '') {
        // Continue list if empty line
        i++
        continue
      } else if (inList) {
        // End of list
        flushList()
      }

      // Handle headers
      if (trimmedLine.startsWith('### ')) {
        elements.push(
          <h3 key={`h3-${i}`} className="text-xl font-semibold mt-8 mb-4 text-primary">
            {trimmedLine.replace('### ', '')}
          </h3>
        )
      } else if (trimmedLine.startsWith('## ')) {
        elements.push(
          <h2 key={`h2-${i}`} className="text-2xl font-semibold mt-10 mb-6 text-primary">
            {trimmedLine.replace('## ', '')}
          </h2>
        )
      } else if (trimmedLine.startsWith('# ')) {
        elements.push(
          <h1 key={`h1-${i}`} className="text-3xl font-bold mt-12 mb-8">
            {trimmedLine.replace('# ', '')}
          </h1>
        )
      } else if (trimmedLine === '') {
        // Empty line - add spacing
        elements.push(<div key={`space-${i}`} className="h-4" />)
      } else if (trimmedLine) {
        // Regular paragraph - handle inline formatting
        const formatInlineContent = (text: string) => {
          // Handle bold **text**
          text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
          // Handle links [text](url)
          text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
          // Handle inline code `code`
          text = text.replace(/`([^`]+)`/g, '<code class="bg-muted px-1.5 py-0.5 rounded text-sm">$1</code>')
          
          return text
        }

        elements.push(
          <p 
            key={`p-${i}`} 
            className="mb-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: formatInlineContent(trimmedLine) }}
          />
        )
      }

      i++
    }

    // Flush any remaining content
    flushList()
    flushCodeBlock()

    return elements
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="blog" />

      <main className="container mx-auto px-4 md:px-6 py-12">
        {/* Back Navigation */}
        <div className="max-w-4xl mx-auto mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-6">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Blog Post */}
        <article className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12">
            {/* Post Header */}
            <header className="mb-8">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-muted-foreground mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{post.date}</span>
                </div>
                {post.readTime && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{post.readTime}</span>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-8">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center rounded-md bg-primary/10 px-3 py-1 text-sm font-medium text-primary ring-1 ring-inset ring-primary/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </header>

            {/* Post Content */}
            <div className="prose prose-lg max-w-none">
              {post.content ? formatContent(post.content) : (
                <p className="text-muted-foreground">
                  {post.excerpt}
                </p>
              )}
            </div>
          </Card>

          {/* Related Posts */}
          {relatedPosts.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
              <div className="grid gap-6 md:grid-cols-2">
                {relatedPosts.map((relatedPost) => (
                  <BlogCard key={relatedPost.id} post={relatedPost} />
                ))}
              </div>
            </section>
          )}

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link href="/blog">
              <Button>
                View All Posts
              </Button>
            </Link>
          </div>
        </article>
      </main>
    </div>
  )
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = getAllPosts()
  
  return posts.map((post) => ({
    slug: post.id,
  }))
}

// Generate metadata for each post
export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostById(slug)

  if (!post) {
    return {
      title: "Post Not Found",
    }
  }

  return {
    title: `${post.title} | Melvin - Full Stack Developer`,
    description: post.excerpt,
  }
}