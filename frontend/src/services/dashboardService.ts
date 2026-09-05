import { apiClient } from './apiClient';

export interface WelfareDashboardData {
  officer_email: string;
  welfare_circle: string;
  metrics: {
    active_welfare_cases: number;
    critical_cases: number;
    high_risk_personnel_count: number;
    today_counseling_sessions: number;
    monthly_resolved_interventions: number;
    recovery_rate_pct: number;
  };
  high_risk_watchlist: Array<{
    uid: string;
    force_id: string;
    regimental_number: string;
    name: string;
    rank: string;
    unit: string;
    branch: string;
    stress_score: number;
    risk_level: string;
    trigger_factor: string;
    last_checkin: string;
    status: string;
  }>;
  upcoming_sessions: Array<{
    id: string;
    personnel_name: string;
    rank: string;
    category: string;
    urgency: string;
    status: string;
    scheduled_time: string;
    venue: string;
    action_plan: string;
  }>;
  assigned_personnel: Array<any>;
}

export interface CommanderDashboardData {
  commander_email: string;
  command_formation: string;
  metrics: {
    unit_readiness_index: number;
    total_command_strength: number;
    active_deployed_strength: number;
    shape_1_deployable_pct: number;
    high_stress_alerts: number;
    weapons_secured_in_kote: string;
  };
  high_risk_personnel: Array<any>;
  active_duty_rosters: Array<{
    duty_id: string;
    personnel_name: string;
    duty_type: string;
    shift: string;
    location: string;
    weapon_issued: string;
    status: string;
  }>;
  formation_units: Array<{
    unit: string;
    strength: number;
    readiness: number;
    status: string;
  }>;
}

export interface HRDashboardData {
  hr_email: string;
  division: string;
  metrics: {
    total_workforce: number;
    present_today_pct: number;
    on_authorized_leave: number;
    pending_leave_requests: number;
    transfers_in_pipeline: number;
    apar_compliance_pct: number;
  };
  pending_leaves: Array<{
    id: string;
    personnel_name: string;
    rank: string;
    leave_type: string;
    start_date: string;
    end_date: string;
    days: number;
    reason: string;
    status: string;
  }>;
  cadre_distribution: Array<{
    cadre: string;
    count: number;
    percentage: number;
  }>;
  recent_personnel: Array<any>;
}

export interface AdminDashboardData {
  admin_email: string;
  system_node: string;
  metrics: {
    total_personnel_records: number;
    active_monitoring_sessions: number;
    ai_burnout_assessments_today: number;
    critical_security_events: number;
    system_uptime_pct: number;
    hrms_sync_status: string;
  };
  system_health: {
    api_gateway: string;
    database_engine: string;
    ai_inference_pipeline: string;
    audit_logger: string;
  };
  all_personnel: Array<any>;
}

export const dashboardService = {
  async getOverview(): Promise<any> {
    const response = await apiClient.get('/dashboard/overview');
    return response.data;
  },

  async getWelfareDashboard(): Promise<WelfareDashboardData> {
    const response = await apiClient.get<WelfareDashboardData>('/dashboard/welfare');
    return response.data;
  },

  async getCommanderDashboard(): Promise<CommanderDashboardData> {
    const response = await apiClient.get<CommanderDashboardData>('/dashboard/commander');
    return response.data;
  },

  async getHRDashboard(): Promise<HRDashboardData> {
    const response = await apiClient.get<HRDashboardData>('/dashboard/hr');
    return response.data;
  },

  async getAdminDashboard(): Promise<AdminDashboardData> {
    const response = await apiClient.get<AdminDashboardData>('/dashboard/admin');
    return response.data;
  },
};
