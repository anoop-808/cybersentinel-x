import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Incident } from '../types'
import PageTitle from '../components/PageTitle'
import RiskBadge from '../components/RiskBadge'
import Icon from '../components/Icon'

export default function Incidents() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selected, setSelected] = useState<Incident | null>(null)
  useEffect(() => { api.incidents().then(setIncidents).catch(() => setIncidents([])) }, [])
  async function open(id: number) { setSelected(await api.incident(id)) }
  return <>
    <PageTitle eyebrow="INVESTIGATE / CASES" title="Incidents" description="Correlated activity groups that are ready for analyst review." />
    <div className="incident-grid">{incidents.map(i => <button className="incident-card" key={i.id} onClick={() => open(i.id)}><div className="incident-card-top"><span className="incident-code">{i.incident_code}</span><RiskBadge score={i.risk_score} /></div><h3>{i.title}</h3><p>{i.summary}</p><div className="incident-bottom"><span>{i.events?.length ?? '—'} related events</span><span>{i.status} <Icon name="chevron" size={12} /></span></div></button>)}{!incidents.length && <div className="empty-state">No incidents available.</div>}</div>
    {selected && <section className="panel incident-detail"><div className="incident-detail-head"><div><div className="section-eyebrow">{selected.incident_code}</div><h3>{selected.title}</h3><p>{selected.summary}</p></div><a className="button ghost" href={api.report(selected.id)} target="_blank" rel="noreferrer"><Icon name="external" size={13} /> Open report</a></div><div className="detail-metrics"><div><span>RISK</span><strong>{selected.risk_score}</strong></div><div><span>STATUS</span><strong>{selected.status}</strong></div><div><span>EVENTS</span><strong>{selected.events?.length ?? 0}</strong></div></div><div className="subheading">Evidence timeline</div><div className="timeline-list">{(selected.events ?? []).map(e => <div className="timeline-row" key={e.id}><div className="timeline-time">{e.timestamp ? new Date(e.timestamp).toLocaleTimeString() : '—'}</div><div><strong>{e.event_type}</strong><span>{e.process_name || 'No process'} {e.command_line && `· ${e.command_line}`}</span></div></div>)}</div></section>}
  </>
}
