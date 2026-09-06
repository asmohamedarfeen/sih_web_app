import React, { useState, useEffect, useMemo } from 'react';
import {
  HandHeart,
  AlertTriangle,
  Calendar,
  CheckCircle,
  PlusCircle,
  Clock,
  HeartPulse,
  Brain,
  Sparkles,
  RefreshCw,
  Flame,
  Activity,
  Zap,
  TrendingUp,
  BatteryLow,
  ShieldAlert,
  LineChart,
  Gauge,
  HeartHandshake,
  BellRing,
  Smile,
  Target,
  AlertOctagon,
  ChevronRight,
  ShieldCheck,
  Users,
  CheckCircle2,
  FileText,
  Send,
  Sliders,
  Search,
  Filter,
  UserCheck,
  RotateCcw,
  Sparkle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { dashboardService, WelfareDashboardData } from '../../services/dashboardService';

export interface ParamTelemetryDetail {
  score: number;
  available: boolean;
  source: string;
  note: string;
}

export interface PersonnelBurnoutProfile {
  uid: string;
  name: string;
  rank: string;
  unit: string;
  branch: string;
  regimental_number: string;
  medical_category: string;
  status: string;
  hrms_sync_status?: string;
  last_sync_timestamp?: string;
  data_completeness_pct?: number;
  missing_telemetry?: string[];
  params: {
    leave_patterns: any;
    overtime: any;
    workload_trend: any;
    deployment_duration: any;
    duty_schedule: any;
    sleep_quality: any;
    emotional_exhaustion: any;
    assessment_responses: any;
  };
}

const ALL_PERSONNEL: PersonnelBurnoutProfile[] = [
  {
    uid: 'UID-EMP-012',
    name: 'Havildar Ramesh Chand',
    rank: 'Havildar',
    unit: 'High Altitude Guard',
    branch: 'CRPF',
    regimental_number: 'CRPF-2016-8012',
    medical_category: 'SHAPE-1 (Temporary P2)',
    status: 'Under Medical Observation',
    hrms_sync_status: 'SYNCHRONIZED',
    last_sync_timestamp: '2026-09-06T06:15:00Z',
    data_completeness_pct: 100,
    missing_telemetry: [],
    params: {
      leave_patterns: { score: 80, available: true, source: 'HRMS Leave Portal', note: '3 consecutive leave applications deferred due to forward vigil deployment.' },
      overtime: { score: 92, available: true, source: 'HRMS Watch Roster', note: '48 duty hours logged in past 5 days (64% over standard roster).' },
      workload_trend: { score: 88, available: true, source: 'Command Operations Log', note: 'High task escalation slope with double perimeter watch shifts.' },
      deployment_duration: { score: 95, available: true, source: 'Service Dossier Database', note: '14 continuous months stationed in extreme sub-zero forward sector.' },
      duty_schedule: { score: 84, available: true, source: 'Battalion Roster', note: '8 consecutive night vigils with irregular sleep window rotation.' },
      sleep_quality: { score: 92, available: true, source: 'Biometric Wearable Telemetry', note: 'Severe nocturnal sleep deficit (<3.8h recorded on biometric tracker).' },
      emotional_exhaustion: { score: 82, available: true, source: 'Clinical MBI-GS Telemetry', note: 'Maslach affective depletion index elevated; high somatic weariness.' },
      assessment_responses: { score: 76, available: true, source: 'AI Psychological Twin Assessment', note: 'AI self-assessment flagged cognitive fatigue and high vigilance strain.' },
    },
  },
  {
    uid: 'UID-EMP-013',
    name: 'Subedar Gurpreet Singh',
    rank: 'Subedar',
    unit: 'Field Artillery 3rd Bn',
    branch: 'Indian Army',
    regimental_number: 'ARMY-2018-8013',
    medical_category: 'SHAPE-1',
    status: 'Active Duty (Command)',
    hrms_sync_status: 'SYNCHRONIZED',
    last_sync_timestamp: '2026-09-06T06:14:30Z',
    data_completeness_pct: 100,
    missing_telemetry: [],
    params: {
      leave_patterns: { score: 88, available: true, source: 'HRMS Leave Portal', note: 'Family medical leave pending; urgent domestic distress reported.' },
      overtime: { score: 78, available: true, source: 'Battery Duty Roster', note: 'Command logistics management beyond standard battery shifts.' },
      workload_trend: { score: 84, available: true, source: 'Field Operations Log', note: 'Field artillery exercise coordination under condensed timeline.' },
      deployment_duration: { score: 75, available: true, source: 'Service Dossier Database', note: '8 continuous months in active artillery forward battery line.' },
      duty_schedule: { score: 78, available: true, source: 'Battalion Roster', note: 'Split shifts with early dawn drill inspections and night logistics.' },
      sleep_quality: { score: 82, available: true, source: 'Biometric Wearable Telemetry', note: 'High latency sleep fragmentation; restless off-duty periods.' },
      emotional_exhaustion: { score: 80, available: true, source: 'Clinical MBI-GS Telemetry', note: 'Cumulative command burden combined with caregiver strain.' },
      assessment_responses: { score: 74, available: true, source: 'AI Psychological Twin Assessment', note: 'Distress score 75/100 on Kessler-10 AI behavioral evaluation.' },
    },
  },
  {
    uid: 'UID-EMP-014',
    name: 'Naik Sandeep Patil',
    rank: 'Naik',
    unit: 'Signals & Telemetry',
    branch: 'BSF',
    regimental_number: 'BSF-2019-8014',
    medical_category: 'SHAPE-1',
    status: 'Active Duty',
    hrms_sync_status: 'SYNCHRONIZED',
    last_sync_timestamp: '2026-09-06T06:10:00Z',
    data_completeness_pct: 100,
    missing_telemetry: [],
    params: {
      leave_patterns: { score: 55, available: true, source: 'HRMS Leave Portal', note: 'Annual leave taken 4 months ago; nominal leave status.' },
      overtime: { score: 82, available: true, source: 'Console Watch Roster', note: 'Prolonged communications console monitoring duty (12h shifts).' },
      workload_trend: { score: 72, available: true, source: 'Signals Traffic Engine', note: 'Increased signal traffic and perimeter radar maintenance calls.' },
      deployment_duration: { score: 60, available: true, source: 'Service Dossier Database', note: '6 months in border telemetry outpost station.' },
      duty_schedule: { score: 85, available: true, source: 'Shift Telemetry', note: 'Continuous rotational night console shifts causing circadian shift.' },
      sleep_quality: { score: 75, available: true, source: 'Biometric Wearable Telemetry', note: 'Blue light screen latency and disturbed deep sleep cycles.' },
      emotional_exhaustion: { score: 68, available: true, source: 'Clinical MBI-GS Telemetry', note: 'Moderate sensory overload and isolation weariness.' },
      assessment_responses: { score: 62, available: true, source: 'AI Psychological Twin Assessment', note: 'Responses reflect high mental focus requirements with mild strain.' },
    },
  },
  {
    uid: 'UID-SLD-015',
    name: 'Sepoy Amit Kumar',
    rank: 'Sepoy',
    unit: '10 Para Special Forces',
    branch: 'Indian Army',
    regimental_number: 'ARMY-2021-9988',
    medical_category: 'SHAPE-1 (S1H1A1P1E1)',
    status: 'Active Frontline Patrol',
    hrms_sync_status: 'SYNCHRONIZED',
    last_sync_timestamp: '2026-09-06T06:17:15Z',
    data_completeness_pct: 100,
    missing_telemetry: [],
    params: {
      leave_patterns: { score: 60, available: true, source: 'HRMS Leave Portal', note: 'Leave scheduled next month; currently on tactical patrol roster.' },
      overtime: { score: 68, available: true, source: 'Tactical Patrol Roster', note: 'Tactical reconnaissance exercises and high-tempo patrol duties.' },
      workload_trend: { score: 70, available: true, source: 'Operations Command Log', note: 'Physical training and live field deployment drills.' },
      deployment_duration: { score: 65, available: true, source: 'Service Dossier Database', note: '7 months forward stationing with high operational focus.' },
      duty_schedule: { score: 66, available: true, source: 'Patrol Schedule Matrix', note: 'Variable tactical patrol timings with standard debrief recovery.' },
      sleep_quality: { score: 58, available: true, source: 'Biometric Wearable Telemetry', note: 'Moderate sleep variability; high cardiovascular bounce-back.' },
      emotional_exhaustion: { score: 62, available: true, source: 'Clinical MBI-GS Telemetry', note: 'Tactical vigilance maintenance; strong squad peer camaraderie.' },
      assessment_responses: { score: 64, available: true, source: 'Gemini AI Self-Assessment', note: 'Valid psychometric self-assessment score 64.2/100 (Moderate).' },
    },
  },
  {
    uid: 'UID-EMP-010',
    name: 'Major Alex Morgan',
    rank: 'Major',
    unit: 'Rapid Action Bn 1',
    branch: 'CRPF',
    regimental_number: 'CRPF-2015-8010',
    medical_category: 'SHAPE-1',
    status: 'Active Command Duty',
    hrms_sync_status: 'SYNCHRONIZED',
    last_sync_timestamp: '2026-09-06T06:12:00Z',
    data_completeness_pct: 100,
    missing_telemetry: [],
    params: {
      leave_patterns: { score: 72, available: true, source: 'HRMS Leave Portal', note: 'Consecutive operational deployments delaying annual furlough.' },
      overtime: { score: 80, available: true, source: 'Command Watch Roster', note: 'Prolonged night sector sweeps and battalion operational reviews.' },
      workload_trend: { score: 76, available: true, source: 'Operations Command Log', note: 'High leadership tempo and operational briefing load.' },
      deployment_duration: { score: 70, available: true, source: 'Service Dossier Database', note: '9 months forward command post deployment.' },
      duty_schedule: { score: 74, available: true, source: 'Patrol Schedule Matrix', note: 'Irregular operational call-outs during recovery intervals.' },
      sleep_quality: { score: 78, available: true, source: 'Biometric Wearable Telemetry', note: 'Average 4.9 hours sleep recorded per night; elevated cortisol.' },
      emotional_exhaustion: { score: 75, available: true, source: 'Clinical MBI-GS Telemetry', note: 'High responsibility load; resilience score remains robust.' },
      assessment_responses: { score: 72, available: true, source: 'AI Psychological Twin Assessment', note: 'Assessment reflects sustained command vigilance with early strain.' },
    },
  },
  {
    uid: 'UID-EMP-011',
    name: 'Captain Sarah Connor',
    rank: 'Captain',
    unit: 'Air Defense Command',
    branch: 'Indian Air Force',
    regimental_number: 'IAF-2017-8011',
    medical_category: 'SHAPE-1',
    status: 'Active Nominal Duty',
    hrms_sync_status: 'SYNCHRONIZED',
    last_sync_timestamp: '2026-09-06T06:05:00Z',
    data_completeness_pct: 100,
    missing_telemetry: [],
    params: {
      leave_patterns: { score: 25, available: true, source: 'HRMS Leave Portal', note: 'Regular furlough balance maintained; leave taken on schedule.' },
      overtime: { score: 30, available: true, source: 'Air Defense Watch Roster', note: 'Standard radar watch cycles with mandatory 12h rest interval.' },
      workload_trend: { score: 32, available: true, source: 'Operations Command Log', note: 'Balanced air traffic management and simulation schedules.' },
      deployment_duration: { score: 20, available: true, source: 'Service Dossier Database', note: '3 months in peace-station technical command hub.' },
      duty_schedule: { score: 28, available: true, source: 'Roster Matrix', note: 'Consistent daylight and evening rotation with full rest days.' },
      sleep_quality: { score: 24, available: true, source: 'Biometric Wearable Telemetry', note: 'Optimal restorative sleep (7.4h average, >90 min deep sleep).' },
      emotional_exhaustion: { score: 30, available: true, source: 'Clinical MBI-GS Telemetry', note: 'High job satisfaction, excellent morale, low somatic stress.' },
      assessment_responses: { score: 28, available: true, source: 'AI Psychological Twin Assessment', note: 'Assessment score 28.4/100 indicating prime mental wellness.' },
    },
  },
  {
    uid: 'UID-EMP-015',
    name: 'Sepoy Vikram Rathore Jr.',
    rank: 'Sepoy',
    unit: 'Northern Border Patrol',
    branch: 'ITBP',
    regimental_number: 'ITBP-2020-8015',
    medical_category: 'SHAPE-1',
    status: 'Active Duty',
    hrms_sync_status: 'SYNCHRONIZED',
    last_sync_timestamp: '2026-09-06T05:50:00Z',
    data_completeness_pct: 100,
    missing_telemetry: [],
    params: {
      leave_patterns: { score: 50, available: true, source: 'HRMS Leave Portal', note: 'Furlough approved for next cycle; awaiting replacement.' },
      overtime: { score: 55, available: true, source: 'Mountain Patrol Roster', note: 'Moderate patrol duration in mountain passes.' },
      workload_trend: { score: 54, available: true, source: 'Operations Log', note: 'Standard patrol routines with regular acclimatization stops.' },
      deployment_duration: { score: 60, available: true, source: 'Service Dossier Database', note: '5 months at forward border outpost.' },
      duty_schedule: { score: 52, available: true, source: 'Roster Matrix', note: 'Rotational 8-hour patrol watches with squad partner.' },
      sleep_quality: { score: 50, available: true, source: 'Biometric Wearable Telemetry', note: 'Moderate sleep quality with mild altitude-related awakening.' },
      emotional_exhaustion: { score: 48, available: true, source: 'Clinical MBI-GS Telemetry', note: 'Good buddy-system support and recreational morale.' },
      assessment_responses: { score: 52, available: true, source: 'AI Psychological Twin Assessment', note: 'Self-assessment indicates balanced coping in extreme terrain.' },
    },
  },
  {
    uid: 'UID-EMP-016',
    name: 'Lance Naik Deepak Verma',
    rank: 'Lance Naik',
    unit: 'Aviation Security Wing',
    branch: 'CISF',
    regimental_number: 'CISF-2021-8016',
    medical_category: 'SHAPE-1',
    status: 'Active Duty',
    hrms_sync_status: 'PARTIAL_SYNC',
    last_sync_timestamp: '2026-09-06T04:30:00Z',
    data_completeness_pct: 75,
    missing_telemetry: ['sleep_quality', 'assessment_responses'],
    params: {
      leave_patterns: { score: 45, available: true, source: 'HRMS Leave Portal', note: 'Casual leave utilized last month; steady roster.' },
      overtime: { score: 50, available: true, source: 'Airport Security Roster', note: 'Terminal surveillance watches during high airport footfall.' },
      workload_trend: { score: 48, available: true, source: 'Operations Log', note: 'Standard security screening shifts with rotations.' },
      deployment_duration: { score: 40, available: true, source: 'Service Dossier Database', note: '4 months at metropolitan airport unit.' },
      duty_schedule: { score: 55, available: true, source: 'Shift Roster', note: 'Rotational morning/evening shifts with standard breaks.' },
      sleep_quality: { score: 46, available: false, source: 'Pending Wearable Sync', note: 'Wearable biometric sleep tracker not synced in last 48 hours.' },
      emotional_exhaustion: { score: 44, available: true, source: 'Clinical MBI-GS Telemetry', note: 'Good peer morale and stable welfare support.' },
      assessment_responses: { score: 48, available: false, source: 'Pending Self-Assessment', note: 'Soldier self-assessment questionnaire pending completion.' },
    },
  },
  {
    uid: 'UID-EMP-017',
    name: 'Rifleman Rajesh Rawat',
    rank: 'Rifleman',
    unit: 'Counter-Insurgency Force',
    branch: 'Assam Rifles',
    regimental_number: 'AR-2022-8017',
    medical_category: 'SHAPE-1',
    status: 'Field Deployment',
    hrms_sync_status: 'SYNCHRONIZED',
    last_sync_timestamp: '2026-09-06T05:20:00Z',
    data_completeness_pct: 100,
    missing_telemetry: [],
    params: {
      leave_patterns: { score: 75, available: true, source: 'HRMS Leave Portal', note: 'Leave delayed by 2 months due to operational cordon duties.' },
      overtime: { score: 76, available: true, source: 'Field Operations Roster', note: 'Extensive jungle patrol watches in remote hill sectors.' },
      workload_trend: { score: 74, available: true, source: 'Command Operations Log', note: 'High-tempo tactical cordon and search operations.' },
      deployment_duration: { score: 72, available: true, source: 'Service Dossier Database', note: '8 continuous months in dense terrain remote post.' },
      duty_schedule: { score: 70, available: true, source: 'Battalion Roster', note: 'Irregular operational schedules with rapid alerts.' },
      sleep_quality: { score: 74, available: true, source: 'Biometric Wearable Telemetry', note: 'Interrupted sleep cycles with high vigilance latency.' },
      emotional_exhaustion: { score: 68, available: true, source: 'Clinical MBI-GS Telemetry', note: 'High environmental fatigue; relies on squad support.' },
      assessment_responses: { score: 70, available: true, source: 'AI Psychological Twin Assessment', note: 'Evaluation score 72.4/100 (High strain, priority review).' },
    },
  },
];

const parseParam = (raw: any, fallbackScore: number, fallbackNote: string, defaultSource: string): ParamTelemetryDetail => {
  if (raw && typeof raw === 'object') {
    return {
      score: typeof raw.score === 'number' ? raw.score : fallbackScore,
      available: raw.available !== false,
      source: raw.source || defaultSource,
      note: raw.note || fallbackNote,
    };
  }
  return {
    score: typeof raw === 'number' ? raw : fallbackScore,
    available: true,
    source: defaultSource,
    note: fallbackNote,
  };
};

interface FactorItem {
  id: string;
  num: number;
  title: string;
  shortDesc: string;
  category: string;
  riskLevel: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NOMINAL';
  metricLabel: string;
  metricValue: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  border: string;
  clinicalSignificance: string;
  biomarkers: string[];
  flaggedPersonnel: {
    name: string;
    uid: string;
    rank: string;
    unit: string;
    score: number;
    risk: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NOMINAL';
    trigger: string;
  }[];
  actionProtocol: string;
  modelConfidence: string;
}

export const WelfareDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<WelfareDashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedFactorId, setSelectedFactorId] = useState<string>('burnout-prediction');
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRiskFilter, setSelectedRiskFilter] = useState<string>('ALL');
  const [selectedPersonnelUid, setSelectedPersonnelUid] = useState<string>('UID-EMP-012');
  
  const [customParams, setCustomParams] = useState<{ [key: string]: number }>({});

  const loadWelfareData = async () => {
    try {
      const res = await dashboardService.getWelfareDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load live welfare data from backend HRMS API:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadWelfareData();
  }, [user]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadWelfareData();
  };

  const handleTriggerAction = (factorTitle: string, actionName: string) => {
    setActionAlert(`Action Initiated: ${actionName} for [${factorTitle}] recorded in Welfare Audit Log.`);
    setTimeout(() => setActionAlert(null), 4000);
  };

  // Synchronized database personnel list
  const personnelRoster: PersonnelBurnoutProfile[] = useMemo(() => {
    if (data?.assigned_personnel && Array.isArray(data.assigned_personnel) && data.assigned_personnel.length > 0) {
      return data.assigned_personnel.map((p) => ({
        ...p,
        params: p.params || {
          leave_patterns: { score: 50, available: true, source: 'HRMS Leave Portal', note: 'Standard roster' },
          overtime: { score: 50, available: true, source: 'HRMS Watch Roster', note: 'Standard shift' },
          workload_trend: { score: 50, available: true, source: 'Command Operations Log', note: 'Nominal workload' },
          deployment_duration: { score: 40, available: true, source: 'Service Dossier Database', note: 'Active deployment' },
          duty_schedule: { score: 50, available: true, source: 'Battalion Roster', note: 'Standard rotation' },
          sleep_quality: { score: p.sleep_hours ? Math.max(10, Math.round(100 - p.sleep_hours * 10)) : 50, available: true, source: 'Biometric Wearable Telemetry', note: `${p.sleep_hours || 6}h sleep recorded` },
          emotional_exhaustion: { score: p.stress_score || 50, available: true, source: 'Clinical MBI-GS Telemetry', note: 'Telemetry index' },
          assessment_responses: { score: p.stress_score ? Math.round(p.stress_score * 0.9) : 50, available: true, source: 'AI Twin Self-Assessment', note: 'Self-assessment score' },
        }
      }));
    }
    return ALL_PERSONNEL;
  }, [data]);

  const selectedPersonnel = useMemo(() => {
    return personnelRoster.find((p) => p.uid === selectedPersonnelUid) || personnelRoster[0] || ALL_PERSONNEL[0];
  }, [selectedPersonnelUid, personnelRoster]);

  // Parse structured 8 parameters
  const resolvedParams = useMemo(() => {
    const raw = selectedPersonnel.params;
    return {
      leave_patterns: parseParam(raw.leave_patterns, 50, 'Leave patterns active', 'HRMS Leave Portal'),
      overtime: parseParam(raw.overtime, 50, 'Overtime watch active', 'HRMS Watch Roster'),
      workload_trend: parseParam(raw.workload_trend, 50, 'Workload slope', 'Command Operations Log'),
      deployment_duration: parseParam(raw.deployment_duration, 40, 'Deployment duration', 'Service Dossier Database'),
      duty_schedule: parseParam(raw.duty_schedule, 50, 'Duty schedule rotation', 'Battalion Roster'),
      sleep_quality: parseParam(raw.sleep_quality, 50, 'Sleep quality telemetry', 'Biometric Wearable Telemetry'),
      emotional_exhaustion: parseParam(raw.emotional_exhaustion, 50, 'Emotional exhaustion telemetry', 'Clinical MBI-GS Telemetry'),
      assessment_responses: parseParam(raw.assessment_responses, 50, 'Assessment response telemetry', 'AI Twin Self-Assessment'),
    };
  }, [selectedPersonnel]);

  const currentParamValues = useMemo(() => {
    return {
      leave_patterns: customParams['leave_patterns'] ?? resolvedParams.leave_patterns.score,
      overtime: customParams['overtime'] ?? resolvedParams.overtime.score,
      workload_trend: customParams['workload_trend'] ?? resolvedParams.workload_trend.score,
      deployment_duration: customParams['deployment_duration'] ?? resolvedParams.deployment_duration.score,
      duty_schedule: customParams['duty_schedule'] ?? resolvedParams.duty_schedule.score,
      sleep_quality: customParams['sleep_quality'] ?? resolvedParams.sleep_quality.score,
      emotional_exhaustion: customParams['emotional_exhaustion'] ?? resolvedParams.emotional_exhaustion.score,
      assessment_responses: customParams['assessment_responses'] ?? resolvedParams.assessment_responses.score,
    };
  }, [resolvedParams, customParams]);

  const calculatedBurnout = useMemo(() => {
    const p = currentParamValues;
    const score = (
      0.12 * p.leave_patterns +
      0.14 * p.overtime +
      0.13 * p.workload_trend +
      0.10 * p.deployment_duration +
      0.13 * p.duty_schedule +
      0.15 * p.sleep_quality +
      0.12 * p.emotional_exhaustion +
      0.11 * p.assessment_responses
    );
    const rounded = Math.round(score * 10) / 10;
    
    let level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NOMINAL' = 'NOMINAL';
    let levelColor = 'text-emerald-400';
    let levelBg = 'bg-emerald-950 text-emerald-300 border-emerald-800';
    let recommendation = 'Maintain standard duty cadence and monthly wellness pulse check-in.';

    if (rounded >= 80.0) {
      level = 'CRITICAL';
      levelColor = 'text-rose-400';
      levelBg = 'bg-rose-950 text-rose-300 border-rose-800';
      recommendation = 'MANDATORY ACTION: 48-hour immediate duty detachment, clinical sleep recovery protocol, and 1-on-1 counseling with Chief Welfare Officer.';
    } else if (rounded >= 70.0) {
      level = 'HIGH';
      levelColor = 'text-amber-400';
      levelBg = 'bg-amber-950 text-amber-300 border-amber-800';
      recommendation = 'PRIORITY ACTION: Shift rotation out of night watches, mandatory workload pacing, and expedited leave approval.';
    } else if (rounded >= 50.0) {
      level = 'MODERATE';
      levelColor = 'text-blue-400';
      levelBg = 'bg-blue-950 text-blue-300 border-blue-800';
      recommendation = 'MONITORING: Weekly biometric tracking, buddy support check-in, and micro-break adherence.';
    }

    return {
      score: rounded,
      level,
      levelColor,
      levelBg,
      recommendation,
    };
  }, [currentParamValues]);

  const missingParams = useMemo(() => {
    const missingList: string[] = [];
    Object.entries(resolvedParams).forEach(([k, v]) => {
      if (!v.available) {
        missingList.push(k.replace(/_/g, ' ').toUpperCase());
      }
    });
    return missingList;
  }, [resolvedParams]);

  const filteredPersonnel = useMemo(() => {
    return personnelRoster.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.uid.toLowerCase().includes(q) ||
        p.rank.toLowerCase().includes(q) ||
        p.unit.toLowerCase().includes(q) ||
        p.branch.toLowerCase().includes(q) ||
        p.regimental_number.toLowerCase().includes(q);

      if (!matchesSearch) return false;

      if (selectedRiskFilter === 'ALL') return true;

      const pLeave = typeof p.params.leave_patterns === 'object' ? p.params.leave_patterns.score : p.params.leave_patterns;
      const pOver = typeof p.params.overtime === 'object' ? p.params.overtime.score : p.params.overtime;
      const pWork = typeof p.params.workload_trend === 'object' ? p.params.workload_trend.score : p.params.workload_trend;
      const pDep = typeof p.params.deployment_duration === 'object' ? p.params.deployment_duration.score : p.params.deployment_duration;
      const pDuty = typeof p.params.duty_schedule === 'object' ? p.params.duty_schedule.score : p.params.duty_schedule;
      const pSleep = typeof p.params.sleep_quality === 'object' ? p.params.sleep_quality.score : p.params.sleep_quality;
      const pExh = typeof p.params.emotional_exhaustion === 'object' ? p.params.emotional_exhaustion.score : p.params.emotional_exhaustion;
      const pAss = typeof p.params.assessment_responses === 'object' ? p.params.assessment_responses.score : p.params.assessment_responses;

      const baseScore =
        0.12 * (pLeave || 50) +
        0.14 * (pOver || 50) +
        0.13 * (pWork || 50) +
        0.10 * (pDep || 40) +
        0.13 * (pDuty || 50) +
        0.15 * (pSleep || 50) +
        0.12 * (pExh || 50) +
        0.11 * (pAss || 50);

      if (selectedRiskFilter === 'CRITICAL') return baseScore >= 80;
      if (selectedRiskFilter === 'HIGH') return baseScore >= 70 && baseScore < 80;
      if (selectedRiskFilter === 'MODERATE') return baseScore >= 50 && baseScore < 70;
      if (selectedRiskFilter === 'NOMINAL') return baseScore < 50;

      return true;
    });
  }, [searchQuery, selectedRiskFilter, personnelRoster]);

  const resetSliders = () => {
    setCustomParams({});
  };

  const handleSliderChange = (paramKey: string, val: number) => {
    setCustomParams((prev) => ({
      ...prev,
      [paramKey]: val,
    }));
  };



  const metrics = [
    {
      title: 'Active Welfare Cases',
      value: data?.metrics?.active_welfare_cases?.toString() || '18',
      sub: `${data?.metrics?.critical_cases || 4} Critical Priority`,
      icon: HandHeart,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200'
    },
    {
      title: 'High-Risk Watchlist',
      value: `${data?.metrics?.high_risk_personnel_count || 4} Personnel`,
      sub: 'Stress Score > 70/100',
      icon: AlertTriangle,
      color: 'text-rose-600',
      bg: 'bg-rose-50 border-rose-200'
    },
    {
      title: "Today's Counseling Sessions",
      value: `${data?.metrics?.today_counseling_sessions || 4} Scheduled`,
      sub: '2 Completed Today',
      icon: Calendar,
      color: 'text-teal-600',
      bg: 'bg-teal-50 border-teal-200'
    },
    {
      title: 'Intervention Recovery Metric',
      value: `${data?.metrics?.recovery_rate_pct || 92.5}%`,
      sub: `${data?.metrics?.monthly_resolved_interventions || 34} Cases Resolved`,
      icon: CheckCircle,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200'
    },
  ];

  const factorOptions: FactorItem[] = [
    {
      id: 'burnout-prediction',
      num: 1,
      title: 'Burnout Prediction',
      shortDesc: 'Exhaustion probability, depersonalization & task weariness',
      category: 'Psychometric Forecasting',
      riskLevel: 'CRITICAL',
      metricLabel: 'Unit Exhaustion Risk',
      metricValue: '74% Elevated',
      icon: Flame,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      clinicalSignificance: 'Predicts chronic physical and emotional exhaustion trajectories using Maslach multi-factor models. Early detection prevents sudden duty breakdown.',
      biomarkers: ['Consecutive duty cycles > 8 days', 'Sleep restorative deficit (>18h total)', 'Decreased work satisfaction markers', 'Subjective cognitive heaviness'],
      flaggedPersonnel: [
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 86.4, risk: 'CRITICAL', trigger: '8 consecutive night shifts + hypoxia fatigue' },
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 80.8, risk: 'HIGH', trigger: 'Caregiver distress + artillery command load' },
        { name: 'Naik Sandeep Patil', uid: 'UID-EMP-014', rank: 'Naik', unit: 'Signals & Telemetry', score: 70.5, risk: 'HIGH', trigger: 'Continuous console night duty & sleep fragmentation' },
      ],
      actionProtocol: 'Mandatory 48-hour sleep regeneration cycle and workload pacing with immediate task rotation.',
      modelConfidence: '96.2% ROC-AUC'
    },
    {
      id: 'psychological-distress',
      num: 2,
      title: 'Psychological Distress',
      shortDesc: 'Kessler-10 affective strain & somatic dysphoria telemetry',
      category: 'Clinical Screening',
      riskLevel: 'HIGH',
      metricLabel: 'K10 Distress Index',
      metricValue: '68 / 100',
      icon: Activity,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      clinicalSignificance: 'Screens for generalized affective distress, non-specific anxiety, and somatic tension in high-stress operational deployments.',
      biomarkers: ['Elevated restlessness off-duty', 'Somatic muscle tension indices', 'Dysphoric mood fluctuations', 'Sub-clinical emotional fatigue'],
      flaggedPersonnel: [
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 75.0, risk: 'HIGH', trigger: 'Family medical distress combined with battery command' },
        { name: 'Sepoy Amit Kumar', uid: 'UID-SLD-015', rank: 'Sepoy', unit: '10 Para SF', score: 56.0, risk: 'MODERATE', trigger: 'Tactical vigilance down-regulation latency' },
      ],
      actionProtocol: '1-on-1 confidential counselor debrief and somatic relaxation guidance session.',
      modelConfidence: '94.8% ROC-AUC'
    },
    {
      id: 'stress-indicators-detection',
      num: 3,
      title: 'Stress Indicators Detection',
      shortDesc: 'Real-time autonomic signals, HRV volatility & sleep fragmentation',
      category: 'Biometric Telemetry',
      riskLevel: 'CRITICAL',
      metricLabel: 'Anomaly Rate',
      metricValue: '82% Flagged',
      icon: Zap,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      clinicalSignificance: 'Extracts real-time physiological and psychological indicators from wearable telemetry and daily pulse check-ins.',
      biomarkers: ['Resting pulse elevation > 18%', 'Sleep latency > 45 minutes', 'Nocturnal arousal frequency > 3x', 'Deep sleep deficit (<40 min)'],
      flaggedPersonnel: [
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 88.0, risk: 'CRITICAL', trigger: 'Severe sleep fragmentation (3.8h sleep recorded)' },
        { name: 'Major Alex Morgan', uid: 'UID-EMP-010', rank: 'Major', unit: 'Rapid Action Bn 1', score: 78.0, risk: 'HIGH', trigger: 'Night duty cardiovascular recovery deficit' },
      ],
      actionProtocol: 'Biofeedback paced-breathing intervention and wearable autonomic recovery tracking.',
      modelConfidence: '97.1% ROC-AUC'
    },
    {
      id: 'overall-stress-prediction',
      num: 4,
      title: 'Overall Stress Prediction',
      shortDesc: 'Multi-source composite operational strain score & trendline',
      category: 'Predictive Modeling',
      riskLevel: 'HIGH',
      metricLabel: 'Unit Stress Score',
      metricValue: '64.2 / 100',
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      clinicalSignificance: 'Synthesizes self-reports, biometric check-ins, mission difficulty, and environmental factors into a unified predictive trajectory.',
      biomarkers: ['Cumulative watch tempo', 'Elevated emotional reactivity', 'Appetite & hydration irregularity', 'Inter-shift rest deficit'],
      flaggedPersonnel: [
        { name: 'Major Alex Morgan', uid: 'UID-EMP-010', rank: 'Major', unit: 'Rapid Action Bn 1', score: 78.0, risk: 'HIGH', trigger: 'Night duty cardiovascular recovery deficit' },
        { name: 'Sepoy Amit Kumar', uid: 'UID-SLD-015', rank: 'Sepoy', unit: '10 Para SF', score: 57.2, risk: 'MODERATE', trigger: 'Prolonged forward sector recon duty' },
      ],
      actionProtocol: 'Unit-level wellness review and structured 72-hour operational tempo modulation.',
      modelConfidence: '95.4% ROC-AUC'
    },
    {
      id: 'emotional-fatigue-prediction',
      num: 5,
      title: 'Emotional Fatigue Prediction',
      shortDesc: 'Compassion fatigue, emotional blunting & sensory overload',
      category: 'Affective Telemetry',
      riskLevel: 'HIGH',
      metricLabel: 'Fatigue Severity',
      metricValue: '71% High Strain',
      icon: BatteryLow,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      clinicalSignificance: 'Measures psychological numbness, cognitive exhaustion, and reduced empathy resulting from acute operational stressors.',
      biomarkers: ['Flat affective tone during check-ins', 'Social withdrawal indices', 'Delayed response reaction time', 'Reduced recreational engagement'],
      flaggedPersonnel: [
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 80.0, risk: 'HIGH', trigger: 'Chronic duty alertness with domestic concern' },
        { name: 'Naik Sandeep Patil', uid: 'UID-EMP-014', rank: 'Naik', unit: 'Signals & Telemetry', score: 68.0, risk: 'HIGH', trigger: 'Screen glare and sensory monotony fatigue' },
      ],
      actionProtocol: 'Facilitate peer support contact and positive behavioral engagement activities.',
      modelConfidence: '93.7% ROC-AUC'
    },
    {
      id: 'welfare-concern-detection',
      num: 6,
      title: 'Welfare Concern Detection',
      shortDesc: 'Family welfare, housing, financial distress & bereavement triggers',
      category: 'Social Determinants',
      riskLevel: 'CRITICAL',
      metricLabel: 'Active Alerts',
      metricValue: '7 Cases Open',
      icon: ShieldAlert,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      clinicalSignificance: 'Captures non-operational domestic pressures including family medical emergencies, children education, and compensation claims.',
      biomarkers: ['Emergency leave applications', 'Financial assistance queries', 'Irregular call-home communication patterns', 'Subdued demeanor post-contact'],
      flaggedPersonnel: [
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 88.0, risk: 'CRITICAL', trigger: 'Wife hospitalization in native village pending grant' },
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 72.0, risk: 'HIGH', trigger: 'High school transition support for children' },
      ],
      actionProtocol: 'Immediate Welfare Emergency Grant sanction and Family Support Liaison officer dispatch.',
      modelConfidence: '98.0% Accuracy'
    },
    {
      id: 'predictive-behavioral-analytics',
      num: 7,
      title: 'Predictive Behavioral Analytics',
      shortDesc: 'Machine-learning trajectory forecasting & anomaly detection',
      category: 'AI Forecasting',
      riskLevel: 'MODERATE',
      metricLabel: 'Trend Direction',
      metricValue: '+14% Risk Trend',
      icon: LineChart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      clinicalSignificance: 'Applies recurrent neural networks (LSTM) to predict individual behavioral drift over 14, 30, and 90-day time horizons.',
      biomarkers: ['Step count reduction > 30%', 'Screen interaction jitter', 'App check-in skips', 'Voice acoustic pitch volatility'],
      flaggedPersonnel: [
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 79.0, risk: 'HIGH', trigger: 'Behavioral latency drift over last 14 days' },
        { name: 'Sepoy Amit Kumar', uid: 'UID-SLD-015', rank: 'Sepoy', unit: '10 Para SF', score: 48.0, risk: 'NOMINAL', trigger: 'Stable behavioral baseline trajectory' },
      ],
      actionProtocol: 'Schedule prophylactic wellness review before escalation to critical threshold.',
      modelConfidence: '95.6% ROC-AUC'
    },
    {
      id: 'stress-burnout-risk-models',
      num: 8,
      title: 'Stress & Burnout Risk Models',
      shortDesc: 'Composite hazard indices combining physiological & psychometric models',
      category: 'Multi-Modal Modeling',
      riskLevel: 'CRITICAL',
      metricLabel: 'Hazard Index',
      metricValue: '86.4% Elevated',
      icon: Gauge,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      clinicalSignificance: 'Combines Maslach, Kessler-10, and autonomic biometric indicators into a single unified risk classifier for leadership command.',
      biomarkers: ['High acute-to-chronic workload ratio', 'Prolonged sympathetic activation', 'Low psychological detachment', 'Cognitive exhaustion'],
      flaggedPersonnel: [
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 86.4, risk: 'CRITICAL', trigger: 'Simultaneous high autonomic strain + psychometric exhaustion' },
        { name: 'Major Alex Morgan', uid: 'UID-EMP-010', rank: 'Major', unit: 'Rapid Action Bn 1', score: 74.8, risk: 'HIGH', trigger: 'Command sleep deficit + continuous night shift vigil' },
      ],
      actionProtocol: 'Chief Welfare Officer case review and mandatory tactical downtime assignment.',
      modelConfidence: '96.8% ROC-AUC'
    },
    {
      id: 'welfare-intervention-recommendation',
      num: 9,
      title: 'Welfare Intervention Recommendation',
      shortDesc: 'AI-prescribed clinical therapies, leave grants & rest rotations',
      category: 'Prescriptive Analytics',
      riskLevel: 'MODERATE',
      metricLabel: 'Intervention Fit',
      metricValue: '91% Accuracy',
      icon: HeartHandshake,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      clinicalSignificance: 'Generates evidence-based clinical protocols, automated leave allocations, and specialized counseling pathways tailored to root-causes.',
      biomarkers: ['Intervention response velocity', 'Counseling follow-up compliance', 'Somatic recovery after leave', 'Peer support integration'],
      flaggedPersonnel: [
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 82.0, risk: 'HIGH', trigger: 'Recommended: 10-day compassionate leave + tele-counseling' },
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 88.0, risk: 'CRITICAL', trigger: 'Recommended: Oxygen therapy + 48h sleep replenishment' },
      ],
      actionProtocol: 'Execute recommended automated welfare intervention workflow with unit commander endorsement.',
      modelConfidence: '97.4% ROC-AUC'
    },
    {
      id: 'automated-alerts',
      num: 10,
      title: 'Automated Alerts',
      shortDesc: 'Early warning triggers, threshold breaches & commander dispatches',
      category: 'Early Warning System',
      riskLevel: 'CRITICAL',
      metricLabel: 'Urgent Alerts',
      metricValue: '4 Critical Dispatches',
      icon: BellRing,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      clinicalSignificance: 'Real-time alert engine delivering instant SMS/telemetry dispatches to Welfare Officers and Unit Medical Officers when risk bounds are exceeded.',
      biomarkers: ['Stress score spike > 25 pts in 24h', 'HRV dropping below 20ms baseline', 'Emergency trigger word detection', 'Consecutive duty breach'],
      flaggedPersonnel: [
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 92.0, risk: 'CRITICAL', trigger: 'Instant Alert: Sleep deficit threshold breached (<3.8h)' },
        { name: 'Major Alex Morgan', uid: 'UID-EMP-010', rank: 'Major', unit: 'Rapid Action Bn 1', score: 80.0, risk: 'HIGH', trigger: 'Alert: 4th consecutive night patrol duty logged' },
      ],
      actionProtocol: 'Acknowledge alert within 15 minutes; confirm welfare officer or medic on-site contact.',
      modelConfidence: '99.1% Delivery'
    },
    {
      id: 'mental-wellbeing-resilience',
      num: 11,
      title: 'Mental Well-being & Workforce Resilience',
      shortDesc: 'Positive psychology, squad cohesion, hardiness & coping indices',
      category: 'Positive Psychology',
      riskLevel: 'NOMINAL',
      metricLabel: 'Unit Resilience',
      metricValue: '82% Resilient',
      icon: Smile,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      clinicalSignificance: 'Measures adaptive psychological coping, mission alignment, optimism, and squad camaraderie across the formation.',
      biomarkers: ['CD-RISC hardiness score > 75%', 'Squad trust index > 85%', 'Post-incident recovery velocity', 'Vocational pride & purpose'],
      flaggedPersonnel: [
        { name: 'Sepoy Amit Kumar', uid: 'UID-SLD-015', rank: 'Sepoy', unit: '10 Para SF', score: 86.0, risk: 'NOMINAL', trigger: 'High tactical bounce-back & camaraderie' },
        { name: 'Major Alex Morgan', uid: 'UID-EMP-010', rank: 'Major', unit: 'Rapid Action Bn 1', score: 72.0, risk: 'NOMINAL', trigger: 'Demonstrated command resilience under stress' },
      ],
      actionProtocol: 'Incorporate positive psychology conditioning into regular morning parade brief.',
      modelConfidence: '94.0% ROC-AUC'
    },
    {
      id: 'operational-readiness',
      num: 12,
      title: 'Operational Readiness',
      shortDesc: 'Cognitive sharpness, reaction stamina & mission suitability fit',
      category: 'Mission Readiness',
      riskLevel: 'NOMINAL',
      metricLabel: 'Deployment Fit',
      metricValue: '84.2% Combat Ready',
      icon: Target,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      clinicalSignificance: 'Calculates combat fitness and cognitive reaction capacity, identifying personnel primed for mission deployment vs. those requiring recovery.',
      biomarkers: ['Cognitive reaction sharpness > 80%', 'Somatic endurance index', 'Zero absent-minded error telemetry', 'Alertness stability'],
      flaggedPersonnel: [
        { name: 'Sepoy Amit Kumar', uid: 'UID-SLD-015', rank: 'Sepoy', unit: '10 Para SF', score: 84.0, risk: 'NOMINAL', trigger: 'Combat Ready: High focus & physical fitness' },
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 46.0, risk: 'CRITICAL', trigger: 'Unfit for frontline duty pending 48h rest' },
      ],
      actionProtocol: 'Certify deployment clearance for fit personnel; place fatigued personnel on local guard pacing.',
      modelConfidence: '96.5% ROC-AUC'
    },
    {
      id: 'occupational-stress-risk',
      num: 13,
      title: 'Occupational Stress Incident Risk',
      shortDesc: 'Extreme terrain, hypoxia, shift hazard & safety vulnerability',
      category: 'Safety & Risk Engineering',
      riskLevel: 'HIGH',
      metricLabel: 'Incident Risk Index',
      metricValue: '11.2% Low-Moderate',
      icon: AlertOctagon,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      clinicalSignificance: 'Identifies environment-driven occupational hazards such as extreme altitude hypoxia, continuous night duties, and micro-sleep vulnerabilities.',
      biomarkers: ['Continuous night duty > 5 cycles', 'High altitude exposure (>11,000 ft)', 'Micro-sleep latency drop during duty', 'Cumulative physical fatigue'],
      flaggedPersonnel: [
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 86.0, risk: 'CRITICAL', trigger: 'Hypoxia + night vigil safety hazard flag' },
        { name: 'Naik Sandeep Patil', uid: 'UID-EMP-014', rank: 'Naik', unit: 'Signals & Telemetry', score: 72.0, risk: 'HIGH', trigger: 'Nocturnal screen fatigue & micro-sleep risk' },
      ],
      actionProtocol: 'Implement environmental rotation out of high altitude; mandate daylight duty shift transfers.',
      modelConfidence: '95.8% ROC-AUC'
    },
  ];

  const currentFactor = factorOptions.find((f) => f.id === selectedFactorId) || factorOptions[0];
  const CurrentIcon = currentFactor.icon;

  const highRiskPersonnel = data?.high_risk_watchlist || [
    {
      uid: 'UID-EMP-012',
      force_id: 'DUM_12',
      regimental_number: 'CRPF-2016-8012',
      name: 'Havildar Ramesh Chand',
      rank: 'Havildar',
      unit: 'High Altitude Guard',
      branch: 'CRPF',
      stress_score: 88,
      risk_level: 'CRITICAL',
      trigger_factor: 'Consecutive High-Altitude Watch + Hypoxia Strain',
      last_checkin: '1 hour ago',
      status: 'Under Medical Observation'
    },
    {
      uid: 'UID-EMP-013',
      force_id: 'DUM_13',
      regimental_number: 'ARMY-2018-8013',
      name: 'Subedar Gurpreet Singh',
      rank: 'Subedar',
      unit: 'Field Artillery 3rd Bn',
      branch: 'Indian Army',
      stress_score: 82,
      risk_level: 'HIGH',
      trigger_factor: 'High Operational Tempo & Family Medical Emergency',
      last_checkin: '3 hours ago',
      status: 'Active Duty'
    },
    {
      uid: 'UID-EMP-010',
      force_id: 'DUM_1',
      regimental_number: 'CRPF-2015-8010',
      name: 'Major Alex Morgan',
      rank: 'Major',
      unit: 'Rapid Action Battalion 1',
      branch: 'CRPF',
      stress_score: 78,
      risk_level: 'HIGH',
      trigger_factor: 'Prolonged Night Patrols + Sleep Deficit (<5h/night)',
      last_checkin: '2 hours ago',
      status: 'Active Duty'
    },
  ];

  const upcomingSessions = data?.upcoming_sessions || [
    {
      id: 'WLF-2026-091',
      personnel_name: 'Havildar Ramesh Chand',
      rank: 'Havildar',
      category: 'Fatigue & Hypoxia Stress Intervention',
      urgency: 'CRITICAL',
      status: 'In Progress',
      scheduled_time: '10:30 AM Today',
      venue: 'Counseling Suite 2 / Tele-Health',
      action_plan: 'Mandatory 48h rest rotation'
    },
    {
      id: 'WLF-2026-088',
      personnel_name: 'Subedar Gurpreet Singh',
      rank: 'Subedar',
      category: 'Family Support & Financial Grant',
      urgency: 'HIGH',
      status: 'Approved',
      scheduled_time: '02:00 PM Today',
      venue: 'Welfare Wing Clinic',
      action_plan: 'Compassionate grant disbursed'
    },
  ];

  const paramDefinitions = useMemo(() => [
    { 
      key: 'leave_patterns', 
      name: '1. Leave patterns', 
      weight: 0.12, 
      weightLabel: '12%', 
      note: resolvedParams.leave_patterns.note, 
      source: resolvedParams.leave_patterns.source,
      available: resolvedParams.leave_patterns.available,
      color: 'text-amber-400', 
      bar: 'bg-amber-500', 
      desc: 'Leave denial frequency, furlough deficits & emergency leave queue' 
    },
    { 
      key: 'overtime', 
      name: '2. Overtime', 
      weight: 0.14, 
      weightLabel: '14%', 
      note: resolvedParams.overtime.note, 
      source: resolvedParams.overtime.source,
      available: resolvedParams.overtime.available,
      color: 'text-rose-400', 
      bar: 'bg-rose-500', 
      desc: 'Duty hours beyond standard watch cycles & double-shift load' 
    },
    { 
      key: 'workload_trend', 
      name: '3. Workload trend', 
      weight: 0.13, 
      weightLabel: '13%', 
      note: resolvedParams.workload_trend.note, 
      source: resolvedParams.workload_trend.source,
      available: resolvedParams.workload_trend.available,
      color: 'text-rose-400', 
      bar: 'bg-rose-500', 
      desc: '14-day and 30-day task volume escalation slope' 
    },
    { 
      key: 'deployment_duration', 
      name: '4. Deployment duration', 
      weight: 0.10, 
      weightLabel: '10%', 
      note: resolvedParams.deployment_duration.note, 
      source: resolvedParams.deployment_duration.source,
      available: resolvedParams.deployment_duration.available,
      color: 'text-rose-400', 
      bar: 'bg-rose-500', 
      desc: 'Continuous months stationed in hostile or high-altitude stations' 
    },
    { 
      key: 'duty_schedule', 
      name: '5. Duty schedule', 
      weight: 0.13, 
      weightLabel: '13%', 
      note: resolvedParams.duty_schedule.note, 
      source: resolvedParams.duty_schedule.source,
      available: resolvedParams.duty_schedule.available,
      color: 'text-amber-400', 
      bar: 'bg-amber-500', 
      desc: 'Night shift concentration, rotational irregularity & short recovery' 
    },
    { 
      key: 'sleep_quality', 
      name: '6. Sleep quality', 
      weight: 0.15, 
      weightLabel: '15%', 
      note: resolvedParams.sleep_quality.note, 
      source: resolvedParams.sleep_quality.source,
      available: resolvedParams.sleep_quality.available,
      color: 'text-rose-400', 
      bar: 'bg-rose-500', 
      desc: 'Sleep deficit (<4.5h), nocturnal fragmentation & latency' 
    },
    { 
      key: 'emotional_exhaustion', 
      name: '7. Emotional exhaustion score', 
      weight: 0.12, 
      weightLabel: '12%', 
      note: resolvedParams.emotional_exhaustion.note, 
      source: resolvedParams.emotional_exhaustion.source,
      available: resolvedParams.emotional_exhaustion.available,
      color: 'text-amber-400', 
      bar: 'bg-amber-500', 
      desc: 'Maslach MBI-GS affective depletion & compassion weariness' 
    },
    { 
      key: 'assessment_responses', 
      name: '8. Assessment responses', 
      weight: 0.11, 
      weightLabel: '11%', 
      note: resolvedParams.assessment_responses.note, 
      source: resolvedParams.assessment_responses.source,
      available: resolvedParams.assessment_responses.available,
      color: 'text-teal-400', 
      bar: 'bg-teal-500', 
      desc: 'Gemini AI multi-domain self-assessment validated psychometrics' 
    },
  ], [resolvedParams]);

  return (
    <div className="space-y-6">
      {/* Toast Notification for factor actions */}
      {actionAlert && (
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-slate-900 text-white border border-emerald-500 shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionAlert}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Chief Welfare Officer Command Center</span>
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                &bull; HRMS Unique ID: <span className="text-emerald-700 font-bold">{user?.uid || 'UID-WEL-007'}</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">
                &bull; Regimental: <span className="text-slate-800 font-bold">{user?.regimental_number || 'CRPF-2014-8007'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome, {user?.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed font-medium">
              Synchronized HRMS Personnel Welfare Directory. Search personnel, inspect live counts, select soldiers to evaluate 8-parameter multi-variate Burnout Predictions, and trigger direct welfare interventions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-emerald-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync HRMS'}</span>
            </button>
            <button
              onClick={() => handleTriggerAction('Welfare Command', 'New Case Initiation')}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Initiate Case</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.title} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-soft white-card-hover relative overflow-hidden">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-slate-500">{m.title}</span>
                <div className={`p-2.5 rounded-xl border ${m.bg} ${m.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-mono">{m.value}</p>
              <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5 font-semibold">
                <HeartPulse className="w-3.5 h-3.5 text-emerald-600" />
                <span>{m.sub}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SECTION: SEARCHABLE PERSONNEL DIRECTORY & BURNOUT PREDICTION COMMAND */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-6 relative overflow-hidden">
        {/* Header & Dynamic Counter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                  Personnel Roster & Live Burnout Predictor
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Search any user, inspect unit counts, and select personnel to compute 8-parameter multi-variate Burnout Predictions.
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Counter Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-black bg-slate-900 text-white shadow-sm flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Showing {filteredPersonnel.length} of {ALL_PERSONNEL.length} Personnel</span>
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Selection: <strong className="text-emerald-900">{selectedPersonnel.name}</strong>
            </span>
          </div>
        </div>

        {/* Search Bar & Filter Strip */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search personnel by name, UID (e.g. UID-EMP-012), regimental number, rank, or unit..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500 transition-all font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700"
              >
                Clear
              </button>
            )}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <span className="text-xs font-bold text-slate-500 flex items-center gap-1 pl-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              Filter:
            </span>
            {['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'NOMINAL'].map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedRiskFilter(lvl)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedRiskFilter === lvl
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                }`}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>

        {/* Personnel Search Results / Selection Carousel Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold px-1">
            <span>Select Personnel to evaluate Burnout Prediction:</span>
            <span>{filteredPersonnel.length} matches found</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {filteredPersonnel.map((p) => {
              const isSelected = selectedPersonnelUid === p.uid;
              const baseScore = Math.round(
                (0.12 * p.params.leave_patterns +
                0.14 * p.params.overtime +
                0.13 * p.params.workload_trend +
                0.10 * p.params.deployment_duration +
                0.13 * p.params.duty_schedule +
                0.15 * p.params.sleep_quality +
                0.12 * p.params.emotional_exhaustion +
                0.11 * p.params.assessment_responses) * 10
              ) / 10;

              const isCrit = baseScore >= 80;
              const isHigh = baseScore >= 70 && baseScore < 80;
              const isMod = baseScore >= 50 && baseScore < 70;

              return (
                <button
                  key={p.uid}
                  onClick={() => {
                    setSelectedPersonnelUid(p.uid);
                    setCustomParams({});
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-slate-900 border-slate-900 text-white shadow-xl ring-2 ring-emerald-500/50 transform -translate-y-1'
                      : 'bg-slate-50/80 hover:bg-white border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-slate-800 text-emerald-400 border border-slate-700' : 'bg-slate-200/80 text-slate-700'
                      }`}>
                        {p.uid}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isCrit
                          ? isSelected ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-rose-100 text-rose-800'
                          : isHigh
                          ? isSelected ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800'
                          : isMod
                          ? isSelected ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-blue-100 text-blue-800'
                          : isSelected ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {isCrit ? 'CRITICAL' : isHigh ? 'HIGH' : isMod ? 'MODERATE' : 'NOMINAL'}
                      </span>
                    </div>

                    <div>
                      <h4 className={`font-black text-xs leading-snug tracking-tight ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-emerald-700'}`}>
                        {p.name}
                      </h4>
                      <p className={`text-[11px] font-medium ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                        {p.rank} &bull; {p.unit}
                      </p>
                      <p className={`text-[10px] font-mono ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                        {p.branch} &bull; {p.regimental_number}
                      </p>
                    </div>
                  </div>

                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs font-mono ${
                    isSelected ? 'border-slate-800 text-slate-300' : 'border-slate-200/80 text-slate-600'
                  }`}>
                    <span className="text-[10px] font-sans font-medium">Burnout Est:</span>
                    <span className={`font-black text-xs ${
                      isCrit ? 'text-rose-400' : isHigh ? 'text-amber-400' : isMod ? 'text-blue-400' : 'text-emerald-400'
                    }`}>
                      {baseScore}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Personnel Burnout Prediction Dossier & Interactive Simulator */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Dossier Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-800 flex items-center justify-center text-white text-xl font-black shadow-lg shrink-0 border border-emerald-400/40">
                {selectedPersonnel.name.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-800">
                    {selectedPersonnel.uid} &bull; {selectedPersonnel.regimental_number}
                  </span>
                  <span className="text-xs font-mono text-slate-300 bg-slate-800 px-2.5 py-0.5 rounded-full border border-slate-700">
                    {selectedPersonnel.branch} &bull; {selectedPersonnel.unit}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    Category: <strong className="text-white">{selectedPersonnel.medical_category}</strong>
                  </span>
                  {selectedPersonnel.hrms_sync_status === 'PARTIAL_SYNC' ? (
                    <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-950/90 px-2.5 py-0.5 rounded-full border border-amber-600 flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>HRMS Sync: PARTIAL SYNC ({selectedPersonnel.data_completeness_pct || 75}%)</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-black text-emerald-300 bg-emerald-950/80 px-2.5 py-0.5 rounded-full border border-emerald-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                      <span>HRMS Sync: SYNCHRONIZED (100%)</span>
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
                  <span>{selectedPersonnel.name}</span>
                  <span className="text-sm font-medium text-slate-400">({selectedPersonnel.rank})</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Status: <strong className="text-emerald-400">{selectedPersonnel.status}</strong> &bull; Multi-Variate Defense Burnout Telemetry Dossier.
                </p>
              </div>
            </div>

            {/* Overall Calculated Burnout Card */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center gap-5 shrink-0 shadow-lg">
              <div className="text-right">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
                  Calculated Burnout Risk
                </span>
                <div className="flex items-baseline justify-end gap-1 mt-0.5">
                  <span className={`text-3xl font-black font-mono tracking-tight ${calculatedBurnout.levelColor}`}>
                    {calculatedBurnout.score}%
                  </span>
                </div>
                <span className={`inline-block text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border mt-1 ${calculatedBurnout.levelBg}`}>
                  {calculatedBurnout.level} HAZARD
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleTriggerAction('Burnout Dispatch', `Priority intervention for ${selectedPersonnel.name}`)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Dispatch Intervention</span>
                </button>
                <button
                  onClick={resetSliders}
                  className="px-3 py-1.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-bold flex items-center justify-center gap-1 transition-all cursor-pointer border border-slate-600"
                >
                  <RotateCcw className="w-3 h-3 text-slate-400" />
                  <span>Reset Simulation</span>
                </button>
              </div>
            </div>
          </div>

          {/* Missing Telemetry Notification Alert (if any parameter not available in database) */}
          {missingParams.length > 0 && (
            <div className="p-4 rounded-2xl bg-amber-950/70 border border-amber-500/60 flex items-start gap-3.5 text-amber-200 text-xs shadow-lg relative z-10 animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <div className="flex items-center gap-2 font-black text-amber-300">
                  <span>⚠️ HRMS TELEMETRY NOTICE: PENDING SYNCHRONIZATION</span>
                  <span className="text-[10px] bg-amber-900/90 text-amber-300 px-2 py-0.5 rounded border border-amber-700">
                    {missingParams.length} Parameter(s) Unsynced
                  </span>
                </div>
                <p className="mt-1 text-amber-200/90 leading-relaxed font-medium">
                  Live data for <strong className="text-white underline">{missingParams.join(', ')}</strong> is not yet available in the HRMS database for this personnel. Using baseline unit default values for interactive simulation until telemetry packets synchronize.
                </p>
              </div>
            </div>
          )}

          {/* Mathematical Weight Breakdown Formula Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-2 font-mono">
            <div className="flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-white">Burnout Formula:</strong> 0.12(Leave) + 0.14(Overtime) + 0.13(Workload) + 0.10(Deployment) + 0.13(Schedule) + 0.15(Sleep) + 0.12(Exhaustion) + 0.11(Assessment)
              </span>
            </div>
            <span className="text-[11px] text-emerald-400 font-bold">
              Adjust sliders below to run live predictive simulations &rarr;
            </span>
          </div>

          {/* 8 Parameters Detailed Breakdown & Live Simulation Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {paramDefinitions.map((param) => {
              const currentVal = (currentParamValues as any)[param.key];
              const isModified = customParams[param.key] !== undefined;

              return (
                <div
                  key={param.key}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                    !param.available
                      ? 'bg-slate-800/70 border-amber-500/50 ring-1 ring-amber-500/20'
                      : isModified
                      ? 'bg-slate-800/90 border-emerald-500/60 ring-1 ring-emerald-500/30 shadow-md'
                      : 'bg-slate-800/60 border-slate-700/80'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{param.name}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                      {param.weightLabel}
                    </span>
                  </div>

                  {/* Telemetry Availability & Source Tag */}
                  <div className="flex items-center justify-between">
                    {param.available ? (
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-950/70 border border-emerald-800/80 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span className="truncate max-w-[130px]">{param.source}</span>
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-amber-300 bg-amber-950/90 border border-amber-600 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                        <span>Data Pending Sync</span>
                      </span>
                    )}

                    <span className={`text-sm font-mono font-black ${
                      currentVal >= 80 ? 'text-rose-400' : currentVal >= 70 ? 'text-amber-400' : currentVal >= 50 ? 'text-blue-400' : 'text-emerald-400'
                    }`}>
                      {currentVal}%
                    </span>
                  </div>

                  {/* Interactive Slider */}
                  <div className="space-y-1">
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={currentVal}
                      onChange={(e) => handleSliderChange(param.key, parseInt(e.target.value, 10))}
                      className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg appearance-none"
                    />
                    <div className="flex justify-between text-[9px] font-mono text-slate-500">
                      <span>0% Nominal</span>
                      <span>100% Critical</span>
                    </div>
                  </div>

                  {/* Context Note */}
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-medium bg-slate-900/80 p-2 rounded-xl border border-slate-800/80">
                    {param.note}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Clinical Recommendation & Protocol Dispatch Card */}
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>AI Clinical Intervention Guidance for {selectedPersonnel.name}</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {calculatedBurnout.recommendation}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleTriggerAction('Welfare Protocol', `Mandatory 48h rest rotation for ${selectedPersonnel.name}`)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                Schedule Rest Rotation
              </button>
              <button
                onClick={() => handleTriggerAction('Counseling', `Open 1-on-1 counseling case for ${selectedPersonnel.name}`)}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold border border-slate-600 transition-all cursor-pointer"
              >
                Book Counselor
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION: ANALYSIS BASED ON FACTOR (CHIEF WELFARE OFFICER INTELLIGENCE) */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-6 relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 shadow-xs">
                <Sliders className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Analysis Based on Factor
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-3xl">
              13-Factor Psychometric Intelligence Matrix. Click any factor option below to inspect clinical telemetry, root-cause biomarkers, flagged personnel cohorts, and automated welfare protocols.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>13 Active Factor Models</span>
            </span>
          </div>
        </div>

        {/* 13 Factor Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3">
          {factorOptions.map((factor) => {
            const Icon = factor.icon;
            const isSelected = selectedFactorId === factor.id;

            return (
              <button
                key={factor.id}
                onClick={() => setSelectedFactorId(factor.id)}
                className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 relative group ${
                  isSelected
                    ? 'bg-slate-900 border-slate-900 text-white shadow-lg ring-2 ring-blue-500/40 transform -translate-y-0.5'
                    : 'bg-slate-50/70 hover:bg-white border-slate-200/90 hover:border-slate-300 text-slate-800 shadow-xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-slate-800 text-blue-300 border border-slate-700' : 'bg-slate-200/70 text-slate-700'
                    }`}>
                      #{String(factor.num).padStart(2, '0')}
                    </span>
                    <span
                      className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        factor.riskLevel === 'CRITICAL'
                          ? isSelected ? 'bg-rose-900/80 text-rose-300 border border-rose-700' : 'bg-rose-100 text-rose-800'
                          : factor.riskLevel === 'HIGH'
                          ? isSelected ? 'bg-amber-900/80 text-amber-300 border border-amber-700' : 'bg-amber-100 text-amber-800'
                          : factor.riskLevel === 'MODERATE'
                          ? isSelected ? 'bg-teal-900/80 text-teal-300 border border-teal-700' : 'bg-teal-100 text-teal-800'
                          : isSelected ? 'bg-emerald-900/80 text-emerald-300 border border-emerald-700' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {factor.riskLevel}
                    </span>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <div className={`p-2 rounded-xl border shrink-0 ${
                      isSelected ? 'bg-slate-800 border-slate-700 text-blue-400' : `${factor.bg} ${factor.border} ${factor.color}`
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className={`font-extrabold text-xs leading-snug tracking-tight ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-blue-600'}`}>
                        {factor.num}. {factor.title}
                      </h3>
                      <p className={`text-[10px] mt-0.5 line-clamp-1 font-medium ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>
                        {factor.shortDesc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`pt-2 border-t flex items-center justify-between text-[11px] font-mono ${
                  isSelected ? 'border-slate-800 text-slate-300' : 'border-slate-200/60 text-slate-600'
                }`}>
                  <span className="text-[10px] font-sans">{factor.metricLabel}:</span>
                  <span className={`font-extrabold ${isSelected ? 'text-emerald-400' : 'text-slate-900'}`}>
                    {factor.metricValue}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Factor Deep-Dive Intelligence Panel */}
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Panel Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-2xl bg-slate-800 border border-slate-700 text-blue-400 shadow-md shrink-0">
                <CurrentIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950/80 px-2.5 py-0.5 rounded-full border border-blue-800">
                    Factor #{currentFactor.num} &bull; {currentFactor.category}
                  </span>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                    currentFactor.riskLevel === 'CRITICAL'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800'
                      : currentFactor.riskLevel === 'HIGH'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                  }`}>
                    {currentFactor.riskLevel} PRIORITY
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    Model Reliability: <strong className="text-emerald-400">{currentFactor.modelConfidence}</strong>
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1">
                  {currentFactor.num}. {currentFactor.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed font-medium">
                  {currentFactor.clinicalSignificance}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleTriggerAction(currentFactor.title, 'Welfare Protocol Dispatch')}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Initiate Factor Protocol</span>
              </button>
              <button
                onClick={() => handleTriggerAction(currentFactor.title, 'Telemetry Export')}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>

          {/* Panel Body Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
            {/* Left: Root Cause Biomarkers & Clinical Protocol */}
            <div className="lg:col-span-6 space-y-5">
              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-blue-400" />
                  <span>Key Telemetry Signals & Root-Cause Biomarkers</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {currentFactor.biomarkers.map((bio, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 flex items-start gap-2 text-xs text-slate-200">
                      <ChevronRight className="w-3.5 h-3.5 text-blue-400 shrink-0 mt-0.5" />
                      <span>{bio}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-2.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Welfare Officer Action Protocol</span>
                </h4>
                <p className="text-xs text-slate-200 leading-relaxed font-medium bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                  {currentFactor.actionProtocol}
                </p>
              </div>
            </div>

            {/* Right: Flagged Personnel Cohort under this factor */}
            <div className="lg:col-span-6 p-5 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Flagged Personnel Cohort ({currentFactor.flaggedPersonnel.length} Matched)</span>
                </h4>
                <span className="text-[10px] font-mono text-slate-400">Unit Telemetry Live</span>
              </div>

              <div className="space-y-2.5">
                {currentFactor.flaggedPersonnel.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-white">{p.name}</span>
                        <span className="text-[10px] font-mono text-blue-300 bg-blue-950 px-1.5 py-0.5 rounded border border-blue-900">
                          {p.uid}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          p.risk === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {p.risk}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        {p.rank} &bull; {p.unit}
                      </p>
                      <p className="text-[11px] text-amber-300/90 font-medium flex items-center gap-1.5 pt-0.5">
                        <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                        <span>Trigger: {p.trigger}</span>
                      </p>
                    </div>

                    <div className="flex items-center sm:flex-col items-end gap-2 shrink-0">
                      <div className="text-right">
                        <span className="text-[9px] uppercase font-bold text-slate-400 block">Factor Score</span>
                        <span className="text-base font-black font-mono text-rose-400">{p.score}/100</span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedPersonnelUid(p.uid);
                          handleTriggerAction(currentFactor.title, `Selected ${p.name} for Burnout prediction`);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      >
                        <Flame className="w-3 h-3" />
                        <span>Analyze Burnout</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* High Risk Watchlist */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-[0.12em] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600" />
                <span>HRMS Flagged Personnel Watchlist</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Personnel matched under this Welfare Officer requiring immediate counselor outreach.
              </p>
            </div>
            <span className="text-[10px] font-mono text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full border border-rose-200 font-bold">
              {highRiskPersonnel.length} FLAGGED CASES
            </span>
          </div>

          <div className="space-y-3.5">
            {highRiskPersonnel.map((p) => (
              <div
                key={p.uid || p.regimental_number}
                className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 hover:bg-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{p.name}</span>
                    <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                      {p.uid}
                    </span>
                    <span className="text-xs font-mono text-slate-500 font-semibold">
                      {p.regimental_number}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black tracking-wider ${
                      p.risk_level === 'CRITICAL' ? 'bg-rose-100 text-rose-700 border border-rose-200' : 'bg-amber-100 text-amber-700 border border-amber-200'
                    }`}>
                      {p.risk_level}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">
                    {p.rank} &bull; <span className="text-slate-900 font-semibold">{p.unit} ({p.branch})</span>
                  </p>
                  <p className="text-xs text-amber-800 font-semibold flex items-center gap-1.5 pt-1">
                    <Brain className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                    <span>AI Flag: {p.trigger_factor}</span>
                  </p>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between shrink-0 gap-2">
                  <div className="text-right">
                    <div className="text-[10px] uppercase font-black text-slate-400">Stress Score</div>
                    <div className="text-xl font-black text-rose-600 font-mono">{p.stress_score}<span className="text-xs text-slate-400">/100</span></div>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedPersonnelUid(p.uid);
                      handleTriggerAction('Flagged Watchlist', `Selected ${p.name} for Burnout evaluation`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Analyze Burnout</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Counseling Schedule */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-[0.12em]">
                  Today's Counseling Lineup
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Scheduled debriefings & wellness follow-ups.</p>
              </div>
              <Calendar className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="space-y-3">
              {upcomingSessions.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-emerald-700 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-emerald-600" />
                      {s.scheduled_time}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white text-slate-700 font-bold border border-slate-200 shadow-xs">
                      {s.status}
                    </span>
                  </div>
                  <p className="font-extrabold text-xs text-slate-900">{s.personnel_name} ({s.rank})</p>
                  <p className="text-[11px] text-slate-600 font-medium">{s.category}</p>
                  <p className="text-[10px] text-slate-400 font-mono font-medium">{s.venue}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed font-medium">
              HRMS AI Telemetry: Stress reduction protocol initiated for Major Alex Morgan and Subedar Gurpreet Singh. Next biometrics review scheduled in 48 hours.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelfareDashboard;
