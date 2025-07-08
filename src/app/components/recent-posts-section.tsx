import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import BlogCard from "./blog-card"

// Sample blog data - this should match your actual data
const recentPosts = [
  {
    id: "hello-world",
    title: "Hello World!",
    excerpt: "Welcome to my blog! This is my first post, and honestly, I'm just testing to make sure everything works as expected.",
    date: "April 21, 2025",
    tags: ["Blog", "Hello World", "Next.js", "Testing"]
  },
  {
    id: "portfolio-live",
    title: "My Portfolio is Live: Here's What I Learned",
    excerpt: "From a sleek, minimal design to an integrated AI chatbot. It even got a live review from one of my favorite creators!",
    date: "September 27, 2024",
    tags: ["Next.js", "React", "Portfolio", "Design"]
  }
]

export default function RecentPostsSection() {
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