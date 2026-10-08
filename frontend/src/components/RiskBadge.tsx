export default function RiskBadge({ score }: { score: number }) {
  const label = score >= 90 ? 'CRITICAL' : score >= 75 ? 'HIGH' : score >= 45 ? 'MEDIUM' : 'LOW'
  const cls = score >= 90 ? 'critical' : score >= 75 ? 'high' : score >= 45 ? 'medium' : 'low'
  return <span className={`risk-badge ${cls}`}><span className="risk-dot" />{label}<b>{score}</b></span>
}
