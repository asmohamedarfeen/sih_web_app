export interface TrajectoryPoint {
  day: number;
  label: string;
  score: number;
  risk_tier: 'Critical' | 'High' | 'Moderate' | 'Nominal';
}

export interface EscalationDriver {
  driver: string;
  impact_pts: number;
  description: string;
}

export interface ProactiveAction {
  action: string;
  timeline: string;
  estimated_mitigation: string;
  type: string;
}

export interface RiskForecastResult {
  current_risk_score: number;
  current_risk_tier: 'Critical' | 'High' | 'Moderate' | 'Nominal';
  predicted_30d_score: number;
  predicted_30d_risk_tier: 'Critical' | 'High' | 'Moderate' | 'Nominal';
  delta_score: number;
  trend_direction: 'ESCALATING' | 'STABLE' | 'DE-ESCALATING';
  confidence: number;
  algorithm: string;
  purpose: string;
  benefits: string;
  trajectory: TrajectoryPoint[];
  escalation_drivers: EscalationDriver[];
  proactive_actions: ProactiveAction[];
}
