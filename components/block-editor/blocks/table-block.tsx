"use client"

import { Button } from "@/components/ui/button"
import { Plus, Minus } from "lucide-react"
import type { TableData } from "../types"

interface TableBlockProps {
  data: TableData
  onChange: (data: Partial<TableData>) => void
}

export function TableBlock({ data, onChange }: TableBlockProps) {
  const { rows = 2, cols = 2, content = [["", ""]], align = "left" } = data

  const addRow = () => {
    const newContent = [...content, new Array(cols).fill("")]
    onChange({ rows: rows + 1, content: newContent })
  }

  const addCol = () => {
    const newContent = content.map((row) => [...row, ""])
    onChange({ cols: cols + 1, content: newContent })
  }

  const removeRow = () => {
    if (rows <= 1) return
    const newContent = content.slice(0, -1)
    onChange({ rows: rows - 1, content: newContent })
  }

  const removeCol = () => {
    if (cols <= 1) return
    const newContent = content.map((row) => row.slice(0, -1))
    onChange({ cols: cols - 1, content: newContent })
  }

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newContent = content.map((row, rIdx) =>
      rIdx === rowIndex ? row.map((cell, cIdx) => (cIdx === colIndex ? value : cell)) : row
    )
    onChange({ content: newContent })
  }

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align]

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus className="w-3 h-3 mr-1" />
          Thêm hàng
        </Button>
        <Button variant="outline" size="sm" onClick={removeRow} disabled={rows <= 1}>
          <Minus className="w-3 h-3 mr-1" />
          Xóa hàng
        </Button>
        <Button variant="outline" size="sm" onClick={addCol}>
          <Plus className="w-3 h-3 mr-1" />
          Thêm cột
        </Button>
        <Button variant="outline" size="sm" onClick={removeCol} disabled={cols <= 1}>
          <Minus className="w-3 h-3 mr-1" />
          Xóa cột
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="border-collapse w-full border">
          <tbody>
            {content.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} className="border p-2">
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                      className={`${alignClass} w-full outline-none bg-transparent`}
                      placeholder={rowIndex === 0 ? "Tiêu đề" : "Nội dung"}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
