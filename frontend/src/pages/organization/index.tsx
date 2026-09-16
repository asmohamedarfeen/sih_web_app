import React from 'react';
import { UnitHierarchyTree } from '../../components/organization/UnitHierarchyTree';

export const OrganizationPage: React.FC = () => {

  return (
    <div className="space-y-6 font-sans">
      {/* Top Welcome Card */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-500/[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-700 border border-emerald-200">
                Defense Echelon Command
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                &bull; Corps &rarr; Division &rarr; Brigade &rarr; Battalion &rarr; Company
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Operational Force Structure &amp; Hierarchy Tree
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Real-time structural hierarchy of active formations. Identify systemic burnout clusters, high-risk observation posts, and troop strength across military echelons.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Troops Indexed</span>
              <span className="text-lg font-black text-slate-900 font-mono">48,500</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Readiness Coefficient</span>
              <span className="text-lg font-black text-emerald-700 font-mono">92.4%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Unit Hierarchy Tree */}
      <UnitHierarchyTree />
    </div>
  );
};

export default OrganizationPage;
