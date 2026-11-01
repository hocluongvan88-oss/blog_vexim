/**
 * Component render JSON-LD — thay cho việc mỗi trang tự viết
 * `<script type="application/ld+json" dangerouslySetInnerHTML={...} />`.
 *
 * Cố ý dùng thẻ <script> THƯỜNG chứ không phải `next/script` với
 * `strategy="beforeInteractive"`: trong Next 15, Script beforeInteractive đặt ở
 * layout không được đưa vào HTML render sẵn (kiểm chứng bằng curl — khối schema
 * biến mất khỏi SSR output), tức là crawler không chạy JS sẽ không thấy schema.
 * Thẻ <script> thường trong Server Component luôn nằm trong HTML gốc.
 */
export function JsonLd({
  id,
  data,
}: {
  /** id duy nhất của khối script (dễ tìm khi debug HTML) */
  id: string
  /** Object schema — sẽ được JSON.stringify */
  data: Record<string, unknown> | null | undefined
}) {
  if (!data) return null

  return (
    <script
      id={id}
      type="application/ld+json"
      // Escape "<" để nội dung dạng "</script>" trong chuỗi (mô tả dịch vụ, câu hỏi FAQ)
      // không làm trình duyệt đóng thẻ sớm và phá vỡ phần HTML phía sau.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  )
}

export default JsonLd
