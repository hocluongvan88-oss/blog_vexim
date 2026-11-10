import type { ComponentProps } from "react"
export default function Link({
  prefetch,
  replace,
  scroll,
  ...props
}: ComponentProps<"a"> & {
  prefetch?: boolean
  replace?: boolean
  scroll?: boolean
}) {
  return <a {...props} />
}
