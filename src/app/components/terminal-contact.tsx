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
            setHasStarted(true)
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
    if (hasStarted && currentLine < terminalLines.length) {
      const line = terminalLines[currentLine]
      let charIndex = 0

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
          setTimeout(() => {
            setCurrentLine(prev => prev + 1)
            setDisplayedText(prev => prev + '\n')
          }, 50)
        }
      }, 10)

      return () => clearInterval(typeInterval)
    } else if (hasStarted) {
      // Show form after all lines are typed
      setTimeout(() => setFormVisible(true), 300)
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
    <div ref={containerRef} className="relative w-full">
      {/* Terminal Content */}
      <div className="relative z-30 w-full h-full flex items-start justify-center p-4 md:p-8">
        <div className="w-full max-w-4xl">
          {/* Terminal Window */}
          <div className="bg-background border border-border rounded-lg overflow-hidden shadow-2xl">
            {/* Terminal Header */}
            <div className="bg-muted border-b border-border px-4 py-2 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <div className="flex-1 text-center">
                <span className="text-foreground font-mono text-sm">melvin@portfolio-contact</span>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 font-mono text-foreground text-sm leading-relaxed min-h-[500px]">
              <pre className="whitespace-pre-wrap">
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
                  <form onSubmit={handleSubmit} className="space-y-3">
                    <div>
                      <div className="text-muted-foreground mb-1">name:</div>
                      <div className="flex items-center">
                        <span className="text-primary mr-2">{'>'}</span>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                          required
                          className="flex-1 bg-transparent border-0 border-b border-border text-foreground font-mono focus:border-primary focus:outline-none p-0 pb-1"
                          placeholder="john_doe"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">email:</div>
                      <div className="flex items-center">
                        <span className="text-primary mr-2">{'>'}</span>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                          required
                          className="flex-1 bg-transparent border-0 border-b border-border text-foreground font-mono focus:border-primary focus:outline-none p-0 pb-1"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">message:</div>
                      <div className="flex items-start">
                        <span className="text-primary mr-2 mt-1">{'>'}</span>
                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                          required
                          className="flex-1 bg-transparent border border-border text-foreground font-mono focus:border-primary focus:outline-none p-2 resize-none"
                          placeholder="your message here..."
                        />
                      </div>
                    </div>

                    {status === 'success' && (
                      <div className="text-green-500 font-mono text-sm">
                        [✓] message_sent: transmission successful
                      </div>
                    )}
                    {status === 'error' && (
                      <div className="text-red-500 font-mono text-sm">
                        [✗] error: transmission_failed - retry recommended
                      </div>
                    )}

                    <div className="flex space-x-4 pt-2">
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="border border-primary text-primary hover:bg-primary hover:text-primary-foreground px-4 py-1 font-mono transition-colors disabled:opacity-50 text-sm"
                      >
                        {status === 'loading' ? '[ sending... ]' : '[ send ]'}
                      </button>
                      <button
                        type="button"
                        onClick={handleClear}
                        className="border border-border text-muted-foreground hover:text-foreground px-4 py-1 font-mono transition-colors text-sm"
                      >
                        [ clear ]
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
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
