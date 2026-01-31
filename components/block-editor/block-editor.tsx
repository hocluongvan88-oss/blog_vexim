"use client"

import { useRef, useCallback } from "react"

import React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, GripVertical, Undo2, Redo2 } from "lucide-react"
import { BlockToolbar } from "./block-toolbar"
import { HeadingBlock } from "./blocks/heading-block"
import { ParagraphBlock } from "./blocks/paragraph-block"
import { ImageBlock } from "./blocks/image-block"
import { QuoteBlock } from "./blocks/quote-block"
import { TableBlock } from "./blocks/table-block"
import type { Block, BlockType } from "./types"

interface BlockEditorProps {
  value: Block[]
  onChange: (blocks: Block[]) => void
}

// Maximum history size
const MAX_HISTORY_SIZE = 50

export function BlockEditor({ value, onChange }: BlockEditorProps) {
  // Always ensure at least one block exists - use static ID to avoid hydration mismatch
  const initialBlocks = value && value.length > 0 ? value : [{
    id: "block_initial_default",
    type: "paragraph" as BlockType,
    data: { text: "", align: "justify" },
  }]
  
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null)
  const [showBlockMenu, setShowBlockMenu] = useState(false)
  const [insertPosition, setInsertPosition] = useState<number>(0)
  const blockCounterRef = useRef(0)
  
  // Undo/Redo history
  const [history, setHistory] = useState<Block[][]>([initialBlocks])
  const [historyIndex, setHistoryIndex] = useState(0)
  const isUndoRedoRef = useRef(false)
  
  // Save to history with debounce
  const saveToHistory = useCallback((newBlocks: Block[]) => {
    if (isUndoRedoRef.current) {
      isUndoRedoRef.current = false
      return
    }
    
    setHistory(prev => {
      // Remove any future history if we're not at the end
      const newHistory = prev.slice(0, historyIndex + 1)
      // Add new state
      newHistory.push(JSON.parse(JSON.stringify(newBlocks)))
      // Limit history size
      if (newHistory.length > MAX_HISTORY_SIZE) {
        newHistory.shift()
        return newHistory
      }
      return newHistory
    })
    setHistoryIndex(prev => Math.min(prev + 1, MAX_HISTORY_SIZE - 1))
  }, [historyIndex])
  
  // Undo function
  const undo = useCallback(() => {
    if (historyIndex > 0) {
      isUndoRedoRef.current = true
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const previousState = JSON.parse(JSON.stringify(history[newIndex]))
      setBlocks(previousState)
    }
  }, [history, historyIndex])
  
  // Redo function
  const redo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      isUndoRedoRef.current = true
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const nextState = JSON.parse(JSON.stringify(history[newIndex]))
      setBlocks(nextState)
    }
  }, [history, historyIndex])
  
  // Handle keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault()
        if (e.shiftKey) {
          redo()
        } else {
          undo()
        }
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault()
        redo()
      }
    }
    
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [undo, redo])

  // Sync blocks to parent and save to history
  useEffect(() => {
    onChange(blocks)
    // Debounce history save to avoid too many entries
    const timeoutId = setTimeout(() => {
      saveToHistory(blocks)
    }, 500)
    return () => clearTimeout(timeoutId)
  }, [blocks, onChange, saveToHistory])

  const addBlock = (type: BlockType, position: number) => {
    blockCounterRef.current += 1
    const newBlock: Block = {
      id: `block_${blockCounterRef.current}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      data: getDefaultBlockData(type),
    }

    const newBlocks = [...blocks]
    newBlocks.splice(position, 0, newBlock)
    setBlocks(newBlocks)
    setShowBlockMenu(false)
    setSelectedBlockId(newBlock.id)

    // Focus the new block after it's rendered
    setTimeout(() => {
      const newBlockElement = document.querySelector(`[data-block-id="${newBlock.id}"] [contenteditable]`) as HTMLElement
      if (newBlockElement) {
        newBlockElement.focus()
      }
    }, 50)
  }

  const getDefaultBlockData = (type: BlockType): any => {
    switch (type) {
      case "heading":
        return { level: 2, text: "", align: "left" }
      case "paragraph":
        return { text: "", align: "justify" }
      case "image":
        return { url: "", caption: "", align: "center", width: "100%" }
      case "quote":
        return { text: "", author: "", align: "left" }
      case "table":
        return { rows: 2, cols: 2, content: [["", ""], ["", ""]], align: "left" }
      default:
        return {}
    }
  }

  const updateBlock = (id: string, data: any) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, data: { ...block.data, ...data } } : block)))
  }

  const convertBlockType = (id: string, newType: BlockType, newData: any) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, type: newType, data: newData } : block)))
  }

  const deleteBlock = (id: string) => {
    // Prevent deleting the last block - instead clear its content
    if (blocks.length === 1) {
      updateBlock(id, { text: "" })
      // Focus the block
      setTimeout(() => {
        const blockElement = document.querySelector(`[data-block-id="${id}"] [contenteditable]`) as HTMLElement
        if (blockElement) {
          blockElement.focus()
        }
      }, 50)
      return
    }
    
    // Find the index to focus next
    const index = blocks.findIndex((block) => block.id === id)
    const filtered = blocks.filter((block) => block.id !== id)
    setBlocks(filtered)
    setSelectedBlockId(null)
    
    // Focus the previous block if possible, otherwise the next one
    setTimeout(() => {
      const targetIndex = Math.max(0, index - 1)
      const targetBlock = filtered[targetIndex]
      if (targetBlock) {
        const blockElement = document.querySelector(`[data-block-id="${targetBlock.id}"] [contenteditable]`) as HTMLElement
        if (blockElement) {
          blockElement.focus()
        }
      }
    }, 50)
  }

  const moveBlock = (id: string, direction: "up" | "down") => {
    const index = blocks.findIndex((block) => block.id === id)
    if (index === -1) return

    const newIndex = direction === "up" ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= blocks.length) return

    const newBlocks = [...blocks]
    const [movedBlock] = newBlocks.splice(index, 1)
    newBlocks.splice(newIndex, 0, movedBlock)
    setBlocks(newBlocks)
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
    const draggedBlockId = e.dataTransfer.getData("text/plain")
    const draggedIndex = blocks.findIndex((b) => b.id === draggedBlockId)
    
    if (draggedIndex === -1 || draggedIndex === targetIndex) return

    const newBlocks = [...blocks]
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1)
    newBlocks.splice(targetIndex, 0, draggedBlock)
    setBlocks(newBlocks)
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
          <div
            draggable
            onDragStart={(e) => handleDragStart(e, block.id)}
            className="cursor-grab active:cursor-grabbing"
          >
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 cursor-grab"
              onMouseDown={(e) => e.stopPropagation()}
            >
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
              onPasteSplit={(lines) => {
                // Update current block with first line
                updateBlock(block.id, { text: lines[0] })
                
                // Create and populate new blocks for remaining lines
                const newBlocks = [...blocks]
                lines.slice(1).forEach((line, i) => {
                  blockCounterRef.current += 1
                  const newBlock: Block = {
                    id: `block_${blockCounterRef.current}_paste`,
                    type: "paragraph",
                    data: { text: line, align: "justify" },
                  }
                  newBlocks.splice(index + 1 + i, 0, newBlock)
                })
                setBlocks(newBlocks)
              }}
            />
          )}
          {block.type === "image" && <ImageBlock data={block.data} onChange={(data) => updateBlock(block.id, data)} />}
          {block.type === "quote" && <QuoteBlock data={block.data} onChange={(data) => updateBlock(block.id, data)} />}
          {block.type === "table" && <TableBlock data={block.data} onChange={(data) => updateBlock(block.id, data)} />}
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

  const canUndo = historyIndex > 0
  const canRedo = historyIndex < history.length - 1

  return (
    <div className="border rounded-lg bg-white min-h-[600px]" onClick={() => setSelectedBlockId(null)}>
      {/* Undo/Redo Toolbar */}
      <div className="flex items-center gap-2 p-2 border-b bg-muted/30">
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            undo()
          }}
          disabled={!canUndo}
          title="Hoàn tác (Ctrl+Z)"
          className="h-8 px-2"
        >
          <Undo2 className="w-4 h-4 mr-1" />
          <span className="text-xs">Hoàn tác</span>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={(e) => {
            e.stopPropagation()
            redo()
          }}
          disabled={!canRedo}
          title="Làm lại (Ctrl+Shift+Z hoặc Ctrl+Y)"
          className="h-8 px-2"
        >
          <Redo2 className="w-4 h-4 mr-1" />
          <span className="text-xs">Làm lại</span>
        </Button>
        <span className="text-xs text-muted-foreground ml-2">
          {historyIndex + 1} / {history.length}
        </span>
      </div>
      
      {/* Blocks - Always render since we always have at least one block */}
      <div className="p-6 space-y-4 pl-10">{blocks.map((block, index) => renderBlock(block, index))}</div>

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
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
