import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { hashPassword } from "@/lib/password"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// POST /api/client-auth/reset-password-temp
// Temporary endpoint to reset client password
export async function POST(request: NextRequest) {
  try {
    const { email, newPassword } = await request.json()

    if (!email || !newPassword) {
      return NextResponse.json(
        { error: "Email and new password are required" },
        { status: 400 }
      )
    }

    console.log("[v0] Resetting password for:", email)

    // Hash the new password
    const passwordHash = await hashPassword(newPassword)
    console.log("[v0] Generated hash length:", passwordHash.length)

    // Update client password
    const { error: updateError } = await supabase
      .from("clients")
      .update({ password_hash: passwordHash })
      .eq("email", email)

    if (updateError) {
      console.error("[v0] Error updating password:", updateError)
      return NextResponse.json(
        { error: "Failed to update password" },
        { status: 500 }
      )
    }

    console.log("[v0] Password reset successful")
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error resetting password:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
