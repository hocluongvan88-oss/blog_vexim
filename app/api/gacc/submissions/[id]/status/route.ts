import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { status } = await request.json()

    // Validate status
    const validStatuses = ["pending", "approved", "rejected", "needs_info"]
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }

    const supabase = await createClient()

    // Check authentication
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Update submission status
    const { data: submission, error } = await supabase
      .from("gacc_submissions")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("[v0] Error updating status:", error)
      throw error
    }

    // TODO: Send email notification to customer about status change
    // You can implement email notification here using the email service

    return NextResponse.json({
      success: true,
      message: "Status updated successfully",
      submission,
    })
  } catch (error) {
    console.error("[v0] Status update error:", error)
    return NextResponse.json(
      {
        error: "Failed to update status",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    )
  }
}
