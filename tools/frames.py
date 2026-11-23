"""Turns the video clips into what the scroll film plays: every frame as a WebP image, packed into one file.
   public/frames.pack   all frames, one after another
   src/film/film.json   the index: the segments of the film, the chapters, frame sizes, where the car is
   src/film/poster.webp the first frame, shown while the film loads and if it cannot load
usage: python3 tools/frames.py [quality=58]

The film is one run of footage. Scroll position is the position in it: down plays it, up plays it backwards.
A film is a list of clips in order, plus chapter marks: where each chapter's title comes up, where a click on
its tab lands, and where the title leaves. There are two below: CURRENT (the footage that exists) and NEXT (the
rebuilt film; used automatically once its clips are in clips/)."""
import sys, os, json, subprocess, tempfile, glob
import numpy as np
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# id, file, options
#   parts    which frames of the clip to use: (first, last, every). (0, 185, 5) keeps frames 0, 5, 10 … 185, so that
#            stretch goes by five times as fast. Several parts follow each other. A clip that was generated from the
#            last frame of the clip before it starts at frame 1, because its frame 0 repeats that frame.
#   join     how this segment follows the one before: 'run' (default) = the footage simply continues;
#            'dissolve' = the two overlap for `over` frames and cross-fade (used where a stretch was cut out)
#   mirror   flip left to right. Avoid it: it reverses everything in the picture. Only the old rental-lot clip
#            uses it, and that clip is being replaced.
#   nudge    how far, in pixels (right, down), the car in this segment's last frame sits from the car in the frame
#            that follows. The picture drifts by that much over its last frames, so the car does not jump.
# The film as it is today, from the footage that exists. Scenes go by at three times their speed, the stretches where
# the place changes at twice.
CURRENT = [
    ('s1', 'clips/scene1-marina.mp4', {'parts': [(0, 186, 3), (189, 189, 1)]}),
    ('b1', 'clips/bridge1-day-to-night.mp4', {'parts': [(1, 37, 3), (40, 112, 2), (115, 187, 3), (189, 189, 1)], 'nudge': (4, 0)}),
    ('s2', 'clips/scene2-night.mp4', {'parts': [(1, 187, 3), (189, 189, 1)]}),
    # the second half of this bridge had the car turn and drive off to the right, so it is cut:
    # night to dawn, then a dissolve to the car arriving in the lot
    ('b2a', 'clips/bridge2-night-to-lot-take2.mp4', {'parts': [(1, 49, 3), (50, 88, 2)]}),
    ('b2b', 'clips/bridge2-night-to-lot-take2.mp4', {'parts': [(150, 189, 3)], 'join': 'dissolve', 'over': 10, 'nudge': (-16, 0)}),
    ('s3', 'clips/scene3-rental-lot.mp4', {'parts': [(51, 186, 3), (189, 189, 1)], 'mirror': True}),
    # the first two thirds of this bridge had the car drive away and turn round, so only its end is used:
    # a dissolve from the lot to the car coming up the desert road
    ('b3', 'clips/bridge3-lot-to-desert.mp4', {'parts': [(125, 189, 2)], 'join': 'dissolve', 'over': 12}),
    ('s4', 'clips/scene4-desert.mp4', {'parts': [(5, 185, 3), (189, 189, 1)]}),
    ('b4', 'clips/bridge4-desert-to-downtown.mp4', {'parts': [(1, 49, 3), (50, 102, 2), (105, 189, 3)], 'nudge': (-2, 0)}),
    ('s5', 'clips/scene5-downtown.mp4', {'parts': [(72, 186, 3), (189, 189, 1)]}),
]
CURRENT_CHAPTERS = [
    ('deposit', {'enter': ('s1', 0), 'rest': ('s1', 0), 'exit': ('b1', 41)}),
    ('recovery', {'enter': ('b1', 140), 'rest': ('s2', 1), 'exit': ('b2a', 50)}),
    ('value', {'enter': ('b2b', 165), 'rest': ('s3', 51), 'exit': ('s3', 175)}),
    ('suv', {'enter': ('b3', 150), 'rest': ('s4', 5), 'exit': ('b4', 45)}),
    ('luxury', {'enter': ('b4', 120), 'rest': ('s5', 189)}),
]

