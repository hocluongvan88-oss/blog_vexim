"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "sonner"

interface Client {
  id: string
  company_name: string
  contact_name: string
  email: string
}

export default function NewFdaRegistrationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [clients, setClients] = useState<Client[]>([])
  const [showCredentials, setShowCredentials] = useState(false)
  const [loadingClient, setLoadingClient] = useState(false)
  
  const [formData, setFormData] = useState({
    client_id: "",
    company_name: "",
    registration_type: "food_facility",
    registration_number: "",
    expiration_date: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    address: "",
    fda_user_id: "",
    fda_password: "",
    fda_pin: "",
    uses_us_agent: false,
    us_agent_id: "",
    us_agent_name: "",
    us_agent_company: "",
    us_agent_phone: "",
    us_agent_email: "",
    us_agent_address: "",
    agent_contract_start_date: "",
    agent_contract_end_date: "",
    agent_contract_years: "1",
    notes: "",
  })

  useEffect(() => {
    loadClients()
  }, [])

  // Auto-load client from URL query parameter
  useEffect(() => {
    const clientId = searchParams.get("client_id")
    if (clientId && clients.length > 0) {
      console.log("[v0] Auto-loading client from URL:", clientId)
      handleClientChange(clientId)
    }
  }, [searchParams, clients])

  // Auto-calculate agent contract end date when start date or years change
  useEffect(() => {
    if (formData.agent_contract_start_date && formData.agent_contract_years) {
      const startDate = new Date(formData.agent_contract_start_date)
      const years = parseInt(formData.agent_contract_years)
      const endDate = new Date(startDate)
      endDate.setFullYear(endDate.getFullYear() + years)
      
      // Format to YYYY-MM-DD for input[type="date"]
      const endDateString = endDate.toISOString().split('T')[0]
      
      if (endDateString !== formData.agent_contract_end_date) {
        setFormData(prev => ({ ...prev, agent_contract_end_date: endDateString }))
      }
    }
  }, [formData.agent_contract_start_date, formData.agent_contract_years])

  const loadClients = async () => {
    try {
      const response = await fetch("/api/clients")
      const result = await response.json()
      console.log("[v0] Loaded clients:", result)
      if (result.clients) {
        setClients(result.clients)
      }
    } catch (error) {
      console.error("[v0] Error loading clients:", error)
      toast.error("Không thể tải danh sách khách hàng")
    }
  }

  const handleClientChange = (clientId: string) => {
    const client = clients.find((c) => c.id === clientId)
    if (client) {
      setFormData({
        ...formData,
        client_id: clientId,
        company_name: client.company_name,
        contact_name: client.contact_name,
        contact_email: client.email,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.client_id) {
      toast.error("Vui lòng chọn khách hàng")
      return
    }

    if (!formData.company_name || !formData.expiration_date) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    if (!formData.address) {
      toast.error("Vui lòng nhập địa chỉ cơ sở")
      return
    }

    try {
      setLoading(true)
      console.log("[v0] Submitting FDA registration:", { ...formData, fda_password: "***", fda_pin: "***" })
      
      const response = await fetch("/api/fda-registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()
      console.log("[v0] API response:", result)

      if (response.ok) {
        toast.success("Đã tạo đăng ký FDA thành công")
        router.push("/admin/fda-registrations")
      } else {
        console.error("[v0] API error:", result)
        toast.error(result.error || "Không thể tạo đăng ký")
      }
    } catch (error) {
      console.error("[v0] Error creating registration:", error)
      toast.error("Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
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
        <h1 className="text-3xl font-bold text-primary mb-2">Thêm đăng ký FDA mới</h1>
        <p className="text-muted-foreground">Nhập thông tin đăng ký FDA cho khách hàng</p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Chọn khách hàng */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Chọn khách hàng</h2>
          <div className="space-y-4">
            <div>
              <Label htmlFor="client_id">
                Khách hàng <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.client_id} onValueChange={handleClientChange} required>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn khách hàng..." />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.company_name} - {client.contact_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-sm text-muted-foreground mt-1">
                Chọn khách hàng để tự động điền thông tin công ty
              </p>
            </div>
          </div>
        </Card>

        {/* Thông tin cơ sở */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin cơ sở</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="company_name">
                Tên công ty <span className="text-red-500">*</span>
              </Label>
              <Input
                id="company_name"
                value={formData.company_name}
                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                required
              />
            </div>
            <div>
              <Label htmlFor="registration_type">
                Loại đăng ký <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.registration_type}
                onValueChange={(value) => setFormData({ ...formData, registration_type: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="food_facility">Food Facility Registration</SelectItem>
                  <SelectItem value="drug_establishment">Drug Establishment Registration</SelectItem>
                  <SelectItem value="device_establishment">Device Establishment Registration</SelectItem>
                  <SelectItem value="cosmetic_facility">Cosmetic Facility Registration</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="registration_number">Số đăng ký FDA</Label>
              <Input
                id="registration_number"
                placeholder="VD: 12345678910"
                value={formData.registration_number}
                onChange={(e) => setFormData({ ...formData, registration_number: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="expiration_date">
                Ngày hết hạn <span className="text-red-500">*</span>
              </Label>
              <Input
                id="expiration_date"
                type="date"
                value={formData.expiration_date}
                onChange={(e) => setFormData({ ...formData, expiration_date: e.target.value })}
                required
              />
              <p className="text-sm text-muted-foreground mt-1">
                Thường là các năm chẵn (2024, 2026...)
              </p>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="address">
                Địa chỉ cơ sở <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="address"
                placeholder="Địa chỉ đầy đủ của cơ sở sản xuất/phân phối"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                rows={2}
                required
              />
            </div>
          </div>
        </Card>

        {/* Thông tin liên hệ */}
        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Thông tin liên hệ</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="contact_name">Người liên hệ</Label>
              <Input
                id="contact_name"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contact_email">Email liên hệ</Label>
              <Input
                id="contact_email"
                type="email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contact_phone">Số điện thoại</Label>
              <Input
                id="contact_phone"
                value={formData.contact_phone}
                onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* Thông tin đăng nhập FDA (mã hóa) */}
        <Card className="p-6 mb-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-yellow-900">🔒 Thông tin đăng nhập FDA</h2>
              <p className="text-sm text-yellow-700 mt-1">
                Thông tin này được mã hóa AES-256 theo chuẩn ISO 27001
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
              <Label htmlFor="fda_user_id">FDA User ID</Label>
              <Input
                id="fda_user_id"
                type={showCredentials ? "text" : "password"}
                placeholder="FDA User ID"
                value={formData.fda_user_id}
                onChange={(e) => setFormData({ ...formData, fda_user_id: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fda_password">FDA Password</Label>
              <Input
                id="fda_password"
                type={showCredentials ? "text" : "password"}
                placeholder="FDA Password"
                value={formData.fda_password}
                onChange={(e) => setFormData({ ...formData, fda_password: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fda_pin">FDA PIN</Label>
              <Input
                id="fda_pin"
                type={showCredentials ? "text" : "password"}
                placeholder="FDA PIN"
                value={formData.fda_pin}
                onChange={(e) => setFormData({ ...formData, fda_pin: e.target.value })}
              />
            </div>
          </div>
        </Card>

        {/* US Agent Information */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">US Agent</h2>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uses_us_agent"
                checked={formData.uses_us_agent}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, uses_us_agent: checked as boolean })
                }
              />
              <Label htmlFor="uses_us_agent" className="cursor-pointer">
                Sử dụng US Agent
              </Label>
            </div>
          </div>

          {formData.uses_us_agent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="us_agent_id">U.S. Agent ID</Label>
                <Input
                  id="us_agent_id"
                  value={formData.us_agent_id}
                  onChange={(e) => setFormData({ ...formData, us_agent_id: e.target.value })}
                  placeholder="USID4471964"
                />
              </div>
              <div>
                <Label htmlFor="us_agent_company">Công ty US Agent</Label>
                <Input
                  id="us_agent_company"
                  value={formData.us_agent_company}
                  onChange={(e) => setFormData({ ...formData, us_agent_company: e.target.value })}
                  placeholder="Vexim Global"
                />
              </div>
              <div>
                <Label htmlFor="us_agent_name">Tên US Agent</Label>
                <Input
                  id="us_agent_name"
                  value={formData.us_agent_name}
                  onChange={(e) => setFormData({ ...formData, us_agent_name: e.target.value })}
                  placeholder="Richard Luong"
                />
              </div>
              <div>
                <Label htmlFor="us_agent_phone">Số điện thoại</Label>
                <Input
                  id="us_agent_phone"
                  type="tel"
                  value={formData.us_agent_phone}
                  onChange={(e) => setFormData({ ...formData, us_agent_phone: e.target.value })}
                  placeholder="+18122276268"
                />
              </div>
              <div>
                <Label htmlFor="us_agent_email">Email liên hệ</Label>
                <Input
                  id="us_agent_email"
                  type="email"
                  value={formData.us_agent_email}
                  onChange={(e) => setFormData({ ...formData, us_agent_email: e.target.value })}
                  placeholder="richardluong2788@gmail.com"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="us_agent_address">Địa chỉ US Agent</Label>
                <Textarea
                  id="us_agent_address"
                  value={formData.us_agent_address}
                  onChange={(e) => setFormData({ ...formData, us_agent_address: e.target.value })}
                  rows={2}
                  placeholder="1207 Delaware Ave #000, Wilmington"
                />
              </div>
              <div>
                <Label htmlFor="agent_contract_start_date">Ngày bắt đầu hợp đồng</Label>
                <Input
                  id="agent_contract_start_date"
                  type="date"
                  value={formData.agent_contract_start_date}
                  onChange={(e) =>
                    setFormData({ ...formData, agent_contract_start_date: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="agent_contract_years">Thời hạn hợp đồng (năm)</Label>
                <Select
                  value={formData.agent_contract_years}
                  onValueChange={(value) =>
                    setFormData({ ...formData, agent_contract_years: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 năm</SelectItem>
                    <SelectItem value="2">2 năm</SelectItem>
                    <SelectItem value="3">3 năm</SelectItem>
                    <SelectItem value="4">4 năm</SelectItem>
                    <SelectItem value="5">5 năm</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="agent_contract_end_date">Ngày kết thúc hợp đồng</Label>
                <Input
                  id="agent_contract_end_date"
                  type="date"
                  value={formData.agent_contract_end_date}
                  readOnly
                  className="bg-muted cursor-not-allowed"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Hệ thống sẽ nhắc nhở trước 3-6 tháng
                </p>
              </div>
            </div>
          )}
        </Card>

        {/* Ghi chú */}
        <Card className="p-6 mb-6">
          <div>
            <Label htmlFor="notes">Ghi chú</Label>
            <Textarea
              id="notes"
              placeholder="Ghi chú thêm về đăng ký này..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={4}
            />
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-4">
          <Link href="/admin/fda-registrations">
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Đang tạo..." : "Tạo đăng ký"}
          </Button>
        </div>
      </form>
    </div>
  )
}
