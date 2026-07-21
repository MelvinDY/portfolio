import type { Metadata } from "next"
import SaaSCaseStudy from "./saas-case-study"

export const metadata: Metadata = {
  title: "SaaS Metrics & Churn Analysis",
  description:
    "A SaaS analytics case study by Melvin Darial Yogiana — computing MRR, retention and churn from raw invoice data instead of asserting them, to find what churns underneath the growth curve.",
  alternates: { canonical: "/projects/data/saas" },
  openGraph: {
    title: "SaaS Metrics & Churn Analysis — Melvin Darial Yogiana",
    description: "Computing MRR, retention and churn from raw invoices.",
    url: "/projects/data/saas",
  },
}

export default function SaaSPage() {
  return <SaaSCaseStudy />
}
