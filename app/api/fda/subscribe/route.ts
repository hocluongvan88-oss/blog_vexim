import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import type { FDACategory } from "@/types/fda"
import { emailService } from "@/lib/email-service-zoho"

// Generate random token
function generateToken(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, categories, frequency, honeypot } = body

    const supabase = await createServerClient() // Move supabase creation here

    // Anti-spam: Check honeypot field
    if (honeypot && honeypot.trim() !== "") {
      console.log("[v0] Spam detected - honeypot filled:", honeypot)
      return NextResponse.json({ error: "Invalid submission" }, { status: 400 })
    }

    // H-2: Rate limiting check (5 subscriptions per hour per IP/email)
    const clientIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"
    const identifier = email || clientIp
    
    const { data: existingRateLimit } = await supabase
      .from("rate_limits")
      .select("*")
      .eq("identifier", identifier)
      .eq("endpoint", "/api/fda/subscribe")
      .gt("window_start", new Date(new Date().getTime() - 3600000).toISOString())
      .single()

    if (existingRateLimit && existingRateLimit.request_count >= 5) {
      console.log(`[v0] Rate limit exceeded for: ${identifier}`)
      return NextResponse.json({ 
        error: "Too many subscription attempts. Please try again later." 
      }, { status: 429 })
    }

    if (existingRateLimit) {
      await supabase
        .from("rate_limits")
        .update({
          request_count: existingRateLimit.request_count + 1,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existingRateLimit.id)
    } else {
      await supabase.from("rate_limits").insert({
        identifier,
        endpoint: "/api/fda/subscribe",
        request_count: 1,
        window_start: new Date().toISOString(),
      })
    }

    // Validation
    if (!email || !categories || !frequency) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (!Array.isArray(categories) || categories.length === 0) {
      return NextResponse.json({ error: "At least one category is required" }, { status: 400 })
    }

    // Check if email already exists
    const { data: existingSubscription } = await supabase.from("fda_subscriptions").select("*").eq("email", email).single()

    if (existingSubscription) {
      // If already verified, inform the user
      if (existingSubscription.verified) {
        console.log("[v0] Email already subscribed and verified:", email)
        return NextResponse.json({
          success: false,
          alreadySubscribed: true,
          message: "Email này đã được đăng ký và xác nhận. Nếu bạn muốn thay đổi cài đặt, vui lòng hủy đăng ký trước rồi đăng ký lại.",
        }, { status: 409 })
      }
      
      // If not verified, update and resend verification email
      const verificationToken = generateToken()
      const tokenExpiresAt = new Date()
      tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 24)
      
      const { error: updateError } = await supabase
        .from("fda_subscriptions")
        .update({
          categories,
          frequency,
          is_active: true,
          verification_token: verificationToken,
          token_expires_at: tokenExpiresAt.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("email", email)

      if (updateError) {
        console.error("[v0] Error updating subscription:", updateError)
        return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
      }

      // Resend verification email
      console.log("[v0] Resending verification email to:", email)
      const emailSent = await emailService.sendVerificationEmail(email, verificationToken)
      if (!emailSent) {
        return NextResponse.json({ error: "Chưa gửi được email xác nhận. Vui lòng thử đăng ký lại sau ít phút." }, { status: 503 })
      }

      return NextResponse.json({
        success: true,
        message: "Email xác nhận đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.",
      })
    }

    // Create new subscription with token expiry (24 hours)
    const verificationToken = generateToken()
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setHours(tokenExpiresAt.getHours() + 24)
    
    console.log("[v0] === CREATING DATABASE RECORD ===")
    console.log("[v0] Email:", email)
    console.log("[v0] Categories:", categories)
    console.log("[v0] Frequency:", frequency)
    console.log("[v0] Verification token:", verificationToken)
    console.log("[v0] Token expires at:", tokenExpiresAt.toISOString())

    const { data: insertData, error: insertError } = await supabase.from("fda_subscriptions").insert({
      email,
      categories,
      frequency,
      is_active: true,
      verified: false,
      verification_token: verificationToken,
      token_expires_at: tokenExpiresAt.toISOString(),
    }).select()

    if (insertError) {
      console.error("[v0] === DATABASE INSERT FAILED ===")
      console.error("[v0] Error code:", insertError.code)
      console.error("[v0] Error message:", insertError.message)
      console.error("[v0] Error details:", insertError.details)
      console.error("[v0] Error hint:", insertError.hint)
      return NextResponse.json({ error: "Failed to create subscription" }, { status: 500 })
    }
    
    console.log("[v0] === DATABASE INSERT SUCCESS ===")
    console.log("[v0] Inserted record:", insertData)

    // Send verification email using EmailServiceZoho
    console.log("[v0] === SENDING FDA VERIFICATION EMAIL ===")
    console.log("[v0] Recipient:", email)
    console.log("[v0] Token:", verificationToken.substring(0, 10) + "...")
    console.log("[v0] Checking env vars:")
    console.log("[v0] - MAIL_USERNAME:", process.env.MAIL_USERNAME ? "✓ Set" : "✗ Missing")
    console.log("[v0] - MAIL_PASSWORD:", process.env.MAIL_PASSWORD ? "✓ Set" : "✗ Missing")
    console.log("[v0] - MAIL_HOST:", process.env.MAIL_HOST || "smtp.zoho.com (default)")
    console.log("[v0] - MAIL_PORT:", process.env.MAIL_PORT || "587 (default)")
    
    const emailSent = await emailService.sendVerificationEmail(email, verificationToken)
    if (!emailSent) {
      // Keep the unverified record so a retry can rotate the token and resend.
      return NextResponse.json({ error: "Chưa gửi được email xác nhận. Vui lòng thử đăng ký lại sau ít phút." }, { status: 503 })
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

    const { data: cancelled, error } = await supabase
      .from("fda_subscriptions")
      .update({ is_active: false })
      .eq("email", email)
      .eq("verification_token", token)
      .select("id")
      .maybeSingle()

    if (error) {
      console.error("[v0] Error unsubscribing:", error)
      return NextResponse.json({ error: "Failed to unsubscribe" }, { status: 500 })
    }

    if (!cancelled) {
      return NextResponse.json({ error: "Liên kết hủy đăng ký không hợp lệ." }, { status: 404 })
    }

    // Send unsubscribe confirmation email
    console.log("[v0] Sending unsubscribe confirmation to:", email)
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
