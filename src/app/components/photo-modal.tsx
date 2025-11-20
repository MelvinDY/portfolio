"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, X } from "lucide-react"

interface PhotoModalProps {
  images: string[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  projectTitle: string
}

export default function PhotoModal({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  projectTitle
}: PhotoModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Reset index when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowLeft") {
        goToPrevious()
      } else if (e.key === "ArrowRight") {
        goToNext()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, currentIndex, images.length])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-50"
        aria-label="Close modal"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Content Container */}
      <div
        className="relative w-full h-full flex items-center justify-center p-4 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Container */}
        <div className="relative max-w-7xl w-full max-h-full">
          <div className="relative aspect-video w-full">
            <Image
              src={images[currentIndex]}
              alt={`${projectTitle} - Image ${currentIndex + 1}`}
              fill
              className="object-contain object-top"
              priority
            />
          </div>

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-0 md:-left-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-0 md:-right-16 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
              </button>
            </>
          )}

          {/* Image Info */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
            <p className="text-lg font-semibold">{projectTitle}</p>
            {images.length > 1 && (
              <p className="text-sm text-gray-300">
                Image {currentIndex + 1} of {images.length}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Thumbnail Navigation (Desktop) */}
      {images.length > 1 && (
        <div className="hidden md:flex absolute bottom-4 left-1/2 -translate-x-1/2 gap-2 max-w-4xl overflow-x-auto p-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`relative w-20 h-12 flex-shrink-0 rounded overflow-hidden border-2 transition-all ${
                index === currentIndex
                  ? "border-white scale-110"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Keyboard Hints */}
      <div className="hidden md:block absolute top-4 left-4 text-white/70 text-sm">
        <p>Press ESC to close</p>
        {images.length > 1 && <p>Use ← → arrow keys to navigate</p>}
      </div>
    </div>
  )
}
