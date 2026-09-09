import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { alertService, AlertItem } from '../../services/alertService';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const data = await alertService.getAlerts();
      setAlerts(data);
    } catch (err) {
      console.error('Failed to load alerts:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleAcknowledge = async (id: number) => {
    try {
      await alertService.acknowledgeAlert(id);
      fetchAlerts();
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-danger-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-danger-50 text-danger-700 border border-danger-200 shadow-sm">
                Tactical Alert Matrix
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">&bull; High-Risk Watchlist Escalations</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              Alert Management Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Real-time physiological alerts, consecutive duty warnings, and burnout escalation flags requiring command outreach.
            </p>
          </div>

          <button
            onClick={fetchAlerts}
            className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-2 transition-all cursor-pointer shadow-sm self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 text-danger ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* Alerts Feed */}
      <div className="space-y-3.5">
        {alerts.map((a) => (
          <div
            key={a.id}
            className={`p-5 rounded-3xl bg-white border ${
              a.is_acknowledged ? 'border-slate-200 opacity-75' : 'border-danger-200 shadow-card-soft'
            } flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all`}
          >
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                  a.severity === 'CRITICAL' ? 'bg-danger-100 text-danger-800 border-danger-300' : 'bg-warning-100 text-warning-800 border-warning-300'
                }`}>
                  {a.severity}
                </span>
                <span className="font-extrabold text-sm text-gray-900">{a.personnel_name}</span>
                <span className="text-xs font-mono text-slate-400 font-bold">{a.personnel_uid}</span>
              </div>
              <p className="text-xs text-gray-700 font-semibold">{a.trigger_reason}</p>
              <p className="text-xs text-slate-500 font-medium">Recommendation: {a.recommendation}</p>
            </div>

            <div className="shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
              {a.is_acknowledged ? (
                <span className="text-[10px] font-mono text-success bg-success-50 px-2.5 py-1 rounded-full border border-success-200 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Acknowledged
                </span>
              ) : (
                <button
                  onClick={() => handleAcknowledge(a.id)}
                  className="px-4 py-2 rounded-xl bg-danger hover:bg-danger-600 text-white text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Acknowledge Alert
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPage;
