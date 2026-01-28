import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase-server"

// GET - Fetch FDA/GACC news relevant to client's registrations
export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get("client-token")?.value

    if (!token) {
      console.log("[v0] No client token found in news API")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const supabase = await createServerClient()

    // Look up session in database
    const { data: session, error: sessionError } = await supabase
      .from("client_sessions")
      .select("client_id, expires_at")
      .eq("token", token)
      .single()

    if (sessionError || !session) {
      console.error("[v0] Session not found:", sessionError)
      return NextResponse.json({ error: "Invalid session" }, { status: 401 })
    }

    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      console.error("[v0] Session expired")
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    const clientId = session.client_id

    // Get client's registrations to determine relevant categories
    const { data: registrations, error: regError } = await supabase
      .from("fda_registrations")
      .select("registration_type")
      .eq("client_id", clientId)

    if (regError) {
      console.error("[v0] Error fetching registrations:", regError)
      return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 })
    }

    // Map registration types to news categories
    const categories = new Set<string>()
    registrations?.forEach(reg => {
      if (reg.registration_type.includes("Food")) categories.add("Food")
      if (reg.registration_type.includes("Drug")) categories.add("Drugs")
      if (reg.registration_type.includes("Device")) categories.add("Medical Devices")
      if (reg.registration_type.includes("Cosmetic")) categories.add("Cosmetics")
    })

    // TODO: crawled_news table hasn't been created yet
    // For now, return empty news array
    console.log("[v0] News feature not yet implemented - crawled_news table missing")
    
    return NextResponse.json({ 
      news: [],
      message: "News feature coming soon"
    })
  } catch (error) {
    console.error("[v0] Error in client news API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
