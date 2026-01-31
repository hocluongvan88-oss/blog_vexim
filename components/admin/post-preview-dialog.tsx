"use client"

import React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { BlockRenderer } from "@/components/block-editor/block-renderer"
import type { Block } from "@/components/block-editor/types"
import { Calendar, Tag } from "lucide-react"

interface PostPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  category: string
  excerpt: string
  blocks: Block[]
  featuredImage: string
  previewImage: string | null
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
}: PostPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Xem trước bài viết</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Featured Image */}
          {(previewImage || featuredImage) && (
            <div className="relative w-full h-64 overflow-hidden rounded-lg">
              <img
                src={previewImage || featuredImage}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>{new Date().toLocaleDateString("vi-VN")}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-4 h-4" />
              <span>{category}</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-primary">{title}</h1>

          {/* Excerpt */}
          {excerpt && (
            <p className="text-lg text-muted-foreground italic border-l-4 border-primary pl-4">
              {excerpt}
            </p>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <BlockRenderer blocks={blocks} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
