import { apiClient } from './apiClient';

export interface EvaluationResult {
  stress_score: number;
  burnout_probability: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  confidence_score: number;
  primary_triggers: Array<{
    factor: string;
    impact: string;
    metric: string;
  }>;
  ai_recommendations: string[];
  sub_scores: {
    sleep_strain: number;
    fatigue_strain: number;
    workload_strain: number;
    shift_exhaustion: number;
  };
}

export interface RiskAnalytics {
  total_monitored: number;
  distribution: {
    CRITICAL: { count: number; percentage: number };
    HIGH: { count: number; percentage: number };
    MODERATE: { count: number; percentage: number };
    LOW: { count: number; percentage: number };
  };
  top_contributing_triggers: Array<{
    trigger: string;
    affected_count: number;
    severity: string;
  }>;
}

export const aiRiskService = {
  async computeRisk(data: {
    personnel_uid: string;
    sleep_hours: number;
    fatigue_level: number;
    mood_score: number;
    workload_pressure: number;
    physical_strain: number;
    consecutive_duty_days: number;
  }): Promise<{ personnel_uid: string; evaluation: EvaluationResult }> {
    const response = await apiClient.post('/ai-risk/predict', data);
    return response.data;
  },

  async getRiskAnalytics(): Promise<RiskAnalytics> {
    const response = await apiClient.get<RiskAnalytics>('/ai-risk/analytics');
    return response.data;
  },
};
