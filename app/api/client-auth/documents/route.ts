import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase-admin"

// GET - Fetch client documents
export async function GET(request: Request) {
  try {
    console.log("[v0] Client documents API - Starting")
    const cookieStore = await cookies()
    const token = cookieStore.get("client-token")?.value

    if (!token) {
      console.log("[v0] No client token found")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Use admin client to bypass RLS
    const adminClient = createAdminClient()

    // Look up session in database
    const { data: session, error: sessionError } = await adminClient
      .from("client_sessions")
      .select("client_id, expires_at")
      .eq("token", token)
      .single()

    if (sessionError || !session) {
      console.error("[v0] Session not found:", sessionError)
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      console.error("[v0] Session expired")
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    const clientId = session.client_id
    console.log("[v0] Client ID from session:", clientId)

    // Fetch documents visible to client
    console.log("[v0] Querying documents for client:", clientId)
    const { data: documents, error } = await adminClient
      .from("client_documents")
      .select(`
        *,
        fda_registrations (
          company_name,
          registration_type,
          registration_number
        )
      `)
      .eq("client_id", clientId)
      .eq("is_visible_to_client", true)
      .order("created_at", { ascending: false })

    console.log("[v0] Query result:", { 
      documentsCount: documents?.length,
      error: error?.message,
      hasError: !!error
    })

    if (error) {
      console.error("[v0] Error fetching documents:", error)
      console.error("[v0] Error code:", error.code)
      console.error("[v0] Error details:", error.details)
      return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
    }

    console.log("[v0] Returning documents:", documents?.length || 0)
    return NextResponse.json({ documents: documents || [] })
  } catch (error) {
    console.error("[v0] Exception in client documents API:", error)
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack")
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
