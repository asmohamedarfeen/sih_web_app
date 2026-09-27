import React, { useState, useEffect } from 'react';
import {
  Layers,
  Sparkles,
  Activity,
  Shield,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  GitCompare,
} from 'lucide-react';
import {
  unitTwinService,
  CompanyTwinData,
  BattalionTwinData,
  UnitComparisonResponse,
  UnitSimulationResponse,
} from '../../services/unitTwinService';

export const UnitTwinPage: React.FC = () => {
  const [battalions, setBattalions] = useState<BattalionTwinData[]>([]);
  const [companies, setCompanies] = useState<CompanyTwinData[]>([]);
  const [selectedUnitA, setSelectedUnitA] = useState<string>('coy-alpha');
  const [selectedUnitB, setSelectedUnitB] = useState<string>('coy-delta');
  const [missionContext, setMissionContext] = useState<string>('Border Patrol');
  const [comparison, setComparison] = useState<UnitComparisonResponse | null>(null);

  // Simulation state
  const [simCompanyId, setSimCompanyId] = useState<string>('coy-delta');
  const [simDays, setSimDays] = useState<number>(30);
  const [simTempo, setSimTempo] = useState<string>('HIGH_INTENSITY');
  const [simulation, setSimulation] = useState<UnitSimulationResponse | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [simLoading, setSimLoading] = useState<boolean>(false);

  // Load initial battalions and companies
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await unitTwinService.getBattalions();
      setBattalions(data);
      if (data.length > 0 && data[0].companies.length > 0) {
        setCompanies(data[0].companies);
      }
    } catch (err) {
      console.error('Failed to load battalion digital twins', err);
    } finally {
      setLoading(false);
    }
  };

  // Run comparison when units or mission change
  useEffect(() => {
    if (selectedUnitA && selectedUnitB && selectedUnitA !== selectedUnitB) {
      handleCompare();
    }
  }, [selectedUnitA, selectedUnitB, missionContext]);

  // Run simulation when sim parameters change
  useEffect(() => {
    if (simCompanyId) {
      handleSimulate();
    }
  }, [simCompanyId, simDays, simTempo]);

  const handleCompare = async () => {
    try {
      const res = await unitTwinService.compareUnits({
        unit_a_id: selectedUnitA,
        unit_b_id: selectedUnitB,
        mission_context: missionContext,
      });
      setComparison(res);
    } catch (err) {
      console.error('Failed to compare units', err);
    }
  };

  const handleSimulate = async () => {
    setSimLoading(true);
    try {
      const res = await unitTwinService.simulateUnit({
        company_id: simCompanyId,
        days: simDays,
        operational_tempo: simTempo,
      });
      setSimulation(res);
    } catch (err) {
      console.error('Failed to run simulation', err);
    } finally {
      setSimLoading(false);
    }
  };

  const getFatigueBadge = (fatigue: string) => {
    switch (fatigue) {
      case 'Low':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200">Low Fatigue</span>;
      case 'Medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">Medium Fatigue</span>;
      case 'High':
      case 'Critical':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">High Fatigue</span>;
      default:
        return null;
    }
  };

  const getMoraleBadge = (morale: string) => {
    switch (morale) {
      case 'Resilient':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary-50 text-primary-700 border border-primary-200">Resilient</span>;
      case 'Stable':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-secondary-50 text-secondary-700 border border-secondary-200">Stable</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-50 text-rose-700 border border-rose-200">Strained</span>;
    }
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
                Formation-Level AI Simulation
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                • Digital Twin Telemetry Active
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Layers className="w-7 h-7 text-primary-600" />
              AI Digital Twin of Every Unit
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl font-medium leading-relaxed">
              Moving beyond individual stress predictions to macro-level formation digital twins: continuously simulating
              readiness, leadership stability, fatigue, and operational friction for entire companies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 shadow-xs transition active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary-600' : 'text-slate-500'}`} />
              Sync Unit Telemetry
            </button>
            <div className="hidden sm:flex flex-col text-right pr-2">
              <span className="text-xs font-black text-slate-900">{battalions[0]?.name || 'Alpha Battalion HQ'}</span>
              <span className="text-[11px] text-slate-500">{battalions[0]?.commanding_officer || 'Col. Kabir Khan'} • {companies.length} Companies</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Company Digital Twins Overview Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wider font-extrabold text-slate-700 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary-600" />
            Battalion Companies • 6-Dimension Unit Digital Twins
          </label>
          <span className="text-xs text-slate-500 font-medium">Click buttons on any card to compare</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {companies.map((c) => {
            const isSelectedA = selectedUnitA === c.id;
            const isSelectedB = selectedUnitB === c.id;
            return (
              <div
                key={c.id}
                className={`bg-white border rounded-2xl p-4 sm:p-5 flex flex-col justify-between transition-all duration-200 shadow-card-soft ${
                  isSelectedA
                    ? 'border-primary-600 ring-2 ring-primary-500/20'
                    : isSelectedB
                    ? 'border-secondary-600 ring-2 ring-secondary-500/20'
                    : 'border-slate-200/90 hover:border-primary-400'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {c.id.toUpperCase()}
                      </span>
                      <h3 className="font-black text-sm text-slate-900 mt-1">{c.name}</h3>
                      <p className="text-[11px] text-slate-500 font-medium">{c.commander_rank} {c.commander_name}</p>
                    </div>
                    {isSelectedA && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-primary-600 text-white">
                        UNIT A
                      </span>
                    )}
                    {isSelectedB && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-secondary-600 text-white">
                        UNIT B
                      </span>
                    )}
                  </div>

                  {/* Readiness Bar */}
                  <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-1.5">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-bold">Readiness</span>
                      <span className="font-black text-slate-900">{c.readiness}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-emerald-500 h-full rounded-full"
                        style={{ width: `${c.readiness}%` }}
                      />
                    </div>
                  </div>

                  {/* The 6 Core Dimensions matching User Specification */}
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Fatigue:</span>
                      {getFatigueBadge(c.fatigue)}
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Training:</span>
                      <span className="font-bold text-slate-800">{c.training}</span>
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Morale:</span>
                      {getMoraleBadge(c.morale)}
                    </div>
                    <div className="flex justify-between items-center py-1 border-b border-slate-100">
                      <span className="text-slate-500 font-medium">Deployment Pressure:</span>
                      <span className={`font-bold ${c.deployment_pressure === 'Surge' ? 'text-rose-700' : 'text-slate-800'}`}>
                        {c.deployment_pressure}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-medium">Leadership:</span>
                      <span className="font-extrabold text-primary-700">{c.leadership_stability}</span>
                    </div>
                  </div>
                </div>

                {/* Compare Selection Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
                  <button
                    onClick={() => setSelectedUnitA(c.id)}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition ${
                      isSelectedA
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    Set as Unit A
                  </button>
                  <button
                    onClick={() => setSelectedUnitB(c.id)}
                    className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg border transition ${
                      isSelectedB
                        ? 'bg-secondary-600 text-white border-secondary-600'
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    Set as Unit B
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Head-to-Head Company Deployment Comparator Workbench */}
      <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-secondary-50 text-secondary-700 border border-secondary-200 uppercase tracking-wider">
                Pre-Deployment Comparator
              </span>
              <span className="text-xs text-slate-500 font-mono">Company A vs Company B</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <GitCompare className="w-5 h-5 text-secondary-600" />
              Operational Planning: Head-to-Head Company Comparison
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-[11px] text-slate-500 font-bold block mb-1">Target Mission Profile</label>
              <select
                value={missionContext}
                onChange={(e) => setMissionContext(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary-500"
              >
                <option value="Border Patrol">Border Patrol (High Vigilance)</option>
                <option value="Counter Insurgency">Counter Insurgency (Combat Cordon)</option>
                <option value="Election Duty">Election Duty (Strategic Preservation)</option>
                <option value="VIP Security">VIP Security (Close Protection)</option>
                <option value="Disaster Relief">Disaster Relief & Flood Evacuation</option>
              </select>
            </div>
          </div>
        </div>

        {/* Selected Company Headers & Overall Verdict */}
        {comparison && (
          <div className="space-y-6">
            {/* AI Operational Recommendation Callout Banner */}
            <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-[#0E231B] via-[#163A2B] to-[#122A21] border border-primary-600/40 text-white shadow-md relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary-500/30 text-emerald-300 border border-primary-400/40">
                      AI OPERATIONAL VERDICT
                    </span>
                    <span className="text-xs text-emerald-200/80 font-mono">
                      {comparison.mission_context} Deployment Matchup
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-black text-white">
                    {comparison.ai_recommendation.comparative_verdict}
                  </h3>

                  <p className="text-sm text-emerald-100 font-medium leading-relaxed max-w-3xl">
                    "{comparison.ai_recommendation.operational_rationale}"
                  </p>

                  <div className="text-xs text-amber-200 bg-amber-500/20 border border-amber-400/40 p-2.5 rounded-xl max-w-fit font-medium">
                    Tactical Mitigation: {comparison.ai_recommendation.tactical_mitigation_note}
                  </div>
                </div>

                {/* Side by side score circles */}
                <div className="flex items-center gap-4 flex-shrink-0">
                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-center min-w-[120px]">
                    <span className="text-[10px] font-mono text-emerald-300 block font-bold uppercase">
                      {comparison.unit_a.name}
                    </span>
                    <span className="text-2xl font-black text-white mt-0.5 block">
                      {comparison.ai_recommendation.deployment_suitability_score_a}%
                    </span>
                    <span className="text-[10px] text-slate-300">Deployment Suitability</span>
                  </div>

                  <div className="text-lg font-black text-slate-400">VS</div>

                  <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-center min-w-[120px]">
                    <span className="text-[10px] font-mono text-blue-300 block font-bold uppercase">
                      {comparison.unit_b.name}
                    </span>
                    <span className="text-2xl font-black text-white mt-0.5 block">
                      {comparison.ai_recommendation.deployment_suitability_score_b}%
                    </span>
                    <span className="text-[10px] text-slate-300">Deployment Suitability</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparison Matrix Table */}
            <div className="border border-slate-200 rounded-2xl overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-mono">
                  <tr>
                    <th className="p-3.5">Unit Digital Twin Dimension</th>
                    <th className="p-3.5 font-bold text-primary-800">{comparison.unit_a.name} (Unit A)</th>
                    <th className="p-3.5 font-bold text-secondary-800">{comparison.unit_b.name} (Unit B)</th>
                    <th className="p-3.5">Operational Advantage</th>
                    <th className="p-3.5">AI Analysis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {comparison.dimension_deltas.map((d) => (
                    <tr key={d.dimension} className="hover:bg-slate-50/80">
                      <td className="p-3.5 font-extrabold text-slate-900">{d.dimension}</td>
                      <td className="p-3.5 font-bold text-slate-800">{d.val_a}</td>
                      <td className="p-3.5 font-bold text-slate-800">{d.val_b}</td>
                      <td className="p-3.5">
                        {d.advantage === 'A' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-primary-50 text-primary-700 border border-primary-200">
                            Unit A Advantage
                          </span>
                        ) : d.advantage === 'B' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-secondary-50 text-secondary-700 border border-secondary-200">
                            Unit B Advantage
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                            Equally Matched
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-slate-600 font-medium">{d.analysis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* 4. Continuous Simulation & Trajectory Forecaster */}
      <div className="p-6 sm:p-7 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-primary-50 text-primary-700 border border-primary-200 uppercase tracking-wider">
                Continuous Operational Simulation
              </span>
              <span className="text-xs text-slate-500 font-mono">Macro Health Decay & Burnout Inflection</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 tracking-tight mt-1 flex items-center gap-2">
              <Activity className={`w-5 h-5 ${simLoading ? 'animate-pulse text-amber-500' : 'text-primary-600'}`} />
              Unit Readiness & Strain Trajectory Forecaster
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div>
              <label className="text-[11px] text-slate-500 font-bold block mb-1">Company</label>
              <select
                value={simCompanyId}
                onChange={(e) => setSimCompanyId(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary-500"
              >
                {companies.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 font-bold block mb-1">Deployment Tempo</label>
              <select
                value={simTempo}
                onChange={(e) => setSimTempo(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-bold text-slate-800 focus:outline-none focus:border-primary-500"
              >
                <option value="STANDARD">Standard Watch (0.25 pts/day)</option>
                <option value="HIGH_INTENSITY">High-Intensity Combat (0.85 pts/day)</option>
                <option value="SURGE_DEPLOYMENT">Surge Cordon (1.35 pts/day)</option>
                <option value="REST_CYCLE">Rest & Refit (+0.65 pts/day Recovery)</option>
              </select>
            </div>

            <div>
              <label className="text-[11px] text-slate-500 font-bold block mb-1">Projection Horizon</label>
              <div className="flex gap-1.5">
                {[14, 30, 60].map((days) => (
                  <button
                    key={days}
                    onClick={() => setSimDays(days)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition ${
                      simDays === days
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {simulation && (
          <div className="space-y-4">
            {/* Simulation Advisory Banner */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${simulation.burnout_risk_day ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'}`}>
                  {simulation.burnout_risk_day ? <AlertTriangle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                </div>
                <div>
                  <div className="font-extrabold text-slate-900 text-sm">
                    {simulation.company_name} • {simulation.operational_tempo.replace('_', ' ')} Tempo
                  </div>
                  <div className="text-slate-600 font-medium mt-0.5">
                    {simulation.recommended_mitigation}
                  </div>
                </div>
              </div>

              {simulation.burnout_risk_day && (
                <div className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-800 border border-rose-200 font-black text-xs self-start sm:self-auto shrink-0">
                  Inflection Alert: Day {simulation.burnout_risk_day}
                </div>
              )}
            </div>

            {/* Projected Timeline Visualizer */}
            <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50">
              <div className="flex justify-between text-xs text-slate-500 font-mono mb-2">
                <span>Day 1: {simulation.projection_timeline[0]?.projected_readiness}% Readiness</span>
                <span>Mid-Mission: {simulation.projection_timeline[Math.floor(simulation.projection_timeline.length / 2)]?.projected_readiness}%</span>
                <span>Day {simDays}: {simulation.projection_timeline[simulation.projection_timeline.length - 1]?.projected_readiness}% Readiness</span>
              </div>

              {/* Sparkline Bar Visualization */}
              <div className="h-16 flex items-end gap-1 pt-2">
                {simulation.projection_timeline.map((pt) => {
                  const heightPct = Math.max(15, (pt.projected_readiness / 100) * 100);
                  const isCritical = pt.projected_readiness < 65;
                  return (
                    <div
                      key={pt.day}
                      className="flex-1 flex flex-col items-center group relative cursor-pointer"
                    >
                      <div
                        className={`w-full rounded-t-sm transition-all duration-150 ${
                          isCritical
                            ? 'bg-rose-500 hover:bg-rose-600'
                            : 'bg-primary-500 hover:bg-primary-600'
                        }`}
                        style={{ height: `${heightPct}%` }}
                      />
                      {/* Tooltip on hover */}
                      <div className="absolute bottom-full mb-1 hidden group-hover:block z-20 bg-slate-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap shadow-lg">
                        Day {pt.day}: {pt.projected_readiness}% ({pt.projected_fatigue})
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2">
                <span>Start Deployment</span>
                <span>Projected Combat Readiness Decay Curve</span>
                <span>Rotation Horizon</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UnitTwinPage;