# The film it is being rebuilt into (see clips/SHOTLIST.md). The car keeps one place and one angle in the frame and
# always heads left; only the world around it changes. Each new clip is generated from one locked key frame to the
# next, so nothing is mirrored and nothing is cut. As soon as all four new clips are in clips/, this list is used.
NEXT = [
    ('t12', 'clips/t12-highway-day-to-night-recovery.mp4', {'parts': [(0, 189, 2)]}),
    ('t23', 'clips/t23-night-recovery-to-rental.mp4', {'parts': [(1, 189, 2)]}),
    ('t34', 'clips/t34-rental-to-desert.mp4', {'parts': [(1, 189, 2)]}),
    ('s4', 'clips/scene4-desert.mp4', {'parts': [(1, 187, 3), (189, 189, 1)]}),   # existing footage: the desert drive
    ('t45', 'clips/t45-desert-to-downtown-dusk.mp4', {'parts': [(1, 189, 2)]}),
]
NEXT_CHAPTERS = [   # provisional: tune the frame numbers once the clips exist
    ('deposit', {'enter': ('t12', 0), 'rest': ('t12', 0), 'exit': ('t12', 60)}),
    ('recovery', {'enter': ('t12', 140), 'rest': ('t12', 189), 'exit': ('t23', 60)}),
    ('value', {'enter': ('t23', 140), 'rest': ('t23', 189), 'exit': ('t34', 60)}),
    ('suv', {'enter': ('t34', 140), 'rest': ('s4', 1), 'exit': ('t45', 50)}),
    ('luxury', {'enter': ('t45', 140), 'rest': ('t45', 189)}),
]
ready = all(os.path.exists(os.path.join(ROOT, path)) for _, path, _ in NEXT)
FILM, CHAPTERS = (NEXT, NEXT_CHAPTERS) if ready else (CURRENT, CURRENT_CHAPTERS)
print('film:', 'the new locked-car clips' if ready else 'the existing footage (the new clips are not all in clips/ yet)')
W, H = 1280, 720
OVER = (1322, 744)  # every frame is enlarged a little (3%) before it is cut to W x H: the margin is what a nudge slides within
DRIFT = 12  # kept frames a nudge takes
SAMPLES = 25  # points per segment in the car-position tracks
quality = int(sys.argv[1]) if len(sys.argv) > 1 else 58


def car_raw(path, sel):
    """where the lime car is in each kept frame: centre and width as fractions of the picture width (NaN when it is not found)."""
    w, h = 160, 90
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-vf', f'{sel}scale={w}:{h}', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True, check=True).stdout
    fr = np.frombuffer(raw, np.uint8).reshape(-1, h, w, 3).astype(int)
    r, g, b = fr[..., 0], fr[..., 1], fr[..., 2]
    m = (g > 140) & (g >= r - 8) & (b < 0.55 * g) & (r > 110)        # lime paint, not sand or warm stone
    cx, span = [], []
    for mm in m:
        xs = np.nonzero(mm)[1]
        if len(xs) < 30: cx.append(np.nan); span.append(np.nan); continue
        lo, hi = np.percentile(xs, [3, 97]) / w
        cx.append((lo + hi) / 2); span.append(hi - lo)
    return cx, span


