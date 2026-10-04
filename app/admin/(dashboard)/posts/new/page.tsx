"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Eye,
  Save,
  Send,
  Loader2,
  RotateCcw,
  X,
  ArrowLeft,
  Sparkles,
  Settings2,
  SearchCheck,
  ImageIcon,
  ChevronDown,
  ChevronUp,
  PanelRightClose,
  PanelRightOpen,
  Wand2,
  CheckCircle2,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { BlockEditor } from "@/components/block-editor/block-editor"
import { SEOChecker } from "@/components/seo-checker"
import { ImageUploader } from "@/components/image-uploader"
import { AIWritingAssistant } from "@/components/admin/ai-writing-assistant"
import { HTMLPasteDialog } from "@/components/admin/html-paste-dialog"
import { PostPreviewDialog } from "@/components/admin/post-preview-dialog"
import type { Block } from "@/components/block-editor/types"
import {
  blocksToPlainText,
  generateBlockId,
  parseInlineMarkdown,
  parseMarkdownToBlocks,
  parsedBlocksToBlocks,
} from "@/lib/content-parsers"
import { slugify } from "@/lib/post-payload"
import { sanitizeInlineHtml } from "@/lib/sanitize"
import { BLOG_CATEGORIES } from "@/lib/blog-categories"
import { useDraftAutosave } from "@/hooks/use-draft-autosave"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { PostSidebarTools } from "@/components/admin/post-sidebar-tools"
import { analyzePostSeo } from "@/lib/seo-analysis"

const MIN_PUBLISH_LENGTH = 50
const DRAFT_STORAGE_KEY = "vexim-blog-draft-new"

interface DraftSnapshot {
  title: string
  slug: string
  category: string
  excerpt: string
  blocks: Block[]
  metaTitle: string
  metaDescription: string
  featuredImage: string
  featuredImageAlt: string
  focusKeyword: string
}

