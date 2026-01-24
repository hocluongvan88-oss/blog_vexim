import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { hashPassword } from "@/lib/password"
import bcrypt from 'bcrypt';

// GET /api/clients/[id] - Get client details
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerClient()
    const { id } = await params

    // Check admin auth
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin by email
    const { data: adminUser } = await supabase.from("admin_users").select("id").eq("email", user.email).maybeSingle()
    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    // Use admin client to get client data
    const { createAdminClient } = await import("@/lib/supabase-admin")
    const adminClient = createAdminClient()
    const { data: client, error } = await adminClient.from("clients").select("*").eq("id", id).single()

    if (error || !client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 })
    }

    // Get registrations for this client
    const { data: registrations } = await supabase.from("fda_registrations").select("*").eq("client_id", id).order("created_at", { ascending: false })

    // Get notification preferences
    const { data: notificationPrefs } = await supabase.from("client_notification_preferences").select("*").eq("client_id", id).single()

    // Remove password_hash from response
    const { password_hash: _, ...clientData } = client

    return NextResponse.json({
      client: clientData,
      registrations: registrations || [],
      notification_preferences: notificationPrefs,
    })
  } catch (error) {
    console.error("[v0] Error in GET /api/clients/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PATCH /api/clients/[id] - Update client
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerClient()
    const { id } = await params

    // Check admin auth
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin by email
    const { data: adminUser } = await supabase.from("admin_users").select("id").eq("email", user.email).maybeSingle()
    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const body = await request.json()
    const { email, password, company_name, contact_name, phone, address, is_active } = body

    // Build update object
    const updates: any = {
      updated_at: new Date().toISOString(),
    }

    if (email !== undefined) updates.email = email
    if (company_name !== undefined) updates.company_name = company_name
    if (contact_name !== undefined) updates.contact_name = contact_name
    if (phone !== undefined) updates.phone = phone
    if (address !== undefined) updates.address = address
    if (is_active !== undefined) updates.is_active = is_active

    // Hash password if provided
    if (password) {
      updates.password_hash = await hashPassword(password)
    }

    // Update client
    const { data: updatedClient, error } = await supabase.from("clients").update(updates).eq("id", id).select().single()

    if (error) {
      console.error("[v0] Error updating client:", error)
      return NextResponse.json({ error: "Failed to update client" }, { status: 500 })
    }

    // Remove password_hash from response
    const { password_hash: _, ...clientData } = updatedClient

    return NextResponse.json({ client: clientData })
  } catch (error) {
    console.error("[v0] Error in PATCH /api/clients/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE /api/clients/[id] - Delete client
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const supabase = await createServerClient()
    const { id } = await params

    // Check admin auth
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin by email
    const { data: adminUser } = await supabase.from("admin_users").select("id").eq("email", user.email).maybeSingle()
    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    // Check if client has registrations
    const { data: registrations } = await supabase.from("fda_registrations").select("id").eq("client_id", id)

    if (registrations && registrations.length > 0) {
      return NextResponse.json(
        {
          error: "Cannot delete client with existing registrations. Please reassign or delete registrations first.",
        },
        { status: 400 }
      )
    }

    // Delete client
    const { error } = await supabase.from("clients").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting client:", error)
      return NextResponse.json({ error: "Failed to delete client" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in DELETE /api/clients/[id]:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
