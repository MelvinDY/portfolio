"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Github } from "lucide-react"
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
      <Card className="overflow-hidden cursor-pointer transition-transform hover:scale-[1.02]">
        <div onClick={handleCardClick}>
          <ProjectImageCarousel
            images={displayImages}
            alt={title}
            autoTransition={true}
            transitionInterval={3000}
          />
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-xl mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">{description}</p>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-muted px-2 py-1 text-xs font-medium ring-1 ring-inset ring-gray-500/10"
              >
                {tag}
              </span>
            ))}
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Link
            href={link}
            target="_blank"
            className="inline-flex items-center gap-2 text-sm hover:underline"
            onClick={(e) => e.stopPropagation()}
          >
            <Github className="h-4 w-4" />
            View on GitHub
          </Link>
        </CardFooter>
      </Card>

      <PhotoModal
        images={displayImages}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        projectTitle={title}
      />
    </>
  )
}