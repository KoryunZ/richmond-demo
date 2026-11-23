// How the footage sits on the one timeline that scroll position controls.
// The film is a run of segments (clips). They follow each other frame to frame; where two meet, the last frame of
// the old one is held and fades out over a few frames to hide the small step in brightness the generator leaves.
// Where a stretch was cut out, the two sides overlap and cross-fade instead.
import film from './film.json' with { type: 'json' }

export const FW = film.width, FH = film.height, FPS = film.fps
const HOLD = 5 // frames over which the previous segment's last frame fades out at a join

const segs = film.segments.map((s, k) => ({ ...s, k }))
let first = 0, start = 0
segs.forEach((s, k) => {
  if (!k) s.join = 'start'
  s.over = s.join === 'dissolve' ? Math.min(s.over ?? 12, s.frames - 1, segs[k - 1].frames - 1) : 0
  start -= s.over
  s.first = first // index of the segment's first frame in the pack
  s.start = start // where the segment begins on the timeline (frames)
  first += s.frames; start += s.frames
})
export const SEGMENTS = segs
export const LENGTH = start // timeline length in frames
export const FRAMES = first
export const unit = (x) => (x / (LENGTH - 1)) * 100 // timeline frames → 0–100

// Chapters, in timeline frames: `enter` = the chapter's place has arrived (its title comes up), `rest` = where a
// click on its tab lands, `exit` = the place starts to change (the title leaves). The chapter rail switches from
// one tab to the next half-way through the change (`begin` … `end`).
const at = (p) => segs[p.segment].start + p.frame
const marks = film.chapters.map((c) => ({ id: c.id, enter: at(c.enter), rest: at(c.rest), exit: c.exit ? at(c.exit) : LENGTH - 1 }))
export const CHAPTERS = marks.map((c, i) => ({
  ...c,
  enter: i ? c.enter : 0,
  begin: i ? (marks[i - 1].exit + c.enter) / 2 : 0,
  end: i < marks.length - 1 ? (c.exit + marks[i + 1].enter) / 2 : LENGTH - 1,
  last: i === marks.length - 1,
}))

const sm = (x) => x * x * (3 - 2 * x)
const _a = { scene: null, local: 0, alpha: 1, same: false }, _b = { scene: null, local: 0, alpha: 0, same: false }

/** What is on screen at timeline position x: one layer, or two. The second is drawn over the first with its alpha;
 *  `same` means it shows the same shot (a held frame) and takes the first layer's place on screen. */
export function locate(x, out = []) {
  x = Math.max(0, Math.min(LENGTH - 1, x))
  let k = segs.length - 1
  while (k > 0 && x < segs[k].start) k--
  const s = segs[k], local = x - s.start, p = segs[k - 1]
  out.length = 0
  if (p && s.over && local < s.over) {
    _a.scene = p; _a.local = Math.min(p.frames - 1, x - p.start); _a.alpha = 1; _a.same = false
    _b.scene = s; _b.local = local; _b.alpha = sm(local / s.over); _b.same = false
    out.push(_a, _b)
    return out
  }
  _a.scene = s; _a.local = Math.min(s.frames - 1, local); _a.alpha = 1; _a.same = false
  out.push(_a)
  if (p && s.join === 'run' && local < HOLD) {
    _b.scene = p; _b.local = p.frames - 1; _b.alpha = 1 - sm((local + 1) / (HOLD + 1)); _b.same = true
    out.push(_b)
  }
  return out
}

/** value of a per-segment track (focus, span) at a frame of that segment */
export function sample(track, scene, local) {
  const p = (Math.max(0, Math.min(scene.frames - 1, local)) / Math.max(1, scene.frames - 1)) * (track.length - 1), i = Math.floor(p), f = p - i
  return track[i] + ((track[Math.min(track.length - 1, i + 1)] - track[i]) * f)
}

const _c = []
/** where the car is at timeline position x: centre and width, as fractions of the picture width */
export function carAt(x) {
  const { scene, local } = locate(x, _c)[0]
  return { x: sample(scene.focus, scene, local), w: sample(scene.span, scene, local) }
}
