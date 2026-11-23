import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import Film from './film/Film.jsx'
import { createStore } from './film/pack.js'
import Overlay from './ui/Overlay.jsx'
import Loader from './ui/Loader.jsx'
import { Fleet, Offers, Calc, Chauffeur, Request, FloatWhatsApp, How, Faq, Book, Footer, NO_FILTER } from './ui/Sections.jsx'
import Header from './ui/Header.jsx'
import CarPage from './ui/CarPage.jsx'
import { STR, TITLES, LANGS, FLEET } from './i18n.js'
import { LENGTH } from './film/timeline.js'
import { attachStepper } from './film/stepper.js'
import poster from './film/poster.webp'

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
gsap.ticker.lagSmoothing(0) // on a slow frame the film still catches up with the scroll position in real time

// The one number the whole film hangs off: t = 0 → 100. Scroll position writes it; the film and the interface read it.
const progress = { t: 0, locked: false }
const scroll = { t: 0 }
// How scrolling drives the film.
//   'scrub'  the film follows the scroll position directly: down plays it, up plays it backwards, stopping holds
//            the frame, and how fast you scroll is how fast it plays.
//   'step'   one scroll, swipe or arrow key plays on to the next chapter by itself (see film/stepper.js).
const SCROLL = 'scrub'
const FRAMES_PER_SCREEN = 60 // scrub: how much film one screen-height of scrolling plays (about 7 frames per wheel notch)
const FILM_SCREENS = SCROLL === 'step' ? 4 : Math.max(4, Math.min(14, Math.round(LENGTH / FRAMES_PER_SCREEN))) // how tall the film's stretch of the page is, in screen heights
const SMOOTH = 0.45 // scrub: seconds the film takes to catch up with the scroll position (evens out wheel notches)
const START_WITH = 0.12 // share of the frames that must be in before the film opens (the rest keeps arriving)
const RESTS = TITLES.map((c) => c.rest)
const carFromHash = () => { const m = location.hash.match(/^#\/car\/([\w-]+)/); return m && FLEET.some((c) => c.id === m[1]) ? m[1] : null }

export default function App() {
  const [lang, setLang] = useState(() => { const l = (navigator.language || 'en').toLowerCase().slice(0, 2); return LANGS.some((x) => x.id === l) ? l : 'en' })
  const [cur, setCur] = useState('USD')
  const [view, setView] = useState(NO_FILTER) // what the fleet shows: rate, class, brand, search
  const [days, setDays] = useState(30)
  const [carId, setCarId] = useState(carFromHash) // the car page is open when the address is #/car/<id>
  const inApp = useRef(false) // the car page was opened from this page, so closing it can go back one step
  const store = useMemo(createStore, [])
  const [load, setLoad] = useState(0.02)
  const [enough, setEnough] = useState(false) // enough frames have arrived
  const [painted, setPainted] = useState(false) // the first frame is on screen
  const [loaderGone, setLoaderGone] = useState(false)
  const [past, setPast] = useState(false) // scrolled past the film
  const [car, setCar] = useState('')
  const [failed, setFailed] = useState(false) // the film could not be loaded: the page shows its first frame and works without it
  const stage = useRef(null), film = useRef(null), active = useRef(true), trigger = useRef(null), stepper = useRef(null), screens = useRef(FILM_SCREENS)
  const s = STR[lang], ready = (enough && painted) || failed

  useEffect(() => { document.documentElement.lang = lang; document.documentElement.dir = LANGS.find((l) => l.id === lang).dir }, [lang])
  useEffect(() => { document.documentElement.classList.toggle('locked', !ready) }, [ready])
  useEffect(() => { const f = () => setCarId(carFromHash()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f) }, [])
  useEffect(() => { document.documentElement.classList.toggle('sheet-open', !!carId) }, [carId])

  // frames
  useEffect(() => {
    const off = store.onProgress((p) => { setLoad(Math.min(1, 0.02 + (p / START_WITH) * 0.98)); if (p >= START_WITH) setEnough(true) })
    const fail = (e) => { console.error(e); if (!window.__film?.ready) setFailed(true) } // once the film is open, a dropped connection just leaves it with the frames it has
    if (!('createImageBitmap' in window)) fail(new Error('createImageBitmap is not supported'))
    else store.load().catch(fail)
    return off
  }, [store])
  useEffect(() => {
    if (!failed) return
    // without the film its stretch of the page is one screen tall and the first chapter's title stays up
    progress.locked = true; progress.t = 0; screens.current = 0
    ScrollTrigger.refresh()
  }, [failed])
  useEffect(() => {
    if (!ready) return
    window.__film.ready = true
    const id = setTimeout(() => setLoaderGone(true), 1100)
    requestAnimationFrame(() => ScrollTrigger.refresh())
    return () => clearTimeout(id)
  }, [ready])

  // scroll position → timeline. The stage is pinned for the film's stretch of the page and scroll position sets t.
  useLayoutEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    ScrollTrigger.config({ ignoreMobileResize: true })
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
    const tween = gsap.fromTo(scroll, { t: 0 }, { t: 100, ease: 'none', onUpdate: () => { if (!progress.locked) progress.t = scroll.t } })
    const st = ScrollTrigger.create({
      trigger: stage.current, start: 'top top', end: () => `+=${Math.round(window.innerHeight * screens.current)}`,
      pin: true, anticipatePin: 1, scrub: SCROLL === 'step' || calm ? true : SMOOTH, animation: tween, invalidateOnRefresh: true,
    })
    // the bar behind the navigation appears once the fleet section slides under it, not over the last frame of the film
    const bar = ScrollTrigger.create({ trigger: '#fleet', start: 'top 72px', onEnter: () => setPast(true), onLeaveBack: () => setPast(false) })
    trigger.current = st
    const vis = ScrollTrigger.create({ trigger: film.current, start: 'top bottom', end: 'bottom top', onToggle: (self) => { active.current = self.isActive } })
    if (SCROLL === 'step') stepper.current = attachStepper({ st, stops: RESTS, calm, progress })
    return () => { st.kill(); vis.kill(); bar.kill(); tween.kill(); stepper.current?.destroy(); stepper.current = null }
  }, [])

  // test and debugging hook
  useEffect(() => {
    window.__film = {
      progress, store, ready: false,
      seek: (t) => { progress.locked = true; gsap.killTweensOf(progress); progress.t = t },
      play: (a, b, seconds = 4) => { progress.locked = true; gsap.killTweensOf(progress); return gsap.fromTo(progress, { t: a }, { t: b, duration: seconds, ease: 'none' }) },
      unlock: () => { progress.locked = false; progress.t = scroll.t },
      scrollTo: (t) => { const st = trigger.current; if (st) window.scrollTo(0, st.start + ((st.end - st.start) * t) / 100) },
      rests: RESTS, mode: SCROLL, screens: FILM_SCREENS, range: () => { const st = trigger.current; return st ? [st.start, st.end] : [0, 0] },
      step: (dir) => { const t = stepper.current?.target(dir); if (t != null) stepper.current.go(t); return t }, busy: () => !!stepper.current?.busy(),
    }
  }, [store])

  const onPainted = useCallback(() => setPainted(true), [])
  // leave the car page (if it is open) without adding a history step, then run `fn` once the page can scroll again
  const afterCar = useCallback((fn) => {
    if (!carFromHash()) return fn()
    history.replaceState(null, '', location.pathname + location.search); setCarId(null); inApp.current = false
    setTimeout(fn, 60)
  }, [])
  const goTo = useCallback((id) => afterCar(() => gsap.to(window, { scrollTo: { y: `#${id}`, autoKill: true }, duration: 1.3, ease: 'power2.inOut' })), [afterCar])
  const openCar = useCallback((id) => { inApp.current = true; location.hash = `#/car/${id}` }, [])
  const closeCar = useCallback(() => { if (inApp.current) { inApp.current = false; history.back() } else { history.replaceState(null, '', location.pathname + location.search); setCarId(null) } }, [])
  // a click on a chapter tab scrolls to that chapter's resting frame; the film plays there because the scroll does
  const goChapter = useCallback((i) => {
    if (stepper.current) return stepper.current.go(RESTS[i])
    const st = trigger.current
    if (!st) return
    const y = Math.round(st.start + ((st.end - st.start) * RESTS[i]) / 100) - (RESTS[i] >= 100 ? 1 : 0)
    const screensAway = Math.abs(y - window.scrollY) / window.innerHeight
    gsap.to(window, { scrollTo: { y, autoKill: true }, duration: Math.max(0.9, Math.min(3.2, 0.7 + screensAway * 0.42)), ease: 'power2.inOut', overwrite: 'auto' })
  }, [])
  const pick = useCallback((name, d) => { setCar(name); if (d) setDays(d); goTo('book') }, [goTo])
  // the menus and footer links: set what the fleet shows, then go there
  const show = useCallback((patch) => { setView((v) => ({ ...v, cat: 'all', brand: '', q: '', ...patch })); goTo('fleet') }, [goTo])
  const home = useCallback(() => afterCar(() => gsap.to(window, { scrollTo: 0, duration: 1.2, ease: 'power2.inOut' })), [afterCar])

  return (
    <>
      {!loaderGone && <Loader lang={lang} value={load} done={ready} />}
      <Header lang={lang} setLang={setLang} cur={cur} setCur={setCur} past={past || !!carId} goTo={goTo} home={home} show={show} />
      <main id="top">
        <section className="film" ref={film}>
          <div className={`stage${failed ? ' still' : ''}`} ref={stage}>
            <div className="canvas" style={{ backgroundImage: `url(${poster})` }}><Film progress={progress} store={store} active={active} onReady={onPainted} /></div>
            <div className="shade" aria-hidden="true" />
            <Overlay progress={progress} lang={lang} onChapter={goChapter} onGoto={goTo} />
          </div>
        </section>
        <Fleet lang={lang} cur={cur} view={view} setView={setView} onOpen={openCar} onRequest={() => goTo('request')} />
        <Offers lang={lang} cur={cur} onOpen={openCar} onAll={() => show({})} />
        <Calc lang={lang} cur={cur} onBook={pick} />
        <How lang={lang} />
        <Chauffeur lang={lang} />
        <Faq lang={lang} />
        <Request lang={lang} />
        <Book lang={lang} cur={cur} car={car} setCar={setCar} days={days} setDays={setDays} />
      </main>
      <Footer lang={lang} onGoto={goTo} onShow={show} />
      <FloatWhatsApp lang={lang} show={past || !!carId} />
      {carId && <CarPage lang={lang} cur={cur} car={FLEET.find((c) => c.id === carId)} onClose={closeCar} onOpen={openCar} onShow={show} />}
    </>
  )
}
