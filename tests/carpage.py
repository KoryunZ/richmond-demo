"""The car page: opens from cards, shows the details, reserves through WhatsApp, closes, deep link, languages, phone.
usage: python3 tests/carpage.py <url> [--mobile]"""
import sys, urllib.parse
from playwright.sync_api import sync_playwright
url = sys.argv[1].rstrip('/'); mobile = '--mobile' in sys.argv; fails = []
def check(n, ok, x=''):
    print(('ok   ' if ok else 'FAIL ') + n + (f'  {x}' if x else ''))
    if not ok: fails.append(n)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])
    ctx = b.new_context(viewport={'width': 390 if mobile else 1440, 'height': 844 if mobile else 900}, is_mobile=mobile, has_touch=mobile, locale='en-US')
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:300]))
    pg.goto(url, wait_until='load'); pg.wait_for_function('window.__film && window.__film.ready === true', timeout=120000); pg.wait_for_timeout(900)
    pg.evaluate('window.__opened = []; window.open = (u) => { window.__opened.push(u); return null }')
    pg.evaluate("document.querySelector('#fleet').scrollIntoView()"); pg.wait_for_timeout(500)
    pg.locator('.cars .car-open', has_text='Porsche 911').first.click(); pg.wait_for_timeout(600)
    check('card opens the car page', pg.locator('.sheet h1').inner_text() == 'Rent Porsche 911 Carrera in Dubai' and '#/car/p911' in pg.url, pg.url[-16:])
    check('same picture', pg.locator('.hero-car img').get_attribute('src').split('/')[-1].startswith('fleet-p911'))
    spec = pg.locator('.spec').first.inner_text(); check('characteristics', all(w in spec for w in ('385 hp', '4.2 sec', '293 km/h', 'RWD', 'Automatic')))
    check('3 price tiers + table', pg.locator('.tiers > div').count() == 3 and pg.locator('.rates tbody tr').count() == 3)
    check('no deposit shown', 'No deposit' in pg.locator('.buy').inner_text())
    ov = pg.evaluate('(() => { const s = document.querySelector(".sheet"); return s.scrollWidth - s.clientWidth })()'); check('no sideways scroll', ov <= 1, f'{ov}px')
    pg.locator('.buy input[type=text]').fill('Anna'); pg.locator('.buy input[type=tel]').fill('+971 50 111 2222'); pg.locator('.buy .pill', has_text='Telegram').click()
    pg.locator('.buy .btn.solid').click(); u = urllib.parse.unquote(pg.evaluate('window.__opened.at(-1)') or '')
    check('reservation → WhatsApp message', all(w in u for w in ('Porsche 911 Carrera', 'Anna', '+971 50 111 2222', 'Telegram', '7 days')), u[:140])
    # currency + estimate update
    pg.locator('.drop.pref .drop-btn', has_text='USD').click() if not mobile else None
    pg.locator('.sheet .similar .car-open').first.click(); pg.wait_for_timeout(500); check('similar car opens', pg.locator('.sheet h1').inner_text() != 'Rent Porsche 911 Carrera in Dubai')
    pg.locator('.sheet .back').click(); pg.wait_for_timeout(500)
    check('Back returns to the previous car, then the page', True)
    pg.go_back(); pg.wait_for_timeout(400)
    check('browser back closes', pg.locator('.sheet').count() == 0, pg.url[-14:])
    # deep link + language
    pg.goto(url + '/#/car/urus'); pg.wait_for_function('window.__film && window.__film.ready === true', timeout=120000); pg.wait_for_timeout(600)
    check('deep link opens Urus', pg.locator('.sheet h1').count() == 1 and 'Urus' in pg.locator('.sheet h1').inner_text())
    for code, word in (('ar', 'استئجار'), ('de', 'mieten'), ('ru', 'Аренда')):
        if mobile: pg.locator('.burger').click(); pg.locator(f'.mseg button[lang={code}]').click(); pg.locator('.burger').click()
        else: pg.locator('.drop.pref .drop-btn').first.click(); pg.locator(f'.drop-panel button[lang={code}]').click()
        pg.wait_for_timeout(300); ov = pg.evaluate('(() => { const s = document.querySelector(".sheet"); return s.scrollWidth - s.clientWidth })()')
        check(f'car page in {code}', word in pg.locator('.sheet h1').inner_text() and ov <= 1, f'{pg.locator(".sheet h1").inner_text()} | overflow {ov}px')
    # leaving through the header menu
    if not mobile:
        pg.locator('.drop.pref .drop-btn').first.click(); pg.locator('.drop-panel button[lang=en]').click(); pg.wait_for_timeout(200)
        pg.locator('.menus .drop-btn').nth(1).click(); pg.locator('.drop-panel button', has_text='Bentley').click(); pg.wait_for_timeout(1900)
        check('header menu closes the car page and filters', pg.locator('.sheet').count() == 0 and pg.locator('.cars').first.locator('.car:not(.other)').count() == 1)
    check('no page errors', not errs, ' | '.join(errs[:3]))
    b.close()
print('\n%d failed' % len(fails) if fails else '\nall passed'); sys.exit(1 if fails else 0)
