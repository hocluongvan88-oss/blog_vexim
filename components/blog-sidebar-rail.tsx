import type { ReactNode } from "react"
import { BlogSidebarOffset } from "@/components/blog-sidebar-offset"
import { cn } from "@/lib/utils"

/** One sticky rail for all cards. Its inner scroll keeps tall panels accessible
 * below the fixed header instead of cutting off the consultation/services. */
export function BlogSidebarRail({ children, className, offsetElementId }: { children: ReactNode; className?: string; offsetElementId?: string }) {
  return (
    <aside data-blog-sidebar-rail className={cn("min-w-0 self-start lg:top-[var(--blog-sidebar-top,6rem)]", offsetElementId ? "lg:data-[sticky-ready=true]:sticky" : "lg:sticky", className)} aria-label="Thanh bên blog">
      <div
        role="region"
        aria-label="Bài viết mới và dịch vụ tư vấn"
        tabIndex={0}
        className="space-y-6 rounded-xl px-px pb-px outline-offset-2 lg:max-h-[calc(100vh-var(--blog-sidebar-top,6rem)-1rem)] lg:overflow-y-auto lg:overscroll-y-contain supports-[height:100dvh]:lg:max-h-[calc(100dvh-var(--blog-sidebar-top,6rem)-1rem)] [scrollbar-width:thin]"
      >
        {children}
      </div>
      {offsetElementId && <BlogSidebarOffset targetId={offsetElementId} />}
    </aside>
  )
}
