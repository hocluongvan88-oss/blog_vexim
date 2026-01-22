import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { to, subject, html, from } = await request.json()

    // Create Zoho transporter - Using existing Vercel env variables
    const host = process.env.MAIL_HOST || process.env.SMTP_HOST || "smtp.zoho.com"
    const port = Number.parseInt(process.env.MAIL_PORT || process.env.SMTP_PORT || "587", 10)
    const user = process.env.MAIL_USERNAME || process.env.SMTP_USER
    const pass = process.env.MAIL_PASSWORD || process.env.SMTP_PASSWORD
    
    // Port 587 uses TLS, port 465 uses SSL
    const secure = port === 465
    
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    })

    // Send email
    const info = await transporter.sendMail({
      from: `${from.name} <${from.email}>`,
      to,
      subject,
      html,
    })

    console.log("[v0] Email sent via Zoho SMTP:", info.messageId)

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("[v0] SMTP Error:", error)
    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
