"""Full-length pictures of everything below the film (fleet → footer), desktop and phone.
usage: python3 tests/sections.py <url> <outdir> [--lang ru]"""
import sys, os
from playwright.sync_api import sync_playwright
from PIL import Image
url, out = sys.argv[1], sys.argv[2]
lang = sys.argv[sys.argv.index('--lang') + 1] if '--lang' in sys.argv else 'en'
os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'])
    for name, W, H, mobile in (('desktop', 1440, 900, False), ('phone', 390, 844, True)):
        ctx = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2 if mobile else 1, is_mobile=mobile, has_touch=mobile, locale='ru-RU' if lang == 'ru' else 'en-US')
        pg = ctx.new_page()
        pg.on('pageerror', lambda e: print('[pageerror]', str(e)[:500]))
        pg.goto(url, wait_until='load')
        pg.wait_for_function('window.__film && window.__film.ready === true', timeout=120000)
        if lang == 'ru' and pg.evaluate('document.documentElement.lang') != 'ru': raise SystemExit('Russian locale did not select Russian')
        pg.wait_for_timeout(800)
        top = pg.evaluate('(() => { const a = window.__film.range(); window.scrollTo(0, a[1] + 4); return a[1] })()')
        pg.wait_for_timeout(600)
        # walk down the page so lazy pictures load and scroll-driven states settle, then stitch viewport shots
        total = pg.evaluate('document.documentElement.scrollHeight'); y = top; shots = []
        nav = pg.evaluate('Math.ceil(document.querySelector(".nav").getBoundingClientRect().height)') + 2
        while y < total:
            pg.evaluate(f'window.scrollTo(0, {y})'); pg.wait_for_timeout(450)
            real = pg.evaluate('Math.round(scrollY)')
            f = os.path.join(out, f'_{name}_{len(shots)}.png'); pg.screenshot(path=f); shots.append((real, f))
            if real + H >= total - 1: break
            y = real + H - nav   # overlap hides the fixed header
        k = 2 if mobile else 1; hdr = nav * k   # the fixed header of every shot but the first is cut off
        strip = Image.new('RGB', (W * k, (shots[-1][0] - top + H) * k), (255, 255, 255))
        for i, (yy, f) in enumerate(shots):
            im = Image.open(f).convert('RGB')
            if i: im = im.crop((0, hdr, im.width, im.height)); strip.paste(im, (0, (yy - top) * k + hdr))
            else: strip.paste(im, (0, 0))
            os.remove(f)
        strip.save(os.path.join(out, f'{name}-{lang}.png')); print(name, strip.size)
        ctx.close()
    b.close()
