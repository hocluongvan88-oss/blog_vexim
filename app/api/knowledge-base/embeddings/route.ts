import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { embedMissingChunks } from "@/lib/knowledge-chunks"
import { describeEmbeddingConfig } from "@/lib/embeddings"

/** Mức độ "đã học ngữ nghĩa" của kho tri thức. */
async function getCoverage(supabase: any) {
  const { count: total, error: totalError } = await supabase
    .from("knowledge_chunks")
    .select("id", { count: "exact", head: true })

  if (totalError) return { total: 0, embedded: 0, missing: 0, error: totalError.message }

  const { count: embedded, error: embeddedError } = await supabase
    .from("knowledge_chunks")
    .select("id", { count: "exact", head: true })
    .not("embedding", "is", null)

  if (embeddedError) {
    // Cột embedding chưa tồn tại -> chưa chạy script 038
    return {
      total: total || 0,
      embedded: 0,
      missing: total || 0,
      error: "Cột embedding chưa tồn tại — hãy chạy scripts/038_add_knowledge_embeddings.sql",
    }
  }

  return {
    total: total || 0,
    embedded: embedded || 0,
    missing: Math.max((total || 0) - (embedded || 0), 0),
    error: null,
  }
}

/** GET: xem tình trạng embedding của kho tri thức. */
export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const config = describeEmbeddingConfig()
    const coverage = await getCoverage(supabase)

    return NextResponse.json({
      config,
      coverage,
      ready: config.enabled && !coverage.error,
      hint: !config.enabled
        ? "Thêm GEMINI_API_KEY (miễn phí, khuyến nghị) hoặc OPENAI_API_KEY vào Vercel rồi deploy lại."
        : coverage.error
          ? coverage.error
          : coverage.missing > 0
            ? `Còn ${coverage.missing} đoạn chưa có vector — bấm "Nạp embedding cho AI".`
            : "Kho tri thức đã được AI hiểu theo ngữ nghĩa đầy đủ.",
    })
  } catch (error) {
    console.error("[knowledge] Lỗi kiểm tra embedding:", error)
    return NextResponse.json({ error: "Lỗi kiểm tra embedding" }, { status: 500 })
  }
}

/**
 * POST: nạp embedding cho các đoạn còn thiếu (chạy theo lô).
 * Trang quản trị gọi lặp lại cho tới khi `remaining = 0`.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json().catch(() => ({}))

    const result = await embedMissingChunks(supabase, {
      limit: Number(body?.limit) || 100,
    })

    if (result.error) {
      return NextResponse.json(
        {
          error: result.error,
          embedded: result.embedded,
          remaining: result.remaining,
        },
        { status: 400 },
      )
    }

    const coverage = await getCoverage(supabase)

    return NextResponse.json({
      success: true,
      embedded: result.embedded,
      remaining: result.remaining,
      model: result.model,
      coverage,
      message:
        result.embedded === 0
          ? "Tất cả đoạn kiến thức đã có vector ngữ nghĩa"
          : `Đã nạp thêm ${result.embedded} đoạn — còn ${result.remaining} đoạn`,
    })
  } catch (error) {
    console.error("[knowledge] Lỗi nạp embedding:", error)
    return NextResponse.json({ error: "Lỗi nạp embedding" }, { status: 500 })
  }
}
