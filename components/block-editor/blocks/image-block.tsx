"use client"

import React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Link as LinkIcon, AlertTriangle } from "lucide-react"
import type { ImageData } from "../types"
import { useImageDimensions } from "@/hooks/use-image-dimensions"

interface ImageBlockProps {
  data: ImageData
  onChange: (data: Partial<ImageData>) => void
}

export function ImageBlock({ data, onChange }: ImageBlockProps) {
  const { url = "", alt = "", caption = "", align = "center", width = "100%", width_px, height_px } = data
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Đo kích thước thật để (a) lưu width/height chống nhảy layout, (b) cảnh báo ảnh quá nhỏ
  const dimensions = useImageDimensions(url)

  useEffect(() => {
    if (!dimensions) return
    const currentWidth = Number(width_px) || 0
    const currentHeight = Number(height_px) || 0
    if (currentWidth === dimensions.width && currentHeight === dimensions.height) return
    onChange({ width_px: dimensions.width, height_px: dimensions.height })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dimensions?.width, dimensions?.height])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploadError(null)

    if (!file.type.startsWith("image/")) {
      setUploadError("Vui lòng chọn file hình ảnh (JPG, PNG, WebP, GIF, AVIF)")
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Kích thước file không được vượt quá 5MB")
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
      const result = await response.json().catch(() => ({}))

      if (!response.ok || !result?.url) {
        throw new Error(result?.error || "Upload thất bại")
      }

      onChange({ url: result.url })
    } catch (error) {
      console.error("[blog] Upload failed:", error)
      setUploadError(error instanceof Error ? error.message : "Không thể tải ảnh lên, vui lòng thử lại")
    } finally {
      setUploading(false)
    }
  }

  const alignClass = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  }[align]

  const widthClass = width === "100%" ? "w-full" : width === "80%" ? "w-4/5" : "w-3/5"

  if (!url) {
    return (
      <div className="border-2 border-dashed rounded-lg p-8 text-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            <label htmlFor="file-upload">
              <Button variant="outline" className="cursor-pointer bg-transparent" disabled={uploading} asChild>
                <span>
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Đang tải..." : "Tải ảnh lên"}
                </span>
              </Button>
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
                disabled={uploading}
              />
            </label>
          </div>
          <div className="text-sm text-muted-foreground">hoặc</div>
          <div className="w-full max-w-md">
            <Input
              placeholder="Dán URL hình ảnh..."
              onBlur={(e) => onChange({ url: e.target.value })}
              disabled={uploading}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex ${alignClass}`}>
      <figure className={widthClass}>
        <img
          src={url || "/placeholder.svg"}
          alt={alt || caption}
          width={width_px || undefined}
          height={height_px || undefined}
          className="w-full h-auto rounded-lg shadow-md"
        />

        {dimensions && dimensions.width < 1200 && (
          <div className="mt-2 flex items-start gap-2 rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
            <span>
              Ảnh chỉ {dimensions.width}×{dimensions.height}px. Ảnh lớn (≥1200px ngang) đẹp hơn khi chia sẻ
              Facebook/Zalo và đủ điều kiện hiện thẻ lớn trên Google Discover.
            </span>
          </div>
        )}
        
        {/* Alt Text - Quan trọng cho SEO */}
        <div className="mt-3 space-y-2">
          <div>
            <Label className="text-xs font-medium text-red-600">
              Alt Text (Bắt buộc cho SEO) *
            </Label>
            <Input
              placeholder="Mô tả hình ảnh cho search engines và người khiếm thị..."
              value={alt}
              onChange={(e) => onChange({ alt: e.target.value })}
              className={`text-sm mt-1 ${!alt ? 'border-red-300 focus:border-red-500' : 'border-green-300'}`}
            />
            {!alt && (
              <p className="text-xs text-red-500 mt-1">
                Alt text giúp Google hiểu nội dung hình ảnh và cải thiện thứ hạng SEO
              </p>
            )}
          </div>
          
          {/* Caption - Tùy chọn */}
          <div>
            <Label className="text-xs text-muted-foreground">Chú thích (Tùy chọn)</Label>
            <Input
              placeholder="Thêm chú thích hiển thị bên dưới ảnh..."
              value={caption}
              onChange={(e) => onChange({ caption: e.target.value })}
              className="text-sm mt-1 italic"
            />
          </div>
        </div>
        
        <div className="mt-2 flex items-center gap-2">
          <Label className="text-xs">Kích thước:</Label>
          <select
            value={width}
            onChange={(e) => onChange({ width: e.target.value })}
            className="text-xs border rounded px-2 py-1"
          >
            <option value="100%">Toàn bộ (100%)</option>
            <option value="80%">Lớn (80%)</option>
            <option value="60%">Vừa (60%)</option>
          </select>
          <Button variant="ghost" size="sm" onClick={() => onChange({ url: "" })} className="text-xs">
            Thay đổi ảnh
          </Button>
        </div>
      </figure>
    </div>
  )
}
