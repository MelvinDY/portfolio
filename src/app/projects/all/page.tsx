import type { Metadata } from "next"
import AllProjects from "./all-projects"

export const metadata: Metadata = {
  title: "All Projects",
  description:
    "The complete index of Melvin Darial Yogiana's work, spanning data analyses and software builds, from ABS labour-market pipelines to award-winning hackathon projects.",
  alternates: { canonical: "/projects/all" },
  openGraph: {
    title: "All Projects, Melvin Darial Yogiana",
    description: "Every data analysis and software build in one index.",
    url: "/projects/all",
  },
}

export default function AllProjectsRoute() {
  return <AllProjects />
}
