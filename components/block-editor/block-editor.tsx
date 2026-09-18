"use client"

import React from "react"
import { useCallback, useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical } from "lucide-react"
import { BlockToolbar } from "./block-toolbar"
import { HeadingBlock } from "./blocks/heading-block"
import { ParagraphBlock } from "./blocks/paragraph-block"
import { ImageBlock } from "./blocks/image-block"
import { QuoteBlock } from "./blocks/quote-block"
import { TableBlock } from "./blocks/table-block"
import { ListBlock } from "./blocks/list-block"
import { InlineToolbar } from "./inline-toolbar"
import type { Block, BlockType } from "./types"
import { generateBlockId, parsedBlocksToBlocks, type ParsedBlock } from "@/lib/content-parsers"

interface BlockEditorProps {
  value: Block[]
  onChange: (blocks: Block[]) => void
}

const HISTORY_LIMIT = 50
const TYPING_COALESCE_MS = 900

function createDefaultBlock(): Block {
  return {
    id: generateBlockId("block"),
    type: "paragraph",
    data: { text: "", align: "justify" },
  }
}

/** Editor luôn cần ít nhất 1 khối để hiển thị placeholder. */
function normalizeBlocks(value: Block[] | undefined | null): Block[] {
  return value && value.length > 0 ? value : [createDefaultBlock()]
}

function getDefaultBlockData(type: BlockType): Record<string, unknown> {
  switch (type) {
    case "heading":
      return { level: 2, text: "", align: "left" }
    case "paragraph":
      return { text: "", align: "justify" }
    case "image":
      return { url: "", alt: "", caption: "", align: "center", width: "100%" }
    case "quote":
      return { text: "", author: "", align: "left" }
    case "table":
      return { rows: 2, cols: 2, content: [["", ""], ["", ""]], hasHeader: true, align: "left" }
    case "list":
      return { style: "unordered", items: [""], align: "left" }
    default:
      return {}
  }
}

