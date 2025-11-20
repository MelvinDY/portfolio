// src/app/types/project.ts
export interface Project {
  id: string
  title: string
  description: string
  image: string // Primary image (used as fallback)
  images?: string[] // Array of images for carousel
  link: string
  tags: string[]
  featured?: boolean
}
