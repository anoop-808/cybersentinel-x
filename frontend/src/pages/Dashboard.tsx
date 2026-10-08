import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api } from '../services/api'
import type { Alert, Incident, Stats } from '../types'
import StatCard from '../components/StatCard'
import RiskBadge from '../components/RiskBadge'
import PageTitle from '../components/PageTitle'
import Icon from '../components/Icon'

const pipeline = [
  ['01', 'Windows telemetry', 'Raw event stream'],
  ['02', 'Normalize', 'Common schema'],
  ['03', 'Detect', 'Rules + ML'],
  ['04', 'Score', 'Risk 0–100'],
  ['05', 'Explain', 'Analyst reasons'],
  ['06', 'Correlate', 'Incident chain'],
  ['07', 'MITRE', 'ATT&CK context'],
]

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [error, setError] = useState('')
  useEffect(() => { Promise.all([api.stats(), api.alerts(5), api.incidents()]).then(([s, a, i]) => { setStats(s); setAlerts(a); setIncidents(i) }).catch(e => setError(String(e))) }, [])
  const maxRisk = useMemo(() => Math.max(...alerts.map(a => a.risk_score), 1), [alerts])
  return <>
    <PageTitle eyebrow="MONITOR / OVERVIEW" title="Security Operations" description="A live view of telemetry, detections, correlated activity and investigation state." action={<Link className="button primary" to="/detection-lab"><Icon name="lab" size={14} /> Open Detection Lab</Link>} />
    {error && <div className="error-box">{error}</div>}

    <div className="stats-grid">
      <StatCard label="Events" value={stats?.events ?? '—'} hint="Normalized telemetry" icon="activity" />
      <StatCard label="Alerts" value={stats?.alerts ?? '—'} hint="Suspicious activity" tone="purple" icon="alert" />
      <StatCard label="High risk" value={stats?.high_risk ?? '—'} hint="Risk score ≥ 75" tone="amber" icon="shield" />
      <StatCard label="Incidents" value={stats?.incidents ?? '—'} hint="Correlated cases" tone="red" icon="case" />
    </div>

    <section className="panel pipeline-panel">
      <div className="panel-head"><div><div className="section-eyebrow">ANALYTICAL PIPELINE</div><h3>From telemetry to investigation</h3><p>The UI follows the same modular flow implemented by the backend.</p></div><span className="live-chip"><span className="live-dot" /> LIVE</span></div>
      <div className="pipeline-track">{pipeline.map(([num, title, sub], i) => <div className="pipeline-node-wrap" key={title}><div className="pipeline-node"><span>{num}</span><strong>{title}</strong><small>{sub}</small></div>{i < pipeline.length - 1 && <div className="pipeline-arrow"><Icon name="arrow" size={14} /></div>}</div>)}</div>
    </section>

    <div className="dashboard-grid">
      <section className="panel threat-panel">
        <div className="panel-head"><div><div className="section-eyebrow">THREAT ACTIVITY</div><h3>Recent detections</h3></div><Link className="text-link" to="/alerts">View all <Icon name="arrow" size={12} /></Link></div>
        <div className="threat-list">
          {alerts.map(a => <Link to="/alerts" className="threat-row" key={a.id}><div className="threat-marker" /><div className="threat-main"><strong>{a.title}</strong><span>{a.explanation}</span><small>{a.created_at ? new Date(a.created_at).toLocaleTimeString() : '—'} · event #{a.event_id}</small></div><RiskBadge score={a.risk_score} /><div className="row-arrow"><Icon name="chevron" size={14} /></div></Link>)}
          {!alerts.length && <div className="empty-state">No alerts available.</div>}
        </div>
      </section>
      <section className="panel risk-panel">
        <div className="panel-head"><div><div className="section-eyebrow">RISK PROFILE</div><h3>Detection severity</h3></div></div>
        <div className="risk-meter"><div className="risk-ring"><div><strong>{stats?.high_risk ?? '—'}</strong><span>high risk</span></div></div><div className="risk-copy"><div><span className="legend-dot high" /> High <b>{stats?.high_risk ?? 0}</b></div><div><span className="legend-dot medium" /> Medium <b>{Math.max((stats?.alerts ?? 0) - (stats?.high_risk ?? 0), 0)}</b></div><div><span className="legend-dot low" /> Normal <b>{stats?.events ? Math.max(stats.events - stats.alerts, 0) : 0}</b></div></div></div>
        <div className="risk-bars">{alerts.slice(0, 5).map(a => <div className="risk-bar-row" key={a.id}><span>{a.title}</span><div className="bar-track"><i style={{ width: `${Math.min((a.risk_score / maxRisk) * 100, 100)}%` }} /></div><b>{a.risk_score}</b></div>)}</div>
      </section>
    </div>

    <section className="panel incident-strip">
      <div className="panel-head"><div><div className="section-eyebrow">ACTIVE INVESTIGATIONS</div><h3>Correlated cases</h3></div><Link className="text-link" to="/investigation">Open workspace <Icon name="arrow" size={12} /></Link></div>
      <div className="incident-mini-grid">{incidents.slice(0, 3).map(i => <Link to="/investigation" className="incident-mini" key={i.id}><div><span className="incident-code">{i.incident_code}</span><strong>{i.title}</strong><small>{i.summary}</small></div><RiskBadge score={i.risk_score} /></Link>)}{!incidents.length && <div className="empty-state">No correlated incidents available.</div>}</div>
    </section>
  </>
}
