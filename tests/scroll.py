"""Scrolls the film the way a visitor does (wheel, at several speeds, both ways, chapter tabs) and reports:
   - whether the film position follows the scroll position, forwards and backwards
   - frames: how many were drawn, how many were 'late' (the exact frame was not decoded yet, so the nearest one
     was shown) and 'blank' (nothing could be drawn; must be 0)
   - which title and which chapter tab are up at each chapter
usage: python3 tests/scroll.py <url> <outdir> [--w 1440 --h 810] [--mobile]"""
import sys, os, time
from playwright.sync_api import sync_playwright
url, out = sys.argv[1], sys.argv[2]
arg = lambda k, d: (sys.argv[sys.argv.index(k) + 1] if k in sys.argv else d)
W, H, mobile = int(arg('--w', 1440)), int(arg('--h', 810)), '--mobile' in sys.argv
os.makedirs(out, exist_ok=True)
STATE = """() => {
  const f = window.__film, [a, b] = f.range(), s = window.__filmStats
  const titles = [...document.querySelectorAll('.title')].map((e) => +(+e.style.opacity || 0).toFixed(2))
  const tab = [...document.querySelectorAll('.tab')].findIndex((e) => e.dataset.on === 'true')
  const c = document.querySelector('.film-canvas'), d = document.createElement('canvas'); d.width = 16; d.height = 9
  const x = d.getContext('2d'); x.drawImage(c, 0, 0, 16, 9); const px = x.getImageData(0, 0, 16, 9).data
  let lum = 0; for (let i = 0; i < px.length; i += 4) lum += px[i] + px[i + 1] + px[i + 2]
  return { t: +f.progress.t.toFixed(2), y: Math.round(scrollY), want: +(Math.max(0, Math.min(1, (scrollY - a) / (b - a))) * 100).toFixed(2),
           frames: s.frames, late: s.late, blank: s.blank, titles, tab, lum: Math.round(lum / (16 * 9 * 3)) }
}"""
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
    st = lambda: pg.evaluate(STATE)
    a, e = pg.evaluate('window.__film.range()'); rests = pg.evaluate('window.__film.rests')
    print('mode', pg.evaluate('window.__film.mode'), '| film stretch', round(e - a), 'px =', round((e - a) / H, 1), 'screens | chapter rests', [round(r, 1) for r in rests])
    pg.mouse.move(W // 2, H // 2)

    def settle(ms=900):
        pg.wait_for_timeout(ms); return st()

    def run(label, dy, pause, until):
        s0 = st(); t0 = time.time(); last = s0['t']; back = 0; dark = 0; n = 0
        while not until(st_ := st()) and time.time() - t0 < 90:
            pg.mouse.wheel(0, dy); pg.wait_for_timeout(pause); n += 1
            if (st_['t'] - last) * (1 if dy > 0 else -1) < -0.05: back += 1   # the film went the wrong way
            if st_['lum'] < 6: dark += 1
            last = st_['t']
        s1 = settle()
        d = s1['frames'] - s0['frames']
        print(f"{label:38s} {n:4d} wheel events in {time.time() - t0:5.1f}s | t {s0['t']:6.2f} → {s1['t']:6.2f} (scroll says {s1['want']:6.2f}) | drawn {d:5d}, late {s1['late'] - s0['late']:4d} ({(s1['late'] - s0['late']) * 100 // max(1, d)}%), blank {s1['blank'] - s0['blank']} | wrong-way steps {back}, dark samples {dark}", flush=True)
        return s1

    if mobile:   # a real touch scroll: a finger drags the page up three times, then back down
        cdp = ctx.new_cdp_session(pg); s0 = st()
        def drag(dy):
            y0 = H // 2 + dy // 2
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': W // 2, 'y': y0}]})
            for k in range(1, 21):
                cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': W // 2, 'y': y0 - dy * k / 20}]}); pg.wait_for_timeout(16)
            cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []}); pg.wait_for_timeout(500)
        for _ in range(3): drag(500)
        s1 = settle()
        for _ in range(3): drag(-500)
        s2 = settle()
        print(f"touch: three drags up → t {s0['t']} → {s1['t']} (scroll says {s1['want']}); three drags down → t {s2['t']} | drawn {s2['frames'] - s0['frames']}, late {s2['late'] - s0['late']}, blank {s2['blank'] - s0['blank']}")
        pg.evaluate('window.scrollTo(0, 0)'); settle(600)
    top = lambda s: s['y'] <= a + 1
    end = lambda s: s['y'] >= e - 2
    run('slow down (40 px every 40 ms)', 40, 40, end)
    run('slow up', -40, 40, top)
    run('normal down (100 px every 30 ms)', 100, 30, end)
    run('normal up', -100, 30, top)
    run('fast down (400 px every 16 ms)', 400, 16, end)
    run('fast up', -400, 16, top)

    print('at each chapter (scrolled to its resting frame):')
    for i, r in enumerate(rests):
        pg.evaluate(f'window.__film.scrollTo({r})'); s = settle(1300)
        up = max(range(len(s['titles'])), key=lambda k: s['titles'][k])
        print(f"  chapter {i + 1}: t {s['t']:6.2f} | title shown #{up + 1} (opacity {s['titles'][up]}) | tab #{s['tab'] + 1} | picture brightness {s['lum']}")
        pg.screenshot(path=os.path.join(out, f'chapter{i + 1}.png'))

    print('chapter tabs (click, wait for the scroll to stop):')
    pg.evaluate('window.scrollTo(0, 0)'); settle(800)
    for i in [1, 2, 3, 4, 0, 4, 2]:
        pg.locator('.tab').nth(i).click(force=True)
        y = -1; t0 = time.time()
        while time.time() - t0 < 8:
            pg.wait_for_timeout(250); y2 = pg.evaluate('Math.round(scrollY)')
            if y2 == y: break
            y = y2
        s = settle(700)
        print(f"  tab {i + 1}: landed at t {s['t']:6.2f} (its chapter rests at {rests[i]:6.2f}) | tab lit #{s['tab'] + 1} | in {time.time() - t0:3.1f}s")

    # past the film the page carries on
    pg.evaluate(f'window.scrollTo(0, {e} + 500)'); s = settle(700)
    print('below the film: t', s['t'], '| fleet section top at', round(pg.evaluate('document.querySelector("#fleet").getBoundingClientRect().top')), 'px')
    pg.screenshot(path=os.path.join(out, 'below.png'))
    b.close()
