import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  RefreshCw,
  AlertTriangle,
  ShieldAlert,
  ClipboardCheck,
  XCircle,
  UserCheck,
  Stethoscope,
  Filter,
  Activity,
  History,
  X
} from 'lucide-react';
import { alertService, AlertItem, AlertTriageSummary, AlertReviewPayload } from '../../services/alertService';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [triageSummary, setTriageSummary] = useState<AlertTriageSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'PENDING_REVIEW' | 'VALIDATED_ACTIONABLE' | 'DISMISSED_FALSE_POSITIVE'>('ALL');
  
  // Triage Modal state
  const [selectedAlert, setSelectedAlert] = useState<AlertItem | null>(null);
  const [reviewStatus, setReviewStatus] = useState<string>('VALIDATED_ACTIONABLE');
  const [severityOverride, setSeverityOverride] = useState<string>('');
  const [isFalsePositive, setIsFalsePositive] = useState<boolean>(false);
  const [falsePositiveReason, setFalsePositiveReason] = useState<string>('ACUTE_MISSION_EXERTION');
  const [clinicalNotes, setClinicalNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [reviewHistory, setReviewHistory] = useState<any[]>([]);

  const fetchAlertsAndSummary = async () => {
    setIsLoading(true);
    try {
      const [alertData, summaryData] = await Promise.all([
        alertService.getAlerts(activeFilter !== 'ALL' ? { review_status: activeFilter } : undefined),
        alertService.getTriageSummary()
      ]);
      setAlerts(alertData);
      setTriageSummary(summaryData);
    } catch (err) {
      console.error('Failed to load alerts data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertsAndSummary();
  }, [activeFilter]);

  const handleOpenTriage = async (alert: AlertItem) => {
    setSelectedAlert(alert);
    setReviewStatus(alert.review_status && alert.review_status !== 'PENDING_REVIEW' ? alert.review_status : 'VALIDATED_ACTIONABLE');
    setSeverityOverride(alert.severity_override || alert.severity);
    setIsFalsePositive(alert.is_false_positive || false);
    setFalsePositiveReason(alert.false_positive_reason || 'ACUTE_MISSION_EXERTION');
    setClinicalNotes(alert.clinical_notes || '');
    
    try {
      const history = await alertService.getReviewHistory(alert.id);
      setReviewHistory(history);
    } catch (err) {
      setReviewHistory([]);
    }
  };

  const handleSubmitReview = async () => {
    if (!selectedAlert || !clinicalNotes.trim()) {
      alert('Please provide clinical notes / review rationale.');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: AlertReviewPayload = {
        review_status: isFalsePositive ? 'DISMISSED_FALSE_POSITIVE' : reviewStatus,
        severity_override: severityOverride || undefined,
        is_false_positive: isFalsePositive,
        false_positive_reason: isFalsePositive ? falsePositiveReason : undefined,
        clinical_notes: clinicalNotes
      };

      await alertService.submitReview(selectedAlert.id, payload);
      setSelectedAlert(null);
      await fetchAlertsAndSummary();
    } catch (err) {
      console.error('Failed to submit clinical review:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-danger-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-danger-50 text-danger-700 border border-danger-200 shadow-sm">
                Human-in-the-Loop Triage Console
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">• Clinical Review & False-Positive Mitigation</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Tactical Alert & Review Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Real-time physiological alerts, consecutive shift fatigue warnings, and mandatory clinical human review triage to prevent stigmatization.
            </p>
          </div>

          <button
            onClick={fetchAlertsAndSummary}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 text-danger ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* KPI Triage Metrics Strip */}
      {triageSummary && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Alerts</span>
            <div className="text-2xl font-black text-gray-900 mt-1">{triageSummary.total_alerts}</div>
            <span className="text-[10px] text-slate-400 font-mono font-medium">Logged system events</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 shadow-sm">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              Pending Review
            </span>
            <div className="text-2xl font-black text-amber-900 mt-1">{triageSummary.pending_review_count}</div>
            <span className="text-[10px] text-amber-700 font-mono font-medium">Requires officer triage</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block flex items-center gap-1.5">
              <ClipboardCheck className="w-3.5 h-3.5 text-emerald-600" />
              Actionable Validated
            </span>
            <div className="text-2xl font-black text-emerald-900 mt-1">{triageSummary.validated_actionable_count}</div>
            <span className="text-[10px] text-emerald-700 font-mono font-medium">Welfare action queued</span>
          </div>

          <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 shadow-sm">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-indigo-600" />
              False Positives
            </span>
            <div className="text-2xl font-black text-indigo-900 mt-1">{triageSummary.false_positive_count}</div>
            <span className="text-[10px] text-indigo-700 font-mono font-medium">Dismissed via clinical path</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-sm">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              False-Positive Rate
            </span>
            <div className="text-2xl font-black text-white mt-1">
              {(triageSummary.false_positive_rate * 100).toFixed(1)}%
            </div>
            <span className="text-[10px] text-emerald-400 font-mono font-medium">Target &lt; 10% (Nominal)</span>
          </div>
        </div>
      )}

      {/* Review Status Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-slate-500 flex items-center gap-1 mr-1">
          <Filter className="w-3.5 h-3.5" /> Filter:
        </span>
        {[
          { key: 'ALL', label: 'All Alerts' },
          { key: 'PENDING_REVIEW', label: 'Pending Human Review' },
          { key: 'VALIDATED_ACTIONABLE', label: 'Validated Actionable' },
          { key: 'DISMISSED_FALSE_POSITIVE', label: 'Dismissed False-Positives' },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              activeFilter === tab.key
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3.5">
        {alerts.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
            <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <h3 className="font-bold text-gray-800 text-base">No Alerts in this Category</h3>
            <p className="text-xs text-slate-500 mt-1">All tactical personnel are within balanced operational thresholds.</p>
          </div>
        ) : (
          alerts.map((a) => {
            const isPending = !a.review_status || a.review_status === 'PENDING_REVIEW';
            const isFP = a.is_false_positive || a.review_status === 'DISMISSED_FALSE_POSITIVE';
            
            return (
              <div
                key={a.id}
                className={`p-5 rounded-3xl bg-white border ${
                  isFP ? 'border-slate-200 opacity-80 bg-slate-50/50' : isPending ? 'border-amber-300 shadow-card-soft' : 'border-slate-200'
                } flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all`}
              >
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                      a.severity === 'CRITICAL' ? 'bg-danger-100 text-danger-800 border-danger-300' : 'bg-warning-100 text-warning-800 border-warning-300'
                    }`}>
                      {a.severity_override || a.severity}
                    </span>

                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                      isPending
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : isFP
                        ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                        : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    }`}>
                      {isPending ? 'Pending Clinical Review' : isFP ? 'False-Positive Dismissed' : a.review_status?.replace(/_/g, ' ')}
                    </span>

                    <span className="font-extrabold text-sm text-gray-900">{a.personnel_name}</span>
                    <span className="text-xs font-mono text-slate-400 font-bold">{a.personnel_uid}</span>
                    {a.unit && <span className="text-xs text-slate-500 font-semibold">• {a.unit}</span>}
                  </div>

                  <p className="text-xs text-gray-800 font-semibold">{a.trigger_reason}</p>
                  
                  {a.recommendation && (
                    <p className="text-xs text-slate-500 font-medium">Recommendation: {a.recommendation}</p>
                  )}

                  {a.clinical_notes && (
                    <div className="p-2.5 rounded-xl bg-slate-100 border border-slate-200/80 text-xs text-slate-700 flex items-start gap-2">
                      <Stethoscope className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">Clinical Review Verdict ({a.reviewed_by}):</span>{' '}
                        <span>{a.clinical_notes}</span>
                        {a.false_positive_reason && (
                          <span className="block mt-0.5 text-[10px] font-mono text-indigo-700 font-bold">
                            Root Cause: {a.false_positive_reason.replace(/_/g, ' ')}
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="shrink-0 flex items-center gap-2 self-start md:self-center">
                  <button
                    onClick={() => handleOpenTriage(a)}
                    className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-primary-400" />
                    <span>{isPending ? 'Conduct Human Review' : 'Update Review'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Clinical Review Triage Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-danger" />
                <h3 className="text-lg font-black text-gray-900">Clinical Triage & Review Path</h3>
              </div>
              <button
                onClick={() => setSelectedAlert(null)}
                className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Alert Context */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-extrabold text-sm text-gray-900">{selectedAlert.personnel_name}</span>
                <span className="text-xs font-mono font-bold text-slate-500">{selectedAlert.personnel_uid}</span>
              </div>
              <p className="text-xs text-gray-700 font-medium">{selectedAlert.trigger_reason}</p>
              <div className="text-[11px] text-slate-500">Unit: {selectedAlert.unit || 'Tactical Squad'} | Severity: {selectedAlert.severity}</div>
            </div>

            {/* Review Form */}
            <div className="space-y-4">
              {/* Disposition Selector */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1.5">
                  Clinical Disposition / Action
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: 'VALIDATED_ACTIONABLE', label: 'Actionable Stress', icon: ClipboardCheck },
                    { key: 'ESCALATED_TO_MEDICAL', label: 'Medical Referral', icon: Stethoscope },
                    { key: 'WELFARE_INTERVENTION_SCHEDULED', label: 'Welfare Outreach', icon: UserCheck },
                    { key: 'DISMISSED_FALSE_POSITIVE', label: 'Dismiss as False Alarm', icon: XCircle },
                  ].map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setReviewStatus(item.key);
                        setIsFalsePositive(item.key === 'DISMISSED_FALSE_POSITIVE');
                      }}
                      className={`p-2.5 rounded-xl text-xs font-bold text-left border flex items-center gap-2 cursor-pointer transition-all ${
                        (isFalsePositive && item.key === 'DISMISSED_FALSE_POSITIVE') || (!isFalsePositive && reviewStatus === item.key)
                          ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <item.icon className="w-4 h-4 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* False Positive Root Cause Dropdown */}
              {isFalsePositive && (
                <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-200 space-y-2">
                  <label className="text-xs font-bold text-indigo-950 block">
                    False-Positive Categorization (for Model Calibration)
                  </label>
                  <select
                    value={falsePositiveReason}
                    onChange={(e) => setFalsePositiveReason(e.target.value)}
                    className="w-full text-xs font-medium p-2.5 rounded-xl border border-indigo-300 bg-white text-slate-800 focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="ACUTE_MISSION_EXERTION">Acute Mission Exertion (Normal combat exhaustion, not chronic burnout)</option>
                    <option value="SENSOR_ARTIFACT">Sensor Artifact / Wearable Glitch (Telemetry noise)</option>
                    <option value="ROSTER_REPORTING_LAG">Roster Reporting Lag (Leave already sanctioned offline)</option>
                    <option value="SUBJECTIVE_NORMALIZATION">Subjective Check-in Outlier (Transient bad day)</option>
                    <option value="OTHER">Other Operational Context</option>
                  </select>
                </div>
              )}

              {/* Severity Override */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Adjust Clinical Severity (Optional)
                </label>
                <select
                  value={severityOverride}
                  onChange={(e) => setSeverityOverride(e.target.value)}
                  className="w-full text-xs font-medium p-2.5 rounded-xl border border-slate-200 bg-white text-slate-800"
                >
                  <option value="">Keep Original Severity ({selectedAlert.severity})</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
              </div>

              {/* Clinical Notes */}
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-1">
                  Clinical Triage Notes & Action Rationale <span className="text-danger">*</span>
                </label>
                <textarea
                  rows={3}
                  value={clinicalNotes}
                  onChange={(e) => setClinicalNotes(e.target.value)}
                  placeholder="State clinical observation, squad context, or reasons for dismissal..."
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                />
              </div>

              {/* Previous Review History */}
              {reviewHistory.length > 0 && (
                <div className="space-y-1.5 pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
                    <History className="w-3.5 h-3.5" /> Previous Review Log
                  </span>
                  <div className="max-h-24 overflow-y-auto space-y-1">
                    {reviewHistory.map((h) => (
                      <div key={h.id} className="text-[10px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-200">
                        <span className="font-bold text-slate-800">{h.reviewer_name}</span> ({h.new_status}) • {new Date(h.created_at).toLocaleDateString()}: {h.clinical_notes}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedAlert(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleSubmitReview}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Recording Disposition...' : 'Commit Human Review'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertsPage;
