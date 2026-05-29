"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Minus, ClipboardPaste, Table2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import type { TableData } from "../types"

interface TableBlockProps {
  data: TableData
  onChange: (data: Partial<TableData>) => void
}

// Auto-resizing textarea cell - text wraps and cell grows vertically
function CellTextarea({
  value,
  onChange,
  align,
  isHeader,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  align: string
  isHeader?: boolean
  placeholder: string
}) {
  const ref = useRef<HTMLTextAreaElement>(null)

  // Auto-grow height to fit content
  useEffect(() => {
    const el = ref.current
    if (el) {
      el.style.height = "auto"
      el.style.height = `${el.scrollHeight}px`
    }
  }, [value])

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      rows={1}
      className={`${align} w-full outline-none bg-transparent resize-none overflow-hidden leading-relaxed ${
        isHeader ? "font-semibold" : ""
      }`}
      placeholder={placeholder}
    />
  )
}

export function TableBlock({ data, onChange }: TableBlockProps) {
  const { rows = 2, cols = 2, content = [["", ""], ["", ""]], hasHeader = true, align = "left" } = data
  const [showPasteDialog, setShowPasteDialog] = useState(false)
  const [pasteText, setPasteText] = useState("")

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

  // Parse pasted content from Excel/Word/Google Sheets
  const handlePaste = () => {
    if (!pasteText.trim()) return
    
    const lines = pasteText.trim().split("\n")
    const parsedContent = lines.map(line => {
      // Split by tab (Excel/Sheets) or multiple spaces
      const cells = line.split(/\t|(?:  +)/)
      return cells.map(cell => cell.trim())
    })
    
    // Find max columns
    const maxCols = Math.max(...parsedContent.map(row => row.length))
    
    // Normalize rows to have same number of columns
    const normalizedContent = parsedContent.map(row => {
      while (row.length < maxCols) {
        row.push("")
      }
      return row
    })
    
    onChange({
      rows: normalizedContent.length,
      cols: maxCols,
      content: normalizedContent,
      hasHeader: true,
    })
    
    setShowPasteDialog(false)
    setPasteText("")
  }

  // Handle direct paste on table
  const handleTablePaste = async (e: React.ClipboardEvent) => {
    const text = e.clipboardData.getData("text")
    if (text.includes("\t") || text.includes("\n")) {
      e.preventDefault()
      setPasteText(text)
      handlePasteFromText(text)
    }
  }

  const handlePasteFromText = (text: string) => {
    const lines = text.trim().split("\n")
    const parsedContent = lines.map(line => {
      const cells = line.split(/\t|(?:  +)/)
      return cells.map(cell => cell.trim())
    })
    
    const maxCols = Math.max(...parsedContent.map(row => row.length))
    const normalizedContent = parsedContent.map(row => {
      while (row.length < maxCols) {
        row.push("")
      }
      return row
    })
    
    onChange({
      rows: normalizedContent.length,
      cols: maxCols,
      content: normalizedContent,
      hasHeader: true,
    })
  }

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
  }[align]

  return (
    <div className="space-y-3" onPaste={handleTablePaste}>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={addRow}>
          <Plus className="w-3 h-3 mr-1" />
          Hàng
        </Button>
        <Button variant="outline" size="sm" onClick={removeRow} disabled={rows <= 1}>
          <Minus className="w-3 h-3 mr-1" />
          Hàng
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button variant="outline" size="sm" onClick={addCol}>
          <Plus className="w-3 h-3 mr-1" />
          Cột
        </Button>
        <Button variant="outline" size="sm" onClick={removeCol} disabled={cols <= 1}>
          <Minus className="w-3 h-3 mr-1" />
          Cột
        </Button>
        <div className="w-px h-6 bg-border mx-1" />
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowPasteDialog(!showPasteDialog)}
          title="Dán bảng từ Excel, Word, Google Sheets"
        >
          <ClipboardPaste className="w-3 h-3 mr-1" />
          Dán bảng
        </Button>
      </div>

      {/* Header option */}
      <div className="flex items-center gap-2">
        <Checkbox
          id="hasHeader"
          checked={hasHeader}
          onCheckedChange={(checked) => onChange({ hasHeader: checked as boolean })}
        />
        <Label htmlFor="hasHeader" className="text-sm cursor-pointer">
          Hàng đầu tiên là tiêu đề (Header row - tốt cho SEO và accessibility)
        </Label>
      </div>

      {/* Paste dialog */}
      {showPasteDialog && (
        <div className="p-3 border rounded-lg bg-muted/30 space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Table2 className="w-4 h-4" />
            <span>Dán bảng từ Excel, Word hoặc Google Sheets</span>
          </div>
          <Textarea
            placeholder="Copy bảng từ Excel/Word/Sheets rồi dán vào đây..."
            value={pasteText}
            onChange={(e) => setPasteText(e.target.value)}
            rows={4}
            className="font-mono text-sm"
          />
          <div className="flex gap-2">
            <Button size="sm" onClick={handlePaste} disabled={!pasteText.trim()}>
              Áp dụng
            </Button>
            <Button size="sm" variant="outline" onClick={() => {
              setShowPasteDialog(false)
              setPasteText("")
            }}>
              Hủy
            </Button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg">
        <table className="border-collapse w-full table-fixed">
          {hasHeader && content.length > 0 && (
            <thead>
              <tr>
                {content[0].map((cell, colIndex) => (
                  <th 
                    key={colIndex} 
                    className="border-b border-r last:border-r-0 p-2 bg-secondary align-top"
                    scope="col"
                  >
                    <CellTextarea
                      value={cell}
                      onChange={(value) => updateCell(0, colIndex, value)}
                      align={alignClass}
                      isHeader
                      placeholder="Tiêu đề cột"
                    />
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {content.slice(hasHeader ? 1 : 0).map((row, rowIndex) => {
              const actualRowIndex = hasHeader ? rowIndex + 1 : rowIndex
              return (
                <tr key={actualRowIndex} className="hover:bg-muted/30">
                  {row.map((cell, colIndex) => (
                    <td 
                      key={colIndex} 
                      className="border-b border-r last:border-r-0 last:border-b-0 p-2 align-top"
                    >
                      <CellTextarea
                        value={cell}
                        onChange={(value) => updateCell(actualRowIndex, colIndex, value)}
                        align={alignClass}
                        placeholder="Nội dung"
                      />
                    </td>
                  ))}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Tips */}
      <p className="text-xs text-muted-foreground">
        Mẹo: Bạn có thể copy bảng từ Excel/Word/Sheets rồi Ctrl+V trực tiếp vào bảng này
      </p>
    </div>
  )
}
