import { Button } from "@/components/ui/button"
import { ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react"
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
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <SiteHeader variant="blog" />

      <main className="container mx-auto px-4 md:px-6 py-12 relative">
        {/* Back Navigation */}
        <div className="max-w-3xl mx-auto mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="group text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to Blog
            </Button>
          </Link>
        </div>

        {/* Blog Post */}
        <article className="max-w-3xl mx-auto">
          {/* Post Header */}
          <header className="mb-12">
            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-full bg-primary/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary border border-primary/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight tracking-tight text-foreground">
              {post.title}
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-6 leading-relaxed">
              {post.excerpt}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-muted-foreground pb-8 border-b border-border">
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
          </header>

          {/* Post Content */}
          <div className="article-content">
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

          {/* Post Footer */}
          <footer className="mt-16 pt-8 border-t border-border">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Thanks for reading! Have thoughts? Feel free to reach out.
              </p>
              <Link href="/blog">
                <Button variant="outline" className="group">
                  View All Posts
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </footer>
        </article>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="max-w-4xl mx-auto mt-20">
            <div className="text-center mb-8">
              <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
                Keep Reading
              </p>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Related Posts</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {relatedPosts.map((relatedPost) => (
                <BlogCard key={relatedPost.id} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
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