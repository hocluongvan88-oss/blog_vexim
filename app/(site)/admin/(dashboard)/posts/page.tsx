"use client"

import { useCallback, useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  PlusCircle,
  Edit,
  Trash2,
  Eye,
  Clock,
  FileText,
  Loader2,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { useDebouncedValue } from "@/hooks/use-debounced-value"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BLOG_CATEGORIES } from "@/lib/blog-categories"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Post = {
  id: string
  title: string
  slug: string
  excerpt: string
  category: string
  status: string
  created_at: string
  published_at?: string | null
  featured_image: string | null
}

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100]
const DEFAULT_PAGE_SIZE = 20

const POST_COLUMNS =
  "id, title, slug, excerpt, category, status, created_at, published_at, featured_image" as const

/** Bỏ dấu tiếng Việt để tìm kiếm không phân biệt dấu (VD: "dang ky fda" vẫn ra "Đăng ký FDA"). */
function normalizeForSearch(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
}

function hasVietnameseDiacritics(value: string): boolean {
  return /[^\u0000-\u024f]/.test(value) || /[ăâđêôơưàáảãạằắẳẵặầấẩẫậèéẻẽẹềếểễệìíỉĩịòóỏõọồốổỗộờớởỡợùúủũụừứửữựỳýỷỹỵ]/i.test(value)
}

/** Danh sách số trang hiển thị quanh trang hiện tại (có dấu … khi quá nhiều trang). */
function buildPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages = new Set<number>([1, total, current, current - 1, current + 1])
  const sorted = [...pages].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b)

  const result: (number | "ellipsis")[] = []
  let prev = 0
  for (const page of sorted) {
    if (prev && page - prev > 1) result.push("ellipsis")
    result.push(page)
    prev = page
  }
  return result
}

