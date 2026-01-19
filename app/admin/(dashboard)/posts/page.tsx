import { createStaticClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle, Edit, Trash2, Eye, Clock, FileText } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function PostsListPage() {
  const supabase = createStaticClient()

  const { data: posts } = await supabase.from("posts").select("*").order("created_at", { ascending: false })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">Quản lý bài viết</h1>
          <p className="text-muted-foreground">Xem, chỉnh sửa và xóa bài viết của bạn</p>
        </div>
        <Button asChild className="bg-accent hover:bg-accent/90">
          <Link href="/admin/posts/new">
            <PlusCircle className="w-4 h-4 mr-2" />
            Tạo bài viết mới
          </Link>
        </Button>
      </div>

      {/* Posts List */}
      <Card className="p-6">
        {posts && posts.length > 0 ? (
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
              >
                {/* Featured Image */}
                {post.featured_image && (
                  <div className="w-32 h-20 flex-shrink-0 rounded-lg overflow-hidden">
                    <img
                      src={post.featured_image || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Content */}
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

                {/* Actions */}
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
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium text-primary mb-2">Chưa có bài viết nào</h3>
            <p className="text-muted-foreground mb-4">Bắt đầu tạo bài viết đầu tiên của bạn</p>
            <Button asChild className="bg-accent hover:bg-accent/90">
              <Link href="/admin/posts/new">
                <PlusCircle className="w-4 h-4 mr-2" />
                Tạo bài viết mới
              </Link>
            </Button>
          </div>
        )}
      </Card>
    </div>
  )
}
