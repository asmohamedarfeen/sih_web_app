import React from 'react';
import {
  Layers,
  Database,
  CalendarCheck2,
  HeartPulse,
  Watch,
  Cpu,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const MultiSourceSignalFusionCard: React.FC = () => {
  const streams = [
    {
      name: 'HRMS Force Stream',
      sub: 'Service tenure, leave history, transfer cycles',
      status: 'Synced (100% Encrypted)',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: Database,
      iconColor: 'text-blue-600 bg-blue-50 border-blue-200',
      weight: '30% Model Weight',
    },
    {
      name: 'Duty Roster Stream',
      sub: 'Night watch hours, high-tempo shifts, post exposure',
      status: 'Live Roster Feed',
      statusColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
      icon: CalendarCheck2,
      iconColor: 'text-amber-600 bg-amber-50 border-amber-200',
      weight: '35% Model Weight',
    },
    {
      name: 'Voluntary Self-Reports',
      sub: 'Confidential pulse check-ins, subjective fatigue, mood',
      status: 'Voluntary & Firewalled',
      statusColor: 'text-purple-700 bg-purple-50 border-purple-200',
      icon: HeartPulse,
      iconColor: 'text-purple-600 bg-purple-50 border-purple-200',
      weight: '20% Model Weight',
    },
    {
      name: 'Field Biometrics (Optional)',
      sub: 'Wearable sleep latency, autonomic HRV, resting pulse',
      status: 'Edge Filtered / Opt-in',
      statusColor: 'text-cyan-700 bg-cyan-50 border-cyan-200',
      icon: Watch,
      iconColor: 'text-cyan-600 bg-cyan-50 border-cyan-200',
      weight: '15% Model Weight',
    },
  ];

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-cyan-50 border border-cyan-200 text-cyan-700">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-cyan-50 text-cyan-700 border border-cyan-200">
                Data Fusion Architecture
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                &bull; Multi-Source Pipeline
              </span>
            </div>
            <h3 className="text-base font-black text-slate-900 mt-0.5">
              Multi-Source Signal Fusion Flow Indicator
            </h3>
            <p className="text-xs text-slate-500">
              Visual proof of how disparate military HR, shift rosters, self-reports, and optional biometrics safely merge into predictive models.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="px-3 py-1 rounded-xl bg-slate-900 text-cyan-400 font-mono text-xs font-bold flex items-center gap-1.5 border border-cyan-500/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>Fused Inference: XGBoost + SHAP</span>
          </span>
        </div>
      </div>

      {/* Grid of Data Ingestion Streams -> Fusion Output */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 relative">
        {streams.map((stream, idx) => {
          const IconComp = stream.icon;
          return (
            <div
              key={idx}
              className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-2 rounded-xl border ${stream.iconColor}`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border uppercase ${stream.statusColor}`}>
                    {stream.status}
                  </span>
                </div>
                <h4 className="text-xs font-black text-slate-900">{stream.name}</h4>
                <p className="text-[10px] text-slate-500 mt-0.5 leading-snug">{stream.sub}</p>
              </div>

              <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px]">
                <span className="font-bold text-slate-400">Contribution:</span>
                <span className="font-mono font-black text-slate-800">{stream.weight}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Fusion Engine Core Box */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 text-white border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-black text-white flex items-center gap-2">
              <span>Secure Signal Fusion Gateway</span>
              <span className="text-[9px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40">
                Airgapped
              </span>
            </div>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Individual streams are tokenized and anonymized before algorithmic synthesis. No unencrypted cross-silo linkage.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-bold text-emerald-300 font-mono">4 Streams Active &bull; Zero Leaks</span>
        </div>
      </div>
    </div>
  );
};

export default MultiSourceSignalFusionCard;
