"use client"

import { useEffect, useState } from "react"

/**
 * Trả về giá trị "trễ" sau `delay` ms.
 *
 * Dùng cho phân tích SEO: trước đây `SEOChecker` tính lại toàn bộ (regex trên cả bài)
 * ngay mỗi lần gõ phím, gây giật khi bài dài. Debounce giữ phản hồi nhanh mà vẫn cập nhật
 * sau khi writer ngừng gõ.
 */
export function useDebouncedValue<T>(value: T, delay = 400): T {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay)
    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debounced
}
