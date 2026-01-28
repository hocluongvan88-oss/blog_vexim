"use client"

import React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  Building2, FileText, LogOut, Calendar, AlertCircle, CheckCircle2, 
  Clock, Shield, Mail, Phone, User, Eye, EyeOff, 
  Download, HelpCircle, Newspaper, ExternalLink,
  CheckCircle, LayoutDashboard, FolderOpen, Headphones, ChevronRight,
  Bell, TrendingUp, ArrowRight, Home
} from "lucide-react"
import { toast } from "sonner"
import Link from "next/link"

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
  contact_name?: string
  contact_email?: string
  contact_phone?: string
  address?: string
  has_credentials?: boolean
  fda_user_id?: string
  uses_us_agent?: boolean
  us_agent_company?: string
  agent_contract_start_date?: string
  agent_contract_end_date?: string
  renewal_reminder_days?: number
  notes?: string
  us_agent_name?: string
}

interface NewsItem {
  id: string
  source: string
  title: string
  summary: string
  articleUrl: string
  publishedDate: string
  relevance: string
  categories: string[]
  aiAnalysis?: any
  createdAt: string
}

interface ClientDocument {
  id: string
  title: string
  description?: string
  document_type: string
  file_name: string
  file_url: string
  file_size?: number
  mime_type?: string
  created_at: string
  fda_registrations?: {
    company_name: string
    registration_type: string
    registration_number?: string
  }
}

type TabType = "overview" | "news" | "documents" | "support"

