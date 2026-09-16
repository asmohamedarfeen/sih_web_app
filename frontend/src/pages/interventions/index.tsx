import React, { useState, useEffect } from 'react';
import {
  HandHeart,
  PlusCircle,
  Activity,
  Calendar,
  CheckCircle2,
  FileText,
  UserCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { interventionService, InterventionCase, CounselingSessionItem } from '../../services/interventionService';

export const InterventionsPage: React.FC = () => {
  const [cases, setCases] = useState<InterventionCase[]>([]);
  const [showNewModal, setShowNewModal] = useState(false);
  const [expandedSessionsId, setExpandedSessionsId] = useState<number | null>(null);
  const [activeDebriefCase, setActiveDebriefCase] = useState<InterventionCase | null>(null);

  // Form state for creating new case
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

  // Form state for session debrief
  const [debriefForm, setDebriefForm] = useState({
    counselor_notes: '',
    observed_stress_score: 55,
    coping_rating: 4,
    recovery_status: 'IMPROVING',
    next_review_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  const [submittingDebrief, setSubmittingDebrief] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

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

  const openDebriefModal = (c: InterventionCase) => {
    setActiveDebriefCase(c);
    const baseline = c.pre_intervention_score ?? 80;
    const currentPost = c.post_intervention_score ?? Math.max(25, baseline - 20);
    setDebriefForm({
      counselor_notes: '',
      observed_stress_score: currentPost,
      coping_rating: 4,
      recovery_status: c.recovery_status || 'IMPROVING',
      next_review_date: c.next_review_date || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
  };

  const handleDebriefSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeDebriefCase) return;
    setSubmittingDebrief(true);
    try {
      const updated = await interventionService.logSessionDebrief(activeDebriefCase.id, debriefForm);
      setFeedbackMessage(`Session debrief saved for ${activeDebriefCase.case_number}. Recovery status: ${updated.recovery_status}.`);
      setActiveDebriefCase(null);
      await fetchCases();
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      console.error('Failed to log debrief:', err);
      alert('Error saving session debrief. Check server connection.');
    } finally {
      setSubmittingDebrief(false);
    }
  };

  const getRecoveryBadge = (status?: string) => {
    switch (status) {
      case 'RECOVERED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'IMPROVING':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'RELAPSE_RISK':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'STABLE':
      default:
        return 'bg-amber-100 text-amber-800 border-amber-300';
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
              <span className="text-xs text-slate-500 font-mono font-semibold">&bull; Closed-Loop Intervention & Recovery Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Intervention Management & Recovery Tracking
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Track clinical debriefs, measurable post-intervention recovery deltas, and multi-session counseling milestones.
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

      {feedbackMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-3 text-xs font-bold animate-fade-in shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{feedbackMessage}</span>
        </div>
      )}

      {/* Cases List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {cases.map((c) => {
          const pre = c.pre_intervention_score ?? 80;
          const post = c.post_intervention_score;
          const delta = post !== undefined && post !== null ? pre - post : null;
          const pct = delta !== null && pre > 0 ? Math.round((delta / pre) * 100) : null;
          const sessions: CounselingSessionItem[] = c.sessions_log || [];

          return (
            <div
              key={c.id}
              className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between space-y-4 white-card-hover"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
                    {c.case_number}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {c.recovery_status && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border uppercase tracking-wider ${getRecoveryBadge(c.recovery_status)}`}>
                        {c.recovery_status}
                      </span>
                    )}
                    <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-black border uppercase tracking-wider ${
                      c.status === 'RESOLVED' ? 'bg-success-50 text-success-700 border-success-200' : 'bg-warning-50 text-warning-700 border-warning-200'
                    }`}>
                      {c.status}
                    </span>
                  </div>
                </div>

                <h3 className="font-extrabold text-base text-gray-900">{c.title}</h3>
                <p className="text-xs text-slate-600 font-semibold">{c.personnel_name} ({c.rank}) &bull; <span className="text-slate-400 font-mono">{c.personnel_uid}</span></p>
                <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>
              </div>

              {/* Closed-Loop Recovery Metrics Card */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-2.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                  <span className="flex items-center gap-1">
                    <Activity className="w-3.5 h-3.5 text-primary-600" />
                    Stress Delta & Recovery
                  </span>
                  {delta !== null && (
                    <span className={`px-2 py-0.5 rounded font-black text-[10px] ${
                      delta > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {delta > 0 ? `-${delta} pts (${pct}%)` : `+${Math.abs(delta)} pts`}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2 rounded-xl bg-white border border-slate-200/60 shadow-xs">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Baseline Stress</div>
                    <div className="text-base font-black text-rose-600 font-mono">{pre}/100</div>
                  </div>
                  <div className="p-2 rounded-xl bg-white border border-slate-200/60 shadow-xs">
                    <div className="text-[10px] font-semibold text-slate-400 uppercase">Current Stress</div>
                    <div className="text-base font-black text-blue-600 font-mono">
                      {post !== undefined && post !== null ? `${post}/100` : 'Pending'}
                    </div>
                  </div>
                </div>

                {c.next_review_date && (
                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-medium pt-1 border-t border-slate-200/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      Next Review:
                    </span>
                    <span className="font-bold text-slate-700 font-mono">{c.next_review_date}</span>
                  </div>
                )}
              </div>

              {/* Counseling Sessions History Drawer Toggle */}
              <div>
                <button
                  onClick={() => setExpandedSessionsId(expandedSessionsId === c.id ? null : c.id)}
                  className="w-full py-1.5 px-2.5 rounded-xl bg-slate-100/70 hover:bg-slate-200/70 text-slate-700 text-[11px] font-bold flex items-center justify-between transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-primary-600" />
                    <span>Counseling Debriefs ({sessions.length})</span>
                  </span>
                  {expandedSessionsId === c.id ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>

                {expandedSessionsId === c.id && (
                  <div className="mt-2 p-3 rounded-2xl bg-white border border-slate-200 text-xs space-y-2 max-h-48 overflow-y-auto">
                    {sessions.length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">No counseling sessions logged yet.</p>
                    ) : (
                      sessions.map((s, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-200/50 space-y-1">
                          <div className="flex items-center justify-between text-[10px] font-bold">
                            <span className="text-primary-700">{s.counselor_name || s.counselor || 'Counselor'} &bull; R{s.coping_rating ?? 4}/5</span>
                            <span className="text-slate-400 font-mono">
                              {s.timestamp ? new Date(s.timestamp).toLocaleDateString() : s.date ? new Date(s.date).toLocaleDateString() : 'Recent'}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-600 italic">"{s.notes}"</p>
                          <div className="flex justify-between text-[10px] font-semibold text-slate-500">
                            <span>Observed Score: {s.observed_stress_score ?? s.stress_reading ?? 'N/A'}/100</span>
                            <span className="text-emerald-700 font-bold">{s.recovery_status || 'IMPROVING'}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-slate-100 text-xs text-slate-500 space-y-1 font-medium">
                <div className="flex justify-between">
                  <span>Venue:</span>
                  <span className="font-semibold text-gray-700">{c.venue}</span>
                </div>
                <div className="flex justify-between">
                  <span>Grant Amount:</span>
                  <span className="font-bold text-primary-700 font-mono">₹{c.approved_amount.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-1">
                {/* Action button: Log Counseling Debrief */}
                <button
                  onClick={() => openDebriefModal(c)}
                  className="w-full py-2 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Log Debrief & Recovery Score</span>
                </button>

                {c.status !== 'RESOLVED' ? (
                  <button
                    onClick={() => handleStatusUpdate(c.id, 'RESOLVED')}
                    className="w-full py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold transition-all cursor-pointer"
                  >
                    Mark Case Fully Resolved
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusUpdate(c.id, 'IN_PROGRESS')}
                    className="w-full py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                  >
                    Re-open Case
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Log Counseling Debrief Modal */}
      {activeDebriefCase && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-7 border border-slate-200 shadow-2xl space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-gray-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-primary" />
                <span>Log Session Debrief & Update Recovery</span>
              </h2>
              <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {activeDebriefCase.case_number}
              </span>
            </div>

            <div className="bg-primary-50/60 p-3 rounded-2xl border border-primary-100 text-xs space-y-1">
              <p className="font-bold text-primary-900">{activeDebriefCase.personnel_name} ({activeDebriefCase.rank}) &bull; {activeDebriefCase.personnel_uid}</p>
              <p className="text-slate-600">Baseline Stress Score: <span className="font-mono font-bold text-rose-600">{activeDebriefCase.pre_intervention_score ?? 80}/100</span></p>
            </div>

            <form onSubmit={handleDebriefSubmit} className="space-y-4 text-xs font-semibold text-slate-700">
              <div>
                <label className="block mb-1 text-slate-700">Clinical & Welfare Notes</label>
                <textarea
                  value={debriefForm.counselor_notes}
                  onChange={(e) => setDebriefForm({ ...debriefForm, counselor_notes: e.target.value })}
                  placeholder="Record observations, emotional resilience changes, family conflict progress, sleep improvements..."
                  className="w-full white-input rounded-xl p-3 text-xs focus:outline-none min-h-[90px]"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700">
                    Observed Stress Score: <span className="font-mono font-black text-primary-700">{debriefForm.observed_stress_score}/100</span>
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={debriefForm.observed_stress_score}
                    onChange={(e) => setDebriefForm({ ...debriefForm, observed_stress_score: Number(e.target.value) })}
                    className="w-full accent-primary cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-0.5">
                    <span>10 (Relaxed)</span>
                    <span>100 (Critical)</span>
                  </div>
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">Coping & Resilience (1-5)</label>
                  <select
                    value={debriefForm.coping_rating}
                    onChange={(e) => setDebriefForm({ ...debriefForm, coping_rating: Number(e.target.value) })}
                    className="w-full white-input rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value={1}>1 - Severe Disruption</option>
                    <option value={2}>2 - Guarded / Vulnerable</option>
                    <option value={3}>3 - Moderate Stability</option>
                    <option value={4}>4 - High Functional Recovery</option>
                    <option value={5}>5 - Full Cognitive Readiness</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block mb-1 text-slate-700">Recovery Trajectory</label>
                  <select
                    value={debriefForm.recovery_status}
                    onChange={(e) => setDebriefForm({ ...debriefForm, recovery_status: e.target.value })}
                    className="w-full white-input rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="IMPROVING">IMPROVING (Positive Delta)</option>
                    <option value="STABLE">STABLE (Plateau / Monitoring)</option>
                    <option value="RELAPSE_RISK">RELAPSE_RISK (Regressing)</option>
                    <option value="RECOVERED">RECOVERED (Fit for Regular Duty)</option>
                  </select>
                </div>

                <div>
                  <label className="block mb-1 text-slate-700">Next Review Date</label>
                  <input
                    type="date"
                    value={debriefForm.next_review_date}
                    onChange={(e) => setDebriefForm({ ...debriefForm, next_review_date: e.target.value })}
                    className="w-full white-input rounded-xl px-3 py-1.5 text-xs focus:outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setActiveDebriefCase(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold cursor-pointer"
                  disabled={submittingDebrief}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingDebrief}
                  className="px-5 py-2 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-black shadow-md shadow-primary/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {submittingDebrief ? 'Recording...' : 'Commit Debrief Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

