import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import BlogCard from "./blog-card"
import { getRecentPosts } from "../lib/blog"

export default function RecentPostsSection() {
  const recentPosts = getRecentPosts(2)
  
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
            recent posts
          </h2>
          <Link href="/blog">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              view more
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 max-w-6xl mx-auto">
          {recentPosts.map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  )
}