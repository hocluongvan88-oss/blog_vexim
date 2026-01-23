"use client"

import React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, X, FileText, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

interface FileUploadInfo {
  file: File
  url?: string
  uploading: boolean
  error?: string
}

interface FileUploaderProps {
  fieldId: string
  fieldLabel: string
  maxSize?: number // in MB
  maxFiles?: number
  accept?: string
  onFilesChange?: (files: FileUploadInfo[]) => void
  existingFiles?: FileUploadInfo[]
  compact?: boolean
}

export function FileUploader({
  fieldId,
  fieldLabel,
  maxSize = 10,
  maxFiles = 3,
  accept = ".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp",
  onFilesChange,
  existingFiles = [],
  compact = false,
}: FileUploaderProps) {
  const [files, setFiles] = useState<FileUploadInfo[]>(existingFiles)
  const [isDragging, setIsDragging] = useState(false)
  const [uploadError, setUploadError] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (selectedFiles: FileList | null) => {
    if (!selectedFiles || selectedFiles.length === 0) return

    setUploadError("")

    // Check total files limit
    if (files.length + selectedFiles.length > maxFiles) {
      setUploadError(`Chỉ được upload tối đa ${maxFiles} file cho mục này`)
      return
    }

    const newFiles: FileUploadInfo[] = []

    for (let i = 0; i < selectedFiles.length; i++) {
      const file = selectedFiles[i]

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        setUploadError(`File "${file.name}" vượt quá giới hạn ${maxSize}MB`)
        continue
      }

      newFiles.push({
        file,
        uploading: true,
      })
    }

    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)

    // Upload files to Supabase
    for (const fileInfo of newFiles) {
      await uploadFile(fileInfo, updatedFiles)
    }
  }

  const uploadFile = async (fileInfo: FileUploadInfo, currentFiles: FileUploadInfo[]) => {
    try {
      const formData = new FormData()
      formData.append("file", fileInfo.file)
      formData.append("fieldId", fieldId)

      const response = await fetch("/api/gacc/upload", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const data = await response.json()

      // Update file info with URL
      const updatedFiles = currentFiles.map((f) =>
        f.file === fileInfo.file
          ? { ...f, url: data.url, uploading: false }
          : f
      )

      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles)
    } catch (error) {
      console.error("[v0] Upload error:", error)

      const updatedFiles = currentFiles.map((f) =>
        f.file === fileInfo.file
          ? { ...f, uploading: false, error: "Upload thất bại" }
          : f
      )

      setFiles(updatedFiles)
      onFilesChange?.(updatedFiles)
    }
  }

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    onFilesChange?.(updatedFiles)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    handleFileSelect(e.dataTransfer.files)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(1) + " MB"
  }

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= maxFiles}
            className="flex-shrink-0"
          >
            <Upload className="w-3.5 h-3.5 mr-1.5" />
            {files.length === 0 ? "Tải tài liệu" : `Đã tải (${files.length})`}
          </Button>
          <span className="text-xs text-muted-foreground">
            Tối đa {maxFiles} file, {maxSize}MB/file
          </span>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={accept}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
        />

        {uploadError && (
          <Alert variant="destructive" className="py-2">
            <AlertCircle className="h-3.5 w-3.5" />
            <AlertDescription className="text-xs">{uploadError}</AlertDescription>
          </Alert>
        )}

        {files.length > 0 && (
          <div className="space-y-1.5">
            {files.map((fileInfo, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-2 bg-muted/50 rounded-md border text-xs"
              >
                <FileText className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{fileInfo.file.name}</p>
                  <p className="text-muted-foreground">{formatFileSize(fileInfo.file.size)}</p>
                </div>
                {fileInfo.uploading && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                )}
                {fileInfo.error && (
                  <span className="text-destructive text-xs">Lỗi</span>
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFile(index)}
                  disabled={fileInfo.uploading}
                  className="h-6 w-6 p-0 flex-shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center transition-colors",
          isDragging && "border-primary bg-primary/5",
          files.length >= maxFiles && "opacity-50 cursor-not-allowed"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium mb-1">
          Kéo thả file vào đây hoặc{" "}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={files.length >= maxFiles}
            className="text-primary hover:underline"
          >
            chọn file
          </button>
        </p>
        <p className="text-xs text-muted-foreground">
          Tối đa {maxFiles} file, {maxSize}MB mỗi file
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Định dạng: PDF, Word, Excel, ảnh (JPG, PNG, WebP)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={accept}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {uploadError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadError}</AlertDescription>
        </Alert>
      )}

      {files.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium">Tài liệu đã tải lên:</p>
          {files.map((fileInfo, index) => (
            <div
              key={index}
              className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border"
            >
              <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{fileInfo.file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(fileInfo.file.size)}
                </p>
              </div>
              {fileInfo.uploading && (
                <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
              )}
              {fileInfo.error && (
                <span className="text-destructive text-sm">Upload thất bại</span>
              )}
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => removeFile(index)}
                disabled={fileInfo.uploading}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
