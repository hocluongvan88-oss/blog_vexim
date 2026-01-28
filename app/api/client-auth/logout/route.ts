import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/client-auth/logout
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("client-token")?.value

    if (token) {
      // Delete session from database
      await supabase.from("client_sessions").delete().eq("token", token)
    }

    // Clear cookie
    const response = NextResponse.json({ success: true })
    response.cookies.delete("client-token")

    return response
  } catch (error) {
    console.error("[v0] Error in client logout:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
