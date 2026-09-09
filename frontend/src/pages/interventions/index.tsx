import React, { useState, useEffect } from 'react';
import {
  HandHeart,
  PlusCircle,
} from 'lucide-react';
import { interventionService, InterventionCase } from '../../services/interventionService';

export const InterventionsPage: React.FC = () => {
  const [cases, setCases] = useState<InterventionCase[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newCase, setNewCase] = useState({
    personnel_uid: 'UID-EMP-012',
    category: 'Operational Fatigue Counseling',
    urgency: 'HIGH',
    title: 'Cognitive Recovery Protocol & Rest Rotation',
    description: 'Post-high-tempo deployment strain mitigation',
    action_plan: '48h mandatory rest cycle + follow-up session',
    requested_amount: 10000,
    counseling_date: 'Tomorrow 10:00 AM',
    venue: 'Welfare Wing Suite 1',
  });

  const fetchCases = async () => {
    try {
      const data = await interventionService.getInterventions();
      setCases(data);
    } catch (err) {
      console.error('Failed to load interventions:', err);
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const handleCreateCase = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await interventionService.createIntervention(newCase);
      setShowNewModal(false);
      fetchCases();
    } catch (err) {
      console.error('Failed to create case:', err);
    }
  };

  const handleStatusUpdate = async (id: number, status: string) => {
    try {
      await interventionService.updateStatus(id, status, 'Status updated by Welfare Officer');
      fetchCases();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-primary-50 text-primary-700 border border-primary-200 shadow-sm">
                Clinical Welfare Support
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">&bull; Active Interventions & Grants</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Intervention Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Track clinical debriefs, financial compassionate grants, and structured counseling workflows.
            </p>
          </div>

          <button
            onClick={() => setShowNewModal(true)}
            className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-extrabold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all cursor-pointer self-start sm:self-auto"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Initiate Intervention Case</span>
          </button>
        </div>
      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cases.map((c) => (
          <div
            key={c.id}
            className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between space-y-4 white-card-hover"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
                  {c.case_number}
                </span>
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border uppercase tracking-wider ${
                  c.status === 'RESOLVED' ? 'bg-success-50 text-success-700 border-success-200' : 'bg-warning-50 text-warning-700 border-warning-200'
                }`}>
                  {c.status}
                </span>
              </div>

              <h3 className="font-extrabold text-base text-gray-900">{c.title}</h3>
              <p className="text-xs text-slate-600 font-semibold">{c.personnel_name} ({c.rank}) &bull; <span className="text-slate-400 font-mono">{c.personnel_uid}</span></p>
              <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
            </div>

            <div className="pt-3 border-t border-slate-100 text-xs text-slate-500 space-y-1 font-medium">
              <div className="flex justify-between">
                <span>Venue:</span>
                <span className="font-semibold text-gray-700">{c.venue}</span>
              </div>
              <div className="flex justify-between">
                <span>Grant Amount:</span>
                <span className="font-bold text-primary-700 font-mono">₹{c.approved_amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              {c.status !== 'RESOLVED' ? (
                <button
                  onClick={() => handleStatusUpdate(c.id, 'RESOLVED')}
                  className="w-full py-2 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  Mark Resolved
                </button>
              ) : (
                <button
                  onClick={() => handleStatusUpdate(c.id, 'IN_PROGRESS')}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Re-open Case
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Case Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 border border-slate-200 shadow-2xl space-y-5">
            <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
              <HandHeart className="w-5 h-5 text-primary" />
              <span>Initiate Welfare Intervention Case</span>
            </h2>

            <form onSubmit={handleCreateCase} className="space-y-3.5 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1">Personnel UID</label>
                <select
                  value={newCase.personnel_uid}
                  onChange={(e) => setNewCase({ ...newCase, personnel_uid: e.target.value })}
                  className="w-full white-input rounded-xl px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="UID-EMP-012">UID-EMP-012 — Havildar Ramesh Chand</option>
                  <option value="UID-EMP-013">UID-EMP-013 — Subedar Gurpreet Singh</option>
                  <option value="UID-EMP-010">UID-EMP-010 — Major Alex Morgan</option>
                  <option value="UID-EMP-011">UID-EMP-011 — Captain Sarah Connor</option>
                </select>
              </div>

              <div>
                <label className="block mb-1">Case Title</label>
                <input
                  type="text"
                  value={newCase.title}
                  onChange={(e) => setNewCase({ ...newCase, title: e.target.value })}
                  className="w-full white-input rounded-xl px-3 py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div>
                <label className="block mb-1">Category & Action Plan</label>
                <input
                  type="text"
                  value={newCase.action_plan}
                  onChange={(e) => setNewCase({ ...newCase, action_plan: e.target.value })}
                  className="w-full white-input rounded-xl px-3 py-2 text-sm focus:outline-none"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowNewModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-black cursor-pointer"
                >
                  Open Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterventionsPage;
