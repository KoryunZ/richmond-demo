import { STR } from '../i18n.js'
import { Brand } from './Sections.jsx'

export default function Loader({ lang, value, done }) {
  const pct = Math.round(Math.min(1, value) * 100)
  return (
    <div className={`loader${done ? ' done' : ''}`} role="status" aria-live="polite" aria-label={`${STR[lang].loader} ${pct}%`}>
      <Brand sub={STR[lang].brandSub} />
      <div className="loader-main" aria-hidden="true">
        <span className="loader-num">{pct}</span>
        <span className="loader-label">{STR[lang].loader}</span>
      </div>
      <div className="loader-bar" aria-hidden="true"><i style={{ transform: `scaleX(${Math.min(1, value)})` }} /></div>
    </div>
  )
}
