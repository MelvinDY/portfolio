"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Briefcase, GraduationCap, ArrowRight } from "lucide-react"
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

const workExperience: WorkExperience[] = [
  {
    id: "atlassian",
    company: "UNSW × Atlassian Client Project",
    role: "Software Developer",
    period: "Sep 2025 – Dec 2025",
    location: "Sydney, Australia",
    logo: "/atlassian.svg",
    achievements: [
      "Led development of enterprise Q&A system as top contributor (121 commits), delivering a secure real-time audience interaction platform for Atlassian town halls with controlled access and data integrity safeguards",
      "Designed and implemented 3-layer end-to-end testing infrastructure (API, integration, UI) with automated CI pipeline, establishing quality assurance controls to detect defects and ensure system reliability before production deployment",
      "Built backend services with SQL database schema design, implementing structured data validation and access controls across resolvers and API endpoints to ensure data consistency and prevent unauthorized operations",
      "Developed moderator dashboard with role-based permissions, question management with audit trail tracking, and session facilitation controls for corporate governance compliance"
    ],
    skills: ["TypeScript", "React", "GraphQL", "SQL", "CI/CD", "Testing"]
  },
  {
    id: "ppia",
    company: "PPIA UNSW – IT Team",
    role: "Frontend Lead",
    period: "Aug 2025 – Nov 2025",
    location: "Sydney, Australia",
    logo: "/ppia.png",
    achievements: [
      "Led a 10-person cross-functional team, establishing structured Agile governance with daily standups, weekly sprint reviews, and documented workflows that improved delivery predictability and reduced blockers",
      "Drove stakeholder alignment through bi-weekly demos with PPIA board members, translating user feedback into 15+ feature enhancements while ensuring compliance with organizational requirements",
      "Mentored 4 junior developers on code review processes, Git workflows, and development standards, improving overall code quality and adherence to team-defined best practices",
      "Architected component-based frontend system enabling parallel development by 3 sub-teams without integration conflicts, demonstrating structured change management principles"
    ],
    skills: ["React", "Next.js", "Agile", "Team Leadership", "Code Review"]
  }
]

const education: Education[] = [
  {
    id: "UNSW",
    institution: "University of New South Wales (UNSW)",
    degree: "Bachelor of Science in Computer Science | GPA: 3.00/4.00",
    period: "2023 – 2025",
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
  },
  {
    id: "UNSW-College",
    institution: "UNSW College",
    degree: "Diploma in Computer Science",
    period: "2022 – 2023",
    location: "Sydney, Australia",
    logo: "/UNSW.png",
    achievements: []
  }
]

export default function ExperienceSection() {
  const [activeTab, setActiveTab] = useState<"education" | "work">("education")

  return (
    <section className="min-h-screen flex items-center py-16 snap-start">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-3xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
              Background
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Experience
            </h2>
          </div>

          {/* Tab Switcher */}
          <div className="flex justify-center mb-10">
            <div className="inline-flex items-center p-1 rounded-full bg-muted/50 border border-border/50">
              <button
                onClick={() => setActiveTab("education")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === "education"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <GraduationCap className="h-4 w-4" />
                Education
              </button>
              <button
                onClick={() => setActiveTab("work")}
                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === "work"
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Briefcase className="h-4 w-4" />
                Work
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="min-h-[400px]">
            {activeTab === "work" && (
              <TimelineSection items={workExperience} type="work" />
            )}
            {activeTab === "education" && (
              <TimelineSection items={education} type="education" />
            )}
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 pt-8 border-t border-border/50">
            <p className="text-muted-foreground mb-5 text-sm">
              Interested in working together?
            </p>
            <Link href="/about">
              <Button variant="outline" className="group">
                Learn More About Me
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
