"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import SiteHeader from "../components/site-header"
import { blogPosts } from "../data/blog-posts"

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  
  const filteredPosts = blogPosts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const clearSearch = () => setSearchTerm("")

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="blog" />

      <main className="container mx-auto px-4 md:px-6 py-12">
        {/* Blog Header */}
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            my blog.
          </h1>
          
          {/* Search Bar */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search something..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Clear search</span>
              </Button>
            )}
          </div>
        </div>

        {/* Blog Posts */}
        <div className="max-w-4xl mx-auto space-y-6">
          {filteredPosts.length === 0 ? (
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">
                No posts found matching &quot;{searchTerm}&quot;. Try a different search term.
              </p>
            </Card>
          ) : (
            filteredPosts.map((post) => (
              <Card key={post.id} className="p-6 hover:shadow-lg transition-shadow">
                <Link href={`/blog/${post.id}`} className="block">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <h2 className="text-xl md:text-2xl font-semibold hover:text-primary transition-colors mb-2 md:mb-0">
                      {post.title}
                    </h2>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm md:text-base whitespace-nowrap">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </Card>
            ))
          )}
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