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
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { dashboardService, CommanderDashboardData } from '../../services/dashboardService';

export const CommanderDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<CommanderDashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  const formationStats = [
    {
      title: 'Formation Combat Readiness',
      value: `${data?.metrics?.unit_readiness_index || 94.2}%`,
      sub: 'Optimal Range (>85%)',
      icon: Shield,
      color: 'text-accent-700',
      bg: 'bg-accent-50 border-accent-200'
    },
    {
      title: 'Command Formation Strength',
      value: `${data?.metrics?.total_command_strength || 1248} Personnel`,
      sub: `${data?.metrics?.active_deployed_strength || 1184} Active Deployed`,
      icon: Users,
      color: 'text-secondary',
      bg: 'bg-secondary-50 border-secondary-200'
    },
    {
      title: 'SHAPE-1 Deployable Readiness',
      value: `${data?.metrics?.shape_1_deployable_pct || 94.8}%`,
      sub: 'Medical Category Clearance',
      icon: Activity,
      color: 'text-success',
      bg: 'bg-success-50 border-success-200'
    },
    {
      title: 'Tactical Stress Alerts',
      value: `${data?.metrics?.high_stress_alerts || 4} Critical`,
      sub: 'Kote Weapons Secured: ' + (data?.metrics?.weapons_secured_in_kote || '98.4%'),
      icon: AlertTriangle,
      color: 'text-danger',
      bg: 'bg-danger-50 border-danger-200'
    },
  ];

  const subUnits = data?.formation_units || [
    { unit: 'Rapid Action Battalion 1', strength: 420, readiness: 96.2, status: 'Combat Ready' },
    { unit: 'High Altitude Guard', strength: 280, readiness: 91.5, status: 'Acclimatized' },
    { unit: 'Field Artillery 3rd Bn', strength: 310, readiness: 95.0, status: 'Combat Ready' },
    { unit: 'Signals & Telemetry Wing', strength: 238, readiness: 97.4, status: 'Operational' }
  ];

  const dutyRosters = data?.active_duty_rosters || [
    {
      duty_id: 'DT-8801',
      personnel_name: 'Major Alex Morgan',
      duty_type: 'QRT Standby Lead',
      shift: 'Morning (06:00 - 14:00)',
      location: 'Sector 4 Command Post',
      weapon_issued: '5.56mm SIG Sauer 716 (Butt #BN-042)',
      status: 'On Duty'
    },
    {
      duty_id: 'DT-8802',
      personnel_name: 'Captain Sarah Connor',
      duty_type: 'Perimeter Surveillance',
      shift: 'Afternoon (14:00 - 22:00)',
      location: 'Operations Control Room',
      weapon_issued: '9mm Glock 17 (Butt #BN-108)',
      status: 'Scheduled'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-accent-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-accent-50 text-accent-700 border border-accent-200 shadow-sm">
                Formation Tactical Command Console
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                &bull; HRMS Unique ID: <span className="text-accent-700 font-bold">{user?.uid || 'UID-CMD-005'}</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">
                &bull; Regimental: <span className="text-gray-900 font-bold">{user?.regimental_number || 'ARMY-2007-8005'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Salute, {user?.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed font-medium">
              Synchronized HRMS Tactical Command Center. Real-time unit readiness telemetry, duty rosters, armory custody, and mission burnout mitigation indicators.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-accent-700 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync HRMS'}</span>
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-accent hover:bg-accent-600 text-gray-900 text-xs font-black shadow-lg shadow-accent/25 flex items-center gap-2 transition-all cursor-pointer">
              <Zap className="w-4 h-4" />
              <span>Broadcast Advisory</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
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

      {/* Sub-Units & Duty Rosters Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Sub-Unit Readiness Table */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
                <Target className="w-4 h-4 text-accent-700" />
                <span>HRMS Sub-Unit Readiness Matrix</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Readiness index across battalions under {user?.unit || '16 Corps Division'}.</p>
            </div>
            <span className="text-[10px] font-mono text-success bg-success-50 px-2.5 py-1 rounded-full border border-success-200 font-bold">
              ALL SECTORS GREEN
            </span>
          </div>

          <div className="space-y-3">
            {subUnits.map((u, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">{u.unit}</h3>
                  <p className="text-xs text-slate-500 font-medium">Strength: <span className="font-bold text-gray-800">{u.strength} Personnel</span> &bull; Status: <span className="text-success font-bold">{u.status}</span></p>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono font-bold text-slate-400 uppercase">Readiness</div>
                  <div className="text-lg font-black text-gray-900 font-mono">{u.readiness}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Duty Shift Rosters */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em]">
                  Active Duty Rosters & Armory
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Live shift deployments & weapon accountability.</p>
              </div>
              <Shield className="w-4 h-4 text-accent-700" />
            </div>

            <div className="space-y-3">
              {dutyRosters.map((d, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-xs text-gray-900">{d.personnel_name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-success-50 text-success font-bold border border-success-200">
                      {d.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{d.duty_type} &bull; <span className="font-bold text-gray-800">{d.shift}</span></p>
                  <p className="text-[10px] text-slate-500 font-mono">{d.location}</p>
                  <p className="text-[10px] text-accent-800 font-mono font-semibold">Weapon: {d.weapon_issued}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-accent-50 border border-accent-200 text-xs text-accent-900 flex items-start gap-3">
            <Brain className="w-4 h-4 text-accent-700 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed font-medium">
              Commander Advisory: Personnel in High Altitude Guard have reached 6 consecutive duty days. Auto-rotation schedule recommended for tomorrow.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommanderDashboard;
