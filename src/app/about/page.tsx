import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, Instagram, FileText, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import TechStack from "../components/tech-stack"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-14 items-center justify-between px-4 md:px-6">
          <div className="flex items-center">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="font-bold">MelvinDY</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <Link href="#hero" className="transition-colors hover:text-foreground/80">
                About
              </Link>
              <Link href="#story" className="transition-colors hover:text-foreground/80">
                My Story
              </Link>
              <Link href="#tech" className="transition-colors hover:text-foreground/80">
                Tech Stack
              </Link>
              <Link href="#contact" className="transition-colors hover:text-foreground/80">
                Contact
              </Link>
            </nav>
          </div>
          <Link href="/">
            <Button variant="outline" size="sm">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </header>

      <main className="w-full">
        {/* Hero Section - Full Screen */}
        <section id="hero" className="min-h-screen flex items-center justify-center py-12 md:py-24 lg:py-32 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Left Content */}
              <div className="space-y-6 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    hi Melvin here, 👋
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground">
                    Web dev enthusiast from Sydney 🇦🇺
                  </p>
                </div>

                <div className="space-y-4 text-lg leading-relaxed max-w-[600px] mx-auto lg:mx-0">
                  <p>
                    Full-stack developer by passion, problem solver by nature. 
                    I build and self-host cool stuff on the internet.
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center lg:justify-start space-x-4">
                  <Link href="https://github.com" target="_blank">
                    <Button variant="outline" size="icon">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </Button>
                  </Link>
                  <Link href="https://linkedin.com" target="_blank">
                    <Button variant="outline" size="icon">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </Link>
                  <Link href="mailto:melvindarialyogiana@gmail.com">
                    <Button variant="outline" size="icon">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email</span>
                    </Button>
                  </Link>
                  <Link href="https://instagram.com/your-pet-instagram" target="_blank">
                    <Button variant="outline" size="icon">
                      <Instagram className="h-4 w-4" />
                      <span className="sr-only">Pet Support</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative">
                  <div className="aspect-[4/5] w-80 relative rounded-2xl overflow-hidden">
                    <Image
                      src="/placeholder.svg?height=600&width=480"
                      alt="Melvin - Full Stack Developer"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  {/* Tech stack icons overlay */}
                  <div className="absolute -bottom-4 -right-4 bg-background border rounded-lg p-4 shadow-lg">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 text-xs font-bold">
                        JS
                      </div>
                      <div className="w-8 h-8 rounded bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 text-xs font-bold">
                        TS
                      </div>
                      <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-purple-600 text-xs font-bold">
                        ⚛️
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-6 w-6 text-muted-foreground" />
          </div>
        </section>

        {/* My Story Section */}
        <section id="story" className="py-12 md:py-24 lg:py-32 bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 md:p-12">
                <div className="space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">My Story</h2>
                    <p className="text-muted-foreground text-lg">How I fell in love with code</p>
                  </div>

                  <div className="space-y-6 text-lg leading-relaxed">
                    <p>
                      Currently diving deep into modern web technologies, 
                      always learning something new, and turning coffee into code. ☕
                    </p>
                    
                    <p>
                      When I'm not coding, you'll probably find me exploring Sydney's 
                      coffee scene or planning my next adventure. I believe the best 
                      developers are curious about everything, not just code.
                    </p>

                    <p>
                      I'm passionate about building things that matter - whether it's 
                      a sleek user interface, a robust API, or just a fun side project 
                      that makes someone's day a little better.
                    </p>
                  </div>

                  {/* Call to Action */}
                  <div className="bg-muted/50 p-6 rounded-lg">
                    <p className="text-lg mb-4">
                      For questions, project ideas, or just to say hi, 
                      <span className="font-medium"> drop me a message!</span> 👇
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Want to see my furry coding companion? Check out my 
                      <Link 
                        href="https://instagram.com/your-pet-instagram" 
                        target="_blank" 
                        className="text-primary hover:underline ml-1"
                      >
                        Pet Support
                      </Link> 
                      {" "}page instead! 🐕
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Tech Stack Section */}
        <section id="tech" className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-12 text-center">
              Tech Stack
            </h2>
            <div className="max-w-4xl mx-auto">
              <TechStack />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-12 md:py-24 lg:py-32 bg-muted/20">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-2xl">
              <Card className="p-8 md:p-12">
                <div className="space-y-8 text-center">
                  <div className="space-y-4">
                    <h2 className="text-3xl md:text-4xl font-bold">Let's Build Something Together</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      I'm always excited about new projects and opportunities to learn. 
                      Whether you have a project in mind or just want to chat about tech, let's connect!
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                      <Link href="mailto:melvindarialyogiana@gmail.com">
                        <Mail className="h-4 w-4 mr-2" />
                        Send me an email
                      </Link>
                    </Button>
                    
                    <Button variant="outline" size="lg" asChild>
                      <Link href="/resume.pdf" target="_blank">
                        <FileText className="h-4 w-4 mr-2" />
                        View Resume
                      </Link>
                    </Button>
                    
                    <Button variant="outline" size="lg" asChild>
                      <Link href="/">
                        View My Work
                      </Link>
                    </Button>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-4 pt-4">
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="https://github.com" target="_blank">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Link>
                    </Button>
                    
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="https://linkedin.com" target="_blank">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Link>
                    </Button>
                    
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="https://instagram.com/your-pet-instagram" target="_blank">
                        <Instagram className="h-4 w-4 mr-2" />
                        Pet Support
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}