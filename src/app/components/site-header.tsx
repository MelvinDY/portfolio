"use client"

import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import Link from "next/link"
import { useEffect, useState } from "react"
import { Moon, Sun, Home, User, FileText, Mail, Rocket, Hand, BookOpen, Laptop, Menu, X } from "lucide-react"

interface SiteHeaderProps {
  variant?: "home" | "about" | "blog" | "projects"
}

export default function SiteHeader({ variant = "home" }: SiteHeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light")
  }

  // Navigation items for different pages
  const homeNavItems = [
    { href: "/about", label: "About", icon: User, title: "About Me" },
    { href: "/projects", label: "Projects", icon: Rocket, title: "Projects" },
    { href: "/blog", label: "Blog", icon: FileText, title: "Blog" },
    { href: "#contact", label: "Contact", icon: Mail, title: "Contact" }
  ]

  const aboutNavItems = [
    { href: "#hero", label: "About", icon: Hand, title: "About" },
    { href: "#story", label: "My Story", icon: BookOpen, title: "My Story" },
    { href: "#tech", label: "Tech Stack", icon: Laptop, title: "Tech Stack" },
    { href: "#contact", label: "Contact", icon: Mail, title: "Contact" }
  ]

  const blogNavItems = [
    { href: "/", label: "Home", icon: Home, title: "Home" },
    { href: "/about", label: "About", icon: User, title: "About" },
    { href: "/projects", label: "Projects", icon: Rocket, title: "Projects" },
    { href: "#contact", label: "Contact", icon: Mail, title: "Contact" }
  ]

  const projectsNavItems = [
    { href: "/", label: "Home", icon: Home, title: "Home" },
    { href: "/about", label: "About", icon: User, title: "About" },
    { href: "/blog", label: "Blog", icon: FileText, title: "Blog" },
    { href: "#contact", label: "Contact", icon: Mail, title: "Contact" }
  ]

  const getNavItems = () => {
    switch (variant) {
      case "about":
        return aboutNavItems
      case "blog":
        return blogNavItems
      case "projects":
        return projectsNavItems
      default:
        return homeNavItems
    }
  }

  const navItems = getNavItems()

  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (variant === "home") {
      e.preventDefault()
      const mainContainer = document.querySelector('main')
      if (mainContainer) {
        mainContainer.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }

  const handleNavClick = () => {
    setMobileMenuOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        {/* Left side - Logo */}
        <div className="flex items-center">
          <Link
            className="flex items-center space-x-2"
            href="/"
            onClick={handleLogoClick}
          >
            <span className="font-bold">MelvinDY</span>
          </Link>
        </div>

        {/* Center - Desktop Navigation */}
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

        {/* Right side - Theme toggle, action button, and hamburger */}
        <div className="flex items-center space-x-2">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="flex p-2 hover:bg-accent rounded-md transition-colors"
            title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {mounted && (theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />)}
            {!mounted && <Moon className="h-5 w-5" />}
          </button>

          {/* Main action button - Desktop only */}
          <div className="hidden md:block">
            {variant === "home" ? (
              <Link href="/melvin_yogiana_cv.pdf" target="_blank">
                <Button variant="outline">
                  Resume
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

          {/* Hamburger Menu Button - Mobile only */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex md:hidden p-2 hover:bg-accent rounded-md transition-colors"
            title="Toggle menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background/95 backdrop-blur">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-md hover:bg-accent transition-colors"
                >
                  <Icon className="h-5 w-5 text-foreground/60" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}

            {/* Mobile action button */}
            <div className="pt-2 mt-2 border-t">
              {variant === "home" ? (
                <Link href="/melvin_yogiana_cv.pdf" target="_blank" onClick={handleNavClick}>
                  <Button variant="outline" className="w-full">
                    Resume
                  </Button>
                </Link>
              ) : (
                <Link href="/" onClick={handleNavClick}>
                  <Button variant="outline" size="sm" className="w-full">
                    ← Back to Home
                  </Button>
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
