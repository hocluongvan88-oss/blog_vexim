"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  FileText,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Edit,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface FdaRegistration {
  id: string
  company_name: string
  registration_type: string
  registration_number?: string
  expiration_date: string
  status: string
  contact_name: string
  contact_email: string
  uses_us_agent: boolean
  agent_contract_end_date?: string
  has_credentials: boolean
  created_at: string
}

export default function FdaRegistrationsPage() {
  const [registrations, setRegistrations] = useState<FdaRegistration[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    loadRegistrations()
  }, [statusFilter])

  const loadRegistrations = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      if (statusFilter !== "all") params.append("status", statusFilter)
      if (searchQuery) params.append("search", searchQuery)

      console.log("[v0] Loading FDA registrations with params:", params.toString())
      const response = await fetch(`/api/fda-registrations?${params}`)
      const result = await response.json()
      console.log("[v0] FDA registrations loaded:", result)

      if (result.data) {
        setRegistrations(result.data)
        console.log("[v0] Set registrations count:", result.data.length)
      } else {
        console.warn("[v0] No data in response:", result)
      }
    } catch (error) {
      console.error("[v0] Error loading FDA registrations:", error)
      toast.error("Không thể tải danh sách đăng ký FDA")
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = () => {
    loadRegistrations()
  }

  const handleDelete = async (id: string, companyName: string) => {
    if (!confirm(`Bạn có chắc muốn xóa đăng ký của ${companyName}?`)) return

    try {
      const response = await fetch(`/api/fda-registrations/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast.success("Đã xóa đăng ký FDA")
        loadRegistrations()
      } else {
        toast.error("Không thể xóa đăng ký")
      }
    } catch (error) {
      console.error("[v0] Error deleting registration:", error)
      toast.error("Có lỗi xảy ra khi xóa")
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      active: { label: "Đang hoạt động", variant: "default" },
      pending_renewal: { label: "Sắp hết hạn", variant: "secondary" },
      expired: { label: "Đã hết hạn", variant: "destructive" },
      cancelled: { label: "Đã hủy", variant: "outline" },
    }

    const config = statusConfig[status] || statusConfig.active

    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case "pending_renewal":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case "expired":
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  const getDaysUntilExpiration = (expirationDate: string) => {
    const today = new Date()
    const expiry = new Date(expirationDate)
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  // Calculate statistics
  const stats = {
    total: registrations.length,
    active: registrations.filter((r) => r.status === "active").length,
    pendingRenewal: registrations.filter((r) => r.status === "pending_renewal").length,
    expired: registrations.filter((r) => r.status === "expired").length,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Quản lý đăng ký FDA</h1>
            <p className="text-muted-foreground">Theo dõi và quản lý các đăng ký FDA của khách hàng</p>
          </div>
          <Link href="/admin/fda-registrations/new">
            <Button className="bg-transparent">
              <Plus className="w-4 h-4 mr-2" />
              Thêm đăng ký mới
            </Button>
          </Link>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Tổng số</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đang hoạt động</p>
                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Sắp hết hạn</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendingRenewal}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Đã hết hạn</p>
                <p className="text-2xl font-bold text-red-600">{stats.expired}</p>
              </div>
              <XCircle className="w-8 h-8 text-red-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="flex gap-2">
                <Input
                  placeholder="Tìm theo tên công ty hoặc số đăng ký..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                  className="flex-1"
                />
                <Button onClick={handleSearch} className="bg-transparent">
                  <Search className="w-4 h-4 mr-2" />
                  Tìm kiếm
                </Button>
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="active">Đang hoạt động</SelectItem>
                <SelectItem value="pending_renewal">Sắp hết hạn</SelectItem>
                <SelectItem value="expired">Đã hết hạn</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>
      </div>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Trạng thái</TableHead>
              <TableHead>Công ty</TableHead>
              <TableHead>Loại đăng ký</TableHead>
              <TableHead>Số đăng ký</TableHead>
              <TableHead>Ngày hết hạn</TableHead>
              <TableHead>US Agent</TableHead>
              <TableHead>Liên hệ</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Đang tải...
                </TableCell>
              </TableRow>
            ) : registrations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  Không có đăng ký nào
                </TableCell>
              </TableRow>
            ) : (
              registrations.map((reg) => {
                const daysUntilExpiry = getDaysUntilExpiration(reg.expiration_date)
                return (
                  <TableRow key={reg.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(reg.status)}
                        {getStatusBadge(reg.status)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{reg.company_name}</p>
                        {reg.has_credentials && (
                          <Badge variant="outline" className="mt-1 text-xs">
                            🔒 Có credentials
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>{reg.registration_type}</TableCell>
                    <TableCell>{reg.registration_number || "Chưa có"}</TableCell>
                    <TableCell>
                      <div>
                        <p>{new Date(reg.expiration_date).toLocaleDateString("vi-VN")}</p>
                        {daysUntilExpiry > 0 && daysUntilExpiry <= 180 && (
                          <p className="text-xs text-yellow-600 mt-1">Còn {daysUntilExpiry} ngày</p>
                        )}
                        {daysUntilExpiry < 0 && <p className="text-xs text-red-600 mt-1">Quá hạn {Math.abs(daysUntilExpiry)} ngày</p>}
                      </div>
                    </TableCell>
                    <TableCell>
                      {reg.uses_us_agent ? (
                        <div>
                          <Badge variant="secondary">Có</Badge>
                          {reg.agent_contract_end_date && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Đến {new Date(reg.agent_contract_end_date).toLocaleDateString("vi-VN")}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Không</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{reg.contact_name}</p>
                        <p className="text-xs text-muted-foreground">{reg.contact_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/admin/fda-registrations/${reg.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Link href={`/admin/fda-registrations/${reg.id}/edit`}>
                          <Button variant="ghost" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(reg.id, reg.company_name)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}
