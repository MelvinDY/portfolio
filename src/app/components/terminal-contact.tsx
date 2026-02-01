"use client"

import React, { useEffect, useState, useRef } from 'react'
import { Mail, Github, Linkedin, Instagram } from 'lucide-react'

// Terminal content (shortened for compact display)
const terminalLines = [
  "$ whoami",
  "melvin@portfolio:~$ contact_info",
  "",
  "Loading...",
  "Connection established ✓",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "│ CONTACT INTERFACE v2.1.0    │",
  "│ Status: ONLINE ●            │",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
]

const contactLinks = [
  { icon: Mail, label: "email", value: "melvindarialyogiana@gmail.com", href: "mailto:melvindarialyogiana@gmail.com" },
  { icon: Github, label: "github", value: "MelvinDY", href: "https://github.com/MelvinDY" },
  { icon: Linkedin, label: "linkedin", value: "melvin-yogiana", href: "https://linkedin.com/in/melvin-yogiana" },
  { icon: Instagram, label: "instagram", value: "@melvindarialyogiana", href: "https://instagram.com/melvindarialyogiana" },
]

const TerminalContact = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [showLinks, setShowLinks] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            setCurrentLine(0)
            setDisplayedText('')
            setShowLinks(false)
            setHasStarted(true)
          } else if (!entry.isIntersecting && hasStarted) {
            setHasStarted(false)
          }
        })
      },
      { threshold: 0.2 }
    )

    const currentRef = containerRef.current
    if (currentRef) observer.observe(currentRef)
    return () => { if (currentRef) observer.unobserve(currentRef) }
  }, [hasStarted])

  // Terminal typing animation
  useEffect(() => {
    if (!hasStarted) return

    if (currentLine < terminalLines.length) {
      const line = terminalLines[currentLine]
      let charIndex = 0
      let timeoutId: NodeJS.Timeout

      const typeInterval = setInterval(() => {
        if (charIndex <= line.length) {
          setDisplayedText(prev => {
            const lines = prev.split('\n')
            lines[currentLine] = line.slice(0, charIndex)
            return lines.join('\n')
          })
          charIndex++
        } else {
          clearInterval(typeInterval)
          timeoutId = setTimeout(() => {
            setCurrentLine(prev => prev + 1)
            setDisplayedText(prev => prev + '\n')
          }, 15)
        }
      }, 2)

      return () => {
        clearInterval(typeInterval)
        if (timeoutId) clearTimeout(timeoutId)
      }
    } else {
      const linksTimeout = setTimeout(() => setShowLinks(true), 100)
      return () => clearTimeout(linksTimeout)
    }
  }, [currentLine, hasStarted])

  // Cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => setShowCursor(prev => !prev), 500)
    return () => clearInterval(cursorInterval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    try {
      const response = await fetch('/api/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', message: '' })
        setTimeout(() => setStatus('idle'), 5000)
      } else {
        setStatus('error')
        setTimeout(() => setStatus('idle'), 5000)
      }
    } catch {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-6xl mx-auto">
      <div className="grid md:grid-cols-2 gap-6">
        {/* Left Column - Terminal */}
        <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-primary/5">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Terminal Header */}
          <div className="relative bg-muted/50 backdrop-blur-sm border-b border-white/10 px-4 py-2.5 flex items-center">
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
            </div>
            <div className="flex-1 text-center">
              <span className="text-muted-foreground font-mono text-xs">contact-info</span>
            </div>
          </div>

          {/* Terminal Body */}
          <div className="relative p-5 font-mono text-xs leading-relaxed">
            <pre className="whitespace-pre-wrap text-muted-foreground">
              {displayedText}
              {showCursor && currentLine < terminalLines.length && (
                <span className="bg-primary text-primary-foreground">█</span>
              )}
            </pre>

            {/* Contact Links */}
            {showLinks && (
              <div className="mt-4 space-y-2 animate-fade-in">
                {contactLinks.map((link, index) => {
                  const Icon = link.icon
                  return (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-colors group/link"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-muted-foreground">{link.label}:</span>
                      <span className="text-foreground group-hover/link:text-primary transition-colors">{link.value}</span>
                    </a>
                  )
                })}
                <div className="pt-2 text-muted-foreground/60 text-[10px]">
                  Response time: ~24 hours
                </div>
              </div>
            )}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>

        {/* Right Column - Contact Form */}
        <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-primary/5 flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          {/* Form Body */}
          <div className="relative p-6 flex-1 flex flex-col">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-foreground">Send a Message</h3>
              <p className="text-muted-foreground text-sm mt-1">I&apos;ll get back to you within 24 hours</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                <div className="relative">
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                    className="peer w-full bg-transparent border-0 border-b-2 border-border/50 text-foreground text-sm focus:border-primary focus:outline-none py-2 placeholder-transparent transition-colors"
                    placeholder="Name"
                    id="contact-name"
                  />
                  <label
                    htmlFor="contact-name"
                    className="absolute left-0 -top-2.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                  >
                    Name
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    required
                    className="peer w-full bg-transparent border-0 border-b-2 border-border/50 text-foreground text-sm focus:border-primary focus:outline-none py-2 placeholder-transparent transition-colors"
                    placeholder="Email"
                    id="contact-email"
                  />
                  <label
                    htmlFor="contact-email"
                    className="absolute left-0 -top-2.5 text-xs text-muted-foreground transition-all peer-placeholder-shown:top-2 peer-placeholder-shown:text-sm peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-primary"
                  >
                    Email
                  </label>
                </div>

                <div className="relative pt-2">
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                    required
                    className="w-full bg-muted/20 border border-border/30 rounded-xl text-foreground text-sm focus:border-primary focus:outline-none p-3 resize-none transition-colors"
                    placeholder="Write your message..."
                  />
                </div>
              </div>

              {status === 'success' && (
                <div className="flex items-center gap-2 text-green-500 text-sm py-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Message sent successfully!
                </div>
              )}
              {status === 'error' && (
                <div className="flex items-center gap-2 text-red-500 text-sm py-1">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  Failed to send. Please try again.
                </div>
              )}

              <div className="flex gap-3 mt-auto">
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="flex-1 bg-foreground text-background hover:bg-foreground/90 px-5 py-3 rounded-xl font-medium transition-all duration-200 disabled:opacity-50 text-sm"
                >
                  {status === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ name: '', email: '', message: '' })}
                  className="px-5 py-3 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-all duration-200 text-sm"
                >
                  Clear
                </button>
              </div>
            </form>
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out forwards; }
      `}</style>
    </div>
  )
}

export default TerminalContact
