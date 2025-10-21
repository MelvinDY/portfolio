import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'

// Validate environment variables
const RESEND_API_KEY = process.env.RESEND_API_KEY
const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'
const TO_EMAIL = process.env.TO_EMAIL!

if (!RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY environment variable is not set')
}

if (!TO_EMAIL) {
  throw new Error('TO_EMAIL environment variable is not set')
}

const resend = new Resend(RESEND_API_KEY)

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
    .max(5000, "Message is too long")
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

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

    // Escape HTML to prevent injection in email
    const escapeHtml = (str: string) => {
      return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;')
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
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

    console.log('Email sent successfully:', data)
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