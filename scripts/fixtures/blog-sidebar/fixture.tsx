import { Button } from "@/components/ui/button"
import BlogSidebar from "@/components/blog-sidebar"
import { BlogSidebarRail } from "@/components/blog-sidebar-rail"
import { BlogInternalLinks } from "@/components/blog-internal-links"
import { BlogTableOfContents } from "@/components/blog-table-of-contents"

const headings = Array.from({ length: 24 }, (_, i) => ({ id: `section-${i}`, text: `Phần ${i + 1}: Nội dung kiểm thử thanh bên`, level: 2 }))

/** Production components; only article copy, fixed-header frame and data are fixtures. */
export function SidebarFixture({ recentMarkup, mode = "article" }: { recentMarkup: string; mode?: string }) {
  return <>
    <header data-test-header className="fixed inset-x-0 top-0 z-50 flex h-20 items-center border-b bg-white px-8 font-bold text-primary">Vexim Global — kiểm thử sidebar</header>
    <main className="min-h-screen pt-24">
      {mode === "index" && <section id="blog-category-filter" className="sticky top-[68px] z-30 border-b bg-white py-6 md:top-[84px]">
        <div className="container mx-auto px-4"><div className="flex flex-wrap justify-center gap-2.5">
          {Array.from({ length: 12 }, (_, i) => <Button size="sm" variant="outline" key={i}>Danh mục kiểm thử {i + 1}</Button>)}
        </div></div>
      </section>}
      <article className="py-12">
        <div className="container mx-auto px-4">
          <div className={mode === "index" ? "grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_340px]" : "grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[220px_minmax(0,1fr)_300px]"}>
            {mode === "article" && <aside data-test-toc className="hidden min-w-0 xl:block"><BlogTableOfContents headings={headings} /></aside>}
            <div className="min-w-0">
              <h1 className="mb-8 text-3xl font-bold">Bài viết thử nghiệm — dữ liệu mô phỏng</h1>
              {headings.map(heading => <section key={heading.id} className="mb-12 min-h-64">
                <h2 id={heading.id} className="mb-4 scroll-mt-24 text-2xl font-bold">{heading.text}</h2>
                <p>Nội dung dài dùng để kiểm tra sidebar bám theo bài viết. Không phải bài viết thật và không tạo hay sửa dữ liệu trên hệ thống.</p>
              </section>)}
            </div>
            <BlogSidebarRail className={mode === "article" ? "hidden lg:block" : undefined} offsetElementId={mode === "index" ? "blog-category-filter" : undefined}>
              <div dangerouslySetInnerHTML={{ __html: recentMarkup }} />
              <BlogSidebar />
              <BlogInternalLinks category="FDA" />
            </BlogSidebarRail>
          </div>
        </div>
      </article>
    </main>
    <footer data-test-footer className="h-96 bg-secondary p-8">Footer thử nghiệm</footer>
  </>
}
