import type { ReactNode } from "react"
import Link from "next/link"

/** The Trade landing is a complete HTML document, not a React Server Component. */
export function ServiceLink({
  href,
  children,
  className,
}: {
  href: string
  children: ReactNode
  className?: string
}) {
  return href === "/services/export-sales" ? (
    <a href={href} className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
