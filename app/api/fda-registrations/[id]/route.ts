import { NextResponse } from "next/server"
import { createStaticClient } from "@/lib/supabase/server"

// GET - Get single FDA registration with decrypted credentials
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createStaticClient()

    // Check admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    // Get registration
    const { data: registration, error } = await supabase
      .from("fda_registrations")
      .select("*, fda_renewal_reminders(*)")
      .eq("id", id)
      .single()

    if (error || !registration) {
      console.error("[v0] Error fetching FDA registration:", error)
      return NextResponse.json({ error: "Registration not found" }, { status: 404 })
    }

    // Decrypt credentials if requested
    const { searchParams } = new URL(request.url)
    const includeCredentials = searchParams.get("credentials") === "true"

    if (includeCredentials) {
      const encryptionKey = process.env.FDA_ENCRYPTION_KEY
      if (!encryptionKey) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
      }

      const decrypted: any = { ...registration }

      // Decrypt FDA credentials
      if (registration.fda_user_id_encrypted) {
        const { data: userId } = await supabase.rpc("decrypt_fda_credential", {
          encrypted: registration.fda_user_id_encrypted,
          encryption_key: encryptionKey,
        })
        decrypted.fda_user_id = userId
      }

      if (registration.fda_password_encrypted) {
        const { data: password } = await supabase.rpc("decrypt_fda_credential", {
          encrypted: registration.fda_password_encrypted,
          encryption_key: encryptionKey,
        })
        decrypted.fda_password = password
      }

      if (registration.fda_pin_encrypted) {
        const { data: pin } = await supabase.rpc("decrypt_fda_credential", {
          encrypted: registration.fda_pin_encrypted,
          encryption_key: encryptionKey,
        })
        decrypted.fda_pin = pin
      }

      // Remove encrypted fields from response
      delete decrypted.fda_user_id_encrypted
      delete decrypted.fda_password_encrypted
      delete decrypted.fda_pin_encrypted

      return NextResponse.json({ data: decrypted })
    }

    // Without credentials - remove encrypted fields
    const sanitized = {
      ...registration,
      fda_user_id_encrypted: undefined,
      fda_password_encrypted: undefined,
      fda_pin_encrypted: undefined,
      has_credentials: !!(
        registration.fda_user_id_encrypted ||
        registration.fda_password_encrypted ||
        registration.fda_pin_encrypted
      ),
    }

    return NextResponse.json({ data: sanitized })
  } catch (error) {
    console.error("[v0] Error in FDA registration GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// PUT - Update FDA registration
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createStaticClient()

    // Check admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    const { fda_user_id, fda_password, fda_pin, ...updateData } = body

    // Update basic fields
    const { error: updateError } = await supabase.from("fda_registrations").update(updateData).eq("id", id)

    if (updateError) {
      console.error("[v0] Error updating FDA registration:", updateError)
      return NextResponse.json({ error: "Failed to update registration" }, { status: 500 })
    }

    // Update encrypted credentials if provided
    if (fda_user_id || fda_password || fda_pin) {
      const encryptionKey = process.env.FDA_ENCRYPTION_KEY
      if (!encryptionKey) {
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
      }

      const updates: any = {}

      if (fda_user_id) {
        const { data: encryptedUserId } = await supabase.rpc("encrypt_fda_credential", {
          plaintext: fda_user_id,
          encryption_key: encryptionKey,
        })
        updates.fda_user_id_encrypted = encryptedUserId
      }

      if (fda_password) {
        const { data: encryptedPassword } = await supabase.rpc("encrypt_fda_credential", {
          plaintext: fda_password,
          encryption_key: encryptionKey,
        })
        updates.fda_password_encrypted = encryptedPassword
      }

      if (fda_pin) {
        const { data: encryptedPin } = await supabase.rpc("encrypt_fda_credential", {
          plaintext: fda_pin,
          encryption_key: encryptionKey,
        })
        updates.fda_pin_encrypted = encryptedPin
      }

      await supabase.from("fda_registrations").update(updates).eq("id", id)
    }

    return NextResponse.json({
      success: true,
      message: "FDA registration updated successfully",
    })
  } catch (error) {
    console.error("[v0] Error in FDA registration PUT:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete FDA registration
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = createStaticClient()

    // Check admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params

    const { error } = await supabase.from("fda_registrations").delete().eq("id", id)

    if (error) {
      console.error("[v0] Error deleting FDA registration:", error)
      return NextResponse.json({ error: "Failed to delete registration" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: "FDA registration deleted successfully",
    })
  } catch (error) {
    console.error("[v0] Error in FDA registration DELETE:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
