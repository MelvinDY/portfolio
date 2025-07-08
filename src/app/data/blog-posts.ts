// src/data/blog-posts.ts
import { BlogPost } from "../types/blog"

export const blogPosts: BlogPost[] = [
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