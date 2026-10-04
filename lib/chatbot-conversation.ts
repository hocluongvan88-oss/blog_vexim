/**
 * Tìm hoặc tạo hội thoại website cho một khách.
 *
 * Vì sao tách ra: khách có thể gửi FILE ngay khi vừa mở khung chat, lúc đó chưa
 * có conversation_id (hội thoại chỉ được tạo ở tin nhắn đầu tiên). Nếu API nhận
 * file bắt buộc phải có conversation_id thì khách gửi file trước sẽ bị lỗi.
 */

export interface ConversationRef {
  id: string
  customerName?: string
  metadata?: Record<string, any>
}

export async function findOrCreateConversation(
  supabase: any,
  options: { customerId?: string; customerName?: string; conversationId?: string },
): Promise<ConversationRef | null> {
  const { customerId, customerName, conversationId } = options

  if (conversationId) {
    const { data } = await supabase
      .from("conversations")
      .select("id, customer_name, metadata")
      .eq("id", conversationId)
      .maybeSingle()
    if (data) return data as ConversationRef
  }

  if (!customerId) return null

  const { data: existing } = await supabase
    .from("conversations")
    .select("id, customer_name, metadata")
    .eq("customer_id", customerId)
    .eq("channel", "website")
    .eq("status", "active")
    .maybeSingle()

  if (existing) return existing as ConversationRef

  const { data: created } = await supabase
    .from("conversations")
    .insert({
      customer_id: customerId,
      customer_name: customerName || "Khách hàng",
      channel: "website",
      status: "active",
    })
    .select("id, customer_name, metadata")
    .single()

  return (created as ConversationRef) || null
}
