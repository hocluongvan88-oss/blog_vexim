import { createClient } from "@supabase/supabase-js"
import { readFileSync } from "fs"
import { parseStringPromise } from "xml2js"
import { JSDOM } from "jsdom"

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseServiceKey)

interface WordPressPost {
  title: string
  link: string
  pubDate: string
  "content:encoded": string
  "excerpt:encoded"?: string
  "wp:post_id": string
  "wp:post_date": string
  "wp:post_name": string
  "wp:status": string
  "wp:post_type": string
  category?: Array<{ _: string; $?: { domain?: string; nicename?: string } }>
}

// Clean HTML content and extract plain text for excerpt
function cleanHtmlContent(html: string): { content: string; excerpt: string } {
  const dom = new JSDOM(html)
  const document = dom.window.document

  // Remove WordPress block comments
  let cleanedHtml = html.replace(/<!-- \/wp:[^\]]+-->/g, "")
  cleanedHtml = cleanedHtml.replace(/<!-- wp:[^\]]+-->/g, "")

  // Extract plain text for excerpt (first 200 characters)
  const textContent = document.body.textContent || ""
  const excerpt = textContent.trim().substring(0, 200).replace(/\s+/g, " ").trim() + "..."

  return {
    content: cleanedHtml.trim(),
    excerpt,
  }
}

// Generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

// Extract category from WordPress categories
function extractCategory(categories?: Array<any>): string {
  if (!categories || categories.length === 0) return "Chưa phân loại"

  // Find the first category with domain 'category'
  const category = categories.find((cat) => cat.$ && cat.$.domain === "category")

  if (category && category._) {
    return category._
  }

  return "Chưa phân loại"
}

// Parse WordPress XML and import to Supabase
async function importWordPressXml(filePath: string) {
  console.log(`[v0] Reading XML file: ${filePath}`)

  try {
    const xmlContent = readFileSync(filePath, "utf-8")
    const result = await parseStringPromise(xmlContent)

    const items = result.rss.channel[0].item || []
    console.log(`[v0] Found ${items.length} items in XML`)

    let importedCount = 0
    let skippedCount = 0

    for (const item of items) {
      // Only import posts (skip pages, attachments, etc)
      const postType = item["wp:post_type"]?.[0]
      if (postType !== "post") {
        console.log(`[v0] Skipping non-post item: ${postType}`)
        skippedCount++
        continue
      }

      // Only import published posts
      const status = item["wp:status"]?.[0]
      if (status !== "publish") {
        console.log(`[v0] Skipping non-published post: ${status}`)
        skippedCount++
        continue
      }

      const title = item.title?.[0] || "Untitled"
      const wordpressId = Number.parseInt(item["wp:post_id"]?.[0] || "0")
      const wordpressUrl = item.link?.[0] || ""
      const rawContent = item["content:encoded"]?.[0] || ""
      const publishedAt = item["pubDate"]?.[0] || item["wp:post_date"]?.[0]
      const slug = item["wp:post_name"]?.[0] || generateSlug(title)
      const category = extractCategory(item.category)

      // Clean HTML content
      const { content, excerpt } = cleanHtmlContent(rawContent)

      // Check if post already exists
      const { data: existingPost } = await supabase.from("posts").select("id").eq("wordpress_id", wordpressId).single()

      if (existingPost) {
        console.log(`[v0] Post already exists: ${title} (ID: ${wordpressId})`)
        skippedCount++
        continue
      }

      // Insert post
      const { data, error } = await supabase.from("posts").insert({
        wordpress_id: wordpressId,
        title,
        slug,
        excerpt,
        content,
        category,
        status: "published",
        published_at: new Date(publishedAt).toISOString(),
        wordpress_url: wordpressUrl,
        meta_title: title,
        meta_description: excerpt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      if (error) {
        console.error(`[v0] Error importing post "${title}":`, error)
      } else {
        console.log(`[v0] Imported: ${title}`)
        importedCount++
      }
    }

    console.log(`\n[v0] Import completed!`)
    console.log(`[v0] Imported: ${importedCount} posts`)
    console.log(`[v0] Skipped: ${skippedCount} items`)
  } catch (error) {
    console.error("[v0] Error parsing XML:", error)
    throw error
  }
}

// Main execution
async function main() {
  const xmlFiles = [
    "user_read_only_context/text_attachments/ngkgacc-fdahtrxutkhutrngi.WordPress.2026-01-14-E5EY3.xml",
    "user_read_only_context/text_attachments/ngkgacc-fdahtrxutkhutrngi.WordPress.2026-01-14-(1)-esWRX.xml",
    "user_read_only_context/text_attachments/ngkgacc-fdahtrxutkhutrngi.WordPress.2026-01-14-(2)-P2aMk.xml",
  ]

  for (const xmlFile of xmlFiles) {
    console.log(`\n[v0] Processing: ${xmlFile}`)
    await importWordPressXml(xmlFile)
  }

  console.log("\n[v0] All files processed successfully!")
}

main().catch(console.error)
