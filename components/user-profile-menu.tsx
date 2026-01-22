"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, Settings, LogOut, Shield } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserProfileMenuProps {
  user?: {
    name?: string
    email?: string
    avatar?: string
    role?: "admin" | "user"
  }
}

export function UserProfileMenu({ user }: UserProfileMenuProps) {
  const router = useRouter()

  // Get initials from name
  const getInitials = (name?: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      // Clear any local storage or session data
      localStorage.removeItem("isAdminLoggedIn")
      sessionStorage.clear()
      
      // Redirect to home page
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  // If no user, show login button
  if (!user) {
    return (
      <Link
        href="/admin/login"
        className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
        title="Đăng nhập"
      >
        <User className="w-4 h-4" />
        <span className="text-sm hidden lg:inline">Đăng nhập</span>
      </Link>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 outline-none ring-0 focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded-full transition-all">
        <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/20 hover:border-primary/40 transition-colors">
          <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name || "User"} />
          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
            {getInitials(user.name)}
          </AvatarFallback>
        </Avatar>
        <div className="hidden lg:block text-left">
          <p className="text-sm font-medium leading-none mb-0.5">{user.name || "Người dùng"}</p>
          {user.role === "admin" && (
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Shield className="w-3 h-3" />
              Quản trị viên
            </p>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "Người dùng"}</p>
            {user.email && <p className="text-xs leading-none text-muted-foreground">{user.email}</p>}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>Hồ sơ của tôi</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="cursor-pointer">
            <Settings className="mr-2 h-4 w-4" />
            <span>Cài đặt</span>
          </Link>
        </DropdownMenuItem>
        {user.role === "admin" && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/admin" className="cursor-pointer">
                <Shield className="mr-2 h-4 w-4" />
                <span>Quản trị</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
