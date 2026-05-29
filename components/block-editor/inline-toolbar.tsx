"use client"

import React, { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bold, Italic, Underline, Link, Code, Unlink, ExternalLink } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"

interface LinkOptions {
  url: string
  openInNewTab: boolean
  noFollow: boolean
}

interface InlineToolbarProps {
  onFormat: (command: string, value?: string) => void
}

export function InlineToolbar({ onFormat }: InlineToolbarProps) {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null)
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkOptions, setLinkOptions] = useState<LinkOptions>({
    url: "",
    openInNewTab: false,
    noFollow: false,
  })
  const [hasExistingLink, setHasExistingLink] = useState(false)
  const [isExternalLink, setIsExternalLink] = useState(false)
  const toolbarRef = useRef<HTMLDivElement>(null)
  const savedRangeRef = useRef<Range | null>(null)

  // Detect if URL is external
  const checkIfExternal = (url: string) => {
    if (!url) return false
    try {
      const urlObj = new URL(url, window.location.origin)
      return urlObj.hostname !== window.location.hostname
    } catch {
      return false
    }
  }

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

      // Get the element containing the selection
      let anchorElement: HTMLElement | null = null
      if (selection.anchorNode) {
        if (selection.anchorNode.nodeType === Node.TEXT_NODE) {
          anchorElement = selection.anchorNode.parentElement
        } else {
          anchorElement = selection.anchorNode as HTMLElement
        }
      }

      if (!anchorElement) {
        setPosition(null)
        return
      }

      // Check if selection is within a contenteditable element or within the block editor
      const contentEditableParent = anchorElement.closest('[contenteditable="true"]')
      const blockEditorParent = anchorElement.closest('.block-editor-container')
      
      const isInContentEditable = contentEditableParent !== null || blockEditorParent !== null

      if (!isInContentEditable) {
        setPosition(null)
        return
      }

      // Only show if rect has valid dimensions
      if (rect.width === 0 || rect.height === 0) {
        setPosition(null)
        return
      }

      // Position toolbar above the selection.
      // Toolbar uses position: fixed, so coordinates must be viewport-relative
      // (do NOT add window.scrollY/scrollX or it goes off-screen when scrolled).
      setPosition({
        top: rect.top - 45,
        left: rect.left + rect.width / 2,
      })
    }

    document.addEventListener("selectionchange", handleSelectionChange)
    document.addEventListener("mouseup", handleSelectionChange)
    document.addEventListener("keyup", handleSelectionChange)
    
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange)
      document.removeEventListener("mouseup", handleSelectionChange)
      document.removeEventListener("keyup", handleSelectionChange)
    }
  }, [])

  const handleFormat = (command: string) => {
    onFormat(command)
    setTimeout(() => {
      const selection = window.getSelection()
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        setPosition({
          top: rect.top - 45,
          left: rect.left + rect.width / 2,
        })
      }
    }, 10)
  }

  const handleLinkClick = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      savedRangeRef.current = range.cloneRange()
      
      const commonAncestor = range.commonAncestorContainer
      let linkElement: HTMLAnchorElement | null = null

      if (commonAncestor.nodeType === Node.ELEMENT_NODE) {
        linkElement = (commonAncestor as HTMLElement).closest("a")
      } else if (commonAncestor.parentElement) {
        linkElement = commonAncestor.parentElement.closest("a")
      }

      if (linkElement) {
        const href = linkElement.href
        const isExternal = checkIfExternal(href)
        setLinkOptions({
          url: href,
          openInNewTab: linkElement.target === "_blank",
          noFollow: linkElement.rel?.includes("nofollow") || false,
        })
        setIsExternalLink(isExternal)
        setHasExistingLink(true)
      } else {
        setLinkOptions({
          url: "",
          openInNewTab: false,
          noFollow: false,
        })
        setIsExternalLink(false)
        setHasExistingLink(false)
      }
    }
    setShowLinkInput(true)
  }

  const handleUrlChange = (url: string) => {
    const isExternal = checkIfExternal(url)
    setIsExternalLink(isExternal)
    
    // Auto-set options for external links
    if (isExternal) {
      setLinkOptions(prev => ({
        ...prev,
        url,
        openInNewTab: true,
        noFollow: prev.noFollow, // Keep noFollow as user set
      }))
    } else {
      setLinkOptions(prev => ({
        ...prev,
        url,
        openInNewTab: false,
        noFollow: false,
      }))
    }
  }

  const handleLinkSubmit = () => {
    if (linkOptions.url && savedRangeRef.current) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(savedRangeRef.current)
        
        // Create link
        document.execCommand("createLink", false, linkOptions.url)
        
        // Find the newly created link and add attributes
        const newSelection = window.getSelection()
        if (newSelection && newSelection.rangeCount > 0) {
          const range = newSelection.getRangeAt(0)
          let linkElement: HTMLAnchorElement | null = null
          
          const ancestor = range.commonAncestorContainer
          if (ancestor.nodeType === Node.ELEMENT_NODE) {
            linkElement = (ancestor as HTMLElement).closest("a")
          } else if (ancestor.parentElement) {
            linkElement = ancestor.parentElement.closest("a")
          }
          
          if (linkElement) {
            // Set target
            if (linkOptions.openInNewTab) {
              linkElement.target = "_blank"
            } else {
              linkElement.removeAttribute("target")
            }
            
            // Set rel attributes
            const relParts: string[] = []
            if (linkOptions.openInNewTab) {
              relParts.push("noopener", "noreferrer")
            }
            if (linkOptions.noFollow) {
              relParts.push("nofollow")
            }
            
            if (relParts.length > 0) {
              linkElement.rel = relParts.join(" ")
            } else {
              linkElement.removeAttribute("rel")
            }
          }
        }
        
        savedRangeRef.current = null
      }
    }
    resetLinkState()
  }

  const handleRemoveLink = () => {
    if (savedRangeRef.current) {
      const selection = window.getSelection()
      if (selection) {
        selection.removeAllRanges()
        selection.addRange(savedRangeRef.current)
        document.execCommand("unlink", false)
        savedRangeRef.current = null
      }
    }
    resetLinkState()
  }

  const resetLinkState = () => {
    setShowLinkInput(false)
    setLinkOptions({ url: "", openInNewTab: false, noFollow: false })
    setHasExistingLink(false)
    setIsExternalLink(false)
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
        <div className="flex flex-col gap-2 p-2 min-w-[280px]">
          {/* URL Input */}
          <div className="flex items-center gap-2">
            <Input
              type="url"
              placeholder="https://..."
              value={linkOptions.url}
              onChange={(e) => handleUrlChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleLinkSubmit()
                } else if (e.key === "Escape") {
                  resetLinkState()
                }
              }}
              className="h-8 text-sm flex-1"
              autoFocus
            />
            {isExternalLink && (
              <ExternalLink className="w-4 h-4 text-blue-500" title="External link" />
            )}
          </div>
          
          {/* SEO Options */}
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <Checkbox
                id="newTab"
                checked={linkOptions.openInNewTab}
                onCheckedChange={(checked) => 
                  setLinkOptions(prev => ({ ...prev, openInNewTab: checked as boolean }))
                }
              />
              <Label htmlFor="newTab" className="text-xs cursor-pointer">
                Mở tab mới
              </Label>
            </div>
            
            <div className="flex items-center gap-1.5">
              <Checkbox
                id="noFollow"
                checked={linkOptions.noFollow}
                onCheckedChange={(checked) => 
                  setLinkOptions(prev => ({ ...prev, noFollow: checked as boolean }))
                }
              />
              <Label htmlFor="noFollow" className="text-xs cursor-pointer" title="Không truyền SEO juice cho link này">
                NoFollow
              </Label>
            </div>
          </div>
          
          {/* Helper text */}
          {isExternalLink && (
            <p className="text-xs text-muted-foreground">
              Link ngoài: Tự động mở tab mới với rel=&quot;noopener noreferrer&quot;
            </p>
          )}
          
          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 flex-1" onClick={handleLinkSubmit}>
              {hasExistingLink ? "Cập nhật" : "Thêm link"}
            </Button>
            {hasExistingLink && (
              <Button 
                size="sm" 
                variant="destructive" 
                className="h-7" 
                onClick={handleRemoveLink}
                title="Xóa link"
              >
                <Unlink className="w-3 h-3 mr-1" />
                Xóa
              </Button>
            )}
            <Button 
              size="sm" 
              variant="outline" 
              className="h-7" 
              onClick={resetLinkState}
            >
              Hủy
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
