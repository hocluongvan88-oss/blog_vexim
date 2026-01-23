"use client"

import { useState, useEffect } from "react"
import { Menu, X, Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

interface MobileAdminHeaderProps {
  adminUser: {
    email: string
    full_name: string | null
    role: string | null
  }
  pendingCount?: number
  pageTitle?: string
}

export function MobileAdminHeader({ adminUser, pendingCount = 0, pageTitle }: MobileAdminHeaderProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleLogout = async () => {
    setIsLoggingOut(true)
    const supabase = createClient()

    try {
      await supabase.auth.signOut()
      router.push("/admin/login")
      router.refresh()
    } catch (error) {
      console.error("[v0] Error logging out:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Prevent hydration mismatch by only rendering after mount
  if (!isMounted) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 lg:hidden">
        <div className="flex items-center justify-between h-14 px-4">
          <div className="w-10" />
          <div className="flex-1 text-center">
            <h1 className="text-base font-semibold text-primary truncate">
              {pageTitle || "Admin Dashboard"}
            </h1>
          </div>
          <div className="w-10" />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 lg:hidden">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="bg-transparent">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-72 p-0">
            <SheetHeader className="p-6 border-b">
              <SheetTitle className="text-left">Menu Admin</SheetTitle>
            </SheetHeader>
            <div className="h-[calc(100vh-80px)] overflow-y-auto">
              <AdminSidebar adminUser={adminUser} />
            </div>
          </SheetContent>
        </Sheet>

        {/* Page Title */}
        <div className="flex-1 text-center">
          <h1 className="text-base font-semibold text-primary truncate">
            {pageTitle || "Admin Dashboard"}
          </h1>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Notifications Bell */}
          {pendingCount > 0 && (
            <Button variant="ghost" size="icon" className="relative bg-transparent">
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-orange-500 text-white text-xs">
                {pendingCount}
              </Badge>
            </Button>
          )}

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-transparent">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {adminUser.full_name?.charAt(0) || adminUser.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-2">
                <p className="text-sm font-medium">{adminUser.full_name || "Admin"}</p>
                <p className="text-xs text-muted-foreground truncate">{adminUser.email}</p>
                {adminUser.role && (
                  <Badge className="mt-1" variant="secondary">
                    {adminUser.role}
                  </Badge>
                )}
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/")}>
                Xem website
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/admin/settings")}>
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="text-destructive focus:text-destructive"
              >
                {isLoggingOut ? "Đang đăng xuất..." : "Đăng xuất"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
