import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { detectChunkSchema, chunkDocument, extractPreview } from "@/lib/knowledge-chunks"

/**
 * Kiểm tra sức khoẻ kho tri thức — trả lời câu hỏi:
 * "AI thật sự đọc được gì khi khách đặt câu hỏi?"
 *
 * Phát hiện các tình huống hay gặp:
 *  - Tài liệu hiện trong danh sách nhưng KHÔNG có chunk nào (AI không thấy gì).
 *  - `chunks_count` ghi trên tài liệu lệch với số chunk thật trong DB.
 *  - Tài liệu đang ở trạng thái `processing`/`error` nên bị loại khỏi tìm kiếm.
 *  - Schema đang dùng cột `chunk_text` (cũ) thay vì `content`.
 */
export async function GET() {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const schema = await detectChunkSchema(supabase)

    const { data: documents, error: docError } = await supabase
      .from("knowledge_documents")
      .select("id, title, status, chunks_count, source_type, created_at")
      .order("created_at", { ascending: false })

    if (docError) {
      return NextResponse.json({ error: docError.message }, { status: 500 })
    }

    // Đếm chunk thật cho từng tài liệu
    const { data: chunks, error: chunkError } = await supabase
      .from("knowledge_chunks")
      .select("document_id")
      .limit(20000)

    if (chunkError) {
      return NextResponse.json({ error: chunkError.message }, { status: 500 })
    }

    const realCounts = new Map<string, number>()
    for (const row of chunks || []) {
      const key = String((row as { document_id: string }).document_id)
      realCounts.set(key, (realCounts.get(key) || 0) + 1)
    }

    const report = (documents || []).map((doc) => {
      const real = realCounts.get(doc.id) || 0
      const declared = doc.chunks_count || 0
      const problems: string[] = []

      if (real === 0) problems.push("KHÔNG có đoạn kiến thức nào → AI không đọc được tài liệu này")
      if (doc.status !== "active") problems.push(`Trạng thái "${doc.status}" → bị loại khỏi tìm kiếm của AI`)
      if (real > 0 && declared !== real) problems.push(`Số đoạn ghi trên tài liệu (${declared}) ≠ thực tế (${real})`)

      return {
        id: doc.id,
        title: doc.title,
        status: doc.status,
        declaredChunks: declared,
        realChunks: real,
        ok: problems.length === 0,
        problems,
      }
    })

    const totalChunks = realCounts.size > 0 ? [...realCounts.values()].reduce((a, b) => a + b, 0) : 0
    const usableChunks = report.filter((r) => r.ok).reduce((sum, r) => sum + r.realChunks, 0)

    return NextResponse.json({
      schema,
      summary: {
        documents: report.length,
        totalChunks,
        /** Số đoạn AI thực sự có thể tra cứu được */
        usableChunks,
        brokenDocuments: report.filter((r) => !r.ok).length,
        healthy: report.length > 0 && report.every((r) => r.ok),
      },
      documents: report,
      hints: [
        schema.textColumn === "chunk_text"
          ? "Schema đang ở bản cũ (cột `chunk_text`). Nên chạy scripts/037_standardize_knowledge_chunks.sql."
          : null,
        totalChunks === 0
          ? "Kho tri thức đang TRỐNG. AI không có tài liệu nào để trả lời → hãy nạp tài liệu (Import file .md hoặc tải PDF/Word)."
          : null,
        report.some((r) => !r.ok)
          ? 'Có tài liệu bị lỗi — bấm "Xử lý lại" ở cột thao tác để tạo lại dữ liệu cho AI.'
          : null,
      ].filter(Boolean),
    })
  } catch (error) {
    console.error("[knowledge] Lỗi kiểm tra kho tri thức:", error)
    return NextResponse.json({ error: "Lỗi kiểm tra kho tri thức" }, { status: 500 })
  }
}

/** Cho phép xem trước cách cắt chunk của một đoạn văn bản (dùng khi gỡ lỗi). */
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content, sourceType } = await request.json()
    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ error: "Thiếu nội dung để kiểm tra" }, { status: 400 })
    }

    const rows = chunkDocument("preview", content, { sourceType })
    return NextResponse.json({
      count: rows.length,
      chunks: rows.slice(0, 20).map((row) => ({
        index: row.chunk_index,
        chars: row.text.length,
        tokens: row.token_count,
        heading: row.metadata?.heading ?? null,
        preview: extractPreview(row.text, 220),
      })),
    })
  } catch (error) {
    console.error("[knowledge] Lỗi xem trước chunk:", error)
    return NextResponse.json({ error: "Lỗi xem trước chunk" }, { status: 500 })
  }
}
