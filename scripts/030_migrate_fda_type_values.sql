-- 1. Xóa bỏ ràng buộc cũ đang gây lỗi (Bước này quan trọng nhất)
ALTER TABLE fda_registrations 
DROP CONSTRAINT IF EXISTS fda_registrations_type_check;

-- 2. Chuẩn hóa dữ liệu cũ (nếu có) về đúng format mới để tránh lỗi khi tạo lại constraint
UPDATE fda_registrations
SET registration_type = CASE 
  WHEN registration_type ILIKE 'food%' THEN 'Food Facility'
  WHEN registration_type ILIKE 'drug%' THEN 'Drug Establishment'
  WHEN registration_type ILIKE 'device%' OR registration_type ILIKE 'medical%' THEN 'Medical Device'
  WHEN registration_type ILIKE 'cosmetic%' THEN 'Cosmetic'
  WHEN registration_type ILIKE 'dietary%' THEN 'Dietary Supplement'
  WHEN registration_type ILIKE 'infant%' THEN 'Infant Formula'
  ELSE 'Other'
END;

-- 3. Tạo lại ràng buộc mới với danh sách giá trị khớp hoàn toàn với dữ liệu từ Code gửi lên
ALTER TABLE fda_registrations
ADD CONSTRAINT fda_registrations_type_check
CHECK (registration_type IN (
  'Food Facility',
  'Drug Establishment',
  'Medical Device',
  'Cosmetic',
  'Dietary Supplement',
  'Infant Formula',
  'Other'
));

-- 4. Kiểm tra lại để chắc chắn không còn giá trị lạ
SELECT registration_type, COUNT(*) 
FROM fda_registrations 
GROUP BY registration_type;
