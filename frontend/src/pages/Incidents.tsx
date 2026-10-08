import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Incident } from '../types'
import PageTitle from '../components/PageTitle'
import RiskBadge from '../components/RiskBadge'

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selected, setSelected] = useState<Incident | null>(null)
  useEffect(() => { api.incidents().then(setIncidents).catch(() => setIncidents([])) }, [])
  async function open(id: number) { setSelected(await api.incident(id)) }
  return <>
    <PageTitle title="Incidents" description="Correlated alerts grouped into analyst-friendly cases." />
    <div className="incident-grid">{incidents.map(i => <button className="incident-card" key={i.id} onClick={() => open(i.id)}><div className="incident-code">{i.incident_code}</div><h3>{i.title}</h3><p>{i.summary}</p><div className="incident-bottom"><RiskBadge score={i.risk_score}/><span>{i.status}</span></div></button>)}</div>
    {selected && <section className="panel detail-panel"><div className="panel-head"><div><h3>{selected.incident_code} · {selected.title}</h3><p>{selected.summary}</p></div><a className="button ghost" href={api.report(selected.id)} target="_blank" rel="noreferrer">Open Report</a></div><div className="timeline-list">{(selected.events ?? []).map(e => <div className="timeline-row" key={e.id}><div className="timeline-time">{e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : '—'}</div><div><strong>{e.event_type}</strong><span>{e.process_name || 'No process'} {e.command_line && `· ${e.command_line}`}</span></div></div>)}</div></section>}
  </>
}
