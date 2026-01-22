import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { to, subject, html, from } = await request.json()

    // Create Zoho transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.zoho.com",
      port: Number.parseInt(process.env.SMTP_PORT || "465", 10),
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
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
