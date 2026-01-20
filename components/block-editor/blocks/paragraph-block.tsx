"use client"

import type { ParagraphData } from "../types"

interface ParagraphBlockProps {
  data: ParagraphData
  onChange: (data: Partial<ParagraphData>) => void
}

export function ParagraphBlock({ data, onChange }: ParagraphBlockProps) {
  const { text = "", align = "justify" } = data

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify md:text-justify", // Justify on desktop, left on mobile
  }[align]

  return (
    <p
      contentEditable
      suppressContentEditableWarning
      className={`${alignClass} text-base leading-relaxed outline-none min-h-[50px]`}
      onBlur={(e) => onChange({ text: e.currentTarget.textContent || "" })}
      dangerouslySetInnerHTML={{ __html: text || "Nhập nội dung đoạn văn..." }}
    />
  )
}
