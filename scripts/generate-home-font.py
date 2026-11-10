"""Subset the existing licensed Inter variable font for English home/privacy pages.

Requires fonttools and brotli: python3 -m pip install fonttools brotli
Run: python3 scripts/generate-home-font.py
Original and OFL licence: public/trade/fonts/.
Vietnamese pages continue using self-hosted Be Vietnam Pro (app/fonts/).
"""
from pathlib import Path
from fontTools.ttLib import TTFont
from fontTools.subset import Options, Subsetter

root = Path(__file__).resolve().parent.parent
source = root / "public/trade/fonts/inter-vietnamese-latin-variable.3642455776.woff2"
out = root / "public/fonts/inter-home-latin.woff2"
out.parent.mkdir(parents=True, exist_ok=True)
font = TTFont(source)
options = Options()
options.flavor = "woff2"
options.layout_features = ["*"]
subset = Subsetter(options=options)
# Basic Latin, Latin-1, extended Latin, punctuation, arrows and geometric marks.
subset.populate(unicodes={*range(0x20, 0x180), *range(0x2000, 0x2070), *range(0x2190, 0x2200), *range(0x25A0, 0x2600)})
subset.subset(font)
font.flavor = "woff2"
font.save(out)
print(f"Wrote {out.relative_to(root)} ({out.stat().st_size} bytes)")
