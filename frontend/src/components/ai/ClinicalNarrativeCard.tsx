import React, { useState, useEffect } from 'react';
import {
  FileText,
  Copy,
  Check,
  ShieldCheck,
  Sparkles,
  RefreshCw,
  Gauge,
} from 'lucide-react';
import { aiRiskService } from '../../services/aiRiskService';

interface ClinicalNarrativeCardProps {
  personnelUid?: string;
  missingDays?: number;
}

export const ClinicalNarrativeCard: React.FC<ClinicalNarrativeCardProps> = ({
  personnelUid = 'UID-EMP-012',
  missingDays = 2,
}) => {
  const [narrative, setNarrative] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const fetchNarrative = async () => {
    setLoading(true);
    try {
      const res = await aiRiskService.generateNarrative({
        personnel_uid: personnelUid,
        missing_days: missingDays,
      });
      setNarrative(res);
    } catch (err) {
      console.error('Error generating narrative:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNarrative();
  }, [personnelUid, missingDays]);

  const handleCopy = () => {
    if (narrative?.narrative_paragraph) {
      navigator.clipboard.writeText(narrative.narrative_paragraph);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  const getFidelityBadge = (tier?: string) => {
    switch (tier) {
      case 'HIGH_FIDELITY':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'GOOD_FIDELITY':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'MODERATE_SPARSITY':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  return (
    <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-5">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary-50 border border-primary-200 text-primary-700">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-gray-900">Natural Language Clinical & Welfare Brief</h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-primary-50 text-primary-700 border border-primary-200">
                HQ Form 16 Standard
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 font-medium">
              Automated synthesis of SHAP risk factors, biometric telemetry, and data fidelity into a military-grade briefing paragraph.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchNarrative}
            disabled={loading}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
            title="Refresh Narrative"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={handleCopy}
            disabled={!narrative}
            className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied to Clipboard</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy for COI / APAR Review</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Narrative Paragraph Box */}
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs leading-relaxed text-slate-700 font-serif italic relative">
        {loading ? (
          <div className="py-6 text-center text-slate-400">
            <Sparkles className="w-5 h-5 animate-pulse mx-auto mb-2 text-primary" />
            <span>Synthesizing multi-modal telemetry and TreeSHAP factors...</span>
          </div>
        ) : narrative ? (
          <p className="text-justify font-sans not-italic text-slate-800 text-[12.5px] leading-relaxed font-medium">
            {narrative.narrative_paragraph}
          </p>
        ) : (
          <p className="text-slate-400">Unable to load narrative brief.</p>
        )}
      </div>

      {/* Dynamic Confidence & Sparsity Meter Section */}
      {narrative?.sparsity_evaluation && (
        <div className="p-4 rounded-2xl bg-primary-50/40 border border-primary-100 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-primary-700" />
              <span className="text-xs font-black text-gray-900 uppercase tracking-wider">
                Dynamic Model Confidence & Telemetry Sparsity Meter
              </span>
            </div>
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${getFidelityBadge(narrative.sparsity_evaluation.fidelity_tier)}`}>
              {narrative.sparsity_evaluation.fidelity_tier}
            </span>
          </div>

          {/* Progress Bar & Scores */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">Adjusted Model Confidence</div>
              <div className="text-lg font-black text-primary-800 font-mono">
                {(narrative.sparsity_evaluation.adjusted_model_confidence * 100).toFixed(0)}%
              </div>
              <div className="text-[10px] text-slate-400">Base: 95% (-{(narrative.sparsity_evaluation.sparsity_penalty_applied * 100).toFixed(0)}% sparsity penalty)</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">14-Day Telemetry Fidelity</div>
              <div className="text-lg font-black text-slate-800 font-mono">
                {narrative.sparsity_evaluation.logged_days} / {narrative.sparsity_evaluation.lookback_window_days} Days
              </div>
              <div className="text-[10px] text-slate-400">{narrative.sparsity_evaluation.telemetry_compliance_pct}% compliance rate</div>
            </div>

            <div className="p-2.5 rounded-xl bg-white border border-slate-200/70 shadow-2xs">
              <div className="text-[10px] font-semibold text-slate-500 uppercase">Missing Pulse Days</div>
              <div className="text-lg font-black text-amber-600 font-mono">
                {narrative.sparsity_evaluation.missing_days} Days
              </div>
              <div className="text-[10px] text-slate-400">Unlogged check-in periods</div>
            </div>
          </div>

          {/* Clinical Advisory Alert */}
          <div className="flex items-start gap-2.5 text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200/60">
            <ShieldCheck className="w-4 h-4 text-primary-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-slate-800">Diagnostic Advisory: </span>
              <span>{narrative.sparsity_evaluation.clinical_advisory}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClinicalNarrativeCard;
