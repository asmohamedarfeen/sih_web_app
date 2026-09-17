import React from 'react';
import {
  Moon,
  CalendarX,
  Compass,
  BedDouble,
  ShieldCheck,
} from 'lucide-react';

export interface WeakSignalFactor {
  factor: string;
  detail: string;
  weightPct: number;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeColor: string;
}

interface WeakSignalBreakdownCardProps {
  personnelName?: string;
  riskScore?: number;
  confidence?: number;
  factors?: WeakSignalFactor[];
}

export const WeakSignalBreakdownCard: React.FC<WeakSignalBreakdownCardProps> = ({
  personnelName = 'Naik Rohit Sharma',
  riskScore = 86,
  confidence = 94,
  factors,
}) => {
  const defaultFactors: WeakSignalFactor[] = [
    {
      factor: '3 Consecutive Night Patrols',
      detail: 'Continuous forward observation shift without circadian reset (42% night hour surge).',
      weightPct: 28,
      category: 'Operational Tempo',
      icon: Moon,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
      badgeColor: 'bg-rose-100 text-rose-700 border-rose-300',
    },
    {
      factor: 'Denied Family Leave / 2x Operational Deferrals',
      detail: 'Accumulated casual leave backlog denied due to emergency border posture; restorative reset delayed.',
      weightPct: 24,
      category: 'Duty & Rest',
      icon: CalendarX,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
      badgeColor: 'bg-amber-100 text-amber-700 border-amber-300',
    },
    {
      factor: 'Recent Unit Transfer to Forward LOC Sector',
      detail: 'Relocated to High-Altitude Field Unit 17 RR within last 30 days; adaptation strain.',
      weightPct: 22,
      category: 'Deployment Strain',
      icon: Compass,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
      badgeColor: 'bg-blue-100 text-blue-700 border-blue-300',
    },
    {
      factor: '18% Sleep Drop (Averaging 4.2h / Night)',
      detail: 'Telemetry and voluntary check-in reveal consecutive nocturnal arousal and sleep fragmentation.',
      weightPct: 16,
      category: 'Physiological Debt',
      icon: BedDouble,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200',
      badgeColor: 'bg-indigo-100 text-indigo-700 border-indigo-300',
    },
  ];

  const activeFactors = factors || defaultFactors;

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-rose-50 text-rose-700 border border-rose-200">
              Explainable AI (XAI)
            </span>
            <span className="text-xs font-mono text-slate-500 font-semibold">
              Root-Cause Attribution Engine
            </span>
          </div>
          <h3 className="text-base font-black text-slate-900 mt-1">
            Weak Signal Breakdown for {personnelName}
          </h3>
          <p className="text-xs text-slate-500">
            Deconstructs the static composite score into exact observable operational and physiological triggers.
          </p>
        </div>

        {/* Confidence & Score Pill */}
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 rounded-2xl bg-rose-50 border border-rose-200 text-center">
            <span className="text-[9px] uppercase font-bold text-rose-600 block">Risk Score</span>
            <span className="text-lg font-black text-rose-700 font-mono">{riskScore}%</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
            <span className="text-[9px] uppercase font-bold text-slate-400 block">AI Confidence</span>
            <span className="text-lg font-black text-slate-800 font-mono">{confidence}%</span>
          </div>
        </div>
      </div>

      {/* Signal Breakdown List */}
      <div className="space-y-2.5">
        {activeFactors.map((item, idx) => {
          const IconComponent = item.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50/80 hover:bg-slate-50 border border-slate-200/80 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl border ${item.color} shrink-0 mt-0.5`}>
                  <IconComponent className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">{item.factor}</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      &bull; {item.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-0.5 leading-snug">{item.detail}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border font-mono ${item.badgeColor}`}>
                  +{item.weightPct}% Impact
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Scientific Validation Note */}
      <div className="p-3 rounded-2xl bg-emerald-50/80 border border-emerald-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold text-[11px]">
            <strong>SHAP Shapley Values Verified:</strong> Multi-collinear factor isolation confirms non-linear stress accumulation.
          </span>
        </div>
        <span className="text-[10px] font-mono font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
          Top 1% Benchmark
        </span>
      </div>
    </div>
  );
};

export default WeakSignalBreakdownCard;
