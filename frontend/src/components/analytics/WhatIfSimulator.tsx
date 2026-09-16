import React, { useState, useEffect } from 'react';
import {
  Sliders,
  TrendingDown,
  Moon,
  ShieldAlert,
  Calendar,
  Compass,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { aiRiskService } from '../../services/aiRiskService';

interface WhatIfSimulatorProps {
  personnelUid?: string;
  initialSleep?: number;
  initialFatigue?: number;
  initialDutyDays?: number;
  initialStress?: number;
  onApplyPlan?: (planSummary: string) => void;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  personnelUid = 'UID-EMP-012',
  initialSleep = 4.5,
  initialFatigue = 8,
  initialDutyDays = 6,
  initialStress = 91.6,
  onApplyPlan,
}) => {
  // Intervention Sliders
  const [extraSleep, setExtraSleep] = useState<number>(2.0);
  const [reduceNightShifts, setReduceNightShifts] = useState<number>(3);
  const [grantLeaveDays, setGrantLeaveDays] = useState<number>(7);
  const [stationReassignment, setStationReassignment] = useState<string>('PEACE_STATION');
  const [counselingHeld, setCounselingHeld] = useState<boolean>(true);

  // Simulation output state
  const [loading, setLoading] = useState<boolean>(false);
  const [simulation, setSimulation] = useState<any>(null);
  const [appliedNotice, setAppliedNotice] = useState<string | null>(null);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await aiRiskService.simulateWhatIf({
        personnel_uid: personnelUid,
        baseline_sleep_hours: initialSleep,
        baseline_fatigue_level: initialFatigue,
        baseline_mood_score: 3,
        baseline_workload_pressure: 8,
        baseline_physical_strain: 7,
        baseline_consecutive_duty_days: initialDutyDays,
        extra_sleep_hours: extraSleep,
        reduce_night_shifts: reduceNightShifts,
        grant_leave_days: grantLeaveDays,
        station_reassignment: stationReassignment,
        counseling_session_held: counselingHeld,
      });
      setSimulation(res.simulation);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [extraSleep, reduceNightShifts, grantLeaveDays, stationReassignment, counselingHeld]);

  const handleApply = () => {
    if (simulation) {
      const summary = `Applied What-If Command Plan: +${extraSleep}h sleep, -${reduceNightShifts} night shifts, ${grantLeaveDays}d leave, ${stationReassignment}. Projected Stress Drop: -${simulation.delta_points} pts.`;
      setAppliedNotice(summary);
      if (onApplyPlan) onApplyPlan(summary);
      setTimeout(() => setAppliedNotice(null), 5000);
    }
  };

  const handleReset = () => {
    setExtraSleep(0);
    setReduceNightShifts(0);
    setGrantLeaveDays(0);
    setStationReassignment('CURRENT');
    setCounselingHeld(false);
  };

  return (
    <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white shadow-xl space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-primary-500/20 border border-primary-500/30 text-primary-400">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-white">"What-If" Counterfactual Intervention Simulator</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Decision Support
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Simulate command reallocations (leave, night shift reduction, restorative sleep) on 30-day risk trajectory.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Dials</span>
        </button>
      </div>

      {appliedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{appliedNotice}</span>
        </div>
      )}

      {/* Grid: Interactive Controls vs Projected Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tactical Command Dials (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-black tracking-wider uppercase text-slate-400 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-primary-400" />
            <span>Tactical Command Adjustment Dials</span>
          </h4>

          {/* Slider 1: Extra Sleep */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <Moon className="w-3.5 h-3.5 text-blue-400" />
                Prescribed Restorative Sleep Recovery
              </span>
              <span className="font-mono font-black text-blue-400">+{extraSleep.toFixed(1)} hrs/night</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="0.5"
              value={extraSleep}
              onChange={(e) => setExtraSleep(parseFloat(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>+0h (No Change)</span>
              <span>+2h (Circadian Re-alignment)</span>
              <span>+4h (Maximum Hospitalization Rest)</span>
            </div>
          </div>

          {/* Slider 2: Night Shifts Reduction */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                Relieve Consecutive Night Sentry Shifts
              </span>
              <span className="font-mono font-black text-amber-400">-{reduceNightShifts} shifts</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={reduceNightShifts}
              onChange={(e) => setReduceNightShifts(parseInt(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (Continuous Watch)</span>
              <span>3 Shifts Relieved</span>
              <span>6 Shifts (Total Stand-Down)</span>
            </div>
          </div>

          {/* Slider 3: Grant Compassionate Leave */}
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-emerald-400" />
                Grant Expedited Compassionate Furlough
              </span>
              <span className="font-mono font-black text-emerald-400">{grantLeaveDays} days leave</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={grantLeaveDays}
              onChange={(e) => setGrantLeaveDays(parseInt(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (No Leave)</span>
              <span>5 Days (Short Rest)</span>
              <span>15 Days (Full Recuperation)</span>
            </div>
          </div>

          {/* Toggles: Station & Counseling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs space-y-1.5">
              <label className="block text-slate-300 font-bold">Duty Station Reassignment</label>
              <select
                value={stationReassignment}
                onChange={(e) => setStationReassignment(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-white text-xs font-semibold focus:outline-none"
              >
                <option value="CURRENT">Maintain Current High-Altitude Post</option>
                <option value="PEACE_STATION">Reassign to Peace Station Base</option>
                <option value="GARRISON_BASE">HQ Garrison Non-Combat Desk</option>
              </select>
            </div>

            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-200 block">Welfare Counseling Debrief</span>
                <span className="text-[10px] text-slate-400">1-on-1 sessions with psychologist</span>
              </div>
              <input
                type="checkbox"
                checked={counselingHeld}
                onChange={(e) => setCounselingHeld(e.target.checked)}
                className="w-4 h-4 accent-primary cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Right: Projected Risk Impact (5 cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                Projected 30-Day Risk Delta
              </span>
              {simulation && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                  simulation.command_feasibility_verdict === 'HIGHLY RECOMMENDED'
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                    : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                }`}>
                  {simulation.command_feasibility_verdict}
                </span>
              )}
            </div>

            {/* Before vs After Scores */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Baseline */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-rose-500/30 text-center space-y-1">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Current Baseline</div>
                <div className="text-2xl font-black text-rose-400 font-mono">
                  {simulation ? simulation.baseline.stress_score : initialStress}
                </div>
                <div className="text-[10px] font-black text-rose-300">
                  {simulation ? simulation.baseline.risk_level : 'CRITICAL'} RISK
                </div>
              </div>

              {/* Simulated */}
              <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-emerald-500/40 text-center space-y-1 shadow-lg shadow-emerald-950/30">
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Simulated</span>
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono">
                  {simulation ? simulation.simulated.stress_score : 18.0}
                </div>
                <div className="text-[10px] font-black text-emerald-300">
                  {simulation ? simulation.simulated.risk_level : 'LOW'} RISK
                </div>
              </div>
            </div>

            {/* Net Delta Badge */}
            {simulation && (
              <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-between text-xs font-bold text-emerald-300">
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-400" />
                  <span>Projected Stress Drop:</span>
                </span>
                <span className="font-mono text-sm font-black text-emerald-400">
                  -{simulation.delta_points} pts (-{simulation.percentage_risk_reduction}%)
                </span>
              </div>
            )}

            {/* Trajectory description */}
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 text-[11px] text-slate-300 leading-relaxed">
              <span className="font-bold text-slate-200 block mb-0.5">30-Day Tactical Forecast:</span>
              {simulation ? simulation.projected_30_day_trajectory : 'Calculating counterfactual trajectory...'}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleApply}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-600 text-white font-black text-xs transition-all shadow-lg shadow-primary/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <span>Adopt Simulated Recommendation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default WhatIfSimulator;
