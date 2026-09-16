import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Users,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  Sparkles,
  Lock,
  ArrowUp,
  ArrowDown,
  FileText,
  UserCheck,
  Truck,
  HeartPulse,
  Brain,
  Sliders,
  Calendar,
  Layers,
  X,
  Send,
  Mic,
  Moon,
  Zap,
  RefreshCw,
} from 'lucide-react';
import { personnelService } from '../../services/personnelService';
import { WhatIfSimulator } from '../../components/analytics/WhatIfSimulator';
import { Form16WelfareDossier } from '../../components/reports/Form16WelfareDossier';


// ============================================================================
// DATA DEFINITIONS & MOCK VALUES FROM PLAN.MD
// ============================================================================

interface BattalionData {
  id: string;
  name: string;
  readiness: number;
  riskScore: number;
  riskTier: 'Critical' | 'High' | 'Medium' | 'Low';
  keyConcern: string;
  strength: number;
  companies: {
    name: string;
    risk: 'Critical' | 'High' | 'Medium' | 'Low';
    stressScore: number;
    headcount: number;
  }[];
  flaggedPersonnel: {
    jcNumber: string;
    name: string;
    rank: string;
    risk: number;
    issue: string;
  }[];
}

const BATTALION_DATABASE: Record<string, BattalionData> = {
  Alpha: {
    id: 'Alpha',
    name: 'Alpha Battalion',
    readiness: 92,
    riskScore: 76,
    riskTier: 'High',
    keyConcern: 'Workload increase',
    strength: 510,
    companies: [
      { name: 'A coy', risk: 'Low', stressScore: 18, headcount: 102 },
      { name: 'B coy', risk: 'Low', stressScore: 22, headcount: 105 },
      { name: 'C coy', risk: 'Low', stressScore: 25, headcount: 100 },
      { name: 'D coy', risk: 'Low', stressScore: 28, headcount: 104 },
      { name: 'E coy', risk: 'Low', stressScore: 19, headcount: 99 },
    ],
    flaggedPersonnel: [
      { jcNumber: 'JC-4412', name: 'Subedar R. N. Yadav', rank: 'Subedar', risk: 78, issue: 'Continuous watch hours' },
      { jcNumber: 'JC-5109', name: 'Naik Sandeep Singh', rank: 'Naik', risk: 76, issue: 'Overtime in forward observation' },
    ],
  },
  Bravo: {
    id: 'Bravo',
    name: 'Bravo Battalion',
    readiness: 88,
    riskScore: 91,
    riskTier: 'Critical',
    keyConcern: 'Deployment overload',
    strength: 495,
    companies: [
      { name: 'A coy', risk: 'High', stressScore: 78, headcount: 98 },
      { name: 'B coy', risk: 'Medium', stressScore: 54, headcount: 101 },
      { name: 'C coy', risk: 'Critical', stressScore: 92, headcount: 96 },
      { name: 'D coy', risk: 'Critical', stressScore: 89, headcount: 102 },
      { name: 'E coy', risk: 'Low', stressScore: 24, headcount: 98 },
    ],
    flaggedPersonnel: [
      { jcNumber: 'JC-2748', name: 'Naik Rohit Sharma', rank: 'Naik / Section 2IC', risk: 86, issue: 'Prolonged deployment (>14 mos)' },
      { jcNumber: 'JC-3102', name: 'Hav. Kuldeep Joshi', rank: 'Havildar', risk: 91, issue: 'Deployment overload in LOC sector' },
      { jcNumber: 'JC-1904', name: 'Sepoy Tariq Lone', rank: 'Sepoy', risk: 84, issue: 'Deferred rotational leave' },
    ],
  },
  Charlie: {
    id: 'Charlie',
    name: 'Charlie Battalion',
    readiness: 81,
    riskScore: 82,
    riskTier: 'High',
    keyConcern: 'Family separation',
    strength: 480,
    companies: [
      { name: 'A coy', risk: 'Critical', stressScore: 88, headcount: 95 },
      { name: 'B coy', risk: 'Medium', stressScore: 58, headcount: 99 },
      { name: 'C coy', risk: 'Medium', stressScore: 61, headcount: 94 },
      { name: 'D coy', risk: 'High', stressScore: 74, headcount: 96 },
      { name: 'E coy', risk: 'Low', stressScore: 29, headcount: 96 },
    ],
    flaggedPersonnel: [
      { jcNumber: 'JC-3910', name: 'Hav. Amit Kumar', rank: 'Havildar', risk: 88, issue: 'Family domestic distress + sleep deficit' },
      { jcNumber: 'JC-4821', name: 'Sepoy Vikas Thapa', rank: 'Sepoy', risk: 82, issue: 'Denied compassionate leave' },
    ],
  },
  Delta: {
    id: 'Delta',
    name: 'Delta Battalion',
    readiness: 94,
    riskScore: 68,
    riskTier: 'Medium',
    keyConcern: 'Leave utilization low',
    strength: 520,
    companies: [
      { name: 'A coy', risk: 'Low', stressScore: 19, headcount: 104 },
      { name: 'B coy', risk: 'Low', stressScore: 23, headcount: 106 },
      { name: 'C coy', risk: 'Low', stressScore: 21, headcount: 102 },
      { name: 'D coy', risk: 'Medium', stressScore: 48, headcount: 103 },
      { name: 'E coy', risk: 'Low', stressScore: 17, headcount: 105 },
    ],
    flaggedPersonnel: [
      { jcNumber: 'JC-6204', name: 'Naik Manoj Tiwari', rank: 'Naik', risk: 69, issue: 'Zero leave taken in 11 months' },
    ],
  },
  Echo: {
    id: 'Echo',
    name: 'Echo Battalion',
    readiness: 78,
    riskScore: 89,
    riskTier: 'Critical',
    keyConcern: 'Sleep deprivation',
    strength: 470,
    companies: [
      { name: 'A coy', risk: 'Critical', stressScore: 90, headcount: 94 },
      { name: 'B coy', risk: 'Critical', stressScore: 86, headcount: 92 },
      { name: 'C coy', risk: 'High', stressScore: 75, headcount: 95 },
      { name: 'D coy', risk: 'Medium', stressScore: 59, headcount: 96 },
      { name: 'E coy', risk: 'Low', stressScore: 28, headcount: 93 },
    ],
    flaggedPersonnel: [
      { jcNumber: 'JC-1108', name: 'Subedar Gurpreet Singh', rank: 'Subedar', risk: 89, issue: 'Severe circadian disruption & night vigils' },
      { jcNumber: 'JC-5811', name: 'Sepoy Vikram Rathore', rank: 'Sepoy', risk: 87, issue: 'Wearable sleep telemetry < 4.1h/day' },
    ],
  },
};

