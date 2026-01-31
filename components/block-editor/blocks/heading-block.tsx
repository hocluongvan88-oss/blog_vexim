"use client"

import React, { useRef, useEffect } from "react"

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
  const editorRef = useRef<HTMLHeadingElement>(null)
  const lastTextRef = useRef(text)
  const isComposingRef = useRef(false)

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

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
  }, [])

  // Only update content from props if it changed externally
  useEffect(() => {
    if (text !== lastTextRef.current && editorRef.current) {
      const selection = window.getSelection()
      const isEditorFocused = document.activeElement === editorRef.current
      
      let savedRange: Range | null = null
      if (isEditorFocused && selection && selection.rangeCount > 0) {
        savedRange = selection.getRangeAt(0).cloneRange()
      }

      editorRef.current.textContent = text
      lastTextRef.current = text

      if (savedRange && isEditorFocused && selection) {
        try {
          selection.removeAllRanges()
          selection.addRange(savedRange)
        } catch {
          const range = document.createRange()
          range.selectNodeContents(editorRef.current)
          range.collapse(false)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    }
  }, [text])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposingRef.current) {
      e.preventDefault()
      const currentText = e.currentTarget.textContent || ""
      onChange({ text: currentText })
      onEnter?.()
      return
    }

    if (e.key === "Backspace" && !isComposingRef.current) {
      const currentText = e.currentTarget.textContent?.trim() || ""
      if (!currentText) {
        e.preventDefault()
        onBackspace?.()
      }
    }
  }

  const handleInput = (e: React.FormEvent<HTMLHeadingElement>) => {
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

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select value={level.toString()} onValueChange={(value) => onChange({ level: parseInt(value) as 2 | 3 })}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">Tiêu de 2</SelectItem>
            <SelectItem value="3">Tiêu de 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <HeadingTag
        ref={editorRef as any}
        contentEditable
        suppressContentEditableWarning
        className={`${alignClass} ${level === 2 ? "text-3xl" : "text-2xl"} font-bold text-primary outline-none empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground`}
        data-placeholder="Nhap tieu de..."
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        onBlur={(e) => {
          const newText = e.currentTarget.textContent || ""
          lastTextRef.current = newText
          onChange({ text: newText })
        }}
      />
    </div>
  )
}