export default function PostsListPage() {
  const supabase = createClient()
  const { toast } = useToast()

  const [posts, setPosts] = useState<Post[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [deleteTitle, setDeleteTitle] = useState<string>("")
  const [isDeleting, setIsDeleting] = useState(false)

  // Phân trang
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [createdTotal, setCreatedTotal] = useState(0)

  // Bộ lọc
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebouncedValue(search, 350)
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const hasActiveFilters = !!search.trim() || statusFilter !== "all" || categoryFilter !== "all"

  const loadPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      const term = debouncedSearch.trim()
      const ascending = sortOrder === "oldest"

      // Bộ lọc dùng chung cho mọi truy vấn (trạng thái + danh mục)
      const applyFilters = <T extends { eq: (c: string, v: string) => T; neq: (c: string, v: string) => T; or: (f: string) => T }>(
        q: T,
      ): T => {
        if (statusFilter === "published") q = q.eq("status", "published")
        if (statusFilter === "draft") q = q.neq("status", "published")
        if (categoryFilter !== "all") q = q.eq("category", categoryFilter)
        return q
      }

      let list: Post[] = []
      let count = 0

      if (term) {
        // Tìm kiếm phía server (giữ nguyên dấu) — chính xác & phân trang chuẩn
        const safeTerm = term.replace(/[%,()]/g, " ")
        let q = supabase
          .from("posts")
          .select(POST_COLUMNS, { count: "exact" })
          .or(`title.ilike.%${safeTerm}%,excerpt.ilike.%${safeTerm}%,slug.ilike.%${safeTerm}%`)
        q = applyFilters(q)

        const from = (page - 1) * pageSize
        const { data, error, count: total } = await q
          .order("created_at", { ascending })
          .range(from, from + pageSize - 1)

        if (error) throw error
        list = (data as Post[]) ?? []
        count = total ?? list.length

        // Không tìm thấy + từ khoá gõ KHÔNG DẤU -> tìm lại bỏ dấu trên toàn bộ bài viết
        // (Postgres ilike không bỏ dấu được, nên "dang ky fda" sẽ trượt "Đăng ký FDA")
        if (count === 0 && !hasVietnameseDiacritics(term)) {
          const limited = applyFilters(supabase.from("posts").select(POST_COLUMNS))
          const { data: all, error: allError } = await limited.order("created_at", { ascending: true }).limit(1000)
          if (allError) throw allError

          const normalizedTerm = normalizeForSearch(term)
          const matched = ((all as Post[]) ?? []).filter((post) =>
            normalizeForSearch(`${post.title} ${post.excerpt || ""} ${post.slug}`).includes(normalizedTerm),
          )
          const ordered = ascending ? matched : [...matched].reverse()
          const pageFrom = (page - 1) * pageSize
          list = ordered.slice(pageFrom, pageFrom + pageSize)
          count = ordered.length
        }
      } else {
        let q = supabase.from("posts").select(POST_COLUMNS, { count: "exact" })
        q = applyFilters(q)

        const from = (page - 1) * pageSize
        const { data, error, count: total } = await q
          .order("created_at", { ascending })
          .range(from, from + pageSize - 1)

        if (error) throw error
        list = (data as Post[]) ?? []
        count = total ?? list.length
      }

      setPosts(list)
      setTotalCount(count)

      // Nếu trang hiện tại vượt quá số trang (do vừa xoá / đổi bộ lọc) -> lùi về trang cuối
      const lastPage = Math.max(1, Math.ceil(count / pageSize))
      if (page > lastPage) setPage(lastPage)
    } catch (error) {
      console.error("[admin] Không tải được danh sách bài viết:", error)
      toast({
        title: "Lỗi tải dữ liệu",
        description: "Không thể tải danh sách bài viết",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }, [supabase, page, pageSize, statusFilter, categoryFilter, debouncedSearch, sortOrder, toast])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  // Tìm kiếm / đổi bộ lọc / đổi số bài mỗi trang -> quay về trang 1
  useEffect(() => {
    setPage(1)
  }, [debouncedSearch, statusFilter, categoryFilter, sortOrder, pageSize])

  // Tổng số bài (không tính bộ lọc) để hiển thị ở tiêu đề trang
  useEffect(() => {
    let cancelled = false
    const loadTotal = async () => {
      const { count } = await supabase.from("posts").select("id", { count: "exact", head: true })
      if (!cancelled && typeof count === "number") setCreatedTotal(count)
    }
    loadTotal()
    return () => {
      cancelled = true
    }
  }, [supabase])

  const rangeFrom = totalCount === 0 ? 0 : (page - 1) * pageSize + 1
  const rangeTo = Math.min(page * pageSize, totalCount)

  const resetFilters = () => {
    setSearch("")
    setStatusFilter("all")
    setCategoryFilter("all")
    setSortOrder("newest")
    setPage(1)
  }

  const handleDeleteClick = (postId: string, title: string) => {
    setDeleteId(postId)
    setDeleteTitle(title)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteId) return

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/posts/${deleteId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Xóa bài viết thất bại")

      const remainingOnPage = posts.length - 1
      setPosts((prev) => prev.filter((post) => post.id !== deleteId))
      setTotalCount((prev) => Math.max(0, prev - 1))
      setCreatedTotal((prev) => Math.max(0, prev - 1))

      toast({ title: "Đã xóa", description: "Bài viết đã được xóa thành công" })

      // Xoá bài cuối cùng của trang -> lùi về trang trước, tránh trang trống
      if (remainingOnPage === 0 && page > 1) setPage((p) => p - 1)
    } catch (error) {
      toast({
        title: "Lỗi",
        description: error instanceof Error ? error.message : "Không thể xóa bài viết",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
      setDeleteTitle("")
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Quản lý bài viết</h1>
          <p className="text-muted-foreground">
            {hasActiveFilters
              ? `Tìm thấy ${totalCount} bài viết phù hợp (trên tổng ${createdTotal} bài)`
              : `Tổng cộng ${createdTotal} bài viết`}
          </p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90">
          <Link href="/admin/posts/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            Tạo bài viết mới
          </Link>
        </Button>
      </div>

      {/* Thanh công cụ: tìm kiếm + lọc + sắp xếp */}
      <Card className="p-4 mb-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Tìm theo tiêu đề, mô tả hoặc đường dẫn (gõ không dấu vẫn tìm được)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 pr-8"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                title="Xoá từ khoá"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | "published" | "draft")}>
            <SelectTrigger className="h-9 w-[150px] text-sm">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="published">Đã xuất bản</SelectItem>
              <SelectItem value="draft">Bản nháp</SelectItem>
            </SelectContent>
          </Select>

          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="h-9 w-[170px] text-sm">
              <SelectValue placeholder="Danh mục" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả danh mục</SelectItem>
              {BLOG_CATEGORIES.map((item) => (
                <SelectItem key={item.slug} value={item.slug}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-9 gap-1.5"
            onClick={() => setSortOrder((prev) => (prev === "newest" ? "oldest" : "newest"))}
            title="Đổi thứ tự sắp xếp theo ngày tạo"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            {sortOrder === "newest" ? "Mới nhất" : "Cũ nhất"}
          </Button>

          {hasActiveFilters && (
            <Button type="button" variant="ghost" size="sm" className="h-9 text-xs" onClick={resetFilters}>
              Xoá bộ lọc
            </Button>
          )}
        </div>
      </Card>

      {/* Danh sách bài viết */}
      <Card className="p-6">
        {isLoading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                {post.featured_image && (
                  <div className="w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={post.featured_image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-primary mb-1 truncate">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(post.created_at).toLocaleDateString("vi-VN")}
                    </span>
                    <span
                      className={`px-2 py-1 rounded font-medium ${
                        post.status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {post.status === "published" ? "Đã xuất bản" : "Bản nháp"}
                    </span>
                    <span className="bg-secondary px-2 py-1 rounded">{post.category}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {post.status === "published" && (
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/blog/${post.slug}`} target="_blank">
                        <Eye className="w-4 h-4" />
                      </Link>
                    </Button>
                  )}
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/admin/posts/${post.id}/edit`}>
                      <Edit className="w-4 h-4" />
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteClick(post.id, post.title)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-primary mb-2">
              {hasActiveFilters ? "Không tìm thấy bài viết phù hợp" : "Chưa có bài viết nào"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {hasActiveFilters
                ? "Thử từ khoá khác hoặc xoá bộ lọc để xem tất cả bài viết."
                : "Bắt đầu tạo bài viết đầu tiên của bạn"}
            </p>
            {hasActiveFilters ? (
              <Button variant="outline" onClick={resetFilters}>
                Xoá bộ lọc
              </Button>
            ) : (
              <Button asChild className="bg-accent hover:bg-accent/90">
                <Link href="/admin/posts/new">
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Tạo bài viết mới
                </Link>
              </Button>
            )}
          </div>
        )}
      </Card>

      {/* Phân trang */}
      {!isLoading && totalCount > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span>
              Hiển thị <strong className="text-foreground">{rangeFrom}</strong>–
              <strong className="text-foreground">{rangeTo}</strong> trong{" "}
              <strong className="text-foreground">{totalCount}</strong> bài viết
            </span>
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline">Số bài mỗi trang:</span>
              <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                <SelectTrigger className="h-8 w-[70px] text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={page <= 1}
                onClick={() => setPage(1)}
                title="Trang đầu"
              >
                <ChevronsLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                title="Trang trước"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>

              {buildPageList(page, totalPages).map((item, index) =>
                item === "ellipsis" ? (
                  <span key={`e-${index}`} className="px-1 text-muted-foreground">
                    …
                  </span>
                ) : (
                  <Button
                    key={item}
                    variant={item === page ? "default" : "outline"}
                    size="sm"
                    className="h-8 w-8 p-0 text-xs"
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </Button>
                ),
              )}

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                title="Trang sau"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                disabled={page >= totalPages}
                onClick={() => setPage(totalPages)}
                title="Trang cuối"
              >
                <ChevronsRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Hộp thoại xác nhận xoá */}
      <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa bài viết</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteTitle ? (
                <>
                  Bạn có chắc chắn muốn xóa bài viết <strong>&quot;{deleteTitle}&quot;</strong>? Hành động này không
                  thể hoàn tác.
                </>
              ) : (
                <>Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xóa...
                </>
              ) : (
                "Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
