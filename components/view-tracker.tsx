"use client"

import { useEffect } from "react"

interface ViewTrackerProps {
  postId: string
}

export function ViewTracker({ postId }: ViewTrackerProps) {
  useEffect(() => {
    // Track view after a short delay to avoid bots
    const timer = setTimeout(() => {
      fetch("/api/analytics/track-view", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ postId }),
      }).catch((error) => {
        console.error("[v0] Failed to track view:", error)
      })
    }, 2000)

    return () => clearTimeout(timer)
  }, [postId])

  return null
}
