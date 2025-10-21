"use client"

import React, { useEffect, useState } from 'react'

// Terminal Contact Page Component
const TerminalContact = () => {
  const [currentLine, setCurrentLine] = useState(0)
  const [displayedText, setDisplayedText] = useState('')
  const [showCursor, setShowCursor] = useState(true)
  const [formVisible, setFormVisible] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

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

  // Terminal typing animation
  useEffect(() => {
    if (currentLine < terminalLines.length) {
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
    } else {
      // Show form after all lines are typed
      setTimeout(() => setFormVisible(true), 300)
    }
  }, [currentLine])

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
    } catch (error) {
      setStatus('error')
      setTimeout(() => setStatus('idle'), 5000)
    }
  }

  const handleClear = () => {
    setFormData({ name: '', email: '', message: '' })
  }

  return (
    <div className="relative w-full">
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
                  <div className="text-foreground mb-4">
                    $ compose_message --interactive
                  </div>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="text-muted-foreground block mb-2">Name:</label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        required
                        className="w-full bg-background border border-border rounded px-3 py-2 text-foreground font-mono focus:border-primary focus:outline-none"
                        placeholder="Enter your name..."
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground block mb-2">Email:</label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        required
                        className="w-full bg-background border border-border rounded px-3 py-2 text-foreground font-mono focus:border-primary focus:outline-none"
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div>
                      <label className="text-muted-foreground block mb-2">Message:</label>
                      <textarea
                        rows={6}
                        value={formData.message}
                        onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                        required
                        className="w-full bg-background border border-border rounded px-3 py-2 text-foreground font-mono focus:border-primary focus:outline-none resize-none"
                        placeholder="Type your message here..."
                      />
                    </div>

                    {status === 'success' && (
                      <div className="text-green-500 font-mono text-sm">
                        ✓ Message sent successfully!
                      </div>
                    )}
                    {status === 'error' && (
                      <div className="text-red-500 font-mono text-sm">
                        ✗ Failed to send message. Please try again.
                      </div>
                    )}

                    <div className="flex space-x-4">
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded font-mono transition-colors disabled:opacity-50"
                      >
                        {status === 'loading' ? 'Sending...' : 'Send Message'}
                      </button>
                      <button
                        type="button"
                        onClick={handleClear}
                        className="bg-muted hover:bg-muted/80 text-foreground px-6 py-2 rounded font-mono transition-colors"
                      >
                        Clear
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
