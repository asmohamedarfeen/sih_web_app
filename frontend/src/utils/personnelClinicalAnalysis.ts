import { PriorityPersonnel } from '../pages/dashboard/WelfareDashboard';

export interface TailoredAction {
  id: string;
  title: string;
  category: 'Leave & Furlough' | 'Roster & Duty' | 'Clinical & Medical' | 'Family & Financial' | 'Psychological Support' | 'Routine Welfare' | 'Command Governance';
  categoryBadge: string;
  priority: 'Critical Immediate' | 'High Priority' | 'Operational Action' | 'Routine Welfare';
  priorityBadgeClass: string;
  expectedBenefit: string;
  description: string;
  actionPayload: string;
}

export interface DisasterMilestone {
  day: number;
  label: string;
  status: string;
  riskScore: number;
  isDisasterThreshold?: boolean;
  impactDescription: string;
  severity: 'nominal' | 'warning' | 'danger' | 'critical';
}

export interface PredictiveDisasterHorizon {
  disasterType: string;
  projectedBreakdownDay: number;
  timeHorizonText: string;
  urgency: string;
  urgencyBadgeClass: string;
  presenteeismRiskPct: number;
  presenteeismSummary: string;
  burnoutProbabilityPct: number;
  disasterImpact: string;
  preventiveActionWindow: string;
  milestones: DisasterMilestone[];
}

export interface PersonnelClinicalAnalysis {
  rootCauseTitle: string;
  stressCategory: string;
  diagnosisDetails: string;
  contributingTriggers: string[];
  riskVelocity: string;
  disasterHorizon: PredictiveDisasterHorizon;
  recommendations: TailoredAction[];
}

