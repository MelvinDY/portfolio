import { NextRequest, NextResponse } from "next/server";

// Rate limiting: 5 questions per day per IP
interface RateLimit {
  count: number;
  resetTime: number;
}

const rateLimitStore = new Map<string, RateLimit>();

// Clean up old entries every hour
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60 * 60 * 1000); // 1 hour

const SYSTEM_PROMPT = `You are an AI assistant for Melvin Darial Yogiana's portfolio website. Your role is to answer questions about Melvin's background, skills, experience, and projects in a friendly and professional manner.

Here's what you know about Melvin:

## Personal Information
- Name: Melvin Darial Yogiana
- Location: Sydney, Australia
- Email: melvindarialyogiana@gmail.com
- GitHub: https://github.com/MelvinDY

## Education
- Bachelor of Science in Computer Science at University of New South Wales (UNSW)
  - Period: December 2023 - December 2025 (Expected)
  - Location: Sydney, Australia
  - Achievement: First Place winner of 2025 CSESoc Flagship Hackathon

- Diploma in Computer Science at UNSW Global
  - Period: August 2022 - December 2023
  - Location: Sydney, Australia

## Technical Skills

Frontend:
- React, Next.js, TypeScript, Three.js, JavaScript
- Atlassian UI Kit, TailwindCSS, Redux, GraphQL

Backend:
- Node.js, Express, Python
- PostgreSQL, MongoDB, Atlassian Forge, Supabase, TypeScript

DevOps:
- Docker, AWS, CI/CD, Git, Bitbucket, Jira, Linux, Nginx

Tools:
- VS Code, Postman, Figma, Jest, GitHub, Vercel

## Notable Projects

### OnlyCode (First Place - CSESoc Flagship Hackathon 2025)
Repository: https://github.com/tangkenzee/OnlyCode
A gamified peer-to-peer coding platform that brings back the human element to algorithm practice. Built in a hackathon weekend with a team.

Key Features:
- In-browser IDE for problem solving with Monaco Editor
- Smart help request system (unlocked after 3 failed attempts or 5 minutes)
- Skill-based matchmaking for helpers
- Real-time collaboration with shared code editor using WebSockets
- Integrated code execution with Judge0 API
- Gamification system with XP, badges, and leaderboards
- Comprehensive user profiles

Tech Stack: React 18, TypeScript, Vite, WebSockets, Node.js, Express, Monaco Editor, Judge0, Tailwind CSS, shadcn/ui

### RateMyAccom - Student Accommodation Review Platform
Repository: https://github.com/MelvinDY/ratemyaccom
Production-ready web application for rating and reviewing student accommodations across NSW universities.

Key Features:
- Student-verified reviews with university email verification
- Multi-dimensional rating system (cleanliness, location, value, amenities, management, safety)
- Advanced search and filtering by university, location, and price
- Comprehensive security measures (XSS/SQL injection/CSRF protection, rate limiting)
- 70%+ test coverage with Jest and React Testing Library
- Fully responsive design

Tech Stack: Next.js 14, TypeScript 5 (strict mode), Zod, React Hook Form, Jest, Tailwind CSS

### PPIA UNSW Ignite Website
Repository: https://github.com/MelvinDY/ignite
Official website for PPIA UNSW 2025 organization. Team project with 10 contributors.

Key Features:
- Modular architecture for team collaboration
- Database integration with Supabase
- Comprehensive setup documentation
- Active development (451 commits)

Tech Stack: TypeScript, React, Supabase, PostgreSQL, PL/pgSQL, Node.js

### Portfolio Website (This Site!)
Repository: https://github.com/MelvinDY/portfolio
Modern portfolio website showcasing projects and blog posts.

Key Features:
- MDX-based blog system
- AI chatbot integration (you're talking to it!)
- Three.js ASCII art animations
- Dark/light theme support
- Responsive design

Tech Stack: Next.js 15, TypeScript, Three.js, MDX, OpenAI, React Markdown, Tailwind CSS

### UNSW Capstone Project (COMP3900)
Team-based software engineering capstone project developed in a team of 5 students following agile methodologies and industry best practices.

## Personality & Interests
- Passionate about modern web development and building user-friendly applications
- Enjoys hackathons and collaborative coding experiences
- Believes technology should bring people together
- Interested in real-time systems, collaborative features, and user experience
- When not coding, enjoys exploring Sydney's coffee scene

## Professional Approach
- Values team chemistry and collaboration
- Focuses on MVP thinking and practical solutions
- Emphasizes user experience even under time constraints
- Understands when to take technical debt and when not to
- Continuous learner who loves solving real problems

When answering questions:
1. Be friendly, professional, and enthusiastic
2. Provide specific details from the information above
3. If asked about work experience, mention that Melvin is currently focusing on education and personal projects
4. Encourage users to reach out via the contact form or email for opportunities
5. If you don't know something specific, be honest and suggest they contact Melvin directly
6. Keep responses concise but informative
7. Always maintain a positive, helpful tone`;

