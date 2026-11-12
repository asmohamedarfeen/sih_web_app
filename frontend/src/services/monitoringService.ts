import { apiClient } from './apiClient';

export interface ModelHealth {
  status: 'HEALTHY' | 'WARNING' | 'CRITICAL';
  model_version: string;
  architecture: string;
  overall_psi: number;
  drift_classification: 'HEALTHY_STABLE' | 'MODERATE_SHIFT' | 'CRITICAL_DRIFT';
  p50_latency_ms: number;
  p95_latency_ms: number;
  p99_latency_ms: number;
  inference_throughput_rps: number;
  telemetry_sparsity_rate: number;
  alert_false_positive_rate: number;
  confidence_calibration_brier_score: number;
  last_evaluated_at: string;
}

export interface FeatureDriftItem {
  feature_name: string;
  psi_score: number;
  status: 'HEALTHY_STABLE' | 'MODERATE_SHIFT' | 'CRITICAL_DRIFT';
  baseline_mean: number;
  live_mean: number;
  ks_p_value: number;
  drift_alert: boolean;
  note?: string;
}

export interface DriftReport {
  prediction_drift_psi: number;
  prediction_drift_status: string;
  baseline_distribution: Record<string, number>;
  live_distribution: Record<string, number>;
  feature_drifts: FeatureDriftItem[];
  recommendation: string;
}

export interface TelemetryQuality {
  average_sparsity_rate: number;
  sparsity_trend_7d: number[];
  stream_reliability: Array<{ stream: string; completion_rate: number; status: string }>;
  imputation_distribution: Record<string, number>;
  resilience_assurance: string;
}

export interface SubgroupMetricItem {
  subgroup_name: string;
  sample_count: number;
  tp: number;
  fp: number;
  tn: number;
  fn: number;
  false_positive_rate: number;
  false_discovery_rate: number;
  true_positive_rate: number;
  specificity: number;
  precision: number;
  f1_score: number;
  accuracy: number;
  selection_rate: number;
  disparate_impact_ratio: number;
  equalized_odds_diff: number;
  fairness_status: string;
}

export interface ModelLimitationItem {
  id: string;
  title: string;
  category: string;
  severity: 'HIGH' | 'CRITICAL' | 'MEDIUM' | 'LOW';
  description: string;
  operational_boundary: string;
  mitigation_protocol: string;
}

export interface FairnessEvaluationResponse {
  cohort_summary: {
    total_samples: number;
    data_source: string;
    validation_framework: string;
    positive_label_definition: string;
  };
  global_metrics: {
    sample_count: number;
    false_positive_rate: number;
    false_discovery_rate: number;
    true_positive_rate: number;
    specificity: number;
    precision: number;
    f1_score: number;
    accuracy: number;
    roc_auc: number;
    pr_auc: number;
  };
  subgroup_breakdowns: {
    by_rank: SubgroupMetricItem[];
    by_terrain: SubgroupMetricItem[];
    by_gender: SubgroupMetricItem[];
    by_age: SubgroupMetricItem[];
  };
  model_limitations: ModelLimitationItem[];
  evaluation_verdict: {
    status: string;
    false_positive_risk: string;
    subgroup_parity: string;
  };
}

export const monitoringService = {
  async getHealth(): Promise<ModelHealth> {
    const response = await apiClient.get<ModelHealth>('/monitoring/health');
    return response.data;
  },

  async getDrift(): Promise<DriftReport> {
    const response = await apiClient.get<DriftReport>('/monitoring/drift');
    return response.data;
  },

  async getTelemetryQuality(): Promise<TelemetryQuality> {
    const response = await apiClient.get<TelemetryQuality>('/monitoring/telemetry');
    return response.data;
  },

  async getFairnessEvaluation(sample_size: number = 2000): Promise<FairnessEvaluationResponse> {
    const response = await apiClient.get<FairnessEvaluationResponse>('/monitoring/fairness', {
      params: { sample_size }
    });
    return response.data;
  }
};
