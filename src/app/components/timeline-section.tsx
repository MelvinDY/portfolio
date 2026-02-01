"use client"

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
      <div className="py-16 text-center">
        <div className="text-muted-foreground">
          <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-30" />
          <p className="text-lg font-medium">No work experience yet</p>
          <p className="text-sm mt-1">Currently focusing on education and personal projects</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Timeline Line */}
      <div className="absolute left-[23px] top-2 bottom-2 w-px bg-gradient-to-b from-border via-border to-transparent" />

      <div className="space-y-8">
        {items.map((item, index) => {
          const isWork = type === "work"
          const workItem = isWork ? item as WorkExperience : null
          const educationItem = !isWork ? item as Education : null

          return (
            <div
              key={item.id}
              className="relative flex gap-6 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Timeline Node */}
              <div className="relative flex-shrink-0 z-10">
                <div className="w-12 h-12 rounded-xl bg-background border border-border shadow-sm flex items-center justify-center overflow-hidden transition-all duration-300 group-hover:shadow-md group-hover:border-primary/30">
                  <Image
                    src={item.logo}
                    alt={isWork ? workItem!.company : educationItem!.institution}
                    width={28}
                    height={28}
                    className="object-contain transition-transform duration-300 group-hover:scale-110"
                    unoptimized={item.logo.endsWith('.svg')}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pb-2">
                {/* Header */}
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-2 mb-3">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-foreground leading-tight">
                      {isWork ? workItem!.role : educationItem!.degree}
                    </h3>
                    <p className="text-base text-muted-foreground">
                      {isWork ? workItem!.company : educationItem!.institution}
                    </p>
                  </div>

                  <div className="flex flex-wrap lg:flex-col lg:items-end gap-x-4 gap-y-1 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5" />
                      {item.period}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" />
                      {item.location}
                    </span>
                  </div>
                </div>

                {/* Achievements */}
                {item.achievements && item.achievements.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {item.achievements.map((achievement, achieveIndex) => (
                      <li
                        key={achieveIndex}
                        className="text-sm text-muted-foreground leading-relaxed pl-4 relative before:absolute before:left-0 before:top-[0.6em] before:w-1.5 before:h-1.5 before:rounded-full before:bg-primary/40"
                      >
                        {achievement}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Skills */}
                {isWork && workItem!.skills && workItem!.skills.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {workItem!.skills.map((skill) => (
                      <span
                        key={skill}
                        className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}

                {/* Links */}
                {item.links && item.links.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {item.links.map((link) => (
                      <Link key={link.label} href={link.url} target="_blank">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2.5 text-xs text-muted-foreground hover:text-primary"
                        >
                          <ExternalLink className="h-3 w-3 mr-1.5" />
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
  )
}
