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
import { htmlToBlocks, looksLikeMarkdown, parseMarkdownToBlocks, parsedBlocksToBlocks } from "@/lib/content-parsers"

interface HTMLPasteDialogProps {
  onImport: (blocks: Block[]) => void
}

export function HTMLPasteDialog({ onImport }: HTMLPasteDialogProps) {
  const [open, setOpen] = useState(false)
  const [htmlContent, setHtmlContent] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

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

      // Markdown (bảng, heading, list...) -> parse trực tiếp
      if (looksLikeMarkdown(htmlContent)) {
        blocks = parsedBlocksToBlocks(parseMarkdownToBlocks(htmlContent))
      }

      // Còn lại (hoặc markdown không ra khối nào) -> parse HTML / text thuần
      if (blocks.length === 0) {
        blocks = htmlToBlocks(htmlContent)
      }

      if (blocks.length === 0) {
        toast({
          title: "Không tìm thấy nội dung",
          description: "Nội dung không chứa các thẻ có thể chuyển đổi (H1-H6, p, table, list, blockquote, img)",
          variant: "destructive",
        })
        return
      }

      onImport(blocks)

      setHtmlContent("")
      setOpen(false)

      toast({
        title: "Import thành công",
        description: `Đã thêm ${blocks.length} khối vào bài viết`,
      })
    } catch (error) {
      console.error("[blog] Lỗi khi parse nội dung import:", error)
      toast({
        title: "Lỗi",
        description:
          error instanceof Error
            ? error.message
            : "Không thể phân tích nội dung. Vui lòng kiểm tra lại định dạng.",
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
          <DialogTitle>Dán nội dung từ Google Docs / Gemini / Markdown</DialogTitle>
          <DialogDescription>
            Hỗ trợ: HTML từ Google Docs/Word, Markdown với bảng (| col1 | col2 |), headings, lists. Hoặc bạn có thể
            paste trực tiếp vào ô nội dung bài viết (Ctrl+V).
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
