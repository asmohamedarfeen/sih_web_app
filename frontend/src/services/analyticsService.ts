import { apiClient } from './apiClient';

export interface AnalyticsOverview {
  formation_wellness_index: number;
  stress_trend_7_days: Array<{ day: string; avg_stress: number; sleep_hours: number }>;
  unit_heatmaps: Array<{ unit: string; stress_score: number; burnout_risk: string; headcount: number }>;
  workload_strain_correlation: Array<{ consecutive_days: string; avg_stress: number; recovery_pct: number }>;
  recovery_intervention_success_rate: number;
}

export const analyticsService = {
  async getOverview(): Promise<AnalyticsOverview> {
    const response = await apiClient.get<AnalyticsOverview>('/analytics/overview');
    return response.data;
  },
};
