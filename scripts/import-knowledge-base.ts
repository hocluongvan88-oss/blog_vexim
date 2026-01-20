import { createClient } from "@supabase/supabase-js"
import * as fs from "fs"
import * as path from "path"

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

// Process document into chunks
async function processDocumentChunks(
  documentId: string,
  content: string
): Promise<number> {
  try {
    // Split content into chunks by double newlines (paragraphs)
    const paragraphs = content.split(/\n\n+/).filter((p) => p.trim().length > 50)
    
    // Create chunks with overlap for better context
    const chunks: any[] = []
    const chunkSize = 3 // Number of paragraphs per chunk
    const overlap = 1 // Overlap between chunks
    
    for (let i = 0; i < paragraphs.length; i += chunkSize - overlap) {
      const chunkParagraphs = paragraphs.slice(i, i + chunkSize)
      const chunkText = chunkParagraphs.join("\n\n")
      
      if (chunkText.trim().length > 50) {
        chunks.push({
          document_id: documentId,
          chunk_text: chunkText.trim(),
          chunk_index: Math.floor(i / (chunkSize - overlap)),
          metadata: {
            paragraph_count: chunkParagraphs.length,
            char_count: chunkText.length,
          },
        })
      }
    }
    
    console.log(`   📦 Creating ${chunks.length} chunks...`)
    
    // Insert chunks in batches
    const batchSize = 10
    for (let i = 0; i < chunks.length; i += batchSize) {
      const batch = chunks.slice(i, i + batchSize)
      const { error } = await supabase.from("knowledge_chunks").insert(batch)
      
      if (error) {
        console.error(`   ❌ Error inserting batch ${i / batchSize + 1}:`, error)
        throw error
      }
    }
    
    return chunks.length
  } catch (error) {
    console.error("   ❌ Error processing chunks:", error)
    throw error
  }
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
      .update({ status: "active" })
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
