import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import { clientIp, rateLimit } from '@/app/lib/rate-limit'

export const runtime = 'nodejs'

/** Submissions accepted per caller per hour. */
const HOURLY_LIMIT = 3
const HOUR_MS = 60 * 60 * 1000

// Contact form validation schema
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long"),
  email: z.string()
    .email("Please provide a valid email address")
    .max(254, "Email is too long") // RFC 5321
    .refine((email) => {
      // Additional check to prevent email header injection
      return !email.includes('\n') && !email.includes('\r')
    }, "Invalid email format"),
  message: z.string()
    .min(1, "Message is required")
    .max(5000, "Message is too long"),
  // NOTE: the `company` honeypot is deliberately *not* validated here. A schema
  // rule would reject it with a field-specific 400, which tells a bot exactly
  // which input to drop on the retry. It's checked off the raw body instead and
  // answered with a fake success.
})

const escapeHtml = (str: string) =>
  str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')

export async function POST(request: NextRequest) {
  // Env is read per-request, not at module load. A missing key must degrade to
  // a handled 503 -- throwing at import time takes the whole route module down
  // (every request 500s) and breaks `next build` on machines without secrets.
  const RESEND_API_KEY = process.env.RESEND_API_KEY
  const TO_EMAIL = process.env.TO_EMAIL
  const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'

  if (!RESEND_API_KEY || !TO_EMAIL) {
    console.error('[email] RESEND_API_KEY or TO_EMAIL is not set')
    return NextResponse.json(
      { error: "The contact form is unavailable right now. Please email melvindarialyogiana@gmail.com directly." },
      { status: 503 }
    )
  }

  try {
    const body = await request.json()

    // Honeypot first, so a bot gets an indistinguishable success no matter what
    // else is wrong with its payload.
    if (typeof body?.company === 'string' && body.company.length > 0) {
      console.warn('[email] honeypot tripped, dropping submission')
      return NextResponse.json({
        message: "Thanks for your message! I'll get back to you soon.",
      })
    }

    // Validate input with zod
    const validationResult = contactFormSchema.safeParse(body)

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0]
      return NextResponse.json(
        { error: firstError.message },
        { status: 400 }
      )
    }

    const { name, email, message } = validationResult.data

    const limit = await rateLimit({
      scope: 'email',
      ip: clientIp(request.headers),
      limit: HOURLY_LIMIT,
      windowMs: HOUR_MS,
    })

    if (!limit.allowed) {
      return NextResponse.json(
        { error: "You've sent a few messages already. Please try again later, or email melvindarialyogiana@gmail.com directly." },
        { status: 429 }
      )
    }

    // Send email using Resend
    const { data, error } = await new Resend(RESEND_API_KEY).emails.send({
      from: FROM_EMAIL,
      to: [TO_EMAIL],
      subject: `Portfolio Contact: Message from ${escapeHtml(name)}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            New Portfolio Contact Form Submission
          </h2>
          <div style="background: #f8f9fa; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${escapeHtml(email)}</p>
          </div>
          <div style="margin: 20px 0;">
            <h3 style="color: #333;">Message:</h3>
            <p style="background: white; padding: 15px; border-left: 4px solid #007bff; margin: 10px 0;">
              ${escapeHtml(message).replace(/\n/g, '<br>')}
            </p>
          </div>
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 12px;">
            This email was sent from your portfolio contact form.
          </p>
        </div>
      `,
      text: `
New Portfolio Contact Form Submission

Name: ${name}
Email: ${email}

Message:
${message}

---
This email was sent from your portfolio contact form.
      `.trim(),
      replyTo: email,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: "Failed to send email. Please try again." },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', data?.id)
    return NextResponse.json({
      message: "Thanks for your message! I'll get back to you soon.",
    })

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: "Failed to send email. Please try again." },
      { status: 500 }
    )
  }
}
