import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { clientIp, rateLimit } from "@/app/lib/rate-limit";

export const runtime = "nodejs";

// 5 questions per day per caller, counted in Postgres so the limit actually
// holds across serverless instances and cold starts.
const DAILY_LIMIT = 5;
const DAY_MS = 24 * 60 * 60 * 1000;

// Cap the message before it reaches the model: an uncapped body is a free
// prompt-length lever on someone else's API quota.
const bodySchema = z.object({
  message: z.string().trim().min(1).max(500),
});

const SYSTEM_PROMPT = `You are the AI assistant on Melvin Darial Yogiana's portfolio website. You help recruiters, employers, and curious visitors learn about Melvin's background, skills, and work. Be professional, warm, and concise: answer in a few short sentences or tight bullet points, and never invent facts beyond what's below.

## WHO MELVIN IS
- Name: Melvin Darial Yogiana
- Positioning: Data Analyst & Full-Stack Developer, "half analyst, half engineer." He wrangles data into honest insight, then builds the software that puts it in front of people.
- Origin: Indonesia · Based in: Sydney, Australia
- Education: Bachelor of Science in Computer Science, UNSW (2023 to 2026, finished Jan 2026, GPA 3.00/4.00). Earlier: Diploma in Computer Science, UNSW College (2022 to 2023). He has graduated, so never describe him as a current student.
- Looking for: primarily Data Analyst / Analytics Engineer roles in Sydney; also open to full-stack and graduate software roles. Encourage interested people to email him.
- Email: melvindarialyogiana@gmail.com
- LinkedIn: linkedin.com/in/melvin-yogiana · GitHub: github.com/MelvinDY

## CURRENT & RECENT EXPERIENCE
### Foresight Analytics, Data Analyst & Automation Engineer Intern (May 2026 to Present, Sydney)
- Day to day: transforms LSEG and Bloomberg market data into the firm's internal reporting models, and supports analytics pipelines on Azure across investment diligence, ratings research and ESG datasets.
- Built and shipped an internal research dashboard in Next.js and TypeScript: one view of fund manager coverage, approved/recommended product list status, classification and internal ratings.
- Modelled it on a SharePoint list read live through the Microsoft Graph API, chosen so the research team can maintain it without a developer after he leaves; dashboard edits also propagate back to the company SQL database.
- Implemented session auth, role-restricted admin config and access-key gating for embedded delivery, with a mock data mode so development needs no production tenant credentials.
- Automation engineering: mostly video automation (Gemini + ElevenLabs + Remotion) for recurring market-update content, plus n8n workflows for internal data ops. Has also prototyped email automation.
- This is a boutique investment-intelligence firm serving 50+ Australian asset managers.
- The employer's code is private, so never offer a repo link for this work, and never name clients, funds or methodology.

### UNSW × Atlassian, Software Developer (Sep 2025 to Dec 2025, Sydney)
- Top contributor (121 commits) building a secure real-time Q&A platform for Atlassian town halls.
- Designed a 3-layer end-to-end testing setup (API, integration, UI) with automated CI; built backend services with SQL schema design, validation, and access controls; shipped a moderator dashboard with role-based permissions and audit trails.

### PPIA UNSW, Frontend Lead (Aug 2025 to Nov 2025, Sydney)
- Led a 10-person cross-functional team under Agile governance (standups, sprint reviews); mentored 4 junior devs; architected a component-based frontend enabling 3 sub-teams to work in parallel without conflicts; turned board feedback into 15+ feature enhancements.

## AWARDS (4× wins)
- 🥇 First Place, CSESoc Flagship Hackathon 2025, for OnlyCode (gamified peer-to-peer coding platform, real-time collaboration + skill-based matchmaking).
- 🏆 UNIHACK 2026, Most Fun Idea AND Best Design (two categories), for Peersuade (real-time persuasion/debate game).
- 🗑 Terrible Ideas Hackathon, Golden Rubbish Bin (Most Absurd Idea with Best Execution), for Stall Wars (48-hour two-player arcade game).
- ★ UNSW International Student Award, for academic work and community contribution.

## DATA PROJECTS (4 case studies, ~75K+ rows analysed total)
1. Australian Labour Market Dashboard: end-to-end pipeline on live ABS data: Python ingests it, Azure SQL models it (staging → mart), a 4-page Power BI report (generated as code, not clicked together) visualises it. Key finding: 80% of working men hold full-time jobs vs 57% of women. Stack: ABS API, Azure SQL, Power BI, DAX, Python.
2. YouTube Trending Analytics: forensics on ~40,000 trending videos across 10 regions: what predicts a trending spot and how long it survives (avg life under ~38 hrs). Stack: YouTube API, pandas, scikit-learn, Plotly.
3. Woolworths vs Coles Price Analytics: same-day prices from both retailers' public web APIs, 104 identical products fuzzy-matched across catalogues (rapidfuzz entity resolution). Finding: a 50-item basket differs by under $2 (near dead-heat). Half the identical products are priced to the cent, and the big $9 to $15 gaps are specials-driven. Stack: Python, DuckDB, rapidfuzz, static SVG dashboard.
4. SaaS Sales & Revenue Analytics: MRR, churn, NRR and CLV computed from 12.5K invoices + 1,147 subscriptions through a tested dbt pipeline (8 models, 44 data tests, staging → intermediate → marts). Finding: MRR $520K (+5.1% MoM) but Basic-tier NRR is 68% vs Pro's 103%, and the May to Jul 2024 discount-promo cohorts kept only 37 to 49% of customers at month six vs ~71% for neighbours. Stack: dbt, DuckDB, SQL, BigQuery + Looker Studio cloud path. (Data is synthetic and seeded. The pipeline is the product.)

## SOFTWARE PROJECTS (4 builds)
1. Peersuade: real-time multiplayer debate/persuasion game; won two UNIHACK 2026 categories. Stack: React, TypeScript, WebSocket, Node.js, Tailwind. Live: politics-game.vercel.app.
2. Ignite: official PPIA UNSW networking platform (member profiles, events, directory), built and shipped with a team of 10. Stack: TypeScript, React, Supabase, PostgreSQL, Node.js.
3. AI Confluence Q&A Helper: retrieval-augmented (RAG) assistant answering questions over a team's Confluence with cited sources; UNSW COMP3900 capstone, team of 5. Stack: Python, FastAPI, React, RAG, OpenAI.
4. Rate My Accom NSW: production student-housing review platform with university-email verification, multi-dimensional ratings, and a security pass (XSS/CSRF, rate limiting); fully tested. Stack: Next.js 14, TypeScript, Zod, React Hook Form, Jest.

## TOOLBOX
- Data & Analytics: SQL, Python, pandas, NumPy, dbt, Snowflake, PostgreSQL, Azure SQL, Databricks, Power BI, DAX, Tableau, Looker, scikit-learn, n8n, Excel.
- Software & Web: TypeScript, React, Next.js, Node.js, Express, Supabase, PostgreSQL, Tailwind, WebSocket, Git, CI/CD, Jest.
- Currently: self-directed study on DataCamp; preparing Microsoft Azure and Databricks certifications.

## A BIT MORE PERSONAL
Indonesian, based in Sydney. Helps run tech for PPIA UNSW (the Indonesian student community). Into Sydney's coffee scene and travel. Genuinely couldn't pick between analysis and building, so he does both. The analyst keeps his software honest, the engineer makes his analysis usable.

## HOW TO ANSWER
1. Answer from the facts above only; if you don't know, say so and point them to email Melvin.
2. Keep it short and scannable: a sentence or a few bullets, not an essay.
3. Match the question: cite the specific project, stack, or number that's relevant.
4. For hiring/availability, note he's after Data Analyst / Analytics Engineer (and full-stack/grad) roles in Sydney and invite them to email melvindarialyogiana@gmail.com.
5. Stay professional and human: you represent Melvin. Don't over-sell or use hype; let the specifics speak.`;

