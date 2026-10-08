import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { EventRecord } from '../types'
import PageTitle from '../components/PageTitle'

export default function Events() {
  const [events, setEvents] = useState<EventRecord[]>([])
  const [selected, setSelected] = useState<EventRecord | null>(null)
  const [message, setMessage] = useState('')
  const load = () => { api.events().then(setEvents).catch(e => setMessage(String(e))) }
  useEffect(load, [])
  async function ingest(file: File | undefined) {
    if (!file) return
    try { const r = await api.ingest(file); setMessage(`${r.accepted} event(s) accepted, ${r.rejected} rejected. ${r.alerts_generated} alerts and ${r.incidents_created} incidents now exist.`); load() } catch (e) { setMessage(String(e)) }
  }
  return <>
    <PageTitle title="Event Explorer" description="Inspect normalized Windows-style telemetry and ingest JSON/CSV exports."
      action={<label className="button primary">Ingest Logs<input hidden type="file" accept=".json,.csv" onChange={e => ingest(e.target.files?.[0])}/></label>} />
    {message && <div className="info-box">{message}</div>}
    <section className="panel">
      <div className="table-wrap"><table><thead><tr><th>Time</th><th>Event</th><th>Process</th><th>Host</th><th>Source</th><th>Action</th></tr></thead>
        <tbody>{events.map(e => <tr key={e.id}><td>{e.timestamp ? new Date(e.timestamp).toLocaleString() : '—'}</td><td><strong>{e.event_type}</strong><small>{e.event_id}</small></td><td>{e.process_name || '—'}</td><td>{e.computer}</td><td>{e.source}</td><td><button className="link-button" onClick={() => setSelected(e)}>Inspect</button></td></tr>)}</tbody>
      </table></div>
    </section>
    {selected && <div className="drawer-backdrop" onClick={() => setSelected(null)}><aside className="drawer" onClick={e => e.stopPropagation()}><button className="drawer-close" onClick={() => setSelected(null)}>×</button><h3>{selected.event_type}</h3><div className="kv"><b>Timestamp</b><span>{selected.timestamp}</span><b>Process</b><span>{selected.process_name}</span><b>Parent</b><span>{selected.parent_process || '—'}</span><b>Command</b><span>{selected.command_line || '—'}</span><b>Registry</b><span>{selected.registry_path || '—'}</span><b>Destination</b><span>{selected.destination_ip || '—'}</span></div></aside></div>}
  </>
}
