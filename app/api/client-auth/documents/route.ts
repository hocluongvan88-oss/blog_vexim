import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase-server"

// GET - Fetch client documents
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("client-token")?.value

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Decode token to get client_id
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64").toString())
    const clientId = payload.clientId

    const supabase = await createServerClient()

    // Fetch documents visible to client
    const { data: documents, error } = await supabase
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

    if (error) {
      console.error("[v0] Error fetching documents:", error)
      return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
    }

    return NextResponse.json({ documents: documents || [] })
  } catch (error) {
    console.error("[v0] Error in client documents API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
