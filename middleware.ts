import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

/** Cookie ghi nhớ lựa chọn ngôn ngữ thủ công của khách. */
const LOCALE_COOKIE = "vexim_locale"

/**
 * Landing page song ngữ. Tiếng Việt là mặc định ở URL gốc; bản tiếng Anh ở
 * `/en`. Khách dùng trình duyệt tiếng Anh (và chưa tự chọn ngôn ngữ) được
 * chuyển sang bản tiếng Anh tương ứng.
 */
const ENGLISH_ROUTES: Record<string, string> = { "/en": "/", "/en/privacy": "/privacy" }
const VIETNAMESE_ROUTES: Record<string, string> = { "/": "/en", "/privacy": "/en/privacy" }

/** Trình duyệt ưu tiên tiếng Anh hơn tiếng Việt? */
function prefersEnglish(header: string | null) {
  if (!header) return false
  // "en-US,en;q=0.9,vi;q=0.8" -> [{en: 1}, {en: 0.9}, {vi: 0.8}] theo thứ tự.
  const ranked = header.split(",").map(part => {
    const [tag, ...params] = part.trim().split(";")
    const q = params.map(p => p.trim()).find(p => p.startsWith("q="))
    return { tag: tag.trim().toLowerCase(), q: q ? Number(q.slice(2)) : 1 }
  }).filter(entry => entry.tag && !Number.isNaN(entry.q))
  const score = (language: string) => Math.max(0, ...ranked.filter(entry => entry.tag === language || entry.tag.startsWith(`${language}-`)).map(entry => entry.q))
  return score("en") > score("vi")
}

export async function middleware(request: NextRequest) {
  // Published English/Vietnamese home and privacy pages are public and cookieless.
  // Mark only English routes for the root document lang and Inter font preload;
  // Vietnamese routes retain <html lang="vi"> and use Be Vietnam Pro.
  const { pathname } = request.nextUrl
  if (pathname in ENGLISH_ROUTES || pathname in VIETNAMESE_ROUTES) {
    // Ghi nhớ lựa chọn ngôn ngữ do khách tự bấm trong dropdown, để lần sau
    // không bị chuyển hướng theo ngôn ngữ trình duyệt nữa.
    const chosen = request.nextUrl.searchParams.get("lang")
    if (chosen === "en" || chosen === "vi") {
      const target = request.nextUrl.clone()
      target.searchParams.delete("lang")
      const response = NextResponse.redirect(target, 307)
      response.cookies.set(LOCALE_COOKIE, chosen, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" })
      return response
    }

    // Khách quốc tế: ưu tiên lựa chọn đã ghi nhớ, nếu chưa có thì xét ngôn ngữ
    // trình duyệt. Chỉ chuyển một chiều (tiếng Việt -> tiếng Anh) để không tạo
    // vòng lặp, và bản tiếng Anh không bao giờ bị đẩy ngược lại.
    const remembered = request.cookies.get(LOCALE_COOKIE)?.value
    const wantsEnglish = remembered === "en" || remembered === "vi"
      ? remembered === "en"
      : prefersEnglish(request.headers.get("accept-language"))
    if (wantsEnglish && pathname in VIETNAMESE_ROUTES) {
      const target = request.nextUrl.clone()
      target.pathname = VIETNAMESE_ROUTES[pathname]
      return NextResponse.redirect(target, 307)
    }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set("x-vexim-public-landing", "1")
    if (pathname in ENGLISH_ROUTES) requestHeaders.set("x-vexim-english-page", "1")
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
