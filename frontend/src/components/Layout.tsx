import { NavLink } from 'react-router-dom'
import type { ReactNode } from 'react'

const items = [
  ['/', 'Overview'],
  ['/events', 'Event Explorer'],
  ['/alerts', 'Threat Alerts'],
  ['/incidents', 'Incidents'],
  ['/timeline', 'Attack Timeline'],
  ['/mitre', 'MITRE ATT&CK'],
  ['/investigation', 'Investigation'],
  ['/lab', 'Detection Lab'],
]

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">CS</div>
          <div>
            <div className="brand-name">CyberSentinel-X</div>
            <div className="brand-sub">Threat detection & investigation</div>
          </div>
        </div>
        <nav>
          {items.map(([to, label]) => (
            <NavLink key={to} to={to} end={to === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" /> API connected through localhost
        </div>
      </aside>
      <main className="main-area">
        <header className="topbar">
          <div>
            <div className="eyebrow">CSE/Cybersecurity Major Project • Phase-I</div>
            <h1>Security Operations Workspace</h1>
          </div>
          <div className="topbar-badge">Prototype v0.1</div>
        </header>
        <section className="content">{children}</section>
      </main>
    </div>
  )
}