const CURATED_ANALYSES: Record<string, PersonnelClinicalAnalysis> = {
  // 1. Naik Rohit Sharma (JC-2748)
  'JC-2748': {
    rootCauseTitle: 'Prolonged Sub-Zero Frontline Deployment & Accumulated Leave Deferral',
    stressCategory: 'Operational Burnout & Severe Circadian Sleep Latency',
    diagnosisDetails:
      'Continuous deployment in J&K high-altitude sub-zero terrain exceeds 14 months without decompression rotation. Three consecutive leaves were deferred for border alert contingencies, leaving 28 accumulated days pending. Nocturnal sentry duty surged 42%, yielding <4.5h restorative sleep per night.',
    contributingTriggers: [
      '14 Months Continuous Sub-Zero Post',
      '28 Days Accumulated Leave Backlog',
      '42% Surge in Nocturnal Vigils',
      '<4.5h Restorative Sleep / Night',
    ],
    riskVelocity: '+18% over 30 days (Acute Burnout Vector)',
    disasterHorizon: {
      disasterType: 'Acute Burnout Collapse & Sentry Presenteeism',
      projectedBreakdownDay: 12,
      timeHorizonText: 'Within 10 - 14 Days',
      urgency: 'Imminent Disaster (Day 12)',
      urgencyBadgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      presenteeismRiskPct: 74,
      presenteeismSummary:
        'High Presenteeism: Soldier remains physically on forward sub-zero sentry watch, but reaction latency is doubled (+2.4s) with high vulnerability to in-post microsleep episodes.',
      burnoutProbabilityPct: 94,
      disasterImpact:
        'Breaches irreversible neurological exhaustion threshold at Day 12. Threatens frontline perimeter surveillance breach and acute clinical hospitalization.',
      preventiveActionWindow: 'Golden Prevention Window: Next 48 - 72 Hours',
      milestones: [
        {
          day: 0,
          label: 'Today (Day 0)',
          status: 'Sleep Debt & Attentional Drift',
          riskScore: 86,
          impactDescription: 'Severe sleep debt (<4.5h) and emerging attentional drift during watch shifts',
          severity: 'warning',
        },
        {
          day: 6,
          label: 'Day 6',
          status: 'Cognitive Blunting & Microsleeps',
          riskScore: 89,
          impactDescription: 'Vocal flattening; reaction latency increases +2.1s; micro-sleeps logged',
          severity: 'danger',
        },
        {
          day: 12,
          label: 'Day 12 (Disaster Point)',
          status: 'Acute Burnout Collapse',
          riskScore: 94,
          isDisasterThreshold: true,
          impactDescription: 'Projected point of total clinical exhaustion and sentry vigilance failure',
          severity: 'critical',
        },
        {
          day: 30,
          label: 'Day 30',
          status: 'Neuro-Psychiatric Incapacitation',
          riskScore: 97,
          impactDescription: 'Complete autonomic breakdown requiring mandatory medical hospitalization',
          severity: 'critical',
        },
      ],
    },
    recommendations: [
      {
        id: 'rs-act-1',
        title: 'Sanction 28-Day Decompression Furlough',
        category: 'Leave & Furlough',
        categoryBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        priority: 'Critical Immediate',
        priorityBadgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        expectedBenefit: 'Reduces Burnout Index by -32% within 14 days',
        description: 'Immediately release soldier on accumulated annual leave to break the 14-month continuous frontline deployment cycle.',
        actionPayload: 'Approve 28-Day Priority Decompression Furlough',
      },
      {
        id: 'rs-act-2',
        title: 'Sector Rotation to Valley Garrison Depot',
        category: 'Roster & Duty',
        categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
        priority: 'High Priority',
        priorityBadgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        expectedBenefit: 'Relieves sub-zero hypoxia & environmental strain',
        description: 'Reassign from forward mountain observation outpost to rear battalion headquarters in Srinagar for physical acclimatization recovery.',
        actionPayload: 'Issue Rear Garrison Transfer Order',
      },
      {
        id: 'rs-act-3',
        title: '72-Hour Monitored Sleep Regeneration',
        category: 'Clinical & Medical',
        categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
        priority: 'High Priority',
        priorityBadgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        expectedBenefit: 'Restores REM sleep latency to nominal baseline',
        description: 'Exempt from nocturnal sentry shifts for 72 hours; enforce monitored sleep hygiene in heated barracks quarters.',
        actionPayload: 'Order 72-Hour Sleep Regeneration Protocol',
      },
      {
        id: 'rs-act-4',
        title: 'Northern Command 1-on-1 Psychological Debrief',
        category: 'Psychological Support',
        categoryBadge: 'bg-amber-50 text-amber-800 border-amber-200',
        priority: 'Operational Action',
        priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        expectedBenefit: 'Cognitive restabilization & emotional decompression',
        description: 'Confidential clinical tele-consultation with regimental psychologist to address cognitive exhaustion before leave departure.',
        actionPayload: 'Schedule Psychological Clinical Debrief',
      },
    ],
  },

  // 2. Hav. Amit Kumar (JC-3910)
  'JC-3910': {
    rootCauseTitle: 'Line of Control (LoC) Watch Fatigue & Musculoskeletal Overuse',
    stressCategory: 'Combat Vigil Strain & Autonomic Exhaustion',
    diagnosisDetails:
      '9 consecutive weeks maintaining high-alert combat vigilance on Kupwara LoC forward post. Elevated resting heart rate variability and chronic insomnia accompanied by acute lower-back and knee musculoskeletal fatigue from high-incline patrolling.',
    contributingTriggers: [
      '9 Weeks Continuous Kupwara LoC Post',
      'Elevated Heart Rate Spikes (HRV Volatility)',
      'Chronic Sentry Insomnia',
      'High-Incline Musculoskeletal Strain',
    ],
    riskVelocity: '+14% over 30 days (High Strain Vector)',
    disasterHorizon: {
      disasterType: 'Musculoskeletal Incapacitation & Sentry Exhaustion',
      projectedBreakdownDay: 15,
      timeHorizonText: 'Within 12 - 18 Days',
      urgency: 'Critical Escalation (Day 15)',
      urgencyBadgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      presenteeismRiskPct: 68,
      presenteeismSummary:
        'Severe Physical Presenteeism: Continuing steep LoC patrols with lumbar and knee muscular failure, reducing squad mobility and tactical defensive reflexes.',
      burnoutProbabilityPct: 91,
      disasterImpact:
        'Acute spinal collapse or tendon rupture on steep terrain; autonomic cardiac spike under combat patrols requiring stretcher evacuation.',
      preventiveActionWindow: 'Pull back to base camp within 4 days',
      milestones: [
        {
          day: 0,
          label: 'Today (Day 0)',
          status: 'Chronic Insomnia & Joint Strain',
          riskScore: 88,
          impactDescription: 'Resting heart rate volatility and musculoskeletal fatigue during incline patrols',
          severity: 'warning',
        },
        {
          day: 7,
          label: 'Day 7',
          status: 'Mobility Degradation & Pain Spike',
          riskScore: 91,
          impactDescription: 'Severe knee stiffness and delayed patrol sprint ability',
          severity: 'danger',
        },
        {
          day: 15,
          label: 'Day 15 (Disaster Point)',
          status: 'Musculoskeletal Breakdown',
          riskScore: 95,
          isDisasterThreshold: true,
          impactDescription: 'Projected physical incapacitation on high-incline terrain during live watch',
          severity: 'critical',
        },
        {
          day: 30,
          label: 'Day 30',
          status: 'Prolonged Medical Evacuation',
          riskScore: 98,
          impactDescription: 'Severe chronic disc herniation requiring surgical intervention',
          severity: 'critical',
        },
      ],
    },
    recommendations: [
      {
        id: 'ak-act-1',
        title: 'Rotate Platoon from Forward LoC to Base Camp',
        category: 'Roster & Duty',
        categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
        priority: 'Critical Immediate',
        priorityBadgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        expectedBenefit: 'Cuts physical exhaustion markers by -28%',
        description: 'Withdraw squad leader from active Line of Control sentry line to Kupwara Rear Garrison for 14-day rest rotation.',
        actionPayload: 'Execute LoC Squad Rotation to Base Camp',
      },
      {
        id: 'ak-act-2',
        title: 'Physiotherapy & Spine Rehabilitation Protocol',
        category: 'Clinical & Medical',
        categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
        priority: 'High Priority',
        priorityBadgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        expectedBenefit: 'Alleviates combat kit musculoskeletal strain',
        description: 'Mandatory consult at Kupwara Military Hospital physical therapy unit for lumbar strain and joint recovery.',
        actionPayload: 'Schedule Hospital Physiotherapy Session',
      },
      {
        id: 'ak-act-3',
        title: 'Halt Consecutive Nocturnal Patrol Shifts',
        category: 'Roster & Duty',
        categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
        priority: 'Operational Action',
        priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        expectedBenefit: 'Guarantees 8-hour uninterrupted sleep window',
        description: 'Swap night ambush patrols with relief platoon to eliminate chronic nocturnal sleep fragmentation.',
        actionPayload: 'Enforce Nocturnal Duty Cap',
      },
      {
        id: 'ak-act-4',
        title: 'Fast-Track 15-Day Casual Leave Grant',
        category: 'Leave & Furlough',
        categoryBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        priority: 'Operational Action',
        priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        expectedBenefit: 'Enables domestic recuperation with family',
        description: 'Approve pending 15-day casual leave grant for immediate travel to native station upon base camp arrival.',
        actionPayload: 'Sanction 15-Day Casual Leave Grant',
      },
    ],
  },

  // 3. Ct. Sandeep Yadav (JC-5621)
  'JC-5621': {
    rootCauseTitle: 'Domestic Family Medical Emergency & Deferred Compassionate Leave',
    stressCategory: 'Affective Psychosocial Distress & Caregiver Anxiety',
    diagnosisDetails:
      'Compassionate family leave was deferred during recent border alert. Telemetry and self-assessments flag moderate depressive affect, emotional withdrawal, and acute concern for an ailing parent without support at home station.',
    contributingTriggers: [
      'Deferred Compassionate Family Leave',
      'Ailing Parent at Home Station',
      'Affective Depressive Markers Flagged',
      'Isolated Border Sentinel Watch Isolation',
    ],
    riskVelocity: '+8% over 30 days (Elevated Affective Volatility)',
    disasterHorizon: {
      disasterType: 'Psychosocial Depressive Crisis & Sentry Dissociation',
      projectedBreakdownDay: 9,
      timeHorizonText: 'Within 7 - 10 Days',
      urgency: 'Imminent Crisis (Day 9)',
      urgencyBadgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      presenteeismRiskPct: 78,
      presenteeismSummary:
        'Emotional Presenteeism: Soldier remains on sentinel tower, but intense caregiver anxiety causes acute attentional detachment and delayed response to command radio calls.',
      burnoutProbabilityPct: 88,
      disasterImpact:
        'Severe depressive affective episode; complete loss of sentry situational awareness or impulsive duty abandonment.',
      preventiveActionWindow: 'Authorize Emergency Compassionate Leave within 48 Hours',
      milestones: [
        {
          day: 0,
          label: 'Today (Day 0)',
          status: 'Caregiver Anxiety & Insomnia',
          riskScore: 74,
          impactDescription: 'Severe domestic anxiety following deferred leave; emotional detachment noted',
          severity: 'warning',
        },
        {
          day: 4,
          label: 'Day 4',
          status: 'In-Post Attentional Dissociation',
          riskScore: 81,
          impactDescription: 'Delayed response to periodic radio sentinel checks; vocal tremor',
          severity: 'danger',
        },
        {
          day: 9,
          label: 'Day 9 (Disaster Point)',
          status: 'Acute Depressive Crisis',
          riskScore: 89,
          isDisasterThreshold: true,
          impactDescription: 'Predicted crisis threshold: total loss of coping capacity and duty failure',
          severity: 'critical',
        },
        {
          day: 30,
          label: 'Day 30',
          status: 'Severe Depressive Incapacitation',
          riskScore: 93,
          impactDescription: 'Chronic clinical psychiatric impairment requiring formal hospital admission',
          severity: 'critical',
        },
      ],
    },
    recommendations: [
      {
        id: 'sy-act-1',
        title: 'Authorize 14-Day Emergency Compassionate Leave',
        category: 'Leave & Furlough',
        categoryBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        priority: 'Critical Immediate',
        priorityBadgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        expectedBenefit: 'Resolves primary domestic stress driver by -40%',
        description: 'Issue immediate emergency transit warrant and 14 days compassionate leave to attend to parent medical care.',
        actionPayload: 'Authorize 14-Day Emergency Leave Warrant',
      },
      {
        id: 'sy-act-2',
        title: 'Immediate ₹25,000 Welfare Relief Grant',
        category: 'Family & Financial',
        categoryBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        priority: 'High Priority',
        priorityBadgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        expectedBenefit: 'Alleviates urgent family medical expense pressure',
        description: 'Disburse fast-track grant from Regimental Welfare Assistance Fund directly to soldier account.',
        actionPayload: 'Disburse ₹25,000 Welfare Relief Grant',
      },
      {
        id: 'sy-act-3',
        title: 'Tele-Welfare Clinical Psychological Session',
        category: 'Psychological Support',
        categoryBadge: 'bg-amber-50 text-amber-800 border-amber-200',
        priority: 'High Priority',
        priorityBadgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        expectedBenefit: 'Provides targeted affective coping mechanisms',
        description: 'Tele-consultation with Northern Command Family Welfare counselor scheduled for tomorrow 10:30 hrs.',
        actionPayload: 'Confirm Tele-Welfare Session',
      },
      {
        id: 'sy-act-4',
        title: 'Reassign from Isolated Sentry to Headquarters Duty',
        category: 'Roster & Duty',
        categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
        priority: 'Operational Action',
        priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        expectedBenefit: 'Prevents rumination & situational loneliness',
        description: 'Transition from isolated border outpost to battalion headquarters administrative detail pending travel.',
        actionPayload: 'Shift Outpost to Base HQ Desk',
      },
    ],
  },

  // 4. Havildar Ramesh Chand (CRPF-2016-8012)
  'CRPF-2016-8012': {
    rootCauseTitle: 'Siachen High-Altitude Hypoxia & Consecutive Sub-Zero Night Vigils',
    stressCategory: 'Severe Hypoxic Autonomic Strain & 48h Overtime Overload',
    diagnosisDetails:
      'Siachen Base Camp / Ladakh deployment with 8 consecutive sub-zero night vigils and 48 hours overtime in 5 days. Blood oxygen saturation dips to 84% accompanied by acute mental clouding, physical fatigue, and irregular pulse spikes.',
    contributingTriggers: [
      'Siachen Sub-Zero Exposure (-22°C)',
      '8 Consecutive Night Vigils',
      '48h Overtime in Past 5 Days',
      'SpO2 Oxygen Saturation Dip (84%)',
    ],
    riskVelocity: '+16% over 30 days (Critical Hypoxia Vector)',
    disasterHorizon: {
      disasterType: 'High-Altitude Hypoxia Shock & HAPE Emergency',
      projectedBreakdownDay: 4,
      timeHorizonText: 'Within 3 - 5 Days',
      urgency: 'Imminent Critical Emergency (Day 4)',
      urgencyBadgeClass: 'bg-rose-600 text-white border-rose-700',
      presenteeismRiskPct: 86,
      presenteeismSummary:
        'Dangerous Hypoxic Presenteeism: Soldier standing nocturnal mortar watch in -22°C while SpO2 is 84%; cerebral hypoxia masked by military endurance stoicism.',
      burnoutProbabilityPct: 98,
      disasterImpact:
        'High Altitude Pulmonary Edema (HAPE) or cerebral hypothermic shock resulting in acute in-post unconsciousness.',
      preventiveActionWindow: 'Emergency Oxygen Recompression within 12 Hours',
      milestones: [
        {
          day: 0,
          label: 'Today (Day 0)',
          status: 'Arterial SpO2 at 84%',
          riskScore: 86.3,
          impactDescription: 'Severe hypoxia with 48h continuous overtime watch shifts',
          severity: 'warning',
        },
        {
          day: 2,
          label: 'Day 2',
          status: 'Cerebral Disorientation',
          riskScore: 91,
          impactDescription: 'Mental confusion, motor ataxia, and shivering suppression',
          severity: 'danger',
        },
        {
          day: 4,
          label: 'Day 4 (Disaster Point)',
          status: 'Acute Hypoxic Collapse (HAPE)',
          riskScore: 96,
          isDisasterThreshold: true,
          impactDescription: 'Predicted collapse on forward sentry post due to acute pulmonary edema',
          severity: 'critical',
        },
        {
          day: 30,
          label: 'Day 30',
          status: 'Airlift MEDEVAC Emergency',
          riskScore: 99,
          impactDescription: 'Emergency heli-evacuation to Military Hospital Leh ICU',
          severity: 'critical',
        },
      ],
    },
    recommendations: [
      {
        id: 'rc-act-1',
        title: 'Emergency Oxygen Therapy & Medical Triage',
        category: 'Clinical & Medical',
        categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
        priority: 'Critical Immediate',
        priorityBadgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        expectedBenefit: 'Normalizes blood SpO2 saturation to >92%',
        description: 'Immediate hyperbaric oxygen session at Siachen Base Camp medical post to prevent acute mountain sickness.',
        actionPayload: 'Administer Oxygen Recompression Therapy',
      },
      {
        id: 'rc-act-2',
        title: 'Mandatory 48-Hour Full Duty Exemption',
        category: 'Roster & Duty',
        categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
        priority: 'Critical Immediate',
        priorityBadgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        expectedBenefit: 'Resets severe autonomic and physical fatigue',
        description: 'Complete stand-down from duty with monitored sleep regeneration in climate-controlled heated barracks.',
        actionPayload: 'Issue 48-Hour Duty Exemption Protocol',
      },
      {
        id: 'rc-act-3',
        title: 'Relieve Mortar Platoon Sentry Night Shift',
        category: 'Roster & Duty',
        categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
        priority: 'High Priority',
        priorityBadgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        expectedBenefit: 'Eliminates dangerous sub-zero exposure',
        description: 'Transfer nocturnal mortar watch responsibilities to Platoon B standby squad.',
        actionPayload: 'Rotate Mortar Platoon Night Shift',
      },
      {
        id: 'rc-act-4',
        title: 'Airlift Evacuation (MEDEVAC) Standby to Leh',
        category: 'Clinical & Medical',
        categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
        priority: 'Operational Action',
        priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        expectedBenefit: 'Rapid medical escalation if SpO2 fails to stabilize',
        description: 'Place casualty evacuation helicopter on standby for transfer to Military Hospital Leh if symptoms persist.',
        actionPayload: 'Place MEDEVAC Helicopter on Standby',
      },
    ],
  },

  // 5. Subedar Gurpreet Singh (ARMY-2018-8013)
  'ARMY-2018-8013': {
    rootCauseTitle: 'Family Medical Crisis in Punjab & Heavy Field Artillery Command Load',
    stressCategory: 'Dual-Role Operational Vigilance & Caregiver Strain',
    diagnosisDetails:
      'Maintaining continuous operational vigilance during field artillery high-angle calibration drills in Tawang while managing family medical emergency back home. Sleep fragmentation and cardiovascular tachycardia spikes observed during drills.',
    contributingTriggers: [
      'Family Medical Emergency in Punjab',
      'Artillery High-Angle Fire Calibration Drills',
      'Intermittent Tachycardia Spikes (>108 bpm)',
      'Broken Sleep Intervals & Caregiver Worry',
    ],
    riskVelocity: '+11% over 30 days (High Stress Velocity)',
    disasterHorizon: {
      disasterType: 'Cardiovascular Tachycardia Crisis & Command Burnout',
      projectedBreakdownDay: 14,
      timeHorizonText: 'Within 10 - 15 Days',
      urgency: 'Imminent Disaster (Day 14)',
      urgencyBadgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
      presenteeismRiskPct: 65,
      presenteeismSummary:
        'Command Presenteeism: Commanding artillery fire direction while heart rate surges past 108 bpm and mind is divided by family crisis, increasing error risk in ballistic calculations.',
      burnoutProbabilityPct: 89,
      disasterImpact:
        'Hypertensive crisis during live fire drills or critical command error in field artillery coordinates.',
      preventiveActionWindow: 'Delegate FDC Command & dispatch Punjab liaison within 48 Hours',
      milestones: [
        {
          day: 0,
          label: 'Today (Day 0)',
          status: 'Tachycardia & Broken Sleep',
          riskScore: 80.1,
          impactDescription: 'Pulse spikes >108 bpm during high-angle calibration drills',
          severity: 'warning',
        },
        {
          day: 7,
          label: 'Day 7',
          status: 'Chronic Cardiovascular Stress',
          riskScore: 85,
          impactDescription: 'Persistent resting hypertension and cognitive exhaustion',
          severity: 'danger',
        },
        {
          day: 14,
          label: 'Day 14 (Disaster Point)',
          status: 'Acute Hypertensive Episode',
          riskScore: 92,
          isDisasterThreshold: true,
          impactDescription: 'Cardiovascular crisis on artillery firing line',
          severity: 'critical',
        },
        {
          day: 30,
          label: 'Day 30',
          status: 'Permanent Command Disqualification',
          riskScore: 96,
          impactDescription: 'Cardiologist-mandated medical downgrade and leave',
          severity: 'critical',
        },
      ],
    },
    recommendations: [
      {
        id: 'gs-act-1',
        title: 'Mobilize Northern Command Family Welfare Liaison',
        category: 'Family & Financial',
        categoryBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        priority: 'Critical Immediate',
        priorityBadgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        expectedBenefit: 'Directly resolves family medical crisis support',
        description: 'Dispatch district military welfare liaison in Punjab to coordinate medical care and insurance for soldier family.',
        actionPayload: 'Dispatch Family Welfare Liaison in Punjab',
      },
      {
        id: 'gs-act-2',
        title: 'Temporary Handover of Artillery Fire Direction Center',
        category: 'Roster & Duty',
        categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
        priority: 'High Priority',
        priorityBadgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        expectedBenefit: 'Relieves tactical command pressure by -30%',
        description: 'Temporarily delegate calibration command to 2IC Naib Subedar to allow cognitive rest.',
        actionPayload: 'Delegate Artillery Command to 2IC',
      },
      {
        id: 'gs-act-3',
        title: 'Grant 10-Day Compassionate Home Transit Leave',
        category: 'Leave & Furlough',
        categoryBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        priority: 'High Priority',
        priorityBadgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        expectedBenefit: 'Directly reassures soldier and stabilizes morale',
        description: 'Authorize leave travel warrant to visit ailing family upon completion of artillery stand-down.',
        actionPayload: 'Grant 10-Day Compassionate Leave',
      },
      {
        id: 'gs-act-4',
        title: 'Cardiovascular Biofeedback Relaxation Protocol',
        category: 'Clinical & Medical',
        categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
        priority: 'Operational Action',
        priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        expectedBenefit: 'Normalizes pulse spikes & autonomic balance',
        description: 'Prescribe daily 20-minute guided HRV biofeedback exercises via mobile wellness portal.',
        actionPayload: 'Prescribe HRV Biofeedback Protocol',
      },
    ],
  },

  // 6. Naik Sandeep Patil (BSF-2019-8014)
  'BSF-2019-8014': {
    rootCauseTitle: 'Inverted Circadian Rhythm & Jaisalmer Thermal Desert Heat Strain',
    stressCategory: 'Circadian Disruption & Environmental Thermal Fatigue',
    diagnosisDetails:
      'Continuous nocturnal telemetry console watch under extreme desert thermal conditions in Jaisalmer. 5h 40m+ continuous nocturnal screen time combined with daytime ambient barracks heat causing severe sleep latency and dehydration.',
    contributingTriggers: [
      'Inverted Night Watch Schedule',
      '5h 40m+ Nocturnal Screen Time',
      'Ambient Desert Heat (>44°C)',
      'Daytime Barracks Insomnia',
    ],
    riskVelocity: '+9% over 30 days (Thermal Fatigue Vector)',
    disasterHorizon: {
      disasterType: 'Circadian Collapse & Radar Blip Blindness',
      projectedBreakdownDay: 18,
      timeHorizonText: 'Within 15 - 20 Days',
      urgency: 'Critical Escalation (Day 18)',
      urgencyBadgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
      presenteeismRiskPct: 74,
      presenteeismSummary:
        'Thermal Presenteeism: 5h 40m+ nocturnal console watch with zero restorative sleep during 44°C desert days; high risk of radar blip blindness.',
      burnoutProbabilityPct: 85,
      disasterImpact:
        'Heat exhaustion blackout on duty or failure to register critical border telemetry radar blips.',
      preventiveActionWindow: 'Rotate off nocturnal screen shifts within 3 days',
      milestones: [
        {
          day: 0,
          label: 'Today (Day 0)',
          status: 'Thermal & Console Strain',
          riskScore: 70.7,
          impactDescription: 'Daytime sleep latency impacted by ambient desert heat',
          severity: 'warning',
        },
        {
          day: 8,
          label: 'Day 8',
          status: 'Circadian Disorientation',
          riskScore: 76,
          impactDescription: 'Blurred screen vision and microsleeps during radar watch',
          severity: 'danger',
        },
        {
          day: 18,
          label: 'Day 18 (Disaster Point)',
          status: 'Radar Blindness & Thermal Collapse',
          riskScore: 86,
          isDisasterThreshold: true,
          impactDescription: 'Complete perceptual failure to detect border telemetry anomalies',
          severity: 'critical',
        },
        {
          day: 30,
          label: 'Day 30',
          status: 'Severe Heat Exhaustion Shock',
          riskScore: 91,
          impactDescription: 'Severe dehydration and metabolic heat illness hospital admission',
          severity: 'critical',
        },
      ],
    },
    recommendations: [
      {
        id: 'sp-act-1',
        title: 'Roster Shift Swap to Daylight Radio Maintenance',
        category: 'Roster & Duty',
        categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
        priority: 'Critical Immediate',
        priorityBadgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        expectedBenefit: 'Restores natural circadian melatonin rhythm',
        description: 'Rotate off nocturnal telemetry screen watch; assign to daylight communications workshop duty.',
        actionPayload: 'Rotate Shift to Daylight Workshop',
      },
      {
        id: 'sp-act-2',
        title: 'Relocate to Climate-Controlled Barracks Rest Facility',
        category: 'Clinical & Medical',
        categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
        priority: 'High Priority',
        priorityBadgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        expectedBenefit: 'Reduces daytime sleep latency by 65%',
        description: 'Provide accommodation in air-cooled rest quarters to enable restorative sleep during desert heat.',
        actionPayload: 'Assign Air-Cooled Quarters Accommodation',
      },
      {
        id: 'sp-act-3',
        title: 'Prescribe Oral Rehydration & Heat Strain Protocol',
        category: 'Clinical & Medical',
        categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
        priority: 'Operational Action',
        priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        expectedBenefit: 'Clears thermal fatigue and cognitive sluggishness',
        description: 'Regimental medical officer prescription of targeted electrolytes and monitored hydration recovery.',
        actionPayload: 'Order Hydration Therapy Regimen',
      },
      {
        id: 'sp-act-4',
        title: 'Sanction 12-Day Desert Mid-Term Furlough',
        category: 'Leave & Furlough',
        categoryBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        priority: 'Operational Action',
        priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        expectedBenefit: 'Facilitates complete thermal decompression',
        description: 'Clear pending leave balance for travel to soldier cooler home station.',
        actionPayload: 'Sanction 12-Day Mid-Term Furlough',
      },
    ],
  },

  // 7. Sepoy Amit Kumar (ARMY-2021-9988)
  'ARMY-2021-9988': {
    rootCauseTitle: 'Tactical Exertion from 40km Kit March (Normal SF Recovery)',
    stressCategory: 'Transient Musculoskeletal Fatigue',
    diagnosisDetails:
      'Completed rigorous 40km Special Forces tactical endurance march with 30kg field kit. Elite conditioning with rapid vital recovery, zero psychological markers, but requiring structured physical muscle replenishment.',
    contributingTriggers: [
      '40km Full Kit Tactical March',
      '30kg Tactical Kit Load',
      'Transient Muscular Soreness',
      'Elite Special Forces Conditioning',
    ],
    riskVelocity: '-3% over 30 days (Active Recovery Vector)',
    disasterHorizon: {
      disasterType: 'Transient Physical Exertion (Low Disaster Probability)',
      projectedBreakdownDay: 45,
      timeHorizonText: 'Beyond 30 Days (Stable Conditioning)',
      urgency: 'Low Risk / Stable',
      urgencyBadgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      presenteeismRiskPct: 12,
      presenteeismSummary: 'Nominal Presenteeism (<15%): Muscle soreness present but fully alert and combat ready.',
      burnoutProbabilityPct: 8,
      disasterImpact: 'Minimal risk under current active recovery protocol.',
      preventiveActionWindow: 'Continue 48-Hour Hydrotherapy & Muscle Recovery',
      milestones: [
        {
          day: 0,
          label: 'Today (Day 0)',
          status: 'Post-March Soreness',
          riskScore: 64.1,
          impactDescription: 'Transient muscle fatigue after 40km full tactical kit march',
          severity: 'nominal',
        },
        {
          day: 3,
          label: 'Day 3',
          status: 'Glycogen Rebound',
          riskScore: 58,
          impactDescription: 'Muscular recovery proceeding rapidly with zero psychological markers',
          severity: 'nominal',
        },
        {
          day: 14,
          label: 'Day 14',
          status: 'Elite Baseline Re-established',
          riskScore: 48,
          impactDescription: 'Resting heart rate stable at 58 bpm',
          severity: 'nominal',
        },
        {
          day: 30,
          label: 'Day 30',
          status: 'Peak Combat Readiness',
          riskScore: 42,
          impactDescription: 'Full special forces operational readiness confirmed',
          severity: 'nominal',
        },
      ],
    },
    recommendations: [
      {
        id: 'sak-act-1',
        title: '48-Hour Active Musculoskeletal Recovery Protocol',
        category: 'Clinical & Medical',
        categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
        priority: 'Operational Action',
        priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        expectedBenefit: 'Accelerates lactic acid clearance & muscle repair',
        description: 'Hydrotherapy contrast baths and sports physiotherapy at Special Forces Training Wing.',
        actionPayload: 'Prescribe Hydrotherapy Recovery Protocol',
      },
      {
        id: 'sak-act-2',
        title: 'High-Protein & Electrolyte Nutritional Reload',
        category: 'Clinical & Medical',
        categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
        priority: 'Operational Action',
        priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        expectedBenefit: 'Restores glycogen reserves within 24 hours',
        description: 'Supervised sports nutrition reload with targeted branched-chain amino acids and minerals.',
        actionPayload: 'Order Nutritional Replenishment',
      },
      {
        id: 'sak-act-3',
        title: 'Temporary 3-Day Exemption from Heavy Ruck Loads',
        category: 'Roster & Duty',
        categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
        priority: 'Routine Welfare',
        priorityBadgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
        expectedBenefit: 'Protects lumbar and spinal joint integrity',
        description: 'Maintain normal tactical drills while restricting heavy rucksack marching.',
        actionPayload: 'Exempt from Heavy Kit Drills',
      },
      {
        id: 'sak-act-4',
        title: 'Routine Readiness Biometric Audit in 7 Days',
        category: 'Clinical & Medical',
        categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
        priority: 'Routine Welfare',
        priorityBadgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
        expectedBenefit: 'Revalidates full combat operational readiness',
        description: 'Standard post-exercise HRV and aerobic threshold assessment.',
        actionPayload: 'Schedule Biometric Audit',
      },
    ],
  },

  // 8. Major Alex Morgan (CRPF-2015-8010)
  'CRPF-2015-8010': {
    rootCauseTitle: 'Multi-Sector Tactical Command Overload & Accumulated Sleep Debt',
    stressCategory: 'Executive Cognitive Strain & Deferred Furlough Cycles',
    diagnosisDetails:
      'Directing tactical operations across 3 sectors simultaneously with 2 cancelled leave requests. 8.5+ hours accumulated sleep debt from continuous night incident coordination; elevated baseline sympathetic tone.',
    contributingTriggers: [
      'Simultaneous 3-Sector Command',
      '2 Deferred Leave Requests',
      '8.5h Accumulated Sleep Debt',
      'Continuous Nocturnal Radio Traffic',
    ],
    riskVelocity: '+12% over 30 days (High Stress Velocity)',
    disasterHorizon: {
      disasterType: 'Executive Command Burnout & Tactical Latency',
      projectedBreakdownDay: 16,
      timeHorizonText: 'Within 14 - 18 Days',
      urgency: 'Critical Escalation (Day 16)',
      urgencyBadgeClass: 'bg-rose-100 text-rose-800 border-rose-300',
      presenteeismRiskPct: 76,
      presenteeismSummary:
        'Executive Presenteeism: Round-the-clock crisis coordination with 8.5h sleep deficit leads to impaired tactical risk calculation and memory lapses during operational briefings.',
      burnoutProbabilityPct: 92,
      disasterImpact:
        'Critical command decision latency or acute hypertensive burnout episode during ongoing counter-terror deployment.',
      preventiveActionWindow: 'Delegate sectors & mandate rest within 5 days',
      milestones: [
        {
          day: 0,
          label: 'Today (Day 0)',
          status: '3-Sector Command Burden',
          riskScore: 75,
          impactDescription: '8.5 hours accumulated sleep debt over the week',
          severity: 'warning',
        },
        {
          day: 7,
          label: 'Day 7',
          status: 'Executive Cognitive Strain',
          riskScore: 82,
          impactDescription: 'Memory lapses and shortened attention span under radio chatter',
          severity: 'danger',
        },
        {
          day: 16,
          label: 'Day 16 (Disaster Point)',
          status: 'Command Decision Burnout',
          riskScore: 90,
          isDisasterThreshold: true,
          impactDescription: 'Acute burnout and inability to coordinate emergency tactical maneuvers',
          severity: 'critical',
        },
        {
          day: 30,
          label: 'Day 30',
          status: 'Total Executive Breakdown',
          riskScore: 95,
          impactDescription: 'Medical stand-down mandated by Command Medical Officer',
          severity: 'critical',
        },
      ],
    },
    recommendations: [
      {
        id: 'mam-act-1',
        title: 'Delegate Sectors 2 & 3 Tactical Monitoring',
        category: 'Roster & Duty',
        categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
        priority: 'Critical Immediate',
        priorityBadgeClass: 'bg-rose-100 text-rose-800 border-rose-200',
        expectedBenefit: 'Cuts executive cognitive load by -45%',
        description: 'Formally assign operational coordination of subordinate sectors to Assistant Commandant.',
        actionPayload: 'Delegate Sector Monitoring to Assistant Commandant',
      },
      {
        id: 'mam-act-2',
        title: 'Sanction 10-Day Leadership Decompression Leave',
        category: 'Leave & Furlough',
        categoryBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        priority: 'High Priority',
        priorityBadgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        expectedBenefit: 'Interrupts chronic command burnout and resets stress',
        description: 'Execute overdue leave allocation to provide complete break from command radio traffic.',
        actionPayload: 'Approve Leadership Decompression Leave',
      },
      {
        id: 'mam-act-3',
        title: 'Enforce 6-Hour Night Communication Blackout',
        category: 'Roster & Duty',
        categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
        priority: 'High Priority',
        priorityBadgeClass: 'bg-orange-100 text-orange-800 border-orange-200',
        expectedBenefit: 'Guarantees uninterrupted sleep restoration',
        description: 'Direct Command Control Room to route only Code Red emergencies between 23:00 and 05:00 hrs.',
        actionPayload: 'Establish Night Comms Blackout Protocol',
      },
      {
        id: 'mam-act-4',
        title: 'Executive Cardiovascular & Cortisol Screening',
        category: 'Clinical & Medical',
        categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
        priority: 'Operational Action',
        priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
        expectedBenefit: 'Prevents stress-induced hypertension',
        description: 'Comprehensive blood pressure, ECG, and stress biomarker check at Command Base Hospital.',
        actionPayload: 'Order Executive Medical Screening',
      },
    ],
  },

  // 9. Captain Sarah Connor (CISF-2017-8011)
  'CISF-2017-8011': {
    rootCauseTitle: 'Nominal Strain Profile & Exemplary Restorative Routine',
    stressCategory: 'Optimal Operational Readiness & Resilience Baseline',
    diagnosisDetails:
      'Air defense telemetry monitoring shifts properly balanced with 8-hour sleep cycles. Zero leave backlog, verified 92% restorative sleep ratio, high emotional stability, and strong unit cohesion.',
    contributingTriggers: [
      '92% Restorative Sleep Ratio',
      'Zero Leave Backlog',
      'Stable 8h Shift Rotations',
      'High Resilience Buffering',
    ],
    riskVelocity: '-6% over 30 days (Stable Nominal Vector)',
    disasterHorizon: {
      disasterType: 'Zero Impending Disaster (Peak Resilience)',
      projectedBreakdownDay: 90,
      timeHorizonText: 'Optimal (>90 Days)',
      urgency: 'Low Risk / Stable',
      urgencyBadgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      presenteeismRiskPct: 4,
      presenteeismSummary: 'Zero Presenteeism: Full cognitive presence and high vigilance adherence.',
      burnoutProbabilityPct: 3,
      disasterImpact: 'No operational or psychological hazard detected.',
      preventiveActionWindow: 'Sustain current 8-hour shift tempo',
      milestones: [
        {
          day: 0,
          label: 'Today (Day 0)',
          status: 'Optimal Readiness',
          riskScore: 27.3,
          impactDescription: 'Restorative sleep ratio verified at 92%',
          severity: 'nominal',
        },
        {
          day: 7,
          label: 'Day 7',
          status: 'Consistent Homeostasis',
          riskScore: 26,
          impactDescription: 'Regular leave cycles with zero backlog',
          severity: 'nominal',
        },
        {
          day: 14,
          label: 'Day 14',
          status: 'Peer Leadership Role',
          riskScore: 25,
          impactDescription: 'High stress buffering capacity and autonomic stability',
          severity: 'nominal',
        },
        {
          day: 30,
          label: 'Day 30',
          status: 'Sustained Resilience',
          riskScore: 24,
          impactDescription: 'Exemplary operational readiness',
          severity: 'nominal',
        },
      ],
    },
    recommendations: [
      {
        id: 'sc-act-1',
        title: 'Maintain Current 8-Hour Operational Shift Tempo',
        category: 'Roster & Duty',
        categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
        priority: 'Routine Welfare',
        priorityBadgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
        expectedBenefit: 'Sustains optimal cognitive & vital baseline',
        description: 'Continue established watch rotation schedule without administrative disruption.',
        actionPayload: 'Confirm Shift Tempo Maintenance',
      },
      {
        id: 'sc-act-2',
        title: 'Appoint as Unit Peer Mental Resilience Mentor',
        category: 'Psychological Support',
        categoryBadge: 'bg-amber-50 text-amber-800 border-amber-200',
        priority: 'Routine Welfare',
        priorityBadgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
        expectedBenefit: 'Strengthens battalion-wide peer support',
        description: 'Designate officer to lead peer wellness and coping briefings for junior air defense personnel.',
        actionPayload: 'Appoint Peer Welfare Resilience Mentor',
      },
      {
        id: 'sc-act-3',
        title: 'Forward Command Commendation for Health Discipline',
        category: 'Routine Welfare',
        categoryBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        priority: 'Routine Welfare',
        priorityBadgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
        expectedBenefit: 'Reinforces positive institutional habits',
        description: 'Submit formal commendation to Station Commander for model wellness adherence.',
        actionPayload: 'Submit Formal Health Commendation',
      },
      {
        id: 'sc-act-4',
        title: 'Schedule Routine 90-Day Periodic Review',
        category: 'Clinical & Medical',
        categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
        priority: 'Routine Welfare',
        priorityBadgeClass: 'bg-slate-100 text-slate-800 border-slate-200',
        expectedBenefit: 'Ensures ongoing preventative governance',
        description: 'Standard quarterly wellness check-in on telemetry portal.',
        actionPayload: 'Schedule 90-Day Periodic Review',
      },
    ],
  },
};

