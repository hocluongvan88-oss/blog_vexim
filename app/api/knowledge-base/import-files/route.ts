import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import * as fs from "fs"
import * as path from "path"

// Category mapping
const categoryMapping: Record<string, string> = {
  fda: "Pháp lý Hoa Kỳ",
  gacc: "Pháp lý Trung Quốc",
  mfds: "Pháp lý Hàn Quốc",
  "export-delegation": "Xuất khẩu",
  "ai-traceability": "Công nghệ",
  "us-agent": "Dịch vụ Hoa Kỳ",
}

function cleanMarkdownContent(content: string): string {
  let cleaned = content
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "")
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "$1")
  cleaned = cleaned.replace(/\*(.+?)\*/g, "$1")
  cleaned = cleaned.replace(/\[(.+?)\]\(.+?\)/g, "$1")
  cleaned = cleaned.replace(/`(.+?)`/g, "$1")
  cleaned = cleaned.replace(/^```[\s\S]*?```$/gm, "")
  cleaned = cleaned.replace(/^[>\-\*\+]\s+/gm, "")
  cleaned = cleaned.replace(/^\|.+\|$/gm, "")
  cleaned = cleaned.replace(/^[\-=]+$/gm, "")
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n")
  return cleaned.trim()
}

function getCategoryFromFilename(filename: string): string {
  const baseName = path.basename(filename, ".md")
  for (const [key, category] of Object.entries(categoryMapping)) {
    if (baseName.includes(key)) return category
  }
  return "Kiến thức chung"
}

function getTitleFromFilename(filename: string): string {
  return path
    .basename(filename, ".md")
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("Fda", "FDA")
    .replace("Gacc", "GACC")
    .replace("Mfds", "MFDS")
    .replace("Ai", "AI")
    .replace("Us", "US")
}

function extractTags(content: string): string[] {
  const keywords = [
    "FDA",
    "GACC",
    "MFDS",
    "xuất khẩu",
    "nhập khẩu",
    "đăng ký",
    "cơ sở",
    "kiểm dịch",
    "nhãn mác",
    "prior notice",
    "truy xuất",
  ]
  const lowerContent = content.toLowerCase()
  return [...new Set(keywords.filter((k) => lowerContent.includes(k.toLowerCase())))]
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const knowledgeDir = path.join(process.cwd(), "knowledge")
    
    if (!fs.existsSync(knowledgeDir)) {
      return NextResponse.json(
        { error: "Knowledge directory not found" },
        { status: 404 }
      )
    }

    const files = fs
      .readdirSync(knowledgeDir)
      .filter((file) => file.endsWith(".md"))

    const results = []

    for (const file of files) {
      const filePath = path.join(knowledgeDir, file)
      const rawContent = fs.readFileSync(filePath, "utf-8")
      
      const title = getTitleFromFilename(file)
      const category = getCategoryFromFilename(file)
      const cleanedContent = cleanMarkdownContent(rawContent)
      const tags = extractTags(cleanedContent)

      // Check if exists
      const { data: existing } = await supabase
        .from("knowledge_documents")
        .select("id")
        .eq("title", title)
        .maybeSingle()

      if (existing) {
        results.push({ file, status: "skipped", reason: "already exists" })
        continue
      }

      // Insert document
      const { data: document, error: docError } = await supabase
        .from("knowledge_documents")
        .insert({
          title,
          content: cleanedContent,
          category,
          tags,
          source_url: `file://${file}`,
          status: "processing",
          created_by: user.id,
        })
        .select()
        .single()

      if (docError) {
        results.push({ file, status: "error", error: docError.message })
        continue
      }

      // Create chunks
      const paragraphs = cleanedContent.split(/\n\n+/).filter((p) => p.trim().length > 50)
      const chunks: any[] = []
      const chunkSize = 3
      const overlap = 1

      for (let i = 0; i < paragraphs.length; i += chunkSize - overlap) {
        const chunkParagraphs = paragraphs.slice(i, i + chunkSize)
        const chunkText = chunkParagraphs.join("\n\n")

        if (chunkText.trim().length > 50) {
          chunks.push({
            document_id: document.id,
            chunk_text: chunkText.trim(),
            chunk_index: Math.floor(i / (chunkSize - overlap)),
            metadata: {
              paragraph_count: chunkParagraphs.length,
              char_count: chunkText.length,
            },
          })
        }
      }

      const { error: chunksError } = await supabase
        .from("knowledge_chunks")
        .insert(chunks)

      if (chunksError) {
        results.push({ file, status: "error", error: chunksError.message })
        await supabase
          .from("knowledge_documents")
          .update({ status: "error" })
          .eq("id", document.id)
        continue
      }

      await supabase
        .from("knowledge_documents")
        .update({ status: "active" })
        .eq("id", document.id)

      results.push({
        file,
        status: "success",
        documentId: document.id,
        chunkCount: chunks.length,
      })
    }

    const summary = {
      total: files.length,
      success: results.filter((r) => r.status === "success").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      errors: results.filter((r) => r.status === "error").length,
    }

    return NextResponse.json({ results, summary })
  } catch (error) {
    console.error("Import error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
