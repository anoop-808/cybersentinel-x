import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { DemoChain } from '../types'
import PageTitle from '../components/PageTitle'
import RiskBadge from '../components/RiskBadge'
import Icon from '../components/Icon'

export default function DetectionLab() {
  const [demo, setDemo] = useState<DemoChain | null>(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const load = () => { setLoading(true); setError(''); api.malwareChain().then(setDemo).catch(e => setError(String(e))).finally(() => setLoading(false)) }
  useEffect(load, [])
  const events = demo?.events ?? []
  const sequenceRisk = events.reduce((max, item) => Math.max(max, item.detection.risk_score), 0)
  const host = events[0]?.computer || 'Unknown host'
  const user = events[0]?.user_name || 'Unknown user'
  const techniques = [...new Set(events.flatMap(item => item.detection.mitre_techniques))]
  return <>
    <PageTitle eyebrow="LAB / CONTROLLED SCENARIO" title="Detection Lab" description="A safe synthetic Windows behavior chain that demonstrates detection, scoring, correlation and ATT&CK mapping." action={<button className="button primary" onClick={load} disabled={loading}><Icon name="refresh" size={14} /> {loading ? 'Refreshing…' : 'Refresh scenario'}</button>} />
    {error && <div className="error-box">{error}</div>}
    {demo && <>
      <section className="panel lab-hero"><div><div className="demo-tag"><span className="live-dot" /> SYNTHETIC TELEMETRY</div><h3>PowerShell-led suspicious activity chain</h3><p>{demo.description} Host <strong>{host}</strong> · User <strong>{user}</strong> · {events.length} correlated events</p><span className="research-note">Controlled demonstration — not live malware and not a claim of malware classification certainty.</span></div><div className="lab-risk"><span>SEQUENCE RISK</span><strong>{sequenceRisk}</strong><RiskBadge score={sequenceRisk}/></div></section>
      <section className="panel"><div className="panel-head"><div><div className="section-eyebrow">END-TO-END PATH</div><h3>Behavior becomes an investigation</h3></div></div><div className="lab-flow">{[['01','Telemetry','Windows-style events'],['02','Detection','Rules + ML'],['03','Risk','0–100 score'],['04','Correlation','Related activity'],['05','MITRE','Technique mapping'],['06','Investigation','Analyst case']].map(([n,t,s], i) => <div className="lab-flow-item" key={t}><div className="flow-node"><span>{n}</span><strong>{t}</strong><small>{s}</small></div>{i < 5 && <Icon name="arrow" size={14} />}</div>)}</div></section>
      <section className="panel"><div className="panel-head"><div><div className="section-eyebrow">BEHAVIORAL CHAIN</div><h3>Correlated activity</h3><p>Each stage is derived from normalized event data returned by the backend.</p></div><span className="mini-label">BEHAVIORAL</span></div><div className="attack-rail enhanced">{events.map((item, index) => <div className="attack-item" key={item.event_id}><div className="rail-dot">{index + 1}</div><div className="attack-content"><div className="attack-top"><span><Icon name="clock" size={11} /> {item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : '—'} · {item.source}</span><RiskBadge score={item.detection.risk_score}/></div><h3>{item.event_type}</h3><p><strong>{item.process_name || 'No process'}</strong>{item.command_line ? ` · ${item.command_line}` : ''}</p>{item.detection.rule_hits.length > 0 && <div className="chips">{item.detection.rule_hits.map(rule => <span className="chip" key={rule}>{rule}</span>)}</div>}<p className="scenario-explanation">{item.detection.explanation}</p>{item.detection.mitre_techniques.length > 0 && <div className="chips">{item.detection.mitre_techniques.map(m => <span className="chip accent" key={m}>{m}</span>)}</div>}</div></div>)}</div></section>
      <div className="grid-two"><section className="panel"><div className="panel-head"><div><div className="section-eyebrow">INTELLIGENCE</div><h3>MITRE coverage</h3></div></div><div className="mitre-grid compact">{techniques.map(id => <article className="mitre-card" key={id}><div className="mitre-card-head"><span className="mitre-id">{id}</span><span className="tactic">Backend mapping</span></div><h3>Mapped technique</h3><p>This technique was returned by the detection engine for the synthetic event chain.</p></article>)}</div></section><section className="panel"><div className="panel-head"><div><div className="section-eyebrow">WINDOWS LOG BRIDGE</div><h3>Collector coverage</h3><p>Use the included PowerShell exporter on Windows, then ingest the output through Event Explorer.</p></div></div><div className="window-log-grid"><div><Icon name="shield" size={15}/><strong>Security</strong><span>Authentication and security telemetry.</span></div><div><Icon name="server" size={15}/><strong>System</strong><span>Service and system activity.</span></div><div><Icon name="terminal" size={15}/><strong>PowerShell</strong><span>Script and operational activity.</span></div><div><Icon name="network" size={15}/><strong>Sysmon*</strong><span>Optional process, network and registry detail.</span></div></div><p className="muted"><strong>*Optional:</strong> unavailable channels are skipped gracefully.</p></section></div>
      <section className="panel research-note-panel"><Icon name="check" size={15}/><span>Detection results, risk scores, explanations, correlation and ATT&amp;CK IDs are returned by the existing backend demo endpoint.</span></section>
    </>}
  </>
}
