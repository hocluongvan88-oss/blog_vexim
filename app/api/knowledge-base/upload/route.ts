import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { chunkDocument, htmlToPlainText, normalizeWhitespace, insertChunks } from "@/lib/knowledge-chunks"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const title = formData.get("title") as string
    const sourceType = formData.get("sourceType") as "text" | "url" | "file"
    const content = formData.get("content") as string
    const url = formData.get("url") as string
    const file = formData.get("file") as File

    if (!title || !sourceType) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    let documentContent = ""
    let sourceUrl = null

    // Process based on source type
    if (sourceType === "text") {
      documentContent = content
    } else if (sourceType === "url") {
      sourceUrl = url
      // Tải nội dung trang và CHỈ giữ phần text.
      // Trước đây lưu nguyên HTML (kèm <script>, menu, footer) vào kho tri thức
      // nên chunk chứa đầy rác → AI đọc phải rác và trả lời chung chung.
      try {
        const response = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; VeximKnowledgeBot/1.0)" },
        })
        if (!response.ok) {
          return NextResponse.json(
            { error: `Không tải được URL (mã ${response.status}). Kiểm tra lại đường dẫn.` },
            { status: 400 },
          )
        }
        const raw = await response.text()
        documentContent = htmlToPlainText(raw)
      } catch (error) {
        return NextResponse.json(
          { error: "Không tải được nội dung từ URL", details: error instanceof Error ? error.message : undefined },
          { status: 400 }
        )
      }

      if (!documentContent || documentContent.trim().length < 100) {
        return NextResponse.json(
          { error: "Trang này không có đủ nội dung văn bản để nạp vào kho tri thức (có thể là trang động/JS)." },
          { status: 400 },
        )
      }
    } else if (sourceType === "file") {
      // Read file content
      console.log("[v0] Processing file:", file.name, "Type:", file.type, "Size:", file.size)
      
      const fileExtension = file.name.split('.').pop()?.toLowerCase()
      const fileBuffer = Buffer.from(await file.arrayBuffer())
      
      // For text-based files, read directly
      if (['txt', 'md', 'rtf'].includes(fileExtension || '')) {
        documentContent = fileBuffer.toString('utf-8')
      } 
      // For PDF files
      else if (fileExtension === 'pdf') {
        try {
          // Dynamic import pdf-parse
          const pdfParse = (await import('pdf-parse')).default
          const pdfData = await pdfParse(fileBuffer)
          documentContent = pdfData.text
          console.log("[v0] PDF parsed successfully, pages:", pdfData.numpages)
        } catch (error) {
          console.error("[v0] Error parsing PDF:", error)
          return NextResponse.json(
            { 
              error: "Không thể ��ọc file PDF. Vui lòng kiểm tra file có hợp lệ không.",
              details: error instanceof Error ? error.message : "PDF parsing failed"
            },
            { status: 400 }
          )
        }
      }
      // For DOCX files
      else if (['docx', 'doc'].includes(fileExtension || '')) {
        try {
          // Dynamic import mammoth
          const mammoth = await import('mammoth')
          const result = await mammoth.extractRawText({ buffer: fileBuffer })
          documentContent = result.value
          console.log("[v0] DOCX parsed successfully")
        } catch (error) {
          console.error("[v0] Error parsing DOCX:", error)
          return NextResponse.json(
            { 
              error: "Không thể đọc file Word. Vui lòng kiểm tra file có hợp lệ không.",
              details: error instanceof Error ? error.message : "DOCX parsing failed"
            },
            { status: 400 }
          )
        }
      }
      else {
        return NextResponse.json(
          { error: `Định dạng file .${fileExtension} chưa được hỗ trợ. Hỗ trợ: TXT, MD, RTF, PDF, DOCX, DOC` },
          { status: 400 }
        )
      }
      
      sourceUrl = file.name
      
      console.log("[v0] File processed, content length:", documentContent.length)
      
      if (!documentContent || documentContent.trim().length === 0) {
        return NextResponse.json(
          { error: "File không có nội dung hoặc không thể trích xuất text" },
          { status: 400 }
        )
      }

      // Giới hạn để tránh timeout khi xử lý file quá lớn trên serverless
      if (documentContent.length > 400_000) {
        documentContent = documentContent.slice(0, 400_000)
        console.warn("[v0] Nội dung file quá dài, đã cắt bớt còn 400.000 ký tự")
      }
    }

    // Chuẩn hoá text trước khi lưu (bỏ khoảng trắng rác của PDF)
    documentContent = normalizeWhitespace(documentContent)

    // Insert document
    const { data: document, error: docError } = await supabase
      .from("knowledge_documents")
      .insert({
        title,
        content: documentContent,
        source_type: sourceType,
        source_url: sourceUrl,
        status: "processing",
      })
      .select()
      .single()

    if (docError) {
      console.error("[v0] Error inserting document:", docError)
      return NextResponse.json(
        { 
          error: "Failed to create document",
          details: docError.message,
          code: docError.code 
        },
        { status: 500 }
      )
    }

    // Xử lý tài liệu thành các chunk cho AI tra cứu
    const chunkResult = await processDocumentChunks(document.id, documentContent, supabase, sourceType)

    if (chunkResult.error) {
      return NextResponse.json(
        {
          error: "Không thể tạo dữ liệu cho AI từ tài liệu này",
          details: chunkResult.error,
          document,
        },
        { status: 500 },
      )
    }

    // Tạo vector thất bại không làm hỏng việc nạp tài liệu, nhưng phải nói rõ
    // cho admin biết để họ bấm "Nạp embedding cho AI" nếu muốn tìm theo ngữ nghĩa.
    const embeddingNote =
      chunkResult.embedded === chunkResult.chunks && chunkResult.chunks > 0
        ? ` (${chunkResult.embedded} đoạn đã được AI hiểu theo ngữ nghĩa)`
        : chunkResult.embeddingError
          ? " — chưa tạo được vector ngữ nghĩa, hãy bấm \"Nạp embedding cho AI\" trong trang Kho tri thức"
          : ""

    return NextResponse.json({
      success: true,
      document,
      chunks: chunkResult.chunks,
      embedded: chunkResult.embedded,
      embeddingError: chunkResult.embeddingError,
      message: `Đã nạp ${chunkResult.chunks} đoạn kiến thức cho AI${embeddingNote}`,
    })
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

