import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Users,
  TrendingUp,
  Activity,
  CheckCircle2,
  Clock,
  Lock,
  ArrowUp,
  FileText,
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
  Radio,
  ShieldAlert,
  Terminal,
  ChevronRight,
  Search,
  Crosshair,
  LayoutGrid,
  ListFilter,
} from 'lucide-react';
import { personnelService } from '../../services/personnelService';
import { WhatIfSimulator } from '../../components/analytics/WhatIfSimulator';
import { Form16WelfareDossier } from '../../components/reports/Form16WelfareDossier';
import { UnitHierarchyTree } from '../../components/organization/UnitHierarchyTree';
import { RiskMomentumBadge, RiskMomentumData } from '../../components/analytics/RiskMomentumBadge';
import { MultiSourceSignalFusionCard } from '../../components/analytics/MultiSourceSignalFusionCard';
import { useLanguageStore } from '../../localization';

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
    momentum?: RiskMomentumData;
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
      {
        jcNumber: 'JC-4412',
        name: 'Subedar R. N. Yadav',
        rank: 'Subedar',
        risk: 78,
        issue: 'Continuous watch hours',
        momentum: {
          current_stress: 78,
          velocity_pts_per_day: 1.4,
          acceleration_pts_per_day2: 0.1,
          momentum_state: 'ACCELERATING',
          momentum_label: 'Accelerating Stress (+1.4 pts/day)',
          severity: 'HIGH',
          trajectory_arrow: '↗',
          color: 'amber',
          days_to_critical_threshold: 5,
          decision_support: {
            action_type: 'DUTY_REBALANCE',
            urgency: 'HIGH',
            headline: 'Rebalance Watch Rosters & Enforce 8h Sleep Cycle',
            recommended_action: 'Subedar Yadav has accumulated 14 continuous night shifts. Rebalance watch rosters to preserve decision clarity.',
            action_button_label: 'Execute Roster Rebalance',
            action_code: 'REBALANCE_ROSTER_YADAV',
            policy_mitigation: 'Watch Staggering Policy Directive',
          },
        },
      },
      {
        jcNumber: 'JC-5109',
        name: 'Naik Sandeep Singh',
        rank: 'Naik',
        risk: 76,
        issue: 'Overtime in forward observation',
        momentum: {
          current_stress: 76,
          velocity_pts_per_day: 1.8,
          acceleration_pts_per_day2: 0.2,
          momentum_state: 'ACCELERATING',
          momentum_label: 'Post-Deployment Strain (+1.8 pts/day)',
          severity: 'HIGH',
          trajectory_arrow: '↗',
          color: 'amber',
          days_to_critical_threshold: 5,
          decision_support: {
            action_type: 'RELIEF_ROTATION',
            urgency: 'HIGH',
            headline: 'Relieve from Forward Post to Support Base',
            recommended_action: 'Extended forward observation duty causing progressive fatigue. Rotate to secondary tier post.',
            action_button_label: 'Order Forward Relief Rotation',
            action_code: 'RELIEF_FORWARD_SANDEEP',
            policy_mitigation: 'Forward Sector Exposure Limit Protocol',
          },
        },
      },
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
      {
        jcNumber: 'JC-2748',
        name: 'Naik Rohit Sharma',
        rank: 'Naik / Section 2IC',
        risk: 86,
        issue: 'Prolonged deployment (>14 mos)',
        momentum: {
          current_stress: 86,
          velocity_pts_per_day: 4.8,
          acceleration_pts_per_day2: 0.9,
          momentum_state: 'ACUTE_SURGE',
          momentum_label: 'Acute Stress Surge (+4.8 pts/day)',
          severity: 'CRITICAL',
          trajectory_arrow: '↑',
          color: 'rose',
          days_to_critical_threshold: 2,
          critical_warning: 'Exceeding burnout threshold within 48 hours',
          decision_support: {
            action_type: 'WORKLOAD_ROTATION',
            urgency: 'IMMEDIATE',
            headline: 'Rotate Out of Night Watch & Grant 7-Day Decompression Furlough',
            recommended_action: 'Personnel has endured >14 months continuous LOC watch. Stress velocity +4.8 pts/day indicates imminent collapse.',
            action_button_label: 'Execute 7-Day Roster Stand-Down',
            action_code: 'ROSTER_STAND_DOWN_ROHIT',
            policy_mitigation: 'Article 14 Rotational Relief Protocol',
          },
        },
      },
      {
        jcNumber: 'JC-3102',
        name: 'Hav. Kuldeep Joshi',
        rank: 'Havildar',
        risk: 91,
        issue: 'Deployment overload in LOC sector',
        momentum: {
          current_stress: 91,
          velocity_pts_per_day: 3.2,
          acceleration_pts_per_day2: 0.4,
          momentum_state: 'ACUTE_SURGE',
          momentum_label: 'LOC Overload Surge (+3.2 pts/day)',
          severity: 'CRITICAL',
          trajectory_arrow: '↑',
          color: 'rose',
          days_to_critical_threshold: 0,
          critical_warning: 'Already operating above critical threshold (91)',
          decision_support: {
            action_type: 'CLINICAL_REFERRAL',
            urgency: 'IMMEDIATE',
            headline: 'Refer to Unit Medical Officer for Neuro-Fatigue Evaluation',
            recommended_action: 'LOC deployment overload with composite risk 91. Immediate medical decompression required.',
            action_button_label: 'Order UMO Evaluation & Stand-Down',
            action_code: 'UMO_REFERRAL_KULDEEP',
            policy_mitigation: 'Operational Fatigue Safety Protocol',
          },
        },
      },
      {
        jcNumber: 'JC-1904',
        name: 'Sepoy Tariq Lone',
        rank: 'Sepoy',
        risk: 84,
        issue: 'Deferred rotational leave',
        momentum: {
          current_stress: 84,
          velocity_pts_per_day: 2.1,
          acceleration_pts_per_day2: 0.2,
          momentum_state: 'ACCELERATING',
          momentum_label: 'Accelerating Stress (+2.1 pts/day)',
          severity: 'HIGH',
          trajectory_arrow: '↗',
          color: 'amber',
          days_to_critical_threshold: 4,
          decision_support: {
            action_type: 'LEAVE_CLEARANCE',
            urgency: 'HIGH',
            headline: 'Clear Deferred Rotational Casual Leave Immediately',
            recommended_action: 'Furlough deferred twice due to border alert. Clear 10-day casual leave to restore baseline allostatic stability.',
            action_button_label: 'Clear 10-Day Casual Leave',
            action_code: 'CLEAR_LEAVE_TARIQ',
            policy_mitigation: 'Mandatory Rotational Leave Restitution',
          },
        },
      },
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
      {
        jcNumber: 'JC-3910',
        name: 'Hav. Amit Kumar',
        rank: 'Havildar',
        risk: 88,
        issue: 'Family domestic distress + sleep deficit',
        momentum: {
          current_stress: 88,
          velocity_pts_per_day: 2.8,
          acceleration_pts_per_day2: 0.3,
          momentum_state: 'ACCELERATING',
          momentum_label: 'Acute Personal Stress (+2.8 pts/day)',
          severity: 'HIGH',
          trajectory_arrow: '↗',
          days_to_critical_threshold: 1,
          color: 'rose',
          decision_support: {
            action_type: 'COMPASSIONATE_LEAVE',
            urgency: 'IMMEDIATE',
            headline: 'Approve Emergency Family Welfare Leave (14 Days)',
            recommended_action: 'Critical domestic distress combined with severe sleep deficit. Direct approval of compassionate leave bypass.',
            action_button_label: 'Grant 14-Day Compassionate Leave',
            action_code: 'COMPASSIONATE_LEAVE_AMIT',
            policy_mitigation: 'Article 22 Compassionate Leave Priority',
          },
        },
      },
      {
        jcNumber: 'JC-4821',
        name: 'Sepoy Vikas Thapa',
        rank: 'Sepoy',
        risk: 82,
        issue: 'Denied compassionate leave',
        momentum: {
          current_stress: 82,
          velocity_pts_per_day: 1.9,
          acceleration_pts_per_day2: 0.1,
          momentum_state: 'ACCELERATING',
          momentum_label: 'Elevated Grievance Stress (+1.9 pts/day)',
          severity: 'HIGH',
          trajectory_arrow: '↗',
          days_to_critical_threshold: 3,
          color: 'amber',
          decision_support: {
            action_type: 'COMMANDER_HEARING',
            urgency: 'HIGH',
            headline: 'Schedule Subedar Major & CO Grievance Interview',
            recommended_action: 'Resolve pending grievance on denied leave within 24 hours to defuse escalating discontent.',
            action_button_label: 'Order Grievance Interview',
            action_code: 'GRIEVANCE_HEARING_VIKAS',
            policy_mitigation: 'Welfare Grievance Redressal Mechanism',
          },
        },
      },
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
      {
        jcNumber: 'JC-6204',
        name: 'Naik Manoj Tiwari',
        rank: 'Naik',
        risk: 69,
        issue: 'Zero leave taken in 11 months',
        momentum: {
          current_stress: 69,
          velocity_pts_per_day: 0.8,
          acceleration_pts_per_day2: 0.0,
          momentum_state: 'STABLE',
          momentum_label: 'Latent Fatigue Accumulation (+0.8 pts/day)',
          severity: 'MODERATE',
          trajectory_arrow: '→',
          color: 'blue',
          days_to_critical_threshold: 20,
          decision_support: {
            action_type: 'MANDATORY_LEAVE',
            urgency: 'MEDIUM',
            headline: 'Schedule Planned Annual Furlough Window',
            recommended_action: 'Zero leave utilization over 11 months creates latent burnout risk. Schedule upcoming 20-day leave roster slot.',
            action_button_label: 'Queue Mandatory Leave',
            action_code: 'QUEUE_LEAVE_TIWARI',
            policy_mitigation: 'Annual Rest & Recuperation SOP',
          },
        },
      },
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
      {
        jcNumber: 'JC-1108',
        name: 'Subedar Gurpreet Singh',
        rank: 'Subedar',
        risk: 89,
        issue: 'Severe circadian disruption & night vigils',
        momentum: {
          current_stress: 89,
          velocity_pts_per_day: 3.9,
          acceleration_pts_per_day2: 0.6,
          momentum_state: 'ACUTE_SURGE',
          momentum_label: 'Circadian Disruption Surge (+3.9 pts/day)',
          severity: 'CRITICAL',
          trajectory_arrow: '↑',
          color: 'rose',
          days_to_critical_threshold: 1,
          critical_warning: 'Exceeding burnout threshold within 24 hours',
          decision_support: {
            action_type: 'DUTY_SWAP',
            urgency: 'IMMEDIATE',
            headline: 'Reassign Night Watch Vigil Roster to Charlie Coy',
            recommended_action: 'Consecutive night vigils causing severe sleep disruption. Rebalance duty roster to Charlie Coy.',
            action_button_label: 'Execute Roster Swap',
            action_code: 'SWAP_ROSTER_GURPREET',
            policy_mitigation: 'Circadian Duty Rebalancing SOP',
          },
        },
      },
      {
        jcNumber: 'JC-5811',
        name: 'Sepoy Vikram Rathore',
        rank: 'Sepoy',
        risk: 87,
        issue: 'Wearable sleep telemetry < 4.1h/day',
        momentum: {
          current_stress: 87,
          velocity_pts_per_day: 3.1,
          acceleration_pts_per_day2: 0.4,
          momentum_state: 'ACUTE_SURGE',
          momentum_label: 'Sleep Debt Acceleration (+3.1 pts/day)',
          severity: 'CRITICAL',
          trajectory_arrow: '↑',
          color: 'rose',
          days_to_critical_threshold: 1,
          decision_support: {
            action_type: 'DECOMPRESSION_REST',
            urgency: 'IMMEDIATE',
            headline: 'Mandate 48-Hour Decompression Rest Cycle',
            recommended_action: 'Telemetry confirms sleep deficit < 4.1h for 5 consecutive nights. Mandate 48-hour restorative bunk rest.',
            action_button_label: 'Authorize 48h Rest Cycle',
            action_code: 'DECOMPRESSION_REST_VIKRAM',
            policy_mitigation: 'Tactical Sleep Restoration SOP',
          },
        },
      },
    ],
  },
};

