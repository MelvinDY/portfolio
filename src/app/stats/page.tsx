import type { Metadata } from "next"
import StatsDashboard from "./stats-dashboard"

export const metadata: Metadata = {
  title: "Site Stats",
  description: "Live first-party analytics for this site.",
  // Excluded from the sitemap and disallowed in robots.ts — a live dashboard
  // is not a landing page, and indexing it would dilute the name query.
  robots: { index: false, follow: true },
}

export default function StatsPage() {
  return <StatsDashboard />
}
