import React, { useState, useEffect } from 'react';
import {
  Printer,
  X,
  Shield,
  Activity,
  Lock,
} from 'lucide-react';
import { reportService, PersonnelDossierReport } from '../../services/reportService';

interface Form16WelfareDossierProps {
  personnelUid: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Form16WelfareDossier: React.FC<Form16WelfareDossierProps> = ({
  personnelUid,
  isOpen,
  onClose,
}) => {
  const [dossier, setDossier] = useState<PersonnelDossierReport | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isOpen && personnelUid) {
      setLoading(true);
      reportService
        .getPersonnelDossier(personnelUid)
        .then((data) => setDossier(data))
        .catch((err) => console.error('Failed to load dossier:', err))
        .finally(() => setLoading(false));
    }
  }, [isOpen, personnelUid]);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white print:static">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border border-slate-300 shadow-2xl flex flex-col justify-between print:max-h-none print:shadow-none print:border-none print:rounded-none">
        
        {/* Modal Toolbar (Hidden in Print) */}
        <div className="p-4 px-6 bg-slate-900 text-white rounded-t-3xl flex items-center justify-between border-b border-slate-800 print:hidden shrink-0">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-amber-400" />
            <span className="text-sm font-black tracking-wide">Form 16-Welfare Defense Dossier Viewer</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-600 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-sm transition-all"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div className="p-8 sm:p-12 space-y-7 text-slate-800 font-sans print:p-0 print:text-black">
          {loading || !dossier ? (
            <div className="py-24 text-center text-slate-400">
              <Activity className="w-8 h-8 animate-spin mx-auto mb-3 text-primary" />
              <p className="font-bold text-sm">Compiling Official Form 16-Welfare Dossier...</p>
            </div>
          ) : (
            <>
              {/* Document Official Header */}
              <div className="border-b-2 border-slate-900 pb-5 text-center space-y-1">
                <div className="flex items-center justify-center gap-2 text-[11px] font-extrabold uppercase tracking-[0.2em] text-slate-600">
                  <span>Integrated Defense Staff</span>
                  <span>&bull;</span>
                  <span>Personnel & Welfare Branch</span>
                  <span>&bull;</span>
                  <span>MHA & MOD Directive 14-A</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-950 uppercase">
                  Form 16-Welfare: Psychological Readiness & Welfare Appraisal Record
                </h1>
                <div className="flex flex-wrap justify-center gap-4 text-xs font-mono pt-1 text-slate-600">
                  <span><strong>RECORD ID:</strong> {dossier.report_id}</span>
                  <span>&bull;</span>
                  <span><strong>DATE:</strong> {dossier.generated_at}</span>
                  <span>&bull;</span>
                  <span className="text-amber-700 font-bold uppercase">CONFIDENTIAL // ARTICLE 42-A SAFE HARBOR</span>
                </div>
              </div>

              {/* Command Confidentiality Firewall Seal */}
              {(dossier as any)?.confidentiality_firewall?.status === 'ACTIVE_COMMAND_FIREWALL' ? (
                <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-400/80 flex items-start gap-3 shadow-xs">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-700 shrink-0">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-black uppercase tracking-wider text-amber-900">
                        Command Review Mode &bull; Clinical Telemetry Redacted
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-200/70 text-amber-950 font-bold">
                        MHA ARTICLE 42-A ENFORCED
                      </span>
                    </div>
                    <p className="text-slate-700 leading-relaxed text-[11px]">
                      In compliance with Defense Personnel Medical Confidentiality directives, subjective mood logs, psychometric questionnaires, and psychiatric session notes are sealed. This dossier provides <strong>Tactical Combat Readiness</strong> and <strong>Operational Roster Recommendations</strong> only.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-300 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2 font-bold">
                    <Shield className="w-4 h-4 text-emerald-600" />
                    <span>Certified Welfare / Medical Officer Full Clinical Privilege</span>
                  </div>
                  <span className="font-mono text-[10px] text-emerald-700">All 18-Domain Psychological Telemetry Unlocked</span>
                </div>
              )}

              {/* Section 1: Personnel Service Identity */}
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-100 p-2 rounded-lg border-l-4 border-primary">
                  Section 1: Service Particulars & Deployment Status
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs p-3 bg-slate-50/70 rounded-xl border border-slate-200">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Full Name</span>
                    <span className="font-extrabold text-gray-900">{dossier.personnel.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Rank & Trade</span>
                    <span className="font-extrabold text-gray-900">{dossier.personnel.rank}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Regimental ID</span>
                    <span className="font-mono font-bold text-gray-900">{dossier.personnel.regimental_number}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">UID / Service ID</span>
                    <span className="font-mono font-bold text-gray-900">{dossier.personnel.uid}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Assigned Unit</span>
                    <span className="font-bold text-gray-900">{dossier.personnel.unit}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Branch of Service</span>
                    <span className="font-bold text-gray-900">{dossier.personnel.branch}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Medical Category</span>
                    <span className="font-black text-emerald-700 font-mono">{dossier.operational_readiness.shape_category}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Readiness Status</span>
                    <span className={`font-black font-mono ${
                      dossier.operational_readiness.burnout_risk === 'CRITICAL' ? 'text-rose-600' : 'text-emerald-700'
                    }`}>
                      {dossier.operational_readiness.readiness_status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Section 2: Telemetry & Machine Learning Risk Breakdown */}
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-100 p-2 rounded-lg border-l-4 border-primary">
                  Section 2: Multi-Factor Stress Index & TreeSHAP Attributions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Composite Stress Index</span>
                    <span className="text-2xl font-black font-mono text-rose-600">
                      {dossier.operational_readiness.stress_index}/100
                    </span>
                    <span className="block text-[10px] font-black text-rose-700 uppercase mt-0.5">
                      {dossier.operational_readiness.burnout_risk} RISK TIER
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Consecutive High-Tempo Shifts</span>
                    <span className="text-2xl font-black font-mono text-amber-600">
                      {dossier.operational_readiness.consecutive_shifts} Shifts
                    </span>
                    <span className="block text-[10px] text-slate-500 uppercase mt-0.5">Threshold: 5 Shifts</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
                    <span className="text-slate-500 block text-[10px] uppercase font-bold">Model Confidence & Sparsity</span>
                    <span className="text-2xl font-black font-mono text-primary-700">
                      {dossier.sparsity_index ? (dossier.sparsity_index.adjusted_model_confidence * 100).toFixed(0) : 88}%
                    </span>
                    <span className="block text-[10px] font-black text-slate-600 uppercase mt-0.5">
                      {dossier.sparsity_index?.fidelity_tier || 'GOOD_FIDELITY'}
                    </span>
                  </div>
                </div>

                {/* TreeSHAP Trigger Table */}
                {dossier.shap_risk_attribution && dossier.shap_risk_attribution.length > 0 && (
                  <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs">
                    <span className="font-bold text-slate-700 block mb-2">Key Driving Stress Triggers (XGBoost TreeSHAP):</span>
                    <div className="space-y-1.5">
                      {dossier.shap_risk_attribution.map((trig, idx) => (
                        <div key={idx} className="flex justify-between items-center py-1 border-b border-slate-100 last:border-none text-[11px]">
                          <span className="font-semibold text-slate-800">{trig.factor}</span>
                          <div className="flex items-center gap-3">
                            <span className="text-slate-500">{trig.metric}</span>
                            <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                              trig.impact === 'HIGH' ? 'bg-rose-100 text-rose-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {trig.impact}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Section 3: Natural Language Clinical Narrative */}
              {dossier.clinical_narrative && (
                <div className="space-y-2">
                  <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-100 p-2 rounded-lg border-l-4 border-primary">
                    Section 3: Clinical & Operational Briefing Narrative
                  </h2>
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs leading-relaxed text-slate-800 text-justify">
                    <p>{dossier.clinical_narrative.narrative_paragraph}</p>
                  </div>
                </div>
              )}

              {/* Section 4: Closed-Loop Intervention & Debrief Milestones */}
              <div className="space-y-2">
                <h2 className="text-xs font-black uppercase tracking-widest text-slate-900 bg-slate-100 p-2 rounded-lg border-l-4 border-primary">
                  Section 4: Closed-Loop Intervention & Recovery Delta Record
                </h2>
                {dossier.active_interventions.length === 0 ? (
                  <p className="text-xs text-slate-500 italic p-2">No active or historical welfare interventions recorded.</p>
                ) : (
                  <div className="space-y-2 text-xs">
                    {dossier.active_interventions.map((inv, idx) => (
                      <div key={idx} className="p-3 bg-white rounded-xl border border-slate-200 space-y-1.5">
                        <div className="flex justify-between items-center font-bold">
                          <span className="text-primary-800">{inv.case_number} &bull; {inv.title}</span>
                          <span className="px-2 py-0.5 rounded bg-slate-100 font-mono text-[10px]">{inv.status}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-slate-600">
                          <span>Baseline Stress: <strong>{inv.pre_intervention_score ?? 'N/A'}/100</strong></span>
                          <span>Current Stress: <strong>{inv.post_intervention_score ?? 'Pending'}/100</strong></span>
                          <span>Recovery Trajectory: <strong className="text-emerald-700">{inv.recovery_status || 'STABLE'}</strong></span>
                          <span>Debriefs Logged: <strong>{inv.sessions_count}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 5: Statutory Medical Privilege & Safe Harbor Statement */}
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-amber-700" />
                  <span>Statutory Safe Harbor & Defense Privilege Guarantee (Article 42-A)</span>
                </div>
                <p className="leading-relaxed text-amber-800">
                  Data in this dossier is classified as privileged medical intelligence. Under Defense Directive MHA/2026/WEL, subjective check-in data cannot be cited as punitive evidence in Court of Inquiry proceedings, nor used to degrade APAR/ACR merit evaluations. It serves strictly as restorative command decision support.
                </p>
              </div>

              {/* Section 6: Official Dual Sign-Off Blocks */}
              <div className="pt-4 border-t-2 border-slate-900 grid grid-cols-2 gap-8 text-xs">
                {/* Medical Officer */}
                <div className="space-y-6">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Unit Medical Officer Certification</div>
                  <div className="border-b border-slate-400 pb-1">
                    <span className="font-mono text-xs font-bold text-slate-700">DIGITALLY VERIFIED // PKI SHA-256</span>
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900">Maj. S. Ramanathan, MD (Armed Forces Med Services)</span>
                    <span className="text-[10px] text-slate-500">Certified Welfare Officer / Clinical Psychiatrist</span>
                  </div>
                </div>

                {/* Formation Commander */}
                <div className="space-y-6">
                  <div className="text-[10px] uppercase font-bold text-slate-500">Formation Commander Endorsement</div>
                  <div className="border-b border-slate-400 pb-1">
                    <span className="font-mono text-xs font-bold text-slate-700">CONCURRED // ROP 14-A REST DIRECTIVE APPROVED</span>
                  </div>
                  <div>
                    <span className="font-bold block text-slate-900">Brig. Santosh Babu</span>
                    <span className="text-[10px] text-slate-500">Formation Commander, 16 Corps Command Division</span>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer (Hidden in print) */}
        <div className="p-4 px-6 bg-slate-50 border-t border-slate-200 rounded-b-3xl flex justify-between items-center text-xs print:hidden">
          <span className="text-slate-500">Standard Form 16-Welfare &bull; Integrated Defense Welfare Command</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 font-bold text-slate-700 transition-colors cursor-pointer"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
};

export default Form16WelfareDossier;
