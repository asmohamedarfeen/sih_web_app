import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  Flame,
} from 'lucide-react';
import { analyticsService, AnalyticsOverview } from '../../services/analyticsService';

export const AnalyticsPage: React.FC = () => {
  const [data, setData] = useState<AnalyticsOverview | null>(null);

  useEffect(() => {
    analyticsService.getOverview().then(setData).catch(console.error);
  }, []);

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-secondary-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-secondary-50 text-secondary-700 border border-secondary-200 shadow-sm">
                Strategic Intelligence
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">&bull; Multi-Dimensional Analytics</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Analytics Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Formation-wide stress heatmaps, 7-day longitudinal trends, and operational workload correlation matrices.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Trends & Heatmaps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* 7-Day Trend Chart Representation */}
        <div className="lg:col-span-7 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-secondary" />
              <span>7-Day Formation Stress Trend</span>
            </h2>
            <span className="text-xs font-mono font-bold text-secondary-700">Index: 88.4%</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-4">
            {data?.stress_trend_7_days?.map((d) => (
              <div key={d.day} className="text-center space-y-2">
                <div className="h-32 bg-slate-50 rounded-2xl p-1.5 flex flex-col justify-end border border-slate-100">
                  <div
                    className="w-full bg-gradient-to-t from-secondary to-primary rounded-xl transition-all duration-500"
                    style={{ height: `${(d.avg_stress / 70) * 100}%` }}
                  />
                </div>
                <div className="text-[10px] font-extrabold text-gray-700 font-mono">{d.day}</div>
                <div className="text-[10px] font-mono font-bold text-secondary">{d.avg_stress}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Unit Heatmaps */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider flex items-center gap-2">
              <Flame className="w-4 h-4 text-danger" />
              <span>Unit Stress Heatmaps</span>
            </h2>
          </div>

          <div className="space-y-3">
            {data?.unit_heatmaps?.map((u) => (
              <div key={u.unit} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h4 className="font-extrabold text-xs text-gray-900">{u.unit}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{u.headcount} Personnel Monitored</p>
                </div>
                <div className="text-right">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-black border uppercase ${
                    u.burnout_risk === 'HIGH' ? 'bg-danger-100 text-danger-700 border-danger-200' : 'bg-warning-100 text-warning-700 border-warning-200'
                  }`}>
                    {u.burnout_risk}
                  </span>
                  <div className="font-mono font-black text-xs text-gray-800 mt-1">{u.stress_score}/100</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
