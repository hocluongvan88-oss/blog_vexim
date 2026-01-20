"use client"

import React from "react"

import { useRef, useEffect } from "react"
import type { ParagraphData } from "../types"

interface ParagraphBlockProps {
  data: ParagraphData
  onChange: (data: Partial<ParagraphData>) => void
  onEnter?: () => void
  onBackspace?: () => void
  onPasteSplit?: (lines: string[]) => void
}

export function ParagraphBlock({ data, onChange, onEnter, onBackspace, onPasteSplit }: ParagraphBlockProps) {
  const { text = "", align = "justify" } = data
  const editorRef = useRef<HTMLParagraphElement>(null)

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify md:text-justify",
  }[align]

  // Auto-resize height
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.style.minHeight = "auto"
      editorRef.current.style.minHeight = `${editorRef.current.scrollHeight}px`
    }
  }, [text])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    // Enter key - create new paragraph block below
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const currentText = e.currentTarget.textContent || ""
      onChange({ text: currentText })
      onEnter?.()
    }

    // Backspace on empty block - delete this block
    if (e.key === "Backspace" && !e.currentTarget.textContent?.trim()) {
      e.preventDefault()
      onBackspace?.()
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text/plain")
    
    // Split by newlines
    const lines = pastedText.split(/\r?\n/).filter((line) => line.trim())
    
    if (lines.length > 1 && onPasteSplit) {
      // Multiple lines - create multiple blocks
      onPasteSplit(lines)
    } else {
      // Single line - insert as normal
      document.execCommand("insertText", false, pastedText)
    }
  }

  const handleInput = (e: React.FormEvent<HTMLParagraphElement>) => {
    onChange({ text: e.currentTarget.textContent || "" })
  }

  return (
    <p
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      className={`${alignClass} text-base leading-relaxed outline-none min-h-[50px] resize-none overflow-hidden`}
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onInput={handleInput}
      onBlur={(e) => onChange({ text: e.currentTarget.textContent || "" })}
      dangerouslySetInnerHTML={{ __html: text || "Nhập nội dung đoạn văn..." }}
    />
  )
}
