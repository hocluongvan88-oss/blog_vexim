"use client"

import { useCallback, useEffect, useLayoutEffect, useRef } from "react"

interface PostTitleInputProps {
  value: string
  onChange: (value: string) => void
  onEnter: () => void
}

/** A single logical title that wraps visually and grows with text or canvas width. */
export function PostTitleInput({ value, onChange, onEnter }: PostTitleInputProps) {
  const ref = useRef<HTMLTextAreaElement>(null)
  const resize = useCallback(() => {
    const field = ref.current
    if (!field) return
    field.style.height = "auto"
    field.style.height = `${field.scrollHeight}px`
  }, [])

  useLayoutEffect(resize, [value, resize])

  useEffect(() => {
    const field = ref.current
    if (!field) return
    let width = field.getBoundingClientRect().width
    const observer =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver((entries) => {
            const nextWidth = entries[0]?.contentRect.width
            if (nextWidth !== undefined && nextWidth !== width) {
              width = nextWidth
              resize()
            }
          })
    observer?.observe(field)
    window.addEventListener("resize", resize)
    // A delayed webfont may change line wrapping without changing the field's width.
    let mounted = true
    document.fonts?.ready.then(() => {
      if (mounted) resize()
    })
    document.fonts?.addEventListener("loadingdone", resize)
    return () => {
      mounted = false
      observer?.disconnect()
      window.removeEventListener("resize", resize)
      document.fonts?.removeEventListener("loadingdone", resize)
    }
  }, [resize])

  return (
    <textarea
      ref={ref}
      id="title"
      aria-label="Tiêu đề bài viết"
      placeholder="Nhập tiêu đề bài viết..."
      value={value}
      rows={1}
      wrap="soft"
      onChange={(event) => onChange(event.target.value.replace(/[\r\n]+/g, " "))}
      onKeyDown={(event) => {
        if (event.key === "Enter" && !event.nativeEvent.isComposing && event.keyCode !== 229) {
          event.preventDefault()
          onEnter()
        }
      }}
      className="block w-full min-w-0 resize-none overflow-hidden border-0 bg-transparent px-0 py-2 text-2xl font-bold leading-[1.3] text-primary shadow-none outline-none placeholder:text-muted-foreground/40 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring/40 md:text-4xl md:leading-[1.3] [overflow-wrap:anywhere]"
    />
  )
}
