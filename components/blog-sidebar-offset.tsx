"use client"

import { useEffect, useRef } from "react"

/** The blog index has a wrapping sticky category bar in addition to the header.
 * Measure that bar instead of assuming a fixed number of category rows. */
export function BlogSidebarOffset({ targetId }: { targetId: string }) {
  const marker = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const rail = marker.current?.parentElement
    const target = document.getElementById(targetId)
    if (!rail || !target) return
    const update = () => {
      const top = Number.parseFloat(getComputedStyle(target).top) || 0
      const offset = Math.max(96, Math.ceil(top + target.getBoundingClientRect().height + 16))
      rail.style.setProperty("--blog-sidebar-top", `${offset}px`)
      rail.dataset.stickyReady = "true"
    }
    const observer = new ResizeObserver(update)
    observer.observe(target)
    window.addEventListener("resize", update)
    update()
    return () => {
      observer.disconnect()
      window.removeEventListener("resize", update)
      rail.style.removeProperty("--blog-sidebar-top")
      delete rail.dataset.stickyReady
    }
  }, [targetId])
  return <span ref={marker} hidden aria-hidden="true" />
}
