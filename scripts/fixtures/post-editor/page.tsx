// Isolated browser harness for the real client pages. No auth bypass or test
// route is added to app/. All API responses are served by the local test runner.
import { createRoot } from "react-dom/client"
import NewPostPage from "@/app/admin/(dashboard)/posts/new/page"
import EditPostPage from "@/app/admin/(dashboard)/posts/[id]/edit/page"
;(window as any).__navigations = []
const params = Promise.resolve({ id: "layout-fixture" })
createRoot(document.getElementById("root")!).render(
  <div className="flex min-h-screen bg-secondary/30">
    <div className="hidden shrink-0 lg:block">
      <aside className="w-64 min-h-screen border-r bg-white p-6 text-sm text-muted-foreground">
        Vexim Global · Admin Panel
      </aside>
    </div>
    <main className="min-w-0 flex-1 w-full">
      {window.location.pathname === "/edit" ? <EditPostPage params={params} /> : <NewPostPage />}
    </main>
  </div>,
)
