import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useEffect, useState } from 'react'
import Icon from './Icon'
import { api, API_BASE } from '../services/api'

const groups = [
  { title: 'Monitor', items: [['/', 'Overview', 'grid'], ['/events', 'Event Explorer', 'activity'], ['/alerts', 'Threat Alerts', 'alert']] as const },
  { title: 'Investigate', items: [['/incidents', 'Incidents', 'case'], ['/timeline', 'Attack Timeline', 'timeline'], ['/investigation', 'Investigation', 'search']] as const },
  { title: 'Intelligence', items: [['/mitre', 'MITRE ATT&CK', 'target']] as const },
  { title: 'Lab', items: [['/detection-lab', 'Detection Lab', 'lab']] as const },
]

export default function Layout({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(false)
  useEffect(() => { api.stats().then(() => setOnline(true)).catch(() => setOnline(false)) }, [])

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark"><span>CS</span></div>
          <div className="brand-copy"><div className="brand-name">CyberSentinel-X</div><div className="brand-sub">THREAT OPERATIONS</div></div>
        </div>
        <div className="nav-scroll">
          {groups.map(group => <div className="nav-group" key={group.title}>
            <div className="nav-group-title">{group.title}</div>
            <nav>
              {group.items.map(([to, label, icon]) => <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                <Icon name={icon} size={15} /><span>{label}</span>
                {label === 'Threat Alerts' && <span className="nav-pulse" />}
              </NavLink>)}
            </nav>
          </div>)}
        </div>
        <div className="sidebar-footer">
          <div className="connection-row"><span className={`status-dot ${online ? 'online' : ''}`} /><span>{online ? 'API ONLINE' : 'API OFFLINE'}</span></div>
          <div className="connection-host">{new URL(API_BASE).host}</div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-context">
            <div className="topbar-title"><span className="topbar-kicker">SECURITY OPERATIONS</span><span className="slash">/</span><span>CyberSentinel-X</span></div>
            <div className="topbar-sub">Behavioral detection &amp; incident investigation workspace</div>
          </div>
          <div className="topbar-actions">
            <div className="health-chip"><span className={`status-dot ${online ? 'online' : ''}`} /> {online ? 'Backend connected' : 'Backend unavailable'}</div>
            <div className="phase-chip">PHASE-II</div>
          </div>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  )
}
