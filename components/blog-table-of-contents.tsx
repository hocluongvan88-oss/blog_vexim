"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface Heading {
  id: string
  text: string
  level: number
}

export function BlogTableOfContents({ content }: { content: string }) {
  const [headings, setHeadings] = useState<Heading[]>([])
  const [activeId, setActiveId] = useState<string>("")

  useEffect(() => {
    // Extract headings from HTML content
    const parser = new DOMParser()
    const doc = parser.parseFromString(content, "text/html")
    const headingElements = doc.querySelectorAll("h2, h3")

    const extractedHeadings: Heading[] = Array.from(headingElements).map((heading, index) => {
      const id = `heading-${index}`
      return {
        id,
        text: heading.textContent || "",
        level: Number.parseInt(heading.tagName.substring(1)),
      }
    })

    setHeadings(extractedHeadings)

    // Add IDs to actual headings in the DOM
    setTimeout(() => {
      const actualHeadings = document.querySelectorAll("article h2, article h3")
      actualHeadings.forEach((heading, index) => {
        heading.id = `heading-${index}`
      })
    }, 100)
  }, [content])

  useEffect(() => {
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
      const offset = 100
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <nav className="hidden xl:block sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto">
      <div className="bg-secondary/30 rounded-lg p-6 w-64">
        <h4 className="font-bold text-primary mb-4">Nội dung bài viết</h4>
        <ul className="space-y-2">
          {headings.map((heading) => (
            <li key={heading.id} className={cn(heading.level === 3 && "ml-4")}>
              <button
                onClick={() => scrollToHeading(heading.id)}
                className={cn(
                  "text-left text-sm hover:text-accent transition-colors w-full text-muted-foreground leading-relaxed",
                  activeId === heading.id && "text-accent font-medium",
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