export function BlockEditor({ value, onChange }: BlockEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>(() => normalizeBlocks(value))
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showBlockMenu, setShowBlockMenu] = useState(false)
  const [insertPosition, setInsertPosition] = useState<number>(0)

  /** Nguồn dữ liệu thật của editor (tránh closure cũ trong các handler). */
  const blocksRef = useRef<Block[]>(blocks)
  const onChangeRef = useRef(onChange)

  // Undo/Redo — lưu bằng ref để không phải stringify lại toàn bộ blocks mỗi lần render
  const historyRef = useRef<Block[][]>([blocks])
  const historyIndexRef = useRef(0)
  const lastPushTimeRef = useRef(0)
  const coalesceKeyRef = useRef<string | null>(null)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  /** Thông báo cho component cha mỗi khi nội dung đổi (cha là nguồn dữ liệu khi lưu). */
  useEffect(() => {
    onChangeRef.current(blocks)
  }, [blocks])

  /**
   * Đồng bộ khi cha đổi `value` từ bên ngoài (Import HTML/Markdown, áp dụng gợi ý AI,
   * khôi phục bản nháp...). Bỏ qua khi `value` chính là mảng do editor vừa phát ra.
   */
  useEffect(() => {
    if (!value) return
    if (value === blocksRef.current) return
    if (JSON.stringify(value) === JSON.stringify(blocksRef.current)) return

    const next = normalizeBlocks(value)
    blocksRef.current = next
    setBlocks(next)

    // Ghi vào lịch sử để người dùng có thể undo thao tác import
    historyRef.current = [...historyRef.current.slice(0, historyIndexRef.current + 1), next].slice(-HISTORY_LIMIT)
    historyIndexRef.current = historyRef.current.length - 1
    coalesceKeyRef.current = null
  }, [value])

  const recordHistory = useCallback((next: Block[], coalesceKey?: string) => {
    const now = Date.now()
    const trimmed = historyRef.current.slice(0, historyIndexRef.current + 1)
    const last = trimmed[trimmed.length - 1]

    if (last && JSON.stringify(last) === JSON.stringify(next)) return

    // Gộp các thay đổi liên tiếp trên cùng một khối text thành 1 bước undo
    const canCoalesce =
      !!coalesceKey &&
      coalesceKeyRef.current === coalesceKey &&
      now - lastPushTimeRef.current < TYPING_COALESCE_MS &&
      trimmed.length > 1

    if (canCoalesce) {
      trimmed[trimmed.length - 1] = next
      historyRef.current = trimmed
      lastPushTimeRef.current = now
      return
    }

    coalesceKeyRef.current = coalesceKey ?? null
    lastPushTimeRef.current = now
    const appended = [...trimmed, next]
    historyRef.current = appended.length > HISTORY_LIMIT ? appended.slice(appended.length - HISTORY_LIMIT) : appended
    historyIndexRef.current = historyRef.current.length - 1
  }, [])

  /** Ghi nội dung mới + lịch sử (dùng cho mọi thao tác của người dùng). */
  const commit = useCallback(
    (next: Block[], coalesceKey?: string) => {
      blocksRef.current = next
      setBlocks(next)
      recordHistory(next, coalesceKey)
    },
    [recordHistory],
  )

  const applyHistoryState = useCallback((state: Block[]) => {
    blocksRef.current = state
    setBlocks(state)
    coalesceKeyRef.current = null
  }, [])

  const undo = useCallback(() => {
    if (historyIndexRef.current <= 0) return
    historyIndexRef.current -= 1
    const previous = historyRef.current[historyIndexRef.current]
    if (previous) applyHistoryState(previous)
  }, [applyHistoryState])

  const redo = useCallback(() => {
    if (historyIndexRef.current >= historyRef.current.length - 1) return
    historyIndexRef.current += 1
    const next = historyRef.current[historyIndexRef.current]
    if (next) applyHistoryState(next)
  }, [applyHistoryState])

  // Keyboard shortcuts: Ctrl+Z / Ctrl+Y / Ctrl+Shift+Z
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const withModifier = e.ctrlKey || e.metaKey
      if (!withModifier) return

      if (e.key === "z" && !e.shiftKey) {
        e.preventDefault()
        undo()
      } else if (e.key === "y" || (e.shiftKey && e.key.toLowerCase() === "z")) {
        e.preventDefault()
        redo()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [undo, redo])

  const focusBlockAfterRender = (blockId: string) => {
    setTimeout(() => {
      const element = document.querySelector(`[data-block-id="${blockId}"] [contenteditable]`) as HTMLElement | null
      element?.focus()
    }, 50)
  }

  const addBlock = (type: BlockType, position: number) => {
    const newBlock: Block = {
      id: generateBlockId("block"),
      type,
      data: getDefaultBlockData(type),
    }

    const newBlocks = [...blocksRef.current]
    newBlocks.splice(position, 0, newBlock)
    commit(newBlocks)
    setShowBlockMenu(false)
    setSelectedBlockId(newBlock.id)
    focusBlockAfterRender(newBlock.id)
  }

  const updateBlock = (id: string, data: Record<string, unknown>) => {
    const next = blocksRef.current.map((block) => (block.id === id ? { ...block, data: { ...block.data, ...data } } : block))
    const coalesceKey = typeof data.text === "string" ? `text:${id}` : undefined
    commit(next, coalesceKey)
  }

  const convertBlockType = (id: string, newType: BlockType, newData: Record<string, unknown>) => {
    commit(blocksRef.current.map((block) => (block.id === id ? { ...block, type: newType, data: newData } : block)))
  }

  const deleteBlock = (id: string) => {
    const current = blocksRef.current

    // Không xoá khối cuối cùng — chỉ xoá nội dung
    if (current.length === 1) {
      updateBlock(id, { text: "" })
      focusBlockAfterRender(id)
      return
    }

    const index = current.findIndex((block) => block.id === id)
    const filtered = current.filter((block) => block.id !== id)
    commit(filtered)
    setSelectedBlockId(null)

    const targetIndex = Math.max(0, index - 1)
    const targetBlock = filtered[targetIndex]
    if (targetBlock) focusBlockAfterRender(targetBlock.id)
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const current = blocksRef.current
    const index = current.findIndex((block) => block.id === id)
    if (index === -1) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= current.length) return

    const newBlocks = [...current]
    const [movedBlock] = newBlocks.splice(index, 1)
    newBlocks.splice(newIndex, 0, movedBlock)
    commit(newBlocks)
  }

  const reorderBlocks = (draggedId: string, targetIndex: number) => {
    const current = blocksRef.current
    const draggedIndex = current.findIndex((block) => block.id === draggedId)
    if (draggedIndex === -1 || draggedIndex === targetIndex) return

    const newBlocks = [...current]
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1)
    newBlocks.splice(targetIndex, 0, draggedBlock)
    commit(newBlocks)
  }

  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    e.dataTransfer.effectAllowed = "move"
    e.dataTransfer.setData("text/plain", blockId)
    setSelectedBlockId(blockId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
  }

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault()
    reorderBlocks(e.dataTransfer.getData("text/plain"), targetIndex)
  }

  /** Paste nhiều dòng text thuần -> mỗi dòng một khối đoạn văn. */
  const handlePasteSplit = (currentBlockId: string, index: number, lines: string[]) => {
    const current = blocksRef.current
    const newBlocks = [...current]

    newBlocks[index] = { ...newBlocks[index], data: { ...newBlocks[index].data, text: lines[0] } }

    lines.slice(1).forEach((line, i) => {
      newBlocks.splice(index + 1 + i, 0, {
        id: generateBlockId("block"),
        type: "paragraph",
        data: { text: line, align: "justify" },
      })
    })

    commit(newBlocks)
    void currentBlockId
  }

  /** Paste HTML/Markdown đã được parse thành nhiều khối -> thay khối hiện tại bằng các khối đó. */
  const handlePasteBlocks = (currentBlockId: string, parsed: ParsedBlock[]) => {
    const current = blocksRef.current
    const index = current.findIndex((block) => block.id === currentBlockId)
    if (index === -1) return

    const converted = parsedBlocksToBlocks(parsed)
    if (converted.length === 0) return

    const newBlocks = [...current]
    newBlocks.splice(index, 1, ...converted)
    commit(newBlocks)
    setSelectedBlockId(converted[0].id)
  }

  const renderBlock = (block: Block, index: number) => {
    const isSelected = selectedBlockId === block.id

    return (
      <div
        key={block.id}
        data-block-id={block.id}
        className={`group relative ${isSelected ? "ring-2 ring-primary rounded-lg" : ""}`}
        onClick={() => setSelectedBlockId(block.id)}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(e, index)}
      >
        {/* Block Controls */}
        <div className="absolute -left-10 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1">
          <div draggable onDragStart={(e) => handleDragStart(e, block.id)} className="cursor-grab active:cursor-grabbing">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 cursor-grab" onMouseDown={(e) => e.stopPropagation()}>
              <GripVertical className="w-4 h-4" />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
            onClick={(e) => {
              e.stopPropagation()
              setInsertPosition(index + 1)
              setShowBlockMenu(true)
            }}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>

        {/* Block Toolbar */}
        {isSelected && (
          <BlockToolbar
            block={block}
            onUpdate={(data) => updateBlock(block.id, data)}
            onDelete={() => deleteBlock(block.id)}
            onMoveUp={() => moveBlock(block.id, "up")}
            onMoveDown={() => moveBlock(block.id, "down")}
            onConvertType={(newType, newData) => convertBlockType(block.id, newType, newData)}
          />
        )}

        {/* Block Content */}
        <div className="py-2">
          {block.type === "heading" && (
            <HeadingBlock
              data={block.data}
              onChange={(data) => updateBlock(block.id, data)}
              onEnter={() => addBlock("paragraph", index + 1)}
              onBackspace={() => deleteBlock(block.id)}
            />
          )}
          {block.type === "paragraph" && (
            <ParagraphBlock
              data={block.data}
              onChange={(data) => updateBlock(block.id, data)}
              onEnter={() => addBlock("paragraph", index + 1)}
              onBackspace={() => deleteBlock(block.id)}
              onPasteSplit={(lines) => handlePasteSplit(block.id, index, lines)}
              onPasteBlocks={(parsedBlocks) => handlePasteBlocks(block.id, parsedBlocks)}
            />
          )}
          {block.type === "image" && <ImageBlock data={block.data} onChange={(data) => updateBlock(block.id, data)} />}
          {block.type === "quote" && <QuoteBlock data={block.data} onChange={(data) => updateBlock(block.id, data)} />}
          {block.type === "table" && <TableBlock data={block.data} onChange={(data) => updateBlock(block.id, data)} />}
          {block.type === "list" && (
            <ListBlock
              data={block.data}
              onChange={(data) => updateBlock(block.id, data)}
              onEnter={() => addBlock("paragraph", index + 1)}
              onBackspace={() => deleteBlock(block.id)}
            />
          )}
        </div>

        {/* Insert Block Button Below */}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity py-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              setInsertPosition(index + 1)
              setShowBlockMenu(true)
            }}
          >
            <Plus className="w-4 h-4 mr-2" />
            Thêm khối
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="block-editor-container border rounded-lg p-6 bg-white min-h-[600px]" onClick={() => setSelectedBlockId(null)}>
      {/* Blocks - Always render since we always have at least one block */}
      <div className="space-y-4 pl-10">{blocks.map((block, index) => renderBlock(block, index))}</div>

      {/* Block Menu */}
      {showBlockMenu && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowBlockMenu(false)}>
          <div className="bg-white rounded-lg p-6 w-[500px]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold mb-4">Chọn loại khối</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-20 flex-col bg-transparent" onClick={() => addBlock("heading", insertPosition)}>
                <span className="text-2xl font-bold mb-1">H</span>
                <span className="text-xs">Tiêu đề</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent" onClick={() => addBlock("paragraph", insertPosition)}>
                <span className="text-lg mb-1">¶</span>
                <span className="text-xs">Đoạn văn</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent" onClick={() => addBlock("image", insertPosition)}>
                <span className="text-lg mb-1">🖼️</span>
                <span className="text-xs">Hình ảnh</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent" onClick={() => addBlock("quote", insertPosition)}>
                <span className="text-lg mb-1">"</span>
                <span className="text-xs">Trích dẫn</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent" onClick={() => addBlock("table", insertPosition)}>
                <span className="text-lg mb-1">⊞</span>
                <span className="text-xs">Bảng</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent" onClick={() => addBlock("list", insertPosition)}>
                <span className="text-lg mb-1">≡</span>
                <span className="text-xs">Danh sách</span>
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Inline Formatting Toolbar */}
      <InlineToolbar onFormat={(command, value) => document.execCommand(command, false, value)} />
    </div>
  )
}
