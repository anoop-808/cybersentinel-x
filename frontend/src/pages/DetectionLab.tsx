import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { DemoChain } from '../types'
import PageTitle from '../components/PageTitle'
import RiskBadge from '../components/RiskBadge'

export default function DetectionLab() {
  const [demo, setDemo] = useState<DemoChain | null>(null)
  const [error, setError] = useState('')

  useEffect(() => { api.demoChain().then(setDemo).catch(e => setError(String(e))) }, [])

  return <>
    <PageTitle title="Detection Lab" description="A deterministic, synthetic Windows-style activity chain for presentations and pipeline validation." />
    {error && <div className="error-box" role="alert">{error}</div>}
    {demo && <>
      <div className="info-box"><strong>Synthetic telemetry:</strong> {demo.description} No real malware is downloaded or executed.</div>
      <section className="panel">
        <div className="panel-head"><h3>Telemetry → Detection → Risk → MITRE</h3><span className="mini-label">CONTROLLED DEMO</span></div>
        <div className="timeline-list">
          {demo.events.map(event => <article className="timeline-row" key={event.id}>
            <div className="timeline-time">{event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : '—'}</div>
            <div><div className="attack-top"><strong>{event.event_type}</strong><RiskBadge score={event.detection.risk_score} /></div>
              <span>{event.process_name || 'No process'} {event.command_line ? `· ${event.command_line}` : ''}</span>
              <div className="chips">{event.detection.rule_hits.map(hit => <span className="chip" key={hit}>{hit}</span>)}{event.detection.mitre_techniques.map(id => <span className="chip" key={id}>{id}</span>)}</div>
              <p className="muted">{event.detection.explanation}</p>
            </div>
          </article>)}
        </div>
      </section>
    </>}
  </>
}