def smooth(v, n=9):
    v = np.array(v, float); ok = ~np.isnan(v)
    v = np.interp(np.arange(len(v)), np.flatnonzero(ok), v[ok]) if ok.any() else np.full(len(v), 0.5)
    return np.convolve(np.pad(v, n // 2, mode='edge'), np.ones(n) / n, mode='valid')   # the crop should glide, not twitch


segments, kept_of, sizes, pack, all_cx, all_span = [], {}, [], bytearray(), [], []
for sid, path, opt in FILM:
    full = os.path.join(ROOT, path)
    if not os.path.exists(full):
        print('missing, skipped:', sid, path); continue
    parts = opt['parts']
    kept = [n for a, b, s in parts for n in range(a, b + 1, s)]
    assert kept == sorted(set(kept)), ('parts overlap or run backwards', path)
    pick = '+'.join(f"between(n\\,{a}\\,{b})*not(mod(n-{a}\\,{s}))" for a, b, s in parts)
    flip = 'hflip,' if opt.get('mirror') else ''
    mx, my = (OVER[0] - W) // 2, (OVER[1] - H) // 2
    dx, dy = opt.get('nudge', (0, 0))
    r = min(DRIFT, len(kept) - 1)
    ramp = f"(st(0\\,clip((n-{len(kept) - 1 - r})/{r}\\,0\\,1))*0+ld(0)*ld(0)*(3-2*ld(0)))"   # 0 → 1 over the last frames, eased
    cut = f"format=yuv444p,scale={OVER[0]}:{OVER[1]}:flags=lanczos,crop={W}:{H}:x='{mx}-({dx * OVER[0] / W:.2f})*{ramp}':y='{my}-({dy * OVER[1] / H:.2f})*{ramp}':exact=1,"
    sel = f"select='{pick}',setpts=N/FRAME_RATE/TB,{flip}{cut}"
    with tempfile.TemporaryDirectory() as tmp:
        subprocess.run(['ffmpeg', '-v', 'error', '-i', full, '-vf', f'{sel}format=yuv420p', '-fps_mode', 'passthrough', '-c:v', 'libwebp', '-quality', str(quality), '-compression_level', '6', '-preset', 'photo', os.path.join(tmp, 'f%04d.webp')], check=True)
        files = sorted(glob.glob(os.path.join(tmp, '*.webp')))
        for f in files:
            d = open(f, 'rb').read(); sizes.append(len(d)); pack += d
        if not segments:   # the poster: the film's first frame, a little softer and smaller in bytes
            subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', files[0], '-c:v', 'libwebp', '-quality', '50', os.path.join(ROOT, 'src/film/poster.webp')], check=True)
    assert len(files) == len(kept), (path, len(files), len(kept))
    cx, span = car_raw(full, sel)
    all_cx += cx; all_span += span
    seg = {'id': sid, 'frames': len(files), 'join': opt.get('join', 'run')}
    if seg['join'] == 'dissolve': seg['over'] = opt.get('over', 12)
    kept_of[sid] = (len(segments), kept)
    segments.append(seg)
    print(f'{sid:5s} {path:40s} {len(files):4d} frames {sum(sizes[-len(files):]) // 1024:6d} KB', flush=True)

def mark(pos):
    """(segment id, frame of the clip) → where that is in the film: the segment and the nearest frame that was kept"""
    sid, n = pos
    k, kept = kept_of[sid]
    return {'segment': k, 'frame': int(np.argmin([abs(v - n) for v in kept]))}

chapters = []
for cid, marks in CHAPTERS:
    if any(m[0] not in kept_of for m in marks.values()):
        print('chapter skipped (its clip is missing):', cid); continue
    chapters.append({'id': cid, **{name: mark(pos) for name, pos in marks.items()}})

# the car tracks are smoothed over the whole film, so the crop on narrow screens does not jump where two clips meet
all_cx, all_span, at = smooth(all_cx), smooth(all_span), 0
for seg in segments:
    pick = (at + np.linspace(0, seg['frames'] - 1, min(SAMPLES, seg['frames']))).round().astype(int)
    seg['focus'] = [round(float(all_cx[i]), 3) for i in pick]; seg['span'] = [round(float(all_span[i]), 3) for i in pick]
    at += seg['frames']

open(os.path.join(ROOT, 'public/frames.pack'), 'wb').write(pack)
os.makedirs(os.path.join(ROOT, 'src/film'), exist_ok=True)
json.dump({'width': W, 'height': H, 'fps': 24, 'bytes': len(pack), 'segments': segments, 'chapters': chapters, 'sizes': sizes}, open(os.path.join(ROOT, 'src/film/film.json'), 'w'))
print('total', len(sizes), 'frames', round(len(pack) / 1e6, 1), 'MB;', len(chapters), 'chapters')
