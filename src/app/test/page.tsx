"use client"

import React, { useEffect, useRef } from 'react'

// Inline component for testing
const TestAnimatedBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.offsetWidth
        canvas.height = parent.offsetHeight
        console.log('Canvas size:', canvas.width, canvas.height) // Debug log
      }
    }

    updateCanvasSize()

    let animationFrame: number
    let time = 0

    const draw = () => {
      time += 0.02

      // Clear canvas with visible background for testing
      ctx.fillStyle = 'rgba(0, 0, 0, 0.02)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw animated elements
      const numLines = Math.floor(canvas.width / 40)
      
      for (let i = 0; i < numLines; i++) {
        const x = (i / numLines) * canvas.width
        
        // Vertical line
        ctx.strokeStyle = 'rgba(100, 100, 255, 0.3)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()

        // Animated circles
        const numCircles = 6
        for (let j = 0; j < numCircles; j++) {
          const y = (j / numCircles) * canvas.height + Math.sin(time + i * 0.5 + j * 0.4) * 30
          const size = 3 + Math.sin(time * 1.5 + i * 0.3) * 2
          
          ctx.fillStyle = 'rgba(100, 150, 255, 0.2)'
          ctx.beginPath()
          ctx.arc(x, y, size, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      animationFrame = requestAnimationFrame(draw)
    }

    const handleResize = () => {
      updateCanvasSize()
    }

    window.addEventListener('resize', handleResize)
    
    // Start animation
    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ 
        zIndex: 0
      }}
    />
  )
}

// Test page component
export default function TestPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="relative z-10 p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold">Testing Animated Background</h1>
      </header>

      {/* Hero section with background */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <TestAnimatedBackground />
        
        <div className="relative z-10 text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold">
            Full Stack Developer
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl">
            Building digital experiences with modern technologies. Focused on creating elegant solutions to complex problems.
          </p>
          <div className="flex justify-center space-x-4 mt-8">
            <button className="px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
              View Projects
            </button>
            <button className="px-6 py-3 border border-gray-600 hover:border-gray-400 rounded-lg transition-colors">
              Contact Me
            </button>
          </div>
        </div>
      </section>

      {/* Another section to test */}
      <section className="relative py-20 bg-gray-900 overflow-hidden">
        <TestAnimatedBackground />
        
        <div className="relative z-10 container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-8">Projects</h2>
          <p className="text-gray-400">This section also has the animated background</p>
        </div>
      </section>
    </div>
  )
}