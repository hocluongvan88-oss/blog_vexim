"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Upload, FileText, Link2, Loader2, Trash2, RefreshCw, Brain, Download } from "lucide-react"
import { toast } from "sonner"

interface KnowledgeDocument {
  id: string
  title: string
  content: string
  source_type: "text" | "url" | "file"
  source_url?: string
  status: "processing" | "active" | "error"
  chunks_count: number
  created_at: string
}

export default function KnowledgeBasePage() {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [open, setOpen] = useState(false)

  // Form states
  const [sourceType, setSourceType] = useState<"text" | "url" | "file">("text")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [url, setUrl] = useState("")
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    loadDocuments()
  }, [])

  const loadDocuments = async () => {
    try {
      const res = await fetch("/api/knowledge-base/documents")
      if (res.ok) {
        const data = await res.json()
        setDocuments(data)
      }
    } catch (error) {
      console.error("Failed to load documents:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async () => {
    if (!title) {
      toast.error("Vui lòng nhập tiêu đề")
      return
    }

    if (sourceType === "text" && !content) {
      toast.error("Vui lòng nhập nội dung")
      return
    }

    if (sourceType === "url" && !url) {
      toast.error("Vui lòng nhập URL")
      return
    }

    if (sourceType === "file" && !file) {
      toast.error("Vui lòng chọn file")
      return
    }

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append("title", title)
      formData.append("sourceType", sourceType)

      if (sourceType === "text") {
        formData.append("content", content)
      } else if (sourceType === "url") {
        formData.append("url", url)
      } else if (sourceType === "file" && file) {
        formData.append("file", file)
      }

      const res = await fetch("/api/knowledge-base/upload", {
        method: "POST",
        body: formData,
      })

      if (res.ok) {
        toast.success("Tài liệu đã được thêm vào hệ thống!")
        setOpen(false)
        resetForm()
        loadDocuments()
      } else {
        const error = await res.json()
        console.error("[v0] Upload error:", error)
        toast.error(error.details || error.error || "Có lỗi xảy ra")
      }
    } catch (error) {
      toast.error("Không thể tải lên tài liệu")
    } finally {
      setUploading(false)
    }
  }

  const resetForm = () => {
    setTitle("")
    setContent("")
    setUrl("")
    setFile(null)
    setSourceType("text")
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bạn có chắc muốn xóa tài liệu này?")) return

    try {
      const res = await fetch(`/api/knowledge-base/documents/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        toast.success("Đã xóa tài liệu")
        loadDocuments()
      } else {
        toast.error("Không thể xóa tài liệu")
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    }
  }

  const handleReprocess = async (id: string) => {
    try {
      const res = await fetch(`/api/knowledge-base/documents/${id}/reprocess`, {
        method: "POST",
      })

      if (res.ok) {
        toast.success("Đang xử lý lại tài liệu")
        loadDocuments()
      } else {
        toast.error("Không thể xử lý lại")
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    }
  }

  const handleImportFiles = async () => {
    if (!confirm("Import tất cả file .md từ thư mục /knowledge/? Các file đã tồn tại sẽ bị bỏ qua.")) return

    setImporting(true)
    try {
      const res = await fetch("/api/knowledge-base/import-files", {
        method: "POST",
      })

      if (res.ok) {
        const result = await res.json()
        const { summary } = result
        
        toast.success(
          `Import hoàn tất! Thành công: ${summary.success}, Bỏ qua: ${summary.skipped}, Lỗi: ${summary.errors}`
        )
        loadDocuments()
      } else {
        toast.error("Import thất bại")
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    } finally {
      setImporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Kho Tri Thức AI</h1>
          <p className="text-muted-foreground">
            Quản lý tài liệu để AI học và trả lời câu hỏi của khách hàng
          </p>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline"
            onClick={handleImportFiles}
            disabled={importing}
          >
            {importing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang import...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Import Files
              </>
            )}
          </Button>
          
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Upload className="mr-2 h-4 w-4" />
                Thêm Tài Liệu
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Thêm Tài Liệu Mới</DialogTitle>
                <DialogDescription>
                  Tải lên tài liệu để AI học và trả lời câu hỏi
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Loại Nguồn</Label>
                  <Tabs value={sourceType} onValueChange={(v) => setSourceType(v as any)}>
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="text">
                        <FileText className="mr-2 h-4 w-4" />
                        Văn Bản
                      </TabsTrigger>
                      <TabsTrigger value="url">
                        <Link2 className="mr-2 h-4 w-4" />
                        URL
                      </TabsTrigger>
                      <TabsTrigger value="file">
                        <Upload className="mr-2 h-4 w-4" />
                        File
                      </TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                <div>
                  <Label htmlFor="title">Tiêu Đề</Label>
                  <Input
                    id="title"
                    placeholder="Ví dụ: Quy trình đăng ký FDA"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {sourceType === "text" && (
                  <div>
                    <Label htmlFor="content">Nội Dung</Label>
                    <Textarea
                      id="content"
                      placeholder="Nhập nội dung tài liệu..."
                      className="min-h-[200px]"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                  </div>
                )}

                {sourceType === "url" && (
                  <div>
                    <Label htmlFor="url">URL</Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com/tai-lieu"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                    />
                  </div>
                )}

                {sourceType === "file" && (
                  <div>
                    <Label htmlFor="file">File (PDF, DOCX, TXT)</Label>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.docx,.txt"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                  </div>
                )}

                <Button onClick={handleUpload} disabled={uploading} className="w-full">
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang tải lên...
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-4 w-4" />
                      Tải Lên
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Danh Sách Tài Liệu
          </CardTitle>
          <CardDescription>
            {documents.length} tài liệu đã được nạp vào hệ thống
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Chưa có tài liệu nào</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tiêu Đề</TableHead>
                  <TableHead>Nguồn</TableHead>
                  <TableHead>Trạng Thái</TableHead>
                  <TableHead>Chunks</TableHead>
                  <TableHead>Ngày Tạo</TableHead>
                  <TableHead className="text-right">Hành Động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {documents.map((doc) => (
                  <TableRow key={doc.id}>
                    <TableCell className="font-medium">{doc.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {doc.source_type === "text" && "Văn bản"}
                        {doc.source_type === "url" && "URL"}
                        {doc.source_type === "file" && "File"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {doc.status === "processing" && (
                        <Badge variant="secondary">
                          <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                          Đang xử lý
                        </Badge>
                      )}
                      {doc.status === "active" && (
                        <Badge variant="default">Hoạt động</Badge>
                      )}
                      {doc.status === "error" && (
                        <Badge variant="destructive">Lỗi</Badge>
                      )}
                    </TableCell>
                    <TableCell>{doc.chunks_count}</TableCell>
                    <TableCell>
                      {new Date(doc.created_at).toLocaleDateString("vi-VN")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReprocess(doc.id)}
                        >
                          <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