function getRateLimitInfo(ip: string): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const oneDayMs = 24 * 60 * 60 * 1000;
  const maxRequests = 5;

  let rateLimit = rateLimitStore.get(ip);

  // If no record or reset time has passed, create new entry
  if (!rateLimit || now > rateLimit.resetTime) {
    const resetTime = now + oneDayMs;
    rateLimit = { count: 0, resetTime };
    rateLimitStore.set(ip, rateLimit);
  }

  const remaining = maxRequests - rateLimit.count;
  const allowed = rateLimit.count < maxRequests;

  return { allowed, remaining, resetTime: rateLimit.resetTime };
}

export async function POST(request: NextRequest) {
  let message = "";
  try {
    const body = await request.json();
    message = body.message;

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }

    // Get user's IP address
    const ip = request.headers.get("x-forwarded-for") ||
               request.headers.get("x-real-ip") ||
               "unknown";

    // Check rate limit
    const rateLimitInfo = getRateLimitInfo(ip);

    if (!rateLimitInfo.allowed) {
      const hoursUntilReset = Math.ceil((rateLimitInfo.resetTime - Date.now()) / (1000 * 60 * 60));

      return NextResponse.json(
        {
          error: "Daily question limit reached",
          message: `You've reached your daily limit of 5 questions. Please try again in ${hoursUntilReset} hours or contact Melvin directly at melvindarialyogiana@gmail.com.`,
          resetTime: rateLimitInfo.resetTime,
          remaining: 0
        },
        { status: 429 }
      );
    }

    // Increment the counter
    const rateLimit = rateLimitStore.get(ip)!;
    rateLimit.count++;
    rateLimitStore.set(ip, rateLimit);

    // Get updated rate limit info for response
    const updatedRateLimitInfo = getRateLimitInfo(ip);

    // Check if OpenAI API key is configured
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      // Fallback response when API key is not configured
      return NextResponse.json({
        message: getFallbackResponse(message),
        remaining: updatedRateLimitInfo.remaining,
      });
    }

    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("OpenAI API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      // If quota exceeded, use fallback responses
      if (response.status === 429 || response.status === 401) {
        console.log("Using fallback response due to OpenAI API issues");
        return NextResponse.json({
          message: getFallbackResponse(message),
          remaining: updatedRateLimitInfo.remaining,
        });
      }

      throw new Error(`OpenAI API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";

    return NextResponse.json({
      message: assistantMessage,
      remaining: updatedRateLimitInfo.remaining,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    // Use fallback response on any error
    const ip = request.headers.get("x-forwarded-for") ||
               request.headers.get("x-real-ip") ||
               "unknown";
    const rateLimitInfo = getRateLimitInfo(ip);
    return NextResponse.json({
      message: getFallbackResponse(message),
      remaining: rateLimitInfo.remaining,
    });
  }
}

// Fallback responses when OpenAI API is not configured
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("skill") || lowerMessage.includes("technology") || lowerMessage.includes("tech stack")) {
    return "Melvin is skilled in modern web development technologies including React, Next.js, TypeScript, Node.js, Python, PostgreSQL, MongoDB, Docker, and AWS. He's particularly experienced with building real-time collaborative applications and user-friendly interfaces.";
  }

  if (lowerMessage.includes("education") || lowerMessage.includes("study") || lowerMessage.includes("university")) {
    return "Melvin is currently pursuing a Bachelor of Science in Computer Science at the University of New South Wales (UNSW), expected to graduate in December 2025. He previously completed a Diploma in Computer Science at UNSW Global. He was the First Place winner of the 2025 CSESoc Flagship Hackathon!";
  }

  if (lowerMessage.includes("project") || lowerMessage.includes("onlycode") || lowerMessage.includes("hackathon")) {
    return "Melvin's notable project is OnlyCode, which won First Place at the 2025 CSESoc Flagship Hackathon. It's a gamified peer-to-peer coding platform with real-time collaboration, featuring an in-browser IDE, smart help request system, and skill-based matchmaking. He's also built e-commerce platforms, task management apps, and AI chat interfaces.";
  }

  if (lowerMessage.includes("experience") || lowerMessage.includes("work")) {
    return "Melvin is currently focusing on his education at UNSW and building impressive personal projects. He's actively seeking opportunities to apply his skills in web development, particularly in areas involving real-time systems and collaborative applications.";
  }

  if (lowerMessage.includes("contact") || lowerMessage.includes("reach") || lowerMessage.includes("email")) {
    return "You can reach Melvin at melvindarialyogiana@gmail.com or through the contact form on this website. He's also active on GitHub at https://github.com/MelvinDY. Feel free to reach out for opportunities or collaborations!";
  }

  if (lowerMessage.includes("location") || lowerMessage.includes("where")) {
    return "Melvin is based in Sydney, Australia. He's currently studying at the University of New South Wales (UNSW) and is open to opportunities in the Sydney area or remote positions.";
  }

  // Default response
  return "Hi! I'm Melvin's AI assistant. Melvin is a Computer Science student at UNSW in Sydney, Australia, with strong skills in React, Next.js, TypeScript, and full-stack development. He recently won First Place at the 2025 CSESoc Flagship Hackathon for building OnlyCode, a real-time peer-to-peer coding platform. Feel free to ask me about his skills, projects, or education, or reach out directly at melvindarialyogiana@gmail.com!";
}
