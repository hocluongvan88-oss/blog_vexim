"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params?.id as string
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showToggleDialog, setShowToggleDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    if (clientId && clientId !== "undefined") {
      fetchClient()
    } else {
      router.push("/admin/clients")
    }
  }, [clientId])

  async function fetchClient() {
    try {
      const res = await fetch(`/api/clients/${clientId}`)
      if (!res.ok) {
        throw new Error("Failed to fetch client")
      }
      const data = await res.json()
      setClient(data.client)
    } catch (error) {
      console.error("[v0] Error fetching client:", error)
      toast.error("Không thể tải thông tin khách hàng")
      router.push("/admin/clients")
    } finally {
      setLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!newPassword || newPassword.length < 8) {
      toast.error("Mật khẩu phải có ít nhất 8 ký tự")
      return
    }

    setActionLoading(true)
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: newPassword }),
      })

      if (!res.ok) throw new Error("Failed to update password")

      toast.success("Đã đổi mật khẩu thành công")
      setShowPasswordDialog(false)
      setNewPassword("")
    } catch (error) {
      console.error("[v0] Error changing password:", error)
      toast.error("Không thể đổi mật khẩu")
    } finally {
      setActionLoading(false)
    }
  }

  const handleToggleStatus = async () => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !client.is_active }),
      })

      if (!res.ok) throw new Error("Failed to toggle status")

      const data = await res.json()
      setClient(data.client)
      toast.success(client.is_active ? "Đã vô hiệu hóa tài khoản" : "Đã kích hoạt tài khoản")
      setShowToggleDialog(false)
    } catch (error) {
      console.error("[v0] Error toggling status:", error)
      toast.error("Không thể cập nhật trạng thái")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    setActionLoading(true)
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      })

      if (!res.ok) throw new Error("Failed to delete client")

      toast.success("Đã xóa khách hàng")
      router.push("/admin/clients")
    } catch (error) {
      console.error("[v0] Error deleting client:", error)
      toast.error("Không thể xóa khách hàng")
      setActionLoading(false)
    }
  }

  const generatePassword = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    setNewPassword(password)
    toast.success("Đã tạo mật khẩu ngẫu nhiên")
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (!client) {
    return null
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/admin/clients">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{client.company_name}</h1>
            <p className="text-muted-foreground">Chi tiết thông tin khách hàng</p>
          </div>
        </div>
        <Badge variant={client.is_active ? "default" : "secondary"} className={client.is_active ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}>
          {client.is_active ? "Hoạt động" : "Ngưng hoạt động"}
        </Badge>
      </div>

      {/* Client Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin công ty</CardTitle>
          <CardDescription>Thông tin liên hệ và chi tiết tài khoản</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Building2 className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Tên công ty</p>
                <p className="font-medium">{client.company_name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Email đăng nhập</p>
                <p className="font-medium">{client.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Số điện thoại</p>
                <p className="font-medium">{client.phone || "—"}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Địa chỉ</p>
                <p className="font-medium">{client.address || "—"}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Ngày tạo tài khoản</p>
                <p className="font-medium">{new Date(client.created_at).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm text-muted-foreground">Cập nhật lần cuối</p>
                <p className="font-medium">{new Date(client.updated_at).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* FDA Registrations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>FDA Registrations</CardTitle>
              <CardDescription>Danh sách cơ sở đã đăng ký FDA</CardDescription>
            </div>
            <Button asChild>
              <Link href={`/admin/fda-registrations/new?client_id=${client.id}`}>
                <Shield className="mr-2 h-4 w-4" />
                Thêm FDA Registration
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Chức năng hiển thị FDA registrations sẽ được bổ sung sau.</p>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Thao tác</CardTitle>
          <CardDescription>Quản lý tài khoản khách hàng</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="outline" onClick={() => setShowPasswordDialog(true)}>
            Đổi mật khẩu
          </Button>
          <Button variant="outline" onClick={() => setShowToggleDialog(true)}>
            {client.is_active ? "Vô hiệu hóa" : "Kích hoạt"} tài khoản
          </Button>
          <Button variant="destructive" className="ml-auto" onClick={() => setShowDeleteDialog(true)}>
            Xóa tài khoản
          </Button>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đổi mật khẩu</DialogTitle>
            <DialogDescription>Tạo mật khẩu mới cho tài khoản khách hàng</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">Mật khẩu mới</Label>
              <div className="flex gap-2">
                <Input
                  id="new-password"
                  type="text"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="flex-1"
                />
                <Button type="button" variant="outline" onClick={generatePassword}>
                  Tạo tự động
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">Tối thiểu 8 ký tự</p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)} disabled={actionLoading}>
              Hủy
            </Button>
            <Button onClick={handleChangePassword} disabled={actionLoading}>
              {actionLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Toggle Status Dialog */}
      <AlertDialog open={showToggleDialog} onOpenChange={setShowToggleDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {client.is_active ? "Vô hiệu hóa" : "Kích hoạt"} tài khoản?
            </AlertDialogTitle>
            <AlertDialogDescription>
              {client.is_active
                ? "Khách hàng sẽ không thể đăng nhập vào Client Portal. Bạn có thể kích hoạt lại sau."
                : "Khách hàng sẽ có thể đăng nhập vào Client Portal."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleToggleStatus} disabled={actionLoading}>
              {actionLoading ? "Đang xử lý..." : "Xác nhận"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xóa tài khoản khách hàng?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan đến khách hàng sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={actionLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {actionLoading ? "Đang xóa..." : "Xóa tài khoản"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
