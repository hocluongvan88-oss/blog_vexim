# How to Add Links in Blog Posts

## Quick Start - Thêm Link Vào Text Trong Bài Viết

### Step-by-Step Instructions

1. **Write your paragraph text** in the editor
   ```
   Example: "Bạn cần hiểu rõ về quy định FDA Mỹ để xuất khẩu..."
   ```

2. **Select the text** you want to make a link
   - Click and drag to highlight the text (e.g., "quy định FDA Mỹ")
   - The inline toolbar will automatically appear above your selection

3. **Click the Link Button** (icon xích/chain icon)
   - Look for the last button in the toolbar with a chain/link icon
   - A URL input field will appear

4. **Enter the URL**
   - Type the link destination
   - Can be internal: `/services/fda` or external: `https://www.example.com`
   - Press **Enter** or click **OK**

5. **Done!**
   - Your text is now a link
   - It will appear in blue and underlined

---

## Examples of Links

### Internal Links (to your pages)
```
Link text: "quy định FDA"
URL: /services/fda

Link text: "danh mục FDA"
URL: /blog/category/FDA

Link text: "bài viết khác"
URL: /blog/ho-tro-xuat-khau-my-2024
```

### External Links (to other websites)
```
Link text: "FDA.gov"
URL: https://www.fda.gov

Link text: "trang web Mỹ"
URL: https://www.veximglobal.com
```

---

## Full Feature Overview

The inline toolbar appears when you select text in a paragraph block and offers:

| Icon | Feature | Shortcut |
|------|---------|----------|
| **B** | Bold (In đậm) | Ctrl+B / Cmd+B |
| **I** | Italic (In nghiêng) | Ctrl+I / Cmd+I |
| **U** | Underline (Gạch chân) | Ctrl+U / Cmd+U |
| **<>** | Code (Mã) | — |
| **🔗** | Link (Liên kết) | — |

---

## Editing Existing Links

1. **Select the linked text** again
2. **Click the Link button**
3. **The URL input will show the current URL**
4. **Edit the URL** or clear it to remove the link
5. **Press Enter or click OK**

---

## Best Practices for SEO

### Do's ✅
- Use descriptive anchor text: "quy định FDA Mỹ" instead of "click here"
- Link to relevant pages: FDA content → `/services/fda`
- Use 3-7 internal links per blog post
- Link key terms and concepts

### Don'ts ❌
- Don't link generic phrases like "read more" or "more info"
- Don't link to unrelated pages
- Don't over-link (more than 10 links per post)
- Don't link every occurrence of a term (link only the first one)

---

## Formatting Support

Your paragraph editor supports:
- **Bold text** (In đậm)
- *Italic text* (In nghiêng)
- <u>Underlined text</u> (Gạch chân)
- `Code text` (Mã lệnh)
- [Links](https://example.com) (Liên kết)

When you paste HTML from other sources, formatting is automatically preserved!

---

## Keyboard Shortcuts

While editing text:
- **Ctrl+B** / **Cmd+B** → Bold
- **Ctrl+I** / **Cmd+I** → Italic
- **Ctrl+U** / **Cmd+U** → Underline
- **Ctrl+Z** / **Cmd+Z** → Undo
- **Ctrl+Y** / **Cmd+Shift+Z** → Redo

---

## Troubleshooting

**Q: The toolbar doesn't appear when I select text**
- A: Make sure you're clicking inside the paragraph text, not outside
- Try clicking in the middle of the word and dragging

**Q: The link button doesn't work**
- A: Make sure you have text selected first
- The link button only works with selected text

**Q: How do I remove a link?**
- A: Select the link text, click the link button, and clear the URL field
- Click OK to remove the link (text will remain)

**Q: Can I open links in a new tab?**
- A: External links automatically open in new tabs
- Internal links stay in the same tab

---

## Link Examples for Your Blog

For **FDA category posts**, link to:
- `/services/fda` - Main FDA service page
- `/blog/category/FDA` - FDA blog category
- `/services/export-delegation` - Related export service

For **GACC category posts**, link to:
- `/services/gacc` - Main GACC service page
- `/blog/category/GACC` - GACC blog category
- `/services/export-delegation` - Related export service

For **MFDS category posts**, link to:
- `/services/mfds` - Main MFDS service page
- `/blog/category/MFDS` - MFDS blog category
- `/services/export-delegation` - Related export service

---

## HTML Output Example

When you create a link, the editor generates:

```html
<!-- Your text with link -->
<p>Bạn cần hiểu rõ về <a href="/services/fda">quy định FDA</a> để xuất khẩu.</p>

<!-- External link -->
<p>Xem thêm tại <a href="https://www.fda.gov">FDA.gov</a>.</p>
```

This is automatically saved to your database and displayed on the blog!
