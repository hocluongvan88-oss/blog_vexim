"use client"

import React from "react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { HeadingData } from "../types"
import { JSX } from "react"

interface HeadingBlockProps {
  data: HeadingData
  onChange: (data: Partial<HeadingData>) => void
  onEnter?: () => void
  onBackspace?: () => void
}

export function HeadingBlock({ data, onChange, onEnter, onBackspace }: HeadingBlockProps) {
  const { level = 2, text = "", align = "left" } = data

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align]

  const handleKeyDown = (e: React.KeyboardEvent<HTMLHeadingElement>) => {
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

  const handleInput = (e: React.FormEvent<HTMLHeadingElement>) => {
    onChange({ text: e.currentTarget.textContent || "" })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Select value={level.toString()} onValueChange={(value) => onChange({ level: parseInt(value) as 2 | 3 })}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2">Tiêu đề 2</SelectItem>
            <SelectItem value="3">Tiêu đề 3</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <HeadingTag
        contentEditable
        suppressContentEditableWarning
        className={`${alignClass} ${level === 2 ? "text-3xl" : "text-2xl"} font-bold text-primary outline-none`}
        onKeyDown={handleKeyDown}
        onInput={handleInput}
        onBlur={(e) => onChange({ text: e.currentTarget.textContent || "" })}
        dangerouslySetInnerHTML={{ __html: text || "Nhập tiêu đề..." }}
      />
    </div>
  )
}
