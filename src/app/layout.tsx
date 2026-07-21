import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Space_Grotesk, Newsreader } from "next/font/google"
import "./globals.css"
import type React from "react"
import AiChatbox from "./components/ai-chatbox"
import UtmBanner from "./components/utm-banner"
import AnalyticsTracker from "./components/analytics-tracker"
import PersonJsonLd from "./components/person-jsonld"
import { FULL_NAME, JOB_TITLE, SHORT_NAME, SITE_URL, TAGLINE } from "./lib/site"

const inter = Inter({ subsets: ["latin"] })
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500", "600"],
})
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
})
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
  weight: ["300", "400", "500"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // The homepage sets the exact legal name; every other page appends it, so
    // the full name appears in every SERP title on the site.
    default: `${FULL_NAME} — ${JOB_TITLE}`,
    template: `%s — ${FULL_NAME}`,
  },
  description: TAGLINE,
  applicationName: `${FULL_NAME} — Portfolio`,
  authors: [{ name: FULL_NAME, url: SITE_URL }],
  creator: FULL_NAME,
  publisher: FULL_NAME,
  keywords: [
    FULL_NAME,
    SHORT_NAME,
    "Melvin Yogiana portfolio",
    "Data Analyst Sydney",
    "Full-Stack Developer Sydney",
    "UNSW Computer Science",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_AU",
    url: SITE_URL,
    siteName: `${FULL_NAME} — Portfolio`,
    title: `${FULL_NAME} — ${JOB_TITLE}`,
    description: TAGLINE,
    images: [{ url: "/melvin.jpg", width: 1200, height: 630, alt: FULL_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${FULL_NAME} — ${JOB_TITLE}`,
    description: TAGLINE,
    images: ["/melvin.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en-AU" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className, jetbrainsMono.variable, spaceGrotesk.variable, newsreader.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <AiChatbox />
          <UtmBanner />
        </ThemeProvider>
        <AnalyticsTracker />
        <PersonJsonLd />
      </body>
    </html>
  )
}

