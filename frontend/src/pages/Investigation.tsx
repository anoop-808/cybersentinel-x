import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Incident } from '../types'
import PageTitle from '../components/PageTitle'
import RiskBadge from '../components/RiskBadge'
import Icon from '../components/Icon'

export default function Investigation() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [active, setActive] = useState<Incident | null>(null)
  useEffect(() => { api.incidents().then(setIncidents).catch(() => setIncidents([])) }, [])
  useEffect(() => { if (incidents[0]) api.incident(incidents[0].id).then(setActive).catch(() => undefined) }, [incidents])
  return <>
    <PageTitle eyebrow="INVESTIGATE / ANALYST WORKSPACE" title="Investigation" description="One workspace for answering what happened, why it was suspicious, and how the events connect." />
    <div className="investigation-layout"><section className="panel case-list"><div className="panel-head"><div><div className="section-eyebrow">CASES</div><h3>Active investigations</h3></div></div>{incidents.map(i => <button key={i.id} className={`case-row ${active?.id === i.id ? 'selected' : ''}`} onClick={() => api.incident(i.id).then(setActive)}><div><strong>{i.incident_code}</strong><span>{i.title}</span></div><RiskBadge score={i.risk_score}/></button>)}{!incidents.length && <div className="empty-state">No cases.</div>}</section>
      <section className="panel investigation-main">{active ? <><div className="investigation-hero"><div><div className="section-eyebrow">{active.incident_code} · ACTIVE CASE</div><h3>{active.title}</h3><p>{active.summary}</p></div><a className="button primary" href={api.report(active.id)} target="_blank" rel="noreferrer"><Icon name="external" size={13} /> Generate report</a></div><div className="investigation-summary"><RiskBadge score={active.risk_score}/><span><Icon name="server" size={12} /> {active.events?.[0]?.computer ?? 'Unknown host'}</span><span><Icon name="user" size={12} /> {active.events?.[0]?.user_name ?? 'Unknown user'}</span><span><Icon name="activity" size={12} /> {active.events?.length ?? 0} events</span></div><div className="investigation-grid"><div className="investigation-section"><div className="subheading">What happened?</div><div className="summary-callout"><Icon name="alert" size={16} /><span>{active.summary}</span></div></div><div className="investigation-section"><div className="subheading">Investigation status</div><div className="status-card"><span className="status-dot online" /> {active.status}</div></div></div><div className="subheading">Evidence timeline</div><div className="timeline-list">{(active.events ?? []).map(e => <div className="timeline-row" key={e.id}><div className="timeline-time">{e.timestamp ? new Date(e.timestamp).toLocaleString() : '—'}</div><div><strong>{e.event_type}</strong><span>{e.process_name || '—'} {e.destination_ip ? `→ ${e.destination_ip}` : ''}</span></div></div>)}</div></> : <div className="empty-state">No incidents available.</div>}</section>
    </div>
  </>
}
