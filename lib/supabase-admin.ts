import { createClient } from "@supabase/supabase-js"

/**
 * Supabase Admin Client with Service Role Key
 * This bypasses Row Level Security (RLS) and should only be used in secure server contexts
 * Used for admin operations like creating clients, managing registrations, etc.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error("Missing Supabase URL or Service Role Key")
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
