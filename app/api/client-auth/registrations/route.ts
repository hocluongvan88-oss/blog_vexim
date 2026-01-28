import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// GET /api/client-auth/registrations - Get FDA registrations for authenticated client
export async function GET(request: NextRequest) {
  try {
    // Get token from cookie (using hyphen, not underscore)
    const token = request.cookies.get("client-token")?.value

    if (!token) {
      console.log("[v0] No client token found in registrations API")
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

    // Add has_credentials flag and ensure credentials are included
    const registrationsWithFlags = registrations?.map(reg => ({
      ...reg,
      has_credentials: !!(reg.fda_user_id || reg.fda_password || reg.fda_pin)
    }))

    console.log("[v0] Found", registrationsWithFlags?.length || 0, "registrations for client:", session.client_id)

    return NextResponse.json({
      registrations: registrationsWithFlags || [],
    })
  } catch (error) {
    console.error("[v0] Error in GET /api/client-auth/registrations:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
