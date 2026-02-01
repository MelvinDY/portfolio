"use client"

import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, Instagram, FileText, ChevronDown, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import CurrentlyLearning from "../components/currently-learning"
import SiteHeader from "../components/site-header"
import CreativeFooter from "../components/creative-footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Global background gradient accents */}
      <div className="fixed top-1/4 -left-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <SiteHeader variant="about" />

      <main className="relative">
        {/* Hero Section */}
        <section id="hero" className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-16 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
              {/* Left Content */}
              <div className="space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <p className="text-sm font-medium text-primary tracking-wide uppercase">
                    About Me
                  </p>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                    hi Melvin here, 👋
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground">
                    Web dev enthusiast from Sydney 🇦🇺
                  </p>
                </div>

                <div className="space-y-4 text-lg leading-relaxed max-w-[600px] mx-auto lg:mx-0 text-muted-foreground">
                  <p>
                    Full-stack developer by passion, problem solver by nature.
                    I build and self-host cool stuff on the internet.
                  </p>
                </div>

                {/* Social Links */}
                <div className="flex justify-center lg:justify-start gap-3">
                  <Link href="https://github.com/MelvinDY" target="_blank" className="group">
                    <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                      <Github className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="sr-only">GitHub</span>
                    </Button>
                  </Link>
                  <Link href="https://www.linkedin.com/in/melvin-yogiana/" target="_blank" className="group">
                    <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                      <Linkedin className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="sr-only">LinkedIn</span>
                    </Button>
                  </Link>
                  <Link
                    href="mailto:melvindarialyogiana@gmail.com"
                    title="Send email to melvindarialyogiana@gmail.com"
                    className="group"
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
                    <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                      <Mail className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="sr-only">Email</span>
                    </Button>
                  </Link>
                  <Link href="https://www.instagram.com/melvindarialyogiana" target="_blank" className="group">
                    <Button variant="outline" size="icon" className="rounded-xl border-white/10 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all duration-300">
                      <Instagram className="h-4 w-4 group-hover:scale-110 transition-transform" />
                      <span className="sr-only">Instagram</span>
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Image */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative group">
                  {/* Glow effect behind image */}
                  <div className="absolute -inset-4 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative aspect-[4/5] w-72 md:w-80 rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                    <Image
                      src="/purin.jpg"
                      alt="Melvin - Full Stack Developer"
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
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
        <section id="story" className="py-24 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto">
              {/* Section Header */}
              <div className="text-center mb-12">
                <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
                  Background
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">My Story</h2>
              </div>

              {/* Glass card */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-white/10 p-8 md:p-12">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

                <div className="relative space-y-8">
                  <p className="text-lg text-muted-foreground text-center">
                    How I fell in love with code
                  </p>

                  <div className="space-y-6 text-lg leading-relaxed text-foreground/90">
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
                  <div className="bg-primary/5 border border-primary/10 p-6 rounded-xl">
                    <p className="text-lg mb-3">
                      For questions, project ideas, or just to say hi,
                      <span className="font-medium text-primary"> drop me a message!</span> 👇
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Want to see my furry coding companion? Check out my
                      <Link
                        href="https://www.instagram.com/iamrigbycat"
                        target="_blank"
                        className="text-primary hover:underline ml-1 inline-flex items-center gap-1"
                      >
                        Pet Support
                        <ArrowUpRight className="h-3 w-3" />
                      </Link>
                      {" "}page instead! 🐕
                    </p>
                  </div>
                </div>

                {/* Bottom gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* Currently Learning Section */}
        <section id="tech" className="py-24 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
                Growth
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                Currently Learning
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">
                Always exploring new technologies and expanding my skillset
              </p>
            </div>
            <div className="max-w-5xl mx-auto">
              <CurrentlyLearning />
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="py-24 relative">
          <div className="container mx-auto px-4 md:px-6">
            <div className="mx-auto max-w-2xl">
              {/* Section Header */}
              <div className="text-center mb-12">
                <p className="text-sm font-medium text-primary mb-2 tracking-wide uppercase">
                  Get in Touch
                </p>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Let&apos;s Build Something Together</h2>
              </div>

              {/* Glass card */}
              <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-background/80 to-background/40 backdrop-blur-xl border border-white/10 p-8 md:p-12">
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5 pointer-events-none" />

                <div className="relative space-y-8 text-center">
                  <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                    I&apos;m always excited about new projects and opportunities to learn.
                    Whether you have a project in mind or just want to chat about tech, let&apos;s connect!
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild size="lg" className="rounded-xl">
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

                    <Button variant="outline" size="lg" asChild className="rounded-xl border-white/10 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all">
                      <Link href="/resume.pdf" target="_blank">
                        <FileText className="h-4 w-4 mr-2" />
                        View Resume
                      </Link>
                    </Button>

                    <Button variant="outline" size="lg" asChild className="rounded-xl border-white/10 bg-background/50 backdrop-blur-sm hover:bg-primary/10 hover:border-primary/50 transition-all">
                      <Link href="/">
                        View My Work
                      </Link>
                    </Button>
                  </div>

                  {/* Social Links */}
                  <div className="flex justify-center gap-3 pt-4">
                    <Link href="https://github.com/MelvinDY" target="_blank" className="group">
                      <Button variant="ghost" size="sm" className="rounded-xl hover:bg-primary/10 transition-all">
                        <Github className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        GitHub
                      </Button>
                    </Link>

                    <Link href="https://www.linkedin.com/in/melvin-yogiana" target="_blank" className="group">
                      <Button variant="ghost" size="sm" className="rounded-xl hover:bg-primary/10 transition-all">
                        <Linkedin className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        LinkedIn
                      </Button>
                    </Link>

                    <Link href="https://www.instagram.com/melvindarialyogiana" target="_blank" className="group">
                      <Button variant="ghost" size="sm" className="rounded-xl hover:bg-primary/10 transition-all">
                        <Instagram className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                        Instagram
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Bottom gradient accent */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              </div>
            </div>
          </div>
        </section>
      </main>
      <CreativeFooter />
    </div>
  )
}