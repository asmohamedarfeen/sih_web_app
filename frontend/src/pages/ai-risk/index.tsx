import React, { useState, useEffect } from 'react';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { aiRiskService, EvaluationResult } from '../../services/aiRiskService';

export const AIRiskPage: React.FC = () => {
  const [evaluation, setEvaluation] = useState<EvaluationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const [simForm, setSimForm] = useState({
    personnel_uid: 'UID-EMP-010',
    sleep_hours: 4.5,
    fatigue_level: 8,
    mood_score: 4,
    workload_pressure: 8,
    physical_strain: 7,
    consecutive_duty_days: 6,
  });

  useEffect(() => {
    handleSimulate();
  }, []);

  const handleSimulate = async () => {
    setIsCalculating(true);
    try {
      const res = await aiRiskService.computeRisk(simForm);
      setEvaluation(res.evaluation);
    } catch (err) {
      console.error('Failed to run AI prediction:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-50/70 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-purple-50 text-purple-700 border border-purple-200 shadow-sm">
                Predictive AI Intelligence
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">&bull; Explainable Stress & Burnout Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              AI Risk & Diagnostic Hub
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl font-medium">
              Multi-factor physiological and operational strain inference with explainable trigger factor attribution.
            </p>
          </div>
        </div>
      </div>

      {/* Grid: Simulator & Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Interactive Predictor Slider Form */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4 text-purple-600" />
              <span>Biometric Diagnostic Simulator</span>
            </h2>
            <span className="text-xs font-mono font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full border border-purple-200">
              Live Evaluation
            </span>
          </div>

          <div className="space-y-4 text-xs font-bold text-slate-700">
            <div>
              <div className="flex justify-between mb-1">
                <span>Sleep Duration</span>
                <span className="font-mono text-purple-700">{simForm.sleep_hours} Hours</span>
              </div>
              <input
                type="range"
                min="2.0"
                max="10.0"
                step="0.5"
                value={simForm.sleep_hours}
                onChange={(e) => {
                  setSimForm({ ...simForm, sleep_hours: parseFloat(e.target.value) });
                }}
                className="w-full accent-purple-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Fatigue & Physical Exhaustion</span>
                <span className="font-mono text-rose-600">{simForm.fatigue_level}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={simForm.fatigue_level}
                onChange={(e) => setSimForm({ ...simForm, fatigue_level: parseInt(e.target.value) })}
                className="w-full accent-rose-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Operational Workload Pressure</span>
                <span className="font-mono text-amber-600">{simForm.workload_pressure}/10</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                value={simForm.workload_pressure}
                onChange={(e) => setSimForm({ ...simForm, workload_pressure: parseInt(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Consecutive High-Tempo Shifts</span>
                <span className="font-mono text-blue-700">{simForm.consecutive_duty_days} Days</span>
              </div>
              <input
                type="range"
                min="1"
                max="14"
                value={simForm.consecutive_duty_days}
                onChange={(e) => setSimForm({ ...simForm, consecutive_duty_days: parseInt(e.target.value) })}
                className="w-full accent-blue-600 cursor-pointer"
              />
            </div>

            <button
              onClick={handleSimulate}
              disabled={isCalculating}
              className="w-full mt-2 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black shadow-lg shadow-purple-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isCalculating ? 'Computing Model...' : 'Re-compute AI Diagnostic'}</span>
            </button>
          </div>
        </div>

        {/* Right: AI Output & Explainability */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between space-y-5">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <Brain className="w-4 h-4 text-purple-600" />
                <span>Explainable Diagnostic Result</span>
              </h2>
              <span className="text-[10px] font-mono font-bold text-slate-400">Confidence: 94%</span>
            </div>

            {evaluation && (
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Predicted Stress Index</span>
                    <div className="text-3xl font-black text-slate-900 font-mono">{evaluation.stress_score}<span className="text-xs text-slate-400">/100</span></div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400">Burnout Probability</span>
                    <div className="text-2xl font-black text-rose-600 font-mono">{Math.round(evaluation.burnout_probability * 100)}%</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide mb-2">Primary Risk Drivers:</h3>
                  <div className="space-y-2">
                    {evaluation.primary_triggers.map((t, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between text-xs">
                        <span className="font-bold text-amber-900">{t.factor}</span>
                        <span className="text-[11px] font-mono text-amber-700">{t.metric}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-extrabold text-slate-800 uppercase tracking-wide mb-2">Actionable Guidance:</h3>
                  <div className="space-y-1.5">
                    {evaluation.ai_recommendations.map((r, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default AIRiskPage;
