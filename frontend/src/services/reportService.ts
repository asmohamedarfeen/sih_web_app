import { apiClient } from './apiClient';

export interface PersonnelDossierReport {
  report_id: string;
  generated_at: string;
  generated_by: string;
  classification: string;
  personnel: any;
  operational_readiness: {
    shape_category: string;
    readiness_status: string;
    consecutive_shifts: number;
    stress_index: number;
    burnout_risk: string;
  };
  duty_assignments: any[];
  active_interventions: any[];
  authorized_leaves: any[];
}

export interface UnitSummaryReport {
  report_title: string;
  division: string;
  generated_at: string;
  overall_readiness: string;
  total_strength: number;
  high_risk_personnel_count: number;
  kote_armory_secure_pct: string;
  active_cases: number;
  recommendation: string;
}

export const reportService = {
  async getPersonnelDossier(uid: string): Promise<PersonnelDossierReport> {
    const response = await apiClient.get<PersonnelDossierReport>(`/reports/dossier/${uid}`);
    return response.data;
  },

  async getUnitSummary(): Promise<UnitSummaryReport> {
    const response = await apiClient.get<UnitSummaryReport>('/reports/unit-summary');
    return response.data;
  },
};
