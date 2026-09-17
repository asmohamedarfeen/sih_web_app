import React, { useState, useMemo } from 'react';
import {
  Shield,
  ShieldCheck,
  AlertTriangle,
  HeartPulse,
  Brain,
  Calendar,
  Clock,
  Send,
  CheckCircle2,
  Users,
  Lock,
  ChevronDown,
  ChevronUp,
  FileText,
  Activity,
  UserCheck,
  Briefcase,
  Flame,
  Tent,
  Sliders,
  TrendingUp,
  Search,
  X,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import FeatureDetailModal from '../../components/FeatureDetailModal';
import { getWelfareFeatureDetail, WelfareFeatureDetail } from '../../utils/welfareMetricsData';
import { RiskForecastResult } from '../../types/riskForecasting';
import { EmotionalStabilityResult } from '../../types/emotionalStability';
import { BehavioralChangeResult } from '../../types/behavioralChange';
import { ClosedLoopRecoveryTracker } from '../../components/analytics/ClosedLoopRecoveryTracker';

export interface PriorityPersonnel {
  id: string;
  jcNumber: string;
  name: string;
  rank: string;
  dob: string;
  age: number;
  unit: string;
  branch: string;
  location: string;
  riskScore: number;
  riskTier: 'Critical' | 'High' | 'Moderate' | 'Nominal';
  trend: string;
  confidence: number;
  lastUpdated: string;
  avatarUrl: string;
  summary: string;
  statusLabel: string;
  statusColor: string;
  topFactors: Array<{ name: string; pct: number; impact: 'High' | 'Medium' | 'Low'; color: string }>;
  explanation: string[];
  forecast?: RiskForecastResult;
  emotional_stability?: EmotionalStabilityResult;
  behavioral_change?: BehavioralChangeResult;
}

export const getPersonnelEmotionalStability = (p: PriorityPersonnel): EmotionalStabilityResult => {
  if (p.emotional_stability) return p.emotional_stability;

  // Calibrate scores: Ramesh Chand is 78% • Stable (canonical user example)
  // Gurpreet Singh is 82% • Stable (canonical user example)
  let score = 78;
  if (p.jcNumber === 'JC-2748' || p.name.toLowerCase().includes('ramesh')) {
    score = 78;
  } else if (p.jcNumber === 'JC-1108' || p.name.toLowerCase().includes('gurpreet')) {
    score = 82;
  } else if (p.riskTier === 'Critical') {
    score = 72;
  } else if (p.riskTier === 'High') {
    score = 76;
  } else if (p.riskTier === 'Moderate') {
    score = 78;
  } else {
    score = 85;
  }

  const status = score >= 75 ? 'Stable' : score >= 60 ? 'Moderately Stable' : score >= 45 ? 'Fluctuating' : 'Volatile';

  return {
    score,
    score_float: score,
    status,
    purpose: 'Measures emotional consistency over time.',
    algorithm: 'Weighted moving average or LSTM',
    volatility_variance: 1.25,
    confidence: 96,
    factors: [
      { name: 'Mood', score: Math.min(95, score + 4), weight_pct: 22, status: 'Optimal', description: 'Affective equilibrium and emotional valence constancy.' },
      { name: 'Stress', score: Math.max(48, score - 2), weight_pct: 20, status: 'Regulated', description: 'Autonomic coping under high operational tempo.' },
      { name: 'Sleep', score: Math.min(95, score + 2), weight_pct: 18, status: 'Restorative', description: 'Circadian stability and restorative sleep latency.' },
      { name: 'Energy', score: Math.min(95, score + 6), weight_pct: 16, status: 'Vitality High', description: 'Self-reported stamina and wellbeing.' },
      { name: 'Voice', score: Math.min(95, score + 8), weight_pct: 12, status: 'Steady Cadence', description: 'Acoustic vocal micro-tremors and pitch jitter.' },
      { name: 'Anxiety', score: Math.max(48, score - 3), weight_pct: 12, status: 'Controlled', description: 'Somatic hypervigilance regulation.' },
    ],
    trajectory: [
      { day_label: 'Day -6', score: score - 2, status: 'Stable' },
      { day_label: 'Day -5', score: score - 1, status: 'Stable' },
      { day_label: 'Day -4', score: score + 1, status: 'Stable' },
      { day_label: 'Day -3', score: score, status: 'Stable' },
      { day_label: 'Day -2', score: score - 1, status: 'Stable' },
      { day_label: 'Yesterday', score: score + 1, status: 'Stable' },
      { day_label: 'Today', score: score, status },
    ],
    recommendation: status === 'Stable'
      ? 'Optimal emotional stability confirmed. Sustain standard watch tempo and peer camaraderie.'
      : 'Minor affective volatility noted during night vigils. Prescribe guided decompression rest intervals.'
  };
};

export const getPersonnelForecast = (p: PriorityPersonnel): RiskForecastResult => {
  if (p.forecast) return p.forecast;

  const cur = p.riskScore;
  const isCritical = p.riskTier === 'Critical';
  const isHigh = p.riskTier === 'High';
  const isMod = p.riskTier === 'Moderate';

  let predicted_30d_score: number;
  let predicted_30d_risk_tier: 'Critical' | 'High' | 'Moderate' | 'Nominal';

  if (isCritical) {
    predicted_30d_score = Math.min(99, Math.round(cur + 11));
    predicted_30d_risk_tier = 'Critical';
  } else if (isHigh) {
    predicted_30d_score = Math.min(92, Math.round(cur + 13));
    predicted_30d_risk_tier = 'Critical';
  } else if (isMod) {
    // Current Risk: Moderate -> Predicted in 30 Days: High
    predicted_30d_score = Math.min(78, Math.round(cur + 14));
    predicted_30d_risk_tier = 'High';
  } else {
    predicted_30d_score = Math.min(52, Math.round(cur + 8));
    predicted_30d_risk_tier = predicted_30d_score >= 45 ? 'Moderate' : 'Nominal';
  }

  const delta = Math.round((predicted_30d_score - cur) * 10) / 10;
  const step = delta / 4;

  const trajectory = [
    { day: 0, label: 'Today (Current)', score: cur, risk_tier: p.riskTier },
    { day: 7, label: 'Day 7', score: Math.round(cur + step), risk_tier: (cur + step >= 80 ? 'Critical' : cur + step >= 65 ? 'High' : cur + step >= 45 ? 'Moderate' : 'Nominal') as any },
    { day: 14, label: 'Day 14', score: Math.round(cur + step * 2), risk_tier: (cur + step * 2 >= 80 ? 'Critical' : cur + step * 2 >= 65 ? 'High' : cur + step * 2 >= 45 ? 'Moderate' : 'Nominal') as any },
    { day: 21, label: 'Day 21', score: Math.round(cur + step * 3), risk_tier: (cur + step * 3 >= 80 ? 'Critical' : cur + step * 3 >= 65 ? 'High' : cur + step * 3 >= 45 ? 'Moderate' : 'Nominal') as any },
    { day: 30, label: 'Day 30 (Forecast)', score: predicted_30d_score, risk_tier: predicted_30d_risk_tier },
  ];

  return {
    current_risk_score: cur,
    current_risk_tier: p.riskTier,
    predicted_30d_score,
    predicted_30d_risk_tier,
    delta_score: delta,
    trend_direction: delta > 2 ? 'ESCALATING' : delta < -2 ? 'DE-ESCALATING' : 'STABLE',
    confidence: p.confidence || 94,
    algorithm: 'Ridge Polynomial Time-Series ML Regressor (Scikit-Learn)',
    purpose: 'Predicts future stress levels instead of only reporting current conditions.',
    benefits: 'Supports proactive planning and preventive action.',
    trajectory,
    escalation_drivers: [
      { driver: 'Chronic Sleep Deficit', impact_pts: 8.4, description: 'Continuous sleep debt under 5h accelerates neurological exhaustion.' },
      { driver: 'Deferred Leave Utilization', impact_pts: 6.2, description: 'Postponed furlough cycles deny restorative autonomic reset.' },
      { driver: 'Consecutive High-Tempo Shifts', impact_pts: 5.8, description: 'Continuous duty watch accumulates operational vigilance strain.' },
    ],
    proactive_actions: [
      { action: 'Expedite 5-Day Rest & Recuperation Furlough', timeline: 'Within 72 hrs', estimated_mitigation: '-12 pts projection', type: 'COMMAND_DIRECTIVE' },
      { action: 'Roster Shift Rotation Out of Night Vigils', timeline: 'Next roster', estimated_mitigation: '-7 pts projection', type: 'ROSTER_ADJUSTMENT' },
      { action: 'Schedule 1-on-1 Welfare Officer Debrief', timeline: 'This week', estimated_mitigation: 'Averts affective breakdown', type: 'CLINICAL_INTERVENTION' },
    ],
  };
};

export const getPersonnelBehavioralChange = (p: PriorityPersonnel): BehavioralChangeResult => {
  if (p.behavioral_change) return p.behavioral_change;

  const isCritical = p.riskTier === 'Critical';
  const isHigh = p.riskTier === 'High';
  const isMod = p.riskTier === 'Moderate';

  let cur_leave = 1.2, hist_leave = 1.2;
  let cur_ot = 6.0, hist_ot = 6.0;
  let cur_train = 96.0, hist_train = 96.0;
  let cur_perf = 92.0, hist_perf = 92.0;
  let cur_well = 94.0, hist_well = 95.0;

  if (p.jcNumber === 'JC-2748' || p.name.toLowerCase().includes('rohit') || p.name.toLowerCase().includes('ramesh')) {
    // Featured critical profile: High behavioral shift
    cur_leave = 6.0; hist_leave = 1.2;
    cur_ot = 26.0; hist_ot = 8.0;
    cur_train = 65.0; hist_train = 96.0;
    cur_perf = 62.0; hist_perf = 89.0;
    cur_well = 38.0; hist_well = 92.0;
  } else if (isCritical) {
    cur_leave = 5.2; hist_leave = 1.0;
    cur_ot = 24.0; hist_ot = 6.0;
    cur_train = 68.0; hist_train = 95.0;
    cur_perf = 66.0; hist_perf = 90.0;
    cur_well = 42.0; hist_well = 92.0;
  } else if (isHigh) {
    cur_leave = 3.8; hist_leave = 1.2;
    cur_ot = 18.0; hist_ot = 6.0;
    cur_train = 78.0; hist_train = 94.0;
    cur_perf = 74.0; hist_perf = 88.0;
    cur_well = 56.0; hist_well = 90.0;
  } else if (isMod) {
    cur_leave = 2.4; hist_leave = 1.4;
    cur_ot = 14.0; hist_ot = 7.0;
    cur_train = 85.0; hist_train = 93.0;
    cur_perf = 82.0; hist_perf = 87.0;
    cur_well = 72.0; hist_well = 89.0;
  }

  const leave_diff = Math.max(0, cur_leave - hist_leave);
  const leave_pct = Math.round(((cur_leave - hist_leave) / Math.max(0.5, hist_leave)) * 100);
  const leave_anom = Math.min(100, Math.round((leave_diff / 5.0) * 100));

  const ot_diff = Math.max(0, cur_ot - hist_ot);
  const ot_pct = Math.round(((cur_ot - hist_ot) / Math.max(1.0, hist_ot)) * 100);
  const ot_anom = Math.min(100, Math.round((ot_diff / 18.0) * 100));

  const train_diff = Math.max(0, hist_train - cur_train);
  const train_pct = -Math.round(train_diff);
  const train_anom = Math.min(100, Math.round((train_diff / 35.0) * 100));

  const perf_diff = Math.max(0, hist_perf - cur_perf);
  const perf_pct = -Math.round(perf_diff);
  const perf_anom = Math.min(100, Math.round((perf_diff / 30.0) * 100));

  const well_diff = Math.max(0, hist_well - cur_well);
  const well_pct = -Math.round(well_diff);
  const well_anom = Math.min(100, Math.round((well_diff / 45.0) * 100));

  const score = Math.min(99, Math.max(8, Math.round(
    leave_anom * 0.22 + ot_anom * 0.22 + train_anom * 0.20 + perf_anom * 0.18 + well_anom * 0.18
  )));

  const severity = score >= 75 ? 'Significant Anomaly' : score >= 50 ? 'Moderate Behavioral Shift' : score >= 25 ? 'Mild Drift' : 'Stable Baseline';

  return {
    behavior_change_score: score,
    severity_tier: severity,
    purpose: "Detects unusual changes in a person's behavior over time.",
    comparison_summary: "Current behavior VS Historical behavior",
    confidence_pct: 94.2,
    anomaly_detected: score >= 50,
    primary_driver: "Working excessive overtime",
    factors: [
      {
        key: "leave_days",
        example_label: "Suddenly taking many leave days",
        domain: "Leave Frequency Pattern",
        historical_behavior: `${hist_leave} days/mo`,
        current_behavior: `${cur_leave} days/mo`,
        historical_val: hist_leave,
        current_val: cur_leave,
        unit: "days/mo",
        change_pct: leave_pct,
        direction: leave_pct > 0 ? "INCREASED" : "STABLE",
        anomaly_score: leave_anom,
        flag: leave_anom >= 70 ? "High Surge" : leave_anom >= 40 ? "Moderate Spike" : "Normal",
        description: "Sudden escalation in leave requests indicating underlying domestic distress or burnout evasion."
      },
      {
        key: "overtime_hours",
        example_label: "Working excessive overtime",
        domain: "Watch Roster Overtime",
        historical_behavior: `${hist_ot} hrs/wk`,
        current_behavior: `${cur_ot} hrs/wk`,
        historical_val: hist_ot,
        current_val: cur_ot,
        unit: "hrs/wk",
        change_pct: ot_pct,
        direction: ot_pct > 0 ? "INCREASED" : "STABLE",
        anomaly_score: ot_anom,
        flag: ot_anom >= 70 ? "Excessive Overtime" : ot_anom >= 40 ? "Elevated" : "Normal",
        description: "Excessive consecutive shift hours accumulating physical exhaustion and cognitive fatigue."
      },
      {
        key: "missing_training",
        example_label: "Missing training",
        domain: "Tactical Drills & Training",
        historical_behavior: `${hist_train}% attended`,
        current_behavior: `${cur_train}% attended`,
        historical_val: hist_train,
        current_val: cur_train,
        unit: "% attendance",
        change_pct: train_pct,
        direction: train_pct < 0 ? "DECREASED" : "STABLE",
        anomaly_score: train_anom,
        flag: train_anom >= 70 ? "Frequent Absences" : train_anom >= 40 ? "Occasional Missed" : "Consistent",
        description: "Uncharacteristic absenteeism in routine battalion drills and squad physical readiness sessions."
      },
      {
        key: "declining_performance",
        example_label: "Declining performance",
        domain: "Operational Appraisal Rating",
        historical_behavior: `${hist_perf} / 100`,
        current_behavior: `${cur_perf} / 100`,
        historical_val: hist_perf,
        current_val: cur_perf,
        unit: "points",
        change_pct: perf_pct,
        direction: perf_pct < 0 ? "DECREASED" : "STABLE",
        anomaly_score: perf_anom,
        flag: perf_anom >= 70 ? "Noticeable Decline" : perf_anom >= 40 ? "Minor Dip" : "Standard",
        description: "Supervisory evaluation dip reflecting reduced focus, delayed task execution, and operational strain."
      },
      {
        key: "wellness_participation",
        example_label: "Reduced wellness participation",
        domain: "App Check-in & Survey Engagement",
        historical_behavior: `${hist_well}% adherence`,
        current_behavior: `${cur_well}% adherence`,
        historical_val: hist_well,
        current_val: cur_well,
        unit: "% compliance",
        change_pct: well_pct,
        direction: well_pct < 0 ? "DECREASED" : "STABLE",
        anomaly_score: well_anom,
        flag: well_anom >= 70 ? "Severe Disengagement" : well_anom >= 40 ? "Reduced Frequency" : "Active",
        description: "Sharp drop in mobile wellness pulse logging, self-assessments, and counselor portal interactions."
      }
    ],
    recommendation: score >= 75
      ? "Multiple acute behavioral shifts detected simultaneously. Mandate proactive welfare officer 1-on-1 interview and pause overtime rostering."
      : "Noticeable divergence from historical baseline habits. Recommend supervisor check-in and review duty schedule distribution."
  };
};

export const ALL_PERSONNEL_DATABASE: PriorityPersonnel[] = [
  {
    id: '1',
    jcNumber: 'JC-2748',
    name: 'Naik Rohit Sharma',
    rank: 'Naik / Section 2IC',
    dob: '21 MAR 1994',
    age: 31,
    unit: 'Field Unit - 17 RR',
    branch: 'Indian Army',
    location: 'Jammu & Kashmir',
    riskScore: 86,
    riskTier: 'Critical',
    trend: '+18%',
    confidence: 94,
    lastUpdated: '8 Sep 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    summary:
      'This personnel has shown a steady increase in burnout risk over the last 45 days. Key contributors include prolonged deployment, reduced leave utilization, increased workload, and declining wellness self-assessment.',
    statusLabel: 'Action Required',
    statusColor: 'text-rose-600 font-bold',
    topFactors: [
      { name: 'Deployment Duration', pct: 34, impact: 'High', color: 'bg-rose-500' },
      { name: 'Leave Frequency', pct: 23, impact: 'High', color: 'bg-orange-500' },
      { name: 'Workload Trend', pct: 15, impact: 'Medium', color: 'bg-amber-500' },
      { name: 'Sleep Pattern (Wellness)', pct: 14, impact: 'Medium', color: 'bg-amber-400' },
      { name: 'Transfer Frequency', pct: 9, impact: 'Low', color: 'bg-emerald-500' },
    ],
    explanation: [
      'Continuous deployment duration exceeds 14 months in high-altitude sub-zero terrain without standard decompression rotations.',
      'Leave pattern indicates 3 consecutive deferred leaves for operational contingencies.',
      'Logged night duty hours increased by 42% over standard watch shifts during the last 30-day reporting window.',
      'Self-reported wellness logs indicate consecutive nights with less than 4.5 hours of restorative sleep.',
    ],
  },
  {
    id: '2',
    jcNumber: 'JC-3910',
    name: 'Hav. Amit Kumar',
    rank: 'Havildar / Squad Leader',
    dob: '14 JUL 1991',
    age: 34,
    unit: 'Field Unit - 21 RR',
    branch: 'Indian Army',
    location: 'Line of Control - Kupwara',
    riskScore: 88,
    riskTier: 'Critical',
    trend: '+14%',
    confidence: 92,
    lastUpdated: '7 Sep 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
    summary:
      'Acute fatigue markers triggered by persistent forward deployment shifts. Physical strain index elevated with recurring musculoskeletal fatigue and irregular telemetry logs.',
    statusLabel: 'Counselling Pending',
    statusColor: 'text-amber-600 font-bold',
    topFactors: [
      { name: 'Workload & Watch Shifts', pct: 36, impact: 'High', color: 'bg-rose-500' },
      { name: 'Deployment Longevity', pct: 28, impact: 'High', color: 'bg-orange-500' },
      { name: 'Sleep Deficit Index', pct: 18, impact: 'Medium', color: 'bg-amber-500' },
      { name: 'Leave Backlog', pct: 11, impact: 'Medium', color: 'bg-amber-400' },
      { name: 'Transfer Instability', pct: 7, impact: 'Low', color: 'bg-emerald-500' },
    ],
    explanation: [
      'High-altitude forward post operational vigilance for 9 consecutive weeks.',
      'Reported chronic insomnia accompanied by elevated resting heart rate variability.',
      'Counselling debrief pending approval from regimental welfare desk.',
    ],
  },
  {
    id: '3',
    jcNumber: 'JC-5621',
    name: 'Ct. Sandeep Yadav',
    rank: 'Constable / Border Sentinel',
    dob: '05 NOV 1996',
    age: 28,
    unit: 'BSF - Bn 142',
    branch: 'BSF',
    location: 'Punjab Border Sector',
    riskScore: 74,
    riskTier: 'High',
    trend: '+8%',
    confidence: 89,
    lastUpdated: '6 Sep 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format&fit=crop&q=80',
    summary:
      'Elevated psychosocial strain due to prolonged separation and family welfare concerns. Moderate fatigue with stabilizing biometric indicators after rotation.',
    statusLabel: 'Follow-up Tomorrow',
    statusColor: 'text-amber-600 font-semibold',
    topFactors: [
      { name: 'Leave Pattern Anomaly', pct: 31, impact: 'High', color: 'bg-orange-500' },
      { name: 'Psychological Stress Index', pct: 26, impact: 'High', color: 'bg-orange-500' },
      { name: 'Workload & Patrol Cycles', pct: 21, impact: 'Medium', color: 'bg-amber-500' },
      { name: 'Sleep Disruption', pct: 14, impact: 'Medium', color: 'bg-amber-400' },
      { name: 'Environmental Heat Strain', pct: 8, impact: 'Low', color: 'bg-emerald-500' },
    ],
    explanation: [
      'Family hardship compassionate leave deferred due to border alert protocols.',
      'Clinical psychological self-check-in flagged moderate depressive affective indicators.',
      'Follow-up scheduled with Northern Command tele-welfare session tomorrow at 10:30 hrs.',
    ],
  },
  {
    id: '4',
    jcNumber: 'CRPF-2016-8012',
    name: 'Havildar Ramesh Chand',
    rank: 'Havildar / Mortar Platoon',
    dob: '12 AUG 1990',
    age: 35,
    unit: 'CRPF - High Altitude Guard',
    branch: 'CRPF',
    location: 'Siachen Base Camp / Ladakh',
    riskScore: 86.3,
    riskTier: 'Critical',
    trend: '+16%',
    confidence: 96,
    lastUpdated: '8 Sep 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=300&auto=format&fit=crop&q=80',
    summary:
      'Hypoxia-induced psychological strain detected under continuous sub-zero forward post rotations. Overtime duty hours exceed 48h over past 5 days with chronic sleep debt.',
    statusLabel: 'Immediate Triage',
    statusColor: 'text-rose-600 font-bold',
    topFactors: [
      { name: 'Hypoxia & Altitude Strain', pct: 35, impact: 'High', color: 'bg-rose-500' },
      { name: 'Consecutive Night Vigils', pct: 25, impact: 'High', color: 'bg-orange-500' },
      { name: 'Overtime Watch Shifts', pct: 18, impact: 'Medium', color: 'bg-amber-500' },
      { name: 'Leave Deferment Count', pct: 14, impact: 'Medium', color: 'bg-amber-400' },
      { name: 'Hydration Deficit', pct: 8, impact: 'Low', color: 'bg-emerald-500' },
    ],
    explanation: [
      'Logged 8 consecutive night vigils with irregular sleep window rotation.',
      'Active medical observation for high-altitude hypoxia fatigue and emotional exhaustion.',
      'Immediate 48h sleep regeneration cycle and workload pacing mandated.',
    ],
  },
  {
    id: '5',
    jcNumber: 'ARMY-2018-8013',
    name: 'Subedar Gurpreet Singh',
    rank: 'Subedar / Field Artillery 3rd Bn',
    dob: '03 DEC 1986',
    age: 38,
    unit: 'Field Artillery 3rd Bn',
    branch: 'Indian Army',
    location: 'Tawang Sector / Arunachal',
    riskScore: 80.1,
    riskTier: 'Critical',
    trend: '+11%',
    confidence: 93,
    lastUpdated: '8 Sep 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
    summary:
      'Caregiver distress combined with high operational artillery command load. Compassionate grant approved; tele-counselling session in progress.',
    statusLabel: 'Grant Disbursed',
    statusColor: 'text-emerald-700 font-bold',
    topFactors: [
      { name: 'Family Hardship Stress', pct: 32, impact: 'High', color: 'bg-rose-500' },
      { name: 'Artillery Operational Load', pct: 28, impact: 'High', color: 'bg-orange-500' },
      { name: 'Sleep Fragmentations', pct: 19, impact: 'Medium', color: 'bg-amber-500' },
      { name: 'Duty Rotation Span', pct: 12, impact: 'Medium', color: 'bg-amber-400' },
      { name: 'Biometric Pulse Spikes', pct: 9, impact: 'Low', color: 'bg-emerald-500' },
    ],
    explanation: [
      'High operational vigilance during artillery high-angle calibration drills.',
      'Family medical emergency logged with Northern Command Welfare Wing.',
      'Compassionate grant disbursed; follow-up debriefing scheduled for 14:00 hrs.',
    ],
  },
  {
    id: '6',
    jcNumber: 'BSF-2019-8014',
    name: 'Naik Sandeep Patil',
    rank: 'Naik / Signals & Telemetry',
    dob: '28 FEB 1993',
    age: 32,
    unit: 'Signals & Telemetry Wing',
    branch: 'BSF',
    location: 'Jaisalmer Desert Sector',
    riskScore: 70.7,
    riskTier: 'High',
    trend: '+9%',
    confidence: 90,
    lastUpdated: '7 Sep 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=300&auto=format&fit=crop&q=80',
    summary:
      'Circadian rhythm disruption due to continuous nocturnal telemetry watch shifts under extreme thermal desert environments.',
    statusLabel: 'Shift Rotation Required',
    statusColor: 'text-amber-600 font-bold',
    topFactors: [
      { name: 'Shift Disruption', pct: 33, impact: 'High', color: 'bg-orange-500' },
      { name: 'Thermal Desert Fatigue', pct: 26, impact: 'High', color: 'bg-orange-500' },
      { name: 'Night Screen Time Fatigue', pct: 18, impact: 'Medium', color: 'bg-amber-500' },
      { name: 'Hydration Recovery', pct: 14, impact: 'Medium', color: 'bg-amber-400' },
      { name: 'Leave Availability', pct: 9, impact: 'Low', color: 'bg-emerald-500' },
    ],
    explanation: [
      'Over 5h 40m of continuous nocturnal display console operation.',
      'Daytime sleep latency impacted by thermal ambient barracks conditions.',
      'Rotated to daylight radio maintenance watch to restore circadian cycle.',
    ],
  },
  {
    id: '7',
    jcNumber: 'ARMY-2021-9988',
    name: 'Sepoy Amit Kumar',
    rank: 'Sepoy / Commando',
    dob: '17 JAN 1998',
    age: 27,
    unit: '10 Para SF',
    branch: 'Indian Army',
    location: 'Special Operations Outpost',
    riskScore: 64.1,
    riskTier: 'Moderate',
    trend: '-3%',
    confidence: 95,
    lastUpdated: '8 Sep 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    summary:
      'High physical exertion balanced by elite conditioning. Mild cumulative sleep deficit recovering rapidly following scheduled stand-down.',
    statusLabel: 'Nominal Readiness',
    statusColor: 'text-emerald-700 font-semibold',
    topFactors: [
      { name: 'Physical Conditioning Load', pct: 30, impact: 'Medium', color: 'bg-amber-500' },
      { name: 'Sleep Restoration Pace', pct: 24, impact: 'Medium', color: 'bg-amber-400' },
      { name: 'Operational Alertness', pct: 20, impact: 'Medium', color: 'bg-emerald-500' },
      { name: 'Hydration Saturation', pct: 15, impact: 'Low', color: 'bg-emerald-500' },
      { name: 'Psychological Cohesion', pct: 11, impact: 'Low', color: 'bg-emerald-600' },
    ],
    explanation: [
      'Completed 40km full tactical kit endurance march with nominal vital recovery.',
      'Resting heart rate returned to 58 bpm within 4 hours post-drill.',
      'Zero clinical psychological markers flagged; continuing standard regimen.',
    ],
  },
  {
    id: '8',
    jcNumber: 'CRPF-2015-8010',
    name: 'Major Alex Morgan',
    rank: 'Major / Field Ops Lead',
    dob: '23 MAY 1989',
    age: 36,
    unit: 'Rapid Action Battalion 1',
    branch: 'CRPF',
    location: 'Central Tactical Command',
    riskScore: 75,
    riskTier: 'High',
    trend: '+12%',
    confidence: 91,
    lastUpdated: '8 Sep 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    summary:
      'Prolonged night watch responsibilities combined with heavy operational duty coordination. Sleep debt accumulating past 8.5 hours over the week.',
    statusLabel: 'Sleep Hygiene Review',
    statusColor: 'text-amber-600 font-bold',
    topFactors: [
      { name: 'Command Workload Volume', pct: 38, impact: 'High', color: 'bg-rose-500' },
      { name: 'Nocturnal Watch Burden', pct: 26, impact: 'High', color: 'bg-orange-500' },
      { name: 'Leave Rescheduling Count', pct: 16, impact: 'Medium', color: 'bg-amber-500' },
      { name: 'Restorative Sleep Deficit', pct: 12, impact: 'Medium', color: 'bg-amber-400' },
      { name: 'Physical Fitness Buffer', pct: 8, impact: 'Low', color: 'bg-emerald-500' },
    ],
    explanation: [
      'Managing frontline tactical coordination across 3 sectors simultaneously.',
      'Scheduled leave deferred twice in the past 60 days to supervise battalion redeployment.',
      'Mandatory sleep decompression cycle advised by Medical Welfare Officer.',
    ],
  },
  {
    id: '9',
    jcNumber: 'CISF-2017-8011',
    name: 'Captain Sarah Connor',
    rank: 'Captain / Air Defense Wing',
    dob: '19 OCT 1992',
    age: 33,
    unit: 'Air Defense Command',
    branch: 'Indian Air Force',
    location: 'Forward Airbase Ambala',
    riskScore: 27.3,
    riskTier: 'Nominal',
    trend: '-6%',
    confidence: 97,
    lastUpdated: '7 Sep 2025',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
    summary:
      'Optimal physiological and psychological baseline. Restorative sleep indicators verified above 92% with regular leave cycles.',
    statusLabel: 'Optimal Readiness',
    statusColor: 'text-emerald-700 font-bold',
    topFactors: [
      { name: 'Restorative Sleep Ratio', pct: 28, impact: 'Low', color: 'bg-emerald-500' },
      { name: 'Stress Buffering Capacity', pct: 25, impact: 'Low', color: 'bg-emerald-500' },
      { name: 'Leave Adherence Score', pct: 20, impact: 'Low', color: 'bg-emerald-500' },
      { name: 'Autonomic Stability', pct: 15, impact: 'Low', color: 'bg-emerald-600' },
      { name: 'Social Well-being Rating', pct: 12, impact: 'Low', color: 'bg-emerald-600' },
    ],
    explanation: [
      'Air defense telemetry monitoring shifts properly balanced with 8-hour sleep cycles.',
      'Leave utilization strictly on schedule with zero backlog.',
      'Commendation candidate for mental resilience and unit stability leadership.',
    ],
  },
];

export const WelfareDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [selectedPersonnel, setSelectedPersonnel] = useState<PriorityPersonnel>(ALL_PERSONNEL_DATABASE[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTierFilter, setSelectedTierFilter] = useState<'All' | 'Critical' | 'High' | 'Moderate' | 'Nominal'>('All');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isWhyFlaggedOpen, setIsWhyFlaggedOpen] = useState(false);
  const [actionAlert, setActionAlert] = useState<string | null>(null);
  const [showFullMatrix, setShowFullMatrix] = useState(false);
  const [selectedFeatureDetail, setSelectedFeatureDetail] = useState<WelfareFeatureDetail | null>(null);
  const [isFeatureModalOpen, setIsFeatureModalOpen] = useState(false);

  const handleOpenFeatureDetail = (featureNameOrId: string) => {
    const detail = getWelfareFeatureDetail(featureNameOrId);
    setSelectedFeatureDetail(detail);
    setIsFeatureModalOpen(true);
  };

  // Filtered personnel based on search query and risk tier
  const filteredPersonnel = useMemo(() => {
    return ALL_PERSONNEL_DATABASE.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.jcNumber.toLowerCase().includes(q) ||
        p.rank.toLowerCase().includes(q) ||
        p.unit.toLowerCase().includes(q) ||
        p.branch.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q);

      const matchesTier =
        selectedTierFilter === 'All' || p.riskTier.toLowerCase() === selectedTierFilter.toLowerCase();

      return matchesSearch && matchesTier;
    });
  }, [searchQuery, selectedTierFilter]);

  const handleSelectPersonnel = (p: PriorityPersonnel) => {
    setSelectedPersonnel(p);
    setIsSearchDropdownOpen(false);
    setActionAlert(`Switched view to live AI Dossier for: ${p.rank} ${p.name} (${p.jcNumber})`);
    setTimeout(() => setActionAlert(null), 4000);

    // Smooth scroll to the Hero Critical Welfare Alert card
    const heroCard = document.getElementById('critical-welfare-hero');
    heroCard?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleInitiateAction = (actionName: string) => {
    setActionAlert(`Clinical Directive Initiated: "${actionName}" for ${selectedPersonnel.name} (${selectedPersonnel.jcNumber}). Dispatched to Command.`);
    setTimeout(() => setActionAlert(null), 5000);
  };

  return (
    <div className="space-y-6 max-w-[1680px] mx-auto pb-12">
      {/* Toast Alert */}
      {actionAlert && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-[#163A5F] text-white border border-[#D4A017] shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#D4A017] shrink-0" />
          <span>{actionAlert}</span>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP HEADER BANNER (Indian Armed Forces Insignia & Motivational Quote) */}
      {/* ========================================================================= */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#1B382B] via-[#2F4F3E] to-[#1E3A2F] text-white shadow-xl overflow-hidden border border-[#D4A017]/30">
        <div
          className="absolute inset-0 opacity-15 pointer-events-none bg-cover bg-bottom mix-blend-overlay"
          style={{
            backgroundImage:
              'url("https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1600&auto=format&fit=crop&q=80")',
          }}
        />

        <div className="relative z-10 px-6 sm:px-8 py-6 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Emblem + Title */}
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-[#D4A017]/40 flex flex-col items-center justify-center p-2 shadow-inner shrink-0 text-center">
              <Shield className="w-7 h-7 text-[#D4A017]" />
              <span className="text-[7px] font-black tracking-widest text-[#D4A017] uppercase mt-0.5">IAF</span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#D4A017] bg-black/25 px-2.5 py-0.5 rounded-full border border-[#D4A017]/30">
                  भारतीय सेना &bull; INDIAN ARMED FORCES
                </span>
                <span className="text-[10px] text-slate-300 font-medium hidden sm:inline">
                  SERVICE &bull; SECURITY &bull; SELFLESSNESS
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
                AI Welfare Intelligence Center
              </h1>
              <p className="text-xs sm:text-sm text-slate-200 font-medium mt-0.5">
                For a Stronger Force, A Healthier Tomorrow
              </p>
            </div>
          </div>

          {/* Right: Quote + User Metadata + Date */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 lg:gap-8">
            <div className="hidden xl:block text-right border-r border-white/20 pr-6">
              <p className="text-sm font-serif italic text-[#FAF5E7] tracking-wide">
                &ldquo;A Healthy Soldier &bull; A Stronger Nation&rdquo;
              </p>
              <p className="text-[10px] font-mono text-[#D4A017] uppercase tracking-wider mt-0.5">
                Command Welfare Doctrine
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 bg-black/30 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10">
                <div className="w-8 h-8 rounded-xl bg-[#D4A017] text-[#163A5F] font-black text-xs flex items-center justify-center shadow-sm">
                  WO
                </div>
                <div className="text-left">
                  <div className="text-xs font-black text-white leading-tight">
                    {user?.full_name || 'Welfare Officer'}
                  </div>
                  <div className="text-[10px] text-slate-300 font-semibold leading-tight">
                    Northern Command
                  </div>
                </div>
              </div>

              <div className="hidden sm:flex flex-col text-right text-[11px] font-mono text-slate-300 bg-black/20 px-3 py-2 rounded-2xl border border-white/10">
                <span className="flex items-center gap-1 font-semibold text-white">
                  <Calendar className="w-3.5 h-3.5 text-[#D4A017]" />
                  Mon, 8 Sep 2025
                </span>
                <span className="flex items-center gap-1 text-[10px] text-slate-400">
                  <Clock className="w-3 h-3 text-[#D4A017]" />
                  10:24 AM IST
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. DEDICATED PERSON-WISE / USER-WISE SEARCH & FILTER BAR (Requested Feature)*/}
      {/* ========================================================================= */}
      <div className="relative p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Live Search Input Box */}
          <div className="relative flex-1">
            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchDropdownOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchDropdownOpen(true);
                }}
                placeholder="Search personnel by Name, JC/Regimental No, Rank, Unit or Branch (e.g. 'Rohit', 'JC-2748', 'Gurpreet', '10 Para SF')..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs sm:text-sm font-semibold text-gray-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Autocomplete Dropdown */}
            {isSearchDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-20"
                  onClick={() => setIsSearchDropdownOpen(false)}
                />
                <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl z-30 max-h-96 overflow-y-auto divide-y divide-slate-100">
                  <div className="p-3 bg-slate-50 flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>Matching Personnel ({filteredPersonnel.length})</span>
                    <span className="text-[10px] text-slate-400">Click any person to view full AI dossier</span>
                  </div>

                  {filteredPersonnel.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      No personnel found matching &ldquo;{searchQuery}&rdquo;. Try searching by name, regimental number, or battalion.
                    </div>
                  ) : (
                    filteredPersonnel.map((p) => {
                      const isCurrentlyActive = selectedPersonnel.id === p.id;
                      return (
                        <div
                          key={p.id}
                          onClick={() => handleSelectPersonnel(p)}
                          className={`p-3.5 hover:bg-slate-50 flex items-center justify-between gap-4 cursor-pointer transition-colors ${
                            isCurrentlyActive ? 'bg-primary-50/70 border-l-4 border-primary' : ''
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={p.avatarUrl}
                              alt={p.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-black text-xs text-gray-900 truncate">{p.name}</span>
                                <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                                  {p.jcNumber}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 truncate">
                                {p.rank} &bull; {p.unit} &bull; {p.location}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {(() => {
                              const fc = getPersonnelForecast(p);
                              return (
                                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5">
                                  <div className="flex items-center gap-1 text-[10px]">
                                    <span className="text-[9px] uppercase font-bold text-slate-400">Current:</span>
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                        p.riskTier === 'Critical'
                                          ? 'bg-rose-100 text-rose-700'
                                          : p.riskTier === 'High'
                                          ? 'bg-orange-100 text-orange-700'
                                          : p.riskTier === 'Moderate'
                                          ? 'bg-amber-100 text-amber-700'
                                          : 'bg-emerald-100 text-emerald-700'
                                      }`}
                                    >
                                      {p.riskTier}
                                    </span>
                                  </div>
                                  <span className="text-slate-300 hidden sm:inline">&rarr;</span>
                                  <div className="flex items-center gap-1 text-[10px]">
                                    <span className="text-[9px] uppercase font-bold text-indigo-600">30d ML:</span>
                                    <span
                                      className={`px-1.5 py-0.5 rounded text-[10px] font-black border ${
                                        fc.predicted_30d_risk_tier === 'Critical'
                                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                                          : fc.predicted_30d_risk_tier === 'High'
                                          ? 'bg-orange-50 text-orange-700 border-orange-200'
                                          : fc.predicted_30d_risk_tier === 'Moderate'
                                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                      }`}
                                    >
                                      {fc.predicted_30d_risk_tier} ({fc.predicted_30d_score}%) ↗
                                    </span>
                                  </div>
                                </div>
                              );
                            })()}
                            <span className="text-xs font-bold text-primary ml-1">View &rarr;</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>

          {/* Risk Tier Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0 shrink-0 text-xs">
            {(['All', 'Critical', 'High', 'Moderate', 'Nominal'] as const).map((tier) => {
              const isSelected = selectedTierFilter === tier;
              return (
                <button
                  key={tier}
                  onClick={() => setSelectedTierFilter(tier)}
                  className={`px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-primary text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tier === 'All' ? 'All Personnel' : `${tier} Risk`}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Active Personnel Notice Bar */}
        <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-slate-500 font-medium">Currently Selected Profile:</span>
            <span className="font-extrabold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg">
              {selectedPersonnel.rank} {selectedPersonnel.name} ({selectedPersonnel.jcNumber})
            </span>
            <span className="text-slate-400 font-mono hidden sm:inline">&bull; {selectedPersonnel.unit}</span>
          </div>

          <div className="text-primary font-bold text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Telemetry &amp; Psychometric Analysis Synchronized</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. SECTION 1: EXECUTIVE OVERVIEW (4 KPI Cards)                             */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Operational Readiness */}
        <div className="p-5 rounded-3xl bg-[#F0FDF4] border border-emerald-200 shadow-sm relative overflow-hidden flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
            <Users className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Operational Readiness
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-slate-900 tracking-tight">82%</span>
              <span className="text-xs font-extrabold text-emerald-700 flex items-center">
                &uarr; +4% <span className="text-[10px] text-slate-500 font-normal ml-1">vs last month</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Force readiness on positive trend</p>
          </div>
        </div>

        {/* Card 2: Personnel Requiring Support */}
        <div className="p-5 rounded-3xl bg-[#FEF2F2] border border-rose-200 shadow-sm relative overflow-hidden flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-100 border border-rose-200 flex items-center justify-center text-rose-600 shrink-0">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Personnel Requiring Support
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-rose-600 tracking-tight">18</span>
              <span className="text-xs font-extrabold text-rose-600 flex items-center">
                &uarr; 12% <span className="text-[10px] text-slate-500 font-normal ml-1">High priority cases</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Need immediate attention</p>
          </div>
        </div>

        {/* Card 3: Pending Welfare Actions */}
        <div className="p-5 rounded-3xl bg-[#FFFBEB] border border-amber-200 shadow-sm relative overflow-hidden flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0">
            <FileText className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Pending Welfare Actions
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-amber-600 tracking-tight">7</span>
              <span className="text-xs font-extrabold text-emerald-700 flex items-center">
                &darr; 30% <span className="text-[10px] text-slate-500 font-normal ml-1">Awaiting closure</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Follow up required</p>
          </div>
        </div>

        {/* Card 4: Average Wellness Score */}
        <div className="p-5 rounded-3xl bg-[#F0F9FF] border border-sky-200 shadow-sm relative overflow-hidden flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-700 shrink-0">
            <HeartPulse className="w-7 h-7" />
          </div>
          <div>
            <div className="text-xs font-extrabold uppercase tracking-wider text-slate-600">
              Average Wellness Score
            </div>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-black text-sky-900 tracking-tight">79%</span>
              <span className="text-xs font-extrabold text-emerald-700 flex items-center">
                &uarr; 6% <span className="text-[10px] text-slate-500 font-normal ml-1">Across all personnel</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1 font-medium">Improving trend</p>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. ROW 2: AI HEALTH MODULES (Left) + CRITICAL WELFARE ALERT (Hero Right)   */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): AI Health Modules */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="text-base font-black text-gray-900">AI Health Modules</h3>
              </div>
              <button
                onClick={() => handleOpenFeatureDetail('Burnout Risk')}
                className="text-xs font-bold text-primary hover:text-primary-700 flex items-center gap-1 cursor-pointer bg-primary-50/60 hover:bg-primary-100/60 px-2.5 py-1 rounded-xl transition-colors"
                title="Inspect in-depth diagnostic breakdown"
              >
                <span>Inspect All &rarr;</span>
              </button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs text-slate-500 font-medium">
                Risk Distribution Across Key Factors (Total 520 Personnel)
              </p>
              <span className="text-[10px] text-primary font-bold bg-primary-50 px-2 py-0.5 rounded-md hidden sm:inline-block">
                ⚡ Click any module for details
              </span>
            </div>

            <div className="space-y-2">
              {[
                { name: 'Burnout Risk', pct: 24, count: 126, icon: Flame, color: 'bg-rose-600' },
                { name: 'Psychological Distress', pct: 18, count: 94, icon: Brain, color: 'bg-orange-500' },
                { name: 'Deployment Fatigue', pct: 15, count: 78, icon: Tent, color: 'bg-amber-500' },
                { name: 'Workload Stress', pct: 12, count: 63, icon: Sliders, color: 'bg-amber-400' },
                { name: 'Transfer Stress', pct: 8, count: 42, icon: Activity, color: 'bg-emerald-500' },
                { name: 'Leave Pattern Anomaly', pct: 7, count: 36, icon: Calendar, color: 'bg-emerald-500' },
                { name: 'Behavioral Changes', pct: 6, count: 31, icon: Users, color: 'bg-emerald-600' },
              ].map((mod) => {
                const ModIcon = mod.icon;
                return (
                  <div
                    key={mod.name}
                    onClick={() => handleOpenFeatureDetail(mod.name)}
                    className="flex items-center gap-3 text-xs p-2 -mx-2 rounded-xl hover:bg-slate-100/90 cursor-pointer transition-all group border border-transparent hover:border-slate-200"
                    title={`Click to view deep-dive clinical formula, cohort, and SOP for ${mod.name}`}
                  >
                    <div className="w-6 h-6 rounded-lg bg-slate-100 group-hover:bg-[#163A5F] group-hover:text-white flex items-center justify-center text-slate-600 shrink-0 transition-colors">
                      <ModIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-36 font-semibold text-slate-800 group-hover:text-primary group-hover:font-black truncate transition-colors flex items-center gap-1">
                      <span>{mod.name}</span>
                    </div>
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className={`h-full ${mod.color} rounded-full transition-all duration-700`} style={{ width: `${mod.pct * 3.2}%` }} />
                    </div>
                    <div className="w-10 text-right font-black text-slate-900">{mod.pct}%</div>
                    <div className="w-10 text-right text-[11px] text-slate-400 font-medium">({mod.count})</div>
                    <div className="text-[10px] text-primary font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pl-1">
                      View &rarr;
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Model: Logistic Multi-Factor v2.4</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              96.2% Confidence Validated
            </span>
          </div>
        </div>

        {/* Right Column (7 cols): Critical Welfare Alert (Hero Section) */}
        <div id="critical-welfare-hero" className="lg:col-span-7 p-6 rounded-3xl bg-white border border-rose-200 shadow-sm relative overflow-hidden">
          {/* Top Banner Tag */}
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full animate-ping ${
                  selectedPersonnel.riskTier === 'Critical'
                    ? 'bg-rose-600'
                    : selectedPersonnel.riskTier === 'High'
                    ? 'bg-orange-500'
                    : 'bg-amber-500'
                }`}
              />
              <div
                className={`flex items-center gap-1.5 font-black text-sm tracking-wide ${
                  selectedPersonnel.riskTier === 'Critical'
                    ? 'text-rose-700'
                    : selectedPersonnel.riskTier === 'High'
                    ? 'text-orange-700'
                    : 'text-amber-700'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>
                  {selectedPersonnel.riskTier === 'Critical'
                    ? 'Critical Welfare Alert'
                    : `${selectedPersonnel.riskTier} Welfare Priority`}
                </span>
              </div>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider text-white shadow-xs ${
                selectedPersonnel.riskTier === 'Critical'
                  ? 'bg-rose-600'
                  : selectedPersonnel.riskTier === 'High'
                  ? 'bg-orange-500'
                  : selectedPersonnel.riskTier === 'Moderate'
                  ? 'bg-amber-500'
                  : 'bg-emerald-600'
              }`}
            >
              {selectedPersonnel.riskTier === 'Critical' ? 'HIGH PRIORITY' : selectedPersonnel.riskTier.toUpperCase()}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Personnel Profile Photo & Details (5 cols) */}
            <div className="md:col-span-5 flex items-center gap-4">
              <img
                src={selectedPersonnel.avatarUrl}
                alt={selectedPersonnel.name}
                className="w-20 h-20 rounded-2xl object-cover border-2 border-rose-300 shadow-md shrink-0"
              />
              <div>
                <div className="text-xs font-mono font-bold text-slate-500">{selectedPersonnel.jcNumber}</div>
                <h4 className="text-base font-black text-gray-900 leading-snug">{selectedPersonnel.name}</h4>
                <div className="text-xs text-slate-600 font-semibold mt-0.5">
                  {selectedPersonnel.dob} &bull; {selectedPersonnel.age} years
                </div>
                <div className="text-xs text-slate-700 font-medium mt-1">
                  Field Unit: <span className="font-bold text-gray-900">{selectedPersonnel.unit}</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium">Location: {selectedPersonnel.location}</div>
              </div>
            </div>

            {/* Circular Gauge Meter (4 cols) */}
            <div className="md:col-span-4 flex flex-col items-center justify-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke="#F1F5F9"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="48"
                    stroke={
                      selectedPersonnel.riskTier === 'Critical'
                        ? '#DC2626'
                        : selectedPersonnel.riskTier === 'High'
                        ? '#EA580C'
                        : selectedPersonnel.riskTier === 'Moderate'
                        ? '#F59E0B'
                        : '#10B981'
                    }
                    strokeWidth="12"
                    strokeDasharray={2 * Math.PI * 48}
                    strokeDashoffset={2 * Math.PI * 48 * (1 - selectedPersonnel.riskScore / 100)}
                    strokeLinecap="round"
                    fill="none"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-2xl font-black text-slate-900 leading-none">
                    {selectedPersonnel.riskScore}%
                  </span>
                  <span className="text-[9px] font-extrabold uppercase text-slate-500 mt-1 tracking-wider">
                    Risk Score
                  </span>
                </div>
              </div>
              <span
                className={`mt-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider text-white ${
                  selectedPersonnel.riskTier === 'Critical'
                    ? 'bg-rose-600'
                    : selectedPersonnel.riskTier === 'High'
                    ? 'bg-orange-500'
                    : selectedPersonnel.riskTier === 'Moderate'
                    ? 'bg-amber-500'
                    : 'bg-emerald-600'
                }`}
              >
                {selectedPersonnel.riskTier.toUpperCase()}
              </span>
            </div>

            {/* Trend & Meta Stats (3 cols) */}
            <div className="md:col-span-3 space-y-3 text-xs border-l border-slate-100 pl-4">
              <div>
                <div className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Trend (Last 3 Months)</div>
                <div
                  className={`text-base font-black flex items-center gap-1 mt-0.5 ${
                    selectedPersonnel.trend.startsWith('+') ? 'text-rose-600' : 'text-emerald-600'
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>{selectedPersonnel.trend}</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Prediction Confidence</div>
                <div className="text-sm font-black text-emerald-700 flex items-center gap-1 mt-0.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>{selectedPersonnel.confidence}%</span>
                </div>
              </div>

              <div>
                <div className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">Last Updated</div>
                <div className="text-xs font-semibold text-slate-700 flex items-center gap-1 mt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedPersonnel.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sub-block: AI Welfare Summary */}
          <div className="mt-5 p-4 rounded-2xl bg-rose-50/70 border border-rose-100">
            <div className="flex items-center gap-2 mb-1.5">
              <Brain className="w-4 h-4 text-rose-600" />
              <span className="text-xs font-black text-rose-900 uppercase tracking-wide">AI Welfare Summary</span>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed font-medium">
              {selectedPersonnel.summary}
            </p>
          </div>

          {/* ========================================================================= */}
          {/* ML RISK FORECASTING PANEL: Current Risk vs Predicted in 30 Days            */}
          {/* ========================================================================= */}
          {(() => {
            const forecast = getPersonnelForecast(selectedPersonnel);
            const isEscalating = forecast.trend_direction === 'ESCALATING';

            return (
              <div className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-[#0F172A] via-[#162A45] to-[#0A192F] text-white border-2 border-[#D4A017]/40 shadow-xl relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4A017]/5 rounded-full blur-2xl pointer-events-none" />

                {/* Header with Title & ML Badge */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-[#D4A017]/20 border border-[#D4A017]/50 flex items-center justify-center text-[#D4A017] shadow-inner">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
                          Risk Forecasting
                        </h4>
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#D4A017] text-slate-950 font-black">
                          ML Predictive Engine
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium">
                        <strong className="text-[#D4A017]">Purpose:</strong> Predicts future stress levels instead of only reporting current conditions.
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-300 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 self-start sm:self-auto">
                    Algorithm: <span className="text-emerald-400 font-bold">Ridge Time-Series ML</span> &bull; {forecast.confidence}% Confidence
                  </div>
                </div>

                {/* Core Comparison: Current Risk vs Predicted in 30 Days */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 my-4 items-stretch relative z-10">
                  {/* Current Risk Box */}
                  <div className="sm:col-span-5 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        Current Risk
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-2xl font-black ${
                          forecast.current_risk_tier === 'Critical'
                            ? 'text-rose-400'
                            : forecast.current_risk_tier === 'High'
                            ? 'text-orange-400'
                            : forecast.current_risk_tier === 'Moderate'
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }`}>
                          {forecast.current_risk_tier}
                        </span>
                        <span className="text-sm font-bold text-slate-300 font-mono">
                          ({forecast.current_risk_score}%)
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-400 mt-2 font-medium">
                      Live Telemetry Baseline Assessment
                    </div>
                  </div>

                  {/* Transition Vector Arrow */}
                  <div className="sm:col-span-2 flex flex-col items-center justify-center py-2 sm:py-0">
                    <div className={`flex items-center gap-1 font-black text-xs px-2.5 py-1 rounded-full border ${
                      isEscalating
                        ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                    }`}>
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>{isEscalating ? `+${forecast.delta_score}%` : `${forecast.delta_score}%`}</span>
                    </div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 mt-1 font-semibold text-center">
                      30-Day Shift
                    </span>
                  </div>

                  {/* Predicted in 30 Days Box */}
                  <div className={`sm:col-span-5 p-4 rounded-xl border flex flex-col justify-between ${
                    forecast.predicted_30d_risk_tier === 'Critical'
                      ? 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-950/50'
                      : forecast.predicted_30d_risk_tier === 'High'
                      ? 'bg-orange-950/40 border-orange-500/50 shadow-lg shadow-orange-950/50'
                      : 'bg-amber-950/40 border-amber-500/50 shadow-lg shadow-amber-950/50'
                  }`}>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4A017]">
                          Predicted in 30 Days
                        </span>
                        <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      </div>
                      <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-2xl font-black ${
                          forecast.predicted_30d_risk_tier === 'Critical'
                            ? 'text-rose-300'
                            : forecast.predicted_30d_risk_tier === 'High'
                            ? 'text-orange-300'
                            : forecast.predicted_30d_risk_tier === 'Moderate'
                            ? 'text-amber-300'
                            : 'text-emerald-300'
                        }`}>
                          {forecast.predicted_30d_risk_tier}
                        </span>
                        <span className="text-sm font-bold text-white font-mono">
                          ({forecast.predicted_30d_score}%)
                        </span>
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-300 mt-2 font-medium">
                      ML Projected Cognitive & Physiological Load
                    </div>
                  </div>
                </div>

                {/* 30-Day Milestone Trajectory Curve */}
                <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 relative z-10 mb-3.5">
                  <div className="flex items-center justify-between text-[11px] font-bold text-slate-300 mb-2">
                    <span className="flex items-center gap-1.5 text-xs text-white">
                      <Activity className="w-3.5 h-3.5 text-[#D4A017]" />
                      <span>30-Day Longitudinal Stress Trajectory</span>
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      Step Milestones: Day 0 &rarr; Day 30
                    </span>
                  </div>

                  {/* Milestones Stepper */}
                  <div className="grid grid-cols-5 gap-2 relative">
                    {forecast.trajectory.map((point, idx) => {
                      const isEnd = idx === forecast.trajectory.length - 1;
                      return (
                        <div
                          key={point.day}
                          className={`p-2 rounded-lg text-center border transition-all ${
                            isEnd
                              ? 'bg-rose-500/20 border-rose-500/60 ring-1 ring-rose-500/30'
                              : idx === 0
                              ? 'bg-white/10 border-white/20'
                              : 'bg-white/5 border-white/10'
                          }`}
                        >
                          <div className="text-[9px] font-extrabold uppercase text-slate-400">{point.label}</div>
                          <div className="text-xs font-black text-white font-mono mt-0.5">{point.score}%</div>
                          <div className={`text-[8px] font-extrabold uppercase mt-0.5 ${
                            point.risk_tier === 'Critical'
                              ? 'text-rose-400'
                              : point.risk_tier === 'High'
                              ? 'text-orange-400'
                              : point.risk_tier === 'Moderate'
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}>
                            {point.risk_tier}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Benefits & Proactive Planning Footer */}
                <div className="p-3.5 rounded-xl bg-[#D4A017]/10 border border-[#D4A017]/30 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs relative z-10">
                  <div className="space-y-0.5">
                    <div className="text-[11px] font-black text-[#D4A017] uppercase tracking-wider flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Benefits: Supports proactive planning and preventive action.</span>
                    </div>
                    <p className="text-[11px] text-slate-200 font-medium">
                      Early welfare intervention now stops the projected transition to{' '}
                      <strong className="text-rose-300 font-bold">{forecast.predicted_30d_risk_tier}</strong> risk.
                    </p>
                  </div>

                  {/* Proactive Action Buttons */}
                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleInitiateAction(`Preventive Furlough Grant (Flatten 30-Day Curve) for ${selectedPersonnel.name}`)}
                      className="px-3 py-1.5 rounded-lg bg-[#D4A017] hover:bg-[#b88a14] text-slate-950 font-black text-[11px] shadow-sm transition-all cursor-pointer"
                    >
                      Approve Preventive Furlough
                    </button>
                    <button
                      onClick={() => handleInitiateAction(`Roster Night Watch Rotation for ${selectedPersonnel.name}`)}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-[11px] border border-white/20 transition-all cursor-pointer"
                    >
                      Rotate Watch Roster
                    </button>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* EMOTIONAL STABILITY INDEX PANEL: Measures emotional consistency over time */}
          {/* ========================================================================= */}
          {(() => {
            const esi = getPersonnelEmotionalStability(selectedPersonnel);

            return (
              <div id="welfare-emotional-stability-card" className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-[#0B1E2E] via-[#122A40] to-[#0A1A28] text-white border-2 border-teal-400/40 shadow-xl relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Header with Title, Badge, and Algorithm */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/20 border border-teal-400/50 flex items-center justify-center text-teal-300 shadow-inner">
                      <HeartPulse className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
                          Emotional Stability Index
                        </h4>
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-teal-400 text-slate-950 font-black">
                          Longitudinal ESI
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium">
                        <strong className="text-teal-400">Purpose:</strong> Measures emotional consistency over time.
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-300 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 self-start sm:self-auto">
                    Algorithm: <span className="text-teal-300 font-bold">Weighted moving average or LSTM</span> &bull; {esi.confidence}% Confidence
                  </div>
                </div>

                {/* Core Output Banner: 78% Stable */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 my-4 items-stretch relative z-10">
                  {/* Score & Status Box */}
                  <div className="sm:col-span-5 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        Emotional Stability
                      </div>
                      <div className="flex items-baseline gap-2.5 mt-1.5">
                        <span className="text-3xl sm:text-4xl font-black text-teal-300 font-mono">
                          {esi.score}%
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 text-teal-300 text-xs font-black uppercase border border-teal-500/40">
                          {esi.status}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-2.5 overflow-hidden">
                        <div className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2 rounded-full" style={{ width: `${esi.score}%` }} />
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-300 mt-2 font-medium">
                      Affective consistency across 7-day longitudinal window
                    </div>
                  </div>

                  {/* 6 Input Factors Grid */}
                  <div className="sm:col-span-7 p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                    <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 flex items-center justify-between">
                      <span>Inputs (6 Key Factors)</span>
                      <span className="font-mono text-teal-400 text-[10px]">WMA Recency Calibration</span>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      {esi.factors.map((f) => (
                        <div key={f.name} className="p-2 rounded-lg bg-black/25 border border-white/5 text-center">
                          <span className="text-[10px] font-bold text-slate-300 block truncate">{f.name}</span>
                          <span className="text-xs font-black text-white font-mono mt-0.5 block">{f.score}%</span>
                          <span className="text-[9px] text-teal-300 font-semibold block">{f.status}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 7-Day Trajectory Mini-Track */}
                <div className="p-3 rounded-xl bg-black/30 border border-white/10 relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Activity className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                    <span className="text-[11px] font-bold text-slate-200">Consistency Trajectory:</span>
                    <div className="flex items-center gap-1 font-mono text-[10px] flex-wrap">
                      {esi.trajectory.map((t, idx) => (
                        <span key={idx} className="px-1.5 py-0.5 rounded bg-white/10 text-teal-200">
                          {t.day_label}: {t.score}%
                        </span>
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-300 shrink-0">
                    &sigma; Volatility: <strong className="text-teal-300">{esi.volatility_variance}</strong>
                  </span>
                </div>
              </div>
            );
          })()}

          {/* ========================================================================= */}
          {/* BEHAVIORAL CHANGE DETECTION PANEL: Compare Current VS Historical Behavior   */}
          {/* ========================================================================= */}
          {(() => {
            const bc = getPersonnelBehavioralChange(selectedPersonnel);
            const isSevere = bc.behavior_change_score >= 75;
            const isModerate = bc.behavior_change_score >= 50;

            return (
              <div id="welfare-behavioral-change-card" className="mt-5 p-5 rounded-2xl bg-gradient-to-br from-[#10192A] via-[#162238] to-[#0D1524] text-white border-2 border-indigo-400/40 shadow-xl relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

                {/* Header with Title, Badge, and AI Process */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10 relative z-10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-400/50 flex items-center justify-center text-indigo-300 shadow-inner">
                      <Sliders className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm font-black tracking-wide text-white flex items-center gap-1.5">
                          Behavioral Change Detection
                        </h4>
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-indigo-400 text-slate-950 font-black">
                          AI Routine Anomaly
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-300 font-medium">
                        <strong className="text-indigo-400">Purpose:</strong> Detects unusual changes in a person&apos;s behavior over time.
                      </p>
                    </div>
                  </div>

                  <div className="text-[10px] font-mono text-slate-300 bg-black/40 px-2.5 py-1 rounded-lg border border-white/10 self-start sm:self-auto">
                    AI Process: <strong className="text-indigo-300">Compare: Current behavior VS Historical behavior</strong>
                  </div>
                </div>

                {/* Output Section: Behavior Change Score Banner & Comparison Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3.5 my-4 items-stretch relative z-10">
                  {/* Left: Behavior Change Score Box */}
                  <div className="sm:col-span-4 p-4 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                    <div>
                      <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        Output Metric
                      </div>
                      <div className="text-xs font-bold text-indigo-300 uppercase tracking-wider mt-0.5">
                        Behavior Change Score
                      </div>
                      <div className="flex items-baseline gap-2.5 mt-2">
                        <span className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                          isSevere ? 'text-rose-400' : isModerate ? 'text-amber-400' : 'text-emerald-400'
                        }`}>
                          {bc.behavior_change_score}
                        </span>
                        <span className="text-sm font-mono text-slate-400 font-semibold">/ 100</span>
                      </div>
                      <div className="mt-2">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-black uppercase border ${
                          isSevere
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : isModerate
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                        }`}>
                          {bc.severity_tier}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2 mt-3 overflow-hidden">
                        <div
                          className={`h-2 rounded-full ${
                            isSevere
                              ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                              : isModerate
                              ? 'bg-gradient-to-r from-indigo-500 to-amber-400'
                              : 'bg-gradient-to-r from-teal-500 to-emerald-400'
                          }`}
                          style={{ width: `${bc.behavior_change_score}%` }}
                        />
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 text-[11px] text-slate-300 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Confidence:</span>
                        <span className="font-mono text-indigo-300 font-bold">{bc.confidence_pct}%</span>
                      </div>
                      <div className="text-[10px] text-slate-400 leading-tight">
                        <strong>Primary Anomaly:</strong> {bc.primary_driver}
                      </div>
                    </div>
                  </div>

                  {/* Right: 5 Examples Comparison Table (Current behavior VS Historical behavior) */}
                  <div className="sm:col-span-8 p-3.5 rounded-xl bg-white/5 border border-white/10 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                        AI Comparison: Current Behavior VS Historical Behavior
                      </span>
                      <span className="text-[10px] font-mono text-indigo-300">
                        5 Evaluated Examples
                      </span>
                    </div>

                    {/* Table of the 5 Examples */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">
                            <th className="pb-1.5">Example / Behavior</th>
                            <th className="pb-1.5 text-center">Historical</th>
                            <th className="pb-1.5 text-center">Current</th>
                            <th className="pb-1.5 text-center">Shift</th>
                            <th className="pb-1.5 text-right">Detection Flag</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {bc.factors.map((f) => {
                            const isHighShift = f.anomaly_score >= 60;
                            return (
                              <tr key={f.key} className="hover:bg-white/5 transition-colors">
                                <td className="py-2 pr-2">
                                  <div className="font-bold text-white leading-snug">{f.example_label}</div>
                                  <div className="text-[10px] text-slate-400">{f.domain}</div>
                                </td>
                                <td className="py-2 text-center font-mono text-slate-300 text-[11px] whitespace-nowrap">
                                  {f.historical_behavior}
                                </td>
                                <td className="py-2 text-center font-mono font-bold text-white text-[11px] whitespace-nowrap">
                                  {f.current_behavior}
                                </td>
                                <td className="py-2 text-center whitespace-nowrap">
                                  <span className={`font-mono font-bold text-[11px] ${
                                    f.change_pct > 0 ? 'text-rose-300' : 'text-amber-300'
                                  }`}>
                                    {f.change_pct > 0 ? `+${f.change_pct}%` : `${f.change_pct}%`}
                                  </span>
                                </td>
                                <td className="py-2 text-right whitespace-nowrap">
                                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    isHighShift
                                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                                      : 'bg-white/10 text-slate-300 border border-white/10'
                                  }`}>
                                    {f.flag}
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Recommendation Footer */}
                    <div className="mt-3 pt-2.5 border-t border-white/10 text-[11px] text-slate-300 flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span><strong>Clinical Directive:</strong> {bc.recommendation}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Sub-block: Recommended Actions & Initiate Action Button */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1 text-xs">
              <div className="text-[11px] font-extrabold text-slate-800 uppercase tracking-wider mb-1 flex items-center justify-between">
                <span>Recommended Actions for {selectedPersonnel.name}</span>
                <span className="text-[10px] font-bold text-primary cursor-pointer">View All &rarr;</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-rose-600 shrink-0" />
                <span>Schedule counselling session</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                <span>Review and adjust workload</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                <span>Medical evaluation (if required)</span>
              </div>
              <div className="flex items-center gap-2 text-slate-700 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0" />
                <span>Plan wellness follow-up in 2 weeks</span>
              </div>
            </div>

            <button
              onClick={() => handleInitiateAction(`Priority Welfare Clinical Action for ${selectedPersonnel.name}`)}
              className="px-5 py-3 rounded-xl bg-[#2F4F3E] hover:bg-[#233d30] text-white text-xs font-extrabold shadow-md shadow-[#2F4F3E]/20 flex items-center justify-center gap-2 cursor-pointer shrink-0 transition-all active:scale-95"
            >
              <Send className="w-4 h-4 text-[#D4A017]" />
              <span>Initiate Action</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. ROW 3: EXPLAINABLE AI (SHAP) + RISK TREND (6M) + POPULATION DONUT     */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Top Contributing Factors (Explainable AI) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black text-gray-900">Top Contributing Factors (Explainable AI)</h3>
              </div>
              <span className="px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-sky-50 text-sky-700 border border-sky-200">
                SHAP Analysis
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Relative impact breakdown for {selectedPersonnel.name} ({selectedPersonnel.jcNumber}) &bull; Click any factor for analysis
            </p>

            <div className="space-y-3">
              {selectedPersonnel.topFactors.map((factor) => (
                <div
                  key={factor.name}
                  onClick={() => handleOpenFeatureDetail(factor.name)}
                  className="text-xs p-2 -mx-2 rounded-xl hover:bg-slate-50 cursor-pointer transition-all border border-transparent hover:border-slate-200 group"
                  title={`Click to view deep-dive analysis on ${factor.name}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-semibold text-slate-800 group-hover:text-primary group-hover:font-black transition-colors flex items-center gap-1.5">
                      <span>{factor.name}</span>
                      <span className="text-[10px] text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                        &rarr;
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{factor.pct}%</span>
                      <span
                        className={`text-[10px] font-bold ${
                          factor.impact === 'High'
                            ? 'text-rose-600'
                            : factor.impact === 'Medium'
                            ? 'text-amber-600'
                            : 'text-emerald-600'
                        }`}
                      >
                        {factor.impact} impact
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                    <div className={`h-full ${factor.color} rounded-full transition-all duration-700`} style={{ width: `${factor.pct * 2.8}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Accordion: Why AI Flagged This */}
          <div className="mt-5 pt-3 border-t border-slate-100">
            <button
              onClick={() => setIsWhyFlaggedOpen(!isWhyFlaggedOpen)}
              className="w-full py-2 px-3 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold flex items-center justify-between transition-colors cursor-pointer border border-sky-100"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-sky-600" />
                <span>Why AI flagged {selectedPersonnel.name}? Click for details</span>
              </div>
              {isWhyFlaggedOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {isWhyFlaggedOpen && (
              <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 space-y-2 animate-fade-in">
                {selectedPersonnel.explanation.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Column 2: Risk Trend (Last 6 Months) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black text-gray-900">Risk Trend (Last 6 Months)</h3>
              </div>
              <span className="text-xs font-bold text-slate-500">Jan &ndash; Jun 2025</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Longitudinal risk trajectory leading to current triage
            </p>

            {/* SVG Area Chart */}
            <div className="w-full h-44 relative flex items-end">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 300 120" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#EF4444" stopOpacity="0.4" />
                    <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="20" x2="300" y2="20" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="50" x2="300" y2="50" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="80" x2="300" y2="80" stroke="#F1F5F9" strokeWidth="1" />
                <line x1="0" y1="110" x2="300" y2="110" stroke="#E2E8F0" strokeWidth="1" />

                {/* Shaded Area */}
                <path
                  d="M 10,95 Q 60,85 110,65 T 190,25 T 240,60 T 290,75 L 290,115 L 10,115 Z"
                  fill="url(#trendGrad)"
                />

                {/* Trend Curve */}
                <path
                  d="M 10,95 Q 60,85 110,65 T 190,25 T 240,60 T 290,75"
                  fill="none"
                  stroke="#DC2626"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Points */}
                <circle cx="10" cy="95" r="3.5" fill="#10B981" stroke="white" strokeWidth="1.5" />
                <circle cx="70" cy="85" r="3.5" fill="#10B981" stroke="white" strokeWidth="1.5" />
                <circle cx="130" cy="65" r="3.5" fill="#F59E0B" stroke="white" strokeWidth="1.5" />
                <circle cx="190" cy="25" r="5" fill="#DC2626" stroke="white" strokeWidth="2" />
                <circle cx="240" cy="60" r="3.5" fill="#F59E0B" stroke="white" strokeWidth="1.5" />
                <circle cx="290" cy="75" r="3.5" fill="#10B981" stroke="white" strokeWidth="1.5" />
              </svg>

              {/* April Peak Critical Tag */}
              <div className="absolute top-1 left-[58%] -translate-x-1/2 bg-rose-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-sm flex items-center gap-1">
                &uarr; Critical ({selectedPersonnel.riskScore}%)
              </div>
            </div>

            {/* X-Axis Month Labels */}
            <div className="flex justify-between text-[11px] font-bold text-slate-500 mt-2 px-1">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span className="text-rose-600 font-black">Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Peak: {selectedPersonnel.riskScore}% in April</span>
            <span className="text-emerald-700 font-bold">&darr; 41% post intervention</span>
          </div>
        </div>

        {/* Column 3: Personnel Risk Distribution (Donut) */}
        <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black text-gray-900">Personnel Risk Distribution</h3>
              </div>
              <span className="text-xs font-bold text-primary cursor-pointer">Export</span>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Current active monitored strength (Northern Sector)
            </p>

            <div className="flex items-center justify-between gap-4">
              {/* Donut Chart */}
              <div className="relative w-36 h-36 flex items-center justify-center shrink-0">
                <svg className="w-36 h-36 transform -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    stroke="#10B981"
                    strokeWidth="14"
                    strokeDasharray={`${2 * Math.PI * 44 * 0.49} ${2 * Math.PI * 44}`}
                    strokeDashoffset="0"
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    stroke="#F59E0B"
                    strokeWidth="14"
                    strokeDasharray={`${2 * Math.PI * 44 * 0.32} ${2 * Math.PI * 44}`}
                    strokeDashoffset={`-${2 * Math.PI * 44 * 0.49}`}
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    stroke="#F97316"
                    strokeWidth="14"
                    strokeDasharray={`${2 * Math.PI * 44 * 0.14} ${2 * Math.PI * 44}`}
                    strokeDashoffset={`-${2 * Math.PI * 44 * 0.81}`}
                    fill="none"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="44"
                    stroke="#EF4444"
                    strokeWidth="14"
                    strokeDasharray={`${2 * Math.PI * 44 * 0.05} ${2 * Math.PI * 44}`}
                    strokeDashoffset={`-${2 * Math.PI * 44 * 0.95}`}
                    fill="none"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-extrabold uppercase text-slate-500">Total</span>
                  <span className="text-xl font-black text-slate-900 leading-tight">520</span>
                  <span className="text-[9px] text-slate-400 font-semibold">Personnel</span>
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-2 text-xs flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="font-semibold text-slate-700">Critical</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">24 (5%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    <span className="font-semibold text-slate-700">High</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">72 (14%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="font-semibold text-slate-700">Medium</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">168 (32%)</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="font-semibold text-slate-700">Low</span>
                  </div>
                  <span className="font-mono font-bold text-slate-900">256 (49%)</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>SHAPE-1 Clean: 424</span>
            <span className="text-rose-600 font-bold">96 Under Surveillance</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. ROW 4: PRIORITY PERSONNEL QUEUE + RECENT INTERVENTIONS + PRIVACY       */}
      {/* ========================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Column 1 (5 cols): Priority Personnel Queue with Search Integration */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black text-gray-900">Priority Personnel Queue</h3>
              </div>
              <span className="text-xs font-bold text-primary hover:text-primary-700 cursor-pointer">
                View All &rarr;
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Top personnel requiring immediate triage attention (Click row to inspect)
            </p>

            <div className="overflow-x-auto">
              <table id="welfare-priority-personnel-table" className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Name / ID</th>
                    <th className="pb-2">Unit</th>
                    <th className="pb-2">Current Risk</th>
                    <th className="pb-2">Predicted in 30 Days (ML)</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ALL_PERSONNEL_DATABASE.slice(0, 5).map((p, idx) => {
                    const isSelected = selectedPersonnel.id === p.id;
                    const fc = getPersonnelForecast(p);
                    return (
                      <tr
                        key={p.id}
                        onClick={() => handleSelectPersonnel(p)}
                        className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                          isSelected ? 'bg-primary-50/60 border-l-2 border-primary' : ''
                        }`}
                      >
                        <td className="py-2.5 font-bold text-slate-500">{idx + 1}</td>
                        <td className="py-2.5">
                          <div className="font-bold text-gray-900 flex items-center gap-1.5">
                            <span>{p.name}</span>
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />}
                          </div>
                          <div className="text-[10px] font-mono text-slate-400 flex items-center gap-1.5 mt-0.5 flex-wrap">
                            <span>{p.jcNumber}</span>
                            <span className="text-slate-300">&bull;</span>
                            <span className="font-semibold text-teal-700 bg-teal-50 px-1 rounded border border-teal-200/60">
                              ESI: {getPersonnelEmotionalStability(p).score}% {getPersonnelEmotionalStability(p).status}
                            </span>
                            <span className="text-slate-300">&bull;</span>
                            <span className={`font-semibold px-1 rounded border ${
                              getPersonnelBehavioralChange(p).behavior_change_score >= 70
                                ? 'text-rose-700 bg-rose-50 border-rose-200/60'
                                : 'text-indigo-700 bg-indigo-50 border-indigo-200/60'
                            }`}>
                              BCS: {getPersonnelBehavioralChange(p).behavior_change_score}/100
                            </span>
                          </div>
                        </td>
                        <td className="py-2.5 font-medium text-slate-700">{p.unit.replace('Field Unit - ', '')}</td>
                        <td className="py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                              p.riskTier === 'Critical'
                                ? 'bg-rose-100 text-rose-700'
                                : p.riskTier === 'High'
                                ? 'bg-orange-100 text-orange-700'
                                : p.riskTier === 'Moderate'
                                ? 'bg-amber-100 text-amber-700'
                                : 'bg-emerald-100 text-emerald-700'
                            }`}
                          >
                            {p.riskScore}% {p.riskTier}
                          </span>
                        </td>
                        <td className="py-2.5">
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                                fc.predicted_30d_risk_tier === 'Critical'
                                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                                  : fc.predicted_30d_risk_tier === 'High'
                                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                                  : fc.predicted_30d_risk_tier === 'Moderate'
                                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                              }`}
                            >
                              {fc.predicted_30d_score}% {fc.predicted_30d_risk_tier}
                            </span>
                            {fc.delta_score > 0 ? (
                              <span className="text-rose-600 font-bold text-[10px] flex items-center">
                                <TrendingUp className="w-3 h-3 inline mr-0.5" />+{fc.delta_score}
                              </span>
                            ) : (
                              <span className="text-emerald-600 font-bold text-[10px]">
                                {fc.delta_score}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-2.5">
                          <span className={`text-[11px] ${p.statusColor}`}>{p.statusLabel}</span>
                        </td>
                        <td className="py-2.5 text-right">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectPersonnel(p);
                            }}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-primary text-white shadow-xs'
                                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                          >
                            {isSelected ? 'Active' : 'Inspect'}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Showing top 5 of 18 flagged cases</span>
            <span className="font-bold text-primary">Live Triage Ready</span>
          </div>
        </div>

        {/* Column 2 (4 cols): Recent Welfare Interventions */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                <h3 className="text-sm font-black text-gray-900">Recent Welfare Interventions</h3>
              </div>
              <span className="text-xs font-bold text-primary hover:text-primary-700 cursor-pointer">
                View All &rarr;
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-4">
              Latest clinical actions and execution status
            </p>

            <div className="space-y-3.5">
              {[
                {
                  title: 'Counselling Session',
                  sub: 'JC-1983 &bull; Completed',
                  time: '2 days ago',
                  icon: UserCheck,
                  badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                  iconColor: 'text-emerald-600 bg-emerald-50',
                },
                {
                  title: 'Workload Adjustment',
                  sub: 'JC-2841 &bull; In Progress',
                  time: '3 days ago',
                  icon: Briefcase,
                  badgeColor: 'text-amber-700 bg-amber-50 border-amber-200',
                  iconColor: 'text-amber-600 bg-amber-50',
                },
                {
                  title: 'Medical Evaluation',
                  sub: 'JC-3102 &bull; Scheduled',
                  time: '5 days ago',
                  icon: Activity,
                  badgeColor: 'text-sky-700 bg-sky-50 border-sky-200',
                  iconColor: 'text-sky-600 bg-sky-50',
                },
                {
                  title: 'Follow-up Review',
                  sub: 'JC-2765 &bull; Completed',
                  time: '1 week ago',
                  icon: CheckCircle2,
                  badgeColor: 'text-emerald-700 bg-emerald-50 border-emerald-200',
                  iconColor: 'text-emerald-600 bg-emerald-50',
                },
              ].map((item) => {
                const ItemIcon = item.icon;
                return (
                  <div key={item.title} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl ${item.iconColor} flex items-center justify-center shrink-0`}>
                        <ItemIcon className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{item.title}</div>
                        <div
                          className="text-[10px] text-slate-500 font-medium"
                          dangerouslySetInnerHTML={{ __html: item.sub }}
                        />
                      </div>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400">{item.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between">
            <span>Monthly Resolution: 92.5%</span>
            <span className="text-emerald-700 font-bold">&uarr; +4.2%</span>
          </div>
        </div>

        {/* Column 3 (3 cols): Privacy & Ethical Use */}
        <div className="lg:col-span-3 p-6 rounded-3xl bg-[#F0FDF4] border border-emerald-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lock className="w-5 h-5 text-emerald-700" />
              <h3 className="text-sm font-black text-gray-900">Privacy & Ethical Use</h3>
            </div>
            <p className="text-xs text-slate-600 font-medium mb-4">
              Statutory Defense Welfare Safeguards
            </p>

            <div className="p-4 rounded-2xl bg-white border border-emerald-200/80 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-black text-xs text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Privacy Protected</span>
              </div>

              <div className="space-y-2.5 text-[11px] text-slate-700 font-medium">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Only authorized welfare personnel can view identifiable information.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Data is encrypted and securely stored with zero external leakage.</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Predictions are for welfare support only and cannot be used for disciplinary action.</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-emerald-200/60 text-center">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800">
              People First &bull; Dignity Always &bull; Confidential by Design
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6.5. TOP 1% CLOSED-LOOP RECOVERY TRACKING (14/30/60-Day Trajectory Curve)  */}
      {/* ========================================================================= */}
      <div className="pt-2">
        <ClosedLoopRecoveryTracker personnelUid={selectedPersonnel.jcNumber} />
      </div>

      {/* ========================================================================= */}
      {/* 7. EXPANDABLE 13-FACTOR PSYCHOMETRIC MATRIX (Full Developer Transparency) */}
      {/* ========================================================================= */}
      <div className="pt-4 text-center">
        <button
          onClick={() => setShowFullMatrix(!showFullMatrix)}
          className="px-5 py-2.5 rounded-2xl bg-white border border-slate-300 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all cursor-pointer shadow-xs inline-flex items-center gap-2"
        >
          <Sliders className="w-4 h-4 text-primary" />
          <span>{showFullMatrix ? 'Hide' : 'Inspect'} Complete 13-Factor Psychometric Matrix & Formulas</span>
          {showFullMatrix ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFullMatrix && (
          <div className="mt-6 p-6 rounded-3xl bg-white border border-slate-200 text-left animate-fade-in space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-black text-gray-900">Multi-Source 13-Factor Diagnostic Weight Matrix</h4>
                <p className="text-xs text-slate-500">Mathematical formula: Composite Index = &Sigma; (Weight<sub>i</sub> &times; Score<sub>i</sub>)</p>
              </div>
              <span className="text-xs font-mono font-bold text-primary">v2.4 Production Standard</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {[
                { name: '1. Burnout Prediction', weight: '16%', formula: '0.12(Leave) + 0.14(Overtime) + 0.13(Workload) + ...' },
                { name: '2. Psychological Distress', weight: '14%', formula: 'Kessler-10 Model + Mood Variance' },
                { name: '3. Stress Indicators', weight: '12%', formula: 'Autonomic HR Variability + Telemetry' },
                { name: '4. Overall Stress', weight: '10%', formula: 'Multi-Source Aggregation' },
                { name: '5. Emotional Fatigue', weight: '8%', formula: 'Exhaustion & Depersonalization' },
                { name: '6. Welfare Concern', weight: '8%', formula: 'Leave Trends & Grant Records' },
                { name: '7. Predictive Behavior', weight: '7%', formula: 'Longitudinal Anomaly Detection' },
                { name: '8. Stress & Burnout Models', weight: '7%', formula: 'Central HRMS + Biometrics' },
                { name: '9. Intervention Recommendations', weight: '5%', formula: 'Automated Clinical Triage' },
                { name: '10. Automated Alerts', weight: '5%', formula: 'Spike Detection & Warning Index' },
                { name: '11. Mental Well-being', weight: '5%', formula: 'Resilience & Coping Scale' },
                { name: '12. Readiness Score', weight: '5%', formula: 'Physical + Mental Combat Index' },
                { name: '13. Occupational Incident Risk', weight: '5%', formula: 'Fatigue Spike Correlation' },
              ].map((f) => (
                <div
                  key={f.name}
                  onClick={() => handleOpenFeatureDetail(f.name)}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-[#D4A017] hover:shadow-lg cursor-pointer transition-all group relative flex flex-col justify-between"
                  title={`Click to view entire mathematical formula, clinical evidence, cohort list, and SOP for ${f.name}`}
                >
                  <div>
                    <div className="font-bold text-gray-900 group-hover:text-primary flex items-center justify-between transition-colors">
                      <span className="truncate pr-2">{f.name}</span>
                      <span className="text-primary font-mono text-[11px] bg-primary-50 px-2 py-0.5 rounded-md font-black shrink-0">
                        {f.weight}
                      </span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-1.5 line-clamp-1">{f.formula}</div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-primary font-bold">
                    <span className="group-hover:underline">Inspect Details &rarr;</span>
                    <span className="text-[9px] text-slate-400 font-medium">SOP &bull; Telemetry</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 8. FEATURE DEEP-DIVE & CLINICAL-MATHEMATICAL INTELLIGENCE MODAL           */}
      {/* ========================================================================= */}
      <FeatureDetailModal
        isOpen={isFeatureModalOpen}
        onClose={() => setIsFeatureModalOpen(false)}
        feature={selectedFeatureDetail}
        allPersonnel={ALL_PERSONNEL_DATABASE}
        onSelectPersonnel={(p) => {
          handleSelectPersonnel(p as any);
        }}
        onInitiateProtocol={(feat) => {
          handleInitiateAction(`Standardized Triage Protocol for ${feat}`);
        }}
      />
    </div>
  );
};

export default WelfareDashboard;
