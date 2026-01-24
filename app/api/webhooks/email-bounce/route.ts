import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

// H-4: Email bounce handling webhook
// This endpoint receives bounce notifications from email service (Zoho, SendGrid, etc.)
export async function POST(request: Request) {
  try {
    // Verify webhook secret
    const authHeader = request.headers.get("authorization")
    const webhookSecret = process.env.EMAIL_WEBHOOK_SECRET || "your-webhook-secret"

    if (authHeader !== `Bearer ${webhookSecret}`) {
      console.log("[v0] Unauthorized bounce webhook attempt")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { email, bounceType, reason } = body

    console.log(`[v0] Email bounce received: ${email}, type: ${bounceType}`)

    if (!email || !bounceType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Get current subscription
    const { data: subscription, error: fetchError } = await supabase
      .from("fda_subscriptions")
      .select("*")
      .eq("email", email)
      .single()

    if (fetchError || !subscription) {
      console.log(`[v0] Subscription not found for bounced email: ${email}`)
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    const newBounceCount = (subscription.bounce_count || 0) + 1
    const shouldDisable = newBounceCount >= 3 || bounceType === "hard"

    // Update subscription with bounce info
    const { error: updateError } = await supabase
      .from("fda_subscriptions")
      .update({
        bounce_count: newBounceCount,
        last_bounce_at: new Date().toISOString(),
        bounce_type: bounceType,
        is_active: shouldDisable ? false : subscription.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq("id", subscription.id)

    if (updateError) {
      console.error("[v0] Error updating bounce info:", updateError)
      return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 })
    }

    if (shouldDisable) {
      console.log(`[v0] Subscription disabled due to bounces: ${email} (count: ${newBounceCount}, type: ${bounceType})`)
    } else {
      console.log(`[v0] Bounce recorded: ${email} (count: ${newBounceCount})`)
    }

    return NextResponse.json({
      success: true,
      message: shouldDisable ? "Subscription disabled" : "Bounce recorded",
      bounceCount: newBounceCount,
      disabled: shouldDisable,
    })
  } catch (error) {
    console.error("[v0] Bounce webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// GET endpoint to check bounce status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    const { data, error } = await supabase
      .from("fda_subscriptions")
      .select("bounce_count, last_bounce_at, bounce_type, is_active")
      .eq("email", email)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 })
    }

    return NextResponse.json({
      email,
      bounceCount: data.bounce_count || 0,
      lastBounceAt: data.last_bounce_at,
      bounceType: data.bounce_type,
      isActive: data.is_active,
      status: data.bounce_count >= 3 ? "disabled" : data.bounce_count > 0 ? "warning" : "healthy",
    })
  } catch (error) {
    console.error("[v0] Bounce status check error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
