import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/client-auth/me - Get current client
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("client-token")?.value

    if (!token) {
      console.log("[v0] No client token found in cookies")
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
    }
    
    console.log("[v0] Verifying client session...")

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from("client_sessions")
      .select("*")
      .eq("token", token)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Check if session expired
    if (new Date(session.expires_at) < new Date()) {
      await supabase.from("client_sessions").delete().eq("token", token)
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    // Get client
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("id", session.client_id)
      .single()

    if (clientError || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Check if account is active
    if (!client.is_active) {
      return NextResponse.json(
        { error: "Account is inactive" },
        { status: 403 }
      )
    }

    // Return client data
    const { password_hash: _, ...clientData } = client

    return NextResponse.json({ client: clientData })
  } catch (error) {
    console.error("[v0] Error in client auth verification:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
