import { FULL_NAME, JOB_TITLE, SAME_AS, SHORT_NAME, SITE_URL, TAGLINE } from "../lib/site"

/**
 * Structured data for the homepage.
 *
 * This is the highest-leverage markup on the site for a personal-name query:
 * it declares the legal name, ties it to the profiles that already rank via
 * `sameAs`, and gives Google an entity to attach the domain to rather than
 * a loose bag of pages.
 */
export default function PersonJsonLd() {
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: FULL_NAME,
    alternateName: [SHORT_NAME, "Melvin"],
    url: SITE_URL,
    image: `${SITE_URL}/melvin.jpg`,
    jobTitle: JOB_TITLE,
    description: TAGLINE,
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "University of New South Wales",
      sameAs: "https://www.unsw.edu.au/",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Sydney",
      addressRegion: "NSW",
      addressCountry: "AU",
    },
    knowsAbout: [
      "Data Analysis",
      "Data Engineering",
      "Full-Stack Development",
      "Power BI",
      "SQL",
      "Python",
      "TypeScript",
      "React",
      "Next.js",
    ],
    sameAs: SAME_AS,
  }

  const graph = {
    "@context": "https://schema.org",
    "@graph": [
      person,
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: `${FULL_NAME} — Portfolio`,
        description: TAGLINE,
        publisher: { "@id": `${SITE_URL}/#person` },
        inLanguage: "en-AU",
      },
      {
        "@type": "ProfilePage",
        "@id": `${SITE_URL}/#profilepage`,
        url: SITE_URL,
        name: `${FULL_NAME} — ${JOB_TITLE}`,
        about: { "@id": `${SITE_URL}/#person` },
        isPartOf: { "@id": `${SITE_URL}/#website` },
        inLanguage: "en-AU",
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      // Values are our own constants, not user input — no injection surface.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
    />
  )
}
