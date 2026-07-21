import type { Metadata } from "next"
import AboutTE from "./about-te"

export const metadata: Metadata = {
  title: "About",
  description:
    "About Melvin Darial Yogiana — an Indonesian Computer Science student at UNSW Sydney, working as both a data analyst and a full-stack developer. Hackathon winner, UNIHACK 2026, and tech lead at PPIA UNSW.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About — Melvin Darial Yogiana",
    description:
      "An Indonesian Computer Science student at UNSW Sydney — equal parts data analyst and full-stack developer.",
    url: "/about",
  },
}

export default function AboutPage() {
  return <AboutTE />
}
