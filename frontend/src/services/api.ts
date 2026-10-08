import type { Alert, EventRecord, Incident, MitreItem, Stats, DemoChain } from '../types'

export const API_BASE = (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:8000').replace(/\/$/, '') + '/api'

async function get<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`)
  if (!res.ok) throw new Error(`API request failed (${res.status})`)
  return res.json() as Promise<T>
}

export const api = {
  stats: () => get<Stats>('/stats'),
  events: (limit = 200) => get<EventRecord[]>(`/events?limit=${limit}`),
  alerts: (limit = 200) => get<Alert[]>(`/alerts?limit=${limit}`),
  alert: (id: number) => get<Alert>(`/alerts/${id}`),
  incidents: () => get<Incident[]>('/incidents'),
  incident: (id: number) => get<Incident>(`/incidents/${id}`),
  timeline: () => get<(EventRecord & { alert: Alert | null })[]>('/timeline'),
  mitre: () => get<MitreItem[]>('/mitre'),
  malwareChain: () => get<DemoChain>('/demo/malware-chain'),
  ingest: async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch(`${API_BASE}/events/ingest`, { method: 'POST', body: fd })
    if (!res.ok) throw new Error(await res.text())
    return res.json() as Promise<{ accepted: number; rejected: number; alerts_generated: number; incidents_created: number; status: string }>
  },
  report: (id: number) => `${API_BASE}/reports/incidents/${id}`,
}
