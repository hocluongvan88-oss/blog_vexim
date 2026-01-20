"use client"

import { Button } from "@/components/ui/button"
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import type { Block } from "./types"

interface BlockToolbarProps {
  block: Block
  onUpdate: (data: any) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
}

export function BlockToolbar({ block, onUpdate, onDelete, onMoveUp, onMoveDown }: BlockToolbarProps) {
  const currentAlign = block.data.align || "left"

  const alignments = [
    { value: "left", icon: AlignLeft, label: "Căn trái" },
    { value: "center", icon: AlignCenter, label: "Căn giữa" },
    { value: "right", icon: AlignRight, label: "Căn phải" },
  ]

  // Thêm căn đều cho paragraph
  if (block.type === "paragraph") {
    alignments.push({ value: "justify", icon: AlignJustify, label: "Căn đều" })
  }

  return (
    <div className="absolute -top-12 left-0 bg-white border rounded-lg shadow-lg p-2 flex items-center gap-1 z-10">
      {/* Alignment */}
      {alignments.map(({ value, icon: Icon, label }) => (
        <Button
          key={value}
          variant={currentAlign === value ? "default" : "ghost"}
          size="sm"
          className="h-8 w-8 p-0"
          onClick={(e) => {
            e.stopPropagation()
            onUpdate({ align: value })
          }}
          title={label}
        >
          <Icon className="w-4 h-4" />
        </Button>
      ))}

      <div className="w-px h-6 bg-border mx-1" />

      {/* Move */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={(e) => {
          e.stopPropagation()
          onMoveUp()
        }}
        title="Di chuyển lên"
      >
        <ArrowUp className="w-4 h-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        onClick={(e) => {
          e.stopPropagation()
          onMoveDown()
        }}
        title="Di chuyển xuống"
      >
        <ArrowDown className="w-4 h-4" />
      </Button>

      <div className="w-px h-6 bg-border mx-1" />

      {/* Delete */}
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 text-destructive hover:text-destructive"
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        title="Xóa khối"
      >
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
