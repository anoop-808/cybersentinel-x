import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Incident } from '../types'
import PageTitle from '../components/PageTitle'
import RiskBadge from '../components/RiskBadge'

export default function Investigation() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [active, setActive] = useState<Incident | null>(null)
  useEffect(() => { api.incidents().then(setIncidents).catch(() => setIncidents([])) }, [])
  useEffect(() => { if (incidents[0]) api.incident(incidents[0].id).then(setActive).catch(() => undefined) }, [incidents])
  return <>
    <PageTitle title="Investigation Workspace" description="Analyst view combining case summary, evidence, timeline and reporting." />
    <div className="investigation-layout"><section className="panel case-list"><div className="panel-head"><h3>Cases</h3></div>{incidents.map(i => <button key={i.id} className={`case-row ${active?.id === i.id ? 'selected' : ''}`} onClick={() => api.incident(i.id).then(setActive)}><div><strong>{i.incident_code}</strong><span>{i.title}</span></div><RiskBadge score={i.risk_score}/></button>)}</section>
      <section className="panel investigation-main">{active ? <><div className="panel-head"><div><div className="eyebrow">{active.incident_code}</div><h3>{active.title}</h3></div><a className="button primary" href={api.report(active.id)} target="_blank" rel="noreferrer">Generate Investigation Text</a></div><div className="investigation-summary"><RiskBadge score={active.risk_score}/><span>{active.events?.length ?? 0} events</span><span>{active.status}</span></div><h4>Evidence Timeline</h4><div className="timeline-list">{(active.events ?? []).map(e => <div className="timeline-row" key={e.id}><div className="timeline-time">{e.timestamp ? new Date(e.timestamp).toLocaleString() : '—'}</div><div><strong>{e.event_type}</strong><span>{e.process_name || '—'} {e.destination_ip ? `→ ${e.destination_ip}` : ''}</span></div></div>)}</div></> : <div className="empty-state">No incidents available.</div>}</section>
    </div>
  </>
}
