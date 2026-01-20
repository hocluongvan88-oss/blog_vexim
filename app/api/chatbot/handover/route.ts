import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { conversationId, action } = await request.json()

    if (!conversationId || !action) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    if (action === "takeover") {
      // Take over the conversation
      const { data: handover, error } = await supabase
        .from("conversation_handovers")
        .insert({
          conversation_id: conversationId,
          agent_id: user.id,
          agent_name: user.email?.split("@")[0] || "Agent",
          status: "active",
        })
        .select()
        .single()

      if (error) {
        console.error("Handover error:", error)
        return NextResponse.json(
          { error: "Failed to take over conversation" },
          { status: 500 }
        )
      }

      // Update conversation metadata
      const { data: conversation } = await supabase
        .from("conversations")
        .select("metadata")
        .eq("id", conversationId)
        .single()

      await supabase
        .from("conversations")
        .update({
          metadata: {
            ...conversation?.metadata,
            handed_over: true,
            agent_name: user.email?.split("@")[0],
          },
        })
        .eq("id", conversationId)

      return NextResponse.json({ success: true, handover })
    } else if (action === "release") {
      // Release the conversation back to AI
      const { error } = await supabase
        .from("conversation_handovers")
        .update({
          status: "released",
          released_at: new Date().toISOString(),
        })
        .eq("conversation_id", conversationId)
        .eq("status", "active")

      if (error) {
        console.error("Release error:", error)
        return NextResponse.json(
          { error: "Failed to release conversation" },
          { status: 500 }
        )
      }

      // Update conversation metadata
      const { data: conversation } = await supabase
        .from("conversations")
        .select("metadata")
        .eq("id", conversationId)
        .single()

      await supabase
        .from("conversations")
        .update({
          metadata: {
            ...conversation?.metadata,
            handed_over: false,
          },
        })
        .eq("id", conversationId)

      return NextResponse.json({ success: true })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Handover API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
