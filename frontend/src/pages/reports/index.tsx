import React, { useState, useEffect } from 'react';
import {
  Printer,
} from 'lucide-react';
import { reportService, PersonnelDossierReport } from '../../services/reportService';

export const ReportsPage: React.FC = () => {
  const [dossier, setDossier] = useState<PersonnelDossierReport | null>(null);
  const [selectedUid, setSelectedUid] = useState('UID-EMP-012');

  useEffect(() => {
    reportService.getPersonnelDossier(selectedUid).then(setDossier).catch(console.error);
  }, [selectedUid]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden print:hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                Official Defense Dossiers
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">&bull; Structured Export Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Reports & Readiness Dossiers
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Export verified individual wellness dossiers and formation readiness executive summaries.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-black shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Export PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Select Personnel UID */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card-soft flex items-center justify-between print:hidden">
        <span className="text-xs font-bold text-slate-700 uppercase tracking-wide">Generate Individual Dossier For:</span>
        <select
          value={selectedUid}
          onChange={(e) => setSelectedUid(e.target.value)}
          className="white-input rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-800 cursor-pointer focus:outline-none"
        >
          <option value="UID-EMP-012">UID-EMP-012 — Havildar Ramesh Chand</option>
          <option value="UID-EMP-013">UID-EMP-013 — Subedar Gurpreet Singh</option>
          <option value="UID-EMP-010">UID-EMP-010 — Major Alex Morgan</option>
          <option value="UID-EMP-011">UID-EMP-011 — Captain Sarah Connor</option>
        </select>
      </div>

      {/* Printable Dossier Sheet */}
      {dossier && (
        <div className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-card-soft space-y-6 max-w-4xl mx-auto print:border-none print:shadow-none print:p-0">
          {/* Dossier Header */}
          <div className="border-b border-slate-200 pb-5 flex justify-between items-start">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-700 mb-1">
                INTEGRATED DEFENSE STAFF &bull; STRATEGIC HRMS
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Personnel Wellness & Operational Dossier
              </h2>
              <p className="text-xs font-mono text-slate-500 mt-0.5">Dossier Ref: {dossier.report_id}</p>
            </div>
            <div className="text-right text-xs">
              <span className="font-mono text-rose-700 bg-rose-50 px-2.5 py-1 rounded font-bold border border-rose-200 text-[10px]">
                {dossier.classification}
              </span>
              <p className="text-slate-400 font-mono text-[10px] mt-1">Generated: {new Date(dossier.generated_at).toLocaleString()}</p>
            </div>
          </div>

          {/* Personnel Identity Block */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Full Name</span>
              <p className="font-extrabold text-slate-900 text-sm">{dossier.personnel?.name}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">UID / Regimental</span>
              <p className="font-bold text-slate-800 font-mono">{dossier.personnel?.uid} ({dossier.personnel?.regimental_number})</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Rank & Unit</span>
              <p className="font-bold text-slate-800">{dossier.personnel?.rank} &bull; {dossier.personnel?.unit}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Deployment Readiness</span>
              <p className="font-black text-emerald-700">{dossier.operational_readiness?.readiness_status}</p>
            </div>
          </div>

          {/* Diagnostics Matrix */}
          <div className="space-y-3">
            <h3 className="text-xs font-black text-slate-900 uppercase tracking-wider">Operational Biometric Indicators</h3>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Stress Index</span>
                <div className="text-xl font-black text-rose-600 font-mono">{dossier.operational_readiness?.stress_index}/100</div>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Medical SHAPE</span>
                <div className="text-xl font-black text-slate-900 font-mono">{dossier.operational_readiness?.shape_category}</div>
              </div>
              <div className="p-3 rounded-xl border border-slate-200 text-center">
                <span className="text-[10px] uppercase font-bold text-slate-400">Consecutive Shifts</span>
                <div className="text-xl font-black text-blue-700 font-mono">{dossier.operational_readiness?.consecutive_shifts} Days</div>
              </div>
            </div>
          </div>

          {/* Verification Signoff */}
          <div className="pt-8 border-t border-slate-200 flex justify-between items-end text-xs text-slate-500">
            <div>
              <p className="font-bold text-slate-800">{dossier.generated_by}</p>
              <p className="text-[10px] text-slate-400">Authorized Psychological & Command Reviewer</p>
            </div>
            <div className="text-right font-mono text-[10px] text-emerald-700 font-bold">
              ✓ DIGITALLY VERIFIED VIA DEFENSE HRMS GATEWAY
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
