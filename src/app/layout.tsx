import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Space_Grotesk, Newsreader } from "next/font/google"
import "./globals.css"
import type React from "react" // Import React
import AiChatbox from "./components/ai-chatbox"

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
  title: "Melvin Yogiana — Data Analyst & Full-Stack Developer",
  description: "Melvin Darial Yogiana — Data Analyst & Full-Stack Developer. UNSW Computer Science. UNIHACK 2026 award winner. Based in Sydney.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("min-h-screen bg-background font-sans antialiased", inter.className, jetbrainsMono.variable, spaceGrotesk.variable, newsreader.variable)}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <AiChatbox />
        </ThemeProvider>
      </body>
    </html>
  )
}

