import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import type { Alert } from '../types'
import PageTitle from '../components/PageTitle'
import RiskBadge from '../components/RiskBadge'
import Icon from '../components/Icon'

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [selected, setSelected] = useState<Alert | null>(null)
  const [query, setQuery] = useState('')
  useEffect(() => { api.alerts().then(setAlerts).catch(() => setAlerts([])) }, [])
  const filtered = alerts.filter(a => `${a.title} ${a.classification} ${a.mitre_techniques.join(' ')}`.toLowerCase().includes(query.toLowerCase()))
  return <>
    <PageTitle eyebrow="MONITOR / TRIAGE" title="Threat Alerts" description="Review detections, understand why they fired, and pivot into investigation." />
    <section className="panel table-panel">
      <div className="toolbar"><div className="search-box"><Icon name="search" size={14} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search alerts, techniques, classifications…" /></div><span className="toolbar-count">{filtered.length} detections</span></div>
      <div className="table-wrap"><table><thead><tr><th>Detection</th><th>Severity</th><th>Risk</th><th>ATT&CK</th><th>Status</th><th /></tr></thead><tbody>{filtered.map(a => <tr key={a.id}><td><strong>{a.title}</strong><small>Event #{a.event_id} · {a.created_at ? new Date(a.created_at).toLocaleString() : '—'}</small></td><td><span className="classification">{a.classification}</span></td><td><RiskBadge score={a.risk_score} /></td><td><div className="inline-chips">{a.mitre_techniques.slice(0, 2).map(x => <span className="chip" key={x}>{x}</span>)}</div></td><td><span className="status-text">{a.status}</span></td><td><button className="icon-button" onClick={() => setSelected(a)} title="Open detection"><Icon name="chevron" size={15} /></button></td></tr>)}</tbody></table></div>
    </section>
    {selected && <div className="drawer-backdrop" onClick={() => setSelected(null)}><aside className="drawer" onClick={e => e.stopPropagation()}><button className="drawer-close" onClick={() => setSelected(null)}><Icon name="close" size={18} /></button><div className="drawer-kicker">DETECTION / #{selected.id}</div><h3>{selected.title}</h3><RiskBadge score={selected.risk_score} /><div className="drawer-block"><div className="detail-label">Why was this flagged?</div><p className="drawer-explanation">{selected.explanation}</p></div><div className="drawer-block"><div className="detail-label">Rule hits</div><div className="inline-chips">{selected.rule_hits.map(x => <span className="chip" key={x}>{x}</span>)}</div></div><div className="drawer-block"><div className="detail-label">MITRE ATT&amp;CK</div><div className="inline-chips">{selected.mitre_techniques.map(x => <span className="chip accent" key={x}>{x}</span>)}</div></div><Link className="button primary full" to="/investigation" onClick={() => setSelected(null)}>Open investigation <Icon name="arrow" size={13} /></Link></aside></div>}
  </>
}
