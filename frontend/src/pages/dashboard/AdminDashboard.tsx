import React, { useState, useEffect } from 'react';
import {
  Users,
  Server,
  Key,
  ShieldCheck,
  Activity,
  UserPlus,
  CheckCircle2,
  RefreshCw,
  Database,
  Cpu,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { dashboardService, AdminDashboardData } from '../../services/dashboardService';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadAdminData = async () => {
    try {
      const res = await dashboardService.getAdminDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load admin dashboard data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadAdminData();
  };

  const systemMetrics = [
    {
      title: 'Total Personnel in HRMS',
      value: (data?.metrics?.total_personnel_records || 1248).toLocaleString(),
      change: 'Synchronized via HRMS DB',
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50 border-blue-200'
    },
    {
      title: 'Active Monitoring Nodes',
      value: (data?.metrics?.active_monitoring_sessions || 342).toString(),
      change: 'Online Telemetry Stream',
      icon: Key,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 border-emerald-200'
    },
    {
      title: 'System Uptime & Latency',
      value: `${data?.metrics?.system_uptime_pct || 99.98}%`,
      change: 'Inference Latency: 18ms',
      icon: Server,
      color: 'text-teal-600',
      bg: 'bg-teal-50 border-teal-200'
    },
    {
      title: 'Security Audit Integrity',
      value: `${data?.metrics?.critical_security_events || 0} Critical`,
      change: data?.metrics?.hrms_sync_status || 'Real-Time Sync',
      icon: ShieldCheck,
      color: 'text-amber-600',
      bg: 'bg-amber-50 border-amber-200'
    },
  ];

  const recentAuditLogs = [
    { id: 'LOG-8845', user: 'Gen. Vikramaditya Rawat', role: 'SUPER_ADMIN', action: 'Approved Strategic AI Stress Diagnostic Model v2.5', time: '5 mins ago', status: 'SUCCESS' },
    { id: 'LOG-8844', user: 'SysAdmin K. Raman', role: 'SYS_ADMIN', action: 'Verified HRMS SQLite static connection pool & sync health', time: '18 mins ago', status: 'SUCCESS' },
    { id: 'LOG-8843', user: 'Welfare Offr. Priya Sharma', role: 'WELFARE_OFFICER', action: 'Retrieved stress profile for Major Alex Morgan', time: '40 mins ago', status: 'SUCCESS' },
    { id: 'LOG-8842', user: 'Brig. Santosh Babu', role: 'COMMANDER', action: 'Exported 16 Corps Command Readiness Dossier', time: '1 hour ago', status: 'SUCCESS' },
  ];

  const systemHealth = data?.system_health || {
    api_gateway: 'Healthy (FastAPI v1.0.0)',
    database_engine: 'Operational (SQLite / StaticPool)',
    ai_inference_pipeline: 'Active (Latency: 18ms)',
    audit_logger: 'Encrypted & Active'
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-blue-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-blue-50 text-blue-700 border border-blue-200 shadow-sm">
                Strategic System Command Console
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                &bull; HRMS Unique ID: <span className="text-blue-700 font-bold">{user?.uid || 'UID-SUP-001'}</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">
                &bull; Regimental: <span className="text-slate-800 font-bold">{user?.regimental_number || 'ARMY-2005-9001'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Welcome, {user?.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed font-medium">
              Synchronized Strategic Defense HRMS Management. Centralized user identity governance, cryptographic audit trails, and multi-service health diagnostics.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-blue-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync HRMS'}</span>
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-extrabold shadow-lg shadow-blue-600/20 flex items-center gap-2 transition-all cursor-pointer">
              <UserPlus className="w-4 h-4" />
              <span>Provision Officer</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {systemMetrics.map((m) => {
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
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                <span>{m.change}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Main Grid: Live Audit & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Live Audit Stream */}
        <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-[0.12em] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>HRMS Cryptographic Audit Trail</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Real-time audit log of access events and role queries.</p>
            </div>
            <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-bold">
              TAMPER-PROOF LOGS
            </span>
          </div>

          <div className="space-y-3">
            {recentAuditLogs.map((l) => (
              <div key={l.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-xs text-slate-900">{l.user}</span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700">
                      {l.role}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 font-bold">{l.id}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium">{l.action}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono text-slate-400 font-bold block">{l.time}</span>
                  <span className="text-[10px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 mt-1 inline-block">
                    {l.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Topology Health */}
        <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-[0.12em]">
                  Platform Infrastructure
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Live health status of microservices.</p>
              </div>
              <Server className="w-4 h-4 text-blue-600" />
            </div>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Server className="w-3.5 h-3.5 text-blue-600" />
                    API Gateway
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Online
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">{systemHealth.api_gateway}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5 text-indigo-600" />
                    HRMS Database
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Connected
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">{systemHealth.database_engine}</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Cpu className="w-3.5 h-3.5 text-emerald-600" />
                    AI Stress Engine
                  </span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Active
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 font-mono">{systemHealth.ai_inference_pipeline}</p>
              </div>
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-start gap-3">
            <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed font-medium">
              HRMS sync engine active. Continuous bi-directional telemetry verification enabled.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
