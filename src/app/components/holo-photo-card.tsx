"use client"

import { useRef, useCallback } from 'react'
import Image from 'next/image'

function clamp(val: number, min = 0, max = 100) {
  return Math.min(Math.max(val, min), max)
}

function round(val: number) {
  return Math.round(val * 100) / 100
}

function adjust(val: number, fromMin: number, fromMax: number, toMin: number, toMax: number) {
  return toMin + ((val - fromMin) / (fromMax - fromMin)) * (toMax - toMin)
}

export default function HoloPhotoCard() {
  const cardRef  = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const shineRef = useRef<HTMLDivElement>(null)
  const glareRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const card  = cardRef.current
    const inner = innerRef.current
    const shine = shineRef.current
    const glare = glareRef.current
    if (!card || !inner || !shine || !glare) return

    const rect = card.getBoundingClientRect()
    const x = clamp(round((100 / rect.width)  * (e.clientX - rect.left)))
    const y = clamp(round((100 / rect.height) * (e.clientY - rect.top)))
    const cx = x - 50
    const cy = y - 50

    inner.style.setProperty('--rotate-x', `${round(-(cx / 3.5))}deg`)
    inner.style.setProperty('--rotate-y', `${round(cy  / 3.5)}deg`)
    inner.style.transition = 'transform 0.08s ease'

    shine.style.backgroundPosition = `${round(adjust(x, 0, 100, 37, 63))}% ${round(adjust(y, 0, 100, 33, 67))}%`
    shine.style.opacity = '0.5'

    glare.style.setProperty('--pointer-x', `${x}%`)
    glare.style.setProperty('--pointer-y', `${y}%`)
    glare.style.opacity = '0.6'
  }, [])

  const handleMouseLeave = useCallback(() => {
    const inner = innerRef.current
    const shine = shineRef.current
    const glare = glareRef.current
    if (!inner || !shine || !glare) return

    inner.style.transition = 'transform 0.5s cubic-bezier(0.03, 0.98, 0.52, 0.99)'
    inner.style.setProperty('--rotate-x', '0deg')
    inner.style.setProperty('--rotate-y', '0deg')

    shine.style.opacity = '0'
    glare.style.opacity  = '0'
  }, [])

  return (
    <div
      ref={cardRef}
      className="holo-photo"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-reveal
      data-reveal-delay="2"
    >
      <div ref={innerRef} className="holo-photo__inner">
        <Image src="/melvin.jpg" alt="Melvin Yogiana" fill style={{ objectFit: 'cover' }} />
        <div ref={shineRef} className="holo-photo__shine" />
        <div ref={glareRef} className="holo-photo__glare" />
        <span className="photo-tag">Sydney, AU · 2026</span>
      </div>
    </div>
  )
}
