import React, { useState, useMemo } from 'react';
import {
  FileText,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Sparkles,
  Activity,
  Brain,
  X,
} from 'lucide-react';

export interface PersonnelQuery {
  id: string;
  ticketId: string;
  soldierName: string;
  rank: string;
  jcNumber: string;
  unit: string;
  avatarUrl: string;
  category: 'Leave & Roster' | 'Shift Fatigue & Sleep' | 'Family & Domestic' | 'Medical & Psych' | 'Administrative & Pay';
  subject: string;
  soldierStatement: string;
  urgency: 'Critical' | 'High' | 'Moderate' | 'Routine';
  status: 'Open' | 'Under Investigation' | 'Action Taken' | 'Resolved' | 'Escalated to CO';
  dateSubmitted: string;
  slaRemaining: string;
  slaUrgent: boolean;
  // Deep diagnostic issue analysis
  telemetryData: {
    autonomicStressScore: number;
    consecutiveNightShifts: number;
    leaveDeficitDays: number;
    restorativeSleepScore: number;
    vocalStressSpike: string;
  };
  aiDiagnosticAssessment: string;
  aiSuggestedResolution: string[];
  officerNotes?: string;
  resolutionTimestamp?: string;
}

const INITIAL_QUERIES: PersonnelQuery[] = [
  {
    id: 'q-1',
    ticketId: 'QRY-8412',
    soldierName: 'Ramesh Chand',
    rank: 'Havildar',
    jcNumber: 'JC-2748',
    unit: '12th Kumaon Battalion',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    category: 'Leave & Roster',
    subject: 'Emergency Compassionate Leave Denied for Daughter Surgery',
    soldierStatement: 'Submitted 10-day emergency leave application 14 days ago for my daughter\'s open-heart surgery in AIIMS New Delhi. Unit clerk deferred application due to LAC high-vigilance state. Continuously assigned night sentry watch for 12 consecutive nights. Experiencing extreme anxiety and insomnia.',
    urgency: 'Critical',
    status: 'Open',
    dateSubmitted: 'Today, 06:30 hrs',
    slaRemaining: '2h 15m remaining',
    slaUrgent: true,
    telemetryData: {
      autonomicStressScore: 84,
      consecutiveNightShifts: 12,
      leaveDeficitDays: 142,
      restorativeSleepScore: 34,
      vocalStressSpike: '+38% Pitch Jitter on Morning Rollcall',
    },
    aiDiagnosticAssessment: 'Compounded Neuro-Cognitive Exhaustion: Severe conflict between urgent domestic medical emergency and 142-day deployment leave freeze. 12 consecutive night shifts have degraded restorative sleep to 34%, triggering acute autonomic nervous system hyper-arousal. Imminent risk of psychomotor performance breakdown.',
    aiSuggestedResolution: [
      'Fast-track 10-day compassionate leave clearance under Defence Welfare Discretionary Order 44/2023',
      'Immediate relief from night sentry duty; rotate to day logistics post-stand-down',
      'Dispatch ₹25,000 welfare relief grant from Army Central Welfare Fund for AIIMS travel',
      'Schedule 15-minute supportive debrief with Unit Welfare Officer prior to departure'
    ],
    officerNotes: 'Reviewing emergency hospital documents from AIIMS Delhi. Dispatching fast-track leave request to Battalion 2IC.',
  },
  {
    id: 'q-2',
    ticketId: 'QRY-7921',
    soldierName: 'Amit Kumar',
    rank: 'Sepoy',
    jcNumber: 'UID-SLD-015',
    unit: '4th Para Special Forces',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    category: 'Shift Fatigue & Sleep',
    subject: 'Severe Nocturnal Insomnia and Disorientation after Patrol Streak',
    soldierStatement: 'Unable to sleep more than 2 hours per night following 9 days of forward alpine patrolling. Persistent vestibular headache and cognitive sluggishness during morning inspection. Requesting medical evaluation.',
    urgency: 'Critical',
    status: 'Under Investigation',
    dateSubmitted: 'Yesterday, 18:40 hrs',
    slaRemaining: '5h 40m remaining',
    slaUrgent: true,
    telemetryData: {
      autonomicStressScore: 78,
      consecutiveNightShifts: 9,
      leaveDeficitDays: 98,
      restorativeSleepScore: 28,
      vocalStressSpike: '+24% Micro-tremor detected in voice check-in',
    },
    aiDiagnosticAssessment: 'High-Altitude Circadian Desynchronization & Hypoxic Fatigue: Extreme restorative sleep collapse (28%) following alpine patrol tempo. Bio-sensors indicate severe sympathetic overdrive and elevated resting heart rate (88 bpm vs 62 bpm baseline).',
    aiSuggestedResolution: [
      'Prescribe mandatory 48-hour operational stand-down in oxygen-enriched decompression bunker',
      'Clinical consultation with Regimental Medical Officer (RMO) for sleep architecture reset',
      'Micro-pacing protocol: 2x daily guided respiratory coherence on soldier terminal',
      'Reassign to base perimeter day watch for the next 7 operational cycles'
    ],
    officerNotes: 'Coordinating with Medical Officer at Field Ambulance. Sleep tracking telemetry assigned.',
  },
  {
    id: 'q-3',
    ticketId: 'QRY-6540',
    soldierName: 'Gurpreet Singh',
    rank: 'Naik',
    jcNumber: 'JC-1108',
    unit: '7th Sikh Light Infantry',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    category: 'Family & Domestic',
    subject: 'Flood Damage Rehabilitation Grant for Ancestral Property Delayed',
    soldierStatement: 'Ancestral house in Gurdaspur suffered roof collapse due to monsoon flash floods. Rehabilitation welfare grant application (Ref #AG-8821) pending approval at Command Records Office for over 45 days. Family currently displaced.',
    urgency: 'High',
    status: 'Action Taken',
    dateSubmitted: '2 days ago',
    slaRemaining: '11h 20m remaining',
    slaUrgent: false,
    telemetryData: {
      autonomicStressScore: 66,
      consecutiveNightShifts: 4,
      leaveDeficitDays: 65,
      restorativeSleepScore: 54,
      vocalStressSpike: '+14% Acoustic valence suppression',
    },
    aiDiagnosticAssessment: 'Administrative Friction Inducing Chronic Domestic Anxiety: The soldier displays sustained operational competence but escalating emotional fatigue caused by systemic processing delays for disaster compensation.',
    aiSuggestedResolution: [
      'Liaison directly with Zila Sainik Welfare Office (Gurdaspur) for expedited site survey validation',
      'Issue interim emergency grant of ₹50,000 via Regimental Distress Relief Fund',
      'Grant 5-day special welfare pass for on-site family accommodation arrangement',
      'Track weekly verification updates with Command Records Section'
    ],
    officerNotes: 'Interim grant sanctioned by Welfare Officer. Zila Sainik Board contacted; survey confirmed.',
  },
  {
    id: 'q-4',
    ticketId: 'QRY-5119',
    soldierName: 'Vikram Singh',
    rank: 'Subedar Major',
    jcNumber: 'JC-3419',
    unit: '14th Dogra Regiment',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    category: 'Medical & Psych',
    subject: 'Chronic Lumbar Strain & Tactical Gear Overburden During Vigils',
    soldierStatement: 'Severe musculoskeletal strain in lumbar region aggravated by continuous wear of body armor during 10-hour static border observation posts. Reluctant to report on sick bay due to junior supervision responsibilities.',
    urgency: 'High',
    status: 'Open',
    dateSubmitted: 'Today, 09:15 hrs',
    slaRemaining: '8h 30m remaining',
    slaUrgent: false,
    telemetryData: {
      autonomicStressScore: 62,
      consecutiveNightShifts: 7,
      leaveDeficitDays: 110,
      restorativeSleepScore: 48,
      vocalStressSpike: 'Nominal acoustic rhythm',
    },
    aiDiagnosticAssessment: 'Orthopedic Strain with Under-Reporting Tendency: Senior NCO hesitation to disengage from active duty leading to progressive musculoskeletal deterioration. High probability of acute spinal disc herniation if unaddressed.',
    aiSuggestedResolution: [
      'Arrange non-punitive physical therapy evaluation at Base Hospital Physiotherapy Wing',
      'Modify watch rotation: Maximum 3 consecutive hours in static observation harness',
      'Equip observation post with ergonomic lumbar support seating',
      'Deploy buddy rotation for equipment burden sharing'
    ],
  },
  {
    id: 'q-5',
    ticketId: 'QRY-4302',
    soldierName: 'Rajesh Verma',
    rank: 'Lance Naik',
    jcNumber: 'UID-SLD-082',
    unit: '9th Rajput Regiment',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    category: 'Administrative & Pay',
    subject: 'High-Altitude Allowance Pay Slip Discrepancy & Arrears Missing',
    soldierStatement: 'Deployed at Siachen Base Camp staging area since March; high-altitude risk allowance missing from consecutive monthly pay slips. Dependent mother medical bills pending.',
    urgency: 'Moderate',
    status: 'Action Taken',
    dateSubmitted: '3 days ago',
    slaRemaining: '24h remaining',
    slaUrgent: false,
    telemetryData: {
      autonomicStressScore: 52,
      consecutiveNightShifts: 3,
      leaveDeficitDays: 45,
      restorativeSleepScore: 62,
      vocalStressSpike: 'Nominal acoustic rhythm',
    },
    aiDiagnosticAssessment: 'Financial Friction Stress: Pay anomaly verified in central CDA (Pensions/Pay) ledger. Direct correlation with soldier moral sentiment.',
    aiSuggestedResolution: [
      'Issue immediate Welfare Advance of ₹30,000 against verified high-altitude arrears',
      'Forward rectified Part II Order directly to PCDA (O) via expedited digital dispatch',
      'Notify soldier via SMS and mobile app ledger update'
    ],
    officerNotes: 'PCDA liaison completed. Arrears credited in upcoming payroll cycle.',
  },
  {
    id: 'q-6',
    ticketId: 'QRY-3891',
    soldierName: 'Kuldeep Yadav',
    rank: 'Sepoy',
    jcNumber: 'JC-2901',
    unit: '3rd Grenadiers',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    category: 'Leave & Roster',
    subject: 'Disproportionate Roster Allocation: 14 Night Shifts in 18 Days',
    soldierStatement: 'Assigned 14 night sentinel watches over the past 18 days while peer section soldiers are on daytime quarter guard. Physical exhaustion affecting rifle handling precision.',
    urgency: 'High',
    status: 'Open',
    dateSubmitted: 'Yesterday, 14:10 hrs',
    slaRemaining: '6h 15m remaining',
    slaUrgent: false,
    telemetryData: {
      autonomicStressScore: 74,
      consecutiveNightShifts: 14,
      leaveDeficitDays: 85,
      restorativeSleepScore: 38,
      vocalStressSpike: '+21% Cognitive Fatigue Indicator',
    },
    aiDiagnosticAssessment: 'Unit Shift Inequity & Autonomic Fatigue Overload: Shift allocation anomaly confirmed by Battalion Automated Roster Analytics. Roster variance 2.8x higher than section average.',
    aiSuggestedResolution: [
      'Issue Automated Roster Rebalance Directive to Battalion Adjutant',
      'Enforce mandatory 48-hour recovery stand-down before next guard cycle',
      'Balance sentry shifts across platoon roster to normalize variance'
    ],
  },
  {
    id: 'q-7',
    ticketId: 'QRY-2415',
    soldierName: 'Manpreet Singh',
    rank: 'Havildar',
    jcNumber: 'JC-2104',
    unit: '2nd Punjab Regiment',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    category: 'Medical & Psych',
    subject: 'Post-Patrol Isolation Anxiety & Persistent Hyper-vigilance',
    soldierStatement: 'Experiencing sudden panic sensations, startle reflexes, and difficulty interacting during mess meals after return from 21-day isolated border post. Requesting confidential talk.',
    urgency: 'Critical',
    status: 'Action Taken',
    dateSubmitted: '1 day ago',
    slaRemaining: '1h 10m remaining',
    slaUrgent: true,
    telemetryData: {
      autonomicStressScore: 82,
      consecutiveNightShifts: 6,
      leaveDeficitDays: 130,
      restorativeSleepScore: 36,
      vocalStressSpike: '+32% High-frequency speech tremor',
    },
    aiDiagnosticAssessment: 'Post-Operational Sensory Overload & Acute Re-adaptation Stress: Soldier is transitioning from extreme high-threat sensory deprivation to communal barracks. Physiological indicators demonstrate sustained hyper-vigilance.',
    aiSuggestedResolution: [
      'Immediate confidential tele-consultation with Armed Forces Medical Services Clinical Psychologist',
      'Buddy-pairing with senior NCO mentor who completed similar border cycle',
      'Quiet room billeting for 72 hours with light-spectrum modulation',
      'Daily 20-minute autonomic relaxation sessions'
    ],
    officerNotes: 'Psychological consultation conducted. Soldier responding favorably to peer buddy assignment.',
  },
];

