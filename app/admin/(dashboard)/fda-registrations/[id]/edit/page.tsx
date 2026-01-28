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
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface FormData {
  company_name: string
  registration_type: string
  registration_number: string
  expiration_date: string
  contact_name: string
  contact_email: string
  contact_phone: string
  company_address: string
  fda_user_id: string
  fda_password: string
  fda_pin: string
  uses_us_agent: boolean
  agent_company_name: string
  agent_name: string
  agent_phone: string
  agent_email: string
  agent_address: string
  agent_contract_start_date: string
  agent_contract_end_date: string
  agent_contract_years: string
  notes: string
  status: string
}

export default function EditFdaRegistrationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [showCredentials, setShowCredentials] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    company_name: "",
    registration_type: "food_facility",
    registration_number: "",
    expiration_date: "",
    contact_name: "",
    contact_email: "",
    contact_phone: "",
    company_address: "",
    fda_user_id: "",
    fda_password: "",
    fda_pin: "",
    uses_us_agent: false,
    agent_company_name: "",
    agent_name: "",
    agent_phone: "",
    agent_email: "",
    agent_address: "",
    agent_contract_start_date: "",
    agent_contract_end_date: "",
    agent_contract_years: "1",
    notes: "",
    status: "active",
  })

  useEffect(() => {
    loadRegistration()
  }, [params.id])

  // Auto-calculate agent contract end date
  useEffect(() => {
    if (formData.agent_contract_start_date && formData.agent_contract_years) {
      const startDate = new Date(formData.agent_contract_start_date)
      const years = parseInt(formData.agent_contract_years)
      const endDate = new Date(startDate)
      endDate.setFullYear(endDate.getFullYear() + years)

      const endDateString = endDate.toISOString().split("T")[0]

      if (endDateString !== formData.agent_contract_end_date) {
        setFormData((prev) => ({ ...prev, agent_contract_end_date: endDateString }))
      }
    }
  }, [formData.agent_contract_start_date, formData.agent_contract_years])

  const loadRegistration = async () => {
    try {
      setInitialLoading(true)
      const response = await fetch(`/api/fda-registrations/${params.id}`)
      const result = await response.json()

      if (result.data) {
        const reg = result.data
        setFormData({
          company_name: reg.company_name || "",
          registration_type: reg.registration_type || "food_facility",
          registration_number: reg.registration_number || "",
          expiration_date: reg.expiration_date || "",
          contact_name: reg.contact_name || "",
          contact_email: reg.contact_email || "",
          contact_phone: reg.contact_phone || "",
          company_address: reg.company_address || "",
          fda_user_id: reg.fda_user_id || "",
          fda_password: reg.fda_password || "",
          fda_pin: reg.fda_pin || "",
          uses_us_agent: reg.uses_us_agent || false,
          agent_company_name: reg.agent_company_name || "",
          agent_name: reg.agent_name || "",
          agent_phone: reg.agent_phone || "",
          agent_email: reg.agent_email || "",
          agent_address: reg.agent_address || "",
          agent_contract_start_date: reg.agent_contract_start_date || "",
          agent_contract_end_date: reg.agent_contract_end_date || "",
          agent_contract_years: String(reg.agent_contract_years || 1),
          notes: reg.notes || "",
          status: reg.status || "active",
        })
      } else {
        toast.error("Không tìm thấy đăng ký")
        router.push("/admin/fda-registrations")
      }
    } catch (error) {
      console.error("Error loading registration:", error)
      toast.error("Không thể tải thông tin đăng ký")
    } finally {
      setInitialLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.company_name || !formData.expiration_date) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc")
      return
    }

    try {
      setLoading(true)
      const response = await fetch(`/api/fda-registrations/${params.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success("Đã cập nhật đăng ký FDA")
        router.push(`/admin/fda-registrations/${params.id}`)
      } else {
        toast.error(result.error || "Không thể cập nhật đăng ký")
      }
    } catch (error) {
      console.error("Error updating registration:", error)
      toast.error("Có lỗi xảy ra")
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <div className="p-8">
        <div className="text-center py-8">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="mb-6">
        <Link href={`/admin/fda-registrations/${params.id}`}>
          <Button variant="ghost" className="mb-4 bg-transparent">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-primary mb-2">Chỉnh sửa đăng ký FDA</h1>
        <p className="text-muted-foreground">Cập nhật thông tin đăng ký FDA</p>
      </div>

      <form onSubmit={handleSubmit}>
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
            </div>
            <div>
              <Label htmlFor="status">Trạng thái</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Đang hoạt động</SelectItem>
                  <SelectItem value="pending_renewal">Sắp hết hạn</SelectItem>
                  <SelectItem value="expired">Đã hết hạn</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label htmlFor="company_address">Địa chỉ cơ sở</Label>
              <Textarea
                id="company_address"
                placeholder="Địa chỉ đầy đủ của cơ sở sản xuất/phân phối"
                value={formData.company_address}
                onChange={(e) => setFormData({ ...formData, company_address: e.target.value })}
                rows={2}
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

        {/* Thông tin đăng nhập FDA */}
        <Card className="p-6 mb-6 border-yellow-200 bg-yellow-50">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-xl font-semibold text-yellow-900">🔒 Thông tin đăng nhập FDA</h2>
              <p className="text-sm text-yellow-700 mt-1">Thông tin được mã hóa AES-256 theo chuẩn ISO 27001</p>
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

        {/* US Agent */}
        <Card className="p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">US Agent</h2>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="uses_us_agent"
                checked={formData.uses_us_agent}
                onCheckedChange={(checked) => setFormData({ ...formData, uses_us_agent: checked as boolean })}
              />
              <Label htmlFor="uses_us_agent" className="cursor-pointer">
                Sử dụng US Agent
              </Label>
            </div>
          </div>

          {formData.uses_us_agent && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="agent_company_name">Công ty US Agent</Label>
                <Input
                  id="agent_company_name"
                  value={formData.agent_company_name}
                  onChange={(e) => setFormData({ ...formData, agent_company_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="agent_name">Tên US Agent</Label>
                <Input
                  id="agent_name"
                  value={formData.agent_name}
                  onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="agent_phone">Số điện thoại</Label>
                <Input
                  id="agent_phone"
                  type="tel"
                  value={formData.agent_phone}
                  onChange={(e) => setFormData({ ...formData, agent_phone: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="agent_email">Email liên hệ</Label>
                <Input
                  id="agent_email"
                  type="email"
                  value={formData.agent_email}
                  onChange={(e) => setFormData({ ...formData, agent_email: e.target.value })}
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="agent_address">Địa chỉ US Agent</Label>
                <Textarea
                  id="agent_address"
                  value={formData.agent_address}
                  onChange={(e) => setFormData({ ...formData, agent_address: e.target.value })}
                  rows={2}
                />
              </div>
              <div>
                <Label htmlFor="agent_contract_start_date">Ngày bắt đầu hợp đồng</Label>
                <Input
                  id="agent_contract_start_date"
                  type="date"
                  value={formData.agent_contract_start_date}
                  onChange={(e) => setFormData({ ...formData, agent_contract_start_date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="agent_contract_years">Thời hạn hợp đồng (năm)</Label>
                <Select
                  value={formData.agent_contract_years}
                  onValueChange={(value) => setFormData({ ...formData, agent_contract_years: value })}
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
          <Link href={`/admin/fda-registrations/${params.id}`}>
            <Button type="button" variant="outline">
              Hủy
            </Button>
          </Link>
          <Button type="submit" disabled={loading}>
            <Save className="w-4 h-4 mr-2" />
            {loading ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </div>
      </form>
    </div>
  )
}
