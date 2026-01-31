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
  onSlashCommand?: () => void
}

export function ParagraphBlock({ data, onChange, onEnter, onBackspace, onPasteSplit, onSlashCommand }: ParagraphBlockProps) {
  const { text = "", align = "justify" } = data
  const editorRef = useRef<HTMLParagraphElement>(null)
  const isComposingRef = useRef(false)
  const lastTextRef = useRef(text)

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify md:text-justify",
  }[align]

  // Initialize content on mount
  useEffect(() => {
    if (editorRef.current && editorRef.current.textContent === "") {
      editorRef.current.textContent = text
      lastTextRef.current = text
    }
  }, [])

  // Only update content from props if it changed externally (not from user input)
  useEffect(() => {
    if (text !== lastTextRef.current && editorRef.current) {
      const selection = window.getSelection()
      const isEditorFocused = document.activeElement === editorRef.current
      
      // Save cursor position if focused
      let savedRange: Range | null = null
      if (isEditorFocused && selection && selection.rangeCount > 0) {
        savedRange = selection.getRangeAt(0).cloneRange()
      }

      // Update content
      editorRef.current.textContent = text
      lastTextRef.current = text

      // Restore cursor position if was focused
      if (savedRange && isEditorFocused && selection) {
        try {
          selection.removeAllRanges()
          selection.addRange(savedRange)
        } catch (e) {
          // If range is invalid, place cursor at end
          const range = document.createRange()
          range.selectNodeContents(editorRef.current)
          range.collapse(false)
          selection.removeAllRanges()
          selection.addRange(range)
        }
      }
    }
  }, [text])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    // Slash command - open block menu when typing "/" at start of empty block
    if (e.key === "/" && !isComposingRef.current) {
      const currentText = e.currentTarget.textContent?.trim() || ""
      if (!currentText && onSlashCommand) {
        e.preventDefault()
        onSlashCommand()
        return
      }
    }

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
    
    // More robust line splitting - handles various line break formats
    // Split by double newlines first (paragraph breaks), then single newlines
    let lines: string[] = []
    
    // First try splitting by double newlines (clear paragraph separators)
    const paragraphs = pastedText.split(/\n\s*\n|\r\n\s*\r\n/)
    
    if (paragraphs.length > 1) {
      // Multiple paragraphs detected
      lines = paragraphs
        .map(p => p.trim())
        .filter(p => p.length > 0)
    } else {
      // Fall back to single newline splitting
      lines = pastedText
        .split(/\r?\n/)
        .map(line => line.trim())
        .filter(line => line.length > 0)
    }
    
    // If we have multiple lines and the callback exists, split into blocks
    if (lines.length > 1 && onPasteSplit) {
      onPasteSplit(lines)
    } else if (lines.length === 1) {
      // Single line/paragraph - insert as normal text
      const textToInsert = lines[0]
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const textNode = document.createTextNode(textToInsert)
        range.insertNode(textNode)
        range.setStartAfter(textNode)
        range.setEndAfter(textNode)
        selection.removeAllRanges()
        selection.addRange(range)
      }
      onChange({ text: e.currentTarget.textContent || "" })
    } else if (pastedText.trim()) {
      // Fallback - just insert the trimmed text
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        range.deleteContents()
        const textNode = document.createTextNode(pastedText.trim())
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
    const newText = e.currentTarget.textContent || ""
    lastTextRef.current = newText
    onChange({ text: newText })
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLParagraphElement>) => {
    isComposingRef.current = false
    const newText = e.currentTarget.textContent || ""
    lastTextRef.current = newText
    onChange({ text: newText })
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
      onBlur={(e) => {
        const newText = e.currentTarget.textContent || ""
        lastTextRef.current = newText
        onChange({ text: newText })
      }}
    />
  )
}
