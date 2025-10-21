"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Github, Linkedin, Mail, Instagram } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import SiteHeader from "./components/site-header"
import ContactForm from "./components/contact-form"
import ProjectCard from "./components/project-card"
import TechStack from "./components/tech-stack"
import RecentPostsSection from "./components/recent-posts-section"
import AnimatedBackground from "./components/animated-background"
import { ExternalLink, MapPin, Calendar, Briefcase, GraduationCap } from "lucide-react"
import React, { useState } from "react"

interface WorkExperience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  logo: string;
  achievements: string[];
  skills: string[];
  links?: { label: string; url: string; }[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  period: string;
  location: string;
  logo: string;
  achievements: string[];
  links?: { label: string; url: string; }[];
}

const workExperience: WorkExperience[] = []

const education: Education[] = [
  {
    id: "UNSW",
    institution: "University of New South Wales",
    degree: "Bachelor of Science in Computer Science",
    period: "Dec 2023 - Dec 2025",
    location: "Sydney, Australia",
    logo: "/UNSW.png",
    achievements: [
      "First Place winner of 2025 CSESoc Flagship Hackathon"
    ],
    links: [
      { label: "Final Year Project", url: "#" },
      { label: "CSESoc Flagship Hackathon", url: "https://devpost.com/software/onlycode?_gl=1*zdc20o*_gcl_au*MTM2NjU0NjcxNC4xNzUzMjYwNzcz*_ga*MTkwOTI3MTYwNC4xNzUzMjYwNzc0*_ga_0YHJK3Y10M*czE3NTMyNjc3ODgkbzIkZzEkdDE3NTMyNjc4MTEkajM3JGwwJGgw" },
      { label: "Terrible Ideas Hackathon", url: "https://terriblehack.com/projects/stall-wars" }

    ]
  },
  {
    id: "UNSW-global",
    institution: "UNSW Global",
    degree: "Diploma in Computer Science",
    period: "Aug 2022 - Dec 2023",
    location: "Sydney, Australia",
    logo: "/UNSW-Global.png",
    achievements: []
  }
]

