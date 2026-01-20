"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BlockEditor } from "@/components/block-editor/block-editor"
import { SEOChecker } from "@/components/seo-checker"
import { Eye, Save, Send, Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import { ImageUploader } from "@/components/image-uploader"
import { AIWritingAssistant } from "@/components/admin/ai-writing-assistant"
import type { Block } from "@/components/block-editor/types"

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [postId, setPostId] = useState<string>("")

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [blocks, setBlocks] = useState<Block[]>([])
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [status, setStatus] = useState<"draft" | "published">("draft")
  const [selectedText, setSelectedText] = useState("")

  useEffect(() => {
    const loadPost = async () => {
      const { id } = await params
      setPostId(id)

      try {
        const response = await fetch(`/api/posts/${id}`)
        if (!response.ok) throw new Error("Failed to load post")

        const post = await response.json()

        setTitle(post.title)
        setCategory(post.category)
        setExcerpt(post.excerpt)
        
        // Parse content JSON to blocks
        try {
          const parsedBlocks = JSON.parse(post.content)
          setBlocks(Array.isArray(parsedBlocks) ? parsedBlocks : [])
        } catch {
          // If content is not JSON (old format), create a single paragraph block
          setBlocks([
            {
              id: "legacy_content",
              type: "paragraph",
              data: { text: post.content || "", align: "justify" },
            },
          ])
        }
        
        setMetaTitle(post.meta_title || "")
        setMetaDescription(post.meta_description || "")
        setFeaturedImage(post.featured_image || "")
        setPreviewImage(post.featured_image || null)
        setStatus(post.status)
      } catch (error) {
        console.error("Error loading post:", error)
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

  // Generate text content from blocks for SEO checker and AI
  const getTextContent = () => {
    return blocks
      .map((block) => {
        if (block.type === "heading" || block.type === "paragraph") return block.data.text
        if (block.type === "quote") return block.data.text
        return ""
      })
      .join(" ")
  }

  // Track text selection for AI assistant
  const handleTextSelection = () => {
    const selection = window.getSelection()
    const text = selection?.toString() || ""
    if (text.length > 0) {
      setSelectedText(text)
    }
  }

  // Apply AI suggestion
  const handleApplyAISuggestion = (newText: string) => {
    toast({
      title: "Áp dụng thành công",
      description: "Vui lòng copy và paste vào khối đang chỉnh sửa hoặc tạo khối mới",
    })
  }

  // Handle AI-generated meta
  const handleGenerateMeta = (meta: { description: string; keywords: string[] }) => {
    setMetaDescription(meta.description)
    toast({
      title: "Đã tạo Meta Description",
      description: "Meta description đã được cập nhật tự động",
    })
  }

  const handleSubmit = async (newStatus: "draft" | "published") => {
    if (!title || !category || !excerpt || blocks.length === 0) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ các trường bắt buộc và thêm nội dung",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Serialize blocks to JSON string for storage
      const contentJSON = JSON.stringify(blocks)

      const response = await fetch(`/api/posts/${postId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          excerpt,
          content: contentJSON,
          featured_image: featuredImage,
          meta_title: metaTitle || title,
          meta_description: metaDescription || excerpt,
          status: newStatus,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra")
      }

      toast({
        title: newStatus === "published" ? "Đã cập nhật!" : "Đã lưu!",
        description: newStatus === "published" ? "Bài viết đã được cập nhật và xuất bản" : "Bản nháp đã được lưu",
      })

      if (newStatus === "published") {
        router.push(`/blog/${data.slug}`)
      } else {
        router.push("/admin/posts")
      }
    } catch (error) {
      console.error("Error updating post:", error)
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
        </div>
      </div>

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
                    <SelectItem value="FDA">FDA (Mỹ)</SelectItem>
                    <SelectItem value="GACC">GACC (Trung Quốc)</SelectItem>
                    <SelectItem value="MFDS">MFDS (Hàn Quốc)</SelectItem>
                    <SelectItem value="Dịch vụ Agent Hoa Kỳ">Dịch vụ Agent Hoa Kỳ</SelectItem>
                    <SelectItem value="Truy xuất nguồn gốc">Truy xuất nguồn gốc</SelectItem>
                    <SelectItem value="Ủy thác xuất nhập khẩu">Ủy thác XNK</SelectItem>
                    <SelectItem value="Tin tức thị trường">Tin tức thị trường</SelectItem>
                    <SelectItem value="Xuất nhập khẩu">Xuất nhập khẩu</SelectItem>
                    <SelectItem value="Kiến thức pháp lý">Kiến thức pháp lý</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Featured Image */}
              <ImageUploader value={featuredImage} onChange={setFeaturedImage} onPreviewChange={setPreviewImage} />
            </div>
          </Card>

          {/* Block Editor */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Nội dung bài viết</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Sử dụng hệ thống khối để xây dựng nội dung. Mỗi khối có thể được căn chỉnh và sắp xếp độc lập.
            </p>
            <BlockEditor value={blocks} onChange={setBlocks} />
          </Card>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6" onMouseUp={handleTextSelection}>
          {/* AI Writing Assistant */}
          <AIWritingAssistant
            selectedText={selectedText}
            fullContent={getTextContent()}
            onApply={handleApplyAISuggestion}
            onGenerateMeta={handleGenerateMeta}
          />

          {/* SEO Checker Card */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-primary mb-4">Phân tích SEO</h3>
            <SEOChecker
              title={title}
              excerpt={excerpt}
              content={getTextContent()}
              metaTitle={metaTitle}
              metaDescription={metaDescription}
              featuredImage={featuredImage}
            />
          </Card>

          {/* Action Buttons Card */}
          <Card className="p-6 sticky top-24">
            <h3 className="text-lg font-bold text-primary mb-4">Hành động</h3>
            <div className="flex flex-col gap-3">
              <Button onClick={() => handleSubmit("draft")} variant="outline" disabled={isLoading} className="w-full">
                {isLoading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                Lưu nháp
              </Button>

              <Button
                onClick={() => alert("Tính năng xem trước đang phát triển")}
                variant="outline"
                disabled
                className="w-full opacity-50 cursor-not-allowed"
              >
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
    </div>
  )
}
