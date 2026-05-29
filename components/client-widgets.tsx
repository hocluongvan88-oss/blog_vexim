"use client"

import dynamic from "next/dynamic"

// Default AI chat widget is disabled — we only use the Zalo chat button now.
const ZaloChatButton = dynamic(
  () => import("@/components/zalo-chat-button").then((mod) => ({ default: mod.ZaloChatButton })),
  {
    ssr: false,
  }
)

export function ClientWidgets() {
  return <ZaloChatButton />
}
