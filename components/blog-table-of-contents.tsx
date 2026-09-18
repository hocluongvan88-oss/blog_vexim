"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export interface TocHeading {
  id: string
  text: string
  level: number
}

/**
 * Mục lục bài viết.
 *
 * Trước đây component này nhận cả chuỗi `content`, tự parse bằng DOMParser rồi gán
 * `heading-N` cho các thẻ heading SAU 100ms bằng JS. Ba hệ quả xấu:
 * - id trong HTML không khớp id hiển thị trên mục lục (link không share được),
 * - Google/AI đọc HTML không thấy anchor nào,
 * - phụ thuộc hydration nên đôi lúc bấm mục lục không nhảy.
 *
 * Nay danh sách heading (kèm id thật) do server tính trong `ensureHeadingAnchors()`
 * và truyền xuống qua props — mục lục chỉ còn việc hiển thị và cuộn tới `#id`.
 */
export function BlogTableOfContents({ headings }: { headings: TocHeading[] }) {
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    if (headings.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      { rootMargin: "-100px 0px -80% 0px" },
    )

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id)
      if (element) observer.observe(element)
    })

    return () => observer.disconnect()
  }, [headings])

  if (headings.length === 0) return null

  const scrollToHeading = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      // `scrollIntoView` + class `scroll-mt-24` trên heading xử lý luôn phần bù header dính
      element.scrollIntoView({ behavior: "smooth", block: "start" })
      // Cập nhật URL để người đọc copy được link tới đúng mục
      window.history.replaceState(null, "", `#${id}`)
    }
  }

  return (
    <nav className="hidden xl:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="bg-secondary/30 rounded-lg p-6 w-full">
        <h4 className="font-bold text-primary mb-4">Nội dung bài viết</h4>
        <ul className="space-y-1">
          {headings.map((heading) => (
            <li
              key={heading.id}
              className={cn(heading.level === 3 && "ml-4 border-l-2 border-muted pl-3")}
            >
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  "text-left transition-colors w-full leading-relaxed py-1 break-words",
                  // H2 styling - prominent
                  heading.level === 2 && "text-sm font-semibold text-foreground/90 hover:text-primary",
                  // H3 styling - subtle
                  heading.level === 3 && "text-xs text-muted-foreground hover:text-foreground/80",
                  // Active state
                  activeId === heading.id && heading.level === 2 && "text-primary font-bold",
                  activeId === heading.id && heading.level === 3 && "text-primary/80 font-medium",
                )}
              >
                {heading.text}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
