"use client"

import dynamic from "next/dynamic"

const ChatWidget = dynamic(
  () => import("@/components/chat-widget").then((mod) => ({ default: mod.ChatWidget })),
  {
    ssr: false,
  }
)

export function ClientWidgets() {
  return <ChatWidget />
}
