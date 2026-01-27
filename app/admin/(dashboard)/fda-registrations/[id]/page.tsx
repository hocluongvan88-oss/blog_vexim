"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Building2,
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface FdaRegistration {
  id: string
  client_id: string
  company_name: string
  registration_type: string
  registration_number?: string
  expiration_date: string
  status: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  address?: string
  fda_user_id?: string
  fda_password?: string
  fda_pin?: string
  uses_us_agent: boolean
  us_agent_id?: string
  us_agent_name?: string
  us_agent_company?: string
  us_agent_phone?: string
  us_agent_email?: string
  us_agent_address?: string
  agent_contract_start_date?: string
  agent_contract_end_date?: string
  agent_contract_years?: string
  notes?: string
  has_credentials: boolean
  created_at: string
  updated_at: string
}

export default function FdaRegistrationDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [registration, setRegistration] = useState<FdaRegistration | null>(null)
  const [loading, setLoading] = useState(true)
  const [showCredentials, setShowCredentials] = useState(false)

  useEffect(() => {
    loadRegistration()
  }, [params.id])

  const loadRegistration = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/fda-registrations/${params.id}`)
      const result = await response.json()

      if (result.data) {
        setRegistration(result.data)
      } else {
        toast.error("Không tìm thấy đăng ký")
        router.push("/admin/fda-registrations")
      }
    } catch (error) {
      console.error("Error loading registration:", error)
      toast.error("Không thể tải thông tin đăng ký")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!registration) return
    if (!confirm(`Bạn có chắc muốn xóa đăng ký của ${registration.company_name}?`)) return

    try {
      const response = await fetch(`/api/fda-registrations/${params.id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Đã xóa đăng ký FDA")
        router.push("/admin/fda-registrations")
      } else {
        toast.error("Không thể xóa đăng ký")
      }
    } catch (error) {
      console.error("Error deleting registration:", error)
      toast.error("Có lỗi xảy ra khi xóa")
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<
      string,
      { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
    > = {
      active: { label: "Đang hoạt động", variant: "default" },
      pending_renewal: { label: "Sắp hết hạn", variant: "secondary" },
      expired: { label: "Đã hết hạn", variant: "destructive" },
      cancelled: { label: "Đã hủy", variant: "outline" },
    }

    const config = statusConfig[status] || statusConfig.active
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="text-center py-8">Đang tải...</div>
      </div>
    )
  }

  if (!registration) {
    return (
      <div className="p-8">
        <div className="text-center py-8">Không tìm thấy đăng ký</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href="/admin/fda-registrations">
          <Button variant="ghost" className="mb-4 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">{registration.company_name}</h1>
            <div className="flex items-center gap-2">
              {getStatusBadge(registration.status)}
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{registration.registration_type}</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Link href={`/admin/fda-registrations/${params.id}/edit`}>
              <Button>
                <Edit className="w-4 h-4 mr-2" />
                Chỉnh sửa
              </Button>
            </Link>
            <Button
              variant="destructive"
              onClick={handleDelete}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Xóa
            </Button>
          </div>
        </div>
      </div>

      {/* Thông tin cơ bản */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Building2 className="w-5 h-5" />
          Thông tin cơ sở
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Tên công ty</p>
            <p className="font-medium">{registration.company_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Loại đăng ký</p>
            <p className="font-medium">{registration.registration_type}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Số đăng ký FDA</p>
            <p className="font-medium">{registration.registration_number || "Chưa có"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Ngày hết hạn</p>
            <p className="font-medium">
              {new Date(registration.expiration_date).toLocaleDateString("vi-VN")}
            </p>
          </div>
          {registration.address && (
            <div className="md:col-span-2">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Địa chỉ
              </p>
              <p className="font-medium">{registration.address}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Thông tin liên hệ */}
      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          Thông tin liên hệ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Người liên hệ</p>
            <p className="font-medium">{registration.contact_name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <Mail className="w-4 h-4" />
              Email
            </p>
            <p className="font-medium">{registration.contact_email}</p>
          </div>
          {registration.contact_phone && (
            <div>
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Số điện thoại
              </p>
              <p className="font-medium">{registration.contact_phone}</p>
            </div>
          )}
        </div>
      </Card>

      {/* Thông tin đăng nhập FDA */}
      {registration.has_credentials && (
        <Card className="p-6 mb-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-yellow-900 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                🔒 Thông tin đăng nhập FDA
              </h2>
              <p className="text-sm text-yellow-700 mt-1">
                Thông tin được mã hóa AES-256 theo chuẩn ISO 27001
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowCredentials(!showCredentials)}
              className="bg-transparent"
            >
              {showCredentials ? (
                <>
                  <EyeOff className="w-4 h-4 mr-2" />
                  Ẩn
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 mr-2" />
                  Hiển thị
                </>
              )}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-yellow-700">FDA User ID</p>
              <p className="font-mono font-medium">
                {showCredentials ? registration.fda_user_id : "••••••••"}
              </p>
            </div>
            <div>
              <p className="text-sm text-yellow-700">FDA Password</p>
              <p className="font-mono font-medium">
                {showCredentials ? registration.fda_password : "••••••••"}
              </p>
            </div>
            <div>
              <p className="text-sm text-yellow-700">FDA PIN</p>
              <p className="font-mono font-medium">
                {showCredentials ? registration.fda_pin : "••••••••"}
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* US Agent */}
      {registration.uses_us_agent && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Thông tin US Agent
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {registration.us_agent_id && (
              <div>
                <p className="text-sm text-muted-foreground">U.S. Agent ID</p>
                <p className="font-medium">{registration.us_agent_id}</p>
              </div>
            )}
            {registration.us_agent_company && (
              <div>
                <p className="text-sm text-muted-foreground">Công ty</p>
                <p className="font-medium">{registration.us_agent_company}</p>
              </div>
            )}
            {registration.us_agent_name && (
              <div>
                <p className="text-sm text-muted-foreground">Tên US Agent</p>
                <p className="font-medium">{registration.us_agent_name}</p>
              </div>
            )}
            {registration.us_agent_email && (
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{registration.us_agent_email}</p>
              </div>
            )}
            {registration.us_agent_phone && (
              <div>
                <p className="text-sm text-muted-foreground">Số điện thoại</p>
                <p className="font-medium">{registration.us_agent_phone}</p>
              </div>
            )}
            {registration.us_agent_address && (
              <div className="md:col-span-2">
                <p className="text-sm text-muted-foreground">Địa chỉ</p>
                <p className="font-medium">{registration.us_agent_address}</p>
              </div>
            )}
            {registration.agent_contract_start_date && (
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Ngày bắt đầu hợp đồng
                </p>
                <p className="font-medium">
                  {new Date(registration.agent_contract_start_date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            )}
            {registration.agent_contract_end_date && (
              <div>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Ngày kết thúc hợp đồng
                </p>
                <p className="font-medium">
                  {new Date(registration.agent_contract_end_date).toLocaleDateString("vi-VN")}
                </p>
              </div>
            )}
            {registration.agent_contract_years && (
              <div>
                <p className="text-sm text-muted-foreground">Thời hạn hợp đồng</p>
                <p className="font-medium">{registration.agent_contract_years} năm</p>
              </div>
            )}
          </div>
        </Card>
      )}

      {/* Ghi chú */}
      {registration.notes && (
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Ghi chú</h2>
          <p className="text-muted-foreground whitespace-pre-wrap">{registration.notes}</p>
        </Card>
      )}

      {/* Metadata */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Thông tin hệ thống</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Ngày tạo</p>
            <p className="font-medium">
              {new Date(registration.created_at).toLocaleString("vi-VN")}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground">Cập nhật lần cuối</p>
            <p className="font-medium">
              {new Date(registration.updated_at).toLocaleString("vi-VN")}
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
