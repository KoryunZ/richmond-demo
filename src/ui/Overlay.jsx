// Everything drawn over the film: chapter titles, the chapter rail and the scroll cue.
// Opacity and progress are written straight to the DOM every frame from the timeline position,
// so the interface stays in lock-step with the film without re-rendering React.
import { useEffect, useRef } from 'react'
import { STR, TITLES } from '../i18n.js'

const clamp01 = (v) => Math.max(0, Math.min(1, v))
const smooth = (x) => x * x * (3 - 2 * x)
const windowed = (t, a, b, fade) => smooth(clamp01(Math.min((t - a) / fade, (b - t) / fade)))

export default function Overlay({ progress, lang, onChapter, onGoto }) {
  const s = STR[lang]
  const titles = useRef([]), tabs = useRef([]), cue = useRef(null), rail = useRef(null)
  const last = TITLES.length - 1

  useEffect(() => {
    let raf = 0
    const show = (el, k) => {
      if (!el) return
      el.style.opacity = k.toFixed(3)
      el.style.transform = `translate3d(0, ${((1 - k) * 22).toFixed(1)}px, 0)`
      el.style.visibility = k > 0.004 ? 'visible' : 'hidden'
    }
    const tick = () => {
      const t = progress.t
      TITLES.forEach((c, i) => {
        const k = i === 0 ? smooth(clamp01((c.to - t) / c.fade)) : windowed(t, c.from, c.to, c.fade)
        show(titles.current[i], k)
        if (i === last && titles.current[i]) titles.current[i].style.pointerEvents = k > 0.6 ? 'auto' : 'none'
        const tab = tabs.current[i]
        if (tab) {
          const [a, b] = c.tab, p = clamp01((t - a) / (b - a)), on = t >= a && (t < b || i === last)
          tab.style.setProperty('--p', p.toFixed(4))
          if (tab.dataset.on !== String(on)) { tab.dataset.on = String(on); tab.setAttribute('aria-current', on ? 'step' : 'false') }
        }
      })
      if (cue.current) cue.current.style.opacity = clamp01(1 - t / (TITLES[0].fade * 0.8)).toFixed(3)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [progress, last])

  return (
    <div className="overlay">
      <div className="titles">
        {TITLES.map((c, i) => (
          <div className={`title${i === last ? ' finale' : ''}${c.side === 'right' ? ' right' : ''}${c.high ? ' high' : ''}`} key={c.id} ref={(el) => { titles.current[i] = el }}>
            <h2><span className="t-bold">{s.ch[c.id].a}</span><span className="t-thin">{s.ch[c.id].b}</span></h2>
            <p>{s.ch[c.id].p}</p>
            {i === last && (
              <div className="cta-row">
                <button type="button" className="btn solid" onClick={() => onGoto('fleet')}>{s.explore}</button>
                <button type="button" className="btn ghost" onClick={() => onGoto('book')}>{s.bookNow}</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <nav className="rail" ref={rail} aria-label="Chapters">
        {TITLES.map((c, i) => (
          <button type="button" key={c.id} className="tab" data-on="false" ref={(el) => { tabs.current[i] = el }} onClick={() => onChapter(i)}>
            <span className="tab-n">{i + 1}</span>
            <span className="tab-label">{s.tabs[c.id]}</span>
            <span className="tab-bar" aria-hidden="true"><i /></span>
          </button>
        ))}
      </nav>
      <button type="button" className="skip" onClick={() => onGoto('fleet')}>{s.skip}</button>
      <div className="cue" ref={cue} aria-hidden="true"><span>{s.scroll}</span><i /></div>
    </div>
  )
}
