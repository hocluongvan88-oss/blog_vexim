"use client"

import React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Building2, FileText, LogOut, Calendar, AlertCircle, CheckCircle2, Clock } from "lucide-react"
import { toast } from "sonner"

interface ClientData {
  id: string
  email: string
  company_name: string
  contact_name: string
  phone?: string
  address?: string
}

interface FDARegistration {
  id: string
  company_name: string
  registration_number?: string
  fei_number?: string
  registration_type: string
  expiration_date: string
  next_renewal_date?: string
  status: string
  facility_type?: string
  product_categories?: string[]
}

export default function ClientPortalPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoginLoading, setIsLoginLoading] = useState(false)
  const [client, setClient] = useState<ClientData | null>(null)
  const [registrations, setRegistrations] = useState<FDARegistration[]>([])
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadRegistrations()
    }
  }, [isAuthenticated])

  const checkAuth = async () => {
    try {
      console.log("[v0] Checking client authentication...")
      const response = await fetch("/api/client-auth/me")
      
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Client authenticated:", data.client)
        setClient(data.client)
        setIsAuthenticated(true)
      } else {
        console.log("[v0] Client not authenticated")
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error("[v0] Error checking auth:", error)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoginLoading(true)

    try {
      console.log("[v0] Attempting client login:", email)
      const response = await fetch("/api/client-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()
      console.log("[v0] Login response:", { ...data, token: "***" })

      if (response.ok) {
        setClient(data.client)
        setIsAuthenticated(true)
        toast.success("Đăng nhập thành công!")
      } else {
        console.error("[v0] Login failed:", data)
        setError(data.error || "Đăng nhập thất bại")
      }
    } catch (error) {
      console.error("[v0] Login error:", error)
      setError("Có lỗi xảy ra khi đăng nhập")
    } finally {
      setIsLoginLoading(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/client-auth/logout", { method: "POST" })
      setClient(null)
      setIsAuthenticated(false)
      setRegistrations([])
      toast.success("Đã đăng xuất")
    } catch (error) {
      console.error("[v0] Logout error:", error)
    }
  }

  const loadRegistrations = async () => {
    try {
      console.log("[v0] Loading client FDA registrations...")
      const response = await fetch("/api/client-auth/registrations")
      
      if (response.ok) {
        const data = await response.json()
        console.log("[v0] Loaded registrations:", data.registrations?.length || 0)
        setRegistrations(data.registrations || [])
      } else {
        console.error("[v0] Failed to load registrations:", await response.text())
      }
    } catch (error) {
      console.error("[v0] Error loading registrations:", error)
    }
  }

  const getStatusBadge = (registration: FDARegistration) => {
    const expirationDate = new Date(registration.expiration_date)
    const now = new Date()
    const daysUntilExpiry = Math.ceil((expirationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) {
      return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> Đã hết hạn</Badge>
    } else if (daysUntilExpiry <= 90) {
      return <Badge variant="outline" className="flex items-center gap-1 border-orange-500 text-orange-600"><Clock className="w-3 h-3" /> Sắp hết hạn</Badge>
    } else {
      return <Badge variant="outline" className="flex items-center gap-1 border-green-500 text-green-600"><CheckCircle2 className="w-3 h-3" /> Còn hiệu lực</Badge>
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-emerald-600 text-white p-3 rounded-full">
                <Building2 className="w-8 h-8" />
              </div>
            </div>
            <CardTitle className="text-2xl text-center">Cổng thông tin Khách hàng</CardTitle>
            <CardDescription className="text-center">
              Đăng nhập để xem thông tin đăng ký FDA của bạn
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoginLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoginLoading}
                />
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isLoginLoading}>
                {isLoginLoading ? "Đang đăng nhập..." : "Đăng nhập"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto p-4 py-8 max-w-6xl">
        {/* Header */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">{client?.company_name}</h1>
                <p className="text-muted-foreground">
                  <span className="font-medium">{client?.contact_name}</span> • {client?.email}
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* FDA Registrations */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Danh sách đăng ký FDA
                </CardTitle>
                <CardDescription>
                  Quản lý và theo dõi các đăng ký FDA của công ty bạn
                </CardDescription>
              </div>
              <Badge variant="secondary" className="text-lg px-4 py-2">
                {registrations.length} đăng ký
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {registrations.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground text-lg mb-2">Chưa có đăng ký FDA nào</p>
                <p className="text-sm text-muted-foreground">
                  Liên hệ với chúng tôi để được tư vấn và hỗ trợ đăng ký FDA
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {registrations.map((reg) => (
                  <Card key={reg.id} className="border-2">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-1">{reg.company_name}</h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{reg.registration_type}</Badge>
                            {reg.facility_type && <Badge variant="secondary">{reg.facility_type}</Badge>}
                          </div>
                        </div>
                        {getStatusBadge(reg)}
                      </div>

                      <Separator className="my-4" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {reg.registration_number && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Số đăng ký</p>
                            <p className="font-mono font-medium">{reg.registration_number}</p>
                          </div>
                        )}
                        
                        {reg.fei_number && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Số FEI</p>
                            <p className="font-mono font-medium">{reg.fei_number}</p>
                          </div>
                        )}

                        <div>
                          <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> Ngày hết hạn
                          </p>
                          <p className="font-medium">
                            {new Date(reg.expiration_date).toLocaleDateString("vi-VN")}
                          </p>
                        </div>

                        {reg.next_renewal_date && (
                          <div>
                            <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> Gia hạn tiếp theo
                            </p>
                            <p className="font-medium">
                              {new Date(reg.next_renewal_date).toLocaleDateString("vi-VN")}
                            </p>
                          </div>
                        )}
                      </div>

                      {reg.product_categories && reg.product_categories.length > 0 && (
                        <div className="mt-4">
                          <p className="text-sm text-muted-foreground mb-2">Danh mục sản phẩm</p>
                          <div className="flex flex-wrap gap-2">
                            {reg.product_categories.map((category, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {category}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
