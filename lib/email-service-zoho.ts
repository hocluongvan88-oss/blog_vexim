import { PUBLIC_EMAIL } from "@/lib/business-profile"
// Zoho SMTP sender shared by consultation, GACC, FDA-registration and
// chatbot notifications. Uses standard SMTP instead of a hosted API.
import nodemailer from "nodemailer"

// Zoho SMTP Configuration - Using existing Vercel env variables
// Read at runtime to ensure env vars are available
function getSmtpConfig() {
  console.log("[v0] Reading env vars:")
  console.log("[v0] MAIL_USERNAME:", process.env.MAIL_USERNAME ? `${process.env.MAIL_USERNAME.substring(0, 3)}***` : "undefined")
  console.log("[v0] MAIL_PASSWORD:", process.env.MAIL_PASSWORD ? `${process.env.MAIL_PASSWORD.substring(0, 2)}*** (length: ${process.env.MAIL_PASSWORD.length})` : "undefined")
  console.log("[v0] MAIL_HOST:", process.env.MAIL_HOST || "undefined")
  console.log("[v0] MAIL_PORT:", process.env.MAIL_PORT || "undefined")
  
  return {
    host: process.env.MAIL_HOST || process.env.SMTP_HOST || "smtp.zoho.com",
    port: Number.parseInt(process.env.MAIL_PORT || process.env.SMTP_PORT || "587", 10),
    user: process.env.MAIL_USERNAME || process.env.SMTP_USER || "",
    password: process.env.MAIL_PASSWORD || process.env.SMTP_PASSWORD || "",
    fromEmail: process.env.MAIL_FROM_ADDRESS || process.env.FROM_EMAIL || "contact@veximglobal.com",
    fromName: process.env.MAIL_FROM_NAME || process.env.FROM_NAME || "VEXIM GLOBAL",
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://www.veximglobal.com",
  }
}

export class EmailServiceZoho {
  private getTransporter() {
    const config = getSmtpConfig()
    console.log("[v0] Creating transporter with config:", {
      host: config.host,
      port: config.port,
      user: config.user ? "configured" : "not configured",
      password: config.password ? `configured (length: ${config.password.length})` : "not configured",
    })
    
    if (!config.user || !config.password) {
      return null
    }
    
    return nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465, // true for 465, false for other ports
      auth: {
        user: config.user,
        pass: config.password,
      },
      tls: {
        // Required for Zoho SMTP
        ciphers: 'SSLv3',
        rejectUnauthorized: false,
      },
      requireTLS: true, // Force TLS
      connectionTimeout: 10000, // 10 seconds timeout
      greetingTimeout: 10000,
      socketTimeout: 10000,
    })
  }

  // Core email sending function using Zoho SMTP with retry mechanism
  async sendEmail({
    to,
    subject,
    html,
    retryCount = 0,
  }: {
    to: string
    subject: string
    html: string
    retryCount?: number
  }): Promise<boolean> {
    const MAX_RETRIES = 3
    const RETRY_DELAY_MS = 2000

    try {
      const config = getSmtpConfig()
      console.log(`[v0] Starting email send process (attempt ${retryCount + 1}/${MAX_RETRIES + 1})...`)
      console.log(`[v0] SMTP Config: host=${config.host}, port=${config.port}`)
      console.log(`[v0] SMTP User configured: ${config.user ? "Yes" : "No"}`)
      console.log(`[v0] SMTP Password configured: ${config.password ? "Yes (length: " + config.password.length + ")" : "No"}`)
      
      // If SMTP credentials not set, log email instead (dev mode)
      if (!config.user || !config.password) {
        console.log("[v0] [DEV MODE] Email would be sent:")
        console.log(`  To: ${to}`)
        console.log(`  Subject: ${subject}`)
        console.log(`  HTML length: ${html.length} chars`)
        return false
      }

      const transporter = this.getTransporter()
      if (!transporter) {
        console.error("[v0] Failed to create transporter - credentials missing")
        return false
      }

      console.log("[v0] Sending email...")
      const info = await transporter.sendMail({
        from: `"${config.fromName}" <${config.fromEmail}>`,
        to,
        replyTo: PUBLIC_EMAIL,
        subject,
        html,
      })

      console.log(`[v0] Email sent successfully via Zoho SMTP!`)
      console.log(`[v0] Message ID: ${info.messageId}`)
      console.log(`[v0] Response: ${info.response}`)
      return true
    } catch (error) {
      console.error(`[v0] Error sending email via Zoho (attempt ${retryCount + 1}):`, error)
      if (error instanceof Error) {
        console.error("[v0] Error message:", error.message)
        console.error("[v0] Error stack:", error.stack)
      }

      // Retry logic with exponential backoff
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY_MS * Math.pow(2, retryCount)
        console.log(`[v0] Retrying email send in ${delay}ms... (${retryCount + 1}/${MAX_RETRIES})`)
        
        await new Promise(resolve => setTimeout(resolve, delay))
        
        return this.sendEmail({ to, subject, html, retryCount: retryCount + 1 })
      }

      // All retries exhausted - log failed email to database for manual retry
      await this.logFailedEmail(to, subject, error instanceof Error ? error.message : String(error))
      
      console.error("[v0] Failed to send email after all retries")
      throw error
    }
  }

  // Log failed emails to database for manual retry
  private async logFailedEmail(to: string, subject: string, errorMessage: string): Promise<void> {
    try {
      // Just log to console - database logging can be added by caller if needed
      console.error(`[v0] FAILED EMAIL - To: ${to}, Subject: ${subject}, Error: ${errorMessage}`)
    } catch (error) {
      console.error("[v0] Error logging failed email:", error)
    }
  }

}

// Singleton instance
export const emailService = new EmailServiceZoho()
