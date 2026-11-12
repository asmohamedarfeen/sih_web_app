import { apiClient } from './apiClient';

export interface AlertItem {
  id: number;
  personnel_uid: string;
  personnel_name: string;
  rank: string;
  unit: string;
  alert_type: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  trigger_reason: string;
  recommendation: string;
  is_acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  review_status?: 'PENDING_REVIEW' | 'UNDER_REVIEW' | 'VALIDATED_ACTIONABLE' | 'DISMISSED_FALSE_POSITIVE' | 'ESCALATED_TO_MEDICAL' | 'WELFARE_INTERVENTION_SCHEDULED';
  severity_override?: string;
  is_false_positive?: boolean;
  false_positive_reason?: string;
  clinical_notes?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface AlertReviewPayload {
  review_status: string;
  severity_override?: string;
  is_false_positive: boolean;
  false_positive_reason?: string;
  clinical_notes: string;
}

export interface AlertReviewAudit {
  id: number;
  alert_id: number;
  reviewer_uid: string;
  reviewer_name: string;
  reviewer_role: string;
  previous_status: string;
  new_status: string;
  severity_override?: string;
  is_false_positive: boolean;
  false_positive_reason?: string;
  clinical_notes?: string;
  created_at: string;
}

export interface AlertTriageSummary {
  total_alerts: number;
  pending_review_count: number;
  validated_actionable_count: number;
  false_positive_count: number;
  false_positive_rate: number;
  status_breakdown: Record<string, number>;
  false_positive_reasons_breakdown: Record<string, number>;
}

export const alertService = {
  async getAlerts(params?: { severity?: string; unacknowledged_only?: boolean; review_status?: string }): Promise<AlertItem[]> {
    const response = await apiClient.get<AlertItem[]>('/alerts/', { params });
    return response.data;
  },

  async acknowledgeAlert(id: number): Promise<any> {
    const response = await apiClient.post(`/alerts/${id}/acknowledge`);
    return response.data;
  },

  async submitReview(id: number, payload: AlertReviewPayload): Promise<any> {
    const response = await apiClient.post(`/alerts/${id}/review`, payload);
    return response.data;
  },

  async getReviewHistory(id: number): Promise<AlertReviewAudit[]> {
    const response = await apiClient.get<AlertReviewAudit[]>(`/alerts/${id}/review-history`);
    return response.data;
  },

  async getTriageSummary(): Promise<AlertTriageSummary> {
    const response = await apiClient.get<AlertTriageSummary>('/alerts/triage-summary');
    return response.data;
  }
};
