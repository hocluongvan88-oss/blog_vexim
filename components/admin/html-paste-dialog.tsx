"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { FileCode, Loader2 } from "lucide-react"
import type { Block } from "@/components/block-editor/types"
import { useToast } from "@/hooks/use-toast"

interface HTMLPasteDialogProps {
  onImport: (blocks: Block[]) => void
}

export function HTMLPasteDialog({ onImport }: HTMLPasteDialogProps) {
  const [open, setOpen] = useState(false)
  const [htmlContent, setHtmlContent] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  // Generate unique block ID
  const generateBlockId = (): string => {
    return `block-import-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Sanitize HTML: prevent XSS attacks
  const sanitizeHTML = (html: string): string => {
    const temp = document.createElement("div")
    temp.textContent = html // Safely escape all HTML first
    return temp.innerHTML
  }

  // Clean HTML: remove block tags (p, div) but keep inline formatting (bold, italic, links)
  const cleanInlineHTML = (html: string): string => {
    if (!html || typeof html !== "string") return ""

    const temp = document.createElement("div")
    temp.innerHTML = html

    // Remove dangerous tags
    temp.querySelectorAll("script, style, meta, link, iframe, object, embed").forEach((el) => {
      el.remove()
    })

    // Convert styled spans to semantic tags - handle multiple styles
    temp.querySelectorAll("span").forEach((span) => {
      const style = span.getAttribute("style") || ""
      const hasBold = /font-weight\s*:\s*(700|bold)/i.test(style)
      const hasItalic = /font-style\s*:\s*italic/i.test(style)
      const hasUnderline = /text-decoration\s*:\s*underline/i.test(style)

      if (hasBold || hasItalic || hasUnderline) {
        // Build properly nested formatting elements
        let wrapper = document.createElement("span")
        wrapper.innerHTML = span.innerHTML

        // Apply formatting in order: underline > italic > bold (for proper nesting)
        if (hasUnderline) {
          const u = document.createElement("u")
          u.innerHTML = wrapper.innerHTML
          wrapper = u
        }
        if (hasItalic) {
          const em = document.createElement("em")
          em.innerHTML = wrapper.innerHTML
          wrapper = em
        }
        if (hasBold) {
          const strong = document.createElement("strong")
          strong.innerHTML = wrapper.innerHTML
          wrapper = strong
        }

        span.replaceWith(wrapper)
      } else {
        // No style - unwrap span
        span.replaceWith(...Array.from(span.childNodes))
      }
    })

    // Unwrap block-level tags (p, div) but keep their content
    temp.querySelectorAll("p, div").forEach((el) => {
      el.replaceWith(...Array.from(el.childNodes))
    })

    // Clean attributes except on allowed inline tags
    temp.querySelectorAll("*").forEach((el) => {
      const tag = el.tagName.toLowerCase()
      const allowedTags = ["strong", "b", "em", "i", "u", "a", "code", "br", "span"]

      if (allowedTags.includes(tag)) {
        // For links, keep href; remove others
        if (tag === "a") {
          const href = el.getAttribute("href")
          el.removeAttribute("href")
          el.removeAttribute("class")
          el.removeAttribute("style")
          el.removeAttribute("id")
          el.removeAttribute("onclick")
          el.removeAttribute("onload")
          if (href && !href.includes("javascript:")) {
            el.setAttribute("href", href)
          }
        } else {
          // Other inline tags - remove all attributes
          Array.from(el.attributes).forEach((attr) => {
            el.removeAttribute(attr.name)
          })
        }
      } else {
        // Non-allowed tags - remove all attributes
        Array.from(el.attributes).forEach((attr) => {
          el.removeAttribute(attr.name)
        })
      }
    })

    return temp.innerHTML.trim()
  }

  // Parse Markdown content (especially tables)
  const parseMarkdownContent = (text: string): Block[] => {
    const blocks: Block[] = []
    const lines = text.split(/\r?\n/)
    let i = 0
    
    while (i < lines.length) {
      const line = lines[i]
      const trimmedLine = line.trim()
      
      // Skip empty lines
      if (!trimmedLine) {
        i++
        continue
      }
      
      // Check for Markdown table (starts with |)
      if (trimmedLine.startsWith("|") && trimmedLine.endsWith("|")) {
        const tableLines: string[] = [trimmedLine]
        i++
        
        // Collect all table lines
        while (i < lines.length) {
          const nextLine = lines[i].trim()
          if (nextLine.startsWith("|") && nextLine.endsWith("|")) {
            tableLines.push(nextLine)
            i++
          } else if (nextLine === "" && i + 1 < lines.length && 
                     lines[i + 1].trim().startsWith("|")) {
            i++
          } else {
            break
          }
        }
        
        // Parse the table
        if (tableLines.length >= 2) {
          const tableData = parseMarkdownTable(tableLines)
          if (tableData) {
            blocks.push({
              id: generateBlockId(),
              type: "table",
              data: {
                rows: tableData.rows,
                cols: tableData.cols,
                content: tableData.content,
                hasHeader: tableData.hasHeader,
                align: "left",
              },
            })
            continue
          }
        }
      }
      
      // Check for heading
      const headingMatch = trimmedLine.match(/^(#{1,6})\s+(.+)$/)
      if (headingMatch) {
        const level = Math.min(headingMatch[1].length, 3) as 1 | 2 | 3
        blocks.push({
          id: generateBlockId(),
          type: "heading",
          data: { text: headingMatch[2], level, align: "left" },
        })
        i++
        continue
      }
      
      // Check for blockquote
      if (trimmedLine.startsWith(">")) {
        const quoteText = trimmedLine.replace(/^>\s*/, "")
        blocks.push({
          id: generateBlockId(),
          type: "quote",
          data: { text: quoteText, author: "", align: "left" },
        })
        i++
        continue
      }
      
      // Check for unordered list
      if (/^[\*\-\+]\s+/.test(trimmedLine)) {
        const items: string[] = []
        while (i < lines.length && /^[\*\-\+]\s+/.test(lines[i].trim())) {
          items.push(parseInlineMarkdown(lines[i].trim().replace(/^[\*\-\+]\s+/, "")))
          i++
        }
        blocks.push({
          id: generateBlockId(),
          type: "list",
          data: { style: "unordered", items, align: "left" },
        })
        continue
      }
      
      // Check for ordered list
      if (/^\d+\.\s+/.test(trimmedLine)) {
        const items: string[] = []
        while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
          items.push(parseInlineMarkdown(lines[i].trim().replace(/^\d+\.\s+/, "")))
          i++
        }
        blocks.push({
          id: generateBlockId(),
          type: "list",
          data: { style: "ordered", items, align: "left" },
        })
        continue
      }
      
      // Check for horizontal rule
      if (/^[-*_]{3,}$/.test(trimmedLine)) {
        i++
        continue
      }
      
      // Default: paragraph with inline formatting
      const formattedText = parseInlineMarkdown(trimmedLine)
      blocks.push({
        id: generateBlockId(),
        type: "paragraph",
        data: { text: formattedText, align: "justify" },
      })
      i++
    }
    
    return blocks
  }

  // Parse Markdown table lines into table data
  const parseMarkdownTable = (lines: string[]) => {
    if (lines.length < 2) return null
    
    const rows: string[][] = []
    let separatorIndex = -1
    
    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx].trim()
      
      // Check if this is the separator row (|---|---|)
      if (/^\|[\s\-:|\s]+\|$/.test(line) && line.includes("-")) {
        separatorIndex = idx
        continue
      }
      
      // Parse row cells
      const cells = line
        .split("|")
        .slice(1, -1) // Remove empty first and last from split
        .map(cell => cell.trim())
      
      if (cells.length > 0) {
        rows.push(cells)
      }
    }
    
    if (rows.length === 0) return null
    
    // Normalize column count
    const maxCols = Math.max(...rows.map(r => r.length))
    const normalizedRows = rows.map(row => {
      while (row.length < maxCols) {
        row.push("")
      }
      return row
    })
    
    return {
      rows: normalizedRows.length,
      cols: maxCols,
      content: normalizedRows,
      hasHeader: separatorIndex === 1,
    }
  }

  // Parse inline Markdown formatting (bold, italic, links)
  const parseInlineMarkdown = (text: string): string => {
    let result = text
    
    // Bold: **text** or __text__
    result = result.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    result = result.replace(/__(.+?)__/g, "<strong>$1</strong>")
    
    // Italic: *text* or _text_ (not preceded/followed by another *)
    result = result.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>")
    result = result.replace(/(?<!_)_(?!_)(.+?)(?<!_)_(?!_)/g, "<em>$1</em>")
    
    // Links: [text](url)
    result = result.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    
    // Inline code: `code`
    result = result.replace(/`([^`]+)`/g, "<code>$1</code>")
    
    return result
  }

  const parseHTMLToBlocks = (html: string): Block[] => {
    if (!html || typeof html !== "string") {
      throw new Error("Invalid HTML input")
    }

    const blocks: Block[] = []

    try {
      const parser = new DOMParser()
      const doc = parser.parseFromString(html, "text/html")

      // Check for parse errors
      if (doc.body.innerHTML.includes("parsererror")) {
        throw new Error("Failed to parse HTML")
      }

      const processNode = (element: Element) => {
        try {
          const tagName = element.tagName.toLowerCase()
          const blockId = generateBlockId()

          // Heading tags
          if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
            const level = parseInt(tagName.charAt(1))
            const mappedLevel = level > 3 ? 3 : (level as 1 | 2 | 3)
            const text = element.textContent?.trim() || ""

            if (text) {
              blocks.push({
                id: blockId,
                type: "heading",
                data: { text, level: mappedLevel, align: "left" },
              })
            }
          }
          // Paragraph
          else if (tagName === "p") {
            const innerHTML = cleanInlineHTML(element.innerHTML)
            const text = element.textContent?.trim() || ""

            if (text) {
              blocks.push({
                id: blockId,
                type: "paragraph",
                data: { text: innerHTML, align: "justify" },
              })
            }
          }
          // Blockquote
          else if (tagName === "blockquote") {
            const innerHTML = cleanInlineHTML(element.innerHTML)
            const text = element.textContent?.trim() || ""

            if (text) {
              blocks.push({
                id: blockId,
                type: "quote",
                data: { text: innerHTML, author: "" },
              })
            }
          }
          // Image
          else if (tagName === "img") {
            const img = element as HTMLImageElement
            const src = img.src?.trim()

            if (src) {
              // Validate URL
              try {
                new URL(src)
                blocks.push({
                  id: blockId,
                  type: "image",
                  data: {
                    url: src,
                    alt: img.alt?.trim() || "",
                    caption: img.title?.trim() || "",
                    width: "100%",
                  },
                })
              } catch {
                console.warn("Invalid image URL:", src)
              }
            }
          }
          // Table
          else if (tagName === "table") {
            const rows: string[][] = []

            element.querySelectorAll("tbody > tr, thead > tr, tfoot > tr").forEach((tr) => {
              const cells: string[] = []
              tr.querySelectorAll("td, th").forEach((cell) => {
                const cellText = cell.textContent?.trim() || ""
                if (cellText) {
                  cells.push(cleanInlineHTML(cell.innerHTML))
                } else {
                  cells.push("")
                }
              })
              if (cells.length > 0) {
                rows.push(cells)
              }
            })

            // Fallback: if no tbody/thead/tfoot, try direct tr
            if (rows.length === 0) {
              element.querySelectorAll("tr").forEach((tr) => {
                const cells: string[] = []
                tr.querySelectorAll("td, th").forEach((cell) => {
                  const cellText = cell.textContent?.trim() || ""
                  cells.push(cellText ? cleanInlineHTML(cell.innerHTML) : "")
                })
                if (cells.length > 0) {
                  rows.push(cells)
                }
              })
            }

            if (rows.length > 0 && rows[0].length > 0) {
              blocks.push({
                id: blockId,
                type: "table",
                data: {
                  rows,
                  cols: rows[0].length,
                  content: rows,
                  align: "left",
                },
              })
            }
          }
          // List (unordered or ordered)
          else if (tagName === "ul" || tagName === "ol") {
            const items: string[] = []

            // Use :scope > li to get only direct children (avoid nested lists)
            element.querySelectorAll(":scope > li").forEach((item) => {
              const text = item.textContent?.trim() || ""
              if (text) {
                items.push(cleanInlineHTML(item.innerHTML))
              }
            })

            if (items.length > 0) {
              blocks.push({
                id: blockId,
                type: "list",
                data: {
                  style: tagName === "ol" ? "ordered" : "unordered",
                  items,
                  align: "left",
                },
              })
            }
          }
          // Container elements (Google Docs wraps content in divs/sections)
          else if (["div", "section", "article", "main", "aside"].includes(tagName)) {
            // Recurse into children
            Array.from(element.children).forEach(processNode)
          }
          // Skip other tags (br, hr, etc)
        } catch (error) {
          console.warn("Error processing node:", error)
          // Continue processing other nodes
        }
      }

      // Process all body children
      Array.from(doc.body.children).forEach(processNode)

      return blocks
    } catch (error) {
      console.error("Error in parseHTMLToBlocks:", error)
      throw error
    }
  }

  const handleImport = () => {
    if (!htmlContent.trim()) {
      toast({
        title: "Chưa có nội dung",
        description: "Vui lòng dán nội dung vào trước khi import",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      let blocks: Block[] = []
      
      // First, try to detect if this is Markdown content (contains | for tables or # for headings)
      const hasMarkdownTable = /^\|.*\|$/m.test(htmlContent)
      const hasMarkdownHeading = /^#{1,6}\s+/m.test(htmlContent)
      const hasMarkdownList = /^[\*\-\+]\s+/m.test(htmlContent) || /^\d+\.\s+/m.test(htmlContent)
      
      if (hasMarkdownTable || hasMarkdownHeading || hasMarkdownList) {
        // Try Markdown parsing first
        blocks = parseMarkdownContent(htmlContent)
      }
      
      // If no blocks from Markdown, try HTML parsing
      if (blocks.length === 0) {
        blocks = parseHTMLToBlocks(htmlContent)
      }

      if (blocks.length === 0) {
        toast({
          title: "Khong tim thay noi dung",
          description: "Noi dung khong chua cac the co the chuyen doi (H1-H6, p, table, list, blockquote)",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }

      // Call onImport with parsed blocks
      onImport(blocks)

      // Reset state
      setHtmlContent("")
      setOpen(false)

      toast({
        title: "Import thanh cong",
        description: `Da them ${blocks.length} khoi tu noi dung`,
      })
    } catch (error) {
      console.error("Error parsing content:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Khong the phan tich noi dung. Vui long kiem tra lai dinh dang."

      toast({
        title: "Loi",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileCode className="w-4 h-4 mr-2" />
          Dán từ Google Docs / Gemini
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Dan noi dung tu Google Docs / Gemini / Markdown</DialogTitle>
          <DialogDescription>
            Ho tro: HTML tu Google Docs/Word, Markdown voi bang (| col1 | col2 |), headings, lists. 
            Hoac ban co the paste truc tiep vao o noi dung bai viet (Ctrl+V).
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800 flex-shrink-0">
            <p className="font-semibold mb-1">Tip: Bạn cũng có thể paste trực tiếp vào editor!</p>
            <p className="text-xs">
              Click vào ô paragraph trong bài viết, sau đó Ctrl+V - hệ thống sẽ tự tách H1/H2/paragraph/list.
            </p>
          </div>
          <div className="flex-1 flex flex-col min-h-0">
            <Textarea
              placeholder="Dán nội dung vào đây (Ctrl+V)..."
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              className="font-mono text-sm flex-1 min-h-[200px] max-h-[40vh] resize-none"
            />
            <p className="text-xs text-muted-foreground mt-2 flex-shrink-0">
              Giữ nguyên: H1-H6, in đậm, in nghiêng, gạch chân, danh sách, bảng, trích dẫn
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
            Hủy
          </Button>
          <Button onClick={handleImport} disabled={isProcessing || !htmlContent.trim()}>
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang xử lý...
              </>
            ) : (
              "Import"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
