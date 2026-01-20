import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
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

    const { id } = params
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
  { params }: { params: { id: string } }
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

    const { id } = params

    // Delete document (cascades to chunks)
    const { error } = await supabase
      .from("knowledge_documents")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting document:", error)
      return NextResponse.json(
        { error: "Failed to delete document" },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
