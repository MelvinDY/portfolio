"use client"

import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'

// Simple Button Component
const Button = ({ children, className = "", variant = "default", size = "default", ...props }: {
  children: React.ReactNode
  className?: string
  variant?: "default" | "outline"
  size?: "default" | "icon"
  onClick?: () => void
}) => {
  const baseStyles = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground"
  }
  const sizes = {
    default: "h-10 py-2 px-4",
    icon: "h-10 w-10"
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

// Icon Components
const Github = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
  </svg>
)

const Linkedin = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

const Mail = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 7.89a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
)

const Instagram = ({ className = "h-4 w-4" }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
)

// Three.js Hero Component
const ThreeJSHero = () => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const asciiRendererRef = useRef<HTMLDivElement>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const geometryRef = useRef<THREE.Group>()
  const mouseRef = useRef({ x: 0, y: 0 })
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    // Account for header height (4rem = 64px)
    const headerHeight = 64
    const containerHeight = window.innerHeight - headerHeight

    const camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / containerHeight,
      1,
      1000
    )
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, containerHeight)

    // ASCII Effect setup
    const asciiRenderer = document.createElement('div')
    asciiRenderer.style.position = 'absolute'
    asciiRenderer.style.top = '0'
    asciiRenderer.style.left = '0'
    asciiRenderer.style.width = '100%'
    asciiRenderer.style.height = '100%'
    asciiRenderer.style.color = 'white'
    asciiRenderer.style.fontFamily = 'Courier, monospace'

    // Calculate initial font size to fill the screen
    const targetCharsWidth = 180
    const initialFontSize = Math.max(6, Math.min(14, window.innerWidth / (targetCharsWidth * 0.6)))

    asciiRenderer.style.fontSize = initialFontSize + 'px'
    asciiRenderer.style.lineHeight = initialFontSize + 'px'
    asciiRenderer.style.whiteSpace = 'pre'
    asciiRenderer.style.pointerEvents = 'none'
    asciiRenderer.style.letterSpacing = '0'
    asciiRenderer.style.overflow = 'hidden'
    asciiRenderer.style.margin = '0'
    asciiRenderer.style.padding = '0'
    mountRef.current.appendChild(asciiRenderer)

    // Store refs
    sceneRef.current = scene
    rendererRef.current = renderer
    asciiRendererRef.current = asciiRenderer
    cameraRef.current = camera

    // ASCII characters (from darkest to lightest)
    const asciiChars = ' .:-=+*#%@'

    // ASCII rendering function
    const renderASCII = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !asciiRendererRef.current) return

      // Account for header height (4rem = 64px)
      const headerHeight = 64
      const containerHeight = window.innerHeight - headerHeight

      // Get the current font size
      const currentFontSize = parseFloat(asciiRendererRef.current.style.fontSize) || 12

      // Calculate number of characters needed to fill the screen
      const width = Math.floor(window.innerWidth / (currentFontSize * 0.6))
      const height = Math.floor(containerHeight / currentFontSize)

      // Render the 3D scene to get pixel data
      rendererRef.current.render(sceneRef.current, cameraRef.current)

      // Create a simplified ASCII pattern instead of reading pixels
      // This creates a dynamic pattern based on time and mouse position
      const time = Date.now() * 0.001
      let asciiString = ''

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Create wave patterns based on position and time
          const normalizedX = (x / width) * 2 - 1
          const normalizedY = (y / height) * 2 - 1

          // Calculate distance from center
          const distance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY)

          // Create animated waves
          const wave1 = Math.sin(distance * 8 + time * 2) * 0.5 + 0.5
          const wave2 = Math.sin(normalizedX * 10 + time) * 0.3 + 0.7
          const wave3 = Math.sin(normalizedY * 6 + time * 1.5) * 0.2 + 0.8

          // Mouse influence
          const mouseInfluence = Math.exp(-((normalizedX - mouseRef.current.x) ** 2 + (normalizedY - mouseRef.current.y) ** 2) * 2)

          // Combine all influences
          let intensity = (wave1 * wave2 * wave3 + mouseInfluence * 0.5) / 1.5

          // Add some geometric shapes based on 3D object positions
          const shapes = [
            { x: -0.4, y: 0.1, size: 0.2 },
            { x: 0.4, y: -0.1, size: 0.15 },
            { x: 0, y: 0.2, size: 0.18 },
            { x: -0.2, y: -0.2, size: 0.12 },
            { x: 0.3, y: 0.15, size: 0.1 }
          ]

          shapes.forEach(shape => {
            const shapeDist = Math.sqrt((normalizedX - shape.x) ** 2 + (normalizedY - shape.y) ** 2)
            if (shapeDist < shape.size) {
              intensity += (1 - shapeDist / shape.size) * 0.3
            }
          })

          // Clamp intensity
          intensity = Math.max(0, Math.min(1, intensity))

          // Map to ASCII character
          const charIndex = Math.floor(intensity * (asciiChars.length - 1))
          asciiString += asciiChars[charIndex] || ' '
        }
        asciiString += '\n'
      }

      asciiRendererRef.current.textContent = asciiString
    }

    // Create geometry group
    const geometryGroup = new THREE.Group()
    geometryRef.current = geometryGroup
    scene.add(geometryGroup)

    // Create multiple geometric objects for ASCII conversion
    const createGeometry = () => {
      // Torus Knot
      const torusKnotGeometry = new THREE.TorusKnotGeometry(2, 0.8, 100, 16)
      const torusKnotMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
      })
      const torusKnot = new THREE.Mesh(torusKnotGeometry, torusKnotMaterial)
      torusKnot.position.set(-8, 2, -5)
      geometryGroup.add(torusKnot)

      // Icosahedron
      const icosahedronGeometry = new THREE.IcosahedronGeometry(3, 0)
      const icosahedronMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
      })
      const icosahedron = new THREE.Mesh(icosahedronGeometry, icosahedronMaterial)
      icosahedron.position.set(8, -2, -8)
      geometryGroup.add(icosahedron)

      // Octahedron
      const octahedronGeometry = new THREE.OctahedronGeometry(2.5)
      const octahedronMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
      })
      const octahedron = new THREE.Mesh(octahedronGeometry, octahedronMaterial)
      octahedron.position.set(0, 4, -10)
      geometryGroup.add(octahedron)

      // Dodecahedron
      const dodecahedronGeometry = new THREE.DodecahedronGeometry(2)
      const dodecahedronMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
      })
      const dodecahedron = new THREE.Mesh(dodecahedronGeometry, dodecahedronMaterial)
      dodecahedron.position.set(-5, -4, -6)
      geometryGroup.add(dodecahedron)

      // Sphere
      const sphereGeometry = new THREE.SphereGeometry(1.5, 32, 32)
      const sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0xffffff
      })
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
      sphere.position.set(6, 3, -12)
      geometryGroup.add(sphere)
    }

    createGeometry()

    // Lighting for better ASCII conversion
    const ambientLight = new THREE.AmbientLight(0x404040, 0.4)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
    directionalLight.position.set(10, 10, 5)
    scene.add(directionalLight)

    const pointLight = new THREE.PointLight(0xffffff, 0.8, 100)
    pointLight.position.set(-10, -10, -10)
    scene.add(pointLight)

    // Camera position
    camera.position.z = 5

    // Mouse movement handler
    const handleMouseMove = (event: MouseEvent) => {
      mouseRef.current.x = (event.clientX / window.innerWidth) * 2 - 1
      mouseRef.current.y = -(event.clientY / window.innerHeight) * 2 + 1
    }

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)

      if (geometryRef.current) {
        // Rotate the entire group slowly
        geometryRef.current.rotation.y += 0.005
        geometryRef.current.rotation.x += 0.002

        // Individual object rotations
        geometryRef.current.children.forEach((child, index) => {
          if (child instanceof THREE.Mesh) {
            child.rotation.x += 0.01 + index * 0.002
            child.rotation.y += 0.01 + index * 0.001
            child.rotation.z += 0.005 + index * 0.001
          }
        })

        // Mouse interaction - move camera and objects slightly
        if (cameraRef.current) {
          cameraRef.current.position.x += (mouseRef.current.x * 2 - cameraRef.current.position.x) * 0.02
          cameraRef.current.position.y += (mouseRef.current.y * 2 - cameraRef.current.position.y) * 0.02
          cameraRef.current.lookAt(0, 0, 0)
        }

        // Move geometry group based on mouse
        geometryRef.current.rotation.y += mouseRef.current.x * 0.001
        geometryRef.current.rotation.x += mouseRef.current.y * 0.001
      }

      // Render ASCII
      renderASCII()
    }

    // Handle window resize
    const handleResize = () => {
      if (cameraRef.current && rendererRef.current && asciiRendererRef.current) {
        // Account for header height (4rem = 64px)
        const headerHeight = 64
        const containerHeight = window.innerHeight - headerHeight

        cameraRef.current.aspect = window.innerWidth / containerHeight
        cameraRef.current.updateProjectionMatrix()
        rendererRef.current.setSize(window.innerWidth, containerHeight)

        // Calculate optimal font size to fill the screen
        // Aim for about 150-200 characters wide for good detail
        const targetCharsWidth = 180
        const fontSize = Math.max(6, Math.min(14, window.innerWidth / (targetCharsWidth * 0.6)))

        asciiRendererRef.current.style.fontSize = fontSize + 'px'
        asciiRendererRef.current.style.lineHeight = fontSize + 'px'
      }
    }

    // Event listeners
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('resize', handleResize)

    // Start animation
    animate()
    setIsLoaded(true)

    // Initial resize to set font size
    handleResize()

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)

      if (mountRef.current && asciiRendererRef.current) {
        mountRef.current.removeChild(asciiRendererRef.current)
      }

      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [])

  return (
    <div className="relative h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-black snap-start">
      {/* Three.js Canvas */}
      <div
        ref={mountRef}
        className="absolute inset-0 z-10"
      />

      {/* Loading indicator */}
      {!isLoaded && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/80">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-white/70">Loading 3D Scene...</p>
          </div>
        </div>
      )}

      {/* Hero Content */}
      <div className="relative z-30 max-w-6xl mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-8 text-center">
          <div className="space-y-6">
            <h1 className="text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl lg:text-9xl">
              <span
                className="text-white inline-block animate-fade-in-up"
                style={{
                  animation: 'fadeInUp 1.2s ease-out forwards',
                  animationDelay: '0.3s',
                  opacity: 0
                }}
              >
                Melvin Darial Yogiana
              </span>
            </h1>
            <p className="mx-auto max-w-[800px] text-2xl md:text-3xl lg:text-4xl text-white/90 backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 inline-block animate-fade-in-up"
               style={{
                 animation: 'fadeInUp 1.2s ease-out forwards',
                 animationDelay: '0.8s',
                 opacity: 0
               }}>
              Computer Science @ UNSW
            </p>
          </div>

          {/* Social Links */}
          <div className="flex space-x-6 backdrop-blur-sm bg-white/5 rounded-xl p-6 border border-white/10 animate-fade-in-up"
               style={{
                 animation: 'fadeInUp 1.2s ease-out forwards',
                 animationDelay: '1.3s',
                 opacity: 0
               }}>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer"
               className="transform transition-all duration-300 hover:scale-110 hover:-translate-y-2">
              <Button
                variant="outline"
                size="icon"
                className="w-14 h-14 backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-white/25"
              >
                <Github className="h-6 w-6" />
                <span className="sr-only">GitHub</span>
              </Button>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"
               className="transform transition-all duration-300 hover:scale-110 hover:-translate-y-2">
              <Button
                variant="outline"
                size="icon"
                className="w-14 h-14 backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-white/25"
              >
                <Linkedin className="h-6 w-6" />
                <span className="sr-only">LinkedIn</span>
              </Button>
            </a>
            <a href="https://instagram.com/your-pet-instagram" target="_blank" rel="noopener noreferrer"
               className="transform transition-all duration-300 hover:scale-110 hover:-translate-y-2">
              <Button
                variant="outline"
                size="icon"
                className="w-14 h-14 backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-white/25"
              >
                <Instagram className="h-6 w-6" />
                <span className="sr-only">Pet Support</span>
              </Button>
            </a>
            <a
              href="mailto:melvindarialyogiana@gmail.com"
              title="Send email to melvindarialyogiana@gmail.com"
              className="transform transition-all duration-300 hover:scale-110 hover:-translate-y-2"
            >
              <Button
                variant="outline"
                size="icon"
                className="w-14 h-14 backdrop-blur-sm bg-white/10 hover:bg-white/20 border-white/20 text-white hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-white/25"
              >
                <Mail className="h-6 w-6" />
                <span className="sr-only">Email</span>
              </Button>
            </a>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute left-1/2 transform -translate-x-1/2 animate-bounce"
               style={{
                 bottom: '-3rem',
                 animation: 'bounce 2s infinite, fadeInUp 1.2s ease-out forwards',
                 animationDelay: '2s',
                 opacity: 0
               }}>
            <div className="w-8 h-12 border-2 border-white/40 rounded-full backdrop-blur-sm bg-white/10 transition-all duration-300 hover:border-white/60 hover:bg-white/20">
              <div className="w-1.5 h-4 bg-white/70 rounded-full mx-auto mt-2 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/20 via-transparent to-black/40 pointer-events-none"></div>

      {/* Add CSS keyframes */}
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(50px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%, 20%, 53%, 80%, 100% {
            transform: translate3d(0,0,0);
          }
          40%, 43% {
            transform: translate3d(0,-30px,0);
          }
          70% {
            transform: translate3d(0,-15px,0);
          }
          90% {
            transform: translate3d(0,-4px,0);
          }
        }
      `}</style>
    </div>
  )
}

export default ThreeJSHero
