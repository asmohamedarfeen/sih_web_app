export interface BehavioralChangeFactor {
  key: string;
  example_label: string; // e.g. "Suddenly taking many leave days"
  domain: string;
  historical_behavior: string; // e.g. "1.2 days/mo"
  current_behavior: string;    // e.g. "6.0 days/mo"
  historical_val: number;
  current_val: number;
  unit: string;
  change_pct: number;
  direction: 'INCREASED' | 'DECREASED' | 'STABLE';
  anomaly_score: number;
  flag: string;
  description: string;
}

export interface BehavioralChangeResult {
  behavior_change_score: number;
  severity_tier: 'Significant Anomaly' | 'Moderate Behavioral Shift' | 'Mild Drift' | 'Stable Baseline' | string;
  purpose: string; // "Detects unusual changes in a person's behavior over time."
  comparison_summary: string; // "Current behavior VS Historical behavior"
  confidence_pct: number;
  anomaly_detected: boolean;
  primary_driver: string;
  factors: BehavioralChangeFactor[];
  recommendation: string;
}

export interface BehavioralChangeOverview {
  unit_behavior_change_score: number;
  severity_tier: string;
  purpose: string;
  ai_process: string;
  total_assessed: number;
  total_anomalies_detected: number;
  flagged_personnel: {
    uid: string;
    name: string;
    rank: string;
    unit: string;
    behavior_change_score: number;
    severity_tier: string;
    primary_driver: string;
  }[];
  domains: {
    domain: string;
    anomaly_rate: string;
    impact: string;
  }[];
}
