"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { BRAND_SLOGAN } from "@/lib/business-profile"

function UnsubscribeForm() {
  const params = useSearchParams()
  const email = params.get("email")
  const token = params.get("token")
  const [status, setStatus] = useState<"idle" | "pending" | "done" | "error">("idle")

  async function unsubscribe() {
    if (!email || !token) return
    setStatus("pending")
    try {
      const response = await fetch(`/api/fda/subscribe?${new URLSearchParams({ email, token })}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Unsubscribe failed")
      setStatus("done")
    } catch {
      setStatus("error")
    }
  }

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-16 text-slate-800">
      <div className="mx-auto max-w-lg rounded-xl border border-slate-200 bg-white p-6 sm:p-10">
        <p className="font-bold tracking-wide">VEXIM GLOBAL</p>
        <p className="mt-1 text-sm text-slate-600">{BRAND_SLOGAN}</p>
        <h1 className="mt-8 text-2xl font-bold">Hủy đăng ký cảnh báo FDA</h1>
        <div className="mt-5 space-y-4" aria-live="polite">
          {!email || !token ? <p>Liên kết không hợp lệ. Vui lòng mở lại liên kết từ email cảnh báo của bạn.</p> : status === "done" ? (
            <p>Bạn đã hủy đăng ký cảnh báo FDA thành công.</p>
          ) : (
            <>
              <p className="break-words">Bạn muốn ngừng nhận cảnh báo FDA tại <strong>{email}</strong>?</p>
              <p>Chỉ khi bấm nút bên dưới, đăng ký của bạn mới được hủy.</p>
              {status === "error" && <p role="alert" className="text-red-700">Chưa thể hủy đăng ký. Vui lòng thử lại sau.</p>}
              <button onClick={unsubscribe} disabled={status === "pending"} className="min-h-12 rounded-md bg-slate-800 px-5 py-3 font-semibold text-white disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-slate-800">
                {status === "pending" ? "Đang xử lý…" : "Xác nhận hủy đăng ký"}
              </button>
            </>
          )}
          <p><Link href="/fda-tracker" className="underline">Quay lại FDA Tracker</Link></p>
        </div>
      </div>
    </main>
  )
}

export default function UnsubscribePage() {
  return <Suspense fallback={<p className="p-8">Đang tải…</p>}><UnsubscribeForm /></Suspense>
}
