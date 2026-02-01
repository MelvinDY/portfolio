import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import SiteHeader from "../components/site-header"
import BlogSearch from "../components/blog-search"
import { getAllPosts } from "../lib/blog"

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-3/4 left-1/3 w-1/3 h-1/3 bg-primary/3 rounded-full blur-3xl pointer-events-none" />

      <SiteHeader variant="blog" />

      <main className="container mx-auto px-4 md:px-6 py-16 relative">
        {/* Blog Header */}
        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-sm font-medium text-primary mb-3 tracking-wide uppercase">
            Thoughts & Ideas
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Writing about web development, software engineering, and the occasional hackathon adventure.
          </p>
        </div>

        {/* Blog Search and Posts */}
        <div className="max-w-4xl mx-auto">
          <BlogSearch posts={posts} />
        </div>

        {/* Back to Home */}
        <div className="max-w-4xl mx-auto mt-16">
          <Link href="/">
            <Button variant="ghost" className="group text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
