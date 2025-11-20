import { Button } from "@/components/ui/button"
import Link from "next/link"
import SiteHeader from "../components/site-header"
import BlogSearch from "../components/blog-search"
import { getAllPosts } from "../lib/blog"

export default function BlogPage() {
  const posts = getAllPosts()

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="blog" />

      <main className="container mx-auto px-4 md:px-6 py-12">
        {/* Blog Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            my blog.
          </h1>
        </div>

        {/* Blog Search and Posts */}
        <div className="max-w-4xl mx-auto">
          <BlogSearch posts={posts} />
        </div>

        {/* Back to Home */}
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <Link href="/">
            <Button variant="outline">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
