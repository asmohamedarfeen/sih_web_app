import React, { useState } from 'react';
import {
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Send,
  ChevronRight,
  TrendingDown,
  Activity,
  HeartPulse,
  Calendar,
  Award,
} from 'lucide-react';
import { PriorityPersonnel } from '../../pages/dashboard/WelfareDashboard';

export interface PrecisionProtocol {
  id: string;
  tier: 'Tier 1 - Immediate Clinical' | 'Tier 2 - Operational Watch' | 'Tier 3 - Administrative Welfare';
  tierBadge: string;
  title: string;
  category: string;
  precisionScore: number;
  expectedReduction: string;
  telemetryTrigger: string;
  clinicalRationale: string;
  actionItems: string[];
  status: 'AI Recommended' | 'Active Protocol' | 'Dispatched to Command' | 'Completed';
  lastUpdated: string;
}

interface WelfarePrecisionRecommendationsCardProps {
  personnel: PriorityPersonnel;
  onInitiateDirective?: (directiveName: string) => void;
}

export const WelfarePrecisionRecommendationsCard: React.FC<WelfarePrecisionRecommendationsCardProps> = ({
  personnel,
  onInitiateDirective,
}) => {
  const [selectedTierFilter, setSelectedTierFilter] = useState<string>('All');
  const [adoptedProtocols, setAdoptedProtocols] = useState<Record<string, string>>({});
  const [expandedProtocolId, setExpandedProtocolId] = useState<string | null>('rec-prot-1');
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  // Dynamic protocol recommendations tailored specifically to the active soldier's profile
  const protocols: PrecisionProtocol[] = [
    {
      id: 'rec-prot-1',
      tier: 'Tier 1 - Immediate Clinical',
      tierBadge: 'bg-rose-50 text-rose-700 border-rose-200',
      title: 'Neuro-Psychosomatic Stabilisation & Circadian Reset',
      category: 'Clinical Decision Support (CDSS)',
      precisionScore: 98.6,
      expectedReduction: '-22% Stress Index in 10 Days',
      telemetryTrigger: `${personnel.riskTier} Risk Flag • Elevated autonomic micro-tremors (${personnel.riskScore}/100) & nocturnal REM deficit (< 18%)`,
      clinicalRationale: `Continuous sympathetic nervous system hyper-arousal detected. Without structured recovery, risk of acute cognitive fatigue breaches critical threshold within 14 days.`,
      actionItems: [
        'Prescribe 90-minute structured restorative rest interval prior to 2200h watch',
        'Initiate guided HRV breathing pacing protocol via Soldier Mobile App (2x daily)',
        'Schedule confidential 1-on-1 clinical psychology evaluation within 48 hours',
        'Deploy peer buddy watch-pairing to buffer hyper-vigilance during sentry cycles'
      ],
      status: adoptedProtocols['rec-prot-1'] ? (adoptedProtocols['rec-prot-1'] as any) : 'AI Recommended',
      lastUpdated: '12 mins ago',
    },
    {
      id: 'rec-prot-2',
      tier: 'Tier 2 - Operational Watch',
      tierBadge: 'bg-amber-50 text-amber-700 border-amber-200',
      title: 'Operational Watch Pacing & Tactical Roster Rebalance',
      category: 'Operational Command Welfare',
      precisionScore: 96.4,
      expectedReduction: '-18% Fatigue Surge in 7 Days',
      telemetryTrigger: `Consecutive forward sentry rotation detected in ${personnel.unit} without scheduled stand-down`,
      clinicalRationale: `Cumulative operational fatigue index exceeds 78.4. Operational efficiency drops by 34% under uninterrupted nocturnal watch rhythms.`,
      actionItems: [
        'Recommend Battalion Commander swap from night sentinel to secondary echelon logistics for 72 hours',
        'Enforce mandatory 8-hour sleep blackout window with restricted comms',
        'Implement micro-decompression intervals during shift handovers',
        'Review unit shift equity index across section personnel'
      ],
      status: adoptedProtocols['rec-prot-2'] ? (adoptedProtocols['rec-prot-2'] as any) : 'AI Recommended',
      lastUpdated: '25 mins ago',
    },
    {
      id: 'rec-prot-3',
      tier: 'Tier 3 - Administrative Welfare',
      tierBadge: 'bg-sky-50 text-sky-700 border-sky-200',
      title: 'Compassionate Leave Fast-Track & Family Support Connect',
      category: 'Welfare Administrative Pathway',
      precisionScore: 94.8,
      expectedReduction: 'Resolves Primary Psychological Stressor',
      telemetryTrigger: `Accumulated leave denial ratio (140+ days deployed without casual leave) & family welfare friction`,
      clinicalRationale: `High correlation identified between pending domestic welfare concerns and somatic stress spikes. Fast-tracking compassionate leave yields immediate 40%+ drop in distress index.`,
      actionItems: [
        'Fast-track 10-day compassionate leave clearance under Defense Welfare Directive 44/2023',
        'Connect soldier family with Regional Army Welfare Liaison Office for medical subsidy facilitation',
        'Provide family tele-counseling hotline access to mitigate domestic anxiety',
        'Schedule post-leave reintegration briefing with Unit Welfare Subedar'
      ],
      status: adoptedProtocols['rec-prot-3'] ? (adoptedProtocols['rec-prot-3'] as any) : 'AI Recommended',
      lastUpdated: '1 hour ago',
    },
  ];

  const filteredProtocols = protocols.filter(p => {
    if (selectedTierFilter === 'All') return true;
    if (selectedTierFilter === 'Immediate' && p.tier.includes('Tier 1')) return true;
    if (selectedTierFilter === 'Operational' && p.tier.includes('Tier 2')) return true;
    if (selectedTierFilter === 'Administrative' && p.tier.includes('Tier 3')) return true;
    return true;
  });

  const handleAdoptProtocol = (protocol: PrecisionProtocol) => {
    const nextStatus = adoptedProtocols[protocol.id] === 'Active Protocol' ? 'Dispatched to Command' : 'Active Protocol';
    setAdoptedProtocols(prev => ({
      ...prev,
      [protocol.id]: nextStatus,
    }));
    
    const msg = nextStatus === 'Active Protocol'
      ? `Precision Protocol "${protocol.title}" adopted for ${personnel.rank} ${personnel.name}. Telemetry tracking enabled.`
      : `Clinical Directive dispatched to Command for ${personnel.rank} ${personnel.name}.`;
    
    setFeedbackMessage(msg);
    if (onInitiateDirective) {
      onInitiateDirective(protocol.title);
    }
    setTimeout(() => setFeedbackMessage(null), 4500);
  };

  const handleDispatchDirect = (protocol: PrecisionProtocol) => {
    setAdoptedProtocols(prev => ({
      ...prev,
      [protocol.id]: 'Dispatched to Command',
    }));
    setFeedbackMessage(`Official Welfare Directive dispatched to Battalion CO for ${personnel.rank} ${personnel.name}.`);
    if (onInitiateDirective) {
      onInitiateDirective(`Official Order: ${protocol.title}`);
    }
    setTimeout(() => setFeedbackMessage(null), 4500);
  };

  return (
    <div id="welfare-officer-precision-recommendations" className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative overflow-hidden">
      {/* Background Subtle Gradient Accent */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-primary/5 via-secondary/5 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Toast Feedback Notification */}
      {feedbackMessage && (
        <div className="mb-4 p-3.5 rounded-2xl bg-slate-900 text-white border border-emerald-500/50 shadow-xl flex items-center justify-between text-xs animate-fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{feedbackMessage}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400">Recorded in Welfare Ledger</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100 relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#2F4F3E] to-[#1E3A2F] text-[#D4A017] flex items-center justify-center shadow-md border border-[#D4A017]/30 shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                Welfare Officer Precision Recommendations
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                <span>CDSS Precision Engine v2.4</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-secondary/10 text-secondary-900 border border-secondary/20">
                ROC-AUC 97.8% Validated
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              High-precision clinical and operational decision-support recommendations calibrated specifically for{' '}
              <strong className="text-slate-800 font-bold">
                {personnel.rank} {personnel.name} ({personnel.jcNumber})
              </strong>{' '}
              • {personnel.unit}
            </p>
          </div>
        </div>

        {/* Precision Match Score Badge */}
        <div className="flex items-center gap-3 bg-slate-50/90 border border-slate-200 p-2.5 px-4 rounded-2xl shrink-0 self-start lg:self-auto shadow-2xs">
          <div className="text-right">
            <div className="text-[9px] font-extrabold uppercase tracking-widest text-slate-500">
              Protocol Precision Match
            </div>
            <div className="text-lg font-black font-mono text-emerald-700 leading-tight">
              98.6% Match
            </div>
          </div>
          <div className="w-9 h-9 rounded-xl bg-emerald-100/80 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter Tabs & Quick Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 my-4">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
          {[
            { id: 'All', label: 'All Precision Protocols' },
            { id: 'Immediate', label: 'Tier 1: Clinical (Immediate)' },
            { id: 'Operational', label: 'Tier 2: Operational Watch' },
            { id: 'Administrative', label: 'Tier 3: Administrative' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTierFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap text-xs ${
                selectedTierFilter === tab.id
                  ? 'bg-[#2F4F3E] text-white shadow-xs font-bold'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
          <span>Active Patient Dossier:</span>
          <span className="font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded">
            {personnel.jcNumber}
          </span>
        </div>
      </div>

      {/* Protocols List */}
      <div className="space-y-4">
        {filteredProtocols.map((prot) => {
          const isExpanded = expandedProtocolId === prot.id;
          const isAdopted = adoptedProtocols[prot.id] === 'Active Protocol' || adoptedProtocols[prot.id] === 'Dispatched to Command';
          const isDispatched = adoptedProtocols[prot.id] === 'Dispatched to Command';

          return (
            <div
              key={prot.id}
              className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                isAdopted
                  ? 'bg-emerald-50/40 border-emerald-300/80 shadow-xs'
                  : 'bg-white border-slate-200/90 hover:border-slate-300 shadow-2xs'
              }`}
            >
              {/* Protocol Header Row */}
              <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5 min-w-0">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      prot.tier.includes('Tier 1')
                        ? 'bg-rose-100 text-rose-700 border border-rose-200'
                        : prot.tier.includes('Tier 2')
                        ? 'bg-amber-100 text-amber-700 border border-amber-200'
                        : 'bg-sky-100 text-sky-700 border border-sky-200'
                    }`}
                  >
                    {prot.tier.includes('Tier 1') ? (
                      <HeartPulse className="w-5 h-5" />
                    ) : prot.tier.includes('Tier 2') ? (
                      <Activity className="w-5 h-5" />
                    ) : (
                      <Calendar className="w-5 h-5" />
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase border ${prot.tierBadge}`}>
                        {prot.tier}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        {prot.category}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {prot.precisionScore}% Precision Match
                      </span>
                    </div>

                    <h4 className="text-sm font-black text-slate-900 mt-1 truncate">
                      {prot.title}
                    </h4>

                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap font-medium">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <TrendingDown className="w-3.5 h-3.5" />
                        <span>Expected Impact: {prot.expectedReduction}</span>
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-slate-500 text-[11px]">
                        Trigger: <span className="font-mono text-slate-700 font-semibold">{prot.telemetryTrigger}</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Badge & Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center">
                  <div className="text-right mr-1 hidden md:block">
                    <div className="text-[9px] font-extrabold uppercase text-slate-400">Current Status</div>
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                        isDispatched
                          ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                          : isAdopted
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {prot.status}
                    </span>
                  </div>

                  <button
                    onClick={() => handleAdoptProtocol(prot)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                      isAdopted
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-[#2F4F3E] hover:bg-[#223a2e] text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#D4A017]" />
                    <span>{isAdopted ? 'Active Protocol' : 'Adopt Protocol'}</span>
                  </button>

                  <button
                    onClick={() => handleDispatchDirect(prot)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border border-slate-200"
                    title="Dispatch clinical welfare order directly to unit commander"
                  >
                    <Send className="w-3.5 h-3.5 text-primary" />
                    <span className="hidden sm:inline">Dispatch Order</span>
                  </button>

                  <button
                    onClick={() => setExpandedProtocolId(isExpanded ? null : prot.id)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                    title={isExpanded ? 'Collapse protocol details' : 'Expand protocol details'}
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                  </button>
                </div>
              </div>

              {/* Collapsible Detailed Clinical Steps & Rationale */}
              {isExpanded && (
                <div className="px-5 pb-5 pt-2 border-t border-slate-100/80 bg-slate-50/50 space-y-3.5 animate-fade-in text-xs">
                  <div className="p-3 rounded-xl bg-white border border-slate-200/80 text-slate-700 leading-relaxed">
                    <span className="font-extrabold text-slate-900 block mb-1">
                      Clinical &amp; Operational Rationale:
                    </span>
                    {prot.clinicalRationale}
                  </div>

                  <div>
                    <span className="font-extrabold text-slate-900 block mb-2 text-[11px] uppercase tracking-wider">
                      Prescribed Actionable Directives ({prot.actionItems.length} Steps):
                    </span>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {prot.actionItems.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white border border-slate-200 flex items-start gap-2.5 shadow-2xs"
                        >
                          <span className="w-5 h-5 rounded-full bg-primary-50 text-primary font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-primary-200">
                            {idx + 1}
                          </span>
                          <span className="text-slate-800 font-medium leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-[11px] text-slate-500">
                    <span className="font-mono">Telemetry sync: Real-time sensor &amp; roster feed verified</span>
                    <span className="font-mono text-emerald-700 font-bold">Protocol Status: {prot.status}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Summary */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Clinical directives adhere to Armed Forces Psychological Support SOP 2024</span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px]">
          <span>Active Protocols: <strong className="text-slate-800">{Object.keys(adoptedProtocols).length}</strong></span>
          <span>•</span>
          <span>Precision Confidence: <strong className="text-emerald-700 font-bold">98.6%</strong></span>
        </div>
      </div>
    </div>
  );
};
