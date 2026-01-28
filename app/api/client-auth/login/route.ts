import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { verifyPassword } from "@/lib/password"
import { randomBytes } from "crypto"
import bcrypt from "bcrypt"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/client-auth/login
export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      )
    }

    console.log("[v0] Looking up client by email:", email)
    
    // Get client by email
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("*")
      .eq("email", email)
      .single()

    console.log("[v0] Client lookup result:", { found: !!client, error: clientError?.message })

    if (clientError || !client) {
      console.error("[v0] Client not found or error:", clientError)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Check if account is active
    if (!client.is_active) {
      return NextResponse.json(
        { error: "Account is inactive. Please contact support." },
        { status: 403 }
      )
    }

    // Verify password using scrypt
    console.log("[v0] Verifying password, hash length:", client.password_hash?.length)
    const passwordMatch = await verifyPassword(password, client.password_hash)
    console.log("[v0] Password match result:", passwordMatch)
    
    if (!passwordMatch) {
      console.error("[v0] Password verification failed for email:", email)
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      )
    }

    // Generate session token
    const token = randomBytes(32).toString("hex")
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7) // 7 days

    // Create session
    const { error: sessionError } = await supabase
      .from("client_sessions")
      .insert({
        client_id: client.id,
        token,
        expires_at: expiresAt.toISOString(),
      })

    if (sessionError) {
      console.error("[v0] Error creating session:", sessionError)
      return NextResponse.json(
        { error: "Failed to create session" },
        { status: 500 }
      )
    }

    // Update last login
    await supabase
      .from("clients")
      .update({ last_login_at: new Date().toISOString() })
      .eq("id", client.id)

    // Return client data and token
    const { password_hash: _, ...clientData } = client

    const response = NextResponse.json({
      client: clientData,
      token,
    })

    // Set cookie
    response.cookies.set("client-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      expires: expiresAt,
    })

    return response
  } catch (error) {
    console.error("[v0] Error in client login:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
