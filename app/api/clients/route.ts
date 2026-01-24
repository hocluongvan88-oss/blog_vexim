import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"
import { hashPassword, generateRandomPassword } from "@/lib/password"

// GET /api/clients - List all clients (Admin only)
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerClient()

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

    // Get query parameters
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get("search") || ""
    const status = searchParams.get("status") || "all"
    const page = Number.parseInt(searchParams.get("page") || "1")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = (page - 1) * limit

    // Use admin client to bypass RLS
    const adminClient = createAdminClient()

    // Build query
    let query = adminClient.from("clients").select("*", { count: "exact" })

    if (search) {
      query = query.or(`company_name.ilike.%${search}%,contact_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (status !== "all") {
      query = query.eq("is_active", status === "active")
    }

    const { data: clients, error, count } = await query.order("created_at", { ascending: false }).range(offset, offset + limit - 1)

    if (error) {
      console.error("[v0] Error fetching clients:", error)
      return NextResponse.json({ error: "Failed to fetch clients" }, { status: 500 })
    }

    // Get registration counts for each client
    const clientIds = clients?.map((c) => c.id) || []
    const { data: regCounts } = await supabase
      .from("fda_registrations")
      .select("client_id")
      .in("client_id", clientIds)

    const registrationCounts = regCounts?.reduce((acc: Record<string, number>, reg) => {
      acc[reg.client_id] = (acc[reg.client_id] || 0) + 1
      return acc
    }, {})

    // Add registration counts to clients
    const clientsWithCounts = clients?.map((client) => ({
      ...client,
      registration_count: registrationCounts?.[client.id] || 0,
    }))

    return NextResponse.json({
      clients: clientsWithCounts,
      total: count,
      page,
      limit,
      totalPages: Math.ceil((count || 0) / limit),
    })
  } catch (error) {
    console.error("[v0] Error in GET /api/clients:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST /api/clients - Create new client (Admin only)
export async function POST(request: NextRequest) {
  try {
    // Use regular client for auth check
    const supabase = await createServerClient()

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
    const { email, password, company_name, contact_name, phone, address } = body

    // Validate required fields
    if (!email || !password || !company_name || !contact_name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Use admin client for database operations (bypasses RLS)
    const adminClient = createAdminClient()

    // Check if email already exists
    const { data: existingClient } = await adminClient.from("clients").select("id").eq("email", email).maybeSingle()

    if (existingClient) {
      return NextResponse.json({ error: "Email already exists" }, { status: 409 })
    }

    // Hash password
    const password_hash = await hashPassword(password)

    // Create client using admin client
    const { data: newClient, error } = await adminClient
      .from("clients")
      .insert({
        email,
        password_hash,
        company_name,
        contact_name,
        phone,
        address,
        is_active: true,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error creating client:", error)
      return NextResponse.json({ error: "Failed to create client", details: error.message }, { status: 500 })
    }

    // Remove password_hash from response
    const { password_hash: _, ...clientData } = newClient

    return NextResponse.json({ client: clientData }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error in POST /api/clients:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
