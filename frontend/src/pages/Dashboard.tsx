import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { Alert, Stats } from '../types'
import StatCard from '../components/StatCard'
import RiskBadge from '../components/RiskBadge'
import PageTitle from '../components/PageTitle'

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    Promise.all([api.stats(), api.alerts(6)]).then(([s, a]) => { setStats(s); setAlerts(a) }).catch(e => setError(String(e)))
  }, [])
  return (
    <>
      <PageTitle title="Command Overview" description="Working Phase-I dashboard backed by FastAPI and SQLite." />
      {error && <div className="error-box">{error}</div>}
      <div className="stats-grid">
        <StatCard label="Events" value={stats?.events ?? '—'} hint="Normalized telemetry" />
        <StatCard label="Alerts" value={stats?.alerts ?? '—'} hint="Detected suspicious events" tone="purple" />
        <StatCard label="High Risk" value={stats?.high_risk ?? '—'} hint="Risk score ≥ 75" tone="amber" />
        <StatCard label="Incidents" value={stats?.incidents ?? '—'} hint="Correlated activity groups" tone="red" />
      </div>
      <div className="grid-two">
        <section className="panel">
          <div className="panel-head"><h3>Detection Pipeline</h3><span className="mini-label">LIVE</span></div>
          <div className="pipeline">
            {['Windows Events', 'Normalizer', 'Rules + ML', 'Risk Scoring', 'Explanation', 'MITRE Mapping'].map((x, i) => <div className="pipeline-step" key={x}><span>{i + 1}</span>{x}{i < 5 && <b>→</b>}</div>)}
          </div>
          <p className="muted">The modules are deliberately separated so future datasets, classifiers, correlation logic and collectors can be added without replacing the dashboard.</p>
        </section>
        <section className="panel">
          <div className="panel-head"><h3>Latest Threats</h3></div>
          <div className="alert-list">
            {alerts.map(a => <div className="alert-row" key={a.id}><div><strong>{a.title}</strong><span>{a.explanation}</span></div><RiskBadge score={a.risk_score} /></div>)}
          </div>
        </section>
      </div>
      <section className="panel roadmap">
        <div><h3>Extension-ready foundation</h3><p>Next layers can add real Windows collection, Sysmon, richer ML training, advanced XAI, streaming ingestion, SIEM integrations and report generation.</p></div>
        <div className="roadmap-grid"><span>✓ API-first</span><span>✓ SQLite persistence</span><span>✓ Rule engine</span><span>✓ ML baseline</span><span>✓ Correlation</span><span>✓ ATT&CK mapper</span></div>
      </section>
    </>
  )
}
