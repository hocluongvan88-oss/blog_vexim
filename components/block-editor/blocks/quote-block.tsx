"use client"

import { Input } from "@/components/ui/input"
import type { QuoteData } from "../types"

interface QuoteBlockProps {
  data: QuoteData
  onChange: (data: Partial<QuoteData>) => void
}

export function QuoteBlock({ data, onChange }: QuoteBlockProps) {
  const { text = "", author = "", align = "left" } = data

  const alignClass = {
    left: "text-left",
    center: "text-center",
  }[align]

  return (
    <blockquote className={`${alignClass} border-l-4 border-primary pl-4 py-2 my-4 italic`}>
      <p
        contentEditable
        suppressContentEditableWarning
        className="text-lg text-muted-foreground outline-none min-h-[50px]"
        onBlur={(e) => onChange({ text: e.currentTarget.textContent || "" })}
        dangerouslySetInnerHTML={{ __html: text || "Nhập trích dẫn..." }}
      />
      <footer className="mt-2">
        <Input
          placeholder="Tác giả (tùy chọn)"
          value={author}
          onChange={(e) => onChange({ author: e.target.value })}
          className="text-sm italic border-0 shadow-none px-0"
        />
      </footer>
    </blockquote>
  )
}
