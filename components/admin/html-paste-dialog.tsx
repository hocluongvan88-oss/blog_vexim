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

  const parseHTMLToBlocks = (html: string): Block[] => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const blocks: Block[] = []

    // Process each element in the body
    const elements = doc.body.children

    for (let i = 0; i < elements.length; i++) {
      const element = elements[i]
      const tagName = element.tagName.toLowerCase()

      // Generate unique ID
      const blockId = `block-${Date.now()}-${i}`

      // Convert based on tag type
      if (tagName === "h1" || tagName === "h2" || tagName === "h3" || tagName === "h4" || tagName === "h5" || tagName === "h6") {
        const level = parseInt(tagName.charAt(1))
        // Map h4-h6 to h3 since block editor only supports 1-3
        const mappedLevel = level > 3 ? 3 : (level as 1 | 2 | 3)

        blocks.push({
          id: blockId,
          type: "heading",
          data: {
            text: element.textContent || "",
            level: mappedLevel,
          },
        })
      } else if (tagName === "p") {
        const text = element.textContent || ""
        if (text.trim()) {
          blocks.push({
            id: blockId,
            type: "paragraph",
            data: {
              text,
              alignment: "left",
            },
          })
        }
      } else if (tagName === "blockquote") {
        blocks.push({
          id: blockId,
          type: "quote",
          data: {
            text: element.textContent || "",
            author: "",
          },
        })
      } else if (tagName === "img") {
        const img = element as HTMLImageElement
        blocks.push({
          id: blockId,
          type: "image",
          data: {
            url: img.src,
            alt: img.alt || "",
            caption: img.title || "",
            width: "100%",
          },
        })
      } else if (tagName === "table") {
        // Basic table parsing
        const rows: string[][] = []
        const tableRows = element.querySelectorAll("tr")
        
        tableRows.forEach((tr) => {
          const cells: string[] = []
          const tableCells = tr.querySelectorAll("td, th")
          tableCells.forEach((cell) => {
            cells.push(cell.textContent || "")
          })
          if (cells.length > 0) {
            rows.push(cells)
          }
        })

        if (rows.length > 0) {
          blocks.push({
            id: blockId,
            type: "table",
            data: {
              rows,
            },
          })
        }
      } else if (tagName === "ul" || tagName === "ol") {
        // Convert lists to paragraphs with bullets
        const items = element.querySelectorAll("li")
        items.forEach((item, idx) => {
          const prefix = tagName === "ul" ? "• " : `${idx + 1}. `
          blocks.push({
            id: `${blockId}-${idx}`,
            type: "paragraph",
            data: {
              text: prefix + (item.textContent || ""),
              alignment: "left",
            },
          })
        })
      }
    }

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
          Import HTML
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Import từ HTML</DialogTitle>
          <DialogDescription>
            Dán HTML từ WordPress hoặc nguồn khác. Hệ thống sẽ tự động chuyển đổi sang các khối nội dung.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Textarea
              placeholder="Dán HTML vào đây..."
              value={htmlContent}
              onChange={(e) => setHtmlContent(e.target.value)}
              rows={12}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Hỗ trợ: h1-h6, p, blockquote, img, table, ul, ol
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
