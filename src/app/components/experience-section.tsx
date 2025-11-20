"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, GraduationCap } from "lucide-react"
import React, { useState } from "react"
import TimelineSection from "./timeline-section"

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

const workExperience: WorkExperience[] = []

const education: Education[] = [
  {
    id: "UNSW",
    institution: "University of New South Wales",
    degree: "Bachelor of Science in Computer Science",
    period: "Dec 2023 - Dec 2025",
    location: "Sydney, Australia",
    logo: "/UNSW.png",
    achievements: [
      "First Place winner of 2025 CSESoc Flagship Hackathon",
    ],
    links: [
      {
        label: "View Hackathon Project",
        url: "https://onlycode.tech"
      }
    ]
  }
]

export default function ExperienceSection() {
  const [activeTab, setActiveTab] = useState<"education" | "work">("education")

  return (
    <section className="min-h-screen bg-muted/20 flex items-center py-12 snap-start">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-3">
              Experience
            </h2>

            {/* Toggle Buttons */}
            <div className="flex justify-center gap-2 p-1 bg-muted rounded-lg inline-flex">
              <Button
                variant={activeTab === "education" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("education")}
                className="flex items-center gap-2"
              >
                <GraduationCap className="h-4 w-4" />
                Education
              </Button>
              <Button
                variant={activeTab === "work" ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab("work")}
                className="flex items-center gap-2"
              >
                <Briefcase className="h-4 w-4" />
                Work Experience
              </Button>
            </div>
          </div>

          {/* Content Based on Active Tab */}
          <div>
            {activeTab === "work" && (
              <TimelineSection items={workExperience} type="work" />
            )}
            {activeTab === "education" && (
              <TimelineSection items={education} type="education" />
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-6 pt-6 border-t">
            <p className="text-muted-foreground mb-4">
              Want to know more about my work or discuss opportunities?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about">
                <Button variant="outline">
                  Learn More About Me
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
