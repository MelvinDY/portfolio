import type { Metadata } from "next"
import ProjectsIndex from "./projects-index"

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Software and data projects by Melvin Darial Yogiana — full-stack apps, hackathon builds, and analytics case studies in Power BI, SQL and Python.",
  alternates: { canonical: "/projects" },
  openGraph: {
    title: "Projects — Melvin Darial Yogiana",
    description: "Full-stack apps, hackathon builds, and analytics case studies.",
    url: "/projects",
  },
}

export default function ProjectsPage() {
  return <ProjectsIndex />
}