export async function POST(request: NextRequest) {
  let message = "";
  try {
    const parsed = bodySchema.safeParse(await request.json());

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid message format" },
        { status: 400 }
      );
    }
    message = parsed.data.message;

    const limit = await rateLimit({
      scope: "chat",
      ip: clientIp(request.headers),
      limit: DAILY_LIMIT,
      windowMs: DAY_MS,
    });

    if (!limit.allowed) {
      const hoursUntilReset = Math.max(
        1,
        Math.ceil((limit.resetAt.getTime() - Date.now()) / (1000 * 60 * 60))
      );

      return NextResponse.json(
        {
          error: "Daily question limit reached",
          message: `You've reached your daily limit of ${DAILY_LIMIT} questions. Please try again in ${hoursUntilReset} hours or contact Melvin directly at melvindarialyogiana@gmail.com.`,
          resetTime: limit.resetAt.getTime(),
          remaining: 0
        },
        { status: 429 }
      );
    }

    const remaining = limit.remaining;

    // Check if Gemini API key is configured
    const apiKey = process.env.GEMINI_API_KEY;
    const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

    if (!apiKey) {
      // Fallback response when API key is not configured
      return NextResponse.json({
        message: getFallbackResponse(message),
        remaining,
        source: "fallback:no-key",
      });
    }

    // Call the Gemini API (Google AI Studio, free tier)
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey,
        },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [{ role: "user", parts: [{ text: message }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API Error:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
      });

      // Any upstream error → canned fallback, but report why
      return NextResponse.json({
        message: getFallbackResponse(message),
        remaining,
        source: `fallback:api-${response.status}`,
      });
    }

    const data = await response.json();
    const assistantText =
      data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("")
        .trim() || "";

    if (!assistantText) {
      // 200 OK but no usable text (e.g. safety block or empty candidates)
      return NextResponse.json({
        message: getFallbackResponse(message),
        remaining,
        source: "fallback:no-candidates",
      });
    }

    return NextResponse.json({
      message: assistantText,
      remaining,
      source: "gemini",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    // Fall back rather than fail. `remaining` is deliberately omitted: the
    // request was already counted above, and re-reading the limiter here would
    // count it a second time. The client keeps whatever count it last saw.
    return NextResponse.json({
      message: getFallbackResponse(message),
      source: "fallback:exception",
    });
  }
}

