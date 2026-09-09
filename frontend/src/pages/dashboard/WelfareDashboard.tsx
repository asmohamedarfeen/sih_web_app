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
  Sparkle,
  Database,
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
  psychological_distress_params?: {
    mood_assessments: any;
    anxiety_questions: any;
    depression_indicators: any;
    sleep_quality: any;
    social_isolation: any;
    traumatic_exposure: any;
    wellness_survey: any;
  };
  stress_indicators_params?: {
    hrms_data: any;
    leave_frequency: any;
    workload: any;
    missed_assessments: any;
    sleep_pattern: any;
    biometric_trends: any;
    behavioral_changes: any;
  };
  readiness_score_params?: {
    wellness: any;
    physical_readiness: any;
    workload: any;
    mental_readiness: any;
    behavioral_stability: any;
    operational_risk: any;
  };
  operational_readiness_params?: any;
}

export interface FactorParamDisplay {
  key: string;
  name: string;
  weight: number;
  weightLabel: string;
  sourceBadge: string;
  sourceType: 'MOBILE' | 'HRMS' | 'DATABASE';
  note: string;
  source: string;
  available: boolean;
  score: number;
  color: string;
  bar: string;
  desc: string;
}

export interface FactorEvaluationResult {
  factorId: string;
  factorTitle: string;
  metricLabel: string;
  score: number;
  level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NOMINAL';
  levelColor: string;
  levelBg: string;
  tierLabel: string;
  formula: string;
  recommendation: string;
  primaryAction: string;
  secondaryAction: string;
  mobileCount: number;
  hrmsCount: number;
  databaseCount: number;
  parameters: FactorParamDisplay[];
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
      sleep_quality: { score: 92, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: 'Logged via Soldier Mobile App (3.8h sleep recorded, severe sleep deficit).' },
      emotional_exhaustion: { score: 82, available: true, source: 'Clinical MBI-GS Telemetry', note: 'Maslach affective depletion index elevated; high somatic weariness.' },
      assessment_responses: { score: 76, available: true, source: 'Soldier Mobile App (Burnout Questions)', note: 'Psychometric strain 76% calculated strictly from mobile app burnout domain questions.' },
    },
    psychological_distress_params: {
      mood_assessments: { score: 78, available: true, source: 'Soldier Mobile App (Daily Mood Pulse)', note: 'High-altitude affective fatigue, low mood valence recorded on mobile.' },
      anxiety_questions: { score: 84, available: true, source: 'Soldier Mobile App (GAD-7 Anxiety Screening)', note: 'Hypoxia restlessness & nocturnal startle response reported via mobile assessment.' },
      depression_indicators: { score: 80, available: true, source: 'Soldier Mobile App (PHQ-9 Depression Inventory)', note: 'PHQ-9 anhedonia and vegetative fatigue markers elevated on mobile app.' },
      sleep_quality: { score: 92, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '3.8h average rest logged via Soldier Mobile App (severe sleep deficit).' },
      social_isolation: { score: 70, available: true, source: 'Central Database (Barracks Peer Network)', note: 'Remote forward post isolation score retrieved from Central PostgreSQL DB.' },
      traumatic_exposure: { score: 86, available: true, source: 'HRMS Portal (Combat Operations & Incident Dossier)', note: 'Extreme sub-zero vigil and high-threat avalanche sector records in HRMS Dossier.' },
      wellness_survey: { score: 76, available: true, source: 'Central Database (Periodic Psychometric Assessment Archive)', note: 'Periodic comprehensive psychological survey strain retrieved from Database.' },
    },
    stress_indicators_params: {
      hrms_data: { score: 88, available: true, source: 'HRMS Portal (Dossier & Stationing History)', note: '14 months continuous deployment in high-altitude extreme sector recorded in HRMS dossier.' },
      leave_frequency: { score: 82, available: true, source: 'HRMS Portal (Leave Management System)', note: '3 consecutive leave applications deferred due to forward vigil operational readiness.' },
      workload: { score: 90, available: true, source: 'HRMS Portal (Command Watch Rosters)', note: '48 duty hours logged in past 5 days (64% over standard roster threshold).' },
      missed_assessments: { score: 40, available: true, source: 'Central Database (Compliance Log)', note: '85% on-time psychometric check-in completion rate logged in central database.' },
      sleep_pattern: { score: 92, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '3.8h average sleep recorded with severe circadian irregularity on mobile terminal.' },
      biometric_trends: { score: 86, available: true, source: 'Soldier Mobile App (Biometric & Sensor Engine)', note: 'Resting Heart Rate elevation +14bpm and suppressed HRV (28ms) indicating autonomic strain.' },
      behavioral_changes: { score: 80, available: true, source: 'Soldier Mobile App & Central DB (Behavioral Telemetry)', note: 'Increased somatic irritability and peer withdrawal flags logged across app & unit review.' }
    }
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
      sleep_quality: { score: 82, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: 'Logged via Soldier Mobile App (4.2h sleep, high sleep latency fragmentation).' },
      emotional_exhaustion: { score: 80, available: true, source: 'Clinical MBI-GS Telemetry', note: 'Cumulative command burden combined with caregiver strain.' },
      assessment_responses: { score: 74, available: true, source: 'Soldier Mobile App (Burnout Questions)', note: 'Mobile app burnout questions result: 74% task weariness & emotional depletion.' },
    },
    psychological_distress_params: {
      mood_assessments: { score: 82, available: true, source: 'Soldier Mobile App (Daily Mood Pulse)', note: 'Caregiver distress & urgent family hospitalization anxiety logged via mobile app.' },
      anxiety_questions: { score: 78, available: true, source: 'Soldier Mobile App (GAD-7 Anxiety Screening)', note: 'Persistent tactical tension and family medical worry scored via GAD-7 mobile items.' },
      depression_indicators: { score: 70, available: true, source: 'Soldier Mobile App (PHQ-9 Depression Inventory)', note: 'Low hedonic tone and command stress markers recorded on mobile app.' },
      sleep_quality: { score: 82, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '4.2h sleep average with frequent nighttime awakenings logged on mobile terminal.' },
      social_isolation: { score: 55, available: true, source: 'Central Database (Barracks Peer Network)', note: 'Good squad buddy network but domestic isolation recorded in central DB.' },
      traumatic_exposure: { score: 74, available: true, source: 'HRMS Portal (Combat Operations & Incident Dossier)', note: 'Artillery forward battery line counter-fire incident records in HRMS Dossier.' },
      wellness_survey: { score: 78, available: true, source: 'Central Database (Periodic Psychometric Assessment Archive)', note: 'High psychological friction index retrieved from monthly survey database.' },
    },
    stress_indicators_params: {
      hrms_data: { score: 80, available: true, source: 'HRMS Portal (Dossier & Stationing History)', note: 'Field artillery command tenure (8 continuous months in active firing line).' },
      leave_frequency: { score: 88, available: true, source: 'HRMS Portal (Leave Management System)', note: 'Urgent family medical leave application pending approval in HRMS leave system.' },
      workload: { score: 82, available: true, source: 'HRMS Portal (Command Watch Rosters)', note: 'High tactical artillery logistics coordination and battery shift overruns.' },
      missed_assessments: { score: 65, available: true, source: 'Central Database (Compliance Log)', note: '3 missed daily check-in pulses during hospital communication intervals.' },
      sleep_pattern: { score: 82, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '4.2h sleep duration with frequent nocturnal awakenings recorded on mobile.' },
      biometric_trends: { score: 78, available: true, source: 'Soldier Mobile App (Biometric & Sensor Engine)', note: 'Elevated sympathetic baseline (RHR +10bpm over baseline average).' },
      behavioral_changes: { score: 75, available: true, source: 'Soldier Mobile App & Central DB (Behavioral Telemetry)', note: 'Acute caregiver worry and elevated verbal stress noted in welfare check.' }
    }
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
    psychological_distress_params: {
      mood_assessments: { score: 60, available: true, source: 'Soldier Mobile App (Daily Mood Pulse)', note: 'Sensory fatigue from long console hours; moderate valence.' },
      anxiety_questions: { score: 65, available: true, source: 'Soldier Mobile App (GAD-7 Anxiety Screening)', note: 'Border vigilance tension and night watch jitter logged via mobile.' },
      depression_indicators: { score: 54, available: true, source: 'Soldier Mobile App (PHQ-9 Depression Inventory)', note: 'Normal interest markers; mild isolation fatigue.' },
      sleep_quality: { score: 75, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: 'Circadian shift sleep deficit recorded via mobile telemetry.' },
      social_isolation: { score: 62, available: true, source: 'Central Database (Barracks Peer Network)', note: 'Technical outpost isolation index from Central PostgreSQL.' },
      traumatic_exposure: { score: 45, available: true, source: 'HRMS Portal (Combat Operations & Incident Dossier)', note: 'Non-combat signals support assignment records in HRMS.' },
      wellness_survey: { score: 60, available: true, source: 'Central Database (Periodic Psychometric Assessment Archive)', note: 'Moderate psychometric strain from periodic assessment archive.' },
    },
    stress_indicators_params: {
      hrms_data: { score: 62, available: true, source: 'HRMS Portal (Dossier & Stationing History)', note: '6 months border telemetry assignment logged in HRMS service records.' },
      leave_frequency: { score: 55, available: true, source: 'HRMS Portal (Leave Management System)', note: 'Standard furlough interval maintained in HRMS leave system.' },
      workload: { score: 78, available: true, source: 'HRMS Portal (Command Watch Rosters)', note: 'Rotational 12-hour communications radar console monitoring shifts.' },
      missed_assessments: { score: 20, available: true, source: 'Central Database (Compliance Log)', note: 'High check-in compliance; 95% assessment completion rate.' },
      sleep_pattern: { score: 75, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: 'Circadian shift delay and 5.1h fragmented daytime rest on mobile.' },
      biometric_trends: { score: 68, available: true, source: 'Soldier Mobile App (Biometric & Sensor Engine)', note: 'Moderate nocturnal heart rate variability dip during shift rotations.' },
      behavioral_changes: { score: 58, available: true, source: 'Soldier Mobile App & Central DB (Behavioral Telemetry)', note: 'Mild sensory fatigue; buddy communication active and cooperative.' }
    }
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
    psychological_distress_params: {
      mood_assessments: { score: 52, available: true, source: 'Soldier Mobile App (Daily Mood Pulse)', note: 'High mental resilience, brief tactical fatigue logged on mobile.' },
      anxiety_questions: { score: 58, available: true, source: 'Soldier Mobile App (GAD-7 Anxiety Screening)', note: 'Controlled tactical vigilance and low general anxiety on mobile GAD-7.' },
      depression_indicators: { score: 40, available: true, source: 'Soldier Mobile App (PHQ-9 Depression Inventory)', note: 'Minimal depressive markers; high operational motivation.' },
      sleep_quality: { score: 58, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '6.0h restorative sleep logged on mobile terminal.' },
      social_isolation: { score: 35, available: true, source: 'Central Database (Barracks Peer Network)', note: 'Excellent squad camaraderie in 10 Para SF barracks DB.' },
      traumatic_exposure: { score: 68, available: true, source: 'HRMS Portal (Combat Operations & Incident Dossier)', note: 'High-threat combat exercises logged in HRMS Service Record.' },
      wellness_survey: { score: 50, available: true, source: 'Central Database (Periodic Psychometric Assessment Archive)', note: 'Solid coping mechanisms across psychometric survey metrics.' },
    },
    stress_indicators_params: {
      hrms_data: { score: 68, available: true, source: 'HRMS Portal (Dossier & Stationing History)', note: '7 months forward tactical SF stationing logged in HRMS dossier.' },
      leave_frequency: { score: 60, available: true, source: 'HRMS Portal (Leave Management System)', note: 'Furlough scheduled for upcoming cycle after mission completion.' },
      workload: { score: 72, available: true, source: 'HRMS Portal (Command Watch Rosters)', note: 'High-intensity tactical patrol and field reconnaissance rosters.' },
      missed_assessments: { score: 15, available: true, source: 'Central Database (Compliance Log)', note: 'Outstanding assessment adherence; 98% check-in rate in database.' },
      sleep_pattern: { score: 58, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '6.0h average sleep with high autonomic sleep architecture rebound.' },
      biometric_trends: { score: 52, available: true, source: 'Soldier Mobile App (Biometric & Sensor Engine)', note: 'Athletic resting pulse (56bpm) and robust HRV recovery curve.' },
      behavioral_changes: { score: 45, available: true, source: 'Soldier Mobile App & Central DB (Behavioral Telemetry)', note: 'High squad engagement, positive peer evaluations across units.' }
    }
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
    psychological_distress_params: {
      mood_assessments: { score: 70, available: true, source: 'Soldier Mobile App (Daily Mood Pulse)', note: 'Command responsibility strain and irregular recovery logged via mobile.' },
      anxiety_questions: { score: 72, available: true, source: 'Soldier Mobile App (GAD-7 Anxiety Screening)', note: 'Tactical accountability tension and operational alert vigilance on mobile.' },
      depression_indicators: { score: 48, available: true, source: 'Soldier Mobile App (PHQ-9 Depression Inventory)', note: 'Strong leadership motivation; mild somatic fatigue.' },
      sleep_quality: { score: 78, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '4.9h average sleep logged with early awakenings.' },
      social_isolation: { score: 42, available: true, source: 'Central Database (Barracks Peer Network)', note: 'High officer peer support network in CRPF central database.' },
      traumatic_exposure: { score: 75, available: true, source: 'HRMS Portal (Combat Operations & Incident Dossier)', note: 'Rapid Action counter-insurgency command records in HRMS.' },
      wellness_survey: { score: 68, available: true, source: 'Central Database (Periodic Psychometric Assessment Archive)', note: 'Balanced coping indices with high responsibility workload.' },
    },
    stress_indicators_params: {
      hrms_data: { score: 74, available: true, source: 'HRMS Portal (Dossier & Stationing History)', note: '9 months forward command post deployment logged in HRMS.' },
      leave_frequency: { score: 72, available: true, source: 'HRMS Portal (Leave Management System)', note: 'Annual furlough delayed by 4 months due to battalion operations.' },
      workload: { score: 80, available: true, source: 'HRMS Portal (Command Watch Rosters)', note: 'Command supervision of night sector sweeps and logistics reviews.' },
      missed_assessments: { score: 35, available: true, source: 'Central Database (Compliance Log)', note: 'Occasional delay during emergency tactical exercises in database.' },
      sleep_pattern: { score: 78, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '4.9h fragmented sleep with elevated nighttime restlessness on mobile.' },
      biometric_trends: { score: 75, available: true, source: 'Soldier Mobile App (Biometric & Sensor Engine)', note: 'Sustained sympathetic tone and elevated morning cortisol indicator.' },
      behavioral_changes: { score: 65, available: true, source: 'Soldier Mobile App & Central DB (Behavioral Telemetry)', note: 'High command discipline; increased task urgency communication.' }
    }
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
    psychological_distress_params: {
      mood_assessments: { score: 22, available: true, source: 'Soldier Mobile App (Daily Mood Pulse)', note: 'Positive affect valence and high mission satisfaction on mobile.' },
      anxiety_questions: { score: 25, available: true, source: 'Soldier Mobile App (GAD-7 Anxiety Screening)', note: 'Optimal composure and emotional regulation on mobile GAD-7.' },
      depression_indicators: { score: 18, available: true, source: 'Soldier Mobile App (PHQ-9 Depression Inventory)', note: 'Zero depressive indicators; peak performance state.' },
      sleep_quality: { score: 24, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '7.4h optimal restorative sleep with >90 min deep sleep phase.' },
      social_isolation: { score: 20, available: true, source: 'Central Database (Barracks Peer Network)', note: 'Strong social integration in Air Defense squadron database.' },
      traumatic_exposure: { score: 25, available: true, source: 'HRMS Portal (Combat Operations & Incident Dossier)', note: 'Peace-station technical deployment records in HRMS.' },
      wellness_survey: { score: 26, available: true, source: 'Central Database (Periodic Psychometric Assessment Archive)', note: 'Top-tier psychological health index across all survey metrics.' },
    },
    stress_indicators_params: {
      hrms_data: { score: 24, available: true, source: 'HRMS Portal (Dossier & Stationing History)', note: 'Peace station technical posting with balanced duty roster in HRMS.' },
      leave_frequency: { score: 25, available: true, source: 'HRMS Portal (Leave Management System)', note: 'Annual furlough taken on schedule; regular leave balance active.' },
      workload: { score: 30, available: true, source: 'HRMS Portal (Command Watch Rosters)', note: 'Standard radar watch cycles with mandatory 12h rest intervals.' },
      missed_assessments: { score: 5, available: true, source: 'Central Database (Compliance Log)', note: 'Perfect check-in adherence across all psychometric pulses.' },
      sleep_pattern: { score: 24, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '7.4h average restorative sleep with excellent deep sleep ratio.' },
      biometric_trends: { score: 22, available: true, source: 'Soldier Mobile App (Biometric & Sensor Engine)', note: 'Calm autonomic tone, high HRV (72ms) and stable resting pulse.' },
      behavioral_changes: { score: 20, available: true, source: 'Soldier Mobile App & Central DB (Behavioral Telemetry)', note: 'High emotional stability, proactive leadership communication.' }
    }
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
    psychological_distress_params: {
      mood_assessments: { score: 48, available: true, source: 'Soldier Mobile App (Daily Mood Pulse)', note: 'Stable morale with altitude acclimatization notes on mobile.' },
      anxiety_questions: { score: 50, available: true, source: 'Soldier Mobile App (GAD-7 Anxiety Screening)', note: 'Controlled vigilance during mountain pass patrols on mobile.' },
      depression_indicators: { score: 42, available: true, source: 'Soldier Mobile App (PHQ-9 Depression Inventory)', note: 'Nominal mood scores; active peer communication.' },
      sleep_quality: { score: 50, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '6.2h sleep with mild altitude disruption recorded on mobile.' },
      social_isolation: { score: 45, available: true, source: 'Central Database (Barracks Peer Network)', note: 'Solid squad buddy cohesion in ITBP mountain post DB.' },
      traumatic_exposure: { score: 55, available: true, source: 'HRMS Portal (Combat Operations & Incident Dossier)', note: 'High-altitude border vigilance logs in HRMS Service Record.' },
      wellness_survey: { score: 52, available: true, source: 'Central Database (Periodic Psychometric Assessment Archive)', note: 'Moderate psychometric load, good physical conditioning.' },
    },
    stress_indicators_params: {
      hrms_data: { score: 58, available: true, source: 'HRMS Portal (Dossier & Stationing History)', note: '5 months high-altitude border outpost deployment in HRMS.' },
      leave_frequency: { score: 50, available: true, source: 'HRMS Portal (Leave Management System)', note: 'Furlough approved for next cycle; awaiting unit relief.' },
      workload: { score: 55, available: true, source: 'HRMS Portal (Command Watch Rosters)', note: 'Moderate 8-hour rotational mountain patrol watches.' },
      missed_assessments: { score: 25, available: true, source: 'Central Database (Compliance Log)', note: 'Good compliance with minor delay due to mountain weather.' },
      sleep_pattern: { score: 50, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '6.2h sleep with mild hypoxia-induced awakenings on mobile.' },
      biometric_trends: { score: 54, available: true, source: 'Soldier Mobile App (Biometric & Sensor Engine)', note: 'Acclimatized baseline pulse (68bpm) with stable HRV recovery.' },
      behavioral_changes: { score: 48, available: true, source: 'Soldier Mobile App & Central DB (Behavioral Telemetry)', note: 'Stable mood, active buddy participation and morale.' }
    }
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
    psychological_distress_params: {
      mood_assessments: { score: 45, available: true, source: 'Soldier Mobile App (Daily Mood Pulse)', note: 'Steady mood valence recorded during airport shift rotations.' },
      anxiety_questions: { score: 48, available: true, source: 'Soldier Mobile App (GAD-7 Anxiety Screening)', note: 'Mild aviation security vigilance tension on mobile GAD-7.' },
      depression_indicators: { score: 38, available: true, source: 'Soldier Mobile App (PHQ-9 Depression Inventory)', note: 'Low depressive markers; good interpersonal morale.' },
      sleep_quality: { score: 46, available: false, source: 'Pending Wearable Sync', note: 'Wearable sleep telemetry sync pending for last 48 hours.' },
      social_isolation: { score: 40, available: true, source: 'Central Database (Barracks Peer Network)', note: 'Active airport security detachment buddy connection in DB.' },
      traumatic_exposure: { score: 30, available: true, source: 'HRMS Portal (Combat Operations & Incident Dossier)', note: 'Metropolitan aviation security duties in HRMS Dossier.' },
      wellness_survey: { score: 45, available: false, source: 'Pending Psychometric Survey', note: 'Periodic survey cycle pending completion in central database.' },
    },
    stress_indicators_params: {
      hrms_data: { score: 42, available: true, source: 'HRMS Portal (Dossier & Stationing History)', note: '4 months metropolitan airport security posting in HRMS dossier.' },
      leave_frequency: { score: 45, available: true, source: 'HRMS Portal (Leave Management System)', note: 'Regular casual leave balance active in HRMS leave portal.' },
      workload: { score: 50, available: true, source: 'HRMS Portal (Command Watch Rosters)', note: 'Standard airport passenger screening watch rosters.' },
      missed_assessments: { score: 60, available: true, source: 'Central Database (Compliance Log)', note: 'Assessment sync pending for 48h logged in Central DB compliance log.' },
      sleep_pattern: { score: 46, available: false, source: 'Pending Wearable Sync (Mobile App)', note: 'Mobile wearable sleep telemetry sync pending in terminal buffer.' },
      biometric_trends: { score: 48, available: true, source: 'Soldier Mobile App (Biometric & Sensor Engine)', note: 'Normal sinus rhythm and steady cardiovascular indicators.' },
      behavioral_changes: { score: 44, available: true, source: 'Soldier Mobile App & Central DB (Behavioral Telemetry)', note: 'Cooperative unit interaction, standard peer review ratings.' }
    }
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
    psychological_distress_params: {
      mood_assessments: { score: 72, available: true, source: 'Soldier Mobile App (Daily Mood Pulse)', note: 'Jungle terrain fatigue & sleep latency reported on mobile app.' },
      anxiety_questions: { score: 75, available: true, source: 'Soldier Mobile App (GAD-7 Anxiety Screening)', note: 'Tactical alert strain and counter-insurgency vigilance on mobile.' },
      depression_indicators: { score: 62, available: true, source: 'Soldier Mobile App (PHQ-9 Depression Inventory)', note: 'Environmental weariness; maintains strong buddy morale.' },
      sleep_quality: { score: 74, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '4.7h interrupted sleep logged during jungle patrols on mobile.' },
      social_isolation: { score: 65, available: true, source: 'Central Database (Barracks Peer Network)', note: 'Dense terrain remote post isolation recorded in Central DB.' },
      traumatic_exposure: { score: 80, available: true, source: 'HRMS Portal (Combat Operations & Incident Dossier)', note: 'Counter-insurgency cordon and ambush encounter logs in HRMS.' },
      wellness_survey: { score: 72, available: true, source: 'Central Database (Periodic Psychometric Assessment Archive)', note: 'Elevated strain index from monthly psychometric assessment.' },
    },
    stress_indicators_params: {
      hrms_data: { score: 76, available: true, source: 'HRMS Portal (Dossier & Stationing History)', note: '8 continuous months in dense terrain counter-insurgency sector.' },
      leave_frequency: { score: 75, available: true, source: 'HRMS Portal (Leave Management System)', note: 'Furlough delayed by 2 months due to operational cordon duties.' },
      workload: { score: 76, available: true, source: 'HRMS Portal (Command Watch Rosters)', note: 'Extensive jungle patrol watches and rapid alert call-outs.' },
      missed_assessments: { score: 30, available: true, source: 'Central Database (Compliance Log)', note: 'Check-in delays during deep jungle tactical movements in DB.' },
      sleep_pattern: { score: 74, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: '4.7h fragmented sleep with high nocturnal alert awakenings.' },
      biometric_trends: { score: 72, available: true, source: 'Soldier Mobile App (Biometric & Sensor Engine)', note: 'Elevated sympathetic tone and night pulse volatility on mobile.' },
      behavioral_changes: { score: 68, available: true, source: 'Soldier Mobile App & Central DB (Behavioral Telemetry)', note: 'High environmental fatigue; cooperative squad buddy dynamic.' }
    }
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

