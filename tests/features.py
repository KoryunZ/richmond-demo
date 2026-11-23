"""Exercises the buttons and menus taken from dcr.ae: header menus, search, brands, currency, languages, calculator, forms.
usage: python3 tests/features.py <url> [--mobile]"""
import sys, urllib.parse
from playwright.sync_api import sync_playwright
url = sys.argv[1]; mobile = '--mobile' in sys.argv
fails = []
def check(name, ok, extra=''):
    print(('ok   ' if ok else 'FAIL ') + name + (f'  {extra}' if extra else '')); 
    if not ok: fails.append(name)
with sync_playwright() as p:
    b = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox', '--disable-dev-shm-usage'])
    ctx = b.new_context(viewport={'width': 390 if mobile else 1440, 'height': 844 if mobile else 900}, is_mobile=mobile, has_touch=mobile, locale='en-US')
    pg = ctx.new_page(); errs = []
    pg.on('pageerror', lambda e: errs.append(str(e)[:300])); pg.on('console', lambda m: errs.append(m.text[:200]) if m.type == 'error' else None)
    pg.goto(url, wait_until='load'); pg.wait_for_function('window.__film && window.__film.ready === true', timeout=120000); pg.wait_for_timeout(900)
    opened = []
    pg.add_init_script('') ; pg.evaluate('window.__opened = []; window.open = (u) => { window.__opened.push(u); return null }')
    cars = lambda: pg.locator('.cars').first.locator('.car:not(.other)').count()
    settle = lambda: pg.wait_for_timeout(1700)
    def menu(label):
        if mobile:
            pg.locator('.burger').click(); pg.wait_for_timeout(200)
            pg.locator('.mpanel summary', has_text=label).first.click() if label in ('Cars', 'Brands', 'Rental period') else None
        else:
            pg.locator('.menus .drop-btn', has_text=label).click()
    def choose(text):
        (pg.locator('.mlist button', has_text=text).first if mobile else pg.locator('.drop-panel button', has_text=text).first).click(); settle()
    # header → Cars → Sport
    menu('Cars'); choose('Sport'); check('Cars menu → Sport filters the fleet', cars() == 2, f'{cars()} cars')
    menu('Brands'); choose('Porsche'); check('Brands menu → Porsche', cars() == 1 and pg.locator('.brands button[aria-pressed=true]').count() == 1)
    menu('Rental period'); choose('Per day'); check('Rental period → per day', '/day' in pg.locator('.cars .price').first.inner_text())
    # search, popular, clear
    pg.fill('.search input', 'bentley'); check('search finds Bentley', cars() == 1)
    pg.fill('.search input', 'zzz'); check('empty result message', pg.locator('.none').count() == 1)
    pg.locator('.search .btn.quiet').click(); check('Clear resets', cars() == 11 and pg.locator('.search input').input_value() == '')
    pg.locator('.popular button', has_text='Lamborghini').click(); check('popular chip', cars() == 1)
    pg.locator('.search .btn.quiet').click()
    pg.locator('.chips button', has_text='7 seats').click(); check('7 seats filter', cars() == 2)
    pg.locator('.chips button', has_text='All').click()
    # currency
    if mobile: pg.locator('.burger').click(); pg.locator('.mseg button', has_text='AED').click(); pg.locator('.burger').click()
    else: pg.locator('.drop.pref .drop-btn', has_text='USD').click(); pg.locator('.drop-panel button', has_text='AED').click()
    pg.wait_for_timeout(200); check('currency → AED', 'AED' in pg.locator('.cars .price').first.inner_text(), pg.locator('.cars .price').first.inner_text())
    # calculator
    pg.locator('#calc').scroll_into_view_if_needed(); pg.fill('.calc input[type=number]', '30'); t1 = pg.locator('.calc-out .big dd').inner_text()
    pg.locator('.calc .check input').check(); t2 = pg.locator('.calc-out .big dd').inner_text(); check('calculator + club price', t1 != t2 and 'AED' in t1, f'{t1} → {t2}')
    pg.locator('.calc-out .btn').click(); settle(); check('calculator → booking form picks car', pg.locator('.book select').input_value() == 'Toyota Corolla' and pg.locator('.book input[type=number]').input_value() == '30')
    # request form
    pg.fill('.req input[type=text]', 'Anna'); pg.fill('.req input[type=tel]', '+971 50 000 0000'); pg.locator('.pill', has_text='Telegram').click(); pg.fill('.req .pills ~ label input', 'Porsche Cayenne') if False else None
    pg.locator('.req .btn').click(); u = pg.evaluate('window.__opened.at(-1)'); txt = urllib.parse.unquote(u or '')
    check('request form → WhatsApp message', 'wa.me/971562479977' in (u or '') and 'Anna' in txt and 'Telegram' in txt, txt[:120])
    # languages
    for code, word in (('ar', 'عرض'), ('de', 'Ansehen'), ('ru', 'Смотреть'), ('en', 'View')):
        if mobile: pg.locator('.burger').click(); pg.locator(f'.mseg button[lang={code}]').click(); pg.locator('.burger').click()
        else: pg.locator('.drop.pref .drop-btn').first.click(); pg.locator(f'.drop-panel button[lang={code}]').click()
        pg.wait_for_timeout(250)
        d = pg.evaluate('document.documentElement.dir'); ok = word in pg.locator('.cars .btn.dark').first.inner_text() and d == ('rtl' if code == 'ar' else 'ltr')
        check(f'language {code}', ok, f'dir={d} button="{pg.locator(".cars .btn.dark").first.inner_text()}"')
        ov = pg.evaluate('document.documentElement.scrollWidth - innerWidth'); check(f'  no sideways scroll in {code}', ov <= 1, f'{ov}px')
    # floating WhatsApp visible after the film, hidden at the top
    pg.evaluate('window.scrollTo(0, 0)'); pg.wait_for_timeout(500); top = pg.locator('.float-wa').evaluate('e => getComputedStyle(e).visibility')
    pg.locator('#fleet').scroll_into_view_if_needed(); pg.wait_for_timeout(700); low = pg.locator('.float-wa').evaluate('e => getComputedStyle(e).visibility')
    check('floating WhatsApp: hidden over the film, shown after', top == 'hidden' and low == 'visible', f'{top}/{low}')
    # footer links
    pg.locator('footer .foot-brands a', has_text='Bentley').click(); settle(); check('footer brand link filters', cars() == 1)
    check('no console errors', not errs, ' | '.join(errs[:3]))
    b.close()
print('\n%d failed' % len(fails) if fails else '\nall passed'); sys.exit(1 if fails else 0)
