"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bold, Italic, LinkIcon, ImageIcon, Heading2, Heading3, Eye, Save, Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { RichTextEditor } from "@/components/rich-text-editor"
import { SEOChecker } from "@/components/seo-checker"

export default function NewPostPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [metaTitle, setMetaTitle] = useState("")
  const [metaDescription, setMetaDescription] = useState("")
  const [featuredImage, setFeaturedImage] = useState("")
  const [previewImage, setPreviewImage] = useState<string | null>(null)

  const handleSubmit = async (status: "draft" | "published") => {
    if (!title || !category || !excerpt || !content) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng điền đầy đủ các trường bắt buộc",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          category,
          excerpt,
          content,
          featured_image: featuredImage,
          meta_title: metaTitle || title,
          meta_description: metaDescription || excerpt,
          status,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Có lỗi xảy ra")
      }

      toast({
        title: status === "published" ? "Đã xuất bản!" : "Đã lưu nháp!",
        description: status === "published" ? "Bài viết đã được xuất bản thành công" : "Bản nháp đã được lưu",
      })

      if (status === "published") {
        router.push(`/blog/${data.slug}`)
      } else {
        router.push("/admin/posts")
      }
    } catch (error) {
      console.error("Error saving post:", error)
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể lưu bài viết",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result as string)
        setFeaturedImage(URL.createObjectURL(file))
      }
      reader.readAsDataURL(file)
    }
  }

  const insertFormatting = (format: string) => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = content.substring(start, end)
    let newText = content

    switch (format) {
      case "bold":
        newText = content.substring(0, start) + `<strong>${selectedText}</strong>` + content.substring(end)
        break
      case "italic":
        newText = content.substring(0, start) + `<em>${selectedText}</em>` + content.substring(end)
        break
      case "h2":
        newText = content.substring(0, start) + `<h2>${selectedText}</h2>` + content.substring(end)
        break
      case "h3":
        newText = content.substring(0, start) + `<h3>${selectedText}</h3>` + content.substring(end)
        break
      case "link":
        const url = prompt("Nhập URL:")
        if (url) {
          newText = content.substring(0, start) + `<a href="${url}">${selectedText}</a>` + content.substring(end)
        }
        break
      case "image":
        const imgUrl = prompt("Nhập URL hình ảnh:")
        if (imgUrl) {
          newText =
            content.substring(0, start) + `<img src="${imgUrl}" alt="${selectedText}" />` + content.substring(end)
        }
        break
    }

    setContent(newText)
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">Tạo bài viết mới</h1>
        <p className="text-muted-foreground">Thêm nội dung mới vào hệ thống blog của Vexim Global</p>
      </div>

      <div className="grid lg:grid-cols-[4fr_1fr] gap-8">
        {/* Main Content - Left Side */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Thông tin cơ bản</h2>

            <div className="space-y-4">
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

              <div className="grid md:grid-cols-2 gap-4">
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

                <div>
                  <Label htmlFor="imageUrl" className="text-base font-medium">
                    Ảnh bìa (URL)
                  </Label>
                  <Input
                    id="imageUrl"
                    placeholder="https://..."
                    value={featuredImage}
                    onChange={(e) => {
                      setFeaturedImage(e.target.value)
                      setPreviewImage(e.target.value)
                    }}
                    className="mt-2"
                  />
                </div>
              </div>

              {previewImage && (
                <div className="aspect-video max-w-md overflow-hidden rounded-lg border">
                  <img src={previewImage || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </Card>

          {/* Rich Text Editor */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-primary mb-4">Nội dung bài viết</h2>

            <div className="flex flex-wrap gap-2 p-3 bg-secondary/50 rounded-lg mb-4 border">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("bold")}
                title="In đậm (Ctrl+B)"
              >
                <Bold className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("italic")}
                title="In nghiêng (Ctrl+I)"
              >
                <Italic className="w-4 h-4" />
              </Button>
              <div className="w-px bg-border mx-1" />
              <Button type="button" variant="ghost" size="sm" onClick={() => insertFormatting("h2")} title="Tiêu đề H2">
                <Heading2 className="w-4 h-4" />
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => insertFormatting("h3")} title="Tiêu đề H3">
                <Heading3 className="w-4 h-4" />
              </Button>
              <div className="w-px bg-border mx-1" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("link")}
                title="Chèn liên kết"
              >
                <LinkIcon className="w-4 h-4" />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => insertFormatting("image")}
                title="Chèn hình ảnh"
              >
                <ImageIcon className="w-4 h-4" />
              </Button>
            </div>

            <RichTextEditor
              value={content}
              onChange={setContent}
            />
          </Card>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* SEO Checker Card */}
          <Card className="p-6">
            <h3 className="text-lg font-bold text-primary mb-4">Phân tích SEO</h3>
            <SEOChecker
              title={title}
              excerpt={excerpt}
              content={content}
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
                disabled={isLoading}
                className="w-full"
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
                Xuất bản
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
