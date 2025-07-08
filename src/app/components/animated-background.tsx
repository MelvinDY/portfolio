"use client"

import React, { useEffect, useRef } from 'react'

interface AnimatedBackgroundProps {
  className?: string
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({ className = "" }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scrollPositionRef = useRef(0)
  const animationFrameId = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width
      canvas.height = rect.height
    }

    updateCanvasSize()
    
    const numLines = Math.floor(canvas.width / 10) // Responsive number of lines
    const lineSpacing = canvas.width / numLines
    
    // Create two different patterns - complexity arising from the inexhaustible source
    const createPattern = (offset: number) => {
      const pattern = []
      for (let i = 0; i < numLines; i++) {
        const bars = []
        const numBars = 8 + Math.sin(i * 0.3 + offset) * 4
        
        for (let j = 0; j < numBars; j++) {
          bars.push({
            y: (j / numBars) * canvas.height + Math.sin(i * 0.5 + j * 0.3 + offset) * 25,
            height: 3 + Math.sin(i * 0.2 + j * 0.4) * 2,
            width: 1.5 + Math.cos(i * 0.3) * 1.5
          })
        }
        pattern.push(bars)
      }
      return pattern
    }
    
    const pattern1 = createPattern(0)
    const pattern2 = createPattern(Math.PI)
    
    const animate = () => {
      scrollPositionRef.current += 0.002 // Slower, more subtle animation
      const scrollFactor = (Math.sin(scrollPositionRef.current) + 1) / 2
      
      // Clear canvas with theme-aware background
      ctx.fillStyle = 'hsl(var(--background))'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      // Draw lines and interpolated bars - smoothing sharp edges into gentle flow
      for (let i = 0; i < numLines; i++) {
        const x = i * lineSpacing + lineSpacing / 2
        
        // Draw vertical line with theme-aware color
        ctx.beginPath()
        ctx.strokeStyle = 'hsl(var(--muted-foreground) / 0.1)'
        ctx.lineWidth = 0.5
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
        
        // Interpolate between patterns - effortless transformation
        const bars1 = pattern1[i]
        const bars2 = pattern2[i]
        const maxBars = Math.max(bars1.length, bars2.length)
        
        for (let j = 0; j < maxBars; j++) {
          const bar1 = bars1[j] || bars2[j]
          const bar2 = bars2[j] || bars1[j]
          
          const y = bar1.y + (bar2.y - bar1.y) * scrollFactor
          const height = bar1.height + (bar2.height - bar1.height) * scrollFactor
          const width = bar1.width + (bar2.width - bar1.width) * scrollFactor
          
          // Use theme-aware colors with opacity
          ctx.fillStyle = 'hsl(var(--muted-foreground) / 0.15)'
          ctx.fillRect(x - width/2, y - height/2, width, height)
        }
      }
      
      animationFrameId.current = requestAnimationFrame(animate)
    }
    
    // Handle resize
    const handleResize = () => {
      updateCanvasSize()
    }
    
    window.addEventListener('resize', handleResize)
    animate()
    
    return () => {
      window.removeEventListener('resize', handleResize)
      
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current)
        animationFrameId.current = null
      }
      
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }
      
      scrollPositionRef.current = 0
    }
  }, [])

  return (
    <canvas 
      ref={canvasRef} 
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ 
        zIndex: 0,
        opacity: 0.8 
      }}
    />
  )
}

export default AnimatedBackground