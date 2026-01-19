import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { postId } = await request.json()

    if (!postId) {
      return NextResponse.json({ error: "Post ID is required" }, { status: 400 })
    }

    // Lấy thông tin request
    const userAgent = request.headers.get("user-agent") || ""
    const referrer = request.headers.get("referer") || ""
    const userIp = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || "unknown"

    // Tăng view count cho post
    const { error: updateError } = await supabase.rpc("increment_post_views", { post_id: postId })

    if (updateError) {
      console.error("[v0] Error incrementing post views:", updateError)
    }

    // Lưu chi tiết page view
    const { error: insertError } = await supabase.from("page_views").insert({
      post_id: postId,
      user_ip: userIp,
      user_agent: userAgent,
      referrer: referrer,
    })

    if (insertError) {
      console.error("[v0] Error inserting page view:", insertError)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error tracking view:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
