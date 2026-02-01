"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import SiteHeader from "../components/site-header"
import ProjectCard from "../components/project-card"
import { projects } from "../data/projects"

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="projects" />
      <main className="w-full">
        {/* Header Section */}
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
                All Projects
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                A comprehensive collection of my development work, from web applications to mobile apps,
                showcasing various technologies and problem-solving approaches.
              </p>
            </div>

            {/* Featured Projects */}
            <div className="mb-16">
              <h2 className="text-2xl font-semibold mb-8 text-center">Featured Projects</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                {projects.filter(project => project.featured).map((project) => (
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
            </div>

            {/* All Projects */}
            <div>
              <h2 className="text-2xl font-semibold mb-8 text-center">Other Projects</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
                {projects.filter(project => !project.featured).map((project) => (
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
            </div>

            {/* Call to Action */}
            <div className="text-center mt-16 pt-8 border-t">
              <p className="text-muted-foreground mb-4">
                Interested in collaborating or learning more about these projects?
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="https://github.com/MelvinDY" target="_blank">
                  <Button variant="outline">
                    View on GitHub
                  </Button>
                </Link>
                <Link href="#contact">
                  <Button>
                    Get In Touch
                  </Button>
                </Link>
              </div>
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