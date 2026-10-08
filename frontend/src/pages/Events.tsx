import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import type { EventRecord } from '../types'
import PageTitle from '../components/PageTitle'
import Icon from '../components/Icon'

export default function Events() {
  const [events, setEvents] = useState<EventRecord[]>([])
  const [selected, setSelected] = useState<EventRecord | null>(null)
  const [message, setMessage] = useState('')
  const [query, setQuery] = useState('')
  const load = () => api.events().then(setEvents).catch(e => setMessage(String(e)))
  useEffect(() => { load() }, [])
  async function ingest(file: File | undefined) { if (!file) return; try { const r = await api.ingest(file); setMessage(`${r.accepted} event(s) ingested successfully; ${r.rejected} rejected.`); load() } catch (e) { setMessage(String(e)) } }
  const filtered = useMemo(() => events.filter(e => `${e.event_type} ${e.event_id} ${e.process_name} ${e.computer} ${e.user_name} ${e.source}`.toLowerCase().includes(query.toLowerCase())), [events, query])
  return <>
    <PageTitle eyebrow="MONITOR / TELEMETRY" title="Event Explorer" description="Inspect normalized Windows telemetry and import exported JSON or CSV event data." action={<label className="button primary"><Icon name="upload" size={14} /> Ingest logs<input hidden type="file" accept=".json,.csv" onChange={e => ingest(e.target.files?.[0])}/></label>} />
    {message && <div className="info-box"><Icon name="check" size={14} /> {message}</div>}
    <section className="panel table-panel"><div className="toolbar"><div className="search-box"><Icon name="search" size={14} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search event ID, process, host, user…" /></div><span className="toolbar-count">{filtered.length} events</span></div>
      <div className="table-wrap"><table><thead><tr><th>Timestamp</th><th>Event</th><th>Process</th><th>Host / user</th><th>Source</th><th /></tr></thead><tbody>{filtered.map(e => <tr key={e.id}><td><span className="mono">{e.timestamp ? new Date(e.timestamp).toLocaleString() : '—'}</span></td><td><strong>{e.event_type}</strong><small>{e.event_id}</small></td><td><span className="process-cell"><Icon name={e.process_name.toLowerCase().includes('powershell') ? 'terminal' : 'activity'} size={13} />{e.process_name || '—'}</span></td><td><strong>{e.computer}</strong><small>{e.user_name || '—'}</small></td><td>{e.source}</td><td><button className="icon-button" onClick={() => setSelected(e)} title="Inspect event"><Icon name="chevron" size={15} /></button></td></tr>)}</tbody></table></div>
    </section>
    {selected && <div className="drawer-backdrop" onClick={() => setSelected(null)}><aside className="drawer" onClick={e => e.stopPropagation()}><button className="drawer-close" onClick={() => setSelected(null)}><Icon name="close" size={18} /></button><div className="drawer-kicker">EVENT / {selected.event_id}</div><h3>{selected.event_type}</h3><div className="event-severity"><span className={`severity-dot ${selected.severity.toLowerCase()}`} />{selected.severity}</div><div className="kv"><b>Timestamp</b><span>{selected.timestamp ?? '—'}</span><b>Host</b><span>{selected.computer}</span><b>User</b><span>{selected.user_name || '—'}</span><b>Process</b><span>{selected.process_name || '—'}</span><b>Parent</b><span>{selected.parent_process || '—'}</span><b>PID</b><span>{selected.process_id || '—'}</span><b>Command</b><span className="mono">{selected.command_line || '—'}</span><b>Registry</b><span>{selected.registry_path || '—'}</span><b>Destination</b><span>{selected.destination_ip || '—'}</span></div></aside></div>}
  </>
}
