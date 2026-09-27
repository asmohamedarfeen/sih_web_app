import { apiClient } from './apiClient';

export interface UnitReadinessStatus {
  unit_id: string;
  unit_name: string;
  current_readiness: number;
  status_label: string;
  headcount: number;
  fatigue_index: number;
  burnout_risk: string;
  leave_queue_count: number;
}

export interface BalancingAction {
  id: string;
  action_type: 'TRANSFER' | 'ROTATE' | 'DELAY_LEAVE' | 'ADVANCE_RELIEF';
  title: string;
  description: string;
  source_unit?: string | null;
  target_unit?: string | null;
  quantity: number;
  unit_measure: string;
  impact_summary: string;
  urgency: 'IMMEDIATE' | 'SCHEDULED' | 'TACTICAL';
}

export interface BalancedUnitOutcome {
  unit_id: string;
  unit_name: string;
  initial_readiness: number;
  projected_readiness: number;
  delta: number;
  in_optimal_band: boolean;
  burnout_reduction_pct: number;
}

export interface ForceBalancingPlan {
  plan_id: string;
  created_at: string;
  optimal_band_min: number;
  optimal_band_max: number;
  initial_variance: number;
  projected_variance: number;
  units_initial: UnitReadinessStatus[];
  recommended_actions: BalancingAction[];
  projected_outcomes: BalancedUnitOutcome[];
  executive_summary: string;
  total_personnel_transferred: number;
  total_units_rotated: number;
  leave_delay_days: number;
  relief_advance_days: number;
}

export interface ExecutePlanRequest {
  plan_id: string;
  commander_authorization_code?: string;
  notes?: string;
}

export interface ExecutionReceipt {
  order_id: string;
  plan_id: string;
  status: string;
  executed_at: string;
  commander_authorization_code: string;
  dispatched_actions_count: number;
  units_synchronized: string[];
  message: string;
}

export const forceBalancingService = {
  async getPlan(): Promise<ForceBalancingPlan> {
    const res = await apiClient.get<ForceBalancingPlan>('/force-balancing/plan');
    return res.data;
  },

  async executePlan(payload: ExecutePlanRequest): Promise<ExecutionReceipt> {
    const res = await apiClient.post<ExecutionReceipt>('/force-balancing/execute', payload);
    return res.data;
  },
};
