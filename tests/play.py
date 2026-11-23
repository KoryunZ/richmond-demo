"""Plays the film through at a given speed and reports how often the exact frame was ready when it was needed.
usage: python3 tests/play.py <url> [seconds for the whole film = 20] [--back]"""
import sys, time
from playwright.sync_api import sync_playwright
url = sys.argv[1]; secs = float(sys.argv[2]) if len(sys.argv) > 2 and not sys.argv[2].startswith('--') else 20.0
a, b = (100, 0) if '--back' in sys.argv else (0, 100)
with sync_playwright() as p:
    br = p.chromium.launch(executable_path='/usr/bin/google-chrome', headless=True, args=['--no-sandbox', '--disable-dev-shm-usage', '--allow-file-access-from-files'])
    pg = br.new_page(viewport={'width': 1440, 'height': 810})
    pg.on('pageerror', lambda e: print('[pageerror]', str(e)[:500]))
    pg.goto(url, wait_until='load'); pg.wait_for_function('window.__film && window.__film.ready === true', timeout=120000)
    pg.wait_for_function('window.__film.store.loaded === window.__film.store.count', timeout=120000)
    pg.evaluate(f'window.__film.seek({a})'); pg.wait_for_timeout(1500)
    res = pg.evaluate("""async ([a, b, secs]) => {
      const { LENGTH, locate } = await import('/src/film/timeline.js')
      const f = window.__film; let hit = 0, miss = 0, frames = 0, worst = 0, last = performance.now()
      f.play(a, b, secs)
      await new Promise((done) => {
        const tick = (now) => {
          const dt = now - last; last = now; worst = Math.max(worst, dt); frames++
          const x = f.progress.t / 100 * (LENGTH - 1), seg = locate(x)[0]
          if (f.store.get(seg.scene.first + Math.floor(seg.local))) hit++; else miss++
          if (Math.abs(f.progress.t - b) < 0.01) done(); else requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
      return { hit, miss, frames, fps: Math.round(frames / secs), worstFrameMs: Math.round(worst) }
    }""", [a, b, secs])
    print(res); br.close()
