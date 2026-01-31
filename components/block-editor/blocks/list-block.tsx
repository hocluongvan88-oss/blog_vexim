"use client"

import React, { useRef, useEffect, useState } from "react"
import type { ListData } from "../types"
import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"

interface ListBlockProps {
  data: ListData
  onChange: (data: Partial<ListData>) => void
  onEnter?: () => void
  onBackspace?: () => void
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

  const handleItemChange = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    onChange({ items: newItems })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLLIElement>, index: number) => {
    // Enter key - create new item or block
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      const currentText = e.currentTarget.textContent || ""

      if (!currentText.trim() && items.length === 1) {
        // Empty single item - convert to paragraph block
        onEnter?.()
      } else if (!currentText.trim()) {
        // Empty item in list - exit list
        const newItems = items.filter((_, i) => i !== index)
        onChange({ items: newItems })
        onEnter?.()
      } else {
        // Add new item
        const newItems = [...items]
        newItems.splice(index + 1, 0, "")
        onChange({ items: newItems })
        setFocusedIndex(index + 1)
      }
    }

    // Backspace on empty item
    if (e.key === "Backspace") {
      const currentText = e.currentTarget.textContent?.trim() || ""
      if (!currentText) {
        e.preventDefault()
        if (items.length === 1) {
          // Last item - delete block
          onBackspace?.()
        } else {
          // Remove this item and focus previous
          const newItems = items.filter((_, i) => i !== index)
          onChange({ items: newItems })
          setFocusedIndex(Math.max(0, index - 1))
        }
      }
    }
  }

  const addItem = () => {
    onChange({ items: [...items, ""] })
    setFocusedIndex(items.length)
  }

  const removeItem = (index: number) => {
    if (items.length === 1) {
      onBackspace?.()
    } else {
      const newItems = items.filter((_, i) => i !== index)
      onChange({ items: newItems })
    }
  }

  // Focus management
  useEffect(() => {
    if (focusedIndex !== null) {
      const element = document.querySelector(
        `li[data-item-index="${focusedIndex}"]`
      ) as HTMLElement
      if (element) {
        element.focus()
        // Place cursor at end
        const range = document.createRange()
        const sel = window.getSelection()
        if (element.childNodes.length > 0) {
          range.setStart(element.childNodes[0], element.textContent?.length || 0)
        } else {
          range.selectNodeContents(element)
        }
        range.collapse(true)
        sel?.removeAllRanges()
        sel?.addRange(range)
      }
      setFocusedIndex(null)
    }
  }, [focusedIndex])

  return (
    <div className="space-y-2">
      <ul className={`${listClass} pl-6 space-y-2 ${alignClass}`}>
        {items.map((item, index) => (
          <li
            key={index}
            data-item-index={index}
            contentEditable
            suppressContentEditableWarning
            className="outline-none min-h-[24px] relative group empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground"
            data-placeholder="Nhập nội dung..."
            onInput={(e) => handleItemChange(index, e.currentTarget.textContent || "")}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onBlur={(e) => handleItemChange(index, e.currentTarget.textContent || "")}
          >
            {item}
            <button
              className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.preventDefault()
                removeItem(index)
              }}
              onMouseDown={(e) => e.preventDefault()}
            >
              <Minus className="w-4 h-4 text-destructive hover:text-destructive/80" />
            </button>
          </li>
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
