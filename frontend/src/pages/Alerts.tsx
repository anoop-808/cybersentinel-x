import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Alert } from '../types'
import PageTitle from '../components/PageTitle'
import RiskBadge from '../components/RiskBadge'

export default function Alerts() {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [selected, setSelected] = useState<Alert | null>(null)
  useEffect(() => { api.alerts().then(setAlerts).catch(() => setAlerts([])) }, [])
  return <>
    <PageTitle title="Threat Alerts" description="Hybrid baseline detections with rule hits, risk scoring and human-readable explanations." />
    <section className="panel"><div className="table-wrap"><table><thead><tr><th>Alert</th><th>Classification</th><th>Risk</th><th>MITRE</th><th>Status</th><th></th></tr></thead><tbody>
      {alerts.map(a => <tr key={a.id}><td><strong>{a.title}</strong><small>Event #{a.event_id}</small></td><td>{a.classification}</td><td><RiskBadge score={a.risk_score}/></td><td>{a.mitre_techniques.join(', ') || '—'}</td><td>{a.status}</td><td><button className="link-button" onClick={() => setSelected(a)}>Explain</button></td></tr>)}
    </tbody></table></div></section>
    {selected && <section className="panel detail-panel"><div className="panel-head"><h3>{selected.title}</h3><button className="link-button" onClick={() => setSelected(null)}>Close</button></div><div className="detail-grid"><div><div className="detail-label">Risk</div><div className="detail-number">{selected.risk_score}/100</div></div><div><div className="detail-label">Rule hits</div><div>{selected.rule_hits.length ? selected.rule_hits.map(x => <span className="chip" key={x}>{x}</span>) : 'No explicit rule match'}</div></div><div className="detail-wide"><div className="detail-label">Why was this flagged?</div><p>{selected.explanation}</p></div></div></section>}
  </>
}
