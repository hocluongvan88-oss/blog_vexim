"use client"
import { useState } from "react"

export function ZaloChatButton() {
  const [isHovered, setIsHovered] = useState(false)
  const zaloPhone = "0373685634"

  const handleClick = () => {
    // Detect if mobile or desktop
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

    if (isMobile) {
      // Open Zalo app on mobile
      window.location.href = `zalo://conversation?phone=${zaloPhone}`
    } else {
      // Open Zalo web on desktop
      window.open(`https://zalo.me/${zaloPhone}`, "_blank")
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Tooltip */}
      {isHovered && (
        <div className="animate-in slide-in-from-right-2 fade-in duration-200 bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium whitespace-nowrap border border-gray-200 dark:border-gray-700">
          Chat với chúng tôi qua Zalo
        </div>
      )}

      {/* Zalo Button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="group relative w-14 h-14 md:w-16 md:h-16 rounded-full bg-[#0068FF] hover:bg-[#0052CC] text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center hover:scale-110 active:scale-95"
        aria-label="Chat qua Zalo"
      >
        {/* Pulse Animation */}
        <span className="absolute inset-0 rounded-full bg-[#0068FF] animate-ping opacity-75" />

        {/* Zalo Icon */}
        <svg
          className="relative w-8 h-8 md:w-9 md:h-9 fill-current"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.855 1.372 5.407 3.523 7.158l-.665 2.428c-.058.211.12.42.332.39l3.403-.48C9.777 21.567 10.87 22 12 22c5.523 0 10-4.145 10-9.243S17.523 2 12 2zm3.829 11.92l-2.122 2.122a.75.75 0 01-1.06 0l-2.122-2.122a.75.75 0 111.06-1.06l.855.854V9.75a.75.75 0 111.5 0v3.964l.855-.854a.75.75 0 111.06 1.06z" />
        </svg>

        {/* Online Badge */}
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-gray-900 rounded-full" />
      </button>
    </div>
  )
}
