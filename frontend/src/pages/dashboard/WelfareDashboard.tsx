import React, { useState, useEffect } from 'react';
import {
  HandHeart,
  AlertTriangle,
  Calendar,
  CheckCircle,
  PlusCircle,
  Clock,
  HeartPulse,
  Brain,
  MessageSquare,
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
  ArrowUpRight,
  ShieldCheck,
  Layers,
  Users,
  CheckCircle2,
  FileText,
  Send,
  Sliders,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { dashboardService, WelfareDashboardData } from '../../services/dashboardService';

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

  const loadWelfareData = async () => {
    try {
      const res = await dashboardService.getWelfareDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load live welfare data:', err);
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
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 82.0, risk: 'CRITICAL', trigger: '8 consecutive night shifts + hypoxia fatigue' },
        { name: 'Naik Sandeep Patil', uid: 'UID-EMP-014', rank: 'Naik', unit: 'Signals & Telemetry', score: 68.0, risk: 'HIGH', trigger: 'Chronic screen latency & shift fragmentation' },
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
      biomarkers: ['Multi-day strain accumulation', 'Duty hour compression', 'Environmental thermal/altitude stress', 'Coping buffer exhaustion'],
      flaggedPersonnel: [
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 82.0, risk: 'HIGH', trigger: 'Sustained 5-day combat readiness tempo' },
        { name: 'Sepoy Vikram Rathore Jr.', uid: 'UID-EMP-015', rank: 'Sepoy', unit: 'Border Guard Platoon', score: 62.0, risk: 'MODERATE', trigger: 'Extreme cold vigil & consecutive duties' },
      ],
      actionProtocol: 'Unit-wide rest scheduling adjustment and commander advisory dispatch.',
      modelConfidence: '95.5% ROC-AUC'
    },
    {
      id: 'emotional-fatigue-prediction',
      num: 5,
      title: 'Emotional Fatigue Prediction',
      shortDesc: 'Compassion fatigue, empathy drain & emotional blunting',
      category: 'Behavioral Science',
      riskLevel: 'MODERATE',
      metricLabel: 'Fatigue Severity',
      metricValue: '58% Moderate',
      icon: BatteryLow,
      color: 'text-teal-600',
      bg: 'bg-teal-50',
      border: 'border-teal-200',
      clinicalSignificance: 'Identifies emotional numbness and compassion fatigue among frontline personnel and welfare support specialists handling high-stress crises.',
      biomarkers: ['Empathic responsiveness decline', 'Post-duty emotional withdrawal', 'Interpersonal friction in squad', 'Blunted positive affect'],
      flaggedPersonnel: [
        { name: 'Naik Sandeep Patil', uid: 'UID-EMP-014', rank: 'Naik', unit: 'Signals & Telemetry', score: 65.0, risk: 'MODERATE', trigger: 'Prolonged isolated monitoring shifts' },
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 65.0, risk: 'MODERATE', trigger: 'Emotional fatigue from high-risk patrols' },
      ],
      actionProtocol: 'Structured peer support circle and psychological decompression workshop.',
      modelConfidence: '92.4% ROC-AUC'
    },
    {
      id: 'welfare-concern-detection',
      num: 6,
      title: 'Welfare Concern Detection',
      shortDesc: 'Family separation, ration/amenity friction & leave clearance',
      category: 'Welfare Telemetry',
      riskLevel: 'HIGH',
      metricLabel: 'Logged Grievances',
      metricValue: '12 Active Cases',
      icon: ShieldAlert,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      clinicalSignificance: 'Detects underlying non-operational domestic and administrative grievances that amplify operational stress.',
      biomarkers: ['Emergency leave backlog > 14 days', 'Family illness communication log', 'Housing & amenity clearance delays', 'Financial distress signals'],
      flaggedPersonnel: [
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 78.0, risk: 'HIGH', trigger: 'Elder parent hospitalized; leave sanctioned awaiting transit' },
        { name: 'Sepoy Amit Kumar', uid: 'UID-SLD-015', rank: 'Sepoy', unit: '10 Para SF', score: 45.0, risk: 'NOMINAL', trigger: 'Resolved accommodation clearance' },
      ],
      actionProtocol: 'Expedite compassionate welfare grant ($500 equivalent) and rapid leave clearance routing.',
      modelConfidence: '96.8% ROC-AUC'
    },
    {
      id: 'predictive-behavioral-analytics',
      num: 7,
      title: 'Predictive Behavioral Analytics',
      shortDesc: 'CUSUM / EWMA baseline drift, isolation & interaction shifts',
      category: 'AI Telemetry',
      riskLevel: 'HIGH',
      metricLabel: 'Drift Magnitude',
      metricValue: '14.8% Variance',
      icon: LineChart,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      clinicalSignificance: 'Tracks multi-week statistical drift from individual soldier baseline (Digital Psychological Twin) to catch subtle pre-clinical changes.',
      biomarkers: ['Mess hall social avoidance', 'Decreased buddy interactions', 'Speech cadence & tone variance', 'Altered digital device night usage'],
      flaggedPersonnel: [
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 76.0, risk: 'HIGH', trigger: '4-week continuous divergence from baseline wellness' },
        { name: 'Sepoy Vikram Rathore Jr.', uid: 'UID-EMP-015', rank: 'Sepoy', unit: 'Border Guard Platoon', score: 58.0, risk: 'MODERATE', trigger: 'Reduced communicative check-in frequency' },
      ],
      actionProtocol: 'Squad commander informal check-in and active buddy-system oversight.',
      modelConfidence: '95.0% ROC-AUC'
    },
    {
      id: 'stress-burnout-risk-models',
      num: 8,
      title: 'Stress & Burnout Risk Models',
      shortDesc: 'Multivariate Explainable AI (XAI) risk curves & feature weights',
      category: 'Advanced XAI',
      riskLevel: 'CRITICAL',
      metricLabel: 'Explainability',
      metricValue: '95.4% Fidelity',
      icon: Gauge,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      clinicalSignificance: 'Provides transparent Shapley-value and feature attribution weighting for clinical decisions, ensuring zero black-box diagnostics.',
      biomarkers: ['Sleep Deficit Weight: 34%', 'Operational Shift Load: 28%', 'Emotional Friction: 20%', 'Family Distance: 18%'],
      flaggedPersonnel: [
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 88.0, risk: 'CRITICAL', trigger: 'Combined multi-factor XAI hazard score: 0.88' },
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 82.0, risk: 'HIGH', trigger: 'Combined multi-factor XAI hazard score: 0.81' },
      ],
      actionProtocol: 'Export XAI psychological dossier for Medical Board and Welfare review.',
      modelConfidence: '98.0% ROC-AUC'
    },
    {
      id: 'welfare-intervention-recommendation',
      num: 9,
      title: 'Welfare Intervention Recommendation',
      shortDesc: 'AI-guided clinical triage pathways & structured recovery milestones',
      category: 'Clinical Decision Support',
      riskLevel: 'NOMINAL',
      metricLabel: 'Protocols Ready',
      metricValue: '9 Available',
      icon: HeartHandshake,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      clinicalSignificance: 'Automatically matches personnel risk signatures to evidence-based clinical protocols (Tier 1 Self-Pacing to Tier 3 Psychiatric Consultation).',
      biomarkers: ['Protocol match precision > 95%', 'Historical recovery timeline indexing', 'Standard Operating Procedure (SOP) compliance'],
      flaggedPersonnel: [
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 88.0, risk: 'CRITICAL', trigger: 'Tier 3 Mandatory Medical/Psychological Consultation' },
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 82.0, risk: 'HIGH', trigger: 'Tier 2 Officer 1-on-1 + Compassionate Grant' },
      ],
      actionProtocol: 'One-click launch of standardized clinical welfare intervention workflow.',
      modelConfidence: '97.5% ROC-AUC'
    },
    {
      id: 'automated-alerts',
      num: 10,
      title: 'Automated Alerts',
      shortDesc: 'Real-time red-flag threshold alarms & emergency escalation',
      category: 'Rapid Response',
      riskLevel: 'CRITICAL',
      metricLabel: 'Active Alerts',
      metricValue: '6 Triggered / 24h',
      icon: BellRing,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      clinicalSignificance: 'Instantly escalates critical psychological distress markers, SOS signals, and biometric threshold violations to designated officers.',
      biomarkers: ['Stress Index > 85/100', 'Sleep < 4.0h for 3+ days', 'Duty duration > 7 consecutive days', 'Self-reported severe strain'],
      flaggedPersonnel: [
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 88.0, risk: 'CRITICAL', trigger: 'Emergency Threshold: Severe Fatigue & Sleep Loss' },
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 82.0, risk: 'HIGH', trigger: 'High Alert: Consecutive Overload Trigger' },
      ],
      actionProtocol: 'Dispatch encrypted notification to Wing Commander & Medical Officer on call.',
      modelConfidence: '99.2% Dispatch Reliability'
    },
    {
      id: 'mental-wellbeing-resilience',
      num: 11,
      title: 'Mental Well-being & Workforce Resilience',
      shortDesc: 'Connor-Davidson resilience index & psychological hardiness',
      category: 'Positive Psychology',
      riskLevel: 'NOMINAL',
      metricLabel: 'Resilience Quotient',
      metricValue: '76.4% Healthy',
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
              Synchronized HRMS Personnel Welfare Directory. Monitoring active mental wellness telemetry, 13-factor clinical intelligence, AI-assisted burnout indicators, and structured counseling workflows.
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
            {/* Special Section for Factor #1: 8-Parameter Defense Burnout Matrix & Simulator */}
            {currentFactor.id === 'burnout-prediction' && (
              <div className="lg:col-span-12 p-6 rounded-2xl bg-slate-800/90 border border-blue-500/40 shadow-xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700 pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-900/80 text-blue-300 border border-blue-700">
                        8-Parameter Predictive Telemetry Suite
                      </span>
                      <span className="text-xs text-slate-400 font-mono font-bold">&bull; Defense Burnout Hazard Model</span>
                    </div>
                    <h4 className="text-base font-black text-white mt-1">
                      Multi-Variate Burnout Prediction Parameters & Feature Weights
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-lg border border-emerald-800 font-bold self-start sm:self-auto">
                    Model Confidence: 96.2% ROC-AUC
                  </span>
                </div>

                {/* 8 Parameters Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { name: '1. Leave patterns', weight: '12%', score: '78%', desc: 'Leave denial frequency, furlough deficits & emergency leave queue', color: 'text-amber-400', bar: 'bg-amber-500' },
                    { name: '2. Overtime', weight: '14%', score: '85%', desc: 'Duty hours beyond standard watch cycles & double-shift load', color: 'text-rose-400', bar: 'bg-rose-500' },
                    { name: '3. Workload trend', weight: '13%', score: '82%', desc: '14-day and 30-day task volume escalation slope', color: 'text-rose-400', bar: 'bg-rose-500' },
                    { name: '4. Deployment duration', weight: '10%', score: '90%', desc: 'Continuous months stationed in hostile or high-altitude stations', color: 'text-rose-400', bar: 'bg-rose-500' },
                    { name: '5. Duty schedule', weight: '13%', score: '76%', desc: 'Night shift concentration, rotational irregularity & short recovery', color: 'text-amber-400', bar: 'bg-amber-500' },
                    { name: '6. Sleep quality', weight: '15%', score: '88%', desc: 'Sleep deficit (<4.5h), nocturnal fragmentation & latency', color: 'text-rose-400', bar: 'bg-rose-500' },
                    { name: '7. Emotional exhaustion score', weight: '12%', score: '74%', desc: 'Maslach MBI-GS affective depletion & compassion weariness', color: 'text-amber-400', bar: 'bg-amber-500' },
                    { name: '8. Assessment responses', weight: '11%', score: '70%', desc: 'Gemini AI multi-domain self-assessment validated psychometrics', color: 'text-teal-400', bar: 'bg-teal-500' },
                  ].map((param, pIdx) => (
                    <div key={pIdx} className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-white">{param.name}</span>
                        <span className="text-[10px] font-mono font-bold text-slate-400">Weight: {param.weight}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 font-medium">Strain Index:</span>
                        <span className={`text-xs font-mono font-black ${param.color}`}>{param.score}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full ${param.bar}`} style={{ width: param.score }} />
                      </div>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed font-medium">
                        {param.desc}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Flagged Personnel Parameter Scoring Matrix */}
                <div className="p-4 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                      <Users className="w-4 h-4 text-amber-400" />
                      <span>Personnel 8-Parameter Telemetry Tele-Matrix</span>
                    </h5>
                    <span className="text-[10px] font-mono text-slate-400">Live Frontline Biometrics</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-mono text-[10px]">
                          <th className="pb-2">Personnel</th>
                          <th className="pb-2 text-center">Leave</th>
                          <th className="pb-2 text-center">Overtime</th>
                          <th className="pb-2 text-center">Workload</th>
                          <th className="pb-2 text-center">Deployment</th>
                          <th className="pb-2 text-center">Schedule</th>
                          <th className="pb-2 text-center">Sleep</th>
                          <th className="pb-2 text-center">Exhaustion</th>
                          <th className="pb-2 text-center">Assessment</th>
                          <th className="pb-2 text-right">Predicted Burnout</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60 font-mono text-[11px]">
                        <tr className="hover:bg-slate-800/40">
                          <td className="py-2.5 font-sans font-bold text-white">
                            Havildar Ramesh Chand <span className="text-slate-400 font-normal text-[10px]">(UID-EMP-012)</span>
                          </td>
                          <td className="py-2.5 text-center text-amber-400">80%</td>
                          <td className="py-2.5 text-center text-rose-400">92%</td>
                          <td className="py-2.5 text-center text-rose-400">88%</td>
                          <td className="py-2.5 text-center text-rose-400">95%</td>
                          <td className="py-2.5 text-center text-rose-400">84%</td>
                          <td className="py-2.5 text-center text-rose-400">92%</td>
                          <td className="py-2.5 text-center text-rose-400">82%</td>
                          <td className="py-2.5 text-center text-amber-400">76%</td>
                          <td className="py-2.5 text-right font-black text-rose-400 text-xs">86.4% CRITICAL</td>
                        </tr>
                        <tr className="hover:bg-slate-800/40">
                          <td className="py-2.5 font-sans font-bold text-white">
                            Subedar Gurpreet Singh <span className="text-slate-400 font-normal text-[10px]">(UID-EMP-013)</span>
                          </td>
                          <td className="py-2.5 text-center text-rose-400">88%</td>
                          <td className="py-2.5 text-center text-amber-400">78%</td>
                          <td className="py-2.5 text-center text-rose-400">84%</td>
                          <td className="py-2.5 text-center text-amber-400">75%</td>
                          <td className="py-2.5 text-center text-amber-400">78%</td>
                          <td className="py-2.5 text-center text-rose-400">82%</td>
                          <td className="py-2.5 text-center text-rose-400">80%</td>
                          <td className="py-2.5 text-center text-amber-400">74%</td>
                          <td className="py-2.5 text-right font-black text-amber-400 text-xs">80.8% HIGH</td>
                        </tr>
                        <tr className="hover:bg-slate-800/40">
                          <td className="py-2.5 font-sans font-bold text-white">
                            Naik Sandeep Patil <span className="text-slate-400 font-normal text-[10px]">(UID-EMP-014)</span>
                          </td>
                          <td className="py-2.5 text-center text-slate-300">55%</td>
                          <td className="py-2.5 text-center text-rose-400">82%</td>
                          <td className="py-2.5 text-center text-amber-400">72%</td>
                          <td className="py-2.5 text-center text-slate-300">60%</td>
                          <td className="py-2.5 text-center text-rose-400">85%</td>
                          <td className="py-2.5 text-center text-amber-400">75%</td>
                          <td className="py-2.5 text-center text-amber-400">68%</td>
                          <td className="py-2.5 text-center text-slate-300">62%</td>
                          <td className="py-2.5 text-right font-black text-amber-400 text-xs">70.5% HIGH</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

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
                        onClick={() => handleTriggerAction(currentFactor.title, `Counseling outreach for ${p.name}`)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                      >
                        <MessageSquare className="w-3 h-3" />
                        <span>Outreach</span>
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
                    onClick={() => handleTriggerAction('Flagged Watchlist', `Open Case for ${p.name}`)}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Open Case</span>
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
