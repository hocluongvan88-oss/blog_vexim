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

    // Send verification email (using Zoho SMTP)
    try {
      const { emailService } = await import("@/lib/email-service-zoho")
      const emailSent = await emailService.sendVerificationEmail(email, verificationToken)
      
      console.log(`[v0] Email service response:`, emailSent)
      
      if (!emailSent) {
        console.error("[v0] Email service returned false")
      }
    } catch (emailError) {
      console.error("[v0] Email sending failed:", emailError)
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
