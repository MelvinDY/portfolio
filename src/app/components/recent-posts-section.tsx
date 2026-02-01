import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import BlogCard from "./blog-card"
import { getRecentPosts } from "../lib/blog"

export default function RecentPostsSection() {
  const recentPosts = getRecentPosts(2)

  return (
    <section className="min-h-screen flex items-center py-16 snap-start relative overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
          <div>
            <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
              Blog
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Recent Posts
            </h2>
          </div>
          <Link href="/blog">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground group">
              View all posts
              <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        {/* Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}
