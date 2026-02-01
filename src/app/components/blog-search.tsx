"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, X, Calendar, Clock, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { BlogPost } from "../types/blog"

interface BlogSearchProps {
  posts: BlogPost[]
}

export default function BlogSearch({ posts }: BlogSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  const clearSearch = () => setSearchTerm("")

  return (
    <div>
      {/* Search Bar */}
      <div className="relative max-w-md mb-12">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-11 pr-11 h-12 rounded-xl bg-background/50 backdrop-blur-sm border-white/10 focus:border-primary/50 transition-colors"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 rounded-lg hover:bg-primary/10"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear search</span>
          </Button>
        )}
      </div>

      {/* Blog Posts */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="rounded-2xl bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-white/10 p-12 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
              <Search className="h-6 w-6 text-primary/60" />
            </div>
            <p className="text-muted-foreground text-lg">
              No posts found matching &quot;{searchTerm}&quot;
            </p>
            <p className="text-muted-foreground/60 text-sm mt-2">
              Try a different search term or browse all posts below.
            </p>
          </div>
        ) : (
          filteredPosts.map((post, index) => (
            <Link
              key={post.id}
              href={`/blog/${post.id}`}
              className="block group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <article className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                {/* Gradient overlay for glass effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                <div className="relative">
                  {/* Header with title and arrow */}
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <h2 className="text-xl md:text-2xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
                      {post.title}
                    </h2>
                    <ArrowUpRight className="h-5 w-5 flex-shrink-0 text-muted-foreground opacity-0 -translate-y-1 translate-x-1 group-hover:opacity-100 group-hover:translate-y-0 group-hover:translate-x-0 group-hover:text-primary transition-all duration-300" />
                  </div>

                  {/* Excerpt */}
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {post.excerpt}
                  </p>

                  {/* Footer with tags and meta */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2">
                      {post.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center rounded-full bg-primary/10 backdrop-blur-sm px-3 py-1 text-xs font-medium text-primary/80 border border-primary/10"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 4 && (
                        <span className="inline-flex items-center px-2 py-1 text-xs text-muted-foreground">
                          +{post.tags.length - 4}
                        </span>
                      )}
                    </div>

                    {/* Meta info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{post.date}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-3.5 w-3.5" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </article>
            </Link>
          ))
        )}
      </div>

      {/* Post count */}
      {filteredPosts.length > 0 && (
        <p className="text-sm text-muted-foreground mt-8 text-center">
          {searchTerm ? (
            <>Showing {filteredPosts.length} of {posts.length} posts</>
          ) : (
            <>{posts.length} posts total</>
          )}
        </p>
      )}
    </div>
  )
}
