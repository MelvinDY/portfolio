"use client"

import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, Instagram, FileText, ChevronDown } from "lucide-react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import Image from "next/image"
import CurrentlyLearning from "../components/currently-learning"
import SiteHeader from "../components/site-header"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader variant="about" />

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
                  <Link href="https://github.com/MelvinDY" target="_blank">
                    <Button variant="outline" size="icon">
                      <Github className="h-4 w-4" />
                      <span className="sr-only">GitHub</span>
                    </Button>
                  </Link>
                  <Link href="https://www.linkedin.com/in/melvin-yogiana/" target="_blank">
                    <Button variant="outline" size="icon">
                      <Linkedin className="h-4 w-4" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </Link>
                  <Link 
                    href="mailto:melvindarialyogiana@gmail.com"
                    title="Send email to melvindarialyogiana@gmail.com"
                    onClick={(e) => {
                      const fallback = () => {
                        navigator.clipboard.writeText("melvindarialyogiana@gmail.com").then(() => {
                          alert("Email address copied to clipboard: melvindarialyogiana@gmail.com");
                        }).catch(() => {
                          alert("Email: melvindarialyogiana@gmail.com");
                        });
                      };
                      
                      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                      if (!isMobile && !window.confirm("This will open your email client. Click OK to continue, or Cancel to copy the email address instead.")) {
                        e.preventDefault();
                        fallback();
                      }
                    }}
                  >
                    <Button variant="outline" size="icon">
                      <Mail className="h-4 w-4" />
                      <span className="sr-only">Email</span>
                    </Button>
                  </Link>
                  <Link href="https://www.instagram.com/melvindarialyogiana" target="_blank">
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
                      src="/purin.jpg?height=600&width=480"
                      alt="Melvin - Full Stack Developer"
                      fill
                      className="object-cover"
                      priority
                    />
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
                      When I&apos;m not coding, you&apos;ll probably find me exploring Sydney&apos;s
                      coffee scene or planning my next adventure. I believe the best
                      developers are curious about everything, not just code.
                    </p>

                    <p>
                      I&apos;m passionate about building things that matter - whether it&apos;s
                      a sleek user interface, a robust API, or just a fun side project
                      that makes someone&apos;s day a little better.
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
                        href="https://www.instagram.com/iamrigbycat" 
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

        {/* Currently Learning Section */}
        <section id="tech" className="py-12 md:py-24 lg:py-32">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12 space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                Currently Learning
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Always exploring new technologies and expanding my skillset
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <CurrentlyLearning />
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
                    <h2 className="text-3xl md:text-4xl font-bold">Let&apos;s Build Something Together</h2>
                    <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                      I&apos;m always excited about new projects and opportunities to learn.
                      Whether you have a project in mind or just want to chat about tech, let&apos;s connect!
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg">
                      <Link 
                        href="mailto:melvindarialyogiana@gmail.com"
                        title="Send email to melvindarialyogiana@gmail.com"
                        onClick={(e) => {
                          const fallback = () => {
                            navigator.clipboard.writeText("melvindarialyogiana@gmail.com").then(() => {
                              alert("Email address copied to clipboard: melvindarialyogiana@gmail.com");
                            }).catch(() => {
                              alert("Email: melvindarialyogiana@gmail.com");
                            });
                          };
                          
                          const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                          if (!isMobile && !window.confirm("This will open your email client. Click OK to continue, or Cancel to copy the email address instead.")) {
                            e.preventDefault();
                            fallback();
                          }
                        }}
                      >
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
                      <Link href="https://github.com/MelvinDY" target="_blank">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </Link>
                    </Button>
                    
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="https://www.linkedin.com/in/melvin-yogiana" target="_blank">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </Link>
                    </Button>
                    
                    <Button variant="ghost" size="sm" asChild>
                      <Link href="https://www.instagram.com/melvindarialyogiana" target="_blank">
                        <Instagram className="h-4 w-4 mr-2" />
                        Instagram 
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t">
        <div className="container mx-auto flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6">
          <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 MelvinDY All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4" href="/privacy">
              Privacy Policy
            </Link>
            <Link 
              className="text-xs hover:underline underline-offset-4" 
              href="mailto:melvindarialyogiana@gmail.com"
              title="Send email to melvindarialyogiana@gmail.com"
              onClick={(e) => {
                const fallback = () => {
                  navigator.clipboard.writeText("melvindarialyogiana@gmail.com").then(() => {
                    alert("Email address copied to clipboard: melvindarialyogiana@gmail.com");
                  }).catch(() => {
                    alert("Email: melvindarialyogiana@gmail.com");
                  });
                };
                
                const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
                if (!isMobile && !window.confirm("This will open your email client. Click OK to continue, or Cancel to copy the email address instead.")) {
                  e.preventDefault();
                  fallback();
                }
              }}
            >
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}