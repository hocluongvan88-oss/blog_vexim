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
        description: "Vui lòng dán HTML vào trước khi import",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      const blocks = parseHTMLToBlocks(htmlContent)

      if (blocks.length === 0) {
        toast({
          title: "Không tìm thấy nội dung",
          description: "HTML không chứa các thẻ có thể chuyển đổi (H1-H6, p, table, list, blockquote)",
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
        title: "Import thành công",
        description: `Đã thêm ${blocks.length} khối từ HTML`,
      })
    } catch (error) {
      console.error("Error parsing HTML:", error)
      const errorMessage =
        error instanceof Error ? error.message : "Không thể phân tích HTML. Vui lòng kiểm tra lại định dạng."

      toast({
        title: "Lỗi",
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
          <DialogTitle>Dán nội dung từ Google Docs / Gemini / Word</DialogTitle>
          <DialogDescription>
            Hoặc bạn có thể paste trực tiếp vào ô nội dung bài viết (Ctrl+V) - hệ thống sẽ tự nhận diện H1, H2, bold,
            italic.
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