export const PersonnelQueryTrackingCard: React.FC = () => {
  const [queries, setQueries] = useState<PersonnelQuery[]>(INITIAL_QUERIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [selectedQueryForDiagnosis, setSelectedQueryForDiagnosis] = useState<PersonnelQuery | null>(null);
  const [officerNoteInput, setOfficerNoteInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filtered queries
  const filteredQueries = useMemo(() => {
    return queries.filter((q) => {
      const matchesSearch =
        !searchQuery ||
        q.soldierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.jcNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.ticketId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.unit.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || q.status.toLowerCase() === statusFilter.toLowerCase();

      const matchesUrgency =
        urgencyFilter === 'All' || q.urgency.toLowerCase() === urgencyFilter.toLowerCase();

      const matchesCategory =
        categoryFilter === 'All' || q.category.toLowerCase() === categoryFilter.toLowerCase();

      return matchesSearch && matchesStatus && matchesUrgency && matchesCategory;
    });
  }, [queries, searchQuery, statusFilter, urgencyFilter, categoryFilter]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = queries.length;
    const critical = queries.filter((q) => q.urgency === 'Critical').length;
    const investigating = queries.filter((q) => q.status === 'Under Investigation').length;
    const actionTaken = queries.filter((q) => q.status === 'Action Taken').length;
    const resolved = queries.filter((q) => q.status === 'Resolved').length;
    return { total, critical, investigating, actionTaken, resolved };
  }, [queries]);

  const handleOpenDiagnosticModal = (query: PersonnelQuery) => {
    setSelectedQueryForDiagnosis(query);
    setOfficerNoteInput(query.officerNotes || '');
  };

  const handleUpdateStatus = (
    queryId: string,
    newStatus: 'Open' | 'Under Investigation' | 'Action Taken' | 'Resolved' | 'Escalated to CO',
    customToast?: string
  ) => {
    setQueries((prev) =>
      prev.map((q) => {
        if (q.id === queryId) {
          return {
            ...q,
            status: newStatus,
            officerNotes: officerNoteInput || q.officerNotes,
            resolutionTimestamp: newStatus === 'Resolved' ? 'Resolved Today' : q.resolutionTimestamp,
          };
        }
        return q;
      })
    );

    if (selectedQueryForDiagnosis && selectedQueryForDiagnosis.id === queryId) {
      setSelectedQueryForDiagnosis((prev) =>
        prev
          ? {
              ...prev,
              status: newStatus,
              officerNotes: officerNoteInput || prev.officerNotes,
              resolutionTimestamp: newStatus === 'Resolved' ? 'Resolved Today' : prev.resolutionTimestamp,
            }
          : null
      );
    }

    const msg =
      customToast ||
      `Query ${selectedQueryForDiagnosis?.ticketId || ''} updated to "${newStatus}". Logged in Welfare Audit.`;
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleApplyResolution = (actionText: string) => {
    if (!selectedQueryForDiagnosis) return;
    const updatedNotes = officerNoteInput
      ? `${officerNoteInput}\n• Officer Action: ${actionText}`
      : `• Officer Action: ${actionText}`;
    setOfficerNoteInput(updatedNotes);

    handleUpdateStatus(
      selectedQueryForDiagnosis.id,
      'Action Taken',
      `Applied Action: "${actionText}" for ${selectedQueryForDiagnosis.soldierName}. Status updated to Action Taken.`
    );
  };

  return (
    <div id="welfare-query-tracking-system" className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm relative">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-6 z-50 p-4 rounded-2xl bg-[#1B382B] text-white border border-[#D4A017] shadow-2xl flex items-center gap-3 animate-fade-in text-xs font-semibold">
          <CheckCircle2 className="w-5 h-5 text-[#D4A017] shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header with Title & Badges */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="flex items-start gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#163A5F] to-[#0E2742] text-[#D4A017] flex items-center justify-center shadow-md border border-[#D4A017]/30 shrink-0">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900">
                Frontline Personnel Query &amp; Grievance Tracking System
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-sky-50 text-sky-800 border border-sky-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-sky-600" />
                <span>Live Telemetry Diagnostic Engine</span>
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Armed Forces Grievance Protocol 2024
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-medium">
              Real-time welfare ticketing with deep multi-source telemetry correlation to figure out root causes, accelerate resolution, and enforce SLA accountability.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-slate-50 px-3 py-2 rounded-2xl border border-slate-200 self-start lg:self-auto">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Live Resolution SLA: <strong className="text-slate-900 font-bold">94.6% On-Time</strong></span>
        </div>
      </div>

      {/* KPI Metrics Summary Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5 my-5">
        <div className="p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">Total Active Queries</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-slate-900">{metrics.total}</span>
            <span className="text-[10px] font-bold text-slate-400">Tickets</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1">Across 6 Battalions</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-rose-700">Critical Urgency</span>
            <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-rose-700">{metrics.critical}</span>
            <span className="text-[10px] font-bold text-rose-500">Immediate</span>
          </div>
          <span className="text-[10px] text-rose-600 font-medium mt-1">Under 4h SLA Target</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-700">Investigating</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-amber-700">{metrics.investigating}</span>
            <span className="text-[10px] font-bold text-amber-500">In Review</span>
          </div>
          <span className="text-[10px] text-amber-600 font-medium mt-1">Telemetry Diagnostics Run</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-sky-50/70 border border-sky-200/80 flex flex-col justify-between">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-sky-700">Action Dispatched</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-sky-700">{metrics.actionTaken}</span>
            <span className="text-[10px] font-bold text-sky-500">In Field</span>
          </div>
          <span className="text-[10px] text-sky-600 font-medium mt-1">Directives Enforced</span>
        </div>

        <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">Resolved Today</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-black font-mono text-emerald-700">{metrics.resolved}</span>
            <span className="text-[10px] font-bold text-emerald-500">Closed</span>
          </div>
          <span className="text-[10px] text-emerald-600 font-medium mt-1">100% Audit Verified</span>
        </div>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by soldier name, JC number, ticket ID, or issue..."
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-white transition-all shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-2 flex-wrap text-xs">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {['All', 'Open', 'Under Investigation', 'Action Taken', 'Resolved'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Urgency Filter */}
          <select
            value={urgencyFilter}
            onChange={(e) => setUrgencyFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 border-none text-xs font-bold text-slate-700 focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All">All Urgency Levels</option>
            <option value="Critical">Critical Only</option>
            <option value="High">High Only</option>
            <option value="Moderate">Moderate Only</option>
            <option value="Routine">Routine Only</option>
          </select>

          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-xl bg-slate-100 border-none text-xs font-bold text-slate-700 focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Leave & Roster">Leave & Roster</option>
            <option value="Shift Fatigue & Sleep">Shift Fatigue & Sleep</option>
            <option value="Family & Domestic">Family & Domestic</option>
            <option value="Medical & Psych">Medical & Psych</option>
            <option value="Administrative & Pay">Administrative & Pay</option>
          </select>
        </div>
      </div>

      {/* Query Tickets Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/90 border-b border-slate-200 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
              <th className="py-3 px-4">Ticket &amp; Soldier</th>
              <th className="py-3 px-4">Issue &amp; Category</th>
              <th className="py-3 px-3 text-center">Urgency</th>
              <th className="py-3 px-3 text-center">Current Status</th>
              <th className="py-3 px-4">SLA / Time Elapsed</th>
              <th className="py-3 px-4 text-right">Diagnostic Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredQueries.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-slate-500">
                  No frontline queries found matching the selected filters.
                </td>
              </tr>
            ) : (
              filteredQueries.map((q) => {
                const isCritical = q.urgency === 'Critical';
                const isHigh = q.urgency === 'High';
                const isActionTaken = q.status === 'Action Taken';
                const isResolved = q.status === 'Resolved';
                const isUnderInvestigation = q.status === 'Under Investigation';

                return (
                  <tr
                    key={q.id}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => handleOpenDiagnosticModal(q)}
                  >
                    {/* Ticket & Soldier Info */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={q.avatarUrl}
                          alt={q.soldierName}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200 shrink-0"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono text-[10px] font-bold text-primary bg-primary-50 px-1.5 py-0.5 rounded">
                              {q.ticketId}
                            </span>
                            <span className="font-bold text-slate-900 text-xs">{q.rank} {q.soldierName}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-0.5">
                            {q.jcNumber} • <span className="font-medium text-slate-600">{q.unit}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Issue & Category */}
                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-bold text-slate-900 truncate" title={q.subject}>
                        {q.subject}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                          {q.category}
                        </span>
                        <span className="text-[10px] text-slate-400">Filed {q.dateSubmitted}</span>
                      </div>
                    </td>

                    {/* Urgency */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          isCritical
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : isHigh
                            ? 'bg-orange-50 text-orange-700 border-orange-200'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        }`}
                      >
                        {q.urgency}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          isResolved
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : isActionTaken
                            ? 'bg-sky-50 text-sky-700 border-sky-200'
                            : isUnderInvestigation
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}
                      >
                        {q.status}
                      </span>
                    </td>

                    {/* SLA Time Remaining */}
                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock className={`w-3.5 h-3.5 ${q.slaUrgent ? 'text-rose-600' : 'text-slate-400'}`} />
                        <span className={`text-[11px] font-mono font-bold ${q.slaUrgent ? 'text-rose-600' : 'text-slate-600'}`}>
                          {q.slaRemaining}
                        </span>
                      </div>
                      {q.resolutionTimestamp && (
                        <div className="text-[10px] text-emerald-700 font-semibold mt-0.5">
                          ✓ {q.resolutionTimestamp}
                        </div>
                      )}
                    </td>

                    {/* Diagnostic Action Button */}
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenDiagnosticModal(q);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#2F4F3E] hover:bg-[#20372b] text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5 shadow-2xs group-hover:scale-105"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-[#D4A017]" />
                        <span>Diagnose Issue</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Footer Info */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Statutory Defense Welfare Safeguard: All grievances handled confidentially under Welfare Command.</span>
        </div>
        <div className="font-mono text-[11px]">
          Showing <strong>{filteredQueries.length}</strong> of <strong>{queries.length}</strong> welfare queries
        </div>
      </div>

      {/* ========================================================================= */}
      {/* DIAGNOSTIC ISSUE INSPECTOR MODAL ("Figure out what the issue is with that") */}
      {/* ========================================================================= */}
      {selectedQueryForDiagnosis && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex items-start justify-between gap-4 sticky top-0 z-10">
              <div className="flex items-start gap-3.5">
                <img
                  src={selectedQueryForDiagnosis.avatarUrl}
                  alt={selectedQueryForDiagnosis.soldierName}
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-xs shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-black text-primary bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                      {selectedQueryForDiagnosis.ticketId}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                      selectedQueryForDiagnosis.urgency === 'Critical'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {selectedQueryForDiagnosis.urgency} Urgency
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {selectedQueryForDiagnosis.category}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-900 mt-1">
                    {selectedQueryForDiagnosis.subject}
                  </h3>
                  <div className="text-xs text-slate-500 font-medium">
                    {selectedQueryForDiagnosis.rank} {selectedQueryForDiagnosis.soldierName} ({selectedQueryForDiagnosis.jcNumber}) • {selectedQueryForDiagnosis.unit}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedQueryForDiagnosis(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs">
              {/* 1. Soldier's Statement (Exact issue filed) */}
              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 space-y-1.5">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                  <span>Soldier Grievance &amp; Issue Statement (Filed {selectedQueryForDiagnosis.dateSubmitted})</span>
                </div>
                <p className="text-slate-800 font-serif italic text-xs sm:text-sm leading-relaxed">
                  &ldquo;{selectedQueryForDiagnosis.soldierStatement}&rdquo;
                </p>
              </div>

              {/* 2. Correlated Biometric & Operational Telemetry ("Figure out what the issue is") */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-primary" />
                    <span>Real-Time Telemetry Correlation &amp; Sensor Baseline</span>
                  </span>
                  <span className="text-[10px] font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active Wearable &amp; ERP Feed
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Autonomic Stress</span>
                    <span className="text-base font-black font-mono text-rose-600 mt-0.5 block">
                      {selectedQueryForDiagnosis.telemetryData.autonomicStressScore} / 100
                    </span>
                    <span className="text-[9px] text-rose-600 font-semibold">Acute Surge</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Night Vigil Streak</span>
                    <span className="text-base font-black font-mono text-slate-900 mt-0.5 block">
                      {selectedQueryForDiagnosis.telemetryData.consecutiveNightShifts} Days
                    </span>
                    <span className="text-[9px] text-amber-600 font-semibold">High Fatigue</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Leave Backlog</span>
                    <span className="text-base font-black font-mono text-slate-900 mt-0.5 block">
                      {selectedQueryForDiagnosis.telemetryData.leaveDeficitDays} Days
                    </span>
                    <span className="text-[9px] text-rose-600 font-semibold">Deployment Freeze</span>
                  </div>

                  <div className="p-2.5 rounded-xl bg-white border border-slate-200 text-center shadow-2xs">
                    <span className="text-[9px] font-bold text-slate-500 uppercase block">Restorative Sleep</span>
                    <span className="text-base font-black font-mono text-indigo-700 mt-0.5 block">
                      {selectedQueryForDiagnosis.telemetryData.restorativeSleepScore}%
                    </span>
                    <span className="text-[9px] text-indigo-600 font-semibold">Severe Deficit</span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-600 bg-white p-2 rounded-xl border border-slate-200 flex items-center justify-between">
                  <span>Voice Acoustic Analysis:</span>
                  <span className="font-bold text-rose-600">{selectedQueryForDiagnosis.telemetryData.vocalStressSpike}</span>
                </div>
              </div>

              {/* 3. AI Root Cause Diagnostic Assessment */}
              <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-200 space-y-2">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-indigo-900">
                  <Brain className="w-4 h-4 text-indigo-700" />
                  <span>AI Root Cause Diagnostic Assessment (Figure Out What The Issue Is)</span>
                </div>
                <p className="text-slate-800 leading-relaxed font-medium">
                  {selectedQueryForDiagnosis.aiDiagnosticAssessment}
                </p>
              </div>

              {/* 4. AI Suggested Resolution Pathway */}
              <div className="space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block">
                  AI Prescribed Resolution Protocols (Click to Apply Immediately):
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedQueryForDiagnosis.aiSuggestedResolution.map((step, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleApplyResolution(step)}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 border border-slate-200 text-left transition-all cursor-pointer flex items-start gap-2.5 group shadow-2xs"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-200 group-hover:bg-emerald-600 group-hover:text-white font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                        {idx + 1}
                      </span>
                      <span className="text-slate-800 group-hover:text-emerald-900 font-medium leading-snug">
                        {step}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Welfare Officer Investigation Workbench */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700 block">
                  Welfare Officer Investigation Notes &amp; Disposition:
                </span>
                <textarea
                  rows={3}
                  value={officerNoteInput}
                  onChange={(e) => setOfficerNoteInput(e.target.value)}
                  placeholder="Record officer investigation notes, telemetry findings, or orders dispatched..."
                  className="w-full p-3 rounded-xl bg-white border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary shadow-inner"
                />

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-600">Update Status:</span>
                    {(['Under Investigation', 'Action Taken', 'Resolved'] as const).map((st) => (
                      <button
                        key={st}
                        onClick={() => handleUpdateStatus(selectedQueryForDiagnosis.id, st)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          selectedQueryForDiagnosis.status === st
                            ? 'bg-[#2F4F3E] text-white shadow-xs'
                            : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                        }`}
                      >
                        {st}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      handleUpdateStatus(selectedQueryForDiagnosis.id, 'Resolved', `Query ${selectedQueryForDiagnosis.ticketId} marked as Resolved.`);
                      setSelectedQueryForDiagnosis(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold transition-all cursor-pointer shadow-xs flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Complete &amp; Close Ticket</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between text-xs text-slate-500">
              <span className="font-mono">SLA Clock: {selectedQueryForDiagnosis.slaRemaining}</span>
              <button
                onClick={() => setSelectedQueryForDiagnosis(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
