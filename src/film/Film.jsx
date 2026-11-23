// The film: a canvas that shows the frame for the current scroll position.
// Between two frames it cross-fades, so slow scrolling is slow motion rather than a slide show; when the scroll
// stops it settles on a whole frame, so a still picture is always a sharp one. The footage runs on from one
// segment to the next (see timeline.js); at a join the old segment's last frame is held for a moment and fades.
import { useEffect, useRef } from 'react'
import { FW, FH, LENGTH, locate, sample } from './timeline.js'

const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v))
const MAX_W = 1920 // the frames are 1280 wide; a bigger canvas would only cost fill-rate

export default function Film({ progress, store, active, onReady }) {
  const ref = useRef(null)
  useEffect(() => {
    const canvas = ref.current, ctx = canvas.getContext('2d', { alpha: false })
    const small = document.createElement('canvas'); small.width = 24; small.height = 14 // a thumbnail of the frame, stretched over the screen as a soft backdrop on phones
    const sctx = small.getContext('2d')
    let raf = 0, w = 0, h = 0, pos = -1, lastX = 0, lastT = performance.now(), dir = 1, ready = false
    const segs = [], ahead = []
    const stats = (window.__filmStats ||= { frames: 0, late: 0, blank: 0 })

    const resize = () => {
      const r = canvas.getBoundingClientRect(), k = Math.min(window.devicePixelRatio || 1, MAX_W / Math.max(1, r.width))
      const nw = Math.max(2, Math.round(r.width * k)), nh = Math.max(2, Math.round(r.height * k))
      if (nw !== w || nh !== h) { w = canvas.width = nw; h = canvas.height = nh; ctx.imageSmoothingQuality = 'high' }
    }
    const ro = new ResizeObserver(resize); ro.observe(canvas); resize()

    // where a frame goes on the canvas
    const rect = { x: 0, y: 0, w: 0, h: 0, pad: false }
    const place = (scene, local) => {
      const fx = sample(scene.focus, scene, local), span = sample(scene.span, scene, local)
      if (w / h >= 0.9) {
        // fill the screen; when the sides have to be cropped, crop evenly but never cut into the car
        const s = Math.max(w / FW, h / FH), dw = FW * s, dh = FH * s
        let dx = (w - dw) / 2
        const left = (fx - span * 0.62) * dw + dx, right = (fx + span * 0.62) * dw + dx
        if (right > w) dx -= right - w
        else if (left < 0) dx -= left
        rect.x = clamp(dx, w - dw, 0); rect.y = (h - dh) * 0.5; rect.w = dw; rect.h = dh; rect.pad = false
      } else {
        // upright phone: show the part of the picture the car is in, large enough to read, with a soft backdrop above and below
        const vis = clamp(Math.max(span * 1.3, 0.52), 0.52, 1), dw = w / vis, dh = (dw * FH) / FW
        rect.x = clamp(w / 2 - fx * dw, w - dw, 0); rect.y = Math.round(h * 0.4 - dh / 2); rect.w = dw; rect.h = dh; rect.pad = dh < h
      }
    }
    const paint = (bm, alpha) => { ctx.globalAlpha = alpha; ctx.drawImage(bm, rect.x, rect.y, rect.w, rect.h) }

    // one segment's picture at a (fractional) frame: the frame, plus the next one faded in over it.
    // `over` draws it on top of what is already there (a held frame at a join, or the incoming scene of a dissolve).
    const picture = ({ scene, local, alpha, same }, over) => {
      const lo = scene.first, hi = scene.first + scene.frames - 1, i = Math.floor(local), f = local - i
      const a = store.nearest(lo + i, lo, hi)
      if (!over) { stats.frames++; if (!a) stats.blank++; else if (a !== store.get(lo + i)) stats.late++ } // for the tests: how often the exact frame was not decoded in time
      if (!a) return false
      if (!(over && same)) place(scene, local) // a held frame belongs to the same shot: it goes exactly where the picture under it is
      if (!over && rect.pad) {
        sctx.drawImage(a, 0, 0, 24, 14)
        ctx.globalAlpha = 1; ctx.drawImage(small, 0, 0, w, h)
        ctx.fillStyle = 'rgba(4, 6, 11, 0.62)'; ctx.fillRect(0, 0, w, h)
      }
      const k = over ? alpha : 1
      if (over && rect.pad && !same) { ctx.save(); ctx.beginPath(); ctx.rect(0, rect.y, w, rect.h); ctx.clip() }
      paint(a, k)
      if (f > 0.02) { const b = store.get(lo + Math.min(scene.frames - 1, i + 1)); if (b && b !== a) paint(b, k * f) }
      if (over && rect.pad && !same) ctx.restore()
      ctx.globalAlpha = 1
      return true
    }

    const draw = (x) => {
      locate(x, segs)
      let painted = picture(segs[0], false)
      if (segs.length > 1 && segs[1].alpha > 0.003) painted = picture(segs[1], true) || painted
      return painted
    }

    const tick = (now) => {
      raf = requestAnimationFrame(tick)
      if (active && !active.current && ready) return
      const dt = Math.min(0.1, (now - lastT) / 1000); lastT = now
      const x = (progress.t / 100) * (LENGTH - 1)
      const v = (x - lastX) / Math.max(dt, 1e-3); lastX = x
      if (Math.abs(v) > 0.5) dir = v > 0 ? 1 : -1
      // follow the scroll while it moves; settle on the nearest whole frame as it comes to rest
      const target = x + (Math.round(x) - x) * clamp(1 - Math.abs(v) / 8)
      pos = pos < 0 ? target : pos + (target - pos) * (1 - Math.exp(-dt / 0.07))
      // decode around the playhead, further in the direction of travel
      store.focus(locate(pos, ahead)[ahead.length - 1].scene.first + Math.round(ahead[ahead.length - 1].local))
      // when the scroll outruns the decoder, ask for every 2nd, 3rd… frame instead of falling behind
      const stride = clamp(Math.round(Math.abs(v) / 45), 1, 6)
      for (let k = -4; k <= 22; k++) {
        const p = pos + dir * k * stride
        if (p < 0 || p > LENGTH - 1) continue
        for (const sg of locate(p, ahead)) store.want(sg.scene.first + Math.min(sg.scene.frames - 1, Math.round(sg.local / stride) * stride))
      }
      const ok = draw(pos)
      if (ok && !ready) { ready = true; onReady?.() }
    }
    raf = requestAnimationFrame(tick)
    return () => { cancelAnimationFrame(raf); ro.disconnect() }
  }, [progress, store, active, onReady])

  return <canvas ref={ref} className="film-canvas" aria-hidden="true" />
}
