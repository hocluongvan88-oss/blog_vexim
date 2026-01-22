"use client"

import React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import { Mail, CheckCircle2, Loader2 } from "lucide-react"
import type { FDACategory } from "@/types/fda"

interface FDASubscriptionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FDASubscriptionDialog({ open, onOpenChange }: FDASubscriptionDialogProps) {
  const [email, setEmail] = useState("")
  const [categories, setCategories] = useState<FDACategory[]>(["food"])
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "immediate">("weekly")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleCategoryToggle = (category: FDACategory) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category))
    } else {
      setCategories([...categories, category])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      toast.error("Vui lòng nhập email")
      return
    }

    if (categories.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 danh mục")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/fda/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          categories,
          frequency,
        }),
      })

      if (!response.ok) {
        throw new Error("Subscription failed")
      }

      setSuccess(true)
      toast.success("Đăng ký thành công! Kiểm tra email để xác nhận.")

      // Reset form after 2 seconds
      setTimeout(() => {
        setEmail("")
        setCategories(["food"])
        setFrequency("weekly")
        setSuccess(false)
        onOpenChange(false)
      }, 2000)
    } catch (error) {
      console.error("Subscription error:", error)
      toast.error("Có lỗi xảy ra. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Đăng ký nhận cảnh báo FDA</DialogTitle>
          <DialogDescription>
            Nhận thông báo qua email khi có cảnh báo mới từ FDA. Miễn phí và có thể hủy bất cứ lúc nào.
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="py-8 text-center">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">Đăng ký thành công!</h3>
            <p className="text-slate-600">Vui lòng kiểm tra email để xác nhận đăng ký.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email của bạn</Label>
              <Input
                id="email"
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Categories */}
            <div className="space-y-3">
              <Label>Danh mục quan tâm</Label>
              <div className="space-y-2">
                {[
                  { value: "food" as FDACategory, label: "Thực phẩm" },
                  { value: "drug" as FDACategory, label: "Dược phẩm" },
                  { value: "cosmetic" as FDACategory, label: "Mỹ phẩm" },
                  { value: "device" as FDACategory, label: "Thiết bị y tế" },
                ].map((cat) => (
                  <div key={cat.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={cat.value}
                      checked={categories.includes(cat.value)}
                      onCheckedChange={() => handleCategoryToggle(cat.value)}
                      disabled={loading}
                    />
                    <Label htmlFor={cat.value} className="font-normal cursor-pointer">
                      {cat.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div className="space-y-3">
              <Label>Tần suất nhận thông báo</Label>
              <div className="space-y-2">
                {[
                  { value: "immediate" as const, label: "Ngay lập tức (khi có cảnh báo mới)" },
                  { value: "daily" as const, label: "Hàng ngày (tổng hợp 1 lần/ngày)" },
                  { value: "weekly" as const, label: "Hàng tuần (tổng hợp cuối tuần)" },
                ].map((freq) => (
                  <div key={freq.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={freq.value}
                      checked={frequency === freq.value}
                      onCheckedChange={() => setFrequency(freq.value)}
                      disabled={loading}
                    />
                    <Label htmlFor={freq.value} className="font-normal cursor-pointer">
                      {freq.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang đăng ký...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4 mr-2" />
                  Đăng ký ngay
                </>
              )}
            </Button>

            <p className="text-xs text-slate-500 text-center">
              Bằng cách đăng ký, bạn đồng ý nhận email từ Vexim Global. Bạn có thể hủy đăng ký bất cứ lúc nào.
            </p>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
