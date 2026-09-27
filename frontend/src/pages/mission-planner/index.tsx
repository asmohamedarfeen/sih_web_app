import React, { useState, useEffect } from 'react';
import {
  Shield,
  Compass,
  Users,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  RefreshCw,
  Award,
  TrendingUp,
  TrendingDown,
  Moon,
  Printer,
  X,
  ShieldAlert,
  Flame,
  LifeBuoy,
  Vote,
  Crosshair,
  GraduationCap,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import {
  missionService,
  MissionTypeInfo,
  MissionRecommendationResponse,
  MissionDeploymentManifest,
} from '../../services/missionService';
import { useAuthStore } from '../../store/authStore';

export const MissionPlannerPage: React.FC = () => {
  const { user } = useAuthStore();

  // State
  const [missionTypes, setMissionTypes] = useState<MissionTypeInfo[]>([]);
  const [selectedMission, setSelectedMission] = useState<string>('Election Duty');
  const [headcount, setHeadcount] = useState<number>(4);
  const [deploymentLocation, setDeploymentLocation] = useState<string>('Sector 4 Polling Cluster');
  const [durationDays, setDurationDays] = useState<number>(14);
  const [commanderRemarks, setCommanderRemarks] = useState<string>(
    'AI-optimized mission dispatch enforcing strategic reserve preservation and 21-day physiological trend guardrails.'
  );

  const [loading, setLoading] = useState<boolean>(false);
  const [recommendations, setRecommendations] = useState<MissionRecommendationResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'squad' | 'reserves' | 'excluded' | 'alternatives'>('squad');

  // Deployed Manifest Modal
  const [manifestModalOpen, setManifestModalOpen] = useState<boolean>(false);
  const [deployedManifest, setDeployedManifest] = useState<MissionDeploymentManifest | null>(null);
  const [isDeploying, setIsDeploying] = useState<boolean>(false);
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Load mission types
  useEffect(() => {
    const fetchTypes = async () => {
      try {
        const types = await missionService.getMissionTypes();
        setMissionTypes(types);
      } catch (err) {
        console.error('Failed to fetch mission types', err);
      }
    };
    fetchTypes();
  }, []);

  // Fetch recommendations when mission or headcount changes
  useEffect(() => {
    fetchRecommendations();
  }, [selectedMission, headcount]);

  const fetchRecommendations = async () => {
    setLoading(true);
    setErrorBanner(null);
    try {
      const data = await missionService.getRecommendations({
        mission_type: selectedMission,
        headcount_required: headcount,
        unit: user?.unit || 'Alpha Battalion',
        duration_days: durationDays,
      });
      setRecommendations(data);
      // Auto-update sample location based on mission
      if (selectedMission === 'Election Duty') {
        setDeploymentLocation('District Polling Zone Bravo (Sectors 12-16)');
      } else if (selectedMission === 'Border Patrol') {
        setDeploymentLocation('Forward High-Altitude Outpost Victor-4');
      } else if (selectedMission === 'Counter Insurgency') {
        setDeploymentLocation('Urban Tactical Sector Bravo-Charlie');
      } else if (selectedMission === 'VIP Security') {
        setDeploymentLocation('Capital Convoy Route & Dignitary Perimeter');
      } else if (selectedMission === 'Flood Rescue') {
        setDeploymentLocation('River Basin Zone Charlie Flood Basin');
      } else if (selectedMission === 'Disaster Relief') {
        setDeploymentLocation('Landslide Sector Camp Bravo');
      } else if (selectedMission === 'Training Camp') {
        setDeploymentLocation('Regional Regimental Training Academy');
      }
    } catch (err: any) {
      console.error('Failed to calculate recommendations', err);
      setErrorBanner(err?.response?.data?.detail || 'Failed to calculate mission recommendations.');
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteDeployment = async () => {
    if (!recommendations || recommendations.recommended_squad.length === 0) return;
    setIsDeploying(true);
    try {
      const assignedUids = recommendations.recommended_squad.map((s) => s.uid);
      const manifest = await missionService.executeDeployment({
        mission_type: selectedMission,
        unit: user?.unit || 'Alpha Battalion',
        assigned_personnel_uids: assignedUids,
        deployment_location: deploymentLocation,
        start_date: new Date().toISOString().split('T')[0],
        duration_days: durationDays,
        commander_remarks: commanderRemarks,
      });
      setDeployedManifest(manifest);
      setManifestModalOpen(true);
    } catch (err: any) {
      console.error('Failed to execute deployment', err);
      alert('Deployment execution failed: ' + (err?.response?.data?.detail || err.message));
    } finally {
      setIsDeploying(false);
    }
  };

  const getMissionIcon = (type: string, isSelected: boolean) => {
    const iconClass = isSelected ? 'text-primary-700' : 'text-slate-600';
    switch (type) {
      case 'Border Patrol':
        return <Shield className={`w-5 h-5 ${iconClass}`} />;
      case 'Counter Insurgency':
        return <Crosshair className={`w-5 h-5 ${iconClass}`} />;
      case 'Election Duty':
        return <Vote className={`w-5 h-5 ${iconClass}`} />;
      case 'VIP Security':
        return <Award className={`w-5 h-5 ${iconClass}`} />;
      case 'Flood Rescue':
        return <LifeBuoy className={`w-5 h-5 ${iconClass}`} />;
      case 'Disaster Relief':
        return <Flame className={`w-5 h-5 ${iconClass}`} />;
      case 'Training Camp':
        return <GraduationCap className={`w-5 h-5 ${iconClass}`} />;
      default:
        return <Compass className={`w-5 h-5 ${iconClass}`} />;
    }
  };

  const getCriticalityBadge = (crit: string) => {
    switch (crit) {
      case 'CRITICAL':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            CRITICAL
          </span>
        );
      case 'HIGH':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            HIGH THREAT
          </span>
        );
      case 'MEDIUM':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-secondary-50 text-secondary-700 border border-secondary-200">
            STANDARD OPS
          </span>
        );
      case 'LOW':
        return (
          <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            LOW / TRAINING
          </span>
        );
      default:
        return null;
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
                Strategic Resource Allocation
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                • Protocol MIL-REC v3.4 Active
              </span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2.5">
              <Compass className="w-7 h-7 text-primary-600" />
              Mission-Aware Personnel Recommendation Engine
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-3xl font-medium leading-relaxed">
              Dynamically optimizes squad deployment by evaluating 21-day clinical stress trajectories,
              fatigue telemetry, and doctrinal preservation of strategic quick-reaction reserves.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchRecommendations}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs sm:text-sm font-bold border border-slate-200 shadow-xs transition active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-primary-600' : 'text-slate-500'}`} />
              Recalculate AI
            </button>
            <button
              onClick={handleExecuteDeployment}
              disabled={isDeploying || !recommendations || recommendations.recommended_squad.length === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-primary-700/20 transition active:scale-95 disabled:opacity-50"
            >
              <ShieldCheck className="w-4 h-4" />
              {isDeploying ? 'Deploying Squad...' : 'Dispatch Squad Deployment'}
            </button>
          </div>
        </div>
      </div>

      {errorBanner && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 text-rose-600" />
          <span className="font-semibold">{errorBanner}</span>
        </div>
      )}

      {/* 2. Mission Selection Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs uppercase tracking-wider font-extrabold text-slate-700 flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-primary-600" />
            Step 1: Select Mission Assignment Profile
          </label>
          <span className="text-xs text-slate-500 font-medium">7 Doctrinal Templates Available</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
          {missionTypes.map((m) => {
            const isSelected = selectedMission === m.type;
            return (
              <button
                key={m.type}
                onClick={() => setSelectedMission(m.type)}
                className={`relative text-left p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'bg-primary-50/70 border-2 border-primary-600 shadow-md ring-1 ring-primary-500/20'
                    : 'bg-white border-slate-200/90 hover:border-primary-400 hover:shadow-card-soft'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div
                      className={`p-2 rounded-xl border ${
                        isSelected
                          ? 'bg-primary-100 border-primary-200'
                          : 'bg-slate-100 border-slate-200'
                      }`}
                    >
                      {getMissionIcon(m.type, isSelected)}
                    </div>
                    {getCriticalityBadge(m.criticality)}
                  </div>
                  <h3 className="font-black text-sm text-slate-900 mb-1">{m.type}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {m.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono font-medium">
                    Target: {m.target_readiness_range}
                  </span>
                  {m.preserve_strategic_reserves && (
                    <span
                      className="text-secondary-700 font-black bg-secondary-50 px-1.5 py-0.5 rounded border border-secondary-200 flex items-center gap-0.5"
                      title="Doctrinal Strategic Reserve Preservation"
                    >
                      ★ Conserve
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Configuration Parameters Bar */}
      <div className="bg-white border border-slate-200/90 shadow-card-soft rounded-2xl p-5 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-xs text-slate-600 font-bold block mb-1.5">Required Headcount</label>
          <div className="flex items-center gap-2">
            {[2, 3, 4, 6, 8].map((count) => (
              <button
                key={count}
                onClick={() => setHeadcount(count)}
                className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition ${
                  headcount === count
                    ? 'bg-primary-600 border-primary-600 text-white shadow-xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {count} Pax
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs text-slate-600 font-bold block mb-1.5">Deployment Duration</label>
          <select
            value={durationDays}
            onChange={(e) => setDurationDays(Number(e.target.value))}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          >
            <option value={7}>7 Days (Rapid Tactical Shift)</option>
            <option value={14}>14 Days (Standard Deployment)</option>
            <option value={21}>21 Days (Extended Rotation)</option>
            <option value={30}>30 Days (Full Mission Tour)</option>
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="text-xs text-slate-600 font-bold block mb-1.5">Deployment Sector / Destination</label>
          <input
            type="text"
            value={deploymentLocation}
            onChange={(e) => setDeploymentLocation(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            placeholder="Specify forward post or sector location"
          />
        </div>

        <div className="md:col-span-4 pt-1">
          <label className="text-xs text-slate-600 font-bold block mb-1.5">
            Commander Dispatch Directives & Operational Remarks
          </label>
          <input
            type="text"
            value={commanderRemarks}
            onChange={(e) => setCommanderRemarks(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            placeholder="Operational orders, tactical precautions, or rotation notes"
          />
        </div>
      </div>

      {/* 4. AI Commander Advisory Banner */}
      {recommendations && (
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#0E231B] via-[#163A2B] to-[#122A21] border border-primary-600/40 p-6 md:p-7 text-white shadow-md">
          <div className="absolute top-0 right-0 p-4 opacity-10 pointer-events-none">
            <Compass className="w-56 h-56 text-emerald-400" />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-primary-500/30 text-emerald-300 border border-primary-400/40">
                  AI COMMAND DIRECTIVE
                </span>
                <span className="text-xs text-emerald-200/80 font-mono">
                  {recommendations.mission_type} Profile
                </span>
              </div>

              <h2 className="text-lg md:text-xl font-black text-white flex items-center gap-2">
                {recommendations.commander_advisory.headline}
              </h2>

              <div className="p-4 rounded-xl bg-black/30 border border-emerald-500/30 backdrop-blur-xs max-w-3xl">
                <p className="text-sm md:text-base font-semibold text-emerald-200 leading-relaxed italic">
                  "{recommendations.commander_advisory.strategic_guidance}"
                </p>
              </div>

              {recommendations.commander_advisory.safety_warning && (
                <div className="flex items-center gap-2 text-xs font-bold text-amber-200 bg-amber-500/20 border border-amber-400/40 px-3 py-1.5 rounded-lg max-w-fit">
                  <AlertTriangle className="w-4 h-4 text-amber-300" />
                  {recommendations.commander_advisory.safety_warning}
                </div>
              )}
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-2 gap-3 flex-shrink-0">
              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-center backdrop-blur-xs">
                <div className="text-[11px] text-slate-300 font-bold">Squad Readiness</div>
                <div className="text-2xl font-black text-emerald-300 mt-0.5">
                  {recommendations.average_squad_readiness}
                  <span className="text-xs font-normal text-slate-300">/100</span>
                </div>
                <div className="text-[10px] text-slate-300">Avg Combat Rating</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-center backdrop-blur-xs">
                <div className="text-[11px] text-slate-300 font-bold">Strategic Conserved</div>
                <div className="text-2xl font-black text-blue-300 mt-0.5">
                  {recommendations.strategic_reserves_preserved.length}
                </div>
                <div className="text-[10px] text-slate-300">Elite Assets Protected</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-center backdrop-blur-xs">
                <div className="text-[11px] text-slate-300 font-bold">Safety Exclusions</div>
                <div className="text-2xl font-black text-rose-300 mt-0.5">
                  {recommendations.excluded_personnel.length}
                </div>
                <div className="text-[10px] text-slate-300">Decline/Fatigue Filtered</div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-center backdrop-blur-xs">
                <div className="text-[11px] text-slate-300 font-bold">Standby Pool</div>
                <div className="text-2xl font-black text-slate-200 mt-0.5">
                  {recommendations.reserve_candidates.length}
                </div>
                <div className="text-[10px] text-slate-300">Alternate Roster</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Squad Allocation Workbench Tabs */}
      <div className="space-y-4">
        <div className="flex border-b border-slate-200 gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveTab('squad')}
            className={`px-4 py-2.5 text-xs md:text-sm font-extrabold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'squad'
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Recommended Operational Squad ({recommendations?.recommended_squad.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('reserves')}
            className={`px-4 py-2.5 text-xs md:text-sm font-extrabold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'reserves'
                ? 'border-secondary-600 text-secondary-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Award className="w-4 h-4" />
            Strategic Reserves Conserved ({recommendations?.strategic_reserves_preserved.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('excluded')}
            className={`px-4 py-2.5 text-xs md:text-sm font-extrabold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'excluded'
                ? 'border-rose-600 text-rose-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            Exclusion / Safety Warnings ({recommendations?.excluded_personnel.length || 0})
          </button>

          <button
            onClick={() => setActiveTab('alternatives')}
            className={`px-4 py-2.5 text-xs md:text-sm font-extrabold border-b-2 flex items-center gap-2 whitespace-nowrap transition ${
              activeTab === 'alternatives'
                ? 'border-slate-600 text-slate-800'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            Alternate Reserve Pool ({recommendations?.reserve_candidates.length || 0})
          </button>
        </div>

        {/* Tab 1: Recommended Squad */}
        {activeTab === 'squad' && recommendations && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.recommended_squad.map((soldier, idx) => (
              <div
                key={soldier.uid}
                className="bg-white border border-slate-200/90 shadow-card-soft rounded-2xl p-5 flex flex-col justify-between hover:shadow-card-hover hover:border-primary-400 transition-all duration-200"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {soldier.uid}
                      </span>
                      <h4 className="font-black text-sm text-slate-900 mt-1.5">{soldier.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">
                        {soldier.rank} • {soldier.unit}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-black text-primary-700 bg-primary-50 px-2.5 py-1 rounded-full border border-primary-200">
                        {soldier.suitability_score}% Match
                      </span>
                      <span className="block text-[10px] text-slate-400 font-medium mt-1">
                        Rank #{idx + 1}
                      </span>
                    </div>
                  </div>

                  {/* Readiness & 21-day velocity */}
                  <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-slate-600 font-semibold">Operational Readiness</span>
                      <span className="font-extrabold text-slate-900">{soldier.current_readiness}/100</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-primary-500 to-emerald-500 h-full rounded-full"
                        style={{ width: `${soldier.current_readiness}%` }}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-200/60">
                      <div className="flex items-center gap-1">
                        {soldier.readiness_trend_21d >= 0 ? (
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                        )}
                        <span className="text-slate-500">21d Trend:</span>
                        <span
                          className={`font-bold ${
                            soldier.readiness_trend_21d >= 0 ? 'text-emerald-700' : 'text-rose-700'
                          }`}
                        >
                          {soldier.readiness_trend_21d > 0
                            ? `+${soldier.readiness_trend_21d}`
                            : soldier.readiness_trend_21d}{' '}
                          pts
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <Moon className="w-3.5 h-3.5 text-secondary-600" />
                        <span className="text-slate-500">Sleep:</span>
                        <span className="font-bold text-slate-700">{soldier.sleep_hours_avg}h</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Rationale */}
                  <div className="text-xs text-slate-700 bg-primary-50/50 border border-primary-200/60 p-3 rounded-xl mb-3 leading-relaxed">
                    <span className="text-primary-800 font-extrabold">AI Decision: </span>
                    {soldier.ai_rationale}
                  </div>

                  {/* Skills tags */}
                  <div className="flex flex-wrap gap-1">
                    {soldier.skills.map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-primary-700 font-extrabold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Allocated to Squad
                  </span>
                  <span className="text-slate-500 font-mono text-[10px]">
                    Duty Days: {soldier.consecutive_duty_days}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Strategic Reserves Conserved */}
        {activeTab === 'reserves' && recommendations && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-secondary-50/80 border border-secondary-200 text-secondary-900 text-xs sm:text-sm flex items-start gap-3.5 shadow-xs">
              <Award className="w-5 h-5 flex-shrink-0 text-secondary-600 mt-0.5" />
              <div>
                <p className="font-black text-secondary-900 text-sm">
                  Strategic Quick-Reaction Force Conservation Doctrine
                </p>
                <p className="text-secondary-800 text-xs mt-1 leading-relaxed">
                  The AI engine deliberately withholds these peak-readiness soldiers from secondary or non-kinetic assignments
                  (like Election Duty or Training Camps) to prevent burnout and ensure 100% availability during high-threat national security contingencies.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.strategic_reserves_preserved.map((soldier) => (
                <div
                  key={soldier.uid}
                  className="bg-white border border-secondary-200/90 shadow-card-soft rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary-50 text-secondary-700 border border-secondary-200">
                          {soldier.uid}
                        </span>
                        <h4 className="font-black text-sm text-slate-900 mt-1.5">{soldier.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {soldier.rank} • {soldier.unit}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-black rounded-full bg-secondary-50 text-secondary-700 border border-secondary-200">
                        CONSERVED
                      </span>
                    </div>

                    <div className="my-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-600 font-semibold">Peak Readiness</span>
                        <span className="font-extrabold text-emerald-700">
                          {soldier.current_readiness}/100
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500">Stress Score:</span>
                        <span className="text-slate-700 font-bold">
                          {soldier.stress_score}/100 (Optimal)
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-secondary-900 bg-secondary-50/70 p-3 rounded-xl border border-secondary-200/80 leading-relaxed font-medium">
                      "{soldier.ai_rationale}"
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-semibold">
                    <span>Reserved for: High-Vigilance Border / Strike</span>
                    <Lock className="w-3.5 h-3.5 text-secondary-600" />
                  </div>
                </div>
              ))}
              {recommendations.strategic_reserves_preserved.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-500 text-sm font-medium">
                  No soldiers currently held in reserve for this high-criticality mission profile.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Exclusion & Safety Warnings */}
        {activeTab === 'excluded' && recommendations && (
          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 text-xs sm:text-sm flex items-start gap-3.5 shadow-xs">
              <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-black text-rose-900 text-sm">
                  Automated Clinical Fatigue & 21-Day Trend Guardrails
                </p>
                <p className="text-rose-800 text-xs mt-1 leading-relaxed">
                  Soldiers experiencing accelerating stress, chronic sleep debt (&lt; 4.5h), or negative 21-day readiness trends are
                  automatically quarantined from frontline dispatch to prevent operational accidents and burnout.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recommendations.excluded_personnel.map((person) => (
                <div
                  key={person.uid}
                  className="bg-white border border-rose-200 shadow-card-soft rounded-2xl p-5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200">
                          {person.uid}
                        </span>
                        <h4 className="font-black text-sm text-slate-900 mt-1.5">{person.name}</h4>
                        <p className="text-xs text-slate-500 font-medium">
                          {person.rank} • {person.unit}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 text-[10px] font-black rounded-full bg-rose-50 text-rose-700 border border-rose-200">
                        EXCLUDED
                      </span>
                    </div>

                    <div className="my-3 p-3 rounded-xl bg-rose-50/70 border border-rose-200/80 text-xs space-y-1">
                      <div className="text-rose-800 font-bold">Clinical Exclusion Rationale:</div>
                      <p className="text-[11px] text-rose-900 leading-relaxed font-medium">
                        {person.reason}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1 border-t border-slate-100">
                      <div>Readiness: <span className="font-bold text-rose-700">{person.readiness}</span></div>
                      <div>Sleep Avg: <span className="font-bold text-amber-700">{person.sleep_hours_avg}h</span></div>
                      <div className="col-span-2">
                        21d Trend: <span className="font-bold text-rose-700">{person.trend_21d} pts decline</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-rose-700 font-bold flex items-center justify-between">
                    <span>Clinical Rest & Recovery Prescribed</span>
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
              {recommendations.excluded_personnel.length === 0 && (
                <div className="col-span-full py-8 text-center text-slate-500 text-sm font-medium">
                  Zero exclusions. All evaluated personnel meet physical and psychological criteria.
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 4: Alternative Candidates */}
        {activeTab === 'alternatives' && recommendations && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendations.reserve_candidates.map((soldier) => (
              <div
                key={soldier.uid}
                className="bg-white border border-slate-200 shadow-card-soft rounded-2xl p-5 flex flex-col justify-between hover:border-slate-300 transition"
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {soldier.uid}
                      </span>
                      <h4 className="font-black text-sm text-slate-900 mt-1.5">{soldier.name}</h4>
                      <p className="text-xs text-slate-500 font-medium">{soldier.rank} • {soldier.unit}</p>
                    </div>
                    <span className="text-xs text-slate-700 font-black">{soldier.suitability_score}%</span>
                  </div>

                  <div className="my-2.5 p-2 rounded-xl bg-slate-50 border border-slate-200/80 text-xs flex justify-between">
                    <span className="text-slate-500">Readiness:</span>
                    <span className="font-bold text-slate-800">{soldier.current_readiness}/100</span>
                  </div>

                  <p className="text-[11px] text-slate-600 leading-relaxed font-medium">{soldier.ai_rationale}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between font-semibold">
                  <span>Standby Reserve</span>
                  <Users className="w-3.5 h-3.5" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 6. Official Military Deployment Manifest Modal */}
      {manifestModalOpen && deployedManifest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative text-slate-900 animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setManifestModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Manifest Header */}
            <div className="border-b border-slate-200 pb-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-2 text-primary-700 font-mono text-xs uppercase tracking-widest font-extrabold">
                <ShieldCheck className="w-4 h-4 text-primary-600" />
                Indian Armed Forces • Command Operational Dispatch Manifest
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                OPERATIONAL DEPLOYMENT ORDER
              </h2>
              <div className="text-xs font-mono text-slate-500">
                MANIFEST ID: <span className="text-primary-800 font-bold">{deployedManifest.manifest_id}</span> • STATUS:{' '}
                <span className="text-emerald-700 font-extrabold">DISPATCHED</span>
              </div>
            </div>

            {/* Mission Details Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500 block font-medium">Mission Type</span>
                <span className="font-extrabold text-slate-900 text-sm">{deployedManifest.mission_type}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Unit Formation</span>
                <span className="font-extrabold text-slate-900 text-sm">{deployedManifest.unit}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Sector / Location</span>
                <span className="font-extrabold text-slate-900 text-sm truncate block">{deployedManifest.deployment_location}</span>
              </div>
              <div>
                <span className="text-slate-500 block font-medium">Tour Duration</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  {deployedManifest.duration_days} Days (From {deployedManifest.start_date})
                </span>
              </div>
            </div>

            {/* Dispatched Squad Table */}
            <div>
              <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-700 mb-2">
                Assigned Operational Squad ({deployedManifest.assigned_roster.length} Personnel)
              </h3>
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-100 text-slate-600 font-mono">
                    <tr>
                      <th className="p-3">UID</th>
                      <th className="p-3">Rank & Name</th>
                      <th className="p-3">Role</th>
                      <th className="p-3 text-right">Dispatch Readiness</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {deployedManifest.assigned_roster.map((p) => (
                      <tr key={p.uid} className="hover:bg-slate-50/80">
                        <td className="p-3 font-mono text-slate-500">{p.uid}</td>
                        <td className="p-3 font-extrabold text-slate-900">
                          {p.rank} {p.name}
                        </td>
                        <td className="p-3 text-slate-600 font-medium">{p.role_in_mission}</td>
                        <td className="p-3 text-right font-black text-primary-700">
                          {p.readiness_at_dispatch}/100
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Verification Hash & Signature Block */}
            <div className="p-4 rounded-2xl bg-primary-50/70 border border-primary-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-primary-800 font-bold block text-[10px] uppercase tracking-wider">
                  DIGITAL VERIFICATION DIGEST
                </span>
                <span className="font-mono text-primary-900 text-xs font-bold break-all">
                  {deployedManifest.digital_signature_hash}
                </span>
                <span className="text-slate-600 block text-[10px] mt-1 font-medium">
                  Authorized by: {deployedManifest.issued_by} • {new Date(deployedManifest.issued_at).toLocaleString()}
                </span>
              </div>
              <div className="flex-shrink-0 text-right">
                <span className="px-3 py-1 rounded-full bg-primary-600 text-white text-[11px] font-bold inline-block shadow-xs">
                  AUTHENTICATED DISPATCH
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 shadow-xs transition"
              >
                <Printer className="w-4 h-4" />
                Print / Save PDF
              </button>
              <button
                onClick={() => setManifestModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-xs font-bold transition shadow-md shadow-primary-700/20"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MissionPlannerPage;
