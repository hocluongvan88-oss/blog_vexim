import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const conversationId = params.id

    console.log("[v0] DELETE conversation request for ID:", conversationId)

    // Check authentication - allow both authenticated users and service role
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // For admin users, verify they're authenticated
    // For public conversations (from chat widget), allow deletion
    if (!user) {
      console.log("[v0] No authenticated user - checking if conversation exists")
      
      // Verify the conversation exists before allowing deletion
      const { data: conversation, error: checkError } = await supabase
        .from("conversations")
        .select("id")
        .eq("id", conversationId)
        .single()

      if (checkError || !conversation) {
        console.error("[v0] Conversation not found:", checkError)
        return NextResponse.json({ error: "Conversation not found" }, { status: 404 })
      }
    }

    // Use service role to bypass RLS for deletion
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error("[v0] SUPABASE_SERVICE_ROLE_KEY not configured")
      return NextResponse.json(
        { error: "Server configuration error - missing service role key" },
        { status: 500 }
      )
    }

    // Create a service role client for admin operations
    const { createClient: createServiceClient } = await import("@supabase/supabase-js")
    const serviceSupabase = createServiceClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    console.log("[v0] Using service role client to delete conversation")

    // Delete in order: messages -> handovers -> conversation
    // Delete messages first
    const { error: messagesError } = await serviceSupabase
      .from("chat_messages")
      .delete()
      .eq("conversation_id", conversationId)

    if (messagesError) {
      console.error("[v0] Error deleting messages:", messagesError)
      return NextResponse.json(
        { error: "Failed to delete messages", details: messagesError.message },
        { status: 500 }
      )
    }

    console.log("[v0] Messages deleted successfully")

    // Delete handovers
    const { error: handoversError } = await serviceSupabase
      .from("conversation_handovers")
      .delete()
      .eq("conversation_id", conversationId)

    if (handoversError) {
      console.error("[v0] Error deleting handovers:", handoversError)
      // Don't fail if handovers don't exist
    }

    console.log("[v0] Handovers deleted (or none existed)")

    // Delete conversation
    const { error: convError } = await serviceSupabase
      .from("conversations")
      .delete()
      .eq("id", conversationId)

    if (convError) {
      console.error("[v0] Error deleting conversation:", convError)
      return NextResponse.json(
        { error: "Failed to delete conversation", details: convError.message },
        { status: 500 }
      )
    }

    console.log("[v0] Conversation deleted successfully")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/conversations/[id]:", error)
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    )
  }
}
