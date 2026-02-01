"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Github, Linkedin, Instagram, Mail, ChevronDown } from 'lucide-react'

const Hero = () => {
  const asciiRef = useRef<HTMLPreElement>(null)
  const mobileAsciiRef = useRef<HTMLPreElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const timeRef = useRef(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    const headerHeight = 56 // 3.5rem = 56px
    let animationId: number

    // Get actual viewport height (handles mobile address bar)
    const getViewportHeight = () => {
      return window.visualViewport?.height || window.innerHeight
    }

    // ASCII characters from dark to light
    const chars = ' .·:;+=xX$&#@'

    // Shape definitions
    const shapes = [
      { x: 0, y: 0, z: -5, size: 0.45, speed: 0.8, type: 'torus' },
      { x: -0.4, y: -0.35, z: -3, size: 0.22, speed: 1.2, type: 'ring' },
      { x: 0.35, y: 0.4, z: -4, size: 0.2, speed: 1.0, type: 'ring' },
      { x: -0.35, y: 0.35, z: -2, size: 0.18, speed: 1.4, type: 'sphere' },
      { x: 0.4, y: -0.3, z: -3, size: 0.16, speed: 0.9, type: 'ring' },
      { x: 0, y: 0.5, z: -2, size: 0.12, speed: 1.3, type: 'sphere' },
      { x: 0, y: -0.5, z: -2, size: 0.14, speed: 1.1, type: 'ring' },
    ]

    const renderASCII = (targetRef: React.RefObject<HTMLPreElement | null>, isFullWidth: boolean) => {
      if (!targetRef.current) return

      const containerHeight = getViewportHeight() - headerHeight
      const fontSize = window.innerWidth < 640 ? 5 : window.innerWidth < 1024 ? 6 : 10
      const charAspect = 0.55

      const fullCols = Math.floor(window.innerWidth / (fontSize * charAspect))
      const cols = isFullWidth ? fullCols : Math.floor(fullCols * 0.55)
      const rows = Math.floor(containerHeight / fontSize)

      timeRef.current += 0.015

      let ascii = ''

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          const nx = (x / cols) * 2 - 1
          const ny = (y / rows) * 2 - 1

          let intensity = 0

          shapes.forEach((shape, i) => {
            const angle = timeRef.current * shape.speed + i * 0.9
            const sx = shape.x + Math.sin(angle) * 0.12
            const sy = shape.y + Math.cos(angle * 0.8) * 0.1

            const mx = mouseRef.current.x * 0.1
            const my = mouseRef.current.y * 0.1

            const dx = nx - sx - mx * (1 - Math.abs(shape.z) * 0.1)
            const dy = ny - sy - my * (1 - Math.abs(shape.z) * 0.1)
            const dist = Math.sqrt(dx * dx + dy * dy)

            if (shape.type === 'torus') {
              const ringRadius = shape.size
              const ringThickness = shape.size * 0.35

              for (let r = 0; r < 3; r++) {
                const offsetAngle = timeRef.current * 0.5 + r * (Math.PI * 2 / 3)
                const offsetX = Math.cos(offsetAngle) * shape.size * 0.3
                const offsetY = Math.sin(offsetAngle) * shape.size * 0.3

                const tdx = dx - offsetX
                const tdy = dy - offsetY
                const tdist = Math.sqrt(tdx * tdx + tdy * tdy)
                const ringDist = Math.abs(tdist - ringRadius * 0.6)

                if (ringDist < ringThickness) {
                  const ringAngle = Math.atan2(tdy, tdx)
                  const wave = Math.sin(ringAngle * 6 + timeRef.current * 2) * 0.3 + 0.7
                  const falloff = 1 - ringDist / ringThickness
                  intensity += falloff * wave * 0.5
                }
              }

              if (dist < ringRadius * 0.4) {
                intensity += (1 - dist / (ringRadius * 0.4)) * 0.2
              }

            } else if (shape.type === 'ring') {
              const ringRadius = shape.size
              const ringThickness = shape.size * 0.4
              const ringDist = Math.abs(dist - ringRadius)

              if (ringDist < ringThickness) {
                const ringAngle = Math.atan2(dy, dx)
                const wave = Math.sin(ringAngle * 8 + timeRef.current * 2.5 * shape.speed) * 0.3 + 0.7
                const falloff = 1 - ringDist / ringThickness
                intensity += falloff * wave * (1 - Math.abs(shape.z) * 0.08)
              }

              if (dist < ringRadius * 0.5) {
                const innerGlow = (1 - dist / (ringRadius * 0.5)) * 0.1
                intensity += innerGlow
              }

            } else if (shape.type === 'sphere') {
              if (dist < shape.size) {
                const sphereIntensity = 1 - (dist / shape.size)
                const edge = Math.sin(sphereIntensity * Math.PI) * 0.8
                intensity += edge * (1 - Math.abs(shape.z) * 0.1)
              }
            }
          })

          const gridWave = Math.sin(nx * 15 + timeRef.current) * Math.sin(ny * 15 + timeRef.current * 0.7) * 0.03
          intensity += Math.max(0, gridWave)

          const mouseDist = Math.sqrt(
            Math.pow(nx - mouseRef.current.x, 2) +
            Math.pow(ny - mouseRef.current.y, 2)
          )
          if (mouseDist < 0.5) {
            intensity += (1 - mouseDist / 0.5) * 0.08
          }

          intensity = Math.max(0, Math.min(1, intensity))
          const charIndex = Math.floor(intensity * (chars.length - 1))
          ascii += chars[charIndex]
        }
        ascii += '\n'
      }

      targetRef.current.textContent = ascii
    }

    const animate = () => {
      if (isMobile) {
        renderASCII(mobileAsciiRef, true)
      } else {
        renderASCII(asciiRef, false)
      }
      animationId = requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const vh = getViewportHeight()
      if (isMobile) {
        mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1
        mouseRef.current.y = (e.clientY / vh) * 2 - 1
      } else {
        const rightPanelStart = window.innerWidth * 0.45
        mouseRef.current.x = ((e.clientX - rightPanelStart) / (window.innerWidth * 0.55)) * 2 - 1
        mouseRef.current.y = (e.clientY / vh) * 2 - 1
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const touch = e.touches[0]
        const vh = getViewportHeight()
        mouseRef.current.x = (touch.clientX / window.innerWidth) * 2 - 1
        mouseRef.current.y = (touch.clientY / vh) * 2 - 1
      }
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('touchmove', handleTouchMove)
    animate()
    setTimeout(() => setIsLoaded(true), 200)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [isMobile])

  const socialLinks = [
    { href: 'https://github.com/MelvinDY', icon: Github, label: 'GitHub' },
    { href: 'https://www.linkedin.com/in/melvin-yogiana/', icon: Linkedin, label: 'LinkedIn' },
    { href: 'https://www.instagram.com/melvindarialyogiana/', icon: Instagram, label: 'Instagram' },
    { href: 'mailto:melvindarialyogiana@gmail.com', icon: Mail, label: 'Email' }
  ]

  return (
    <div className="relative h-main-safe flex overflow-hidden bg-background snap-start">
      {/* Mobile ASCII Background */}
      <div className="lg:hidden absolute inset-0">
        <pre
          ref={mobileAsciiRef}
          className="absolute inset-0 font-mono text-[5px] leading-[5px] sm:text-[6px] sm:leading-[6px] text-foreground/20 overflow-hidden pointer-events-none select-none m-0 p-0"
          style={{ letterSpacing: '0px' }}
        />
        {/* Gradient overlays for mobile */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background/70 pointer-events-none" />
      </div>

      {/* Content - centered on mobile, left-aligned on desktop */}
      <div className="relative z-10 w-full lg:w-[45%] flex items-center justify-center lg:justify-start">
        <div className="w-full px-6 sm:px-8 lg:px-12 xl:px-16">
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-5 sm:space-y-6 lg:space-y-8">
            {/* Name */}
            <h1
              className={`text-5xl sm:text-6xl md:text-7xl lg:text-7xl xl:text-8xl font-bold tracking-tighter transition-all duration-1000 ease-out ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <span className="block">Melvin</span>
              <span className="block text-foreground/50">Yogiana</span>
            </h1>

            {/* Divider */}
            <div
              className={`h-[2px] bg-gradient-to-r from-transparent via-foreground/50 to-transparent lg:from-foreground/50 lg:to-transparent transition-all duration-1000 ease-out delay-200 ${
                isLoaded ? 'opacity-100 w-24 sm:w-32' : 'opacity-0 w-0'
              }`}
            />

            {/* Subtitle */}
            <p
              className={`text-base sm:text-lg md:text-xl lg:text-2xl text-foreground/60 font-light tracking-wide transition-all duration-1000 ease-out delay-300 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Computer Science @ UNSW
            </p>

            {/* Description - hidden on very small screens */}
            <p
              className={`hidden sm:block text-sm sm:text-base text-foreground/40 max-w-md leading-relaxed transition-all duration-1000 ease-out delay-400 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              Passionate about building elegant solutions and exploring the intersection of technology and creativity.
            </p>

            {/* Social links */}
            <div
              className={`flex items-center gap-3 sm:gap-4 transition-all duration-1000 ease-out delay-500 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('mailto') ? undefined : '_blank'}
                  rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                  className="group p-2.5 sm:p-3 rounded-full border border-foreground/20 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:bg-foreground/10 hover:border-foreground/40 hover:scale-110 active:scale-95"
                >
                  <link.icon className="w-5 h-5 text-foreground/50 transition-all duration-300 group-hover:text-foreground" />
                  <span className="sr-only">{link.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Desktop ASCII Art - Right side */}
      <div className="hidden lg:block absolute right-0 top-0 w-[55%] h-full">
        <pre
          ref={asciiRef}
          className="absolute inset-0 font-mono text-[10px] leading-[10px] text-foreground/50 overflow-hidden pointer-events-none select-none m-0 p-0"
          style={{ letterSpacing: '0px' }}
        />

        {/* Gradient fade to left */}
        <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-background to-transparent pointer-events-none" />

        {/* Top/bottom fade */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background to-transparent pointer-events-none" />
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
          className="flex flex-col items-center gap-2 text-foreground/40 hover:text-foreground/70 transition-colors duration-300"
        >
          <span className="text-xs tracking-[0.2em] uppercase font-medium">Scroll</span>
          <ChevronDown className="w-5 h-5 animate-bounce" />
        </button>
      </div>

      {/* Corner accents */}
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8 w-10 h-10 sm:w-16 sm:h-16 border-l-2 border-t-2 border-foreground/15 pointer-events-none z-20" />
      <div className="absolute top-6 right-6 sm:top-8 sm:right-8 w-10 h-10 sm:w-16 sm:h-16 border-r-2 border-t-2 border-foreground/15 pointer-events-none z-20" />
      <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 w-10 h-10 sm:w-16 sm:h-16 border-l-2 border-b-2 border-foreground/15 pointer-events-none z-20" />
      <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8 w-10 h-10 sm:w-16 sm:h-16 border-r-2 border-b-2 border-foreground/15 pointer-events-none z-20" />
    </div>
  )
}

export default Hero
