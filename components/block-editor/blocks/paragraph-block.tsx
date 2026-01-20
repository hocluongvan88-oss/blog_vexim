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
  const isUpdatingRef = useRef(false)

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify md:text-justify",
  }[align]

  // Update content only if it changed externally (not from user input)
  useEffect(() => {
    if (editorRef.current && !isUpdatingRef.current) {
      const currentText = editorRef.current.textContent || ""
      if (currentText !== text) {
        // Save cursor position
        const selection = window.getSelection()
        let cursorPosition = 0
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0)
          cursorPosition = range.startOffset
        }

        // Update content
        editorRef.current.textContent = text
        
        // Restore cursor position
        if (selection && editorRef.current.firstChild) {
          const newRange = document.createRange()
          const textNode = editorRef.current.firstChild
          const maxOffset = (textNode.textContent || "").length
          newRange.setStart(textNode, Math.min(cursorPosition, maxOffset))
          newRange.collapse(true)
          selection.removeAllRanges()
          selection.addRange(newRange)
        }
      }
    }
    isUpdatingRef.current = false
  }, [text])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    // Enter key - create new paragraph block below
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const currentText = e.currentTarget.textContent || ""
      isUpdatingRef.current = true
      onChange({ text: currentText })
      onEnter?.()
      return
    }

    // Backspace on empty block - delete this block
    if (e.key === "Backspace") {
      const currentText = e.currentTarget.textContent?.trim() || ""
      if (!currentText) {
        e.preventDefault()
        isUpdatingRef.current = true
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
      isUpdatingRef.current = true
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
      isUpdatingRef.current = true
      onChange({ text: e.currentTarget.textContent || "" })
    }
  }

  const handleInput = (e: React.FormEvent<HTMLParagraphElement>) => {
    isUpdatingRef.current = true
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
      onBlur={(e) => {
        isUpdatingRef.current = true
        onChange({ text: e.currentTarget.textContent || "" })
      }}
    >
      {text}
    </p>
  )
}
