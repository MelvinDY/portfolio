// src/app/data/projects.ts
import { Project } from "../types/project"

export const projects: Project[] = [
  {
    id: "ecommerce-platform",
    title: "E-commerce Platform",
    description: "A full-stack e-commerce platform built with Next.js, Prisma, and Stripe integration.",
    image: "/placeholder.svg?height=400&width=600",
    link: "https://github.com/MelvinDY",
    tags: ["Next.js", "Prisma", "Stripe"],
    featured: true
  },
  {
    id: "task-management",
    title: "Task Management App",
    description: "A real-time task management application with team collaboration features.",
    image: "/placeholder.svg?height=400&width=600",
    link: "https://github.com/MelvinDY",
    tags: ["React", "Node.js", "Socket.io"],
    featured: true
  },
  {
    id: "ai-chat",
    title: "AI Chat Interface",
    description: "An AI-powered chat interface with natural language processing capabilities.",
    image: "/placeholder.svg?height=400&width=600",
    link: "https://github.com/MelvinDY",
    tags: ["OpenAI", "Next.js", "TailwindCSS"],
    featured: true
  },
  {
    id: "weather-app",
    title: "Weather Dashboard",
    description: "A responsive weather dashboard with location-based forecasts and interactive maps.",
    image: "/placeholder.svg?height=400&width=600",
    link: "https://github.com/MelvinDY",
    tags: ["React", "API Integration", "Charts"]
  },
  {
    id: "portfolio-v1",
    title: "Portfolio Website v1",
    description: "My first portfolio website built with vanilla HTML, CSS, and JavaScript.",
    image: "/placeholder.svg?height=400&width=600",
    link: "https://github.com/MelvinDY",
    tags: ["HTML", "CSS", "JavaScript"]
  },
  {
    id: "blog-engine",
    title: "Custom Blog Engine",
    description: "A lightweight blog engine with markdown support and admin dashboard.",
    image: "/placeholder.svg?height=400&width=600",
    link: "https://github.com/MelvinDY",
    tags: ["Node.js", "Express", "MongoDB"]
  }
]
