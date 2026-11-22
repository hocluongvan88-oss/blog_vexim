"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ArrowUp } from "lucide-react"

export function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", toggleVisibility)
    return () => window.removeEventListener("scroll", toggleVisibility)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  if (!isVisible) {
    return null
  }

  return (
    <Button
      onClick={scrollToTop}
      /** Nút Zalo OA chiếm góc phải dưới (~60px + lề) nên nút này nằm CAO HƠN,
       *  không đè lên nút Zalo. Trên mobile lề dưới của Zalo là 16px. */
      className="fixed bottom-24 right-5 sm:bottom-28 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg z-40"
      size="icon"
      aria-label="Quay lại đầu trang"
    >
      <ArrowUp className="w-5 h-5" />
    </Button>
  )
}
