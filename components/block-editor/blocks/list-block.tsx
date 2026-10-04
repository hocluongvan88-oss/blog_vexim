"use client"

import React, { useRef, useEffect, useState, useCallback } from "react"
import type { ListData } from "../types"
import { Button } from "@/components/ui/button"
import { Plus, Minus, List, ListOrdered } from "lucide-react"

interface ListBlockProps {
  data: ListData
  onChange: (data: Partial<ListData>) => void
  onEnter?: () => void
  onBackspace?: () => void
  onNavigateVertical?: (direction: "up" | "down") => void
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
  const lastValueRef = useRef<string>("")
  const isFirstMount = useRef(true)
  const isComposingRef = useRef(false)

  // Decode HTML entities (e.g., &lt; -> <, &amp; -> &)
  const decodeHTMLEntities = useCallback((html: string): string => {
    const temp = document.createElement("textarea")
    temp.innerHTML = html
    return temp.value
  }, [])

  // Sanitize HTML - remove inline styles but keep allowed tags
  const sanitizeHTML = useCallback(
    (html: string): string => {
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
    },
    [decodeHTMLEntities],
  )

  // Set initial content on mount, and update when item changes externally
  useEffect(() => {
    if (contentRef.current) {
      const sanitized = sanitizeHTML(item)
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
    if (isComposingRef.current) return
    if (contentRef.current) {
      const html = contentRef.current.innerHTML || ""
      lastValueRef.current = html
      onItemChange(index, html)
    }
  }, [index, onItemChange])

  const handleBlur = useCallback(() => {
    if (contentRef.current) {
      const html = sanitizeHTML(contentRef.current.innerHTML || "")
      lastValueRef.current = html
      contentRef.current.innerHTML = html
      onItemChange(index, html)
    }
  }, [index, onItemChange, sanitizeHTML])

  const handleKeyDownInternal = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (isComposingRef.current) return
      onKeyDown(e, index)
    },
    [index, onKeyDown],
  )

  return (
    <li data-item-index={index} className="relative group pr-8">
      <div
        ref={contentRef}
        contentEditable
        suppressContentEditableWarning
        className="outline-none min-h-[24px] empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground/60"
        data-placeholder="Nhập mục danh sách... (Enter thêm mục, Enter ở dòng trống để thoát)"
        onInput={handleInput}
        onCompositionStart={() => {
          isComposingRef.current = true
        }}
        onCompositionEnd={() => {
          isComposingRef.current = false
          handleInput()
        }}
        onKeyDown={handleKeyDownInternal}
        onBlur={handleBlur}
      />
      <button
        type="button"
        className="absolute right-0 top-0.5 opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-destructive/10"
        onClick={(e) => {
          e.preventDefault()
          onRemove(index)
        }}
        onMouseDown={(e) => e.preventDefault()}
        title="Xóa mục này"
      >
        <Minus className="w-3.5 h-3.5 text-destructive hover:text-destructive/80" />
      </button>
    </li>
  )
}

export function ListBlock({ data, onChange, onEnter, onBackspace, onNavigateVertical }: ListBlockProps) {
  const { items = [""], style = "unordered", align = "left" } = data
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }[align]

  const isOrdered = style === "ordered"
  const listClass = isOrdered ? "list-decimal" : "list-disc"

  const handleItemChange = useCallback(
    (index: number, value: string) => {
      const newItems = [...items]
      newItems[index] = value
      onChange({ items: newItems })
    },
    [items, onChange],
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, index: number) => {
      if (e.key === "ArrowUp" && !e.shiftKey) {
        e.preventDefault()
        if (index > 0) {
          setFocusedIndex(index - 1)
        } else {
          onNavigateVertical?.("up")
        }
        return
      }

      if (e.key === "ArrowDown" && !e.shiftKey) {
        e.preventDefault()
        if (index < items.length - 1) {
          setFocusedIndex(index + 1)
        } else {
          onNavigateVertical?.("down")
        }
        return
      }

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
    },
    [items, onChange, onEnter, onBackspace, onNavigateVertical],
  )

  const addItem = useCallback(() => {
    onChange({ items: [...items, ""] })
    setFocusedIndex(items.length)
  }, [items, onChange])

  const removeItem = useCallback(
    (index: number) => {
      if (items.length === 1) {
        onBackspace?.()
      } else {
        const newItems = items.filter((_, i) => i !== index)
        onChange({ items: newItems })
      }
    },
    [items, onChange, onBackspace],
  )

  // Focus management
  useEffect(() => {
    if (focusedIndex === null) return

    const timer = setTimeout(() => {
      const liElement = listRef.current?.querySelector(`li[data-item-index="${focusedIndex}"]`) as HTMLElement | null
      const element = liElement?.querySelector("[contenteditable]") as HTMLElement | null
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

    return () => clearTimeout(timer)
  }, [focusedIndex])

  const ListTag = isOrdered ? "ol" : "ul"

  return (
    <div className="group/list space-y-2" ref={listRef}>
      <div className="flex items-start gap-2">
        <ListTag className={`flex-1 ${listClass} pl-6 space-y-2 ${alignClass}`}>
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
        </ListTag>

        {/* Nút chuyển nhanh giữa Danh sách chấm (•) và Danh sách đánh số (1. 2. 3.) */}
        <div className="flex items-center gap-0.5 rounded-md border bg-muted/40 p-0.5 opacity-60 group-hover/list:opacity-100 focus-within:opacity-100 transition-opacity flex-shrink-0">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              onChange({ style: "unordered" })
            }}
            className={`p-1 rounded transition-colors ${
              !isOrdered
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
            title="Danh sách chấm tròn (•)"
          >
            <List className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault()
              onChange({ style: "ordered" })
            }}
            className={`p-1 rounded transition-colors ${
              isOrdered
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground hover:bg-background"
            }`}
            title="Danh sách đánh số (1. 2. 3.)"
          >
            <ListOrdered className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <Button variant="ghost" size="sm" onClick={addItem} className="text-xs h-7 text-muted-foreground hover:text-foreground">
        <Plus className="w-3 h-3 mr-1" />
        Thêm mục
      </Button>
    </div>
  )
}
