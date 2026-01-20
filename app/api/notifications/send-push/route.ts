import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import webpush from "web-push"

// Configure web-push with VAPID keys
// In production, generate your own VAPID keys using: npx web-push generate-vapid-keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || 
  "BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xYjNBM-S2K2S5c3V5hAJ5SKH0FS8EIpqG7EX3nN7mZ5fF9jLg3hWo"

const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY || 
  "UzQbzQLV3rPf7cT8Qh6s1WKmJN9FGBdX2YP0vLkCnHI"

const vapidEmail = process.env.VAPID_EMAIL || "admin@vexim.com"

webpush.setVapidDetails(
  `mailto:${vapidEmail}`,
  vapidPublicKey,
  vapidPrivateKey
)

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Verify authentication (internal API call)
    const authHeader = request.headers.get("authorization")
    const apiKey = process.env.INTERNAL_API_KEY || "vexim-internal-api-key"
    
    if (authHeader !== `Bearer ${apiKey}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { title, body, url, conversationId, urgency, userId } = await request.json()

    if (!title || !body) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Get all push subscriptions (or specific user if userId provided)
    let query = supabase.from("push_subscriptions").select("*")
    
    if (userId) {
      query = query.eq("user_id", userId)
    }

    const { data: subscriptions, error } = await query

    if (error) {
      console.error("[v0] Error fetching subscriptions:", error)
      return NextResponse.json(
        { error: "Failed to fetch subscriptions" },
        { status: 500 }
      )
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json(
        { message: "No subscriptions found" },
        { status: 200 }
      )
    }

    // Prepare notification payload
    const payload = JSON.stringify({
      title,
      body,
      url,
      conversationId,
      urgency,
      tag: `vexim-${conversationId || Date.now()}`,
    })

    // Send push notifications to all subscriptions
    const results = await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(sub.subscription, payload)
          return { success: true, endpoint: sub.endpoint }
        } catch (error: any) {
          console.error("[v0] Push send error:", error)
          
          // If subscription is invalid (410 Gone), remove it from database
          if (error.statusCode === 410) {
            await supabase
              .from("push_subscriptions")
              .delete()
              .eq("id", sub.id)
            
            console.log("[v0] Removed invalid subscription:", sub.endpoint)
          }
          
          return { success: false, endpoint: sub.endpoint, error: error.message }
        }
      })
    )

    const successful = results.filter(r => r.status === "fulfilled" && r.value.success).length
    const failed = results.length - successful

    console.log(`[v0] Push notifications sent: ${successful} successful, ${failed} failed`)

    return NextResponse.json({
      success: true,
      sent: successful,
      failed,
      results,
    })
  } catch (error) {
    console.error("[v0] Send push API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
