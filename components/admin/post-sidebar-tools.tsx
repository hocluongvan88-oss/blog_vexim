"use client"

import { useEffect, useMemo, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link2, Search, HelpCircle, BookOpen, Plus, Loader2 } from "lucide-react"
import type { Block } from "@/components/block-editor/types"
import { generateBlockId } from "@/lib/content-parsers"
import { suggestQuestions } from "@/lib/seo-analysis"
import { getOfficialSources } from "@/lib/official-sources"
import { escapeAttr, escapeHtml } from "@/lib/sanitize"

interface SearchResult {
  id: string
  title: string
  slug: string
  category: string
  excerpt?: string
}

interface PostSidebarToolsProps {
  category: string
  focusKeyword: string
  /** Tiêu đề bài đang viết — dùng để loại chính nó khỏi danh sách gợi ý */
  title: string
  /** Thêm block vào cuối bài (BlockEditor tự đồng bộ khi prop `value` đổi) */
  onInsertBlocks: (blocks: Block[]) => void
}

function paragraphBlock(text: string): Block {
  return { id: generateBlockId("block"), type: "paragraph", data: { text, align: "justify" } }
}

function headingBlock(text: string): Block {
  return { id: generateBlockId("block"), type: "heading", data: { text, align: "left", level: 2 } }
}

/**
 * Panel hỗ trợ writer: câu hỏi nên trả lời, nguồn chính thống, liên kết nội bộ gợi ý.
 *
 * Trước đây trình soạn thảo chỉ có ô tìm bài để chèn link thủ công; phần lớn tín hiệu
 * quan trọng (câu hỏi người đọc quan tâm, nguồn chính thống, bài liên quan) đều không có gợi ý.
 */
