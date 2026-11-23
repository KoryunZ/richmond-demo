"""Looks for layout faults below the film at several screen widths, in both languages: anything wider than the
screen, text that overflows its box, price rows that wrapped, tap targets that are too small.
usage: python3 tests/layout.py <url>"""
import sys
from playwright.sync_api import sync_playwright
url = sys.argv[1]
CHECK = """() => {
  const vw = document.documentElement.clientWidth, out = { wide: [], clipped: [], wrapped: 0, small: [] }
  const name = (e) => e.tagName.toLowerCase() + (e.className && typeof e.className === 'string' ? '.' + e.className.trim().split(/\\s+/).join('.') : '') + ' "' + (e.textContent || '').trim().slice(0, 28) + '"'
  for (const e of document.querySelectorAll('main *, footer *, header *')) {
    const r = e.getBoundingClientRect()
    if (!r.width || !r.height || e.closest('.stage')) continue
    if (r.right > vw + 1 || r.left < -1) out.wide.push(name(e) + ' ' + Math.round(r.left) + '…' + Math.round(r.right))
    if (e.children.length === 0 && e.scrollWidth > e.clientWidth + 1 && getComputedStyle(e).overflow !== 'visible') out.clipped.push(name(e))
  }
  for (const f of document.querySelectorAll('.car:not(.other) .car-foot')) { const a = f.children[0].getBoundingClientRect(), b = f.children[1].getBoundingClientRect(); if (b.top > a.bottom - 4) out.wrapped++ }
  for (const e of document.querySelectorAll('main button, main a.btn, footer a, header button, header a.btn, summary, select, input')) {
    const r = e.getBoundingClientRect(); if (!r.width || e.closest('.stage')) continue
    if (r.height < 32) out.small.push(name(e) + ' ' + Math.round(r.height) + 'px')
  }
  out.pageWide = document.documentElement.scrollWidth > vw
  return out
}"""
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'])
    bad = 0
    for W, H in ((320, 640), (360, 760), (390, 844), (430, 932), (768, 1024), (1024, 768), (1440, 900), (1920, 1080)):
        mobile = W < 700
        ctx = b.new_context(viewport={'width': W, 'height': H}, device_scale_factor=2 if mobile else 1, is_mobile=mobile, has_touch=mobile)
        pg = ctx.new_page(); pg.on('pageerror', lambda e: print('[pageerror]', str(e)[:300]))
        pg.goto(url, wait_until='load'); pg.wait_for_function('window.__film && window.__film.ready === true', timeout=120000)
        for lang in ('en', 'ru', 'ar', 'de'):
            pg.evaluate('window.scrollTo(0, 0)'); pg.wait_for_timeout(200)
            if W < 1100: pg.locator('.burger').click(); pg.locator(f'.mseg button[lang={lang}]').click(); pg.locator('.burger').click()
            else: pg.locator('.drop.pref .drop-btn').first.click(); pg.locator(f'.drop-panel button[lang={lang}]').click()
            pg.wait_for_timeout(250)
            pg.evaluate('window.scrollTo(0, window.__film.range()[1] + 300)'); pg.wait_for_timeout(350)
            r = pg.evaluate(CHECK)
            cols = pg.evaluate("getComputedStyle(document.querySelector('.cars')).gridTemplateColumns.split(' ').length")
            flag = r['pageWide'] or r['wide'] or r['clipped']
            bad += bool(flag)
            print(f"{W:5d}px {lang}: fleet columns {cols} | wider than screen {len(r['wide'])} | clipped text {len(r['clipped'])} | price rows wrapped {r['wrapped']} | targets under 32px {len(r['small'])}" + ('   ← FAULT' if flag else ''))
            for k in ('wide', 'clipped', 'small'):
                for line in r[k][:4]: print('        ', k + ':', line)
        ctx.close()
    print('faults:', bad); b.close()
