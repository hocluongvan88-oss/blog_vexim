import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Building2, Package, FileText, CheckCircle, XCircle, Clock } from "lucide-react"
import Link from "next/link"

export const metadata = {
  title: "Chi tiết hồ sơ GACC - Admin | Vexim Global",
}

export default async function GACCSubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // Check authentication
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/admin/login")
  }

  // Fetch submission
  const { data: submission, error } = await supabase
    .from("gacc_submissions")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !submission) {
    notFound()
  }

  const sections = [
    {
      title: "Thông tin doanh nghiệp",
      icon: Building2,
      fields: [
        { label: "Tên doanh nghiệp", value: submission.company_name },
        { label: "Email", value: submission.email || "Chưa cung cấp" },
        { label: "Số điện thoại", value: submission.phone },
        { label: "Mã số thuế", value: submission.tax_code },
        { label: "Địa chỉ sản xuất", value: submission.production_address },
      ],
    },
    {
      title: "Thông tin sản phẩm",
      icon: Package,
      fields: [
        { label: "Tên sản phẩm", value: submission.product_name },
        { label: "Mã HS", value: submission.hs_code },
        { label: "Mã vùng trồng", value: submission.planting_area_code || "Không có" },
      ],
    },
  ]

  const assessmentData = [
    { title: "1. Tổng quan", content: submission.general_info },
    { title: "2. Môi trường sản xuất", content: submission.production_environment },
    { title: "3. Vệ sinh thiết bị", content: submission.equipment_cleaning },
    { title: "4. Kiểm soát quy trình", content: submission.process_control },
    { title: "5. Ghi chép hồ sơ", content: submission.record_keeping },
    { title: "6. Đào tạo nhân viên", content: submission.employee_training },
    { title: "7. Kiểm soát dịch hại", content: submission.pest_control },
    { title: "8. Chất lượng nước", content: submission.water_quality },
    { title: "9. Kiểm soát nguyên liệu", content: submission.raw_material_control },
    { title: "10. Vật liệu bao bì", content: submission.packaging_material },
    { title: "11. Kiểm tra sản phẩm", content: submission.product_testing },
    { title: "12. Hệ thống truy xuất", content: submission.traceability_system },
    { title: "13. Xử lý khiếu nại", content: submission.complaint_handling },
    { title: "14. Lưu trữ tài liệu", content: submission.document_retention },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link href="/admin/gacc-submissions">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{submission.company_name}</h1>
            <p className="text-muted-foreground mt-1">
              Mã hồ sơ: <span className="font-mono">{submission.id.slice(0, 8)}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {submission.status === "pending" && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-700">
              <Clock className="mr-1 h-4 w-4" />
              Chờ xử lý
            </Badge>
          )}
          {submission.status === "approved" && (
            <Badge variant="secondary" className="bg-green-100 text-green-700">
              <CheckCircle className="mr-1 h-4 w-4" />
              Đã duyệt
            </Badge>
          )}
          {submission.status === "rejected" && (
            <Badge variant="secondary" className="bg-red-100 text-red-700">
              <XCircle className="mr-1 h-4 w-4" />
              Từ chối
            </Badge>
          )}
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid gap-6 md:grid-cols-2">
        {sections.map((section) => (
          <Card key={section.title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <section.icon className="h-5 w-5 text-primary" />
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {section.fields.map((field) => (
                <div key={field.label}>
                  <p className="text-sm font-medium text-muted-foreground">{field.label}</p>
                  <p className="text-base">{field.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assessment Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Nội dung đánh giá
          </CardTitle>
          <CardDescription>Chi tiết các mục đánh giá trong hồ sơ GACC</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {assessmentData.map((item, index) => (
            <div key={index}>
              <h3 className="font-semibold text-base mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-line">
                {item.content || "Chưa có thông tin"}
              </p>
              {index < assessmentData.length - 1 && <Separator className="mt-6" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Attachments */}
      {submission.attachments && Object.keys(submission.attachments).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Tài liệu đính kèm</CardTitle>
            <CardDescription>Các file đã được tải lên</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(submission.attachments).map(([fieldId, files]: [string, any]) => {
                if (!Array.isArray(files) || files.length === 0) return null
                return (
                  <div key={fieldId} className="border rounded-lg p-4">
                    <h4 className="font-medium mb-2 capitalize">{fieldId.replace(/_/g, " ")}</h4>
                    <div className="space-y-2">
                      {files.map((file: any, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-muted p-2 rounded">
                          <span className="text-sm">{file.fileName}</span>
                          <Button variant="outline" size="sm" asChild>
                            <a href={file.fileUrl} target="_blank" rel="noopener noreferrer">
                              Xem file
                            </a>
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Hành động</CardTitle>
          <CardDescription>Cập nhật trạng thái hồ sơ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button variant="default" className="bg-green-600 hover:bg-green-700">
              <CheckCircle className="mr-2 h-4 w-4" />
              Phê duyệt
            </Button>
            <Button variant="destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Từ chối
            </Button>
            <Button variant="outline">Yêu cầu bổ sung</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
