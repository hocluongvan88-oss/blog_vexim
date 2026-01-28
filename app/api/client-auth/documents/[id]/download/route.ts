import { NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createAdminClient } from "@/lib/supabase-admin"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const cookieStore = await cookies()
    const token = cookieStore.get("client-token")?.value

    if (!token) {
      console.log("[v0] No auth token for download")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const adminClient = createAdminClient()

    // Verify session
    const { data: session, error: sessionError } = await adminClient
      .from("client_sessions")
      .select("client_id, expires_at")
      .eq("token", token)
      .single()

    if (sessionError || !session) {
      console.error("[v0] Invalid session:", sessionError)
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    if (new Date(session.expires_at) < new Date()) {
      console.log("[v0] Session expired")
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    // Get document and verify ownership
    const { data: document, error: docError } = await adminClient
      .from("client_documents")
      .select("*")
      .eq("id", id)
      .eq("client_id", session.client_id)
      .eq("is_visible_to_client", true)
      .single()

    if (docError || !document) {
      console.error("[v0] Document not found:", docError)
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    console.log("[v0] Fetching file from blob:", document.file_url)

    // Fetch the actual file from Vercel Blob
    const fileResponse = await fetch(document.file_url)
    
    if (!fileResponse.ok) {
      console.error("[v0] Failed to fetch file from blob, status:", fileResponse.status)
      return NextResponse.json({ error: "Failed to fetch file" }, { status: 500 })
    }

    // Get the file as buffer
    const fileBuffer = await fileResponse.arrayBuffer()
    console.log("[v0] File fetched, size:", fileBuffer.byteLength, "bytes")

    // Check if file is actually a PDF by checking magic bytes
    const uint8Array = new Uint8Array(fileBuffer)
    const isPDF = uint8Array.length > 4 && 
      uint8Array[0] === 0x25 && // %
      uint8Array[1] === 0x50 && // P
      uint8Array[2] === 0x44 && // D
      uint8Array[3] === 0x46    // F
    
    if (!isPDF && document.mime_type === "application/pdf") {
      console.error("[v0] File is not a valid PDF, magic bytes:", uint8Array.slice(0, 4))
    }

    // Return file with proper headers for PDF viewing in browser
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": document.mime_type || "application/pdf",
        "Content-Disposition": `inline; filename="${encodeURIComponent(document.file_name)}"`,
        "Content-Length": fileBuffer.byteLength.toString(),
        "Cache-Control": "no-cache",
        "Accept-Ranges": "bytes",
      },
    })

  } catch (error) {
    console.error("[v0] Error in document download:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
