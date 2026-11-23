// The header: logo, three drop-down menus (cars, brands, rental period), page links, contact icons, language and
// currency. Under 1100 px it collapses to a menu button that opens the same things as a panel.
import { useEffect, useRef, useState } from 'react'
import { STR, LANGS, BRANDS, PHONE, PHONE_E164, INSTAGRAM, TELEGRAM } from '../i18n.js'
import { CURRENCIES } from './prefs.js'
import { Brand, waLink } from './Sections.jsx'
import { Insta, Phone, Telegram, WhatsApp, Chevron, Burger } from './icons.jsx'

// a button that opens a small panel; closes on a click elsewhere, on Escape and after a choice
function Drop({ label, aria, children, className = '', align }) {
  const [open, setOpen] = useState(false), box = useRef(null)
  useEffect(() => {
    if (!open) return
    const away = (e) => { if (!box.current?.contains(e.target)) setOpen(false) }
    const key = (e) => { if (e.key === 'Escape') { setOpen(false); box.current?.querySelector('button')?.focus() } }
    document.addEventListener('pointerdown', away); document.addEventListener('keydown', key)
    return () => { document.removeEventListener('pointerdown', away); document.removeEventListener('keydown', key) }
  }, [open])
  return (
    <div className={`drop ${className}`} ref={box}>
      <button type="button" className="drop-btn" aria-expanded={open} aria-haspopup="true" aria-label={aria} onClick={() => setOpen(!open)}>{label}<Chevron /></button>
      {open && <div className={`drop-panel${align ? ` ${align}` : ''}`} onClick={() => setOpen(false)}>{children}</div>}
    </div>
  )
}

export default function Header({ lang, setLang, cur, setCur, past, goTo, home, show }) {
  const s = STR[lang], f = s.fleet
  const [menu, setMenu] = useState(false)
  const act = (fn) => (e) => { e?.preventDefault?.(); setMenu(false); fn() }
  const cats = [['all', f.all], ['economy', f.economy], ['suv', f.suv], ['luxury', f.luxury], ['sport', f.sport], ['seven', f.seven]]
  const periods = [['day', f.day], ['week', f.week], ['month', f.month]]
  const icons = (
    <>
      <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Insta /></a>
      <a href={`tel:+${PHONE_E164}`} aria-label={`${s.foot.call} ${PHONE}`}><Phone /></a>
      <a href={TELEGRAM} target="_blank" rel="noopener noreferrer" aria-label="Telegram"><Telegram /></a>
      <a href={waLink('')} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp"><WhatsApp /></a>
    </>
  )
  useEffect(() => { if (!menu) return; const key = (e) => { if (e.key === 'Escape') setMenu(false) }; document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key) }, [menu])
  return (
    <header className={`nav${past || menu ? ' solid' : ''}`}>
      <a className="brand-link" href="#top" onClick={act(home)}><Brand sub={s.brandSub} /></a>

      <nav className="menus" aria-label="Site">
        <Drop label={s.nav.cars}>{cats.map(([id, t]) => <button type="button" key={id} onClick={() => show({ cat: id })}>{t}</button>)}</Drop>
        <Drop label={s.nav.brands} className="wide">{BRANDS.map((b) => <button type="button" key={b} onClick={() => show({ brand: b })}>{b}</button>)}</Drop>
        <Drop label={s.nav.period}>{periods.map(([id, t]) => <button type="button" key={id} onClick={() => show({ mode: id })}>{t}</button>)}</Drop>
        <button type="button" className="link" onClick={() => goTo('calc')}>{s.nav.prices}</button>
        <button type="button" className="link" onClick={() => goTo('how')}>{s.nav.about}</button>
        <button type="button" className="link" onClick={() => goTo('contacts')}>{s.nav.contacts}</button>
      </nav>

      <div className="tools">
        <div className="icons">{icons}</div>
        <Drop label={LANGS.find((l) => l.id === lang).label} aria={s.nav.language} className="pref" align="end">
          {LANGS.map((l) => <button type="button" key={l.id} lang={l.id} aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>{l.name}</button>)}
        </Drop>
        <Drop label={cur} aria={s.nav.currency} className="pref" align="end">
          {CURRENCIES.map((c) => <button type="button" key={c} aria-pressed={cur === c} onClick={() => setCur(c)}>{c}</button>)}
        </Drop>
        <a className="btn solid small nav-cta" href={waLink('')} target="_blank" rel="noopener noreferrer" aria-label={s.nav.cta}>WhatsApp</a>
        <button type="button" className="burger" aria-expanded={menu} aria-controls="mpanel" aria-label={menu ? s.nav.close : s.nav.menu} onClick={() => setMenu(!menu)}><Burger open={menu} /></button>
      </div>

      {menu && (
        <div className="mpanel" id="mpanel">
          <details name="m"><summary>{s.nav.cars}</summary><div className="mlist">{cats.map(([id, t]) => <button type="button" key={id} onClick={act(() => show({ cat: id }))}>{t}</button>)}</div></details>
          <details name="m"><summary>{s.nav.brands}</summary><div className="mlist">{BRANDS.map((b) => <button type="button" key={b} onClick={act(() => show({ brand: b }))}>{b}</button>)}</div></details>
          <details name="m"><summary>{s.nav.period}</summary><div className="mlist">{periods.map(([id, t]) => <button type="button" key={id} onClick={act(() => show({ mode: id }))}>{t}</button>)}</div></details>
          <button type="button" className="mlink" onClick={act(() => goTo('calc'))}>{s.nav.prices}</button>
          <button type="button" className="mlink" onClick={act(() => goTo('how'))}>{s.nav.about}</button>
          <button type="button" className="mlink" onClick={act(() => goTo('contacts'))}>{s.nav.contacts}</button>
          <div className="mpref">
            <div className="mseg" role="group" aria-label={s.nav.language}>{LANGS.map((l) => <button type="button" key={l.id} lang={l.id} aria-pressed={lang === l.id} onClick={() => setLang(l.id)}>{l.label}</button>)}</div>
            <div className="mseg" role="group" aria-label={s.nav.currency}>{CURRENCIES.map((c) => <button type="button" key={c} aria-pressed={cur === c} onClick={() => setCur(c)}>{c}</button>)}</div>
          </div>
          <div className="micons">{icons}</div>
        </div>
      )}
    </header>
  )
}
