"""Plays the film the way a visitor does: one scroll (or key, or swipe) per stop. Reports where it comes to rest.
usage: python3 tests/steps.py <url> <outdir> [--w 1440 --h 810] [--mobile]"""
import sys, os, time
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
arg = lambda k, d: (sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d)
W, H, mobile = int(arg('--w', 1440)), int(arg('--h', 810)), '--mobile' in sys.argv
os.makedirs(out, exist_ok=True)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'])
    ctx = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2 if mobile else 1, is_mobile=mobile, has_touch=mobile)
    pg = ctx.new_page()
    pg.on('console', lambda m: print('[console]', m.type, m.text[:300]) if m.type == 'error' and '404' not in m.text else None)
    pg.on('pageerror', lambda e: print('[pageerror]', str(e)[:800]))
    pg.goto(url, wait_until='load')
    pg.wait_for_function('window.__film && window.__film.ready === true', timeout=120000)
    pg.wait_for_function('window.__film.store.loaded === window.__film.store.count', timeout=120000)
    pg.wait_for_timeout(1500)
    stops = pg.evaluate('window.__film.stops')
    print('stops', [round(s, 2) for s in stops])
    state = lambda: pg.evaluate('({ t: +window.__film.progress.t.toFixed(2), y: Math.round(scrollY), busy: window.__film.busy() })')
    cdp = ctx.new_cdp_session(pg) if mobile else None

    def swipe(dy):  # finger moves up by dy px (dy > 0 = on to the next stop)
        x, y0 = W // 2, H // 2 + dy // 2
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y0}]})
        for k in range(1, 9):
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x, 'y': y0 - dy * k / 8}]}); pg.wait_for_timeout(16)
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})

    def gesture(kind, d):
        if kind == 'wheel': pg.mouse.move(W // 2, H // 2); pg.mouse.wheel(0, 100 * d)
        elif kind == 'key': pg.keyboard.press('ArrowDown' if d > 0 else 'ArrowUp')
        else: swipe(140 * d)

    def rest(label, shot=None):
        t0 = time.time(); pg.wait_for_timeout(120)
        while pg.evaluate('window.__film.busy()') and time.time() - t0 < 12: pg.wait_for_timeout(50)
        pg.wait_for_timeout(450); s = state()
        print(f'{label:34s} → t {s["t"]:6.2f}  scrollY {s["y"]:5d}  in {time.time() - t0:4.1f}s', flush=True)
        if shot: pg.screenshot(path=os.path.join(out, shot + '.png'))
        return s

    kind = 'touch' if mobile else 'wheel'
    pg.screenshot(path=os.path.join(out, 'stop0.png'))
    for k in range(1, len(stops)):
        gesture(kind, 1); rest(f'{kind} down #{k}', f'stop{k}')
    # in the middle of the next two steps back, for a look at the picture on the way
    gesture(kind, -1); pg.wait_for_timeout(1300); pg.screenshot(path=os.path.join(out, 'mid_4to3.png')); rest(f'{kind} up')
    if not mobile:
        gesture('key', -1); rest('ArrowUp'); gesture('key', 1); rest('ArrowDown')
    gesture(kind, 1); rest(f'{kind} down (to the last stop)')
    # past the last stop the page scrolls on as usual
    if mobile: swipe(500); pg.wait_for_timeout(900)
    else:
        for _ in range(6): pg.mouse.wheel(0, 100); pg.wait_for_timeout(60)
    s = rest('past the last stop', 'after')
    end = pg.evaluate('document.querySelector("#fleet").getBoundingClientRect().top')
    print('fleet top is at', round(end), 'px from the top of the screen')
    # and back up into the film
    if mobile: swipe(-700); pg.wait_for_timeout(1200)
    else:
        for _ in range(9): pg.mouse.wheel(0, -100); pg.wait_for_timeout(60)
    rest('back up into the film', 'back')
    # two quick scrolls in a row: the second hurries the first, it does not skip a stop
    pg.evaluate('window.scrollTo(0, 0)'); pg.wait_for_timeout(900)
    gesture(kind, 1); pg.wait_for_timeout(500); gesture(kind, 1); rest('two quick gestures')
    # a change of mind half-way
    gesture(kind, 1); pg.wait_for_timeout(700); gesture(kind, -1); rest('down then up half-way')
    b.close()
