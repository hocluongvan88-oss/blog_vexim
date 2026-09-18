"use client"

import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BlockEditor } from "@/components/block-editor/block-editor"
import { SEOChecker } from "@/components/seo-checker"
import { Eye, Save, Send, Loader2, ArrowLeft, RotateCcw, X, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ImageUploader } from "@/components/image-uploader"
import { AIWritingAssistant } from "@/components/admin/ai-writing-assistant"
import { HTMLPasteDialog } from "@/components/admin/html-paste-dialog"
import { PostPreviewDialog } from "@/components/admin/post-preview-dialog"
import type { Block } from "@/components/block-editor/types"
import {
  blocksToPlainText,
  generateBlockId,
  htmlToBlocks,
  parseInlineMarkdown,
  parseMarkdownToBlocks,
  parsedBlocksToBlocks,
} from "@/lib/content-parsers"
import { slugify } from "@/lib/post-payload"
import { sanitizeInlineHtml } from "@/lib/sanitize"
import { BLOG_CATEGORIES } from "@/lib/blog-categories"
import { useDraftAutosave } from "@/hooks/use-draft-autosave"

const MIN_PUBLISH_LENGTH = 50

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

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [postId, setPostId] = useState<string>("")
  const [legacyFormat, setLegacyFormat] = useState(false)

  const [title, setTitle] = useState("")
  const [slug, setSlug] = useState("")
  const [category, setCategory] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [blocks, setBlocks] = useState<Block[]>([])
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [featuredImageAlt, setFeaturedImageAlt] = useState("")
  const [focusKeyword, setFocusKeyword] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [selectedText, setSelectedText] = useState("")
  const [showPreview, setShowPreview] = useState(false)

  const selectionBlockIdRef = useRef<string | null>(null)

  useEffect(() => {
    const loadPost = async () => {
      const { id } = await params
      setPostId(id)

      try {
        const response = await fetch(`/api/posts/${id}`)
        if (!response.ok) throw new Error("Failed to load post")

        const post = await response.json()

        setTitle(post.title || "")
        setSlug(post.slug || "")
        setCategory(post.category || "")
        setExcerpt(post.excerpt || "")
        setMetaTitle(post.meta_title || "")
        setMetaDescription(post.meta_description || "")
        setFeaturedImage(post.featured_image || "")
        setFeaturedImageAlt(post.featured_image_alt || "")
        setFocusKeyword(post.focus_keyword || "")
        setPreviewImage(post.featured_image || null)
        setStatus(post.status === "published" ? "published" : "draft")

        // Nội dung có thể là JSON blocks (định dạng mới) hoặc HTML (bài cũ / WordPress)
        let parsedBlocks: Block[] | null = null
        try {
          const parsed = JSON.parse(post.content)
          if (Array.isArray(parsed) && parsed.length > 0) parsedBlocks = parsed as Block[]
        } catch {
          parsedBlocks = null
        }

        if (parsedBlocks) {
          setBlocks(parsedBlocks)
        } else if (post.content) {
          // Chuyển HTML -> các khối (thay vì nhồi cả bài vào 1 đoạn văn làm hỏng cấu trúc)
          const converted = htmlToBlocks(post.content)
          setBlocks(converted)
          setLegacyFormat(true)
          toast({
            title: "Bài viết định dạng cũ",
            description: `Đã chuyển HTML sang ${converted.length} khối. Vui lòng kiểm tra lại bố cục trước khi lưu.`,
          })
        } else {
          setBlocks([])
        }
      } catch (error) {
        console.error("[blog] Lỗi tải bài viết:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải bài viết",
          variant: "destructive",
        })
        router.push("/admin/posts")
      } finally {
        setIsFetching(false)
      }
    }

    loadPost()
  }, [params, router, toast])

  // Theo dõi vùng chọn trong toàn trang để AI thay thế đúng khối
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

  /** Áp dụng kết quả AI vào khối đang chọn (hoặc thêm vào cuối bài). */
  const handleApplyAISuggestion = (newText: string) => {
    const text = (newText || "").trim()
    if (!text) {
      toast({ title: "Không có nội dung", description: "Kết quả AI đang trống", variant: "destructive" })
      return
    }

    const targetId = selectionBlockIdRef.current
    const targetIndex = targetId ? blocks.findIndex((block) => block.id === targetId) : -1
    const target = targetIndex >= 0 ? blocks[targetIndex] : null
    const canReplace = !!target && ["paragraph", "heading", "quote"].includes(target.type)

    if (canReplace && target) {
      const segments = text.split(/\n{2,}/).map((segment) => segment.trim()).filter(Boolean)

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
      setBlocks([...blocks, ...newBlocks])
      toast({ title: "Đã áp dụng", description: `Đã thêm ${newBlocks.length} khối vào cuối bài viết` })
    }

    selectionBlockIdRef.current = null
  }

  // Handle AI-generated meta
  const handleGenerateMeta = (meta: { description: string; keywords: string[] }) => {
    setMetaDescription(meta.description)
    toast({
      title: "Đã tạo Meta Description",
      description: "Meta description đã được cập nhật tự động",
    })
  }

  // Handle HTML import
  const handleHTMLImport = (newBlocks: Block[]) => {
    if (newBlocks.length === 0) return
    setBlocks((prev) => [...prev, ...newBlocks])
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

  const draftKey = postId ? `vexim-blog-draft-${postId}` : "vexim-blog-draft-edit"
  const { pendingDraft, lastSavedAt, markSaved, restoreDraft, discardDraft } = useDraftAutosave(draftKey, draftSnapshot, {
    enabled: !isFetching,
    isEmpty: (draft) => !draft.title.trim() && !draft.excerpt.trim() && blocksToPlainText(draft.blocks).length === 0,
  })

  const handleRestoreDraft = () => {
    const draft = restoreDraft()
    if (!draft) return
    setTitle(draft.title)
    setSlug(draft.slug)
    setCategory(draft.category)
    setExcerpt(draft.excerpt)
    setBlocks(draft.blocks)
    setMetaTitle(draft.metaTitle)
    setMetaDescription(draft.metaDescription)
    setFeaturedImage(draft.featuredImage)
    setFeaturedImageAlt(draft.featuredImageAlt)
    setFocusKeyword(draft.focusKeyword)
    setPreviewImage(draft.featuredImage || null)
    toast({ title: "Đã khôi phục bản nháp", description: "Kiểm tra lại nội dung trước khi lưu" })
  }

  const validate = (newStatus: "draft" | "published"): boolean => {
    if (!title.trim() || !category || !excerpt.trim()) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền tiêu đề, danh mục và mô tả ngắn",
        variant: "destructive",
      })
      return false
    }

    const plainLength = blocksToPlainText(blocks).length
    if (plainLength === 0) {
      toast({ title: "Chưa có nội dung", description: "Vui lòng nhập nội dung bài viết", variant: "destructive" })
      return false
    }

    if (newStatus === "published" && plainLength < MIN_PUBLISH_LENGTH) {
      toast({
        title: "Nội dung quá ngắn",
        description: `Cần tối thiểu ${MIN_PUBLISH_LENGTH} ký tự nội dung để xuất bản`,
        variant: "destructive",
      })
      return false
    }

    return true
  }

  const handleSubmit = async (newStatus: "draft" | "published") => {
    if (!validate(newStatus)) return

    setIsLoading(true)

    try {
      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || slugify(title),
          category,
          excerpt,
          content: JSON.stringify(blocks),
          featured_image: featuredImage,
          featured_image_alt: featuredImageAlt,
          focus_keyword: focusKeyword,
          meta_title: metaTitle || title,
          meta_description: metaDescription || excerpt,
          status: newStatus,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra")
      }

      if (typeof data.slug === "string") setSlug(data.slug)
      markSaved()

      toast({
        title: newStatus === "published" ? "Đã cập nhật!" : "Đã lưu!",
        description:
          newStatus === "published" ? "Bài viết đã được cập nhật và xuất bản" : "Bản nháp đã được lưu",
      })

      router.push("/admin/posts")
      router.refresh()
    } catch (error) {
      console.error("[blog] Lỗi cập nhật bài viết:", error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể cập nhật bài viết",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const autoSavedLabel = lastSavedAt
    ? `Đã tự lưu bản nháp lúc ${new Date(lastSavedAt).toLocaleTimeString("vi-VN")}`
    : null

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center gap-4">
        <Link href="/admin/posts">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Chỉnh sửa bài viết</h1>
          <p className="text-muted-foreground">Cập nhật nội dung bài viết của Vexim Global</p>
          {autoSavedLabel && <p className="text-xs text-muted-foreground mt-1">{autoSavedLabel}</p>}
        </div>
      </div>

      {legacyFormat && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <AlertTriangle className="h-4 w-4 mt-0.5" />
          <span>
            Bài viết này đang ở định dạng HTML cũ và đã được chuyển sang dạng khối. Hãy kiểm tra lại bố cục (tiêu đề,
            danh sách, bảng) trước khi lưu — nội dung lưu lần này sẽ theo định dạng khối mới.
          </span>
        </div>
      )}

      {pendingDraft && (
        <div className="mb-6 flex flex-wrap items-center gap-3 rounded-lg border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <RotateCcw className="h-4 w-4" />
          <span>
            Có bản nháp tự động lưu lúc {new Date(pendingDraft.savedAt).toLocaleString("vi-VN")}. Bạn có muốn khôi phục?
          </span>
          <div className="flex gap-2">
            <Button size="sm" onClick={handleRestoreDraft}>
              Khôi phục
            </Button>
            <Button size="sm" variant="outline" onClick={discardDraft}>
              <X className="h-4 w-4 mr-1" /> Bỏ
            </Button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[4fr_1fr] gap-8">
        {/* Main Content - Left Side */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Thông tin cơ bản</h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <Label htmlFor="title" className="text-base font-medium">
                  Tiêu đề bài viết <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Nhập tiêu đề bài viết..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 text-lg"
                />
              </div>

              {/* Slug */}
              <div>
                <Label htmlFor="slug" className="text-base font-medium">
                  Đường dẫn (slug)
                </Label>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">/blog/</span>
                  <Input
                    id="slug"
                    placeholder="duong-dan-bai-viet"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    onBlur={() => setSlug(slugify(slug))}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={() => setSlug(slugify(title))}>
                    Tạo lại
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Lưu ý: đổi slug sẽ làm thay đổi đường dẫn công khai của bài viết (ảnh hưởng SEO).
                </p>
              </div>

              {/* Excerpt */}
              <div>
                <Label htmlFor="excerpt" className="text-base font-medium">
                  Mô tả ngắn <span className="text-destructive">*</span>
                </Label>
                <p className="text-sm text-muted-foreground mt-1 mb-2">
                  Văn bản này sẽ hiển thị trong danh sách bài viết
                </p>
                <Textarea
                  id="excerpt"
                  placeholder="Nhập mô tả ngắn về bài viết..."
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={3}
                  className="resize-none"
                />
                <p className="text-sm text-muted-foreground mt-1">{excerpt.length}/200 ký tự</p>
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category" className="text-base font-medium">
                  Danh mục <span className="text-destructive">*</span>
                </Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-2">
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

              {/* Featured Image */}
              <ImageUploader value={featuredImage} onChange={setFeaturedImage} onPreviewChange={setPreviewImage} />

              {/* Featured Image Alt Text */}
              {featuredImage && (
                <div>
                  <Label htmlFor="featuredImageAlt" className="text-base font-medium">
                    Alt Text cho ảnh bìa <span className="text-red-500">(Quan trọng cho SEO)</span>
                  </Label>
                  <Input
                    id="featuredImageAlt"
                    placeholder="Mô tả ngắn về hình ảnh bìa..."
                    value={featuredImageAlt}
                    onChange={(e) => setFeaturedImageAlt(e.target.value)}
                    className={`mt-2 ${!featuredImageAlt ? "border-red-300" : "border-green-300"}`}
                  />
                  {!featuredImageAlt && (
                    <p className="text-xs text-red-500 mt-1">Alt text giúp Google hiểu nội dung ảnh bìa</p>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Block Editor */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-primary">Nội dung bài viết</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Sử dụng hệ thống khối để xây dựng nội dung. Mỗi khối có thể được căn chỉnh và sắp xếp độc lập.
                </p>
              </div>
              <HTMLPasteDialog onImport={handleHTMLImport} />
            </div>
            <BlockEditor value={blocks} onChange={setBlocks} />
          </Card>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* AI Writing Assistant */}
          <AIWritingAssistant
            selectedText={selectedText}
            fullContent={getTextContent()}
            onApply={handleApplyAISuggestion}
            onGenerateMeta={handleGenerateMeta}
          />

          {/* SEO Settings Card */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-primary mb-4">Cài đặt SEO</h3>
            <div className="space-y-4">
              {/* Focus Keyword */}
              <div>
                <Label htmlFor="focusKeyword" className="text-sm font-medium">
                  Từ khóa trọng tâm
                </Label>
                <Input
                  id="focusKeyword"
                  placeholder="VD: đăng ký FDA, xuất khẩu Mỹ..."
                  value={focusKeyword}
                  onChange={(e) => setFocusKeyword(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Từ khóa chính bạn muốn bài viết xếp hạng trên Google
                </p>
              </div>

              {/* Meta Title */}
              <div>
                <Label htmlFor="metaTitle" className="text-sm font-medium">
                  Meta Title <span className="text-muted-foreground">(Tùy chọn)</span>
                </Label>
                <Input
                  id="metaTitle"
                  placeholder="Để trống sẽ dùng tiêu đề bài viết"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="mt-1"
                />
                <p className="text-xs text-muted-foreground mt-1">{(metaTitle || title).length}/60 ký tự</p>
              </div>

              {/* Meta Description */}
              <div>
                <Label htmlFor="metaDescription" className="text-sm font-medium">
                  Meta Description <span className="text-muted-foreground">(Tùy chọn)</span>
                </Label>
                <Textarea
                  id="metaDescription"
                  placeholder="Để trống sẽ dùng mô tả ngắn"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  rows={3}
                  className="mt-1 resize-none"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {(metaDescription || excerpt).length}/160 ký tự
                </p>
              </div>
            </div>
          </Card>

          {/* SEO Checker Card */}
          <SEOChecker
            title={title}
            excerpt={excerpt}
            content={getTextContent()}
            metaTitle={metaTitle}
            metaDescription={metaDescription}
            featuredImage={featuredImage}
            featuredImageAlt={featuredImageAlt}
            focusKeyword={focusKeyword}
            blocks={blocks}
          />

          {/* Action Buttons Card */}
          <Card className="p-6 sticky top-24">
            <h3 className="text-lg font-bold text-primary mb-4">Hành động</h3>
            <div className="flex flex-col gap-3">
              <Button onClick={() => handleSubmit("draft")} variant="outline" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Lưu nháp
              </Button>

              <Button onClick={() => setShowPreview(true)} variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Xem trước
              </Button>

              <Button
                onClick={() => handleSubmit("published")}
                className="bg-accent hover:bg-accent/90 w-full"
                disabled={isLoading}
              >
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Send className="w-4 h-4 mr-2" />}
                {status === "published" ? "Cập nhật" : "Xuất bản"}
              </Button>
            </div>
          </Card>
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