function TimelineSection({ items, type }: { items: WorkExperience[] | Education[], type: "work" | "education" }) {
  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No work experience yet</p>
          <p className="text-sm">Currently focusing on education and personal projects</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>
        
        <div className="space-y-8">
          {items.map((item) => {
            const isWork = type === "work"
            const workItem = isWork ? item as WorkExperience : null
            const educationItem = !isWork ? item as Education : null

            return (
              <div key={item.id} className="relative flex gap-6">
                {/* Timeline Dot and Logo */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-background border-2 border-border rounded-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.logo}
                      alt={isWork ? workItem!.company : educationItem!.institution}
                      width={32}
                      height={32}
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <div className="w-8 h-8 bg-primary/20 rounded hidden"></div>
                  </div>
                  {/* Timeline connector dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-8">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {isWork ? workItem!.role : educationItem!.degree}
                      </h3>
                      <p className="text-primary font-medium">
                        {isWork ? workItem!.company : educationItem!.institution}
                      </p>
                    </div>

                    <div className="flex flex-col lg:items-end gap-1 mt-2 lg:mt-0">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {item.period}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  {item.achievements && item.achievements.length > 0 && (
                    <div className="mb-4">
                      <ul className="space-y-2">
                        {item.achievements.map((achievement, achieveIndex) => (
                          <li key={achieveIndex} className="text-muted-foreground leading-relaxed flex items-start gap-2">
                            <span className="text-primary mt-2 text-xs">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills */}
                  {isWork && workItem!.skills && workItem!.skills.length > 0 && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {workItem!.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {item.links && item.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.links.map((link) => (
                        <Link key={link.label} href={link.url} target="_blank">
                          <Button variant="ghost" size="sm" className="h-8 px-3">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {link.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}

function ExperienceSection() {
  const [activeTab, setActiveTab] = useState<"education" | "work">("education")

  return (
    <section className="py-12 md:py-24 lg:py-32 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Experience
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
              My journey as a developer, from internships to full-time roles, 
              building experiences across fintech, education, and mobile platforms.
            </p>
            
            {/* Toggle Buttons */}
            <div className="flex justify-center gap-2 p-1 bg-muted rounded-lg inline-flex">
              <Button
                variant={activeTab === "education" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("education")}
                className="flex items-center gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                Education
              </Button>
              <Button
                variant={activeTab === "work" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("work")}
                className="flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                Work Experience
              </Button>
            </div>
          </div>

          {/* Content Based on Active Tab */}
          <div>
            {activeTab === "work" && (
              <TimelineSection items={workExperience} type="work" />
            )}
            {activeTab === "education" && (
              <TimelineSection items={education} type="education" />
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 pt-8 border-t">
            <p className="text-muted-foreground mb-4">
              Want to know more about my work or discuss opportunities?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about">
                <Button variant="outline">
                  Learn More About Me
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="home" />
      <main className="w-full">
        {/* Hero Section with Animated Background */}
        <section id="about" className="py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <AnimatedBackground className="opacity-30" />
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Full Stack Developer
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Building digital experiences with modern technologies. Focused on creating elegant solutions to
                  complex problems.
                </p>
              </div>
              <div className="flex space-x-4">
                <Link href="https://github.com" target="_blank">
                  <Button variant="outline" size="icon">
                    <Github className="h-4 w-4" />
                    <span className="sr-only">GitHub</span>
                  </Button>
                </Link>
                <Link href="https://linkedin.com" target="_blank">
                  <Button variant="outline" size="icon">
                    <Linkedin className="h-4 w-4" />
                    <span className="sr-only">LinkedIn</span>
                  </Button>
                </Link>
                <Link href="https://instagram.com/your-pet-instagram" target="_blank">
                  <Button variant="outline" size="icon">
                    <Instagram className="h-4 w-4" />
                    <span className="sr-only">Pet Support</span>
                  </Button>
                </Link>
                <Link 
                  href="mailto:melvindarialyogiana@gmail.com"
                  title="Send email to melvindarialyogiana@gmail.com"
                  onClick={(e) => {
                    // Fallback: copy email to clipboard if mailto fails
                    const fallback = () => {
                      navigator.clipboard.writeText("melvindarialyogiana@gmail.com").then(() => {
                        alert("Email address copied to clipboard: melvindarialyogiana@gmail.com");
                      }).catch(() => {
                        alert("Email: melvindarialyogiana@gmail.com");
                      });
                    };
                    
                    // Check if user agent supports mailto
                    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                    if (!isMobile && !window.confirm("This will open your email client. Click OK to continue, or Cancel to copy the email address instead.")) {
                      e.preventDefault();
                      fallback();
                    }
                  }}
                >
                  <Button variant="outline" size="icon">
                    <Mail className="h-4 w-4" />
                    <span className="sr-only">Email</span>
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <ExperienceSection />

        <section id="projects" className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Featured Projects</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A selection of my most notable work showcasing different technologies and problem-solving approaches.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mb-12">
              <ProjectCard
                title="E-commerce Platform"
                description="A full-stack e-commerce platform built with Next.js, Prisma, and Stripe integration."
                image="/placeholder.svg?height=400&width=600"
                link="https://github.com"
                tags={["Next.js", "Prisma", "Stripe"]}
              />
              <ProjectCard
                title="Task Management App"
                description="A real-time task management application with team collaboration features."
                image="/placeholder.svg?height=400&width=600"
                link="https://github.com"
                tags={["React", "Node.js", "Socket.io"]}
              />
              <ProjectCard
                title="AI Chat Interface"
                description="An AI-powered chat interface with natural language processing capabilities."
                image="/placeholder.svg?height=400&width=600"
                link="https://github.com"
                tags={["OpenAI", "Next.js", "TailwindCSS"]}
              />
            </div>
            <div className="text-center">
              <Link href="/projects">
                <Button variant="outline" size="lg">
                  View All Projects
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center">
              Tech Stack
            </h2>
            <div className="max-w-4xl mx-auto">
              <TechStack />
            </div>
          </div>
        </section>

        <RecentPostsSection />

        <section id="contact" className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center">
                Get in Touch
              </h2>
              <ContactForm />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 MelvinDY All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
              Privacy Policy
            </Link>
            <Link 
              className="text-xs hover:underline underline-offset-4" 
              href="mailto:melvindarialyogiana@gmail.com"
              title="Send email to melvindarialyogiana@gmail.com"
              onClick={(e) => {
                const fallback = () => {
                  navigator.clipboard.writeText("melvindarialyogiana@gmail.com").then(() => {
                    alert("Email address copied to clipboard: melvindarialyogiana@gmail.com");
                  }).catch(() => {
                    alert("Email: melvindarialyogiana@gmail.com");
                  });
                };
                
                const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                if (!isMobile && !window.confirm("This will open your email client. Click OK to continue, or Cancel to copy the email address instead.")) {
                  e.preventDefault();
                  fallback();
                }
              }}
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}