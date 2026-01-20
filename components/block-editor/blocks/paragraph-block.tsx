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
  const isComposingRef = useRef(false)
  const isUpdatingRef = useRef(false) // Declare the variable here

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify md:text-justify",
  }[align]

  // Only update content from props if element is not focused
  useEffect(() => {
    if (editorRef.current && document.activeElement !== editorRef.current) {
      const currentText = editorRef.current.textContent || ""
      if (currentText !== text) {
        editorRef.current.textContent = text
      }
    }
  }, [text])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    // Enter key - create new paragraph block below
    if (e.key === "Enter" && !e.shiftKey && !isComposingRef.current) {
      e.preventDefault()
      const currentText = e.currentTarget.textContent || ""
      onChange({ text: currentText })
      onEnter?.()
      return
    }

    // Backspace on empty block - delete this block
    if (e.key === "Backspace" && !isComposingRef.current) {
      const currentText = e.currentTarget.textContent?.trim() || ""
      if (!currentText) {
        e.preventDefault()
        onBackspace?.()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text/plain")
    
    // Split by newlines
    const lines = pastedText.split(/\r?\n/)
    const nonEmptyLines = lines.filter((line) => line.trim())
    
    if (nonEmptyLines.length > 1 && onPasteSplit) {
      // Multiple lines - create multiple blocks
      onPasteSplit(nonEmptyLines)
    } else {
      // Single line - insert as normal text
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const textNode = document.createTextNode(pastedText)
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      onChange({ text: e.currentTarget.textContent || "" })
    }
  }

  const handleInput = (e: React.FormEvent<HTMLParagraphElement>) => {
    onChange({ text: e.currentTarget.textContent || "" })
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLParagraphElement>) => {
    isComposingRef.current = false
    onChange({ text: e.currentTarget.textContent || "" })
  }

  return (
    <p
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      className={`${alignClass} text-base leading-relaxed outline-none min-h-[50px] resize-none overflow-hidden empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground`}
      data-placeholder="Nhập nội dung đoạn văn..."
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onInput={handleInput}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onBlur={(e) => onChange({ text: e.currentTarget.textContent || "" })}
    >
      {text}
    </p>
  )
}
