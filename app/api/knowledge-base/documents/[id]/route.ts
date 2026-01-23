import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    const { title, content } = await request.json()

    // Update document
    const { error: updateError } = await supabase
      .from("knowledge_documents")
      .update({ 
        title,
        content,
        updated_at: new Date().toISOString()
      })
      .eq("id", id)

    if (updateError) {
      console.error("Error updating document:", updateError)
      return NextResponse.json(
        { error: "Failed to update document" },
        { status: 500 }
      )
    }

    // If content changed, reprocess chunks
    if (content) {
      // Delete old chunks
      await supabase
        .from("knowledge_chunks")
        .delete()
        .eq("document_id", id)

      // Create new chunks (simple chunking by paragraphs)
      const paragraphs = content.split(/\n\n+/).filter((p: string) => p.trim())
      const chunks = paragraphs.map((text: string, index: number) => ({
        document_id: id,
        chunk_text: text.trim(),
        chunk_index: index,
        metadata: {}
      }))

      if (chunks.length > 0) {
        await supabase.from("knowledge_chunks").insert(chunks)
      }

      // Update chunks count
      await supabase
        .from("knowledge_documents")
        .update({ chunks_count: chunks.length })
        .eq("id", id)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Update error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      console.log("[v0] Delete attempt without auth")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params
    console.log("[v0] Deleting document:", id, "User:", user.email)

    // First, delete chunks manually (in case cascade doesn't work)
    const { error: chunksError } = await supabase
      .from("knowledge_chunks")
      .delete()
      .eq("document_id", id)

    if (chunksError) {
      console.error("[v0] Error deleting chunks:", chunksError)
      // Continue anyway - chunks might not exist
    }

    // Delete document
    const { error } = await supabase
      .from("knowledge_documents")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("[v0] Error deleting document:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return NextResponse.json(
        { error: `Failed to delete document: ${error.message}` },
        { status: 500 }
      )
    }

    console.log("[v0] Document deleted successfully:", id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Delete error:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}
