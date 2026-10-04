import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { chunkDocument, insertChunks, normalizeWhitespace } from "@/lib/knowledge-chunks"

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

    // Nếu nội dung thay đổi -> tạo lại chunk cho AI
    if (content) {
      // Lấy loại nguồn để xử lý đúng cách (URL còn sót HTML sẽ được lọc sạch)
      const { data: existingDoc } = await supabase
        .from("knowledge_documents")
        .select("source_type")
        .eq("id", id)
        .single()

      const prepared = normalizeWhitespace(content)
      const rows = chunkDocument(id, prepared, { sourceType: existingDoc?.source_type || "text" })

      if (rows.length === 0) {
        return NextResponse.json(
          { error: "Nội dung quá ngắn để nạp cho AI. Hãy thêm nội dung rồi lưu lại." },
          { status: 400 },
        )
      }

      // Xoá chunk cũ TRƯỚC, nhưng nếu ghi chunk mới lỗi thì đánh dấu tài liệu
      // là lỗi để admin biết — trước đây lỗi bị nuốt im lặng, tài liệu vẫn hiện
      // 'active' với chunks_count cũ nhưng kho tri thức trống rỗng.
      const { error: deleteError } = await supabase.from("knowledge_chunks").delete().eq("document_id", id)
      if (deleteError) {
        console.error("[knowledge] Không xoá được chunk cũ:", deleteError.message)
      }

      const { inserted, error: insertError } = await insertChunks(supabase, rows)

      if (insertError) {
        console.error("[knowledge] Lỗi ghi chunk khi sửa tài liệu:", insertError)
        await supabase.from("knowledge_documents").update({ status: "error", chunks_count: 0 }).eq("id", id)
        return NextResponse.json(
          {
            error: "Đã lưu tiêu đề nhưng KHÔNG nạp được dữ liệu cho AI",
            details: insertError,
          },
          { status: 500 },
        )
      }

      await supabase.from("knowledge_documents").update({ status: "active", chunks_count: inserted }).eq("id", id)

      return NextResponse.json({ success: true, chunks: inserted })
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
