import type React from "react"
import type { Metadata } from "next"
import { AdminSidebar } from "@/components/admin-sidebar"
import { MobileAdminHeader } from "@/components/admin/mobile-admin-header"
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

  // Get pending conversations count
  const { data: handoverConvs } = await supabase
    .from("conversations")
    .select("id")
    .eq("handover_mode", "manual")

  let pendingCount = 0
  if (handoverConvs) {
    for (const conv of handoverConvs) {
      const { count } = await supabase
        .from("chat_messages")
        .select("*", { count: "exact", head: true })
        .eq("conversation_id", conv.id)
        .eq("sender_type", "agent")
      
      if (count === 0) {
        pendingCount++
      }
    }
  }

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Mobile Header */}
      <MobileAdminHeader adminUser={adminUser} pendingCount={pendingCount} />
      
      {/* Desktop Sidebar + Content */}
      <div className="flex">
        <div className="hidden lg:block">
          <AdminSidebar adminUser={adminUser} />
        </div>
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  )
}
