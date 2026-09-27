import { apiClient } from './apiClient';

export interface ImpactMetricDelta {
  metric_name: string;
  baseline_value: number;
  projected_value: number;
  delta: number;
  delta_percentage: number;
  direction: 'UP' | 'DOWN' | 'STABLE';
  sentiment: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface SimulationCurvePoint {
  day: number;
  readiness: number;
  burnout_rate: number;
  leave_pressure: number;
}

export interface MissionImpactPreset {
  id: string;
  title: string;
  description: string;
  unit_id: string;
  sub_unit?: string | null;
  additional_deployment_days: number;
  rotation_strategy: string;
  rotation_day?: number | null;
  operational_threat_level: string;
}

export interface MissionImpactSimulationRequest {
  unit_id: string;
  sub_unit?: string | null;
  additional_deployment_days: number;
  rotation_strategy: string;
  rotation_day?: number | null;
  operational_threat_level: string;
}

export interface MissionImpactSimulationResponse {
  scenario_title: string;
  unit_name: string;
  sub_unit?: string | null;
  additional_days: number;
  rotation_applied?: string | null;
  readiness_metric: ImpactMetricDelta;
  burnout_metric: ImpactMetricDelta;
  leave_requests_metric: ImpactMetricDelta;
  predicted_recovery_time_days: number;
  mission_capability: 'Maintained' | 'Degraded' | 'Severely Compromised';
  decision_score: number;
  ai_tactical_assessment: string;
  recommendation_headline: string;
  counter_scenario_summary: string;
  projection_curve: SimulationCurvePoint[];
}

export const missionImpactService = {
  async getPresets(): Promise<MissionImpactPreset[]> {
    const res = await apiClient.get<MissionImpactPreset[]>('/mission-impact/presets');
    return res.data;
  },

  async simulateDecision(
    params: MissionImpactSimulationRequest
  ): Promise<MissionImpactSimulationResponse> {
    const res = await apiClient.post<MissionImpactSimulationResponse>(
      '/mission-impact/simulate',
      params
    );
    return res.data;
  },
};
