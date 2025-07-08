"use client"

import React, { useEffect, useRef } from 'react'
import { useTheme } from 'next-themes'

interface AnimatedBackgroundProps {
  className?: string
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme, resolvedTheme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const updateCanvasSize = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.offsetWidth
        canvas.height = parent.offsetHeight
      }
    }

    updateCanvasSize()

    let animationFrame: number
    let time = 0

    const draw = () => {
      time += 0.015

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Determine if we're in dark mode
      const isDark = resolvedTheme === 'dark' || theme === 'dark'

      // Draw animated lines
      const numLines = Math.floor(canvas.width / 50)
      
      for (let i = 0; i < numLines; i++) {
        const x = (i / numLines) * canvas.width
        
        // Vertical line - adapt color based on theme
        ctx.strokeStyle = isDark 
          ? 'rgba(255, 255, 255, 0.08)' 
          : 'rgba(0, 0, 0, 0.06)'
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()

        // Animated dots - theme-aware colors
        const numDots = 8
        for (let j = 0; j < numDots; j++) {
          const y = (j / numDots) * canvas.height + Math.sin(time + i * 0.5 + j * 0.3) * 25
          const size = 2 + Math.sin(time * 2 + i * 0.2) * 1
          
          // Theme-aware dot colors
          if (isDark) {
            ctx.fillStyle = 'rgba(100, 150, 255, 0.15)'
          } else {
            ctx.fillStyle = 'rgba(100, 100, 100, 0.1)'
          }
          
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
    draw()

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [theme, resolvedTheme]) // Redraw when theme changes

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 0 }}
    />
  )
}

export default AnimatedBackground