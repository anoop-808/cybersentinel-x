import { useEffect, useState } from 'react'
import { api } from '../services/api'
import type { MitreItem } from '../types'
import PageTitle from '../components/PageTitle'

export default function Mitre() {
  const [items, setItems] = useState<MitreItem[]>([])
  useEffect(() => { api.mitre().then(setItems).catch(() => setItems([])) }, [])
  return <>
    <PageTitle title="MITRE ATT&CK Mapping" description="Dedicated technique catalog so new mappings can be added without changing detection pages." />
    <div className="mitre-grid">{items.map(x => <article className="mitre-card" key={x.id}><div className="mitre-id">{x.id}</div><h3>{x.name}</h3><span className="tactic">{x.tactic}</span><p>{x.description}</p></article>)}</div>
  </>
}
