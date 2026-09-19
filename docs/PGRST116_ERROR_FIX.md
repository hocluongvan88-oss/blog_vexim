# Fix PGRST116 Error - Hướng dẫn sửa lỗi

## Lỗi là gì?

**PGRST116** là lỗi từ Supabase khi bạn sử dụng `.single()` nhưng query không tìm thấy row nào (0 rows).

\`\`\`
{
  code: "PGRST116",
  details: "The result contains 0 rows",
  hint: null,
  message: "Cannot coerce the result to a single JSON object"
}
\`\`\`

## Nguyên nhân

1. **Table chưa có data** - Ví dụ: `admin_users` chưa có user nào
2. **Config chưa được setup** - Ví dụ: `ai_config` chưa có `rag_enabled` hay `admin_notification_emails`
3. **Query filter không match** - Tìm record với ID/email không tồn tại

## Giải pháp đã áp dụng

### 1. Thay `.single()` bằng `.maybeSingle()`

**❌ Trước (gây lỗi):**
\`\`\`typescript
const { data } = await supabase
  .from("ai_config")
  .select("value")
  .eq("key", "rag_enabled")
  .single() // ❌ Throw error nếu không có row
\`\`\`

**✅ Sau (an toàn):**
\`\`\`typescript
const { data, error } = await supabase
  .from("ai_config")
  .select("value")
  .eq("key", "rag_enabled")
  .maybeSingle() // ✅ Trả về null nếu không có row

// Handle error nếu cần
if (error) {
  console.error("Error:", error)
}

const value = data?.value || defaultValue
\`\`\`

### 2. Xử lý error code PGRST116

**Cách 2 (nếu vẫn muốn dùng `.single()`):**
\`\`\`typescript
const { data, error } = await supabase
  .from("conversations")
  .select("id")
  .eq("customer_id", customerId)
  .single()

// Ignore PGRST116 error (no rows found)
if (error && error.code !== "PGRST116") {
  throw error
}

// data sẽ là null nếu không tìm thấy
\`\`\`

### 3. Sử dụng upsert thay vì update

**❌ Update (fail nếu row không tồn tại):**
\`\`\`typescript
await supabase
  .from("ai_config")
  .update({ value: newValue })
  .eq("key", "admin_notification_emails")
\`\`\`

**✅ Upsert (tạo mới nếu chưa có):**
\`\`\`typescript
await supabase
  .from("ai_config")
  .upsert(
    { 
      key: "admin_notification_emails", 
      value: newValue 
    },
    { onConflict: "key" }
  )
\`\`\`

## Các file đã được fix

✅ `/app/admin/(dashboard)/layout.tsx` - Admin user check
✅ `/components/admin/notification-settings.tsx` - Email config load/save
✅ `/lib/notification-service.tsx` - Email config fetch
✅ `/app/api/chatbot/send-ai/route.ts` - RAG config & conversation search
✅ `/app/api/chatbot/send/route.ts` - Conversation search

## Setup để tránh lỗi

### 1. Chạy migrations đầy đủ

\`\`\`bash
# Chạy tất cả SQL scripts theo thứ tự
scripts/001_create_posts_table.sql
scripts/002_create_admin_user.sql
scripts/007_create_chat_system.sql
scripts/008_create_ai_knowledge_base.sql
# ... và các script khác
\`\`\`

### 2. Tạo admin user đầu tiên

Vào Supabase SQL Editor và chạy:
\`\`\`sql
-- Tạo admin user
INSERT INTO admin_users (email, name, role)
VALUES ('your-email@example.com', 'Admin', 'admin')
ON CONFLICT (email) DO NOTHING;
\`\`\`

### 3. Khởi tạo AI config mặc định

\`\`\`sql
-- RAG setting
INSERT INTO ai_config (key, value)
VALUES ('rag_enabled', 'false')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- Email notifications
INSERT INTO ai_config (key, value)
VALUES ('admin_notification_emails', '[]'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
\`\`\`

## Best Practices

### Khi nào dùng `.single()` vs `.maybeSingle()`

**Dùng `.single()`:**
- Khi bạn **chắc chắn** record tồn tại
- Khi bạn muốn throw error nếu không tìm thấy
- Ví dụ: Lấy post detail từ slug trong URL

**Dùng `.maybeSingle()`:**
- Khi record **có thể không tồn tại**
- Khi bạn muốn check existence trước khi insert
- Khi load config/settings (có thể chưa được setup)
- Ví dụ: Check if user exists, load optional config

### Defensive coding

\`\`\`typescript
// ✅ Always handle both error and null data
const { data, error } = await supabase
  .from("table")
  .select("*")
  .eq("id", id)
  .maybeSingle()

if (error) {
  console.error("Database error:", error)
  return defaultValue
}

if (!data) {
  console.log("No record found, using default")
  return defaultValue
}

return data
\`\`\`

## Checklist khi gặp lỗi PGRST116

- [ ] Check xem table đã có data chưa?
- [ ] Check xem đã chạy migration chưa?
- [ ] Thay `.single()` thành `.maybeSingle()`
- [ ] Handle case khi `data` là `null`
- [ ] Xem xét dùng `upsert` thay vì `update`
- [ ] Add default values cho config
- [ ] Log error để debug

## Kết luận

Lỗi PGRST116 không phải là bug nghiêm trọng, chỉ là cảnh báo rằng query không tìm thấy data. Sử dụng `.maybeSingle()` và handle null case properly là cách tốt nhất để tránh lỗi này.
