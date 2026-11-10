import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  // Published English/Vietnamese home and privacy pages are public and cookieless.
  // Mark only English routes for the root document lang and Inter font preload;
  // Vietnamese routes retain <html lang="vi"> and use Be Vietnam Pro.
  if (["/", "/privacy", "/vi", "/vi/privacy"].includes(request.nextUrl.pathname)) {
    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-vexim-public-landing", "1")
    if (request.nextUrl.pathname === "/" || request.nextUrl.pathname === "/privacy") requestHeaders.set("x-vexim-english-page", "1")
    else requestHeaders.delete("x-vexim-english-page")
    return NextResponse.next({ request: { headers: requestHeaders } })
  }
  // This public, cookieless document and its self-hosted assets need no auth refresh.
  const tradePath = "/services/export-sales"
  if (request.nextUrl.pathname.toLowerCase() === tradePath) {
    if (request.nextUrl.pathname !== tradePath) {
      const canonical = request.nextUrl.clone()
      canonical.pathname = tradePath
      return NextResponse.redirect(canonical, 301)
    }
    return NextResponse.next()
  }
  if (request.nextUrl.pathname.startsWith("/trade/")) return NextResponse.next()

  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing, skip session handling to avoid crashing requests
  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        supabaseResponse = NextResponse.next({
          request,
        })
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        )
      },
    },
  })

  // IMPORTANT: Refreshes the auth token and writes updated cookies.
  // Do not run code between createServerClient and getUser().
  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public image/asset extensions
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
}
