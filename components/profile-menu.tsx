"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { User, LogOut, Settings } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function ProfileMenu() {
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null)
      setIsLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      subscription?.unsubscribe()
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  if (isLoading) {
    return null
  }

  if (!user) {
    return (
      <Link href="/admin/login">
        <Button variant="outline" size="sm" className="flex items-center gap-2 bg-transparent">
          <User className="w-4 h-4" />
          <span>Admin</span>
        </Button>
      </Link>
    )
  }

  const userInitial = user.email?.[0].toUpperCase() || "A"

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="rounded-full w-10 h-10 p-0">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-primary text-white font-semibold">{userInitial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <div className="flex flex-col gap-2 p-2">
          <p className="text-sm font-medium text-foreground">{user.email}</p>
          <p className="text-xs text-muted-foreground">Admin Account</p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/admin" className="flex items-center gap-2 cursor-pointer">
            <Settings className="w-4 h-4" />
            <span>Admin Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="flex items-center gap-2 text-destructive cursor-pointer">
          <LogOut className="w-4 h-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
