"use client"

import React, { useEffect, useState, useRef } from 'react'

// Terminal content
const terminalLines = [
  "$ whoami",
  "melvin@portfolio:~$ contact_info --get-in-touch",
  "",
  "Loading contact information...",
  "Connection established ✓",
  "",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "│ CONTACT INTERFACE v2.1.0                     │",
  "│ Status: ONLINE ● Ready to receive messages   │",
  "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
  "",
  "Available communication channels:",
  "",
  "├── email: melvindarialyogiana@gmail.com",
  "├── github: github.com/MelvinDY",
  "├── linkedin: linkedin.com/in/melvin-yogiana",
  "└── instagram: @melvindarialyogiana",
  "",
  "Response time: Usually within 24 hours",
  "Preferred topics: Web dev, CS projects, opportunities",
  "",
  "Type 'send' to compose a message..."
]

// Terminal Contact Page Component
const TerminalContact = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [hasStarted, setHasStarted] = useState(false)
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [formVisible, setFormVisible] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  // Intersection Observer to detect when component enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasStarted) {
            // Reset state when starting
            setCurrentLine(0)
            setDisplayedText('')
            setFormVisible(false)
            setHasStarted(true)
          } else if (!entry.isIntersecting && hasStarted) {
            // Reset when leaving viewport to allow restart
            setHasStarted(false)
          }
        })
      },
      { threshold: 0.2 } // Trigger when 20% of the component is visible
    )

    const currentRef = containerRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
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
          }, 50)
        }
      }, 10)

      return () => {
        clearInterval(typeInterval)
        if (timeoutId) clearTimeout(timeoutId)
      }
    } else {
      // Show form after all lines are typed
      const formTimeout = setTimeout(() => setFormVisible(true), 300)
      return () => clearTimeout(formTimeout)
    }
  }, [currentLine, hasStarted])

  // Cursor blinking
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev)
    }, 500)
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

  const handleClear = () => {
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-4xl mx-auto px-4 md:px-6">
      {/* Terminal Window with Glass Effect */}
      <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-500 hover:shadow-primary/5">
        {/* Gradient overlay for glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Terminal Header */}
        <div className="relative bg-muted/50 backdrop-blur-sm border-b border-white/10 px-4 py-3 flex items-center">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80 hover:bg-yellow-500 transition-colors"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80 hover:bg-green-500 transition-colors"></div>
          </div>
          <div className="flex-1 text-center">
            <span className="text-muted-foreground font-mono text-sm">melvin@portfolio-contact</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="relative p-6 font-mono text-foreground text-sm leading-relaxed min-h-[480px]">
          <pre className="whitespace-pre-wrap text-muted-foreground">
            {displayedText}
            {showCursor && currentLine < terminalLines.length && (
              <span className="bg-primary text-primary-foreground">█</span>
            )}
          </pre>

          {/* Contact Form */}
          {formVisible && (
            <div className="mt-8 animate-fade-in">
              <div className="text-foreground mb-6">
                $ compose_message --interactive
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <div className="text-muted-foreground mb-1.5 text-xs uppercase tracking-wider">name:</div>
                  <div className="flex items-center">
                    <span className="text-primary mr-2">{'>'}</span>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      required
                      className="flex-1 bg-transparent border-0 border-b border-border/50 text-foreground font-mono focus:border-primary focus:outline-none p-0 pb-1 transition-colors"
                      placeholder="john_doe"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1.5 text-xs uppercase tracking-wider">email:</div>
                  <div className="flex items-center">
                    <span className="text-primary mr-2">{'>'}</span>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      required
                      className="flex-1 bg-transparent border-0 border-b border-border/50 text-foreground font-mono focus:border-primary focus:outline-none p-0 pb-1 transition-colors"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-1.5 text-xs uppercase tracking-wider">message:</div>
                  <div className="flex items-start">
                    <span className="text-primary mr-2 mt-2">{'>'}</span>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                      required
                      className="flex-1 bg-muted/30 backdrop-blur-sm border border-border/50 rounded-lg text-foreground font-mono focus:border-primary focus:outline-none p-3 resize-none transition-colors"
                      placeholder="your message here..."
                    />
                  </div>
                </div>

                {status === 'success' && (
                  <div className="text-green-500 font-mono text-sm py-2">
                    [✓] message_sent: transmission successful
                  </div>
                )}
                {status === 'error' && (
                  <div className="text-red-500 font-mono text-sm py-2">
                    [✗] error: transmission_failed - retry recommended
                  </div>
                )}

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-5 py-2 rounded-lg font-mono transition-all duration-200 disabled:opacity-50 text-sm hover:shadow-lg hover:shadow-primary/20"
                  >
                    {status === 'loading' ? '[ sending... ]' : '[ send ]'}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="border border-border/50 text-muted-foreground hover:text-foreground hover:border-border px-5 py-2 rounded-lg font-mono transition-all duration-200 text-sm"
                  >
                    [ clear ]
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.8s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default TerminalContact