export const CommanderDashboard: React.FC = () => {
  const { t } = useLanguageStore();
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
  const [liveEventFilter, setLiveEventFilter] = useState<'all' | 'critical' | 'roster' | 'intel'>('all');
  const [triageTab, setTriageTab] = useState<'units' | 'warnings'>('units');

  // Individual Soldier Readiness Roster States
  const [soldierSearchQuery, setSoldierSearchQuery] = useState('');
  const [soldierTierFilter, setSoldierTierFilter] = useState<'all' | 'combat_ready' | 'mission_capable' | 'standby' | 'critical_standdown'>('all');
  const [soldierUnitFilter, setSoldierUnitFilter] = useState<string>('all');
  const [soldierSortBy, setSoldierSortBy] = useState<'readiness_desc' | 'readiness_asc' | 'duty_desc' | 'sleep_asc'>('readiness_desc');
  const [soldierViewMode, setSoldierViewMode] = useState<'table' | 'grid'>('table');

  const liveEvents = [
    {
      id: 'EVT-904',
      time: '14s ago',
      category: 'roster',
      level: 'ACTION',
      title: 'Stand-Down Protocol Initialized',
      details: 'Hav. Ramesh Chand night sentry post transfer pre-authorized for Sepoy Amit Kumar (SHAPE-1 Standby).',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-300 font-mono',
    },
    {
      id: 'EVT-903',
      time: '3m ago',
      category: 'critical',
      level: 'CRITICAL',
      title: 'Acute Velocity Exceedance Detected',
      details: 'Naik Rohit Sharma (Bravo Bn, C Coy) d(Stress)/dt reached +4.8 pts/day. Intercept window: 48h.',
      badge: 'bg-rose-50 text-rose-800 border-rose-300 font-mono',
    },
    {
      id: 'EVT-902',
      time: '9m ago',
      category: 'intel',
      level: 'TELEMETRY',
      title: '14-Day Baseline Telemetry Synced',
      details: 'Behavioral shift delta engine processed 520 personnel across 25 forward companies with 95.8% CI.',
      badge: 'bg-sky-50 text-sky-800 border-sky-300 font-mono',
    },
    {
      id: 'EVT-901',
      time: '21m ago',
      category: 'roster',
      level: 'ACTION',
      title: 'Fast-Track Compassionate Leave Queued',
      details: 'Sub. Gurpreet Singh 14-day domestic emergency leave routed to Chief Welfare Officer for endorsement.',
      badge: 'bg-amber-50 text-amber-800 border-amber-300 font-mono',
    },
    {
      id: 'EVT-900',
      time: '44m ago',
      category: 'intel',
      level: 'ROUTINE',
      title: 'Guard Shift Handover Confirmed',
      details: 'Observation Post Siachen B-4 watch cycle shift completed without operational incident.',
      badge: 'bg-slate-100 text-slate-700 border-slate-300 font-mono',
    },
  ];

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

  return (
    <div className="space-y-5 pb-12 font-sans text-slate-800">
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
      {/* 0. DEFENSE COMMAND CENTER OPERATIONAL HEADER & TELEMETRY RIBBON       */}
      {/* ===================================================================== */}
      <div className="rounded-2xl bg-[#0B1712] border border-emerald-950/80 shadow-md text-white overflow-hidden">
        {/* Top Telemetry & Clearance Strip */}
        <div className="px-4 py-2 bg-[#08110D] border-b border-emerald-900/40 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              RESTRICTED // REL TO COMMAND
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-300">
              {t('HQ Northern Command • XV Corps Formation')}
            </span>
          </div>

          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Radio className="w-3.5 h-3.5 text-emerald-400" />
              <span>SECURE MIL-NET // AES-256</span>
            </span>
            <span className="text-slate-600">&bull;</span>
            <span>LATENCY: <strong className="text-emerald-300">14ms</strong></span>
            <span className="text-slate-600">&bull;</span>
            <span>SYNC: <strong className="text-slate-200">14s AGO</strong></span>
          </div>
        </div>

        {/* Operational Context Bar */}
        <div className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-emerald-950/80 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight">
                  {t('Formation Command Operations Center')}
                </h2>
                <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-mono font-black uppercase">
                  DEFCON READINESS TIER 2
                </span>
                <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-mono font-bold">
                  HIGH TEMPO
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Aggregated operational readiness, acute fatigue vectors, and tactical roster stand-downs. Individual clinical check-ins remain airgapped in Welfare/Medical hub.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start md:self-auto">
            <button
              onClick={() => setActiveDecisionModal(true)}
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#D4A017] to-amber-600 hover:from-[#c39213] hover:to-amber-700 text-slate-950 font-black text-xs transition-all shadow-md cursor-pointer flex items-center gap-1.5"
            >
              <Terminal className="w-4 h-4" />
              <span>{t('Command Decision Center')}</span>
            </button>
            <button
              onClick={() => setActiveDossierUid('UID-EMP-012')}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 border border-white/10 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="Print Form 16 Executive Welfare Dossier"
            >
              <FileText className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('Form 16 Dossier')}</span>
            </button>
            <a
              href="#individual-soldier-readiness-roster"
              className="px-3 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/80 text-emerald-300 border border-emerald-500/40 font-bold text-xs transition-all cursor-pointer flex items-center gap-1.5"
              title="Jump to Individual Soldier Readiness Roster"
            >
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>{t('Soldier Readiness Roster')}</span>
            </a>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. VISUAL HIERARCHY: 4 ASYMMETRIC OPERATIONAL COMMAND METRIC BLOCKS    */}
      {/* Contextual Military Data (Readiness, High Risk, Directives, Coverage) */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Block 1: Operational Combat Readiness (Dominant) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-emerald-500/40 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {t('Force Posture')}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono text-[10px] font-bold">
                +1.8% vs 30d baseline
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                92.4%
              </span>
              <span className="text-xs font-bold text-emerald-600 uppercase">
                {t('Mission Ready')}
              </span>
            </div>
            {/* Bullet Graph: Benchmark target 85% vs Current 92.4% */}
            <div className="mt-2.5">
              <div className="relative w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: '92.4%' }}
                />
                {/* Target marker at 85% */}
                <div
                  className="absolute top-0 bottom-0 w-0.5 bg-slate-800 z-10"
                  style={{ left: '85%' }}
                  title="Target Benchmark: 85%"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>Threshold: 75%</span>
                <span className="font-bold text-slate-600">Target: 85%</span>
                <span className="text-emerald-600 font-bold">Current: 92.4%</span>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>4 of 5 Battalions Combat Ready</span>
            <span className="text-slate-400 font-mono">2,520 Troops</span>
          </div>
        </div>

        {/* Block 2: Acute Risk & High-Strain Personnel (Critical Focus) */}
        <div className="p-4 rounded-2xl bg-white border border-rose-200/80 shadow-xs flex flex-col justify-between hover:border-rose-400 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-rose-600 flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                {t('Personnel Under Watch')}
              </span>
              <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 font-mono text-[10px] font-bold">
                -8 (-20.5% vs Q2)
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-600 font-mono tracking-tight">
                31
              </span>
              <span className="text-xs font-bold text-slate-700">
                {t('High Strain Jawans')}
              </span>
            </div>
            {/* Sparkline trend over 7 days */}
            <div className="mt-2 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-[10px] text-slate-400 block font-mono">Surge Velocity:</span>
                <span className="text-xs font-bold text-rose-700 font-mono">4 Acute (V &ge; +2.5/d)</span>
              </div>
              {/* Mini Sparkline SVG (36 -> 34 -> 35 -> 33 -> 32 -> 31) */}
              <div className="w-20 h-6">
                <svg viewBox="0 0 60 20" className="w-full h-full">
                  <polyline
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    points="0,4 12,8 24,6 36,12 48,15 60,18"
                  />
                  <circle cx="60" cy="18" r="2.5" fill="#EF4444" />
                </svg>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-rose-100 text-[11px] text-rose-700 font-medium flex items-center justify-between">
            <span>2 Immediate Stand-Downs Required</span>
            <span className="font-bold cursor-pointer hover:underline" onClick={() => setActiveDecisionModal(true)}>Triage &rarr;</span>
          </div>
        </div>

        {/* Block 3: Pending Command Directives & Stand-Down Actions */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-amber-400 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {t('Command Directives')}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-mono text-[10px] font-bold">
                -4 Backlog vs Last Wk
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                12
              </span>
              <span className="text-xs font-bold text-amber-700">
                {t('Pending Sign-off')}
              </span>
            </div>
            {/* Completion ratio */}
            <div className="mt-2.5 space-y-1">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500">
                <span>Directive Adherence:</span>
                <span className="font-bold text-slate-800">81.4% Standard</span>
              </div>
              <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '81.4%' }} />
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
            <span>2 Swaps &bull; 5 Decompressions &bull; 5 Leave</span>
            <span className="text-slate-400 font-mono">HQ Standard</span>
          </div>
        </div>

        {/* Block 4: Formation Coverage & Logistical Airgap */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between hover:border-blue-400 transition-all">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono text-[10px] uppercase font-bold tracking-wider text-slate-400">
                {t('Formation Coverage')}
              </span>
              <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-bold">
                5 Bns &bull; 25 Coys
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-black text-slate-900 font-mono tracking-tight">
                18
              </span>
              <span className="text-xs font-bold text-slate-700">
                {t('Forward Observation Posts')}
              </span>
            </div>
            {/* Asset availability chips */}
            <div className="mt-2.5 flex items-center gap-1.5 flex-wrap text-[10px] font-mono">
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                MOs: <strong>5/6</strong>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Clinics: <strong>3/4</strong>
              </span>
              <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                Counsellors: <strong>12/15</strong>
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100 text-[11px] text-emerald-700 font-medium flex items-center justify-between">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Medical Airgap Enforced
            </span>
            <span className="text-slate-400 font-mono">ISO 27001</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 2. VISUAL HIERARCHY: CRITICAL ALERTS & IMMEDIATE TACTICAL STAND-DOWN   */}
      {/* (PRIMARY FOCUS: High Risk Personnel, Stand-Down Queue, Live Stream)    */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Left Column (8 cols): Tactical Stand-Down Queue & Acute Momentum */}
        <div className="lg:col-span-8 space-y-4">
          {/* Tactical Stand-Down Queue Card */}
          <div className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-700 shrink-0">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 tracking-tight">
                      {t('Tactical Command Roster Actions & Immediate Stand-Down Queue')}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-rose-50 text-rose-700 border border-rose-200 animate-pulse">
                      {t('2 Critical Fatigue Triggers')}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Actionable Command Decision Support: Relieve exhausted frontline jawans with verified SHAPE-1 standby personnel.
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 self-start sm:self-auto font-bold">
                HQ RoP Standard 14-A Active
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {/* Action Card 1: Havildar Ramesh Chand */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">Havildar Ramesh Chand</span>
                        <span className="text-[9px] font-mono text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">UID-EMP-012</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                        High Altitude Guard &bull; Observation Post Siachen B-4
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono font-black text-[10px] bg-rose-50 text-rose-700 border border-rose-200 shrink-0">
                      8 Night Shifts
                    </span>
                  </div>

                  <div className="mt-2.5 p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-semibold">{t('Critical Trigger:')}</span>
                      <span className="text-rose-700 font-bold">Hypoxia Strain + 3.8h Rest Debt</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-semibold">{t('Tactical Replacement:')}</span>
                      <span className="text-emerald-700 font-bold">Sepoy Amit Kumar (10 Para SF &bull; SHAPE-1 Standby)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">
                      Post: Night Sentry (00:00 - 06:00)
                    </span>
                    <button
                      onClick={() => setActiveDossierUid('UID-EMP-012')}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 underline font-bold cursor-pointer"
                    >
                      Form 16 🖨️
                    </button>
                  </div>
                  {swappedRosters['UID-EMP-012'] ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('Stood Down • Sepoy Amit Deployed')}</span>
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
                      className="px-3 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-800 text-white font-bold text-[11px] cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSwapping === 'UID-EMP-012' ? 'animate-spin' : ''}`} />
                      <span>{isSwapping === 'UID-EMP-012' ? t('Executing Swap...') : t('Approve Stand-down Swap')}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Action Card 2: Subedar Gurpreet Singh */}
              <div className="p-4 rounded-xl bg-slate-50/80 border border-slate-200 hover:border-amber-500/40 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-900">Subedar Gurpreet Singh</span>
                        <span className="text-[9px] font-mono text-slate-600 bg-white border border-slate-200 px-1.5 py-0.5 rounded">UID-EMP-013</span>
                      </div>
                      <div className="text-[10px] text-slate-500 mt-0.5 font-medium">
                        Field Artillery 3rd Bn &bull; Sector Artillery Battery 2
                      </div>
                    </div>
                    <span className="px-2 py-0.5 rounded font-mono font-black text-[10px] bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
                      5 Shifts + Family Emergency
                    </span>
                  </div>

                  <div className="mt-2.5 p-2.5 rounded-lg bg-white border border-slate-200 text-[11px] space-y-1 shadow-2xs">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-semibold">{t('Critical Trigger:')}</span>
                      <span className="text-amber-700 font-bold">Mother Hospitalized + Acute Vigil Stress</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-slate-500 font-semibold">{t('Tactical Replacement:')}</span>
                      <span className="text-emerald-700 font-bold">Captain Sarah Connor (Security Wing &bull; SHAPE-1 Available)</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-500">
                      Post: Battery Patrol (06:00 - 18:00)
                    </span>
                    <button
                      onClick={() => setActiveDossierUid('UID-EMP-013')}
                      className="text-[10px] text-emerald-700 hover:text-emerald-800 underline font-bold cursor-pointer"
                    >
                      Form 16 🖨️
                    </button>
                  </div>
                  {swappedRosters['UID-EMP-013'] ? (
                    <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t('Stood Down • Capt. Connor Deployed')}</span>
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
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] cursor-pointer shadow-xs transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3 h-3 ${isSwapping === 'UID-EMP-013' ? 'animate-spin' : ''}`} />
                      <span>{isSwapping === 'UID-EMP-013' ? t('Executing Swap...') : t('Fast-Track Compassionate Swap')}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Section 19: Operational Risk Momentum & Real-Time Action Directives */}
          <div className="p-5 rounded-2xl bg-[#0B1712] border border-amber-500/30 shadow-lg text-white space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400">
                      Risk Momentum Tracking • V = d(Stress)/dt
                    </span>
                    <span className="px-2 py-0.2 rounded bg-rose-500/20 text-rose-300 font-mono text-[10px] border border-rose-500/40">
                      Acute Surge Alert
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-white">
                    Early Interception Queue & Real-Time Command Directives
                  </h4>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                Threshold: &ge; +2.5 pts/day
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                {
                  id: 'JC-2748',
                  name: 'Naik Rohit Sharma',
                  unit: 'Bravo Bn &bull; C Coy',
                  stress: 86,
                  velocity: '+4.8 pts/day',
                  daysLeft: '2 Days',
                  actionCode: 'ROSTER_STAND_DOWN_ROHIT',
                  directive: 'Rotate Out of Night Watch & Grant 7-Day Furlough',
                  reason: 'Continuous LOC watch >14 mos. Acceleration +0.9 pts/d² indicates imminent collapse.',
                  btnLabel: 'Authorize Stand-Down',
                },
                {
                  id: 'JC-1108',
                  name: 'Subedar Gurpreet Singh',
                  unit: 'Echo Bn &bull; A Coy',
                  stress: 89,
                  velocity: '+3.9 pts/day',
                  daysLeft: '1 Day',
                  actionCode: 'SWAP_ROSTER_GURPREET',
                  directive: 'Reassign Night Watch Vigil Roster to Charlie Coy',
                  reason: 'Consecutive night vigils causing severe circadian disruption. Swap night duty roster.',
                  btnLabel: 'Authorize Roster Swap',
                },
                {
                  id: 'JC-3910',
                  name: 'Hav. Amit Kumar',
                  unit: 'Charlie Bn &bull; A Coy',
                  stress: 88,
                  velocity: '+2.8 pts/day',
                  daysLeft: '1 Day',
                  actionCode: 'COMPASSIONATE_LEAVE_AMIT',
                  directive: 'Approve Emergency Family Welfare Leave (14 Days)',
                  reason: 'Domestic distress combined with acute sleep deficit. Direct compassionate bypass.',
                  btnLabel: 'Grant 14-Day Leave',
                },
              ].map((item) => {
                const isDispatched = dispatchedActions.includes(item.actionCode);
                return (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-white/5 border border-white/10 hover:border-amber-500/40 flex flex-col justify-between transition-all space-y-2.5"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-[10px] font-mono text-amber-400 font-bold block">{item.id}</span>
                          <h5 className="text-xs font-bold text-white">{item.name}</h5>
                          <span className="text-[10px] text-slate-400" dangerouslySetInnerHTML={{ __html: item.unit }} />
                        </div>
                        <div className="text-right">
                          <div className="font-mono text-sm font-black text-rose-400">
                            {item.velocity}
                          </div>
                          <span className="text-[9px] font-mono text-rose-300 block">
                            Crit: {item.daysLeft}
                          </span>
                        </div>
                      </div>

                      <div className="mt-2 p-2 rounded-lg bg-black/40 border border-white/5 space-y-0.5 text-[11px]">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 block">
                          Directive
                        </span>
                        <p className="font-semibold text-slate-100">{item.directive}</p>
                        <p className="text-[10px] text-slate-400 leading-tight">{item.reason}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDispatchCommand(`Directive Executed [${item.actionCode}]: ${item.directive}`)}
                      disabled={isDispatched}
                      className={`w-full py-1.5 px-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 shadow-xs ${
                        isDispatched
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                          : 'bg-rose-700 hover:bg-rose-600 text-white'
                      }`}
                    >
                      <Send className="w-3 h-3" />
                      <span>{isDispatched ? 'Dispatched ✓' : item.btnLabel}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (4 cols): Live Command Event Stream & Telemetry Feed */}
        <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3.5">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-emerald-600" />
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {t('Live Operational Event Stream')}
                </h3>
              </div>
              <span className="flex items-center gap-1 text-[10px] font-mono text-emerald-600 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                STREAM ACTIVE
              </span>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1 mt-2.5 p-1 rounded-lg bg-slate-100 text-[10px] font-mono">
              {(['all', 'critical', 'roster', 'intel'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setLiveEventFilter(tab)}
                  className={`flex-1 py-1 rounded capitalize font-bold transition-colors cursor-pointer ${
                    liveEventFilter === tab
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Event List */}
            <div className="mt-3 space-y-2.5">
              {liveEvents
                .filter((evt) => liveEventFilter === 'all' || evt.category === liveEventFilter)
                .map((evt) => (
                  <div
                    key={evt.id}
                    className="p-2.5 rounded-xl bg-slate-50/80 border border-slate-200/70 hover:bg-slate-100/80 transition-colors space-y-1"
                  >
                    <div className="flex items-center justify-between text-[10px]">
                      <span className={`px-1.5 py-0.2 rounded border text-[9px] font-bold ${evt.badge}`}>
                        {evt.level}
                      </span>
                      <span className="font-mono text-slate-400">{evt.time}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900 leading-snug">
                      {evt.title}
                    </p>
                    <p className="text-[11px] text-slate-500 leading-tight">
                      {evt.details}
                    </p>
                  </div>
                ))}
            </div>
          </div>

          <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-mono text-slate-400">
            <span>Audit Hash: #0x9F4B...21</span>
            <span className="text-emerald-700 font-semibold">100% Ingest Verified</span>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3. VISUAL HIERARCHY: OPERATIONAL READINESS & FORCE POSTURE            */}
      {/* (Replaced repetitive progress bars with bullet graphs, sparklines,    */}
      {/*  historical baseline comparisons, radar overlay)                      */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left (7 cols): Battalion Tactical Readiness Matrix (Bullet Graphs & Coy Status) */}
        <div className="lg:col-span-7 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-800" />
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {t('Formation Readiness & Company Distribution Matrix')}
                </h3>
                <span className="text-[10px] text-slate-500">
                  Target threshold benchmark: &ge; 85.0% readiness
                </span>
              </div>
            </div>
            <button
              onClick={() => setActiveDecisionModal(true)}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer"
            >
              Command Directives &rarr;
            </button>
          </div>

          {/* Unit Bullet Graph Matrix */}
          <div className="space-y-3 py-1">
            {[
              { name: 'Alpha Battalion', key: 'Alpha', pct: 92, strength: 510, coys: ['Low', 'Low', 'Low', 'Low', 'Low'], status: 'Optimal' },
              { name: 'Bravo Battalion', key: 'Bravo', pct: 88, strength: 495, coys: ['High', 'Med', 'Crit', 'Crit', 'Low'], status: 'Overload Watch' },
              { name: 'Charlie Battalion', key: 'Charlie', pct: 81, strength: 505, coys: ['Crit', 'Med', 'Med', 'High', 'Low'], status: 'Separation Stress' },
              { name: 'Delta Battalion', key: 'Delta', pct: 94, strength: 512, coys: ['Low', 'Low', 'Low', 'Med', 'Low'], status: 'Combat Ready' },
              { name: 'Echo Battalion', key: 'Echo', pct: 78, strength: 498, coys: ['Crit', 'Crit', 'High', 'Med', 'Low'], status: 'Sleep Deprivation' },
            ].map((u) => {
              const isAboveTarget = u.pct >= 85;
              return (
                <div
                  key={u.key}
                  onClick={() => handleOpenBattalion(u.key)}
                  className="group p-2.5 rounded-xl border border-slate-100 hover:border-emerald-300 hover:bg-slate-50/80 transition-all cursor-pointer space-y-1.5"
                  title="Click to drill down into company breakdown & flagged jawans"
                >
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 group-hover:text-emerald-800 transition-colors">
                        {u.name}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        ({u.strength} Jawans)
                      </span>
                      <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold ${
                        isAboveTarget ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                      }`}>
                        {u.status}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-[10px] text-slate-400">Readiness:</span>
                      <span className="font-black text-slate-900 text-xs">{u.pct}%</span>
                    </div>
                  </div>

                  {/* Bullet Graph with Target Notch at 85% */}
                  <div className="relative w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        u.pct >= 90 ? 'bg-emerald-500' : u.pct >= 85 ? 'bg-emerald-600' : u.pct >= 80 ? 'bg-amber-500' : 'bg-rose-500'
                      }`}
                      style={{ width: `${u.pct}%` }}
                    />
                    {/* Target marker line at 85% */}
                    <div
                      className="absolute top-0 bottom-0 w-0.5 bg-slate-900 z-10"
                      style={{ left: '85%' }}
                    />
                  </div>

                  {/* Company Distribution Pips */}
                  <div className="flex items-center justify-between text-[10px]">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-400 font-mono text-[9px] uppercase">Coys:</span>
                      {u.coys.map((c, cIdx) => (
                        <span
                          key={cIdx}
                          className={`w-4 h-4 rounded text-[9px] font-bold flex items-center justify-center font-mono ${
                            c === 'Crit' ? 'bg-rose-100 text-rose-800' :
                            c === 'High' ? 'bg-orange-100 text-orange-800' :
                            c === 'Med' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}
                          title={`Company ${String.fromCharCode(65 + cIdx)}: ${c}`}
                        >
                          {String.fromCharCode(65 + cIdx)}
                        </span>
                      ))}
                    </div>
                    <span className="text-[10px] text-emerald-800 font-semibold group-hover:underline flex items-center gap-0.5">
                      Dossier Drill-down <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Threshold target line indicates 85.0% General Staff Operational Benchmark
          </div>
        </div>

        {/* Right (5 cols): Operational Readiness 6-Month Trend Curve */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-800" />
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {t('Operational Readiness Trend')}
                </h3>
                <span className="text-[10px] text-slate-500">6-Month Moving Aggregate</span>
              </div>
            </div>
            <select
              value={trendRange}
              onChange={(e) => setTrendRange(e.target.value as any)}
              className="text-[10px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 outline-none cursor-pointer"
            >
              <option value="6m">Last 6 Months</option>
              <option value="30d">Last 30 Days</option>
              <option value="1y">Last 1 Year</option>
            </select>
          </div>

          <div className="py-2 relative">
            <svg viewBox="0 0 240 100" className="w-full h-32 overflow-visible">
              <defs>
                <linearGradient id="readinessGradEnterprise" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10B981" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="25" y1="15" x2="235" y2="15" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="25" y1="40" x2="235" y2="40" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="25" y1="65" x2="235" y2="65" stroke="#E2E8F0" strokeDasharray="3 3" />
              <line x1="25" y1="90" x2="235" y2="90" stroke="#E2E8F0" strokeDasharray="3 3" />

              {/* Target Benchmark Line at 85% */}
              <line x1="25" y1="52" x2="235" y2="52" stroke="#F59E0B" strokeWidth="1" strokeDasharray="4 2" />

              {/* Y Axis Labels */}
              <text x="5" y="18" fill="#94A3B8" fontSize="8" fontWeight="bold">100%</text>
              <text x="5" y="43" fill="#94A3B8" fontSize="8" fontWeight="bold">90%</text>
              <text x="5" y="68" fill="#94A3B8" fontSize="8" fontWeight="bold">80%</text>
              <text x="5" y="93" fill="#94A3B8" fontSize="8" fontWeight="bold">70%</text>

              {/* Area fill */}
              <path
                d="M 35,50 L 75,45 L 115,52 L 155,40 L 195,35 L 230,35 L 230,90 L 35,90 Z"
                fill="url(#readinessGradEnterprise)"
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
                    y={p.y - 6}
                    fill="#0F172A"
                    fontSize="8"
                    fontWeight="bold"
                    textAnchor="middle"
                  >
                    {p.pt.value}%
                  </text>
                  <text
                    x={p.x}
                    y="100"
                    fill="#64748B"
                    fontSize="8"
                    fontWeight="600"
                    textAnchor="middle"
                  >
                    {p.pt.month}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-500 font-mono">
              {hoveredTrendPoint
                ? `${hoveredTrendPoint.month}: ${hoveredTrendPoint.value}% Recorded`
                : 'Benchmark Target: ≥85%'}
            </span>
            <span className="text-emerald-700 font-bold font-mono">+6.0% Surge Since Mar</span>
          </div>
        </div>
      </div>

      {/* Force Health Radar & Risk Distribution (Donut + Radar Pair) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4">
        {/* Force Health Hexagonal Radar (7 cols) */}
        <div className="lg:col-span-7 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-800" />
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900 tracking-tight">
                  {t('Force Health Hexagonal Multi-Axial Radar')}
                </h3>
                <span className="text-[10px] text-slate-500">Current Deployment Cycle vs Previous Cycle Baseline</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-bold">
              <span className="flex items-center gap-1 text-emerald-600">
                <span className="w-2.5 h-0.5 bg-emerald-500 rounded-full" /> Current
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-0.5 border-t border-slate-400 border-dashed" /> Baseline
              </span>
            </div>
          </div>

          <div className="py-2 flex items-center justify-center">
            <svg viewBox="0 0 190 180" className="w-44 h-44">
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

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Burnout index improved by 10% following watch roster rebalancing
          </div>
        </div>

        {/* Psychometric Risk Distribution Donut (5 cols) */}
        <div className="lg:col-span-5 p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs">
              <Users className="w-4 h-4 text-emerald-800" />
              <span>Personnel Risk Distribution</span>
            </div>
            <span className="font-mono text-[10px] text-slate-400">Total: 520 Sample</span>
          </div>

          <div className="py-2 flex items-center justify-center gap-4">
            {/* SVG Donut */}
            <div className="relative w-28 h-28 shrink-0">
              <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
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
                <span className="text-[9px] text-slate-500 font-medium">Troops</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-1.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                <span className="text-slate-600 font-medium text-[11px]">Critical Tier</span>
                <span className="ml-auto font-black text-slate-900 text-[11px]">4% (24)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shrink-0" />
                <span className="text-slate-600 font-medium text-[11px]">High Tier</span>
                <span className="ml-auto font-black text-slate-900 text-[11px]">12% (62)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                <span className="text-slate-600 font-medium text-[11px]">Medium Tier</span>
                <span className="ml-auto font-black text-slate-900 text-[11px]">26% (135)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0" />
                <span className="text-slate-600 font-medium text-[11px]">Low Tier</span>
                <span className="ml-auto font-black text-slate-900 text-[11px]">58% (299)</span>
              </div>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Psychometric Stress &amp; Fatigue Population Census
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 3B. INDIVIDUAL SOLDIER COMBAT READINESS ROSTER                        */}
      {/* (Readiness Score & Operational Telemetry for Each and Every Soldier)   */}
      {/* ===================================================================== */}
      <div id="individual-soldier-readiness-roster" className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs space-y-4">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-2xs shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
                  {t('Individual Soldier Combat Readiness Roster')}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-300 font-mono text-[10px] font-black uppercase tracking-wider">
                  ALL DEPLOYED JAWANS &bull; LIVE TELEMETRY
                </span>
                <span className="px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 font-mono text-[10px] font-bold">
                  DEFENSE FORM 16 INTEGRATED
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time operational readiness scores for each individual soldier. Synthesizes continuous duty duration, restorative sleep telemetry, 21-day stress momentum, and mission capability bands.
              </p>
            </div>
          </div>

          {/* Quick Summary Counter Badges */}
          <div className="flex items-center gap-2 flex-wrap text-[11px] font-mono">
            <span className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 font-bold border border-emerald-200">
              Avg Readiness: <strong>71.7%</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-700 font-bold border border-emerald-300">
              Ready (&ge;80%): <strong>5</strong>
            </span>
            <span className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-700 font-bold border border-rose-200">
              Stand-Down (&lt;50%): <strong>4</strong>
            </span>
          </div>
        </div>

        {/* 4 Summary Stat Mini-Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-slate-500 uppercase">Total Tracked Jawans</span>
              <p className="text-lg font-black text-slate-900 mt-0.5">15 Deployed</p>
              <span className="text-[10px] text-slate-500">Across 6 Formations</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-slate-200/70 flex items-center justify-center text-slate-700 font-bold">
              <Crosshair className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-emerald-700 uppercase font-bold">Tier 1 &bull; Combat Ready</span>
              <p className="text-lg font-black text-emerald-900 mt-0.5">5 Soldiers (33%)</p>
              <span className="text-[10px] text-emerald-700">&ge; 80% Readiness Score</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-sky-50/70 border border-sky-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-sky-700 uppercase font-bold">Tier 2 &bull; Mission Capable</span>
              <p className="text-lg font-black text-sky-900 mt-0.5">4 Soldiers (27%)</p>
              <span className="text-[10px] text-sky-700">65% &ndash; 79% Readiness Score</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-sky-200 text-sky-900 flex items-center justify-center font-bold">
              <Activity className="w-4 h-4" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-mono text-rose-700 uppercase font-bold">Tier 4 &bull; Stand-Down Alert</span>
              <p className="text-lg font-black text-rose-900 mt-0.5">4 Soldiers (27%)</p>
              <span className="text-[10px] text-rose-700">&lt; 50% Critical Burnout Risk</span>
            </div>
            <div className="w-8 h-8 rounded-lg bg-rose-200 text-rose-900 flex items-center justify-center font-bold">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Filter, Search & View Controls Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200/80">
          {/* Search Box */}
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={soldierSearchQuery}
              onChange={(e) => setSoldierSearchQuery(e.target.value)}
              placeholder={t('Search by soldier name, rank, regimental ID, or tactical skill...')}
              className="w-full pl-9 pr-8 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:border-emerald-500 transition-colors"
            />
            {soldierSearchQuery && (
              <button
                onClick={() => setSoldierSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { key: 'all', label: 'All Soldiers (15)' },
              { key: 'combat_ready', label: 'Tier 1 &bull; Ready &ge;80% (5)', color: 'text-emerald-800' },
              { key: 'mission_capable', label: 'Tier 2 &bull; 65-79% (4)', color: 'text-sky-800' },
              { key: 'standby', label: 'Tier 3 &bull; 50-64% (2)', color: 'text-amber-800' },
              { key: 'critical_standdown', label: 'Tier 4 &bull; Stand-Down &lt;50% (4)', color: 'text-rose-800' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setSoldierTierFilter(f.key as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  soldierTierFilter === f.key
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
                dangerouslySetInnerHTML={{ __html: f.label }}
              />
            ))}
          </div>

          {/* Unit Filter, Sort & View Mode */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={soldierUnitFilter}
              onChange={(e) => setSoldierUnitFilter(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="all">All Formations</option>
              <option value="High Altitude Guard">High Altitude Guard</option>
              <option value="Field Artillery 3rd Bn">Field Artillery 3rd Bn</option>
              <option value="Mountain Recon 7th">Mountain Recon 7th</option>
              <option value="Disaster Response 1st">Disaster Response 1st</option>
              <option value="Alpha Battalion">Alpha Battalion</option>
              <option value="Bravo Battalion">Bravo Battalion</option>
              <option value="Delta Battalion">Delta Battalion</option>
              <option value="Training Center">Training Center</option>
              <option value="VIP Escort Convoy">VIP Escort Convoy</option>
            </select>

            <select
              value={soldierSortBy}
              onChange={(e) => setSoldierSortBy(e.target.value as any)}
              className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer focus:outline-hidden"
            >
              <option value="readiness_desc">Readiness: High to Low</option>
              <option value="readiness_asc">Readiness: Low to High (Urgent)</option>
              <option value="duty_desc">Most Duty Days</option>
              <option value="sleep_asc">Least Sleep (Sleep Debt)</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5">
              <button
                onClick={() => setSoldierViewMode('table')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  soldierViewMode === 'table' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Table Roster View"
              >
                <ListFilter className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSoldierViewMode('grid')}
                className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                  soldierViewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-400 hover:text-slate-600'
                }`}
                title="Tactical Grid View"
              >
                <LayoutGrid className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Soldiers Roster List / Table */}
        {(() => {
          const allSoldiersList = [
            {
              uid: 'UID-SOL-102',
              name: 'Havildar Gurpreet Singh',
              rank: 'Havildar',
              regimentalNumber: 'ARMY-2018-8013',
              unit: 'Field Artillery 3rd Bn',
              station: 'Forward Observation Post Echo',
              readinessScore: 94,
              stressScore: 16,
              sleepHours: 7.8,
              consecutiveDutyDays: 2,
              fatigueLevel: 2,
              trend21d: 3.1,
              stressVelocity: '-0.8 pts/day',
              medicalCategory: 'SHAPE-1',
              primarySkill: 'Urban Combat & CQB',
              status: 'Combat Ready',
              tier: 'TIER_1',
            },
            {
              uid: 'UID-SOL-101',
              name: 'Subedar R. N. Yadav',
              rank: 'Subedar',
              regimentalNumber: 'CRPF-2015-8011',
              unit: 'High Altitude Guard',
              station: 'LOC Siachen Forward Post Alpha',
              readinessScore: 92,
              stressScore: 22,
              sleepHours: 7.4,
              consecutiveDutyDays: 3,
              fatigueLevel: 3,
              trend21d: 2.4,
              stressVelocity: '-0.5 pts/day',
              medicalCategory: 'SHAPE-1',
              primarySkill: 'High Altitude Tactical Command',
              status: 'Combat Ready',
              tier: 'TIER_1',
            },
            {
              uid: 'UID-SOL-104',
              name: 'Havildar Manpreet Singh',
              rank: 'Havildar',
              regimentalNumber: 'ARMY-2017-8015',
              unit: 'VIP Escort Convoy',
              station: 'Command Perimeter Security',
              readinessScore: 88,
              stressScore: 24,
              sleepHours: 7.5,
              consecutiveDutyDays: 3,
              fatigueLevel: 3,
              trend21d: 1.8,
              stressVelocity: '-0.3 pts/day',
              medicalCategory: 'SHAPE-1',
              primarySkill: 'Close Protection & Protocol',
              status: 'Combat Ready',
              tier: 'TIER_1',
            },
            {
              uid: 'UID-SOL-103',
              name: 'Naik Sandeep Singh',
              rank: 'Naik',
              regimentalNumber: 'CRPF-2019-8014',
              unit: 'Mountain Recon 7th',
              station: 'Northern Ridge Outpost B-2',
              readinessScore: 86,
              stressScore: 26,
              sleepHours: 7.2,
              consecutiveDutyDays: 4,
              fatigueLevel: 4,
              trend21d: 1.2,
              stressVelocity: '+0.2 pts/day',
              medicalCategory: 'SHAPE-1',
              primarySkill: 'Marksman & Long-Range Recon',
              status: 'Combat Ready',
              tier: 'TIER_1',
            },
            {
              uid: 'UID-SOL-111',
              name: 'Havildar Arjun Nair',
              rank: 'Havildar',
              regimentalNumber: 'CRPF-2018-8022',
              unit: 'Disaster Response 1st',
              station: 'Base Camp Sector 4',
              readinessScore: 82,
              stressScore: 32,
              sleepHours: 7.1,
              consecutiveDutyDays: 4,
              fatigueLevel: 4,
              trend21d: 1.1,
              stressVelocity: '+0.4 pts/day',
              medicalCategory: 'SHAPE-1',
              primarySkill: 'Amphibious Triage & Heavy Rescue',
              status: 'Combat Ready',
              tier: 'TIER_1',
            },
            {
              uid: 'UID-SOL-107',
              name: 'Sepoy Kuldeep Singh',
              rank: 'Sepoy',
              regimentalNumber: 'CRPF-2021-8018',
              unit: 'Alpha Battalion',
              station: 'Battalion Watch Gate 2',
              readinessScore: 74,
              stressScore: 38,
              sleepHours: 7.0,
              consecutiveDutyDays: 3,
              fatigueLevel: 5,
              trend21d: 0.8,
              stressVelocity: '+0.5 pts/day',
              medicalCategory: 'SHAPE-1',
              primarySkill: 'Perimeter Watch & Comms',
              status: 'Mission Capable',
              tier: 'TIER_2',
            },
            {
              uid: 'UID-SOL-105',
              name: 'Naik Rajesh Kumar',
              rank: 'Naik',
              regimentalNumber: 'CRPF-2020-8016',
              unit: 'Alpha Battalion',
              station: 'Forward LOC Mobile Patrol',
              readinessScore: 71,
              stressScore: 42,
              sleepHours: 6.8,
              consecutiveDutyDays: 4,
              fatigueLevel: 5,
              trend21d: 0.4,
              stressVelocity: '+0.6 pts/day',
              medicalCategory: 'SHAPE-1',
              primarySkill: 'Crowd De-escalation & Surveillance',
              status: 'Mission Capable',
              tier: 'TIER_2',
            },
            {
              uid: 'UID-SOL-106',
              name: 'Sepoy Amit Verma',
              rank: 'Sepoy',
              regimentalNumber: 'ARMY-2022-8017',
              unit: 'Field Artillery 3rd Bn',
              station: 'Munitions Supply Depot',
              readinessScore: 67,
              stressScore: 44,
              sleepHours: 6.9,
              consecutiveDutyDays: 5,
              fatigueLevel: 6,
              trend21d: -0.2,
              stressVelocity: '+0.9 pts/day',
              medicalCategory: 'SHAPE-1',
              primarySkill: 'Heavy Equipment Logistics',
              status: 'Mission Capable',
              tier: 'TIER_2',
            },
            {
              uid: 'UID-SOL-108',
              name: 'Sepoy Dinesh Sharma',
              rank: 'Sepoy',
              regimentalNumber: 'CRPF-2020-8019',
              unit: 'Delta Battalion',
              station: 'Waterborne Operations Dock',
              readinessScore: 65,
              stressScore: 46,
              sleepHours: 6.7,
              consecutiveDutyDays: 4,
              fatigueLevel: 6,
              trend21d: 0.2,
              stressVelocity: '+0.7 pts/day',
              medicalCategory: 'SHAPE-1',
              primarySkill: 'Water Rescue & Engineering',
              status: 'Mission Capable',
              tier: 'TIER_2',
            },
            {
              uid: 'UID-SOL-112',
              name: 'Subedar Sunil Mehta',
              rank: 'Subedar',
              regimentalNumber: 'ARMY-2014-8023',
              unit: 'Training Center',
              station: 'Firing Range Command Post',
              readinessScore: 62,
              stressScore: 48,
              sleepHours: 6.8,
              consecutiveDutyDays: 3,
              fatigueLevel: 6,
              trend21d: 0.3,
              stressVelocity: '+0.5 pts/day',
              medicalCategory: 'SHAPE-1',
              primarySkill: 'Drill Instruction & Mentoring',
              status: 'Operational Standby',
              tier: 'TIER_3',
            },
            {
              uid: 'UID-EMP-015',
              name: 'Sepoy Amit Kumar',
              rank: 'Sepoy',
              regimentalNumber: 'CRPF-2020-8015',
              unit: 'High Altitude Guard',
              station: 'Rear Echelon Rest Camp',
              readinessScore: 60,
              stressScore: 50,
              sleepHours: 6.5,
              consecutiveDutyDays: 4,
              fatigueLevel: 5,
              trend21d: 0.6,
              stressVelocity: '+0.3 pts/day',
              medicalCategory: 'SHAPE-1',
              primarySkill: 'Base Security & Rapid Relief',
              status: 'Operational Standby',
              tier: 'TIER_3',
            },
            {
              uid: 'UID-SOL-109',
              name: 'Naik Vikram Rathore',
              rank: 'Naik',
              regimentalNumber: 'CRPF-2019-8020',
              unit: 'High Altitude Guard',
              station: 'Glacier Outpost Delta (17,200 ft)',
              readinessScore: 52,
              stressScore: 69,
              sleepHours: 4.1,
              consecutiveDutyDays: 15,
              fatigueLevel: 8,
              trend21d: -14.2,
              stressVelocity: '+2.9 pts/day',
              medicalCategory: 'SHAPE-1 (Temporary P2)',
              primarySkill: 'Extreme Altitude Surveillance',
              status: 'Fatigue Risk &bull; Monitor',
              tier: 'TIER_3',
            },
            {
              uid: 'UID-SOL-110',
              name: 'Sepoy Sanjay Patel',
              rank: 'Sepoy',
              regimentalNumber: 'ARMY-2021-8021',
              unit: 'Bravo Battalion',
              station: 'Urban Breach Outpost C',
              readinessScore: 49,
              stressScore: 72,
              sleepHours: 4.3,
              consecutiveDutyDays: 14,
              fatigueLevel: 8,
              trend21d: -11.8,
              stressVelocity: '+3.1 pts/day',
              medicalCategory: 'SHAPE-1 (Temporary P2)',
              primarySkill: 'Tactical Urban Patrol',
              status: 'Stand-Down Indicated',
              tier: 'TIER_4',
            },
            {
              uid: 'UID-EMP-012',
              name: 'Havildar Ramesh Chand',
              rank: 'Havildar',
              regimentalNumber: 'CRPF-2016-8012',
              unit: 'High Altitude Guard',
              station: 'Forward Sentry Post Charlie',
              readinessScore: 42,
              stressScore: 88,
              sleepHours: 3.8,
              consecutiveDutyDays: 8,
              fatigueLevel: 9,
              trend21d: -18.5,
              stressVelocity: '+3.8 pts/day',
              medicalCategory: 'SHAPE-1 (Temporary P2)',
              primarySkill: 'High Altitude Sentry Watch',
              status: 'Critical Stand-Down',
              tier: 'TIER_4',
            },
            {
              uid: 'UID-EMP-014',
              name: 'Naik Rohit Sharma',
              rank: 'Naik',
              regimentalNumber: 'ARMY-2019-2748',
              unit: 'Bravo Bn &bull; C Coy',
              station: 'LOC Night Watch Bunker 4',
              readinessScore: 38,
              stressScore: 86,
              sleepHours: 3.5,
              consecutiveDutyDays: 16,
              fatigueLevel: 9,
              trend21d: -16.8,
              stressVelocity: '+4.8 pts/day',
              medicalCategory: 'SHAPE-2 (Severe Strain)',
              primarySkill: 'Night Perimeter Observation',
              status: 'Critical Stand-Down',
              tier: 'TIER_4',
            },
          ];

          // 1. Filter by Search Query
          let filtered = allSoldiersList.filter((s) => {
            if (!soldierSearchQuery.trim()) return true;
            const q = soldierSearchQuery.toLowerCase();
            return (
              s.name.toLowerCase().includes(q) ||
              s.regimentalNumber.toLowerCase().includes(q) ||
              s.rank.toLowerCase().includes(q) ||
              s.unit.toLowerCase().includes(q) ||
              s.primarySkill.toLowerCase().includes(q) ||
              s.station.toLowerCase().includes(q)
            );
          });

          // 2. Filter by Tier
          if (soldierTierFilter === 'combat_ready') {
            filtered = filtered.filter((s) => s.readinessScore >= 80);
          } else if (soldierTierFilter === 'mission_capable') {
            filtered = filtered.filter((s) => s.readinessScore >= 65 && s.readinessScore < 80);
          } else if (soldierTierFilter === 'standby') {
            filtered = filtered.filter((s) => s.readinessScore >= 50 && s.readinessScore < 65);
          } else if (soldierTierFilter === 'critical_standdown') {
            filtered = filtered.filter((s) => s.readinessScore < 50);
          }

          // 3. Filter by Unit
          if (soldierUnitFilter !== 'all') {
            filtered = filtered.filter((s) => s.unit.toLowerCase().includes(soldierUnitFilter.toLowerCase()));
          }

          // 4. Sort
          filtered.sort((a, b) => {
            if (soldierSortBy === 'readiness_desc') return b.readinessScore - a.readinessScore;
            if (soldierSortBy === 'readiness_asc') return a.readinessScore - b.readinessScore;
            if (soldierSortBy === 'duty_desc') return b.consecutiveDutyDays - a.consecutiveDutyDays;
            if (soldierSortBy === 'sleep_asc') return a.sleepHours - b.sleepHours;
            return 0;
          });

          if (filtered.length === 0) {
            return (
              <div className="p-8 text-center rounded-xl bg-slate-50 border border-slate-200">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-700">No personnel match your search or filter criteria.</p>
                <p className="text-xs text-slate-400 mt-1">Try clearing your search query or selecting "All Soldiers".</p>
                <button
                  onClick={() => {
                    setSoldierSearchQuery('');
                    setSoldierTierFilter('all');
                    setSoldierUnitFilter('all');
                  }}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            );
          }

          if (soldierViewMode === 'table') {
            return (
              <div className="overflow-x-auto rounded-xl border border-slate-200/90 shadow-2xs">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-100/90 border-b border-slate-200 text-[10.5px] font-mono font-bold text-slate-600 uppercase tracking-wider">
                      <th className="py-2.5 px-3.5">Soldier Identity</th>
                      <th className="py-2.5 px-3">Unit &amp; Deployment Post</th>
                      <th className="py-2.5 px-3 text-center">Readiness Score</th>
                      <th className="py-2.5 px-3">Vitals (Sleep &amp; Duty)</th>
                      <th className="py-2.5 px-3">21-Day Trajectory</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Command Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filtered.map((s) => {
                      const isSwapped = swappedRosters[s.uid];
                      const isHighTier = s.readinessScore >= 80;
                      const isMedTier = s.readinessScore >= 65 && s.readinessScore < 80;
                      const isStandbyTier = s.readinessScore >= 50 && s.readinessScore < 65;
                      const isLowTier = s.readinessScore < 50;

                      const scoreBadgeColor = isHighTier
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : isMedTier
                        ? 'bg-sky-50 text-sky-800 border-sky-300'
                        : isStandbyTier
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : 'bg-rose-50 text-rose-800 border-rose-300';

                      const barColor = isHighTier
                        ? 'bg-emerald-600'
                        : isMedTier
                        ? 'bg-sky-600'
                        : isStandbyTier
                        ? 'bg-amber-500'
                        : 'bg-rose-600';

                      return (
                        <tr
                          key={s.uid}
                          className="hover:bg-slate-50/80 transition-colors group"
                        >
                          {/* Soldier Identity */}
                          <td className="py-3 px-3.5">
                            <div className="flex items-center gap-2.5">
                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs shrink-0 ${
                                  isHighTier
                                    ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                    : isLowTier
                                    ? 'bg-rose-100 text-rose-900 border border-rose-300'
                                    : 'bg-slate-100 text-slate-800 border border-slate-300'
                                }`}
                              >
                                {s.name
                                  .split(' ')
                                  .map((n) => n[0])
                                  .slice(0, 2)
                                  .join('')}
                              </div>
                              <div>
                                <div className="font-black text-slate-900 flex items-center gap-1.5">
                                  <span>{s.name}</span>
                                </div>
                                <div className="text-[10px] font-mono text-slate-500 flex items-center gap-1">
                                  <span>{s.rank}</span>
                                  <span>&bull;</span>
                                  <span className="text-slate-400">{s.regimentalNumber}</span>
                                </div>
                                <span className="text-[9.5px] text-slate-400 font-medium">
                                  {s.primarySkill}
                                </span>
                              </div>
                            </div>
                          </td>

                          {/* Unit & Station */}
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-800 text-[11px]">{s.unit}</div>
                            <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                              <Crosshair className="w-2.5 h-2.5 text-slate-400" />
                              <span>{s.station}</span>
                            </div>
                          </td>

                          {/* Readiness Score & Gauge */}
                          <td className="py-3 px-3">
                            <div className="flex flex-col items-center">
                              <div className="flex items-center gap-1.5">
                                <span className="text-base font-black font-mono tracking-tight text-slate-900">
                                  {s.readinessScore}%
                                </span>
                                <span
                                  className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${scoreBadgeColor}`}
                                >
                                  {isHighTier
                                    ? 'COMBAT READY'
                                    : isMedTier
                                    ? 'CAPABLE'
                                    : isStandbyTier
                                    ? 'STANDBY'
                                    : 'STAND-DOWN'}
                                </span>
                              </div>

                              {/* Visual Progress Bar */}
                              <div className="w-28 h-2 bg-slate-100 rounded-full overflow-hidden mt-1 relative">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                                  style={{ width: `${s.readinessScore}%` }}
                                />
                                {/* 85% Benchmark Line */}
                                <div
                                  className="absolute top-0 bottom-0 w-0.5 bg-slate-400"
                                  style={{ left: '85%' }}
                                  title="85% Defense Combat Benchmark"
                                />
                              </div>
                              <span className="text-[8.5px] font-mono text-slate-400 mt-0.5">
                                Stress: {s.stressScore}/100
                              </span>
                            </div>
                          </td>

                          {/* Vitals: Sleep & Continuous Duty */}
                          <td className="py-3 px-3">
                            <div className="space-y-0.5 font-mono text-[10.5px]">
                              <div className="flex items-center gap-1.5">
                                <Moon className="w-3 h-3 text-slate-400" />
                                <span
                                  className={`font-bold ${
                                    s.sleepHours < 4.5
                                      ? 'text-rose-600 font-black'
                                      : s.sleepHours < 6.5
                                      ? 'text-amber-600'
                                      : 'text-emerald-700'
                                  }`}
                                >
                                  {s.sleepHours}h rest/night
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 text-slate-500 text-[10px]">
                                <Clock className="w-3 h-3 text-slate-400" />
                                <span className={s.consecutiveDutyDays > 10 ? 'text-rose-600 font-black' : ''}>
                                  {s.consecutiveDutyDays} consecutive days
                                </span>
                              </div>
                              <div className="text-[9.5px] text-slate-400">
                                Fatigue Index: <strong>{s.fatigueLevel}/10</strong>
                              </div>
                            </div>
                          </td>

                          {/* 21-Day Trajectory & Momentum */}
                          <td className="py-3 px-3">
                            <div className="font-mono text-[10.5px]">
                              <div
                                className={`flex items-center gap-1 font-bold ${
                                  s.trend21d >= 0 ? 'text-emerald-700' : 'text-rose-600'
                                }`}
                              >
                                {s.trend21d >= 0 ? (
                                  <ArrowUp className="w-3 h-3 text-emerald-600" />
                                ) : (
                                  <ArrowUp className="w-3 h-3 text-rose-600 rotate-180" />
                                )}
                                <span>{s.trend21d >= 0 ? `+${s.trend21d}` : s.trend21d} pts/21d</span>
                              </div>
                              <div className="text-[9.5px] text-slate-400 mt-0.5">
                                Velocity: <span className="font-bold text-slate-600">{s.stressVelocity}</span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 font-mono text-[10px] font-bold">
                              {s.medicalCategory}
                            </span>
                          </td>

                          {/* Action Buttons */}
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => setActiveDossierUid(s.uid)}
                                className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-bold text-[10.5px] transition-colors cursor-pointer flex items-center gap-1"
                                title="Inspect Form 16 Executive Welfare Dossier"
                              >
                                <FileText className="w-3 h-3 text-emerald-700" />
                                <span>Dossier</span>
                              </button>

                              {isLowTier && (
                                <button
                                  onClick={() => {
                                    if (s.uid === 'UID-EMP-012') {
                                      handleExecuteRosterSwap(
                                        'UID-EMP-012',
                                        'Hav. Ramesh Chand',
                                        'UID-EMP-015',
                                        'Sepoy Amit Kumar',
                                        'Sentry Post Charlie'
                                      );
                                    } else if (s.uid === 'UID-EMP-014') {
                                      handleExecuteRosterSwap(
                                        'UID-EMP-014',
                                        'Naik Rohit Sharma',
                                        'UID-SOL-107',
                                        'Sepoy Kuldeep Singh',
                                        'LOC Bunker 4'
                                      );
                                    } else {
                                      showToast(`Fast-Track Stand-Down Authorized: ${s.name} rotated to 48h restorative recovery.`);
                                    }
                                  }}
                                  disabled={isSwapped || isSwapping === s.uid}
                                  className={`px-2 py-1 rounded font-bold text-[10.5px] transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                                    isSwapped
                                      ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                                      : 'bg-rose-700 hover:bg-rose-800 text-white'
                                  }`}
                                  title="Rotate soldier to 48h decompression rest"
                                >
                                  <RefreshCw className={`w-3 h-3 ${isSwapping === s.uid ? 'animate-spin' : ''}`} />
                                  <span>{isSwapped ? 'Rotated' : 'Stand-Down'}</span>
                                </button>
                              )}

                              {isHighTier && (
                                <span className="px-2 py-1 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-mono text-[10px] font-bold">
                                  Deployable
                                </span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }

          // Tactical Grid View
          return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {filtered.map((s) => {
                const isSwapped = swappedRosters[s.uid];
                const isHighTier = s.readinessScore >= 80;
                const isMedTier = s.readinessScore >= 65 && s.readinessScore < 80;
                const isStandbyTier = s.readinessScore >= 50 && s.readinessScore < 65;
                const isLowTier = s.readinessScore < 50;

                const borderAccent = isHighTier
                  ? 'border-emerald-200 hover:border-emerald-400'
                  : isLowTier
                  ? 'border-rose-300 hover:border-rose-500 bg-rose-50/10'
                  : 'border-slate-200 hover:border-slate-400';

                return (
                  <div
                    key={s.uid}
                    className={`p-4 rounded-xl bg-white border ${borderAccent} shadow-2xs space-y-3 transition-all`}
                  >
                    {/* Top Identity & Score */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-xs ${
                            isHighTier
                              ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                              : isLowTier
                              ? 'bg-rose-100 text-rose-900 border border-rose-300'
                              : 'bg-slate-100 text-slate-800 border border-slate-300'
                          }`}
                        >
                          {s.name
                            .split(' ')
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join('')}
                        </div>
                        <div>
                          <h4 className="font-black text-slate-900 text-xs">{s.name}</h4>
                          <span className="text-[10px] font-mono text-slate-500">
                            {s.rank} &bull; {s.regimentalNumber}
                          </span>
                        </div>
                      </div>

                      {/* Prominent Score Gauge Badge */}
                      <div className="text-right">
                        <div className="flex items-baseline gap-0.5 justify-end">
                          <span className="text-xl font-black font-mono tracking-tight text-slate-900">
                            {s.readinessScore}
                          </span>
                          <span className="text-[10px] font-mono font-bold text-slate-400">%</span>
                        </div>
                        <span
                          className={`inline-block px-1.5 py-0.2 rounded text-[8.5px] font-mono font-black border ${
                            isHighTier
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : isMedTier
                              ? 'bg-sky-50 text-sky-800 border-sky-300'
                              : isStandbyTier
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : 'bg-rose-50 text-rose-800 border-rose-300'
                          }`}
                        >
                          {isHighTier
                            ? 'COMBAT READY'
                            : isMedTier
                            ? 'MISSION CAPABLE'
                            : isStandbyTier
                            ? 'STANDBY'
                            : 'STAND-DOWN ALERT'}
                        </span>
                      </div>
                    </div>

                    {/* Unit & Station */}
                    <div className="px-2.5 py-1.5 rounded-lg bg-slate-50 border border-slate-100 text-[10.5px]">
                      <div className="font-bold text-slate-800">{s.unit}</div>
                      <div className="text-slate-500 text-[10px] font-mono flex items-center gap-1">
                        <Crosshair className="w-2.5 h-2.5 text-slate-400" />
                        <span>{s.station}</span>
                      </div>
                    </div>

                    {/* Vitals Grid */}
                    <div className="grid grid-cols-3 gap-1.5 font-mono text-center text-[10px]">
                      <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                        <span className="text-[9px] text-slate-400 uppercase block">Sleep</span>
                        <span className={`font-bold ${s.sleepHours < 4.5 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {s.sleepHours}h/d
                        </span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                        <span className="text-[9px] text-slate-400 uppercase block">Duty Days</span>
                        <span className={`font-bold ${s.consecutiveDutyDays > 10 ? 'text-rose-600' : 'text-slate-800'}`}>
                          {s.consecutiveDutyDays}d
                        </span>
                      </div>
                      <div className="p-1.5 rounded bg-slate-50 border border-slate-100">
                        <span className="text-[9px] text-slate-400 uppercase block">21d Trend</span>
                        <span className={`font-bold ${s.trend21d >= 0 ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {s.trend21d >= 0 ? `+${s.trend21d}` : s.trend21d}
                        </span>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <button
                        onClick={() => setActiveDossierUid(s.uid)}
                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[10.5px] font-bold transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3 text-emerald-700" />
                        <span>Form 16</span>
                      </button>

                      {isLowTier ? (
                        <button
                          onClick={() => {
                            if (s.uid === 'UID-EMP-012') {
                              handleExecuteRosterSwap(
                                'UID-EMP-012',
                                'Hav. Ramesh Chand',
                                'UID-EMP-015',
                                'Sepoy Amit Kumar',
                                'Sentry Post Charlie'
                              );
                            } else if (s.uid === 'UID-EMP-014') {
                              handleExecuteRosterSwap(
                                'UID-EMP-014',
                                'Naik Rohit Sharma',
                                'UID-SOL-107',
                                'Sepoy Kuldeep Singh',
                                'LOC Bunker 4'
                              );
                            } else {
                              showToast(`Fast-Track Stand-Down Authorized: ${s.name} rotated to 48h restorative recovery.`);
                            }
                          }}
                          disabled={isSwapped || isSwapping === s.uid}
                          className={`px-2.5 py-1 rounded font-bold text-[10.5px] transition-all cursor-pointer flex items-center gap-1 shadow-2xs ${
                            isSwapped
                              ? 'bg-slate-200 text-slate-500 cursor-not-allowed'
                              : 'bg-rose-700 hover:bg-rose-800 text-white'
                          }`}
                        >
                          <RefreshCw className={`w-3 h-3 ${isSwapping === s.uid ? 'animate-spin' : ''}`} />
                          <span>{isSwapped ? 'Rotated' : 'Stand-Down'}</span>
                        </button>
                      ) : (
                        <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Deployable</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </div>

      {/* ===================================================================== */}
      {/* 4. VISUAL HIERARCHY: CURRENT INTELLIGENCE & FORMATION SURVEILLANCE    */}
      {/* (Tactical Coy x Bn Heatmap, Priority Unit Triage, Early Warnings)     */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Heatmap Matrix (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-xs tracking-tight">
              <Layers className="w-4 h-4 text-emerald-800" />
              <span>Tactical Risk Heatmap (Battalions &times; Companies)</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">Click unit to drill down</span>
          </div>

          <div className="py-1 overflow-x-auto">
            <table className="w-full text-center border-separate border-spacing-1.5">
              <thead>
                <tr>
                  <th className="w-16" />
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
                      className="text-left font-bold text-xs text-slate-800 hover:text-emerald-700 cursor-pointer pr-2 whitespace-nowrap"
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

        {/* High Priority Units & Early Warnings Triage (6 cols) */}
        <div className="lg:col-span-6 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              <div className="flex items-center gap-1 p-0.5 rounded-lg bg-slate-100 text-[10px] font-mono">
                <button
                  onClick={() => setTriageTab('units')}
                  className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                    triageTab === 'units'
                      ? 'bg-white text-slate-900 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  High Priority Units ({highPriorityUnits.length})
                </button>
                <button
                  onClick={() => setTriageTab('warnings')}
                  className={`px-2 py-1 rounded font-bold cursor-pointer transition-colors ${
                    triageTab === 'warnings'
                      ? 'bg-white text-rose-700 shadow-2xs'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Early Warnings ({earlyWarnings.length})
                </button>
              </div>
            </div>
            <button
              onClick={() => setActiveDecisionModal(true)}
              className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 cursor-pointer self-start sm:self-auto"
            >
              Action Center &rarr;
            </button>
          </div>

          <div className="overflow-x-auto">
            {triageTab === 'units' ? (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-1.5 pr-2">Unit</th>
                    <th className="py-1.5 pr-2">Stress/Risk</th>
                    <th className="py-1.5 pr-2">Primary Driver</th>
                    <th className="py-1.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {highPriorityUnits.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                      <td
                        onClick={() => handleOpenBattalion(u.unit.split(' ')[0])}
                        className="py-2 font-bold text-slate-900 hover:text-emerald-700 cursor-pointer whitespace-nowrap"
                      >
                        {u.unit}
                      </td>
                      <td className="py-2 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-mono">
                          <span className="font-bold text-slate-900">{u.risk}</span>
                          <span className={`px-1.5 py-0.2 rounded text-[9px] font-extrabold ${u.badge}`}>
                            {u.tier}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 text-[11px] text-slate-600 whitespace-nowrap">{u.concern}</td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() => handleOpenBattalion(u.unit.split(' ')[0])}
                          className="px-2.5 py-1 rounded-md bg-[#0B1712] text-emerald-300 hover:bg-emerald-950 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-wider">
                    <th className="py-1.5 pr-2">Indicator</th>
                    <th className="py-1.5 pr-2">Formation</th>
                    <th className="py-1.5 pr-2">Risk Tier</th>
                    <th className="py-1.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {earlyWarnings.map((w) => (
                    <tr key={w.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 font-bold text-slate-800 whitespace-nowrap">{w.indicator}</td>
                      <td
                        onClick={() => handleOpenBattalion(w.unit.split(' ')[0])}
                        className="py-2 font-medium text-slate-600 hover:text-emerald-700 cursor-pointer whitespace-nowrap"
                      >
                        {w.unit}
                      </td>
                      <td className="py-2 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${w.badge}`}>
                          {w.risk}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        <button
                          onClick={() => handleOpenBattalion(w.unit.split(' ')[0])}
                          className="px-2.5 py-1 rounded-md bg-[#0B1712] text-emerald-300 hover:bg-emerald-950 text-[10px] font-bold transition-colors cursor-pointer"
                        >
                          Triage
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            {triageTab === 'units'
              ? 'Automated Operational Psychometric Triage Queue'
              : 'Predictive Early Warning Interception Horizon: 14 – 30 Days'}
          </div>
        </div>
      </div>

      {/* Multi-Source Signal Fusion Flow & Unit Hierarchy */}
      <MultiSourceSignalFusionCard />
      <UnitHierarchyTree />

      {/* ===================================================================== */}
      {/* 5. VISUAL HIERARCHY: BEHAVIORAL ANALYTICS & ANOMALY SURVEILLANCE      */}
      {/* (Cleaned of buzzword badges; authentic telemetry & baseline shifts)   */}
      {/* ===================================================================== */}

      {/* Emotional Stability Index Panel */}
      <div id="commander-emotional-stability-panel" className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden space-y-4">
        {/* Top Header & Metadata */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shadow-2xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
                  {t('Emotional Stability Index (ESI)')}
                </h3>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Model: Weighted Recency Telemetry (7-Day WMA)
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Measures affective consistency and allostatic strain recovery across high-tempo operational formations.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start lg:self-auto">
            <div className="text-right hidden sm:block font-mono text-[10px]">
              <span className="text-slate-400 uppercase tracking-wider block">Temporal Window</span>
              <span className="font-bold text-slate-800">7-Day Recency Weighted</span>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 font-mono text-xs font-bold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              95.8% Model Confidence
            </div>
          </div>
        </div>

        {/* Content Grid: Hero ESI + 6 Factors */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-2 relative z-10">
          {/* Col 1: Composite Benchmark */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Composite Stability
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  Division Mean
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-3 font-mono">
                <span className="text-4xl sm:text-5xl font-black text-emerald-800 tracking-tight">
                  82%
                </span>
                <div className="flex flex-col font-sans">
                  <span className="text-base font-black text-slate-900 leading-tight">
                    {t('Stable')}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {t('High Affective Consistency')}
                  </span>
                </div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mt-3 overflow-hidden">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: '82%' }} />
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-1 text-xs">
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-500">Volatility Standard Deviation:</span>
                <span className="font-mono font-bold text-slate-900">&sigma; = 1.18 (Low)</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span className="text-slate-500">Active Duty Threshold:</span>
                <span className="font-mono font-bold text-slate-900">&ge; 75.0% Required</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed pt-1">
                <strong>Command Assessment:</strong> Formations exhibit strong baseline emotional regulation despite ongoing high-altitude watch rotations.
              </p>
            </div>
          </div>

          {/* Col 2: 6 Factors */}
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                6-Factor Telemetry Array
              </span>
              <span className="text-[10px] font-mono text-slate-500">
                Normalized Weights: 100%
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {[
                { factor: 'Mood', score: 84, status: 'Optimal', weight: '22%', icon: Brain },
                { factor: 'Stress', score: 78, status: 'Regulated', weight: '20%', icon: Activity },
                { factor: 'Sleep', score: 80, status: 'Restorative', weight: '18%', icon: Moon },
                { factor: 'Energy', score: 85, status: 'High Vitality', weight: '16%', icon: Zap },
                { factor: 'Voice', score: 88, status: 'Steady Acoustic', weight: '12%', icon: Mic },
                { factor: 'Anxiety', score: 76, status: 'Controlled', weight: '12%', icon: ShieldCheck },
              ].map((item) => {
                const FactorIcon = item.icon;
                return (
                  <div key={item.factor} className="p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs hover:border-emerald-300 transition-colors">
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-slate-800">
                        <FactorIcon className="w-3.5 h-3.5 text-emerald-700" />
                        {t(item.factor)}
                      </span>
                      <span className="font-mono font-black text-emerald-800">{item.score}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 my-1.5 overflow-hidden">
                      <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${item.score}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="text-emerald-800 font-bold">{t(item.status)}</span>
                      <span className="font-mono text-slate-400">W: {item.weight}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 7-Day Trajectory */}
            <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold font-mono">7-Day Trajectory:</span>
                <div className="flex items-center gap-1 font-mono text-[10px] flex-wrap">
                  {['Day -6: 79%', 'Day -5: 80%', 'Day -4: 81%', 'Day -3: 82%', 'Day -2: 81%', 'Yest: 83%', 'Today: 82%'].map((pt, i) => (
                    <span key={i} className="px-1.5 py-0.2 rounded bg-white border border-slate-200 text-slate-700 font-semibold">
                      {pt}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                Minimal Variance (&plusmn;1.4%)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Behavioral Change Detection Panel */}
      <div id="commander-behavioral-change-panel" className="p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs relative overflow-hidden space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 flex items-center gap-2">
                  {t('Behavioral Drift & Anomaly Surveillance')}
                </h3>
                <span className="text-[10px] font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  Telemetry Comparison: 14-Day Rolling vs 90-Day Baseline
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium mt-0.5">
                Detects statistical deviations in troop routine patterns before operational impairment occurs.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start lg:self-auto">
            <div className="px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-mono text-xs font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              14 High-Shift Anomaly Flags
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 mt-2 relative z-10">
          {/* Outliers Table */}
          <div className="lg:col-span-4 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                  Aggregate Drift
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  89% Stable
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2 font-mono">
                <span className="text-4xl font-black text-slate-900">28</span>
                <span className="text-sm font-bold text-slate-400">/ 100</span>
                <span className="text-xs font-bold text-emerald-600 font-sans ml-1">Mild Drift</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-200/80 space-y-2">
              <div className="text-[10px] font-mono font-bold uppercase text-slate-400">
                Top Unit Outliers
              </div>
              <div className="space-y-1.5">
                {[
                  { name: 'Havildar Ramesh Chand', unit: 'High Altitude Guard', score: 88, issue: 'Overtime + Leave Spike' },
                  { name: 'Subedar Gurpreet Singh', unit: 'Field Artillery 3rd Bn', score: 74, issue: 'Reduced Wellness Adherence' },
                  { name: 'Sepoy Vikram Rathore', unit: 'Infantry 2nd Bn', score: 72, issue: 'Missing Drills & Training' },
                ].map((soldier, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">{soldier.name}</div>
                      <div className="text-[9px] text-slate-500">{soldier.unit} &bull; {soldier.issue}</div>
                    </div>
                    <span className="px-1.5 py-0.2 rounded font-mono font-black text-[10px] bg-rose-50 text-rose-700 border border-rose-200">
                      BCS: {soldier.score}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 5 Monitored Behavioral Domains */}
          <div className="lg:col-span-8 p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                5 Behavioral Domains • 14D Current vs 90D Baseline Comparison
              </span>
              <span className="text-[10px] font-mono text-emerald-800 font-bold">
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
                  flag: 'Leave Spike',
                  statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
                  icon: Calendar,
                },
                {
                  label: 'Working excessive overtime',
                  current: '24.5 hrs/wk avg',
                  historical: '7.2 hrs/wk avg',
                  shift: '+240% surge',
                  flag: 'Excessive Overtime',
                  statusColor: 'text-rose-800 bg-rose-50 border-rose-200',
                  icon: Clock,
                },
                {
                  label: 'Missing training attendance',
                  current: '74.2% attendance',
                  historical: '95.8% attendance',
                  shift: '-21.6% drop',
                  flag: 'Drill Absences',
                  statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
                  icon: ShieldCheck,
                },
                {
                  label: 'Declining performance ratings',
                  current: '72.0 / 100 score',
                  historical: '89.4 / 100 score',
                  shift: '-17.4 pts',
                  flag: 'Performance Dip',
                  statusColor: 'text-amber-800 bg-amber-50 border-amber-200',
                  icon: TrendingUp,
                },
                {
                  label: 'Reduced wellness check-in rate',
                  current: '44.0% completion',
                  historical: '91.2% completion',
                  shift: '-47.2% drop',
                  flag: 'Disengagement',
                  statusColor: 'text-rose-800 bg-rose-50 border-rose-200',
                  icon: HeartPulse,
                },
              ].map((domain, i) => {
                const DomainIcon = domain.icon;
                return (
                  <div key={i} className={`p-2.5 rounded-lg bg-white border border-slate-200 shadow-2xs ${i === 4 ? 'sm:col-span-2' : ''}`}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 font-bold text-slate-900">
                        <DomainIcon className="w-3.5 h-3.5 text-slate-700 shrink-0" />
                        <span>{t(domain.label)}</span>
                      </span>
                      <span className={`font-mono text-[9px] font-bold px-1.5 py-0.2 rounded border ${domain.statusColor}`}>
                        {t(domain.flag)}
                      </span>
                    </div>

                    <div className="mt-2 grid grid-cols-3 gap-1 text-[10px] font-mono border-t border-slate-100 pt-1.5 text-center">
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">{t('Baseline')}</span>
                        <span className="text-slate-700 font-semibold">{domain.historical}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">{t('Current')}</span>
                        <span className="text-slate-900 font-bold">{domain.current}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[9px] uppercase">{t('Shift')}</span>
                        <span className="font-bold text-amber-700">{domain.shift}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-200/80 text-xs text-slate-600 flex items-center justify-between">
              <span className="text-[11px]">
                <strong>Executive Action:</strong> 14 flagged individuals queued for proactive counseling stand-down.
              </span>
              <button
                onClick={() => handleDispatchCommand('Behavioral Anomaly Stand-Down & Overtime Roster Rebalancing')}
                className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] cursor-pointer shadow-xs transition-all"
              >
                {t('Rebalance Rosters')}
              </button>
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
      {/* 6. VISUAL HIERARCHY: SUPPORTING METRICS & MISSION ASSURANCE           */}
      {/* (Welfare Pipeline, Resource Availability, Mission Impact, Audit)      */}
      {/* ===================================================================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Welfare Intervention Progress */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>Welfare Interventions</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-700 font-bold">81.4% Rate</span>
          </div>

          <div className="space-y-2 py-1">
            {[
              { label: 'Counselling Sessions', pct: 82, count: '124 / 150', color: 'bg-emerald-500' },
              { label: 'Medical Review', pct: 61, count: '91 / 150', color: 'bg-blue-500' },
              { label: 'Duty Adjustment', pct: 91, count: '137 / 150', color: 'bg-indigo-600' },
              { label: 'Follow-up Monitoring', pct: 76, count: '114 / 150', color: 'bg-purple-600' },
            ].map((item) => (
              <div key={item.label} className="space-y-0.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-600 font-medium">{item.label}</span>
                  <div className="flex items-center gap-1.5 font-mono text-[10px]">
                    <span className="font-bold text-slate-900">{item.pct}%</span>
                    <span className="text-slate-400">({item.count})</span>
                  </div>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                </div>
              </div>
            ))}
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Form 16 Medical Endorsements Synchronized
          </div>
        </div>

        {/* Card 2: Resource Availability */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <Truck className="w-4 h-4 text-emerald-800" />
              <span>Logistical Capacity</span>
            </div>
            <span className="font-mono text-[10px] text-slate-500">60-Day Forward Reserve</span>
          </div>

          <div className="grid grid-cols-2 gap-2 py-1">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center space-y-0.5">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Welfare Off.</span>
              <div className="text-base font-black text-slate-900 font-mono">8 / 10</div>
              <span className="text-[9px] font-bold text-emerald-600 block">Available</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center space-y-0.5">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Medical Off.</span>
              <div className="text-base font-black text-slate-900 font-mono">5 / 6</div>
              <span className="text-[9px] font-bold text-emerald-600 block">Available</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center space-y-0.5">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Counsellors</span>
              <div className="text-base font-black text-slate-900 font-mono">12 / 15</div>
              <span className="text-[9px] font-bold text-emerald-600 block">Available</span>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-center space-y-0.5">
              <span className="text-[9px] font-mono text-slate-500 uppercase block">Mobile Clinics</span>
              <div className="text-base font-black text-slate-900 font-mono">3 / 4</div>
              <span className="text-[9px] font-bold text-blue-600 block">Operational</span>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 text-center font-medium pt-1 border-t border-slate-100">
            Logistical Reserves Sufficient for Forward Ops
          </div>
        </div>

        {/* Card 3: Mission Impact Metrics */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Mission Impact Metrics</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-700 font-bold">Coefficient: 0.942</span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 py-1 text-center">
            {[
              { label: 'Operational Efficiency', pct: 93, trend: '+4%', color: '#10B981' },
              { label: 'Deployment Stability', pct: 89, trend: '+3%', color: '#0284C7' },
              { label: 'Personnel Availability', pct: 96, trend: '+2%', color: '#16A34A' },
            ].map((m) => (
              <div key={m.label} className="space-y-1 flex flex-col items-center">
                <div className="relative w-14 h-11 flex items-center justify-center">
                  <svg viewBox="0 0 100 60" className="w-full h-full">
                    <path
                      d="M 10 50 A 40 40 0 0 1 90 50"
                      fill="none"
                      stroke="#E2E8F0"
                      strokeWidth="10"
                      strokeLinecap="round"
                    />
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
                    <span className="text-xs font-black text-slate-900 font-mono">{m.pct}%</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 flex items-center justify-center">
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
            Combat Readiness Retention Index: High
          </div>
        </div>

        {/* Card 4: Security Airgap & Audit */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5 font-bold text-slate-900 text-xs">
              <Lock className="w-4 h-4 text-emerald-800" />
              <span>Privacy & Airgap Protocol</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-700 font-bold">RBAC Enforced</span>
          </div>

          <div className="space-y-1 text-xs py-1">
            {[
              'End-to-End Cryptographic Ledger',
              'Strict Medical Airgap Active',
              'Non-Disciplinary Firewalled Use',
              'Aadhaar / PPO Vault Separation',
              'Ministry of Defence Norms Compliant',
            ].map((item) => (
              <div key={item} className="flex items-center gap-2 text-slate-700 text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>

          <div className="pt-1.5 border-t border-slate-100 flex items-center justify-center">
            <span className="px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-800 text-[10px] font-bold border border-emerald-200">
              Verified Defense Airgap Architecture
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
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{t('Deployed Strength')}</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{selectedBattalion.strength} {t('Troops')}</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">{t('Operational Readiness')}</span>
                  <div className="text-lg font-black text-slate-900 mt-0.5">{selectedBattalion.readiness}%</div>
                </div>
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200">
                  <span className="text-[10px] font-bold text-rose-700 uppercase">{t('Primary Driver')}</span>
                  <div className="text-sm font-bold text-rose-900 mt-1">{selectedBattalion.keyConcern}</div>
                </div>
              </div>

              {/* Company Breakdown Table */}
              <div className="space-y-2">
                <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider">
                  {t('Company Level Tactical Readiness (5 Companies)')}
                </h4>
                <div className="rounded-xl border border-slate-200 overflow-hidden">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50 text-[10px] font-black text-slate-500 uppercase tracking-wider">
                      <tr>
                        <th className="p-2.5">{t('Company')}</th>
                        <th className="p-2.5">{t('Risk Tier')}</th>
                        <th className="p-2.5">{t('Stress Index')}</th>
                        <th className="p-2.5">{t('Troops')}</th>
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
                              {t(c.risk)}
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

              {/* Flagged Personnel with Risk Momentum */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-black text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-rose-600" />
                    <span>{t('Flagged Personnel • Risk Velocity & Action Directives')}</span>
                  </h4>
                  <span className="text-[10px] font-mono text-slate-500">
                    Formula: V = &Delta;Stress / &Delta;t
                  </span>
                </div>

                <div className="space-y-3">
                  {selectedBattalion.flaggedPersonnel.map((p) => {
                    return (
                      <div key={p.jcNumber} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-primary">{p.jcNumber}</span>
                              <span className="font-bold text-slate-900 text-sm">{p.name}</span>
                              <span className="text-xs text-slate-500">({p.rank})</span>
                            </div>
                            <p className="text-xs text-slate-600 mt-0.5">{p.issue}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2.5 py-1 rounded-lg bg-rose-100 text-rose-800 font-black text-xs">
                              {t('Risk:')} {p.risk}
                            </span>
                            {p.momentum && (
                              <RiskMomentumBadge momentum={p.momentum} compact />
                            )}
                          </div>
                        </div>

                        {/* Full Momentum & Decision Support Widget */}
                        {p.momentum && (
                          <RiskMomentumBadge
                            momentum={p.momentum}
                            onActionClick={(actionCode) => {
                              handleDispatchCommand(`Directive Executed for ${p.name}: ${actionCode}`);
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                {t('Authorized for Formation Commander Review')}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsDrillDownOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100 cursor-pointer"
                >
                  {t('Close')}
                </button>
                <button
                  onClick={() => {
                    handleDispatchCommand(`Decompression rotation issued for ${selectedBattalion.name}`);
                    setIsDrillDownOpen(false);
                  }}
                  className="px-4 py-1.5 rounded-xl bg-primary text-white text-xs font-bold hover:bg-primary-700 flex items-center gap-1.5 cursor-pointer shadow-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{t('Issue Workload Redistribution')}</span>
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
                  <h2 className="text-xl font-black text-white">{t('Action-Oriented Command Interface')}</h2>
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
                      {isSent ? t('Dispatched ✓') : t('Execute')}
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
                {t('Close Decision Center')}
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
