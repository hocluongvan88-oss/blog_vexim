import type React from "react"
import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin-sidebar"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export const metadata: Metadata = {
  title: "Admin Dashboard - Vexim Global",
  description: "Quản trị nội dung Vexim Global",
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If not logged in, redirect to login page
  if (!user) {
    redirect("/admin/login")
  }

  // Check if user is an admin
  const { data: adminUser } = await supabase.from("admin_users").select("*").eq("email", user.email).single()

  if (!adminUser) {
    // User is not an admin, sign them out and redirect
    await supabase.auth.signOut()
    redirect("/admin/login")
  }

  return (
    <div className="flex min-h-screen bg-secondary/30">
      <AdminSidebar adminUser={adminUser} />
      <main className="flex-1">{children}</main>
    </div>
  )
}
