"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlignLeft, AlignCenter, AlignRight, AlignJustify, Trash2, ArrowUp, ArrowDown } from "lucide-react"
import type { Block } from "./types"

interface BlockToolbarProps {
  block: Block
  onUpdate: (data: any) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  onConvertType?: (newType: Block["type"], newData: any) => void
}

export function BlockToolbar({ block, onUpdate, onDelete, onMoveUp, onMoveDown, onConvertType }: BlockToolbarProps) {
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

  const handleTypeChange = (newType: string) => {
    if (!onConvertType) return
    
    const text = block.data.text || ""
    
    if (newType === "paragraph") {
      onConvertType("paragraph", { text, align: "justify" })
    } else if (newType === "heading-2") {
      onConvertType("heading", { level: 2, text, align: "left" })
    } else if (newType === "heading-3") {
      onConvertType("heading", { level: 3, text, align: "left" })
    }
  }

  const getCurrentType = () => {
    if (block.type === "paragraph") return "paragraph"
    if (block.type === "heading" && block.data.level === 2) return "heading-2"
    if (block.type === "heading" && block.data.level === 3) return "heading-3"
    return "paragraph"
  }

  return (
    <div className="absolute -top-12 left-0 bg-white border rounded-lg shadow-lg p-2 flex items-center gap-1 z-10">
      {/* Block Type Converter */}
      {(block.type === "paragraph" || block.type === "heading") && onConvertType && (
        <>
          <Select value={getCurrentType()} onValueChange={handleTypeChange}>
            <SelectTrigger className="h-8 w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Đoạn văn</SelectItem>
              <SelectItem value="heading-2">Tiêu đề H2</SelectItem>
              <SelectItem value="heading-3">Tiêu đề H3</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="w-px h-6 bg-border mx-1" />
        </>
      )}
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
