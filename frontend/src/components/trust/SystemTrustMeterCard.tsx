import React from 'react';
import {
  ShieldCheck,
  Users,
  CheckCircle2,
  Lock,
  HeartHandshake,
} from 'lucide-react';

export const SystemTrustMeterCard: React.FC = () => {
  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700">
            <HeartHandshake className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200">
                Participation & Anti-Stigma Audit
              </span>
              <span className="text-xs font-mono text-slate-400">&bull; Article 42-A Protocol</span>
            </div>
            <h3 className="text-base font-black text-slate-900 mt-0.5">
              Voluntary Engagement &amp; System Trust Gauge
            </h3>
            <p className="text-xs text-slate-500">
              Verifies that defense personnel actively use voluntary check-ins without fear of career stigma or promotion penalties.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="px-3 py-1.5 rounded-xl bg-emerald-100/80 text-emerald-800 text-xs font-black flex items-center gap-1.5 border border-emerald-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>High Trust State</span>
          </div>
        </div>
      </div>

      {/* 4 Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Voluntary Check-ins</span>
            <Users className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono mt-1">88.4%</div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">412 / 466 troops active this cycle</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Consent Retention</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-1">95.2%</div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Opt-in retained post-deployment</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Anti-Stigma Index</span>
            <HeartHandshake className="w-3.5 h-3.5 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-amber-700 font-mono mt-1">91.8%</div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Disclosures deemed safe by jawans</p>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-slate-400">Medical Airgap</span>
            <Lock className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-700 font-mono mt-1">100%</div>
          <p className="text-[11px] text-slate-500 font-medium mt-0.5">Zero non-medical data disclosures</p>
        </div>
      </div>

      {/* Trust Ledger Notice */}
      <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="text-slate-200">
            <strong>Confidentiality Safeguard:</strong> The Unit Commander sees only aggregated unit readiness. Personal mental wellness entries remain firewalled solely between the soldier and clinical welfare officers.
          </span>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-white/10 px-2.5 py-1 rounded-xl shrink-0 font-bold">
          SHA-256 Airgapped
        </span>
      </div>
    </div>
  );
};

export default SystemTrustMeterCard;
