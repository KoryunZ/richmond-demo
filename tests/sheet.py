"""Tile screenshots into one contact sheet. usage: python3 tests/sheet.py out.jpg cols img1 img2 ..."""
import sys, os
from PIL import Image, ImageDraw
out, cols, files = sys.argv[1], int(sys.argv[2]), sys.argv[3:]
ims = [Image.open(f).convert('RGB') for f in files]
w, h = ims[0].size
rows = (len(ims) + cols - 1) // cols
sheet = Image.new('RGB', (cols * w, rows * h), (0, 0, 0))
d = ImageDraw.Draw(sheet)
for i, (im, f) in enumerate(zip(ims, files)):
    x, y = (i % cols) * w, (i // cols) * h
    sheet.paste(im.resize((w, h)), (x, y))
    label = os.path.basename(f).replace('.png', '')
    d.rectangle([x, y, x + 12 + 9 * len(label), y + 22], fill=(0, 0, 0)); d.text((x + 6, y + 5), label, fill=(255, 255, 0))
sheet.save(out, quality=88)
print(out, sheet.size)
