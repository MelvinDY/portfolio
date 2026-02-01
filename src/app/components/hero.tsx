"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Github, Linkedin, Instagram, Mail, ChevronDown } from 'lucide-react'

const Hero = () => {
  const asciiRef = useRef<HTMLPreElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const headerHeight = 64
    let animationId: number

    // ASCII characters from dark to light
    const chars = ' .·:;+=xX$&#@'

    // Shape definitions for ASCII rendering
    const shapes = [
      { x: 0, y: 0, z: -5, size: 0.35, speed: 1 },      // center large
      { x: -0.5, y: 0.3, z: -3, size: 0.15, speed: 1.3 },  // top left
      { x: 0.5, y: -0.2, z: -4, size: 0.18, speed: 0.9 },  // bottom right
      { x: -0.4, y: -0.35, z: -2, size: 0.12, speed: 1.1 }, // bottom left
      { x: 0.45, y: 0.35, z: -3, size: 0.14, speed: 0.8 },  // top right
    ]

    const renderASCII = () => {
      if (!asciiRef.current) return

      const containerHeight = window.innerHeight - headerHeight
      const fontSize = window.innerWidth < 640 ? 7 : window.innerWidth < 1024 ? 9 : 11
      const charAspect = 0.55
      const cols = Math.floor(window.innerWidth / (fontSize * charAspect))
      const rows = Math.floor(containerHeight / fontSize)

      timeRef.current += 0.02

      let ascii = ''

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          // Normalize coordinates to -1 to 1
          const nx = (x / cols) * 2 - 1
          const ny = (y / rows) * 2 - 1

          let intensity = 0

          // Calculate intensity from each shape
          shapes.forEach((shape, i) => {
            // Animate shape position with time
            const angle = timeRef.current * shape.speed + i * 1.2
            const sx = shape.x + Math.sin(angle) * 0.1
            const sy = shape.y + Math.cos(angle * 0.7) * 0.08

            // Mouse influence on shape position
            const mx = mouseRef.current.x * 0.15
            const my = mouseRef.current.y * 0.15

            // Distance from point to shape center
            const dx = nx - sx - mx * (1 - Math.abs(shape.z) * 0.1)
            const dy = ny - sy - my * (1 - Math.abs(shape.z) * 0.1)
            const dist = Math.sqrt(dx * dx + dy * dy)

            // Create torus/ring shape with varying thickness
            const ringRadius = shape.size
            const ringThickness = shape.size * 0.4
            const ringDist = Math.abs(dist - ringRadius)

            if (ringDist < ringThickness) {
              // Add wave pattern on the ring surface
              const ringAngle = Math.atan2(dy, dx)
              const wave = Math.sin(ringAngle * 8 + timeRef.current * 2 * shape.speed) * 0.3 + 0.7
              const falloff = 1 - ringDist / ringThickness
              intensity += falloff * wave * (1 - Math.abs(shape.z) * 0.08)
            }

            // Add inner glow
            if (dist < ringRadius * 0.6) {
              const innerGlow = (1 - dist / (ringRadius * 0.6)) * 0.15
              intensity += innerGlow
            }
          })

          // Add subtle background noise/grid
          const gridX = Math.sin(nx * 30 + timeRef.current) * 0.02
          const gridY = Math.sin(ny * 30 + timeRef.current * 0.7) * 0.02
          intensity += (gridX + gridY) * 0.5

          // Mouse spotlight effect
          const mouseDist = Math.sqrt(
            Math.pow(nx - mouseRef.current.x, 2) +
            Math.pow(ny - mouseRef.current.y, 2)
          )
          if (mouseDist < 0.4) {
            intensity += (1 - mouseDist / 0.4) * 0.1
          }

          // Clamp and map to character
          intensity = Math.max(0, Math.min(1, intensity))
          const charIndex = Math.floor(intensity * (chars.length - 1))
          ascii += chars[charIndex]
        }
        ascii += '\n'
      }

      asciiRef.current.textContent = ascii
    }

    const animate = () => {
      renderASCII()
      animationId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = (e.clientY / window.innerHeight) * 2 - 1
    }

    window.addEventListener('mousemove', handleMouseMove)
    animate()
    setTimeout(() => setIsLoaded(true), 200)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const socialLinks = [
    { href: 'https://github.com/MelvinDY', icon: Github, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/melvin-yogiana/', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://www.instagram.com/melvindarialyogiana/', icon: Instagram, label: 'Instagram' },
    { href: 'mailto:melvindarialyogiana@gmail.com', icon: Mail, label: 'Email' }
  ]

  return (
    <div className="relative h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-background snap-start">
      {/* ASCII art background */}
      <pre
        ref={asciiRef}
        className="absolute inset-0 font-mono text-[7px] leading-[7px] sm:text-[9px] sm:leading-[9px] md:text-[11px] md:leading-[11px] text-foreground/40 overflow-hidden pointer-events-none select-none m-0 p-0"
        style={{ letterSpacing: '0px' }}
      />

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/70 pointer-events-none" />
      <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent pointer-events-none" />

      {/* Main content */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 md:px-8">
        <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
          {/* Name */}
          <h1
            className={`text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold tracking-tighter transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="block">Melvin</span>
            <span className="block text-foreground/50">Yogiana</span>
          </h1>

          {/* Divider */}
          <div
            className={`h-[2px] bg-gradient-to-r from-transparent via-foreground/40 to-transparent transition-all duration-1000 ease-out delay-200 ${
              isLoaded ? 'opacity-100 w-32' : 'opacity-0 w-0'
            }`}
          />

          {/* Subtitle */}
          <p
            className={`text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/60 font-light tracking-wider transition-all duration-1000 ease-out delay-300 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Computer Science @ UNSW
          </p>

          {/* Social links */}
          <div
            className={`flex items-center gap-3 sm:gap-4 backdrop-blur-md bg-background/50 rounded-full px-5 sm:px-6 py-2.5 sm:py-3 border border-foreground/20 shadow-lg transition-all duration-1000 ease-out delay-500 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith('mailto') ? undefined : '_blank'}
                rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                className="group p-2 sm:p-2.5 rounded-full transition-all duration-300 hover:bg-foreground/10 hover:scale-110"
              >
                <link.icon className="w-5 h-5 sm:w-6 sm:h-6 text-foreground/50 transition-all duration-300 group-hover:text-foreground" />
                <span className="sr-only">{link.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ease-out delay-700 ${
          isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <button
          onClick={() => {
            const nextSection = document.querySelector('section')
            nextSection?.scrollIntoView({ behavior: 'smooth' })
          }}
          className="flex flex-col items-center gap-1.5 text-foreground/40 hover:text-foreground/70 transition-colors duration-300"
        >
          <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>

      {/* Corner accents */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 border-l-2 border-t-2 border-foreground/15 pointer-events-none" />
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 border-r-2 border-t-2 border-foreground/15 pointer-events-none" />
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-12 h-12 sm:w-16 sm:h-16 border-l-2 border-b-2 border-foreground/15 pointer-events-none" />
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-12 h-12 sm:w-16 sm:h-16 border-r-2 border-b-2 border-foreground/15 pointer-events-none" />
    </div>
  )
}

export default Hero
