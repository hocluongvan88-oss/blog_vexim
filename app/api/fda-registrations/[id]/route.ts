import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase-server"

// GET - Get single FDA registration with decrypted credentials
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const supabase = await createServerClient()

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

      // Remove encrypted fields from response and set has_credentials flag
      delete decrypted.fda_user_id_encrypted
      delete decrypted.fda_password_encrypted
      delete decrypted.fda_pin_encrypted
      
      // Set has_credentials based on whether any credentials exist
      decrypted.has_credentials = !!(decrypted.fda_user_id || decrypted.fda_password || decrypted.fda_pin)

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
    const supabase = await createServerClient()

    // Check admin authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = params
    const body = await request.json()
    console.log("[v0] Received update data:", body)
    
    const {
      fda_user_id,
      fda_password,
      fda_pin,
      // Old field names that might come from legacy forms
      address,
      us_agent_id,
      us_agent_name,
      us_agent_company,
      us_agent_phone,
      us_agent_email,
      us_agent_address,
      ...otherFields
    } = body

    // Normalize registration_type to match database constraint
    const typeMapping: Record<string, string> = {
      'food_facility': 'Food Facility',
      'drug_establishment': 'Drug Establishment', 
      'medical_device': 'Medical Device',
      'cosmetic': 'Cosmetic',
      'dietary_supplement': 'Dietary Supplement',
      'infant_formula': 'Infant Formula',
      'other': 'Other'
    }

    // Map old field names to new ones and build update data
    const updateData: any = {
      ...otherFields,
      updated_at: new Date().toISOString(),
      // Normalize registration_type
      ...(otherFields.registration_type ? { 
        registration_type: typeMapping[otherFields.registration_type.toLowerCase().replace(/\s+/g, '_')] || otherFields.registration_type 
      } : {}),
      // Use company_address, fallback to address if provided
      ...(body.company_address || address ? { company_address: body.company_address || address } : {}),
      // Map US Agent fields to new names
      ...(body.agent_company_name || us_agent_company ? { agent_company_name: body.agent_company_name || us_agent_company } : {}),
      ...(body.agent_name || us_agent_name ? { agent_name: body.agent_name || us_agent_name } : {}),
      ...(body.agent_phone || us_agent_phone ? { agent_phone: body.agent_phone || us_agent_phone } : {}),
      ...(body.agent_email || us_agent_email ? { agent_email: body.agent_email || us_agent_email } : {}),
      ...(body.agent_address || us_agent_address ? { agent_address: body.agent_address || us_agent_address } : {}),
    }

    console.log("[v0] Mapped update data:", updateData)

    // Update basic fields
    const { error: updateError } = await supabase.from("fda_registrations").update(updateData).eq("id", id)

    if (updateError) {
      console.error("[v0] Error updating FDA registration:", updateError)
      return NextResponse.json({ error: "Failed to update registration" }, { status: 500 })
    }

    // Update encrypted credentials if provided
    if (fda_user_id || fda_password || fda_pin) {
      console.log("[v0] Updating FDA credentials...")
      const encryptionKey = process.env.FDA_ENCRYPTION_KEY
      if (!encryptionKey) {
        console.error("[v0] FDA_ENCRYPTION_KEY not configured")
        return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
      }

      const updates: any = {}

      if (fda_user_id) {
        console.log("[v0] Encrypting FDA User ID")
        const { data: encryptedUserId, error: encryptError } = await supabase.rpc("encrypt_fda_credential", {
          plaintext: fda_user_id,
          encryption_key: encryptionKey,
        })
        if (encryptError) {
          console.error("[v0] Error encrypting FDA User ID:", encryptError)
          return NextResponse.json({ error: "Failed to encrypt FDA User ID" }, { status: 500 })
        }
        if (!encryptedUserId) {
          console.error("[v0] Encryption returned null for FDA User ID")
        }
        updates.fda_user_id_encrypted = encryptedUserId
        console.log("[v0] FDA User ID encrypted successfully")
      }

      if (fda_password) {
        console.log("[v0] Encrypting FDA Password")
        const { data: encryptedPassword, error: encryptError } = await supabase.rpc("encrypt_fda_credential", {
          plaintext: fda_password,
          encryption_key: encryptionKey,
        })
        if (encryptError) {
          console.error("[v0] Error encrypting FDA Password:", encryptError)
          return NextResponse.json({ error: "Failed to encrypt FDA Password" }, { status: 500 })
        }
        if (!encryptedPassword) {
          console.error("[v0] Encryption returned null for FDA Password")
        }
        updates.fda_password_encrypted = encryptedPassword
        console.log("[v0] FDA Password encrypted successfully")
      }

      if (fda_pin) {
        console.log("[v0] Encrypting FDA PIN")
        const { data: encryptedPin, error: encryptError } = await supabase.rpc("encrypt_fda_credential", {
          plaintext: fda_pin,
          encryption_key: encryptionKey,
        })
        if (encryptError) {
          console.error("[v0] Error encrypting FDA PIN:", encryptError)
          return NextResponse.json({ error: "Failed to encrypt FDA PIN" }, { status: 500 })
        }
        if (!encryptedPin) {
          console.error("[v0] Encryption returned null for FDA PIN")
        }
        updates.fda_pin_encrypted = encryptedPin
        console.log("[v0] FDA PIN encrypted successfully")
      }

      console.log("[v0] Saving encrypted credentials to database...")
      const { error: credError } = await supabase.from("fda_registrations").update(updates).eq("id", id)
      
      if (credError) {
        console.error("[v0] Error saving encrypted credentials:", credError)
        return NextResponse.json({ error: "Failed to save credentials" }, { status: 500 })
      }
      console.log("[v0] Credentials saved successfully")
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
    const supabase = await createServerClient()

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
