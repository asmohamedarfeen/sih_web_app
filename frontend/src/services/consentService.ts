import { apiClient } from './apiClient';

export interface ConsentPreferences {
  personnel_uid: string;
  self_assessment: boolean;
  duty_roster_telemetry: boolean;
  biometrics_wearable: boolean;
  ai_longitudinal_profiling: boolean;
  version: string;
  last_updated_at: string;
}

export interface ConsentAuditLog {
  id: number;
  personnel_uid: string;
  action: string;
  scope_snapshot: Record<string, boolean>;
  actor_name: string;
  reason?: string;
  audit_hash: string;
  timestamp: string;
}

export interface ConsentStreamInfo {
  stream_id: string;
  name: string;
  description: string;
  is_active: boolean;
  retention_policy: string;
  encryption: string;
  privileged_recipients: string[];
}

export interface ConsentDataFlowMap {
  personnel_uid: string;
  governance_standard: string;
  streams: ConsentStreamInfo[];
}

export const consentService = {
  async getPreferences(personnel_uid?: string): Promise<ConsentPreferences> {
    const response = await apiClient.get<ConsentPreferences>('/consent/preferences', {
      params: personnel_uid ? { personnel_uid } : undefined
    });
    return response.data;
  },

  async updatePreferences(payload: {
    self_assessment: boolean;
    duty_roster_telemetry: boolean;
    biometrics_wearable: boolean;
    ai_longitudinal_profiling: boolean;
    consent_reason?: string;
  }): Promise<ConsentPreferences> {
    const response = await apiClient.post<ConsentPreferences>('/consent/preferences', payload);
    return response.data;
  },

  async getAuditLog(personnel_uid?: string): Promise<ConsentAuditLog[]> {
    const response = await apiClient.get<ConsentAuditLog[]>('/consent/audit-log', {
      params: personnel_uid ? { personnel_uid } : undefined
    });
    return response.data;
  },

  async getDataFlow(): Promise<ConsentDataFlowMap> {
    const response = await apiClient.get<ConsentDataFlowMap>('/consent/data-flow');
    return response.data;
  }
};
