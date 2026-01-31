"use client"

import React, { useRef, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { List, ListOrdered, Plus, Trash2 } from "lucide-react"
import type { ListData } from "../types"

interface ListBlockProps {
  data: ListData
  onChange: (data: Partial<ListData>) => void
  onEnter?: () => void
  onBackspace?: () => void
}

export function ListBlock({ data, onChange, onEnter, onBackspace }: ListBlockProps) {
  const { style = "unordered", items = [""], align = "left" } = data
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])
  const isComposingRef = useRef(false)

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify",
  }[align]

  // Focus on last item when items change (new item added)
  const focusItem = useCallback((index: number) => {
    setTimeout(() => {
      const item = itemRefs.current[index]
      if (item) {
        item.focus()
        // Move cursor to end
        const range = document.createRange()
        const selection = window.getSelection()
        range.selectNodeContents(item)
        range.collapse(false)
        selection?.removeAllRanges()
        selection?.addRange(range)
      }
    }, 10)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, index: number) => {
    if (isComposingRef.current) return

    const currentText = e.currentTarget.textContent || ""

    // Enter - add new item below
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      
      // If current item is empty and it's the last one, exit list and create paragraph
      if (!currentText.trim() && index === items.length - 1 && items.length > 1) {
        // Remove empty last item
        const newItems = items.slice(0, -1)
        onChange({ items: newItems })
        onEnter?.()
        return
      }
      
      // Add new item below
      const newItems = [...items]
      newItems.splice(index + 1, 0, "")
      onChange({ items: newItems })
      focusItem(index + 1)
      return
    }

    // Backspace on empty item
    if (e.key === "Backspace" && !currentText) {
      e.preventDefault()
      
      if (items.length === 1) {
        // Last item - delete entire block
        onBackspace?.()
        return
      }
      
      // Remove current item and focus previous
      const newItems = items.filter((_, i) => i !== index)
      onChange({ items: newItems })
      focusItem(Math.max(0, index - 1))
      return
    }

    // Tab - indent (future feature)
    if (e.key === "Tab") {
      e.preventDefault()
      // Could implement nested lists here
    }
  }

  const handleInput = (e: React.FormEvent<HTMLLIElement>, index: number) => {
    const newText = e.currentTarget.textContent || ""
    const newItems = [...items]
    newItems[index] = newText
    onChange({ items: newItems })
  }

  const addItem = () => {
    const newItems = [...items, ""]
    onChange({ items: newItems })
    focusItem(newItems.length - 1)
  }

  const removeItem = (index: number) => {
    if (items.length === 1) {
      onBackspace?.()
      return
    }
    const newItems = items.filter((_, i) => i !== index)
    onChange({ items: newItems })
  }

  const toggleStyle = () => {
    onChange({ style: style === "unordered" ? "ordered" : "unordered" })
  }

  const ListTag = style === "ordered" ? "ol" : "ul"
  const listStyleClass = style === "ordered" ? "list-decimal" : "list-disc"

  return (
    <div className="space-y-2">
      {/* List Controls */}
      <div className="flex items-center gap-2">
        <Button
          variant={style === "unordered" ? "default" : "outline"}
          size="sm"
          onClick={() => onChange({ style: "unordered" })}
          className="h-8"
        >
          <List className="w-4 h-4 mr-1" />
          <span className="text-xs">Danh sach</span>
        </Button>
        <Button
          variant={style === "ordered" ? "default" : "outline"}
          size="sm"
          onClick={() => onChange({ style: "ordered" })}
          className="h-8"
        >
          <ListOrdered className="w-4 h-4 mr-1" />
          <span className="text-xs">Danh sach so</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={addItem}
          className="h-8 ml-auto bg-transparent"
        >
          <Plus className="w-4 h-4 mr-1" />
          <span className="text-xs">Them muc</span>
        </Button>
      </div>

      {/* List Items */}
      <ListTag className={`${alignClass} ${listStyleClass} pl-6 space-y-1`}>
        {items.map((item, index) => (
          <li
            key={index}
            ref={(el) => { itemRefs.current[index] = el }}
            contentEditable
            suppressContentEditableWarning
            className="outline-none py-1 group relative empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
            data-placeholder="Nhap noi dung..."
            onKeyDown={(e) => handleKeyDown(e, index)}
            onInput={(e) => handleInput(e, index)}
            onCompositionStart={() => { isComposingRef.current = true }}
            onCompositionEnd={() => { isComposingRef.current = false }}
            dangerouslySetInnerHTML={{ __html: item }}
          />
        ))}
      </ListTag>
    </div>
  )
}
