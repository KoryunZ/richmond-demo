// What comes after the film: fleet, how it works, questions, booking, footer.
import { useMemo, useState } from 'react'
import { STR, FLEET, BRANDS, PHONE, PHONE_E164, INSTAGRAM, TELEGRAM } from '../i18n.js'
import { fmt } from './prefs.js'
import { WhatsApp } from './icons.jsx'

const photos = import.meta.glob('../assets/fleet/*.jpg', { eager: true, query: '?url', import: 'default' })
const photo = (id) => photos[`../assets/fleet/fleet-${id}.jpg`]
export const waLink = (text) => `https://wa.me/${PHONE_E164}${text ? `?text=${encodeURIComponent(text)}` : ''}`
const today = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}` }
// what a rental of `days` days comes to at the sample prices (in US dollars): the day rate up to a week, the weekly rate from a week,
// the monthly rate from a month, never more than a month's price before a month is up
export const cost = (car, days) => {
  const rate = days >= 30 ? car.month / 30 : days >= 7 ? Math.min(car.day, car.week / 7) : car.day
  return Math.round(Math.min(rate * days, days >= 30 ? Infinity : car.month) / 10) * 10
}
const norm = (x) => x.toLowerCase()
export const NO_FILTER = { mode: 'month', cat: 'all', brand: '', q: '' }
export const filterFleet = (v, f) => FLEET.filter((c) => (v.cat === 'all' || (v.cat === 'seven' ? c.seats >= 7 : c.cat === v.cat)) && (!v.brand || c.brand === v.brand) && (!v.q.trim() || norm(`${c.name} ${c.brand} ${f[c.cat]}`).includes(norm(v.q.trim()))))
const POPULAR = ['Porsche', 'Mercedes', 'Lamborghini', 'Bentley', 'Range Rover']
const PERS = { day: 'perDay', week: 'perWeek', month: 'perMonth' }

export function Brand({ sub }) {
  return (
    <span className="brand">
      <span className="mark" aria-hidden="true">R</span>
      <span className="brand-name">Richmond</span>
      <span className="brand-sub">{sub}</span>
    </span>
  )
}

function CarCard({ c, lang, cur, mode, onPick, tag }) {
  const f = STR[lang].fleet
  return (
    <li className="car">
      <div className="car-photo">{tag && <span className="tag">{tag}</span>}<img src={photo(c.id)} alt={c.name} loading="lazy" decoding="async" /></div>
      <div className="car-body">
        <h3>{c.name}</h3>
        <p className="car-meta">{f[c.cat]}, {c.seats} {f.seats}, {c.year}</p>
        <div className="car-foot">
          <span className="price">{fmt(c[mode], cur)}<small>{f[PERS[mode]]}</small></span>
          <button type="button" className="btn dark" onClick={() => onPick(c.name)} aria-label={`${f.book}: ${c.name}`}>{f.book}</button>
        </div>
      </div>
    </li>
  )
}

export function Fleet({ lang, cur, view, setView, onPick, onRequest }) {
  const s = STR[lang], f = s.fleet
  const set = (p) => setView((v) => ({ ...v, ...p }))
  const list = useMemo(() => filterFleet(view, f), [view, f])
  const brandCount = (b) => FLEET.filter((c) => c.brand === b).length
  const filtered = view.cat !== 'all' || view.brand || view.q
  return (
    <section className="fleet" id="fleet" aria-labelledby="fleet-h">
      <div className="wrap">
        <header className="sec-head">
          <div>
            <h2 id="fleet-h">{f.h}</h2>
            <p className="sec-sub">{f.sub}</p>
          </div>
          <div className="seg" role="group" aria-label={`${f.day} / ${f.week} / ${f.month}`}>
            {['day', 'week', 'month'].map((m) => <button type="button" key={m} aria-pressed={view.mode === m} onClick={() => set({ mode: m })}>{f[m]}</button>)}
          </div>
        </header>

        <form className="search" role="search" onSubmit={(e) => { e.preventDefault(); document.getElementById('cars')?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }}>
          <input type="search" value={view.q} onChange={(e) => set({ q: e.target.value })} placeholder={f.searchPh} aria-label={f.searchPh} autoComplete="off" enterKeyHint="search" />
          <button type="submit" className="btn dark">{f.search}</button>
          <button type="button" className="btn quiet" onClick={() => setView((v) => ({ ...NO_FILTER, mode: v.mode }))} disabled={!filtered}>{f.clear}</button>
        </form>
        <div className="popular"><span>{f.popular}</span>{POPULAR.map((p) => <button type="button" key={p} onClick={() => set({ q: p, cat: 'all', brand: '' })}>{p}</button>)}</div>

        <div className="brands" role="group" aria-label={f.brandsH}>
          {BRANDS.map((b) => (
            <button type="button" key={b} aria-pressed={view.brand === b} onClick={() => set({ brand: view.brand === b ? '' : b })}>
              <strong>{b}</strong><span>{brandCount(b)}</span>
            </button>
          ))}
        </div>

        <div className="fleet-bar" id="cars">
          <div className="chips" role="group" aria-label={f.all}>
            {['all', 'economy', 'suv', 'luxury', 'sport', 'seven'].map((c) => <button type="button" key={c} aria-pressed={view.cat === c} onClick={() => set({ cat: c })}>{f[c]}</button>)}
          </div>
          <p className="fleet-count" aria-live="polite">{f.count(list.length)}</p>
        </div>
        <ul className="cars">
          {list.map((c) => <CarCard key={c.id} c={c} lang={lang} cur={cur} mode={view.mode} onPick={onPick} />)}
          <li className="car other">
            <div className="car-body">
              <h3>{f.other.h}</h3>
              <p className="car-meta">{f.other.p}</p>
              <div className="car-foot"><a className="btn solid" href={waLink(f.other.msg)} target="_blank" rel="noopener noreferrer">{f.other.cta}</a><button type="button" className="btn ghost" onClick={onRequest}>{s.req.send}</button></div>
            </div>
          </li>
        </ul>
        {list.length === 0 && <p className="none">{f.none}</p>}
        <p className="fleet-note">{f.note} {f.fx}</p>
      </div>
    </section>
  )
}

// the lowest monthly price in each class
export function Offers({ lang, cur, onPick, onAll }) {
  const o = STR[lang].offers, f = STR[lang].fleet
  const best = ['economy', 'suv', 'luxury', 'sport'].map((cat) => FLEET.filter((c) => c.cat === cat).sort((a, b) => a.month - b.month)[0]).filter(Boolean)
  return (
    <section className="offers" id="offers" aria-labelledby="offers-h">
      <div className="wrap">
        <header className="sec-head">
          <div><h2 id="offers-h">{o.h}</h2><p className="sec-sub">{o.sub}</p></div>
          <button type="button" className="btn dark" onClick={onAll}>{o.all}</button>
        </header>
        <ul className="cars">{best.map((c) => <CarCard key={c.id} c={c} lang={lang} cur={cur} mode="month" onPick={onPick} tag={`${o.tag}, ${f[c.cat]}`} />)}</ul>
      </div>
    </section>
  )
}

// price calculator: pick a car and the days, the three prices update as you type
export function Calc({ lang, cur, onBook }) {
  const c = STR[lang].calc
  const [id, setId] = useState(FLEET[0].id), [days, setDays] = useState(7), [club, setClub] = useState(false)
  const car = FLEET.find((x) => x.id === id)
  const total = cost(car, days), CLUB = 0.9
  return (
    <section className="calc" id="calc" aria-labelledby="calc-h">
      <div className="wrap calc-grid">
        <div>
          <h2 id="calc-h">{c.h}</h2>
          <p className="sec-sub">{c.sub}</p>
          <div className="calc-in">
            <label>{c.car}<select value={id} onChange={(e) => setId(e.target.value)}>{FLEET.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
            <label>{c.days}<input type="number" inputMode="numeric" min="1" max="365" value={days} onChange={(e) => setDays(Math.max(1, Math.min(365, Number(e.target.value) || 1)))} /></label>
            <label className="check"><input type="checkbox" checked={club} onChange={(e) => setClub(e.target.checked)} />{c.club}</label>
          </div>
        </div>
        <div className="calc-out" aria-live="polite">
          <dl>
            <div><dt>{c.perDay}</dt><dd>{fmt((club ? total * CLUB : total) / days, cur)}</dd></div>
            <div className="big"><dt>{c.total}</dt><dd>{fmt(club ? total * CLUB : total, cur)}</dd></div>
            <div><dt>{c.clubTotal}</dt><dd>{fmt(total * CLUB, cur)}</dd></div>
          </dl>
          <button type="button" className="btn solid wide" onClick={() => onBook(car.name, days)}>{c.book}</button>
          <p className="calc-note">{c.note}</p>
        </div>
      </div>
    </section>
  )
}

export function Chauffeur({ lang }) {
  const c = STR[lang].chauf
  return (
    <section className="chauf" aria-labelledby="chauf-h">
      <div className="wrap chauf-in">
        <div><h2 id="chauf-h">{c.h}</h2><p>{c.p}</p></div>
        <a className="btn solid" href={waLink(c.msg)} target="_blank" rel="noopener noreferrer">{c.cta}</a>
      </div>
    </section>
  )
}

// "request a similar car": name, phone, how to reach you, the car in mind → a ready WhatsApp message
export function Request({ lang }) {
  const r = STR[lang].req
  const [name, setName] = useState(''), [phone, setPhone] = useState(''), [how, setHow] = useState('wa'), [car, setCar] = useState('')
  const submit = (e) => { e.preventDefault(); window.open(waLink(r.msg({ car: car.trim(), name: name.trim(), phone: phone.trim(), how: r[how] })), '_blank', 'noopener') }
  return (
    <section className="req" id="request" aria-labelledby="req-h">
      <div className="wrap faq-grid">
        <div><h2 id="req-h">{r.h}</h2><p className="sec-sub">{r.sub}</p></div>
        <form onSubmit={submit}>
          <div className="row">
            <label>{r.name}<input type="text" required value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
            <label>{r.phone}<input type="tel" required inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" dir="ltr" /></label>
          </div>
          <fieldset><legend>{r.how}</legend>
            <div className="pills">{['wa', 'tg', 'call'].map((k) => <label key={k} className="pill"><input type="radio" name="how" value={k} checked={how === k} onChange={() => setHow(k)} /><span>{r[k]}</span></label>)}</div>
          </fieldset>
          <label>{r.car}<input type="text" value={car} onChange={(e) => setCar(e.target.value)} /></label>
          <button type="submit" className="btn dark wide">{r.send}</button>
        </form>
      </div>
    </section>
  )
}

export function FloatWhatsApp({ lang, show }) {
  return <a className={`float-wa${show ? ' on' : ''}`} href={waLink('')} target="_blank" rel="noopener noreferrer" aria-label={STR[lang].float} tabIndex={show ? 0 : -1}><WhatsApp size={28} /></a>
}

export function How({ lang }) {
  const h = STR[lang].how
  return (
    <section className="how" id="how" aria-labelledby="how-h">
      <div className="wrap">
        <h2 id="how-h">{h.h}</h2>
        <ol className="steps">
          {h.steps.map(([a, b], i) => <li key={i}><span className="step-n">{i + 1}</span><h3>{a}</h3><p>{b}</p></li>)}
        </ol>
      </div>
    </section>
  )
}

export function Faq({ lang }) {
  const q = STR[lang].faq
  return (
    <section className="faq" id="faq" aria-labelledby="faq-h">
      <div className="wrap faq-grid">
        <div>
          <h2 id="faq-h">{q.h}</h2>
          <p className="sec-sub">{q.sub} <a href={waLink('')} target="_blank" rel="noopener noreferrer">{q.ask}</a></p>
        </div>
        <div className="qa">
          {q.items.map(([a, b], i) => (
            <details key={i} name="faq" open={i === 0}>
              <summary>{a}</summary>
              <p>{b}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}

export function Book({ lang, cur, car, setCar, days, setDays }) {
  const b = STR[lang].book, f = STR[lang].fleet
  const [date, setDate] = useState(''), [name, setName] = useState('')
  const picked = FLEET.find((c) => c.name === car)
  const submit = (e) => {
    e.preventDefault()
    // the date as people write it: 1 December 2026
    const when = date ? new Date(`${date}T00:00:00`).toLocaleDateString({ ru: 'ru-RU', ar: 'ar-AE-u-nu-latn', de: 'de-DE' }[lang] || 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : ''
    const text = b.msg({ car: car || b.any.toLowerCase(), date: when, days, name: name.trim() })
    window.open(waLink(text), '_blank', 'noopener')
  }
  return (
    <section className="book" id="book" aria-labelledby="book-h">
      <div className="wrap book-grid">
        <div>
          <h2 id="book-h">{b.h}</h2>
          <p className="sec-sub">{b.sub}</p>
          <p className="call">{b.call} <a href={`tel:+${PHONE_E164}`}>{PHONE}</a></p>
          {picked && (
            <figure className="pick">
              <img src={photo(picked.id)} alt="" decoding="async" />
              <figcaption><strong>{picked.name}</strong><span>{f[picked.cat]}, {picked.seats} {f.seats}, {picked.year}</span></figcaption>
            </figure>
          )}
        </div>
        <form onSubmit={submit}>
          <label>{b.car}
            <select value={car} onChange={(e) => setCar(e.target.value)}>
              <option value="">{b.any}</option>
              {FLEET.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
          </label>
          <div className="row">
            <label>{b.from}<input type="date" value={date} min={today()} onChange={(e) => setDate(e.target.value)} /></label>
            <label>{b.period}, {b.days}<input type="number" inputMode="numeric" min="1" max="365" value={days} onChange={(e) => setDays(Math.max(1, Math.min(365, Number(e.target.value) || 1)))} /></label>
          </div>
          <label>{b.name}<input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" /></label>
          <p className="estimate" aria-live="polite" hidden={!picked}>{picked ? b.estimate({ price: fmt(cost(picked, days), cur), days }) : ''}</p>
          <button type="submit" className="btn solid wide">{b.send}</button>
        </form>
      </div>
    </section>
  )
}

export function Footer({ lang, onGoto, onShow }) {
  const s = STR[lang], f = s.foot, fl = s.fleet
  const go = (id) => (e) => { e.preventDefault(); onGoto(id) }
  const sh = (p) => (e) => { e.preventDefault(); onShow(p) }
  const cats = [['all', fl.all], ['economy', fl.economy], ['suv', fl.suv], ['luxury', fl.luxury], ['sport', fl.sport], ['seven', fl.seven]]
  return (
    <footer className="foot" id="contacts">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <Brand sub={s.brandSub} />
            <p className="foot-tag">{f.tagline}</p>
          </div>
          <nav aria-label={f.contact}>
            <h2>{f.contact}</h2>
            <ul>
              <li><a href={waLink('')} target="_blank" rel="noopener noreferrer">{f.whatsapp}</a></li>
              <li><a href={`tel:+${PHONE_E164}`} dir="ltr">{PHONE}</a></li>
              <li><a href={TELEGRAM} target="_blank" rel="noopener noreferrer">Telegram</a></li>
              <li><a href={INSTAGRAM} target="_blank" rel="noopener noreferrer">{f.insta} @richmond_rentacar</a></li>
            </ul>
          </nav>
          <nav aria-label={f.site}>
            <h2>{f.site}</h2>
            <ul>
              <li><a href="#fleet" onClick={go('fleet')}>{s.nav.fleet}</a></li>
              <li><a href="#calc" onClick={go('calc')}>{s.nav.prices}</a></li>
              <li><a href="#how" onClick={go('how')}>{f.how}</a></li>
              <li><a href="#faq" onClick={go('faq')}>{f.faq}</a></li>
              <li><a href="#book" onClick={go('book')}>{s.nav.book}</a></li>
            </ul>
          </nav>
          <nav aria-label={f.cars}>
            <h2>{f.cars}</h2>
            <ul>{cats.map(([id, t]) => <li key={id}><a href="#fleet" onClick={sh({ cat: id })}>{t}</a></li>)}</ul>
          </nav>
          <nav aria-label={f.brands} className="foot-brands">
            <h2>{f.brands}</h2>
            <ul>{BRANDS.map((b) => <li key={b}><a href="#fleet" onClick={sh({ brand: b })}>{b}</a></li>)}</ul>
          </nav>
        </div>
        <div className="foot-fine">
          <p>{f.rights}</p>
          <p>{f.demo} {f.credits}</p>
        </div>
      </div>
    </footer>
  )
}