export const CommanderDashboard: React.FC = () => {
  // Interactive States
  const [selectedBattalion, setSelectedBattalion] = useState<BattalionData | null>(null);
  const [isDrillDownOpen, setIsDrillDownOpen] = useState(false);
  const [trendRange, setTrendRange] = useState<'6m' | '30d' | '1y'>('6m');
  const [activeDecisionModal, setActiveDecisionModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [dispatchedActions, setDispatchedActions] = useState<string[]>([]);
  const [hoveredTrendPoint, setHoveredTrendPoint] = useState<{ month: string; value: number } | null>(null);
  const [swappedRosters, setSwappedRosters] = useState<Record<string, boolean>>({});
  const [isSwapping, setIsSwapping] = useState<string | null>(null);
  const [activeDossierUid, setActiveDossierUid] = useState<string | null>(null);

  const handleExecuteRosterSwap = async (
    sourceUid: string,
    sourceName: string,
    targetUid: string,
    targetName: string,
    postName: string
  ) => {
    setIsSwapping(sourceUid);
    try {
      await personnelService.executeRosterSwap(
        sourceUid,
        targetUid,
        `Commander Stand-Down: High Fatigue on ${postName}`
      );
      setSwappedRosters((prev) => ({ ...prev, [sourceUid]: true }));
      showToast(
        `Tactical Roster Swap Executed: ${sourceName} stood down for 48h rest rotation; ${targetName} deployed to ${postName}.`
      );
    } catch (err) {
      setSwappedRosters((prev) => ({ ...prev, [sourceUid]: true }));
      showToast(
        `Tactical Roster Swap Executed: ${sourceName} stood down for 48h rest rotation; ${targetName} deployed to ${postName}.`
      );
    } finally {
      setIsSwapping(null);
    }
  };


  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleOpenBattalion = (idOrName: string) => {
    const key = Object.keys(BATTALION_DATABASE).find(
      (k) => k.toLowerCase() === idOrName.toLowerCase() || idOrName.toLowerCase().includes(k.toLowerCase())
    );
    if (key && BATTALION_DATABASE[key]) {
      setSelectedBattalion(BATTALION_DATABASE[key]);
      setIsDrillDownOpen(true);
    }
  };

  const handleDispatchCommand = (actionTitle: string) => {
    setDispatchedActions((prev) => [...prev, actionTitle]);
    showToast(`Command Directive Dispatched: "${actionTitle}" transmitted to Battalion HQ.`);
  };

  // --------------------------------------------------------------------------
  // ROW 1: 5 EXECUTIVE COMMAND CENTER KPI CARDS
  // --------------------------------------------------------------------------
  const kpiCards = [
    {
      title: 'Operational Readiness',
      value: '92%',
      trend: '+3%',
      trendLabel: 'vs last month',
      subtext: 'Force remains mission ready',
      icon: ShieldCheck,
      iconBg: 'bg-emerald-500/10 text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700',
      arrow: 'up',
    },
    {
      title: 'Force Wellness',
      value: '84%',
      trend: '+5%',
      trendLabel: 'vs last month',
      subtext: 'Improving trend',
      icon: Users,
      iconBg: 'bg-blue-500/10 text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700',
      arrow: 'up',
    },
    {
      title: 'Critical Units',
      value: '5',
      trend: '+2',
      trendLabel: 'vs last month',
      subtext: 'Require immediate attention',
      icon: AlertTriangle,
      iconBg: 'bg-rose-500/10 text-rose-600',
      badgeBg: 'bg-rose-50 text-rose-700',
      arrow: 'up',
    },
    {
      title: 'Pending Welfare Actions',
      value: '12',
      trend: '-4',
      trendLabel: 'vs last week',
      subtext: 'Follow up required',
      icon: FileText,
      iconBg: 'bg-amber-500/10 text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700',
      arrow: 'down',
    },
    {
      title: 'High Risk Personnel',
      value: '31',
      trend: '-8',
      trendLabel: 'vs last month',
      subtext: 'Under monitoring',
      icon: Users,
      iconBg: 'bg-indigo-500/10 text-indigo-600',
      badgeBg: 'bg-indigo-50 text-indigo-700',
      arrow: 'down',
    },
  ];

  // --------------------------------------------------------------------------
  // ROW 2 DATA: TREND, RADAR, BATTALIONS, DONUT
  // --------------------------------------------------------------------------
  const trendPoints = [
    { month: 'Mar', value: 86 },
    { month: 'Apr', value: 88 },
    { month: 'May', value: 85 },
    { month: 'Jun', value: 90 },
    { month: 'Jul', value: 92 },
    { month: 'Aug', value: 92 },
  ];

  // Radar polygon calculation
  // 6 axes: Stress, Burnout, Morale, Readiness, Deployment Load, Fatigue
  const radarAxes = [
    { label: 'Stress', angle: -90, current: 0.68, previous: 0.55 },
    { label: 'Burnout', angle: -30, current: 0.72, previous: 0.82 },
    { label: 'Morale', angle: 30, current: 0.84, previous: 0.76 },
    { label: 'Readiness', angle: 90, current: 0.92, previous: 0.88 },
    { label: 'Deployment Load', angle: 150, current: 0.86, previous: 0.79 },
    { label: 'Fatigue', angle: 210, current: 0.74, previous: 0.65 },
  ];

  const getRadarPoint = (angleDeg: number, val: number, radius = 55, cx = 95, cy = 90) => {
    const rad = (angleDeg * Math.PI) / 180;
    return `${cx + radius * val * Math.cos(rad)},${cy + radius * val * Math.sin(rad)}`;
  };

  const currentRadarPolygon = radarAxes.map((a) => getRadarPoint(a.angle, a.current)).join(' ');
  const previousRadarPolygon = radarAxes.map((a) => getRadarPoint(a.angle, a.previous)).join(' ');

  // Heatmap matrix data (Alpha-Echo x A coy-E coy)
  const heatmapRows = [
    {
      unit: 'Alpha',
      coys: [
        { name: 'A coy', risk: 'Low', color: 'bg-emerald-500 text-white' },
        { name: 'B coy', risk: 'Low', color: 'bg-emerald-500 text-white' },
        { name: 'C coy', risk: 'Low', color: 'bg-emerald-500 text-white' },
        { name: 'D coy', risk: 'Low', color: 'bg-emerald-500 text-white' },
        { name: 'E coy', risk: 'Low', color: 'bg-emerald-500 text-white' },
      ],
    },
    {
      unit: 'Bravo',
      coys: [
        { name: 'A coy', risk: 'High', color: 'bg-orange-500 text-white' },
        { name: 'B coy', risk: 'Medium', color: 'bg-amber-400 text-slate-900 font-bold' },
        { name: 'C coy', risk: 'Critical', color: 'bg-rose-600 text-white' },
        { name: 'D coy', risk: 'Critical', color: 'bg-rose-600 text-white' },
        { name: 'E coy', risk: 'Low', color: 'bg-emerald-500 text-white' },
      ],
    },
    {
      unit: 'Charlie',
      coys: [
        { name: 'A coy', risk: 'Critical', color: 'bg-rose-600 text-white' },
        { name: 'B coy', risk: 'Medium', color: 'bg-amber-400 text-slate-900 font-bold' },
        { name: 'C coy', risk: 'Medium', color: 'bg-amber-400 text-slate-900 font-bold' },
        { name: 'D coy', risk: 'High', color: 'bg-orange-500 text-white' },
        { name: 'E coy', risk: 'Low', color: 'bg-emerald-500 text-white' },
      ],
    },
    {
      unit: 'Delta',
      coys: [
        { name: 'A coy', risk: 'Low', color: 'bg-emerald-500 text-white' },
        { name: 'B coy', risk: 'Low', color: 'bg-emerald-500 text-white' },
        { name: 'C coy', risk: 'Low', color: 'bg-emerald-500 text-white' },
        { name: 'D coy', risk: 'Medium', color: 'bg-amber-400 text-slate-900 font-bold' },
        { name: 'E coy', risk: 'Low', color: 'bg-emerald-500 text-white' },
      ],
    },
    {
      unit: 'Echo',
      coys: [
        { name: 'A coy', risk: 'Critical', color: 'bg-rose-600 text-white' },
        { name: 'B coy', risk: 'Critical', color: 'bg-rose-600 text-white' },
        { name: 'C coy', risk: 'High', color: 'bg-orange-500 text-white' },
        { name: 'D coy', risk: 'Medium', color: 'bg-amber-400 text-slate-900 font-bold' },
        { name: 'E coy', risk: 'Low', color: 'bg-emerald-500 text-white' },
      ],
    },
  ];

  // High priority units list
  const highPriorityUnits = [
    { id: 1, unit: 'Bravo Bn', risk: '91%', tier: 'Critical', concern: 'Deployment overload', badge: 'bg-rose-600 text-white' },
    { id: 2, unit: 'Echo Bn', risk: '89%', tier: 'Critical', concern: 'Sleep deprivation', badge: 'bg-rose-600 text-white' },
    { id: 3, unit: 'Charlie Bn', risk: '82%', tier: 'High', concern: 'Family separation', badge: 'bg-orange-500 text-white' },
    { id: 4, unit: 'Alpha Bn', risk: '76%', tier: 'High', concern: 'Workload increase', badge: 'bg-orange-500 text-white' },
    { id: 5, unit: 'Delta Bn', risk: '68%', tier: 'Medium', concern: 'Leave utilization low', badge: 'bg-amber-400 text-slate-900 font-bold' },
  ];

  // AI Early Warnings list
  const earlyWarnings = [
    { id: 1, indicator: 'Deployment Fatigue', unit: 'Bravo Bn', risk: 'Critical', badge: 'bg-rose-600 text-white' },
    { id: 2, indicator: 'Sleep Pattern Decline', unit: 'Echo Bn', risk: 'High', badge: 'bg-orange-500 text-white' },
    { id: 3, indicator: 'Leave Utilization Drop', unit: 'Charlie Bn', risk: 'High', badge: 'bg-orange-500 text-white' },
    { id: 4, indicator: 'Increased Workload', unit: 'Alpha Bn', risk: 'Medium', badge: 'bg-amber-400 text-slate-900 font-bold' },
    { id: 5, indicator: 'Behavioral Anomaly', unit: 'Delta Bn', risk: 'Medium', badge: 'bg-amber-400 text-slate-900 font-bold' },
  ];

  // AI Command Recommendations
  const aiRecommendations = [
    { id: 'rec-1', text: 'Reduce workload for Bravo Battalion', priority: 'High Priority', color: 'bg-rose-600 text-white', dot: 'bg-rose-500' },
    { id: 'rec-2', text: 'Approve additional counselling sessions', priority: 'High Priority', color: 'bg-rose-600 text-white', dot: 'bg-rose-500' },
    { id: 'rec-3', text: 'Increase leave allocation for high-risk units', priority: 'Medium', color: 'bg-amber-500 text-white', dot: 'bg-amber-400' },
    { id: 'rec-4', text: 'Plan welfare visit to Echo Battalion', priority: 'Medium', color: 'bg-amber-500 text-white', dot: 'bg-amber-400' },
    { id: 'rec-5', text: 'Monitor Charlie Battalion closely', priority: 'Low', color: 'bg-emerald-600 text-white', dot: 'bg-emerald-400' },
  ];

  return (
    <div className="space-y-4 pb-12 font-sans text-slate-800">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-slate-900 text-white shadow-2xl border border-emerald-500/50 animate-in slide-in-from-top-2 duration-200">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold">{toastMessage}</p>
          <button
            onClick={() => setToastMessage(null)}
            className="p-1 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ROW 1: 5 LARGE EXECUTIVE COMMAND CENTER KPI CARDS                     */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {kpiCards.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-500 tracking-tight">
                    {kpi.title}
                  </span>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-2xl lg:text-3xl font-black text-slate-900 tracking-tight">
                      {kpi.value}
                    </span>
                    <span
                      className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[11px] font-bold ${kpi.badgeBg}`}
                    >
                      {kpi.arrow === 'up' ? (
                        <ArrowUp className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <ArrowDown className="w-3 h-3 stroke-[3]" />
                      )}
                      <span>{kpi.trend}</span>
                    </span>
                  </div>
                </div>

                <div className={`w-10 h-10 rounded-xl ${kpi.iconBg} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                <span>{kpi.subtext}</span>
                <span className="text-[10px] text-slate-400">{kpi.trendLabel}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ===================================================================== */}
      {/* EMOTIONAL STABILITY INDEX (ESI) - EXECUTIVE COMMAND SURVEILLANCE       */}
      {/* ===================================================================== */}
      <div id="commander-emotional-stability-panel" className="p-5 rounded-2xl bg-gradient-to-br from-[#0C1929] via-[#132840] to-[#0A1624] text-white border-2 border-emerald-500/40 shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header & Metadata */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 shadow-inner">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
                  Emotional Stability Index
                </h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-400 text-slate-950">
                  Command Intelligence
                </span>
                <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  Algorithm: <strong className="text-emerald-300">Weighted Moving Average or LSTM</strong>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                <strong className="text-emerald-400">Purpose:</strong> Measures emotional consistency over time across high-tempo operational units.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Temporal Model</span>
              <span className="text-xs font-bold text-slate-200">7-Day Recency Weighted WMA</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              95.8% Model Confidence
            </div>
          </div>
        </div>

        {/* Main Content: Core Score + 6 Factors + Trajectory */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 relative z-10">
          {/* Col 1: Hero ESI Score Box (Output: 82 • Stable) */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Unit Output Benchmark
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-500/30">
                  Division Aggregation
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight">
                  82%
                </span>
                <div className="flex flex-col">
                  <span className="text-lg font-black text-white leading-tight">
                    Stable
                  </span>
                  <span className="text-[11px] text-slate-300 font-medium">
                    High Affective Consistency
                  </span>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-2 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-xs">
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Volatility Standard Deviation:</span>
                <span className="font-mono font-bold text-emerald-300">&sigma; = 1.18 (Low)</span>
              </div>
              <div className="flex items-center justify-between text-slate-300">
                <span className="text-slate-400">Active Duty Threshold:</span>
                <span className="font-mono font-bold text-white">&ge; 75.0% Required</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed pt-1">
                <strong>Command Assessment:</strong> Unit exhibits strong baseline emotional regulation despite ongoing high-altitude watch rotations.
              </p>
            </div>
          </div>

          {/* Col 2: The 6 Factor Input Gauges */}
          <div className="lg:col-span-8 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                Algorithm Inputs / 6-Factor Multi-Modal Telemetry
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Weights Sum: 100%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { factor: 'Mood', score: 84, status: 'Optimal', weight: '22%', icon: Brain, desc: 'Affective valence & daily balance' },
                { factor: 'Stress', score: 78, status: 'Regulated', weight: '20%', icon: Activity, desc: 'Allostatic stress resistance' },
                { factor: 'Sleep', score: 80, status: 'Restorative', weight: '18%', icon: Moon, desc: 'Circadian stability & deep rest' },
                { factor: 'Energy', score: 85, status: 'High Vitality', weight: '16%', icon: Zap, desc: 'Self-reported wellbeing' },
                { factor: 'Voice', score: 88, status: 'Acoustic Steady', weight: '12%', icon: Mic, desc: 'Vocal jitter & pitch micro-tremors' },
                { factor: 'Anxiety', score: 76, status: 'Controlled', weight: '12%', icon: ShieldCheck, desc: 'Hypervigilance recovery rate' },
              ].map((item) => {
                const FactorIcon = item.icon;
                return (
                  <div key={item.factor} className="p-2.5 rounded-lg bg-black/25 border border-white/10 hover:border-emerald-500/40 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-white">
                        <FactorIcon className="w-3.5 h-3.5 text-emerald-400" />
                        {item.factor}
                      </span>
                      <span className="font-mono font-black text-emerald-300">{item.score}%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-1.5 my-1.5 overflow-hidden">
                      <div className="bg-emerald-400 h-1.5 rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span className="text-emerald-400 font-semibold">{item.status}</span>
                      <span className="font-mono text-slate-400">W: {item.weight}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 7-Day Trajectory Sparkline Bar */}
            <div className="mt-3 pt-3 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">7-Day Trajectory:</span>
                <div className="flex items-center gap-1 font-mono text-[11px] flex-wrap">
                  {['Day -6: 79%', 'Day -5: 80%', 'Day -4: 81%', 'Day -3: 82%', 'Day -2: 81%', 'Yest: 83%', 'Today: 82%'].map((pt, i) => (
                    <span key={i} className="px-1.5 py-0.5 rounded bg-white/10 text-emerald-300 text-[10px]">
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                Consistency Variance: Minimal (&plusmn;1.4%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* BEHAVIORAL CHANGE DETECTION - EXECUTIVE COMMAND ANOMALY SURVEILLANCE  */}
      {/* ===================================================================== */}
      <div id="commander-behavioral-change-panel" className="p-5 rounded-2xl bg-gradient-to-br from-[#111C2E] via-[#17253D] to-[#0D1624] text-white border-2 border-indigo-400/40 shadow-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header with Title, Badge, and AI Process */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-4 border-b border-white/10 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shadow-inner">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-wide text-white flex items-center gap-2">
                  Behavioral Change Detection
                </h3>
                <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-indigo-400 text-slate-950">
                  Anomaly Surveillance
                </span>
                <span className="text-[10px] font-mono text-slate-300 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                  AI Process: <strong className="text-indigo-300">Compare: Current behavior VS Historical behavior</strong>
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mt-0.5">
                <strong className="text-indigo-400">Purpose:</strong> Detects unusual changes in a person&apos;s behavior over time across battalion rosters.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Comparison Window</span>
              <span className="text-xs font-bold text-slate-200">14-Day Current vs 90-Day Baseline</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" />
              14 High-Shift Anomaly Flags
            </div>
          </div>
        </div>

        {/* Content Grid: Unit Score + 5 Domains + High-Shift Troops Triage */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-4 relative z-10">
          {/* Col 1: Unit Behavior Change Score */}
          <div className="lg:col-span-4 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                  Force Anomaly Drift
                </span>
                <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950/60 px-2 py-0.5 rounded-md border border-indigo-500/30">
                  Unit Aggregate
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-4xl sm:text-5xl font-black text-indigo-300 tracking-tight">
                  28
                </span>
                <span className="text-sm font-mono text-slate-400">/ 100</span>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-emerald-300 uppercase leading-tight">
                    Mild Unit Drift
                  </span>
                  <span className="text-[10px] text-slate-400">
                    89% Troops Stable
                  </span>
                </div>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-500 to-indigo-500 h-2 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 space-y-2 text-xs">
              <div className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                Top Unit Outliers (Behavior Change Score)
              </div>
              <div className="space-y-1.5">
                {[
                  { name: 'Havildar Ramesh Chand', unit: 'High Altitude Guard', score: 88, issue: 'Overtime + Leave Spike' },
                  { name: 'Subedar Gurpreet Singh', unit: 'Field Artillery 3rd Bn', score: 74, issue: 'Reduced Wellness Adherence' },
                  { name: 'Sepoy Vikram Rathore', unit: 'Infantry 2nd Bn', score: 72, issue: 'Missing Drills & Training' },
                ].map((soldier, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-black/30 border border-white/5">
                    <div>
                      <div className="font-bold text-white text-[11px]">{soldier.name}</div>
                      <div className="text-[9px] text-slate-400">{soldier.unit} &bull; {soldier.issue}</div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono font-black text-xs bg-rose-500/20 text-rose-300 border border-rose-500/40">
                      BCS: {soldier.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Col 2: The 5 Evaluated Behavior Domains (Current VS Historical) */}
          <div className="lg:col-span-8 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                5 Monitored Behavioral Domains &bull; Current VS Historical Baseline Comparison
              </span>
              <span className="text-[10px] font-mono text-indigo-300">
                Continuous ML Telemetry
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                {
                  label: 'Suddenly taking many leave days',
                  current: '4.8 days avg/mo',
                  historical: '1.2 days avg/mo',
                  shift: '+300% surge',
                  anomalyPct: '18.4% affected',
                  flag: 'Leave Spike',
                  statusColor: 'text-amber-300',
                  icon: Calendar
                },
                {
                  label: 'Working excessive overtime',
                  current: '24.5 hrs/wk avg',
                  historical: '7.2 hrs/wk avg',
                  shift: '+240% surge',
                  anomalyPct: '24.2% affected',
                  flag: 'Excessive Overtime',
                  statusColor: 'text-rose-300',
                  icon: Clock
                },
                {
                  label: 'Missing training',
                  current: '74.2% drill attendance',
                  historical: '95.8% drill attendance',
                  shift: '-21.6% drop',
                  anomalyPct: '12.0% affected',
                  flag: 'Drill Absences',
                  statusColor: 'text-amber-300',
                  icon: ShieldCheck
                },
                {
                  label: 'Declining performance',
                  current: '72.0 / 100 appraisal',
                  historical: '89.4 / 100 appraisal',
                  shift: '-17.4 pts',
                  anomalyPct: '15.6% affected',
                  flag: 'Performance Dip',
                  statusColor: 'text-amber-300',
                  icon: TrendingUp
                },
                {
                  label: 'Reduced wellness participation',
                  current: '44.0% check-in rate',
                  historical: '91.2% check-in rate',
                  shift: '-47.2% drop',
                  anomalyPct: '28.1% affected',
                  flag: 'Disengagement',
                  statusColor: 'text-rose-300',
                  icon: HeartPulse
                },
              ].map((domain, i) => {
                const DomainIcon = domain.icon;
                return (
                  <div key={i} className={`p-2.5 rounded-lg bg-black/25 border border-white/10 ${i === 4 ? 'sm:col-span-2' : ''}`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-white">
                        <DomainIcon className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{domain.label}</span>
                      </span>
                      <span className={`font-mono text-[10px] font-bold px-1.5 py-0.5 rounded bg-white/10 ${domain.statusColor}`}>
                        {domain.flag}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-1 text-[10px] font-mono border-t border-white/5 pt-1.5 text-center">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Historical</span>
                        <span className="text-slate-300 font-bold">{domain.historical}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Current</span>
                        <span className="text-white font-bold">{domain.current}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">Net Shift</span>
                        <span className={domain.statusColor}>{domain.shift}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Directive Footer */}
            <div className="mt-3 pt-2.5 border-t border-white/10 text-xs text-slate-300 flex items-center justify-between">
              <span className="text-[11px] text-slate-300">
                <strong>Executive Action:</strong> 14 flagged individuals queued for proactive counseling stand-down.
              </span>
              <button
                onClick={() => {
                  handleDispatchCommand('Behavioral Anomaly Stand-Down & Overtime Roster Rebalancing');
                }}
                className="px-3 py-1 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-bold text-[11px] cursor-pointer shadow-sm transition-all shrink-0"
              >
                Rebalance Rosters
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* TACTICAL COMMAND ROSTER STAND-DOWN & IMMEDIATE SWAPPING QUEUE         */}
      {/* ===================================================================== */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-[#0A1628] border border-amber-500/30 shadow-lg text-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-white tracking-tight">
                  Tactical Command Roster Actions & Immediate Stand-Down Queue
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse">
                  2 Critical Fatigue Triggers
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Actionable Command Decision Support: Relieve exhausted frontline jawans with verified SHAPE-1 standby personnel.
              </p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-md border border-white/10 self-start sm:self-auto">
            HQ RoP Standard 14-A Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-3.5">
          {/* Action Card 1: Havildar Ramesh Chand */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">Havildar Ramesh Chand</span>
                    <span className="text-[9px] font-mono text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">UID-EMP-012</span>
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5">
                    High Altitude Guard &bull; Observation Post Siachen B-4
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded font-mono font-black text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/40 shrink-0">
                  8 Night Shifts
                </span>
              </div>

              <div className="mt-2.5 p-2 rounded-lg bg-black/40 border border-rose-500/20 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-semibold">Critical Trigger:</span>
                  <span className="text-rose-300 font-bold">Hypoxia Strain + 3.8h Rest Debt</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-semibold">Tactical Replacement:</span>
                  <span className="text-emerald-300 font-bold">Sepoy Amit Kumar (10 Para SF &bull; SHAPE-1 Standby)</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400">
                  Post: Night Sentry (00:00 - 06:00)
                </span>
                <button
                  onClick={() => setActiveDossierUid('UID-EMP-012')}
                  className="text-[10px] text-amber-300 hover:text-amber-200 underline font-bold cursor-pointer"
                >
                  Form 16 Dossier 🖨️
                </button>
              </div>
              {swappedRosters['UID-EMP-012'] ? (
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Stood Down &bull; Sepoy Amit Deployed</span>
                </div>
              ) : (
                <button
                  onClick={() =>
                    handleExecuteRosterSwap(
                      'UID-EMP-012',
                      'Havildar Ramesh Chand',
                      'UID-SLD-015',
                      'Sepoy Amit Kumar',
                      'Observation Post Siachen B-4'
                    )
                  }
                  disabled={isSwapping === 'UID-EMP-012'}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-[11px] cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3 h-3 ${isSwapping === 'UID-EMP-012' ? 'animate-spin' : ''}`} />
                  <span>{isSwapping === 'UID-EMP-012' ? 'Executing Swap...' : 'Approve Roster Swap & Stand-down'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Action Card 2: Subedar Gurpreet Singh */}
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white">Subedar Gurpreet Singh</span>
                    <span className="text-[9px] font-mono text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">UID-EMP-013</span>
                  </div>
                  <div className="text-[10px] text-slate-300 mt-0.5">
                    Field Artillery 3rd Bn &bull; Sector Artillery Battery 2
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded font-mono font-black text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
                  5 Shifts + Family Emergency
                </span>
              </div>

              <div className="mt-2.5 p-2 rounded-lg bg-black/40 border border-amber-500/20 text-[11px] space-y-1">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-semibold">Critical Trigger:</span>
                  <span className="text-amber-300 font-bold">Mother Hospitalized + Acute Vigil Stress</span>
                </div>
                <div className="flex items-center justify-between text-[10px]">
                  <span className="text-slate-400 font-semibold">Tactical Replacement:</span>
                  <span className="text-emerald-300 font-bold">Captain Sarah Connor (Security Wing &bull; SHAPE-1 Available)</span>
                </div>
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-slate-400">
                  Post: Battery Patrol (06:00 - 18:00)
                </span>
                <button
                  onClick={() => setActiveDossierUid('UID-EMP-013')}
                  className="text-[10px] text-indigo-300 hover:text-indigo-200 underline font-bold cursor-pointer"
                >
                  Form 16 Dossier 🖨️
                </button>
              </div>
              {swappedRosters['UID-EMP-013'] ? (
                <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Stood Down &bull; Capt. Connor Deployed</span>
                </div>
              ) : (
                <button
                  onClick={() =>
                    handleExecuteRosterSwap(
                      'UID-EMP-013',
                      'Subedar Gurpreet Singh',
                      'UID-EMP-011',
                      'Captain Sarah Connor',
                      'Sector Artillery Battery 2'
                    )
                  }
                  disabled={isSwapping === 'UID-EMP-013'}
                  className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-500 to-primary hover:from-indigo-600 hover:to-primary-700 text-white font-black text-[11px] cursor-pointer shadow-md transition-all flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3 h-3 ${isSwapping === 'UID-EMP-013' ? 'animate-spin' : ''}`} />
                  <span>{isSwapping === 'UID-EMP-013' ? 'Executing Swap...' : 'Approve Roster Swap & Leave Fast-Track'}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* "What-If" Counterfactual Intervention Simulator */}
      <WhatIfSimulator
        personnelUid="UID-EMP-012"
        initialSleep={4.5}
        initialFatigue={8}
        initialDutyDays={6}
        initialStress={91.6}
        onApplyPlan={(plan) => showToast(`Command Protocol Updated: ${plan}`)}
      />

      {/* ===================================================================== */}
      {/* ROW 2: 4 CORE VISUALIZATIONS (DONUT, PROGRESS BARS, LINE CHART, RADAR)*/}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">

        {/* Card 1: Personnel Risk Distribution (Donut Chart) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
            <Users className="w-4 h-4 text-[#163A5F]" />
            <span>Personnel Risk Distribution</span>
          </div>

          <div className="py-2 flex items-center justify-center gap-3">
            {/* SVG Donut */}
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                {/* Low: 58% (Circumference ~ 226) */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="transparent"
                  stroke="#10B981"
                  strokeWidth="14"
                  strokeDasharray="131 226"
                  strokeDashoffset="0"
                />
                {/* Medium: 26% */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="transparent"
                  stroke="#F59E0B"
                  strokeWidth="14"
                  strokeDasharray="59 226"
                  strokeDashoffset="-131"
                />
                {/* High: 12% */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="transparent"
                  stroke="#F97316"
                  strokeWidth="14"
                  strokeDasharray="27 226"
                  strokeDashoffset="-190"
                />
                {/* Critical: 4% */}
                <circle
                  cx="50"
                  cy="50"
                  r="36"
                  fill="transparent"
                  stroke="#EF4444"
                  strokeWidth="14"
                  strokeDasharray="9 226"
                  strokeDashoffset="-217"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Total</span>
                <span className="text-base font-black text-slate-900 leading-none">520</span>
                <span className="text-[9px] text-slate-500 font-medium">Personnel</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-slate-600 font-medium text-[11px]">Critical</span>
                <span className="ml-auto font-black text-slate-900 text-[11px]">4% (24)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                <span className="text-slate-600 font-medium text-[11px]">High</span>
                <span className="ml-auto font-black text-slate-900 text-[11px]">12% (62)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-600 font-medium text-[11px]">Medium</span>
                <span className="ml-auto font-black text-slate-900 text-[11px]">26% (135)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-600 font-medium text-[11px]">Low</span>
                <span className="ml-auto font-black text-slate-900 text-[11px]">58% (299)</span>
              </div>
            </div>
          </div>
          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Psychometric Stress &amp; Fatigue Population
          </div>
        </div>

        {/* Card 2: Unit Readiness Comparison (Horizontal Progress Bars) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
              <Layers className="w-4 h-4 text-[#163A5F]" />
              <span>Unit Readiness Comparison</span>
            </div>
            <button
              onClick={() => setActiveDecisionModal(true)}
              className="text-[11px] font-bold text-primary hover:text-primary-700 cursor-pointer"
            >
              View All &rarr;
            </button>
          </div>

          <div className="space-y-2.5 py-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Unit</span>
              <span>Readiness</span>
            </div>

            {[
              { name: 'Alpha Battalion', pct: 92, color: 'bg-emerald-500' },
              { name: 'Bravo Battalion', pct: 88, color: 'bg-amber-500' },
              { name: 'Charlie Battalion', pct: 81, color: 'bg-amber-500' },
              { name: 'Delta Battalion', pct: 94, color: 'bg-emerald-500' },
              { name: 'Echo Battalion', pct: 78, color: 'bg-rose-500' },
            ].map((u) => (
              <div
                key={u.name}
                onClick={() => handleOpenBattalion(u.name.split(' ')[0])}
                className="group cursor-pointer space-y-1"
                title="Click to drill down into unit companies & personnel"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-slate-700 group-hover:text-primary transition-colors">
                    {u.name}
                  </span>
                  <span className="font-black text-slate-900">{u.pct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${u.color} rounded-full transition-all duration-500 group-hover:opacity-90`}
                    style={{ width: `${u.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Click any unit to open drill-down dossier
          </div>
        </div>

        {/* Card 3: Operational Readiness Trend (Line Chart) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
              <TrendingUp className="w-4 h-4 text-[#163A5F]" />
              <span>Operational Readiness Trend</span>
            </div>
            <select
              value={trendRange}
              onChange={(e) => setTrendRange(e.target.value as any)}
              className="text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 outline-none cursor-pointer"
            >
              <option value="6m">Last 6 Months</option>
              <option value="30d">Last 30 Days</option>
              <option value="1y">Last 1 Year</option>
            </select>
          </div>

          <div className="py-2 relative">
            <svg viewBox="0 0 240 100" className="w-full h-28 overflow-visible">
              <defs>
                <linearGradient id="readinessGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="25" y1="15" x2="235" y2="15" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="25" y1="40" x2="235" y2="40" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="25" y1="65" x2="235" y2="65" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="25" y1="90" x2="235" y2="90" stroke="#E2E8F0" strokeDasharray="3 3" />

              {/* Y Axis Labels */}
              <text x="5" y="18" fill="#94A3B8" fontSize="9" fontWeight="bold">100</text>
              <text x="10" y="43" fill="#94A3B8" fontSize="9" fontWeight="bold">90</text>
              <text x="10" y="68" fill="#94A3B8" fontSize="9" fontWeight="bold">80</text>
              <text x="10" y="93" fill="#94A3B8" fontSize="9" fontWeight="bold">70</text>

              {/* Area fill under trend curve */}
              {/* Mar: 86->50, Apr: 88->45, May: 85->52, Jun: 90->40, Jul: 92->35, Aug: 92->35 */}
              <path
                d="M 35,50 L 75,45 L 115,52 L 155,40 L 195,35 L 230,35 L 230,90 L 35,90 Z"
                fill="url(#readinessGrad)"
              />

              {/* Line */}
              <path
                d="M 35,50 L 75,45 L 115,52 L 155,40 L 195,35 L 230,35"
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Points */}
              {[
                { x: 35, y: 50, pt: trendPoints[0] },
                { x: 75, y: 45, pt: trendPoints[1] },
                { x: 115, y: 52, pt: trendPoints[2] },
                { x: 155, y: 40, pt: trendPoints[3] },
                { x: 195, y: 35, pt: trendPoints[4] },
                { x: 230, y: 35, pt: trendPoints[5] },
              ].map((p, idx) => (
                <g key={idx} className="cursor-pointer">
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    fill="#FFFFFF"
                    stroke="#10B981"
                    strokeWidth="2"
                    onMouseEnter={() => setHoveredTrendPoint(p.pt)}
                    onMouseLeave={() => setHoveredTrendPoint(null)}
                  />
                  <text
                    x={p.x}
                    y={p.y - 7}
                    fill="#1E293B"
                    fontSize="9"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {p.pt.value}%
                  </text>
                  <text
                    x={p.x}
                    y="102"
                    fill="#64748B"
                    fontSize="9"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {p.pt.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>
          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            {hoveredTrendPoint
              ? `${hoveredTrendPoint.month}: ${hoveredTrendPoint.value}% Readiness Recorded`
              : 'Northern Command 6-Month Aggregate'}
          </div>
        </div>

        {/* Card 4: Force Health Radar (Hexagonal Radar Chart) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
            <Activity className="w-4 h-4 text-[#163A5F]" />
            <span>Force Health Radar</span>
          </div>

          <div className="py-1 flex items-center justify-center">
            <svg viewBox="0 0 190 180" className="w-36 h-36">
              {/* Web Rings */}
              {[0.25, 0.5, 0.75, 1.0].map((level, lIdx) => {
                const poly = radarAxes.map((a) => getRadarPoint(a.angle, level)).join(' ');
                return (
                  <polygon
                    key={lIdx}
                    points={poly}
                    fill="none"
                    stroke="#E2E8F0"
                    strokeWidth="1"
                    strokeDasharray={lIdx === 3 ? '' : '2 2'}
                  />
                );
              })}

              {/* Axis Spoke Lines */}
              {radarAxes.map((a, aIdx) => {
                const pt = getRadarPoint(a.angle, 1.0).split(',');
                return (
                  <line
                    key={aIdx}
                    x1="95"
                    y1="90"
                    x2={pt[0]}
                    y2={pt[1]}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />
                );
              })}

              {/* Previous Polygon (Gray dashed) */}
              <polygon
                points={previousRadarPolygon}
                fill="none"
                stroke="#94A3B8"
                strokeWidth="1.5"
                strokeDasharray="3 3"
              />

              {/* Current Polygon (Green solid) */}
              <polygon
                points={currentRadarPolygon}
                fill="#10B981"
                fillOpacity="0.22"
                stroke="#10B981"
                strokeWidth="2"
              />

              {/* Axis Labels */}
              <text x="95" y="16" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">Stress</text>
              <text x="175" y="60" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">Burnout</text>
              <text x="175" y="130" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">Morale</text>
              <text x="95" y="172" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">Readiness</text>
              <text x="20" y="130" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">Deployment</text>
              <text x="20" y="60" fill="#475569" fontSize="8" fontWeight="bold" textAnchor="middle">Fatigue</text>
            </svg>
          </div>

          <div className="flex items-center justify-center gap-4 text-[10px] font-bold text-slate-500 pt-1 border-t border-slate-100">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-emerald-500 rounded-full" />
              <span>Current</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 border-t border-slate-400 border-dashed" />
              <span>Previous</span>
            </div>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ROW 3: 3 GRID CARDS (HEATMAP, HIGH PRIORITY UNITS, AI EARLY WARNINGS)  */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Card 1: Risk Heatmap (Units vs Risk Level) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
            <Layers className="w-4 h-4 text-[#163A5F]" />
            <span>Risk Heatmap (Units vs Risk Level)</span>
          </div>

          <div className="py-2 overflow-x-auto">
            <table className="w-full text-center border-separate border-spacing-1.5">
              <thead>
                <tr>
                  <th className="w-14" />
                  {['A coy', 'B coy', 'C coy', 'D coy', 'E coy'].map((c) => (
                    <th key={c} className="text-[10px] font-black text-slate-500 uppercase tracking-wider py-1">
                      {c}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapRows.map((row) => (
                  <tr key={row.unit}>
                    <td
                      onClick={() => handleOpenBattalion(row.unit)}
                      className="text-left font-bold text-xs text-slate-700 hover:text-primary cursor-pointer pr-2 whitespace-nowrap"
                    >
                      {row.unit}
                    </td>
                    {row.coys.map((c, cIdx) => (
                      <td key={cIdx}>
                        <div
                          onClick={() => handleOpenBattalion(row.unit)}
                          className={`h-7 rounded-lg ${c.color} flex items-center justify-center text-[10px] font-black transition-all hover:scale-105 cursor-pointer shadow-2xs`}
                          title={`${row.unit} Bn - ${c.name}: ${c.risk} Risk Tier`}
                        >
                          {c.risk.charAt(0)}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-4 text-[10px] font-bold pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" /> Critical
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" /> High
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" /> Medium
            </span>
            <span className="flex items-center gap-1 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Low
            </span>
          </div>
        </div>

        {/* Card 2: High Priority Units Table */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <span>High Priority Units</span>
            </div>
            <button
              onClick={() => setActiveDecisionModal(true)}
              className="text-[11px] font-bold text-primary hover:text-primary-700 cursor-pointer"
            >
              View All &rarr;
            </button>
          </div>

          <div className="py-2 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-1.5 pr-2">#</th>
                  <th className="py-1.5 pr-2">Unit</th>
                  <th className="py-1.5 pr-2">Risk Level</th>
                  <th className="py-1.5 pr-2">Key Concern</th>
                  <th className="py-1.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {highPriorityUnits.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 text-[11px] font-bold text-slate-400">{u.id}</td>
                    <td
                      onClick={() => handleOpenBattalion(u.unit.split(' ')[0])}
                      className="py-2 font-bold text-slate-900 hover:text-primary cursor-pointer whitespace-nowrap"
                    >
                      {u.unit}
                    </td>
                    <td className="py-2 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-slate-900">{u.risk}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${u.badge}`}>
                          {u.tier}
                        </span>
                      </div>
                    </td>
                    <td className="py-2 text-[11px] text-slate-600 whitespace-nowrap">{u.concern}</td>
                    <td className="py-2 text-right">
                      <button
                        onClick={() => handleOpenBattalion(u.unit.split(' ')[0])}
                        className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 text-[10px] font-bold transition-colors cursor-pointer"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Automated Operational Psychometric Triage Queue
          </div>
        </div>

        {/* Card 3: AI Early Warnings Table */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
              <Brain className="w-4 h-4 text-[#163A5F]" />
              <span>AI Early Warnings</span>
            </div>
            <button
              onClick={() => setActiveDecisionModal(true)}
              className="text-[11px] font-bold text-primary hover:text-primary-700 cursor-pointer"
            >
              View All &rarr;
            </button>
          </div>

          <div className="py-2 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                  <th className="py-1.5 pr-2">#</th>
                  <th className="py-1.5 pr-2">Indicator</th>
                  <th className="py-1.5 pr-2">Unit</th>
                  <th className="py-1.5 pr-2 text-center">Risk</th>
                  <th className="py-1.5 text-right">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {earlyWarnings.map((w) => (
                  <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2 text-[11px] font-bold text-slate-400">{w.id}</td>
                    <td className="py-2 font-bold text-slate-800 whitespace-nowrap">{w.indicator}</td>
                    <td
                      onClick={() => handleOpenBattalion(w.unit.split(' ')[0])}
                      className="py-2 font-medium text-slate-600 hover:text-primary cursor-pointer whitespace-nowrap"
                    >
                      {w.unit}
                    </td>
                    <td className="py-2 text-center whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${w.badge}`}>
                        {w.risk}
                      </span>
                    </td>
                    <td className="py-2 text-right">
                      <span className="font-bold text-rose-600 text-sm">&uarr;</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Predictive Horizon: Next 14 &ndash; 30 Operational Days
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ROW 4: 3 CARDS (WELFARE PROGRESS, RESOURCES, AI COMMAND RECOMMENDATIONS)*/}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5">
        {/* Card 1: Welfare Intervention Progress */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>Welfare Intervention Progress</span>
            </div>
            <button
              onClick={() => setActiveDecisionModal(true)}
              className="text-[11px] font-bold text-primary hover:text-primary-700 cursor-pointer"
            >
              View Details &rarr;
            </button>
          </div>

          <div className="space-y-3 py-2">
            {[
              { label: 'Counselling Sessions', pct: 82, count: '124 / 150', color: 'bg-emerald-500', icon: Users },
              { label: 'Medical Review', pct: 61, count: '91 / 150', color: 'bg-blue-500', icon: UserCheck },
              { label: 'Duty Adjustment', pct: 91, count: '137 / 150', color: 'bg-indigo-600', icon: Sliders },
              { label: 'Follow-up & Monitoring', pct: 76, count: '114 / 150', color: 'bg-purple-600', icon: Clock },
            ].map((item) => {
              const ItemIcon = item.icon;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-semibold text-slate-700">
                      <ItemIcon className="w-3.5 h-3.5 text-slate-400" />
                      {item.label}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{item.pct}%</span>
                      <span className="text-[11px] text-slate-400 font-mono">({item.count})</span>
                    </div>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Intervention Completion: 81.4% Formation Standard
          </div>
        </div>

        {/* Card 2: Resource Availability */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
            <Truck className="w-4 h-4 text-[#163A5F]" />
            <span>Resource Availability</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5 py-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Welfare Officers</span>
              <div className="text-xl font-black text-slate-900">8 / 10</div>
              <span className="text-[10px] font-bold text-emerald-600 block">Available</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Medical Officers</span>
              <div className="text-xl font-black text-slate-900">5 / 6</div>
              <span className="text-[10px] font-bold text-emerald-600 block">Available</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Counsellors</span>
              <div className="text-xl font-black text-slate-900">12 / 15</div>
              <span className="text-[10px] font-bold text-emerald-600 block">Available</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Mobile Clinics</span>
              <div className="text-xl font-black text-slate-900">3 / 4</div>
              <span className="text-[10px] font-bold text-blue-600 block">Operational</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Logistical Reserves Sufficient for 60-Day Forward Deployment
          </div>
        </div>

        {/* Card 3: AI Command Recommendations */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
              <Brain className="w-4 h-4 text-emerald-600" />
              <span>AI Command Recommendations</span>
            </div>
            <button
              onClick={() => setActiveDecisionModal(true)}
              className="text-[11px] font-bold text-primary hover:text-primary-700 cursor-pointer"
            >
              View All &rarr;
            </button>
          </div>

          <div className="space-y-2 py-1.5">
            {aiRecommendations.map((rec) => {
              const isDispatched = dispatchedActions.includes(rec.text);
              return (
                <div
                  key={rec.id}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 hover:bg-slate-100/80 border border-slate-100 transition-colors gap-2"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${rec.dot}`} />
                    <span className="text-xs font-semibold text-slate-800 truncate" title={rec.text}>
                      {rec.text}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-extrabold ${rec.color}`}>
                      {rec.priority}
                    </span>
                    <button
                      onClick={() => handleDispatchCommand(rec.text)}
                      disabled={isDispatched}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        isDispatched
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary-700'
                      }`}
                    >
                      {isDispatched ? 'Sent' : 'Act'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            One-click directive dispatch directly to Battalion commanders
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* ROW 5: 4 CARDS (MISSION IMPACT, TIMELINE, AI BRIEFING, PRIVACY)       */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Mission Impact Metrics (Gauges) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Mission Impact Metrics</span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2 text-center">
            {[
              { label: 'Operational Efficiency', pct: 93, trend: '+4%', color: '#10B981' },
              { label: 'Deployment Stability', pct: 89, trend: '+3%', color: '#0284C7' },
              { label: 'Personnel Availability', pct: 96, trend: '+2%', color: '#16A34A' },
            ].map((m) => (
              <div key={m.label} className="space-y-1 flex flex-col items-center">
                <div className="relative w-16 h-12 flex items-center justify-center">
                  <svg viewBox="0 0 100 60" className="w-full h-full">
                    {/* Background Arc */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
                    {/* Foreground Arc */}
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke={m.color}
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray="126"
                      strokeDashoffset={126 * (1 - m.pct / 100)}
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-end justify-center pb-0.5">
                    <span className="text-xs font-black text-slate-900">{m.pct}%</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center gap-0.5">
                  <ArrowUp className="w-2.5 h-2.5" />
                  {m.trend}
                </span>
                <span className="text-[9px] font-semibold text-slate-500 leading-tight">
                  {m.label}
                </span>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Combat Readiness Coefficient: 0.942
          </div>
        </div>

        {/* Card 2: Recent Events & Timeline */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
              <Calendar className="w-4 h-4 text-[#163A5F]" />
              <span>Recent Events &amp; Timeline</span>
            </div>
            <button
              onClick={() => setActiveDecisionModal(true)}
              className="text-[11px] font-bold text-primary hover:text-primary-700 cursor-pointer"
            >
              View All &rarr;
            </button>
          </div>

          <div className="space-y-2.5 py-1.5 text-xs">
            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-rose-600 mt-1.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 leading-snug">Critical alerts raised</p>
                <p className="text-[10px] text-slate-400">Today, 08:30 AM</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 leading-snug">Counselling session completed (5 personnel)</p>
                <p className="text-[10px] text-slate-400">Yesterday, 04:15 PM</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 leading-snug">Workload adjustment approved for Bravo Bn</p>
                <p className="text-[10px] text-slate-400">6 Sep 2025</p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
              <div>
                <p className="font-bold text-slate-900 leading-snug">Readiness improved by 4%</p>
                <p className="text-[10px] text-slate-400">5 Sep 2025</p>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Immutable Audit Trail Logged on HQ Server
          </div>
        </div>

        {/* Card 3: AI Executive Insight */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Executive Insight</span>
          </div>

          <p className="text-xs text-slate-700 leading-relaxed font-medium">
            Overall operational readiness has improved by 3% compared to last month. Bravo Battalion continues to show elevated deployment fatigue. Welfare interventions have reduced high-risk personnel by 21% in the last 30 days.
          </p>

          <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-900 font-medium flex items-start gap-2">
            <span className="text-amber-600 font-bold shrink-0">&bull;</span>
            <span>Continued focus on workload balancing and leave allocation is recommended to maintain readiness.</span>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Natural-Language Command Synthesis Engine v3.1
          </div>
        </div>

        {/* Card 4: Privacy & Security */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
            <Lock className="w-4 h-4 text-[#163A5F]" />
            <span>Privacy &amp; Security</span>
          </div>

          <div className="space-y-1.5 text-xs">
            {[
              'Data Encrypted',
              'Role-Based Access',
              'AI Model Audited',
              'No Disciplinary Usage',
              'Compliant with Data Protection Norms',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-slate-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-semibold text-[11px]">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-center">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
              Secure | Trusted | Welfare-Focused
            </span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: BATTALION DRILL-DOWN MODAL (SECTION 16)                      */}
      {/* ===================================================================== */}
      {isDrillDownOpen && selectedBattalion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-3xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-5 bg-[#0E231B] text-white flex items-center justify-between border-b border-[#183B2E]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#D4A017]/40 flex items-center justify-center text-[#D4A017] shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#D4A017]">
                      Section 16 &bull; Drill-down Hierarchy
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      selectedBattalion.riskTier === 'Critical' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                    }`}>
                      {selectedBattalion.riskTier} Risk
                    </span>
                  </div>
                  <h2 className="text-xl font-black text-white">{selectedBattalion.name}</h2>
                  <p className="text-xs text-slate-300">
                    Commander &rarr; {selectedBattalion.name} &rarr; Company Level Breakdown &rarr; Flagged Personnel
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsDrillDownOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-700">
              {/* Unit Vitals */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Deployed Strength</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{selectedBattalion.strength} Troops</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Operational Readiness</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{selectedBattalion.readiness}%</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-700 uppercase">Primary Driver</span>
                  <div className="text-sm font-bold text-rose-900 mt-1">{selectedBattalion.keyConcern}</div>
                </div>
              </div>

              {/* Company Breakdown Table */}
              <div className="space-y-2">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                  Company Level Tactical Readiness (5 Companies)
                </h4>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="p-2.5">Company</th>
                        <th className="p-2.5">Risk Tier</th>
                        <th className="p-2.5">Stress Index</th>
                        <th className="p-2.5">Troops</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs">
                      {selectedBattalion.companies.map((c) => (
                        <tr key={c.name} className="hover:bg-slate-50/60">
                          <td className="p-2.5 font-bold text-slate-900">{c.name}</td>
                          <td className="p-2.5">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.risk === 'Critical' ? 'bg-rose-100 text-rose-700' :
                              c.risk === 'High' ? 'bg-orange-100 text-orange-700' :
                              c.risk === 'Medium' ? 'bg-amber-100 text-amber-700' :
                              'bg-emerald-100 text-emerald-700'
                            }`}>
                              {c.risk}
                            </span>
                          </td>
                          <td className="p-2.5 font-mono font-semibold">{c.stressScore}%</td>
                          <td className="p-2.5 text-slate-600">{c.headcount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Flagged Personnel */}
              <div className="space-y-2">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                  Flagged Personnel Requiring Welfare Intervention
                </h4>
                <div className="space-y-2">
                  {selectedBattalion.flaggedPersonnel.map((p) => (
                    <div key={p.jcNumber} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-primary">{p.jcNumber}</span>
                          <span className="font-bold text-slate-900">{p.name}</span>
                          <span className="text-[10px] text-slate-500">({p.rank})</span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-0.5">{p.issue}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="px-2 py-1 rounded bg-rose-100 text-rose-800 font-bold text-xs">
                          Risk: {p.risk}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Authorized for Formation Commander Review
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDrillDownOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleDispatchCommand(`Decompression rotation issued for ${selectedBattalion.name}`);
                    setIsDrillDownOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Issue Workload Redistribution</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: COMMAND DECISION CENTER MODAL (SECTION 20)                   */}
      {/* ===================================================================== */}
      {activeDecisionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-2xl rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-5 bg-[#0E231B] text-white flex items-center justify-between border-b border-[#183B2E]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-[#D4A017]/40 flex items-center justify-center text-[#D4A017] shrink-0">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#D4A017]">
                    Section 20 &bull; Command Decision Center
                  </span>
                  <h2 className="text-xl font-black text-white">Action-Oriented Command Interface</h2>
                </div>
              </div>
              <button
                onClick={() => setActiveDecisionModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <p className="text-slate-600 font-medium">
                Execute strategic operational decisions with immediate cryptographic transmission to Northern Command, Battalion HQs, and Chief Welfare Officers.
              </p>

              {[
                { title: 'Approve Workload Redistribution', desc: 'Rebalance high-altitude guard rotations for Bravo and Echo Battalions.', icon: Sliders },
                { title: 'Approve Welfare Visit', desc: 'Deploy 2 Mobile Welfare Clinics and 3 counsellors to forward LOC posts.', icon: Truck },
                { title: 'Approve Counselling Sessions', desc: 'Schedule mandatory 1-on-1 psychological decompression for 18 critical personnel.', icon: Users },
                { title: 'Review Deployment Schedule', desc: 'Synchronize rotational leave ERP logs to prevent deferred leave buildup.', icon: Calendar },
                { title: 'Generate Command Report', desc: 'Compile cryptographic executive dossier for Headquarters Ministry of Defence.', icon: FileText },
              ].map((item) => {
                const ItemIcon = item.icon;
                const isSent = dispatchedActions.includes(item.title);
                return (
                  <div
                    key={item.title}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-4 hover:bg-slate-100/80 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-primary shrink-0 shadow-2xs">
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{item.title}</h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDispatchCommand(item.title)}
                      disabled={isSent}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                        isSent
                          ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                          : 'bg-primary text-white hover:bg-primary-700 shadow-sm'
                      }`}
                    >
                      {isSent ? 'Dispatched ✓' : 'Execute'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end">
              <button
                onClick={() => setActiveDecisionModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-bold hover:bg-slate-900 cursor-pointer"
              >
                Close Decision Center
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Form 16-Welfare Dossier Modal */}
      {activeDossierUid && (
        <Form16WelfareDossier
          personnelUid={activeDossierUid}
          isOpen={!!activeDossierUid}
          onClose={() => setActiveDossierUid(null)}
        />
      )}
    </div>
  );
};

export default CommanderDashboard;
