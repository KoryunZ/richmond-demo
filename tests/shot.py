"""Stills of the film at timeline positions (0–100), or after real scrolling.
usage: python3 tests/shot.py <url> <outdir> <t,t,...|fleet|book> [--w 1440 --h 810] [--mobile] [--scroll] [--settle 1.2]"""
import sys, os, time
from playwright.sync_api import sync_playwright
url, out, ts = sys.argv[1], sys.argv[2], sys.argv[3].split(',')
arg = lambda k, d: (sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d)
W, H, settle = int(arg('--w', 1440)), int(arg('--h', 810)), float(arg('--settle', 1.2))
mobile, real = '--mobile' in sys.argv, '--scroll' in sys.argv
os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'])
    ctx = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2 if mobile else 1, is_mobile=mobile, has_touch=mobile)
    pg = ctx.new_page()
    pg.on('console', lambda m: print('[console]', m.type, m.text[:300]) if m.type in ('error', 'warning') else None)
    pg.on('pageerror', lambda e: print('[pageerror]', str(e)[:800]))
    t0 = time.time(); pg.goto(url, wait_until='load')
    pg.wait_for_function('window.__film && window.__film.ready === true', timeout=120000)
    print('ready in', round(time.time() - t0, 1), 's; frames loaded', pg.evaluate('window.__film.store.loaded'), '/', pg.evaluate('window.__film.store.count'))
    pg.wait_for_timeout(1500)
    for t in ts:
        if t in ('fleet', 'book'):
            pg.evaluate(f"document.getElementById('{t}').scrollIntoView()"); pg.wait_for_timeout(1500)
        elif real:
            pg.evaluate(f'window.__film.unlock(); window.__film.scrollTo({float(t)})'); pg.wait_for_timeout(int(settle * 1000) + 1500)
        else:
            pg.evaluate(f'window.__film.seek({float(t)})'); pg.wait_for_timeout(int(settle * 1000))
        name = f"{'p' if real else 't'}{t.replace('.', '_')}.png"
        pg.screenshot(path=os.path.join(out, name))
        print(t, 'timeline t =', round(pg.evaluate('window.__film.progress.t'), 2), flush=True)
    b.close()
