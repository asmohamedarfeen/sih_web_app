import React, { useState, useEffect } from 'react';
import {
  Users,
  CalendarCheck2,
  AlertCircle,
  FileSpreadsheet,
  Plane,
  Clock,
  Briefcase,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { dashboardService, HRDashboardData } from '../../services/dashboardService';

export const HRDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const [data, setData] = useState<HRDashboardData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadHRData = async () => {
    try {
      const res = await dashboardService.getHRDashboard();
      setData(res);
    } catch (err) {
      console.error('Failed to load HR dashboard data:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadHRData();
  }, [user]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadHRData();
  };

  const hrStats = [
    {
      title: 'Total Active Workforce',
      value: (data?.metrics?.total_workforce || 1248).toLocaleString(),
      sub: `${data?.metrics?.present_today_pct || 96.4}% Present Today`,
      icon: Users,
      color: 'text-secondary',
      bg: 'bg-secondary-50 border-secondary-200'
    },
    {
      title: 'Personnel On Authorized Leave',
      value: (data?.metrics?.on_authorized_leave || 42).toString(),
      sub: `${data?.metrics?.pending_leave_requests || 3} Pending Approvals`,
      icon: CalendarCheck2,
      color: 'text-primary',
      bg: 'bg-primary-50 border-primary-200'
    },
    {
      title: 'Transfers In Pipeline',
      value: `${data?.metrics?.transfers_in_pipeline || 18} Orders`,
      sub: 'Posting board cycle active',
      icon: Plane,
      color: 'text-accent-700',
      bg: 'bg-accent-50 border-accent-200'
    },
    {
      title: 'APAR Annual Compliance',
      value: `${data?.metrics?.apar_compliance_pct || 98.2}%`,
      sub: 'Dossier appraisals verified',
      icon: CheckCircle,
      color: 'text-success',
      bg: 'bg-success-50 border-success-200'
    },
  ];

  const pendingLeaves = data?.pending_leaves || [
    {
      id: 'LV-2026-441',
      personnel_name: 'Subedar Gurpreet Singh',
      rank: 'Subedar',
      leave_type: 'Casual Leave (Compassionate)',
      start_date: '2026-09-08',
      end_date: '2026-09-13',
      days: 5,
      reason: 'Family medical obligation and support',
      status: 'Pending HR Approval'
    },
    {
      id: 'LV-2026-439',
      personnel_name: 'Major Alex Morgan',
      rank: 'Major',
      leave_type: 'Annual Reciprocal Leave',
      start_date: '2026-10-01',
      end_date: '2026-10-10',
      days: 10,
      reason: 'Post-tenure decompression leave',
      status: 'Approved by Commander'
    }
  ];

  const cadreDistribution = data?.cadre_distribution || [
    { cadre: 'Commissioned Officers', count: 112, percentage: 9.0 },
    { cadre: 'Junior Commissioned Officers (JCO)', count: 284, percentage: 22.7 },
    { cadre: 'Other Ranks (NCO / Sepoy)', count: 768, percentage: 61.5 },
    { cadre: 'Specialist Technical Cadre', count: 84, percentage: 6.8 }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-secondary-50 text-secondary-700 border border-secondary-200 shadow-sm">
                Personnel & Records Directorate
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                &bull; HRMS Unique ID: <span className="text-secondary-700 font-bold">{user?.uid || 'UID-HRO-004B'}</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">
                &bull; Regimental: <span className="text-gray-900 font-bold">{user?.regimental_number || 'CRPF-2008-8004B'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Welcome, {user?.full_name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed font-medium">
              Synchronized HRMS Workforce Management. Live leave application pipeline, posting distributions, attendance rosters, and APAR compliance records.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 text-secondary ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Syncing...' : 'Sync HRMS'}</span>
            </button>
            <button className="px-4 py-2.5 rounded-xl bg-secondary hover:bg-secondary-600 text-white text-xs font-black shadow-lg shadow-secondary/20 flex items-center gap-2 transition-all cursor-pointer">
              <FileSpreadsheet className="w-4 h-4" />
              <span>Generate Report</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {hrStats.map((m) => {
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
                <Clock className="w-3.5 h-3.5 text-secondary" />
                <span>{m.sub}</span>
              </p>
            </div>
          );
        })}
      </div>

      {/* Tables Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Pending Leaves Pipeline */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-secondary" />
                <span>HRMS Leave Applications & Rest Pipeline</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">Leave applications requiring administrative verification.</p>
            </div>
            <span className="text-[10px] font-mono text-secondary-700 bg-secondary-50 px-2.5 py-1 rounded-full border border-secondary-200 font-bold">
              {pendingLeaves.length} PENDING
            </span>
          </div>

          <div className="space-y-3">
            {pendingLeaves.map((l) => (
              <div key={l.id} className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-gray-900">{l.personnel_name}</span>
                    <span className="text-xs font-mono text-slate-400 font-bold">{l.id}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary-100 text-secondary-800 font-bold">
                      {l.days} Days
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 font-medium">{l.rank} &bull; <span className="font-semibold text-gray-800">{l.leave_type}</span></p>
                  <p className="text-xs text-slate-500 font-medium">Reason: {l.reason}</p>
                </div>
                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-xl border ${
                    l.status.includes('Approved')
                      ? 'bg-success-50 text-success-700 border-success-200'
                      : 'bg-warning-50 text-warning-700 border-warning-200'
                  }`}>
                    {l.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cadre Distribution */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em]">
                  Force Cadre Distribution
                </h2>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">Strength allocation across rank cadres.</p>
              </div>
              <Briefcase className="w-4 h-4 text-secondary" />
            </div>

            <div className="space-y-3">
              {cadreDistribution.map((c, idx) => (
                <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-gray-800">{c.cadre}</span>
                    <span className="text-xs font-mono font-black text-secondary-700">{c.count} ({c.percentage}%)</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-secondary h-1.5 rounded-full" style={{ width: `${c.percentage}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 p-4 rounded-2xl bg-secondary-50 border border-secondary-200 text-xs text-secondary-900 flex items-start gap-3">
            <Users className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed font-medium">
              HR Advisory: 18 rotation transfers submitted for upcoming quarterly posting board review.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
