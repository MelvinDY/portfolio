import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Space_Grotesk, Newsreader } from "next/font/google"
import "./globals.css"
import type React from "react"
import AiChatbox from "./components/ai-chatbox"
import TeCursor from "./components/te-cursor"
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
// Both display faces load as variable fonts — `weight` is deliberately
// omitted. The hero interpolates the name's weight per character under the
// pointer, which needs a continuous wght axis, not four static instances.
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
})
const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  style: ["normal", "italic"],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    // The homepage sets the exact legal name; every other page appends it, so
    // the full name appears in every SERP title on the site.
    default: `${FULL_NAME}, ${JOB_TITLE}`,
    template: `%s, ${FULL_NAME}`,
  },
  description: TAGLINE,
  applicationName: `${FULL_NAME}, Portfolio`,
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
    siteName: `${FULL_NAME}, Portfolio`,
    title: `${FULL_NAME}, ${JOB_TITLE}`,
    description: TAGLINE,
    images: [{ url: "/melvin.jpg", width: 1200, height: 630, alt: FULL_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${FULL_NAME}, ${JOB_TITLE}`,
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
        {/* The hero ships in its entrance start state so the name does not
            paint, snap away and animate back. That state is cleared by the
            component on hydration, so with scripting off it would never clear
            and the name would stay hidden. This reveals it instead. */}
        <noscript>
          <style>{`.te-home .hero3[data-intro="pending"] .h3-tick,
.te-home .hero3[data-intro="pending"] .h3-hud > span,
.te-home .hero3[data-intro="pending"] .h3-pre,
.te-home .hero3[data-intro="pending"] .h3-ch,
.te-home .hero3[data-intro="pending"] .h3-sub {
  opacity: 1 !important; transform: none !important; letter-spacing: normal !important;
}`}</style>
        </noscript>
        {/* enableSystem stays off until a dark palette exists. With it on, a
            visitor whose OS prefers dark gets html.dark and a theme nothing is
            styled for. Turn it back on when dark mode ships. */}
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          {/* Mounted here rather than per page so the dot survives navigation.
              It self-gates on (pointer:fine) and reduced motion, and returns
              null on the routes that do their own pointer work. */}
          <TeCursor />
          <AiChatbox />
          <UtmBanner />
        </ThemeProvider>
        <AnalyticsTracker />
        <PersonJsonLd />
      </body>
    </html>
  )
}

