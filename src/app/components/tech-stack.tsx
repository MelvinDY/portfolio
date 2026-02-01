"use client"

import { Code2, Server, Cloud, Wrench } from "lucide-react"

const technologies = [
  {
    category: "Frontend",
    icon: Code2,
    skills: ["React", "Next.js", "TypeScript", "Three.js", "JavaScript", "Atlassian UI Kit", "TailwindCSS", "Redux", "GraphQL"],
  },
  {
    category: "Backend",
    icon: Server,
    skills: ["Node.js", "Express", "Python", "PostgreSQL", "MongoDB", "Atlassian Forge", "Supabase", "TypeScript"],
  },
  {
    category: "DevOps",
    icon: Cloud,
    skills: ["Docker", "AWS", "CI/CD", "Git", "Bitbucket", "Jira", "Linux", "Nginx"],
  },
  {
    category: "Tools",
    icon: Wrench,
    skills: ["VS Code", "Postman", "Figma", "Jest", "GitHub", "Vercel"],
  },
]

export default function TechStack() {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {technologies.map((tech, index) => {
        const Icon = tech.icon
        return (
          <div
            key={tech.category}
            className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-white/10 p-6 transition-all duration-500 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {/* Gradient overlay for glass effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center gap-3 mb-5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">{tech.category}</h3>
            </div>

            {/* Skills */}
            <div className="relative flex flex-wrap gap-2">
              {tech.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center rounded-full bg-muted/50 backdrop-blur-sm px-3 py-1.5 text-sm font-medium text-muted-foreground border border-border/50 transition-all duration-200 hover:bg-primary/10 hover:text-primary hover:border-primary/20"
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Bottom gradient accent */}
            <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        )
      })}
    </div>
  )
}
