"use client"

import React from "react"
import { useRef, useEffect } from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { HeadingData } from "../types"
import { JSX } from "react"

interface HeadingBlockProps {
  data: HeadingData
  onChange: (data: Partial<HeadingData>) => void
  onEnter?: () => void
  onBackspace?: () => void
}

export function HeadingBlock({ data, onChange, onEnter, onBackspace }: HeadingBlockProps) {
  const { level = 2, text = "", align = "left" } = data

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  const editorRef = useRef<HTMLHeadingElement>(null)
  const isComposingRef = useRef(false)
  const lastTextRef = useRef(text)

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align]

  // Initialize content on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.textContent === "") {
      editorRef.current.textContent = text
      lastTextRef.current = text
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Only update content from props if it changed externally (not from user typing).
  // This prevents the cursor from jumping to the start on every keystroke.
  useEffect(() => {
    if (text !== lastTextRef.current && editorRef.current && document.activeElement !== editorRef.current) {
      editorRef.current.textContent = text
      lastTextRef.current = text
    }
  }, [text])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    // Enter key - create new paragraph block below
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const currentText = e.currentTarget.textContent || ""
      lastTextRef.current = currentText
      onChange({ text: currentText })
      onEnter?.()
    }

    // Backspace on empty block - delete this block
    if (e.key === "Backspace" && !e.currentTarget.textContent?.trim()) {
      e.preventDefault()
      onBackspace?.()
    }
  }

  const handleInput = (e: React.FormEvent<HTMLHeadingElement>) => {
    // Skip while composing (IME / Vietnamese typing) to avoid cursor jumps
    if (isComposingRef.current) return
    const newText = e.currentTarget.textContent || ""
    lastTextRef.current = newText
    onChange({ text: newText })
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLHeadingElement>) => {
    isComposingRef.current = false
    const newText = e.currentTarget.textContent || ""
    lastTextRef.current = newText
    onChange({ text: newText })
  }

  const handleBlur = (e: React.FocusEvent<HTMLHeadingElement>) => {
    const newText = e.currentTarget.textContent || ""
    lastTextRef.current = newText
    onChange({ text: newText })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select value={level.toString()} onValueChange={(value) => onChange({ level: parseInt(value) as 2 | 3 })}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">Tiêu đề 2</SelectItem>
            <SelectItem value="3">Tiêu đề 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <HeadingTag
        ref={editorRef as React.Ref<HTMLHeadingElement>}
        contentEditable
        suppressContentEditableWarning
        className={`${alignClass} ${level === 2 ? "text-3xl" : "text-2xl"} font-bold text-primary outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground empty:before:font-normal`}
        data-placeholder="Nhập tiêu đề..."
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onBlur={handleBlur}
      />
    </div>
  )
}
