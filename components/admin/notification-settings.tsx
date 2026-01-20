"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "sonner"
import { Mail, Plus, X, Bell } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function NotificationSettings() {
  const [emails, setEmails] = useState<string[]>([])
  const [newEmail, setNewEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from("ai_config")
        .select("value")
        .eq("key", "admin_notification_emails")
        .maybeSingle()

      if (error) {
        console.error("[v0] Error loading notification settings:", error)
        throw error
      }

      setEmails((data?.value as string[]) || [])
    } catch (error) {
      console.error("[v0] Error loading notification settings:", error)
      // Don't show error toast if config doesn't exist yet
      // toast.error("Không thể tải cấu hình thông báo")
    } finally {
      setLoading(false)
    }
  }

  const addEmail = () => {
    if (!newEmail.trim()) return

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(newEmail)) {
      toast.error("Email không hợp lệ")
      return
    }

    if (emails.includes(newEmail)) {
      toast.error("Email đã tồn tại")
      return
    }

    setEmails([...emails, newEmail])
    setNewEmail("")
  }

  const removeEmail = (email: string) => {
    setEmails(emails.filter((e) => e !== email))
  }

  const saveSettings = async () => {
    setSaving(true)
    try {
      const supabase = createClient()
      
      // Try to upsert instead of update (handles case where row doesn't exist)
      const { error } = await supabase
        .from("ai_config")
        .upsert(
          { 
            key: "admin_notification_emails", 
            value: emails 
          },
          { 
            onConflict: "key" 
          }
        )

      if (error) throw error

      toast.success("Đã lưu cấu hình thông báo")
    } catch (error) {
      console.error("[v0] Error saving notification settings:", error)
      toast.error("Không thể lưu cấu hình")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>
  }

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="h-5 w-5 text-orange-600" />
        <h3 className="text-lg font-semibold">Thông Báo Email</h3>
      </div>

      <p className="text-sm text-muted-foreground mb-4">
        Admin sẽ nhận email khi có khách hàng mới được AI chuyển qua
      </p>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="email"
            placeholder="email@example.com"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addEmail()}
          />
          <Button onClick={addEmail} size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <div className="space-y-2">
          {emails.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground text-sm">
              Chưa có email nào
            </div>
          ) : (
            emails.map((email) => (
              <div
                key={email}
                className="flex items-center justify-between p-2 border rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{email}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEmail(email)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))
          )}
        </div>

        <Button
          onClick={saveSettings}
          disabled={saving}
          className="w-full"
        >
          {saving ? "Đang lưu..." : "Lưu Cấu Hình"}
        </Button>

        <div className="mt-4 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-900">
            <strong>Lưu ý:</strong> Để sử dụng tính năng gửi email, bạn cần:
          </p>
          <ul className="list-disc list-inside text-sm text-blue-800 mt-2 space-y-1">
            <li>Thêm biến môi trường RESEND_API_KEY</li>
            <li>Xác thực domain email gửi với Resend</li>
          </ul>
        </div>
      </div>
    </Card>
  )
}
