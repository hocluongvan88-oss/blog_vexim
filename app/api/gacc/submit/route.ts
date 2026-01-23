import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    console.log("[v0] GACC submission received:", {
      company: data.companyName,
      product: data.productName,
    })

    // Validate required fields
    const requiredFields = ["companyName", "email", "phone", "taxCode", "productionAddress", "productName", "hsCode"]

    for (const field of requiredFields) {
      if (!data[field]) {
        return NextResponse.json({ error: `Thiếu trường bắt buộc: ${field}` }, { status: 400 })
      }
    }

    // Create Supabase client
    const supabase = await createClient()

    // Insert into database
    const { data: submission, error } = await supabase
      .from("gacc_submissions")
      .insert({
        company_name: data.companyName,
        email: data.email,
        phone: data.phone,
        tax_code: data.taxCode,
        production_address: data.productionAddress,
        product_name: data.productName,
        hs_code: data.hsCode,
        planting_area_code: data.plantingAreaCode || null,
        general_info: data.generalInfo,
        production_environment: data.productionEnvironment,
        equipment_cleaning: data.equipmentCleaning,
        process_control: data.processControl,
        record_keeping: data.recordKeeping,
        employee_training: data.employeeTraining,
        pest_control: data.pestControl,
        water_quality: data.waterQuality,
        raw_material_control: data.rawMaterialControl,
        packaging_material: data.packagingMaterial,
        product_testing: data.productTesting,
        traceability_system: data.traceabilitySystem,
        complaint_handling: data.complaintHandling,
        document_retention: data.documentRetention,
        status: "pending",
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase error:", error)
      throw error
    }

    console.log("[v0] GACC submission created:", submission.id)

    // Send notification emails
    try {
      const { emailService } = await import("@/lib/email-service-zoho")
      const { getGACCUserConfirmationHTML, getGACCAdminNotificationHTML } = await import("@/lib/email-gacc")

      const submittedAt = new Date(submission.created_at).toLocaleString("vi-VN", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })

      const emailParams = {
        companyName: data.companyName,
        productName: data.productName,
        hsCode: data.hsCode,
        submissionId: submission.id,
        submittedAt,
        email: data.email,
        phone: data.phone,
        taxCode: data.taxCode,
      }

      // Send confirmation email to user if email provided
      if (data.email) {
        await emailService.sendEmail({
          to: data.email,
          subject: `✅ Đã nhận hồ sơ đánh giá GACC - ${data.companyName}`,
          html: getGACCUserConfirmationHTML(emailParams),
        })
        console.log("[v0] User confirmation email sent to:", data.email)
      }

      // Send notification to admin
      await emailService.sendEmail({
        to: "contact@veximglobal.vn", // Admin email
        subject: `🔔 Hồ sơ GACC mới: ${data.companyName} - ${data.productName}`,
        html: getGACCAdminNotificationHTML(emailParams),
      })
      console.log("[v0] Admin notification email sent")
    } catch (emailError) {
      console.error("[v0] Error sending emails:", emailError)
      // Don't fail the submission if email fails
    }

    return NextResponse.json({
      success: true,
      message: "Đánh giá đã được gửi thành công",
      submissionId: submission.id,
    })
  } catch (error) {
    console.error("[v0] GACC submission error:", error)
    return NextResponse.json(
      {
        error: "Có lỗi xảy ra khi gửi đánh giá",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
