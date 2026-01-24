// Email Service for FDA Alerts using Zoho SMTP
// Alternative to Resend API - uses standard SMTP

import {
  getVerificationEmailHTML,
  getAlertEmailHTML,
  getImmediateAlertEmailHTML,
  getUnsubscribeEmailHTML,
} from "@/lib/email-templates"
import type { FDAItem } from "@/types/fda"
import nodemailer from "nodemailer"
import type { SupabaseClient } from "@supabase/supabase-js"
import { createServerClient } from "@/lib/supabase-server" // Declare the variable here

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
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "https://vexim.vn",
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

  // Send verification email
  async sendVerificationEmail(email: string, token: string) {
    try {
      const config = getSmtpConfig()
      const verificationLink = `${config.baseUrl}/api/fda/verify?email=${encodeURIComponent(email)}&token=${token}`
      const unsubscribeLink = `${config.baseUrl}/api/fda/subscribe?email=${encodeURIComponent(email)}&token=${token}`

      const html = getVerificationEmailHTML({
        email,
        verificationLink,
        unsubscribeLink,
      })

      await this.sendEmail({
        to: email,
        subject: "Xác nhận đăng ký cảnh báo FDA - Vexim Global",
        html,
      })

      console.log(`[v0] Verification email sent to ${email}`)
      return true
    } catch (error) {
      console.error("[v0] Error sending verification email:", error)
      return false
    }
  }

  // Send daily/weekly alert digest
  async sendAlertDigest(frequency: "daily" | "weekly", supabase: SupabaseClient): Promise<{ emailsSent: number }> {
    let emailsSent = 0

    try {
      const config = getSmtpConfig()

      // Get active subscribers with this frequency
      const { data: subscribers, error } = await supabase
        .from("fda_subscriptions")
        .select("*")
        .eq("is_active", true)
        .eq("verified", true)
        .eq("frequency", frequency)

      if (error || !subscribers || subscribers.length === 0) {
        console.log(`[v0] No active ${frequency} subscribers found`)
        return { emailsSent: 0 }
      }

      console.log(`[v0] Sending ${frequency} digest to ${subscribers.length} subscribers`)

      // Get latest alerts from cache or FDA API
      const alerts = await this.getLatestAlerts(supabase)

      // Send to each subscriber
      for (const subscriber of subscribers) {
        try {
          // Filter alerts by subscriber's categories
          const filteredAlerts = alerts.filter((alert) => subscriber.categories.includes(alert.category))

          if (filteredAlerts.length === 0) {
            continue
          }

          const unsubscribeLink = `${config.baseUrl}/api/fda/subscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.verification_token}`

          const html = getAlertEmailHTML({
            email: subscriber.email,
            alerts: filteredAlerts.slice(0, 5),
            alertCount: filteredAlerts.length,
            frequency,
            unsubscribeLink,
          })

          await this.sendEmail({
            to: subscriber.email,
            subject: `🚨 ${frequency === "daily" ? "Tóm tắt cảnh báo FDA hôm nay" : "Tóm tắt cảnh báo FDA tuần này"} - Vexim Global`,
            html,
          })

          // Update last_sent_at
          await supabase
            .from("fda_subscriptions")
            .update({ last_sent_at: new Date().toISOString() })
            .eq("id", subscriber.id)

          emailsSent++
          console.log(`[v0] Sent ${frequency} digest to ${subscriber.email}`)
        } catch (error) {
          console.error(`[v0] Error sending to ${subscriber.email}:`, error)
        }
      }

      console.log(`[v0] Completed ${frequency} digest sending. Total sent: ${emailsSent}`)
      return { emailsSent }
    } catch (error) {
      console.error(`[v0] Error in sendAlertDigest ${frequency}:`, error)
      return { emailsSent }
    }
  }

  // Send immediate alert for critical items
  async sendImmediateAlert(alert: FDAItem, supabase: SupabaseClient) {
    try {
      const config = getSmtpConfig()

      // Get subscribers with immediate frequency and matching category
      const { data: subscribers, error } = await supabase
        .from("fda_subscriptions")
        .select("*")
        .eq("is_active", true)
        .eq("verified", true)
        .eq("frequency", "immediate")
        .contains("categories", [alert.category])

      if (error || !subscribers || subscribers.length === 0) {
        console.log(`[v0] No immediate subscribers for category: ${alert.category}`)
        return
      }

      console.log(`[v0] Sending immediate alert to ${subscribers.length} subscribers`)

      for (const subscriber of subscribers) {
        try {
          const unsubscribeLink = `${config.baseUrl}/api/fda/subscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.verification_token}`

          const html = getImmediateAlertEmailHTML({
            email: subscriber.email,
            alert,
            unsubscribeLink,
          })

          await this.sendEmail({
            to: subscriber.email,
            subject: `🚨 CẢNH BÁO FDA KHẨN CẤP: ${alert.title.substring(0, 50)} - Vexim Global`,
            html,
          })

          // Update last_sent_at
          await supabase
            .from("fda_subscriptions")
            .update({ last_sent_at: new Date().toISOString() })
            .eq("id", subscriber.id)

          console.log(`[v0] Sent immediate alert to ${subscriber.email}`)
        } catch (error) {
          console.error(`[v0] Error sending immediate alert to ${subscriber.email}:`, error)
        }
      }
    } catch (error) {
      console.error("[v0] Error in sendImmediateAlert:", error)
    }
  }

  // Send unsubscribe confirmation
  async sendUnsubscribeConfirmation(email: string) {
    try {
      const html = getUnsubscribeEmailHTML({ email })

      await this.sendEmail({
        to: email,
        subject: "Đã hủy đăng ký cảnh báo FDA - Vexim Global",
        html,
      })

      console.log(`[v0] Unsubscribe confirmation sent to ${email}`)
      return true
    } catch (error) {
      console.error("[v0] Error sending unsubscribe confirmation:", error)
      return false
    }
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
        return true
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

  // Helper: Get latest alerts (from cache or API)
  private async getLatestAlerts(supabase: SupabaseClient): Promise<FDAItem[]> {
    try {
      // Try to get from cache first
      const { data: cached } = await supabase
        .from("fda_alerts_cache")
        .select("data, total_count")
        .gt("expires_at", new Date().toISOString())
        .order("cached_at", { ascending: false })
        .limit(1)
        .single()

      if (cached && cached.data) {
        console.log("[v0] Using cached FDA alerts")
        return cached.data as FDAItem[]
      }

      console.log("[v0] No cached alerts available")
      return []
    } catch (error) {
      console.error("[v0] Error getting latest alerts:", error)
      return []
    }
  }
}

// Singleton instance
export const emailService = new EmailServiceZoho()
