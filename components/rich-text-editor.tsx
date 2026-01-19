"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, LinkIcon, ImageIcon, Heading2, Heading3, List, ListOrdered } from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize contentEditable with HTML content
  useEffect(() => {
    if (editorRef.current && !isInitialized && value) {
      editorRef.current.innerHTML = value
      setIsInitialized(true)
    }
  }, [value, isInitialized])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const executeCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
  }

  const insertHeading = (level: number) => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const heading = document.createElement(`h${level}`)
      heading.textContent = selection.toString() || `Tiêu đề ${level}`
      range.deleteContents()
      range.insertNode(heading)
      selection.collapseToEnd()
    }
    handleInput()
  }

  const insertLink = () => {
    const url = prompt("Nhập URL:")
    if (url) {
      executeCommand("createLink", url)
      handleInput()
    }
  }

  const insertImage = () => {
    const url = prompt("Nhập URL hình ảnh:")
    if (url) {
      executeCommand("insertImage", url)
      handleInput()
    }
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 bg-secondary/30 border-b">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            executeCommand("bold")
            handleInput()
          }}
          title="In đậm (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            executeCommand("italic")
            handleInput()
          }}
          title="In nghiêng (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <div className="w-px bg-border mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={() => insertHeading(2)} title="Tiêu đề H2">
          <Heading2 className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={() => insertHeading(3)} title="Tiêu đề H3">
          <Heading3 className="w-4 h-4" />
        </Button>
        <div className="w-px bg-border mx-1" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            executeCommand("insertUnorderedList")
            handleInput()
          }}
          title="Danh sách dấu đầu dòng"
        >
          <List className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            executeCommand("insertOrderedList")
            handleInput()
          }}
          title="Danh sách đánh số"
        >
          <ListOrdered className="w-4 h-4" />
        </Button>
        <div className="w-px bg-border mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={insertLink} title="Chèn liên kết">
          <LinkIcon className="w-4 h-4" />
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={insertImage} title="Chèn hình ảnh">
          <ImageIcon className="w-4 h-4" />
        </Button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="min-h-[400px] p-4 focus:outline-none w-full"
        style={{
          // Custom styles for the editor
          lineHeight: "1.6",
          maxWidth: "100%",
        }}
        suppressContentEditableWarning
        data-placeholder={placeholder}
      >
        {!value && <p className="text-muted-foreground">{placeholder}</p>}
      </div>
    </div>
  )
}
