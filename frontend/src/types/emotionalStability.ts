export interface EmotionalStabilityFactor {
  name: string;
  score: number;
  weight_pct: number;
  status: string;
  description: string;
}

export interface EmotionalStabilityTrajectoryPoint {
  day_label: string;
  score: number;
  status: string;
}

export interface EmotionalStabilityResult {
  score: number;
  score_float: number;
  status: 'Stable' | 'Moderately Stable' | 'Fluctuating' | 'Volatile' | string;
  purpose: string;
  algorithm: string;
  volatility_variance: number;
  confidence: number;
  factors: EmotionalStabilityFactor[];
  trajectory: EmotionalStabilityTrajectoryPoint[];
  recommendation: string;
}

export interface EmotionalStabilityOverview {
  command_score: number;
  welfare_score: number;
  status: string;
  purpose: string;
  algorithm: string;
  total_assessed: number;
  factors: {
    factor: string;
    benchmark: number;
    description: string;
  }[];
  distribution: Record<string, number>;
}
