import { apiClient } from './apiClient';

export interface MissionTypeInfo {
  type: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  target_readiness_range: string;
  preserve_strategic_reserves: boolean;
  description: string;
  primary_skills: string[];
}

export interface CandidateAssessment {
  uid: string;
  name: string;
  rank: string;
  unit: string;
  current_readiness: number;
  stress_score: number;
  readiness_trend_21d: number;
  consecutive_duty_days: number;
  sleep_hours_avg: number;
  skills: string[];
  suitability_score: number;
  recommendation_tier: 'HIGHLY_RECOMMENDED' | 'SUITABLE' | 'RESERVE_CANDIDATE' | 'STRATEGIC_RESERVE_PRESERVED';
  ai_rationale: string;
  match_factors: {
    skill_matches?: string[];
    sleep_hours?: number;
    duty_days?: number;
    trend_21d?: number;
    skill_overlap?: number;
    resilience_tier?: string;
  };
}

export interface ExcludedCandidate {
  uid: string;
  name: string;
  rank: string;
  unit: string;
  reason: string;
  readiness: number;
  trend_21d: number;
  sleep_hours_avg: number;
}

export interface CommanderAdvisory {
  headline: string;
  strategic_guidance: string;
  safety_warning?: string | null;
  exclusions_count: number;
  strategic_preserved_count: number;
}

export interface MissionRecommendationResponse {
  mission_type: string;
  criticality: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  required_headcount: number;
  recommended_squad: CandidateAssessment[];
  reserve_candidates: CandidateAssessment[];
  excluded_personnel: ExcludedCandidate[];
  strategic_reserves_preserved: CandidateAssessment[];
  commander_advisory: CommanderAdvisory;
  average_squad_readiness: number;
  timestamp: string;
}

export interface MissionDeploymentRequest {
  mission_type: string;
  unit: string;
  assigned_personnel_uids: string[];
  deployment_location: string;
  start_date: string;
  duration_days: number;
  commander_remarks?: string;
}

export interface DeploymentManifestRosterItem {
  uid: string;
  name: string;
  rank: string;
  role_in_mission: string;
  readiness_at_dispatch: number;
  suitability_score: number;
}

export interface MissionDeploymentManifest {
  manifest_id: string;
  mission_type: string;
  unit: string;
  status: string;
  deployment_location: string;
  start_date: string;
  duration_days: number;
  assigned_roster: DeploymentManifestRosterItem[];
  commander_remarks?: string;
  issued_by: string;
  issued_at: string;
  digital_signature_hash: string;
}

export const missionService = {
  async getMissionTypes(): Promise<MissionTypeInfo[]> {
    const response = await apiClient.get<MissionTypeInfo[]>('/missions/types');
    return response.data;
  },

  async getRecommendations(params: {
    mission_type: string;
    headcount_required: number;
    unit?: string;
    start_date?: string;
    duration_days?: number;
    mission_notes?: string;
  }): Promise<MissionRecommendationResponse> {
    const response = await apiClient.post<MissionRecommendationResponse>('/missions/recommendations', params);
    return response.data;
  },

  async executeDeployment(data: MissionDeploymentRequest): Promise<MissionDeploymentManifest> {
    const response = await apiClient.post<MissionDeploymentManifest>('/missions/deploy', data);
    return response.data;
  },

  async getManifests(): Promise<MissionDeploymentManifest[]> {
    const response = await apiClient.get<MissionDeploymentManifest[]>('/missions/manifests');
    return response.data;
  },
};
