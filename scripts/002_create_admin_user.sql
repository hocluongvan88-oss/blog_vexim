INSERT INTO public.admin_users (id, email, full_name, role)
VALUES 
  (
    '86c7af99-c178-42aa-bbb8-50b875b1d2cd', 
    'hocluongvan88@gmail.com', 
    'Admin Hoc Luong Van', 
    'admin'
  )
ON CONFLICT (id) DO UPDATE 
SET 
  role = 'admin',
  email = 'hocluongvan88@gmail.com';
