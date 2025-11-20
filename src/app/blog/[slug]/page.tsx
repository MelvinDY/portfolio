import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, Clock } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import SiteHeader from "../../components/site-header"
import { getPostById, getRelatedPosts, getAllPosts } from "../../lib/blog"
import BlogCard from "@/app/components/blog-card"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import rehypeHighlight from "rehype-highlight"

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
            <div className="prose prose-lg max-w-none prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-a:text-primary prose-a:no-underline hover:prose-a:underline prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-pre:bg-muted prose-pre:p-4 prose-pre:rounded-lg">
              {post.content ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeHighlight]}
                >
                  {post.content}
                </ReactMarkdown>
              ) : (
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