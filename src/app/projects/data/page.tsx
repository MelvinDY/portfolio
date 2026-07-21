import type { Metadata } from "next"
import DataProjects from "./data-projects"

export const metadata: Metadata = {
  title: "Data Projects",
  description:
    "Data analytics case studies by Melvin Darial Yogiana — Australian labour market dashboards, grocery price analysis, SaaS metrics and YouTube audience data, built with Power BI, SQL and Python.",
  alternates: { canonical: "/projects/data" },
  openGraph: {
    title: "Data Projects — Melvin Darial Yogiana",
    description: "Analytics case studies in Power BI, SQL and Python.",
    url: "/projects/data",
  },
}

export default function DataProjectsPage() {
  return <DataProjects />
}
