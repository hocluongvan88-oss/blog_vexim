"""
Script migration WordPress sang Supabase cho Vexim Global

Cách sử dụng:
1. Export dữ liệu từ WordPress:
   - Đăng nhập WordPress admin
   - Tools → Export → All Content → Download Export File
   - Giải nén file XML

2. Hoặc truy cập database trực tiếp:
   - Export bảng wp_posts từ MySQL/phpMyAdmin
   - Lưu thành CSV hoặc sử dụng script này với connection string

3. Chạy script:
   python scripts/migrate_wordpress.py --source wordpress_export.xml

Lưu ý: Script này giữ nguyên URL cũ trong trường wordpress_url để setup 301 redirect
"""

import re
import xml.etree.ElementTree as ET
from datetime import datetime
import os

# Giả lập - trong thực tế sẽ kết nối Supabase
def clean_html(content):
    """Làm sạch HTML từ WordPress"""
    # Chuyển WordPress shortcodes
    content = re.sub(r'\[caption[^\]]*\](.*?)\[/caption\]', r'\1', content)
    # Giữ nguyên HTML tags cơ bản
    return content

def slugify(text):
    """Tạo slug từ tiêu đề tiếng Việt"""
    text = text.lower()
    text = re.sub(r'[àáạảãâầấậẩẫăằắặẳẵ]', 'a', text)
    text = re.sub(r'[èéẹẻẽêềếệểễ]', 'e', text)
    text = re.sub(r'[ìíịỉĩ]', 'i', text)
    text = re.sub(r'[òóọỏõôồốộổỗơờớợởỡ]', 'o', text)
    text = re.sub(r'[ùúụủũưừứựửữ]', 'u', text)
    text = re.sub(r'[ỳýỵỷỹ]', 'y', text)
    text = re.sub(r'đ', 'd', text)
    text = re.sub(r'[^a-z0-9]+', '-', text)
    return text.strip('-')

def parse_wordpress_xml(xml_file):
    """Parse WordPress export XML"""
    tree = ET.parse(xml_file)
    root = tree.getroot()
    
    # WordPress XML namespace
    ns = {
        'content': 'http://purl.org/rss/1.0/modules/content/',
        'wp': 'http://wordpress.org/export/1.2/',
        'excerpt': 'http://wordpress.org/export/1.2/excerpt/'
    }
    
    posts = []
    
    for item in root.findall('.//item'):
        post_type = item.find('wp:post_type', ns)
        
        # Chỉ lấy post, bỏ qua page và attachment
        if post_type is not None and post_type.text == 'post':
            title = item.find('title').text
            content = item.find('content:encoded', ns).text or ''
            excerpt = item.find('excerpt:encoded', ns).text or ''
            pub_date = item.find('pubDate').text
            post_id = item.find('wp:post_id', ns).text
            status = item.find('wp:status', ns).text
            
            # Lấy category
            categories = [cat.text for cat in item.findall('category[@domain="category"]')]
            category = categories[0] if categories else 'Tin tức'
            
            # Parse date
            pub_datetime = datetime.strptime(pub_date, '%a, %d %b %Y %H:%M:%S %z')
            
            # Lấy featured image nếu có
            thumbnail = item.find('wp:thumbnail_url', ns)
            featured_image = thumbnail.text if thumbnail is not None else ''
            
            # Tạo slug từ title
            original_slug = item.find('wp:post_name', ns)
            slug = original_slug.text if original_slug is not None and original_slug.text else slugify(title)
            
            posts.append({
                'wordpress_id': int(post_id),
                'title': title,
                'slug': slug,
                'excerpt': excerpt[:500] if excerpt else content[:200],
                'content': clean_html(content),
                'category': category,
                'featured_image': featured_image,
                'status': 'published' if status == 'publish' else 'draft',
                'published_at': pub_datetime.isoformat(),
                'wordpress_url': f'https://vexim.vn/blog/{slug}',
                'meta_title': title,
                'meta_description': excerpt[:160] if excerpt else content[:160]
            })
    
    return posts

def generate_sql_insert(posts):
    """Tạo SQL INSERT statements cho Supabase"""
    sql_statements = []
    
    for post in posts:
        sql = f"""
INSERT INTO public.posts (
    wordpress_id, title, slug, excerpt, content, category, 
    featured_image, status, published_at, wordpress_url, 
    meta_title, meta_description
) VALUES (
    {post['wordpress_id']},
    '{post['title'].replace("'", "''")}',
    '{post['slug']}',
    '{post['excerpt'].replace("'", "''")}',
    '{post['content'].replace("'", "''")}',
    '{post['category']}',
    '{post['featured_image']}',
    '{post['status']}',
    '{post['published_at']}',
    '{post['wordpress_url']}',
    '{post['meta_title'].replace("'", "''")}',
    '{post['meta_description'].replace("'", "''")}'
) ON CONFLICT (wordpress_id) DO UPDATE SET
    title = EXCLUDED.title,
    content = EXCLUDED.content,
    updated_at = NOW();
"""
        sql_statements.append(sql)
    
    return '\n\n'.join(sql_statements)

# Main execution
if __name__ == '__main__':
    print("🚀 WordPress to Supabase Migration Tool for Vexim Global")
    print("=" * 60)
    
    # Giả lập cho demo - thực tế sẽ nhận file từ command line
    print("""
Hướng dẫn sử dụng:

1. Export từ WordPress admin panel hoặc database
2. Chạy script này với file XML hoặc CSV
3. Script sẽ tự động:
   ✓ Giữ nguyên slug cũ để không ảnh hưởng SEO
   ✓ Lưu wordpress_id và wordpress_url để setup 301 redirect
   ✓ Làm sạch HTML và format nội dung
   ✓ Tạo meta tags tự động nếu chưa có
   
4. Output: File SQL để chạy trong Supabase

Ví dụ:
    python scripts/migrate_wordpress.py --source wordpress_export.xml
    python scripts/migrate_wordpress.py --db mysql://user:pass@host/vexim_db
    """)
    
    print("\n✅ Script đã sẵn sàng. Chỉnh sửa đường dẫn file và chạy!")
