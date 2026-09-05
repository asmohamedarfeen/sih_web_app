import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  X,
} from 'lucide-react';
import { personnelService, PersonnelRecord } from '../../services/personnelService';

export const PersonnelPage: React.FC = () => {
  const [personnel, setPersonnel] = useState<PersonnelRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [riskFilter, setRiskFilter] = useState('');
  const [selectedPersonnel, setSelectedPersonnel] = useState<PersonnelRecord | null>(null);

  const fetchPersonnel = async () => {
    setIsLoading(true);
    try {
      const data = await personnelService.getPersonnelList({
        search: search || undefined,
        risk_level: riskFilter || undefined,
      });
      setPersonnel(data);
    } catch (err) {
      console.error('Failed to load personnel list:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPersonnel();
  }, [riskFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPersonnel();
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'CRITICAL':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'HIGH':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'MODERATE':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      default:
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/60 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                HRMS Force Directory
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">&bull; Verified Service Personnel</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Personnel Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Verified defense personnel registry with real-time biometric wellness telemetry, active deployments, and service records.
            </p>
          </div>

          <button
            onClick={fetchPersonnel}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 text-blue-600 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Roster</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col sm:flex-row gap-3 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, UID, or regimental number..."
            className="w-full white-input rounded-xl pl-10 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </form>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={riskFilter}
            onChange={(e) => setRiskFilter(e.target.value)}
            className="white-input rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="">All Risk Levels</option>
            <option value="CRITICAL">Critical Risk</option>
            <option value="HIGH">High Risk</option>
            <option value="MODERATE">Moderate Risk</option>
            <option value="LOW">Low Risk (Nominal)</option>
          </select>
        </div>
      </div>

      {/* Personnel Table */}
      <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-[11px] font-black text-slate-400 uppercase tracking-wider">
              <th className="pb-3 px-3">Personnel / UID</th>
              <th className="pb-3 px-3">Rank & Branch</th>
              <th className="pb-3 px-3">Assigned Unit</th>
              <th className="pb-3 px-3">Medical SHAPE</th>
              <th className="pb-3 px-3">Stress Score</th>
              <th className="pb-3 px-3">Risk Level</th>
              <th className="pb-3 px-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs font-medium">
            {personnel.map((p) => (
              <tr key={p.uid} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3.5 px-3">
                  <div className="font-extrabold text-sm text-slate-900">{p.name}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[10px] font-mono font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                      {p.uid}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{p.regimental_number}</span>
                  </div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-bold text-slate-800">{p.rank}</div>
                  <div className="text-[11px] text-slate-500">{p.branch}</div>
                </td>
                <td className="py-3.5 px-3">
                  <div className="font-semibold text-slate-800">{p.unit}</div>
                  <div className="text-[10px] text-slate-400">Counselor: {p.counselor_assigned}</div>
                </td>
                <td className="py-3.5 px-3">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-slate-100 text-slate-700 border border-slate-200">
                    {p.medical_category}
                  </span>
                </td>
                <td className="py-3.5 px-3 font-mono font-black text-sm text-slate-900">
                  {p.stress_score}<span className="text-[10px] text-slate-400 font-normal">/100</span>
                </td>
                <td className="py-3.5 px-3">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black border tracking-wider ${getRiskBadge(p.risk_level)}`}>
                    {p.risk_level}
                  </span>
                </td>
                <td className="py-3.5 px-3 text-right">
                  <button
                    onClick={() => setSelectedPersonnel(p)}
                    className="px-3 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-200 flex items-center gap-1.5 transition-all inline-flex cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Dossier</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Dossier Modal */}
      {selectedPersonnel && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-7 border border-slate-200 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedPersonnel(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600 font-black text-lg shrink-0">
                {selectedPersonnel.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-slate-900">{selectedPersonnel.name}</h2>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border ${getRiskBadge(selectedPersonnel.risk_level)}`}>
                    {selectedPersonnel.risk_level}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-semibold mt-0.5">
                  {selectedPersonnel.rank} &bull; {selectedPersonnel.branch} &bull; <span className="font-mono text-blue-700">{selectedPersonnel.uid}</span> ({selectedPersonnel.regimental_number})
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Medical SHAPE</span>
                <p className="text-sm font-black text-slate-900 font-mono mt-0.5">{selectedPersonnel.medical_category}</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Sleep Avg</span>
                <p className="text-sm font-black text-slate-900 font-mono mt-0.5">{selectedPersonnel.sleep_hours}h / night</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Shift Days</span>
                <p className="text-sm font-black text-slate-900 font-mono mt-0.5">{selectedPersonnel.consecutive_duty_days} Days</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Fatigue Level</span>
                <p className="text-sm font-black text-rose-600 font-mono mt-0.5">{selectedPersonnel.fatigue_level}/10</p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
              <span className="font-extrabold uppercase tracking-wide text-[10px] text-amber-800 block mb-1">
                AI Diagnostic Telemetry Flag
              </span>
              <p className="font-medium">{selectedPersonnel.trigger_factor}</p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setSelectedPersonnel(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonnelPage;
