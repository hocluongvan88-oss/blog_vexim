import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import type { FDACategory } from "@/types/fda"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, categories, frequency } = body

    // Validation
    if (!email || !categories || !frequency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: "At least one category is required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Check if email already exists
    const { data: existing } = await supabase.from("fda_subscriptions").select("id").eq("email", email).single()

    if (existing) {
      // Update existing subscription
      const { error: updateError } = await supabase
        .from("fda_subscriptions")
        .update({
          categories,
          frequency,
          is_active: true,
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)

      if (updateError) {
        console.error("[v0] Error updating subscription:", updateError)
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
      }

      return NextResponse.json({
        success: true,
        message: "Subscription updated successfully",
      })
    }

    // Create new subscription
    const verificationToken = generateToken()

    const { error: insertError } = await supabase.from("fda_subscriptions").insert({
      email,
      categories,
      frequency,
      is_active: true,
      verified: false,
      verification_token: verificationToken,
    })

    if (insertError) {
      console.error("[v0] Error creating subscription:", insertError)
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
    }

    // Send verification email (using Zoho SMTP directly)
    try {
      console.log("[v0] Preparing to send verification email...")
      
      // Import nodemailer
      const nodemailer = await import("nodemailer")
      
      // Validate SMTP credentials
      if (!process.env.MAIL_USERNAME || !process.env.MAIL_PASSWORD) {
        console.error("[v0] SMTP credentials missing!")
        throw new Error("SMTP credentials not configured")
      }
      
      console.log("[v0] SMTP Config:", {
        host: process.env.MAIL_HOST || "smtp.zoho.com",
        port: process.env.MAIL_PORT || "587",
        user: process.env.MAIL_USERNAME ? "***configured***" : "MISSING",
      })
      
      // Create transporter
      const transporter = nodemailer.default.createTransport({
        host: process.env.MAIL_HOST || "smtp.zoho.com",
        port: Number.parseInt(process.env.MAIL_PORT || "587"),
        secure: false, // Use TLS
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        },
        tls: {
          rejectUnauthorized: false,
        },
      })
      
      const verificationLink = `${process.env.NEXT_PUBLIC_BASE_URL || "https://veximglobal.com"}/api/fda/verify?email=${encodeURIComponent(email)}&token=${verificationToken}`
      const unsubscribeLink = `${process.env.NEXT_PUBLIC_BASE_URL || "https://veximglobal.com"}/api/fda/subscribe?email=${encodeURIComponent(email)}&token=${verificationToken}`
      
      // Send verification email
      const info = await transporter.sendMail({
        from: `"${process.env.MAIL_FROM_NAME || "VEXIM GLOBAL"}" <${process.env.MAIL_FROM_ADDRESS || process.env.MAIL_USERNAME}>`,
        to: email,
        subject: "Xác nhận đăng ký cảnh báo FDA - Vexim Global",
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #1e3a8a 0%, #065f46 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">🚨 FDA Alert Tracker</h1>
              <p style="color: #d1fae5; margin: 10px 0 0 0;">Vexim Global</p>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #1e3a8a; margin-top: 0;">Xác nhận đăng ký</h2>
              
              <p>Cảm ơn bạn đã đăng ký nhận thông báo cảnh báo FDA từ Vexim Global!</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
                <p style="margin: 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 10px 0 0 0;"><strong>Danh mục:</strong> ${categories.join(", ")}</p>
                <p style="margin: 10px 0 0 0;"><strong>Tần suất:</strong> ${frequency === "daily" ? "Hàng ngày" : frequency === "weekly" ? "Hàng tuần" : "Ngay lập tức"}</p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationLink}" style="background: #10b981; color: white; padding: 14px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
                  ✅ Xác nhận đăng ký
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">Hoặc copy link này vào trình duyệt:</p>
              <p style="background: #f3f4f6; padding: 10px; border-radius: 4px; font-size: 12px; word-break: break-all;">${verificationLink}</p>
              
              <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb;">
                <p style="color: #6b7280; font-size: 14px; margin: 5px 0;">Nếu bạn không đăng ký dịch vụ này, vui lòng bỏ qua email này.</p>
              </div>
            </div>
            
            <div style="text-align: center; padding: 20px; color: #9ca3af; font-size: 12px;">
              <p>© 2026 Vexim Global. Bản quyền thuộc về Vexim Global.</p>
              <p><a href="${unsubscribeLink}" style="color: #9ca3af;">Hủy đăng ký</a></p>
            </div>
          </body>
          </html>
        `,
      })
      
      console.log("[v0] ✅ Verification email sent successfully!")
      console.log("[v0] Message ID:", info.messageId)
      console.log("[v0] Response:", info.response)
    } catch (emailError) {
      console.error("[v0] ❌ Email sending failed:", emailError)
      if (emailError instanceof Error) {
        console.error("[v0] Error details:", emailError.message)
      }
      // Don't fail the subscription, just log the error
    }

    return NextResponse.json({
      success: true,
      message: "Subscription created successfully. Please check your email to verify.",
    })
  } catch (error) {
    console.error("[v0] Subscription API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Get subscription status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data, error } = await supabase.from("fda_subscriptions").select("*").eq("email", email).single()

    if (error || !data) {
      return NextResponse.json({ subscribed: false })
    }

    return NextResponse.json({
      subscribed: true,
      categories: data.categories,
      frequency: data.frequency,
      is_active: data.is_active,
      verified: data.verified,
    })
  } catch (error) {
    console.error("[v0] Get subscription error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Unsubscribe
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const token = searchParams.get("token")

    if (!email || !token) {
      return NextResponse.json({ error: "Email and token are required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { error } = await supabase
      .from("fda_subscriptions")
      .update({ is_active: false })
      .eq("email", email)
      .eq("verification_token", token)

    if (error) {
      console.error("[v0] Error unsubscribing:", error)
      return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
    }

    // Send unsubscribe confirmation email (using Zoho SMTP)
    const { emailService } = await import("@/lib/email-service-zoho")
    await emailService.sendUnsubscribeConfirmation(email)

    return NextResponse.json({
      success: true,
      message: "Unsubscribed successfully",
    })
  } catch (error) {
    console.error("[v0] Unsubscribe error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// Generate random token
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}
