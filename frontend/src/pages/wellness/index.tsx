import React, { useState, useEffect } from 'react';
import {
  HeartPulse,
  PlusCircle,
  CheckCircle2,
  Smartphone,
  Eye,
  X,
  RefreshCw,
  Zap,
  Brain,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import {
  wellnessService,
  AssessmentItem,
  PersonnelScreenTimeRecord,
  PersonnelSelfAssessmentRecord,
} from '../../services/wellnessService';

export const WellnessPage: React.FC = () => {
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [screenTimeList, setScreenTimeList] = useState<PersonnelScreenTimeRecord[]>([]);
  const [selfAssessments, setSelfAssessments] = useState<PersonnelSelfAssessmentRecord[]>([]);
  const [selectedUserRecord, setSelectedUserRecord] = useState<PersonnelScreenTimeRecord | null>(null);
  const [selectedAssessment, setSelectedAssessment] = useState<PersonnelSelfAssessmentRecord | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitResult, setSubmitResult] = useState<any>(null);

  const [form, setForm] = useState({
    personnel_uid: 'UID-EMP-010',
    sleep_hours: 6.5,
    fatigue_level: 5,
    mood_score: 7,
    workload_pressure: 6,
    physical_strain: 5,
    consecutive_duty_days: 3,
    notes: '',
  });

  const fetchAssessments = async () => {
    try {
      const data = await wellnessService.getAssessments();
      setAssessments(data);
    } catch (err) {
      console.error('Failed to fetch assessment history:', err);
    }
  };

  const fetchScreenTime = async () => {
    try {
      const data = await wellnessService.getPeopleScreenTime();
      setScreenTimeList(data);
    } catch (err) {
      console.error('Failed to load people screen time:', err);
    }
  };

  const fetchSelfAssessments = async () => {
    try {
      const data = await wellnessService.getSelfAssessments();
      setSelfAssessments(data);
    } catch (err) {
      console.error('Failed to load self assessments:', err);
    }
  };

  useEffect(() => {
    fetchAssessments();
    fetchScreenTime();
    fetchSelfAssessments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await wellnessService.submitAssessment(form);
      setSubmitResult(res);
      fetchAssessments();
    } catch (err) {
      console.error('Failed to submit assessment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateNarrativeSummary = (record: PersonnelScreenTimeRecord) => {
    if (!record.app_breakdown || record.app_breakdown.length === 0) {
      return `${record.personnel_name} has recorded a total of ${record.total_formatted} of device usage today.`;
    }
    const appSegments = record.app_breakdown.map(
      (app) => `${app.duration_formatted} on ${app.app_name}`
    );
    return `He used ${appSegments.join(', ')}. In total he used ${record.total_formatted} today.`;
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-primary-50 text-primary-700 border border-primary-200 shadow-sm">
                Wellness & Biometric Telemetry
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">&bull; Daily Diagnostic Logging</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welfare Intelligence & Self-Assessment Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Real-time psychological self-assessments, biometric pulse telemetry, and frontline device screen time diagnostics.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                fetchAssessments();
                fetchScreenTime();
                fetchSelfAssessments();
              }}
              className="px-3.5 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 cursor-pointer transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4 text-primary" />
              <span>Refresh</span>
            </button>
            <button
              onClick={() => {
                setSubmitResult(null);
                setShowModal(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-extrabold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Check-in</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DEFENSE MEDICAL PRIVILEGE & STATUTORY CONFIDENTIALITY BANNER             */}
      {/* ========================================================================= */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-primary-950 to-slate-900 border border-emerald-500/30 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-white tracking-tight">
                Article 42-A Defense Medical Privilege & Statutory Confidentiality Active
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Non-Punitive Safe Harbor
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Psychometric pulse responses, biometric logs, and screening inventories are legally protected under defense clinical privilege. They are invisible to line commanders and prohibited from influencing annual performance appraisals (APAR).
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/60 px-3 py-1.5 rounded-lg border border-emerald-500/30 shrink-0 self-start sm:self-auto">
          MHA Directive 2026-WEL Protected
        </span>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: PERSONNEL SELF-ASSESSMENT SCORES (WELFARE OFFICER VIEW) */}

      {/* ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-secondary-50 border border-secondary-200 text-secondary-700">
                <Brain className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Personnel Self-Assessment Scores
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Multi-dimensional psychological evaluations submitted via Soldier Mobile Terminals. Click any soldier to view their categorical test score breakdown.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-secondary-700 bg-secondary-50 px-3 py-1 rounded-full border border-secondary-200 self-start sm:self-auto flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-secondary-600" />
            <span>{selfAssessments.length} AI Assessments Indexed</span>
          </span>
        </div>

        {/* Self-Assessment Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {selfAssessments.map((record) => {
            const isHighRisk = record.risk_level === 'CRITICAL' || record.risk_level === 'HIGH';
            const isModerate = record.risk_level === 'MODERATE';

            return (
              <div
                key={record.personnel_uid}
                onClick={() => setSelectedAssessment(record)}
                className={`p-5 rounded-2xl bg-slate-50/70 hover:bg-white border transition-all cursor-pointer group flex flex-col justify-between space-y-3 shadow-xs hover:shadow-card-soft ${
                  isHighRisk
                    ? 'border-rose-200/80 hover:border-rose-400'
                    : isModerate
                    ? 'border-amber-200/80 hover:border-amber-400'
                    : 'border-slate-200/80 hover:border-secondary-400/80'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-secondary-600 transition-colors">
                        {record.personnel_name}
                      </h3>
                      <p className="text-[11px] text-slate-500 font-semibold">{record.rank} &bull; {record.unit}</p>
                      <span className="text-[10px] font-mono text-secondary-700 bg-secondary-50 px-1.5 py-0.5 rounded border border-secondary-200 mt-1 inline-block">
                        {record.personnel_uid}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-black text-slate-900 font-mono block">
                        {record.overall_wellness_score}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">Wellness Score</span>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-[11px]">Stress Index:</span>
                      <span className="font-mono font-bold text-amber-600">{record.stress_index}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-[11px]">Burnout Score:</span>
                      <span className="font-mono font-bold text-rose-600">{record.burnout_score}/100</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500 text-[11px]">Risk Status:</span>
                      <span
                        className={`font-mono font-bold text-[10px] px-2 py-0.5 rounded-full ${
                          record.risk_level === 'CRITICAL'
                            ? 'bg-rose-100 text-rose-800'
                            : record.risk_level === 'HIGH'
                            ? 'bg-orange-100 text-orange-800'
                            : record.risk_level === 'MODERATE'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-success-100 text-success-700'
                        }`}
                      >
                        {record.risk_level}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="w-full py-1.5 px-3 rounded-xl bg-white group-hover:bg-secondary group-hover:text-white border border-slate-200 group-hover:border-transparent text-slate-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all">
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Categorical Scores</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono text-center mt-1.5">
                    Tested: {record.assessment_date}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* CATEGORICAL SELF-ASSESSMENT TEST SCORES MODAL */}
      {/* ========================================================================= */}
      {selectedAssessment && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-7 border border-slate-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedAssessment(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-50 border border-secondary-200 flex items-center justify-center text-secondary-700 font-black text-lg shrink-0">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">
                    {selectedAssessment.personnel_name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-secondary-50 text-secondary-700 border border-secondary-200">
                    Psychological Diagnostic Dossier
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {selectedAssessment.rank} &bull; {selectedAssessment.unit} &bull; {selectedAssessment.branch} &bull;{' '}
                  <span className="font-mono text-secondary-700">{selectedAssessment.personnel_uid}</span>
                </p>
              </div>
            </div>

            {/* Key Summary Metric Cards */}
            <div className="grid grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-secondary-50/70 border border-secondary-200 text-center">
                <span className="text-[10px] uppercase font-bold text-secondary-700 block">Overall Wellness</span>
                <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
                  {selectedAssessment.overall_wellness_score}/100
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 text-center">
                <span className="text-[10px] uppercase font-bold text-amber-700 block">Stress Index</span>
                <span className="text-xl font-black text-amber-700 font-mono mt-0.5 block">
                  {selectedAssessment.stress_index}/100
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200 text-center">
                <span className="text-[10px] uppercase font-bold text-rose-700 block">Burnout Score</span>
                <span className="text-xl font-black text-rose-700 font-mono mt-0.5 block">
                  {selectedAssessment.burnout_score}/100
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">AI Confidence</span>
                <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
                  {selectedAssessment.confidence_score}%
                </span>
              </div>
            </div>

            {/* AI Recommendation Quote Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary-50 via-slate-50 to-primary-50 border border-secondary-100 text-slate-800 space-y-1">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-secondary-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-secondary-600" />
                <span>AI Clinical Guidance & Officer Recommendation</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed text-slate-800">
                "{selectedAssessment.ai_recommendation}"
              </p>
            </div>

            {/* Categorical Domain Breakdown (12 Clinical Domains) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-secondary-600" />
                  <span>Categorical Domain Test Scores (0 - 100 Scale)</span>
                </h3>
                <span className="text-[10px] font-mono text-slate-400 font-semibold">
                  100 = Optimal Wellness
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedAssessment.categorical_breakdown?.map((cat, idx) => {
                  const isCatCritical = cat.risk_level === 'CRITICAL';
                  const isCatHigh = cat.risk_level === 'HIGH';
                  const isCatModerate = cat.risk_level === 'MODERATE';

                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-extrabold text-xs text-slate-900 block">{cat.domain_name}</span>
                          {cat.description && (
                            <span className="text-[10px] text-slate-500 font-medium line-clamp-1">
                              {cat.description}
                            </span>
                          )}
                        </div>
                        <div className="text-right">
                          <span className="font-mono font-black text-xs text-slate-900 block">
                            {cat.score} / 100
                          </span>
                          <span
                            className={`text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded ${
                              isCatCritical
                                ? 'bg-rose-100 text-rose-800'
                                : isCatHigh
                                ? 'bg-orange-100 text-orange-800'
                                : isCatModerate
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-success-100 text-success-700'
                            }`}
                          >
                            {cat.risk_level}
                          </span>
                        </div>
                      </div>

                      {/* Score Progress Bar */}
                      <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isCatCritical
                              ? 'bg-rose-600'
                              : isCatHigh
                              ? 'bg-orange-500'
                              : isCatModerate
                              ? 'bg-amber-500'
                              : 'bg-success'
                          }`}
                          style={{ width: `${Math.min(cat.score, 100)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Primary Risk Contributors (Explainable AI) */}
            {selectedAssessment.primary_contributors && selectedAssessment.primary_contributors.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-slate-100">
                <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Explainable AI Risk Attribution Matrix</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {selectedAssessment.primary_contributors.map((contrib, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
                      <span className="text-[10px] text-slate-600 font-semibold block line-clamp-1">{contrib.factor}</span>
                      <span className="font-mono font-black text-xs text-amber-700 mt-0.5 block">{contrib.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-mono">
                Telemetry Log: {selectedAssessment.notes || 'Frontline Mobile Self-Assessment'}
              </span>
              <button
                onClick={() => setSelectedAssessment(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close Dossier
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION: PEOPLE'S SCREEN TIME DATA (WELFARE OFFICER MONITORING) */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-xl bg-secondary-50 border border-secondary-200 text-secondary-700">
                <Smartphone className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                People's Screen Time Data
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Click on any personnel to view their comprehensive breakdown of applications used, night exposure, and total screen time.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-secondary-700 bg-secondary-50 px-3 py-1 rounded-full border border-secondary-200 self-start sm:self-auto">
            {screenTimeList.length} Mobile Terminals Connected
          </span>
        </div>

        {/* Personnel Screen Time Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {screenTimeList.map((rec) => (
            <div
              key={rec.personnel_uid}
              onClick={() => setSelectedUserRecord(rec)}
              className="p-5 rounded-2xl bg-slate-50/70 hover:bg-white border border-slate-200/80 hover:border-secondary-400/80 shadow-xs hover:shadow-card-soft transition-all cursor-pointer group flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-secondary-600 transition-colors">
                      {rec.personnel_name}
                    </h3>
                    <p className="text-[11px] text-slate-500 font-semibold">{rec.rank} &bull; {rec.unit}</p>
                    <span className="text-[10px] font-mono text-secondary-700 bg-secondary-50 px-1.5 py-0.5 rounded border border-secondary-200 mt-1 inline-block">
                      {rec.personnel_uid}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-base font-black text-slate-900 font-mono block">
                      {rec.total_formatted}
                    </span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase">Total Today</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-200/60 space-y-1.5 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Night Exposure:</span>
                    <span className="font-mono font-bold text-amber-600">{rec.night_exposure_formatted}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-[11px]">Device Unlocks:</span>
                    <span className="font-mono font-bold text-slate-700">{rec.unlock_count} times</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="w-full py-1.5 px-3 rounded-xl bg-white group-hover:bg-secondary group-hover:text-white border border-slate-200 group-hover:border-transparent text-slate-700 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Breakdown</span>
                </div>
                <p className="text-[10px] text-slate-400 font-mono text-center mt-1.5">
                  Synced: {rec.last_sync}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SCREEN TIME DRILLDOWN MODAL */}
      {/* ========================================================================= */}
      {selectedUserRecord && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-7 border border-slate-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedUserRecord(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary-50 border border-secondary-200 flex items-center justify-center text-secondary-700 font-black text-lg shrink-0">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">
                    {selectedUserRecord.personnel_name}
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-secondary-50 text-secondary-700 border border-secondary-200">
                    Screen Time Breakdown
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {selectedUserRecord.rank} &bull; {selectedUserRecord.unit} &bull;{' '}
                  <span className="font-mono text-secondary-700">{selectedUserRecord.personnel_uid}</span>
                </p>
              </div>
            </div>

            {/* Natural Narrative Summary Quote Box */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-secondary-50 via-slate-50 to-primary-50 border border-secondary-100 text-slate-800">
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-secondary-700 mb-1 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5" />
                <span>Executive Telemetry Summary</span>
              </div>
              <p className="text-sm font-semibold leading-relaxed text-slate-800">
                "{generateNarrativeSummary(selectedUserRecord)}"
              </p>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Screen Time</span>
                <span className="text-xl font-black text-slate-900 font-mono mt-0.5 block">
                  {selectedUserRecord.total_formatted}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Night Exposure (&gt;22:00)</span>
                <span className="text-xl font-black text-amber-600 font-mono mt-0.5 block">
                  {selectedUserRecord.night_exposure_formatted}
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Device Unlocks</span>
                <span className="text-xl font-black text-secondary-700 font-mono mt-0.5 block">
                  {selectedUserRecord.unlock_count}
                </span>
              </div>
            </div>

            {/* Granular App Breakdown List */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                Application Usage & Category Breakdown
              </h3>

              <div className="space-y-2.5">
                {selectedUserRecord.app_breakdown?.map((app, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-extrabold text-xs text-slate-900 block">{app.app_name}</span>
                        <span className="text-[10px] text-slate-500 font-medium">{app.category}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-black text-xs text-slate-800">{app.duration_formatted}</span>
                        <span className="text-[10px] text-secondary-700 font-bold block">{app.percentage}%</span>
                      </div>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-slate-200/80 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-secondary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${app.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer Signoff */}
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-[10px] text-slate-400 font-mono">
                Terminal: {selectedUserRecord.device_model || 'Mil-Spec Mobile Terminal'}
              </span>
              <button
                onClick={() => setSelectedUserRecord(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Assessment History Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <HeartPulse className="w-4 h-4 text-primary" />
            <span>Recent Biometric Check-ins</span>
          </h2>
          <span className="text-xs font-mono text-slate-400 font-bold">{assessments.length} Records</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-wider">
                <th className="pb-3 px-3">Personnel</th>
                <th className="pb-3 px-3">Sleep</th>
                <th className="pb-3 px-3">Fatigue</th>
                <th className="pb-3 px-3">Mood</th>
                <th className="pb-3 px-3">Workload</th>
                <th className="pb-3 px-3">Consecutive Days</th>
                <th className="pb-3 px-3 text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs font-medium">
              {assessments.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-extrabold text-slate-900">
                    <div>{a.personnel_name}</div>
                    <span className="text-[10px] font-mono text-primary font-semibold">{a.personnel_uid}</span>
                  </td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{a.sleep_hours}h</td>
                  <td className="py-3 px-3 font-mono font-bold text-rose-600">{a.fatigue_level}/10</td>
                  <td className="py-3 px-3 font-mono font-bold text-success">{a.mood_score}/10</td>
                  <td className="py-3 px-3 font-mono font-bold text-amber-600">{a.workload_pressure}/10</td>
                  <td className="py-3 px-3 font-mono font-bold text-slate-800">{a.consecutive_duty_days} Days</td>
                  <td className="py-3 px-3 text-right text-slate-400 font-mono text-[11px]">
                    {new Date(a.submitted_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Checkin Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 border border-slate-200 shadow-2xl space-y-5">
            <h2 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <HeartPulse className="w-5 h-5 text-primary" />
              <span>Log Biometric & Psychological Check-in</span>
            </h2>

            {submitResult ? (
              <div className="p-5 rounded-2xl bg-primary-50 border border-primary-200 space-y-3">
                <div className="flex items-center gap-2 text-primary-800 font-extrabold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                  <span>Assessment Logged & AI Evaluated!</span>
                </div>
                <div className="text-xs text-slate-700 space-y-1">
                  <p>Computed Stress Score: <strong className="text-primary-900 font-mono">{submitResult.evaluation?.stress_score}/100</strong></p>
                  <p>Risk Classification: <strong className="text-rose-700">{submitResult.evaluation?.risk_level}</strong></p>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full mt-2 py-2 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs cursor-pointer transition-all shadow-md shadow-primary/20"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
                <div>
                  <label className="block mb-1">Personnel UID</label>
                  <select
                    value={form.personnel_uid}
                    onChange={(e) => setForm({ ...form, personnel_uid: e.target.value })}
                    className="w-full white-input rounded-xl px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="UID-EMP-010">UID-EMP-010 — Major Alex Morgan</option>
                    <option value="UID-EMP-011">UID-EMP-011 — Captain Sarah Connor</option>
                    <option value="UID-EMP-012">UID-EMP-012 — Havildar Ramesh Chand</option>
                    <option value="UID-EMP-013">UID-EMP-013 — Subedar Gurpreet Singh</option>
                    <option value="UID-EMP-014">UID-EMP-014 — Naik Sandeep Patil</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Sleep Hours (1-12)</label>
                    <input
                      type="number"
                      step="0.5"
                      min="1"
                      max="14"
                      value={form.sleep_hours}
                      onChange={(e) => setForm({ ...form, sleep_hours: parseFloat(e.target.value) })}
                      className="w-full white-input rounded-xl px-3 py-2 text-sm font-mono focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Fatigue Level (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={form.fatigue_level}
                      onChange={(e) => setForm({ ...form, fatigue_level: parseInt(e.target.value) })}
                      className="w-full white-input rounded-xl px-3 py-2 text-sm font-mono focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block mb-1">Mood Score (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={form.mood_score}
                      onChange={(e) => setForm({ ...form, mood_score: parseInt(e.target.value) })}
                      className="w-full white-input rounded-xl px-3 py-2 text-sm font-mono focus:outline-none"
                      required
                    />
                  </div>
                  <div>
                    <label className="block mb-1">Workload Strain (1-10)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={form.workload_pressure}
                      onChange={(e) => setForm({ ...form, workload_pressure: parseInt(e.target.value) })}
                      className="w-full white-input rounded-xl px-3 py-2 text-sm font-mono focus:outline-none"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-black cursor-pointer shadow-md shadow-primary/20 transition-all"
                  >
                    {isSubmitting ? 'Evaluating...' : 'Submit & Evaluate AI'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WellnessPage;