export function PostSidebarTools({ category = "", focusKeyword = "", title = "", onInsertBlocks }: PostSidebarToolsProps) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [query, setQuery] = useState("")

  const safeCategory = category || ""
  const safeFocusKeyword = focusKeyword || ""
  const safeTitle = title || ""

  const questions = useMemo(() => suggestQuestions(safeFocusKeyword, safeCategory), [safeFocusKeyword, safeCategory])
  const sources = useMemo(() => getOfficialSources(safeCategory), [safeCategory])

  // Từ khóa tìm kiếm mặc định: từ khóa trọng tâm, nếu chưa có thì lấy vài từ đầu của tiêu đề
  const defaultQuery = useMemo(() => {
    const keyword = safeFocusKeyword.trim()
    if (keyword) return keyword
    return safeTitle.trim().split(/\s+/).slice(0, 4).join(" ")
  }, [safeFocusKeyword, safeTitle])

  useEffect(() => {
    setQuery(defaultQuery)
  }, [defaultQuery])

  useEffect(() => {
    const term = (query || defaultQuery).trim()
    if (term.length < 2) {
      setResults([])
      return
    }

    let cancelled = false
    const timer = window.setTimeout(async () => {
      setIsSearching(true)
      try {
        const response = await fetch(`/api/blog/search?q=${encodeURIComponent(term)}`)
        const data = await response.json()
        if (cancelled) return

        const items: SearchResult[] = Array.isArray(data?.results) ? data.results : []
        setResults(
          items
            .filter((item) => typeof item?.title === "string" && item.title.trim() !== safeTitle.trim())
            .slice(0, 4),
        )
      } catch (error) {
        if (!cancelled) console.error("[blog] Lỗi tìm bài liên quan:", error)
      } finally {
        if (!cancelled) setIsSearching(false)
      }
    }, 400)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [query, defaultQuery, safeTitle])

  /** Thêm H2 dạng câu hỏi + khối trả lời gợi ý ngay bên dưới. */
  const addQuestionSection = (question: string) => {
    onInsertBlocks([
      headingBlock(question),
      paragraphBlock(
        "<em>Trả lời trực tiếp trong 2–3 câu (40–80 từ) ngay dưới tiêu đề mục này, sau đó mới giải thích chi tiết.</em>",
      ),
    ])
  }

  /** Chèn câu dẫn nguồn chính thống (writer sửa lại nội dung sau khi chèn). */
  const insertSource = (title_: string, url: string) => {
    const link = `<a href="${escapeAttr(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(title_)}</a>`
    onInsertBlocks([
      paragraphBlock(
        `Theo ${link}, [bổ sung số liệu/quy định cụ thể ở đây] — điều này có nghĩa là [nêu hệ quả với doanh nghiệp xuất khẩu].`,
      ),
    ])
  }

  /** Chèn liên kết nội bộ với anchor text mô tả đích đến (không dùng "xem thêm"). */
  const insertInternalLink = (post: SearchResult) => {
    const anchorText = String(post?.title || "").replace(/[–—|].*$/, "").trim().slice(0, 70) || String(post?.slug || "")
    if (!anchorText) return
    onInsertBlocks([
      paragraphBlock(
        `Xem thêm: <a href="/blog/${escapeAttr(post.slug)}">${escapeHtml(anchorText)}</a>`,
      ),
    ])
  }

  return (
    <Card className="p-6">
      <h3 className="text-lg font-bold text-primary mb-1">Gợi ý bổ sung cho bài viết</h3>
      <p className="text-xs text-muted-foreground mb-4">
        Các mục được thêm vào <strong>cuối bài</strong> — hãy kéo thả tới đúng vị trí sau khi chèn.
      </p>

      {/* ----------------------- Câu hỏi nên trả lời ----------------------- */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
          <HelpCircle className="w-4 h-4" /> Câu hỏi nên trả lời
        </h4>
        <div className="space-y-2">
          {questions.map((question) => (
            <div key={question} className="flex items-start justify-between gap-2 rounded-md border p-2">
              <span className="text-sm">{question}</span>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-[11px] bg-transparent flex-shrink-0"
                onClick={() => addQuestionSection(question)}
              >
                <Plus className="w-3 h-3 mr-1" /> Chèn
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------- Nguồn chính thống ------------------------- */}
      <div className="mb-5">
        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
          <BookOpen className="w-4 h-4" /> Nguồn chính thống ({category || "chung"})
        </h4>
        <div className="space-y-2">
          {sources.map((source) => (
            <div key={source.url} className="flex items-start justify-between gap-2 rounded-md border p-2">
              <div className="min-w-0">
                <div className="text-sm leading-snug">{source.title}</div>
                {source.note && <div className="text-[11px] text-muted-foreground">{source.note}</div>}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-[11px] bg-transparent flex-shrink-0"
                onClick={() => insertSource(source.title, source.url)}
              >
                Chèn
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------ Liên kết nội bộ ------------------------ */}
      <div>
        <h4 className="text-sm font-semibold text-muted-foreground flex items-center gap-1.5 mb-2">
          <Link2 className="w-4 h-4" /> Liên kết nội bộ gợi ý
        </h4>
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm bài viết để liên kết..."
            className="h-9 pl-8 text-sm"
          />
        </div>

        {isSearching && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Loader2 className="w-3.5 h-3.5 animate-spin" /> Đang tìm...
          </div>
        )}

        {!isSearching && results.length === 0 && (
          <p className="text-xs text-muted-foreground">
            Chưa có bài phù hợp. Thử từ khóa khác hoặc chèn link tới trang dịch vụ liên quan.
          </p>
        )}

        <div className="space-y-2">
          {results.map((post) => (
            <div key={post.id} className="flex items-start justify-between gap-2 rounded-md border p-2">
              <div className="min-w-0">
                <div className="text-sm leading-snug line-clamp-2">{post.title}</div>
                <div className="text-[11px] text-muted-foreground">/blog/{post.slug}</div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="h-6 px-2 text-[11px] bg-transparent flex-shrink-0"
                onClick={() => insertInternalLink(post)}
              >
                Chèn link
              </Button>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
