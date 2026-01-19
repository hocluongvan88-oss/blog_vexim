import { createStaticClient } from "@/lib/supabase/server"
import { Card } from "@/components/ui/card"
import { Eye, TrendingUp, Users, BarChart3, Globe, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function AnalyticsPage() {
  const supabase = createStaticClient()

  // Fetch all posts with views
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .eq("status", "published")
    .order("views_count", { ascending: false })

  // Calculate analytics
  const totalViews = posts?.reduce((sum, post) => sum + (post.views_count || 0), 0) || 0
  const totalViewsThisMonth = posts?.reduce((sum, post) => sum + (post.views_this_month || 0), 0) || 0
  const averageViews = posts?.length ? Math.round(totalViews / posts.length) : 0
  const topPost = posts?.[0]

  // Get total page view records
  const { count: totalPageViews } = await supabase.from("page_views").select("*", { count: "exact", head: true })

  // Get views from last 7 days
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const { count: viewsLast7Days } = await supabase
    .from("page_views")
    .select("*", { count: "exact", head: true })
    .gte("viewed_at", sevenDaysAgo.toISOString())

  const stats = [
    {
      title: "Tổng lượt xem",
      value: totalViews.toLocaleString("vi-VN"),
      icon: Globe,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Tất cả thời gian",
    },
    {
      title: "Lượt xem tháng này",
      value: totalViewsThisMonth.toLocaleString("vi-VN"),
      icon: Calendar,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Từ đầu tháng",
    },
    {
      title: "Lượt xem 7 ngày",
      value: (viewsLast7Days || 0).toLocaleString("vi-VN"),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Tuần này",
    },
    {
      title: "Trung bình/bài viết",
      value: averageViews.toLocaleString("vi-VN"),
      icon: BarChart3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      description: `Từ ${posts?.length || 0} bài viết`,
    },
  ]

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-2">Phân tích Analytics</h1>
        <p className="text-muted-foreground">Theo dõi hiệu suất bài viết và lượt truy cập website</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                <p className="text-3xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-lg`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Top Performing Post */}
      {topPost && (
        <Card className="p-6 mb-8">
          <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Bài viết hiệu suất cao nhất
          </h2>
          <div className="bg-gradient-to-r from-primary/10 to-accent/10 p-6 rounded-lg">
            <h3 className="text-lg font-semibold text-primary mb-2">{topPost.title}</h3>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                {topPost.views_count?.toLocaleString("vi-VN")} lượt xem
              </span>
              <span className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                {topPost.views_this_month?.toLocaleString("vi-VN")} lượt xem tháng này
              </span>
              <span className="px-2 py-1 rounded bg-accent/20 text-accent text-xs font-medium">{topPost.category}</span>
            </div>
            <Link href={`/admin/posts/${topPost.id}/edit`} className="text-sm text-primary hover:underline mt-4 inline-block">
              Chỉnh sửa bài viết →
            </Link>
          </div>
        </Card>
      )}

      {/* All Posts Table */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-primary mb-4">Hiệu suất tất cả bài viết</h2>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[300px]">Tiêu đề</TableHead>
                <TableHead>Danh mục</TableHead>
                <TableHead className="text-right">Tổng lượt xem</TableHead>
                <TableHead className="text-right">Lượt xem tháng này</TableHead>
                <TableHead className="text-right">Ngày xuất bản</TableHead>
                <TableHead className="text-right">Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {posts && posts.length > 0 ? (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">
                      <Link href={`/blog/${post.slug}`} target="_blank" className="hover:text-primary hover:underline">
                        {post.title}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded bg-accent/10 text-accent text-xs font-medium">
                        {post.category}
                      </span>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {(post.views_count || 0).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right text-green-600 font-semibold">
                      {(post.views_this_month || 0).toLocaleString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground text-sm">
                      {new Date(post.published_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/admin/posts/${post.id}/edit`} className="text-sm text-primary hover:underline">
                        Chỉnh sửa
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                    Chưa có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Note about data */}
      <Card className="p-4 mt-6 bg-blue-50 border-blue-200">
        <p className="text-sm text-blue-800">
          <strong>Lưu ý:</strong> Dữ liệu analytics được cập nhật theo thời gian thực từ database Supabase. Lượt xem
          tháng này sẽ được reset vào đầu mỗi tháng.
        </p>
      </Card>
    </div>
  )
}
