import { apiClient } from './apiClient';

export interface PersonnelDossierReport {
  form_standard?: string;
  report_id: string;
  statutory_authority?: string;
  legal_classification?: string;
  generated_at: string;
  generated_by: string;
  classification?: string;
  personnel: any;
  operational_readiness: {
    shape_category: string;
    readiness_status: string;
    consecutive_shifts: number;
    stress_index: number;
    burnout_risk: string;
    burnout_probability?: number;
  };
  shap_risk_attribution?: Array<{
    factor: string;
    impact: string;
    metric: string;
    shap_attribution?: number;
  }>;
  clinical_narrative?: {
    narrative_paragraph: string;
    statutory_recommendation: string;
    sparsity_evaluation: any;
  };
  sparsity_index?: {
    adjusted_model_confidence: number;
    fidelity_tier: string;
    clinical_advisory: string;
    missing_days: number;
    logged_days: number;
  };
  counterfactual_projection?: any;
  duty_assignments: any[];
  active_interventions: any[];
  authorized_leaves: any[];
  official_sign_off?: {
    medical_officer: { title: string; statement: string; status: string };
    formation_commander: { title: string; name: string; rank: string; statement: string; status: string };
  };
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
