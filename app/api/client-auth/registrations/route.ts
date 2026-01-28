import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/client-auth/registrations - Get FDA registrations for authenticated client
export async function GET(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get("client_token")?.value

    if (!token) {
      return NextResponse.json(
        { error: "Not authenticated" },
        { status: 401 }
      )
    }

    // Verify session
    const { data: session, error: sessionError } = await supabase
      .from("client_sessions")
      .select("client_id, expires_at")
      .eq("token", token)
      .single()

    if (sessionError || !session) {
      return NextResponse.json(
        { error: "Invalid session" },
        { status: 401 }
      )
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { error: "Session expired" },
        { status: 401 }
      )
    }

    console.log("[v0] Fetching registrations for client:", session.client_id)

    // First, let's see all registrations to debug
    const { data: allRegs } = await supabase
      .from("fda_registrations")
      .select("id, company_name, client_id")
    
    console.log("[v0] All FDA registrations in database:", allRegs)

    // Get FDA registrations for this client
    const { data: registrations, error: regError } = await supabase
      .from("fda_registrations")
      .select("*")
      .eq("client_id", session.client_id)
      .order("created_at", { ascending: false })

    if (regError) {
      console.error("[v0] Error fetching registrations:", regError)
      return NextResponse.json(
        { error: "Failed to fetch registrations" },
        { status: 500 }
      )
    }

    console.log("[v0] Found registrations for this client:", registrations?.length || 0)
    console.log("[v0] Registration client_ids:", registrations?.map(r => ({ id: r.id, client_id: r.client_id })))

    return NextResponse.json({
      registrations: registrations || [],
    })
  } catch (error) {
    console.error("[v0] Error in GET /api/client-auth/registrations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
