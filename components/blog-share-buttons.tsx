"use client"

import { Facebook, Linkedin, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function BlogShareButtons() {
  const [currentUrl, setCurrentUrl] = useState("")

  useEffect(() => {
    setCurrentUrl(window.location.href)
  }, [])

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`, "_blank")
  }

  const shareOnLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`, "_blank")
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentUrl)
      alert("Đã sao chép link!")
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  return (
    <div className="fixed left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 z-10">
      <Button
        size="icon"
        variant="outline"
        className="rounded-full shadow-lg hover:bg-accent hover:text-white transition-colors bg-transparent"
        onClick={shareOnFacebook}
        title="Chia sẻ lên Facebook"
      >
        <Facebook className="w-5 h-5" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="rounded-full shadow-lg hover:bg-accent hover:text-white transition-colors bg-transparent"
        onClick={shareOnLinkedIn}
        title="Chia sẻ lên LinkedIn"
      >
        <Linkedin className="w-5 h-5" />
      </Button>
      <Button
        size="icon"
        variant="outline"
        className="rounded-full shadow-lg hover:bg-accent hover:text-white transition-colors bg-transparent"
        onClick={copyToClipboard}
        title="Sao chép link"
      >
        <Share2 className="w-5 h-5" />
      </Button>
    </div>
  )
}
