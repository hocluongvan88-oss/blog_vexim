"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { Globe, Lock } from "lucide-react"
import Link from "next/link"

export default function AdminLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    try {
      // Đăng nhập với Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) throw authError

      // Kiểm tra xem user có phải là admin không
      if (authData.user) {
        const { data: adminUser, error: adminError } = await supabase
          .from("admin_users")
          .select("*")
          .eq("email", authData.user.email)
          .single()

        if (adminError || !adminUser) {
          await supabase.auth.signOut()
          throw new Error("Tài khoản không có quyền truy cập Admin")
        }

        // Đăng nhập thành công, chuyển đến admin dashboard
        router.push("/admin")
        router.refresh()
      }
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "Đã xảy ra lỗi")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-secondary/30">
      <div className="w-full max-w-md">
        <div className="flex flex-col gap-6">
          {/* Logo */}
          <div className="flex flex-col items-center gap-2 mb-4">
            <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
              <Globe className="w-10 h-10 text-primary-foreground" />
            </div>
            <div className="text-center">
              <h1 className="text-2xl font-bold text-primary">Vexim Global</h1>
              <p className="text-sm text-muted-foreground">Admin Panel</p>
            </div>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mb-2">
                <Lock className="w-6 h-6 text-accent" />
              </div>
              <CardTitle className="text-2xl">Đăng nhập quản trị</CardTitle>
              <CardDescription>Nhập thông tin tài khoản admin để tiếp tục</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin}>
                <div className="flex flex-col gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@vexim.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Mật khẩu</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <div className="p-3 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                      {error}
                    </div>
                  )}
                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </Button>
                </div>
              </form>

              <div className="mt-6 text-center">
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  ← Quay lại trang chủ
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
