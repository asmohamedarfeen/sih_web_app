import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Layers,
  ArrowRight,
  Activity,
  HelpCircle,
  Zap,
} from 'lucide-react';
import {
  missionImpactService,
  MissionImpactPreset,
  MissionImpactSimulationResponse,
} from '../../services/missionImpactService';

export const MissionImpactPage: React.FC = () => {
  const [presets, setPresets] = useState<MissionImpactPreset[]>([]);
  const [selectedPresetId, setSelectedPresetId] = useState<string>('deploy-bravo-30d');

  // Decision Form State
  const [unitId, setUnitId] = useState<string>('coy-bravo');
  const [subUnit, setSubUnit] = useState<string>('None');
  const [additionalDays, setAdditionalDays] = useState<number>(30);
  const [rotationStrategy, setRotationStrategy] = useState<string>('NO_ROTATION');
  const [rotationDay, setRotationDay] = useState<number>(15);
  const [threatLevel, setThreatLevel] = useState<string>('STANDARD');

  const [loading, setLoading] = useState<boolean>(false);
  const [simulation, setSimulation] = useState<MissionImpactSimulationResponse | null>(null);

  // Load presets on mount
  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const data = await missionImpactService.getPresets();
        setPresets(data);
      } catch (err) {
        console.error('Failed to load presets', err);
      }
    };
    fetchPresets();
  }, []);

  // Run simulation on parameters change
  useEffect(() => {
    runSimulation();
  }, [unitId, subUnit, additionalDays, rotationStrategy, rotationDay, threatLevel]);

  const runSimulation = async () => {
    setLoading(true);
    try {
      const res = await missionImpactService.simulateDecision({
        unit_id: unitId,
        sub_unit: subUnit === 'None' ? null : subUnit,
        additional_deployment_days: additionalDays,
        rotation_strategy: rotationStrategy,
        rotation_day: rotationDay,
        operational_threat_level: threatLevel,
      });
      setSimulation(res);
    } catch (err) {
      console.error('Failed to run simulation', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyPreset = (preset: MissionImpactPreset) => {
    setSelectedPresetId(preset.id);
    setUnitId(preset.unit_id);
    setSubUnit(preset.sub_unit || 'None');
    setAdditionalDays(preset.additional_deployment_days);
    setRotationStrategy(preset.rotation_strategy);
    if (preset.rotation_day) {
      setRotationDay(preset.rotation_day);
    }
    setThreatLevel(preset.operational_threat_level);
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-50/60 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-primary-50 text-primary-700 border border-primary-200 shadow-xs flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-primary-600" />
                Command Decision Support
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                • What-If Tactical Engine Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Zap className="w-7 h-7 text-primary-600" />
              Mission Impact Simulator
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl font-medium leading-relaxed">
              Don't just predict stress: simulate the exact consequences of deployment decisions before issuing orders.
              Evaluate readiness drops, burnout inflection points, leave surges, and predicted recovery times.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={runSimulation}
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-primary-700/20 transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Simulate Decision
            </button>
          </div>
        </div>
      </div>

      {/* 2. Preset Commander Questions (One-Click Scenarios) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wider font-extrabold text-slate-700 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-primary-600" />
            Commander Questions • One-Click Tactical Scenarios
          </label>
          <span className="text-xs text-slate-500 font-medium">Select a dilemma to simulate</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {presets.map((preset) => {
            const isSelected = selectedPresetId === preset.id;
            return (
              <button
                key={preset.id}
                onClick={() => handleApplyPreset(preset)}
                className={`text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-primary-50/70 border-2 border-primary-600 shadow-md ring-1 ring-primary-500/20'
                    : 'bg-white border-slate-200/90 hover:border-primary-400 hover:shadow-card-soft'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                        preset.id === 'deploy-bravo-30d'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : preset.id === 'rotate-platoon-3-15d'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-secondary-50 text-secondary-700 border border-secondary-200'
                      }`}
                    >
                      {preset.id === 'deploy-bravo-30d' ? 'FATIGUE EXTENSION' : preset.id === 'rotate-platoon-3-15d' ? 'TACTICAL ROTATION' : 'HIGH ALTITUDE SURGE'}
                    </span>
                    <span className="text-xs font-mono text-slate-500">{preset.additional_deployment_days} Days</span>
                  </div>

                  <h3 className="font-black text-sm text-slate-900 leading-snug">
                    "{preset.title}"
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                  <span className="text-primary-700 font-bold flex items-center gap-1">
                    Simulate Scenario <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                  <span className="text-slate-400 font-mono text-[10px]">
                    {preset.sub_unit ? preset.sub_unit : 'Entire Coy'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Interactive Decision Sandbox Form */}
      <div className="bg-white border border-slate-200/90 shadow-card-soft rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Layers className="w-4 h-4 text-primary-600" />
            Decision Parameters Sandbox
          </h2>
          <span className="text-xs text-slate-500 font-mono">Custom Operational Scenario</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-slate-600 font-bold block mb-1.5">Target Unit Formation</label>
            <select
              value={unitId}
              onChange={(e) => {
                setUnitId(e.target.value);
                setSelectedPresetId('custom');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary-500"
            >
              <option value="coy-bravo">Bravo Company (High Current Fatigue)</option>
              <option value="coy-delta">Delta Company (82% Baseline)</option>
              <option value="coy-alpha">Alpha Company (88% Mountain Elite)</option>
              <option value="coy-charlie">Charlie Company (79% Baseline)</option>
              <option value="coy-echo">Echo Company (91% Strategic Reserve)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-600 font-bold block mb-1.5">Sub-Unit (Platoon Level)</label>
            <select
              value={subUnit}
              onChange={(e) => {
                setSubUnit(e.target.value);
                setSelectedPresetId('custom');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary-500"
            >
              <option value="None">Entire Company (All 3 Platoons)</option>
              <option value="Platoon 1">Platoon 1 (Forward Sentry)</option>
              <option value="Platoon 2">Platoon 2 (Tactical Quick Reaction)</option>
              <option value="Platoon 3">Platoon 3 (Watch Vigil Team)</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-slate-600 font-bold block mb-1.5">
              Additional Deployment Duration: <span className="text-primary-700 font-black">{additionalDays} Days</span>
            </label>
            <input
              type="range"
              min="7"
              max="60"
              step="1"
              value={additionalDays}
              onChange={(e) => {
                setAdditionalDays(Number(e.target.value));
                setSelectedPresetId('custom');
              }}
              className="w-full accent-primary-600"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>7 Days</span>
              <span>30 Days</span>
              <span>60 Days</span>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-600 font-bold block mb-1.5">Rotation & Mitigation Strategy</label>
            <select
              value={rotationStrategy}
              onChange={(e) => {
                setRotationStrategy(e.target.value);
                setSelectedPresetId('custom');
              }}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary-500"
            >
              <option value="NO_ROTATION">No Rotation (Continuous Sentry)</option>
              <option value="ROTATE_PLATOON_15D">Rotate Platoon After 15 Days</option>
              <option value="CIRCADIAN_REST">Enforce 8h Circadian Rest Cycle</option>
              <option value="STAGGERED_WATCH">Staggered Shift Watch Rebalance</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Four Core Impact Metric Cards */}
      {simulation && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Metric 1: Expected Readiness */}
          <div className="bg-white border border-slate-200/90 shadow-card-soft rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">Expected Readiness</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 ${
                    simulation.readiness_metric.direction === 'UP'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {simulation.readiness_metric.direction === 'UP' ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                  {simulation.readiness_metric.delta > 0 ? `+${simulation.readiness_metric.delta}%` : `${simulation.readiness_metric.delta}%`}
                </span>
              </div>

              <div className="text-3xl font-black text-slate-900 mt-1">
                {simulation.readiness_metric.projected_value}%
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Baseline: <span className="font-semibold text-slate-700">{simulation.readiness_metric.baseline_value}%</span>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Readiness Trajectory</span>
              <span className={`font-bold ${simulation.readiness_metric.direction === 'UP' ? 'text-emerald-700' : 'text-rose-700'}`}>
                {simulation.readiness_metric.direction === 'UP' ? 'Maintained / Surging' : 'Degrading Under Fatigue'}
              </span>
            </div>
          </div>

          {/* Metric 2: Expected Burnout */}
          <div className="bg-white border border-slate-200/90 shadow-card-soft rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">Expected Burnout Rate</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 ${
                    simulation.burnout_metric.direction === 'DOWN'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border border-rose-200'
                  }`}
                >
                  {simulation.burnout_metric.direction === 'DOWN' ? <TrendingDown className="w-3.5 h-3.5" /> : <TrendingUp className="w-3.5 h-3.5" />}
                  {simulation.burnout_metric.delta > 0 ? `+${simulation.burnout_metric.delta}%` : `${simulation.burnout_metric.delta}%`}
                </span>
              </div>

              <div className="text-3xl font-black text-slate-900 mt-1">
                {simulation.burnout_metric.projected_value}%
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Baseline: <span className="font-semibold text-slate-700">{simulation.burnout_metric.baseline_value}%</span>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Psychological Strain</span>
              <span className={`font-bold ${simulation.burnout_metric.direction === 'DOWN' ? 'text-emerald-700' : 'text-rose-700'}`}>
                {simulation.burnout_metric.direction === 'DOWN' ? 'Averted via Rotation' : 'Burnout Surge Alert'}
              </span>
            </div>
          </div>

          {/* Metric 3: Expected Leave Requests */}
          <div className="bg-white border border-slate-200/90 shadow-card-soft rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">Expected Leave Requests</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-black flex items-center gap-1 ${
                    simulation.leave_requests_metric.direction === 'DOWN'
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-amber-50 text-amber-800 border border-amber-200'
                  }`}
                >
                  {simulation.leave_requests_metric.direction === 'UP' ? '↑ Surge' : '↓ Controlled'}
                </span>
              </div>

              <div className="text-3xl font-black text-slate-900 mt-1">
                {simulation.leave_requests_metric.projected_value}
                <span className="text-xs font-normal text-slate-400 ml-1">requests</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Baseline: <span className="font-semibold text-slate-700">{simulation.leave_requests_metric.baseline_value} requests</span>
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Personnel Morale Drift</span>
              <span className={`font-bold ${simulation.leave_requests_metric.direction === 'DOWN' ? 'text-emerald-700' : 'text-amber-800'}`}>
                {simulation.leave_requests_metric.delta > 0 ? `+${simulation.leave_requests_metric.delta} Emergency Filings` : 'Stable Approval Pace'}
              </span>
            </div>
          </div>

          {/* Metric 4: Predicted Recovery Time */}
          <div className="bg-white border border-slate-200/90 shadow-card-soft rounded-2xl p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-500">Predicted Recovery Time</span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-black bg-secondary-50 text-secondary-700 border border-secondary-200">
                  Peace Station Refit
                </span>
              </div>

              <div className="text-3xl font-black text-slate-900 mt-1 flex items-baseline gap-1">
                {simulation.predicted_recovery_time_days}
                <span className="text-xs font-normal text-slate-400">Days</span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                Post-Mission Turnover Requirement
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
              <span>Refit Penalty</span>
              <span className={`font-bold ${simulation.predicted_recovery_time_days <= 6 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {simulation.predicted_recovery_time_days <= 6 ? 'Rapid Turnover (4-6d)' : `${simulation.predicted_recovery_time_days} Days Rest Required`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 5. AI Tactical Assessment & Operational Guidance Callout Banner */}
      {simulation && (
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0E231B] via-[#163A2B] to-[#122A21] border border-primary-600/40 p-6 md:p-7 text-white shadow-md">
          <div className="relative z-10 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary-500/30 text-emerald-300 border border-primary-400/40">
                  AI DECISION IMPACT VERDICT
                </span>
                <span className="text-xs text-emerald-200/80 font-mono">
                  {simulation.scenario_title}
                </span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                    simulation.mission_capability === 'Maintained'
                      ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-400/40'
                      : 'bg-rose-500/30 text-rose-300 border border-rose-400/40'
                  }`}
                >
                  {simulation.mission_capability === 'Maintained'
                    ? 'Mission Capability Maintained'
                    : 'Mission Capability Degraded'}
                </span>
                <span className="px-2.5 py-1 rounded-xl bg-white/10 text-white font-mono font-bold text-xs">
                  Score: {simulation.decision_score}/100
                </span>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl font-black text-white">
              {simulation.recommendation_headline}
            </h2>

            <div className="p-4 rounded-xl bg-black/30 border border-emerald-500/30 backdrop-blur-xs">
              <p className="text-sm font-semibold text-emerald-200 leading-relaxed italic">
                "{simulation.ai_tactical_assessment}"
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
              <span className="font-bold text-white">Alternative Scenario Comparison: </span>
              {simulation.counter_scenario_summary}
            </div>
          </div>
        </div>
      )}

      {/* 6. Projected Timeline & Trajectory Progression Visualizer */}
      {simulation && (
        <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-primary-600" />
                Continuous Readiness Progression Curve ({simulation.projection_curve.length} Day Simulation Horizon)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Simulated daily combat capability under the selected decision parameters.
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-primary-600 inline-block" />
                Readiness Score
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                Burnout Critical
              </span>
            </div>
          </div>

          <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
            <div className="h-20 flex items-end gap-1 pt-2">
              {simulation.projection_curve.map((pt) => {
                const heightPct = Math.max(12, pt.readiness);
                const isCritical = pt.readiness < 65;
                return (
                  <div
                    key={pt.day}
                    className="flex-1 flex flex-col items-center group relative cursor-pointer"
                  >
                    <div
                      className={`w-full rounded-t-sm transition-all duration-150 ${
                        isCritical
                          ? 'bg-rose-500 hover:bg-rose-600'
                          : 'bg-primary-600 hover:bg-primary-700'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                    <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 bg-slate-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap shadow-lg">
                      Day {pt.day}: {pt.readiness}% Readiness • {pt.burnout_rate}% Burnout
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2">
              <span>Day 1: Start Order</span>
              <span>Mid-Tour Inflection Check</span>
              <span>Day {simulation.projection_curve.length}: Projected Status</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionImpactPage;
