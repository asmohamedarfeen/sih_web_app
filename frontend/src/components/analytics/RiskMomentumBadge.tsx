import React from 'react';
import {
  TrendingDown,
  Activity,
  Zap,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export interface RiskMomentumData {
  current_stress: number;
  velocity_pts_per_day: number;
  acceleration_pts_per_day2: number;
  momentum_state: 'ACUTE_SURGE' | 'ACCELERATING' | 'STABLE' | 'STABILIZING' | 'RECOVERING';
  momentum_label: string;
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  trajectory_arrow: string;
  color: string;
  days_to_critical_threshold?: number | null;
  critical_warning?: string;
  decision_support?: {
    action_type: string;
    urgency: string;
    headline: string;
    recommended_action: string;
    action_button_label: string;
    action_code: string;
    policy_mitigation: string;
  };
}

interface RiskMomentumBadgeProps {
  momentum?: RiskMomentumData;
  compact?: boolean;
  onActionClick?: (actionCode: string) => void;
}

export const RiskMomentumBadge: React.FC<RiskMomentumBadgeProps> = ({
  momentum,
  compact = false,
  onActionClick,
}) => {
  if (!momentum) return null;

  const isSurging = momentum.momentum_state === 'ACUTE_SURGE';
  const isAccelerating = momentum.momentum_state === 'ACCELERATING';
  const isRecovering = momentum.momentum_state === 'RECOVERING' || momentum.momentum_state === 'STABILIZING';

  const badgeBg = isSurging
    ? 'bg-rose-950/70 border-rose-500/50 text-rose-300'
    : isAccelerating
    ? 'bg-amber-950/70 border-amber-500/50 text-amber-300'
    : isRecovering
    ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300'
    : 'bg-slate-800 border-slate-700 text-slate-300';

  if (compact) {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-black border font-mono ${badgeBg}`}
        title={`Stress Velocity: ${momentum.velocity_pts_per_day > 0 ? '+' : ''}${momentum.velocity_pts_per_day} pts/day`}
      >
        <span>{momentum.trajectory_arrow}</span>
        <span>
          {momentum.velocity_pts_per_day > 0 ? `+${momentum.velocity_pts_per_day}` : momentum.velocity_pts_per_day}
        </span>
        <span className="text-[10px] font-sans font-normal opacity-80">pts/d</span>
      </div>
    );
  }

  return (
    <div className={`p-4 rounded-2xl border ${badgeBg} space-y-3`}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {isSurging ? (
            <ShieldAlert className="w-5 h-5 text-rose-400 animate-pulse" />
          ) : isRecovering ? (
            <TrendingDown className="w-5 h-5 text-emerald-400" />
          ) : (
            <Activity className="w-5 h-5 text-amber-400" />
          )}
          <div>
            <span className="text-[10px] uppercase font-black tracking-widest opacity-80 block">
              Risk Momentum &bull; d(Stress)/dt
            </span>
            <span className="text-sm font-black tracking-tight">{momentum.momentum_label}</span>
          </div>
        </div>

        <div className="text-right">
          <div className="font-mono text-base font-black flex items-center gap-1 justify-end">
            <span className="text-lg">{momentum.trajectory_arrow}</span>
            <span>{momentum.velocity_pts_per_day > 0 ? `+${momentum.velocity_pts_per_day}` : momentum.velocity_pts_per_day}</span>
            <span className="text-xs font-normal text-slate-400 font-sans">pts/day</span>
          </div>
          {momentum.days_to_critical_threshold !== null && momentum.days_to_critical_threshold !== undefined && (
            <span className="text-[10px] font-mono text-rose-400 font-bold block">
              Critical (85) in {momentum.days_to_critical_threshold} days
            </span>
          )}
        </div>
      </div>

      {/* Action-Oriented Decision Support Directive */}
      {momentum.decision_support && (
        <div className="pt-2.5 border-t border-white/10 space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-extrabold text-white flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Command Directive: {momentum.decision_support.headline}</span>
            </span>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-black/40 text-amber-300">
              {momentum.decision_support.urgency}
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            {momentum.decision_support.recommended_action}
          </p>

          {onActionClick && (
            <button
              onClick={() => onActionClick(momentum.decision_support?.action_code || 'EXECUTE')}
              className={`w-full mt-2 py-2 px-3 rounded-xl font-black text-xs cursor-pointer transition-all flex items-center justify-center gap-2 ${
                isSurging
                  ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md'
                  : 'bg-primary hover:bg-primary-600 text-white'
              }`}
            >
              <span>{momentum.decision_support.action_button_label}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
