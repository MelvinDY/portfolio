// src/app/data/projects.ts
import { Project } from "../types/project"

export const projects: Project[] = [
  {
    id: "onlycode",
    title: "OnlyCode",
    description: "First Place Winner at CSESoc Flagship Hackathon 2025. A gamified peer-to-peer coding platform with real-time collaboration, skill-based matchmaking, and integrated code execution.",
    image: "/placeholder.svg?height=400&width=600",
    link: "https://github.com/tangkenzee/OnlyCode",
    tags: ["React", "TypeScript", "WebSocket", "Monaco Editor", "Vite", "Express", "Judge0"],
    featured: true
  },
  {
    id: "ratemyaccom",
    title: "RateMyAccom",
    description: "Production-ready student accommodation review platform with university email verification, multi-dimensional ratings, and comprehensive security measures including XSS/CSRF protection and rate limiting.",
    image: "/placeholder.svg?height=400&width=600",
    link: "https://github.com/MelvinDY/ratemyaccom",
    tags: ["Next.js 14", "TypeScript", "Zod", "React Hook Form", "Jest", "TailwindCSS"],
    featured: true
  },
  {
    id: "ignite",
    title: "PPIA UNSW Ignite Website",
    description: "Official website for PPIA UNSW 2025 organization. Team project with 10 contributors featuring modular architecture, database integration, and comprehensive documentation.",
    image: "/placeholder.svg?height=400&width=600",
    link: "https://github.com/MelvinDY/ignite",
    tags: ["TypeScript", "React", "Supabase", "PostgreSQL", "Node.js"],
    featured: true
  },
  {
    id: "stall-wars",
    title: "Stall Wars",
    description: "Golden Rubbish Bin Award winner at Terrible Ideas Hackathon. A chaotic two-player arcade game with toilet-themed minigames including rhythm game, toilet RPS, competitive snake, and toilet pong. Built in 48 hours.",
    image: "/placeholder.svg?height=400&width=600",
    link: "https://github.com/MelvinDY/Stall_Wars",
    tags: ["React", "JavaScript", "Vite", "Hackathon", "Game Dev"]
  },
  {
    id: "portfolio",
    title: "Portfolio Website",
    description: "Modern portfolio website built with Next.js 15, featuring MDX blog support, AI chatbot integration, Three.js animations, and dark mode. You're looking at it!",
    image: "/placeholder.svg?height=400&width=600",
    link: "https://github.com/MelvinDY/portfolio",
    tags: ["Next.js 15", "TypeScript", "Three.js", "MDX", "OpenAI", "TailwindCSS"]
  },
  {
    id: "capstone-project",
    title: "UNSW Capstone Project",
    description: "Software engineering capstone project (COMP3900) developed in a team of 5 students. Full-stack application following agile methodologies and industry best practices.",
    image: "/placeholder.svg?height=400&width=600",
    link: "https://github.com/unsw-cse-comp99-3900/capstone-project-25t3-3900-w18a-cherry",
    tags: ["Team Project", "Agile", "Full-Stack", "Software Engineering"]
  }
]
