import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FileText, ExternalLink, CheckCircle, Clock, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Hồ sơ đăng ký GACC - Admin | Vexim Global",
  description: "Quản lý hồ sơ đăng ký GACC từ khách hàng",
}

export default async function GACCSubmissionsPage() {
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Fetch GACC submissions
  const { data: submissions, error } = await supabase
    .from("gacc_submissions")
    .select("*")
    .order("submitted_at", { ascending: false })

  if (error) {
    console.error("Error fetching GACC submissions:", error)
  }

  const stats = {
    total: submissions?.length || 0,
    pending: submissions?.filter((s) => s.status === "pending").length || 0,
    inReview: submissions?.filter((s) => s.status === "in_review").length || 0,
    approved: submissions?.filter((s) => s.status === "approved").length || 0,
    rejected: submissions?.filter((s) => s.status === "rejected").length || 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Hồ sơ đăng ký GACC</h1>
        <p className="text-muted-foreground mt-2">Quản lý và xem xét hồ sơ đánh giá GACC từ khách hàng</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng hồ sơ</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chờ xử lý</CardTitle>
            <Clock className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-500">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đang xét duyệt</CardTitle>
            <AlertCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{stats.inReview}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đã duyệt</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.approved}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Từ chối</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Submissions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách hồ sơ</CardTitle>
          <CardDescription>Xem chi tiết và cập nhật trạng thái hồ sơ GACC</CardDescription>
        </CardHeader>
        <CardContent>
          {!submissions || submissions.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="mt-4 text-lg font-medium">Chưa có hồ sơ nào</p>
              <p className="text-sm text-muted-foreground">Các hồ sơ đăng ký GACC sẽ hiển thị tại đây</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã HS</TableHead>
                    <TableHead>Doanh nghiệp</TableHead>
                    <TableHead>Sản phẩm</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead>Ngày gửi</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((submission) => (
                    <TableRow key={submission.id}>
                      <TableCell className="font-mono text-sm">{submission.hs_code}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{submission.company_name}</p>
                          <p className="text-sm text-muted-foreground">MST: {submission.tax_code}</p>
                        </div>
                      </TableCell>
                      <TableCell>{submission.product_name}</TableCell>
                      <TableCell>
                        {submission.status === "pending" && (
                          <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                            <Clock className="mr-1 h-3 w-3" />
                            Chờ xử lý
                          </Badge>
                        )}
                        {submission.status === "in_review" && (
                          <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                            <AlertCircle className="mr-1 h-3 w-3" />
                            Đang xét duyệt
                          </Badge>
                        )}
                        {submission.status === "approved" && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Đã duyệt
                          </Badge>
                        )}
                        {submission.status === "rejected" && (
                          <Badge variant="secondary" className="bg-red-100 text-red-700">
                            <XCircle className="mr-1 h-3 w-3" />
                            Từ chối
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(submission.submitted_at).toLocaleDateString("vi-VN", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <Link href={`/admin/gacc-submissions/${submission.id}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Xem chi tiết
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
