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
    <div className="p-6 rounded-3xl bg-white border border-slate-200/90 text-slate-800 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-black text-slate-900">"What-If" Counterfactual Intervention Simulator</h3>
              <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                Decision Support
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Simulate command reallocations (leave, night shift reduction, restorative sleep) on 30-day risk trajectory.
            </p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Dials</span>
        </button>
      </div>

      {/* Quick Tactical Preset: 14-Day Deployment Extension Impact Simulator */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-amber-100 border border-amber-300 text-amber-800 shrink-0 mt-0.5">
            <Compass className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                Command Impact Scenario
              </span>
              <span className="text-[10px] font-mono text-slate-500">&bull; Tactical Counterfactual</span>
            </div>
            <p className="text-xs font-bold text-slate-900 mt-0.5">
              "Simulate Impact: What happens to unit fatigue if deployment is extended by 14 days?"
            </p>
            <p className="text-[11px] text-slate-600 mt-0.5">
              Proactive planning: Test operational shift adjustments and rest rotations before signing movement orders.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setExtraSleep(0);
              setReduceNightShifts(0);
              setGrantLeaveDays(0);
              setStationReassignment('CURRENT');
              setCounselingHeld(false);
            }}
            className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-black transition-all cursor-pointer"
          >
            Simulate +14d Overload
          </button>
          <button
            onClick={() => {
              setExtraSleep(2.0);
              setReduceNightShifts(3);
              setGrantLeaveDays(7);
              setStationReassignment('PEACE_STATION');
              setCounselingHeld(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-black transition-all cursor-pointer shadow-sm"
          >
            Apply Mitigation
          </button>
        </div>
      </div>

      {appliedNotice && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{appliedNotice}</span>
        </div>
      )}

      {/* Grid: Interactive Controls vs Projected Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Tactical Command Dials (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <h4 className="text-xs font-black tracking-wider uppercase text-slate-600 flex items-center gap-1.5">
            <Compass className="w-3.5 h-3.5 text-primary" />
            <span>Tactical Command Adjustment Dials</span>
          </h4>

          {/* Slider 1: Extra Sleep */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <Moon className="w-3.5 h-3.5 text-secondary" />
                Prescribed Restorative Sleep Recovery
              </span>
              <span className="font-mono font-black text-secondary">+{extraSleep.toFixed(1)} hrs/night</span>
            </div>
            <input
              type="range"
              min="0"
              max="4"
              step="0.5"
              value={extraSleep}
              onChange={(e) => setExtraSleep(parseFloat(e.target.value))}
              className="w-full accent-secondary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>+0h (No Change)</span>
              <span>+2h (Circadian Re-alignment)</span>
              <span>+4h (Maximum Hospitalization Rest)</span>
            </div>
          </div>

          {/* Slider 2: Night Shifts Reduction */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                Relieve Consecutive Night Sentry Shifts
              </span>
              <span className="font-mono font-black text-amber-700">-{reduceNightShifts} shifts</span>
            </div>
            <input
              type="range"
              min="0"
              max="6"
              step="1"
              value={reduceNightShifts}
              onChange={(e) => setReduceNightShifts(parseInt(e.target.value))}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (Continuous Watch)</span>
              <span>3 Shifts Relieved</span>
              <span>6 Shifts (Total Stand-Down)</span>
            </div>
          </div>

          {/* Slider 3: Grant Compassionate Leave */}
          <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2">
            <div className="flex justify-between text-xs">
              <span className="flex items-center gap-1.5 font-bold text-slate-800">
                <Calendar className="w-3.5 h-3.5 text-primary" />
                Grant Expedited Compassionate Furlough
              </span>
              <span className="font-mono font-black text-primary">{grantLeaveDays} days leave</span>
            </div>
            <input
              type="range"
              min="0"
              max="15"
              step="1"
              value={grantLeaveDays}
              onChange={(e) => setGrantLeaveDays(parseInt(e.target.value))}
              className="w-full accent-primary cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0 (No Leave)</span>
              <span>5 Days (Short Rest)</span>
              <span>15 Days (Full Recuperation)</span>
            </div>
          </div>

          {/* Toggles: Station & Counseling */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-1.5">
              <label className="block text-slate-700 font-bold">Duty Station Reassignment</label>
              <select
                value={stationReassignment}
                onChange={(e) => setStationReassignment(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl px-2.5 py-1.5 text-slate-900 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              >
                <option value="CURRENT">Maintain Current High-Altitude Post</option>
                <option value="PEACE_STATION">Reassign to Peace Station Base</option>
                <option value="GARRISON_BASE">HQ Garrison Non-Combat Desk</option>
              </select>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Welfare Counseling Debrief</span>
                <span className="text-[10px] text-slate-500">1-on-1 sessions with psychologist</span>
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
        <div className="lg:col-span-5 flex flex-col justify-between p-5 rounded-3xl bg-slate-50/90 border border-slate-200/90 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">
                Projected 30-Day Risk Delta
              </span>
              {simulation && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                  simulation.command_feasibility_verdict === 'HIGHLY RECOMMENDED'
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                    : 'bg-secondary/10 text-secondary border-secondary/20'
                }`}>
                  {simulation.command_feasibility_verdict}
                </span>
              )}
            </div>

            {/* Before vs After Scores */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              {/* Baseline */}
              <div className="p-3.5 rounded-2xl bg-white border border-rose-200 text-center space-y-1 shadow-xs">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Current Baseline</div>
                <div className="text-2xl font-black text-rose-600 font-mono">
                  {simulation ? simulation.baseline.stress_score : initialStress}
                </div>
                <div className="text-[10px] font-black text-rose-600">
                  {simulation ? simulation.baseline.risk_level : 'CRITICAL'} RISK
                </div>
              </div>

              {/* Simulated */}
              <div className="p-3.5 rounded-2xl bg-white border border-emerald-200 text-center space-y-1 shadow-xs">
                <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  <span>Simulated</span>
                </div>
                <div className="text-2xl font-black text-emerald-700 font-mono">
                  {simulation ? simulation.simulated.stress_score : 18.0}
                </div>
                <div className="text-[10px] font-black text-emerald-700">
                  {simulation ? simulation.simulated.risk_level : 'LOW'} RISK
                </div>
              </div>
            </div>

            {/* Net Delta Badge */}
            {simulation && (
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs font-bold text-emerald-900">
                <span className="flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-600" />
                  <span>Projected Stress Drop:</span>
                </span>
                <span className="font-mono text-sm font-black text-emerald-700">
                  -{simulation.delta_points} pts (-{simulation.percentage_risk_reduction}%)
                </span>
              </div>
            )}

            {/* Trajectory description */}
            <div className="p-3 rounded-2xl bg-white border border-slate-200 text-[11px] text-slate-700 leading-relaxed">
              <span className="font-bold text-slate-900 block mb-0.5">30-Day Tactical Forecast:</span>
              {simulation ? simulation.projected_30_day_trajectory : 'Calculating counterfactual trajectory...'}
            </div>
          </div>

          {/* Action Button */}
          <button
            onClick={handleApply}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-primary hover:bg-primary-600 text-white font-black text-xs transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
