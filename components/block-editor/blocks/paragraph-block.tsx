"use client"

import React from "react"
import { useRef, useEffect } from "react"
import type { ParagraphData } from "../types"

interface ParsedBlock {
  type: "heading" | "paragraph" | "quote" | "list"
  text: string
  level?: 1 | 2 | 3
  style?: "ordered" | "unordered"
  items?: string[]
}

interface ParagraphBlockProps {
  data: ParagraphData & { align?: "left" | "center" | "right" | "justify" }
  onChange: (data: Partial<ParagraphData>) => void
  onEnter?: () => void
  onBackspace?: () => void
  onPasteSplit?: (lines: string[]) => void
  onPasteBlocks?: (blocks: ParsedBlock[]) => void
}

export function ParagraphBlock({
  data,
  onChange,
  onEnter,
  onBackspace,
  onPasteSplit,
  onPasteBlocks,
}: ParagraphBlockProps) {
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
      const sanitizedText = sanitizeHTML(text)
      editorRef.current.innerHTML = sanitizedText
      lastTextRef.current = sanitizedText
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
        try {
          savedRange = selection.getRangeAt(0).cloneRange()
        } catch (e) {
          console.warn("Failed to save cursor position:", e)
        }
      }

      // Update content - use innerHTML to preserve formatting
      const sanitizedText = sanitizeHTML(text)
      editorRef.current.innerHTML = sanitizedText
      lastTextRef.current = sanitizedText

      // Restore cursor position if was focused
      if (savedRange && isEditorFocused && selection) {
        try {
          selection.removeAllRanges()
          selection.addRange(savedRange)
        } catch (e) {
          // If range is invalid, place cursor at end
          try {
            const range = document.createRange()
            if (editorRef.current) {
              range.selectNodeContents(editorRef.current)
              range.collapse(false)
              selection.removeAllRanges()
              selection.addRange(range)
            }
          } catch (innerError) {
            console.warn("Failed to restore cursor position:", innerError)
          }
        }
      }
    }
  }, [text])

  // HTML Sanitization - allow safe inline tags, prevent XSS
  const sanitizeHTML = (html: string): string => {
    const temp = document.createElement("div")
    temp.innerHTML = html
    
    // Allow only safe inline formatting tags
    const allowedTags = ["strong", "b", "em", "i", "u", "a", "code", "br", "span"]
    
    // Remove scripts and dangerous elements
    temp.querySelectorAll("script, iframe, object, embed, form, input, button").forEach((el) => {
      el.remove()
    })
    
    // Clean attributes on allowed tags
    temp.querySelectorAll("*").forEach((el) => {
      const tag = el.tagName.toLowerCase()
      if (!allowedTags.includes(tag)) {
        // Replace non-allowed elements with their text content
        el.replaceWith(...Array.from(el.childNodes))
      } else if (tag === "a") {
        // Keep only href for links
        const href = el.getAttribute("href") || ""
        Array.from(el.attributes).forEach((attr) => {
          if (attr.name !== "href") {
            el.removeAttribute(attr.name)
          }
        })
        // Ensure href is safe (no javascript:)
        if (href.toLowerCase().startsWith("javascript:")) {
          el.removeAttribute("href")
        }
      } else {
        // Remove all attributes from other allowed tags
        Array.from(el.attributes).forEach((attr) => {
          el.removeAttribute(attr.name)
        })
      }
    })
    
    return temp.innerHTML
  }

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

  // Clean HTML from Google Docs/Gemini - strip block tags but keep inline formatting
  const cleanInlineHTML = (html: string): string => {
    const temp = document.createElement("div")
    temp.innerHTML = html

    // Convert styled spans to semantic tags
    temp.querySelectorAll("span").forEach((span) => {
      const style = span.getAttribute("style") || ""
      const hasBold = /font-weight\s*:\s*(700|bold)/i.test(style)
      const hasItalic = /font-style\s*:\s*italic/i.test(style)
      const hasUnderline = /text-decoration\s*:\s*underline/i.test(style)

      if (hasBold || hasItalic || hasUnderline) {
        const wrapper = document.createElement("div")
        wrapper.innerHTML = span.innerHTML

        // Build formatted content
        let formattedHTML = wrapper.innerHTML
        if (hasBold) formattedHTML = `<strong>${formattedHTML}</strong>`
        if (hasItalic) formattedHTML = `<em>${formattedHTML}</em>`
        if (hasUnderline) formattedHTML = `<u>${formattedHTML}</u>`

        // Create new element with proper nesting
        const newEl = document.createElement("span")
        newEl.innerHTML = formattedHTML
        span.replaceWith(...Array.from(newEl.childNodes))
      } else {
        // No style - unwrap span
        span.replaceWith(...Array.from(span.childNodes))
      }
    })

    // Unwrap block-level tags (p, div) but keep their content
    temp.querySelectorAll("p, div").forEach((el) => {
      el.replaceWith(...Array.from(el.childNodes))
    })

    // Clean ALL attributes from ALL elements (including strong, em, etc.)
    // This removes the massive inline styles from copy-pasted content
    temp.querySelectorAll("*").forEach((el) => {
      const tag = el.tagName.toLowerCase()
      const allowedTags = ["strong", "b", "em", "i", "u", "a", "code", "br"]

      if (tag === "a") {
        // Keep only href for links
        const href = el.getAttribute("href") || ""
        // Remove ALL attributes first
        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name)
        }
        // Add back href if safe
        if (href && !href.toLowerCase().startsWith("javascript:")) {
          el.setAttribute("href", href)
        }
      } else if (allowedTags.includes(tag)) {
        // Remove ALL attributes from allowed inline tags (strong, em, etc.)
        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name)
        }
      } else {
        // Non-allowed tags - replace with their content
        el.replaceWith(...Array.from(el.childNodes))
      }
    })

    return temp.innerHTML.trim()
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    e.preventDefault()

    const pastedHTML = e.clipboardData.getData("text/html")
    const pastedText = e.clipboardData.getData("text/plain")

    // If HTML content contains block-level tags (headings, paragraphs from Docs/Gemini)
    // parse into multiple blocks
    if (pastedHTML && onPasteBlocks) {
      try {
        const parser = new DOMParser()
        const doc = parser.parseFromString(pastedHTML, "text/html")
        const parsedBlocks: ParsedBlock[] = []

        const processNode = (node: Node) => {
          if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim() || ""
            if (text) {
              parsedBlocks.push({ type: "paragraph", text })
            }
            return
          }

          if (node.nodeType !== Node.ELEMENT_NODE) return

          const el = node as Element
          const tag = el.tagName.toLowerCase()

          if (["h1", "h2", "h3", "h4", "h5", "h6"].includes(tag)) {
            const text = el.textContent?.trim() || ""
            if (text) {
              const level = Math.min(parseInt(tag[1]), 3) as 1 | 2 | 3
              parsedBlocks.push({ type: "heading", text, level })
            }
          } else if (tag === "p") {
            const text = el.textContent?.trim() || ""
            if (text) {
              parsedBlocks.push({ type: "paragraph", text: cleanInlineHTML(el.innerHTML) })
            }
          } else if (tag === "blockquote") {
            const text = el.textContent?.trim() || ""
            if (text) {
              parsedBlocks.push({ type: "quote", text: cleanInlineHTML(el.innerHTML) })
            }
          } else if (tag === "ul" || tag === "ol") {
            const items: string[] = []
            el.querySelectorAll(":scope > li").forEach((li) => {
              const t = li.textContent?.trim() || ""
              if (t) {
                const cleanedHTML = cleanInlineHTML(li.innerHTML)
                items.push(cleanedHTML)
              }
            })
            if (items.length > 0) {
              parsedBlocks.push({
                type: "list",
                text: "",
                style: tag === "ol" ? "ordered" : "unordered",
                items,
              })
            }
          } else if (tag === "br") {
            // Skip line breaks - they're handled within paragraphs
          } else if (["div", "section", "article", "span"].includes(tag)) {
            // Check if this div/span has inline formatting (bold/italic)
            const style = el.getAttribute("style") || ""
            const hasBold = /font-weight\s*:\s*(700|bold)/i.test(style)
            const hasItalic = /font-style\s*:\s*italic/i.test(style)

            if ((hasBold || hasItalic) && el.children.length === 0) {
              // Inline formatted text - add as paragraph with formatting
              const text = el.textContent?.trim() || ""
              if (text) {
                let formattedText = cleanInlineHTML(el.innerHTML)
                if (hasBold) formattedText = `<strong>${formattedText}</strong>`
                if (hasItalic) formattedText = `<em>${formattedText}</em>`
                parsedBlocks.push({ type: "paragraph", text: formattedText })
              }
            } else {
              // Container - recurse into children
              Array.from(el.childNodes).forEach(processNode)
            }
          } else {
            // Unknown tag - try to get text content
            const text = el.textContent?.trim() || ""
            if (text && el.children.length === 0) {
              parsedBlocks.push({ type: "paragraph", text: cleanInlineHTML(el.innerHTML) })
            } else if (el.children.length > 0) {
              Array.from(el.childNodes).forEach(processNode)
            }
          }
        }

        Array.from(doc.body.childNodes).forEach(processNode)

        // If we detected multiple structured blocks, use them
        if (parsedBlocks.length > 1) {
          onPasteBlocks(parsedBlocks)
          return
        }

        // Single block with HTML - insert inline with formatting preserved
        if (parsedBlocks.length === 1 && parsedBlocks[0].type === "paragraph") {
          insertPasteContent(parsedBlocks[0].text)
          return
        }
      } catch (error) {
        console.warn("Failed to parse HTML paste content:", error)
        // Fallback to plain text handling
      }
    }

    // Fallback: plain text - split lines into blocks
    const lines = pastedText
      .split(/\r?\n/)
      .map((l) => l.trim())
      .filter((l) => l.length > 0)

    if (lines.length > 1 && onPasteSplit) {
      onPasteSplit(lines)
      return
    }

    // Single plain text - insert at cursor
    if (lines.length === 1) {
      insertPasteContent(lines[0])
    }
  }

  // Helper function to insert pasted content at cursor
  const insertPasteContent = (content: string) => {
    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) {
      // If no selection, just append to current text
      onChange({ text: (text + content).trim() })
      return
    }

    try {
      const range = selection.getRangeAt(0)
      range.deleteContents()

      const temp = document.createElement("div")
      temp.textContent = content
      const frag = document.createDocumentFragment()
      while (temp.firstChild) {
        frag.appendChild(temp.firstChild)
      }

      range.insertNode(frag)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)

      if (editorRef.current) {
        onChange({ text: editorRef.current.innerHTML || "" })
      }
    } catch (error) {
      console.warn("Failed to insert paste content:", error)
      // Fallback: append to text
      onChange({ text: (text + content).trim() })
    }
  }

  const handleInput = (e: React.FormEvent<HTMLParagraphElement>) => {
    // Get current HTML and sanitize it to remove any pasted inline styles
    const newHTML = sanitizeHTML(e.currentTarget.innerHTML || "")
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

  const handleBlur = (e: React.FocusEvent<HTMLParagraphElement>) => {
    // Sanitize on blur to ensure clean HTML is saved
    const newHTML = sanitizeHTML(e.currentTarget.innerHTML || "")
    lastTextRef.current = newHTML
    onChange({ text: newHTML })
  }

  return (
    <p
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      className={`${alignClass} text-base leading-relaxed outline-none min-h-[50px] resize-none overflow-hidden empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground prose prose-sm max-w-none [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer [&_a:hover]:text-blue-800`}
      data-placeholder="Nhập nội dung đoạn văn... (Bôi đen text để thêm link, in đậm, in nghiêng)"
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onInput={handleInput}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onBlur={handleBlur}
    />
  )
}
