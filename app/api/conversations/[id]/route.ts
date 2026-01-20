import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const conversationId = params.id

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete in order: messages -> handovers -> conversation
    // Delete messages first
    const { error: messagesError } = await supabase
      .from("chat_messages")
      .delete()
      .eq("conversation_id", conversationId)

    if (messagesError) {
      console.error("[v0] Error deleting messages:", messagesError)
      throw messagesError
    }

    // Delete handovers
    const { error: handoversError } = await supabase
      .from("conversation_handovers")
      .delete()
      .eq("conversation_id", conversationId)

    if (handoversError) {
      console.error("[v0] Error deleting handovers:", handoversError)
      throw handoversError
    }

    // Delete conversation
    const { error: convError } = await supabase
      .from("conversations")
      .delete()
      .eq("id", conversationId)

    if (convError) {
      console.error("[v0] Error deleting conversation:", convError)
      throw convError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/conversations/[id]:", error)
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    )
  }
}
