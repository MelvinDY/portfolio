import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Mail } from "lucide-react"
import Link from "next/link"

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">MelvinDY</span>
            </Link>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 md:px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 md:p-12">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center space-y-4">
                <h1 className="text-4xl font-bold tracking-tight">Privacy Policy</h1>
                <p className="text-muted-foreground">Last Updated: July 2025</p>
              </div>

              {/* Introduction */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">Hey, Welcome! 👋</h2>
                <p className="text-lg leading-relaxed">
                  Thanks for stopping by! This <strong>Privacy Policy</strong> is just here to let you know how things work around here.
                  My website is mainly about showcasing my work, and I&apos;m all about respecting your privacy.
                </p>
              </section>

              {/* What I Collect */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">What Information I Collect (Hint: Not Much)</h2>
                <p className="leading-relaxed">
                  Honestly, this is just a portfolio website, so I don&apos;t actively collect any personal information.
                  There&apos;s no account creation, no tracking cookies, and definitely no sneaky data gathering.
                </p>
                
                <div className="space-y-4 ml-4">
                  <div>
                    <h3 className="text-lg font-medium mb-2">📧 Contact Form Messages</h3>
                    <p className="leading-relaxed text-muted-foreground">
                      When you reach out via the contact form, I receive your name, email, and message. 
                      This info is only used to respond to you—no spam, no newsletters unless you specifically ask for them.
                    </p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">🌐 Basic Website Analytics</h3>
                    <p className="leading-relaxed text-muted-foreground">
                      I might use basic analytics to see how many people visit the site and which pages are popular. 
                      Nothing personal—just general website performance stuff.
                    </p>
                  </div>
                </div>
              </section>

              {/* How I Use Info */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">How I Use the Info</h2>
                <p className="leading-relaxed">Here&apos;s what I might do with any information I collect:</p>
                <ul className="list-disc list-inside space-y-2 ml-4 text-muted-foreground">
                  <li>Respond to your questions or project inquiries</li>
                  <li>Make sure the site is running smoothly</li>
                  <li>Improve the website based on feedback you might share</li>
                  <li>Have awesome conversations about potential projects</li>
                </ul>
              </section>

              {/* Sharing Info */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">Sharing Your Info (Spoiler: I Don&apos;t)</h2>
                <p className="leading-relaxed">
                  I don&apos;t sell, trade, or rent your personal info to anyone. Ever. If you shared something sensitive by accident,
                  feel free to reach out, and I&apos;ll help you remove it. Your information stays between us.
                </p>
              </section>

              {/* Security */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">Security (The Internet Isn&apos;t Perfect)</h2>
                <p className="leading-relaxed">
                  I&apos;ll do my best to keep any info you share safe using industry-standard practices, but let&apos;s be real—no system is foolproof.
                  While I&apos;ll take reasonable steps to protect your information, I can&apos;t promise 100% security.
                  The internet is a wild place! 🌐
                </p>
              </section>

              {/* Third-Party Services */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">Third-Party Services</h2>
                <p className="leading-relaxed">
                  This site is hosted on <strong>Vercel</strong> and uses <strong>Resend</strong> for email delivery.
                  These services have their own privacy policies, which I encourage you to check out if you&apos;re curious.
                  I&apos;ve chosen them because they respect privacy and security.
                </p>
              </section>

              {/* Policy Updates */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">Policy Updates (No Surprises)</h2>
                <p className="leading-relaxed">
                  This policy is current as of <strong>July 2025</strong>. If I make any changes, I&apos;ll update it here,
                  so you&apos;re always in the loop. Feel free to check back occasionally, but don&apos;t worry—I&apos;m not making any
                  big changes without being transparent about it.
                </p>
              </section>

              {/* Contact */}
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-primary">Got Questions? 🤔</h2>
                <div className="bg-muted/50 p-6 rounded-lg">
                  <p className="leading-relaxed mb-4">
                    If you have any questions, concerns, or just want to say hi, I&apos;d love to hear from you!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="mailto:melvindarialyogiana@gmail.com">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Mail className="h-4 w-4 mr-2" />
                        melvindarialyogiana@gmail.com
                      </Button>
                    </Link>
                    <Link href="/#contact">
                      <Button className="w-full sm:w-auto">
                        Use Contact Form
                      </Button>
                    </Link>
                  </div>
                </div>
              </section>

              {/* Footer */}
              <div className="text-center pt-8 border-t">
                <p className="text-muted-foreground">
                  Thanks for reading! Now go check out my <Link href="/#projects" className="text-primary hover:underline">projects</Link> 🚀
                </p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  )
}