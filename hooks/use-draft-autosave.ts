"use client"

import { useCallback, useEffect, useRef, useState } from "react"

export interface PendingDraft<T> {
  savedAt: number
  data: T
}

interface UseDraftAutosaveOptions<T> {
  /** Bật/tắt autosave (ví dụ: tắt khi đang tải bài viết) */
  enabled?: boolean
  /** Chu kỳ tự lưu (ms) */
  intervalMs?: number
  /** Bỏ qua không lưu khi nội dung vẫn "rỗng" */
  isEmpty?: (data: T) => boolean
}

/**
 * Tự động lưu bản nháp của trình soạn thảo blog vào localStorage + cảnh báo
 * khi rời trang mà chưa lưu. Giúp tránh mất bài khi vô tình đóng tab / mất mạng.
 */
export function useDraftAutosave<T extends object>(key: string, snapshot: T, options: UseDraftAutosaveOptions<T> = {}) {
  const { enabled = true, intervalMs = 8000, isEmpty } = options

  const [pendingDraft, setPendingDraft] = useState<PendingDraft<T> | null>(null)
  const [lastSavedAt, setLastSavedAt] = useState<number | null>(null)
  const isDirtyRef = useRef(false)
  const snapshotRef = useRef(snapshot)
  const lastSavedJsonRef = useRef<string>("")
  const isEmptyRef = useRef(isEmpty)

  useEffect(() => {
    snapshotRef.current = snapshot
  }, [snapshot])

  useEffect(() => {
    isEmptyRef.current = isEmpty
  }, [isEmpty])

  // Đọc bản nháp còn sót lại từ lần trước
  useEffect(() => {
    if (!enabled) return
    try {
      const raw = window.localStorage.getItem(key)
      if (!raw) return
      const parsed = JSON.parse(raw) as PendingDraft<T>
      if (parsed && parsed.data) setPendingDraft(parsed)
    } catch (error) {
      console.warn("[blog] Không đọc được bản nháp đã lưu:", error)
    }
  }, [key, enabled])

  // Khi bắt đầu có dữ liệu (load xong), coi trạng thái hiện tại là "đã lưu"
  useEffect(() => {
    if (!enabled) return
    lastSavedJsonRef.current = JSON.stringify(snapshotRef.current)
    isDirtyRef.current = false
  }, [enabled])

  // Tự lưu theo chu kỳ
  useEffect(() => {
    if (!enabled) return

    const timer = window.setInterval(() => {
      const data = snapshotRef.current
      if (isEmptyRef.current?.(data)) return

      let json = ""
      try {
        json = JSON.stringify(data)
      } catch {
        return
      }

      if (json === lastSavedJsonRef.current) return

      try {
        window.localStorage.setItem(key, JSON.stringify({ savedAt: Date.now(), data }))
        lastSavedJsonRef.current = json
        isDirtyRef.current = true
        setLastSavedAt(Date.now())
      } catch (error) {
        console.warn("[blog] Không lưu được bản nháp tạm:", error)
      }
    }, intervalMs)

    return () => window.clearInterval(timer)
  }, [key, enabled, intervalMs])

  // Cảnh báo khi rời trang mà còn thay đổi chưa lưu
  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!isDirtyRef.current) return
      event.preventDefault()
      event.returnValue = ""
    }

    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [])

  /** Gọi sau khi lưu thành công lên server. */
  const markSaved = useCallback(() => {
    isDirtyRef.current = false
    lastSavedJsonRef.current = JSON.stringify(snapshotRef.current)
    setPendingDraft(null)
    setLastSavedAt(null)
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  }, [key])

  const restoreDraft = useCallback(() => {
    const draft = pendingDraft
    setPendingDraft(null)
    isDirtyRef.current = true
    return draft?.data ?? null
  }, [pendingDraft])

  const discardDraft = useCallback(() => {
    setPendingDraft(null)
    try {
      window.localStorage.removeItem(key)
    } catch {
      /* ignore */
    }
  }, [key])

  return { pendingDraft, lastSavedAt, markSaved, restoreDraft, discardDraft }
}
