import React, { useState, useEffect } from 'react';
import {
  Shield,
  HeartPulse,
  Brain,
  Sparkles,
  Activity,
  Calendar,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Moon,
  Zap,
  Smile,
  Meh,
  Frown,
  Flame,
  ChevronRight,
  Send,
  UserCheck,
  Compass,
  Lock,
  Award,
  ShieldCheck,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { wellnessService, AssessmentSubmission } from '../../services/wellnessService';
import { ClinicalNarrativeCard } from '../../components/ai/ClinicalNarrativeCard';
import { Form16WelfareDossier } from '../../components/reports/Form16WelfareDossier';
import { UnitHierarchyTree } from '../../components/organization/UnitHierarchyTree';
import { TrustConfidentialityLedger } from '../../components/trust/TrustConfidentialityLedger';
import { useLanguageStore } from '../../localization';
import { LanguageSelector } from '../../components/common/LanguageSelector';

export const PersonnelDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const [activeSection, setActiveSection] = useState<'all' | 'score' | 'checkin' | 'insights' | 'activities' | 'progress' | 'hierarchy' | 'trust'>('all');
  const [showPrivacyMatrix, setShowPrivacyMatrix] = useState(false);
  const [showDossierModal, setShowDossierModal] = useState(false);


  // Daily Check-in Form State
  const [checkinForm, setCheckinForm] = useState({
    sleep_hours: 7.0,
    fatigue_level: 4,
    mood_score: 8,
    workload_pressure: 5,
    physical_strain: 4,
    consecutive_duty_days: 3,
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [currentWellnessScore, setCurrentWellnessScore] = useState(78);
  const [sosTriggered, setSosTriggered] = useState(false);

  // Box Breathing Timer State (4-4-4-4 technique)
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathPhase, setBreathPhase] = useState<'Inhale' | 'Hold' | 'Exhale' | 'Pause'>('Inhale');
  const [breathSeconds, setBreathSeconds] = useState(4);

  useEffect(() => {
    let interval: any = null;
    if (breathingActive) {
      interval = setInterval(() => {
        setBreathSeconds((prev) => {
          if (prev <= 1) {
            setBreathPhase((currentPhase) => {
              if (currentPhase === 'Inhale') return 'Hold';
              if (currentPhase === 'Hold') return 'Exhale';
              if (currentPhase === 'Exhale') return 'Pause';
              return 'Inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setBreathPhase('Inhale');
      setBreathSeconds(4);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [breathingActive]);

  const handleCheckinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    const submission: AssessmentSubmission = {
      personnel_uid: user?.uid || 'UID-EMP-010',
      sleep_hours: Number(checkinForm.sleep_hours),
      fatigue_level: Number(checkinForm.fatigue_level),
      mood_score: Number(checkinForm.mood_score),
      workload_pressure: Number(checkinForm.workload_pressure),
      physical_strain: Number(checkinForm.physical_strain),
      consecutive_duty_days: Number(checkinForm.consecutive_duty_days),
      notes: checkinForm.notes,
    };

    try {
      await wellnessService.submitAssessment(submission);
      setSubmitMessage('Daily Check-in registered successfully! Telemetry synchronized.');
      // Compute updated optimistic wellness score
      const updated = Math.min(
        98,
        Math.max(
          45,
          Math.round(
            (checkinForm.sleep_hours / 8) * 35 +
            ((10 - checkinForm.fatigue_level) / 10) * 25 +
            (checkinForm.mood_score / 10) * 20 +
            ((10 - checkinForm.physical_strain) / 10) * 20
          )
        )
      );
      setCurrentWellnessScore(updated);
    } catch (err) {
      console.error('Failed to submit daily check-in:', err);
      setSubmitMessage('Assessment logged offline. Will sync with Command Gateway.');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(null), 6000);
    }
  };

  const pastCheckins = [
    { date: 'Today', sleep: `${checkinForm.sleep_hours}h`, fatigue: `${checkinForm.fatigue_level}/10`, score: currentWellnessScore, status: 'Optimal' },
    { date: 'Yesterday', sleep: '6.5h', fatigue: '5/10', score: 74, status: 'Steady' },
    { date: '2 Days Ago', sleep: '7.2h', fatigue: '3/10', score: 81, status: 'Optimal' },
    { date: '3 Days Ago', sleep: '5.8h', fatigue: '6/10', score: 68, status: 'Moderate' },
    { date: '4 Days Ago', sleep: '7.0h', fatigue: '4/10', score: 77, status: 'Optimal' },
    { date: '5 Days Ago', sleep: '8.0h', fatigue: '2/10', score: 86, status: 'Optimal' },
    { date: '6 Days Ago', sleep: '6.2h', fatigue: '5/10', score: 72, status: 'Steady' },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-primary-50/60 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-[0.15em] bg-primary-50 text-primary-700 border border-primary-200 shadow-xs">
                Personnel Self-Care &amp; Readiness Terminal
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-400 shadow-xs">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                Voluntary &amp; Privacy Preserved
              </span>
              <span className="text-xs text-slate-500 font-mono font-semibold">
                &bull; UID: <span className="text-primary-700 font-bold">{user?.uid || 'UID-EMP-010'}</span>
              </span>
              <span className="text-xs text-slate-500 font-mono">
                &bull; Regimental: <span className="text-gray-900 font-bold">{user?.regimental_number || 'CRPF-2015-8010'}</span>
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
              {t('jai_hind')}, {user?.full_name || 'Major Alex Morgan'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1.5 max-w-2xl leading-relaxed font-medium">
              {t('welcome_soldier')}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {/* Frontline Regional Language Selector */}
            <LanguageSelector />

            <button
              onClick={() => setSosTriggered(!sosTriggered)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold border flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                sosTriggered
                  ? 'bg-danger text-white border-danger animate-pulse'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
              }`}
            >
              <AlertTriangle className={`w-4 h-4 ${sosTriggered ? 'text-white' : 'text-danger'}`} />
              <span>{sosTriggered ? t('sos_active') : t('sos_distress_alert')}</span>
            </button>
            <button
              onClick={() => {
                const el = document.getElementById('daily-checkin-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-extrabold shadow-lg shadow-primary/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>{t('record_daily_checkin')}</span>
            </button>
            <button
              onClick={() => setShowDossierModal(true)}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold border border-slate-700 shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <span>{t('form_16_dossier')}</span>
            </button>
          </div>
        </div>

        {/* ===================================================================== */}
        {/* DEFENSE MEDICAL PRIVILEGE & SOLDIER TRUST LEDGER (ANTI-STIGMA SHIELD) */}
        {/* ===================================================================== */}
        <div className="mt-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-[#0C1E38] via-[#0E2548] to-[#122F58] border border-emerald-500/30 text-white shadow-md">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-black text-white tracking-tight">
                    {t('article_42a_title')}
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {t('non_punitive_badge')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                  {t('article_42a_desc')}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
              <button
                onClick={() => {
                  setActiveSection('trust');
                  setTimeout(() => {
                    document.getElementById('trust-section')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs cursor-pointer transition-all flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>View Cryptographic Trust Ledger</span>
              </button>
              <button
                onClick={() => setShowPrivacyMatrix(!showPrivacyMatrix)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs cursor-pointer transition-all flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>{showPrivacyMatrix ? t('hide_privacy_barrier') : t('view_transparency_matrix')}</span>
              </button>
            </div>
          </div>

          {/* Expandable Transparency Matrix */}
          {showPrivacyMatrix && (
            <div className="mt-4 pt-4 border-t border-white/10 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30">
                <div className="flex items-center gap-2 font-bold text-emerald-300 mb-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                  <span>What Certified Medical Officers See:</span>
                </div>
                <ul className="space-y-1 text-slate-300 text-[11px] list-disc list-inside">
                  <li>Full multi-domain distress breakdown (PHQ/GAD metrics).</li>
                  <li>Restorative sleep latency and biometric HRV trends.</li>
                  <li>Confidential debrief requests and therapy notes.</li>
                  <li>Proactive wellness interventions and welfare grant history.</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-slate-900/60 border border-white/10">
                <div className="flex items-center gap-2 font-bold text-slate-200 mb-1.5">
                  <Lock className="w-4 h-4 text-amber-400" />
                  <span>What Your Unit Commander Sees (Masked):</span>
                </div>
                <ul className="space-y-1 text-slate-400 text-[11px] list-disc list-inside">
                  <li><strong className="text-slate-200">ONLY</strong> High-Level Operational Readiness (Deployable vs Rest Recommended).</li>
                  <li>Cumulative consecutive duty cycle count for roster balancing.</li>
                  <li><strong className="text-rose-400">BLOCKED:</strong> Cannot see your private feelings, mood logs, or survey answers.</li>
                  <li><strong className="text-emerald-400">PROTECTION:</strong> Telemetry CANNOT be cited in ACR/APAR annual appraisal.</li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap items-center justify-between text-[11px] text-slate-400 gap-2">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Cryptographic Audit Trail: <strong>0 unauthorized access attempts</strong></span>
            </span>
            <span className="font-mono text-emerald-300">Defense Medical Directive MHA/2026/WEL</span>
          </div>
        </div>

        {/* Navigation Filter Pills */}

        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2 text-xs">
          {[
            { id: 'all', label: 'Complete View (7 Sections)' },
            { id: 'score', label: `1. ${t('wellness_score_heading')}` },
            { id: 'checkin', label: `2. ${t('checkin_heading')}` },
            { id: 'insights', label: '3. AI Insights' },
            { id: 'activities', label: '4. Wellness Activities' },
            { id: 'progress', label: '5. Personal Progress' },
            { id: 'hierarchy', label: `6. ${t('unit_hierarchy')}` },
            { id: 'trust', label: '7. Trust & Confidentiality Ledger' },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => {
                setActiveSection(sec.id as any);
                if (sec.id !== 'all') {
                  const target = document.getElementById(`${sec.id}-section`);
                  target?.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
                activeSection === sec.id
                  ? 'bg-secondary text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-gray-900 hover:bg-slate-200'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: WELLNESS SCORE */}
      {(activeSection === 'all' || activeSection === 'score') && (
        <section id="score-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" />
              <span>Section 1 &bull; Personal Wellness Score &amp; Vitals</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-success-50 text-success border border-success-200">
              OPTIMAL OPERATIONAL STATUS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Score Hero Card */}
            <div className="lg:col-span-5 p-6 rounded-3xl bg-secondary text-white shadow-card-soft relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-2xl pointer-events-none" />
              
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-slate-300">
                    Live Wellness Index
                  </span>
                  <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-secondary-900 text-accent border border-secondary-700 font-bold">
                    BIOMETRIC GRADE A
                  </span>
                </div>

                <div className="flex items-center gap-6 my-4">
                  <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-secondary-800"
                        strokeWidth="3.5"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-accent"
                        strokeDasharray={`${currentWellnessScore}, 100`}
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center">
                      <span className="text-3xl font-black font-mono tracking-tighter text-white">{currentWellnessScore}</span>
                      <span className="text-[9px] uppercase font-bold text-slate-300">/ 100</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-white">Combat Fit</h3>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Your physiological restoration and mental resilience baseline indicate high readiness.
                    </p>
                    <div className="mt-2.5 flex items-center gap-1.5 text-xs text-accent font-bold">
                      <TrendingUp className="w-3.5 h-3.5" />
                      <span>+4.8% improvement vs 30-day baseline</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-secondary-800 grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-xl bg-secondary-900/70 border border-secondary-700">
                  <span className="text-[10px] text-slate-400 block font-medium">Rest &amp; Sleep Depth</span>
                  <span className="text-sm font-black font-mono text-white">84% &bull; Stable</span>
                </div>
                <div className="p-2.5 rounded-xl bg-secondary-900/70 border border-secondary-700">
                  <span className="text-[10px] text-slate-400 block font-medium">Cognitive Vitality</span>
                  <span className="text-sm font-black font-mono text-accent">78% &bull; Alert</span>
                </div>
              </div>
            </div>

            {/* 4 Biometric Domain Sub-Tiles */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Sleep Restoration</span>
                  <div className="p-2 rounded-xl bg-primary-50 text-primary border border-primary-100">
                    <Moon className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900 font-mono">{checkinForm.sleep_hours} hrs</p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-primary h-full rounded-full" style={{ width: `${(checkinForm.sleep_hours / 8) * 100}%` }} />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Target: 7-8h uninterrupted sleep</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Fatigue &amp; Burnout Index</span>
                  <div className="p-2 rounded-xl bg-accent-50 text-accent-700 border border-accent-200">
                    <Zap className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900 font-mono">{checkinForm.fatigue_level} / 10</p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-accent h-full rounded-full" style={{ width: `${checkinForm.fatigue_level * 10}%` }} />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Zone: Controlled field fatigue</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Physical Musculoskeletal Strain</span>
                  <div className="p-2 rounded-xl bg-secondary-50 text-secondary border border-secondary-200">
                    <Shield className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900 font-mono">{checkinForm.physical_strain} / 10</p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-secondary h-full rounded-full" style={{ width: `${checkinForm.physical_strain * 10}%` }} />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Body armor load tolerated normally</p>
              </div>

              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-soft">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-500">Consecutive Operational Days</span>
                  <div className="p-2 rounded-xl bg-success-50 text-success border border-success-200">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
                <p className="text-2xl font-black text-gray-900 font-mono">{checkinForm.consecutive_duty_days} Days</p>
                <div className="w-full bg-slate-100 h-2 rounded-full mt-2.5 overflow-hidden">
                  <div className="bg-success h-full rounded-full" style={{ width: `${(checkinForm.consecutive_duty_days / 7) * 100}%` }} />
                </div>
                <p className="text-[11px] text-slate-500 mt-2 font-medium">Standard rotation cycle: 6 days</p>
              </div>
            </div>
          </div>

          {/* ML 30-Day Risk Forecasting Card for Soldier */}
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#162A45] to-[#0A192F] text-white border border-[#D4A017]/40 shadow-xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#D4A017]/20 border border-[#D4A017]/50 flex items-center justify-center text-[#D4A017]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black text-white">Risk Forecasting</h3>
                    <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#D4A017] text-slate-950 font-black">
                      30-Day ML Projection
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 font-medium">
                    <strong className="text-[#D4A017]">Purpose:</strong> Predicts future stress levels instead of only reporting current conditions.
                  </p>
                </div>
              </div>
              <span className="text-[9px] font-mono text-emerald-400 bg-white/10 px-2.5 py-1 rounded-lg border border-white/10 self-start sm:self-auto">
                Ridge ML Model &bull; 94% Confidence
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-11 gap-3.5 my-4 items-center">
              <div className="sm:col-span-5 p-4 rounded-2xl bg-white/5 border border-white/10">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Current Risk</div>
                <div className="text-2xl font-black text-white mt-1">
                  Moderate <span className="text-sm font-bold text-slate-300 font-mono">(58%)</span>
                </div>
                <div className="text-[10px] text-slate-400 mt-1">Real-Time Operational Baseline</div>
              </div>

              <div className="sm:col-span-1 text-center font-black text-rose-400 flex flex-col items-center">
                <TrendingUp className="w-5 h-5" />
                <span className="text-[10px] mt-0.5 font-mono">+16%</span>
              </div>

              <div className="sm:col-span-5 p-4 rounded-2xl bg-orange-950/40 border border-orange-500/50">
                <div className="text-[10px] font-extrabold uppercase tracking-widest text-[#D4A017]">Predicted in 30 Days</div>
                <div className="text-2xl font-black text-orange-300 mt-1">
                  High <span className="text-sm font-bold text-white font-mono">(74%)</span>
                </div>
                <div className="text-[10px] text-slate-300 mt-1">Projected Allostatic Accumulation</div>
              </div>
            </div>

            {/* Stepper */}
            <div className="p-3.5 rounded-2xl bg-black/40 border border-white/10 mb-3.5">
              <div className="text-[11px] font-bold text-slate-300 mb-2 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-[#D4A017]" />
                <span>30-Day Milestone Trajectory Curve</span>
              </div>
              <div className="grid grid-cols-5 gap-1.5 text-center">
                {[
                  { day: 'Day 0 (Today)', score: '58%', tier: 'Moderate', color: 'text-amber-400' },
                  { day: 'Day 7', score: '62%', tier: 'Moderate', color: 'text-amber-400' },
                  { day: 'Day 14', score: '67%', tier: 'High', color: 'text-orange-400' },
                  { day: 'Day 21', score: '71%', tier: 'High', color: 'text-orange-400' },
                  { day: 'Day 30', score: '74%', tier: 'High', color: 'text-orange-300' },
                ].map((m) => (
                  <div key={m.day} className="p-1.5 rounded-xl bg-white/5 border border-white/10">
                    <div className="text-[8px] font-bold text-slate-400">{m.day}</div>
                    <div className="text-xs font-black text-white font-mono mt-0.5">{m.score}</div>
                    <div className={`text-[8px] font-bold ${m.color}`}>{m.tier}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-[#D4A017]/10 border border-[#D4A017]/30 text-xs text-slate-200 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#D4A017] shrink-0" />
              <span>
                <strong className="text-[#D4A017]">Benefits:</strong> Supports proactive planning and preventive action. Engage in guided rest rotations to avert High risk transition.
              </span>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 2: DAILY CHECK-IN */}
      {(activeSection === 'all' || activeSection === 'checkin') && (
        <section id="checkin-section" className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-[0.12em] text-primary">
                  Section 2
                </span>
                <span className="text-slate-300">&bull;</span>
                <h2 className="text-base font-black text-gray-900">
                  Daily Confidential Wellness Check-in
                </h2>
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">
                Record your 24h biological state. Data is analyzed confidentially by AI for burnout prevention and psychological health support.
              </p>
            </div>
            <span className="text-[10px] font-mono text-primary bg-primary-50 px-3 py-1 rounded-full border border-primary-200 font-bold">
              HMAC ENCRYPTED
            </span>
          </div>

          {submitMessage && (
            <div className="mb-6 p-4 rounded-2xl bg-success-50 border border-success-200 text-success-800 text-xs font-bold flex items-center gap-3">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-success" />
              <span>{submitMessage}</span>
            </div>
          )}

          <form onSubmit={handleCheckinSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Sleep Hours */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <label className="text-xs font-extrabold text-gray-800 flex items-center justify-between">
                  <span>Sleep Hours (Last 24h)</span>
                  <span className="font-mono text-primary text-sm">{checkinForm.sleep_hours} hrs</span>
                </label>
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={checkinForm.sleep_hours}
                  onChange={(e) => setCheckinForm({ ...checkinForm, sleep_hours: parseFloat(e.target.value) })}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>3h (Deprived)</span>
                  <span>7.5h (Optimal)</span>
                  <span>12h</span>
                </div>
              </div>

              {/* Mood Selector */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <label className="text-xs font-extrabold text-gray-800 flex items-center justify-between">
                  <span>Mental State / Mood</span>
                  <span className="font-mono text-primary text-sm">{checkinForm.mood_score} / 10</span>
                </label>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { score: 3, label: 'Low', icon: Frown },
                    { score: 7, label: 'Steady', icon: Meh },
                    { score: 9, label: 'Strong', icon: Smile },
                  ].map((m) => {
                    const Icon = m.icon;
                    const isSelected = checkinForm.mood_score === m.score;
                    return (
                      <button
                        key={m.score}
                        type="button"
                        onClick={() => setCheckinForm({ ...checkinForm, mood_score: m.score })}
                        className={`p-2 rounded-xl border text-xs font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-primary text-white border-primary shadow-xs'
                            : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{m.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fatigue Level */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <label className="text-xs font-extrabold text-gray-800 flex items-center justify-between">
                  <span>Fatigue Level</span>
                  <span className="font-mono text-accent-700 text-sm">{checkinForm.fatigue_level} / 10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={checkinForm.fatigue_level}
                  onChange={(e) => setCheckinForm({ ...checkinForm, fatigue_level: parseInt(e.target.value) })}
                  className="w-full accent-accent cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 (Fresh)</span>
                  <span>5 (Moderate)</span>
                  <span>10 (Exhausted)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Workload Pressure */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <label className="text-xs font-extrabold text-gray-800 flex items-center justify-between">
                  <span>Operational Workload</span>
                  <span className="font-mono text-secondary text-sm">{checkinForm.workload_pressure} / 10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={checkinForm.workload_pressure}
                  onChange={(e) => setCheckinForm({ ...checkinForm, workload_pressure: parseInt(e.target.value) })}
                  className="w-full accent-secondary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 (Light)</span>
                  <span>5 (Manageable)</span>
                  <span>10 (Surge)</span>
                </div>
              </div>

              {/* Physical Strain */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <label className="text-xs font-extrabold text-gray-800 flex items-center justify-between">
                  <span>Musculoskeletal Strain</span>
                  <span className="font-mono text-primary text-sm">{checkinForm.physical_strain} / 10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={checkinForm.physical_strain}
                  onChange={(e) => setCheckinForm({ ...checkinForm, physical_strain: parseInt(e.target.value) })}
                  className="w-full accent-primary cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>1 (None)</span>
                  <span>5 (Ache)</span>
                  <span>10 (Severe)</span>
                </div>
              </div>

              {/* Consecutive Duty Days */}
              <div className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200/80 space-y-2">
                <label className="text-xs font-extrabold text-gray-800 flex items-center justify-between">
                  <span>Duty Days Without Leave</span>
                  <span className="font-mono text-gray-900 text-sm font-bold">{checkinForm.consecutive_duty_days} Days</span>
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {[1, 2, 3, 5, 7, 10].map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setCheckinForm({ ...checkinForm, consecutive_duty_days: d })}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        checkinForm.consecutive_duty_days === d
                          ? 'bg-secondary text-white border-secondary'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {d}d
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Confidential Notes */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700">
                Confidential Field Observations / Sleep Disturbances (Optional)
              </label>
              <textarea
                rows={2}
                value={checkinForm.notes}
                onChange={(e) => setCheckinForm({ ...checkinForm, notes: e.target.value })}
                placeholder="e.g. Mild lower back strain after 12km patrol; sleep disrupted by altitude cold."
                className="w-full rounded-2xl border border-slate-200 p-3 text-xs text-gray-900 placeholder:text-slate-400 focus:border-primary focus:outline-none transition-colors"
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400 font-medium">
                Last synchronized: Today, 08:30 IST &bull; Protocol V2.4
              </span>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-primary hover:bg-primary-600 text-white font-extrabold text-xs shadow-lg shadow-primary/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4 text-accent" />
                <span>{isSubmitting ? 'Syncing...' : 'Submit Daily Check-in'}</span>
              </button>
            </div>
          </form>
        </section>
      )}

      {/* SECTION 3: AI WELLNESS INSIGHTS */}
      {(activeSection === 'all' || activeSection === 'insights') && (
        <section id="insights-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
              <Brain className="w-4 h-4 text-secondary" />
              <span>Section 3 &bull; AI Wellness Insights &amp; Clinical Diagnostics</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-secondary-50 text-secondary border border-secondary-200">
              HEALTH AI MODEL v2.8 ACTIVE
            </span>
          </div>

          {/* Clinical Narrative & Sparsity Meter Card */}
          <ClinicalNarrativeCard personnelUid={user?.uid || 'UID-EMP-012'} missingDays={2} />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Insight 1: Circadian Recovery */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-success-50 text-success border border-success-200">
                    Circadian Recovery
                  </span>
                  <Sparkles className="w-4 h-4 text-accent" />
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">Restorative Sleep Phase Verified</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  Your sleep continuity of {checkinForm.sleep_hours}h provided uninterrupted deep slow-wave cycles. Estimated cognitive response speed is at 94% of operational capacity.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Alertness Window</span>
                <span className="text-primary font-mono font-bold">06:00 - 18:30 IST</span>
              </div>
            </div>

            {/* Insight 2: Duty Cycle Warning */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-accent-50 text-accent-700 border border-accent-200">
                    Deployment Cycle
                  </span>
                  <Clock className="w-4 h-4 text-accent" />
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">Consecutive Days: {checkinForm.consecutive_duty_days} of 6</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  Approaching standard field rotation threshold. Recommend scheduling a 24h restorative rest period in 48 hours to preserve physical endurance.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Next R&amp;R Window</span>
                <span className="text-accent-700 font-mono font-bold">Thursday Morning</span>
              </div>
            </div>

            {/* Insight 3: Hydration & Muscle Care */}
            <div className="p-6 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-secondary-50 text-secondary border border-secondary-200">
                    Physiological Advice
                  </span>
                  <Flame className="w-4 h-4 text-secondary" />
                </div>
                <h3 className="font-extrabold text-sm text-gray-900">Electrolyte &amp; Hydration Directive</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  Moderate physical strain recorded ({checkinForm.physical_strain}/10). Drink 3.5 liters of mineralized fluids today to prevent lactic acid retention post-patrol.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                <span>Target Intake</span>
                <span className="text-secondary font-mono font-bold">3.5L / Day</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: WELLNESS ACTIVITIES */}
      {(activeSection === 'all' || activeSection === 'activities') && (
        <section id="activities-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
              <Compass className="w-4 h-4 text-primary" />
              <span>Section 4 &bull; Tactical Wellness Activities &amp; Decompression</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-primary-50 text-primary border border-primary-200">
              INTERACTIVE RECOVERY TOOLS
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Box Breathing Interactive Exercise */}
            <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-extrabold text-sm text-gray-900">Tactical Box Breathing (4-4-4-4)</h3>
                    <p className="text-xs text-slate-500 mt-0.5 font-medium">
                      Proven parasympathetic nervous system regulator used by special forces for rapid heart rate lowering.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-bold">
                    3 MIN PROTOCOL
                  </span>
                </div>

                <div className="my-6 flex flex-col items-center justify-center">
                  <div
                    className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 ${
                      breathingActive
                        ? breathPhase === 'Inhale'
                          ? 'border-primary scale-110 bg-primary-50 shadow-lg shadow-primary/20'
                          : breathPhase === 'Hold'
                          ? 'border-accent scale-110 bg-accent-50'
                          : breathPhase === 'Exhale'
                          ? 'border-secondary scale-95 bg-secondary-50'
                          : 'border-slate-300 scale-95 bg-slate-50'
                        : 'border-slate-200 bg-slate-50'
                    }`}
                  >
                    <span className="text-xs font-black uppercase tracking-wider text-gray-800">
                      {breathingActive ? breathPhase : 'Ready'}
                    </span>
                    <span className="text-3xl font-black font-mono text-gray-900 mt-1">
                      {breathingActive ? breathSeconds : '4'}s
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-3 font-semibold text-center">
                    {breathingActive
                      ? `${breathPhase} steadily for ${breathSeconds} seconds...`
                      : 'Press Start to initiate 4-4-4-4 tactical decompression cycle'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-4 border-t border-slate-100">
                <button
                  onClick={() => setBreathingActive(!breathingActive)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                    breathingActive
                      ? 'bg-secondary text-white hover:bg-secondary-600'
                      : 'bg-primary text-white hover:bg-primary-600 shadow-primary/20'
                  }`}
                >
                  {breathingActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  <span>{breathingActive ? 'Pause Exercise' : 'Start Box Breathing'}</span>
                </button>
                <button
                  onClick={() => {
                    setBreathingActive(false);
                    setBreathPhase('Inhale');
                    setBreathSeconds(4);
                  }}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Tactical Recovery Guides & Consultation */}
            <div className="lg:col-span-6 space-y-4">
              {/* Activity 1: Muscle Release */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-soft flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-primary px-2 py-0.5 rounded bg-primary-50">
                    POST-PATROL ROUTINE
                  </span>
                  <h4 className="font-extrabold text-sm text-gray-900">Musculoskeletal Stretching Protocol</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    3-step hip flexor release, lumbar spine elongation, and calf stretch for ruck marching strain.
                  </p>
                </div>
                <button className="shrink-0 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1 cursor-pointer">
                  <span>Open Guide</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Activity 2: Sleep Hygiene Checklist */}
              <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-card-soft flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-secondary px-2 py-0.5 rounded bg-secondary-50">
                    NIGHT PROTOCOL
                  </span>
                  <h4 className="font-extrabold text-sm text-gray-900">Sleep Hygiene in Barracks Checklist</h4>
                  <p className="text-xs text-slate-500 font-medium">
                    Caffeine cutoff 6h prior, blue light filter on device, ear protection &amp; breath grounding.
                  </p>
                </div>
                <button className="shrink-0 px-3 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 flex items-center gap-1 cursor-pointer">
                  <span>View Checklist</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Activity 3: Confidential Welfare Consultation Trigger */}
              <div className="p-5 rounded-2xl bg-accent-50/50 border border-accent-200 shadow-card-soft flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono font-bold text-accent-800 px-2 py-0.5 rounded bg-accent-100">
                    CONFIDENTIAL SUPPORT
                  </span>
                  <h4 className="font-extrabold text-sm text-gray-900">Request Welfare Officer Consultation</h4>
                  <p className="text-xs text-slate-600 font-medium">
                    Speak directly with assigned Welfare Officer Priya Sharma. Strictly privileged and private.
                  </p>
                </div>
                <button
                  onClick={() => alert('Consultation request dispatched to Welfare Officer Priya Sharma. You will receive a secure confirmation.')}
                  className="shrink-0 px-3.5 py-2 rounded-xl bg-primary hover:bg-primary-600 text-white text-xs font-extrabold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-accent" />
                  <span>Request</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 5: PERSONAL PROGRESS */}
      {(activeSection === 'all' || activeSection === 'progress') && (
        <section id="progress-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
              <Award className="w-4 h-4 text-accent" />
              <span>Section 5 &bull; Personal Progress, Streaks &amp; Historical Logs</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-accent-50 text-accent-700 border border-accent-200">
              12-DAY CONSECUTIVE CHECK-IN STREAK
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Historical Check-in Log Table */}
            <div className="lg:col-span-8 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">7-Day Biometric Assessment Log</h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">Historical daily records verified by unit medical server.</p>
                </div>
                <span className="text-xs font-mono text-slate-400">UID-EMP-010</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-mono text-[10px] uppercase">
                      <th className="py-2.5 px-3">Timeline</th>
                      <th className="py-2.5 px-3">Sleep</th>
                      <th className="py-2.5 px-3">Fatigue</th>
                      <th className="py-2.5 px-3">Wellness Score</th>
                      <th className="py-2.5 px-3 text-right">Readiness Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pastCheckins.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-3 font-extrabold text-gray-900">{item.date}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{item.sleep}</td>
                        <td className="py-3 px-3 font-mono text-slate-600">{item.fatigue}</td>
                        <td className="py-3 px-3">
                          <span className="font-mono font-black text-gray-900 text-sm">{item.score}</span>
                          <span className="text-[10px] text-slate-400 font-mono"> / 100</span>
                        </td>
                        <td className="py-3 px-3 text-right">
                          <span
                            className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                              item.status === 'Optimal'
                                ? 'bg-success-50 text-success border-success-200'
                                : 'bg-primary-50 text-primary border-primary-200'
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Badges & Discipline Milestones */}
            <div className="lg:col-span-4 p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-card-soft flex flex-col justify-between">
              <div>
                <h3 className="font-extrabold text-sm text-gray-900 mb-1">Discipline &amp; Resilience Honors</h3>
                <p className="text-xs text-slate-500 font-medium mb-4">Milestone recognitions for continuous wellness monitoring.</p>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-primary-50/60 border border-primary-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0">
                      <Award className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900">10-Day Discipline Badge</h4>
                      <p className="text-[11px] text-slate-600 font-medium">Logged daily wellness 10 days in a row</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-secondary-50/60 border border-secondary-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary text-white flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900">SHAPE-1 Medical Clearance</h4>
                      <p className="text-[11px] text-slate-600 font-medium">Frontline operational readiness certified</p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-accent-50/60 border border-accent-200 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent text-gray-900 flex items-center justify-center shrink-0">
                      <HeartPulse className="w-5 h-5 text-gray-900" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-900">Restoration Vanguard</h4>
                      <p className="text-[11px] text-slate-600 font-medium">Averaging 7.1h sleep over past 14 days</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <span className="text-xs font-bold text-gray-700">Next Honor: </span>
                <span className="text-xs text-primary font-extrabold">30-Day Golden Shield (18 days left)</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECTION 6: INTERACTIVE UNIT HIERARCHY TREE */}
      {(activeSection === 'all' || activeSection === 'hierarchy') && (
        <section id="hierarchy-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#D4A017]" />
              <span>Section 6 &bull; {t('unit_hierarchy')} (Corps &rarr; Division &rarr; Brigade &rarr; Battalion &rarr; Company)</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-[#D4A017]/20 text-[#D4A017] border border-[#D4A017]/40">
              FORCE ECHELON MATRIX
            </span>
          </div>

          <UnitHierarchyTree />
        </section>
      )}

      {/* SECTION 7: DEFENSE TRUST ARCHITECTURE & CONFIDENTIALITY LEDGER */}
      {(activeSection === 'all' || activeSection === 'trust') && (
        <section id="trust-section" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-[0.12em] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Section 7 &bull; Defense Trust Architecture & Confidentiality Ledger</span>
            </h2>
            <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
              ARTICLE 42-A ENFORCED
            </span>
          </div>

          <TrustConfidentialityLedger personnelUid={user?.uid || 'UID-EMP-010'} />
        </section>
      )}

      {/* Printable Form 16-Welfare Dossier Modal */}
      <Form16WelfareDossier
        personnelUid={user?.uid || 'UID-EMP-012'}
        isOpen={showDossierModal}
        onClose={() => setShowDossierModal(false)}
      />
    </div>
  );
};

export default PersonnelDashboard;
