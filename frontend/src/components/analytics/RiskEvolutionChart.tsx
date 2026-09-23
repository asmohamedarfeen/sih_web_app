import React, { useState } from 'react';
import {
  TrendingUp,
  Activity,
  Flag,
} from 'lucide-react';

export interface MilestoneEvent {
  day: number;
  label: string;
  score: number;
  riskTier: 'Critical' | 'High' | 'Moderate' | 'Nominal';
  operationalEvent: string;
  mitigationAvailable?: string;
}

interface RiskEvolutionChartProps {
  personnelName?: string;
  windowDays?: 30 | 60 | 90;
}

export const RiskEvolutionChart: React.FC<RiskEvolutionChartProps> = ({
  personnelName = 'Naik Rohit Sharma',
  windowDays = 60,
}) => {
  const [selectedWindow, setSelectedWindow] = useState<30 | 60 | 90>(windowDays);
  const [activeMilestoneIndex, setActiveMilestoneIndex] = useState<number>(3);

  const timeline60: MilestoneEvent[] = [
    {
      day: 0,
      label: 'Day 0',
      score: 34,
      riskTier: 'Nominal',
      operationalEvent: 'Deployment Arrival in High-Altitude Sector',
      mitigationAvailable: 'Standard acclimation rest protocol completed',
    },
    {
      day: 14,
      label: 'Day 14',
      score: 52,
      riskTier: 'Moderate',
      operationalEvent: 'Shifted to High-Tempo Night Patrol Watch',
      mitigationAvailable: 'Consecutive night watches reach 6 cycles',
    },
    {
      day: 28,
      label: 'Day 28',
      score: 68,
      riskTier: 'High',
      operationalEvent: 'Rotational Casual Leave Request Deferred (Emergency Posture)',
      mitigationAvailable: 'Cognitive strain accelerates due to denied reset',
    },
    {
      day: 45,
      label: 'Day 45 (Current)',
      score: 86,
      riskTier: 'Critical',
      operationalEvent: 'Acute Fatigue Surge (+4.8 pts/day Velocity)',
      mitigationAvailable: 'Requires immediate 7-day R&R Stand-down directive',
    },
    {
      day: 60,
      label: 'Day 60 (Projected)',
      score: 54,
      riskTier: 'Moderate',
      operationalEvent: 'Projected Recovery Following Command Furlough Protocol',
      mitigationAvailable: 'Evaluated under Closed-Loop Recovery model',
    },
  ];

  const activeMilestone = timeline60[activeMilestoneIndex];

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Critical':
        return 'text-rose-600 bg-rose-50 border-rose-200';
      case 'High':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Moderate':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    }
  };

  return (
    <div className="p-5 sm:p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl space-y-4 h-full flex flex-col justify-between">
      {/* Header with Timeline Scope Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 shrink-0">
              Longitudinal Intelligence
            </span>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider whitespace-nowrap">
              &bull; 60-Day Trajectory
            </span>
          </div>
          <h3 className="text-base font-black text-white mt-1 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Risk Evolution Timeline: {personnelName}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
            Multi-week stress accumulation tracking tied to frontline duty rotations.
          </p>
        </div>

        {/* 30 / 60 / 90 Days Toggle */}
        <div className="flex items-center gap-1.5 p-1 bg-white/5 border border-white/10 rounded-2xl shrink-0 self-start sm:self-auto">
          {([30, 60, 90] as const).map((days) => (
            <button
              key={days}
              onClick={() => setSelectedWindow(days)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedWindow === days
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {days} Days
            </button>
          ))}
        </div>
      </div>

      {/* Visual Timeline Bar & Stepper */}
      <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-bold text-slate-300">Operational Milestone Stepper</span>
          </span>
          <span className="font-mono text-[10px] text-amber-400/90">Click milestone to inspect</span>
        </div>

        {/* Horizontal milestones (5 Tactical Stage Blocks) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
          {timeline60.map((item, idx) => {
            const isSelected = activeMilestoneIndex === idx;
            const isCritical = item.riskTier === 'Critical';
            const isCurrent = idx === 3;
            const isProjected = idx === 4;

            // Short readable titles for tight buttons
            const milestoneShortNames = [
              'Frontier Arrival',
              'High-Altitude',
              'Rotational Duty',
              'Acute Fatigue',
              'Projected Recov.',
            ];

            return (
              <button
                key={item.day}
                onClick={() => setActiveMilestoneIndex(idx)}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-white/15 border-amber-400 ring-2 ring-amber-400/30 shadow-lg'
                    : 'bg-white/5 hover:bg-white/10 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className="text-[11px] font-black text-white font-mono">
                    Day {item.day}
                  </span>
                  {isCurrent && (
                    <span className="text-[7px] font-black uppercase px-1 py-0.2 rounded bg-rose-600 text-white animate-pulse">
                      Now
                    </span>
                  )}
                  {isProjected && (
                    <span className="text-[7px] font-black uppercase px-1 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                      Proj
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-1 my-1">
                  <span className={`text-base font-black font-mono tracking-tight ${isCritical ? 'text-rose-400' : 'text-white'}`}>
                    {item.score}%
                  </span>
                  <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded tracking-wide shrink-0 ${
                    item.riskTier === 'Critical'
                      ? 'bg-rose-950 text-rose-300 border border-rose-800/60'
                      : item.riskTier === 'High'
                      ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                      : item.riskTier === 'Moderate'
                      ? 'bg-blue-950 text-blue-300 border border-blue-800/60'
                      : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                  }`}>
                    {item.riskTier === 'Critical' ? 'CRIT' : item.riskTier === 'Moderate' ? 'MOD' : item.riskTier}
                  </span>
                </div>

                <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">
                  {milestoneShortNames[idx] || item.operationalEvent}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Detail Inspector Card for Active Milestone */}
      {activeMilestone && (
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-black uppercase text-amber-300">
                Milestone Detail: {activeMilestone.label}
              </span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${getTierColor(activeMilestone.riskTier)}`}>
              {activeMilestone.riskTier} Risk
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Operational Trigger</span>
              <p className="text-slate-200 font-medium mt-0.5">{activeMilestone.operationalEvent}</p>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase">Decision Protocol</span>
              <p className="text-amber-200 font-medium mt-0.5">{activeMilestone.mitigationAvailable}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RiskEvolutionChart;
