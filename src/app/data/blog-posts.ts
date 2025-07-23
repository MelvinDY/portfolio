// src/data/blog-posts.ts
import { BlogPost } from "../types/blog"
import blogPostsData from "./blog-posts.json"

export const blogPosts: BlogPost[] = blogPostsData as BlogPost[]

export const staticBlogPosts: BlogPost[] = [
  {
    id: "onlycode-hackathon",
    title: "Building OnlyCode: A Peer-to-Peer Coding Platform Hackathon Experience",
    excerpt: "My experience building OnlyCode, a gamified peer-to-peer coding platform that brings back the human element to algorithm practice, during an intense hackathon weekend.",
    date: "January 23, 2025",
    readTime: "6 min read",
    tags: ["Hackathon", "React", "Real-time", "WebSockets", "Collaboration", "EdTech"],
    content: `
# Building OnlyCode: A Peer-to-Peer Coding Platform Hackathon Experience

Hackathons are intense. You have a limited time window, a team you might barely know, and an ambitious idea that seems impossible to execute. But sometimes, magic happens. OnlyCode was one of those magical moments.

## The Problem We Wanted to Solve

We looked at the current landscape of coding practice and saw a glaring issue: **it's lonely**. Platforms like LeetCode are powerful tools, but when you're stuck on a problem, you're on your own. Sure, you can ask ChatGPT, but there's something missing – the human element.

Learning to code shouldn't feel like grinding in silence. It should be social, collaborative, and rewarding. That's where OnlyCode came from.

## What We Built

OnlyCode is a peer-to-peer coding platform where students can solve algorithm problems, request help when stuck, and collaborate live while earning XP, badges, and reputation. Think LeetCode meets Discord meets Stack Overflow, but with real-time collaboration.

### Core Features We Implemented

**Problem Solving with In-Browser IDE**
We built a complete coding environment right in the browser, complete with problem descriptions, examples, and test cases. No need to switch between different tools.

**Smart Help Request System**
Here's where it gets interesting – you can't just immediately ask for help. After 3 failed attempts or being stuck for 5 minutes, you unlock the ability to request help. This prevents dependency while ensuring help is available when truly needed.

**Skill-Based Matchmaking**
When you request help, our system matches you with helpers based on topic expertise and skill level. No more getting overwhelming explanations or unhelpful responses.

**Real-Time Collaboration**
The magic happens here – a shared editor where both the student and helper can code together in real-time. It's like pair programming, but for learning.

**Gamified Help System**
Helpers aren't just doing charity work. They earn XP, unlock badges, and climb leaderboards. This creates a sustainable ecosystem where helping others is rewarding.

**Comprehensive User Profiles**
Track your progress, showcase your badges, highlight favorite topics, and measure your community impact. It's not just about solving problems – it's about growing as part of a community.

## The Technical Challenge

Building this in a hackathon timeframe was ambitious, to say the least. We needed:

- Real-time collaboration infrastructure
- A code execution environment
- Matchmaking algorithms
- Gamification systems
- User authentication and profiles
- A responsive, intuitive UI

### Tech Stack Decisions

We went with React for the frontend because of our team's familiarity and the rich ecosystem. For real-time features, WebSockets were essential – we couldn't afford the latency of traditional HTTP requests when people are coding together.

The trickiest part was implementing the shared code editor. We needed something that could handle multiple cursors, real-time updates, and conflict resolution. Every keystroke had to be synchronized without creating a laggy experience.

### The Execution Marathon

Hackathons test more than your coding skills – they test your ability to work under pressure, make quick decisions, and execute as a cohesive unit. Our team clicked immediately, which made all the difference.

We divided responsibilities based on strengths but stayed flexible. When someone hit a blocker, others jumped in. When we needed to pivot on a feature, we did it quickly without ego.

The real-time collaboration feature alone could have been a weekend project, but we had to build it alongside everything else. There were moments where it felt impossible, but we kept pushing.

## Challenges We Overcame

**Time Management**
With so many moving parts, we had to ruthlessly prioritize. Some features we'd dreamed of got cut, but the core experience remained intact.

**Real-Time Synchronization**
Getting the shared editor to work without conflicts or lag was brutal. We went through multiple approaches before finding one that worked reliably.

**User Experience Design**
With all these features, it was easy to create something overwhelming. We spent significant time simplifying the interface and making the flow intuitive.

**System Architecture**
Balancing the matchmaking algorithm, real-time features, and gamification system required careful planning to avoid bottlenecks.

## What Made It Special

Looking back, I'm proud of how we executed this huge project in such a small time window. But more than the technical achievement, I'm proud of what we created – a platform that could genuinely help people learn coding in a more human, connected way.

The gamification isn't just point-scoring – it creates real incentives for people to help each other. The real-time collaboration isn't just a cool feature – it enables actual learning moments that wouldn't happen otherwise.

## Lessons Learned

**Team Chemistry Matters More Than Individual Skill**
We worked cohesively as a unit, and that made all the difference. Communication, trust, and shared vision trumped individual coding ability.

**MVP Thinking is Crucial**
We could have spent the entire hackathon on just the real-time editor. Instead, we built something that worked end-to-end, even if each piece wasn't perfect.

**User Experience Can't Be an Afterthought**
Even with time constraints, we invested in making the platform intuitive. Complex features mean nothing if users can't figure them out.

**Technical Debt in Hackathons is Real**
We made some shortcuts that would need addressing in a real product, but understanding when to take that debt and when not to is a valuable skill.

## Future Vision

The concept of gamified peer-to-peer learning isn't limited to coding. We envision expanding to educational institutes, helping teachers monitor class progress, and adapting the system for other subjects like math and science.

OnlyCode could become a comprehensive learning platform where the act of helping others becomes as rewarding as solving problems yourself.

## Reflection

This hackathon reminded me why I love building things. When you combine technical skills with a genuine desire to solve real problems, amazing things can happen – even in just a weekend.

OnlyCode isn't just a project we built; it's a vision of what learning could be like. More connected, more human, more rewarding for everyone involved.

Building it taught me about real-time systems, collaborative features, and the importance of user experience in complex applications. But most importantly, it reinforced my belief that technology should bring people together, not isolate them.

— Melvin
    `
  },
  {
    id: "portfolio-live",
    title: "My Portfolio is Live: Here's What I Learned",
    excerpt: "After building this portfolio from scratch with Next.js and shadcn/ui, here are the key lessons I learned about modern web development and what's coming next.",
    date: "December 15, 2024",
    readTime: "4 min read",
    tags: ["Next.js", "Portfolio", "Shadcn UI", "TailwindCSS", "Web Development"],
    content: `
# My Portfolio is Live: Here's What I Learned

Building this portfolio has been quite the journey! From choosing the tech stack to implementing features like the blog system and contact forms, every step taught me something new about modern web development.

## Why I Built This

As a developer from Sydney, I wanted to create something that truly represents my skills and personality. Not just another template-based portfolio, but a custom-built site that showcases what I can do with modern technologies.

## Tech Stack Decisions

### Next.js 15 with App Router
I chose Next.js for its excellent developer experience and performance optimizations. The new App Router made structuring the site intuitive, and server components helped with initial load times.

### Shadcn/UI + TailwindCSS
This combination was a game-changer. Shadcn/UI provided beautiful, accessible components while TailwindCSS gave me the flexibility to customize everything exactly how I wanted it.

### TypeScript Throughout
Type safety was crucial for maintainability. It caught so many potential bugs during development and made refactoring much more confident.

## Key Features I Built

### Responsive Navigation
Created a header component that adapts between desktop text navigation and mobile emoji navigation. The emoji approach makes mobile navigation fun and unique!

### Contact Form with Email Integration
Implemented a working contact form using Resend for email delivery. It includes proper validation, loading states, and user feedback.

### Blog System
Built a complete blog system from scratch with:
- Search functionality
- Tag filtering
- Responsive design
- Markdown content support

### Smooth Scrolling
Getting smooth scrolling to work properly across all browsers was trickier than expected, but worth it for the polished feel.

## Challenges I Faced

### Scroll Behavior Issues
The CSS scroll-behavior: smooth wasn't working consistently. Had to implement multiple approaches including JavaScript fallbacks and proper scroll padding for the sticky header.

### Component Architecture
Deciding how to structure reusable components, especially the header with different variants for different pages, required careful planning.

### Content Organization
Structuring the blog data and helper functions in a maintainable way was crucial. Ended up with a clean separation between data, types, and utilities.

## What I Learned

### Modern CSS is Powerful
TailwindCSS combined with modern CSS features like CSS custom properties made styling incredibly efficient and maintainable.

### Component Reusability Matters
Building components like the site header with different variants saved tons of code duplication and made updates much easier.

### Performance from the Start
Using Next.js Image components, proper caching headers, and optimized fonts made a huge difference in load times.

### User Experience Details
Small touches like hover states, loading indicators, and proper error handling make the difference between a good site and a great one.

## What's Next

I'm planning to add:
- Dark mode toggle (because who doesn't love dark mode?)
- More interactive animations
- Project case studies with detailed breakdowns
- Maybe an AI chatbot to answer questions about my work

## Thoughts on the Journey

Building this portfolio reminded me why I love web development. Every problem has multiple solutions, and the satisfaction of seeing everything come together is incredible.

The best part? This isn't just a portfolio - it's a testament to continuous learning and improvement. Every feature I added taught me something new about React, Next.js, or modern web development practices.

Thanks for checking it out! Feel free to explore the code on GitHub or reach out if you have any questions about the implementation.

— Melvin
    `
  },
  {
    id: "hello-world",
    title: "Hello World!",
    excerpt: "Testing out my new blog system built with Next.js and TypeScript. Time to see if all those components and helper functions actually work!",
    date: "December 1, 2024", 
    readTime: "2 min read",
    tags: ["Blog", "Hello World", "Next.js", "Testing"],
    content: `
# Hello World!

Welcome to my blog! This is my first post, and honestly, I'm just testing to make sure everything works as expected.

## What Am I Testing?

Building this blog system from scratch means I need to verify:
- Markdown rendering works properly
- The search functionality can find this post
- Tags are displaying correctly
- The responsive design looks good on mobile

## About This Blog

I'll be writing about:
- **Web Development**: Sharing what I learn building projects
- **Tech Experiences**: Honest thoughts on tools and frameworks
- **Project Updates**: Behind-the-scenes of what I'm working on
- **Random Thoughts**: Because sometimes you just need to write

## Testing Some Markdown

Let's make sure the styling works:

### Code Blocks
\`\`\`javascript
function testBlog() {
  console.log("Hello from my new blog!");
  return "Success! 🎉";
}
\`\`\`

### Lists
Things I'm excited to write about:
- Next.js 15 features
- Building reusable components
- TypeScript tips and tricks
- Portfolio development journey

### Links
Check out my [GitHub](https://github.com) for the source code of this site!

## What's Coming Next

I'm planning to write about:
1. Building this portfolio from scratch
2. Lessons learned with Next.js App Router
3. Why I chose shadcn/ui over other component libraries
4. The challenges of making responsive navigation

## Quick Personal Note

I'm Melvin, a full-stack developer from Sydney who loves building things with modern web technologies. When I'm not coding, you'll probably find me exploring Sydney's coffee scene or planning my next adventure.

This blog is part of my portfolio site, built to share my experiences and hopefully help other developers along the way.

Thanks for stopping by! More substantial content coming soon.

— Melvin
    `
  }
]