"use client"

import React from "react"
import { useRef, useEffect } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { HeadingData } from "../types"
import { sanitizeInlineHtml } from "@/lib/sanitize"

interface HeadingBlockProps {
  data: HeadingData
  onChange: (data: Partial<HeadingData>) => void
  onEnter?: () => void
  onBackspace?: () => void
}

export function HeadingBlock({ data, onChange, onEnter, onBackspace }: HeadingBlockProps) {
  const { level = 2, text = "", align = "left" } = data

  const editorRef = useRef<HTMLHeadingElement>(null)
  const isComposingRef = useRef(false)
  const lastTextRef = useRef(text)

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align]

  // Khởi tạo nội dung khi mount giữ định dạng inline (bold/italic/link)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === "") {
      const initial = sanitizeInlineHtml(text)
      editorRef.current.innerHTML = initial
      lastTextRef.current = initial
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Chỉ ghi lại DOM khi nội dung đổi từ bên ngoài (tránh con trỏ nhảy khi đang gõ)
  useEffect(() => {
    if (text !== lastTextRef.current && editorRef.current && document.activeElement !== editorRef.current) {
      const normalized = sanitizeInlineHtml(text)
      editorRef.current.innerHTML = normalized
      lastTextRef.current = normalized
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const syncFromDom = (html?: string) => {
    const sanitized = sanitizeInlineHtml(html ?? editorRef.current?.innerHTML ?? "")
    lastTextRef.current = sanitized
    onChange({ text: sanitized })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    // Enter - tạo khối đoạn văn mới bên dưới, giữ nguyên định dạng
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      syncFromDom(e.currentTarget.innerHTML)
      onEnter?.()
    }

    // Backspace ở khối rỗng - xoá khối
    if (e.key === "Backspace" && !e.currentTarget.textContent?.trim()) {
      e.preventDefault()
      onBackspace?.()
    }
  }

  const handleInput = (e: React.FormEvent<HTMLHeadingElement>) => {
    // Bỏ qua khi đang gõ IME (tiếng Việt) để tránh con trỏ nhảy
    if (isComposingRef.current) return
    syncFromDom(e.currentTarget.innerHTML)
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLHeadingElement>) => {
    isComposingRef.current = false
    syncFromDom(e.currentTarget.innerHTML)
  }

  const handleBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
    syncFromDom(e.currentTarget.innerHTML)
  }

  const headingProps = {
    ref: editorRef,
    contentEditable: true,
    suppressContentEditableWarning: true,
    className: `${alignClass} ${
      level === 2 ? "text-3xl" : level === 3 ? "text-2xl" : level === 1 ? "text-4xl" : "text-xl"
    } font-bold text-primary outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:font-normal`,
    "data-placeholder": "Nhập tiêu đề...",
    onKeyDown: handleKeyDown,
    onInput: handleInput,
    onCompositionStart: handleCompositionStart,
    onCompositionEnd: handleCompositionEnd,
    onBlur: handleBlur,
  }

  /** Render theo từng cấp cụ thể (thay cho thẻ động gây lỗi type & làm chậm biên dịch) */
  const renderHeading = () => {
    switch (level) {
      case 1:
        return <h1 {...headingProps} />
      case 3:
        return <h3 {...headingProps} />
      case 4:
        return <h4 {...headingProps} />
      case 5:
        return <h5 {...headingProps} />
      case 6:
        return <h6 {...headingProps} />
      default:
        return <h2 {...headingProps} />
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select
          value={[2, 3, 4].includes(level) ? level.toString() : "2"}
          onValueChange={(value) => onChange({ level: parseInt(value) as HeadingData["level"] })}
        >
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">Tiêu đề 2</SelectItem>
            <SelectItem value="3">Tiêu đề 3</SelectItem>
            <SelectItem value="4">Tiêu đề 4</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {renderHeading()}
    </div>
  )
}
