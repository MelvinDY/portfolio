import { Button } from "@/components/ui/button"
import Link from "next/link"
import SiteHeader from "./components/site-header"
import TerminalContact from "./components/terminal-contact"
import ProjectCard from "./components/project-card"
import TechStack from "./components/tech-stack"
import RecentPostsSection from "./components/recent-posts-section"
import ThreeJSHero from "./components/three-js-hero"
import ExperienceSection from "./components/experience-section"
import ContactLink from "./components/contact-link"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="home" />
      <main className="w-full snap-y snap-mandatory overflow-y-scroll h-[calc(100vh-4rem)] scroll-smooth">
        {/* Hero Section with Three.js ASCII Art */}
        <ThreeJSHero />

        <ExperienceSection />

        <section id="projects" className="min-h-screen flex items-center py-12 snap-start">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">Featured Projects</h2>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto mb-12">
              <ProjectCard
                title="E-commerce Platform"
                description="A full-stack e-commerce platform built with Next.js, Prisma, and Stripe integration."
                image="/placeholder.svg?height=400&width=600"
                link="https://github.com/MelvinDY"
                tags={["Next.js", "Prisma", "Stripe"]}
              />
              <ProjectCard
                title="Task Management App"
                description="A real-time task management application with team collaboration features."
                image="/placeholder.svg?height=400&width=600"
                link="https://github.com/MelvinDY"
                tags={["React", "Node.js", "Socket.io"]}
              />
              <ProjectCard
                title="AI Chat Interface"
                description="An AI-powered chat interface with natural language processing capabilities."
                image="/placeholder.svg?height=400&width=600"
                link="https://github.com/MelvinDY"
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

        <section className="min-h-screen flex items-center py-12 snap-start">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center">
              Tech Stack
            </h2>
            <div className="max-w-5xl mx-auto">
              <TechStack />
            </div>
          </div>
        </section>

        <RecentPostsSection />

        <section id="contact" className="min-h-screen flex items-center py-12 snap-start">
          <TerminalContact />
        </section>
      </main>

      <footer className="border-t">
        <div className="container mx-auto flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 MelvinDY All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
              Privacy Policy
            </Link>
            <ContactLink />
          </nav>
        </div>
      </footer>
    </div>
  )
}