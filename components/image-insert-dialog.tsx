"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ImageIcon, Upload, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageInsertDialogProps {
  onInsert: (html: string) => void
}

export function ImageInsertDialog({ onInsert }: ImageInsertDialogProps) {
  const [open, setOpen] = useState(false)
  const [imageUrl, setImageUrl] = useState("")
  const [altText, setAltText] = useState("")
  const [caption, setCaption] = useState("")
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("center")
  const [uploading, setUploading] = useState(false)
  const { toast } = useToast()

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file hình ảnh",
        variant: "destructive",
      })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
        variant: "destructive",
      })
      return
    }

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Upload failed")
      }

      setImageUrl(data.url)
      toast({
        title: "Thành công",
        description: "Đã tải ảnh lên thành công",
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể tải ảnh lên",
        variant: "destructive",
      })
    } finally {
      setUploading(false)
    }
  }

  const handleInsert = () => {
    if (!imageUrl) {
      toast({
        title: "Lỗi",
        description: "Vui lòng nhập URL hoặc tải ảnh lên",
        variant: "destructive",
      })
      return
    }

    const alignClass = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    }[alignment]

    const html = `
      <figure class="${alignClass}" style="margin: 2rem 0;">
        <img 
          src="${imageUrl}" 
          alt="${altText || "Hình ảnh minh họa"}" 
          title="${altText || ""}"
          style="max-width: 100%; height: auto; border-radius: 0.5rem; display: ${alignment === "center" ? "inline-block" : "block"}; ${alignment === "left" ? "margin-right: auto;" : ""} ${alignment === "right" ? "margin-left: auto;" : ""}"
          loading="lazy"
        />
        ${caption ? `<figcaption style="margin-top: 0.75rem; font-size: 0.875rem; color: #6b7280; font-style: italic;">${caption}</figcaption>` : ""}
      </figure>
    `

    onInsert(html)
    setOpen(false)
    resetForm()
  }

  const resetForm = () => {
    setImageUrl("")
    setAltText("")
    setCaption("")
    setAlignment("center")
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button type="button" variant="ghost" size="sm" title="Chèn hình ảnh">
          <ImageIcon className="w-4 h-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chèn hình ảnh</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <Label>Tải ảnh lên</Label>
            <div className="mt-2">
              <label className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-secondary/50 transition-colors">
                <div className="text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {uploading ? "Đang tải lên..." : "Nhấp để chọn ảnh hoặc kéo thả vào đây"}
                  </p>
                </div>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleFileUpload(file)
                  }}
                  disabled={uploading}
                />
              </label>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Hoặc</span>
            </div>
          </div>

          {/* URL Input */}
          <div>
            <Label htmlFor="imageUrl">URL hình ảnh</Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Alt Text (SEO) */}
          <div>
            <Label htmlFor="altText">
              Văn bản thay thế (Alt Text) <span className="text-sm text-muted-foreground">- Quan trọng cho SEO</span>
            </Label>
            <Input
              id="altText"
              placeholder="Mô tả ngắn gọn về hình ảnh"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              className="mt-2"
            />
          </div>

          {/* Caption */}
          <div>
            <Label htmlFor="caption">Chú thích (Caption)</Label>
            <Textarea
              id="caption"
              placeholder="Chú thích hiển thị bên dưới hình ảnh"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              className="mt-2"
              rows={2}
            />
          </div>

          {/* Alignment */}
          <div>
            <Label>Căn chỉnh</Label>
            <Select value={alignment} onValueChange={(value: any) => setAlignment(value)}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="left">Trái</SelectItem>
                <SelectItem value="center">Giữa</SelectItem>
                <SelectItem value="right">Phải</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Preview */}
          {imageUrl && (
            <div className="border rounded-lg p-4">
              <Label className="mb-2 block">Xem trước:</Label>
              <figure className={`${alignment === "center" ? "text-center" : alignment === "right" ? "text-right" : "text-left"}`}>
                <img
                  src={imageUrl || "/placeholder.svg"}
                  alt={altText || "Preview"}
                  className="max-w-full h-auto rounded-lg"
                  style={{
                    display: alignment === "center" ? "inline-block" : "block",
                    marginLeft: alignment === "right" ? "auto" : alignment === "center" ? "auto" : "0",
                    marginRight: alignment === "left" ? "auto" : alignment === "center" ? "auto" : "0",
                  }}
                />
                {caption && (
                  <figcaption className="mt-2 text-sm text-muted-foreground italic">{caption}</figcaption>
                )}
              </figure>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Hủy
            </Button>
            <Button type="button" onClick={handleInsert} disabled={!imageUrl}>
              Chèn hình ảnh
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