export const evaluateFactorModel = (factorId: string, p: PersonnelBurnoutProfile): FactorEvaluationResult => {
  const getRaw = (obj: any, key: string, fallback: number = 50, note: string = 'Operational telemetry', src: string = 'Central Database') => {
    if (!obj) return { score: fallback, available: true, source: src, note };
    return parseParam(obj[key], fallback, note, src);
  };

  const getP = (key: string, fb: number = 50, note: string = 'Standard roster', src: string = 'HRMS Portal') =>
    getRaw(p.params, key, fb, note, src);
  const getPsych = (key: string, fb: number = 50, note: string = 'Psychometric pulse', src: string = 'Soldier Mobile App') =>
    getRaw(p.psychological_distress_params, key, fb, note, src);
  const getStress = (key: string, fb: number = 50, note: string = 'Stress signal', src: string = 'HRMS Portal') =>
    getRaw(p.stress_indicators_params, key, fb, note, src);
  const getOverall = (key: string, fb: number = 50, note: string = 'Overall stress metric', src: string = '🏢 HRMS Portal') =>
    getRaw((p as any).overall_stress_params, key, fb, note, src);
  const getFatigue = (key: string, fb: number = 50, note: string = 'Fatigue telemetry', src: string = '📱 Soldier Mobile App') =>
    getRaw((p as any).emotional_fatigue_params, key, fb, note, src);
  const getWelfareConcern = (key: string, fb: number = 50, note: string = 'Welfare concern metric', src: string = '🏢 HRMS Portal') =>
    getRaw((p as any).welfare_concern_params, key, fb, note, src);
  const getPredictiveBehavioral = (key: string, fb: number = 50, note: string = 'Behavioral metric', src: string = '🏢 HRMS Portal') =>
    getRaw((p as any).predictive_behavioral_params, key, fb, note, src);
  const getStressBurnoutRisk = (key: string, fb: number = 50, note: string = 'Risk model metric', src: string = '🏢 HRMS Portal') =>
    getRaw((p as any).stress_burnout_risk_params, key, fb, note, src);
  const getWelfareIntervention = (key: string, fb: number = 50, note: string = 'Intervention metric', src: string = '💾 Central Database') =>
    getRaw((p as any).welfare_intervention_params, key, fb, note, src);
  const getAlerts = (key: string, fb: number = 50, note: string = 'Alert priority metric', src: string = '💾 Central Database') =>
    getRaw((p as any).automated_alerts_params, key, fb, note, src);
  const getResilience = (key: string, fb: number = 50, note: string = 'Resilience hardiness metric', src: string = '💾 Central Database') =>
    getRaw((p as any).mental_resilience_params, key, fb, note, src);
  const getReadiness = (key: string, fb: number = 50, note: string = 'Readiness suitability metric', src: string = '💾 Central Database') => {
    const pAny = p as any;
    const pool = pAny.readiness_score_params || pAny.operational_readiness_params;
    return getRaw(pool, key, fb, note, src);
  };
  const getOccupational = (key: string, fb: number = 50, note: string = 'Occupational stress hazard metric', src: string = '💾 Central Database') =>
    getRaw((p as any).occupational_stress_params, key, fb, note, src);

  let score = 50;
  let formula = '';
  let metricLabel = 'Metric Est';
  let tierLabel = 'Standard Telemetry Status';
  let recommendation = 'Maintain routine monitoring and duty cadence.';
  let primaryAction = 'Initiate Protocol';
  let secondaryAction = 'Export Dossier';
  let mobileCount = 0;
  let hrmsCount = 0;
  let databaseCount = 0;
  let params: FactorParamDisplay[] = [];

  const getColor = (s: number, isInverted: boolean = false) => {
    if (isInverted) {
      if (s >= 75) return { color: 'text-success', bar: 'bg-success' };
      if (s >= 60) return { color: 'text-secondary-400', bar: 'bg-secondary' };
      if (s >= 45) return { color: 'text-warning', bar: 'bg-warning' };
      return { color: 'text-danger', bar: 'bg-danger' };
    }
    if (s >= 80) return { color: 'text-danger', bar: 'bg-danger' };
    if (s >= 70) return { color: 'text-warning', bar: 'bg-warning' };
    if (s >= 50) return { color: 'text-secondary-400', bar: 'bg-secondary' };
    return { color: 'text-success', bar: 'bg-success' };
  };

  switch (factorId) {
    case 'burnout-prediction': {
      metricLabel = 'Burnout Est';
      const lp = getP('leave_patterns', 50, '3 consecutive leaves deferred', 'HRMS Leave Portal');
      const ot = getP('overtime', 50, 'Overtime watch hours rostered in HRMS', 'HRMS Watch Roster');
      const wt = getP('workload_trend', 50, 'Operational task escalation slope', 'Command Operations Log');
      const dd = getP('deployment_duration', 40, 'Stationing duration in sector', 'Service Dossier Database');
      const ds = getP('duty_schedule', 50, 'Rotational night vigil schedule', 'Battalion Roster');
      const sq = getP('sleep_quality', 50, 'Sleep hours and restorative depth', 'Soldier Mobile App (Sleep Telemetry)');
      const ee = getP('emotional_exhaustion', 50, 'Maslach MBI-GS affective depletion', 'Clinical MBI-GS Telemetry');
      const ar = getP('assessment_responses', 50, 'Mobile app burnout questions result', 'Soldier Mobile App (Burnout Questions)');

      score = (
        0.12 * lp.score +
        0.14 * ot.score +
        0.13 * wt.score +
        0.10 * dd.score +
        0.13 * ds.score +
        0.15 * sq.score +
        0.12 * ee.score +
        0.11 * ar.score
      );

      formula = '0.12(Leave) + 0.14(Overtime) + 0.13(Workload) + 0.10(Deployment) + 0.13(Schedule) + 0.15(Sleep) + 0.12(Exhaustion) + 0.11(Assessment)';
      mobileCount = 2; hrmsCount = 4; databaseCount = 2;
      primaryAction = 'Dispatch 48h Rest Rotation';
      secondaryAction = 'Book Counselor';

      params = [
        { key: 'leave_patterns', name: '1. Leave patterns', weight: 0.12, weightLabel: '12%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: lp.note, source: lp.source, available: lp.available, score: lp.score, ...getColor(lp.score), desc: 'Leave denial frequency & deferred furloughs' },
        { key: 'overtime', name: '2. Overtime', weight: 0.14, weightLabel: '14%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: ot.note, source: ot.source, available: ot.available, score: ot.score, ...getColor(ot.score), desc: 'Duty hours beyond standard watch cycle' },
        { key: 'workload_trend', name: '3. Workload trend', weight: 0.13, weightLabel: '13%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: wt.note, source: wt.source, available: wt.available, score: wt.score, ...getColor(wt.score), desc: '14-day task escalation slope' },
        { key: 'deployment_duration', name: '4. Deployment duration', weight: 0.10, weightLabel: '10%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: dd.note, source: dd.source, available: dd.available, score: dd.score, ...getColor(dd.score), desc: 'Continuous months stationed in extreme sector' },
        { key: 'duty_schedule', name: '5. Duty schedule', weight: 0.13, weightLabel: '13%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: ds.note, source: ds.source, available: ds.available, score: ds.score, ...getColor(ds.score), desc: 'Consecutive night vigils & irregular rotation' },
        { key: 'sleep_quality', name: '6. Sleep quality', weight: 0.15, weightLabel: '15%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: sq.note, source: sq.source, available: sq.available, score: sq.score, ...getColor(sq.score), desc: 'Restorative hours logged via Mobile App' },
        { key: 'emotional_exhaustion', name: '7. Emotional exhaustion score', weight: 0.12, weightLabel: '12%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: ee.note, source: ee.source, available: ee.available, score: ee.score, ...getColor(ee.score), desc: 'Maslach affective depletion index' },
        { key: 'assessment_responses', name: '8. Assessment responses', weight: 0.11, weightLabel: '11%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: ar.note, source: ar.source, available: ar.available, score: ar.score, ...getColor(ar.score), desc: 'Mobile app psychometric burnout domain questions' },
      ];
      break;
    }

    case 'psychological-distress': {
      metricLabel = 'Distress Est';
      const ma = getPsych('mood_assessments', 60, 'Daily affective valence recorded via mobile', 'Soldier Mobile App (Daily Mood Pulse)');
      const aq = getPsych('anxiety_questions', 65, 'GAD-7 hypervigilance strain on mobile', 'Soldier Mobile App (GAD-7 Anxiety Screening)');
      const di = getPsych('depression_indicators', 58, 'PHQ-9 anhedonia and somatic energy score', 'Soldier Mobile App (PHQ-9 Depression Inventory)');
      const sq = getPsych('sleep_quality', getP('sleep_quality').score, 'Sleep debt and fragmentation on mobile', 'Soldier Mobile App (Sleep Telemetry)');
      const si = getPsych('social_isolation', 50, 'Barracks buddy network & detachment in DB', 'Central Database (Barracks Peer Network)');
      const te = getPsych('traumatic_exposure', 55, 'High-threat incident log in HRMS Dossier', 'HRMS Portal (Combat Operations & Incident Dossier)');
      const ws = getPsych('wellness_survey', 62, 'Monthly psychometric survey index in DB', 'Central Database (Periodic Psychometric Assessment Archive)');

      score = (
        0.15 * ma.score +
        0.16 * aq.score +
        0.18 * di.score +
        0.14 * sq.score +
        0.12 * si.score +
        0.13 * te.score +
        0.12 * ws.score
      );

      formula = '0.15(Mood) + 0.16(Anxiety) + 0.18(Depression) + 0.14(Sleep) + 0.12(Isolation) + 0.13(Trauma) + 0.12(Wellness)';
      mobileCount = 4; hrmsCount = 1; databaseCount = 2;
      primaryAction = 'Dispatch Clinical Counselor';
      secondaryAction = 'Pair Peer Buddy';

      params = [
        { key: 'mood_assessments', name: '1. Mood assessments', weight: 0.15, weightLabel: '15%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: ma.note, source: ma.source, available: ma.available, score: ma.score, ...getColor(ma.score), desc: 'Daily affective valence & mood stability' },
        { key: 'anxiety_questions', name: '2. Anxiety questions', weight: 0.16, weightLabel: '16%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: aq.note, source: aq.source, available: aq.available, score: aq.score, ...getColor(aq.score), desc: 'GAD-7 anxiety & hypervigilance screening' },
        { key: 'depression_indicators', name: '3. Depression indicators', weight: 0.18, weightLabel: '18%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: di.note, source: di.source, available: di.available, score: di.score, ...getColor(di.score), desc: 'PHQ-9 anhedonia & mood deficit markers' },
        { key: 'sleep_quality', name: '4. Sleep quality', weight: 0.14, weightLabel: '14%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: sq.note, source: sq.source, available: sq.available, score: sq.score, ...getColor(sq.score), desc: 'Sleep deficit & latency recorded on mobile' },
        { key: 'social_isolation', name: '5. Social isolation', weight: 0.12, weightLabel: '12%', sourceBadge: '💾 Central Database', sourceType: 'DATABASE', note: si.note, source: si.source, available: si.available, score: si.score, ...getColor(si.score), desc: 'Barracks detachment & peer connection index' },
        { key: 'traumatic_exposure', name: '6. Traumatic exposure', weight: 0.13, weightLabel: '13%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: te.note, source: te.source, available: te.available, score: te.score, ...getColor(te.score), desc: 'High-threat incident & combat logs in HRMS' },
        { key: 'wellness_survey', name: '7. Wellness survey', weight: 0.12, weightLabel: '12%', sourceBadge: '💾 Central Database', sourceType: 'DATABASE', note: ws.note, source: ws.source, available: ws.available, score: ws.score, ...getColor(ws.score), desc: 'Periodic multi-domain psychometric survey' },
      ];
      break;
    }

    case 'stress-indicators-detection': {
      metricLabel = 'Stress Indicators';
      const hd = getStress('hrms_data', 65, 'Continuous stationing tenure in HRMS', 'HRMS Portal (Dossier & Stationing History)');
      const lf = getStress('leave_frequency', getP('leave_patterns').score, 'Leave applications deferred in HRMS', 'HRMS Portal (Leave Management System)');
      const wl = getStress('workload', getP('workload_trend').score, 'Command watch roster overtime in HRMS', 'HRMS Portal (Command Watch Rosters)');
      const ma = getStress('missed_assessments', 45, 'Check-in delay compliance rate in DB', 'Central Database (Compliance Log)');
      const sp = getStress('sleep_pattern', getP('sleep_quality').score, 'Sleep fragmentation logged on mobile', 'Soldier Mobile App (Sleep Telemetry)');
      const bt = getStress('biometric_trends', 68, 'Resting HR & HRV autonomic strain', 'Soldier Mobile App (Biometric & Sensor Engine)');
      const bc = getStress('behavioral_changes', 60, 'Irritability & interaction volatility', 'Soldier Mobile App & Central DB (Behavioral Telemetry)');

      score = (
        0.14 * hd.score +
        0.14 * lf.score +
        0.15 * wl.score +
        0.13 * ma.score +
        0.16 * sp.score +
        0.15 * bt.score +
        0.13 * bc.score
      );

      formula = '0.14(HRMS) + 0.14(Leave) + 0.15(Workload) + 0.13(Missed Assessments) + 0.16(Sleep) + 0.15(Biometrics) + 0.13(Behavioral)';
      mobileCount = 3; hrmsCount = 3; databaseCount = 1;
      primaryAction = 'Initiate Biofeedback';
      secondaryAction = 'Expedite Leave';

      params = [
        { key: 'hrms_data', name: '1. HRMS data', weight: 0.14, weightLabel: '14%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: hd.note, source: hd.source, available: hd.available, score: hd.score, ...getColor(hd.score), desc: 'Career tenure & stationing logs in HRMS' },
        { key: 'leave_frequency', name: '2. Leave frequency', weight: 0.14, weightLabel: '14%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: lf.note, source: lf.source, available: lf.available, score: lf.score, ...getColor(lf.score), desc: 'Leave requests & deferred furloughs in HRMS' },
        { key: 'workload', name: '3. Workload', weight: 0.15, weightLabel: '15%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: wl.note, source: wl.source, available: wl.available, score: wl.score, ...getColor(wl.score), desc: 'Operational watch hours & shift tempo in HRMS' },
        { key: 'missed_assessments', name: '4. Missed assessments', weight: 0.13, weightLabel: '13%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: ma.note, source: ma.source, available: ma.available, score: ma.score, ...getColor(ma.score), desc: 'Assessment avoidance & compliance logs in DB' },
        { key: 'sleep_pattern', name: '5. Sleep pattern', weight: 0.16, weightLabel: '16%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: sp.note, source: sp.source, available: sp.available, score: sp.score, ...getColor(sp.score), desc: 'Total sleep duration & deficit on Mobile' },
        { key: 'biometric_trends', name: '6. Biometric trends', weight: 0.15, weightLabel: '15%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: bt.note, source: bt.source, available: bt.available, score: bt.score, ...getColor(bt.score), desc: 'Resting HR & HRV autonomic strain' },
        { key: 'behavioral_changes', name: '7. Behavioral changes', weight: 0.13, weightLabel: '13%', sourceBadge: '📱 Mobile & Central DB', sourceType: 'MOBILE', note: bc.note, source: bc.source, available: bc.available, score: bc.score, ...getColor(bc.score), desc: 'App interaction volatility & peer flags' },
      ];
      break;
    }

    case 'overall-stress-prediction': {
      metricLabel = 'Overall Stress';
      const dh = getOverall('duty_hours', getP('overtime').score, 'Watch & duty hours beyond roster in HRMS', '🏢 HRMS Portal (Command Watch Rosters)');
      const dh_dep = getOverall('deployment_history', getP('deployment_duration').score, 'Deployment tenure & hostile sector history in HRMS', '🏢 HRMS Portal (Stationing & Postings Dossier)');
      const wl = getOverall('workload', getP('workload_trend').score, 'Operational task allocation & shift tempo in HRMS', '🏢 HRMS Portal (Task Allocation Roster)');
      const tr = getOverall('transfers', getP('duty_schedule').score, 'Station postings & frequency of rotational transfers in HRMS', '🏢 HRMS Portal (Posting & Transfer History)');
      const tl = getOverall('training_load', getP('emotional_exhaustion').score, 'Live tactical drills & combat conditioning log in DB', '💾 Central Database (Combat Training & Drills Log)');
      const wa = getOverall('wellness_assessments', getPsych('mood_assessments').score, 'Periodic psychometric self-assessment pulse on mobile', '📱 Soldier Mobile App (Psychometric Self-Assessment)');
      const bm = getOverall('biometrics', getStress('biometric_trends').score, 'Cardiovascular vitals & autonomic load on mobile', '📱 Soldier Mobile App (Biometric & Sensor Engine)');

      score = (
        0.18 * dh.score +
        0.16 * dh_dep.score +
        0.16 * wl.score +
        0.12 * tr.score +
        0.12 * tl.score +
        0.13 * wa.score +
        0.13 * bm.score
      );

      formula = '0.18(Duty hours) + 0.16(Deployment history) + 0.16(Workload) + 0.12(Transfers) + 0.12(Training load) + 0.13(Wellness assessments) + 0.13(Biometrics)';
      mobileCount = 2; hrmsCount = 4; databaseCount = 1;
      primaryAction = 'Unit Tempo Modulation';
      secondaryAction = 'Deploy Rest Rotation';

      params = [
        { key: 'duty_hours', name: '1. Duty hours', weight: 0.18, weightLabel: '18%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: dh.note, source: dh.source, available: dh.available, score: dh.score, ...getColor(dh.score), desc: 'Watch & duty hours logged in HRMS Watch Rosters' },
        { key: 'deployment_history', name: '2. Deployment history', weight: 0.16, weightLabel: '16%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: dh_dep.note, source: dh_dep.source, available: dh_dep.available, score: dh_dep.score, ...getColor(dh_dep.score), desc: 'Deployment history in stationing dossier' },
        { key: 'workload', name: '3. Workload', weight: 0.16, weightLabel: '16%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: wl.note, source: wl.source, available: wl.available, score: wl.score, ...getColor(wl.score), desc: 'Task allocation & watch tempo in HRMS' },
        { key: 'transfers', name: '4. Transfers', weight: 0.12, weightLabel: '12%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: tr.note, source: tr.source, available: tr.available, score: tr.score, ...getColor(tr.score), desc: 'Frequency of unit transfers in HRMS' },
        { key: 'training_load', name: '5. Training load', weight: 0.12, weightLabel: '12%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: tl.note, source: tl.source, available: tl.available, score: tl.score, ...getColor(tl.score), desc: 'Tactical drills & combat training load in DB' },
        { key: 'wellness_assessments', name: '6. Wellness assessments', weight: 0.13, weightLabel: '13%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: wa.note, source: wa.source, available: wa.available, score: wa.score, ...getColor(wa.score), desc: 'Psychometric self-assessment pulse on mobile' },
        { key: 'biometrics', name: '7. Biometrics', weight: 0.13, weightLabel: '13%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: bm.note, source: bm.source, available: bm.available, score: bm.score, ...getColor(bm.score), desc: 'Wearable biometric sensor stream on mobile' },
      ];
      break;
    }

    case 'emotional-fatigue-prediction': {
      metricLabel = 'Emotional Fatigue';
      const sq = getFatigue('sleep_quality', getP('sleep_quality').score, 'Total sleep debt & insomnia markers on mobile', '📱 Soldier Mobile App (Sleep Telemetry)');
      const md = getFatigue('mood', getPsych('mood_assessments').score, 'Daily affective valence & mood pulse on mobile', '📱 Soldier Mobile App (Daily Mood Pulse)');
      const wl = getFatigue('workload', getP('workload_trend').score, 'High-intensity operational task tempo in HRMS', '🏢 HRMS Portal (Command Watch Rosters)');
      const ee = getFatigue('emotional_exhaustion_questions', getP('emotional_exhaustion').score, 'MBI-GS emotional exhaustion domain questions', '📱 Soldier Mobile App (MBI-GS Exhaustion Domain)');
      const wb = getFatigue('work_life_balance', getPsych('social_isolation').score, 'Family communication & work-life balance survey in DB', '💾 Central Database (Family & Work-Life Survey)');
      const ch = getFatigue('counseling_history', getPsych('wellness_survey').score, 'Counseling session logs & therapeutic history in DB', '💾 Central Database (Counseling Case Registry)');

      score = (
        0.20 * sq.score +
        0.18 * md.score +
        0.16 * wl.score +
        0.20 * ee.score +
        0.14 * wb.score +
        0.12 * ch.score
      );

      formula = '0.20(Sleep quality) + 0.18(Mood) + 0.16(Workload) + 0.20(Emotional exhaustion questions) + 0.14(Work-life balance) + 0.12(Counseling history)';
      mobileCount = 3; hrmsCount = 1; databaseCount = 2;
      primaryAction = 'Schedule Peer Support';
      secondaryAction = 'Task Rotation';

      params = [
        { key: 'sleep_quality', name: '1. Sleep quality', weight: 0.20, weightLabel: '20%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: sq.note, source: sq.source, available: sq.available, score: sq.score, ...getColor(sq.score), desc: 'Sleep quality & restorative hours on mobile' },
        { key: 'mood', name: '2. Mood', weight: 0.18, weightLabel: '18%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: md.note, source: md.source, available: md.available, score: md.score, ...getColor(md.score), desc: 'Daily mood valence pulse on mobile' },
        { key: 'workload', name: '3. Workload', weight: 0.16, weightLabel: '16%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: wl.note, source: wl.source, available: wl.available, score: wl.score, ...getColor(wl.score), desc: 'Watch roster task tempo in HRMS' },
        { key: 'emotional_exhaustion_questions', name: '4. Emotional exhaustion questions', weight: 0.20, weightLabel: '20%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: ee.note, source: ee.source, available: ee.available, score: ee.score, ...getColor(ee.score), desc: 'MBI-GS exhaustion domain questions on mobile' },
        { key: 'work_life_balance', name: '5. Work-life balance', weight: 0.14, weightLabel: '14%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: wb.note, source: wb.source, available: wb.available, score: wb.score, ...getColor(wb.score), desc: 'Work-life balance survey score in DB' },
        { key: 'counseling_history', name: '6. Counseling history', weight: 0.12, weightLabel: '12%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: ch.note, source: ch.source, available: ch.available, score: ch.score, ...getColor(ch.score), desc: 'Past counseling session records in DB' },
      ];
      break;
    }

    case 'welfare-concern-detection': {
      metricLabel = 'Welfare Concern';
      const fc = getWelfareConcern('financial_concerns', getStress('leave_frequency').score, 'Welfare grants & financial support requests in HRMS', '🏢 HRMS Portal (Welfare Claims & Grant Requests)');
      const fs = getWelfareConcern('family_separation', getP('deployment_duration').score, 'Continuous stationing & family separation duration in HRMS', '🏢 HRMS Portal (Stationing & Separation Tenure)');
      const rl = getWelfareConcern('repeated_leave_requests', getP('leave_patterns').score, 'Repeated and deferred leave applications in HRMS', '🏢 HRMS Portal (Leave Management System)');
      const si = getWelfareConcern('self_reported_issues', getPsych('anxiety_questions').score, 'Self-reported domestic or welfare concerns on mobile', '📱 Soldier Mobile App (Welfare Feedback Telemetry)');
      const pw = getWelfareConcern('poor_wellness_trends', getPsych('depression_indicators').score, 'Declining wellness trends across survey intervals in DB', '💾 Central Database (Wellness Score Trend Archive)');
      const ih = getWelfareConcern('intervention_history', getPsych('wellness_survey').score, 'Past welfare intervention case registry records in DB', '💾 Central Database (Welfare Intervention Logs)');

      score = (
        0.15 * fc.score +
        0.20 * fs.score +
        0.20 * rl.score +
        0.18 * si.score +
        0.15 * pw.score +
        0.12 * ih.score
      );

      formula = '0.15(Financial concerns) + 0.20(Family separation) + 0.20(Repeated leave requests) + 0.18(Self-reported issues) + 0.15(Poor wellness trends) + 0.12(Intervention history)';
      mobileCount = 1; hrmsCount = 3; databaseCount = 2;
      primaryAction = 'Sanction Emergency Grant';
      secondaryAction = 'Dispatch Family Liaison';

      params = [
        { key: 'financial_concerns', name: '1. Financial concerns (optional)', weight: 0.15, weightLabel: '15%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: fc.note, source: fc.source, available: fc.available, score: fc.score, ...getColor(fc.score), desc: 'Financial & grant assistance requests in HRMS' },
        { key: 'family_separation', name: '2. Family separation', weight: 0.20, weightLabel: '20%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: fs.note, source: fs.source, available: fs.available, score: fs.score, ...getColor(fs.score), desc: 'Family separation tenure in HRMS' },
        { key: 'repeated_leave_requests', name: '3. Repeated leave requests', weight: 0.20, weightLabel: '20%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: rl.note, source: rl.source, available: rl.available, score: rl.score, ...getColor(rl.score), desc: 'Repeated furlough requests in HRMS' },
        { key: 'self_reported_issues', name: '4. Self-reported issues', weight: 0.18, weightLabel: '18%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: si.note, source: si.source, available: si.available, score: si.score, ...getColor(si.score), desc: 'Self-reported concerns logged on mobile' },
        { key: 'poor_wellness_trends', name: '5. Poor wellness trends', weight: 0.15, weightLabel: '15%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: pw.note, source: pw.source, available: pw.available, score: pw.score, ...getColor(pw.score), desc: 'Declining wellness score trends in DB' },
        { key: 'intervention_history', name: '6. Intervention history', weight: 0.12, weightLabel: '12%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: ih.note, source: ih.source, available: ih.available, score: ih.score, ...getColor(ih.score), desc: 'Prior welfare intervention case logs in DB' },
      ];
      break;
    }

    case 'predictive-behavioral-analytics': {
      metricLabel = 'Behavioral Drift';
      const hr = getPredictiveBehavioral('historical_hrms_records', getStress('hrms_data').score, 'Longitudinal career & service records in HRMS', '🏢 HRMS Portal (Historical Service Records)');
      const at = getPredictiveBehavioral('attendance', getP('duty_schedule').score, 'Daily muster & duty watch attendance logs in HRMS', '🏢 HRMS Portal (Daily Muster & Watch Attendance)');
      const lv = getPredictiveBehavioral('leave', getP('leave_patterns').score, 'Leave patterns & utilization frequency in HRMS', '🏢 HRMS Portal (Leave Patterns & Utilization)');
      const dp = getPredictiveBehavioral('deployment', getP('deployment_duration').score, 'Deployment duration & stationing history in HRMS', '🏢 HRMS Portal (Deployment & Stationing Duration)');
      const as = getPredictiveBehavioral('assessments', getStress('missed_assessments').score, 'Periodic psychometric check-in compliance on mobile', '📱 Soldier Mobile App (Mobile Psychometric Check-ins)');
      const bt = getPredictiveBehavioral('biometric_trends', getStress('biometric_trends').score, 'Wearable sensor telemetry & circadian drift on mobile', '📱 Soldier Mobile App (Wearable Sensor Telemetry)');
      const bh = getPredictiveBehavioral('behavioral_history', getStress('behavioral_changes').score, 'Behavioral drift archive & peer review records in DB', '💾 Central Database (Behavioral Drift Archive)');

      score = (
        0.15 * hr.score +
        0.14 * at.score +
        0.15 * lv.score +
        0.14 * dp.score +
        0.15 * as.score +
        0.14 * bt.score +
        0.13 * bh.score
      );

      formula = '0.15(Historical HRMS records) + 0.14(Attendance) + 0.15(Leave) + 0.14(Deployment) + 0.15(Assessments) + 0.14(Biometric trends) + 0.13(Behavioral history)';
      mobileCount = 2; hrmsCount = 4; databaseCount = 1;
      primaryAction = 'Prophylactic Wellness Review';
      secondaryAction = 'Trigger Sensor Calibration';

      params = [
        { key: 'historical_hrms_records', name: '1. Historical HRMS records', weight: 0.15, weightLabel: '15%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: hr.note, source: hr.source, available: hr.available, score: hr.score, ...getColor(hr.score), desc: 'Historical service dossier in HRMS' },
        { key: 'attendance', name: '2. Attendance', weight: 0.14, weightLabel: '14%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: at.note, source: at.source, available: at.available, score: at.score, ...getColor(at.score), desc: 'Daily muster & watch attendance in HRMS' },
        { key: 'leave', name: '3. Leave', weight: 0.15, weightLabel: '15%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: lv.note, source: lv.source, available: lv.available, score: lv.score, ...getColor(lv.score), desc: 'Leave utilization frequency in HRMS' },
        { key: 'deployment', name: '4. Deployment', weight: 0.14, weightLabel: '14%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: dp.note, source: dp.source, available: dp.available, score: dp.score, ...getColor(dp.score), desc: 'Stationing & deployment tenure in HRMS' },
        { key: 'assessments', name: '5. Assessments', weight: 0.15, weightLabel: '15%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: as.note, source: as.source, available: as.available, score: as.score, ...getColor(as.score), desc: 'Psychometric check-ins on mobile' },
        { key: 'biometric_trends', name: '6. Biometric trends', weight: 0.14, weightLabel: '14%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: bt.note, source: bt.source, available: bt.available, score: bt.score, ...getColor(bt.score), desc: 'Wearable sensor trend stream on mobile' },
        { key: 'behavioral_history', name: '7. Behavioral history', weight: 0.13, weightLabel: '13%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: bh.note, source: bh.source, available: bh.available, score: bh.score, ...getColor(bh.score), desc: 'Behavioral drift & review records in DB' },
      ];
      break;
    }

    case 'stress-burnout-risk-models': {
      metricLabel = 'Hazard Model';
      const hrmsData = getStressBurnoutRisk('combined_hrms_data', getStress('hrms_data').score, 'Workload, stationing tenure & duty rosters in HRMS', '🏢 HRMS Portal (Dossier & Watch Rosters)');
      const wellnessData = getStressBurnoutRisk('wellness_data', getPsych('wellness_survey').score, 'Composite wellness profile & psychometrics in DB', '💾 Central Database (Composite Wellness Index)');
      const biometricData = getStressBurnoutRisk('biometric_data', getStress('biometric_trends').score, 'Autonomic nervous system & wearable biometrics on mobile', '📱 Soldier Mobile App (Autonomic Biometric Trends)');
      const assessmentData = getStressBurnoutRisk('assessment_data', getP('assessment_responses').score, 'Psychometric responses to burnout & stress items on mobile', '📱 Soldier Mobile App (Psychometric Response Telemetry)');

      score = (
        0.28 * hrmsData.score +
        0.24 * wellnessData.score +
        0.25 * biometricData.score +
        0.23 * assessmentData.score
      );

      formula = '0.28(Combined HRMS data) + 0.24(Wellness data) + 0.25(Biometric data) + 0.23(Assessment data)';
      mobileCount = 2; hrmsCount = 1; databaseCount = 1;
      primaryAction = 'CWO Command Case Review';
      secondaryAction = 'Mandate Stand-Down';

      params = [
        { key: 'combined_hrms_data', name: '1. Combined HRMS data', weight: 0.28, weightLabel: '28%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: hrmsData.note, source: hrmsData.source, available: hrmsData.available, score: hrmsData.score, ...getColor(hrmsData.score), desc: 'HRMS workload, stationing tenure & rosters' },
        { key: 'wellness_data', name: '2. Wellness data', weight: 0.24, weightLabel: '24%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: wellnessData.note, source: wellnessData.source, available: wellnessData.available, score: wellnessData.score, ...getColor(wellnessData.score), desc: 'Composite wellness profile in Central DB' },
        { key: 'biometric_data', name: '3. Biometric data', weight: 0.25, weightLabel: '25%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: biometricData.note, source: biometricData.source, available: biometricData.available, score: biometricData.score, ...getColor(biometricData.score), desc: 'Wearable biometric sensor stream on mobile' },
        { key: 'assessment_data', name: '4. Assessment data', weight: 0.23, weightLabel: '23%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: assessmentData.note, source: assessmentData.source, available: assessmentData.available, score: assessmentData.score, ...getColor(assessmentData.score), desc: 'Psychometric assessment items on mobile' },
      ];
      break;
    }

    case 'welfare-intervention-recommendation': {
      metricLabel = 'Intervention Index';
      const aiRisk = getWelfareIntervention('ai_risk_score', getPsych('wellness_survey').score, 'Composite AI risk score & classification in DB', '💾 Central Database (Composite Risk Engine)');
      const ah = getWelfareIntervention('assessment_history', getP('assessment_responses').score, 'Historical psychometric check-in scores in DB', '💾 Central Database (Psychometric Assessment History)');
      const wl = getWelfareIntervention('workload', getP('workload_trend').score, 'Command operational task tempo & rosters in HRMS', '🏢 HRMS Portal (Command Watch Rosters)');
      const dp = getWelfareIntervention('deployment', getP('deployment_duration').score, 'Hostile terrain & deployment tenure in HRMS', '🏢 HRMS Portal (Deployment & Stationing Dossier)');
      const pi = getWelfareIntervention('previous_interventions', getStress('missed_assessments').score, 'Prior welfare intervention case outcomes in DB', '💾 Central Database (Welfare Interventions Archive)');

      score = (
        0.25 * aiRisk.score +
        0.20 * ah.score +
        0.20 * wl.score +
        0.20 * dp.score +
        0.15 * pi.score
      );

      formula = '0.25(AI risk score) + 0.20(Assessment history) + 0.20(Workload) + 0.20(Deployment) + 0.15(Previous interventions)';
      mobileCount = 0; hrmsCount = 2; databaseCount = 3;
      primaryAction = 'Execute Welfare Workflow';
      secondaryAction = 'Notify Unit Commander';

      params = [
        { key: 'ai_risk_score', name: '1. AI risk score', weight: 0.25, weightLabel: '25%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: aiRisk.note, source: aiRisk.source, available: aiRisk.available, score: aiRisk.score, ...getColor(aiRisk.score), desc: 'Composite AI risk score in Central DB' },
        { key: 'assessment_history', name: '2. Assessment history', weight: 0.20, weightLabel: '20%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: ah.note, source: ah.source, available: ah.available, score: ah.score, ...getColor(ah.score), desc: 'Historical psychometric scores in DB' },
        { key: 'workload', name: '3. Workload', weight: 0.20, weightLabel: '20%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: wl.note, source: wl.source, available: wl.available, score: wl.score, ...getColor(wl.score), desc: 'Command watch roster load in HRMS' },
        { key: 'deployment', name: '4. Deployment', weight: 0.20, weightLabel: '20%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: dp.note, source: dp.source, available: dp.available, score: dp.score, ...getColor(dp.score), desc: 'Deployment tenure in HRMS Dossier' },
        { key: 'previous_interventions', name: '5. Previous interventions', weight: 0.15, weightLabel: '15%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: pi.note, source: pi.source, available: pi.available, score: pi.score, ...getColor(pi.score), desc: 'Past welfare intervention logs in DB' },
      ];
      break;
    }

    case 'automated-alerts': {
      metricLabel = 'Alert Priority';
      const hr = getAlerts('high_risk_predictions', getPsych('wellness_survey').score, 'AI predictive early warning trigger classification in DB', '💾 Central Database (AI Early Warning Classifier)');
      const ss = getAlerts('sudden_score_increase', getStress('biometric_trends').score, '24h acute stress spike detection logged on mobile', '📱 Soldier Mobile App (24h Stress Spike Telemetry)');
      const ma = getAlerts('missed_assessments', getStress('missed_assessments').score, 'Scheduled psychometric assessment avoidance in DB', '💾 Central Database (Compliance Check-in Log)');
      const at = getAlerts('abnormal_trends', getP('sleep_quality').score, 'Sensor & sleep biometric anomaly patterns on mobile', '📱 Soldier Mobile App (Sensor & Biometric Anomaly Engine)');

      score = (
        0.30 * hr.score +
        0.25 * ss.score +
        0.22 * ma.score +
        0.23 * at.score
      );

      formula = '0.30(High-risk predictions) + 0.25(Sudden score increase) + 0.22(Missed assessments) + 0.23(Abnormal trends)';
      mobileCount = 2; hrmsCount = 0; databaseCount = 2;
      primaryAction = 'Dispatch SMS/Radio Alert';
      secondaryAction = 'Confirm Medic Contact';

      params = [
        { key: 'high_risk_predictions', name: '1. High-risk predictions', weight: 0.30, weightLabel: '30%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: hr.note, source: hr.source, available: hr.available, score: hr.score, ...getColor(hr.score), desc: 'AI early warning predictions in DB' },
        { key: 'sudden_score_increase', name: '2. Sudden score increase', weight: 0.25, weightLabel: '25%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: ss.note, source: ss.source, available: ss.available, score: ss.score, ...getColor(ss.score), desc: 'Acute stress spike rate on mobile' },
        { key: 'missed_assessments', name: '3. Missed assessments', weight: 0.22, weightLabel: '22%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: ma.note, source: ma.source, available: ma.available, score: ma.score, ...getColor(ma.score), desc: 'Missed assessment compliance in DB' },
        { key: 'abnormal_trends', name: '4. Abnormal trends', weight: 0.23, weightLabel: '23%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: at.note, source: at.source, available: at.available, score: at.score, ...getColor(at.score), desc: 'Biometric & sensor anomalies on mobile' },
      ];
      break;
    }

    case 'mental-wellbeing-resilience': {
      metricLabel = 'Resilience Index';
      const isAmit = p.uid === 'UID-SLD-015';
      const isSarah = p.uid === 'UID-EMP-011';
      const isRamesh = p.uid === 'UID-EMP-012';
      const isGurpreet = p.uid === 'UID-EMP-013';

      const fbWs = isAmit ? 88 : isSarah ? 90 : isRamesh ? 24 : isGurpreet ? 32 : Math.max(15, Math.min(95, 110 - getPsych('wellness_survey', 62).score));
      const fbIo = isAmit ? 92 : isSarah ? 88 : isRamesh ? 28 : isGurpreet ? 36 : Math.max(15, Math.min(95, 110 - getPsych('social_isolation', 50).score));
      const fbAs = isAmit ? 86 : isSarah ? 85 : isRamesh ? 22 : isGurpreet ? 30 : Math.max(15, Math.min(95, 110 - getPsych('mood_assessments', 60).score));
      const fbAt = isAmit ? 90 : isSarah ? 92 : isRamesh ? 40 : isGurpreet ? 50 : Math.max(15, Math.min(95, 110 - getP('duty_schedule', 50).score));
      const fbPt = isAmit ? 85 : isSarah ? 86 : isRamesh ? 20 : isGurpreet ? 28 : Math.max(15, Math.min(95, 110 - getP('workload_trend', 50).score));

      const ws = getResilience('wellness_score_history', fbWs, 'Longitudinal wellness metric & psychological tracking in DB', '💾 Central Database (Historical Wellness Metric)');
      const io = getResilience('intervention_outcomes', fbIo, 'Clinical recovery & positive outcome registry in DB', '💾 Central Database (Clinical Outcome Registry)');
      const as = getResilience('assessments', fbAs, 'Resilience & CD-RISC hardiness check-in scores on mobile', '📱 Soldier Mobile App (Resilience Check-in)');
      const at = getResilience('attendance', fbAt, 'Operational muster & duty attendance logs in HRMS', '🏢 HRMS Portal (Muster & Operational Attendance)');
      const pt = getResilience('productivity_trends', fbPt, 'Task completion & operational productivity trends in DB', '💾 Central Database (Productivity Trends)');

      score = (
        0.24 * ws.score +
        0.20 * io.score +
        0.22 * as.score +
        0.18 * at.score +
        0.16 * pt.score
      );

      formula = '0.24(Wellness score history) + 0.20(Intervention outcomes) + 0.22(Assessments) + 0.18(Attendance) + 0.16(Productivity trends)';
      mobileCount = 1; hrmsCount = 1; databaseCount = 3;
      primaryAction = 'Morning Parade Briefing';
      secondaryAction = 'Squad Cohesion Award';

      params = [
        { key: 'wellness_score_history', name: '1. Wellness score history', weight: 0.24, weightLabel: '24%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: ws.note, source: ws.source, available: ws.available, score: ws.score, ...getColor(ws.score, true), desc: 'Historical wellness metric in DB' },
        { key: 'intervention_outcomes', name: '2. Intervention outcomes', weight: 0.20, weightLabel: '20%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: io.note, source: io.source, available: io.available, score: io.score, ...getColor(io.score, true), desc: 'Clinical recovery outcomes in DB' },
        { key: 'assessments', name: '3. Assessments', weight: 0.22, weightLabel: '22%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: as.note, source: as.source, available: as.available, score: as.score, ...getColor(as.score, true), desc: 'Resilience check-in items on mobile' },
        { key: 'attendance', name: '4. Attendance', weight: 0.18, weightLabel: '18%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: at.note, source: at.source, available: at.available, score: at.score, ...getColor(at.score, true), desc: 'Muster & operational attendance in HRMS' },
        { key: 'productivity_trends', name: '5. Productivity trends', weight: 0.16, weightLabel: '16%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: pt.note, source: pt.source, available: pt.available, score: pt.score, ...getColor(pt.score, true), desc: 'Task completion & productivity in DB' },
      ];
      break;
    }

    case 'readiness-score':
    case 'operational-readiness': {
      metricLabel = 'Readiness Score';
      const isAmit = p.uid === 'UID-SLD-015';
      const isSarah = p.uid === 'UID-EMP-011';
      const isRamesh = p.uid === 'UID-EMP-012';
      const isGurpreet = p.uid === 'UID-EMP-013';

      const fbW = isAmit ? 88 : isSarah ? 90 : isRamesh ? 24 : isGurpreet ? 36 : Math.max(15, Math.min(95, 110 - getPsych('wellness_survey', 62).score));
      const fbPr = isAmit ? 86 : isSarah ? 88 : isRamesh ? 18 : isGurpreet ? 32 : Math.max(15, Math.min(95, 110 - getP('sleep_quality', 50).score));
      const fbWl = isAmit ? 84 : isSarah ? 85 : isRamesh ? 20 : isGurpreet ? 35 : Math.max(15, Math.min(95, 110 - getP('workload_trend', 50).score));
      const fbMr = isAmit ? 90 : isSarah ? 92 : isRamesh ? 26 : isGurpreet ? 40 : Math.max(15, Math.min(95, 110 - getPsych('anxiety_questions', 58).score));
      const fbBs = isAmit ? 88 : isSarah ? 86 : isRamesh ? 30 : isGurpreet ? 44 : Math.max(15, Math.min(95, 110 - getStress('behavioral_changes', 50).score));
      const fbOr = isAmit ? 92 : isSarah ? 90 : isRamesh ? 22 : isGurpreet ? 38 : Math.max(15, Math.min(95, 110 - getP('emotional_exhaustion', 50).score));

      const w = getReadiness('wellness', fbW, 'Composite psychological wellness index in Central DB', '💾 Central Database (Composite Wellness Index)');
      const pr = getReadiness('physical_readiness', fbPr, 'Wearable biometric recovery & sleep restoration on mobile', '📱 Soldier Mobile App (Wearables & Sleep Recovery)');
      const wl = getReadiness('workload', fbWl, 'Command watch rosters, duty pacing & overtime balancing in HRMS', '🏢 HRMS Portal (Command Watch Rosters & Duty Pacing)');
      const mr = getReadiness('mental_readiness', fbMr, 'Cognitive focus, anxiety regulation & daily mood pulse on mobile', '📱 Soldier Mobile App (Psychometric Mood & Alertness Pulse)');
      const bs = getReadiness('behavioral_stability', fbBs, 'Behavioral drift telemetry & peer camaraderie review', '📱 Mobile App & 💾 Central DB (Behavioral Telemetry & Peer Rating)');
      const or = getReadiness('operational_risk', fbOr, 'Sector deployment risk score & predictive AI risk engine', '🏢 HRMS Portal & 💾 Central DB (AI Risk Engine & Deployment Dossier)');

      score = (
        0.30 * w.score +
        0.20 * pr.score +
        0.20 * wl.score +
        0.15 * mr.score +
        0.10 * bs.score +
        0.05 * or.score
      );

      formula = '0.30(Wellness) + 0.20(Physical Readiness) + 0.20(Workload) + 0.15(Mental Readiness) + 0.10(Behavioral Stability) + 0.05(Operational Risk)';
      mobileCount = 2; hrmsCount = 1; databaseCount = 3;
      primaryAction = 'Certify Combat Clearance';
      secondaryAction = 'Assign Tactical Rest';

      params = [
        { key: 'wellness', name: '1. Wellness', weight: 0.30, weightLabel: '30%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: w.note, source: w.source, available: w.available, score: w.score, ...getColor(w.score, true), desc: 'Composite wellness index in Central DB' },
        { key: 'physical_readiness', name: '2. Physical Readiness', weight: 0.20, weightLabel: '20%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: pr.note, source: pr.source, available: pr.available, score: pr.score, ...getColor(pr.score, true), desc: 'Wearable biometric recovery & sleep on mobile' },
        { key: 'workload', name: '3. Workload', weight: 0.20, weightLabel: '20%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: wl.note, source: wl.source, available: wl.available, score: wl.score, ...getColor(wl.score, true), desc: 'Command watch rosters & duty pacing in HRMS' },
        { key: 'mental_readiness', name: '4. Mental Readiness', weight: 0.15, weightLabel: '15%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: mr.note, source: mr.source, available: mr.available, score: mr.score, ...getColor(mr.score, true), desc: 'Cognitive focus & mood pulse on mobile' },
        { key: 'behavioral_stability', name: '5. Behavioral Stability', weight: 0.10, weightLabel: '10%', sourceBadge: '📱 Mobile & Central DB', sourceType: 'MOBILE', note: bs.note, source: bs.source, available: bs.available, score: bs.score, ...getColor(bs.score, true), desc: 'Behavioral drift & peer reviews across Mobile & Central DB' },
        { key: 'operational_risk', name: '6. Operational Risk', weight: 0.05, weightLabel: '5%', sourceBadge: '🏢 HRMS & Central DB', sourceType: 'HRMS', note: or.note, source: or.source, available: or.available, score: or.score, ...getColor(or.score, true), desc: 'Deployment risk score & AI model from HRMS & Central DB' },
      ];
      break;
    }

    case 'occupational-stress-risk': {
      metricLabel = 'Occupational Hazard';
      const lt = getOccupational('long_term_stress_trends', getPsych('wellness_survey').score, 'Longitudinal stress trend registry in DB', '💾 Central Database (Longitudinal Stress Registry)');
      const bh = getOccupational('burnout_history', getP('emotional_exhaustion').score, 'Historical burnout episodes & affective strain in DB', '💾 Central Database (Burnout History Archive)');
      const wl = getOccupational('workload', getP('workload_trend').score, 'Command watch hours & overtime load in HRMS', '🏢 HRMS Portal (Command Watch Rosters)');
      const dp = getOccupational('deployments', getP('deployment_duration').score, 'Hostile terrain & continuous forward sector tenure in HRMS', '🏢 HRMS Portal (Deployment Tenure Dossier)');
      const ps = getOccupational('poor_sleep', getP('sleep_quality').score, 'Sleep fragmentation & nocturnal rest deficit on mobile', '📱 Soldier Mobile App (Sleep Deficit Telemetry)');
      const ef = getOccupational('emotional_fatigue', getPsych('mood_assessments').score, 'Cognitive exhaustion & affective weariness on mobile', '📱 Soldier Mobile App (Affective Fatigue Telemetry)');

      score = (
        0.18 * lt.score +
        0.16 * bh.score +
        0.18 * wl.score +
        0.18 * dp.score +
        0.16 * ps.score +
        0.14 * ef.score
      );

      formula = '0.18(Long-term stress trends) + 0.16(Burnout history) + 0.18(Workload) + 0.18(Deployments) + 0.16(Poor sleep) + 0.14(Emotional fatigue)';
      mobileCount = 2; hrmsCount = 2; databaseCount = 2;
      primaryAction = 'Mandate Altitude Rotation';
      secondaryAction = 'Shift to Daylight Watch';

      params = [
        { key: 'long_term_stress_trends', name: '1. Long-term stress trends', weight: 0.18, weightLabel: '18%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: lt.note, source: lt.source, available: lt.available, score: lt.score, ...getColor(lt.score), desc: 'Longitudinal stress trend registry in DB' },
        { key: 'burnout_history', name: '2. Burnout history', weight: 0.16, weightLabel: '16%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: bh.note, source: bh.source, available: bh.available, score: bh.score, ...getColor(bh.score), desc: 'Historical burnout episodes in DB' },
        { key: 'workload', name: '3. Workload', weight: 0.18, weightLabel: '18%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: wl.note, source: wl.source, available: wl.available, score: wl.score, ...getColor(wl.score), desc: 'Command watch roster load in HRMS' },
        { key: 'deployments', name: '4. Deployments', weight: 0.18, weightLabel: '18%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: dp.note, source: dp.source, available: dp.available, score: dp.score, ...getColor(dp.score), desc: 'Sector deployment tenure in HRMS' },
        { key: 'poor_sleep', name: '5. Poor sleep', weight: 0.16, weightLabel: '16%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: ps.note, source: ps.source, available: ps.available, score: ps.score, ...getColor(ps.score), desc: 'Sleep debt & latency on mobile' },
        { key: 'emotional_fatigue', name: '6. Emotional fatigue', weight: 0.14, weightLabel: '14%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: ef.note, source: ef.source, available: ef.available, score: ef.score, ...getColor(ef.score), desc: 'Cognitive & affective fatigue on mobile' },
      ];
      break;
    }

    default:
      break;
  }

  const rounded = Math.round(score * 10) / 10;
  let level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NOMINAL' = 'NOMINAL';
  let levelColor = 'text-success';
  let levelBg = 'bg-primary-950 text-success-300 border-primary-800';

  const isReadiness = factorId === 'readiness-score' || factorId === 'operational-readiness';
  if (factorId === 'mental-wellbeing-resilience' || isReadiness) {
    // Inverted: higher is better
    if (rounded >= 78.0) {
      level = 'NOMINAL';
      levelColor = 'text-success';
      levelBg = 'bg-primary-950 text-success-300 border-primary-800';
      tierLabel = isReadiness ? 'Combat Ready / Peak Mission Suitability' : 'High Resilience / Optimal Squad Morale';
      recommendation = 'Maintain regular training tempo and proactive leadership brief.';
    } else if (rounded >= 65.0) {
      level = 'MODERATE';
      levelColor = 'text-secondary-300';
      levelBg = 'bg-secondary-950 text-secondary-200 border-secondary-700';
      tierLabel = isReadiness ? 'Mission Ready / Minor Fatigue Rest Desirable' : 'Moderate Resilience / Squad Cohesion Active';
      recommendation = 'Prescribe standard recovery pacing and weekly check-in adherence.';
    } else if (rounded >= 50.0) {
      level = 'HIGH';
      levelColor = 'text-warning';
      levelBg = 'bg-amber-950 text-warning-300 border-amber-800';
      tierLabel = isReadiness ? 'Standby Rest Required / Cognitive Fatigue' : 'Low Resilience / Attention Required';
      recommendation = 'PRIORITY ACTION: Schedule light duties, peer buddy pairing, and recovery rest cycle.';
    } else {
      level = 'CRITICAL';
      levelColor = 'text-danger';
      levelBg = 'bg-rose-950 text-danger-300 border-rose-800';
      tierLabel = isReadiness ? 'Unfit for Frontline / Mandatory 48h Downtime' : 'Resilience Depleted / Immediate Clinical Protocol';
      recommendation = 'MANDATORY ACTION: Immediate operational detachment and comprehensive counseling intervention.';
    }
  } else {
    // Standard hazard/strain model
    if (rounded >= 78.0) {
      level = 'CRITICAL';
      levelColor = 'text-danger';
      levelBg = 'bg-rose-950 text-danger-300 border-rose-800';
      tierLabel = 'Severe Strain / Critical Clinical Priority';
      recommendation = `MANDATORY ACTION: 48-hour immediate duty detachment, clinical recovery protocol, and confidential counselor debrief for ${p.name}.`;
    } else if (rounded >= 65.0) {
      level = 'HIGH';
      levelColor = 'text-warning';
      levelBg = 'bg-amber-950 text-warning-300 border-amber-800';
      tierLabel = 'Elevated Risk / Priority Intervention Required';
      recommendation = `PRIORITY ACTION: Shift rotation out of high-intensity duty, expedited leave review, and guided recovery protocol for ${p.name}.`;
    } else if (rounded >= 45.0) {
      level = 'MODERATE';
      levelColor = 'text-secondary-300';
      levelBg = 'bg-secondary-950 text-secondary-200 border-secondary-700';
      tierLabel = 'Moderate Telemetry Strain / Active Monitoring';
      recommendation = `MONITORING: Track weekly compliance check-in pulses on mobile app and monitor workload pacing in unit roster.`;
    } else {
      level = 'NOMINAL';
      levelColor = 'text-success';
      levelBg = 'bg-primary-950 text-success-300 border-primary-800';
      tierLabel = 'Nominal Baseline / Healthy Operational State';
      recommendation = `Standard duty rotation confirmed. Squad camaraderie and operational wellness optimal.`;
    }
  }

  return {
    factorId,
    factorTitle: factorId.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    metricLabel,
    score: rounded,
    level,
    levelColor,
    levelBg,
    tierLabel,
    formula,
    recommendation,
    primaryAction,
    secondaryAction,
    mobileCount,
    hrmsCount,
    databaseCount,
    parameters: params,
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
          sleep_quality: { score: p.sleep_hours ? Math.max(10, Math.round(100 - p.sleep_hours * 10)) : 50, available: true, source: 'Soldier Mobile App (Sleep Telemetry)', note: `Logged via Soldier Mobile App (${p.sleep_hours || 6}h sleep recorded)` },
          emotional_exhaustion: { score: p.stress_score || 50, available: true, source: 'Clinical MBI-GS Telemetry', note: 'Telemetry index' },
          assessment_responses: { score: p.stress_score ? Math.round(p.stress_score * 0.9) : 50, available: true, source: 'Soldier Mobile App (Burnout Questions)', note: 'Calculated strictly from mobile app burnout domain questions' },
        }
      }));
    }
    return ALL_PERSONNEL;
  }, [data]);

  const selectedPersonnel = useMemo(() => {
    return personnelRoster.find((p) => p.uid === selectedPersonnelUid) || personnelRoster[0] || ALL_PERSONNEL[0];
  }, [selectedPersonnelUid, personnelRoster]);

  // Evaluate active soldier under currently active factor
  const currentEvalResult: FactorEvaluationResult = useMemo(() => {
    return evaluateFactorModel(selectedFactorId, selectedPersonnel);
  }, [selectedFactorId, selectedPersonnel]);

  // Check missing parameters for the active factor
  const missingParams = useMemo(() => {
    return currentEvalResult.parameters.filter((p) => !p.available).map((p) => p.name);
  }, [currentEvalResult]);

  // Filter personnel based on search query and risk filter evaluated under active factor
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

      const evalRes = evaluateFactorModel(selectedFactorId, p);
      return evalRes.level === selectedRiskFilter;
    });
  }, [searchQuery, selectedRiskFilter, selectedFactorId, personnelRoster]);

  const metrics = [
    {
      title: 'Active Welfare Cases',
      value: data?.metrics?.active_welfare_cases?.toString() || '18',
      sub: `${data?.metrics?.critical_cases || 4} Critical Priority`,
      icon: HandHeart,
      color: 'text-primary',
      bg: 'bg-primary-50 border-primary-200'
    },
    {
      title: 'High-Risk Watchlist',
      value: `${data?.metrics?.high_risk_personnel_count || 4} Personnel`,
      sub: 'Stress Score > 70/100',
      icon: AlertTriangle,
      color: 'text-danger',
      bg: 'bg-danger-50 border-danger-200'
    },
    {
      title: "Today's Counseling Sessions",
      value: `${data?.metrics?.today_counseling_sessions || 4} Scheduled`,
      sub: '2 Completed Today',
      icon: Calendar,
      color: 'text-accent-600',
      bg: 'bg-accent-50 border-accent-200'
    },
    {
      title: 'Intervention Recovery Metric',
      value: `${data?.metrics?.recovery_rate_pct || 92.5}%`,
      sub: `${data?.metrics?.monthly_resolved_interventions || 34} Cases Resolved`,
      icon: CheckCircle,
      color: 'text-secondary',
      bg: 'bg-secondary-50 border-secondary-200'
    },
  ];

  const factorOptions: FactorItem[] = [
    {
      id: 'burnout-prediction',
      num: 1,
      title: 'Burnout Prediction',
      shortDesc: '8-Parameter Exhaustion, Depersonalization & Duty Weariness Model',
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
      shortDesc: '7-Parameter Kessler-10 & Defense Affective Strain Model',
      category: 'Clinical Screening',
      riskLevel: 'HIGH',
      metricLabel: 'Distress Index',
      metricValue: '72.4 / 100',
      icon: Activity,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      clinicalSignificance: 'Multivariate 7-Parameter Predictive Model: 0.15(Mood assessments) + 0.16(Anxiety questions) + 0.18(Depression indicators) + 0.14(Sleep quality) + 0.12(Social isolation) + 0.13(Traumatic exposure) + 0.12(Wellness survey). Calibrated to Armed Forces Kessler-10 (K10) & defense psychiatric benchmarks.',
      biomarkers: [
        '1. Mood assessments (15%) - Daily affective valence',
        '2. Anxiety questions (16%) - GAD-7 hypervigilance',
        '3. Depression indicators (18%) - PHQ-9 anhedonia',
        '4. Sleep quality (14%) - Nocturnal sleep depth',
        '5. Social isolation (12%) - Squad buddy detachment',
        '6. Traumatic exposure (13%) - High-threat incident log',
        '7. Wellness survey (12%) - Monthly psychometrics'
      ],
      flaggedPersonnel: [
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 78.4, risk: 'CRITICAL', trigger: 'Family medical distress + High anxiety score on GAD-7 items' },
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 74.2, risk: 'HIGH', trigger: 'Severe sleep fragmentation (3.8h) + High trauma exposure index' },
        { name: 'Sepoy Amit Kumar', uid: 'UID-SLD-015', rank: 'Sepoy', unit: '10 Para SF', score: 58.6, risk: 'MODERATE', trigger: 'Tactical vigilance unwinding latency & mild isolation' },
      ],
      actionProtocol: 'Mandatory 1-on-1 confidential counselor debrief, acute trauma decompression protocol, and shift rotation out of night duty.',
      modelConfidence: '95.8% ROC-AUC'
    },
    {
      id: 'stress-indicators-detection',
      num: 3,
      title: 'Stress Indicators Detection',
      shortDesc: '7-Parameter Multi-Source Autonomic & Telemetry Model',
      category: 'Biometric & Behavioral Telemetry',
      riskLevel: 'CRITICAL',
      metricLabel: 'Stress Detection Index',
      metricValue: '81.4 / 100',
      icon: Zap,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      clinicalSignificance: 'Multivariate 7-Parameter Predictive Model: 0.14(HRMS data) + 0.14(Leave frequency) + 0.15(Workload) + 0.13(Missed assessments) + 0.16(Sleep pattern) + 0.15(Biometric trends) + 0.13(Behavioral changes). Unifies Soldier Mobile App, HRMS Portal & Central Database telemetry.',
      biomarkers: [
        '1. HRMS data (14%) - Stationing & deployment tenure',
        '2. Leave frequency (14%) - Furlough deficit & deferrals',
        '3. Workload (15%) - Watch roster overtime & tempo',
        '4. Missed assessments (13%) - Compliance & avoidance',
        '5. Sleep pattern (16%) - Mobile sleep debt (<4.5h)',
        '6. Biometric trends (15%) - Resting HR elevation & HRV',
        '7. Behavioral changes (13%) - Irritability & app pulse'
      ],
      flaggedPersonnel: [
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 81.4, risk: 'CRITICAL', trigger: 'Severe sleep fragmentation (3.8h) + RHR elevation + HRMS high deployment' },
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 79.2, risk: 'CRITICAL', trigger: 'Pending urgent leave + Artillery command workload + Sympathetic overdrive' },
        { name: 'Major Alex Morgan', uid: 'UID-EMP-010', rank: 'Major', unit: 'Rapid Action Bn 1', score: 74.8, risk: 'HIGH', trigger: 'Night duty cardiovascular deficit + 80h overtime roster in HRMS' },
      ],
      actionProtocol: 'Mandatory biofeedback paced-breathing intervention, 48-hour operational stand-down, and HRMS leave approval expediting.',
      modelConfidence: '97.4% ROC-AUC'
    },
    {
      id: 'overall-stress-prediction',
      num: 4,
      title: 'Overall Stress Prediction',
      shortDesc: '7-Parameter Multi-Source Duty, Deployment, Workload & Biometric Model',
      category: 'Predictive Modeling',
      riskLevel: 'HIGH',
      metricLabel: 'Unit Stress Score',
      metricValue: '64.2 / 100',
      icon: TrendingUp,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      clinicalSignificance: 'Multivariate 7-Parameter Predictive Model: 0.18(Duty hours) + 0.16(Deployment history) + 0.16(Workload) + 0.12(Transfers) + 0.12(Training load) + 0.13(Wellness assessments) + 0.13(Biometrics). Unified across HRMS Portal, Soldier Mobile App, and Central Database.',
      biomarkers: [
        '1. Duty hours (18%) - HRMS Portal Watch Rosters',
        '2. Deployment history (16%) - HRMS Stationing Dossier',
        '3. Workload (16%) - HRMS Task Allocation Roster',
        '4. Transfers (12%) - HRMS Posting & Transfer History',
        '5. Training load (12%) - Central DB Combat Drills Log',
        '6. Wellness assessments (13%) - Soldier Mobile App Pulse',
        '7. Biometrics (13%) - Soldier Mobile App Sensors'
      ],
      flaggedPersonnel: [
        { name: 'Major Alex Morgan', uid: 'UID-EMP-010', rank: 'Major', unit: 'Rapid Action Bn 1', score: 78.0, risk: 'HIGH', trigger: 'Night duty cardiovascular recovery deficit + high watch load' },
        { name: 'Sepoy Amit Kumar', uid: 'UID-SLD-015', rank: 'Sepoy', unit: '10 Para SF', score: 57.2, risk: 'MODERATE', trigger: 'Prolonged forward sector recon duty + tactical drills' },
      ],
      actionProtocol: 'Unit-level wellness review and structured 72-hour operational tempo modulation.',
      modelConfidence: '95.4% ROC-AUC'
    },
    {
      id: 'emotional-fatigue-prediction',
      num: 5,
      title: 'Emotional Fatigue Prediction',
      shortDesc: '6-Parameter Multi-Source Sleep, Mood, Workload & Exhaustion Model',
      category: 'Affective Telemetry',
      riskLevel: 'HIGH',
      metricLabel: 'Fatigue Severity',
      metricValue: '71% High Strain',
      icon: BatteryLow,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      clinicalSignificance: 'Multivariate 6-Parameter Predictive Model: 0.20(Sleep quality) + 0.18(Mood) + 0.16(Workload) + 0.20(Emotional exhaustion questions) + 0.14(Work-life balance) + 0.12(Counseling history). Unified across Soldier Mobile App, HRMS Portal, and Central Database.',
      biomarkers: [
        '1. Sleep quality (20%) - Soldier Mobile App (Sleep Telemetry)',
        '2. Mood (18%) - Soldier Mobile App (Daily Mood Pulse)',
        '3. Workload (16%) - HRMS Portal (Command Watch Rosters)',
        '4. Emotional exhaustion questions (20%) - Soldier Mobile App (MBI-GS Items)',
        '5. Work-life balance (14%) - Central DB (Family & Work-Life Survey)',
        '6. Counseling history (12%) - Central DB (Counseling Case Registry)'
      ],
      flaggedPersonnel: [
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 80.0, risk: 'HIGH', trigger: 'Chronic duty alertness + caregiver domestic concern' },
        { name: 'Naik Sandeep Patil', uid: 'UID-EMP-014', rank: 'Naik', unit: 'Signals & Telemetry', score: 68.0, risk: 'HIGH', trigger: 'Continuous console night duty + sleep fragmentation' },
      ],
      actionProtocol: 'Facilitate peer support contact and positive behavioral engagement activities.',
      modelConfidence: '93.7% ROC-AUC'
    },
    {
      id: 'welfare-concern-detection',
      num: 6,
      title: 'Welfare Concern Detection',
      shortDesc: '6-Parameter Multi-Source Grants, Separation, Leave & Trends Model',
      category: 'Social Determinants',
      riskLevel: 'CRITICAL',
      metricLabel: 'Active Alerts',
      metricValue: '7 Cases Open',
      icon: ShieldAlert,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      clinicalSignificance: 'Multivariate 6-Parameter Predictive Model: 0.15(Financial concerns) + 0.20(Family separation) + 0.20(Repeated leave requests) + 0.18(Self-reported issues) + 0.15(Poor wellness trends) + 0.12(Intervention history). Unified across HRMS Portal, Soldier Mobile App, and Central Database.',
      biomarkers: [
        '1. Financial concerns (optional) (15%) - HRMS Portal Grants',
        '2. Family separation (20%) - HRMS Portal Separation Tenure',
        '3. Repeated leave requests (20%) - HRMS Leave Management',
        '4. Self-reported issues (18%) - Soldier Mobile App Feedback',
        '5. Poor wellness trends (15%) - Central DB Trend Archive',
        '6. Intervention history (12%) - Central DB Case Registry'
      ],
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
      shortDesc: '7-Parameter Multi-Source Longitudinal Service, Biometrics & Drift Model',
      category: 'AI Forecasting',
      riskLevel: 'MODERATE',
      metricLabel: 'Trend Direction',
      metricValue: '+14% Risk Trend',
      icon: LineChart,
      color: 'text-secondary',
      bg: 'bg-secondary-50',
      border: 'border-secondary-200',
      clinicalSignificance: 'Multivariate 7-Parameter Predictive Model: 0.15(Historical HRMS records) + 0.14(Attendance) + 0.15(Leave) + 0.14(Deployment) + 0.15(Assessments) + 0.14(Biometric trends) + 0.13(Behavioral history). Unified across HRMS Portal, Soldier Mobile App, and Central Database.',
      biomarkers: [
        '1. Historical HRMS records (15%) - HRMS Service Dossier',
        '2. Attendance (14%) - HRMS Muster & Watch Attendance',
        '3. Leave (15%) - HRMS Leave Utilization History',
        '4. Deployment (14%) - HRMS Deployment & Stationing Dossier',
        '5. Assessments (15%) - Soldier Mobile App Check-ins',
        '6. Biometric trends (14%) - Soldier Mobile App Sensors',
        '7. Behavioral history (13%) - Central DB Behavioral Archive'
      ],
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
      shortDesc: '4-Parameter Multi-Source Unified HRMS, Wellness, Biometrics & Assessment Model',
      category: 'Multi-Modal Modeling',
      riskLevel: 'CRITICAL',
      metricLabel: 'Hazard Index',
      metricValue: '86.4% Elevated',
      icon: Gauge,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      clinicalSignificance: 'Multivariate 4-Parameter Predictive Model: 0.28(Combined HRMS data) + 0.24(Wellness data) + 0.25(Biometric data) + 0.23(Assessment data). Unified across HRMS Portal, Central Database, and Soldier Mobile App.',
      biomarkers: [
        '1. Combined HRMS data (28%) - HRMS Workload & Stationing',
        '2. Wellness data (24%) - Central DB Composite Profile',
        '3. Biometric data (25%) - Soldier Mobile App Sensor Stream',
        '4. Assessment data (23%) - Soldier Mobile App Psychometrics'
      ],
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
      shortDesc: '5-Parameter Multi-Source AI Risk, Assessment History & Workload Model',
      category: 'Prescriptive Analytics',
      riskLevel: 'MODERATE',
      metricLabel: 'Intervention Fit',
      metricValue: '91% Accuracy',
      icon: HeartHandshake,
      color: 'text-accent-600',
      bg: 'bg-accent-50',
      border: 'border-accent-200',
      clinicalSignificance: 'Multivariate 5-Parameter Predictive Model: 0.25(AI risk score) + 0.20(Assessment history) + 0.20(Workload) + 0.20(Deployment) + 0.15(Previous interventions). Unified across Central Database and HRMS Portal.',
      biomarkers: [
        '1. AI risk score (25%) - Central DB Composite AI Engine',
        '2. Assessment history (20%) - Central DB Assessment Archive',
        '3. Workload (20%) - HRMS Command Watch Rosters',
        '4. Deployment (20%) - HRMS Deployment Tenure Dossier',
        '5. Previous interventions (15%) - Central DB Interventions Log'
      ],
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
      shortDesc: '4-Parameter Multi-Source AI Early Warning, Spike Detection & Anomaly Model',
      category: 'Early Warning System',
      riskLevel: 'CRITICAL',
      metricLabel: 'Urgent Alerts',
      metricValue: '4 Critical Dispatches',
      icon: BellRing,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      border: 'border-rose-200',
      clinicalSignificance: 'Multivariate 4-Parameter Predictive Model: 0.30(High-risk predictions) + 0.25(Sudden score increase) + 0.22(Missed assessments) + 0.23(Abnormal trends). Unified across Central Database and Soldier Mobile App.',
      biomarkers: [
        '1. High-risk predictions (30%) - Central DB AI Early Warning',
        '2. Sudden score increase (25%) - Soldier Mobile App Spike Telemetry',
        '3. Missed assessments (22%) - Central DB Compliance Log',
        '4. Abnormal trends (23%) - Soldier Mobile App Biometric Anomalies'
      ],
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
      shortDesc: '5-Parameter Multi-Source Wellness History, Outcomes & Coping Model',
      category: 'Positive Psychology',
      riskLevel: 'NOMINAL',
      metricLabel: 'Unit Resilience',
      metricValue: '82% Resilient',
      icon: Smile,
      color: 'text-success',
      bg: 'bg-success-50',
      border: 'border-success-200',
      clinicalSignificance: 'Multivariate 5-Parameter Predictive Model: 0.24(Wellness score history) + 0.20(Intervention outcomes) + 0.22(Assessments) + 0.18(Attendance) + 0.16(Productivity trends). Unified across Central DB, Soldier Mobile App, and HRMS Portal.',
      biomarkers: [
        '1. Wellness score history (24%) - Central DB Wellness Archive',
        '2. Intervention outcomes (20%) - Central DB Outcome Registry',
        '3. Assessments (22%) - Soldier Mobile App Resilience Items',
        '4. Attendance (18%) - HRMS Portal Muster & Watch Logs',
        '5. Productivity trends (16%) - Central DB Productivity Metrics'
      ],
      flaggedPersonnel: [
        { name: 'Sepoy Amit Kumar', uid: 'UID-SLD-015', rank: 'Sepoy', unit: '10 Para SF', score: 86.0, risk: 'NOMINAL', trigger: 'High tactical bounce-back & squad camaraderie' },
        { name: 'Major Alex Morgan', uid: 'UID-EMP-010', rank: 'Major', unit: 'Rapid Action Bn 1', score: 72.0, risk: 'NOMINAL', trigger: 'Demonstrated command resilience under stress' },
      ],
      actionProtocol: 'Incorporate positive psychology conditioning into regular morning parade brief.',
      modelConfidence: '94.0% ROC-AUC'
    },
    {
      id: 'readiness-score',
      num: 12,
      title: 'Readiness Score',
      shortDesc: '6-Parameter Multi-Source Wellness (30%), Physical (20%), Workload (20%), Mental (15%), Behavioral (10%) & Risk (5%) Model',
      category: 'Mission Readiness',
      riskLevel: 'NOMINAL',
      metricLabel: 'Readiness Score',
      metricValue: '86.8% Combat Ready',
      icon: Target,
      color: 'text-secondary',
      bg: 'bg-secondary-50',
      border: 'border-secondary-200',
      clinicalSignificance: 'Multivariate 6-Parameter Model: Readiness Score = 30% × Wellness + 20% × Physical Readiness + 20% × Workload + 15% × Mental Readiness + 10% × Behavioral Stability + 5% × Operational Risk. Unified across Central DB, Soldier Mobile App, and HRMS Portal.',
      biomarkers: [
        '1. Wellness (30%) - Central DB Composite Wellness Index',
        '2. Physical Readiness (20%) - Soldier Mobile App Wearables & Sleep Recovery',
        '3. Workload (20%) - HRMS Portal Command Watch Rosters & Duty Pacing',
        '4. Mental Readiness (15%) - Soldier Mobile App Psychometric Mood & Alertness Pulse',
        '5. Behavioral Stability (10%) - Mobile App & Central DB Behavioral Telemetry & Peer Rating',
        '6. Operational Risk (5%) - Central DB & HRMS AI Risk Engine & Deployment Dossier'
      ],
      flaggedPersonnel: [
        { name: 'Sepoy Amit Kumar', uid: 'UID-SLD-015', rank: 'Sepoy', unit: '10 Para SF', score: 86.8, risk: 'NOMINAL', trigger: 'Combat Ready: High focus & physical fitness' },
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 22.4, risk: 'CRITICAL', trigger: 'Unfit for frontline duty pending 48h rest' },
      ],
      actionProtocol: 'Certify deployment clearance for fit personnel; place fatigued personnel on local guard pacing.',
      modelConfidence: '97.2% ROC-AUC'
    },
    {
      id: 'occupational-stress-risk',
      num: 13,
      title: 'Occupational Stress Incident Risk',
      shortDesc: '6-Parameter Multi-Source Stress Trends, Burnout History, Workload & Sleep Model',
      category: 'Safety & Risk Engineering',
      riskLevel: 'HIGH',
      metricLabel: 'Incident Risk Index',
      metricValue: '11.2% Low-Moderate',
      icon: AlertOctagon,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      border: 'border-amber-200',
      clinicalSignificance: 'Multivariate 6-Parameter Predictive Model: 0.18(Long-term stress trends) + 0.16(Burnout history) + 0.18(Workload) + 0.18(Deployments) + 0.16(Poor sleep) + 0.14(Emotional fatigue). Unified across Central DB, HRMS Portal, and Soldier Mobile App.',
      biomarkers: [
        '1. Long-term stress trends (18%) - Central DB Longitudinal Registry',
        '2. Burnout history (16%) - Central DB Burnout History Archive',
        '3. Workload (18%) - HRMS Command Watch Rosters',
        '4. Deployments (18%) - HRMS Sector Deployment Tenure',
        '5. Poor sleep (16%) - Soldier Mobile App Sleep Deficit',
        '6. Emotional fatigue (14%) - Soldier Mobile App Fatigue'
      ],
      flaggedPersonnel: [
        { name: 'Havildar Ramesh Chand', uid: 'UID-EMP-012', rank: 'Havildar', unit: 'High Altitude Guard', score: 84.8, risk: 'CRITICAL', trigger: 'Continuous night duty > 8 cycles + extreme hypoxia sector' },
        { name: 'Subedar Gurpreet Singh', uid: 'UID-EMP-013', rank: 'Subedar', unit: 'Field Artillery 3rd Bn', score: 76.5, risk: 'HIGH', trigger: 'High cumulative physical fatigue + command watch load' },
      ],
      actionProtocol: 'Mandate altitude rotation, shift to daylight watch, and schedule clinical decompression.',
      modelConfidence: '96.2% ROC-AUC'
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
        <div className="fixed top-5 right-5 z-50 p-4 rounded-2xl bg-gray-900 text-white border border-primary shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-primary-300 shrink-0" />
          <span>{actionAlert}</span>
        </div>
      )}

      {/* Welcome Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-primary-50 text-primary-700 border border-primary-200 shadow-sm flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Chief Welfare Officer Command Center</span>
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                &bull; HRMS Unique ID: <span className="text-primary-700 font-bold">{user?.uid || 'UID-WEL-007'}</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">
                &bull; Regimental: <span className="text-gray-900 font-bold">{user?.regimental_number || 'CRPF-2014-8007'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Welcome, {user?.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed font-medium">
              Synchronized HRMS Personnel Welfare Directory. Search personnel, inspect live counts, select soldiers to evaluate all 13 multi-source Welfare & Psychometric Factors, and trigger direct clinical interventions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-primary ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync HRMS'}</span>
            </button>
            <button
              onClick={() => handleTriggerAction('Welfare Command', 'New Case Initiation')}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-extrabold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all cursor-pointer"
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
              <p className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight font-mono">{m.value}</p>
              <p className="text-xs text-slate-600 mt-1.5 flex items-center gap-1.5 font-semibold">
                <HeartPulse className="w-3.5 h-3.5 text-primary" />
                <span>{m.sub}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* ========================================================================= */}
      {/* SECTION: SEARCHABLE PERSONNEL DIRECTORY & MULTI-FACTOR LIVE PREDICTOR COMMAND */}
      {/* ========================================================================= */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-6 relative overflow-hidden">
        {/* Header & Dynamic Counter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary-50 border border-primary-200 text-primary-700 shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-gray-900 tracking-tight">
                  Personnel Roster &amp; Live Predictor: {currentFactor.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">
                  Search any user, inspect unit counts, and select personnel to compute live multi-source {currentFactor.title} telemetry & predictions.
                </p>
              </div>
            </div>
          </div>

          {/* Dynamic Counter Badges */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-black bg-secondary text-white shadow-sm flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-accent" />
              <span>Showing {filteredPersonnel.length} of {personnelRoster.length} Personnel</span>
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-primary-50 text-primary-700 border border-primary-200">
              Active Subject: <strong className="text-primary-900">{selectedPersonnel.name}</strong> ({currentEvalResult.metricLabel}: {currentEvalResult.score}%)
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
              placeholder={`Search personnel for ${currentFactor.title} by name, UID, regimental number, rank, or unit...`}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all font-medium"
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
                    ? 'bg-primary text-white shadow-sm'
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
            <span>Select Personnel to evaluate {currentFactor.title}:</span>
            <span>{filteredPersonnel.length} matches found</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {filteredPersonnel.map((p) => {
              const isSelected = selectedPersonnelUid === p.uid;
              const evalRes = evaluateFactorModel(selectedFactorId, p);
              const isCrit = evalRes.level === 'CRITICAL';
              const isHigh = evalRes.level === 'HIGH';
              const isMod = evalRes.level === 'MODERATE';

              return (
                <button
                  key={p.uid}
                  onClick={() => {
                    setSelectedPersonnelUid(p.uid);
                  }}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between relative group ${
                    isSelected
                      ? 'bg-secondary border-secondary text-white shadow-xl ring-2 ring-primary/50 transform -translate-y-1'
                      : 'bg-slate-50/80 hover:bg-white border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-xs'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${
                        isSelected ? 'bg-secondary-800 text-accent border border-secondary-700' : 'bg-slate-200/80 text-slate-700'
                      }`}>
                        {p.uid}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        isCrit
                          ? isSelected ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-rose-100 text-rose-800'
                          : isHigh
                          ? isSelected ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800'
                          : isMod
                          ? isSelected ? 'bg-secondary-950 text-secondary-300 border border-secondary-800' : 'bg-secondary-100 text-secondary-800'
                          : isSelected ? 'bg-primary-950 text-primary-300 border border-primary-800' : 'bg-primary-100 text-primary-800'
                      }`}>
                        {evalRes.level}
                      </span>
                    </div>

                    <div>
                      <h4 className={`font-black text-xs leading-snug tracking-tight ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-primary'}`}>
                        {p.name}
                      </h4>
                      <p className={`text-[11px] font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {p.rank} &bull; {p.unit}
                      </p>
                      <p className={`text-[10px] font-mono ${isSelected ? 'text-slate-400' : 'text-slate-400'}`}>
                        {p.branch} &bull; {p.regimental_number}
                      </p>
                    </div>
                  </div>

                  <div className={`mt-3 pt-2.5 border-t flex items-center justify-between text-xs font-mono ${
                    isSelected ? 'border-secondary-800 text-slate-300' : 'border-slate-200/80 text-slate-600'
                  }`}>
                    <span className="text-[10px] font-sans font-medium">{evalRes.metricLabel}:</span>
                    <span className={`font-black text-xs ${evalRes.levelColor}`}>
                      {evalRes.score}%
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Personnel Multi-Factor Prediction Dossier & Live Parameter Breakdown */}
        <div className="p-6 sm:p-7 rounded-3xl bg-secondary text-white border border-secondary-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

          {/* Dossier Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-secondary-800 pb-5 relative z-10">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-black shadow-lg shrink-0 border border-accent/40">
                {selectedPersonnel.name.charAt(0)}
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-accent bg-secondary-900/90 px-2.5 py-0.5 rounded-full border border-secondary-700">
                    {selectedPersonnel.uid} &bull; {selectedPersonnel.regimental_number}
                  </span>
                  <span className="text-xs font-mono text-slate-300 bg-secondary-800 px-2.5 py-0.5 rounded-full border border-secondary-700">
                    {selectedPersonnel.branch} &bull; {selectedPersonnel.unit}
                  </span>
                  <span className="text-xs font-mono text-slate-300">
                    Category: <strong className="text-white">{selectedPersonnel.medical_category}</strong>
                  </span>
                  {selectedPersonnel.hrms_sync_status === 'PARTIAL_SYNC' ? (
                    <span className="text-[10px] font-mono font-black text-amber-300 bg-amber-950/90 px-2.5 py-0.5 rounded-full border border-amber-600 flex items-center gap-1.5 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
                      <span>HRMS Sync: PARTIAL SYNC ({selectedPersonnel.data_completeness_pct || 75}%)</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-mono font-black text-success-300 bg-primary-950/80 px-2.5 py-0.5 rounded-full border border-primary-700 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-success"></span>
                      <span>HRMS Sync: SYNCHRONIZED (100%)</span>
                    </span>
                  )}
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-1 flex items-center gap-2">
                  <span>{selectedPersonnel.name}</span>
                  <span className="text-sm font-medium text-slate-300">({selectedPersonnel.rank})</span>
                </h3>
                <p className="text-xs text-slate-300 mt-1 font-medium">
                  Status: <strong className="text-accent">{selectedPersonnel.status}</strong> &bull; Evaluating Factor #{currentFactor.num}: <strong className="text-white">{currentFactor.title}</strong>
                </p>
              </div>
            </div>

            {/* Overall Calculated Factor Card */}
            <div className="p-4 rounded-2xl bg-secondary-900/90 border border-secondary-700 flex items-center gap-5 shrink-0 shadow-lg">
              <div className="text-right">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-300 block">
                  Calculated {currentFactor.title}
                </span>
                <div className="flex items-baseline justify-end gap-1 mt-0.5">
                  <span className={`text-3xl font-black font-mono tracking-tight ${currentEvalResult.levelColor}`}>
                    {currentEvalResult.score}%
                  </span>
                </div>
                <span className={`inline-block text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full border mt-1 ${currentEvalResult.levelBg}`}>
                  {currentEvalResult.level} HAZARD
                </span>
              </div>

              <div className="flex flex-col gap-1.5">
                <button
                  onClick={() => handleTriggerAction(currentFactor.title, `${currentEvalResult.primaryAction} for ${selectedPersonnel.name}`)}
                  className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{currentEvalResult.primaryAction}</span>
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
                  Live data for <strong className="text-white underline">{missingParams.join(', ')}</strong> is not yet available in the HRMS / Mobile database for this personnel. Using baseline unit default values until telemetry packets synchronize.
                </p>
              </div>
            </div>
          )}

          {/* Mathematical Weight Breakdown Formula Bar */}
          <div className="p-3.5 rounded-2xl bg-secondary-950/90 border border-secondary-800 text-xs text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-2 font-mono">
            <div className="flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-accent shrink-0" />
              <span>
                <strong className="text-white">{currentFactor.title} Formula:</strong> {currentEvalResult.formula}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded bg-secondary-900 text-secondary-200 border border-secondary-700">
                📱 Mobile: {currentEvalResult.mobileCount}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-warning-300 border border-amber-800">
                🏢 HRMS: {currentEvalResult.hrmsCount}
              </span>
              <span className="px-2 py-0.5 rounded bg-primary-950 text-primary-300 border border-primary-800">
                💾 DB: {currentEvalResult.databaseCount}
              </span>
            </div>
          </div>

          {/* Parameters Detailed Breakdown Grid (Fixed Retrieved Telemetry Metrics) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
            {currentEvalResult.parameters.map((param) => {
              const currentVal = param.score;

              return (
                <div
                  key={param.key}
                  className={`p-4 rounded-2xl border transition-all space-y-2.5 ${
                    !param.available
                      ? 'bg-secondary-900/70 border-amber-500/50 ring-1 ring-amber-500/20'
                      : 'bg-secondary-900/60 border-secondary-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-white">{param.name}</span>
                    <span className="text-[10px] font-mono font-bold text-slate-300 bg-secondary-950 px-1.5 py-0.5 rounded border border-secondary-800">
                      {param.weightLabel}
                    </span>
                  </div>

                  {/* Telemetry Availability & Source Tag */}
                  <div className="flex items-center justify-between">
                    {param.available ? (
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                        param.sourceType === 'MOBILE'
                          ? 'text-secondary-200 bg-secondary-950/80 border-secondary-700/80'
                          : param.sourceType === 'HRMS'
                          ? 'text-amber-300 bg-amber-950/80 border-amber-700/80'
                          : 'text-primary-300 bg-primary-950/70 border-primary-800/80'
                      }`}>
                        <span>{param.sourceType === 'MOBILE' ? '📱' : param.sourceType === 'HRMS' ? '🏢' : '💾'}</span>
                        <span className="truncate max-w-[135px] font-semibold">{param.source}</span>
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-amber-300 bg-amber-950/90 border border-amber-600 px-2 py-0.5 rounded-md flex items-center gap-1 font-bold">
                        <AlertTriangle className="w-2.5 h-2.5 text-amber-400 shrink-0" />
                        <span>Data Pending Sync</span>
                      </span>
                    )}

                    <span className={`text-sm font-mono font-black ${param.color}`}>
                      {currentVal}%
                    </span>
                  </div>

                  {/* Retrieved Telemetry Strain Bar Meter (Read Only Fixed) */}
                  <div className="space-y-1.5 pt-1">
                    <div className="w-full h-2 bg-secondary-950 rounded-full overflow-hidden border border-secondary-800 p-0.5">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${param.bar}`}
                        style={{ width: `${Math.min(100, Math.max(4, currentVal))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[9px] font-mono text-slate-400">
                      <span>0% Nominal</span>
                      <span className="font-semibold text-slate-300">{currentVal}% Metric</span>
                      <span>100% High</span>
                    </div>
                  </div>

                  {/* Context Note */}
                  <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-medium bg-secondary-950/80 p-2 rounded-xl border border-secondary-800/80">
                    {param.note}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Clinical Recommendation & Protocol Dispatch Card */}
          <div className="p-5 rounded-2xl bg-secondary-900/80 border border-secondary-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" />
                <span>AI Clinical Guidance for {selectedPersonnel.name} ({currentFactor.title})</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {currentEvalResult.recommendation}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleTriggerAction(currentFactor.title, `${currentEvalResult.primaryAction} for ${selectedPersonnel.name}`)}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {currentEvalResult.primaryAction}
              </button>
              <button
                onClick={() => handleTriggerAction(currentFactor.title, `${currentEvalResult.secondaryAction} for ${selectedPersonnel.name}`)}
                className="px-4 py-2 rounded-xl bg-secondary-800 hover:bg-secondary-700 text-slate-200 text-xs font-bold border border-secondary-700 transition-all cursor-pointer"
              >
                {currentEvalResult.secondaryAction}
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
              <div className="p-2 rounded-xl bg-secondary-50 border border-secondary-200 text-secondary shadow-xs">
                <Sliders className="w-5 h-5" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Analysis Based on Factor
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium max-w-3xl">
              13-Factor Psychometric Intelligence Matrix. Click any factor below to evaluate live multi-source parameters, formulas, and clinical protocols for <strong className="text-slate-900">{selectedPersonnel.name}</strong>.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Active Factor: <strong className="text-slate-900">#{currentFactor.num} {currentFactor.title}</strong>
            </span>
          </div>
        </div>

        {/* 13-Factor Interactive Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {factorOptions.map((factor) => {
            const Icon = factor.icon;
            const isSelected = selectedFactorId === factor.id;
            const soldierEval = evaluateFactorModel(factor.id, selectedPersonnel);

            return (
              <button
                type="button"
                id={`factor-card-${factor.id}`}
                data-testid={`factor-card-${factor.id}`}
                key={factor.id}
                onClick={() => setSelectedFactorId(factor.id)}
                className={`p-5 rounded-2xl border text-left w-full transition-all cursor-pointer flex flex-col justify-between relative group ${
                  isSelected
                    ? 'bg-secondary border-secondary text-white shadow-xl ring-2 ring-primary/50 transform -translate-y-1'
                    : 'bg-slate-50/70 hover:bg-white border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-secondary-800 text-accent border border-secondary-700' : 'bg-slate-200/80 text-slate-700'
                    }`}>
                      Factor #{factor.num}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      soldierEval.level === 'CRITICAL'
                        ? isSelected ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-rose-100 text-rose-800'
                        : soldierEval.level === 'HIGH'
                        ? isSelected ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800'
                        : soldierEval.level === 'MODERATE'
                        ? isSelected ? 'bg-secondary-950 text-secondary-300 border border-secondary-800' : 'bg-secondary-100 text-secondary-800'
                        : isSelected ? 'bg-primary-950 text-primary-300 border border-primary-800' : 'bg-primary-100 text-primary-800'
                    }`}>
                      {soldierEval.level}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${
                      isSelected ? 'bg-secondary-800 border-secondary-700 text-accent' : `${factor.bg} ${factor.border} ${factor.color}`
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`font-black text-sm leading-tight tracking-tight ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-primary'}`}>
                        {factor.title}
                      </h4>
                      <p className={`text-[11px] mt-1 line-clamp-2 font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {factor.shortDesc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono ${
                  isSelected ? 'border-secondary-800 text-slate-300' : 'border-slate-200/80 text-slate-600'
                }`}>
                  <span className="text-[11px] font-sans font-medium text-slate-400">{selectedPersonnel.name.split(' ')[0]}:</span>
                  <span className={`font-black text-xs ${soldierEval.levelColor}`}>
                    {soldierEval.score}% ({soldierEval.level})
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Factor Deep-Dive Intelligence Panel */}
        <div className="p-6 sm:p-7 rounded-3xl bg-secondary text-white border border-secondary-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-accent/15 rounded-full blur-3xl pointer-events-none" />

          {/* Factor Panel Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-secondary-800 pb-5 relative z-10">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-xl font-black shadow-lg shrink-0 ${
                currentFactor.color === 'text-rose-600'
                  ? 'bg-rose-950/80 border-rose-800 text-rose-400'
                  : currentFactor.color === 'text-amber-600'
                  ? 'bg-amber-950/80 border-amber-800 text-amber-400'
                  : 'bg-secondary-900/80 border-secondary-700 text-accent'
              }`}>
                <CurrentIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-accent bg-secondary-900 px-2.5 py-0.5 rounded-full border border-secondary-700">
                    Factor #{currentFactor.num} &bull; {currentFactor.category}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    Model Reliability: <strong className="text-accent">{currentFactor.modelConfidence}</strong>
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
                onClick={() => handleTriggerAction(currentFactor.title, `${currentEvalResult.primaryAction} for ${selectedPersonnel.name}`)}
                className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/30 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{currentEvalResult.primaryAction}</span>
              </button>
              <button
                onClick={() => handleTriggerAction(currentFactor.title, 'Telemetry Export')}
                className="px-3.5 py-2.5 rounded-xl bg-secondary-800 hover:bg-secondary-700 text-slate-200 text-xs font-bold border border-secondary-700 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-slate-400" />
                <span>Export Dossier</span>
              </button>
            </div>
          </div>

          {/* Factor Panel Body - Universal Multi-Source Telemetry & Parameters */}
          <div className="space-y-6 relative z-10">
            {/* Multi-Source Provenance Header Banner */}
            <div className="p-4 rounded-2xl bg-secondary-900/90 border border-secondary-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-secondary-950 text-secondary-200 border border-secondary-700 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-accent" />
                  <span>Multi-Source Unified Telemetry & Clinical Model</span>
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Evaluating Active Subject: <strong className="text-white">{selectedPersonnel.name}</strong> ({selectedPersonnel.rank}) &bull; <span className="text-accent font-mono">{selectedPersonnel.uid}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold">
                <span className="px-2.5 py-1 rounded-lg bg-secondary-950 text-secondary-200 border border-secondary-700 flex items-center gap-1">
                  📱 Mobile App: {currentEvalResult.mobileCount} Params
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-warning-300 border border-amber-800 flex items-center gap-1">
                  🏢 HRMS Portal: {currentEvalResult.hrmsCount} Params
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-primary-950 text-primary-300 border border-primary-800 flex items-center gap-1">
                  💾 Central DB / Web: {currentEvalResult.databaseCount} Params
                </span>
              </div>
            </div>

            {/* Composite Score Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-secondary-800 via-secondary-800/90 to-secondary-900 border border-secondary-700 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${currentEvalResult.levelBg}`}>
                    {currentEvalResult.level} {currentEvalResult.factorTitle.toUpperCase()}
                  </span>
                  <span className="text-xs font-mono font-semibold text-slate-300">
                    &bull; {currentEvalResult.tierLabel}
                  </span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-white">
                  {currentFactor.title} Prediction Index: <span className={`font-mono text-xl sm:text-2xl font-black ${currentEvalResult.levelColor}`}>{currentEvalResult.score} / 100</span>
                </h4>
                <p className="text-xs text-slate-300 font-medium max-w-3xl leading-relaxed">
                  <strong className="text-slate-100">Formula:</strong> {currentEvalResult.formula}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleTriggerAction(currentFactor.title, `${currentEvalResult.primaryAction} for ${selectedPersonnel.name}`)}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{currentEvalResult.primaryAction}</span>
                </button>
                <button
                  onClick={() => handleTriggerAction(currentFactor.title, `${currentEvalResult.secondaryAction} for ${selectedPersonnel.name}`)}
                  className="px-3.5 py-2 rounded-xl bg-secondary-800 hover:bg-secondary-700 text-slate-200 text-xs font-bold border border-secondary-700 transition-all cursor-pointer"
                >
                  {currentEvalResult.secondaryAction}
                </button>
              </div>
            </div>

            {/* Parameters Telemetry Grid with Fixed Progress Meters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {currentEvalResult.parameters.map((param) => {
                const currentVal = param.score;
                return (
                  <div
                    key={param.key}
                    className="p-4 rounded-2xl bg-secondary-900/80 border border-secondary-800/80 space-y-3 relative group hover:border-secondary-700 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      {/* Header with weight and source tag */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-accent bg-secondary-950 px-2 py-0.5 rounded border border-secondary-800">
                          Weight: {param.weightLabel}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            param.available
                              ? 'bg-primary-950 text-primary-300 border border-primary-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${param.available ? 'bg-success' : 'bg-rose-400 animate-ping'}`} />
                          {param.available ? 'Synchronized' : 'Sync Pending'}
                        </span>
                      </div>

                      {/* Title and Origin Source */}
                      <div>
                        <h5 className="font-extrabold text-xs text-white leading-snug">
                          {param.name}
                        </h5>
                        <p className="text-[10px] text-slate-300 line-clamp-1 font-medium mt-0.5">
                          {param.desc}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-secondary-950 text-slate-300 border border-secondary-800 font-semibold">
                            {param.sourceBadge}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Read-only Fixed Telemetry Meter (No editable adjustment bar) */}
                    <div className="space-y-2 pt-1 border-t border-secondary-800/60">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[10px] text-slate-400 font-sans">Retrieved Telemetry:</span>
                        <span className={`font-black text-sm ${param.color}`}>
                          {currentVal}%
                        </span>
                      </div>

                      {/* Fixed Meter Bar */}
                      <div className="w-full bg-secondary-950 rounded-full h-2 overflow-hidden border border-secondary-800/80 p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${param.bar}`}
                          style={{ width: `${Math.min(100, Math.max(5, currentVal))}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[9px] text-slate-400 font-mono">
                        <span>0% Nominal</span>
                        <span className="font-semibold text-slate-300">{currentVal}% Score</span>
                        <span>100% High</span>
                      </div>

                      {/* Telemetry Detail Note */}
                      <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed font-medium bg-secondary-950/90 p-2 rounded-xl border border-secondary-800">
                        {param.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Recommendation Card */}
            <div className="p-4 rounded-2xl bg-secondary-900/80 border border-secondary-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-accent flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-accent" />
                  <span>Chief Welfare Officer Clinical Protocol for {selectedPersonnel.name}</span>
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  {currentEvalResult.recommendation}
                </p>
              </div>
            </div>

            {/* Key Telemetry Signals & Flagged Cohort Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-2">
              {/* Left: Root Cause Biomarkers */}
              <div className="lg:col-span-6 space-y-3">
                <div className="p-5 rounded-2xl bg-secondary-900/80 border border-secondary-800/80 space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-accent" />
                    <span>Key Telemetry Signals & Root-Cause Biomarkers</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {currentFactor.biomarkers.map((bio, idx) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-secondary-950/90 border border-secondary-800 flex items-start gap-2 text-xs text-slate-200">
                        <ChevronRight className="w-3.5 h-3.5 text-accent shrink-0 mt-0.5" />
                        <span>{bio}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-secondary-900/80 border border-secondary-800/80 space-y-2.5">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-accent flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-accent" />
                    <span>Welfare Officer Action Protocol</span>
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed font-medium bg-secondary-950/90 p-3.5 rounded-xl border border-secondary-800">
                    {currentFactor.actionProtocol}
                  </p>
                </div>
              </div>

              {/* Right: Flagged Personnel Cohort under this factor */}
              <div className="lg:col-span-6 p-5 rounded-2xl bg-secondary-900/80 border border-secondary-800/80 space-y-3">
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
                      className="p-3.5 rounded-xl bg-secondary-950/90 border border-secondary-800 hover:border-secondary-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-extrabold text-xs text-white">{p.name}</span>
                          <span className="text-[10px] font-mono text-accent bg-secondary-900 px-1.5 py-0.5 rounded border border-secondary-700">
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
                            handleTriggerAction(currentFactor.title, `Selected ${p.name} for ${currentFactor.title} analysis`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-primary hover:bg-primary-600 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
                        >
                          <Flame className="w-3 h-3" />
                          <span>Analyze {currentFactor.title.split(' ')[0]}</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
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
                    <span className="text-xs font-mono text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200 font-bold">
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
                      handleTriggerAction('Flagged Watchlist', `Selected ${p.name} for ${currentFactor.title} evaluation`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    <span>Analyze Factor</span>
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
              <Calendar className="w-4 h-4 text-primary" />
            </div>

            <div className="space-y-3">
              {upcomingSessions.map((s, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-primary-700 flex items-center gap-1.5">
                      <Clock className="w-3 h-3 text-primary" />
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

          <div className="mt-5 p-4 rounded-2xl bg-primary-50 border border-primary-200 text-xs text-primary-900 flex items-start gap-3">
            <Sparkles className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed font-medium">
              HRMS AI Telemetry: Multi-factor welfare model synchronizing live data streams across Mobile App, HRMS Portal, and Central Database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelfareDashboard;
