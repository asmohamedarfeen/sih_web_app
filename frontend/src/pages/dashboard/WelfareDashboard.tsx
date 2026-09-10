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
}

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

                          <div className="flex items-center gap-3 shrink-0">
                            <span
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
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
                            <span className="text-xs font-bold text-primary">View &rarr;</span>
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
                onClick={() => setShowFullMatrix(!showFullMatrix)}
                className="text-xs font-bold text-primary hover:text-primary-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View Details &rarr;</span>
              </button>
            </div>
            <p className="text-xs text-slate-500 font-medium mb-5">
              Risk Distribution Across Key Factors (Total 520 Personnel)
            </p>

            <div className="space-y-4">
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
                  <div key={mod.name} className="flex items-center gap-3 text-xs">
                    <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                      <ModIcon className="w-3.5 h-3.5" />
                    </div>
                    <div className="w-36 font-semibold text-slate-800 truncate">{mod.name}</div>
                    <div className="flex-1 bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div className={`h-full ${mod.color} rounded-full transition-all duration-700`} style={{ width: `${mod.pct * 3.2}%` }} />
                    </div>
                    <div className="w-10 text-right font-black text-slate-900">{mod.pct}%</div>
                    <div className="w-10 text-right text-[11px] text-slate-400 font-medium">({mod.count})</div>
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
              Relative impact breakdown for {selectedPersonnel.name} ({selectedPersonnel.jcNumber})
            </p>

            <div className="space-y-3.5">
              {selectedPersonnel.topFactors.map((factor) => (
                <div key={factor.name} className="text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-slate-800">{factor.name}</span>
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
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-100 text-[10px] font-extrabold uppercase text-slate-500 tracking-wider">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Name / ID</th>
                    <th className="pb-2">Unit</th>
                    <th className="pb-2">Risk Score</th>
                    <th className="pb-2">Status</th>
                    <th className="pb-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ALL_PERSONNEL_DATABASE.slice(0, 5).map((p, idx) => {
                    const isSelected = selectedPersonnel.id === p.id;
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
                          <div className="text-[10px] font-mono text-slate-400">{p.jcNumber}</div>
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
                <div key={f.name} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                  <div className="font-bold text-gray-900 flex items-center justify-between">
                    <span>{f.name}</span>
                    <span className="text-primary font-mono">{f.weight}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono mt-1">{f.formula}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WelfareDashboard;
