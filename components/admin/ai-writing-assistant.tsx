"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Copy, Loader2, Wand2, Minimize2, Hash, FileText } from "lucide-react"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface AIWritingAssistantProps {
  selectedText?: string
  fullContent?: string
  onApply?: (newText: string) => void
  onGenerateMeta?: (meta: { description: string; keywords: string[] }) => void
  className?: string
}

type AITask = 
  | "improve" 
  | "shorten" 
  | "expand"
  | "keywords"
  | "meta_description"
  | "suggest_tags"

export function AIWritingAssistant({
  selectedText = "",
  fullContent = "",
  onApply,
  onGenerateMeta,
  className
}: AIWritingAssistantProps) {
  const [task, setTask] = useState<AITask>("improve")
  const [result, setResult] = useState("")
  const [loading, setLoading] = useState(false)
  const [suggestedTags, setSuggestedTags] = useState<string[]>([])

  const executeTask = async () => {
    const textToProcess = task === "meta_description" || task === "suggest_tags" 
      ? fullContent 
      : selectedText

    if (!textToProcess.trim()) {
      toast.error(
        task === "meta_description" || task === "suggest_tags"
          ? "Cần có nội dung bài viết để thực hiện"
          : "Vui lòng chọn đoạn văn bản cần xử lý"
      )
      return
    }

    setLoading(true)
    setSuggestedTags([])
    setResult("")

    try {
      console.log("[v0] AI Assistant - Sending request:", { task, textLength: textToProcess.length })
      
      const res = await fetch("/api/blog/ai-assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task,
          text: textToProcess,
        }),
      })

      const data = await res.json()
      
      if (!res.ok) {
        console.error("[v0] AI Assistant - Error response:", data)
        throw new Error(data.error || "AI request failed")
      }

      console.log("[v0] AI Assistant - Success:", { task, resultLength: data.result?.length || data.tags?.length })

      if (task === "suggest_tags") {
        setSuggestedTags(data.tags || [])
        setResult(`Đề xuất ${data.tags?.length || 0} tags`)
      } else if (task === "meta_description") {
        setResult(data.result)
        if (onGenerateMeta) {
          onGenerateMeta({
            description: data.result,
            keywords: data.keywords || []
          })
        }
      } else {
        setResult(data.result)
      }

      toast.success("AI đã xử lý xong!")
    } catch (error) {
      console.error("[v0] AI assistant error:", error)
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : "Có lỗi xảy ra khi xử lý"
      
      toast.error(errorMessage, {
        description: errorMessage.includes("GROQ_API_KEY") 
          ? "Liên hệ quản trị viên để cấu hình API key"
          : "Vui lòng thử lại sau"
      })
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result)
    toast.success("Đã copy vào clipboard")
  }

  const applyResult = () => {
    if (onApply && result) {
      onApply(result)
      toast.success("Đã áp dụng thay đổi")
    }
  }

  const taskOptions = [
    { value: "improve", label: "Cải thiện văn phong", icon: Wand2, needsSelection: true },
    { value: "shorten", label: "Rút ngắn văn bản", icon: Minimize2, needsSelection: true },
    { value: "expand", label: "Mở rộng ý tưởng", icon: FileText, needsSelection: true },
    { value: "keywords", label: "Thêm từ khóa SEO", icon: Hash, needsSelection: true },
    { value: "meta_description", label: "Tạo Meta Description", icon: FileText, needsSelection: false },
    { value: "suggest_tags", label: "Đề xuất Tags", icon: Hash, needsSelection: false },
  ]

  const currentTask = taskOptions.find(opt => opt.value === task)

  return (
    <Card className={cn("shadow-lg", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-yellow-500" />
          AI Writing Assistant
        </CardTitle>
        <CardDescription className="text-xs">
          {currentTask?.needsSelection 
            ? "Chọn văn bản để AI xử lý"
            : "AI sẽ phân tích toàn bộ nội dung"}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Task Selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Chọn tác vụ</label>
          <Select value={task} onValueChange={(value) => setTask(value as AITask)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {taskOptions.map((option) => {
                const Icon = option.icon
                return (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Icon className="h-4 w-4" />
                      {option.label}
                    </div>
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Selected Text Preview */}
        {currentTask?.needsSelection && selectedText && (
          <div className="p-2 bg-secondary rounded-md">
            <p className="text-xs text-muted-foreground mb-1">Văn bản đã chọn:</p>
            <p className="text-xs line-clamp-3">{selectedText}</p>
          </div>
        )}

        {/* Execute Button */}
        <Button 
          onClick={executeTask} 
          disabled={loading}
          className="w-full"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Xử lý bằng AI
            </>
          )}
        </Button>

        {/* Suggested Tags */}
        {suggestedTags.length > 0 && (
          <div className="space-y-2">
            <p className="text-sm font-medium">Tags đề xuất:</p>
            <div className="flex flex-wrap gap-2">
              {suggestedTags.map((tag, idx) => (
                <Badge key={idx} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Result */}
        {result && task !== "suggest_tags" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Kết quả:</label>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={copyToClipboard}
                  className="h-7 px-2 bg-transparent"
                >
                  <Copy className="h-3 w-3" />
                </Button>
                {onApply && task !== "meta_description" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={applyResult}
                    className="h-7 px-2 bg-transparent"
                  >
                    Áp dụng
                  </Button>
                )}
              </div>
            </div>
            <Textarea
              value={result}
              onChange={(e) => setResult(e.target.value)}
              className="min-h-[120px] text-sm"
              placeholder="Kết quả sẽ hiển thị ở đây..."
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