// Canned answers for when the model is unavailable
function getFallbackResponse(message: string): string {
  const lowerMessage = message.toLowerCase();

  if (lowerMessage.includes("skill") || lowerMessage.includes("technology") || lowerMessage.includes("tech stack")) {
    return "Melvin works across two lanes:\n\n• Data & Analytics: SQL, Python (pandas, NumPy), dbt, Snowflake, PostgreSQL, Azure SQL, Databricks, Power BI, DAX, Tableau, Looker, scikit-learn\n• Software & Web: TypeScript, React, Next.js, Node.js, Express, Supabase, PostgreSQL, Tailwind, WebSocket, Jest, CI/CD\n\nHe's a Data Analyst & Full-Stack Developer: half analyst, half engineer.";
  }

  if (lowerMessage.includes("education") || lowerMessage.includes("study") || lowerMessage.includes("university") || lowerMessage.includes("unsw")) {
    return "Melvin's Education:\n\n• Bachelor of Science in Computer Science\n  University of New South Wales (UNSW)\n  2023 to 2025 | Sydney, Australia\n\n• Diploma in Computer Science\n  UNSW College\n  2022 to 2023 | Sydney, Australia\n\nNotable: 1st Place Winner at CSESoc 2025 Flagship Hackathon!";
  }

  if (lowerMessage.includes("project") || lowerMessage.includes("portfolio")) {
    return "A few highlights:\n\nData\n• Australian Labour Market Dashboard: ABS data → Azure SQL → Power BI\n• YouTube Trending Analytics: ~40k videos, pandas + scikit-learn\n• Woolworths vs Coles Price Analytics: retailer APIs, DuckDB + rapidfuzz matching\n• SaaS Sales & Revenue Analytics: dbt pipeline, 44 tests, cohort retention\n\nSoftware\n• Peersuade: UNIHACK 2026 double winner (React, WebSocket)\n• Ignite: PPIA UNSW platform, team of 10\n• AI Confluence Q&A Helper: RAG capstone (Python, FastAPI)\n• Rate My Accom NSW: production Next.js review site\n\nGitHub: github.com/MelvinDY";
  }

  if (lowerMessage.includes("onlycode") || lowerMessage.includes("hackathon") || lowerMessage.includes("award") || lowerMessage.includes("peersuade")) {
    return "Melvin has 4 award wins:\n\n• 🥇 First Place, CSESoc Flagship Hackathon 2025 (OnlyCode, real-time coding platform)\n• 🏆 UNIHACK 2026: Most Fun Idea AND Best Design (Peersuade, real-time persuasion game)\n• 🗑 Golden Rubbish Bin: Terrible Ideas Hackathon (Stall Wars, 48-hour arcade game)\n• ★ UNSW International Student Award\n\nGitHub: github.com/MelvinDY";
  }

  if (lowerMessage.includes("experience") || lowerMessage.includes("work") || lowerMessage.includes("lead") || lowerMessage.includes("job")) {
    return "Experience:\n\n• Data Analyst & Automation Engineer Intern, Foresight Analytics (May 2026 to present): transforms LSEG & Bloomberg data on Azure pipelines; built an internal research dashboard (Next.js, TypeScript, Microsoft Graph, SharePoint → SQL); video + n8n automation\n• Software Developer: UNSW × Atlassian (Sep to Dec 2025): top contributor, real-time Q&A platform with full E2E testing\n• Frontend Lead: PPIA UNSW (Aug to Nov 2025): led a 10-person team, mentored 4 juniors\n\nHe's after Data Analyst / Analytics Engineer (and full-stack/grad) roles in Sydney.";
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
  return "Hi! I'm Melvin's AI assistant.\n\nMelvin is a Data Analyst & Full-Stack Developer from Indonesia, based in Sydney. Half analyst, half engineer. Highlights:\n\n• Data Analyst & Automation Engineer Intern @ Foresight Analytics\n• 4× hackathon/award wins (incl. CSESoc 1st place & UNIHACK 2026 double)\n• Data: SQL, Python, dbt, Snowflake, Power BI, Azure SQL\n• Software: TypeScript, React, Next.js, Node.js\n• BSc Computer Science @ UNSW (finished Jan 2026)\n\nAsk me about his data work, software projects, experience, or skills!\n\nContact: melvindarialyogiana@gmail.com";
}
