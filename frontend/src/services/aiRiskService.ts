import { apiClient } from './apiClient';
import { RiskForecastResult } from '../types/riskForecasting';
import { EmotionalStabilityResult, EmotionalStabilityOverview } from '../types/emotionalStability';
import { BehavioralChangeResult, BehavioralChangeOverview } from '../types/behavioralChange';

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

  async computeForecast(data: {
    personnel_uid?: string;
    current_stress_score: number;
    sleep_hours?: number;
    consecutive_duty_days?: number;
    leave_deferrals?: number;
    deployment_months?: number;
  }): Promise<{ personnel_uid: string; forecast: RiskForecastResult }> {
    const response = await apiClient.post('/ai-risk/forecast', data);
    return response.data;
  },

  async getRiskForecast(uid: string): Promise<{ personnel_uid: string; name: string; rank: string; unit: string; forecast: RiskForecastResult }> {
    const response = await apiClient.get(`/ai-risk/forecast/${uid}`);
    return response.data;
  },

  async computeEmotionalStability(data: {
    personnel_uid?: string;
    mood: number;
    stress: number;
    sleep: number;
    energy: number;
    voice: number;
    anxiety: number;
  }): Promise<{ personnel_uid: string; emotional_stability: EmotionalStabilityResult }> {
    const response = await apiClient.post('/ai-risk/emotional-stability', data);
    return response.data;
  },

  async getEmotionalStability(uid: string): Promise<{ personnel_uid: string; name: string; rank: string; unit: string; emotional_stability: EmotionalStabilityResult }> {
    const response = await apiClient.get(`/ai-risk/emotional-stability/${uid}`);
    return response.data;
  },

  async getEmotionalStabilityOverview(): Promise<EmotionalStabilityOverview> {
    const response = await apiClient.get<EmotionalStabilityOverview>('/ai-risk/emotional-stability-overview');
    return response.data;
  },

  async computeBehavioralChange(data: {
    personnel_uid?: string;
    current_leave_days: number;
    historical_leave_days: number;
    current_overtime_hours: number;
    historical_overtime_hours: number;
    current_training_attendance: number;
    historical_training_attendance: number;
    current_performance_rating: number;
    historical_performance_rating: number;
    current_wellness_participation: number;
    historical_wellness_participation: number;
  }): Promise<{ personnel_uid: string; behavioral_change: BehavioralChangeResult }> {
    const response = await apiClient.post('/ai-risk/behavioral-change', data);
    return response.data;
  },

  async getBehavioralChange(uid: string): Promise<{ personnel_uid: string; name: string; rank: string; unit: string; behavioral_change: BehavioralChangeResult }> {
    const response = await apiClient.get(`/ai-risk/behavioral-change/${uid}`);
    return response.data;
  },

  async getBehavioralChangeOverview(): Promise<BehavioralChangeOverview> {
    const response = await apiClient.get<BehavioralChangeOverview>('/ai-risk/behavioral-change-overview');
    return response.data;
  },
};


