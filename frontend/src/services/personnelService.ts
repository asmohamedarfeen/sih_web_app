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

export const personnelService = {
  async getPersonnelList(params?: { search?: string; unit?: string; risk_level?: string }): Promise<PersonnelRecord[]> {
    const response = await apiClient.get<PersonnelRecord[]>('/personnel/', { params });
    return response.data;
  },

  async getPersonnelDossier(uid: string): Promise<PersonnelRecord> {
    const response = await apiClient.get<PersonnelRecord>(`/personnel/${uid}`);
    return response.data;
  },
};
