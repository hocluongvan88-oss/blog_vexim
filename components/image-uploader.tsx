"use client"

import React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Upload, Loader2, X, ImageIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ImageUploaderProps {
  value: string
  onChange: (url: string) => void
  onPreviewChange?: (url: string | null) => void
}

export function ImageUploader({ value, onChange, onPreviewChange }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(value || null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file hình ảnh (JPG, PNG, GIF, WebP)",
        variant: "destructive",
      })
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Lỗi",
        description: "Kích thước file không được vượt quá 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      setPreview(data.url)
      onChange(data.url)
      onPreviewChange?.(data.url)

      toast({
        title: "Thành công",
        description: "Ảnh đã được tải lên thành công",
      })
    } catch (error) {
      console.error("Upload error:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải ảnh lên. Vui lòng thử lại.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    onChange("")
    onPreviewChange?.(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleUrlChange = (url: string) => {
    onChange(url)
    setPreview(url)
    onPreviewChange?.(url)
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="imageUpload" className="text-base font-medium">
            Tải ảnh lên
          </Label>
          <input
            ref={fileInputRef}
            type="file"
            id="imageUpload"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full mt-2"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang tải lên...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Chọn ảnh
              </>
            )}
          </Button>
          <p className="text-xs text-muted-foreground mt-1">JPG, PNG, GIF, WebP (tối đa 5MB)</p>
        </div>

        <div>
          <Label htmlFor="imageUrl" className="text-base font-medium">
            Hoặc dán URL ảnh
          </Label>
          <Input
            id="imageUrl"
            placeholder="https://..."
            value={value}
            onChange={(e) => handleUrlChange(e.target.value)}
            className="mt-2"
            disabled={isUploading}
          />
        </div>
      </div>

      {preview && (
        <div className="relative aspect-video max-w-md overflow-hidden rounded-lg border bg-muted">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="w-full h-full object-cover" />
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={handleRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {!preview && (
        <div className="flex items-center justify-center aspect-video max-w-md rounded-lg border-2 border-dashed bg-muted/20">
          <div className="text-center">
            <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">Chưa có ảnh bìa</p>
          </div>
        </div>
      )}
    </div>
  )
}
