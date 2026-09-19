"use client"

import React, { useMemo } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import type { Block } from "@/components/block-editor/types"
import { blocksToHTML } from "@/lib/blocks-to-html"
import { Calendar, Tag, Search } from "lucide-react"

interface PostPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  category: string
  excerpt: string
  blocks: Block[]
  featuredImage: string
  previewImage: string | null
  metaTitle?: string
  metaDescription?: string
  slug?: string
  publishedAt?: string | null
  updatedAt?: string | null
}

export function PostPreviewDialog({
  open,
  onOpenChange,
  title,
  category,
  excerpt,
  blocks,
  featuredImage,
  previewImage,
  metaTitle,
  metaDescription,
  slug,
  publishedAt = null,
  updatedAt = null,
}: PostPreviewDialogProps) {
  /**
   * Dùng chung `blocksToHTML` với trang public để bản xem trước đúng như bài thật
   * (trước đây dùng BlockRenderer riêng nên cỡ heading / công thức hiển thị khác).
   */
  const htmlContent = useMemo(() => blocksToHTML(blocks), [blocks])

  const displayTitle = metaTitle || title || "Tiêu đề bài viết"
  const displayDescription = metaDescription || excerpt || "Mô tả ngắn của bài viết sẽ hiển thị ở đây."

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Xem trước bài viết</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Xem trước kết quả tìm kiếm */}
          <div className="rounded-lg border bg-secondary/20 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
              <Search className="h-3.5 w-3.5" />
              Xem trước trên Google
            </div>
            <p className="text-xs text-green-700">
              www.veximglobal.com › blog › {slug || "duong-dan-bai-viet"}
            </p>
            <p className="text-lg font-medium text-blue-800 line-clamp-2">{displayTitle}</p>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {displayDescription.length > 160 ? `${displayDescription.slice(0, 157)}...` : displayDescription}
            </p>
          </div>

          {/* Featured Image */}
          {(previewImage || featuredImage) && (
            <div className="relative h-64 w-full overflow-hidden rounded-lg">
              <img src={previewImage || featuredImage} alt={title} className="h-full w-full object-cover" />
            </div>
          )}

          {/* Meta Info — dùng ngày thật của bài (trước đây luôn hiển thị "hôm nay") */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>
                Ngày xuất bản:{" "}
                {publishedAt
                  ? new Date(publishedAt).toLocaleDateString("vi-VN", { year: "numeric", month: "long", day: "numeric" })
                  : "chưa xuất bản"}
              </span>
            </div>
            {updatedAt && publishedAt && updatedAt !== publishedAt && (
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>
                  Cập nhật:{" "}
                  {new Date(updatedAt).toLocaleDateString("vi-VN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>{category || "Chưa chọn danh mục"}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-primary">{title || "Tiêu đề bài viết"}</h1>

          {/* Excerpt */}
          {excerpt && (
            <p className="border-l-4 border-primary pl-4 text-lg italic text-muted-foreground">{excerpt}</p>
          )}

          {/* Content — cùng class với trang blog công khai */}
          {htmlContent ? (
            <div
              className="prose prose-lg max-w-none prose-headings:text-primary prose-h2:text-3xl prose-h2:font-bold prose-h2:mb-4 prose-h2:mt-8 prose-h3:text-2xl prose-h3:font-bold prose-h3:mb-3 prose-h3:mt-6 prose-p:text-base prose-p:leading-relaxed prose-p:mb-4 prose-ul:my-4 prose-li:text-base prose-li:leading-relaxed prose-a:text-accent prose-a:underline prose-figure:my-8 prose-figcaption:mt-3 prose-figcaption:text-center prose-figcaption:text-sm prose-figcaption:italic prose-figcaption:text-muted-foreground prose-img:rounded-lg prose-img:shadow-md"
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có nội dung để xem trước.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
