"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Upload, Link as LinkIcon } from "lucide-react"
import type { ImageData } from "../types"

interface ImageBlockProps {
  data: ImageData
  onChange: (data: Partial<ImageData>) => void
}

export function ImageBlock({ data, onChange }: ImageBlockProps) {
  const { url = "", alt = "", caption = "", align = "center", width = "100%" } = data
  const [uploading, setUploading] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      })
      const data = await response.json()
      if (data.url) {
        onChange({ url: data.url })
      }
    } catch (error) {
      console.error("Upload failed:", error)
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
        <img src={url || "/placeholder.svg"} alt={alt || caption} className="w-full rounded-lg shadow-md" />
        
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
