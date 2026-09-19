"use client"

import React from "react"
import { useEffect, useRef } from "react"
import type { ParagraphData } from "../types"
import {
  cleanInlineHtml,
  looksLikeMarkdown,
  parseHtmlToParsedBlocks,
  parseMarkdownToBlocks,
  type ParsedBlock,
} from "@/lib/content-parsers"
import { sanitizeInlineHtml } from "@/lib/sanitize"

interface ParagraphBlockProps {
  data: ParagraphData & { align?: "left" | "center" | "right" | "justify" }
  onChange: (data: Partial<ParagraphData>) => void
  onEnter?: () => void
  onBackspace?: () => void
  onPasteSplit?: (lines: string[]) => void
  onPasteBlocks?: (blocks: ParsedBlock[]) => void
}

/** Decode các entity bị mã hoá 2 lần (nội dung cũ trong DB). */
function decodeHtmlEntities(html: string): string {
  if (typeof document === "undefined") return html
  try {
    const temp = document.createElement("textarea")
    temp.innerHTML = html
    return temp.value
  } catch {
    return html
  }
}

export function ParagraphBlock({
  data,
  onChange,
  onEnter,
  onBackspace,
  onPasteSplit,
  onPasteBlocks,
}: ParagraphBlockProps) {
  const { text = "", align = "justify" } = data
  const editorRef = useRef<HTMLParagraphElement>(null)
  const isComposingRef = useRef(false)
  const lastTextRef = useRef(text)

  const alignClass = {
    left: "text-left",
    center: "text-center",
    right: "text-right",
    justify: "text-justify md:text-justify",
  }[align]

  /**
   * Chuẩn hoá nội dung khi nhận từ bên ngoài (load bài / đồng bộ từ cha):
   * decode entity cũ rồi whitelist thẻ inline.
   */
  const normalizeInlineHtml = (html: string): string => {
    if (!html) return ""
    try {
      return sanitizeInlineHtml(decodeHtmlEntities(html))
    } catch {
      return sanitizeInlineHtml(html)
    }
  }

  // Khởi tạo nội dung khi mount - giữ định dạng inline (bold/italic/link)
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML === "") {
      const initial = normalizeInlineHtml(text)
      editorRef.current.innerHTML = initial
      lastTextRef.current = initial
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Chỉ ghi lại DOM khi nội dung đổi từ bên ngoài (không phải do người dùng đang gõ)
  useEffect(() => {
    const applyExternalText = () => {
      if (text === lastTextRef.current || !editorRef.current) return

      const selection = window.getSelection()
      const isEditorFocused = document.activeElement === editorRef.current

      // Lưu vị trí con trỏ nếu đang focus
      let savedRange: Range | null = null
      if (isEditorFocused && selection && selection.rangeCount > 0) {
        try {
          savedRange = selection.getRangeAt(0).cloneRange()
        } catch (error) {
          console.warn("[blog] Không lưu được vị trí con trỏ:", error)
        }
      }

      const normalized = normalizeInlineHtml(text)
      editorRef.current.innerHTML = normalized
      lastTextRef.current = normalized

      if (savedRange && isEditorFocused && selection) {
        try {
          selection.removeAllRanges()
          selection.addRange(savedRange)
        } catch {
          try {
            const range = document.createRange()
            range.selectNodeContents(editorRef.current)
            range.collapse(false)
            selection.removeAllRanges()
            selection.addRange(range)
          } catch (innerError) {
            console.warn("[blog] Không khôi phục được vị trí con trỏ:", innerError)
          }
        }
      }
    }

    applyExternalText()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text])

  const syncFromDom = (html?: string) => {
    const raw = html ?? editorRef.current?.innerHTML ?? ""
    const sanitized = sanitizeInlineHtml(raw)
    lastTextRef.current = sanitized
    onChange({ text: sanitized })
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLParagraphElement>) => {
    // Enter - tạo khối đoạn văn mới bên dưới, giữ nguyên định dạng của khối hiện tại
    if (e.key === "Enter" && !e.shiftKey && !isComposingRef.current) {
      e.preventDefault()
      syncFromDom(e.currentTarget.innerHTML)
      onEnter?.()
      return
    }

    // Backspace ở khối rỗng - xoá khối
    if (e.key === "Backspace" && !isComposingRef.current) {
      const currentText = e.currentTarget.textContent?.trim() || ""
      if (!currentText) {
        e.preventDefault()
        onBackspace?.()
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent<HTMLParagraphElement>) => {
    e.preventDefault()

    const pastedHTML = e.clipboardData.getData("text/html")
    const pastedText = e.clipboardData.getData("text/plain")

    // 1. Markdown có cấu trúc (bảng, heading, list...) -> tách thành nhiều khối
    if (pastedText && onPasteBlocks && looksLikeMarkdown(pastedText)) {
      const markdownBlocks = parseMarkdownToBlocks(pastedText)
      const isStructured =
        markdownBlocks.length > 1 ||
        markdownBlocks.some((block) => ["table", "list", "heading", "quote"].includes(block.type))
      if (isStructured) {
        onPasteBlocks(markdownBlocks)
        return
      }
    }

    // 2. HTML từ Google Docs / Word / trang web -> tách thành nhiều khối
    if (pastedHTML && onPasteBlocks) {
      try {
        const parsedBlocks = parseHtmlToParsedBlocks(pastedHTML)
        const isStructured =
          parsedBlocks.length > 1 ||
          parsedBlocks.some((block) => ["table", "image", "list", "heading", "quote"].includes(block.type))

        if (isStructured) {
          onPasteBlocks(parsedBlocks)
          return
        }

        if (parsedBlocks.length === 1 && parsedBlocks[0].type === "paragraph") {
          insertPasteContent(parsedBlocks[0].text)
          return
        }
      } catch (error) {
        console.warn("[blog] Không parse được nội dung HTML khi paste:", error)
      }
    }

    // 3. Text thuần: nhiều dòng -> nhiều khối, một dòng -> chèn tại con trỏ
    const lines = pastedText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

    if (lines.length > 1 && onPasteSplit) {
      onPasteSplit(lines)
      return
    }

    if (lines.length === 1) {
      insertPasteContent(lines[0])
    }
  }

  /** Chèn nội dung (đã giữ định dạng inline) tại vị trí con trỏ. */
  const insertPasteContent = (content: string) => {
    const editor = editorRef.current
    if (!editor) return

    // Nội dung từ HTML paste cần giữ thẻ inline; text thuần thì escape
    const looksLikeHtml = /<\/?[a-z][\s\S]*>/i.test(content)
    const html = sanitizeInlineHtml(looksLikeHtml ? cleanInlineHtml(content) : content)

    if (!html) return

    editor.focus()

    const selection = window.getSelection()
    const hasRangeInEditor =
      !!selection &&
      selection.rangeCount > 0 &&
      editor.contains(selection.getRangeAt(0).commonAncestorContainer)

    if (!hasRangeInEditor) {
      // Không có con trỏ trong editor -> nối vào cuối
      syncFromDom(`${editor.innerHTML}${html}`)
      return
    }

    const range = selection!.getRangeAt(0)
    range.deleteContents()

    const temp = document.createElement("div")
    temp.innerHTML = html
    const fragment = document.createDocumentFragment()
    while (temp.firstChild) fragment.appendChild(temp.firstChild)

    range.insertNode(fragment)
    range.collapse(false)
    selection!.removeAllRanges()
    selection!.addRange(range)

    syncFromDom(editor.innerHTML)
  }

  const handleInput = (e: React.FormEvent<HTMLParagraphElement>) => {
    syncFromDom(e.currentTarget.innerHTML)
  }

  const handleCompositionStart = () => {
    isComposingRef.current = true
  }

  const handleCompositionEnd = (e: React.CompositionEvent<HTMLParagraphElement>) => {
    isComposingRef.current = false
    syncFromDom(e.currentTarget.innerHTML)
  }

  const handleBlur = (e: React.FocusEvent<HTMLParagraphElement>) => {
    syncFromDom(e.currentTarget.innerHTML)
  }

  return (
    <p
      ref={editorRef}
      contentEditable
      suppressContentEditableWarning
      className={`${alignClass} text-base leading-relaxed outline-none min-h-[50px] resize-none overflow-hidden empty:before:content-[attr(data-placeholder)] empty:before:text-muted-foreground prose prose-sm max-w-none [&_a]:text-blue-600 [&_a]:underline [&_a]:cursor-pointer [&_a:hover]:text-blue-800`}
      data-placeholder="Nhập nội dung đoạn văn... (Bôi đen text để thêm link, in đậm, in nghiêng)"
      onKeyDown={handleKeyDown}
      onPaste={handlePaste}
      onInput={handleInput}
      onCompositionStart={handleCompositionStart}
      onCompositionEnd={handleCompositionEnd}
      onBlur={handleBlur}
    />
  )
}
