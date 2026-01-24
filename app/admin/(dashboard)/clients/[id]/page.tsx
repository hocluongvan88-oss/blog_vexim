"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar, Shield } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

export default function ClientDetailPage() {
  const params = useParams()
  const router = useRouter()
  const clientId = params?.id as string
  const [client, setClient] = useState<any>(null)
  const [loading, setLoading] = useState(true)

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
          <Button variant="outline">
            Đổi mật khẩu
          </Button>
          <Button variant="outline">
            {client.is_active ? "Vô hiệu hóa" : "Kích hoạt"} tài khoản
          </Button>
          <Button variant="destructive" className="ml-auto">
            Xóa tài khoản
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
