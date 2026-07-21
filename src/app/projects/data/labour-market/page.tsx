import type { Metadata } from "next"
import LabourMarketCaseStudy from "./labour-market-case-study"

export const metadata: Metadata = {
  title: "Australian Labour Market Dashboard",
  description:
    "A Power BI dashboard on ABS labour force data by Melvin Darial Yogiana — going past the headline unemployment rate to underemployment, hours worked, and state-by-state detail.",
  alternates: { canonical: "/projects/data/labour-market" },
  openGraph: {
    title: "Australian Labour Market Dashboard — Melvin Darial Yogiana",
    description: "Power BI analysis of ABS labour force data, past the headline rate.",
    url: "/projects/data/labour-market",
  },
}

export default function LabourMarketPage() {
  return <LabourMarketCaseStudy />
}
