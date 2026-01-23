"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { toast } from "sonner"
import { Mail, CheckCircle2, AlertTriangle, ArrowRight } from "lucide-react"

interface FDASubscriptionInlineProps {
  variant?: "default" | "compact" | "cta"
  className?: string
}

export function FDASubscriptionInline({ variant = "default", className = "" }: FDASubscriptionInlineProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [honeypot, setHoneypot] = useState("") // Anti-spam honeypot

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email) {
      toast.error("Vui lòng nhập email")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/fda/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          categories: ["food", "drug", "cosmetic"], // Default all categories
          frequency: "weekly",
          honeypot, // Anti-spam field
        }),
      })

      if (!response.ok) {
        throw new Error("Subscription failed")
      }

      setSuccess(true)
      toast.success("Đăng ký thành công! Kiểm tra email để xác nhận.")
      setEmail("")

      // Reset success state after 5 seconds
      setTimeout(() => setSuccess(false), 5000)
    } catch (error) {
      console.error("Subscription error:", error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.")
    } finally {
      setLoading(false)
    }
  }

  if (variant === "compact") {
    return (
      <div className={`${className}`}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            type="email"
            placeholder="Email của bạn"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1"
            disabled={loading || success}
          />
          <Button type="submit" disabled={loading || success} className="bg-blue-600 hover:bg-blue-700">
            {success ? <CheckCircle2 className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
          </Button>
        </form>
      </div>
    )
  }

  if (variant === "cta") {
    return (
      <Card className={`p-6 bg-gradient-to-r from-blue-50 to-emerald-50 border-2 border-blue-200 ${className}`}>
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-3 bg-blue-600 rounded-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Nhận cảnh báo FDA qua email</h3>
            <p className="text-slate-600 mb-4">
              Theo dõi realtime thu hồi thực phẩm, dược phẩm, mỹ phẩm từ FDA. Miễn phí và hủy bất cứ lúc nào.
            </p>
            {success ? (
              <div className="flex items-center gap-2 text-green-700">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Đăng ký thành công! Kiểm tra email của bạn.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1"
                  disabled={loading}
                />
                <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                  {loading ? (
                    "Đang xử lý..."
                  ) : (
                    <>
                      Đăng ký
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}
            <p className="text-xs text-slate-500 mt-2">Không spam. Hủy đăng ký bất cứ lúc nào.</p>
          </div>
        </div>
      </Card>
    )
  }

  // Default variant
  return (
    <Card className={`p-6 ${className}`}>
      <div className="text-center max-w-md mx-auto">
        <div className="inline-flex p-3 bg-blue-100 rounded-full mb-4">
          <Mail className="w-6 h-6 text-blue-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-2">Đăng ký nhận cảnh báo FDA</h3>
        <p className="text-slate-600 mb-6">
          Nhận thông báo tự động khi có cảnh báo thu hồi mới từ FDA. Miễn phí và có thể hủy bất cứ lúc nào.
        </p>

        {success ? (
          <div className="flex items-center justify-center gap-2 text-green-700 py-4">
            <CheckCircle2 className="w-6 h-6" />
            <span className="font-medium text-lg">Đăng ký thành công!</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <Input
              type="email"
              placeholder="Email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full"
              disabled={loading}
            />
            <Button type="submit" disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700">
              {loading ? "Đang xử lý..." : "Đăng ký ngay"}
            </Button>
          </form>
        )}

        <p className="text-xs text-slate-500 mt-4">Bạn sẽ nhận được tóm tắt tiếng Việt và thông báo realtime.</p>
      </div>
    </Card>
  )
}
