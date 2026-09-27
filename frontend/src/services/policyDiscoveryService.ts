import { apiClient } from './apiClient';

export interface EmpiricalDiscovery {
  id: string;
  domain: string;
  domain_label: string;
  trigger_condition: string;
  empirical_impact: string;
  affected_metric: string;
  impact_percentage: number;
  direction: 'UP' | 'DOWN';
  confidence_score: number;
  p_value: number;
  sample_size: number;
  policy_recommendation: string;
  suggested_order_code: string;
  unprogrammed_discovery_badge: string;
  actionable_directive_draft: string;
}

export interface MiningScanResponse {
  total_records_analyzed: number;
  data_timespan: string;
  scan_timestamp: string;
  correlations_evaluated: number;
  newly_verified_discoveries: EmpiricalDiscovery[];
}

export interface DraftDirectiveRequest {
  discovery_id: string;
  commander_remarks?: string;
}

export interface PolicyDirectiveResponse {
  directive_code: string;
  title: string;
  discovery_id: string;
  policy_directive_text: string;
  commander_remarks: string;
  authorizing_commander: string;
  status: string;
  issued_at: string;
  empirical_evidence: {
    trigger_condition: string;
    measured_impact: string;
    statistical_confidence: string;
    suggested_order_code: string;
  };
}

export const policyDiscoveryService = {
  async getDiscoveries(): Promise<EmpiricalDiscovery[]> {
    const res = await apiClient.get<EmpiricalDiscovery[]>('/policy-discovery/discoveries');
    return res.data;
  },

  async runMiningScan(domainFilter?: string): Promise<MiningScanResponse> {
    const res = await apiClient.post<MiningScanResponse>(
      '/policy-discovery/run-mining-scan',
      null,
      { params: domainFilter ? { domain_filter: domainFilter } : {} }
    );
    return res.data;
  },

  async draftDirective(payload: DraftDirectiveRequest): Promise<PolicyDirectiveResponse> {
    const res = await apiClient.post<PolicyDirectiveResponse>(
      '/policy-discovery/draft-directive',
      payload
    );
    return res.data;
  },
};
