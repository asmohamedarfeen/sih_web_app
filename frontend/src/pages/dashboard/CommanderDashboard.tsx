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
} from 'lucide-react';

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
    </div>
  );
};

export default CommanderDashboard;
