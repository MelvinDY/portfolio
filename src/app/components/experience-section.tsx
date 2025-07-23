import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, MapPin, Calendar } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Experience data based on the resume images
const workExperience = [
  {
    id: "dbs-graduate",
    company: "DBS Bank",
    role: "Graduate Associate (SEED Programme)",
    period: "Jul 2023 - Present",
    location: "Singapore",
    logo: "/dbs-logo.png", // You'll need to add this image
    achievements: [
      "Developed the Java backend for a bank account servicing process with multiple channel integrations using Activiti workflow",
      "Built a custom database migration tool using Python and MariaDB and facilitated the migration of 1000+ processes from a vendor platform"
    ],
    skills: ["Java", "Python", "MariaDB", "Activiti", "Backend Development"]
  },
  {
    id: "sit-contract", 
    company: "Singapore Institute of Technology",
    role: "Software Developer (Contract)",
    period: "Apr 2023 - Jun 2023",
    location: "Singapore",
    logo: "/sit-logo.png",
    achievements: [
      "Built NFTVue, a NFT gallery website that allows students to connect their crypto wallets to view and verify their school event-issued NFTs",
      "Worked on DemoConstruct, a full-stack web application (React + Python) that uses Meshroom to reconstruct 3D models from captured images"
    ],
    skills: ["React", "Python", "NFT", "3D Modeling", "Web3"],
    links: [
      { label: "NFTVue", url: "https://nftvue.example.com" }
    ]
  },
  {
    id: "dbs-intern",
    company: "DBS Bank", 
    role: "Software Developer (Intern)",
    period: "May 2022 - Dec 2022",
    location: "Singapore",
    logo: "/dbs-logo.png",
    achievements: [
      "Worked on the backend for the digital exchange and asset custody application using Spring Boot and Java",
      "Built an admin dashboard web application for a DBS Metaverse event using Spring Security and Angular"
    ],
    skills: ["Java", "Spring Boot", "Angular", "Spring Security"]
  },
  {
    id: "activate-interactive",
    company: "Activate Interactive Pte Ltd",
    role: "Software Developer (Intern)", 
    period: "May 2019 - Aug 2019",
    location: "Singapore",
    logo: "/activate-logo.png",
    achievements: [
      "Developed RP Connect, the iOS and Android mobile app for Republic Polytechnic using React Native"
    ],
    skills: ["React Native", "iOS", "Android", "Mobile Development"]
  }
]

const education = [
  {
    id: "digipen",
    institution: "Digipen Institute of Technology Singapore",
    degree: "BS in Computer Science in Real-Time Interactive Simulation",
    period: "Sep 2019 - Apr 2023",
    location: "Singapore",
    logo: "/digipen-logo.png",
    achievements: [
      "Graduated with a Minor in Mathematics",
      "President of Digipen Student Management Committee for freshman year", 
      "3-time recipient of the Dean's Honor List"
    ],
    links: [
      { label: "Final Year Project", url: "#" },
      { label: "2nd Year Project", url: "#" }
    ]
  },
  {
    id: "singapore-poly",
    institution: "Singapore Polytechnic",
    degree: "Diploma in Games Design and Development",
    period: "Apr 2014 - May 2017",
    location: "Singapore", 
    logo: "/sp-logo.png",
    achievements: []
  }
]

interface ExperienceItemProps {
  item: typeof workExperience[0] | typeof education[0]
  type: "work" | "education"
}

function ExperienceItem({ item, type }: ExperienceItemProps) {
  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center overflow-hidden">
            {/* Placeholder for company/institution logo */}
            <div className="w-8 h-8 bg-primary/20 rounded"></div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                {type === "work" ? (item as any).role : (item as any).degree}
              </h3>
              <p className="text-primary font-medium">
                {type === "work" ? (item as any).company : (item as any).institution}
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
            <div className="mb-4">
              <ul className="space-y-2">
                {item.achievements.map((achievement, index) => (
                  <li key={index} className="text-muted-foreground leading-relaxed flex items-start gap-2">
                    <span className="text-primary mt-2 text-xs">•</span>
                    <span>{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Skills */}
          {type === "work" && (item as any).skills && (item as any).skills.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {(item as any).skills.map((skill: string) => (
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
    </Card>
  )
}

export default function ExperienceSection() {
  return (
    <section className="py-12 md:py-24 lg:py-32 bg-muted/20">
      <div className="container mx-auto px-4 md:px-6">
        <div className="max-w-4xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
              Experience
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              My journey as a developer, from internships to full-time roles, 
              building experiences across fintech, education, and mobile platforms.
            </p>
          </div>

          {/* Work Experience */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="bg-primary w-12 h-8 rounded-md flex items-center justify-center mr-4">
                <span className="text-primary-foreground font-semibold text-sm">Work</span>
              </div>
              <h3 className="text-2xl font-semibold">Professional Experience</h3>
            </div>
            
            <div className="space-y-6">
              {workExperience.map((job) => (
                <ExperienceItem key={job.id} item={job} type="work" />
              ))}
            </div>
          </div>

          {/* Education */}
          <div>
            <div className="flex items-center mb-8">
              <div className="bg-muted-foreground w-12 h-8 rounded-md flex items-center justify-center mr-4">
                <span className="text-background font-semibold text-sm">Education</span>
              </div>
              <h3 className="text-2xl font-semibold">Education</h3>
            </div>
            
            <div className="space-y-6">
              {education.map((edu) => (
                <ExperienceItem key={edu.id} item={edu} type="education" />
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12 pt-8 border-t">
            <p className="text-muted-foreground mb-4">
              Want to know more about my work or discuss opportunities?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/about">
                <Button variant="outline">
                  Learn More About Me
                </Button>
              </Link>
              <Link href="#contact">
                <Button>
                  Get In Touch
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}