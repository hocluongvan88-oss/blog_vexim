"""Generate the new 1200x630 homepage OG image from the bundled Inter font.

Requires Pillow, fonttools and brotli (development-only Python packages):
  python3 -m pip install pillow fonttools brotli
  python3 scripts/generate-home-og.py
No stock, client proof or unverified metric imagery is used.
"""
from io import BytesIO
from pathlib import Path
import base64
import re

from PIL import Image, ImageDraw, ImageFont
from fontTools.ttLib import TTFont

ROOT = Path(__file__).resolve().parent.parent
FONT_FILE = ROOT / "public/trade/fonts/inter-vietnamese-latin-variable.3642455776.woff2"
OUT_FILE = ROOT / "public/og-image.jpg"

font_source = TTFont(FONT_FILE)
font_source.flavor = None
font_buffer = BytesIO()
font_source.save(font_buffer)
font_data = font_buffer.getvalue()


def font(size, weight="Regular"):
    result = ImageFont.truetype(BytesIO(font_data), size)
    try:
        result.set_variation_by_name(weight)
    except OSError:
        pass
    return result


W, H = 1200, 630
image = Image.new("RGB", (W, H), (6, 23, 39))
pixels = image.load()
for y in range(H):
    for x in range(W):
        # A deep, dimensional navy field without raster photos or fabricated charts.
        glow = max(0, 1 - (((x - 955) / 650) ** 2 + ((y - 270) / 520) ** 2))
        pixels[x, y] = (int(6 + 10 * glow), int(23 + 31 * glow), int(39 + 45 * glow))
d = ImageDraw.Draw(image)
for x in range(0, W, 60):
    d.line((x, 0, x, H), fill=(19, 47, 67), width=1)
for y in range(0, H, 60):
    d.line((0, y, W, y), fill=(19, 47, 67), width=1)
d.rectangle((0, 0, 8, H), fill=(127, 196, 229))
d.line((78, 108, 1120, 108), fill=(61, 105, 133), width=1)

svg = (ROOT / "public/trade/logo.svg").read_text()
encoded = re.search(r'data:image/png;base64,([^"\']+)', svg).group(1)
logo = Image.open(BytesIO(base64.b64decode(encoded))).convert("RGBA").resize((52, 52), Image.Resampling.LANCZOS)
image.paste(logo, (78, 38), logo)
d.text((142, 48), "VEXIM", font=font(29, "Bold"), fill=(246, 251, 255))
d.text((252, 48), "GLOBAL", font=font(29, "Medium"), fill=(127, 196, 229))
d.text((79, 151), "GLOBAL B2B EXPORT SYSTEMS", font=font(16, "SemiBold"), fill=(152, 208, 234))

for index, text in enumerate(("B2B export", "foundations.", "Built to be found.")):
    d.text((72, 197 + index * 81), text, font=font(65, "SemiBold"), fill=(246, 251, 255) if index < 2 else (155, 204, 240))

d.text((80, 515), "OWNED PRESENCE   /   BUYER-INTENT SEO   /   VEXIM TRADE", font=font(16, "Medium"), fill=(181, 207, 222))
d.line((78, 570, 1120, 570), fill=(61, 105, 133), width=1)
d.text((79, 586), "VEXIMGLOBAL.COM", font=font(13, "SemiBold"), fill=(139, 183, 209))
d.text((923, 586), "VIETNAM  →  GLOBAL", font=font(13, "Medium"), fill=(139, 183, 209))

# An abstract system diagram, explicitly *not* a fabricated performance chart.
d.rounded_rectangle((840, 169, 1122, 480), radius=9, outline=(88, 139, 169), width=2, fill=(13, 43, 68))
d.rectangle((841, 170, 1121, 207), fill=(23, 66, 95))
d.text((859, 182), "EXPORT SYSTEM / 01", font=font(11, "SemiBold"), fill=(179, 216, 234))
d.text((859, 224), "INFRASTRUCTURE MAP", font=font(12, "Medium"), fill=(117, 173, 201))
d.line((880, 287, 880, 425), fill=(76, 147, 171), width=2)
for index, (label, short) in enumerate((("01", "OWNED WEB"), ("02", "DISCOVERY"), ("03", "TRADE SYNC"))):
    y = 296 + index * 58
    d.ellipse((869, y - 10, 891, y + 12), fill=(38, 110, 141), outline=(145, 215, 231), width=2)
    d.text((906, y - 9), label, font=font(13, "SemiBold"), fill=(116, 206, 224))
    d.text((945, y - 9), short, font=font(14, "Medium"), fill=(219, 238, 249))
d.text((859, 445), "ILLUSTRATIVE FRAMEWORK", font=font(10, "Medium"), fill=(118, 182, 199))

image.save(OUT_FILE, quality=88, optimize=True, progressive=True, subsampling=1)
print(f"Generated {OUT_FILE} ({OUT_FILE.stat().st_size // 1024} KiB, {W}x{H})")
