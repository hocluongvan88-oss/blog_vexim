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

    // Decode token to get client_id
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    const clientId = payload.clientId
    console.log("[v0] Client ID from token:", clientId)

    // Use admin client to bypass RLS
    const adminClient = createAdminClient()

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
