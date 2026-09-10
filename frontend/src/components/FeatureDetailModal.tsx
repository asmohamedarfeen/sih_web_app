import React, { useEffect, useState } from 'react';
import {
  X,
  Shield,
  Brain,
  Sliders,
  Activity,
  AlertTriangle,
  FileText,
  CheckCircle2,
  Users,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Clock,
  Printer,
} from 'lucide-react';
import { WelfareFeatureDetail } from '../utils/welfareMetricsData';

interface PriorityPersonnelMini {
  id: string;
  name: string;
  jcNumber: string;
  rank: string;
  unit: string;
  location: string;
  riskScore: number;
  riskTier: 'Critical' | 'High' | 'Moderate' | 'Nominal';
  avatarUrl: string;
}

interface FeatureDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: WelfareFeatureDetail | null;
  allPersonnel: PriorityPersonnelMini[];
  onSelectPersonnel?: (person: PriorityPersonnelMini) => void;
  onInitiateProtocol?: (featureName: string) => void;
}

export const FeatureDetailModal: React.FC<FeatureDetailModalProps> = ({
  isOpen,
  onClose,
  feature,
  allPersonnel,
  onSelectPersonnel,
  onInitiateProtocol,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'formula' | 'cohort' | 'sop'>('overview');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !feature) return null;

  // Filter personnel flagged for this feature or critical cohort
  const cohortPersonnel = allPersonnel.filter((p) =>
    feature.flaggedPersonnelIds.includes(p.jcNumber) || p.riskScore >= 75
  ).slice(0, 5);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/60 backdrop-blur-sm animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ===================================================================== */}
        {/* MODAL HEADER: Indian Armed Forces Standard Bar */}
        {/* ===================================================================== */}
        <div className="bg-[#163A5F] text-white px-6 py-5 border-b border-[#D4A017]/30 relative overflow-hidden shrink-0">
          {/* Subtle Military Green & Gold Accent strip */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#D4A017] via-[#2F4F3E] to-[#D4A017]" />

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#D4A017] text-gray-900">
                  {feature.weight}
                </span>
                <span className="text-[11px] font-semibold text-slate-300 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#D4A017]" />
                  {feature.category}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                {feature.title}
              </h2>
              <p className="text-xs text-slate-200 max-w-2xl font-medium">
                {feature.shortDescription}
              </p>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer shrink-0"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 pt-3 border-t border-white/10 overflow-x-auto text-xs font-bold scrollbar-none">
            {[
              { id: 'overview', label: 'Clinical & Operational Overview', icon: Brain },
              { id: 'formula', label: 'Formula & AI Architecture', icon: Sliders },
              { id: 'cohort', label: `Flagged Cohort (${cohortPersonnel.length})`, icon: Users },
              { id: 'sop', label: 'Welfare SOP & Triage Protocols', icon: FileText },
            ].map((tab) => {
              const TabIcon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`feature-tab-${tab.id}`}
                  data-tab={tab.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveTab(tab.id as any);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    isActive
                      ? 'bg-white text-[#163A5F] shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-white/10'
                  }`}
                >
                  <TabIcon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================================================================== */}
        {/* MODAL BODY (Scrollable) */}
        {/* ===================================================================== */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800 text-xs sm:text-sm">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 4 Core Vital Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Force Prevalence</div>
                  <div className="text-xl font-black text-slate-900 mt-1">{feature.forceCohortPct}%</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{feature.forceCohortCount} of 520 troops</div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200">
                  <div className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider">Critical Zone</div>
                  <div className="text-xl font-black text-rose-800 mt-1">{feature.criticalCount} Troops</div>
                  <div className="text-[10px] text-rose-600 mt-0.5">Immediate stand-down</div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200">
                  <div className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider">Model Precision</div>
                  <div className="text-xl font-black text-emerald-800 mt-1">{feature.confidence.split(' ')[0]}</div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Cross-validated</div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200">
                  <div className="text-[11px] font-semibold text-indigo-700 uppercase tracking-wider">Clinical Baseline</div>
                  <div className="text-xs font-bold text-indigo-900 mt-1 truncate" title={feature.clinicalBaseline}>
                    {feature.clinicalBaseline.split('+')[0] || feature.clinicalBaseline}
                  </div>
                  <div className="text-[10px] text-indigo-600 mt-0.5">Defense Standard</div>
                </div>
              </div>

              {/* Full Description Card */}
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
                <div className="flex items-center gap-2 font-black text-slate-900 text-xs uppercase tracking-wider">
                  <Activity className="w-4 h-4 text-primary" />
                  <span>Clinical & Defense Field Doctrine</span>
                </div>
                <p className="text-slate-700 leading-relaxed font-medium">
                  {feature.fullDescription}
                </p>
              </div>

              {/* Grid: Military Impact vs Clinical Symptoms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Military & Tactical Impact */}
                <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <div className="flex items-center gap-2 font-black text-amber-900 text-xs uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    <span>Combat & Operational Impact</span>
                  </div>
                  <ul className="space-y-2">
                    {feature.militaryImpact.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Observable Clinical Symptoms */}
                <div className="p-5 rounded-2xl bg-rose-50/60 border border-rose-200 space-y-3">
                  <div className="flex items-center gap-2 font-black text-rose-900 text-xs uppercase tracking-wider">
                    <Brain className="w-4 h-4 text-rose-600" />
                    <span>Observable Signs in Field Units</span>
                  </div>
                  <ul className="space-y-2">
                    {feature.clinicalSymptoms.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-700 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 6-Month Longitudinal Trajectory */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-slate-900 text-xs uppercase tracking-wider">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span>6-Month Force-Wide Trend Trajectory (Jan &ndash; Jun 2025)</span>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">Northern Sector Cohort</span>
                </div>
                <div className="grid grid-cols-6 gap-2 pt-2 text-center">
                  {feature.historicalTrend.map((pt) => (
                    <div key={pt.month} className="space-y-1.5">
                      <div className="h-16 bg-slate-100 rounded-xl flex items-end justify-center p-1 overflow-hidden">
                        <div
                          className="w-full bg-primary rounded-lg transition-all duration-500"
                          style={{ height: `${Math.min(100, Math.max(15, pt.value * 3.5))}%` }}
                        />
                      </div>
                      <div className="font-bold text-slate-800 text-xs">{pt.value}%</div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">{pt.month}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MATHEMATICAL FORMULA & AI ARCHITECTURE */}
          {activeTab === 'formula' && (
            <div className="space-y-6">
              {/* Variables Breakdown Table */}
              <div className="space-y-3">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-primary" />
                  <span>Input Feature Attribution & Weights</span>
                </h4>

                <div className="overflow-x-auto rounded-2xl border border-slate-200 shadow-xs">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-600 uppercase tracking-wider">
                      <tr>
                        <th className="p-3">Variable</th>
                        <th className="p-3">Data Source</th>
                        <th className="p-3 text-center">Weight</th>
                        <th className="p-3">Operational Description</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {feature.formulaVariables.map((v) => (
                        <tr key={v.name} className="hover:bg-slate-50/80 transition-colors">
                          <td className="p-3 font-mono font-bold text-primary">{v.name}</td>
                          <td className="p-3 font-medium text-slate-600 whitespace-nowrap">{v.source}</td>
                          <td className="p-3 text-center">
                            <span className="px-2 py-0.5 rounded-md font-mono font-bold bg-[#163A5F]/10 text-[#163A5F]">
                              {v.weight}
                            </span>
                          </td>
                          <td className="p-3 text-slate-700">{v.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Explainable AI Note */}
              <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 flex items-start gap-3">
                <Shield className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs text-blue-900">
                  <span className="font-bold">Explainable AI (SHAP Framework) Compliance:</span>
                  <p className="text-blue-800">
                    Every soldier&apos;s score generated by this formula includes local Shapley Additive Explanations.
                    Welfare officers are guaranteed transparency on exactly which variables triggered the elevated risk,
                    preventing black-box ambiguity in defense operational decisions.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: FLAGGED COHORT */}
          {activeTab === 'cohort' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                    Soldiers Currently Flagged Under {feature.shortName}
                  </h4>
                  <p className="text-slate-500 text-xs">
                    Click &ldquo;Inspect on Dashboard&rdquo; to load that soldier&apos;s live dossier directly.
                  </p>
                </div>
                <span className="text-[11px] font-bold text-slate-500">
                  Showing top {cohortPersonnel.length} urgent cases
                </span>
              </div>

              <div className="space-y-2.5">
                {cohortPersonnel.map((person) => (
                  <div
                    key={person.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-primary/50 shadow-xs hover:shadow-md transition-all flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <img
                        src={person.avatarUrl}
                        alt={person.name}
                        className="w-11 h-11 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-sm text-slate-900 truncate">{person.name}</span>
                          <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                            {person.jcNumber}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 truncate">
                          {person.rank} &bull; {person.unit} &bull; {person.location}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <div className="font-black text-sm text-rose-700">{person.riskScore}%</div>
                        <div className="text-[10px] font-bold text-rose-600 uppercase">{person.riskTier}</div>
                      </div>

                      {onSelectPersonnel && (
                        <button
                          onClick={() => {
                            onSelectPersonnel(person);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-700 transition-colors flex items-center gap-1 cursor-pointer shadow-xs"
                        >
                          <span>Inspect Dossier</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: SOP & WELFARE PROTOCOLS */}
          {activeTab === 'sop' && (
            <div className="space-y-5">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  <span className="font-bold text-emerald-900 text-xs">
                    Standard Armed Forces Medical Services (DG AFMS) Welfare Directive 14/2024
                  </span>
                </div>
                <span className="text-[10px] font-mono font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  MANDATORY COMPLIANCE
                </span>
              </div>

              <div className="space-y-3.5">
                {feature.standardOperatingProcedure.map((sop) => (
                  <div
                    key={sop.step}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase tracking-wider text-primary">
                        {sop.step}
                      </span>
                      <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Formal Protocol
                      </span>
                    </div>
                    <div className="font-black text-slate-900 text-xs sm:text-sm">{sop.title}</div>
                    <p className="text-slate-600 text-xs leading-relaxed">{sop.action}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ===================================================================== */}
        {/* MODAL FOOTER ACTIONS */}
        {/* ===================================================================== */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium hidden sm:flex">
            <Shield className="w-4 h-4 text-emerald-600" />
            <span>Encrypted Defense Medical Record &bull; Confidential Protocol</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                window.print();
              }}
              className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-3.5 h-3.5 text-slate-500" />
              <span>Print Dossier</span>
            </button>

            {onInitiateProtocol && (
              <button
                onClick={() => {
                  onInitiateProtocol(feature.shortName);
                  onClose();
                }}
                className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-700 transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <span>Initiate Cohort Protocol</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureDetailModal;
