import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { chunkDocument, insertChunks, normalizeWhitespace } from "@/lib/knowledge-chunks"

/**
 * Xử lý lại một tài liệu: xoá chunk cũ và tạo lại từ nội dung đã lưu.
 *
 * Route này TRƯỚC ĐÂY KHÔNG TỒN TẠI, nhưng nút "Xử lý lại" trong trang
 * Admin → Kho tri thức vẫn gọi tới → luôn trả 404, nên không có cách nào
 * cứu một tài liệu bị lỗi (ví dụ tài liệu nhập vào lúc schema còn dùng
 * cột `chunk_text` nên không có chunk nào).
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await params

    const { data: document, error: docError } = await supabase
      .from("knowledge_documents")
      .select("id, title, content, source_type")
      .eq("id", id)
      .single()

    if (docError || !document) {
      return NextResponse.json({ error: "Không tìm thấy tài liệu" }, { status: 404 })
    }

    if (!document.content || !String(document.content).trim()) {
      return NextResponse.json(
        { error: "Tài liệu không có nội dung để xử lý. Hãy sửa tài liệu và dán nội dung vào." },
        { status: 400 },
      )
    }

    // Xoá chunk cũ
    const { error: deleteError } = await supabase.from("knowledge_chunks").delete().eq("document_id", id)
    if (deleteError) {
      console.error("[knowledge] Không xoá được chunk cũ:", deleteError.message)
    }

    // Tạo lại chunk từ nội dung đã lưu
    const prepared = normalizeWhitespace(String(document.content))
    const rows = chunkDocument(id, prepared, { sourceType: document.source_type || "text" })
    const { inserted, error: insertError } = await insertChunks(supabase, rows)

    if (insertError || inserted === 0) {
      await supabase.from("knowledge_documents").update({ status: "error", chunks_count: 0 }).eq("id", id)
      return NextResponse.json(
        { error: "Không tạo được đoạn kiến thức cho AI", details: insertError },
        { status: 500 },
      )
    }

    await supabase.from("knowledge_documents").update({ status: "active", chunks_count: inserted }).eq("id", id)

    return NextResponse.json({
      success: true,
      chunks: inserted,
      message: `Đã xử lý lại "${document.title}" — ${inserted} đoạn kiến thức cho AI`,
    })
  } catch (error) {
    console.error("[knowledge] Lỗi xử lý lại tài liệu:", error)
    return NextResponse.json({ error: "Lỗi xử lý lại tài liệu" }, { status: 500 })
  }
}
