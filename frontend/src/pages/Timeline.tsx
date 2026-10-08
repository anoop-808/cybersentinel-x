import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import type { Alert, EventRecord } from '../types'
import PageTitle from '../components/PageTitle'
import RiskBadge from '../components/RiskBadge'

type Row = EventRecord & { alert: Alert | null }

export default function Timeline() {
  const [rows, setRows] = useState<Row[]>([])
  useEffect(() => { api.timeline().then(setRows).catch(() => setRows([])) }, [])
  const selected = useMemo(() => rows.filter(r => r.alert), [rows])
  return <>
    <PageTitle title="Attack Timeline" description="Chronological reconstruction of suspicious activity across the demo host." />
    <section className="panel">
      <div className="attack-rail">{selected.map((r, index) => <div className="attack-item" key={r.id}><div className="rail-dot">{index + 1}</div><div className="attack-content"><div className="attack-top"><span>{r.timestamp ? new Date(r.timestamp).toLocaleTimeString() : '—'}</span>{r.alert && <RiskBadge score={r.alert.risk_score}/>}</div><h3>{r.event_type}</h3><p>{r.process_name} {r.command_line ? `· ${r.command_line}` : ''}</p><div className="chips">{r.alert?.mitre_techniques.map(x => <span className="chip" key={x}>{x}</span>)}</div></div></div>)}</div>
    </section>
  </>
}
