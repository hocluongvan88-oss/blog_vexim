import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"
import { put } from "@vercel/blob"

// GET - Fetch client documents (admin view)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerClient()

    // Check admin authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin by email
    const { data: adminUserByEmail } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle()

    if (!adminUserByEmail) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    // Use admin client to bypass RLS
    const adminClient = createAdminClient()
    
    // Fetch all documents for this client with join
    const { data: documents, error } = await adminClient
      .from("client_documents")
      .select(`
        *,
        fda_registrations (
          company_name,
          registration_type,
          registration_number
        )
      `)
      .eq("client_id", id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("[v0] Error fetching documents:", error)
      console.error("[v0] Error details:", JSON.stringify(error))
      
      // If table doesn't exist, return empty array
      if (error.message?.includes("relation") || error.message?.includes("does not exist")) {
        console.error("[v0] client_documents table does not exist. Please run migration script: scripts/020_create_client_documents.sql")
        return NextResponse.json({ 
          documents: [], 
          warning: "Documents table not initialized. Please contact administrator." 
        })
      }
      
      return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 })
    }

    return NextResponse.json({ documents: documents || [] })
  } catch (error) {
    console.error("[v0] Error in admin documents API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// POST - Upload new document
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: clientId } = await params
    const supabase = await createServerClient()

    // Check admin authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin by email
    const { data: adminUser } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle()

    if (!adminUser) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    const formData = await request.formData()
    const file = formData.get("file") as File
    const title = formData.get("title") as string
    const description = formData.get("description") as string
    const documentType = formData.get("document_type") as string
    const registrationId = formData.get("registration_id") as string | null
    const isVisibleToClient = formData.get("is_visible_to_client") === "true"

    if (!file || !title || !documentType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Upload to Vercel Blob with random suffix to avoid conflicts
    const blob = await put(`client-documents/${clientId}/${file.name}`, file, {
      access: "public",
      addRandomSuffix: true,
    })

    // Use admin client to bypass RLS for insert
    const adminClient = createAdminClient()
    
    // Save to database
    const { data: document, error } = await adminClient
      .from("client_documents")
      .insert({
        client_id: clientId,
        registration_id: registrationId || null,
        title,
        description,
        document_type: documentType,
        file_name: file.name,
        file_url: blob.url,
        file_size: file.size,
        mime_type: file.type,
        uploaded_by: user.id,
        is_visible_to_client: isVisibleToClient,
      })
      .select()
      .single()

    if (error) {
      console.error("[v0] Error saving document:", error)
      return NextResponse.json({ error: "Failed to save document" }, { status: 500 })
    }

    return NextResponse.json({ document })
  } catch (error) {
    console.error("[v0] Error uploading document:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

// DELETE - Delete document
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get("document_id")

    if (!documentId) {
      return NextResponse.json({ error: "Document ID required" }, { status: 400 })
    }

    const supabase = await createServerClient()

    // Check admin authentication
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Verify admin by email
    const { data: adminUserById } = await supabase
      .from("admin_users")
      .select("id")
      .eq("email", user.email)
      .maybeSingle()

    if (!adminUserById) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 })
    }

    // Use admin client to bypass RLS for delete
    const adminClient = createAdminClient()
    
    // Delete document
    const { error } = await adminClient
      .from("client_documents")
      .delete()
      .eq("id", documentId)

    if (error) {
      console.error("[v0] Error deleting document:", error)
      return NextResponse.json({ error: "Failed to delete document" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[v0] Error in delete document API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
