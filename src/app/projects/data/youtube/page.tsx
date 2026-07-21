import type { Metadata } from "next"
import YouTubeCaseStudy from "./youtube-case-study"

export const metadata: Metadata = {
  title: "YouTube Trending Analysis",
  description:
    "How long does a video actually stay trending? A data analysis case study by Melvin Darial Yogiana measuring churn on the YouTube trending board and how short the window really is.",
  alternates: { canonical: "/projects/data/youtube" },
  openGraph: {
    title: "YouTube Trending Analysis — Melvin Darial Yogiana",
    description: "Measuring how quickly the YouTube trending board churns.",
    url: "/projects/data/youtube",
  },
}

export default function YouTubePage() {
  return <YouTubeCaseStudy />
}
