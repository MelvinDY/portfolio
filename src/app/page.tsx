import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import SiteHeader from "./components/site-header"
import TerminalContact from "./components/terminal-contact"
import ProjectCard from "./components/project-card"
import TechStack from "./components/tech-stack"
import RecentPostsSection from "./components/recent-posts-section"
import Hero from "./components/hero"
import ExperienceSection from "./components/experience-section"
import ContactLink from "./components/contact-link"
import { projects } from "./data/projects"

export default function Page() {
  const featuredProjects = projects.filter(p => p.featured)

  return (
    <div className="h-screen overflow-hidden bg-background">
      <SiteHeader variant="home" />
      <main className="w-full snap-y snap-mandatory overflow-y-scroll h-main-safe scroll-smooth bg-background">
        {/* Hero Section */}
        <Hero />

        <ExperienceSection />

        <section id="projects" className="min-h-screen flex items-center py-16 snap-start relative overflow-hidden">
          {/* Background gradient accents */}
          <div className="absolute top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 relative">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
                Portfolio
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Featured Projects
              </h2>
            </div>

            {/* Projects Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto mb-12">
              {featuredProjects.map((project) => (
                <ProjectCard
                  key={project.id}
                  title={project.title}
                  description={project.description}
                  image={project.image}
                  images={project.images}
                  link={project.link}
                  tags={project.tags}
                />
              ))}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link href="/projects">
                <Button variant="outline" className="group">
                  View All Projects
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="min-h-screen flex items-center py-16 snap-start relative overflow-hidden">
          {/* Background gradient accents */}
          <div className="absolute top-1/3 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/3 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 relative">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
                Skills
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Tech Stack
              </h2>
            </div>

            <div className="max-w-4xl mx-auto">
              <TechStack />
            </div>
          </div>
        </section>

        <RecentPostsSection />

        <section id="contact" className="min-h-screen flex items-center py-16 snap-start relative overflow-hidden">
          {/* Background gradient accents */}
          <div className="absolute top-1/3 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-1/3 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

          <div className="container mx-auto px-4 md:px-6 relative">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
                Get in Touch
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Contact
              </h2>
            </div>

            <TerminalContact />
          </div>
        </section>

        {/* Footer inside scroll container */}
        <footer className="border-t snap-start">
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
      </main>
    </div>
  )
}