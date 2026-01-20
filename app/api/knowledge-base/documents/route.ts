import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Fetch documents
    const { data: documents, error } = await supabase
      .from("knowledge_documents")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching documents:", error)
      return NextResponse.json(
        { error: "Failed to fetch documents" },
        { status: 500 }
      )
    }

    return NextResponse.json(documents || [])
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
