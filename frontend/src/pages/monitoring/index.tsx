import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  Gauge,
  Sliders,
  Scale,
  Shield,
  Lock,
  Info
} from 'lucide-react';
import {
  monitoringService,
  ModelHealth,
  DriftReport,
  TelemetryQuality,
  FairnessEvaluationResponse
} from '../../services/monitoringService';
import { consentService, ConsentDataFlowMap, ConsentPreferences } from '../../services/consentService';

export const MonitoringPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'health' | 'drift' | 'fairness' | 'consent'>('fairness');
  const [health, setHealth] = useState<ModelHealth | null>(null);
  const [drift, setDrift] = useState<DriftReport | null>(null);
  const [telemetry, setTelemetry] = useState<TelemetryQuality | null>(null);
  const [fairness, setFairness] = useState<FairnessEvaluationResponse | null>(null);
  const [dataFlow, setDataFlow] = useState<ConsentDataFlowMap | null>(null);
  const [userConsent, setUserConsent] = useState<ConsentPreferences | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [subgroupCategory, setSubgroupCategory] = useState<'by_rank' | 'by_terrain' | 'by_gender' | 'by_age'>('by_rank');

  const fetchAllMonitoringData = async () => {
    setIsLoading(true);
    try {
      const [hData, dData, tData, fData, flowData, cData] = await Promise.all([
        monitoringService.getHealth(),
        monitoringService.getDrift(),
        monitoringService.getTelemetryQuality(),
        monitoringService.getFairnessEvaluation(2500),
        consentService.getDataFlow(),
        consentService.getPreferences()
      ]);
      setHealth(hData);
      setDrift(dData);
      setTelemetry(tData);
      setFairness(fData);
      setDataFlow(flowData);
      setUserConsent(cData);
    } catch (err) {
      console.error('Failed to load monitoring analytics:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAllMonitoringData();
  }, []);

  const handleToggleConsent = async (scope: keyof ConsentPreferences) => {
    if (!userConsent) return;
    const updated = {
      ...userConsent,
      [scope]: !userConsent[scope]
    };
    try {
      const res = await consentService.updatePreferences({
        self_assessment: updated.self_assessment,
        duty_roster_telemetry: updated.duty_roster_telemetry,
        biometrics_wearable: updated.biometrics_wearable,
        ai_longitudinal_profiling: updated.ai_longitudinal_profiling,
        consent_reason: 'Updated in Model Observability & Governance Console'
      });
      setUserConsent(res);
      const flow = await consentService.getDataFlow();
      setDataFlow(flow);
    } catch (err) {
      console.error('Failed to update consent:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Executive Command Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-primary-50 text-primary-700 border border-primary-200 shadow-sm">
                MLOps & Ethical AI Governance
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">• Population Stability Index & Fairness Benchmarks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Model Observability & Subgroup Evaluation Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Continuous monitoring of XGBoost inference telemetry, Population Stability Index (PSI) drift, missing-data imputation fidelity, and disaggregated subgroup fairness across armed forces cohorts.
            </p>
          </div>

          <button
            onClick={fetchAllMonitoringData}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 text-primary-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Recalibrate Metrics</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2 overflow-x-auto">
        {[
          { key: 'fairness', label: 'Subgroup Fairness & Limitations', icon: Scale },
          { key: 'health', label: 'Model Health & Telemetry', icon: Gauge },
          { key: 'drift', label: 'Feature Drift (PSI Analysis)', icon: Sliders },
          { key: 'consent', label: 'Consent-Based Data Flow', icon: Shield },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
              activeTab === tab.key
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: SUBGROUP FAIRNESS, FPR & MODEL LIMITATIONS */}
      {activeTab === 'fairness' && fairness && (
        <div className="space-y-6">
          {/* Global Fairness Metrics Card */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Consented / Synthetic Cohort Validation
                </span>
                <h2 className="text-xl font-black text-gray-900 mt-2">
                  Global Performance & False-Positive Bounds (N = {fairness.cohort_summary.total_samples.toLocaleString()})
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evaluation on representative military personnel across combat arms, high-altitude posts, and support services.
                </p>
              </div>

              <div className="px-4 py-2 rounded-2xl bg-slate-900 text-white text-xs font-bold flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Verdict: {fairness.evaluation_verdict.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-indigo-50/70 border border-indigo-200">
                <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">False Positive Rate (FPR)</span>
                <div className="text-2xl font-black text-indigo-950 mt-1">
                  {(fairness.global_metrics.false_positive_rate * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-indigo-600 font-mono font-medium">FP / (FP + TN)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider block">False Discovery Rate</span>
                <div className="text-2xl font-black text-amber-950 mt-1">
                  {(fairness.global_metrics.false_discovery_rate * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-amber-600 font-mono font-medium">FP / (FP + TP)</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200">
                <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">Sensitivity (Recall)</span>
                <div className="text-2xl font-black text-emerald-950 mt-1">
                  {(fairness.global_metrics.true_positive_rate * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-emerald-600 font-mono font-medium">True Positive Rate</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Specificity</span>
                <div className="text-2xl font-black text-slate-800 mt-1">
                  {(fairness.global_metrics.specificity * 100).toFixed(1)}%
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-medium">True Negative Rate</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">ROC - AUC</span>
                <div className="text-2xl font-black text-slate-800 mt-1">
                  {fairness.global_metrics.roc_auc.toFixed(3)}
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-medium">Discriminative Power</span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">F1 - Score</span>
                <div className="text-2xl font-black text-slate-800 mt-1">
                  {fairness.global_metrics.f1_score.toFixed(3)}
                </div>
                <span className="text-[10px] text-slate-400 font-mono font-medium">Harmonic Mean</span>
              </div>
            </div>
          </div>

          {/* Disaggregated Subgroup Breakdowns */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-lg font-black text-gray-900">Disaggregated Subgroup Fairness Breakdown</h3>
                <p className="text-xs text-slate-500">
                  Verifying equalized odds and absence of disparate impact across ranks, terrains, and demographics.
                </p>
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 border border-slate-200 self-start">
                {[
                  { key: 'by_rank', label: 'Military Ranks' },
                  { key: 'by_terrain', label: 'Deployment Terrains' },
                  { key: 'by_gender', label: 'Gender Cohorts' },
                  { key: 'by_age', label: 'Age Brackets' }
                ].map((s) => (
                  <button
                    key={s.key}
                    onClick={() => setSubgroupCategory(s.key as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      subgroupCategory === s.key ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Subgroup Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Subgroup Slice</th>
                    <th className="py-3 px-4">Cohort Size</th>
                    <th className="py-3 px-4">False Positive Rate (FPR)</th>
                    <th className="py-3 px-4">Recall (TPR)</th>
                    <th className="py-3 px-4">Precision</th>
                    <th className="py-3 px-4">Disparate Impact Ratio</th>
                    <th className="py-3 px-4">Equalized Odds Diff</th>
                    <th className="py-3 px-4 text-right">Fairness Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fairness.subgroup_breakdowns[subgroupCategory].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-gray-900">{row.subgroup_name}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">{row.sample_count}</td>
                      <td className="py-3.5 px-4 font-mono font-bold text-indigo-700">
                        {(row.false_positive_rate * 100).toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-emerald-700">
                        {(row.true_positive_rate * 100).toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {(row.precision * 100).toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                        {row.disparate_impact_ratio.toFixed(2)}x
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        Δ {row.equalized_odds_diff.toFixed(3)}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {row.fairness_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Model Limitations & Governance Dossier */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
            <div className="flex items-center gap-2">
              <Info className="w-5 h-5 text-amber-600" />
              <div>
                <h3 className="text-lg font-black text-gray-900">Operational Boundaries & Documented Limitations</h3>
                <p className="text-xs text-slate-500">
                  Mandatory AI ethics disclosure governing operational employment in armed forces deployments.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {fairness.model_limitations.map((lim) => (
                <div key={lim.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold text-slate-500">{lim.id} • {lim.category}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                      lim.severity === 'CRITICAL' ? 'bg-danger-100 text-danger-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {lim.severity} Bound
                    </span>
                  </div>

                  <h4 className="font-extrabold text-sm text-gray-900">{lim.title}</h4>
                  <p className="text-xs text-gray-700 leading-relaxed font-medium">{lim.description}</p>
                  
                  <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[11px]">
                    <div className="text-slate-600">
                      <span className="font-bold text-slate-800">Operational Boundary:</span> {lim.operational_boundary}
                    </div>
                    <div className="text-emerald-700 font-medium">
                      <span className="font-bold text-emerald-900">Enforced Mitigation:</span> {lim.mitigation_protocol}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MODEL HEALTH & TELEMETRY */}
      {activeTab === 'health' && health && telemetry && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Production Architecture</span>
              <div className="text-lg font-black text-gray-900">{health.model_version}</div>
              <p className="text-xs text-slate-500">{health.architecture}</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Inference Latency Profile</span>
              <div className="text-lg font-black text-gray-900">{health.p95_latency_ms} ms (p95)</div>
              <p className="text-xs text-slate-500">p50: {health.p50_latency_ms} ms | p99: {health.p99_latency_ms} ms</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Telemetry Sparsity Rate</span>
              <div className="text-lg font-black text-amber-700">{(health.telemetry_sparsity_rate * 100).toFixed(1)}%</div>
              <p className="text-xs text-slate-500">Imputed via MissingDataEngine</p>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-1">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Live Alert False-Positive Rate</span>
              <div className="text-lg font-black text-emerald-700">{(health.alert_false_positive_rate * 100).toFixed(1)}%</div>
              <p className="text-xs text-slate-500">From verified clinical reviews</p>
            </div>
          </div>

          {/* Sensor Stream Reliability */}
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
            <h3 className="text-lg font-black text-gray-900">Multi-Modal Telemetry Stream Reliability</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {telemetry.stream_reliability.map((st, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-gray-900">{st.stream}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {st.status}
                    </span>
                  </div>
                  <div className="flex items-baseline justify-between text-xs">
                    <span className="text-slate-500">Completion:</span>
                    <span className="font-mono font-black text-slate-800">{st.completion_rate}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: `${st.completion_rate}%` }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{telemetry.resilience_assurance}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FEATURE DRIFT & PSI ANALYSIS */}
      {activeTab === 'drift' && drift && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">Population Stability Index (PSI) Drift Monitor</h3>
                <p className="text-xs text-slate-500">
                  Tracking statistical distribution divergence between training population and live operational deployments.
                </p>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-mono font-bold">
                Overall PSI: {drift.prediction_drift_psi.toFixed(4)} ({drift.prediction_drift_status})
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-extrabold text-slate-600 uppercase tracking-wider">
                    <th className="py-3 px-4">Feature Name</th>
                    <th className="py-3 px-4">Baseline Mean</th>
                    <th className="py-3 px-4">Live Operational Mean</th>
                    <th className="py-3 px-4">PSI Score</th>
                    <th className="py-3 px-4">KS-Test p-Value</th>
                    <th className="py-3 px-4 text-right">Drift Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {drift.feature_drifts.map((f, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4 font-mono font-bold text-gray-900">{f.feature_name}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{f.baseline_mean}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{f.live_mean}</td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">{f.psi_score.toFixed(3)}</td>
                      <td className="py-3 px-4 font-mono text-slate-600">{f.ks_p_value.toFixed(2)}</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          f.status === 'HEALTHY_STABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {f.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONSENT-BASED DATA FLOW & GOVERNANCE */}
      {activeTab === 'consent' && dataFlow && userConsent && (
        <div className="space-y-6">
          <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-4">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200">
                DPDP & Military Ethics Protocol
              </span>
              <h3 className="text-lg font-black text-gray-900 mt-2">Consent-Gated Data Ingestion Pipeline</h3>
              <p className="text-xs text-slate-500">
                Soldiers maintain absolute ownership over psychological, biometric, and longitudinal digital twin data streams.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {dataFlow.streams.map((st) => (
                <div key={st.stream_id} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary-600" />
                      <h4 className="font-extrabold text-sm text-gray-900">{st.name}</h4>
                    </div>
                    <button
                      onClick={() => handleToggleConsent(st.stream_id as any)}
                      className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                        st.is_active
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                          : 'bg-slate-300 hover:bg-slate-400 text-slate-800'
                      }`}
                    >
                      {st.is_active ? 'Consent Granted' : 'Stream Revoked'}
                    </button>
                  </div>

                  <p className="text-xs text-gray-700 font-medium">{st.description}</p>

                  <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[11px] text-slate-600">
                    <div><span className="font-bold">Encryption:</span> {st.encryption}</div>
                    <div><span className="font-bold">Retention Policy:</span> {st.retention_policy}</div>
                    <div><span className="font-bold">Authorized Recipients:</span> {st.privileged_recipients.join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringPage;
