-- Script để xóa các conversations test
-- Chạy script này từ Admin Panel hoặc Supabase SQL Editor

-- OPTION 1: Xóa TẤT CẢ conversations (cẩn thận!)
-- DELETE FROM chat_messages;
-- DELETE FROM conversation_handovers;
-- DELETE FROM conversations;

-- OPTION 2: Xóa conversations cũ hơn X ngày
DELETE FROM chat_messages 
WHERE conversation_id IN (
  SELECT id FROM conversations 
  WHERE created_at < NOW() - INTERVAL '7 days'
);

DELETE FROM conversation_handovers 
WHERE conversation_id IN (
  SELECT id FROM conversations 
  WHERE created_at < NOW() - INTERVAL '7 days'
);

DELETE FROM conversations 
WHERE created_at < NOW() - INTERVAL '7 days';

-- OPTION 3: Xóa conversations test (theo pattern tên)
DELETE FROM chat_messages 
WHERE conversation_id IN (
  SELECT id FROM conversations 
  WHERE customer_name ILIKE '%test%' 
    OR customer_name ILIKE '%demo%'
);

DELETE FROM conversation_handovers 
WHERE conversation_id IN (
  SELECT id FROM conversations 
  WHERE customer_name ILIKE '%test%' 
    OR customer_name ILIKE '%demo%'
);

DELETE FROM conversations 
WHERE customer_name ILIKE '%test%' 
  OR customer_name ILIKE '%demo%';

-- OPTION 4: Xóa conversations từ channel cụ thể
-- DELETE FROM chat_messages WHERE conversation_id IN (SELECT id FROM conversations WHERE channel = 'website');
-- DELETE FROM conversation_handovers WHERE conversation_id IN (SELECT id FROM conversations WHERE channel = 'website');
-- DELETE FROM conversations WHERE channel = 'website';

-- Kiểm tra kết quả
SELECT COUNT(*) as total_conversations FROM conversations;
SELECT COUNT(*) as total_messages FROM chat_messages;
SELECT COUNT(*) as total_handovers FROM conversation_handovers;
