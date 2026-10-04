import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"
import { chunkDocument, insertChunks } from "../lib/knowledge-chunks"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("❌ Missing Supabase credentials")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

// Category mapping based on filename
const categoryMapping: Record<string, string> = {
  fda: "Pháp lý Hoa Kỳ",
  gacc: "Pháp lý Trung Quốc",
  mfds: "Pháp lý Hàn Quốc",
  "export-delegation": "Xuất khẩu",
  "ai-traceability": "Công nghệ",
  "us-agent": "Dịch vụ Hoa Kỳ",
}

// Clean markdown content
function cleanMarkdownContent(content: string): string {
  let cleaned = content
  
  // Remove markdown formatting but keep structure
  cleaned = cleaned.replace(/^#{1,6}\s+/gm, "") // Remove heading markers but keep text
  cleaned = cleaned.replace(/\*\*(.+?)\*\*/g, "$1") // Remove bold
  cleaned = cleaned.replace(/\*(.+?)\*/g, "$1") // Remove italic
  cleaned = cleaned.replace(/\[(.+?)\]\(.+?\)/g, "$1") // Remove links but keep text
  cleaned = cleaned.replace(/`(.+?)`/g, "$1") // Remove inline code
  cleaned = cleaned.replace(/^```[\s\S]*?```$/gm, "") // Remove code blocks
  cleaned = cleaned.replace(/^[>\-\*\+]\s+/gm, "") // Remove list markers
  cleaned = cleaned.replace(/^\|.+\|$/gm, "") // Remove tables
  cleaned = cleaned.replace(/^[\-=]+$/gm, "") // Remove horizontal rules
  
  // Clean up multiple newlines
  cleaned = cleaned.replace(/\n{3,}/g, "\n\n")
  
  // Trim whitespace
  cleaned = cleaned.trim()
  
  return cleaned
}

// Extract category from filename
function getCategoryFromFilename(filename: string): string {
  const baseName = path.basename(filename, ".md")
  
  for (const [key, category] of Object.entries(categoryMapping)) {
    if (baseName.includes(key)) {
      return category
    }
  }
  
  return "Kiến thức chung"
}

// Extract title from filename
function getTitleFromFilename(filename: string): string {
  const baseName = path.basename(filename, ".md")
  
  // Convert kebab-case to Title Case
  return baseName
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
    .replace("Fda", "FDA")
    .replace("Gacc", "GACC")
    .replace("Mfds", "MFDS")
    .replace("Ai", "AI")
    .replace("Us", "US")
}

// Extract tags from content
function extractTags(content: string): string[] {
  const tags: string[] = []
  
  // Common keywords to tag
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
    "truy xuất nguồn gốc",
  ]
  
  const lowerContent = content.toLowerCase()
  
  for (const keyword of keywords) {
    if (lowerContent.includes(keyword.toLowerCase())) {
      tags.push(keyword)
    }
  }
  
  return [...new Set(tags)] // Remove duplicates
}

// Process document into chunks — dùng thư viện chung để không lệch tên cột với API.
// Bản cũ ghi trực tiếp cột `chunk_text` trong khi schema hiện tại (script 012) là
// `content` → mọi lần chạy script này đều lỗi và không nạp được gì cho AI.
async function processDocumentChunks(
  documentId: string,
  content: string
): Promise<number> {
  const rows = chunkDocument(documentId, content, { sourceType: "text" })
  const { inserted, error } = await insertChunks(supabase, rows)

  if (error) {
    console.error("   ❌ Error inserting chunks:", error)
    throw new Error(error)
  }

  console.log(`   📦 Created ${inserted} chunks`)
  return inserted
}

// Import a single markdown file
async function importMarkdownFile(filePath: string): Promise<void> {
  try {
    console.log(`\n📄 Processing: ${path.basename(filePath)}`)
    
    // Read file content
    const rawContent = fs.readFileSync(filePath, "utf-8")
    
    // Extract metadata
    const title = getTitleFromFilename(filePath)
    const category = getCategoryFromFilename(filePath)
    const cleanedContent = cleanMarkdownContent(rawContent)
    const tags = extractTags(cleanedContent)
    
    console.log(`   📝 Title: ${title}`)
    console.log(`   🏷️  Category: ${category}`)
    console.log(`   🔖 Tags: ${tags.join(", ")}`)
    
    // Check if document already exists
    const { data: existing } = await supabase
      .from("knowledge_documents")
      .select("id")
      .eq("title", title)
      .maybeSingle()
    
    if (existing) {
      console.log(`   ⚠️  Document already exists, skipping...`)
      return
    }
    
    // Insert document
    const { data: document, error: docError } = await supabase
      .from("knowledge_documents")
      .insert({
        title,
        content: cleanedContent,
        category,
        tags,
        source_url: `file://${path.basename(filePath)}`,
        status: "processing",
      })
      .select()
      .single()
    
    if (docError) {
      console.error(`   ❌ Error creating document:`, docError)
      throw docError
    }
    
    console.log(`   ✅ Document created: ${document.id}`)
    
    // Process chunks
    const chunkCount = await processDocumentChunks(document.id, cleanedContent)
    
    // Update document status
    await supabase
      .from("knowledge_documents")
      .update({ status: "active", chunks_count: chunkCount })
      .eq("id", document.id)
    
    console.log(`   ✅ Complete! ${chunkCount} chunks created`)
  } catch (error) {
    console.error(`   ❌ Error importing file:`, error)
    throw error
  }
}

// Main import function
async function importAllKnowledgeFiles() {
  console.log("🚀 Starting Knowledge Base Import...")
  console.log("=" .repeat(50))
  
  const knowledgeDir = path.join(process.cwd(), "knowledge")
  
  if (!fs.existsSync(knowledgeDir)) {
    console.error("❌ Knowledge directory not found:", knowledgeDir)
    process.exit(1)
  }
  
  // Get all .md files
  const files = fs
    .readdirSync(knowledgeDir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => path.join(knowledgeDir, file))
  
  console.log(`📁 Found ${files.length} markdown files`)
  
  let successCount = 0
  let errorCount = 0
  
  for (const file of files) {
    try {
      await importMarkdownFile(file)
      successCount++
    } catch (error) {
      errorCount++
      console.error(`❌ Failed to import ${path.basename(file)}`)
    }
  }
  
  console.log("\n" + "=".repeat(50))
  console.log("📊 Import Summary:")
  console.log(`   ✅ Success: ${successCount}`)
  console.log(`   ❌ Errors: ${errorCount}`)
  console.log("=" .repeat(50))
  
  if (errorCount === 0) {
    console.log("🎉 All files imported successfully!")
  } else {
    console.log("⚠️  Some files failed to import")
  }
}

// Run import
importAllKnowledgeFiles()
  .then(() => {
    console.log("\n✅ Import process completed")
    process.exit(0)
  })
  .catch((error) => {
    console.error("\n❌ Import process failed:", error)
    process.exit(1)
  })
