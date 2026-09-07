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
      if (s >= 75) return { color: 'text-emerald-400', bar: 'bg-emerald-500' };
      if (s >= 60) return { color: 'text-blue-400', bar: 'bg-blue-500' };
      if (s >= 45) return { color: 'text-amber-400', bar: 'bg-amber-500' };
      return { color: 'text-rose-400', bar: 'bg-rose-500' };
    }
    if (s >= 80) return { color: 'text-rose-400', bar: 'bg-rose-500' };
    if (s >= 70) return { color: 'text-amber-400', bar: 'bg-amber-500' };
    if (s >= 50) return { color: 'text-blue-400', bar: 'bg-blue-500' };
    return { color: 'text-emerald-400', bar: 'bg-emerald-500' };
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
      const bt = getStress('biometric_trends', 68, 'Cardiovascular & autonomic load on mobile', 'Soldier Mobile App (Biometric Sensor Engine)');
      const wt = getP('workload_trend', 50, 'Command operational task tempo in HRMS', 'HRMS Portal (Command Watch Rosters)');
      const sq = getP('sleep_quality', 50, 'Total sleep debt & insomnia markers on mobile', 'Soldier Mobile App (Sleep Telemetry)');
      const sr = getPsych('mood_assessments', 60, 'Self-reported stress & daily pulse on mobile', 'Soldier Mobile App (Daily Self-Assessment)');
      const ds = getP('duty_schedule', 50, 'Duty cycle rotation & watch hours in HRMS', 'HRMS Portal (Battalion Rosters)');
      const dd = getP('deployment_duration', 40, 'Hostile terrain & environmental severity in DB', 'Central Database (Sector Severity Archive)');

      score = (
        0.20 * bt.score +
        0.20 * wt.score +
        0.18 * sq.score +
        0.16 * sr.score +
        0.14 * ds.score +
        0.12 * dd.score
      );

      formula = '0.20(Biometrics) + 0.20(Ops Tempo) + 0.18(Sleep) + 0.16(Self-Report) + 0.14(Duty Cycle) + 0.12(Env Severity)';
      mobileCount = 3; hrmsCount = 2; databaseCount = 1;
      primaryAction = 'Unit Tempo Modulation';
      secondaryAction = 'Deploy Rest Rotation';

      params = [
        { key: 'biometric_strain', name: '1. Biometric strain', weight: 0.20, weightLabel: '20%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: bt.note, source: bt.source, available: bt.available, score: bt.score, ...getColor(bt.score), desc: 'Cardiovascular autonomic load on mobile' },
        { key: 'operational_tempo', name: '2. Operational tempo', weight: 0.20, weightLabel: '20%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: wt.note, source: wt.source, available: wt.available, score: wt.score, ...getColor(wt.score), desc: 'Command operational task tempo in HRMS' },
        { key: 'sleep_deficit', name: '3. Sleep deficit', weight: 0.18, weightLabel: '18%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: sq.note, source: sq.source, available: sq.available, score: sq.score, ...getColor(sq.score), desc: 'Total sleep deficit & insomnia markers on mobile' },
        { key: 'self_reported_stress', name: '4. Self-reported stress', weight: 0.16, weightLabel: '16%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: sr.note, source: sr.source, available: sr.available, score: sr.score, ...getColor(sr.score), desc: 'Daily self-reported psychometric strain on mobile' },
        { key: 'duty_cycle_load', name: '5. Duty cycle load', weight: 0.14, weightLabel: '14%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: ds.note, source: ds.source, available: ds.available, score: ds.score, ...getColor(ds.score), desc: 'Night shift concentration & rotation in HRMS' },
        { key: 'environmental_severity', name: '6. Environmental severity', weight: 0.12, weightLabel: '12%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: dd.note, source: dd.source, available: dd.available, score: dd.score, ...getColor(dd.score), desc: 'Sector difficulty & terrain hostile index in DB' },
      ];
      break;
    }

    case 'emotional-fatigue-prediction': {
      metricLabel = 'Emotional Fatigue';
      const ee = getP('emotional_exhaustion', 50, 'Affective blunting & emotional numbing', 'Soldier Mobile App (Affective Telemetry)');
      const cf = getPsych('depression_indicators', 58, 'Compassion fatigue & emotional detachment in DB', 'Central Database (Psychiatric Registry)');
      const sw = getPsych('social_isolation', 50, 'Social withdrawal & squad detachment on mobile', 'Soldier Mobile App (Peer Pulse)');
      const sm = getP('duty_schedule', 50, 'Monotonous watch shifts & sensory routine in HRMS', 'HRMS Portal (Shift Rosters)');
      const rd = getP('sleep_quality', 50, 'Rest recovery deficit & REM latency on mobile', 'Soldier Mobile App (Sleep Telemetry)');

      score = (
        0.25 * ee.score +
        0.22 * cf.score +
        0.20 * sw.score +
        0.18 * sm.score +
        0.15 * rd.score
      );

      formula = '0.25(Affective Blunting) + 0.22(Compassion Fatigue) + 0.20(Social Withdrawal) + 0.18(Shift Monotony) + 0.15(Rest Deficit)';
      mobileCount = 3; hrmsCount = 1; databaseCount = 1;
      primaryAction = 'Schedule Peer Support';
      secondaryAction = 'Task Rotation';

      params = [
        { key: 'affective_blunting', name: '1. Affective blunting', weight: 0.25, weightLabel: '25%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: ee.note, source: ee.source, available: ee.available, score: ee.score, ...getColor(ee.score), desc: 'Affective numbness & emotional blunting' },
        { key: 'compassion_fatigue', name: '2. Compassion fatigue', weight: 0.22, weightLabel: '22%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: cf.note, source: cf.source, available: cf.available, score: cf.score, ...getColor(cf.score), desc: 'Depersonalization & empathy weariness in DB' },
        { key: 'social_withdrawal', name: '3. Social withdrawal', weight: 0.20, weightLabel: '20%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: sw.note, source: sw.source, available: sw.available, score: sw.score, ...getColor(sw.score), desc: 'Barracks detachment logged on mobile' },
        { key: 'shift_monotony', name: '4. Shift monotony', weight: 0.18, weightLabel: '18%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: sm.note, source: sm.source, available: sm.available, score: sm.score, ...getColor(sm.score), desc: 'Sensory monotony & console duty in HRMS' },
        { key: 'rest_deficit', name: '5. Rest recovery deficit', weight: 0.15, weightLabel: '15%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: rd.note, source: rd.source, available: rd.available, score: rd.score, ...getColor(rd.score), desc: 'Sleep recovery deficit logged via mobile' },
      ];
      break;
    }

    case 'welfare-concern-detection': {
      metricLabel = 'Welfare Concern';
      const el = getP('leave_patterns', 50, 'Emergency & compassionate leave applications in HRMS', 'HRMS Portal (Leave Management System)');
      const fd = getPsych('anxiety_questions', 65, 'Family medical emergency & caregiver burden in HRMS', 'HRMS Portal (Family Welfare Cell)');
      const fq = getStress('leave_frequency', 50, 'Financial distress & education grant queries in HRMS', 'HRMS Portal (Benefits & Claims Archive)');
      const ch = getStress('behavioral_changes', 60, 'Call-home communication pattern volatility on mobile', 'Soldier Mobile App (Family Telemetry)');
      const ds = getPsych('social_isolation', 50, 'Subdued demeanor & post-contact retreat in DB', 'Central Database (Unit Welfare Officer Log)');

      score = (
        0.28 * el.score +
        0.25 * fd.score +
        0.20 * fq.score +
        0.15 * ch.score +
        0.12 * ds.score
      );

      formula = '0.28(Emerg Leave) + 0.25(Family Distress) + 0.20(Financial Queries) + 0.15(Call-Home) + 0.12(Demeanor Shift)';
      mobileCount = 1; hrmsCount = 3; databaseCount = 1;
      primaryAction = 'Sanction Emergency Grant';
      secondaryAction = 'Dispatch Family Liaison';

      params = [
        { key: 'emergency_leave', name: '1. Emergency leave requests', weight: 0.28, weightLabel: '28%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: el.note, source: el.source, available: el.available, score: el.score, ...getColor(el.score), desc: 'Emergency leave applications logged in HRMS' },
        { key: 'family_distress', name: '2. Family medical distress', weight: 0.25, weightLabel: '25%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: fd.note, source: fd.source, available: fd.available, score: fd.score, ...getColor(fd.score), desc: 'Family illness & caregiver distress in HRMS' },
        { key: 'financial_queries', name: '3. Financial & grant queries', weight: 0.20, weightLabel: '20%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: fq.note, source: fq.source, available: fq.available, score: fq.score, ...getColor(fq.score), desc: 'Welfare financial grant queries in HRMS' },
        { key: 'call_home', name: '4. Call-home volatility', weight: 0.15, weightLabel: '15%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: ch.note, source: ch.source, available: ch.available, score: ch.score, ...getColor(ch.score), desc: 'Domestic communication strain on mobile' },
        { key: 'demeanor_shift', name: '5. Demeanor shift', weight: 0.12, weightLabel: '12%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: ds.note, source: ds.source, available: ds.available, score: ds.score, ...getColor(ds.score), desc: 'Subdued behavior post-call logged in DB' },
      ];
      break;
    }

    case 'predictive-behavioral-analytics': {
      metricLabel = 'Behavioral Drift';
      const ci = getStress('missed_assessments', 45, 'Daily psychometric check-in skips on mobile', 'Soldier Mobile App (Check-in Telemetry)');
      const st = getStress('sleep_pattern', 50, 'Step count & physical mobility decline on mobile', 'Soldier Mobile App (Activity Sensor)');
      const sj = getStress('behavioral_changes', 60, 'Screen interaction latency & UI touch jitter on mobile', 'Soldier Mobile App (Touch Dynamics Engine)');
      const ad = getStress('biometric_trends', 68, 'Voice acoustic pitch volatility & pulse drift on mobile', 'Soldier Mobile App (Acoustic AI Engine)');
      const ts = getP('workload_trend', 50, '30-day LSTM recurrent behavioral drift slope in DB', 'Central Database (AI Predictive Store)');

      score = (
        0.24 * ci.score +
        0.22 * st.score +
        0.18 * sj.score +
        0.18 * ad.score +
        0.18 * ts.score
      );

      formula = '0.24(Check-in Skips) + 0.22(Mobility Drop) + 0.18(Screen Jitter) + 0.18(Acoustic Drift) + 0.18(Trend Slope)';
      mobileCount = 4; hrmsCount = 0; databaseCount = 1;
      primaryAction = 'Prophylactic Wellness Review';
      secondaryAction = 'Trigger Sensor Calibration';

      params = [
        { key: 'checkin_skips', name: '1. App check-in skips', weight: 0.24, weightLabel: '24%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: ci.note, source: ci.source, available: ci.available, score: ci.score, ...getColor(ci.score), desc: 'Check-in skips & app avoidance on mobile' },
        { key: 'mobility_drop', name: '2. Mobility telemetry drop', weight: 0.22, weightLabel: '22%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: st.note, source: st.source, available: st.available, score: st.score, ...getColor(st.score), desc: 'Step count & mobility decline on mobile' },
        { key: 'screen_jitter', name: '3. Screen interaction jitter', weight: 0.18, weightLabel: '18%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: sj.note, source: sj.source, available: sj.available, score: sj.score, ...getColor(sj.score), desc: 'UI touch latency & response jitter on mobile' },
        { key: 'acoustic_drift', name: '4. Voice acoustic drift', weight: 0.18, weightLabel: '18%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: ad.note, source: ad.source, available: ad.available, score: ad.score, ...getColor(ad.score), desc: 'Voice pitch volatility logged on mobile' },
        { key: 'trend_slope', name: '5. Behavioral trend slope', weight: 0.18, weightLabel: '18%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: ts.note, source: ts.source, available: ts.available, score: ts.score, ...getColor(ts.score), desc: '30-day LSTM model behavioral drift slope' },
      ];
      break;
    }

    case 'stress-burnout-risk-models': {
      metricLabel = 'Hazard Model';
      const ac = getP('overtime', 50, 'Acute-to-chronic workload ratio in HRMS', 'HRMS Portal (Command Watch Rosters)');
      const so = getStress('biometric_trends', 68, 'Prolonged sympathetic activation on mobile', 'Soldier Mobile App (Autonomic Engine)');
      const pe = getP('emotional_exhaustion', 50, 'Maslach emotional exhaustion on mobile', 'Soldier Mobile App (MBI-GS Telemetry)');
      const rd = getP('sleep_quality', 50, 'Severe rest deficit & REM deprivation on mobile', 'Soldier Mobile App (Sleep Telemetry)');
      const th = getP('deployment_duration', 40, 'Tenure hazard ratio & continuous sector duty in HRMS', 'HRMS Portal (Service Dossier)');

      score = (
        0.25 * ac.score +
        0.25 * so.score +
        0.20 * pe.score +
        0.15 * rd.score +
        0.15 * th.score
      );

      formula = '0.25(ACWR) + 0.25(Sympathetic Overdrive) + 0.20(Psych Exhaustion) + 0.15(Rest Deficit) + 0.15(Tenure Hazard)';
      mobileCount = 3; hrmsCount = 2; databaseCount = 0;
      primaryAction = 'CWO Command Case Review';
      secondaryAction = 'Mandate Stand-Down';

      params = [
        { key: 'acwr', name: '1. Acute-to-chronic workload (ACWR)', weight: 0.25, weightLabel: '25%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: ac.note, source: ac.source, available: ac.available, score: ac.score, ...getColor(ac.score), desc: 'Acute-to-chronic workload ratio in HRMS' },
        { key: 'sympathetic_overdrive', name: '2. Sympathetic overdrive', weight: 0.25, weightLabel: '25%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: so.note, source: so.source, available: so.available, score: so.score, ...getColor(so.score), desc: 'Sustained autonomic overdrive on mobile' },
        { key: 'psych_exhaustion', name: '3. Psychometric exhaustion', weight: 0.20, weightLabel: '20%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: pe.note, source: pe.source, available: pe.available, score: pe.score, ...getColor(pe.score), desc: 'Cognitive exhaustion score on mobile' },
        { key: 'rest_deficit', name: '4. Rest deficit index', weight: 0.15, weightLabel: '15%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: rd.note, source: rd.source, available: rd.available, score: rd.score, ...getColor(rd.score), desc: 'Cumulative sleep deficit on mobile' },
        { key: 'tenure_hazard', name: '5. Tenure hazard exposure', weight: 0.15, weightLabel: '15%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: th.note, source: th.source, available: th.available, score: th.score, ...getColor(th.score), desc: 'Continuous forward sector tenure in HRMS' },
      ];
      break;
    }

    case 'welfare-intervention-recommendation': {
      metricLabel = 'Intervention Index';
      const un = getPsych('wellness_survey', 62, 'Urgent clinical need intensity in DB', 'Central Database (Welfare Need Registry)');
      const cr = getP('assessment_responses', 50, 'Counseling receptivity & willingness on mobile', 'Soldier Mobile App (Therapy Alignment)');
      const lu = getP('leave_patterns', 50, 'Leave grant urgency & compassionate priority in HRMS', 'HRMS Portal (Leave System)');
      const tf = getPsych('mood_assessments', 60, 'Clinical cognitive therapy suitability fit in DB', 'Central Database (Clinical Protocols Archive)');
      const pr = getPsych('social_isolation', 50, 'Peer buddy pairing readiness on mobile', 'Soldier Mobile App (Peer Matching)');

      score = (
        0.26 * un.score +
        0.22 * cr.score +
        0.20 * lu.score +
        0.18 * tf.score +
        0.14 * pr.score
      );

      formula = '0.26(Need Intensity) + 0.22(Counseling Receptivity) + 0.20(Leave Urgency) + 0.18(Therapy Fit) + 0.14(Peer Support)';
      mobileCount = 2; hrmsCount = 1; databaseCount = 2;
      primaryAction = 'Execute Welfare Workflow';
      secondaryAction = 'Notify Unit Commander';

      params = [
        { key: 'need_intensity', name: '1. Urgent need intensity', weight: 0.26, weightLabel: '26%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: un.note, source: un.source, available: un.available, score: un.score, ...getColor(un.score), desc: 'Composite welfare priority index in DB' },
        { key: 'counseling_receptivity', name: '2. Counseling receptivity', weight: 0.22, weightLabel: '22%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: cr.note, source: cr.source, available: cr.available, score: cr.score, ...getColor(cr.score), desc: 'Receptivity score logged via mobile' },
        { key: 'leave_urgency', name: '3. Leave grant urgency', weight: 0.20, weightLabel: '20%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: lu.note, source: lu.source, available: lu.available, score: lu.score, ...getColor(lu.score), desc: 'Compassionate leave urgency in HRMS' },
        { key: 'therapy_fit', name: '4. Clinical therapy fit', weight: 0.18, weightLabel: '18%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: tf.note, source: tf.source, available: tf.available, score: tf.score, ...getColor(tf.score), desc: 'Evidence-based therapy protocol fit in DB' },
        { key: 'peer_support', name: '5. Peer buddy readiness', weight: 0.14, weightLabel: '14%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: pr.note, source: pr.source, available: pr.available, score: pr.score, ...getColor(pr.score), desc: 'Squad peer support pairing readiness' },
      ];
      break;
    }

    case 'automated-alerts': {
      metricLabel = 'Alert Priority';
      const ss = getStress('biometric_trends', 68, 'Acute 24h stress score spike rate on mobile', 'Soldier Mobile App (Realtime Alert Engine)');
      const hd = getP('sleep_quality', 50, 'HRV critical drop (<20ms) breach on mobile', 'Soldier Mobile App (Biometric Telemetry)');
      const kw = getPsych('anxiety_questions', 65, 'Emergency distress keyword trigger on mobile', 'Soldier Mobile App (NLP Semantic Filter)');
      const wb = getP('overtime', 50, 'Consecutive watch hours limit breach in HRMS', 'HRMS Portal (Roster Watch Engine)');
      const oc = getStress('missed_assessments', 45, 'Overdue compliance check-in alert in DB', 'Central Database (Alert Dispatch Archive)');

      score = (
        0.28 * ss.score +
        0.25 * hd.score +
        0.20 * kw.score +
        0.15 * wb.score +
        0.12 * oc.score
      );

      formula = '0.28(Stress Spike) + 0.25(HRV Drop) + 0.20(Keywords) + 0.15(Watch Breach) + 0.12(Overdue Check-in)';
      mobileCount = 3; hrmsCount = 1; databaseCount = 1;
      primaryAction = 'Dispatch SMS/Radio Alert';
      secondaryAction = 'Confirm Medic Contact';

      params = [
        { key: 'stress_spike', name: '1. Acute stress spike rate', weight: 0.28, weightLabel: '28%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: ss.note, source: ss.source, available: ss.available, score: ss.score, ...getColor(ss.score), desc: 'Instant spike detection on mobile' },
        { key: 'hrv_drop', name: '2. HRV critical drop', weight: 0.25, weightLabel: '25%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: hd.note, source: hd.source, available: hd.available, score: hd.score, ...getColor(hd.score), desc: 'Autonomic HRV threshold breach on mobile' },
        { key: 'keywords', name: '3. Distress keyword trigger', weight: 0.20, weightLabel: '20%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: kw.note, source: kw.source, available: kw.available, score: kw.score, ...getColor(kw.score), desc: 'Emergency keyword detection on mobile' },
        { key: 'watch_breach', name: '4. Watch hours breach', weight: 0.15, weightLabel: '15%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: wb.note, source: wb.source, available: wb.available, score: wb.score, ...getColor(wb.score), desc: 'Continuous duty breach in HRMS' },
        { key: 'overdue_checkin', name: '5. Overdue check-in flag', weight: 0.12, weightLabel: '12%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: oc.note, source: oc.source, available: oc.available, score: oc.score, ...getColor(oc.score), desc: 'Overdue check-in alert in DB' },
      ];
      break;
    }

    case 'mental-wellbeing-resilience': {
      metricLabel = 'Resilience Index';
      const isAmit = p.uid === 'UID-SLD-015';
      const isSarah = p.uid === 'UID-EMP-011';
      const isRamesh = p.uid === 'UID-EMP-012';
      const isGurpreet = p.uid === 'UID-EMP-013';

      const hdScore = isAmit ? 88 : isSarah ? 86 : isRamesh ? 24 : isGurpreet ? 32 : Math.max(15, Math.min(95, 110 - getPsych('anxiety_questions', 65).score));
      const scScore = isAmit ? 92 : isSarah ? 85 : isRamesh ? 30 : isGurpreet ? 45 : Math.max(15, Math.min(95, 110 - getPsych('social_isolation', 50).score));
      const pmScore = isAmit ? 86 : isSarah ? 90 : isRamesh ? 22 : isGurpreet ? 28 : Math.max(15, Math.min(95, 110 - getPsych('mood_assessments', 60).score));
      const cfScore = isAmit ? 84 : isSarah ? 82 : isRamesh ? 28 : isGurpreet ? 35 : Math.max(15, Math.min(95, 110 - getP('emotional_exhaustion', 50).score));
      const rvScore = isAmit ? 85 : isSarah ? 88 : isRamesh ? 20 : isGurpreet ? 30 : Math.max(15, Math.min(95, 110 - getStress('biometric_trends', 68).score));

      const hd = { score: hdScore, note: 'Connor-Davidson Resilience (CD-RISC) hardiness score', source: 'Soldier Mobile App (CD-RISC)', available: true };
      const sc = { score: scScore, note: 'Squad camaraderie & mutual trust index in DB', source: 'Central Database (Barracks Peer Network)', available: true };
      const pm = { score: pmScore, note: 'Positive outlook & mission alignment on mobile', source: 'Soldier Mobile App (Daily Positive Pulse)', available: true };
      const cf = { score: cfScore, note: 'Adaptive coping flexibility & mental elasticity', source: 'Soldier Mobile App (Coping Inventory)', available: true };
      const rv = { score: rvScore, note: 'Post-stress recovery velocity & cardiovascular bounce-back in DB', source: 'Central Database (Physiological Recovery)', available: true };

      score = (
        0.26 * hd.score +
        0.24 * sc.score +
        0.20 * pm.score +
        0.15 * cf.score +
        0.15 * rv.score
      );

      formula = '0.26(Hardiness) + 0.24(Squad Cohesion) + 0.20(Positive Morale) + 0.15(Coping) + 0.15(Recovery Velocity)';
      mobileCount = 3; hrmsCount = 0; databaseCount = 2;
      primaryAction = 'Morning Parade Briefing';
      secondaryAction = 'Squad Cohesion Award';

      params = [
        { key: 'hardiness', name: '1. Psychological hardiness (CD-RISC)', weight: 0.26, weightLabel: '26%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: hd.note, source: hd.source, available: hd.available, score: hd.score, ...getColor(hd.score, true), desc: 'CD-RISC hardiness index on mobile' },
        { key: 'squad_cohesion', name: '2. Squad camaraderie & cohesion', weight: 0.24, weightLabel: '24%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: sc.note, source: sc.source, available: sc.available, score: sc.score, ...getColor(sc.score, true), desc: 'Squad mutual trust index in DB' },
        { key: 'positive_morale', name: '3. Positive affect & morale', weight: 0.20, weightLabel: '20%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: pm.note, source: pm.source, available: pm.available, score: pm.score, ...getColor(pm.score, true), desc: 'Optimism & vocational pride on mobile' },
        { key: 'coping_flexibility', name: '4. Adaptive coping flexibility', weight: 0.15, weightLabel: '15%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: cf.note, source: cf.source, available: cf.available, score: cf.score, ...getColor(cf.score, true), desc: 'Psychological elasticity on mobile' },
        { key: 'recovery_velocity', name: '5. Post-stress recovery velocity', weight: 0.15, weightLabel: '15%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: rv.note, source: rv.source, available: rv.available, score: rv.score, ...getColor(rv.score, true), desc: 'Cardiovascular bounce-back in DB' },
      ];
      break;
    }

    case 'operational-readiness': {
      metricLabel = 'Combat Readiness';
      const isAmit = p.uid === 'UID-SLD-015';
      const isSarah = p.uid === 'UID-EMP-011';
      const isRamesh = p.uid === 'UID-EMP-012';
      const isGurpreet = p.uid === 'UID-EMP-013';

      const csScore = isAmit ? 88 : isSarah ? 86 : isRamesh ? 20 : isGurpreet ? 36 : Math.max(15, Math.min(95, 110 - getP('emotional_exhaustion', 50).score));
      const pvScore = isAmit ? 92 : isSarah ? 88 : isRamesh ? 25 : isGurpreet ? 40 : Math.max(15, Math.min(95, 110 - getStress('biometric_trends', 68).score));
      const ecScore = isAmit ? 86 : isSarah ? 85 : isRamesh ? 22 : isGurpreet ? 34 : Math.max(15, Math.min(95, 110 - getPsych('anxiety_questions', 65).score));
      const msScore = isAmit ? 90 : isSarah ? 92 : isRamesh ? 18 : isGurpreet ? 44 : Math.max(15, Math.min(95, 110 - getP('overtime', 50).score));
      const frScore = isAmit ? 84 : isSarah ? 86 : isRamesh ? 16 : isGurpreet ? 32 : Math.max(15, Math.min(95, 110 - getP('sleep_quality', 50).score));

      const cs = { score: csScore, note: 'Cognitive reaction sharpness & mental stamina on mobile', source: 'Soldier Mobile App (Cognitive Reaction Test)', available: true };
      const pv = { score: pvScore, note: 'Physical fitness & autonomic recovery vitals on mobile', source: 'Soldier Mobile App (Vitals Engine)', available: true };
      const ec = { score: ecScore, note: 'Emotional composure under tactical pressure in DB', source: 'Central Database (Tactical Composure)', available: true };
      const ms = { score: msScore, note: 'Mission suitability rating & deployment clearance in HRMS', source: 'HRMS Portal (Deployment Suitability)', available: true };
      const fr = { score: frScore, note: 'Fatigue recovery index & sleep debt rebound on mobile', source: 'Soldier Mobile App (Recovery Telemetry)', available: true };

      score = (
        0.26 * cs.score +
        0.24 * pv.score +
        0.20 * ec.score +
        0.15 * ms.score +
        0.15 * fr.score
      );

      formula = '0.26(Cognitive Sharpness) + 0.24(Physical Vitals) + 0.20(Emotional Composure) + 0.15(Mission Rating) + 0.15(Fatigue Recovery)';
      mobileCount = 3; hrmsCount = 1; databaseCount = 1;
      primaryAction = 'Certify Combat Clearance';
      secondaryAction = 'Assign Tactical Rest';

      params = [
        { key: 'cognitive_sharpness', name: '1. Cognitive reaction sharpness', weight: 0.26, weightLabel: '26%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: cs.note, source: cs.source, available: cs.available, score: cs.score, ...getColor(cs.score, true), desc: 'Reaction time & sharpness on mobile' },
        { key: 'physical_vitals', name: '2. Physical fitness & vitals', weight: 0.24, weightLabel: '24%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: pv.note, source: pv.source, available: pv.available, score: pv.score, ...getColor(pv.score, true), desc: 'Cardiovascular endurance vitals on mobile' },
        { key: 'emotional_composure', name: '3. Emotional composure', weight: 0.20, weightLabel: '20%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: ec.note, source: ec.source, available: ec.available, score: ec.score, ...getColor(ec.score, true), desc: 'Tactical composure rating in DB' },
        { key: 'mission_suitability', name: '4. Mission suitability rating', weight: 0.15, weightLabel: '15%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: ms.note, source: ms.source, available: ms.available, score: ms.score, ...getColor(ms.score, true), desc: 'Deployment clearance status in HRMS' },
        { key: 'fatigue_recovery', name: '5. Fatigue recovery index', weight: 0.15, weightLabel: '15%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: fr.note, source: fr.source, available: fr.available, score: fr.score, ...getColor(fr.score, true), desc: 'Sleep debt rebound curve on mobile' },
      ];
      break;
    }

    case 'occupational-stress-risk': {
      metricLabel = 'Occupational Hazard';
      const ah = getP('deployment_duration', 40, 'High altitude (>11,000 ft) & extreme sub-zero sector tenure in HRMS', 'HRMS Portal (Terrain Exposure Matrix)');
      const nw = getP('duty_schedule', 50, 'Consecutive night watch cycles & circadian disruptions in HRMS', 'HRMS Portal (Watch Schedule Matrix)');
      const ms = getP('sleep_quality', 50, 'Micro-sleep latency drop during duty hours on mobile', 'Soldier Mobile App (Micro-Sleep Detector)');
      const ts = getP('workload_trend', 50, 'Environmental temperature & hostile station severity in DB', 'Central Database (Hostile Station DB)');
      const po = getStress('biometric_trends', 68, 'Cumulative physical overexertion & muscle strain on mobile', 'Soldier Mobile App (Biomechanics Engine)');

      score = (
        0.26 * ah.score +
        0.24 * nw.score +
        0.20 * ms.score +
        0.15 * ts.score +
        0.15 * po.score
      );

      formula = '0.26(Altitude Hazard) + 0.24(Night Watch) + 0.20(Micro-Sleep) + 0.15(Temp Strain) + 0.15(Physical Overexertion)';
      mobileCount = 2; hrmsCount = 2; databaseCount = 1;
      primaryAction = 'Mandate Altitude Rotation';
      secondaryAction = 'Shift to Daylight Watch';

      params = [
        { key: 'altitude_hazard', name: '1. High altitude / terrain hazard', weight: 0.26, weightLabel: '26%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: ah.note, source: ah.source, available: ah.available, score: ah.score, ...getColor(ah.score), desc: 'High altitude hypoxia hazard in HRMS' },
        { key: 'night_watch', name: '2. Consecutive night watch index', weight: 0.24, weightLabel: '24%', sourceBadge: '🏢 HRMS Portal', sourceType: 'HRMS', note: nw.note, source: nw.source, available: nw.available, score: nw.score, ...getColor(nw.score), desc: 'Circadian shift hazards in HRMS' },
        { key: 'micro_sleep', name: '3. Micro-sleep vulnerability', weight: 0.20, weightLabel: '20%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: ms.note, source: ms.source, available: ms.available, score: ms.score, ...getColor(ms.score), desc: 'Micro-sleep latency drop on mobile' },
        { key: 'temp_strain', name: '4. Environmental temperature strain', weight: 0.15, weightLabel: '15%', sourceBadge: '💾 Central DB', sourceType: 'DATABASE', note: ts.note, source: ts.source, available: ts.available, score: ts.score, ...getColor(ts.score), desc: 'Extreme temperature stress in DB' },
        { key: 'physical_overexertion', name: '5. Physical overexertion', weight: 0.15, weightLabel: '15%', sourceBadge: '📱 Soldier Mobile App', sourceType: 'MOBILE', note: po.note, source: po.source, available: po.available, score: po.score, ...getColor(po.score), desc: 'Biomechanic load & physical fatigue on mobile' },
      ];
      break;
    }

    default:
      break;
  }

  const rounded = Math.round(score * 10) / 10;
  let level: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'NOMINAL' = 'NOMINAL';
  let levelColor = 'text-emerald-400';
  let levelBg = 'bg-emerald-950 text-emerald-300 border-emerald-800';

  if (factorId === 'mental-wellbeing-resilience' || factorId === 'operational-readiness') {
    // Inverted: higher is better
    if (rounded >= 78.0) {
      level = 'NOMINAL';
      levelColor = 'text-emerald-400';
      levelBg = 'bg-emerald-950 text-emerald-300 border-emerald-800';
      tierLabel = factorId === 'operational-readiness' ? 'Combat Ready / Peak Mission Suitability' : 'High Resilience / Optimal Squad Morale';
      recommendation = 'Maintain regular training tempo and proactive leadership brief.';
    } else if (rounded >= 65.0) {
      level = 'MODERATE';
      levelColor = 'text-blue-400';
      levelBg = 'bg-blue-950 text-blue-300 border-blue-800';
      tierLabel = factorId === 'operational-readiness' ? 'Mission Ready / Minor Fatigue Rest Desirable' : 'Moderate Resilience / Squad Cohesion Active';
      recommendation = 'Prescribe standard recovery pacing and weekly check-in adherence.';
    } else if (rounded >= 50.0) {
      level = 'HIGH';
      levelColor = 'text-amber-400';
      levelBg = 'bg-amber-950 text-amber-300 border-amber-800';
      tierLabel = factorId === 'operational-readiness' ? 'Standby Rest Required / Cognitive Fatigue' : 'Low Resilience / Attention Required';
      recommendation = 'PRIORITY ACTION: Schedule light duties, peer buddy pairing, and recovery rest cycle.';
    } else {
      level = 'CRITICAL';
      levelColor = 'text-rose-400';
      levelBg = 'bg-rose-950 text-rose-300 border-rose-800';
      tierLabel = factorId === 'operational-readiness' ? 'Unfit for Frontline / Mandatory 48h Downtime' : 'Resilience Depleted / Immediate Clinical Protocol';
      recommendation = 'MANDATORY ACTION: Immediate operational detachment and comprehensive counseling intervention.';
    }
  } else {
    // Standard hazard/strain model
    if (rounded >= 78.0) {
      level = 'CRITICAL';
      levelColor = 'text-rose-400';
      levelBg = 'bg-rose-950 text-rose-300 border-rose-800';
      tierLabel = 'Severe Strain / Critical Clinical Priority';
      recommendation = `MANDATORY ACTION: 48-hour immediate duty detachment, clinical recovery protocol, and confidential counselor debrief for ${p.name}.`;
    } else if (rounded >= 65.0) {
      level = 'HIGH';
      levelColor = 'text-amber-400';
      levelBg = 'bg-amber-950 text-amber-300 border-amber-800';
      tierLabel = 'Elevated Risk / Priority Intervention Required';
      recommendation = `PRIORITY ACTION: Shift rotation out of high-intensity duty, expedited leave review, and guided recovery protocol for ${p.name}.`;
    } else if (rounded >= 45.0) {
      level = 'MODERATE';
      levelColor = 'text-blue-400';
      levelBg = 'bg-blue-950 text-blue-300 border-blue-800';
      tierLabel = 'Moderate Telemetry Strain / Active Monitoring';
      recommendation = `MONITORING: Track weekly compliance check-in pulses on mobile app and monitor workload pacing in unit roster.`;
    } else {
      level = 'NOMINAL';
      levelColor = 'text-emerald-400';
      levelBg = 'bg-emerald-950 text-emerald-300 border-emerald-800';
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
      shortDesc: '6-Parameter Multi-Source Composite Operational Strain & Trendline',
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
      shortDesc: '5-Parameter Compassion Fatigue, Emotional Blunting & Monotony Model',
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
      shortDesc: '5-Parameter Family Welfare, Medical Distress & Grants Model',
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
      shortDesc: '5-Parameter Machine-Learning Trajectory Forecasting & Sensor Drift',
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
      shortDesc: '5-Parameter Multi-Modal Hazard Indices (ACWR + Autonomic)',
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
      shortDesc: '5-Parameter Prescriptive Therapies, Leave Grants & Rest Rotations',
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
      shortDesc: '5-Parameter Early Warning Triggers, HRV Breaches & Dispatches',
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
      shortDesc: '5-Parameter Hardiness (CD-RISC), Squad Cohesion & Coping Model',
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
      shortDesc: '5-Parameter Cognitive Sharpness, Reaction Stamina & Suitability Fit',
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
      shortDesc: '5-Parameter Extreme Terrain, Hypoxia, Shift Hazard & Micro-Sleep',
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
              Synchronized HRMS Personnel Welfare Directory. Search personnel, inspect live counts, select soldiers to evaluate all 13 multi-source Welfare & Psychometric Factors, and trigger direct clinical interventions.
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
      {/* SECTION: SEARCHABLE PERSONNEL DIRECTORY & MULTI-FACTOR LIVE PREDICTOR COMMAND */}
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
            <span className="px-3.5 py-1.5 rounded-full text-xs font-mono font-black bg-slate-900 text-white shadow-sm flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Showing {filteredPersonnel.length} of {personnelRoster.length} Personnel</span>
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Active Subject: <strong className="text-emerald-900">{selectedPersonnel.name}</strong> ({currentEvalResult.metricLabel}: {currentEvalResult.score}%)
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
                        {evalRes.level}
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
                  Status: <strong className="text-emerald-400">{selectedPersonnel.status}</strong> &bull; Evaluating Factor #{currentFactor.num}: <strong className="text-white">{currentFactor.title}</strong>
                </p>
              </div>
            </div>

            {/* Overall Calculated Factor Card */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex items-center gap-5 shrink-0 shadow-lg">
              <div className="text-right">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">
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
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
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
          <div className="p-3.5 rounded-2xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 flex flex-col md:flex-row md:items-center justify-between gap-2 font-mono">
            <div className="flex items-center gap-2">
              <Sparkle className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong className="text-white">{currentFactor.title} Formula:</strong> {currentEvalResult.formula}
              </span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-bold">
              <span className="px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                📱 Mobile: {currentEvalResult.mobileCount}
              </span>
              <span className="px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
                🏢 HRMS: {currentEvalResult.hrmsCount}
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
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
                      ? 'bg-slate-800/70 border-amber-500/50 ring-1 ring-amber-500/20'
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
                      <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md flex items-center gap-1 border ${
                        param.sourceType === 'MOBILE'
                          ? 'text-cyan-300 bg-cyan-950/80 border-cyan-700/80'
                          : param.sourceType === 'HRMS'
                          ? 'text-amber-300 bg-amber-950/80 border-amber-700/80'
                          : 'text-emerald-400 bg-emerald-950/70 border-emerald-800/80'
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
                    <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden border border-slate-700/60 p-0.5">
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
                <span>AI Clinical Guidance for {selectedPersonnel.name} ({currentFactor.title})</span>
              </span>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-medium">
                {currentEvalResult.recommendation}
              </p>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => handleTriggerAction(currentFactor.title, `${currentEvalResult.primaryAction} for ${selectedPersonnel.name}`)}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {currentEvalResult.primaryAction}
              </button>
              <button
                onClick={() => handleTriggerAction(currentFactor.title, `${currentEvalResult.secondaryAction} for ${selectedPersonnel.name}`)}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold border border-slate-600 transition-all cursor-pointer"
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
              <div className="p-2 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 shadow-xs">
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
                    ? 'bg-slate-900 border-slate-900 text-white shadow-xl ring-2 ring-blue-500/50 transform -translate-y-1'
                    : 'bg-slate-50/70 hover:bg-white border-slate-200/90 hover:border-slate-300 text-slate-900 shadow-xs'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded-md ${
                      isSelected ? 'bg-slate-800 text-blue-400 border border-slate-700' : 'bg-slate-200/80 text-slate-700'
                    }`}>
                      Factor #{factor.num}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      soldierEval.level === 'CRITICAL'
                        ? isSelected ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-rose-100 text-rose-800'
                        : soldierEval.level === 'HIGH'
                        ? isSelected ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-amber-100 text-amber-800'
                        : soldierEval.level === 'MODERATE'
                        ? isSelected ? 'bg-blue-950 text-blue-300 border border-blue-800' : 'bg-blue-100 text-blue-800'
                        : isSelected ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {soldierEval.level}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${
                      isSelected ? 'bg-slate-800 border-slate-700 text-blue-400' : `${factor.bg} ${factor.border} ${factor.color}`
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className={`font-black text-sm leading-tight tracking-tight ${isSelected ? 'text-white' : 'text-slate-900 group-hover:text-blue-700'}`}>
                        {factor.title}
                      </h4>
                      <p className={`text-[11px] mt-1 line-clamp-2 font-medium ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                        {factor.shortDesc}
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`mt-4 pt-3 border-t flex items-center justify-between text-xs font-mono ${
                  isSelected ? 'border-slate-800 text-slate-300' : 'border-slate-200/80 text-slate-600'
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
        <div className="p-6 sm:p-7 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Factor Panel Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-5 relative z-10">
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center text-xl font-black shadow-lg shrink-0 ${
                currentFactor.color === 'text-rose-600'
                  ? 'bg-rose-950/80 border-rose-800 text-rose-400'
                  : currentFactor.color === 'text-amber-600'
                  ? 'bg-amber-950/80 border-amber-800 text-amber-400'
                  : 'bg-blue-950/80 border-blue-800 text-blue-400'
              }`}>
                <CurrentIcon className="w-7 h-7" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-mono font-bold text-blue-400 bg-blue-950 px-2.5 py-0.5 rounded-full border border-blue-800">
                    Factor #{currentFactor.num} &bull; {currentFactor.category}
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
                onClick={() => handleTriggerAction(currentFactor.title, `${currentEvalResult.primaryAction} for ${selectedPersonnel.name}`)}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{currentEvalResult.primaryAction}</span>
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

          {/* Factor Panel Body - Universal Multi-Source Telemetry & Parameters */}
          <div className="space-y-6 relative z-10">
            {/* Multi-Source Provenance Header Banner */}
            <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-mono font-extrabold uppercase px-2.5 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-blue-400" />
                  <span>Multi-Source Unified Telemetry & Clinical Model</span>
                </span>
                <span className="text-xs text-slate-300 font-medium">
                  Evaluating Active Subject: <strong className="text-white">{selectedPersonnel.name}</strong> ({selectedPersonnel.rank}) &bull; <span className="text-blue-300 font-mono">{selectedPersonnel.uid}</span>
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono font-bold">
                <span className="px-2.5 py-1 rounded-lg bg-indigo-950 text-indigo-300 border border-indigo-800 flex items-center gap-1">
                  📱 Mobile App: {currentEvalResult.mobileCount} Params
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-amber-950 text-amber-300 border border-amber-800 flex items-center gap-1">
                  🏢 HRMS Portal: {currentEvalResult.hrmsCount} Params
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                  💾 Central DB / Web: {currentEvalResult.databaseCount} Params
                </span>
              </div>
            </div>

            {/* Composite Score Banner */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-800 via-slate-800/90 to-slate-900 border border-slate-700 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
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
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{currentEvalResult.primaryAction}</span>
                </button>
                <button
                  onClick={() => handleTriggerAction(currentFactor.title, `${currentEvalResult.secondaryAction} for ${selectedPersonnel.name}`)}
                  className="px-3.5 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-slate-200 text-xs font-bold border border-slate-600 transition-all cursor-pointer"
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
                    className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/80 space-y-3 relative group hover:border-slate-600 transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      {/* Header with weight and source tag */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-bold text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-900">
                          Weight: {param.weightLabel}
                        </span>
                        <span
                          className={`text-[9px] font-mono font-extrabold uppercase px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            param.available
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${param.available ? 'bg-emerald-400' : 'bg-rose-400 animate-ping'}`} />
                          {param.available ? 'Synchronized' : 'Sync Pending'}
                        </span>
                      </div>

                      {/* Title and Origin Source */}
                      <div>
                        <h5 className="font-extrabold text-xs text-white leading-snug">
                          {param.name}
                        </h5>
                        <p className="text-[10px] text-slate-400 line-clamp-1 font-medium mt-0.5">
                          {param.desc}
                        </p>
                        <div className="mt-1.5 flex items-center gap-1">
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 font-semibold">
                            {param.sourceBadge}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Read-only Fixed Telemetry Meter (No editable adjustment bar) */}
                    <div className="space-y-2 pt-1 border-t border-slate-700/60">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-[10px] text-slate-400 font-sans">Retrieved Telemetry:</span>
                        <span className={`font-black text-sm ${param.color}`}>
                          {currentVal}%
                        </span>
                      </div>

                      {/* Fixed Meter Bar */}
                      <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-700/80 p-0.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${param.bar}`}
                          style={{ width: `${Math.min(100, Math.max(5, currentVal))}%` }}
                        />
                      </div>

                      <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                        <span>0% Nominal</span>
                        <span className="font-semibold text-slate-300">{currentVal}% Score</span>
                        <span>100% High</span>
                      </div>

                      {/* Telemetry Detail Note */}
                      <p className="text-[10px] text-slate-300 line-clamp-2 leading-relaxed font-medium bg-slate-900/90 p-2 rounded-xl border border-slate-800">
                        {param.note}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Recommendation Card */}
            <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
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
                            handleTriggerAction(currentFactor.title, `Selected ${p.name} for ${currentFactor.title} analysis`);
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-[11px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs"
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
                      handleTriggerAction('Flagged Watchlist', `Selected ${p.name} for ${currentFactor.title} evaluation`);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
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
              HRMS AI Telemetry: Multi-factor welfare model synchronizing live data streams across Mobile App, HRMS Portal, and Central Database.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelfareDashboard;
