// The page that opens from a car card: same picture, then prices by length of rental, a reservation box, characteristics,
// description, rental terms, questions and similar cars. It sits over the site at #/car/<id>.
import { useEffect, useMemo, useRef, useState } from 'react'
import { STR, FLEET } from '../i18n.js'
import { fmt } from './prefs.js'
import { CarCard, photo, cost, waLink } from './Sections.jsx'

const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const addDays = (s, n) => { const d = new Date(`${s}T00:00:00`); d.setDate(d.getDate() + n); return iso(d) }
const diffDays = (a, b) => Math.round((new Date(`${b}T00:00:00`) - new Date(`${a}T00:00:00`)) / 86400000)

export default function CarPage({ lang, cur, car, onClose, onOpen, onShow }) {
  const s = STR[lang], d = s.det, f = s.fleet, r = s.req
  const root = useRef(null)
  const today = iso(new Date())
  const [from, setFrom] = useState(today), [to, setTo] = useState(addDays(today, 7)), [name, setName] = useState(''), [phone, setPhone] = useState(''), [how, setHow] = useState('wa')
  useEffect(() => { root.current?.scrollTo(0, 0); root.current?.focus({ preventScroll: true }); setFrom(today); setTo(addDays(today, 7)) }, [car.id]) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { const key = (e) => { if (e.key === 'Escape') onClose() }; document.addEventListener('keydown', key); return () => document.removeEventListener('keydown', key) }, [onClose])

  const days = diffDays(from, to), ok = days >= 1
  const tiers = useMemo(() => {
    const rates = [car.day, Math.min(car.day, car.week / 7), car.month / 30], n = [3, 7, 30]
    return rates.map((rate, i) => ({ label: d.rates.tiers[i], rate, n: n[i], total: cost(car, n[i]), save: Math.round((1 - rate / car.day) * 100) }))
  }, [car, d])
  const price = { day: fmt(car.day, cur), week: fmt(car.week, cur), month: fmt(car.month, cur) }
  const similar = useMemo(() => [...FLEET.filter((c) => c.id !== car.id && c.cat === car.cat), ...FLEET.filter((c) => c.id !== car.id && c.cat !== car.cat)].slice(0, 3), [car])
  const when = (x) => new Date(`${x}T00:00:00`).toLocaleDateString({ ru: 'ru-RU', ar: 'ar-AE-u-nu-latn', de: 'de-DE' }[lang] || 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const submit = (e) => {
    e.preventDefault(); if (!ok) return
    window.open(waLink(d.msg({ car: car.name, from: when(from), to: when(to), days, name: name.trim(), phone: phone.trim(), how: r[how] })), '_blank', 'noopener')
  }
  const spec = [
    [d.spec.year, car.year], [d.spec.cls, f[car.cat]], [d.spec.brand, car.brand], [d.spec.trans, d.spec.auto], [d.spec.seats, car.seats], [d.spec.engine, car.engine],
    [d.spec.power, `${car.hp} ${d.spec.hp}`], [d.spec.acc, `${car.t100.toFixed(1)} ${d.spec.s}`], [d.spec.top, `${car.top} ${d.spec.kmh}`], [d.spec.drive, car.drive], [d.spec.fuel, d.spec.petrol],
  ]
  return (
    <div className="sheet" ref={root} tabIndex={-1} role="dialog" aria-modal="true" aria-label={car.name}>
      <div className="sheet-in wrap">
        <nav className="crumbs" aria-label="Breadcrumb">
          <button type="button" className="back" onClick={onClose}>← {d.back}</button>
          <span className="trail">
            <button type="button" onClick={onClose}>{d.home}</button> / <button type="button" onClick={() => onShow({ cat: car.cat })}>{f[car.cat]}</button> / <button type="button" onClick={() => onShow({ brand: car.brand })}>{car.brand}</button> / <span aria-current="page">{car.name}</span>
          </span>
        </nav>
        <h1>{d.rent(car.name)}</h1>

        <div className="sheet-grid">
          <div className="sheet-main">
            <figure className="hero-car"><img src={photo(car.id)} alt={car.name} decoding="async" /></figure>
            <ul className="badges">{d.badges.map((b) => <li key={b}>{b}</li>)}</ul>

            <section aria-labelledby="spec-h">
              <h2 id="spec-h">{d.spec.h}</h2>
              <dl className="spec">{spec.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              <p className="small-note">{d.spec.note}</p>
            </section>

            <section aria-labelledby="about-h">
              <h2 id="about-h">{d.about.h(car.name)}</h2>
              <p className="lead">{d.about.text(car, f, d)}</p>
              <h3>{d.uh}</h3>
              <ul className="uses">{d.uses[car.cat].map(([t, p]) => <li key={t}><strong>{t}</strong><span>{p}</span></li>)}</ul>
            </section>

            <section aria-labelledby="rates-h">
              <h2 id="rates-h">{d.rates.h(car.name)}</h2>
              <div className="table-wrap"><table className="rates">
                <thead><tr>{d.rates.cols.map((c) => <th key={c} scope="col">{c}</th>)}</tr></thead>
                <tbody>{tiers.map((t) => <tr key={t.label}><th scope="row">{t.label}</th><td>{fmt(t.rate, cur)}</td><td>{d.rates.days(t.n)}: {fmt(t.total, cur)}</td><td>{t.save > 0 ? `−${t.save}%` : '–'}</td></tr>)}</tbody>
              </table></div>
            </section>

            <section aria-labelledby="terms-h">
              <h2 id="terms-h">{d.terms.h}</h2>
              <dl className="spec terms">{d.terms.rows.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>
              <h3>{d.terms.docsH}</h3>
              <ul className="docs"><li><strong>{d.terms.tourists}</strong><span>{d.terms.tDocs}</span></li><li><strong>{d.terms.residents}</strong><span>{d.terms.rDocs}</span></li></ul>
              <p className="small-note">{d.terms.sample}</p>
            </section>

            <section aria-labelledby="cfaq-h" className="cfaq">
              <h2 id="cfaq-h">{d.faq.h}</h2>
              <div className="qa">{d.faq.items(car, price, d).map(([q, a], i) => <details key={i} name="cfaq"><summary>{q}</summary><p>{a}</p></details>)}</div>
            </section>
          </div>

          <aside className="sheet-side">
            <div className="buy">
              <p className="buy-price"><strong>{fmt(car.day, cur)}</strong> <span>{d.perDay}</span></p>
              <div className="tiers">{tiers.map((t) => <div key={t.label}><span>{t.label}</span><strong>{fmt(t.rate, cur)}</strong>{t.save > 0 && <em>−{t.save}%</em>}</div>)}</div>
              <p className="buy-dep"><span>{d.deposit}</span><strong>{d.none}</strong></p>
              <form onSubmit={submit}>
                <h2>{d.book.h}</h2>
                <div className="row">
                  <label>{d.book.pickup}<input type="date" value={from} min={today} onChange={(e) => { setFrom(e.target.value); if (e.target.value >= to) setTo(addDays(e.target.value, 1)) }} required /></label>
                  <label>{d.book.drop}<input type="date" value={to} min={addDays(from, 1)} onChange={(e) => setTo(e.target.value)} required /></label>
                </div>
                <p className="est" aria-live="polite">{ok ? d.book.est({ days, price: fmt(cost(car, days), cur) }) : d.book.bad}</p>
                <label>{d.book.name}<input type="text" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required /></label>
                <label>{d.book.phone}<input type="tel" inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" dir="ltr" required /></label>
                <fieldset><legend>{d.book.how}</legend>
                  <div className="pills">{['wa', 'tg', 'call'].map((k) => <label key={k} className="pill"><input type="radio" name="chow" value={k} checked={how === k} onChange={() => setHow(k)} /><span>{r[k]}</span></label>)}</div>
                </fieldset>
                <button type="submit" className="btn solid wide" disabled={!ok}>{d.book.send}</button>
              </form>
              <p className="or">{d.book.or}</p>
              <a className="btn ghost-dark wide" href={waLink(car.name)} target="_blank" rel="noopener noreferrer">{d.book.chat}</a>
            </div>
          </aside>
        </div>

        <section className="similar" aria-labelledby="sim-h">
          <h2 id="sim-h">{d.similar}</h2>
          <ul className="cars">{similar.map((c) => <CarCard key={c.id} c={c} lang={lang} cur={cur} mode="month" onOpen={onOpen} />)}</ul>
        </section>
      </div>
    </div>
  )
}
