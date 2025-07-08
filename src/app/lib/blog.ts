// src/lib/blog.ts
import { BlogPost } from "../types/blog"
import { blogPosts } from "../data/blog-posts"

/**
 * Get all blog posts sorted by date (newest first)
 */
export function getAllPosts(): BlogPost[] {
  return blogPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get recent blog posts
 * @param limit - Number of posts to return (default: 2)
 */
export function getRecentPosts(limit: number = 2): BlogPost[] {
  return getAllPosts().slice(0, limit)
}

/**
 * Get a single blog post by ID
 * @param id - The post ID
 */
export function getPostById(id: string): BlogPost | undefined {
  return blogPosts.find(post => post.id === id)
}

/**
 * Search blog posts by query
 * @param query - Search term
 */
export function searchPosts(query: string): BlogPost[] {
  if (!query.trim()) {
    return getAllPosts()
  }

  const lowercaseQuery = query.toLowerCase()
  
  return blogPosts.filter(post =>
    post.title.toLowerCase().includes(lowercaseQuery) ||
    post.excerpt.toLowerCase().includes(lowercaseQuery) ||
    post.tags.some(tag => tag.toLowerCase().includes(lowercaseQuery)) ||
    post.content?.toLowerCase().includes(lowercaseQuery)
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get all unique tags from all posts
 */
export function getAllTags(): string[] {
  const allTags = blogPosts.flatMap(post => post.tags)
  return [...new Set(allTags)].sort()
}

/**
 * Get posts by tag
 * @param tag - Tag name
 */
export function getPostsByTag(tag: string): BlogPost[] {
  return blogPosts.filter(post => 
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get related posts based on tags
 * @param currentPost - The current post
 * @param limit - Number of related posts to return (default: 3)
 */
export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  const otherPosts = blogPosts.filter(post => post.id !== currentPost.id)
  
  // Score posts based on shared tags
  const scoredPosts = otherPosts.map(post => {
    const sharedTags = post.tags.filter(tag => 
      currentPost.tags.some(currentTag => 
        currentTag.toLowerCase() === tag.toLowerCase()
      )
    )
    
    return {
      post,
      score: sharedTags.length
    }
  })
  
  // Sort by score (descending) then by date (newest first)
  return scoredPosts
    .sort((a, b) => {
      if (a.score !== b.score) {
        return b.score - a.score
      }
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    })
    .slice(0, limit)
    .map(item => item.post)
}