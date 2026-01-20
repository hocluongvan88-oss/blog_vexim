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
import { BookOpen, Upload, FileText, Link2, Loader2, Trash2, RefreshCw, Brain, Download, Pencil } from "lucide-react"
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
  const [editingDoc, setEditingDoc] = useState<KnowledgeDocument | null>(null)

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
    setEditingDoc(null)
  }

  const handleEdit = (doc: KnowledgeDocument) => {
    setEditingDoc(doc)
    setTitle(doc.title)
    setContent(doc.content)
    setSourceType(doc.source_type)
    if (doc.source_url) {
      setUrl(doc.source_url)
    }
    setOpen(true)
  }

  const handleUpdate = async () => {
    if (!editingDoc) return
    if (!title) {
      toast.error("Vui lòng nhập tiêu đề")
      return
    }

    setUploading(true)
    try {
      const res = await fetch(`/api/knowledge-base/documents/${editingDoc.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content: sourceType === "text" ? content : editingDoc.content,
        }),
      })

      if (res.ok) {
        toast.success("Đã cập nhật tài liệu")
        setOpen(false)
        resetForm()
        loadDocuments()
      } else {
        toast.error("Không thể cập nhật")
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra")
    } finally {
      setUploading(false)
    }
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
    <div className="space-y-4 p-4 lg:space-y-6 lg:p-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Kho Tri Thức AI</h1>
          <p className="text-sm lg:text-base text-muted-foreground">
            Quản lý tài liệu để AI học và trả lời câu hỏi của khách hàng
          </p>
        </div>

        <div className="flex gap-2 w-full lg:w-auto">
          <Button 
            variant="outline"
            onClick={handleImportFiles}
            disabled={importing}
            className="flex-1 lg:flex-none text-xs lg:text-sm bg-transparent"
          >
            {importing ? (
              <>
                <Loader2 className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4 animate-spin" />
                <span className="hidden lg:inline">Đang import...</span>
                <span className="lg:hidden">Import...</span>
              </>
            ) : (
              <>
                <Download className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden lg:inline">Import Files</span>
                <span className="lg:hidden">Import</span>
              </>
            )}
          </Button>
          
          <Dialog open={open} onOpenChange={(isOpen) => {
            setOpen(isOpen)
            if (!isOpen) resetForm()
          }}>
            <DialogTrigger asChild>
              <Button className="flex-1 lg:flex-none text-xs lg:text-sm">
                <Upload className="mr-1 lg:mr-2 h-3 w-3 lg:h-4 lg:w-4" />
                <span className="hidden lg:inline">Thêm Tài Liệu</span>
                <span className="lg:hidden">Thêm</span>
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
                    <div className="flex items-center justify-between mb-2">
                      <Label htmlFor="content">Nội Dung</Label>
                      <span className={`text-xs ${content.length > 50000 ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                        {content.length.toLocaleString()} ký tự
                        {content.length > 50000 && ' - Quá dài! Nên chia nhỏ tài liệu'}
                      </span>
                    </div>
                    <Textarea
                      id="content"
                      placeholder="Nhập nội dung tài liệu..."
                      className="resize-none overflow-y-auto"
                      style={{ 
                        height: '400px', 
                        minHeight: '400px', 
                        maxHeight: '400px',
                        fieldSizing: 'initial'
                      }}
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                    />
                    {content.length > 30000 && (
                      <p className="text-xs text-orange-600 dark:text-orange-400 mt-2">
                        Cảnh báo: Tài liệu dài hơn 30,000 ký tự có thể xử lý chậm. 
                        {content.length > 50000 && ' Khuyến nghị chia thành nhiều tài liệu nhỏ hơn.'}
                      </p>
                    )}
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
                    <Label htmlFor="file">File</Label>
                    <p className="text-xs text-muted-foreground mb-2">
                      Hỗ trợ: PDF, Word (DOC/DOCX), Text (TXT), Markdown (MD), RTF
                    </p>
                    <Input
                      id="file"
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.md,.rtf"
                      onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                    {file && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Đã chọn: {file.name} ({(file.size / 1024).toFixed(2)} KB)
                      </p>
                    )}
                  </div>
                )}

                <Button 
                  onClick={editingDoc ? handleUpdate : handleUpload} 
                  disabled={uploading} 
                  className="w-full"
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingDoc ? "Đang cập nhật..." : "Đang tải lên..."}
                    </>
                  ) : (
                    <>
                      {editingDoc ? <Pencil className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                      {editingDoc ? "Cập Nhật" : "Tải Lên"}
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
          <CardTitle className="flex items-center gap-2 text-lg lg:text-xl">
            <Brain className="h-4 w-4 lg:h-5 lg:w-5" />
            Danh Sách Tài Liệu
          </CardTitle>
          <CardDescription className="text-xs lg:text-sm">
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
              <p className="text-muted-foreground text-sm">Chưa có tài liệu nào</p>
            </div>
          ) : (
            <div className="overflow-x-auto -mx-4 lg:mx-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Tiêu Đề</TableHead>
                    <TableHead className="hidden md:table-cell">Nguồn</TableHead>
                    <TableHead className="hidden lg:table-cell">Trạng Thái</TableHead>
                    <TableHead className="hidden lg:table-cell">Chunks</TableHead>
                    <TableHead className="hidden md:table-cell">Ngày Tạo</TableHead>
                    <TableHead className="text-right">Hành Động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {documents.map((doc) => (
                    <TableRow key={doc.id}>
                      <TableCell className="font-medium text-sm lg:text-base">
                        <div>
                          <div className="truncate max-w-[200px] lg:max-w-none">{doc.title}</div>
                          <div className="flex gap-2 mt-1 md:hidden">
                            <Badge variant="outline" className="text-xs">
                              {doc.source_type === "text" && "Văn bản"}
                              {doc.source_type === "url" && "URL"}
                              {doc.source_type === "file" && "File"}
                            </Badge>
                            {doc.status === "active" && (
                              <Badge variant="default" className="text-xs">Hoạt động</Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant="outline" className="text-xs">
                          {doc.source_type === "text" && "Văn bản"}
                          {doc.source_type === "url" && "URL"}
                          {doc.source_type === "file" && "File"}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell">
                        {doc.status === "processing" && (
                          <Badge variant="secondary" className="text-xs">
                            <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                            Đang xử lý
                          </Badge>
                        )}
                        {doc.status === "active" && (
                          <Badge variant="default" className="text-xs">Hoạt động</Badge>
                        )}
                        {doc.status === "error" && (
                          <Badge variant="destructive" className="text-xs">Lỗi</Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">{doc.chunks_count}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">
                        {new Date(doc.created_at).toLocaleDateString("vi-VN")}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => handleEdit(doc)}
                            title="Chỉnh sửa"
                          >
                            <Pencil className="h-3 w-3 lg:h-4 lg:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-transparent"
                            onClick={() => handleReprocess(doc.id)}
                            title="Xử lý lại"
                          >
                            <RefreshCw className="h-3 w-3 lg:h-4 lg:w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 bg-transparent hover:bg-destructive hover:text-destructive-foreground"
                            onClick={() => handleDelete(doc.id)}
                            title="Xóa"
                          >
                            <Trash2 className="h-3 w-3 lg:h-4 lg:w-4" />
                          </Button>
                        </div>
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
