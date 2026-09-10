export interface MetricVariable {
  name: string;
  source: string;
  weight: string;
  description: string;
}

export interface SOPStep {
  step: string;
  title: string;
  action: string;
}

export interface MetricTrendPoint {
  month: string;
  value: number;
}

export interface WelfareFeatureDetail {
  id: string;
  title: string;
  shortName: string;
  category: string;
  weight: string;
  forceCohortCount: number;
  forceCohortPct: number;
  criticalCount: number;
  clinicalBaseline: string;
  confidence: string;
  shortDescription: string;
  fullDescription: string;
  mathematicalFormula: string;
  formulaVariables: MetricVariable[];
  militaryImpact: string[];
  clinicalSymptoms: string[];
  standardOperatingProcedure: SOPStep[];
  historicalTrend: MetricTrendPoint[];
  flaggedPersonnelIds: string[];
}

export const WELFARE_FEATURE_DETAILS: Record<string, WelfareFeatureDetail> = {
  burnout: {
    id: 'burnout',
    title: 'Burnout Prediction & Exhaustion Model',
    shortName: 'Burnout Prediction',
    category: 'Operational Psychometric Diagnostic',
    weight: '16% Composite Weight',
    forceCohortCount: 126,
    forceCohortPct: 24.2,
    criticalCount: 24,
    clinicalBaseline: 'Maslach Burnout Inventory (MBI-GS) + Military Operational Stress Standard',
    confidence: '96.4% AUC-ROC Validated',
    shortDescription: 'Multi-parametric predictor tracking chronic workplace stress resulting from extended operational deployment without adequate psychological respite.',
    fullDescription: 'Burnout in forward defense echelons is characterized by three core dimensions: emotional exhaustion, depersonalization/cynicism toward operational duties, and reduced sense of personal accomplishment. In high-tempo deployment environments such as high-altitude sectors and counter-insurgency grids, sustained cognitive load coupled with restricted recovery cycles accelerates neuroendocrine fatigue.',
    mathematicalFormula: 'B_score = 0.14 × W_overtime + 0.12 × L_denial + 0.13 × D_longevity + 0.15 × HRV_sup + 0.10 × S_fatigue + 0.12 × S_sleep_def + 0.24 × M_variance',
    formulaVariables: [
      { name: 'W_overtime', source: 'Battalion Guard Rosters', weight: '14%', description: 'Night guard and tactical watch hours exceeding standard 8-hour operational baseline.' },
      { name: 'L_denial', source: 'Armed Forces Leave ERP', weight: '12%', description: 'Ratio of accumulated casual/annual leave requests deferred or cancelled due to operational constraints.' },
      { name: 'D_longevity', source: 'Unit Deployment Logs', weight: '13%', description: 'Continuous days deployed in forward posts (LOC / LAC / High-Altitude Sectors) without rotational relief.' },
      { name: 'HRV_sup', source: 'Wearable Biosensors', weight: '15%', description: 'Autonomic nervous system suppression index measured via nocturnal Heart Rate Variability (RMSSD).' },
      { name: 'S_sleep_def', source: 'Smart Band Telemetry', weight: '12%', description: 'Rolling 14-day cumulative sleep deficit relative to the 7-hour physiological restoration threshold.' },
      { name: 'M_variance', source: 'Daily Digital Check-ins', weight: '24%', description: 'Negative trajectory variance across 5-point validated psychometric mood and energy check-ins.' },
    ],
    militaryImpact: [
      'Degradation of situational awareness during perimeter defense and night patrols (measured 32% slower target identification latency).',
      'Increased cognitive tunneling under rapid tactical decision-making scenarios.',
      'Higher susceptibility to secondary psychosomatic disorders and acute field anxiety.',
      'Elevated attrition risk and interpersonal friction within small tactical sections (buddies / squads).',
    ],
    clinicalSymptoms: [
      'Persistent morning exhaustion and non-restorative sleep patterns.',
      'Apathy, cynicism, and emotional detachment from fellow platoon members.',
      'Spike in unprompted somatic complaints (tension headaches, gastrointestinal distress).',
      'Sudden performance decline in routine weapon handling, physical drills, or reporting.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Immediate Triage (0-24 hrs)', title: 'Mandatory 48-Hour Tactical Stand-Down', action: 'Relieve soldier from perimeter guard duties, night sentry, and hazardous patrols. Assign low-cognitive-load depot maintenance tasks.' },
      { step: 'Phase 2: Clinical Assessment (24-48 hrs)', title: 'Confidential 1-on-1 Consultation', action: 'Schedule interview with Unit Medical Officer (UMO) or visiting Military Clinical Psychologist. Screen with Kessler-10 and PCL-5 protocols.' },
      { step: 'Phase 3: Rest & Recuperation (Day 3-14)', title: 'Expedited Leave & Recovery Protocol', action: 'Process priority 10-day casual leave grant with family welfare liaison. Re-assess biometric recovery scores upon return to unit.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 14 },
      { month: 'Feb', value: 16 },
      { month: 'Mar', value: 19 },
      { month: 'Apr', value: 27 },
      { month: 'May', value: 25 },
      { month: 'Jun', value: 24 },
    ],
    flaggedPersonnelIds: ['JC-2748', 'JC-3910', 'CRPF-2016-8012'],
  },

  psychological_distress: {
    id: 'psychological_distress',
    title: 'Psychological Distress & Affective State Index',
    shortName: 'Psychological Distress',
    category: 'Mental Health Diagnostic Model',
    weight: '14% Composite Weight',
    forceCohortCount: 94,
    forceCohortPct: 18.1,
    criticalCount: 18,
    clinicalBaseline: 'Kessler Psychological Distress Scale (K10) + Defense Psychometric Standard',
    confidence: '95.8% Cross-Validated',
    shortDescription: 'Continuous surveillance model evaluating depressive affect, situational anxiety, and emotional vulnerability across defense cohorts.',
    fullDescription: 'Psychological distress in active-duty defense personnel manifests through sub-clinical anxiety, depressed mood, and hyper-vigilance. Left unaddressed, elevated distress can impair combat reflexes, deteriorate unit cohesion, and escalate into clinical major depressive episodes or acute stress reactions under operational fire.',
    mathematicalFormula: 'PD_score = 0.35 × K10_Standardized + 0.25 × Affect_Variance + 0.20 × Speech_Cadence + 0.20 × Isolation_Index',
    formulaVariables: [
      { name: 'K10_Standardized', source: 'Periodic Welfare Surveys', weight: '35%', description: 'Ten-item psychometric assessment measuring non-specific psychological distress over past 30 days.' },
      { name: 'Affect_Variance', source: 'Daily App Sentiment Analysis', weight: '25%', description: 'Linguistic sentiment polarity drop across daily free-text soldier reflections and voice notes.' },
      { name: 'Speech_Cadence', source: 'Voice Check-in Acoustic Engine', weight: '20%', description: 'Vocal pitch flattening, increased pause duration, and acoustic jitter indicative of emotional blunting.' },
      { name: 'Isolation_Index', source: 'Mess & Roll-Call Engagement', weight: '20%', description: 'Social withdrawal metrics based on community mess attendance, roll-call participation, and sports activity.' },
    ],
    militaryImpact: [
      'Impaired risk assessment and increased hesitancy in high-stakes operational contact.',
      'Heightened vulnerability to panic responses under unexpected tactical ambushes or indirect fire.',
      'Erosion of mutual trust in buddy pairs, compromising squad-level survivability.',
    ],
    clinicalSymptoms: [
      'Pervasive low mood, hopelessness, or irritability during debriefings.',
      'Loss of interest in off-duty battalion recreation, sports, or family video calling.',
      'Elevated heart rate variability variance during non-stressful base conditions.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Rapport Building', title: 'Buddy-Pair Welfare Check', action: 'Brief buddy partner and Section Commander to provide discreet peer-level support without stigmatization.' },
      { step: 'Phase 2: Counseling Protocol', title: 'Structured CBT / Psychoeducation', action: 'Initiate 4 structured sessions of Cognitive Behavioral Therapy (CBT) focusing on stress inoculation and cognitive reframing.' },
      { step: 'Phase 3: Family Support', title: 'Home Front Coordination', action: 'Welfare Cell liaisons with soldier’s family to resolve domestic or financial stressors if identified as primary anxiety drivers.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 12 },
      { month: 'Feb', value: 14 },
      { month: 'Mar', value: 17 },
      { month: 'Apr', value: 20 },
      { month: 'May', value: 19 },
      { month: 'Jun', value: 18 },
    ],
    flaggedPersonnelIds: ['JC-2748', 'JC-5621', 'ARMY-2018-8013'],
  },

  stress_indicators: {
    id: 'stress_indicators',
    title: 'Autonomic Stress Indicators & Physiological Telemetry',
    shortName: 'Stress Indicators',
    category: 'Physiological Biosensor Analytics',
    weight: '12% Composite Weight',
    forceCohortCount: 88,
    forceCohortPct: 16.9,
    criticalCount: 16,
    clinicalBaseline: 'Autonomic Nervous System Balancimetry (Sympathovagal Balance / LF-HF Ratio)',
    confidence: '97.1% Sensor Verified',
    shortDescription: 'Objective biometric markers detecting autonomic nervous system dysregulation, sympathetic overdrive, and elevated cortisol surges.',
    fullDescription: 'The autonomic stress module correlates continuous wearable biometric telemetry with operational stress triggers. When personnel enter acute fight-or-flight states, sympathetic nervous system dominance suppresses parasympathetic recovery, leading to elevated resting heart rate, suppressed HRV, and hyper-reactive blood pulse velocities.',
    mathematicalFormula: 'SI_index = 0.30 × (1 - Norm_RMSSD) + 0.25 × RestingHR_Elevation + 0.25 × Galvanic_Response + 0.20 × CoreTemp_Strain',
    formulaVariables: [
      { name: 'Norm_RMSSD', source: 'Wearable Photoplethysmography', weight: '30%', description: 'Root Mean Square of Successive Differences between normal heartbeats during deep sleep cycles.' },
      { name: 'RestingHR_Elevation', source: 'Bio-Telemetry Monitor', weight: '25%', description: 'Deviation of resting heart rate above baseline individual 90-day circadian average (bpm).' },
      { name: 'Galvanic_Response', source: 'Tactical Smart Grip / Band', weight: '25%', description: 'Electrodermal activity fluctuations reflecting acute sympathetic activation under operational tension.' },
      { name: 'CoreTemp_Strain', source: 'Thermal Sensor Collar', weight: '20%', description: 'Physiological Strain Index (PSI) calculated from core temperature rise and cardiovascular drift.' },
    ],
    militaryImpact: [
      'Loss of fine motor control during precision firing, explosive ordnance disposal, or technical equipment repair.',
      'Premature cardiovascular fatigue during long-range foot patrols with 25kg combat load.',
      'Elevated risk of heat stroke, cold injury, or acute cardiac events in extreme altitudes.',
    ],
    clinicalSymptoms: [
      'Restless tremors, hyperventilation during non-strenuous briefing sessions.',
      'Chronic muscular rigidity in neck and shoulders.',
      'Difficulty falling asleep despite extreme physical fatigue.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Immediate Relief', title: 'Physiological Respiration Protocol', action: 'Administer tactical box breathing (4-4-4-4) and mandatory 60-minute dark-room sensory relaxation.' },
      { step: 'Phase 2: Hydration & Electrolytes', title: 'Metabolic Stabilization', action: 'Administer electrolyte rehydration and monitor orthostatic blood pressure readings twice daily.' },
      { step: 'Phase 3: Workload Calibration', title: 'Duty Cycle Rotation', action: 'Cap continuous exposure to physical exertion at 4 hours maximum until autonomic baseline normalizes.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 10 },
      { month: 'Feb', value: 12 },
      { month: 'Mar', value: 15 },
      { month: 'Apr', value: 19 },
      { month: 'May', value: 17 },
      { month: 'Jun', value: 17 },
    ],
    flaggedPersonnelIds: ['JC-3910', 'CRPF-2016-8012'],
  },

  overall_stress: {
    id: 'overall_stress',
    title: 'Multi-Source Aggregated Stress Index',
    shortName: 'Overall Stress',
    category: 'Holistic Force Health Analytics',
    weight: '10% Composite Weight',
    forceCohortCount: 110,
    forceCohortPct: 21.1,
    criticalCount: 20,
    clinicalBaseline: 'Defense Psychological Health Advisory Matrix (v2.4)',
    confidence: '95.2% System Reliability',
    shortDescription: 'Composite meta-index integrating psychometric assessments, biometric telemetry, administrative duty loads, and unit commander peer notes.',
    fullDescription: 'The Overall Stress metric provides command leadership with a unified, cross-validated stress quotient. By harmonizing disparate data silos—from HRMS leave records to wearable sleep telemetry and subjective wellness check-ins—it eliminates single-point measurement bias and produces a robust, tamper-resistant health index.',
    mathematicalFormula: 'OSI = 0.28 × Psychometric_Vector + 0.26 × Biometric_Vector + 0.24 × Operational_Duty_Vector + 0.22 × Environmental_Hazard_Factor',
    formulaVariables: [
      { name: 'Psychometric_Vector', source: 'App Check-ins & Surveys', weight: '28%', description: 'Aggregated psychological distress, mood ratings, and cognitive clarity scores.' },
      { name: 'Biometric_Vector', source: 'Wearable Biosensors', weight: '26%', description: 'Nocturnal HRV, resting HR, sleep architecture, and movement velocity metrics.' },
      { name: 'Operational_Duty_Vector', source: 'Unit Tasking Sheets', weight: '24%', description: 'Deployment terrain difficulty, watch rotations, and combat exposure intensity.' },
      { name: 'Environmental_Hazard_Factor', source: 'Geographic GIS Station', weight: '22%', description: 'Altitude (>12,000 ft), sub-zero temperatures, and isolation severity factor.' },
    ],
    militaryImpact: [
      'Comprehensive proxy for overall unit combat readiness and tactical resilience.',
      'Early indicator for collective unit morale dips and post-mission decompensation.',
    ],
    clinicalSymptoms: [
      'Compound exhaustion, reduced alertness during weapon inspections, general malaise.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Triangulation', title: 'Multi-Disciplinary Review', action: 'Convene weekly Unit Welfare Board comprising UMO, Subedar Major, and Welfare Officer to review composite scores.' },
      { step: 'Phase 2: Tailored Action', title: 'Customized Welfare Intervention Plan', action: 'Issue tailored welfare prescriptions combining duty adjustment, peer mentoring, and leave authorization.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 15 },
      { month: 'Feb', value: 17 },
      { month: 'Mar', value: 20 },
      { month: 'Apr', value: 24 },
      { month: 'May', value: 22 },
      { month: 'Jun', value: 21 },
    ],
    flaggedPersonnelIds: ['JC-2748', 'JC-3910', 'CRPF-2016-8012', 'JC-5621'],
  },

  emotional_fatigue: {
    id: 'emotional_fatigue',
    title: 'Emotional Fatigue & Depersonalization Metric',
    shortName: 'Emotional Fatigue',
    category: 'Affective Psychometrics',
    weight: '8% Composite Weight',
    forceCohortCount: 65,
    forceCohortPct: 12.5,
    criticalCount: 11,
    clinicalBaseline: 'Oldenburg Burnout Inventory (OLBI) Exhaustion Subscale',
    confidence: '94.6% Validated',
    shortDescription: 'Measures psychological depletion, emotional numbing, and loss of empathy essential for interpersonal discipline and peer support.',
    fullDescription: 'Prolonged exposure to life-threatening conditions or unrelenting discipline without emotional outlet causes soldiers to shut down emotionally. This depersonalization acts as a defensive psychological shield in the short term, but leads to detachment, blunted affect, and vulnerability to PTSD in the medium-to-long term.',
    mathematicalFormula: 'EF_score = 0.40 × Exhaustion_Scale + 0.30 × Affective_Flatness + 0.30 × Peer_Interaction_Decay',
    formulaVariables: [
      { name: 'Exhaustion_Scale', source: 'Self-Report Micro-Checkin', weight: '40%', description: 'Frequency of feeling completely drained before starting the daily operational shift.' },
      { name: 'Affective_Flatness', source: 'Acoustic / Facial Analysis', weight: '30%', description: 'Reduction in vocal modulation and facial expressive range during welfare video check-ins.' },
      { name: 'Peer_Interaction_Decay', source: 'Recreation Facility Telemetry', weight: '30%', description: 'Decline in voluntary social interactions in company recreation and dining halls.' },
    ],
    militaryImpact: [
      'Diminished compassion and communication breakdown within fireteams.',
      'Resistance to operational feedback from junior non-commissioned officers.',
    ],
    clinicalSymptoms: [
      'Numbness, cynical remarks regarding unit mission purpose, indifference to personal safety.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Peer Re-engagement', title: 'Buddy-Pair Reassignment', action: 'Pair with high-resilience peer buddy for shared non-tactical recreational assignments.' },
      { step: 'Phase 2: Counseling', title: 'Expressive Psychological Processing', action: 'Confidential counseling focusing on emotional release and stress decompression.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 8 },
      { month: 'Feb', value: 9 },
      { month: 'Mar', value: 11 },
      { month: 'Apr', value: 14 },
      { month: 'May', value: 13 },
      { month: 'Jun', value: 12 },
    ],
    flaggedPersonnelIds: ['JC-2748', 'ARMY-2018-8013'],
  },

  welfare_concern: {
    id: 'welfare_concern',
    title: 'Welfare Concern Index & Domestic Stress Engine',
    shortName: 'Welfare Concern',
    category: 'Administrative & Family Welfare Analytics',
    weight: '8% Composite Weight',
    forceCohortCount: 58,
    forceCohortPct: 11.1,
    criticalCount: 9,
    clinicalBaseline: 'Armed Forces Family & Veteran Affairs Doctrine',
    confidence: '95.0% Administrative Match',
    shortDescription: 'Tracks personal, domestic, and legal anxieties originating from the home front that distract personnel during active combat service.',
    fullDescription: 'Soldiers deployed thousands of kilometers from home in isolated posts experience acute psychological strain when domestic disputes (land boundary cases, financial distress, marital conflicts, or serious illness of dependents) arise. Unresolved domestic stress is among the top documented root causes of psychological decompensation in the armed forces.',
    mathematicalFormula: 'WCI = 0.35 × Domestic_Distress_Reports + 0.30 × Emergency_Call_Frequency + 0.20 × Financial_Advance_Requests + 0.15 × Unresolved_Grievances',
    formulaVariables: [
      { name: 'Domestic_Distress_Reports', source: 'Unit Welfare Officer Records', weight: '35%', description: 'Documented family distress calls, local civil administration requests, or land dispute petitions.' },
      { name: 'Emergency_Call_Frequency', source: 'PCO / Satellite Call Logs', weight: '30%', description: 'Unusual spikes in emergency personal phone calls home during odd hours.' },
      { name: 'Financial_Advance_Requests', source: 'Battalion Pay & Accounts Office', weight: '20%', description: 'Sudden requests for DSOP advance, emergency family remittances, or loan guarantees.' },
      { name: 'Unresolved_Grievances', source: 'Central Welfare Cell Portal', weight: '15%', description: 'Pending grievance tickets related to child education, family medical care, or pension claims.' },
    ],
    militaryImpact: [
      'Severe cognitive distraction during sensitive security operations and guard duties.',
      'Sudden requests for overstay of leave or unauthorized absence (AWOL).',
    ],
    clinicalSymptoms: [
      'Anxious preoccupation, frequent checking of mobile phones, irritability during debriefings.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Welfare Liaison', title: 'Civil-Military Administration Outreach', action: 'District Soldier Board (Zila Sainik Board) immediately contacted to assist soldier’s family on the ground.' },
      { step: 'Phase 2: Financial Relief', title: 'Army Welfare Fund Grant', action: 'Expedite non-refundable emergency welfare grant from Regimental Welfare Corpus within 48 hours.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 9 },
      { month: 'Feb', value: 10 },
      { month: 'Mar', value: 12 },
      { month: 'Apr', value: 15 },
      { month: 'May', value: 12 },
      { month: 'Jun', value: 11 },
    ],
    flaggedPersonnelIds: ['ARMY-2018-8013', 'JC-5621'],
  },

  predictive_behavior: {
    id: 'predictive_behavior',
    title: 'Longitudinal Predictive Behavioral Anomaly Engine',
    shortName: 'Predictive Behavior',
    category: 'Machine Learning Anomaly Detection',
    weight: '7% Composite Weight',
    forceCohortCount: 45,
    forceCohortPct: 8.6,
    criticalCount: 7,
    clinicalBaseline: 'Longitudinal Behavioral Deviance Detection (LSTM + Isolation Forest)',
    confidence: '96.8% Model Precision',
    shortDescription: 'AI temporal anomaly detector flagging subtle shifts in individual routine, interaction latency, and habitual patterns before clinical symptoms appear.',
    fullDescription: 'Using recurrent neural networks (LSTM) trained on longitudinal behavioral baselines, this module identifies micro-deviations from an individual soldier’s established patterns. When sleep timing shifts, appetite drops, or check-in response cadences alter, the model flags early warnings days ahead of acute behavioral crises.',
    mathematicalFormula: 'BAE = 1 - Softmax(Cosine_Sim(V_current_7d, V_baseline_90d))',
    formulaVariables: [
      { name: 'V_current_7d', source: 'Active Telemetry Vector', weight: '50%', description: '7-day rolling multi-dimensional behavior vector across check-ins, sleep, and physical activity.' },
      { name: 'V_baseline_90d', source: 'Historical Profile Norm', weight: '50%', description: '90-day normalized individual behavioral profile representing healthy baseline state.' },
    ],
    militaryImpact: [
      'Prevents sudden impulsive behavioral infractions or self-harm events by providing early predictive lead time.',
    ],
    clinicalSymptoms: [
      'Micro-changes in daily routine, atypical withdrawal, sudden changes in grooming or kit maintenance.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Silent Observation', title: 'Subedar Major Discreet Check', action: 'Senior NCO verifies soldier well-being through informal, non-confrontational daily interactions.' },
      { step: 'Phase 2: Early De-escalation', title: 'Preventive Counseling', action: 'Low-friction counseling session scheduled as a routine check-in without alarming the personnel.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 6 },
      { month: 'Feb', value: 7 },
      { month: 'Mar', value: 9 },
      { month: 'Apr', value: 12 },
      { month: 'May', value: 9 },
      { month: 'Jun', value: 8 },
    ],
    flaggedPersonnelIds: ['CRPF-2016-8012'],
  },

  stress_and_burnout_models: {
    id: 'stress_and_burnout_models',
    title: 'Integrated Stress & Burnout Ensemble Model',
    shortName: 'Stress & Burnout Models',
    category: 'Ensemble Machine Learning Architecture',
    weight: '7% Composite Weight',
    forceCohortCount: 72,
    forceCohortPct: 13.8,
    criticalCount: 12,
    clinicalBaseline: 'Multi-Modal Ensemble (XGBoost + Random Forest + TabNet)',
    confidence: '96.2% F1-Score',
    shortDescription: 'Ensemble voting system synthesizing psychometric self-reports, duty rosters, and biometric feeds into unified risk classifications.',
    fullDescription: 'Combines gradient boosted decision trees and deep tabular neural networks to prevent single-source bias. The model utilizes SHAP (Shapley Additive exPlanations) to guarantee full explainability for commanding officers and medical personnel, ensuring every prediction is substantiated with causal factors.',
    mathematicalFormula: 'Risk_Ensemble = 0.40 × XGBoost_Prob + 0.35 × RF_Prob + 0.25 × TabNet_Prob',
    formulaVariables: [
      { name: 'XGBoost_Prob', source: 'Non-linear Feature Splitter', weight: '40%', description: 'Evaluates interaction terms between continuous deployment days and HRV reduction.' },
      { name: 'RF_Prob', source: 'Bagged Decision Trees', weight: '35%', description: 'Robust against noise and outliers in missing wearable telemetry feeds.' },
      { name: 'TabNet_Prob', source: 'Attention-based Deep Learning', weight: '25%', description: 'Dynamic feature selection focusing on primary salient psychometric indicators.' },
    ],
    militaryImpact: [
      'Eliminates false alarms and diagnostic blind spots across combat formations.',
      'Provides auditable, defense-grade justification for temporary operational relief.',
    ],
    clinicalSymptoms: [
      'Comprehensive multi-system fatigue and stress strain markers across physiological and psychological domains.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Model Verification', title: 'Feature Attribution Check', action: 'Welfare Officer inspects SHAP bar chart to identify top 3 drivers before ordering interventions.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 10 },
      { month: 'Feb', value: 11 },
      { month: 'Mar', value: 14 },
      { month: 'Apr', value: 18 },
      { month: 'May', value: 15 },
      { month: 'Jun', value: 14 },
    ],
    flaggedPersonnelIds: ['JC-2748', 'JC-3910'],
  },

  intervention_recommendations: {
    id: 'intervention_recommendations',
    title: 'Automated Clinical & Operational Triage Recommender',
    shortName: 'Intervention Recommendations',
    category: 'Clinical Decision Support System (CDSS)',
    weight: '5% Composite Weight',
    forceCohortCount: 42,
    forceCohortPct: 8.0,
    criticalCount: 8,
    clinicalBaseline: 'Armed Forces Medical Services (DG AFMS) Treatment Guidelines',
    confidence: '98.0% Clinical Alignment',
    shortDescription: 'Rule-based and AI-guided recommendation engine generating tailored welfare, clinical, and administrative action plans for flagged soldiers.',
    fullDescription: 'Transforms raw risk scores into actionable military protocols. Recommendations range from non-stigmatizing operational stand-downs to psychological consultations, peer support pairing, physiological hydration/sleep regimens, and emergency leave sanctioning.',
    mathematicalFormula: 'Triage_Priority = ArgMax_{Protocol}(Benefit_Matrix × Risk_Vector - Operational_Disruption_Cost)',
    formulaVariables: [
      { name: 'Benefit_Matrix', source: 'AFMS Clinical Research Data', weight: '50%', description: 'Quantified historical efficacy of specific interventions on military stress reduction.' },
      { name: 'Risk_Vector', source: 'Individual AI Dossier', weight: '50%', description: 'Multi-factor risk score across burnout, distress, and domestic concern.' },
    ],
    militaryImpact: [
      'Eliminates decision paralysis for junior officers handling personnel stress.',
      'Ensures standardization of welfare care across battalions from Kashmir to the Northeast.',
    ],
    clinicalSymptoms: [
      'Personnel requiring immediate, medium-term, or long-term clinical care pathways.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Action Selection', title: 'Select Recommended Triage Pathway', action: 'Welfare Officer clicks "Initiate Action" to automatically generate required military signal and medical requisition.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 5 },
      { month: 'Feb', value: 6 },
      { month: 'Mar', value: 8 },
      { month: 'Apr', value: 11 },
      { month: 'May', value: 9 },
      { month: 'Jun', value: 8 },
    ],
    flaggedPersonnelIds: ['JC-2748', 'JC-3910', 'CRPF-2016-8012', 'ARMY-2018-8013'],
  },

  automated_alerts: {
    id: 'automated_alerts',
    title: 'Automated Spike Detection & Early Warning Alerting',
    shortName: 'Automated Alerts',
    category: 'Real-Time Telemetry Event Engine',
    weight: '5% Composite Weight',
    forceCohortCount: 38,
    forceCohortPct: 7.3,
    criticalCount: 7,
    clinicalBaseline: 'Real-Time Statistical Process Control (EWMA + CUSUM)',
    confidence: '97.5% Incident Prevention',
    shortDescription: 'High-frequency telemetry monitor triggering instant flash notifications when acute risk spikes exceed safety operational envelopes.',
    fullDescription: 'Monitors real-time data streams for sudden inflection points. An acute spike in sleep deprivation combined with a cancelled leave request triggers an immediate Level-1 Flash Alert to the Welfare Officer before psychological fatigue can manifest into an operational accident.',
    mathematicalFormula: 'Alert_Flag = 1 \\text{ if } (Z_{EWMA}(t) > 3.0 \\lor \\Delta Risk_{24h} > 25\\%) \\text{ else } 0',
    formulaVariables: [
      { name: 'Z_{EWMA}', source: 'Streaming Telemetry Bus', weight: '60%', description: 'Exponentially Weighted Moving Average standardized Z-score for risk trajectory.' },
      { name: 'Delta Risk_24h', source: 'Daily Delta Engine', weight: '40%', description: '24-hour rate of risk score acceleration.' },
    ],
    militaryImpact: [
      'Instantaneous alerting prevents delayed interventions that compromise troop safety.',
    ],
    clinicalSymptoms: [
      'Rapid onset acute stress reactions, severe insomnia episodes, sudden behavioral outbursts.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Flash Notification', title: 'Command Center Alert Dispatch', action: 'Send encrypted red-tag SMS/radio alert to duty officer for physical verification within 2 hours.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 4 },
      { month: 'Feb', value: 5 },
      { month: 'Mar', value: 7 },
      { month: 'Apr', value: 10 },
      { month: 'May', value: 8 },
      { month: 'Jun', value: 7 },
    ],
    flaggedPersonnelIds: ['JC-2748', 'JC-3910'],
  },

  mental_wellbeing: {
    id: 'mental_wellbeing',
    title: 'Mental Well-being & Psychological Resilience Scale',
    shortName: 'Mental Well-being',
    category: 'Positive Psychology & Coping Index',
    weight: '5% Composite Weight',
    forceCohortCount: 168,
    forceCohortPct: 32.3,
    criticalCount: 14,
    clinicalBaseline: 'Connor-Davidson Resilience Scale (CD-RISC-10) Adapted for Defense',
    confidence: '95.5% Construct Validity',
    shortDescription: 'Measures positive psychological capital, adaptive coping mechanisms, and mental endurance under hostile conditions.',
    fullDescription: 'Resilience is not merely the absence of stress, but the active capacity to adapt, recover, and grow through adverse operational encounters. This scale assesses mental grit, optimism, spiritual groundedness, and peer camaraderie that buffer soldiers against post-traumatic stress.',
    mathematicalFormula: 'MWB_index = 0.35 × CD_RISC + 0.30 × Peer_Camaraderie + 0.20 × Meaning_Purpose + 0.15 × Physical_Vigor',
    formulaVariables: [
      { name: 'CD_RISC', source: 'Quarterly Resilience Audit', weight: '35%', description: '10-item psychometric measure of psychological adaptability and tenacity.' },
      { name: 'Peer_Camaraderie', source: 'Sociometric Platoon Survey', weight: '30%', description: 'Strength of perceived mutual trust and safety inside the operational squad.' },
      { name: 'Meaning_Purpose', source: 'Mission Morale Check-in', weight: '20%', description: 'Alignment with national mission values and unit heritage pride.' },
      { name: 'Physical_Vigor', source: 'Battle Physical Efficiency Test (BPET)', weight: '15%', description: 'Cardiovascular endurance and functional combat physical capacity.' },
    ],
    militaryImpact: [
      'High scores directly correlate with rapid recovery after grueling counter-terror or forward patrol missions.',
    ],
    clinicalSymptoms: [
      'Resilient personnel show swift bounce-back from minor fatigue; low resilience personnel struggle to recover without external help.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Resilience Reinforcement', title: 'Mental Toughness Training', action: 'Enroll in battalion-level mindfulness, mental rehearsal, and breathing techniques.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 78 },
      { month: 'Feb', value: 77 },
      { month: 'Mar', value: 75 },
      { month: 'Apr', value: 71 },
      { month: 'May', value: 76 },
      { month: 'Jun', value: 79 },
    ],
    flaggedPersonnelIds: ['JC-2748', 'JC-5621'],
  },

  readiness_score: {
    id: 'readiness_score',
    title: 'Combat Operational Readiness & Survivability Score',
    shortName: 'Readiness Score',
    category: 'Tactical Deployment Assessment',
    weight: '5% Composite Weight',
    forceCohortCount: 426,
    forceCohortPct: 81.9,
    criticalCount: 18,
    clinicalBaseline: 'Directorate General of Military Operations (DGMO) Readiness Doctrine',
    confidence: '97.8% Combat Validated',
    shortDescription: 'Integrated capability index certifying whether a soldier or platoon is fully battle-fit physically, cognitively, and emotionally.',
    fullDescription: 'The pinnacle operational metric used by Unit Commanders and Welfare Officers to authorize personnel for active field missions. It weights physical endurance, psychometric stability, recent sleep recovery, and marksmanship alertness into a binary or graded combat deployment clearance rating.',
    mathematicalFormula: 'Readiness = 0.40 × Physical_Fitness + 0.35 × Cognitive_Alertness + 0.25 × Emotional_Resilience',
    formulaVariables: [
      { name: 'Physical_Fitness', source: 'BPET & Medical Category (SHAPE-1)', weight: '40%', description: 'Standard Armed Forces medical classification ensuring physical combat capability.' },
      { name: 'Cognitive_Alertness', source: 'Psychomotor Reaction Telemetry', weight: '35%', description: 'Vigilance latency, target acquisition response, and tactical decision speed.' },
      { name: 'Emotional_Resilience', source: 'Composite Psychometric Health', weight: '25%', description: 'Absence of critical acute burnout or severe psychological distress.' },
    ],
    militaryImpact: [
      'Determines patrol composition and frontline tactical team deployment safety.',
      'Prevents tactical mission failures caused by fatigued or incapacitated personnel.',
    ],
    clinicalSymptoms: [
      'Sub-optimal readiness manifests as slower response times to commands and sluggish weapons handling.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Deployment Screening', title: 'Pre-Patrol Readiness Check', action: 'Section commanders conduct 2-minute digital check-in to certify SHAPE-1 readiness before crossing perimeter wire.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 85 },
      { month: 'Feb', value: 84 },
      { month: 'Mar', value: 83 },
      { month: 'Apr', value: 78 },
      { month: 'May', value: 80 },
      { month: 'Jun', value: 82 },
    ],
    flaggedPersonnelIds: ['JC-2748', 'JC-3910'],
  },

  occupational_incident_risk: {
    id: 'occupational_incident_risk',
    title: 'Occupational Incident & Accidental Discharge Risk Index',
    shortName: 'Occupational Incident Risk',
    category: 'Safety & Mishap Prevention Analytics',
    weight: '5% Composite Weight',
    forceCohortCount: 31,
    forceCohortPct: 6.0,
    criticalCount: 5,
    clinicalBaseline: 'Defense Aviation & Tactical Safety Mishap Prevention Standard',
    confidence: '97.2% Safety Assurance',
    shortDescription: 'Predicts probability of equipment handling errors, vehicle mishaps, or accidental firearm discharges caused by micro-sleeps and severe fatigue.',
    fullDescription: 'In defense environments involving live ordnance, specialized tactical vehicles, and heavy weapons, fatigue-induced lapses of attention can be fatal. This model correlates acute sleep debt, continuous duty hours, and autonomic stress to predict high-risk safety hazard windows.',
    mathematicalFormula: 'OIR = 0.40 × MicroSleep_Probability + 0.30 × Sustained_Attention_Decline + 0.30 × Consecutive_Duty_Hours',
    formulaVariables: [
      { name: 'MicroSleep_Probability', source: 'Ocular Blink Rate Sensor', weight: '40%', description: 'PERCLOS (Percentage of Eye Closure) measurements detecting involuntary micro-sleep episodes.' },
      { name: 'Sustained_Attention_Decline', source: 'Psychomotor Vigilance Task (PVT)', weight: '30%', description: 'Lapses of attention >500ms during automated reaction-time touch screen check-ins.' },
      { name: 'Consecutive_Duty_Hours', source: 'Battalion Log Sheets', weight: '30%', description: 'Total continuous hours on active watch or tactical driving without uninterrupted 4-hour sleep.' },
    ],
    militaryImpact: [
      'Direct reduction in accidental weapon discharges (ADs) and military convoy traffic accidents.',
      'Protects multimillion-rupee defense equipment from fatigue-driven operator errors.',
    ],
    clinicalSymptoms: [
      'Heavy eyelids, head nodding, delayed braking reaction time, missing radio callsigns.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Immediate Relief', title: 'Weapon Stand-Down & Vehicle Lock', action: 'Immediate relief from sentry duty or driving; custody of weapon transferred to relief sentinel.' },
      { step: 'Phase 2: Sleep Recovery', title: 'Mandatory 6-Hour Sleep Window', action: 'Guaranteed uninterrupted sleep in noise-dampened quarters before reassignment.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 4 },
      { month: 'Feb', value: 4 },
      { month: 'Mar', value: 6 },
      { month: 'Apr', value: 9 },
      { month: 'May', value: 7 },
      { month: 'Jun', value: 6 },
    ],
    flaggedPersonnelIds: ['JC-3910'],
  },

  deployment_fatigue: {
    id: 'deployment_fatigue',
    title: 'Forward Deployment Fatigue & High-Altitude Acclimatization Strain',
    shortName: 'Deployment Fatigue',
    category: 'Environmental & Field Fatigue',
    weight: '15% Operational Factor',
    forceCohortCount: 78,
    forceCohortPct: 15.0,
    criticalCount: 15,
    clinicalBaseline: 'High Altitude Medical Research Directorate (HAMRD) Standard',
    confidence: '96.5% Field Validated',
    shortDescription: 'Tracks hypoxia, cold-weather stress, isolation, and physiological acclimatization strain in forward posts (Siachen, Ladakh, Tawang).',
    fullDescription: 'Soldiers deployed at altitudes above 11,000 feet endure severe environmental hypoxia, sub-zero temperatures, and extreme geographical isolation. Over months, this produces High-Altitude Deterioration (HAD), marked by weight loss, sleep apnea, pulmonary vascular strain, and cognitive fatigue.',
    mathematicalFormula: 'DF = 0.35 × Altitude_Hypoxia_Index + 0.30 × Continuous_Days_Forward + 0.20 × SpO2_Depression + 0.15 × Ambient_Cold_Exposure',
    formulaVariables: [
      { name: 'Altitude_Hypoxia_Index', source: 'GPS & Barometric Elevation', weight: '35%', description: 'Operating altitude scaled relative to sea level baseline (8,000ft to 18,500ft).' },
      { name: 'Continuous_Days_Forward', source: 'Post Log Registers', weight: '30%', description: 'Number of consecutive days stationed at forward isolated post without rotation down to transit camp.' },
      { name: 'SpO2_Depression', source: 'Pulse Oximeter Telemetry', weight: '20%', description: 'Resting peripheral capillary oxygen saturation drops below 88% at altitude.' },
      { name: 'Ambient_Cold_Exposure', source: 'Meteorological Field Station', weight: '15%', description: 'Wind-chill temperature factor (-10°C to -45°C).' },
    ],
    militaryImpact: [
      'Severe cognitive fog during artillery coordinate calculations and tactical radio transmissions.',
      'Elevated risk of High-Altitude Pulmonary/Cerebral Edema (HAPE / HACE) if ignored.',
    ],
    clinicalSymptoms: [
      'Persistent morning headaches, loss of appetite, breathlessness on minor exertion, peripheral numbness.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Oxygenation & Warmth', title: 'Medical Inspection at Forward Nursing Station', action: 'Administer supplemental oxygen therapy and check chest percussion for pulmonary rales.' },
      { step: 'Phase 2: Tactical De-induction', title: 'Downward Rotation to Base Camp', action: 'Rotate soldier down to lower altitude staging camp (<9,000 ft) for 14 days acclimatization recovery.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 11 },
      { month: 'Feb', value: 12 },
      { month: 'Mar', value: 14 },
      { month: 'Apr', value: 17 },
      { month: 'May', value: 16 },
      { month: 'Jun', value: 15 },
    ],
    flaggedPersonnelIds: ['CRPF-2016-8012', 'ARMY-2018-8013'],
  },

  workload_stress: {
    id: 'workload_stress',
    title: 'Tactical Workload & Duty Shift Stress Index',
    shortName: 'Workload Stress',
    category: 'Operational Duty Management',
    weight: '12% Operational Factor',
    forceCohortCount: 63,
    forceCohortPct: 12.1,
    criticalCount: 10,
    clinicalBaseline: 'Armed Forces Duty Hours & Fatigue Management Guideline',
    confidence: '95.9% Roster Verified',
    shortDescription: 'Monitors guard duty shifts, continuous patrol cycles, maintenance turnarounds, and lack of mandatory off-duty recovery hours.',
    fullDescription: 'Excessive task saturation results when troop shortages or heightened threat levels force personnel to work 14+ hour daily shifts across guard, combat patrols, logistics convoys, and equipment maintenance without protected rest periods.',
    mathematicalFormula: 'WS = 0.40 × Weekly_Duty_Hours_Over_Baseline + 0.30 × Night_Shift_Ratio + 0.30 × Rest_Period_Violations',
    formulaVariables: [
      { name: 'Weekly_Duty_Hours', source: 'Battalion Roster Database', weight: '40%', description: 'Total assigned tactical and administrative hours exceeding the 54-hour weekly baseline.' },
      { name: 'Night_Shift_Ratio', source: 'Guard Mount Logs', weight: '30%', description: 'Proportion of operational duties executed between 2200 hrs and 0600 hrs.' },
      { name: 'Rest_Period_Violations', source: 'Duty Schedule Validator', weight: '30%', description: 'Instances where consecutive rest between shifts was less than the required 8 hours.' },
    ],
    militaryImpact: [
      'Chronic sleep debt leading to lapses in vigilance during perimeter defense.',
      'Burnout acceleration and heightened irritability among section commanders.',
    ],
    clinicalSymptoms: [
      'Chronic yawning, sluggish reflexes, reduced situational awareness, back and joint strain.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Roster Re-balancing', title: 'Duty Rotation Equalization', action: 'Company 2IC reallocates guard duties from reserve platoons to cap individual weekly hours at 48.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 9 },
      { month: 'Feb', value: 10 },
      { month: 'Mar', value: 12 },
      { month: 'Apr', value: 15 },
      { month: 'May', value: 13 },
      { month: 'Jun', value: 12 },
    ],
    flaggedPersonnelIds: ['JC-2748', 'JC-3910'],
  },

  transfer_stress: {
    id: 'transfer_stress',
    title: 'Posting & Transfer Turbulence Assessment',
    shortName: 'Transfer Stress',
    category: 'Administrative & Career Mobility',
    weight: '8% Operational Factor',
    forceCohortCount: 42,
    forceCohortPct: 8.1,
    criticalCount: 6,
    clinicalBaseline: 'Military Personnel Transfer & Family Stability Matrix',
    confidence: '94.8% Database Correlated',
    shortDescription: 'Evaluates disorientation and anxiety caused by rapid station transfers, school relocation for dependents, and climatic transitions.',
    fullDescription: 'Moving from peaceful cantonments to remote counter-insurgency sectors creates administrative and emotional friction. The stress of packing household goods, finding quarters, adjusting to harsh climates, and integrating into unfamiliar tactical units taxes personnel adaptability.',
    mathematicalFormula: 'TS = 0.40 × Terrain_Contrast_Differential + 0.35 × Family_Displacement_Index + 0.25 × Tenure_Instability',
    formulaVariables: [
      { name: 'Terrain_Contrast_Differential', source: 'Military Posting History', weight: '40%', description: 'Climatic and operational difficulty delta between previous posting and new station.' },
      { name: 'Family_Displacement_Index', source: 'Quartering & Family Allotment', weight: '35%', description: 'Separation from family or difficulty securing separated family quarters (SFQ).' },
      { name: 'Tenure_Instability', source: 'HRMS Career Records', weight: '25%', description: 'Experiencing 2 or more station postings within an 18-month window.' },
    ],
    militaryImpact: [
      'Initial 60-day vulnerability window where newly posted soldiers show higher accident rates.',
    ],
    clinicalSymptoms: [
      'Preoccupation with family logistics, difficulty sleeping in new barracks, social hesitation.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Unit Sponsor Pairing', title: 'Senior Buddy Orientation', action: 'Assign experienced unit soldier to mentor new entrant on terrain nuances, local culture, and unit traditions.' },
      { step: 'Phase 2: Quartering Expedited', title: 'Family Accommodation Liaison', action: 'Priority allotment of cantonment family quarters or child school admission support.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 7 },
      { month: 'Feb', value: 7 },
      { month: 'Mar', value: 8 },
      { month: 'Apr', value: 10 },
      { month: 'May', value: 8 },
      { month: 'Jun', value: 8 },
    ],
    flaggedPersonnelIds: ['JC-2748'],
  },

  leave_pattern_anomaly: {
    id: 'leave_pattern_anomaly',
    title: 'Leave Accumulation & Pattern Anomaly Detection',
    shortName: 'Leave Pattern Anomaly',
    category: 'Administrative Behavioral Telemetry',
    weight: '7% Operational Factor',
    forceCohortCount: 36,
    forceCohortPct: 6.9,
    criticalCount: 5,
    clinicalBaseline: 'Defense Personnel Leave Utilization Standards',
    confidence: '97.4% Leave Record Correlated',
    shortDescription: 'Flags dangerous leave deprivation (>180 days without annual leave) or sudden emergency leave patterns signaling domestic crises.',
    fullDescription: 'Leave serves as an irreplaceable psychological decompression valve for defense personnel. When personnel go over 6 months without taking mandatory leave—either due to operational blockages or self-denial—their risk of acute psychological fatigue climbs exponentially.',
    mathematicalFormula: 'LPA = 0.45 × Days_Since_Last_Leave + 0.35 × Accumulated_Leave_Ratio + 0.20 × Emergency_Extension_Frequency',
    formulaVariables: [
      { name: 'Days_Since_Last_Leave', source: 'Battalion Leave Register', weight: '45%', description: 'Calendar days elapsed since completion of last annual or casual leave stint.' },
      { name: 'Accumulated_Leave_Ratio', source: 'Leave Account Ledger', weight: '35%', description: 'Ratio of unutilized leave days nearing statutory lapse or encashment ceiling.' },
      { name: 'Emergency_Extension_Frequency', source: 'Signal Records', weight: '20%', description: 'History of telegraphic emergency leave extensions requested from home.' },
    ],
    militaryImpact: [
      'Sharp decline in soldier morale; feelings of being trapped or neglected by administrative command.',
    ],
    clinicalSymptoms: [
      'Nostalgia, constant homesickness, apathy towards daily operational tasks.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Leave Audit', title: 'Priority Leave Granting', action: 'Adjutant / Company Commander immediately approves 15-day annual leave tranche with travel warrant.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 5 },
      { month: 'Feb', value: 6 },
      { month: 'Mar', value: 7 },
      { month: 'Apr', value: 9 },
      { month: 'May', value: 7 },
      { month: 'Jun', value: 7 },
    ],
    flaggedPersonnelIds: ['JC-2748', 'JC-3910'],
  },

  behavioral_changes: {
    id: 'behavioral_changes',
    title: 'Discipline & Behavioral Change Telemetry',
    shortName: 'Behavioral Changes',
    category: 'Sociometric & Discipline Analytics',
    weight: '6% Operational Factor',
    forceCohortCount: 31,
    forceCohortPct: 6.0,
    criticalCount: 4,
    clinicalBaseline: 'Military Discipline & Sociometric Cohesion Matrix',
    confidence: '96.0% Observation Correlated',
    shortDescription: 'Identifies sudden alterations in mess habits, personal hygiene, speech tone, or petty disciplinary friction before major infractions occur.',
    fullDescription: 'Before acute stress escalates to severe disciplinary infractions or clinical crises, soldiers exhibit behavioral micro-changes: skipping meals in the langar/mess, irritability with mess staff, skipping evening roll call games, or declining standard of turnout.',
    mathematicalFormula: 'BC = 0.35 × Mess_Attendance_Decay + 0.35 × Minor_Disciplinary_Notes + 0.30 × Turnout_Score_Drop',
    formulaVariables: [
      { name: 'Mess_Attendance_Decay', source: 'Digital Mess Roll Register', weight: '35%', description: 'Decline in regular meals taken with fellow soldiers in the company mess.' },
      { name: 'Minor_Disciplinary_Notes', source: 'Company Commander Daily Log', weight: '35%', description: 'Notes regarding verbal sharpness, minor late arrivals, or uncharacteristic sloppiness.' },
      { name: 'Turnout_Score_Drop', source: 'Quarter Guard Inspection Roster', weight: '30%', description: 'Drop in uniform turnout, shaving, and kit maintenance during daily parade inspections.' },
    ],
    militaryImpact: [
      'Prevents disciplinary breakdowns, insubordination, and inter-rank friction.',
    ],
    clinicalSymptoms: [
      'Untidy turnout, disheveled uniform, avoiding eye contact during inspections, solitary eating.',
    ],
    standardOperatingProcedure: [
      { step: 'Phase 1: Non-Punitive Chat', title: 'Informal Senior NCO Counseling', action: 'Subedar Major conducts informal discussion over tea to identify underlying emotional grievances.' },
    ],
    historicalTrend: [
      { month: 'Jan', value: 4 },
      { month: 'Feb', value: 5 },
      { month: 'Mar', value: 6 },
      { month: 'Apr', value: 8 },
      { month: 'May', value: 6 },
      { month: 'Jun', value: 6 },
    ],
    flaggedPersonnelIds: ['JC-2748', 'CRPF-2016-8012'],
  },
};

/**
 * Helper to look up a feature detail by string or query name
 */
export function getWelfareFeatureDetail(nameOrId: string): WelfareFeatureDetail {
  const normalized = nameOrId.toLowerCase().replace(/[^a-z0-9]/g, '_');

  if (WELFARE_FEATURE_DETAILS[normalized]) {
    return WELFARE_FEATURE_DETAILS[normalized];
  }

  // Fuzzy match
  for (const [key, detail] of Object.entries(WELFARE_FEATURE_DETAILS)) {
    if (
      normalized.includes(key) ||
      key.includes(normalized) ||
      detail.title.toLowerCase().includes(nameOrId.toLowerCase()) ||
      detail.shortName.toLowerCase().includes(nameOrId.toLowerCase())
    ) {
      return detail;
    }
  }

  // Default fallback to burnout if not found
  return WELFARE_FEATURE_DETAILS['burnout'];
}
