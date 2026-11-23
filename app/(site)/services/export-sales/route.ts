import type { NextRequest } from "next/server"
import { renderTradePage } from "@/lib/vexim-trade-page"

// A complete server-rendered document, deliberately isolated from the global React
// layout/widgets/font requests. No hydration/runtime download is needed to read it.
export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export function GET(request: NextRequest) {
  const noindex =
    process.env.VERCEL_ENV === "preview" ||
    process.env.NODE_ENV !== "production" ||
    process.env.VEXIM_TRADE_NOINDEX === "true"
  return new Response(
    renderTradePage({
      params: request.nextUrl.searchParams,
      noindex,
      analytics: process.env.VERCEL === "1" && !noindex,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Cache-Control": "public, max-age=600, s-maxage=600",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        ...(noindex ? { "X-Robots-Tag": "noindex, nofollow" } : {}),
      },
    },
  )
}
