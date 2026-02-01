"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface ProjectImageCarouselProps {
  images: string[]
  alt: string
  autoTransition?: boolean
  transitionInterval?: number
}

export default function ProjectImageCarousel({
  images,
  alt,
  autoTransition = true,
  transitionInterval = 3000
}: ProjectImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isHovering, setIsHovering] = useState(false)

  // Check if images are placeholder/missing
  const hasRealImages = images.length > 0 && !images.every(img =>
    img.includes('placeholder.svg') || img.includes('placeholder.png')
  )

  // Auto-transition effect
  useEffect(() => {
    if (!autoTransition || images.length <= 1 || isHovering) return

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, transitionInterval)

    return () => clearInterval(interval)
  }, [autoTransition, images.length, transitionInterval, isHovering])

  const goToPrevious = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const goToImage = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setCurrentIndex(index)
  }

  // If no real images, show simple placeholder
  if (!hasRealImages) {
    return (
      <div className="relative aspect-video w-full overflow-hidden bg-gradient-to-br from-muted/50 to-muted/30 flex items-center justify-center">
        <div className="text-muted-foreground/50 text-sm font-medium">No preview available</div>
      </div>
    )
  }

  // If only one image, render it without navigation controls
  if (images.length === 1) {
    return (
      <div className="relative aspect-video w-full overflow-hidden">
        <Image
          src={images[0]}
          alt={alt}
          fill
          className="object-cover object-top"
        />
      </div>
    )
  }

  return (
    <div
      className="relative aspect-video w-full overflow-hidden group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {/* Main Image */}
      <Image
        src={images[currentIndex]}
        alt={`${alt} - Image ${currentIndex + 1}`}
        fill
        className="object-cover object-top transition-opacity duration-300"
      />

      {/* Navigation Arrows */}
      {images.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
            aria-label="Next image"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {/* Dot Indicators */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={(e) => goToImage(index, e)}
              className={`w-2 h-2 rounded-full transition-all duration-200 ${
                index === currentIndex
                  ? "bg-white w-6"
                  : "bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to image ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  )
}
