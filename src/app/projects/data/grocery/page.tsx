import type { Metadata } from "next"
import GroceryCaseStudy from "./grocery-case-study"

export const metadata: Metadata = {
  title: "Grocery Price Analysis",
  description:
    "Is Woolworths actually cheaper than Coles? A data analysis case study by Melvin Darial Yogiana matching Australian supermarket products to compare real basket prices.",
  alternates: { canonical: "/projects/data/grocery" },
  openGraph: {
    title: "Grocery Price Analysis — Melvin Darial Yogiana",
    description: "Matching Australian supermarket products to compare real basket prices.",
    url: "/projects/data/grocery",
  },
}

export default function GroceryPage() {
  return <GroceryCaseStudy />
}
