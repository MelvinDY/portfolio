"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"

interface SiteHeaderProps {
  variant?: "home" | "about" | "blog"
}

export default function SiteHeader({ variant = "home" }: SiteHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Get the appropriate emoji for current theme
  const getThemeEmoji = () => {
    if (!mounted) return "🌙" // Default to moon during SSR
    return theme === "light" ? "🌙" : "☀️"
  }

  // Navigation items for different pages
  const homeNavItems = [
    { href: "/about", label: "About", emoji: "👨‍💻", title: "About Me" },
    { href: "#projects", label: "Projects", emoji: "🚀", title: "Projects" },
    { href: "/blog", label: "Blog", emoji: "📝", title: "Blog" },
    { href: "#contact", label: "Contact", emoji: "📧", title: "Contact" }
  ]

  const aboutNavItems = [
    { href: "#hero", label: "About", emoji: "👋", title: "About" },
    { href: "#story", label: "My Story", emoji: "📖", title: "My Story" },
    { href: "#tech", label: "Tech Stack", emoji: "💻", title: "Tech Stack" },
    { href: "#contact", label: "Contact", emoji: "📧", title: "Contact" }
  ]

  const blogNavItems = [
    { href: "/", label: "Home", emoji: "🏠", title: "Home" },
    { href: "/about", label: "About", emoji: "👨‍💻", title: "About" },
    { href: "#projects", label: "Projects", emoji: "🚀", title: "Projects" },
    { href: "#contact", label: "Contact", emoji: "📧", title: "Contact" }
  ]

  const getNavItems = () => {
    switch (variant) {
      case "about":
        return aboutNavItems
      case "blog":
        return blogNavItems
      default:
        return homeNavItems
    }
  }

  const navItems = getNavItems()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <div className="flex items-center">
          <Link className="mr-6 flex items-center space-x-2" href="/">
            <span className="font-bold">MelvinDY</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="transition-colors hover:text-foreground/80"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Emoji Navigation */}
          <nav className="flex md:hidden items-center space-x-3 text-lg">
            {navItems.map((item) => (
              <Link 
                key={item.href}
                href={item.href} 
                className="p-2 hover:bg-accent rounded-md transition-colors"
                title={item.title}
              >
                {item.emoji}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Right side - Theme toggle and action button */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle Button - Hidden on very small screens */}
          <button
            onClick={toggleTheme}
            className="hidden sm:flex p-2 hover:bg-accent rounded-md transition-colors text-lg"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {getThemeEmoji()}
          </button>

          {/* Main action button */}
          {variant === "home" ? (
            <Button variant="outline">
              Resume
            </Button>
          ) : variant === "blog" ? (
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Home
              </Button>
            </Link>
          ) : (
            <Link href="/">
              <Button variant="outline" size="sm">
                ← Back to Home
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}