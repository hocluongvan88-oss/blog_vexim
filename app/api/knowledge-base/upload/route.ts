import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

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
      // Fetch content from URL
      try {
        const response = await fetch(url)
        documentContent = await response.text()
      } catch (error) {
        return NextResponse.json(
          { error: "Failed to fetch URL content" },
          { status: 400 }
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
              error: "Không thể đọc file PDF. Vui lòng kiểm tra file có hợp lệ không.",
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
    }

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

    // Process document into chunks (async)
    await processDocumentChunks(document.id, documentContent, supabase)

    return NextResponse.json({ success: true, document })
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
  supabase: any
) {
  try {
    // Split content into chunks (simple split by paragraphs)
    const chunks = content
      .split(/\n\n+/)
      .filter((chunk) => chunk.trim().length > 50)
      .map((chunk, index) => ({
        document_id: documentId,
        content: chunk.trim(),
        chunk_index: index,
        token_count: Math.ceil(chunk.length / 4), // Rough estimate
      }))

    // Insert chunks
    const { error: chunksError } = await supabase
      .from("knowledge_chunks")
      .insert(chunks)

    if (chunksError) {
      console.error("Error inserting chunks:", chunksError)
      // Update document status to error
      await supabase
        .from("knowledge_documents")
        .update({ status: "error" })
        .eq("id", documentId)
      return
    }

    // Update document status to active
    await supabase
      .from("knowledge_documents")
      .update({
        status: "active",
        chunks_count: chunks.length,
      })
      .eq("id", documentId)
  } catch (error) {
    console.error("Chunk processing error:", error)
    // Update status to error
    await supabase
      .from("knowledge_documents")
      .update({ status: "error" })
      .eq("id", documentId)
  }
}
