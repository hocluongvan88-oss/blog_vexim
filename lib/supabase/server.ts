import { createServerClient } from "@supabase/ssr"
import { cookies } from "next/headers"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"

/**
 * Tạo Supabase client cho server-side
 * QUAN TRỌNG: Luôn tạo client mới trong mỗi function (đặc biệt với Fluid compute)
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options))
        } catch {
          // setAll được gọi từ Server Component
          // Có thể bỏ qua nếu bạn có proxy refreshing sessions
        }
      },
    },
  })
}

/**
 * Tạo Supabase client đơn giản cho build time / static generation
 * Không sử dụng cookies - chỉ dùng cho read-only operations
 */
export function createStaticClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("[v0] Supabase environment variables not found. Skipping static generation.")
    return null
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}
