import React, { useState, useEffect } from 'react';
import {
  Scale,
  RefreshCw,
  Users,
  Clock,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  X,
  Zap,
  Layers,
  Send,
} from 'lucide-react';
import {
  forceBalancingService,
  ForceBalancingPlan,
  BalancingAction,
  ExecutionReceipt,
} from '../../services/forceBalancingService';

export const ForceBalancingPage: React.FC = () => {
  const [plan, setPlan] = useState<ForceBalancingPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [executing, setExecuting] = useState<boolean>(false);
  const [receipt, setReceipt] = useState<ExecutionReceipt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [authCode, setAuthCode] = useState<string>('CMD-AUTH-BAL-2026');
  const [notes, setNotes] = useState<string>(
    'Approved for 19th Infantry Division deployment roster synchronization.'
  );
  const [viewMode, setViewMode] = useState<'SIDE_BY_SIDE' | 'CURRENT' | 'PROJECTED'>('SIDE_BY_SIDE');

  useEffect(() => {
    loadPlan();
  }, []);

  const loadPlan = async () => {
    setLoading(true);
    try {
      const data = await forceBalancingService.getPlan();
      setPlan(data);
    } catch (err) {
      console.error('Failed to load force balancing plan', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExecute = async () => {
    if (!plan) return;
    setExecuting(true);
    try {
      const res = await forceBalancingService.executePlan({
        plan_id: plan.plan_id,
        commander_authorization_code: authCode,
        notes: notes,
      });
      setReceipt(res);
    } catch (err) {
      console.error('Failed to execute force balancing plan', err);
    } finally {
      setExecuting(false);
    }
  };

  const getActionBadgeColor = (actionType: BalancingAction['action_type']) => {
    switch (actionType) {
      case 'TRANSFER':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'ROTATE':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'DELAY_LEAVE':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'ADVANCE_RELIEF':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getActionIcon = (actionType: BalancingAction['action_type']) => {
    switch (actionType) {
      case 'TRANSFER':
        return <Users className="w-4 h-4 text-blue-600" />;
      case 'ROTATE':
        return <Layers className="w-4 h-4 text-amber-600" />;
      case 'DELAY_LEAVE':
        return <Clock className="w-4 h-4 text-purple-600" />;
      case 'ADVANCE_RELIEF':
        return <Zap className="w-4 h-4 text-emerald-600" />;
      default:
        return <Scale className="w-4 h-4 text-primary-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-primary-50 text-primary-700 border border-primary-200 shadow-xs flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-primary-600" />
                Battalion Equilibrium Engine
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                • Synchronized Multi-Company Optimizer
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Scale className="w-7 h-7 text-primary-600" />
              Adaptive Force Balancing Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl font-medium leading-relaxed">
              Everyone balances individual workloads. This engine balances the <strong>entire force</strong>.
              AI calculates cross-company personnel transfers, unit rotations, leave rescheduling, and relief
              advancements to bring every company into the sustainable optimal readiness band.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-5 py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-md active:scale-95 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Authorize Force Balancing Plan
            </button>
          </div>
        </div>

        {/* Holistic Balance Summary Metrics */}
        {plan && (
          <div className="mt-6 pt-5 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Initial Imbalance Gap
              </div>
              <div className="text-lg font-black text-rose-600 font-mono mt-0.5 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                &plusmn;{plan.initial_variance}% (High Variance)
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Balanced Projected Gap
              </div>
              <div className="text-lg font-black text-emerald-600 font-mono mt-0.5 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                &plusmn;{plan.projected_variance}% (Optimal Corridor)
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Optimal Readiness Band
              </div>
              <div className="text-sm font-extrabold text-slate-800 mt-0.5 font-mono">
                {plan.optimal_band_min}% &mdash; {plan.optimal_band_max}% (Target)
              </div>
            </div>
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Synchronized Actions
              </div>
              <div className="text-sm font-bold text-primary-700 mt-0.5">
                4 Tactical Interventions
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Philosophy & Paradigm Banner */}
      <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#11291E] via-[#1F4533] to-[#15344D] text-white shadow-lg relative overflow-hidden border border-emerald-900/60">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest bg-amber-400/20 text-amber-300 border border-amber-400/30 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                Total Force Optimization
              </span>
              <span className="text-xs text-primary-200/80 font-mono">
                Holistic Battalion Equilibrium
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              &ldquo;Don&apos;t just balance workloads. Balance the entire force.&rdquo;
            </h2>
            <p className="text-xs sm:text-sm text-slate-200 max-w-3xl leading-relaxed">
              When one company runs at 95% while another drops to 68%, individual stress programs fail.
              The AI automatically redistributes operational mass—recommending transfers, rotations, and leave timing
              so the entire brigade stays within peak mission capability without sacrificing jawans.
            </p>
          </div>

          <div className="shrink-0 grid grid-cols-2 gap-3 text-center">
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] font-bold text-amber-300 uppercase">Personnel Shift</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">8 Jawans</div>
            </div>
            <div className="p-3.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
              <div className="text-[10px] font-bold text-emerald-300 uppercase">Equilibrium</div>
              <div className="text-xl font-black text-white font-mono mt-0.5">100% Target</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. The 4 Recommended AI Balancing Actions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Zap className="w-5 h-5 text-primary-600" />
              AI Automatically Recommends (4 Synchronized Actions)
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Calculated dynamically to eliminate operational disparity and prevent isolated unit collapse.
            </p>
          </div>
          <button
            onClick={loadPlan}
            disabled={loading}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {plan && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {plan.recommended_actions.map((act) => (
              <div
                key={act.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide border flex items-center gap-1.5 ${getActionBadgeColor(
                        act.action_type
                      )}`}
                    >
                      {getActionIcon(act.action_type)}
                      {act.action_type.replace('_', ' ')}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-slate-400">
                      {act.urgency}
                    </span>
                  </div>

                  <h4 className="text-base font-black text-slate-900 tracking-tight">
                    {act.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed font-medium">
                    {act.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100">
                  <div className="text-[10px] font-bold uppercase text-slate-400">
                    Operational Impact
                  </div>
                  <div className="text-xs font-semibold text-primary-800 mt-0.5">
                    {act.impact_summary}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Current vs. Projected Force Equilibrium Matrix */}
      <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-card-soft">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary-600" />
              Company Readiness Transformation &amp; Optimal Band Target
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Every company is guided into the optimal readiness band (80% &ndash; 88%) without sacrificing overall mission power.
            </p>
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 text-xs font-bold">
            <button
              onClick={() => setViewMode('SIDE_BY_SIDE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'SIDE_BY_SIDE'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Side-by-Side
            </button>
            <button
              onClick={() => setViewMode('CURRENT')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'CURRENT'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Current (Imbalanced)
            </button>
            <button
              onClick={() => setViewMode('PROJECTED')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'PROJECTED'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              AI Balanced Result
            </button>
          </div>
        </div>

        {plan && (
          <div className="space-y-4">
            {plan.projected_outcomes.map((outcome) => {
              const initUnit = plan.units_initial.find((u) => u.unit_id === outcome.unit_id);
              const initReadiness = outcome.initial_readiness;
              const projReadiness = outcome.projected_readiness;

              return (
                <div
                  key={outcome.unit_id}
                  className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-slate-300 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center font-black text-sm text-slate-800 shadow-2xs">
                        {outcome.unit_name.split(' ')[1]?.[0] || 'C'}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">
                          {outcome.unit_name}
                        </div>
                        <div className="text-[11px] font-semibold text-slate-500">
                          {initUnit?.status_label} &bull; {initUnit?.headcount} Jawans
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Current Readiness */}
                      {(viewMode === 'SIDE_BY_SIDE' || viewMode === 'CURRENT') && (
                        <div className="text-right">
                          <div className="text-[10px] font-bold uppercase text-slate-400">
                            Current
                          </div>
                          <div
                            className={`text-base font-black font-mono ${
                              initReadiness > 90
                                ? 'text-amber-600'
                                : initReadiness < 75
                                ? 'text-rose-600'
                                : 'text-slate-800'
                            }`}
                          >
                            {initReadiness}%
                          </div>
                        </div>
                      )}

                      {viewMode === 'SIDE_BY_SIDE' && (
                        <div className="text-slate-400">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}

                      {/* Balanced Projected */}
                      {(viewMode === 'SIDE_BY_SIDE' || viewMode === 'PROJECTED') && (
                        <div className="text-right">
                          <div className="text-[10px] font-bold uppercase text-emerald-600">
                            AI Balanced
                          </div>
                          <div className="text-base font-black font-mono text-emerald-700 flex items-center gap-1">
                            {projReadiness}%
                            <span className="text-xs font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-800">
                              {outcome.delta > 0 ? `+${outcome.delta}%` : `${outcome.delta}%`}
                            </span>
                          </div>
                        </div>
                      )}

                      <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-emerald-50 text-emerald-800 border border-emerald-200 shadow-2xs flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        In Optimal Band
                      </span>
                    </div>
                  </div>

                  {/* Progress / Readiness Bar with 80%-88% Guideline */}
                  <div className="relative pt-2">
                    <div className="flex justify-between text-[10px] text-slate-400 font-mono mb-1">
                      <span>0%</span>
                      <span className="text-emerald-700 font-bold">
                        Target Band: 80% &ndash; 88%
                      </span>
                      <span>100%</span>
                    </div>

                    <div className="h-3 w-full bg-slate-200 rounded-full relative overflow-hidden">
                      {/* Target Optimal Band Shading */}
                      <div
                        className="absolute top-0 bottom-0 bg-emerald-200/50 border-x border-emerald-400"
                        style={{ left: '80%', width: '8%' }}
                      />

                      {/* Current Readiness Bar */}
                      {(viewMode === 'SIDE_BY_SIDE' || viewMode === 'CURRENT') && (
                        <div
                          className={`h-full rounded-full transition-all duration-500 opacity-60 ${
                            initReadiness > 90
                              ? 'bg-amber-500'
                              : initReadiness < 75
                              ? 'bg-rose-500'
                              : 'bg-slate-500'
                          }`}
                          style={{ width: `${initReadiness}%` }}
                        />
                      )}

                      {/* Projected Readiness Marker */}
                      {(viewMode === 'SIDE_BY_SIDE' || viewMode === 'PROJECTED') && (
                        <div
                          className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                          style={{
                            width: `${projReadiness}%`,
                            opacity: viewMode === 'SIDE_BY_SIDE' ? 0.9 : 1,
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Authorization & Execution Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-2xl max-w-xl w-full p-6 sm:p-7 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wide bg-primary-50 text-primary-700 border border-primary-200">
                Command Order Dispatch
              </span>
              <span className="text-xs font-mono text-slate-400">
                Operational Roster Synchronization
              </span>
            </div>

            <h3 className="text-xl font-black text-slate-900 tracking-tight">
              Authorize Force Balancing Plan
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              This action will transmit synchronized transfer, rotation, leave, and relief orders to all 4 company commands.
            </p>

            <div className="space-y-4 my-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Commander Authorization Passcode
                </label>
                <input
                  type="text"
                  value={authCode}
                  onChange={(e) => setAuthCode(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-mono text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Brigade Tactical Notes &amp; Standing Orders
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs sm:text-sm text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-primary-500 font-medium"
                />
              </div>

              {receipt && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      Orders Dispatched Successfully
                    </span>
                    <span className="text-xs font-mono font-bold text-emerald-700">
                      {receipt.order_id}
                    </span>
                  </div>
                  <p className="text-xs text-emerald-900 font-medium">{receipt.message}</p>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-all"
              >
                Close
              </button>

              {!receipt ? (
                <button
                  onClick={handleExecute}
                  disabled={executing}
                  className="px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs transition-all flex items-center gap-2 shadow-xs disabled:opacity-60 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {executing ? 'Dispatching Orders...' : 'Authorize & Transmit Orders'}
                </button>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Synchronized Across Brigade
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForceBalancingPage;
