"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { ExternalLink, MapPin, Calendar, Briefcase } from "lucide-react"

interface WorkExperience {
  id: string
  company: string
  role: string
  period: string
  location: string
  logo: string
  achievements: string[]
  skills: string[]
  links?: { label: string; url: string }[]
}

interface Education {
  id: string
  institution: string
  degree: string
  period: string
  location: string
  logo: string
  achievements: string[]
  links?: { label: string; url: string }[]
}

export default function TimelineSection({ items, type }: { items: WorkExperience[] | Education[], type: "work" | "education" }) {
  if (items.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg">No work experience yet</p>
          <p className="text-sm">Currently focusing on education and personal projects</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="relative">
        {/* Vertical Timeline Line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border"></div>

        <div className="space-y-4">
          {items.map((item) => {
            const isWork = type === "work"
            const workItem = isWork ? item as WorkExperience : null
            const educationItem = !isWork ? item as Education : null

            return (
              <div key={item.id} className="relative flex gap-6">
                {/* Timeline Dot and Logo */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 bg-background border-2 border-border rounded-lg flex items-center justify-center overflow-hidden">
                    <Image
                      src={item.logo}
                      alt={isWork ? workItem!.company : educationItem!.institution}
                      width={32}
                      height={32}
                      className="object-contain"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const fallback = target.nextElementSibling as HTMLElement;
                        if (fallback) fallback.style.display = 'block';
                      }}
                    />
                    <div className="w-8 h-8 bg-primary/20 rounded hidden"></div>
                  </div>
                  {/* Timeline connector dot */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0 pb-4">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">
                        {isWork ? workItem!.role : educationItem!.degree}
                      </h3>
                      <p className="text-primary font-medium">
                        {isWork ? workItem!.company : educationItem!.institution}
                      </p>
                    </div>

                    <div className="flex flex-col lg:items-end gap-1 mt-2 lg:mt-0">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {item.period}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {item.location}
                      </div>
                    </div>
                  </div>

                  {/* Achievements */}
                  {item.achievements && item.achievements.length > 0 && (
                    <div className="mb-2">
                      <ul className="space-y-1">
                        {item.achievements.map((achievement, achieveIndex) => (
                          <li key={achieveIndex} className="text-muted-foreground leading-relaxed flex items-start gap-2">
                            <span className="text-primary mt-2 text-xs">•</span>
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Skills */}
                  {isWork && workItem!.skills && workItem!.skills.length > 0 && (
                    <div className="mb-2">
                      <div className="flex flex-wrap gap-2">
                        {workItem!.skills.map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center rounded-md bg-primary/10 px-2 py-1 text-xs font-medium text-primary ring-1 ring-inset ring-primary/20"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {item.links && item.links.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {item.links.map((link) => (
                        <Link key={link.label} href={link.url} target="_blank">
                          <Button variant="ghost" size="sm" className="h-8 px-3">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            {link.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </Card>
  )
}
