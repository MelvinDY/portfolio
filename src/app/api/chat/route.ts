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

const SYSTEM_PROMPT = `You are an AI assistant representing Melvin Darial Yogiana on his portfolio website. You help employers, recruiters, and anyone interested learn about Melvin's professional background, skills, and experience. Be professional, friendly, and concise.

## PERSONAL INFORMATION
- Name: Melvin Darial Yogiana
- Origin: Indonesia
- Current Location: Sydney, Australia
- Email: melvindarialyogiana@gmail.com
- LinkedIn: linkedin.com/in/melvin-yogiana
- GitHub: github.com/MelvinDY
- Portfolio: melvindy.vercel.app

## PROFESSIONAL SUMMARY
Frontend-focused Software Developer with hands-on experience leading development teams and building production-ready web applications. Proven track record of delivering high-impact projects including a 1st place hackathon win at CSESoc 2025 and multiple full-stack applications with 70%+ test coverage. Skilled in React, TypeScript, Next.js, and Node.js with additional experience in Python ML pipelines and Atlassian Forge development. Seeking a software engineering role to leverage technical expertise and leadership experience to build scalable, user-centric solutions.

## EDUCATION
1. University of New South Wales (UNSW) - Sydney, Australia
   - Degree: Bachelor of Science in Computer Science
   - Period: 2023 – 2025

2. UNSW College - Sydney, Australia
   - Diploma in Computer Science
   - Period: 2022 – 2023

## WORK EXPERIENCE

### Frontend Lead | PPIA UNSW – IT Team (Aug 2025 – Nov 2025)
Sydney, Australia
- Led a 10-person cross-functional team to deliver a professional networking platform
- Established Agile workflows with daily standups and weekly sprint reviews that improved team velocity
- Architected the frontend system using React and TypeScript with component-based design patterns enabling 3 parallel feature developments without merge conflicts
- Drove stakeholder alignment through bi-weekly demos with PPIA board members, translating user feedback into 15+ feature enhancements
- Mentored 4 junior developers on React best practices, code review processes, and Git workflows

## HONORS & AWARDS

### CSESoc 2025 Flagship Hackathon – 1st Place Winner (Jul 2025)
Tech Stack: React, TypeScript, Node.js, WebSocket
- Won 1st place among 50+ teams by developing OnlyCode, a real-time collaborative coding platform
- Engineered WebSocket-based real-time collaboration with <100ms latency
- Implemented skill-based matchmaking algorithm pairing users with helpers based on expertise
- Designed gamification system with XP tracking, badge achievements, and leaderboards
- GitHub: github.com/MelvinDY/OnlyCode

## PROJECTS

### RateMyAccom NSW (2025)
Tech Stack: Next.js 14, TypeScript, React 18, TailwindCSS, Prisma, Jest
- Shipped production-ready platform with 124+ commits for student accommodation reviews
- Achieved 70%+ test coverage using Jest and React Testing Library with automated CI/CD pipeline
- Implemented 6 security layers: CSRF token validation, rate limiting (100 req/min), XSS sanitization, SQL injection prevention, CSP headers, and HSTS enforcement
- Built multi-dimensional rating system with 6 categories and advanced filtering
- GitHub: github.com/MelvinDY/ratemyaccom

### Jalanlytics (2025)
Tech Stack: Python, YOLOv8, OpenAI CLIP, ByteTrack, Computer Vision
- Developed ML pipeline analyzing CCTV footage to estimate area income levels through vehicle detection with 34+ commits
- Integrated YOLOv8 with ByteTrack for unique vehicle counting, eliminating double-counting errors
- Implemented zero-shot classification using OpenAI CLIP to identify 50+ vehicle makes/models
- Optimized for Indonesian market detecting commercial vehicles (Gojek, Grab, angkot)
- GitHub: github.com/MelvinDY/Jalanlytics

### PPIA UNSW Networking Platform (Aug 2025 – Nov 2025)
Tech Stack: TypeScript, React, REST APIs
- Architected LinkedIn-style platform connecting 500+ Indonesian students and alumni
- Implemented real-time notifications and event management with calendar integration
- GitHub: github.com/MelvinDY/PPIA

### Ignite – PPIA UNSW Website (2025)
Tech Stack: TypeScript, Next.js
- Delivered organization's primary web presence as digital hub for PPIA UNSW 2025
- GitHub: github.com/MelvinDY/ignite

### Confluence Q&A Helper | UNSW x Atlassian Client Project (Sep 2025 – Present)
- Developing enterprise Q&A system for Atlassian client engagement
- Building question management features with upvoting, moderation queues, and presenter-facing dashboards

### Stale Page Hunter (Dec 2025)
Tech Stack: Atlassian Forge, Rovo AI, React, Node.js, UI Kit 2
- Built AI-powered Confluence app for Codegeist 2025 hackathon detecting outdated documentation
- Developed Space Health Dashboard with A-F grading system visualizing documentation freshness
- Created Stale Page Info macro with real-time staleness metrics

### Stall Wars - Golden Rubbish Bin Award
- Won award at Terrible Ideas Hackathon
- Built chaotic two-player arcade game in 48 hours
- GitHub: github.com/MelvinDY/Stall_Wars

## TECHNICAL SKILLS

Languages: JavaScript, TypeScript, Python, HTML5, CSS3, SQL, PLpgSQL

Frontend: React, Next.js 14, TailwindCSS, Sanity CMS, UI Kit 2, Responsive Design, Component Architecture

Backend: Node.js, Express.js, REST APIs, Prisma ORM, PostgreSQL, WebSocket, Authentication/Authorization

AI/ML: YOLOv8, OpenAI CLIP, ByteTrack, Computer Vision, Object Detection

Tools: Git, GitHub, Vercel, Jest, React Testing Library, CI/CD, Atlassian Forge, Puppeteer, Cheerio, Agile/Scrum

Security: CSRF Protection, Rate Limiting, Input Sanitization, XSS/SQL Injection Prevention

## GITHUB STATS
- Username: MelvinDY
- Public Repositories: 12
- Achievements: Pull Shark (x2), YOLO
- Active contributions across multiple projects

## RESPONSE GUIDELINES
1. Be professional and helpful - you're representing Melvin to potential employers
2. Provide specific, factual information from the data above
3. Highlight relevant achievements based on what's being asked
4. For technical questions, cite specific projects and technologies used
5. If asked about availability or job opportunities, encourage them to reach out via email: melvindarialyogiana@gmail.com
6. Keep responses concise but informative
7. If you don't have specific information, be honest and suggest they contact Melvin directly
8. Emphasize Melvin's leadership experience (led 10-person team), hackathon wins, and production-ready code with 70%+ test coverage
9. When relevant, mention he's seeking software engineering roles in Sydney or remote positions`;

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
    return "Melvin's core skills include:\n\n• Frontend: React, Next.js 14, TypeScript, TailwindCSS\n• Backend: Node.js, Express.js, REST APIs, Prisma, PostgreSQL, WebSocket\n• AI/ML: YOLOv8, OpenAI CLIP, ByteTrack, Computer Vision\n• Tools: Git, Jest, CI/CD, Atlassian Forge, Agile/Scrum\n• Security: CSRF, Rate Limiting, XSS/SQL Injection Prevention\n\nHe specializes in building production-ready applications with 70%+ test coverage.";
  }

  if (lowerMessage.includes("education") || lowerMessage.includes("study") || lowerMessage.includes("university") || lowerMessage.includes("unsw")) {
    return "Melvin's Education:\n\n• Bachelor of Science in Computer Science\n  University of New South Wales (UNSW)\n  2023 – 2025 | Sydney, Australia\n\n• Diploma in Computer Science\n  UNSW College\n  2022 – 2023 | Sydney, Australia\n\nNotable: 1st Place Winner at CSESoc 2025 Flagship Hackathon!";
  }

  if (lowerMessage.includes("project") || lowerMessage.includes("portfolio")) {
    return "Melvin's Notable Projects:\n\n• OnlyCode - 1st place hackathon winner, real-time collaborative coding platform\n• RateMyAccom NSW - Student accommodation reviews with 70%+ test coverage\n• Jalanlytics - ML pipeline using YOLOv8 for vehicle detection\n• Stale Page Hunter - AI-powered Confluence app for Codegeist 2025\n• PPIA UNSW Platform - LinkedIn-style networking for 500+ students\n\nAll projects available on GitHub: github.com/MelvinDY";
  }

  if (lowerMessage.includes("onlycode") || lowerMessage.includes("hackathon")) {
    return "OnlyCode - 1st Place CSESoc 2025 Hackathon:\n\n• Real-time collaborative coding platform with WebSocket (<100ms latency)\n• Skill-based matchmaking algorithm pairing users with helpers\n• Gamification: XP tracking, badges, leaderboards\n• Built with React, TypeScript, Node.js, WebSocket\n\nWon among 50+ competing teams!\n\nGitHub: github.com/MelvinDY/OnlyCode";
  }

  if (lowerMessage.includes("experience") || lowerMessage.includes("work") || lowerMessage.includes("lead")) {
    return "Work Experience:\n\n• Frontend Lead | PPIA UNSW IT Team (Aug-Nov 2025)\n  - Led 10-person cross-functional team\n  - Established Agile workflows with daily standups\n  - Architected React/TypeScript frontend\n  - Mentored 4 junior developers\n  - Delivered 15+ feature enhancements\n\nAlso working on Confluence Q&A Helper for UNSW x Atlassian client project.";
  }

  if (lowerMessage.includes("contact") || lowerMessage.includes("reach") || lowerMessage.includes("email") || lowerMessage.includes("hire")) {
    return "Contact Melvin:\n\n• Email: melvindarialyogiana@gmail.com\n• LinkedIn: linkedin.com/in/melvin-yogiana\n• GitHub: github.com/MelvinDY\n• Portfolio: melvindy.vercel.app\n\nHe's actively seeking software engineering roles in Sydney or remote positions. Feel free to reach out!";
  }

  if (lowerMessage.includes("location") || lowerMessage.includes("where") || lowerMessage.includes("based")) {
    return "Melvin is originally from Indonesia and currently based in Sydney, Australia. He's studying at UNSW and is open to:\n\n• On-site roles in Sydney\n• Remote positions\n• Hybrid arrangements\n\nContact: melvindarialyogiana@gmail.com";
  }

  if (lowerMessage.includes("ml") || lowerMessage.includes("machine learning") || lowerMessage.includes("ai") || lowerMessage.includes("python")) {
    return "Melvin's AI/ML Experience:\n\n• Jalanlytics Project:\n  - ML pipeline analyzing CCTV footage\n  - YOLOv8 object detection + ByteTrack\n  - OpenAI CLIP for zero-shot classification\n  - Identifies 50+ vehicle makes/models\n\n• Stale Page Hunter:\n  - Rovo AI for NLP processing\n  - Automated documentation analysis\n\nTech: Python, YOLOv8, OpenAI CLIP, ByteTrack";
  }

  if (lowerMessage.includes("atlassian") || lowerMessage.includes("forge") || lowerMessage.includes("confluence") || lowerMessage.includes("jira")) {
    return "Melvin's Atlassian Experience:\n\n• Stale Page Hunter (Codegeist 2025)\n  - AI-powered Confluence app using Rovo AI\n  - Space Health Dashboard with A-F grading\n  - Built with Atlassian Forge, UI Kit 2\n\n• Confluence Q&A Helper (UNSW x Atlassian)\n  - Enterprise Q&A system for live events\n  - Upvoting, moderation, presenter dashboards";
  }

  // Default response
  return "Hi! I'm Melvin's AI assistant.\n\nMelvin is a Frontend-focused Software Developer from Indonesia, currently in Sydney. Key highlights:\n\n• 1st Place - CSESoc 2025 Hackathon\n• Frontend Lead - Led 10-person team at PPIA UNSW\n• Skills: React, TypeScript, Next.js, Node.js, Python\n• Education: BSc Computer Science @ UNSW (2023-2025)\n\nAsk me about his skills, projects, experience, or education!\n\nContact: melvindarialyogiana@gmail.com";
}
