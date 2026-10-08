import { useEffect, useMemo, useState } from 'react'
import { api } from '../services/api'
import type { MitreItem } from '../types'
import PageTitle from '../components/PageTitle'
import Icon from '../components/Icon'

export default function Mitre() {
  const [items, setItems] = useState<MitreItem[]>([])
  const [query, setQuery] = useState('')
  useEffect(() => { api.mitre().then(setItems).catch(() => setItems([])) }, [])
  const filtered = useMemo(() => items.filter(x => `${x.id} ${x.name} ${x.tactic} ${x.description}`.toLowerCase().includes(query.toLowerCase())), [items, query])
  return <>
    <PageTitle eyebrow="INTELLIGENCE / ATT&CK" title="MITRE ATT&CK" description="Technique context attached to detections so analysts can move from behavior to adversary tradecraft." />
    <section className="panel"><div className="toolbar"><div className="search-box"><Icon name="search" size={14} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search technique, tactic, or ID…" /></div><span className="toolbar-count">{filtered.length} techniques</span></div></section>
    <div className="mitre-grid">{filtered.map(x => <article className="mitre-card" key={x.id}><div className="mitre-card-head"><span className="mitre-id">{x.id}</span><span className="tactic">{x.tactic}</span></div><h3>{x.name}</h3><p>{x.description}</p><div className="mitre-footer"><span>Mapped behavior</span><Icon name="arrow" size={12} /></div></article>)}{!filtered.length && <div className="empty-state">No techniques match this query.</div>}</div>
  </>
}
