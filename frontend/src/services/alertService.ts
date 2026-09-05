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
  created_at: string;
}

export const alertService = {
  async getAlerts(params?: { severity?: string; unacknowledged_only?: boolean }): Promise<AlertItem[]> {
    const response = await apiClient.get<AlertItem[]>('/alerts/', { params });
    return response.data;
  },

  async acknowledgeAlert(id: number): Promise<any> {
    const response = await apiClient.post(`/alerts/${id}/acknowledge`);
    return response.data;
  },
};