export default function ClientPortal() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [clientData, setClientData] = useState<ClientData | null>(null)
  const [registrations, setRegistrations] = useState<FDARegistration[]>([])
  const [news, setNews] = useState<NewsItem[]>([])
  const [documents, setDocuments] = useState<ClientDocument[]>([])
  const [activeTab, setActiveTab] = useState<TabType>("overview")
  const [showPassword, setShowPassword] = useState(false)
  const [unreadNewsCount, setUnreadNewsCount] = useState(0)

  // Login state
  const [loginEmail, setLoginEmail] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isLoggedIn) {
      loadClientData()
      loadNews()
      loadDocuments()
    }
  }, [isLoggedIn])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/client-auth/me")
      if (response.ok) {
        const data = await response.json()
        setClientData(data.client)
        setIsLoggedIn(true)
      }
    } catch (error) {
      console.error("Auth check error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadClientData = async () => {
    try {
      const response = await fetch("/api/client-auth/registrations")
      if (response.ok) {
        const data = await response.json()
        setRegistrations(data.registrations || [])
      }
    } catch (error) {
      console.error("Error loading registrations:", error)
    }
  }

  const loadNews = async () => {
    try {
      const response = await fetch("/api/client-auth/news")
      if (response.ok) {
        const data = await response.json()
        setNews(data.news || [])
        setUnreadNewsCount(data.news?.length || 0)
      }
    } catch (error) {
      console.error("Error loading news:", error)
    }
  }

  const loadDocuments = async () => {
    try {
      const response = await fetch("/api/client-auth/documents")
      if (response.ok) {
        const data = await response.json()
        setDocuments(data.documents || [])
      }
    } catch (error) {
      console.error("Error loading documents:", error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)

    try {
      const response = await fetch("/api/client-auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("Dang nhap thanh cong!")
        setClientData(data.client)
        setIsLoggedIn(true)
      } else {
        toast.error(data.error || "Dang nhap that bai")
      }
    } catch (error) {
      toast.error("Loi ket noi. Vui long thu lai.")
    } finally {
      setIsLoggingIn(false)
    }
  }

  const handleLogout = async () => {
    try {
      await fetch("/api/client-auth/logout", { method: "POST" })
      setIsLoggedIn(false)
      setClientData(null)
      setRegistrations([])
      setNews([])
      setDocuments([])
      toast.success("Da dang xuat")
      router.push("/")
    } catch (error) {
      toast.error("Loi khi dang xuat")
    }
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return "N/A"
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "certificate": return <CheckCircle className="w-5 h-5 text-emerald-600" />
      case "contract": return <FileText className="w-5 h-5 text-blue-600" />
      case "invoice": return <FileText className="w-5 h-5 text-orange-600" />
      default: return <FileText className="w-5 h-5 text-gray-600" />
    }
  }

  // Calculate stats
  const activeRegistrations = registrations.filter(r => r.status === "active").length
  const expiringCount = registrations.filter(r => {
    const days = Math.ceil((new Date(r.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days <= 90 && days > 0
  }).length

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 text-sm">Dang tai...</p>
        </div>
      </div>
    )
  }

  // Login form - Modern split layout
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-12 flex-col justify-between relative overflow-hidden">
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-300 rounded-full blur-3xl" />
          </div>
          
          <div className="relative z-10">
            <Link href="/" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-12">
              <Home className="w-4 h-4" />
              <span className="text-sm">Trang chu</span>
            </Link>
            <h1 className="text-4xl font-bold text-white mb-4">
              Client Portal
            </h1>
            <p className="text-emerald-100 text-lg max-w-md">
              Quan ly dang ky FDA va theo doi tinh trang cua doanh nghiep ban tai mot noi duy nhat.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Bao mat cao</h3>
                <p className="text-emerald-100 text-sm">Du lieu duoc ma hoa va bao ve an toan</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Thong bao tu dong</h3>
                <p className="text-emerald-100 text-sm">Nhan canh bao gia han truoc 90 ngay</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Theo doi realtime</h3>
                <p className="text-emerald-100 text-sm">Cap nhat tinh trang dang ky theo thoi gian thuc</p>
              </div>
            </div>
          </div>

          <div className="relative z-10">
            <p className="text-emerald-100 text-sm">
              &copy; 2025 Vexim Global. All rights reserved.
            </p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
          <div className="w-full max-w-md">
            {/* Mobile logo */}
            <div className="lg:hidden mb-8 text-center">
              <Link href="/" className="inline-block">
                <span className="text-2xl font-bold">
                  <span className="text-gray-900">VEXIM</span>
                  <span className="text-emerald-600 ml-1">GLOBAL</span>
                </span>
              </Link>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Dang nhap</h2>
              <p className="text-gray-500">Nhap thong tin tai khoan de truy cap portal</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@company.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="h-12 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Mat khau</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhap mat khau"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                    className="h-12 bg-white border-gray-200 focus:border-emerald-500 focus:ring-emerald-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <Button
                type="submit"
                className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Dang xu ly...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Dang nhap
                    <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-center text-gray-500">
                Quen mat khau? Lien he{" "}
                <a href="mailto:contact@veximglobal.com" className="text-emerald-600 hover:text-emerald-700 font-medium">
                  contact@veximglobal.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Dashboard - Modern sidebar layout
  const navItems = [
    { id: "overview" as TabType, label: "Tong quan", icon: LayoutDashboard },
    { id: "news" as TabType, label: "Tin tuc FDA", icon: Newspaper, badge: unreadNewsCount },
    { id: "documents" as TabType, label: "Tai lieu", icon: FolderOpen },
    { id: "support" as TabType, label: "Ho tro", icon: Headphones },
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-64 bg-white border-r border-gray-200 flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100">
          <Link href="/" className="inline-block">
            <span className="text-xl font-bold">
              <span className="text-gray-900">VEXIM</span>
              <span className="text-emerald-600 ml-1">GLOBAL</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all ${
                    activeTab === item.id
                      ? "bg-emerald-50 text-emerald-700 font-medium"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-600 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{clientData?.contact_name}</p>
              <p className="text-xs text-gray-500 truncate">{clientData?.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full justify-center gap-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 bg-transparent"
          >
            <LogOut className="w-4 h-4" />
            Dang xuat
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Mobile menu */}
              <div className="lg:hidden">
                <Link href="/" className="text-lg font-bold">
                  <span className="text-gray-900">VEXIM</span>
                  <span className="text-emerald-600 ml-1">GLOBAL</span>
                </Link>
              </div>
              <div className="hidden lg:block">
                <h1 className="text-xl font-semibold text-gray-900">{clientData?.company_name}</h1>
                <p className="text-sm text-gray-500">Quan ly dang ky FDA</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="lg:hidden gap-2 bg-transparent"
              >
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile navigation */}
          <div className="lg:hidden mt-4 flex gap-2 overflow-x-auto pb-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm whitespace-nowrap transition-all ${
                  activeTab === item.id
                    ? "bg-emerald-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
                {item.badge && item.badge > 0 && (
                  <span className={`px-1.5 py-0.5 text-xs font-medium rounded-full ${
                    activeTab === item.id ? "bg-white/20 text-white" : "bg-red-100 text-red-600"
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center">
                        <FileText className="w-6 h-6 text-emerald-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{registrations.length}</p>
                        <p className="text-sm text-gray-500">Tong dang ky</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{activeRegistrations}</p>
                        <p className="text-sm text-gray-500">Con hieu luc</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        expiringCount > 0 ? "bg-orange-100" : "bg-gray-100"
                      }`}>
                        <Clock className={`w-6 h-6 ${expiringCount > 0 ? "text-orange-600" : "text-gray-400"}`} />
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-gray-900">{expiringCount}</p>
                        <p className="text-sm text-gray-500">Sap het han</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Registrations */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Danh sach dang ky FDA</h2>
                </div>

                {registrations.length === 0 ? (
                  <Card className="border-0 shadow-sm">
                    <CardContent className="py-16">
                      <div className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <FileText className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Chua co dang ky FDA nao</h3>
                        <p className="text-gray-500 max-w-sm mx-auto">
                          Lien he voi chung toi de duoc tu van va dang ky FDA cho doanh nghiep cua ban.
                        </p>
                        <Button className="mt-6 bg-emerald-600 hover:bg-emerald-700">
                          Lien he tu van
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid gap-4">
                    {registrations.map((reg) => {
                      const fdaDaysLeft = Math.ceil(
                        (new Date(reg.expiration_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
                      )
                      const agentDaysLeft = reg.agent_contract_end_date
                        ? Math.ceil(
                            (new Date(reg.agent_contract_end_date).getTime() - new Date().getTime()) /
                              (1000 * 60 * 60 * 24)
                          )
                        : null

                      const getStatusConfig = (days: number) => {
                        if (days <= 30) return { color: "red", label: "Sap het han" }
                        if (days <= 90) return { color: "orange", label: "Can gia han" }
                        return { color: "emerald", label: "Con hieu luc" }
                      }

                      const statusConfig = getStatusConfig(fdaDaysLeft)

                      return (
                        <Card key={reg.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-6">
                              {/* Company info */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start gap-3 mb-3">
                                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    <Building2 className="w-5 h-5 text-emerald-600" />
                                  </div>
                                  <div className="min-w-0">
                                    <h3 className="font-semibold text-gray-900 truncate">{reg.company_name}</h3>
                                    <p className="text-sm text-gray-500">{reg.registration_type}</p>
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <p className="text-gray-500 mb-1">So dang ky</p>
                                    <p className="font-mono font-medium text-gray-900">
                                      {reg.registration_number || "Dang xu ly"}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-500 mb-1">Ngay het han</p>
                                    <p className="font-medium text-gray-900">
                                      {new Date(reg.expiration_date).toLocaleDateString("vi-VN")}
                                    </p>
                                  </div>
                                </div>
                              </div>

                              {/* Countdown cards */}
                              <div className="flex flex-col sm:flex-row gap-3 lg:w-auto">
                                {/* FDA Timer */}
                                <div className={`rounded-xl p-4 min-w-[160px] ${
                                  statusConfig.color === "red" ? "bg-red-50" :
                                  statusConfig.color === "orange" ? "bg-orange-50" : "bg-emerald-50"
                                }`}>
                                  <div className="flex items-center gap-2 mb-2">
                                    <Calendar className={`w-4 h-4 ${
                                      statusConfig.color === "red" ? "text-red-600" :
                                      statusConfig.color === "orange" ? "text-orange-600" : "text-emerald-600"
                                    }`} />
                                    <span className="text-xs font-medium text-gray-600">FDA</span>
                                  </div>
                                  <p className={`text-2xl font-bold ${
                                    statusConfig.color === "red" ? "text-red-600" :
                                    statusConfig.color === "orange" ? "text-orange-600" : "text-emerald-600"
                                  }`}>
                                    {fdaDaysLeft > 0 ? fdaDaysLeft : 0}
                                  </p>
                                  <p className="text-xs text-gray-500">ngay con lai</p>
                                </div>

                                {/* Agent Timer */}
                                {reg.uses_us_agent && agentDaysLeft !== null && (
                                  <div className={`rounded-xl p-4 min-w-[160px] ${
                                    agentDaysLeft <= 30 ? "bg-red-50" :
                                    agentDaysLeft <= 60 ? "bg-orange-50" : "bg-blue-50"
                                  }`}>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Shield className={`w-4 h-4 ${
                                        agentDaysLeft <= 30 ? "text-red-600" :
                                        agentDaysLeft <= 60 ? "text-orange-600" : "text-blue-600"
                                      }`} />
                                      <span className="text-xs font-medium text-gray-600">US Agent</span>
                                    </div>
                                    <p className={`text-2xl font-bold ${
                                      agentDaysLeft <= 30 ? "text-red-600" :
                                      agentDaysLeft <= 60 ? "text-orange-600" : "text-blue-600"
                                    }`}>
                                      {agentDaysLeft > 0 ? agentDaysLeft : 0}
                                    </p>
                                    <p className="text-xs text-gray-500">ngay con lai</p>
                                  </div>
                                )}
                              </div>

                              {/* Status badge */}
                              <div className="flex items-center gap-2">
                                <Badge className={`${
                                  reg.status === "active"
                                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                    : "bg-red-100 text-red-700 hover:bg-red-100"
                                } border-0 px-3 py-1`}>
                                  {reg.status === "active" ? (
                                    <><CheckCircle2 className="w-3 h-3 mr-1" /> Con hieu luc</>
                                  ) : (
                                    <><AlertCircle className="w-3 h-3 mr-1" /> Het han</>
                                  )}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* News Tab */}
          {activeTab === "news" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Tin tuc & Canh bao FDA</h2>
                <p className="text-sm text-gray-500">Cap nhat moi nhat tu FDA lien quan den san pham cua ban</p>
              </div>

              {news.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-16">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <Newspaper className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Chua co tin tuc moi</h3>
                      <p className="text-gray-500">Chung toi se thong bao khi co tin tuc moi lien quan</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {news.map((item) => (
                    <Card key={item.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                            item.relevance === "high" ? "bg-red-100" : "bg-blue-100"
                          }`}>
                            <Newspaper className={`w-5 h-5 ${
                              item.relevance === "high" ? "text-red-600" : "text-blue-600"
                            }`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {item.source}
                              </Badge>
                              <Badge className={`text-xs border-0 ${
                                item.relevance === "high" 
                                  ? "bg-red-100 text-red-700" 
                                  : "bg-orange-100 text-orange-700"
                              }`}>
                                {item.relevance === "high" ? "Quan trong" : "Trung binh"}
                              </Badge>
                              {item.categories?.slice(0, 2).map((cat) => (
                                <Badge key={cat} variant="secondary" className="text-xs">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{item.title}</h3>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{item.summary}</p>
                            <div className="flex items-center gap-4 text-sm">
                              <span className="text-gray-400">
                                {new Date(item.publishedDate).toLocaleDateString("vi-VN")}
                              </span>
                              <a
                                href={item.articleUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium"
                              >
                                Xem chi tiet
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Documents Tab */}
          {activeTab === "documents" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Tai lieu & Chung nhan</h2>
                <p className="text-sm text-gray-500">Tai xuong cac tai lieu va chung nhan FDA cua ban</p>
              </div>

              {documents.length === 0 ? (
                <Card className="border-0 shadow-sm">
                  <CardContent className="py-16">
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                        <FolderOpen className="w-8 h-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Chua co tai lieu nao</h3>
                      <p className="text-gray-500">Tai lieu se duoc cap nhat sau khi hoan thanh dang ky</p>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid gap-4">
                  {documents.map((doc) => (
                    <Card key={doc.id} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                            {getDocumentIcon(doc.document_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-900 truncate">{doc.title}</h3>
                            {doc.description && (
                              <p className="text-sm text-gray-500 truncate">{doc.description}</p>
                            )}
                            <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                              <span>{formatFileSize(doc.file_size)}</span>
                              <span>{new Date(doc.created_at).toLocaleDateString("vi-VN")}</span>
                            </div>
                          </div>
                          <Button asChild size="sm" className="bg-emerald-600 hover:bg-emerald-700 gap-2">
                            <a href={doc.file_url} download={doc.file_name} target="_blank" rel="noopener noreferrer">
                              <Download className="w-4 h-4" />
                              <span className="hidden sm:inline">Tai xuong</span>
                            </a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Support Tab */}
          {activeTab === "support" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-1">Ho tro khach hang</h2>
                <p className="text-sm text-gray-500">Chung toi luon san sang ho tro ban</p>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Contact info */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Phone className="w-5 h-5 text-emerald-600" />
                      Thong tin lien he
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <a 
                      href="tel:0373685634" 
                      className="flex items-center gap-4 p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center">
                        <Phone className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Hotline</p>
                        <p className="font-semibold text-emerald-600">0373 685 634</p>
                      </div>
                    </a>
                    <a 
                      href="mailto:contact@veximglobal.com"
                      className="flex items-center gap-4 p-4 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Email</p>
                        <p className="font-semibold text-blue-600">contact@veximglobal.com</p>
                      </div>
                    </a>
                    <a 
                      href="https://www.veximglobal.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-lg bg-gray-600 flex items-center justify-center">
                        <ExternalLink className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Website</p>
                        <p className="font-semibold text-gray-700">www.veximglobal.com</p>
                      </div>
                    </a>
                  </CardContent>
                </Card>

                {/* FAQ */}
                <Card className="border-0 shadow-sm">
                  <CardHeader className="pb-4">
                    <CardTitle className="text-base flex items-center gap-2">
                      <HelpCircle className="w-5 h-5 text-emerald-600" />
                      Cau hoi thuong gap
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 rounded-xl bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-2">Khi nao can gia han dang ky FDA?</h4>
                      <p className="text-sm text-gray-500">
                        Dang ky FDA can duoc gia han 2 nam mot lan. Chung toi se thong bao truoc 90 ngay.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-2">US Agent la gi?</h4>
                      <p className="text-sm text-gray-500">
                        US Agent la dai dien phap ly cua ban tai Hoa Ky, bat buoc cho moi dang ky FDA.
                      </p>
                    </div>
                    <div className="p-4 rounded-xl bg-gray-50">
                      <h4 className="font-medium text-gray-900 mb-2">Lam sao de cap nhat thong tin?</h4>
                      <p className="text-sm text-gray-500">
                        Vui long lien he voi chung toi qua hotline hoac email de cap nhat thong tin.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
