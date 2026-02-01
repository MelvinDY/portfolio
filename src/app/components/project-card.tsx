"use client"

import { Github, ExternalLink } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import ProjectImageCarousel from "./project-image-carousel"
import PhotoModal from "./photo-modal"

interface ProjectCardProps {
  title: string
  description: string
  image: string
  images?: string[]
  link: string
  tags: string[]
}

export default function ProjectCard({ title, description, image, images, link, tags }: ProjectCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Use images array if provided, otherwise fall back to single image
  const displayImages = images && images.length > 0 ? images : [image]

  // Check if there are real images (not placeholders)
  const hasRealImages = displayImages.length > 0 && !displayImages.every(img =>
    img.includes('placeholder.svg') || img.includes('placeholder.png')
  )

  const handleCardClick = () => {
    // Only open modal if there are real images
    if (hasRealImages) {
      setIsModalOpen(true)
    }
  }

  return (
    <>
      <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-white/10 shadow-lg transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-1">
        {/* Gradient overlay for glass effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

        {/* Image container */}
        <div
          onClick={handleCardClick}
          className="relative overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10 pointer-events-none" />
          <ProjectImageCarousel
            images={displayImages}
            alt={title}
            autoTransition={true}
            transitionInterval={3000}
          />
        </div>

        {/* Content */}
        <div className="relative p-5 space-y-4">
          {/* Title */}
          <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
            {description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5">
            {tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-primary/10 backdrop-blur-sm px-2.5 py-0.5 text-xs font-medium text-primary/80 border border-primary/10 transition-colors hover:bg-primary/20 hover:text-primary"
              >
                {tag}
              </span>
            ))}
            {tags.length > 5 && (
              <span className="inline-flex items-center px-2 py-0.5 text-xs text-muted-foreground">
                +{tags.length - 5}
              </span>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* Footer */}
          <div className="flex items-center justify-between">
            <Link
              href={link}
              target="_blank"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group/link"
              onClick={(e) => e.stopPropagation()}
            >
              <Github className="h-4 w-4" />
              <span>Source</span>
              <ExternalLink className="h-3 w-3 opacity-0 -translate-x-2 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200" />
            </Link>

            {hasRealImages && (
              <button
                onClick={handleCardClick}
                className="text-xs text-muted-foreground hover:text-primary transition-colors"
              >
                View Gallery
              </button>
            )}
          </div>
        </div>

        {/* Bottom gradient accent */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <PhotoModal
        images={displayImages}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectTitle={title}
      />
    </>
  )
}
