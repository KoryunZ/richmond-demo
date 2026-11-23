"""Makes the fleet pictures from the studio shots in tools/fleet-src/ (one PNG per car, any size, light backdrop).
Each picture is cropped around its car so that every car has the same size in its card, and every backdrop is
brought to the same pale grey, so the eleven cards read as one set.
usage: python3 tools/fleet.py [sheet.jpg]"""
import sys, os, glob
import numpy as np
from PIL import Image, ImageFilter
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TARGET = np.array([233., 235., 238.])   # the card's backdrop colour (.car-photo in styles.css)
ASPECT, FILL, OUT = 1.6, 0.72, (960, 600)   # card shape, share of the width the car takes, size saved

done = []
for f in sorted(glob.glob(os.path.join(ROOT, 'tools/fleet-src/*.png'))):
    cid = os.path.splitext(os.path.basename(f))[0]
    im = Image.open(f).convert('RGB'); W, H = im.size
    # where the car is: the backdrop is smooth, the car is full of edges
    g = np.asarray(im.convert('L').filter(ImageFilter.GaussianBlur(1.2))).astype(float)
    m = np.hypot(*np.gradient(g)) > 9
    m[:int(H * 0.08)] = False; m[:, :int(W * 0.04)] = False; m[:, int(W * 0.96):] = False
    ys, xs = np.nonzero(m); x0, x1 = np.percentile(xs, [0.4, 99.6]); y0, y1 = np.percentile(ys, [0.4, 99.6])
    cw = min((x1 - x0) / FILL, H * ASPECT, W); ch = cw / ASPECT
    left = min(max((x0 + x1) / 2 - cw / 2, 0), W - cw); top = min(max((y0 + y1) / 2 - ch * 0.53, 0), H - ch)   # the car sits a touch below the middle
    c = np.asarray(im.crop((round(left), round(top), round(left + cw), round(top + ch))).resize(OUT, Image.LANCZOS)).astype(float)
    # the backdrop, sampled in the top corners, goes to the target grey: one brightness gain, a small colour correction
    bg = np.median(np.concatenate([c[8:70, 8:150].reshape(-1, 3), c[8:70, -150:-8].reshape(-1, 3)]), axis=0)
    ratio = TARGET / bg; lum = float(np.clip(ratio.mean(), 0.9, 1.24)); cast = np.clip(ratio / ratio.mean(), 0.95, 1.05)
    c = c * lum * cast
    hi = c > 222; c[hi] = 222 + 33 * (1 - np.exp(-(c[hi] - 222) / 33))   # a soft shoulder, so white paint keeps its shape instead of clipping
    out = Image.fromarray(np.clip(c, 0, 255).astype(np.uint8))
    out.save(os.path.join(ROOT, f'src/assets/fleet/fleet-{cid}.jpg'), quality=84, optimize=True, progressive=True)
    done.append((cid, out)); print(f'{cid:11s} car fills {(x1 - x0) / cw:.2f} of the width | backdrop {bg.round()} → gain {lum:.2f}, cast {cast.round(3)}')
if len(sys.argv) > 1:
    sheet = Image.new('RGB', (4 * 480, -(-len(done) // 4) * 300), (255, 255, 255))
    for n, (_, im) in enumerate(done): sheet.paste(im.resize((480, 300), Image.LANCZOS), ((n % 4) * 480, (n // 4) * 300))
    sheet.save(sys.argv[1], quality=86)