/**
 * Intelligent Clinical Analyzer:
 * Examines the personnel's real problem and cause of stress,
 * and returns precise, tailored clinical recommendations + disaster timeline forecast.
 */
export function getPersonnelClinicalAnalysis(personnel: PriorityPersonnel): PersonnelClinicalAnalysis {
  if (!personnel) {
    return CURATED_ANALYSES['JC-2748'];
  }

  // Check by JC number
  if (CURATED_ANALYSES[personnel.jcNumber]) {
    return CURATED_ANALYSES[personnel.jcNumber];
  }

  // Check by name key
  const nameLower = personnel.name.toLowerCase();
  for (const [key, item] of Object.entries(CURATED_ANALYSES)) {
    if (nameLower.includes(key.toLowerCase())) {
      return item;
    }
  }

  // Dynamic Synthesis for any unlisted personnel
  const topFactor = personnel.topFactors?.[0]?.name || 'Operational Workload';
  const topFactorPct = personnel.topFactors?.[0]?.pct || 30;
  const isCritical = personnel.riskTier === 'Critical';
  const isHigh = personnel.riskTier === 'High';

  const triggers: string[] = [];
  if (personnel.location) triggers.push(`Location: ${personnel.location}`);
  if (personnel.unit) triggers.push(`Unit: ${personnel.unit}`);
  triggers.push(`Primary Stress Driver: ${topFactor} (${topFactorPct}%)`);
  if (personnel.topFactors?.[1]) {
    triggers.push(`Secondary Contributor: ${personnel.topFactors[1].name} (${personnel.topFactors[1].pct}%)`);
  }

  const rootCause = `${topFactor} Strain in ${personnel.location || 'Active Sector'}`;
  const stressCategory = isCritical
    ? 'Severe Operational Burnout & Autonomic Fatigue'
    : isHigh
    ? 'Elevated Psychological & Tactical Stress'
    : 'Moderate Operational Stress with Monitoring';

  const breakdownDay = isCritical ? 11 : isHigh ? 17 : 28;
  const timeHorizonText = isCritical ? 'Within 10 - 14 Days' : isHigh ? 'Within 15 - 20 Days' : 'Within 25 - 30 Days';

  const disasterHorizon: PredictiveDisasterHorizon = {
    disasterType: isCritical
      ? 'Acute Operational Burnout & Sentry Presenteeism'
      : isHigh
      ? 'Elevated Fatigue & Attentional Degradation'
      : 'Moderate Operational Fatigue Exposure',
    projectedBreakdownDay: breakdownDay,
    timeHorizonText,
    urgency: isCritical ? `Imminent Disaster (Day ${breakdownDay})` : `Elevated Risk (Day ${breakdownDay})`,
    urgencyBadgeClass: isCritical
      ? 'bg-rose-100 text-rose-800 border-rose-300'
      : 'bg-orange-100 text-orange-800 border-orange-300',
    presenteeismRiskPct: isCritical ? 72 : isHigh ? 54 : 28,
    presenteeismSummary: isCritical
      ? `High Presenteeism: Soldier remains physically on duty, but ${topFactor.toLowerCase()} degrades reaction speed and situational vigilance.`
      : `Moderate Presenteeism: Emerging fatigue reduces focus and task throughput.`,
    burnoutProbabilityPct: isCritical ? 92 : isHigh ? 74 : 35,
    disasterImpact: isCritical
      ? `Projected point of clinical burnout and duty failure on or around Day ${breakdownDay} without intervention.`
      : `Fatigue accumulation may transition soldier into critical tier within 30 days.`,
    preventiveActionWindow: isCritical
      ? 'Golden Prevention Window: Next 48 - 72 Hours'
      : 'Review duty schedule within 7 days',
    milestones: [
      {
        day: 0,
        label: 'Today (Day 0)',
        status: 'Baseline Telemetry Strain',
        riskScore: personnel.riskScore,
        impactDescription: `Active ${topFactor} strain logged in telemetry`,
        severity: isCritical ? 'warning' : 'nominal',
      },
      {
        day: Math.round(breakdownDay / 2),
        label: `Day ${Math.round(breakdownDay / 2)}`,
        status: 'Fatigue Escalation',
        riskScore: Math.min(95, Math.round(personnel.riskScore + 6)),
        impactDescription: 'Progressive sleep debt and cognitive blunting on active duty',
        severity: 'danger',
      },
      {
        day: breakdownDay,
        label: `Day ${breakdownDay} (Disaster Point)`,
        status: 'Projected Burnout Threshold',
        riskScore: Math.min(98, Math.round(personnel.riskScore + 11)),
        isDisasterThreshold: true,
        impactDescription: `Irreversible clinical exhaustion and operational hazard threshold`,
        severity: 'critical',
      },
      {
        day: 30,
        label: 'Day 30',
        status: 'Full Incapacitation',
        riskScore: Math.min(99, Math.round(personnel.riskScore + 15)),
        impactDescription: 'Long-term medical stand-down and hospitalization requirement',
        severity: 'critical',
      },
    ],
  };

  const recs: TailoredAction[] = [
    {
      id: `dyn-act-1`,
      title: isCritical ? 'Sanction 21-Day Decompression Furlough' : 'Grant Rotational Welfare Furlough',
      category: 'Leave & Furlough',
      categoryBadge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      priority: isCritical ? 'Critical Immediate' : 'High Priority',
      priorityBadgeClass: isCritical ? 'bg-rose-100 text-rose-800 border-rose-200' : 'bg-orange-100 text-orange-800 border-orange-200',
      expectedBenefit: `Mitigates ${topFactor} by -25% via restorative leave`,
      description: `Authorize immediate scheduled rest cycle to alleviate cumulative fatigue from ${topFactor.toLowerCase()}.`,
      actionPayload: `Approve Welfare Furlough for ${personnel.name}`,
    },
    {
      id: `dyn-act-2`,
      title: 'Duty Watch Roster Pacing & Shift Adjustment',
      category: 'Roster & Duty',
      categoryBadge: 'bg-blue-50 text-blue-800 border-blue-200',
      priority: isCritical ? 'High Priority' : 'Operational Action',
      priorityBadgeClass: isCritical ? 'bg-orange-100 text-orange-800 border-orange-200' : 'bg-amber-100 text-amber-800 border-amber-200',
      expectedBenefit: 'Regulates operational shift tempo & prevents sleep fragmentation',
      description: `Rebalance watch schedule to cap consecutive hours and guarantee 8-hour sleep recovery blocks.`,
      actionPayload: `Adjust Watch Roster for ${personnel.name}`,
    },
    {
      id: `dyn-act-3`,
      title: 'Targeted Clinical Health & Vitals Evaluation',
      category: 'Clinical & Medical',
      categoryBadge: 'bg-purple-50 text-purple-800 border-purple-200',
      priority: 'Operational Action',
      priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      expectedBenefit: 'Identifies biometric exhaustion markers early',
      description: `Conduct comprehensive resting heart rate, blood pressure, and sleep architecture check at Unit Medical Inspection room.`,
      actionPayload: `Schedule Medical Evaluation for ${personnel.name}`,
    },
    {
      id: `dyn-act-4`,
      title: 'Regimental 1-on-1 Welfare Officer Debrief',
      category: 'Psychological Support',
      categoryBadge: 'bg-amber-50 text-amber-800 border-amber-200',
      priority: 'Operational Action',
      priorityBadgeClass: 'bg-amber-100 text-amber-800 border-amber-200',
      expectedBenefit: 'Establishes personalized coping mechanisms & peer support',
      description: `Conduct structured psychological check-in to review emotional stability and unit camaraderie.`,
      actionPayload: `Schedule Welfare Debrief for ${personnel.name}`,
    },
  ];

  return {
    rootCauseTitle: rootCause,
    stressCategory,
    diagnosisDetails: personnel.summary || `Analysis flags elevated ${topFactor.toLowerCase()} requiring targeted intervention.`,
    contributingTriggers: triggers,
    riskVelocity: `${personnel.trend} over 30 days`,
    disasterHorizon,
    recommendations: recs,
  };
}
