"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
  Globe,
  LogOut,
  User,
  Newspaper,
  BarChart3,
  MessageCircle,
  Brain,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import { useState, useEffect } from "react"

interface AdminSidebarProps {
  adminUser: {
    email: string
    full_name: string | null
    role: string | null
  }
}

export function AdminSidebar({ adminUser }: AdminSidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    const loadPendingCount = async () => {
      const supabase = createClient()
      
      // Get conversations with handover_mode = 'manual'
      const { data: handoverConvs } = await supabase
        .from("conversations")
        .select("id")
        .eq("handover_mode", "manual")

      if (!handoverConvs) {
        setPendingCount(0)
        return
      }

      // Check which ones have no agent messages yet
      let pending = 0
      for (const conv of handoverConvs) {
        const { count } = await supabase
          .from("chat_messages")
          .select("*", { count: "exact", head: true })
          .eq("conversation_id", conv.id)
          .eq("sender_type", "agent")
        
        if (count === 0) {
          pending++
        }
      }

      setPendingCount(pending)
    }

    loadPendingCount()
    
    // Refresh every 30 seconds
    const interval = setInterval(loadPendingCount, 30000)
    return () => clearInterval(interval)
  }, [])

  const menuItems = [
    {
      title: "Tổng quan",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Hội thoại Chat",
      href: "/admin/conversations",
      icon: MessageCircle,
    },
    {
      title: "Kho Tri Thức AI",
      href: "/admin/knowledge-base",
      icon: Brain,
    },
    {
      title: "Tất cả bài viết",
      href: "/admin/posts",
      icon: FileText,
    },
    {
      title: "Tạo bài viết mới",
      href: "/admin/posts/new",
      icon: PlusCircle,
    },
    {
      title: "Tin tức FDA/GACC",
      href: "/admin/news-crawler",
      icon: Newspaper,
    },
    {
      title: "Cài đặt",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()

    try {
      await supabase.auth.signOut()
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("Error logging out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  return (
    <aside className="w-64 bg-white border-r min-h-screen flex flex-col sticky top-0">
      {/* Logo */}
      <div className="p-6 border-b">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Globe className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <span className="text-xl font-bold text-primary block">Vexim Global</span>
            <span className="text-xs text-muted-foreground">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Menu Items */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                    isActive
                      ? "bg-accent text-accent-foreground font-medium"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1">{item.title}</span>
                  {item.href === "/admin/conversations" && pendingCount > 0 && (
                    <Badge className="bg-orange-500 text-white px-2 py-0.5 text-xs">
                      {pendingCount}
                    </Badge>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t space-y-3">
        {/* User Info */}
        <div className="px-3 py-2 bg-secondary/50 rounded-lg">
          <div className="flex items-center gap-2 mb-1">
            <User className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">{adminUser.full_name || "Admin"}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{adminUser.email}</p>
          {adminUser.role && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-medium bg-primary/10 text-primary rounded">
              {adminUser.role}
            </span>
          )}
        </div>

        <Button variant="outline" className="w-full justify-start bg-transparent" asChild>
          <Link href="/">
            <Globe className="w-4 h-4 mr-2" />
            Xem website
          </Link>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="w-4 h-4 mr-2" />
          {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
        </Button>
      </div>
    </aside>
  )
}
