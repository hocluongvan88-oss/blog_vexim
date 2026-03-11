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

  // Clean HTML: remove unwanted tags/attributes but keep formatting
  const cleanInlineHTML = (html: string): string => {
    const temp = document.createElement("div")
    temp.innerHTML = html

    // Remove script/style tags
    temp.querySelectorAll("script, style, meta, link").forEach((el) => el.remove())

    // Remove Google Docs wrapper spans but keep their text content
    temp.querySelectorAll("span").forEach((span) => {
      // Keep spans that have bold/italic/underline inline styles
      const style = span.getAttribute("style") || ""
      const hasBold = style.includes("font-weight:700") || style.includes("font-weight: 700") || style.includes("font-weight:bold")
      const hasItalic = style.includes("font-style:italic") || style.includes("font-style: italic")
      const hasUnderline = style.includes("text-decoration:underline") || style.includes("text-decoration: underline")

      if (hasBold) {
        const strong = document.createElement("strong")
        strong.innerHTML = span.innerHTML
        span.replaceWith(strong)
      } else if (hasItalic) {
        const em = document.createElement("em")
        em.innerHTML = span.innerHTML
        span.replaceWith(em)
      } else if (hasUnderline) {
        const u = document.createElement("u")
        u.innerHTML = span.innerHTML
        span.replaceWith(u)
      } else {
        // Plain span - unwrap and keep children
        span.replaceWith(...Array.from(span.childNodes))
      }
    })

    // Clean up class and style attributes from allowed tags (keep only formatting tags)
    temp.querySelectorAll("*").forEach((el) => {
      if (!["strong", "b", "em", "i", "u", "a", "code", "br"].includes(el.tagName.toLowerCase())) {
        el.removeAttribute("class")
        el.removeAttribute("style")
        el.removeAttribute("id")
      }
    })

    return temp.innerHTML
  }

  const parseHTMLToBlocks = (html: string): Block[] => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const blocks: Block[] = []
    let counter = 0

    const processNode = (element: Element) => {
      const tagName = element.tagName.toLowerCase()
      counter++
      const blockId = `block-import-${Date.now()}-${counter}`

      if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tagName)) {
        const level = parseInt(tagName.charAt(1))
        const mappedLevel = level > 3 ? 3 : (level as 1 | 2 | 3)
        const text = element.textContent || ""
        if (text.trim()) {
          blocks.push({
            id: blockId,
            type: "heading",
            data: { text: text.trim(), level: mappedLevel, align: "left" },
          })
        }
      } else if (tagName === "p") {
        // Use innerHTML to preserve bold/italic/links inside paragraph
        const innerHTML = cleanInlineHTML(element.innerHTML)
        const text = element.textContent || ""
        if (text.trim()) {
          blocks.push({
            id: blockId,
            type: "paragraph",
            data: { text: innerHTML, align: "justify" },
          })
        }
      } else if (tagName === "blockquote") {
        const innerHTML = cleanInlineHTML(element.innerHTML)
        const text = element.textContent || ""
        if (text.trim()) {
          blocks.push({
            id: blockId,
            type: "quote",
            data: { text: innerHTML, author: "" },
          })
        }
      } else if (tagName === "img") {
        const img = element as HTMLImageElement
        if (img.src) {
          blocks.push({
            id: blockId,
            type: "image",
            data: { url: img.src, alt: img.alt || "", caption: img.title || "", width: "100%" },
          })
        }
      } else if (tagName === "table") {
        const rows: string[][] = []
        element.querySelectorAll("tr").forEach((tr) => {
          const cells: string[] = []
          tr.querySelectorAll("td, th").forEach((cell) => {
            // Keep inner HTML of cells for formatting
            cells.push(cleanInlineHTML(cell.innerHTML))
          })
          if (cells.length > 0) rows.push(cells)
        })
        if (rows.length > 0) {
          blocks.push({
            id: blockId,
            type: "table",
            data: { rows, cols: rows[0].length, content: rows, align: "left" },
          })
        }
      } else if (tagName === "ul" || tagName === "ol") {
        // Convert list to a proper list block, preserving item formatting
        const items: string[] = []
        element.querySelectorAll("li").forEach((item) => {
          const text = item.textContent || ""
          if (text.trim()) items.push(cleanInlineHTML(item.innerHTML))
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
      } else if (tagName === "div" || tagName === "section" || tagName === "article") {
        // Recurse into container elements (Google Docs wraps everything in divs)
        Array.from(element.children).forEach(processNode)
      }
    }

    Array.from(doc.body.children).forEach(processNode)

    return blocks
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
          description: "HTML không chứa các thẻ có thể chuyển đổi",
          variant: "destructive",
        })
        setIsProcessing(false)
        return
      }

      onImport(blocks)
      setHtmlContent("")
      setOpen(false)
      
      toast({
        title: "Import thành công",
        description: `Đã thêm ${blocks.length} khối từ HTML`,
      })
    } catch (error) {
      console.error("Error parsing HTML:", error)
      toast({
        title: "Lỗi",
        description: "Không thể phân tích HTML. Vui lòng kiểm tra lại định dạng.",
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
            Hoặc bạn có thể paste trực tiếp vào ô nội dung bài viết (Ctrl+V) - hệ thống sẽ tự nhận diện H1, H2, bold, italic.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 text-sm text-blue-800 flex-shrink-0">
            <p className="font-semibold mb-1">Tip: Bạn cũng có thể paste trực tiếp vào editor!</p>
            <p className="text-xs">Click vào ô paragraph trong bài viết, sau đó Ctrl+V - hệ thống sẽ tự tách H1/H2/paragraph/list.</p>
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
