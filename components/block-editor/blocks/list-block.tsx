"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import type { ListData } from "../types"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"

interface ListBlockProps {
  data: ListData
  onChange: (data: Partial<ListData>) => void
  onEnter?: () => void
  onBackspace?: () => void
}

// Individual list item component to prevent re-render issues with contentEditable
function ListItem({
  item,
  index,
  onItemChange,
  onKeyDown,
  onRemove,
}: {
  item: string
  index: number
  onItemChange: (index: number, value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLDivElement>, index: number) => void
  onRemove: (index: number) => void
}) {
  const contentRef = useRef<HTMLDivElement>(null)
  const lastValueRef = useRef<string>("") // Start empty so first render always sets content
  const isFirstMount = useRef(true)

  // Decode HTML entities (e.g., &lt; -> <, &amp; -> &)
  const decodeHTMLEntities = useCallback((html: string): string => {
    const temp = document.createElement("textarea")
    temp.innerHTML = html
    return temp.value
  }, [])

  // Sanitize HTML - remove inline styles but keep allowed tags
  const sanitizeHTML = useCallback((html: string): string => {
    const decodedHTML = decodeHTMLEntities(html)
    const temp = document.createElement("div")
    temp.innerHTML = decodedHTML
    
    const allowedTags = ["strong", "b", "em", "i", "u", "a", "code", "br"]
    
    temp.querySelectorAll("script, iframe, object, embed, form, input, button").forEach((el) => {
      el.remove()
    })
    
    temp.querySelectorAll("*").forEach((el) => {
      const tag = el.tagName.toLowerCase()
      
      if (tag === "a") {
        const href = el.getAttribute("href") || ""
        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name)
        }
        if (href && !href.toLowerCase().startsWith("javascript:")) {
          el.setAttribute("href", href)
        }
      } else if (allowedTags.includes(tag)) {
        while (el.attributes.length > 0) {
          el.removeAttribute(el.attributes[0].name)
        }
      } else if (tag !== "span") {
        el.replaceWith(...Array.from(el.childNodes))
      }
    })
    
    // Remove empty spans
    temp.querySelectorAll("span").forEach((span) => {
      if (!span.innerHTML.trim()) {
        span.remove()
      } else {
        span.replaceWith(...Array.from(span.childNodes))
      }
    })
    
    return temp.innerHTML
  }, [decodeHTMLEntities])

  // Set initial content on mount, and update when item changes externally
  useEffect(() => {
    if (contentRef.current) {
      const sanitized = sanitizeHTML(item)
      // Always set on first mount, or when item changes from external source
      if (isFirstMount.current) {
        contentRef.current.innerHTML = sanitized
        lastValueRef.current = sanitized
        isFirstMount.current = false
      } else if (sanitized !== lastValueRef.current && sanitized !== contentRef.current.innerHTML) {
        contentRef.current.innerHTML = sanitized
        lastValueRef.current = sanitized
      }
    }
  }, [item, sanitizeHTML])

  const handleInput = useCallback(() => {
    if (contentRef.current) {
      const html = contentRef.current.innerHTML || ""
      lastValueRef.current = html
      // Don't sanitize during input - let user type freely
      onItemChange(index, html)
    }
  }, [index, onItemChange])

  const handleBlur = useCallback(() => {
    if (contentRef.current) {
      // Sanitize on blur
      const html = sanitizeHTML(contentRef.current.innerHTML || "")
      lastValueRef.current = html
      contentRef.current.innerHTML = html
      onItemChange(index, html)
    }
  }, [index, onItemChange, sanitizeHTML])

  const handleKeyDownInternal = useCallback((e: React.KeyboardEvent<HTMLDivElement>) => {
    onKeyDown(e, index)
  }, [index, onKeyDown])

  return (
    <li data-item-index={index} className="relative group pr-8">
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        className="outline-none min-h-[24px] empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
        data-placeholder="Nhập nội dung..."
        onInput={handleInput}
        onKeyDown={handleKeyDownInternal}
        onBlur={handleBlur}
      />
      <button
        className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => {
          e.preventDefault()
          onRemove(index)
        }}
        onMouseDown={(e) => e.preventDefault()}
      >
        <Minus className="w-4 h-4 text-destructive hover:text-destructive/80" />
      </button>
    </li>
  )
}

export function ListBlock({ data, onChange, onEnter, onBackspace }: ListBlockProps) {
  const { items = [""], style = "unordered", align = "left" } = data
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }[align]

  const listClass = style === "ordered" ? "list-decimal" : "list-disc"

  const handleItemChange = useCallback((index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    onChange({ items: newItems })
  }, [items, onChange])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const currentText = e.currentTarget.textContent || ""

      if (!currentText.trim() && items.length === 1) {
        onEnter?.()
      } else if (!currentText.trim()) {
        const newItems = items.filter((_, i) => i !== index)
        onChange({ items: newItems })
        onEnter?.()
      } else {
        const newItems = [...items]
        newItems.splice(index + 1, 0, "")
        onChange({ items: newItems })
        setFocusedIndex(index + 1)
      }
    }

    if (e.key === "Backspace") {
      const currentText = e.currentTarget.textContent?.trim() || ""
      if (!currentText) {
        e.preventDefault()
        if (items.length === 1) {
          onBackspace?.()
        } else {
          const newItems = items.filter((_, i) => i !== index)
          onChange({ items: newItems })
          setFocusedIndex(Math.max(0, index - 1))
        }
      }
    }
  }, [items, onChange, onEnter, onBackspace])

  const addItem = useCallback(() => {
    onChange({ items: [...items, ""] })
    setFocusedIndex(items.length)
  }, [items, onChange])

  const removeItem = useCallback((index: number) => {
    if (items.length === 1) {
      onBackspace?.()
    } else {
      const newItems = items.filter((_, i) => i !== index)
      onChange({ items: newItems })
    }
  }, [items, onChange, onBackspace])

  // Focus management
  useEffect(() => {
    if (focusedIndex !== null) {
      setTimeout(() => {
        const liElement = document.querySelector(
          `li[data-item-index="${focusedIndex}"]`
        ) as HTMLElement
        const element = liElement?.querySelector('[contenteditable]') as HTMLElement
        if (element) {
          element.focus()
          const range = document.createRange()
          const sel = window.getSelection()
          range.selectNodeContents(element)
          range.collapse(false)
          sel?.removeAllRanges()
          sel?.addRange(range)
        }
        setFocusedIndex(null)
      }, 0)
    }
  }, [focusedIndex])

  return (
    <div className="space-y-2">
      <ul className={`${listClass} pl-6 space-y-2 ${alignClass}`}>
        {items.map((item, index) => (
          <ListItem
            key={`item-${index}-${items.length}`}
            item={item}
            index={index}
            onItemChange={handleItemChange}
            onKeyDown={handleKeyDown}
            onRemove={removeItem}
          />
        ))}
      </ul>
      <Button
        variant="ghost"
        size="sm"
        onClick={addItem}
        className="text-xs"
      >
        <Plus className="w-3 h-3 mr-1" />
        Thêm mục
      </Button>
    </div>
  )
}
