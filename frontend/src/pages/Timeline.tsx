import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Alert, EventRecord } from '../types'
import PageTitle from '../components/PageTitle'
import RiskBadge from '../components/RiskBadge'
import Icon from '../components/Icon'

type Row = EventRecord & { alert: Alert | null }

export default function Timeline() {
  const [rows, setRows] = useState<Row[]>([])
  useEffect(() => { api.timeline().then(setRows).catch(() => setRows([])) }, [])
  const selected = rows.filter(r => r.alert)
  return <>
    <PageTitle eyebrow="INVESTIGATE / RECONSTRUCTION" title="Attack Timeline" description="Chronological reconstruction of correlated suspicious activity." />
    <section className="panel timeline-panel"><div className="timeline-summary"><div><span className="section-eyebrow">CORRELATED SEQUENCE</span><h3>{selected.length} suspicious events</h3><p>Events below are supplied by the backend timeline endpoint and retain their detection context.</p></div><div className="sequence-badge"><Icon name="timeline" size={18} /><span>ATTACK PATH</span></div></div><div className="attack-rail enhanced">{selected.map((r, index) => <div className="attack-item" key={r.id}><div className="rail-dot">{index + 1}</div><div className="attack-content"><div className="attack-top"><span><Icon name="clock" size={11} /> {r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : '—'} · {r.source}</span>{r.alert && <RiskBadge score={r.alert.risk_score}/>}</div><h3>{r.event_type}</h3><p><strong>{r.process_name || 'No process'}</strong>{r.command_line ? ` · ${r.command_line}` : ''}</p><div className="chips">{r.alert?.mitre_techniques.map(x => <span className="chip accent" key={x}>{x}</span>)}</div></div></div>)}{!selected.length && <div className="empty-state">No suspicious timeline events available.</div>}</div></section>
  </>
}
