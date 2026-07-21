import type { Metadata } from "next"
import SoftwareProjects from "./software-projects"

export const metadata: Metadata = {
  title: "Software Projects",
  description:
    "Full-stack software built by Melvin Darial Yogiana — React, Next.js and TypeScript apps, hackathon projects, and team builds shipped under deadline.",
  alternates: { canonical: "/projects/software" },
  openGraph: {
    title: "Software Projects — Melvin Darial Yogiana",
    description: "React, Next.js and TypeScript apps, hackathon projects, and team builds.",
    url: "/projects/software",
  },
}

export default function SoftwareProjectsPage() {
  return <SoftwareProjects />
}
