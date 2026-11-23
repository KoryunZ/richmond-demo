// The optional "one scroll = one chapter" mode (SCROLL = 'step' in App.jsx). It is off by default: the film
// then follows the scroll position directly. In step mode a wheel turn, a swipe or an arrow key animates the
// page's scroll position to the next chapter's resting frame, so the film is still exactly where the scroll is.
import gsap from 'gsap'
import { LENGTH, FPS } from './timeline.js'

const clamp = (v, a, b) => Math.max(a, Math.min(b, v))
const PLAY = 1.3 // how fast a step plays, as a multiple of the footage's speed

export function attachStepper({ st, stops, calm, progress }) {
  const S = { tween: null, dir: 0, lastWheel: 0, idleSince: 0, outsideAt: 0, touchY: null, touchUsed: false, touchIn: false, settle: 0 }
  const yOf = (t) => Math.round(st.start + ((st.end - st.start) * Math.min(100, t)) / 100) - (t >= 100 ? 1 : 0) // the last stop stays just inside the pinned stretch
  const inFilm = () => window.scrollY >= st.start - 1 && window.scrollY < st.end - 0.5
  const target = (dir) => (dir > 0 ? stops.find((v) => v > progress.t + 0.35) : [...stops].reverse().find((v) => v < progress.t - 0.35)) // undefined past the first or last stop
  const go = (t, quick) => {
    const frames = (Math.abs(t - progress.t) / 100) * (LENGTH - 1)
    const duration = calm ? 0.01 : quick ? clamp(frames / (FPS * 3), 0.25, 0.9) : clamp(frames / (FPS * PLAY), 1.1, 4)
    S.dir = Math.sign(t - progress.t) || 1
    S.tween?.kill()
    const tw = gsap.to(window, { scrollTo: { y: yOf(t), autoKill: false }, duration, ease: quick ? 'power2.out' : 'power1.inOut', overwrite: 'auto' })
    const done = () => { if (S.tween === tw) { S.tween = null; S.idleSince = performance.now() } }
    tw.eventCallback('onComplete', done); tw.eventCallback('onInterrupt', done)
    S.tween = tw
  }
  const again = (dir, fresh) => { // a new gesture while the film is already on its way
    if (!fresh) return
    if (dir !== S.dir) { const t = target(dir); if (t != null) go(t) } // changed their mind: turn round
    else S.tween.timeScale(2.4) // asked again: get there sooner
  }
  const onWheel = (e) => {
    if (e.ctrlKey) return // pinch-zoom
    const dir = Math.sign(e.deltaY), now = performance.now()
    if (!dir) return
    if (!inFilm()) { S.outsideAt = S.lastWheel = now; return }
    const fresh = now - S.lastWheel > 160 // a new gesture, not the tail of the last one
    S.lastWheel = now
    if (S.tween) { e.preventDefault(); again(dir, fresh); return }
    const t = target(dir)
    if (t == null) return // above the first stop or below the last: the page scrolls as usual
    e.preventDefault()
    // Trackpad momentum left over from the last gesture does not start another step, and scrolling that has just
    // come up into the film from the page below comes to rest on the last frame first.
    if (fresh || (now - S.idleSince > 350 && now - S.outsideAt > 700 && Math.abs(e.deltaY) >= 40)) go(t)
  }
  const onTouchStart = (e) => { S.touchY = e.touches[0].clientY; S.touchUsed = false; S.touchIn = inFilm() }
  const onTouchMove = (e) => {
    if (S.touchY == null || !S.touchIn || !inFilm()) return // a swipe that began on the page below just scrolls; the film then settles on its nearest stop
    const dy = S.touchY - e.touches[0].clientY, dir = Math.sign(dy) // finger up = on to the next stop
    if (S.tween) { if (e.cancelable) e.preventDefault(); if (!S.touchUsed && Math.abs(dy) > 24) { S.touchUsed = true; again(dir, true) } return }
    const t = dir ? target(dir) : null
    if (t == null) return
    if (e.cancelable) e.preventDefault()
    if (!S.touchUsed && Math.abs(dy) > 24) { S.touchUsed = true; go(t) }
  }
  const onTouchEnd = () => { S.touchY = null }
  const onKey = (e) => {
    if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return
    const tag = (e.target?.tagName || '').toLowerCase()
    if (tag === 'input' || tag === 'select' || tag === 'textarea' || (tag === 'button' && e.key === ' ')) return
    const dir = (e.key === ' ' && e.shiftKey) || e.key === 'ArrowUp' || e.key === 'PageUp' ? -1 : e.key === ' ' || e.key === 'ArrowDown' || e.key === 'PageDown' ? 1 : 0
    if (!dir || !inFilm()) return
    if (S.tween) { e.preventDefault(); again(dir, true); return }
    const t = target(dir)
    if (t == null) return
    e.preventDefault(); go(t)
  }
  // scrolling that did not come from a step (the scrollbar, a flick back up into the film): once it stops, go to the nearest stop
  const onScroll = () => {
    clearTimeout(S.settle)
    if (S.tween) return
    S.settle = setTimeout(() => {
      if (S.tween || S.touchY != null || !inFilm()) return
      const t = progress.t, near = stops.reduce((a, b) => (Math.abs(b - t) < Math.abs(a - t) ? b : a))
      if (Math.abs(yOf(near) - window.scrollY) > 2) go(near, true)
    }, 240)
  }
  window.addEventListener('wheel', onWheel, { passive: false })
  window.addEventListener('touchstart', onTouchStart, { passive: true })
  window.addEventListener('touchmove', onTouchMove, { passive: false })
  window.addEventListener('touchend', onTouchEnd, { passive: true })
  window.addEventListener('touchcancel', onTouchEnd, { passive: true })
  window.addEventListener('keydown', onKey)
  window.addEventListener('scroll', onScroll, { passive: true })
  return {
    go, target, busy: () => !!S.tween,
    destroy() {
      S.tween?.kill(); clearTimeout(S.settle)
      window.removeEventListener('wheel', onWheel); window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd); window.removeEventListener('touchcancel', onTouchEnd); window.removeEventListener('keydown', onKey); window.removeEventListener('scroll', onScroll)
    },
  }
}
