"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, Link, Code } from "lucide-react"
import { Input } from "@/components/ui/input"

interface InlineToolbarProps {
  onFormat: (command: string, value?: string) => void
}

export function InlineToolbar({ onFormat }: InlineToolbarProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const toolbarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection()
      if (!selection || selection.isCollapsed || selection.rangeCount === 0) {
        setPosition(null)
        setShowLinkInput(false)
        return
      }

      const range = selection.getRangeAt(0)
      const rect = range.getBoundingClientRect()

      // Check if selection is within a contenteditable element
      let node = selection.anchorNode
      let isInContentEditable = false
      while (node) {
        if ((node as HTMLElement).contentEditable === "true") {
          isInContentEditable = true
          break
        }
        node = node.parentNode
      }

      if (!isInContentEditable) {
        setPosition(null)
        return
      }

      // Position toolbar above the selection
      setPosition({
        top: rect.top + window.scrollY - 45,
        left: rect.left + window.scrollX + rect.width / 2,
      })
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
    }
  }, [])

  const handleFormat = (command: string) => {
    onFormat(command)
    // Keep selection after formatting
    setTimeout(() => {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setPosition({
          top: rect.top + window.scrollY - 45,
          left: rect.left + window.scrollX + rect.width / 2,
        })
      }
    }, 10)
  }

  const handleLinkClick = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      // Check if selection already has a link
      const range = selection.getRangeAt(0)
      const commonAncestor = range.commonAncestorContainer
      let linkElement: HTMLAnchorElement | null = null

      if (commonAncestor.nodeType === Node.ELEMENT_NODE) {
        linkElement = (commonAncestor as HTMLElement).closest("a")
      } else if (commonAncestor.parentElement) {
        linkElement = commonAncestor.parentElement.closest("a")
      }

      if (linkElement) {
        setLinkUrl(linkElement.href)
      } else {
        setLinkUrl("")
      }
    }
    setShowLinkInput(true)
  }

  const handleLinkSubmit = () => {
    if (linkUrl) {
      onFormat("createLink", linkUrl)
    }
    setShowLinkInput(false)
    setLinkUrl("")
  }

  if (!position) return null

  return (
    <div
      ref={toolbarRef}
      className="fixed z-50 bg-popover border rounded-md shadow-lg p-1 flex items-center gap-1 animate-in fade-in-0 zoom-in-95"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
      }}
      onMouseDown={(e) => e.preventDefault()}
    >
      {!showLinkInput ? (
        <>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => handleFormat("bold")}
            title="Bold (Ctrl+B)"
          >
            <Bold className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => handleFormat("italic")}
            title="Italic (Ctrl+I)"
          >
            <Italic className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => handleFormat("underline")}
            title="Underline (Ctrl+U)"
          >
            <Underline className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={() => handleFormat("code")}
            title="Code"
          >
            <Code className="w-4 h-4" />
          </Button>
          <div className="w-px h-6 bg-border mx-1" />
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 bg-transparent"
            onClick={handleLinkClick}
            title="Add Link"
          >
            <Link className="w-4 h-4" />
          </Button>
        </>
      ) : (
        <div className="flex items-center gap-2 px-2">
          <Input
            type="url"
            placeholder="https://..."
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault()
                handleLinkSubmit()
              } else if (e.key === "Escape") {
                setShowLinkInput(false)
                setLinkUrl("")
              }
            }}
            className="h-7 text-sm w-48"
            autoFocus
          />
          <Button size="sm" className="h-7" onClick={handleLinkSubmit}>
            OK
          </Button>
        </div>
      )}
    </div>
  )
}
