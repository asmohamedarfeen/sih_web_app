import { apiClient } from './apiClient';

export interface AssessmentItem {
  id: number;
  personnel_uid: string;
  personnel_name: string;
  sleep_hours: number;
  fatigue_level: number;
  mood_score: number;
  workload_pressure: number;
  physical_strain: number;
  consecutive_duty_days: number;
  stress_score?: number;
  risk_level?: string;
  notes?: string;
  submitted_at: string;
}

export interface AssessmentSubmission {
  personnel_uid: string;
  sleep_hours: number;
  fatigue_level: number;
  mood_score: number;
  workload_pressure: number;
  physical_strain: number;
  consecutive_duty_days: number;
  notes?: string;
}

export interface AppUsageItem {
  app_name: string;
  category: string;
  duration_minutes: number;
  duration_formatted: string;
  percentage: number;
}

export interface PersonnelScreenTimeRecord {
  personnel_uid: string;
  personnel_name: string;
  rank: string;
  unit: string;
  branch: string;
  total_screen_time_minutes: number;
  total_formatted: string;
  unlock_count: number;
  night_exposure_minutes: number;
  night_exposure_formatted: string;
  fatigue_risk_tag: string;
  last_sync: string;
  device_model?: string;
  app_breakdown: AppUsageItem[];
}

export interface CategoricalDomainScore {
  domain_id: string;
  domain_name: string;
  score: number;
  risk_level: string;
  description?: string;
}

export interface RiskContributor {
  factor: string;
  percentage: number;
}

export interface PersonnelSelfAssessmentRecord {
  id: string;
  personnel_uid: string;
  personnel_name: string;
  rank: string;
  unit: string;
  branch: string;
  overall_wellness_score: number;
  stress_index: number;
  burnout_score: number;
  risk_level: string;
  confidence_score: number;
  assessment_date: string;
  ai_recommendation: string;
  notes?: string;
  categorical_breakdown: CategoricalDomainScore[];
  primary_contributors?: RiskContributor[];
}

export const wellnessService = {
  async getAssessments(personnel_uid?: string): Promise<AssessmentItem[]> {
    const response = await apiClient.get<AssessmentItem[]>('/wellness/assessments', {
      params: personnel_uid ? { personnel_uid } : undefined,
    });
    return response.data;
  },

  async submitAssessment(data: AssessmentSubmission): Promise<any> {
    const response = await apiClient.post('/wellness/assessments', data);
    return response.data;
  },

  async getPeopleScreenTime(): Promise<PersonnelScreenTimeRecord[]> {
    const response = await apiClient.get<PersonnelScreenTimeRecord[]>('/wellness/screen-time');
    return response.data;
  },

  async getSelfAssessments(): Promise<PersonnelSelfAssessmentRecord[]> {
    const response = await apiClient.get<PersonnelSelfAssessmentRecord[]>('/wellness/self-assessment');
    return response.data;
  },

  async getPersonnelSelfAssessment(uid: string): Promise<PersonnelSelfAssessmentRecord> {
    const response = await apiClient.get<PersonnelSelfAssessmentRecord>(`/wellness/self-assessment/${uid}`);
    return response.data;
  },
};


