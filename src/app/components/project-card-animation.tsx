"use client"

import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ProjectCardAnimationProps {
  className?: string
}

const ProjectCardAnimation: React.FC<ProjectCardAnimationProps> = ({ className = "" }) => {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | undefined>(undefined)
  const rendererRef = useRef<THREE.WebGLRenderer | undefined>(undefined)
  const asciiRendererRef = useRef<HTMLDivElement | undefined>(undefined)
  const cameraRef = useRef<THREE.PerspectiveCamera | undefined>(undefined)
  const particlesRef = useRef<THREE.Points | undefined>(undefined)

  useEffect(() => {
    if (!mountRef.current) return

    // Scene setup
    const scene = new THREE.Scene()

    const containerWidth = mountRef.current.clientWidth
    const containerHeight = mountRef.current.clientHeight

    const camera = new THREE.PerspectiveCamera(
      75,
      containerWidth / containerHeight,
      0.1,
      1000
    )
    const renderer = new THREE.WebGLRenderer({ alpha: true })
    renderer.setSize(containerWidth, containerHeight)

    // ASCII Effect setup
    const asciiRenderer = document.createElement('div')
    asciiRenderer.style.position = 'absolute'
    asciiRenderer.style.top = '0'
    asciiRenderer.style.left = '0'
    asciiRenderer.style.width = '100%'
    asciiRenderer.style.height = '100%'
    asciiRenderer.style.color = 'currentColor'
    asciiRenderer.style.fontFamily = 'Courier, monospace'
    asciiRenderer.style.fontSize = '8px'
    asciiRenderer.style.lineHeight = '8px'
    asciiRenderer.style.whiteSpace = 'pre'
    asciiRenderer.style.pointerEvents = 'none'
    asciiRenderer.style.letterSpacing = '0'
    asciiRenderer.style.overflow = 'hidden'
    asciiRenderer.style.margin = '0'
    asciiRenderer.style.padding = '0'
    asciiRenderer.style.display = 'flex'
    asciiRenderer.style.alignItems = 'center'
    asciiRenderer.style.justifyContent = 'center'
    mountRef.current.appendChild(asciiRenderer)

    // Store refs
    sceneRef.current = scene
    rendererRef.current = renderer
    asciiRendererRef.current = asciiRenderer
    cameraRef.current = camera

    // ASCII characters (from dark to light) - will appear light in light mode, dark in dark mode
    const asciiChars = ' ░▒▓█'

    // Create particle system with different geometry
    const particleCount = 800
    const positions = new Float32Array(particleCount * 3)
    const velocities = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Create particles in a spiral/vortex pattern
      const angle = (i / 3) * 0.5
      const radius = 5 + Math.random() * 3

      positions[i] = Math.cos(angle) * radius
      positions[i + 1] = (Math.random() - 0.5) * 10
      positions[i + 2] = Math.sin(angle) * radius

      // Initial velocities for spiral motion
      velocities[i] = Math.random() * 0.02 - 0.01
      velocities[i + 1] = Math.random() * 0.02 - 0.01
      velocities[i + 2] = Math.random() * 0.02 - 0.01
    }

    const geometry = new THREE.BufferGeometry()
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.1,
    })

    const particles = new THREE.Points(geometry, material)
    particlesRef.current = particles
    scene.add(particles)

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1)
    scene.add(ambientLight)

    const pointLight = new THREE.PointLight(0xffffff, 1, 100)
    pointLight.position.set(0, 0, 10)
    scene.add(pointLight)

    // Camera position
    camera.position.z = 15

    // ASCII rendering function
    const renderASCII = () => {
      if (!rendererRef.current || !sceneRef.current || !cameraRef.current || !asciiRendererRef.current) return

      const width = Math.floor(containerWidth / (8 * 0.6))
      const height = Math.floor(containerHeight / 8)

      // Render the 3D scene
      rendererRef.current.render(sceneRef.current, cameraRef.current)

      // Create ASCII pattern with different motion
      const time = Date.now() * 0.001
      let asciiString = ''

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const normalizedX = (x / width) * 2 - 1
          const normalizedY = (y / height) * 2 - 1

          // Create spiral patterns (different from hero)
          const distance = Math.sqrt(normalizedX * normalizedX + normalizedY * normalizedY)
          const angle = Math.atan2(normalizedY, normalizedX)

          // Spiraling waves
          const spiral = Math.sin(distance * 12 - time * 3 + angle * 4) * 0.5 + 0.5
          const ripple = Math.sin(distance * 8 - time * 2) * 0.3 + 0.5

          // Rotating pattern
          const rotation = Math.sin(angle * 6 + time * 1.5) * 0.2 + 0.5

          // Combine patterns
          let intensity = (spiral * 0.5 + ripple * 0.3 + rotation * 0.2)

          // Add center glow
          const centerGlow = Math.exp(-distance * 2) * 0.3
          intensity += centerGlow

          // Clamp intensity
          intensity = Math.max(0, Math.min(1, intensity))

          // Invert intensity so bright areas = spaces (light) and dark areas = solid (dark)
          intensity = 1 - intensity

          // Map to ASCII character
          const charIndex = Math.floor(intensity * (asciiChars.length - 1))
          asciiString += asciiChars[charIndex] || ' '
        }
        asciiString += '\n'
      }

      asciiRendererRef.current.textContent = asciiString
    }

    // Animation loop - different rotation pattern from hero
    const animate = () => {
      requestAnimationFrame(animate)

      if (particlesRef.current) {
        // Spiral rotation (different from hero's slow rotation)
        particlesRef.current.rotation.y += 0.008
        particlesRef.current.rotation.x += 0.004
        particlesRef.current.rotation.z += 0.003

        // Update particle positions for vortex effect
        const positions = particlesRef.current.geometry.attributes.position.array as Float32Array
        const time = Date.now() * 0.001

        for (let i = 0; i < positions.length; i += 3) {
          const angle = time * 0.5 + i * 0.01
          const radius = 5 + Math.sin(time + i * 0.1) * 2

          positions[i] = Math.cos(angle) * radius
          positions[i + 2] = Math.sin(angle) * radius
          positions[i + 1] = Math.sin(time * 2 + i * 0.05) * 3
        }

        particlesRef.current.geometry.attributes.position.needsUpdate = true
      }

      // Render ASCII
      renderASCII()
    }

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current || !cameraRef.current || !rendererRef.current) return

      const newWidth = mountRef.current.clientWidth
      const newHeight = mountRef.current.clientHeight

      cameraRef.current.aspect = newWidth / newHeight
      cameraRef.current.updateProjectionMatrix()
      rendererRef.current.setSize(newWidth, newHeight)
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(mountRef.current)

    // Start animation
    animate()

    // Cleanup
    return () => {
      resizeObserver.disconnect()

      if (mountRef.current && asciiRendererRef.current) {
        mountRef.current.removeChild(asciiRendererRef.current)
      }

      if (rendererRef.current) {
        rendererRef.current.dispose()
      }

      if (particlesRef.current) {
        particlesRef.current.geometry.dispose()
        if (particlesRef.current.material instanceof THREE.Material) {
          particlesRef.current.material.dispose()
        }
      }
    }
  }, [])

  return (
    <div
      ref={mountRef}
      className={`relative aspect-video w-full overflow-hidden bg-muted/30 ${className}`}
    />
  )
}

export default ProjectCardAnimation
