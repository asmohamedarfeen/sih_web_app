import { apiClient } from './apiClient';
import { RiskForecastResult } from '../types/riskForecasting';
import { BehavioralChangeResult } from '../types/behavioralChange';

export interface PersonnelRecord {
  uid: string;
  force_id: string;
  regimental_number: string;
  name: string;
  rank: string;
  role: string;
  email: string;
  unit: string;
  branch: string;
  counselor_assigned: string;
  stress_score: number;
  risk_level: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
  medical_category: string;
  consecutive_duty_days: number;
  sleep_hours: number;
  fatigue_level: number;
  trigger_factor: string;
  last_checkin: string;
  status: string;
  duty_shifts?: any[];
  welfare_history?: any[];
  leave_history?: any[];
  risk_forecast?: RiskForecastResult;
  behavioral_change?: BehavioralChangeResult;
}

export interface AccessLogEntry {
  timestamp: string;
  target_uid: string;
  accessor_name: string;
  accessor_role: string;
  accessor_unit: string;
  access_scope: string;
  data_redactions: string[];
  reason: string;
  integrity_sha256: string;
  status: string;
}

export interface TrustLedgerResponse {
  personnel_uid: string;
  audit_standard: string;
  cryptographic_algorithm: string;
  confidentiality_firewall_status: string;
  unauthorized_access_attempts: number;
  total_verified_inspections: number;
  article_42a_protection: {
    directive: string;
    safe_harbor_statute: string;
    legal_guarantee: string;
    penalty_for_breach: string;
  };
  confidentiality_firewall_rules: {
    command_scope: string;
    medical_scope: string;
    personnel_scope: string;
  };
  access_logs: AccessLogEntry[];
}

export const personnelService = {
  async getPersonnelList(params?: { search?: string; unit?: string; risk_level?: string }): Promise<PersonnelRecord[]> {
    const response = await apiClient.get<PersonnelRecord[]>('/personnel/', { params });
    return response.data;
  },

  async getPersonnelDossier(uid: string): Promise<PersonnelRecord> {
    const response = await apiClient.get<PersonnelRecord>(`/personnel/${uid}`);
    return response.data;
  },

  async getTrustLedger(uid: string): Promise<TrustLedgerResponse> {
    const response = await apiClient.get<TrustLedgerResponse>(`/personnel/${uid}/trust-ledger`);
    return response.data;
  },

  async executeRosterSwap(sourcePersonnelUid: string, targetPersonnelUid: string, reason?: string): Promise<any> {
    const response = await apiClient.post('/personnel/roster-swap', {
      source_personnel_uid: sourcePersonnelUid,
      target_personnel_uid: targetPersonnelUid,
      reason: reason || 'Tactical Fatigue De-escalation & Stand-Down Rotation'
    });
    return response.data;
  },
};


