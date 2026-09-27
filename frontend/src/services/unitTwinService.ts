import { apiClient } from './apiClient';

export interface CompanyTwinData {
  id: string;
  name: string;
  battalion: string;
  commander_name: string;
  commander_rank: string;
  strength: number;
  readiness: number; // 0 - 100
  fatigue: 'Low' | 'Medium' | 'High' | 'Critical';
  training: 'Excellent' | 'Good' | 'Adequate' | 'Needs Refresher';
  morale: 'Resilient' | 'Stable' | 'Strained' | 'Vulnerable';
  deployment_pressure: 'Low' | 'Moderate' | 'High' | 'Surge';
  leadership_stability: 'Excellent' | 'Strong' | 'Developing' | 'Volatile';
  key_strengths: string[];
  vulnerabilities: string[];
  recent_deployment: string;
  wear_tear_index: number;
}

export interface BattalionTwinData {
  id: string;
  name: string;
  strength: number;
  average_readiness: number;
  commanding_officer: string;
  companies: CompanyTwinData[];
}

export interface DimensionDelta {
  dimension: string;
  val_a: string;
  val_b: string;
  advantage: 'A' | 'B' | 'TIE';
  analysis: string;
}

export interface AIComparativeVerdict {
  recommended_unit_id: string;
  recommended_unit_name: string;
  comparative_verdict: string;
  operational_rationale: string;
  deployment_suitability_score_a: number;
  deployment_suitability_score_b: number;
  tactical_mitigation_note: string;
}

export interface UnitComparisonResponse {
  unit_a: CompanyTwinData;
  unit_b: CompanyTwinData;
  mission_context: string;
  dimension_deltas: DimensionDelta[];
  ai_recommendation: AIComparativeVerdict;
}

export interface SimulationTimelinePoint {
  day: number;
  projected_readiness: number;
  projected_fatigue: string;
  burnout_probability: number;
}

export interface UnitSimulationResponse {
  company_id: string;
  company_name: string;
  operational_tempo: string;
  projection_timeline: SimulationTimelinePoint[];
  burnout_risk_day?: number | null;
  recommended_mitigation: string;
}

export const unitTwinService = {
  async getBattalions(): Promise<BattalionTwinData[]> {
    const res = await apiClient.get<BattalionTwinData[]>('/unit-twin/battalions');
    return res.data;
  },

  async getCompany(companyId: string): Promise<CompanyTwinData> {
    const res = await apiClient.get<CompanyTwinData>(`/unit-twin/company/${companyId}`);
    return res.data;
  },

  async compareUnits(params: {
    unit_a_id: string;
    unit_b_id: string;
    mission_context?: string;
  }): Promise<UnitComparisonResponse> {
    const res = await apiClient.post<UnitComparisonResponse>('/unit-twin/compare', params);
    return res.data;
  },

  async simulateUnit(params: {
    company_id: string;
    days?: number;
    operational_tempo?: string;
  }): Promise<UnitSimulationResponse> {
    const res = await apiClient.post<UnitSimulationResponse>('/unit-twin/simulate', params);
    return res.data;
  },
};
