import React, { useState, useEffect } from 'react';
import {
  Shield,
  AlertTriangle,
  Brain,
  Users,
  TrendingUp,
  Activity,
  Zap,
  Target,
  RefreshCw,
  FileText,
  BarChart3,
  CheckCircle2,
  Download,
  Printer,
  ChevronRight,
  Clock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { dashboardService, CommanderDashboardData } from '../../services/dashboardService';

export const CommanderDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<CommanderDashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeSection, setActiveSection] = useState<'all' | 'overview' | 'readiness' | 'workforce' | 'risk' | 'recommendations' | 'comparison' | 'reports'>('all');
  const [broadcastSent, setBroadcastSent] = useState(false);

  const loadCommanderData = async () => {
    try {
      const res = await dashboardService.getCommanderDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load live commander data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadCommanderData();
  }, [user]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadCommanderData();
  };

  const handleBroadcast = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  const formationStats = [
    {
      title: 'Formation Combat Readiness',
      value: `${data?.metrics?.unit_readiness_index || 94.2}%`,
      sub: 'Optimal Combat Benchmark (>85%)',
      icon: Shield,
      color: 'text-accent-700',
      bg: 'bg-accent-50 border-accent-200',
    },
    {
      title: 'Command Formation Strength',
      value: `${data?.metrics?.total_command_strength || 1248} Troops`,
      sub: `${data?.metrics?.active_deployed_strength || 1184} Active Deployed &bull; 64 Reserve`,
      icon: Users,
      color: 'text-secondary',
      bg: 'bg-secondary-50 border-secondary-200',
    },
    {
      title: 'SHAPE-1 Deployable Readiness',
      value: `${data?.metrics?.shape_1_deployable_pct || 94.8}%`,
      sub: 'Medical Category Clearance Passed',
      icon: Activity,
      color: 'text-success',
      bg: 'bg-success-50 border-success-200',
    },
    {
      title: 'Tactical Stress Alerts',
      value: `${data?.metrics?.high_stress_alerts || 4} Critical`,
      sub: 'Kote Weapons Secured: ' + (data?.metrics?.weapons_secured_in_kote || '98.4%'),
      icon: AlertTriangle,
      color: 'text-danger',
      bg: 'bg-danger-50 border-danger-200',
    },
  ];

  const subUnits = (data?.formation_units || [
    { unit: 'Rapid Action Battalion 1', strength: 420, readiness: 96.2, status: 'Combat Ready' },
    { unit: 'High Altitude Guard', strength: 280, readiness: 91.5, status: 'Acclimatized' },
    { unit: 'Field Artillery 3rd Bn', strength: 310, readiness: 95.0, status: 'Combat Ready' },
    { unit: 'Signals & Telemetry Wing', strength: 238, readiness: 97.4, status: 'Operational' },
  ]).map((u: any, idx: number) => {
    const fallbackStress = [18.4, 34.2, 21.0, 15.6][idx] || 20.0;
    const fallbackArmory = ['99.1%', '98.0%', '98.8%', '100%'][idx] || '99.0%';
    return {
      unit: u.unit,
      strength: u.strength,
      readiness: u.readiness,
      stress: u.stress || fallbackStress,
      status: u.status,
      armorySecured: u.armorySecured || fallbackArmory,
    };
  });

  const dutyRosters = data?.active_duty_rosters || [
    {
      duty_id: 'DT-8801',
      personnel_name: 'Major Alex Morgan',
      duty_type: 'QRT Standby Lead',
      shift: 'Morning (06:00 - 14:00)',
      location: 'Sector 4 Command Post',
      weapon_issued: '5.56mm SIG Sauer 716 (Butt #BN-042)',
      status: 'On Duty',
    },
    {
      duty_id: 'DT-8802',
      personnel_name: 'Captain Sarah Connor',
      duty_type: 'Perimeter Surveillance',
      shift: 'Afternoon (14:00 - 22:00)',
      location: 'Operations Control Room',
      weapon_issued: '9mm Glock 17 (Butt #BN-108)',
      status: 'Scheduled',
    },
    {
      duty_id: 'DT-8803',
      personnel_name: 'Subedar Gurpreet Singh',
      duty_type: 'High Altitude Convoy Escort',
      shift: 'Night (22:00 - 06:00)',
      location: 'Northern Transit Pass',
      weapon_issued: '5.56mm INSAS 1B1 (Butt #BN-215)',
      status: 'Acclimatizing',
    },
  ];

  const riskDistribution = [
    { tier: 'Low Stress (Combat Fit)', count: 986, pct: 79.0, color: 'bg-success text-success-800' },
    { tier: 'Moderate Fatigue (Monitored)', count: 182, pct: 14.6, color: 'bg-primary text-primary-700' },
    { tier: 'Elevated Strain (Rest Advised)', count: 62, pct: 5.0, color: 'bg-accent text-accent-800' },
    { tier: 'Critical Risk (Immediate Action)', count: 18, pct: 1.4, color: 'bg-danger text-danger-700' },
  ];

  const reportsList = [
    { title: 'Formation Combat Readiness Dossier - Week 36', date: 'Today, 06:00 IST', pages: '18 Pages', type: 'Confidential PDF', size: '2.4 MB' },
    { title: 'Armory Kote Weapon Custody & De-escalation Audit', date: 'Yesterday, 19:30 IST', pages: '8 Pages', type: 'Cryptographic Log', size: '1.1 MB' },
    { title: 'High Altitude Acclimatization & Fatigue Report', date: '04 Sep 2026', pages: '14 Pages', type: 'Medical Evaluation', size: '3.8 MB' },
    { title: 'Unit Stress Mitigation & Stand-Down Rotation Order', date: '01 Sep 2026', pages: '6 Pages', type: 'Command Directive', size: '890 KB' },
  ];

  return (
    <div className="space-y-6">
      {/* SECTION 1: DASHBOARD OVERVIEW & HERO BANNER */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-accent-50 text-accent-700 border border-accent-200 shadow-xs">
                Formation Tactical Command Console &bull; Section 1: Overview
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                &bull; HRMS Unique ID: <span className="text-accent-700 font-bold">{user?.uid || 'UID-CMD-005'}</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">
                &bull; Regimental: <span className="text-gray-900 font-bold">{user?.regimental_number || 'ARMY-2007-8005'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Salute, {user?.full_name || 'Brig. Santosh Babu'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed font-medium">
              Synchronized HRMS Tactical Command Center. 7-section operational command dashboard: real-time readiness index, force workforce telemetry, armory accountability, AI tactical directives, and exportable headquarters reports.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 text-accent-700 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync HRMS'}</span>
            </button>
            <button
              onClick={handleBroadcast}
              className="px-4 py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-extrabold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all cursor-pointer"
            >
              <Zap className="w-4 h-4 text-accent" />
              <span>{broadcastSent ? 'Advisory Transmitted!' : 'Broadcast Advisory'}</span>
            </button>
          </div>
        </div>

        {/* 7 Section Quick Navigation Pills */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'all', label: 'All 7 Sections' },
            { id: 'overview', label: '1. Overview' },
            { id: 'readiness', label: '2. Readiness Index' },
            { id: 'workforce', label: '3. Workforce Analytics' },
            { id: 'risk', label: '4. Risk Distribution' },
            { id: 'recommendations', label: '5. AI Recommendations' },
            { id: 'comparison', label: '6. Unit Comparison' },
            { id: 'reports', label: '7. Reports' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveSection(tab.id as any);
                if (tab.id !== 'all') {
                  const el = document.getElementById(`commander-${tab.id}`);
                  el?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeSection === tab.id
                  ? 'bg-secondary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-gray-900 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1 (METRICS) & SECTION 2: READINESS INDEX */}
      {(activeSection === 'all' || activeSection === 'overview' || activeSection === 'readiness') && (
        <section id="commander-readiness" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
              <Shield className="w-4 h-4 text-accent-700" />
              <span>Section 1 &amp; 2 &bull; Formation Overview &amp; Combat Readiness Index</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-success-50 text-success border border-success-200">
              DIVISION COMBAT GRADE A
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {formationStats.map((m) => {
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
                    <TrendingUp className="w-3.5 h-3.5 text-accent-700" />
                    <span>{m.sub}</span>
                  </p>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* SECTION 3: WORKFORCE ANALYTICS */}
      {(activeSection === 'all' || activeSection === 'workforce') && (
        <section id="commander-workforce" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
              <Users className="w-4 h-4 text-secondary" />
              <span>Section 3 &bull; Workforce Analytics &amp; Duty Shift Rosters</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-secondary-50 text-secondary border border-secondary-200">
              KOTE ARMORY 98.4% ACCOUNTABLE
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Active Duty Shift Rosters & Armory Accountability */}
            <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">Live Shift Deployments &amp; Weapon Accountability</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Real-time duty assignments linked with biometric gate verification.</p>
                </div>
                <span className="text-xs font-mono text-slate-400">Total Active: 1,184</span>
              </div>

              <div className="space-y-3">
                {dutyRosters.map((d, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-gray-900">{d.personnel_name}</span>
                        <span className="text-[10px] font-mono text-slate-400 font-bold">{d.duty_id}</span>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-success-50 text-success font-bold border border-success-200">
                          {d.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 font-medium">{d.duty_type} &bull; <strong className="text-gray-800">{d.shift}</strong> &bull; <span className="text-slate-500">{d.location}</span></p>
                      <p className="text-[11px] text-accent-800 font-mono font-semibold">Weapon: {d.weapon_issued}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono text-success font-bold bg-success-50 px-2 py-1 rounded border border-success-200">
                        KOTE VERIFIED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Workforce Summary Dial */}
            <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-secondary text-white shadow-card-soft flex flex-col justify-between">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-300">Force Distribution</span>
                <h3 className="text-xl font-black text-white mt-1">1,248 Total Headcount</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  16 Corps Command Division active roster. Deployed across tactical sectors, QRT posts, and high-altitude checkpoints.
                </p>

                <div className="mt-5 space-y-3 text-xs">
                  <div>
                    <div className="flex justify-between font-bold text-slate-200 mb-1">
                      <span>Frontline Active Deployment</span>
                      <span className="font-mono text-accent">1,184 (94.9%)</span>
                    </div>
                    <div className="w-full bg-secondary-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-accent h-full rounded-full" style={{ width: '94.9%' }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between font-bold text-slate-200 mb-1">
                      <span>Medical Stand-Down / Leave</span>
                      <span className="font-mono text-slate-300">64 (5.1%)</span>
                    </div>
                    <div className="w-full bg-secondary-900 h-2 rounded-full overflow-hidden">
                      <div className="bg-primary-400 h-full rounded-full" style={{ width: '5.1%' }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-secondary-800 flex items-center justify-between text-xs text-slate-300">
                <span>Armory Custody Status</span>
                <span className="text-accent font-mono font-bold">100% In-Kote Accounted</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: RISK DISTRIBUTION */}
      {(activeSection === 'all' || activeSection === 'risk') && (
        <section id="commander-risk" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-accent-700" />
              <span>Section 4 &bull; Force-Wide Psychological &amp; Fatigue Risk Distribution</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-accent-50 text-accent-700 border border-accent-200">
              AI INFERENCE POPULATION 1,248
            </span>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {riskDistribution.map((item, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">{item.tier}</span>
                    <span className="text-xs font-mono font-black text-gray-900">{item.pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.pct}%` }} />
                  </div>
                  <p className="text-xs text-slate-500 font-mono font-semibold">
                    {item.count} Troops
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 p-4 rounded-2xl bg-accent-50/50 border border-accent-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-accent-900 font-medium">
                <Sparkles className="w-4 h-4 text-accent-700 shrink-0" />
                <span>Threshold Alert: 18 personnel in High Altitude Guard are in Critical Risk tier due to continuous 6-day exposure without decompression.</span>
              </div>
              <button
                onClick={() => {
                  const el = document.getElementById('commander-recommendations');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="shrink-0 font-bold text-accent-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                <span>View Directives</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: AI OPERATIONAL RECOMMENDATIONS */}
      {(activeSection === 'all' || activeSection === 'recommendations') && (
        <section id="commander-recommendations" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              <span>Section 5 &bull; AI Operational Recommendations &amp; Tactical Directives</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-primary-50 text-primary border border-primary-200">
              COMMAND AI ENGINE v3.1
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent-50 text-accent-700 border border-accent-200">
                    High Priority
                  </span>
                  <Clock className="w-4 h-4 text-accent" />
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">Mandate High-Altitude Battalion Rotation</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  Troops in High Altitude Guard have reached 6 consecutive duty days. Auto-rotation schedule recommended for tomorrow morning to prevent hypoxia fatigue.
                </p>
              </div>
              <button
                onClick={() => alert('Command Directive: High Altitude Guard rotation orders initiated.')}
                className="mt-4 w-full py-2.5 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
              >
                Issue Stand-Down Order
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary-50 text-secondary border border-secondary-200">
                    Patrol Adjustment
                  </span>
                  <Target className="w-4 h-4 text-secondary" />
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">Adjust Night Patrol Interval (Sector 4)</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  Recent circadian dip patterns suggest extending daylight rest by 90 minutes prior to 22:00 reconnaissance patrols to sharpen target acquisition response.
                </p>
              </div>
              <button
                onClick={() => alert('Command Directive: Sector 4 night patrol schedule updated.')}
                className="mt-4 w-full py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
              >
                Approve Shift Shift
              </button>
            </div>

            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-success-50 text-success border border-success-200">
                    Welfare Synergy
                  </span>
                  <CheckCircle2 className="w-4 h-4 text-success" />
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">Synchronize With Chief Welfare Officer</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  Welfare Wing has prepared confidential intervention packages for 4 frontline officers. Coordinate armory retention during non-operational counseling days.
                </p>
              </div>
              <button
                onClick={() => alert('Synchronized with Chief Welfare Officer Priya Sharma.')}
                className="mt-4 w-full py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-extrabold shadow-sm transition-all cursor-pointer"
              >
                Sync with Welfare Wing
              </button>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6: UNIT COMPARISON */}
      {(activeSection === 'all' || activeSection === 'comparison') && (
        <section id="commander-comparison" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
              <Layers className="w-4 h-4 text-secondary" />
              <span>Section 6 &bull; Sub-Unit Readiness &amp; Stress Comparative Matrix</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-success-50 text-success border border-success-200">
              4/4 BATTALIONS ACTIVE
            </span>
          </div>

          <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] uppercase">
                    <th className="py-2.5 px-3">Battalion / Unit</th>
                    <th className="py-2.5 px-3">Deployed Strength</th>
                    <th className="py-2.5 px-3">Readiness Index</th>
                    <th className="py-2.5 px-3">Elevated Stress %</th>
                    <th className="py-2.5 px-3">Armory In-Kote</th>
                    <th className="py-2.5 px-3 text-right">Combat Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subUnits.map((u, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-3 font-extrabold text-gray-900">{u.unit}</td>
                      <td className="py-3.5 px-3 font-mono text-gray-700">{u.strength} Troops</td>
                      <td className="py-3.5 px-3">
                        <span className="font-mono font-black text-gray-900">{u.readiness}%</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <span className={`font-mono font-bold ${u.stress > 25 ? 'text-accent-700' : 'text-success'}`}>
                          {u.stress}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-slate-600">{u.armorySecured}</td>
                      <td className="py-3.5 px-3 text-right">
                        <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full bg-success-50 text-success border border-success-200">
                          {u.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 7: REPORTS */}
      {(activeSection === 'all' || activeSection === 'reports') && (
        <section id="commander-reports" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary" />
              <span>Section 7 &bull; Official Command Reports &amp; Headquarters Dossiers</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-primary-50 text-primary border border-primary-200">
              CLASSIFIED DEFENSE DOSSIERS
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reportsList.map((r, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-soft flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {r.type}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">{r.size}</span>
                  </div>
                  <h4 className="font-extrabold text-xs text-gray-900">{r.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">Generated: {r.date} &bull; {r.pages}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => alert(`Downloading official dossier: ${r.title}`)}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                    title="Download Report"
                  >
                    <Download className="w-4 h-4 text-primary" />
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
                    title="Print Document"
                  >
                    <Printer className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default CommanderDashboard;
