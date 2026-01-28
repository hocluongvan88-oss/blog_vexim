import { NextResponse } from "next/server"
// Sửa import theo gợi ý của trình biên dịch: sử dụng createClient thay vì createServerClient
import { createStaticClient, createClient } from "@/lib/supabase/server"

// GET - Liệt kê tất cả các đăng ký FDA
export async function GET(request: Request) {
  try {
    // Sử dụng createClient() cho các thao tác cần quyền người dùng hiện tại
    const supabase = await createClient()
    
    // Kiểm tra xác thực
    const {
      data: { user },
    } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Kiểm tra quyền admin
    // Lưu ý: Nếu bạn gặp lỗi 403 liên tục, hãy kiểm tra xem email của bạn đã có trong bảng 'admin_users' chưa
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle()
      
    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get("status")
    const search = searchParams.get("search")

    let query = supabase
      .from("fda_registrations")
      .select("*, fda_renewal_reminders(id, reminder_type, reminder_date, status)")
      .order("created_at", { ascending: false })

    if (status && status !== "all") {
      query = query.eq("status", status)
    }

    if (search) {
      query = query.or(`company_name.ilike.%${search}%,registration_number.ilike.%${search}%`)
    }

    const { data, error } = await query

    if (error) {
      console.error("[v0] Error fetching FDA registrations:", error)
      return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
    }

    // Loại bỏ các trường nhạy cảm trước khi trả về client
    const sanitizedData = data?.map((reg) => ({
      ...reg,
      fda_user_id_encrypted: undefined,
      fda_password_encrypted: undefined,
      fda_pin_encrypted: undefined,
      has_credentials: !!(reg.fda_user_id_encrypted || reg.fda_password_encrypted || reg.fda_pin_encrypted),
    }))

    return NextResponse.json({ data: sanitizedData })
  } catch (error) {
    console.error("[v0] Error in FDA registrations GET:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Tạo đăng ký FDA mới
export async function POST(request: Request) {
  try {
    // Sửa lỗi: Đổi createServerClient() thành createClient()
    const supabase = await createClient()

    // Kiểm tra xác thực
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Kiểm tra quyền admin
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle()
      
    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const body = await request.json()
    console.log("[v0] Received FDA registration data:", { ...body, fda_password: "***", fda_pin: "***" })
    
    const {
      client_id,
      company_name,
      company_name_english,
      company_address,
      company_city,
      company_state,
      company_country,
      company_phone,
      company_email,
      contact_name,
      contact_title,
      contact_phone,
      contact_email,
      registration_type,
      registration_number,
      fei_number,
      duns_number,
      initial_registration_date,
      last_renewal_date,
      expiration_date,
      next_renewal_date,
      fda_user_id,
      fda_password,
      fda_pin,
      uses_us_agent,
      us_agent_id,
      us_agent_name,
      us_agent_company,
      us_agent_phone,
      us_agent_email,
      us_agent_address,
      agent_company_name,
      agent_name,
      agent_phone,
      agent_email,
      agent_address,
      agent_contract_start_date,
      agent_contract_end_date,
      agent_contract_years,
      facility_type,
      product_categories,
      products_description,
      reminder_months_before,
      notes,
      internal_notes,
      address,
    } = body

    // Required validation
    if (!company_name || !contact_name || !contact_email || !registration_type || !expiration_date) {
      console.error("[v0] Missing required fields:", { company_name, contact_name, contact_email, registration_type, expiration_date })
      return NextResponse.json({ error: "Missing required fields: company_name, contact_name, contact_email, registration_type, expiration_date" }, { status: 400 })
    }

    const encryptionKey = process.env.FDA_ENCRYPTION_KEY
    if (!encryptionKey) {
      console.error("[v0] FDA_ENCRYPTION_KEY not configured")
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 })
    }

    // Ensure we have company_address - support both field names
    const finalAddress = company_address || address
    if (!finalAddress) {
      console.error("[v0] Missing company address")
      return NextResponse.json({ error: "Missing required field: company_address or address" }, { status: 400 })
    }

    const insertData: any = {
      client_id, // IMPORTANT: Link registration to client
      company_name,
      company_name_english,
      company_address: finalAddress,
      company_city,
      company_state,
      company_country: company_country || "Vietnam",
      company_phone,
      company_email,
      contact_name,
      contact_title,
      contact_phone,
      contact_email,
      registration_type,
      registration_number,
      fei_number,
      duns_number,
      initial_registration_date,
      last_renewal_date,
      expiration_date,
      next_renewal_date,
      uses_us_agent: uses_us_agent || false,
      // Map both old and new field names for US Agent
      agent_company_name: agent_company_name || us_agent_company,
      agent_name: agent_name || us_agent_name,
      agent_phone: agent_phone || us_agent_phone,
      agent_email: agent_email || us_agent_email,
      agent_address: agent_address || us_agent_address,
      agent_contract_start_date,
      agent_contract_end_date,
      agent_contract_years: agent_contract_years ? parseInt(agent_contract_years) : null,
      facility_type,
      product_categories,
      products_description,
      reminder_months_before: reminder_months_before || 6,
      notes,
      internal_notes,
      created_by: user.id,
    }
    
    console.log("[v0] Inserting FDA registration:", { ...insertData, fda_user_id_encrypted: undefined, fda_password_encrypted: undefined, fda_pin_encrypted: undefined })

    const { data: registration, error: insertError } = await supabase
      .from("fda_registrations")
      .insert(insertData)
      .select()
      .single()

    if (insertError) {
      console.error("[v0] Error creating FDA registration:", {
        code: insertError.code,
        message: insertError.message,
        details: insertError.details,
        hint: insertError.hint,
      })
      
      // Return more specific error messages
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "Đăng ký FDA đã tồn tại với thông tin tương tự" },
          { status: 409 }
        )
      }
      
      return NextResponse.json(
        { error: "Failed to create registration", details: insertError.message },
        { status: 500 }
      )
    }

    // Mã hóa thông tin đăng nhập bằng RPC
    if (fda_user_id || fda_password || fda_pin) {
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

      if (Object.keys(updates).length > 0) {
        await supabase.from("fda_registrations").update(updates).eq("id", registration.id)
      }
    }

    return NextResponse.json({
      success: true,
      message: "FDA registration created successfully",
      data: registration,
    })
  } catch (error) {
    console.error("[v0] Error in FDA registrations POST:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
