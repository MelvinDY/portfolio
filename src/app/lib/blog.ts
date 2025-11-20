// src/lib/blog.ts
import { BlogPost } from "../types/blog"
import fs from "fs"
import path from "path"
import matter from "gray-matter"

const postsDirectory = path.join(process.cwd(), "content/blog")

/**
 * Read all blog posts from MDX files
 */
function readAllPosts(): BlogPost[] {
  // Check if directory exists
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map(fileName => {
      // Remove ".mdx" or ".md" from file name to get id
      const id = fileName.replace(/\.mdx?$/, '')

      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')

      // Use gray-matter to parse the post metadata section
      const { data, content } = matter(fileContents)

      // Combine the data with the id and content
      return {
        id,
        title: data.title || '',
        excerpt: data.excerpt || '',
        date: data.date || '',
        readTime: data.readTime,
        tags: data.tags || [],
        content: content
      } as BlogPost
    })

  return allPostsData
}

/**
 * Get all blog posts sorted by date (newest first)
 */
export function getAllPosts(): BlogPost[] {
  const posts = readAllPosts()
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
  const posts = readAllPosts()
  return posts.find(post => post.id === id)
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
  const posts = readAllPosts()

  return posts.filter(post =>
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
  const posts = readAllPosts()
  const allTags = posts.flatMap(post => post.tags)
  return [...new Set(allTags)].sort()
}

/**
 * Get posts by tag
 * @param tag - Tag name
 */
export function getPostsByTag(tag: string): BlogPost[] {
  const posts = readAllPosts()
  return posts.filter(post =>
    post.tags.some(postTag => postTag.toLowerCase() === tag.toLowerCase())
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

/**
 * Get related posts based on tags
 * @param currentPost - The current post
 * @param limit - Number of related posts to return (default: 3)
 */
export function getRelatedPosts(currentPost: BlogPost, limit: number = 3): BlogPost[] {
  const posts = readAllPosts()
  const otherPosts = posts.filter(post => post.id !== currentPost.id)

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

/**
 * Get all post IDs for static generation
 */
export function getAllPostIds(): string[] {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  return fileNames
    .filter(fileName => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map(fileName => fileName.replace(/\.mdx?$/, ''))
}
