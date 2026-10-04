"use client"

import React, { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
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
import { FileCode, Loader2, ClipboardPaste, Eye, Code2, RotateCcw, CheckCircle2 } from "lucide-react"
import type { Block } from "@/components/block-editor/types"
import { useToast } from "@/hooks/use-toast"
import {
  hasRichHtmlStructure,
  htmlToBlocks,
  looksLikeMarkdown,
  parseHtmlToParsedBlocks,
  parseMarkdownToBlocks,
  parsedBlocksToBlocks,
} from "@/lib/content-parsers"
import { blocksToHTML } from "@/lib/blocks-to-html"

interface HTMLPasteDialogProps {
  onImport: (blocks: Block[]) => void
}

export function HTMLPasteDialog({ onImport }: HTMLPasteDialogProps) {
  const [open, setOpen] = useState(false)
  const [rawInput, setRawInput] = useState("")
  const [capturedHtml, setCapturedHtml] = useState("")
  const [viewMode, setViewMode] = useState<"preview" | "source">("preview")
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  /** Tự động phân tích thành danh sách khối từ HTML clipboard hoặc Markdown/text */
  const parsedBlocks = useMemo<Block[]>(() => {
    const sourceHtml = capturedHtml.trim()
    const sourceText = rawInput.trim()

    if (!sourceHtml && !sourceText) return []

    try {
      // 1. Nếu bắt được rich HTML từ clipboard (Google Docs, Word, Excel, Gemini, Web)
      if (sourceHtml && hasRichHtmlStructure(sourceHtml, sourceText)) {
        const fromHtml = parsedBlocksToBlocks(parseHtmlToParsedBlocks(sourceHtml))
        if (fromHtml.length > 0) return fromHtml
      }

      // 2. Nếu người dùng dán hoặc gõ Markdown / bảng TSV
      if (sourceText && looksLikeMarkdown(sourceText)) {
        const fromMd = parsedBlocksToBlocks(parseMarkdownToBlocks(sourceText))
        if (fromMd.length > 0) return fromMd
      }

      // 3. Fallback qua htmlToBlocks (xử lý cả chuỗi HTML thô hoặc văn bản nhiều dòng)
      return htmlToBlocks(sourceHtml || sourceText)
    } catch (err) {
      console.warn("[blog] Lỗi phân tích nội dung dán:", err)
      return []
    }
  }, [capturedHtml, rawInput])

  const blockCounts = useMemo(() => {
    const counts = { heading: 0, paragraph: 0, table: 0, list: 0, quote: 0, image: 0 }
    for (const b of parsedBlocks) {
      if (b.type in counts) {
        counts[b.type as keyof typeof counts] += 1
      }
    }
    return counts
  }, [parsedBlocks])

  const previewHtml = useMemo(() => blocksToHTML(parsedBlocks), [parsedBlocks])

  /**
   * Bắt sự kiện Ctrl+V: lấy cả `text/html` (chứa bảng `<table>`, tiêu đề `<h2>`, in đậm `<strong>`
   * từ Google Docs / Word / Excel / Notion / Gemini) lẫn `text/plain`.
   * Trước đây dùng <Textarea> thuần nên trình duyệt tự động vứt bỏ `text/html` làm mất toàn bộ bảng và bố cục!
   */
  const handlePaste = (e: React.ClipboardEvent) => {
    const html = e.clipboardData.getData("text/html")
    const text = e.clipboardData.getData("text/plain")

    if (html && hasRichHtmlStructure(html, text)) {
      e.preventDefault()
      setCapturedHtml(html)
      setRawInput(text || html)
      setViewMode("preview")
      return
    }

    if (text) {
      e.preventDefault()
      setCapturedHtml("")
      setRawInput(text)
      setViewMode("preview")
    }
  }

  const handleReset = () => {
    setRawInput("")
    setCapturedHtml("")
    setViewMode("preview")
  }

  const handleImport = () => {
    if (parsedBlocks.length === 0) {
      toast({
        title: "Chưa có nội dung",
        description: "Vui lòng dán nội dung từ Google Docs, Word, Excel hoặc AI vào trước khi chèn",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    try {
      onImport(parsedBlocks)
      handleReset()
      setOpen(false)

      toast({
        title: "Đã chèn nội dung thành công",
        description: `Đã thêm ${parsedBlocks.length} khối${
          blockCounts.table > 0 ? ` (gồm ${blockCounts.table} bảng dữ liệu)` : ""
        } vào bài viết`,
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) handleReset()
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8">
          <FileCode className="w-3.5 h-3.5 mr-1.5" />
          <span>Dán từ Docs / Word / AI</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Dán nội dung từ Google Docs, Word, Excel, Notion hoặc AI</DialogTitle>
          <DialogDescription>
            Giữ nguyên 100% cấu trúc <strong>Bảng biểu (Table)</strong>, <strong>Tiêu đề (H2, H3)</strong>,{" "}
            <strong>Danh sách</strong>, <strong>In đậm / In nghiêng</strong> và <strong>Liên kết</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 flex-1 overflow-hidden flex flex-col min-h-0">
          {/* Nếu chưa dán gì -> hiện vùng nhận Ctrl+V trực quan */}
          {parsedBlocks.length === 0 ? (
            <div className="flex-1 flex flex-col min-h-[260px]">
              <Textarea
                placeholder="Nhấn vào đây rồi bấm Ctrl+V (hoặc Cmd+V) để dán nội dung từ Google Docs, Word, Excel, Gemini, ChatGPT..."
                value={rawInput}
                onChange={(e) => {
                  setCapturedHtml("")
                  setRawInput(e.target.value)
                }}
                onPaste={handlePaste}
                className="flex-1 min-h-[240px] resize-none border-2 border-dashed border-primary/30 bg-muted/15 p-4 text-sm focus-visible:border-primary"
                autoFocus
              />
              <p className="text-xs text-muted-foreground mt-2">
                Mẹo: Bạn cũng có thể nhấn <strong>Ctrl+V trực tiếp</strong> vào bất kỳ đoạn văn nào trên trang soạn thảo!
              </p>
            </div>
          ) : (
            <div className="flex-1 flex flex-col min-h-0 space-y-3">
              {/* Thanh thống kê các khối đã nhận diện + nút chuyển Xem trước / Mã nguồn */}
              <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border bg-emerald-50/70 border-emerald-200 px-3 py-2">
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-emerald-950">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span className="font-semibold">Đã nhận diện {parsedBlocks.length} khối:</span>
                  {blockCounts.heading > 0 && <Badge variant="secondary">{blockCounts.heading} Tiêu đề</Badge>}
                  {blockCounts.paragraph > 0 && <Badge variant="secondary">{blockCounts.paragraph} Đoạn văn</Badge>}
                  {blockCounts.table > 0 && (
                    <Badge className="bg-primary text-primary-foreground">{blockCounts.table} Bảng biểu</Badge>
                  )}
                  {blockCounts.list > 0 && <Badge variant="secondary">{blockCounts.list} Danh sách</Badge>}
                  {blockCounts.quote > 0 && <Badge variant="secondary">{blockCounts.quote} Trích dẫn</Badge>}
                  {blockCounts.image > 0 && <Badge variant="secondary">{blockCounts.image} Hình ảnh</Badge>}
                </div>

                <div className="flex items-center gap-1">
                  <Button
                    type="button"
                    variant={viewMode === "preview" ? "default" : "ghost"}
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={() => setViewMode("preview")}
                  >
                    <Eye className="w-3.5 h-3.5 mr-1" />
                    Xem trước bố cục
                  </Button>
                  <Button
                    type="button"
                    variant={viewMode === "source" ? "default" : "ghost"}
                    size="sm"
                    className="h-7 text-xs px-2"
                    onClick={() => setViewMode("source")}
                  >
                    <Code2 className="w-3.5 h-3.5 mr-1" />
                    Văn bản gốc
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs px-2 text-muted-foreground hover:text-destructive"
                    onClick={handleReset}
                  >
                    <RotateCcw className="w-3.5 h-3.5 mr-1" />
                    Dán lại
                  </Button>
                </div>
              </div>

              {/* Khung Xem trước bố cục thật hoặc Sửa văn bản gốc */}
              {viewMode === "preview" ? (
                <div
                  className="flex-1 overflow-y-auto rounded-lg border bg-white p-5 max-h-[50vh] prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: previewHtml }}
                />
              ) : (
                <Textarea
                  value={rawInput}
                  onChange={(e) => {
                    setCapturedHtml("")
                    setRawInput(e.target.value)
                  }}
                  onPaste={handlePaste}
                  className="font-mono text-xs flex-1 min-h-[240px] max-h-[50vh] resize-none"
                />
              )}
            </div>
          )}
        </div>

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={() => setOpen(false)} disabled={isProcessing}>
            Hủy
          </Button>
          <Button onClick={handleImport} disabled={isProcessing || parsedBlocks.length === 0}>
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang chèn...
              </>
            ) : (
              <>
                <ClipboardPaste className="w-4 h-4 mr-2" />
                Chèn {parsedBlocks.length > 0 ? `${parsedBlocks.length} khối ` : ""}vào bài viết
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
