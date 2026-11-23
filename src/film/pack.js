// The frames of the film. They arrive as one packed file (frames.pack: every frame one after another, sizes in
// film.json) or, in the single-file build, as base64 blocks inside the page. Frames are kept compressed and are
// decoded only around the playhead, so memory stays flat however long the film is. A small copy of every sixth
// frame is kept decoded as well, for when the scroll is faster than the decoder.
import film from './film.json' with { type: 'json' }

export function createStore() {
  const n = film.sizes.length, offs = new Float64Array(n + 1)
  for (let i = 0; i < n; i++) offs[i + 1] = offs[i] + film.sizes[i]
  const phone = matchMedia('(pointer: coarse)').matches && Math.min(screen.width, screen.height) < 820
  const MAX = phone ? 30 : 80 // decoded frames kept at once
  const blobs = new Array(n), bitmaps = new Map(), pending = new Set()
  // Small copies of every EVERY-th frame, decoded once and kept. When a flick of the wheel outruns the decoder, the
  // film shows the nearest of these (soft, but the right moment) instead of standing still and then jumping.
  const EVERY = 6, SMALL = phone ? [256, 144] : [320, 180]
  const thumbs = new Map()
  let thumbNext = 0, thumbBusy = 0, thumbsOff = false
  function pumpThumbs() {
    while (!thumbsOff && thumbBusy < 2 && thumbNext < loaded) {
      const i = thumbNext; thumbNext += EVERY; thumbBusy++
      createImageBitmap(blobs[i], { resizeWidth: SMALL[0], resizeHeight: SMALL[1], resizeQuality: 'medium' }).then((bm) => {
        if (bm.width > SMALL[0] * 1.5) { bm.close?.(); thumbsOff = true } // this browser ignored the resize: full-size copies would cost too much memory
        else thumbs.set(i, bm)
      }, () => { thumbsOff = true }).finally(() => { thumbBusy--; pumpThumbs() })
    }
  }
  let buf = new Uint8Array(film.bytes), got = 0, loaded = 0, centre = 0
  const listeners = new Set()

  function append(chunk) {
    buf.set(chunk, got); got += chunk.length
    while (loaded < n && offs[loaded + 1] <= got) { blobs[loaded] = new Blob([buf.subarray(offs[loaded], offs[loaded + 1])], { type: 'image/webp' }); loaded++ }
    if (loaded === n) buf = null
    pumpThumbs()
    for (const f of listeners) f(loaded / n)
  }
  const b64 = (text) => {
    const bin = atob(text.trim()), out = new Uint8Array(bin.length)
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i)
    return out
  }
  async function load() {
    const inline = document.querySelectorAll('script[type="application/x-frames"]')
    if (inline.length) {
      for (const tag of inline) { append(b64(tag.textContent)); tag.remove(); await new Promise((r) => setTimeout(r, 0)) }
      return
    }
    const res = await fetch(new URL('frames.pack', document.baseURI))
    if (!res.ok) throw new Error(`frames.pack: ${res.status}`)
    const reader = res.body.getReader()
    for (;;) { const { done, value } = await reader.read(); if (done) break; append(value) }
  }
  function evict() {
    while (bitmaps.size > MAX) {
      let far = -1, dist = -1
      for (const i of bitmaps.keys()) { const d = Math.abs(i - centre); if (d > dist) { dist = d; far = i } }
      bitmaps.get(far).close?.(); bitmaps.delete(far)
    }
  }
  return {
    count: n, load,
    get loaded() { return loaded },
    onProgress(f) { listeners.add(f); return () => listeners.delete(f) },
    /** ask for frame i to be decoded soon */
    want(i) {
      if (i < 0 || i >= n || !blobs[i] || bitmaps.has(i) || pending.has(i) || pending.size >= 8) return
      pending.add(i)
      createImageBitmap(blobs[i]).then((bm) => { pending.delete(i); bitmaps.set(i, bm); evict() }, () => pending.delete(i))
    },
    get(i) { return bitmaps.get(i) || null },
    /** frame i; or a decoded frame right next to it; or the nearest small copy; or the closest decoded frame between
     *  lo and hi. So the picture never goes blank or freezes while decoding catches up. */
    nearest(i, lo, hi) {
      const hit = bitmaps.get(i)
      if (hit) return hit
      for (let d = 1; d <= 2; d++) {
        if (i - d >= lo) { const a = bitmaps.get(i - d); if (a) return a }
        if (i + d <= hi) { const b = bitmaps.get(i + d); if (b) return b }
      }
      const k = Math.round(i / EVERY) * EVERY
      for (const j of [k, k < i ? k + EVERY : k - EVERY]) { if (j >= lo && j <= hi) { const t = thumbs.get(j); if (t) return t } }
      for (let d = 3; d < 60; d++) {
        if (i - d >= lo) { const a = bitmaps.get(i - d); if (a) return a }
        if (i + d <= hi) { const b = bitmaps.get(i + d); if (b) return b }
      }
      return null
    },
    focus(i) { centre = i },
  }
}
