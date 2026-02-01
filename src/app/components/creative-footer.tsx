"use client"

import { Github, Linkedin, Mail, Instagram } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function CreativeFooter() {
  return (
    <footer className="relative border-t border-white/10 bg-gradient-to-b from-background to-background/80">
      {/* Background gradient accent */}
      <div className="absolute bottom-0 left-1/4 w-1/2 h-32 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 py-16 relative">
        {/* ASCII Art Section */}
        <div className="flex justify-center mb-12 px-4">
          <div className="relative group">
            {/* Glow effect */}
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/20 rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

            <div className="relative w-[280px] sm:w-[400px] md:w-[500px] lg:w-[600px] text-primary/40 group-hover:text-primary transition-colors duration-500">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/m3lv1n-ascii.svg"
                alt="M3LV1N"
                className="w-full h-auto opacity-50 group-hover:opacity-100 transition-opacity duration-500"
                style={{ filter: 'brightness(0) saturate(100%)' }}
              />
              {/* Overlay for color control */}
              <div
                className="absolute inset-0 mix-blend-multiply bg-current opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                style={{ mixBlendMode: 'multiply' }}
              />
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6 mb-10">
          <Link
            href="https://github.com/MelvinDY"
            target="_blank"
            className="group relative"
          >
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-3 rounded-full border border-white/10 bg-background/50 backdrop-blur-sm group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
              <Github className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </Link>

          <Link
            href="https://www.linkedin.com/in/melvin-yogiana/"
            target="_blank"
            className="group relative"
          >
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-3 rounded-full border border-white/10 bg-background/50 backdrop-blur-sm group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
              <Linkedin className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </Link>

          <Link
            href="mailto:melvindarialyogiana@gmail.com"
            className="group relative"
          >
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-3 rounded-full border border-white/10 bg-background/50 backdrop-blur-sm group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
              <Mail className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </Link>

          <Link
            href="https://www.instagram.com/melvindarialyogiana"
            target="_blank"
            className="group relative"
          >
            <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative p-3 rounded-full border border-white/10 bg-background/50 backdrop-blur-sm group-hover:border-primary/50 group-hover:bg-primary/10 transition-all duration-300">
              <Instagram className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300" />
            </div>
          </Link>
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} MelvinDY. Built with Next.js</p>

          <nav className="flex gap-6">
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors duration-300"
            >
              Privacy
            </Link>
            <Link
              href="/blog"
              className="hover:text-primary transition-colors duration-300"
            >
              Blog
            </Link>
            <Link
              href="/projects"
              className="hover:text-primary transition-colors duration-300"
            >
              Projects
            </Link>
          </nav>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
    </footer>
  )
}
