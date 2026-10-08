export type EventRecord = {
  id: number
  event_id: string
  timestamp: string | null
  source: string
  event_type: string
  computer: string
  user_name: string
  process_name: string
  command_line: string
  parent_process: string
  registry_path: string
  destination_ip: string
  process_id: string
  logon_id: string
  severity: string
  raw_data?: Record<string, unknown>
}

export type Alert = {
  id: number
  event_id: number
  title: string
  severity: string
  risk_score: number
  classification: string
  rule_hits: string[]
  explanation: string
  mitre_techniques: string[]
  status: string
  created_at: string | null
}

export type Incident = {
  id: number
  incident_code: string
  title: string
  summary: string
  severity: string
  risk_score: number
  status: string
  created_at: string | null
  events?: EventRecord[]
  affected_computer?: string
  related_alerts?: Alert[]
  techniques?: MitreItem[]
  explanations?: string[]
}

export type Stats = {
  events: number
  alerts: number
  high_risk: number
  critical: number
  incidents: number
}

export type MitreItem = {
  id: string
  name: string
  tactic: string
  description: string
}


export type DetectionResult = {
  title: string
  severity: string
  risk_score: number
  classification: string
  rule_hits: string[]
  explanation: string
  mitre_techniques: string[]
  ml_score: number
  rule_score: number
}

export type DemoChainItem = EventRecord & {
  synthetic: boolean
  detection: DetectionResult
}

export type DemoChain = {
  synthetic: boolean
  description: string
  events: DemoChainItem[]
}
