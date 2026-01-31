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
  const lastTextRef = useRef(text)

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify md:text-justify",
  }[align]

  // Initialize content on mount - support HTML formatting
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === "") {
      editorRef.current.innerHTML = text
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

      // Update content - use innerHTML to preserve formatting
      editorRef.current.innerHTML = text
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
    
    // Try to get HTML first for formatting preservation
    const pastedHTML = e.clipboardData.getData("text/html")
    const pastedText = e.clipboardData.getData("text/plain")
    
    // Split by newlines to detect multi-line paste
    const lines = pastedText.split(/\r?\n/)
    
    // Filter out completely empty lines but preserve line structure
    const processedLines = lines.map(line => line.trim()).filter(line => line.length > 0)
    
    if (processedLines.length > 1 && onPasteSplit) {
      // Multiple non-empty lines - create multiple paragraph blocks
      onPasteSplit(processedLines)
      return
    }
    
    // Single line or no split handler - insert with formatting
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.deleteContents()
      
      // Try to preserve basic HTML formatting (bold, italic, links)
      if (pastedHTML && pastedHTML.includes("<")) {
        // Create temporary element to parse HTML
        const temp = document.createElement("div")
        temp.innerHTML = pastedHTML
        
        // Extract formatted content
        const fragment = document.createDocumentFragment()
        while (temp.firstChild) {
          fragment.appendChild(temp.firstChild)
        }
        range.insertNode(fragment)
      } else {
        // Plain text - preserve line breaks as <br>
        const textWithBreaks = pastedText.split(/\r?\n/).join("<br>")
        const temp = document.createElement("div")
        temp.innerHTML = textWithBreaks
        
        const fragment = document.createDocumentFragment()
        while (temp.firstChild) {
          fragment.appendChild(temp.firstChild)
        }
        range.insertNode(fragment)
      }
      
      // Move cursor to end of inserted content
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
      
      // Update with innerHTML to preserve formatting
      onChange({ text: e.currentTarget.innerHTML || "" })
    }
  }

  const handleInput = (e: React.FormEvent<HTMLParagraphElement>) => {
    const newHTML = e.currentTarget.innerHTML || ""
    lastTextRef.current = newHTML
    onChange({ text: newHTML })
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLParagraphElement>) => {
    isComposingRef.current = false
    const newHTML = e.currentTarget.innerHTML || ""
    lastTextRef.current = newHTML
    onChange({ text: newHTML })
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
        const newHTML = e.currentTarget.innerHTML || ""
        lastTextRef.current = newHTML
        onChange({ text: newHTML })
      }}
    />
  )
}
