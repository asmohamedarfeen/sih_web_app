import { apiClient } from './apiClient';

export interface InterventionCase {
  id: number;
  case_number: string;
  personnel_uid: string;
  personnel_name: string;
  rank: string;
  unit: string;
  officer_uid: string;
  counselor_name: string;
  category: string;
  urgency: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ROUTINE';
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';
  title: string;
  description: string;
  action_plan: string;
  requested_amount: number;
  approved_amount: number;
  counseling_date: string;
  venue: string;
  timeline: Array<{ date: string; event: string }>;
  created_at: string;
}

export const interventionService = {
  async getInterventions(status_filter?: string): Promise<InterventionCase[]> {
    const response = await apiClient.get<InterventionCase[]>('/interventions/', {
      params: status_filter ? { status_filter } : undefined,
    });
    return response.data;
  },

  async createIntervention(data: {
    personnel_uid: string;
    category: string;
    urgency: string;
    title: string;
    description?: string;
    action_plan?: string;
    requested_amount?: number;
    counseling_date?: string;
    venue?: string;
  }): Promise<{ status: string; message: string; case: InterventionCase }> {
    const response = await apiClient.post('/interventions/', data);
    return response.data;
  },

  async updateStatus(id: number, status: string, notes?: string): Promise<any> {
    const response = await apiClient.patch(`/interventions/${id}/status`, { status, notes });
    return response.data;
  },
};