async function processDocumentChunks(
  documentId: string,
  content: string,
  supabase: any,
  sourceType?: string,
): Promise<{ chunks: number; embedded: number; error: string | null; embeddingError: string | null }> {
  try {
    const rows = chunkDocument(documentId, content, { sourceType })
    const { inserted, embedded, error, embeddingError } = await insertChunks(supabase, rows)

    if (error) {
      console.error("[v0] Lỗi ghi chunk:", error)
      await supabase.from("knowledge_documents").update({ status: "error", chunks_count: 0 }).eq("id", documentId)
      return { chunks: 0, embedded: 0, error, embeddingError }
    }

    await supabase
      .from("knowledge_documents")
      .update({ status: "active", chunks_count: inserted })
      .eq("id", documentId)

    console.log(`[v0] Tài liệu ${documentId}: đã nạp ${inserted} chunk, ${embedded} chunk có vector ngữ nghĩa`)
    return { chunks: inserted, embedded, error: null, embeddingError }
  } catch (error) {
    console.error("[v0] Chunk processing error:", error)
    await supabase.from("knowledge_documents").update({ status: "error", chunks_count: 0 }).eq("id", documentId)
    return {
      chunks: 0,
      embedded: 0,
      error: error instanceof Error ? error.message : "Lỗi xử lý chunk",
      embeddingError: null,
    }
  }
}
