"use client"

import dynamic from "next/dynamic"

const ZaloWidget = dynamic(
  () => import("@/components/zalo-widget").then((mod) => ({ default: mod.ZaloWidget })),
  {
    ssr: false,
  }
)

export function ClientWidgets() {
  return <ZaloWidget />
}
