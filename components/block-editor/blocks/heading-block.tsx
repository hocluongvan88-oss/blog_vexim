"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { HeadingData } from "../types"
import { JSX } from "react"

interface HeadingBlockProps {
  data: HeadingData
  onChange: (data: Partial<HeadingData>) => void
}

export function HeadingBlock({ data, onChange }: HeadingBlockProps) {
  const { level = 2, text = "", align = "left" } = data

  const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align]

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
        onBlur={(e) => onChange({ text: e.currentTarget.textContent || "" })}
        dangerouslySetInnerHTML={{ __html: text || "Nhập tiêu đề..." }}
      />
    </div>
  )
}
