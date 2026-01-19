"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, LinkIcon, Heading2, Heading3, List, ListOrdered, AlignLeft, AlignCenter, AlignRight } from "lucide-react"
import { ImageInsertDialog } from "./image-insert-dialog"

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

  const insertImageHTML = (html: string) => {
    console.log("[v0] Inserting image HTML:", html)
    if (editorRef.current) {
      // Focus the editor first
      editorRef.current.focus()
      
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        
        // Create a temporary div to parse the HTML
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = html
        
        // Insert the content
        const fragment = document.createDocumentFragment()
        let node: Node | null
        while ((node = tempDiv.firstChild)) {
          fragment.appendChild(node)
        }
        
        range.deleteContents()
        range.insertNode(fragment)
        
        // Move cursor after inserted content
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)
        
        // Add a line break after the image
        const br = document.createElement("br")
        range.insertNode(br)
        range.setStartAfter(br)
        range.collapse(true)
        selection.removeAllRanges()
        selection.addRange(range)
      } else {
        // If no selection, append to the end
        const tempDiv = document.createElement("div")
        tempDiv.innerHTML = html
        editorRef.current.appendChild(tempDiv.firstChild!)
        const br = document.createElement("br")
        editorRef.current.appendChild(br)
      }
      
      // Trigger the onChange event
      handleInput()
      console.log("[v0] Image inserted successfully")
    } else {
      console.error("[v0] Editor ref is null")
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
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            executeCommand("justifyLeft")
            handleInput()
          }}
          title="Căn trái"
        >
          <AlignLeft className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            executeCommand("justifyCenter")
            handleInput()
          }}
          title="Căn giữa"
        >
          <AlignCenter className="w-4 h-4" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => {
            executeCommand("justifyRight")
            handleInput()
          }}
          title="Căn phải"
        >
          <AlignRight className="w-4 h-4" />
        </Button>
        <div className="w-px bg-border mx-1" />
        <Button type="button" variant="ghost" size="sm" onClick={insertLink} title="Chèn liên kết">
          <LinkIcon className="w-4 h-4" />
        </Button>
        <ImageInsertDialog onInsert={insertImageHTML} />
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
