import type { ReactNode } from 'react'

export default function PageTitle({ title, description, action, eyebrow = 'WORKSPACE' }: { title: string; description: string; action?: ReactNode; eyebrow?: string }) {
  return <div className="page-head">
    <div><div className="section-eyebrow">{eyebrow}</div><h2>{title}</h2><p>{description}</p></div>
    {action && <div className="page-actions">{action}</div>}
  </div>
}