export default function NewPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [slugTouched, setSlugTouched] = useState(false)
  const [showSlugEdit, setShowSlugEdit] = useState(false)
  const [category, setCategory] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [blocks, setBlocks] = useState<Block[]>([])
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [featuredImageAlt, setFeaturedImageAlt] = useState("")
  const [focusKeyword, setFocusKeyword] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [selectedText, setSelectedText] = useState("")
  const [showPreview, setShowPreview] = useState(false)
  const [showCoverSection, setShowCoverSection] = useState(false)
  const [showSidebar, setShowSidebar] = useState(true)
  const [activeSidebarTab, setActiveSidebarTab] = useState<"settings" | "seo" | "ai">("settings")

  /** Khối đang được chọn trong trình soạn thảo (để chèn nội dung ngay dưới khối đó thay vì cuối bài). */
  const activeBlockIdRef = useRef<string | null>(null)
  /** Khối đang chứa đoạn văn bản được bôi đen (để AI thay thế đúng chỗ). */
  const selectionBlockIdRef = useRef<string | null>(null)

  /* ---------------------- Hỗ trợ phân tích SEO cho writer ---------------------- */

  const [otherPosts, setOtherPosts] = useState<Array<{ id?: string; title: string; focus_keyword?: string | null }>>([])

  useEffect(() => {
    let cancelled = false
    const loadOtherPosts = async () => {
      try {
        const response = await fetch("/api/posts?status=published&limit=100")
        if (!response.ok) return
        const data = await response.json()
        if (!cancelled && Array.isArray(data)) {
          const validPosts = data.filter((item) => item && typeof item.title === "string")
          setOtherPosts(validPosts)
        }
      } catch (error) {
        console.warn("[blog] Không tải được danh sách bài viết để kiểm tra trùng chủ đề:", error)
      }
    }
    loadOtherPosts()
    return () => {
      cancelled = true
    }
  }, [])

  const seoInput = useMemo(
    () => ({
      title,
      excerpt,
      metaTitle,
      metaDescription,
      focusKeyword,
      slug,
      featuredImage,
      featuredImageAlt,
      blocks,
    }),
    [title, excerpt, metaTitle, metaDescription, focusKeyword, slug, featuredImage, featuredImageAlt, blocks],
  )
  const debouncedSeoInput = useDebouncedValue(seoInput, 400)

  const quickStats = useMemo(() => {
    const plain = blocksToPlainText(blocks)
    const words = plain ? plain.split(/\s+/).filter(Boolean).length : 0
    const readingMinutes = Math.max(1, Math.round(words / 220))
    const seoSummary = analyzePostSeo({
      ...debouncedSeoInput,
      otherPosts: [],
    })
    return {
      words,
      readingMinutes,
      technicalScore: seoSummary.scores.technical,
    }
  }, [blocks, debouncedSeoInput])

  /** Cuộn tới khối cần sửa và làm nổi bật trong giây lát. */
  const handleFocusBlock = useCallback((blockId: string) => {
    const element = document.querySelector(`[data-block-id="${blockId}"]`)
    if (!element) return
    element.scrollIntoView({ behavior: "smooth", block: "center" })
    element.classList.add("ring-2", "ring-amber-400", "rounded-lg")
    window.setTimeout(() => element.classList.remove("ring-2", "ring-amber-400", "rounded-lg"), 1800)
  }, [])

  /**
   * Chèn khối mới ngay dưới khối đang chọn (hoặc cuối bài nếu không chọn khối nào),
   * sau đó cuộn mượt tới khối vừa chèn.
   */
  const handleInsertBlocks = useCallback(
    (newBlocks: Block[]) => {
      if (newBlocks.length === 0) return
      setBlocks((prev) => {
        const targetId = activeBlockIdRef.current || selectionBlockIdRef.current
        const idx = targetId ? prev.findIndex((b) => b.id === targetId) : -1
        if (idx >= 0) {
          const next = [...prev]
          next.splice(idx + 1, 0, ...newBlocks)
          return next
        }
        return [...prev, ...newBlocks]
      })

      const firstInsertedId = newBlocks[0]?.id
      if (firstInsertedId) {
        setTimeout(() => handleFocusBlock(firstInsertedId), 80)
      }
      toast({
        title: "Đã chèn vào bài viết",
        description: `Đã thêm ${newBlocks.length} khối vào vị trí đang soạn thảo`,
      })
    },
    [handleFocusBlock, toast],
  )

  // Slug tự sinh từ tiêu đề cho tới khi người dùng tự sửa
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title))
  }, [title, slugTouched])

  // Theo dõi vùng chọn trong toàn trang
  useEffect(() => {
    const handler = () => {
      const selection = window.getSelection()
      const text = selection?.toString() || ""
      if (!text.trim()) return

      const node = selection?.anchorNode
      const element =
        node?.nodeType === Node.TEXT_NODE ? node.parentElement : ((node as HTMLElement | null) ?? null)
      const blockElement = element?.closest?.("[data-block-id]") as HTMLElement | null

      setSelectedText(text)
      selectionBlockIdRef.current = blockElement?.getAttribute("data-block-id") ?? null
    }

    document.addEventListener("mouseup", handler)
    document.addEventListener("keyup", handler)
    return () => {
      document.removeEventListener("mouseup", handler)
      document.removeEventListener("keyup", handler)
    }
  }, [])

  const getTextContent = useCallback(() => blocksToPlainText(blocks), [blocks])

  /** Tự trích mô tả ngắn từ đoạn văn đầu tiên của bài viết */
  const handleAutoFillExcerpt = () => {
    const plain = blocksToPlainText(blocks).trim()
    if (!plain) {
      toast({
        title: "Chưa có nội dung",
        description: "Hãy viết nội dung bài viết trước để hệ thống tự trích mô tả ngắn",
        variant: "destructive",
      })
      return
    }
    const clipped = plain.length > 180 ? `${plain.slice(0, 177).replace(/\s+\S*$/, "")}...` : plain
    setExcerpt(clipped)
    toast({ title: "Đã tạo mô tả ngắn", description: "Đã trích từ đoạn mở đầu của bài viết" })
  }

  /** Áp dụng kết quả AI vào khối đang chọn (hoặc ngay dưới khối đang đứng). */
  const handleApplyAISuggestion = (newText: string) => {
    const text = (newText || "").trim()
    if (!text) {
      toast({ title: "Không có nội dung", description: "Kết quả AI đang trống", variant: "destructive" })
      return
    }

    const targetId = selectionBlockIdRef.current || activeBlockIdRef.current
    const targetIndex = targetId ? blocks.findIndex((block) => block.id === targetId) : -1
    const target = targetIndex >= 0 ? blocks[targetIndex] : null
    const canReplace = !!selectionBlockIdRef.current && !!target && ["paragraph", "heading", "quote"].includes(target.type)

    if (canReplace && target) {
      const segments = text
        .split(/\n{2,}/)
        .map((segment) => segment.trim())
        .filter(Boolean)

      if (segments.length <= 1) {
        const next = [...blocks]
        next[targetIndex] = {
          ...target,
          data: { ...target.data, text: sanitizeInlineHtml(parseInlineMarkdown(text).replace(/\n/g, "<br />")) },
        }
        setBlocks(next)
      } else {
        const replacements: Block[] = segments.map((segment) => ({
          ...target,
          id: generateBlockId("block"),
          data: { ...target.data, text: sanitizeInlineHtml(parseInlineMarkdown(segment).replace(/\n/g, "<br />")) },
        }))
        setBlocks([...blocks.slice(0, targetIndex), ...replacements, ...blocks.slice(targetIndex + 1)])
      }

      toast({ title: "Đã áp dụng", description: "Nội dung AI đã thay thế đoạn đang chọn" })
    } else {
      const newBlocks = parsedBlocksToBlocks(parseMarkdownToBlocks(text))
      handleInsertBlocks(newBlocks)
    }

    selectionBlockIdRef.current = null
  }

  const handleGenerateMeta = (meta: { description: string; keywords: string[] }) => {
    setMetaDescription(meta.description)
    if (!excerpt.trim() && meta.description) {
      setExcerpt(meta.description.slice(0, 200))
    }
    toast({
      title: "Đã tạo Meta Description",
      description: "Meta description đã được cập nhật tự động",
    })
  }

  const handleHTMLImport = (newBlocks: Block[]) => {
    if (newBlocks.length === 0) return
    setBlocks((prev) => {
      // Nếu chỉ có 1 khối mặc định trống thì thay thế luôn để không dư dòng trắng đầu bài
      if (prev.length === 1 && prev[0].type === "paragraph" && !blocksToPlainText(prev).trim()) {
        return newBlocks
      }
      return [...prev, ...newBlocks]
    })
  }

  /* ------------------------- Bản nháp tự động ------------------------- */
  const draftSnapshot = useMemo<DraftSnapshot>(
    () => ({
      title,
      slug,
      category,
      excerpt,
      blocks,
      metaTitle,
      metaDescription,
      featuredImage,
      featuredImageAlt,
      focusKeyword,
    }),
    [title, slug, category, excerpt, blocks, metaTitle, metaDescription, featuredImage, featuredImageAlt, focusKeyword],
  )

  const { pendingDraft, lastSavedAt, markSaved, restoreDraft, discardDraft } = useDraftAutosave(
    DRAFT_STORAGE_KEY,
    draftSnapshot,
    {
      isEmpty: (draft) =>
        !(draft?.title || "").trim() && !(draft?.excerpt || "").trim() && blocksToPlainText(draft?.blocks).length === 0,
    },
  )

  const handleRestoreDraft = () => {
    const draft = restoreDraft()
    if (!draft) return
    setTitle(draft.title || "")
    setSlug(draft.slug || "")
    setSlugTouched(Boolean(draft.slug))
    setCategory(draft.category || "")
    setExcerpt(draft.excerpt || "")
    if (Array.isArray(draft.blocks) && draft.blocks.length > 0) {
      setBlocks(draft.blocks)
    }
    setMetaTitle(draft.metaTitle || "")
    setMetaDescription(draft.metaDescription || "")
    setFeaturedImage(draft.featuredImage || "")
    setFeaturedImageAlt(draft.featuredImageAlt || "")
    setFocusKeyword(draft.focusKeyword || "")
    setPreviewImage(draft.featuredImage || null)
    if (draft.featuredImage) setShowCoverSection(true)
    toast({ title: "Đã khôi phục bản nháp", description: "Kiểm tra lại nội dung trước khi xuất bản" })
  }

  const validate = (status: "draft" | "published", effectiveExcerpt: string): boolean => {
    if (!title.trim()) {
      toast({
        title: "Chưa có tiêu đề",
        description: "Vui lòng nhập tiêu đề bài viết ở đầu trang",
        variant: "destructive",
      })
      document.getElementById("title")?.focus()
      return false
    }

    if (!category) {
      toast({
        title: "Chưa chọn danh mục",
        description: "Vui lòng chọn danh mục bài viết trước khi lưu",
        variant: "destructive",
      })
      setActiveSidebarTab("settings")
      return false
    }

    if (!effectiveExcerpt.trim()) {
      toast({
        title: "Thiếu mô tả ngắn",
        description: "Vui lòng nhập mô tả ngắn hoặc bấm 'Tự trích từ bài viết'",
        variant: "destructive",
      })
      document.getElementById("excerpt")?.focus()
      return false
    }

    const plainLength = blocksToPlainText(blocks).length
    if (plainLength === 0) {
      toast({ title: "Chưa có nội dung", description: "Vui lòng nhập nội dung bài viết", variant: "destructive" })
      return false
    }

    if (status === "published" && plainLength < MIN_PUBLISH_LENGTH) {
      toast({
        title: "Nội dung quá ngắn",
        description: `Cần tối thiểu ${MIN_PUBLISH_LENGTH} ký tự nội dung để xuất bản`,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (status: "draft" | "published") => {
    // Nếu người dùng quên điền mô tả ngắn nhưng đã viết nội dung bài viết -> tự động trích đoạn mở đầu giúp họ!
    let effectiveExcerpt = excerpt.trim()
    if (!effectiveExcerpt) {
      const plain = blocksToPlainText(blocks).trim()
      if (plain) {
        effectiveExcerpt = plain.length > 180 ? `${plain.slice(0, 177).replace(/\s+\S*$/, "")}...` : plain
        setExcerpt(effectiveExcerpt)
      }
    }

    if (!validate(status, effectiveExcerpt)) return

    setIsLoading(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || slugify(title),
          category,
          excerpt: effectiveExcerpt,
          content: JSON.stringify(blocks),
          featured_image: featuredImage,
          featured_image_alt: featuredImageAlt,
          focus_keyword: focusKeyword,
          meta_title: metaTitle || title,
          meta_description: metaDescription || effectiveExcerpt,
          status,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra")
      }

      markSaved()

      toast({
        title: status === "published" ? "Đã xuất bản!" : "Đã lưu nháp!",
        description: status === "published" ? "Bài viết đã được xuất bản thành công" : "Bản nháp đã được lưu",
      })

      router.push("/admin/posts")
      router.refresh()
    } catch (error) {
      console.error("[blog] Lỗi lưu bài viết:", error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể lưu bài viết",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const autoSavedLabel = lastSavedAt
    ? `Đã tự lưu lúc ${new Date(lastSavedAt).toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })}`
    : "Tự động lưu nháp"

  const focusFirstEditorBlock = () => {
    const firstEditable = document.querySelector(".block-editor-container [contenteditable]") as HTMLElement | null
    firstEditable?.focus()
  }

  return (
    <div className="min-h-screen flex flex-col bg-secondary/20">
      {/* ==================== THANH HÀNH ĐỘNG CỐ ĐỊNH TRÊN CÙNG (WordPress / Notion Top Bar) ==================== */}
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 px-4 md:px-6 py-2.5">
        <div className="max-w-[1600px] mx-auto flex flex-wrap items-center justify-between gap-3">
          {/* Trái: Quay lại + Trạng thái + Đếm từ */}
          <div className="flex items-center gap-3 min-w-0">
            <Link href="/admin/posts">
              <Button variant="ghost" size="sm" className="h-8 px-2.5 gap-1.5 text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Bài viết</span>
              </Button>
            </Link>

            <div className="h-4 w-px bg-border hidden sm:block" />

            <div className="flex items-center gap-2 min-w-0">
              <span className="font-semibold text-sm text-primary truncate">Tạo bài viết mới</span>
              <Badge variant="secondary" className="text-[11px] font-normal hidden md:inline-flex">
                {quickStats.words} từ · ~{quickStats.readingMinutes} phút đọc
              </Badge>
              <span className="text-xs text-muted-foreground hidden lg:inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {autoSavedLabel}
              </span>
            </div>
          </div>

          {/* Phải: Import Docs + Xem trước + Lưu nháp + Xuất bản + Đóng/Mở cột phải */}
          <div className="flex items-center gap-2">
            <HTMLPasteDialog onImport={handleHTMLImport} />

            <Button
              onClick={() => setShowPreview(true)}
              variant="outline"
              size="sm"
              className="h-8"
              type="button"
            >
              <Eye className="w-3.5 h-3.5 sm:mr-1.5" />
              <span className="hidden sm:inline">Xem trước</span>
            </Button>

            <Button
              onClick={() => handleSubmit("draft")}
              variant="outline"
              size="sm"
              disabled={isLoading}
              className="h-8"
              type="button"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 sm:mr-1.5 animate-spin" /> : <Save className="w-3.5 h-3.5 sm:mr-1.5" />}
              <span>Lưu nháp</span>
            </Button>

            <Button
              onClick={() => handleSubmit("published")}
              disabled={isLoading}
              size="sm"
              className="h-8 bg-primary hover:bg-primary/90"
              type="button"
            >
              {isLoading ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Send className="w-3.5 h-3.5 mr-1.5" />}
              <span>Xuất bản</span>
            </Button>

            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hidden lg:inline-flex"
              onClick={() => setShowSidebar((v) => !v)}
              title={showSidebar ? "Ẩn bảng cài đặt bên phải (Chế độ tập trung viết)" : "Hiện bảng cài đặt bên phải"}
            >
              {showSidebar ? <PanelRightClose className="w-4 h-4" /> : <PanelRightOpen className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </header>

      {/* ==================== NỘI DUNG CHÍNH ==================== */}
      <div className="flex-1 max-w-[1600px] w-full mx-auto px-4 md:px-6 py-6">
        {/* Banner khôi phục bản nháp tự động */}
        {pendingDraft && (
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 shadow-xs">
            <div className="flex items-center gap-2">
              <RotateCcw className="h-4 w-4 flex-shrink-0" />
              <span>
                Có bản nháp tự động lưu lúc{" "}
                <strong>
                  {pendingDraft.savedAt ? new Date(pendingDraft.savedAt).toLocaleString("vi-VN") : "trước đó"}
                </strong>
                . Bạn có muốn khôi phục lại để viết tiếp không?
              </span>
            </div>
            <div className="flex gap-2">
              <Button size="sm" className="h-8" onClick={handleRestoreDraft}>
                Khôi phục bản nháp
              </Button>
              <Button size="sm" variant="outline" className="h-8 bg-white" onClick={discardDraft}>
                <X className="h-3.5 w-3.5 mr-1" /> Bỏ qua
              </Button>
            </div>
          </div>
        )}

        <div className={`grid gap-6 items-start ${showSidebar ? "lg:grid-cols-[1fr_380px] xl:grid-cols-[1fr_400px]" : "grid-cols-1 max-w-4xl mx-auto"}`}>
          {/* ==================== CỘT TRÁI: TRANG GIẤY SOẠN THẢO LIỀN MẠCH (Notion / WordPress Canvas) ==================== */}
          <div className="space-y-4 min-w-0">
            <Card className="p-6 md:p-8 shadow-xs border-border/80 bg-white space-y-5">
              {/* Thanh thiết lập nhanh đầu trang giấy: Danh mục + Ảnh bìa + Đường dẫn */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-dashed">
                <div className="flex flex-wrap items-center gap-2">
                  {/* Chọn nhanh Danh mục */}
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger
                      className={`h-8 text-xs w-auto min-w-[180px] rounded-full px-3 ${
                        !category ? "border-amber-400 bg-amber-50/50 text-amber-900" : "bg-muted/50 font-medium"
                      }`}
                    >
                      <SelectValue placeholder="Chọn danh mục bài viết *" />
                    </SelectTrigger>
                    <SelectContent>
                      {BLOG_CATEGORIES.map((item) => (
                        <SelectItem key={item.slug} value={item.slug}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Nút bật/tắt Ảnh bìa ngay trên đầu bài */}
                  <Button
                    type="button"
                    variant={featuredImage ? "secondary" : "ghost"}
                    size="sm"
                    className="h-8 rounded-full text-xs gap-1.5"
                    onClick={() => setShowCoverSection((v) => !v)}
                  >
                    <ImageIcon className="w-3.5 h-3.5" />
                    <span>{featuredImage ? "Đã có ảnh bìa" : "Thêm ảnh bìa"}</span>
                    {showCoverSection ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </Button>
                </div>

                {/* Đường dẫn (Slug) thu gọn */}
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="truncate max-w-[240px]">/blog/{slug || "duong-dan-bai-viet"}</span>
                  <button
                    type="button"
                    onClick={() => setShowSlugEdit((v) => !v)}
                    className="text-primary hover:underline font-medium"
                  >
                    {showSlugEdit ? "Đóng" : "Sửa link"}
                  </button>
                </div>
              </div>

              {/* Ô sửa nhanh Slug khi bấm "Sửa link" */}
              {showSlugEdit && (
                <div className="rounded-lg border bg-muted/20 p-3 space-y-1.5">
                  <Label htmlFor="slug" className="text-xs font-medium">
                    Đường dẫn bài viết (Slug)
                  </Label>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground whitespace-nowrap">/blog/</span>
                    <Input
                      id="slug"
                      placeholder="duong-dan-bai-viet"
                      value={slug}
                      onChange={(e) => {
                        setSlugTouched(true)
                        setSlug(e.target.value)
                      }}
                      onBlur={() => setSlug(slugify(slug))}
                      className="h-8 text-xs"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="h-8 text-xs"
                      onClick={() => {
                        setSlugTouched(false)
                        setSlug(slugify(title))
                      }}
                    >
                      Tạo lại từ tiêu đề
                    </Button>
                  </div>
                </div>
              )}

              {/* Khu vực Ảnh bìa đóng/mở gọn gàng */}
              {(showCoverSection || featuredImage) && (
                <div className="rounded-xl border bg-muted/15 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-semibold text-primary">Ảnh bìa bài viết (Featured Image)</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs text-muted-foreground"
                      onClick={() => setShowCoverSection(false)}
                    >
                      Thu gọn
                    </Button>
                  </div>
                  <ImageUploader value={featuredImage} onChange={setFeaturedImage} onPreviewChange={setPreviewImage} />
                  {featuredImage && (
                    <div>
                      <Label htmlFor="featuredImageAlt" className="text-xs font-medium">
                        Mô tả ảnh bìa (Alt Text SEO) <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="featuredImageAlt"
                        placeholder="Mô tả ngắn nội dung ảnh bìa giúp Google hiểu hình ảnh..."
                        value={featuredImageAlt}
                        onChange={(e) => setFeaturedImageAlt(e.target.value)}
                        className={`mt-1 h-8 text-xs ${!featuredImageAlt ? "border-amber-400" : "border-emerald-400"}`}
                      />
                    </div>
                  )}
                </div>
              )}

              {/* TIÊU ĐỀ BÀI VIẾT KIỂU NOTION / WORDPRESS */}
              <div>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề bài viết..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      focusFirstEditorBlock()
                    }
                  }}
                  className="border-0 shadow-none px-0 text-2xl md:text-4xl font-bold text-primary placeholder:text-muted-foreground/40 focus-visible:ring-0 h-auto py-1"
                />
              </div>

              {/* MÔ TẢ NGẮN (EXCERPT) GỌN GÀNG NGAY DƯỚI TIÊU ĐỀ */}
              <div className="rounded-lg border border-dashed bg-muted/15 p-3 space-y-1.5">
                <div className="flex items-center justify-between gap-2">
                  <Label htmlFor="excerpt" className="text-xs font-medium text-muted-foreground">
                    Mô tả ngắn (hiển thị ở trang danh sách bài viết) <span className="text-destructive">*</span>
                  </Label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleAutoFillExcerpt}
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                      title="Lấy tự động từ đoạn mở đầu của bài viết"
                    >
                      <Wand2 className="w-3 h-3" />
                      Tự trích từ bài viết
                    </button>
                    <span className="text-[11px] text-muted-foreground">{excerpt.length}/200</span>
                  </div>
                </div>
                <Textarea
                  id="excerpt"
                  placeholder="Nhập 1–2 câu tóm tắt nội dung chính (hoặc viết bài xong rồi bấm 'Tự trích từ bài viết')..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  className="resize-none border-0 bg-transparent p-0 text-sm shadow-none focus-visible:ring-0"
                />
              </div>

              {/* TRÌNH SOẠN THẢO KHỐI (BLOCK EDITOR) */}
              <BlockEditor
                value={blocks}
                onChange={setBlocks}
                onSelectBlock={(id) => {
                  activeBlockIdRef.current = id
                }}
              />
            </Card>
          </div>

          {/* ==================== CỘT PHẢI: BẢNG CÔNG CỤ CHIA TAB GỌN GÀNG (380px) ==================== */}
          {showSidebar && (
            <aside className="space-y-4 lg:sticky lg:top-16">
              <Tabs
                value={activeSidebarTab}
                onValueChange={(val) => setActiveSidebarTab(val as "settings" | "seo" | "ai")}
                className="w-full"
              >
                <TabsList className="grid w-full grid-cols-3 h-10">
                  <TabsTrigger value="settings" className="text-xs gap-1.5">
                    <Settings2 className="w-3.5 h-3.5" />
                    <span>Thiết lập</span>
                  </TabsTrigger>
                  <TabsTrigger value="seo" className="text-xs gap-1.5">
                    <SearchCheck className="w-3.5 h-3.5" />
                    <span>SEO</span>
                    {(title.trim() || quickStats.words >= 15) && (
                      <Badge variant="secondary" className="ml-0.5 px-1.5 py-0 text-[10px]">
                        {quickStats.technicalScore}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="text-xs gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI & Gợi ý</span>
                  </TabsTrigger>
                </TabsList>

                {/* ---------------- TAB 1: THIẾT LẬP BÀI VIẾT ---------------- */}
                <TabsContent value="settings" className="mt-3 space-y-4">
                  <Card className="p-5 space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-primary">Thông tin xuất bản</h3>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Cấu hình danh mục, đường dẫn và ảnh đại diện của bài viết
                      </p>
                    </div>

                    {/* Danh mục */}
                    <div>
                      <Label htmlFor="sidebar-category" className="text-xs font-medium">
                        Danh mục bài viết <span className="text-destructive">*</span>
                      </Label>
                      <Select value={category} onValueChange={setCategory}>
                        <SelectTrigger id="sidebar-category" className="mt-1.5 h-9 text-sm">
                          <SelectValue placeholder="Chọn danh mục..." />
                        </SelectTrigger>
                        <SelectContent>
                          {BLOG_CATEGORIES.map((item) => (
                            <SelectItem key={item.slug} value={item.slug}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Từ khóa trọng tâm */}
                    <div>
                      <Label htmlFor="sidebar-focusKeyword" className="text-xs font-medium">
                        Từ khóa trọng tâm (SEO)
                      </Label>
                      <Input
                        id="sidebar-focusKeyword"
                        placeholder="VD: đăng ký FDA, xuất khẩu Mỹ..."
                        value={focusKeyword}
                        onChange={(e) => setFocusKeyword(e.target.value)}
                        className="mt-1.5 h-9 text-sm"
                      />
                      <p className="text-[11px] text-muted-foreground mt-1">
                        Từ khóa chính bạn muốn bài viết xếp hạng trên Google
                      </p>
                    </div>

                    {/* Đường dẫn */}
                    <div>
                      <Label htmlFor="sidebar-slug" className="text-xs font-medium">
                        Đường dẫn (Slug)
                      </Label>
                      <div className="mt-1.5 flex items-center gap-1.5">
                        <Input
                          id="sidebar-slug"
                          placeholder="duong-dan-bai-viet"
                          value={slug}
                          onChange={(e) => {
                            setSlugTouched(true)
                            setSlug(e.target.value)
                          }}
                          onBlur={() => setSlug(slugify(slug))}
                          className="h-9 text-xs"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-9 text-xs flex-shrink-0"
                          onClick={() => {
                            setSlugTouched(false)
                            setSlug(slugify(title))
                          }}
                        >
                          Tạo lại
                        </Button>
                      </div>
                    </div>

                    {/* Ảnh bìa */}
                    <div className="pt-2 border-t space-y-3">
                      <Label className="text-xs font-medium block">Ảnh bìa (Featured Image)</Label>
                      <ImageUploader
                        value={featuredImage}
                        onChange={setFeaturedImage}
                        onPreviewChange={setPreviewImage}
                      />
                      {featuredImage && (
                        <div>
                          <Label htmlFor="sidebar-featuredImageAlt" className="text-xs font-medium">
                            Alt Text cho ảnh bìa <span className="text-red-500">*</span>
                          </Label>
                          <Input
                            id="sidebar-featuredImageAlt"
                            placeholder="Mô tả ngắn về hình ảnh bìa..."
                            value={featuredImageAlt}
                            onChange={(e) => setFeaturedImageAlt(e.target.value)}
                            className={`mt-1 h-8 text-xs ${!featuredImageAlt ? "border-red-300" : "border-emerald-400"}`}
                          />
                        </div>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                {/* ---------------- TAB 2: CHẤM ĐIỂM & CÀI ĐẶT SEO ---------------- */}
                <TabsContent value="seo" className="mt-3 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
                  {/* Từ khóa trọng tâm ngay trên đầu tab SEO */}
                  <Card className="p-4 space-y-3">
                    <div>
                      <Label htmlFor="focusKeyword" className="text-xs font-semibold text-primary">
                        Từ khóa trọng tâm
                      </Label>
                      <Input
                        id="focusKeyword"
                        placeholder="VD: đăng ký FDA, mã số GACC..."
                        value={focusKeyword}
                        onChange={(e) => setFocusKeyword(e.target.value)}
                        className="mt-1 h-8 text-xs"
                      />
                    </div>

                    <details className="group pt-1 border-t">
                      <summary className="text-xs font-medium text-muted-foreground cursor-pointer hover:text-foreground">
                        Tùy chỉnh Meta Title & Meta Description (Nâng cao)
                      </summary>
                      <div className="mt-3 space-y-3">
                        <div>
                          <Label htmlFor="metaTitle" className="text-xs font-medium">
                            Meta Title <span className="text-muted-foreground">(Để trống sẽ dùng tiêu đề bài)</span>
                          </Label>
                          <Input
                            id="metaTitle"
                            placeholder="Tiêu đề hiển thị trên Google..."
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            className="mt-1 h-8 text-xs"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {(metaTitle || title || "").length}/60 ký tự
                          </p>
                        </div>

                        <div>
                          <Label htmlFor="metaDescription" className="text-xs font-medium">
                            Meta Description <span className="text-muted-foreground">(Để trống sẽ dùng mô tả ngắn)</span>
                          </Label>
                          <Textarea
                            id="metaDescription"
                            placeholder="Mô tả hiển thị trên kết quả Google..."
                            value={metaDescription}
                            onChange={(e) => setMetaDescription(e.target.value)}
                            rows={2}
                            className="mt-1 resize-none text-xs"
                          />
                          <p className="text-[10px] text-muted-foreground mt-1">
                            {(metaDescription || excerpt || "").length}/160 ký tự
                          </p>
                        </div>
                      </div>
                    </details>
                  </Card>

                  {/* Bảng chấm điểm SEO */}
                  <SEOChecker
                    {...debouncedSeoInput}
                    otherPosts={otherPosts.filter(
                      (post) => typeof post?.title === "string" && post.title.trim() !== (title || "").trim(),
                    )}
                    onFocusBlock={handleFocusBlock}
                  />
                </TabsContent>

                {/* ---------------- TAB 3: TRỢ LÝ AI & GỢI Ý NỘI DUNG ---------------- */}
                <TabsContent value="ai" className="mt-3 space-y-4 max-h-[calc(100vh-8rem)] overflow-y-auto pr-1">
                  <AIWritingAssistant
                    selectedText={selectedText}
                    fullContent={getTextContent()}
                    onApply={handleApplyAISuggestion}
                    onGenerateMeta={handleGenerateMeta}
                  />

                  <PostSidebarTools
                    category={category}
                    focusKeyword={focusKeyword}
                    title={title}
                    onInsertBlocks={handleInsertBlocks}
                  />
                </TabsContent>
              </Tabs>
            </aside>
          )}
        </div>
      </div>

      {/* Preview Dialog */}
      <PostPreviewDialog
        open={showPreview}
        onOpenChange={setShowPreview}
        title={title}
        category={category}
        excerpt={excerpt}
        blocks={blocks}
        featuredImage={featuredImage}
        previewImage={previewImage}
        metaTitle={metaTitle}
        metaDescription={metaDescription}
        slug={slug}
      />
    </div>
  )
}
