// Email Service for FDA Alerts using Zoho SMTP
// Alternative to Resend API - uses standard SMTP

import { createServerClient } from "@/lib/supabase-server"
import {
  getVerificationEmailHTML,
  getAlertEmailHTML,
  getImmediateAlertEmailHTML,
  getUnsubscribeEmailHTML,
} from "@/lib/email-templates"
import type { FDAItem } from "@/types/fda"

// Zoho SMTP Configuration - Using existing Vercel env variables
const SMTP_HOST = process.env.MAIL_HOST || process.env.SMTP_HOST || "smtp.zoho.com"
const SMTP_PORT = Number.parseInt(process.env.MAIL_PORT || process.env.SMTP_PORT || "587", 10)
const SMTP_USER = process.env.MAIL_USERNAME || process.env.SMTP_USER || "" // your-email@veximglobal.com
const SMTP_PASSWORD = process.env.MAIL_PASSWORD || process.env.SMTP_PASSWORD || "" // your Zoho password
const FROM_EMAIL = process.env.MAIL_FROM_ADDRESS || process.env.FROM_EMAIL || "contact@veximglobal.com"
const FROM_NAME = process.env.MAIL_FROM_NAME || process.env.FROM_NAME || "VEXIM GLOBAL"
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://vexim.vn"

export class EmailServiceZoho {
  // Send verification email
  async sendVerificationEmail(email: string, token: string) {
    try {
      const verificationLink = `${BASE_URL}/api/fda/verify?email=${encodeURIComponent(email)}&token=${token}`
      const unsubscribeLink = `${BASE_URL}/api/fda/subscribe?email=${encodeURIComponent(email)}&token=${token}`

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
  async sendAlertDigest(frequency: "daily" | "weekly") {
    try {
      const supabase = await createServerClient()

      // Get active subscribers with this frequency
      const { data: subscribers, error } = await supabase
        .from("fda_subscriptions")
        .select("*")
        .eq("is_active", true)
        .eq("verified", true)
        .eq("frequency", frequency)

      if (error || !subscribers || subscribers.length === 0) {
        console.log(`[v0] No active ${frequency} subscribers found`)
        return
      }

      console.log(`[v0] Sending ${frequency} digest to ${subscribers.length} subscribers`)

      // Get latest alerts from cache or FDA API
      const alerts = await this.getLatestAlerts()

      // Send to each subscriber
      for (const subscriber of subscribers) {
        try {
          // Filter alerts by subscriber's categories
          const filteredAlerts = alerts.filter((alert) => subscriber.categories.includes(alert.category))

          if (filteredAlerts.length === 0) {
            continue
          }

          const unsubscribeLink = `${BASE_URL}/api/fda/subscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.verification_token}`

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

          console.log(`[v0] Sent ${frequency} digest to ${subscriber.email}`)
        } catch (error) {
          console.error(`[v0] Error sending to ${subscriber.email}:`, error)
        }
      }

      console.log(`[v0] Completed ${frequency} digest sending`)
    } catch (error) {
      console.error(`[v0] Error in sendAlertDigest ${frequency}:`, error)
    }
  }

  // Send immediate alert for critical items
  async sendImmediateAlert(alert: FDAItem) {
    try {
      const supabase = await createServerClient()

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
          const unsubscribeLink = `${BASE_URL}/api/fda/subscribe?email=${encodeURIComponent(subscriber.email)}&token=${subscriber.verification_token}`

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

  // Core email sending function using Zoho SMTP
  private async sendEmail({
    to,
    subject,
    html,
  }: {
    to: string
    subject: string
    html: string
  }): Promise<boolean> {
    try {
      // If SMTP credentials not set, log email instead (dev mode)
      if (!SMTP_USER || !SMTP_PASSWORD) {
        console.log("[v0] [DEV MODE] Email would be sent:")
        console.log(`  To: ${to}`)
        console.log(`  Subject: ${subject}`)
        console.log(`  HTML length: ${html.length} chars`)
        return true
      }

      // Use Nodemailer via API route to avoid bundling issues
      const response = await fetch(`${BASE_URL}/api/send-email-smtp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to,
          subject,
          html,
          from: {
            name: FROM_NAME,
            email: FROM_EMAIL,
          },
        }),
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`SMTP API error: ${response.status} ${errorText}`)
      }

      const data = await response.json()
      console.log(`[v0] Email sent successfully via Zoho SMTP:`, data)
      return true
    } catch (error) {
      console.error("[v0] Error sending email via Zoho:", error)
      throw error
    }
  }

  // Helper: Get latest alerts (from cache or API)
  private async getLatestAlerts(): Promise<FDAItem[]> {
    try {
      const supabase = await createServerClient()

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
