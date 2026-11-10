// Test-only routing shim; never imported by the Next application.
const router = {
  push: (url: string) => {
    ;(window as any).__navigations.push(url)
  },
  refresh: () => {},
  back: () => {},
}
const params = { id: "layout-fixture" }
export const useRouter = () => router
export const useParams = () => params
export const usePathname = () => window.location.pathname
