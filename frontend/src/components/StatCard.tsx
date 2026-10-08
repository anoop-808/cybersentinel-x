export default function StatCard({ label, value, hint, tone = '' }: { label: string; value: number | string; hint: string; tone?: string }) {
  return (
    <div className={`stat-card ${tone}`}>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      <div className="stat-hint">{hint}</div>
    </div>
  )
}
