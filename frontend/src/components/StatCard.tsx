import Icon from './Icon'

type IconName = 'activity' | 'alert' | 'shield' | 'case'
export default function StatCard({ label, value, hint, tone = '', icon = 'activity' }: { label: string; value: number | string; hint: string; tone?: string; icon?: IconName }) {
  return <div className={`stat-card ${tone}`}><div className="stat-top"><span className="stat-label">{label}</span><span className="stat-icon"><Icon name={icon} size={15} /></span></div><div className="stat-value">{value}</div><div className="stat-hint">{hint}</div></div>
}
