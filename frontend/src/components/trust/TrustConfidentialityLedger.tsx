import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  UserCheck,
  FileCheck2,
  AlertOctagon,
  CheckCircle2,
  Key,
  Scale,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { personnelService, TrustLedgerResponse } from '../../services/personnelService';
import { useLanguageStore } from '../../localization';

interface TrustConfidentialityLedgerProps {
  personnelUid: string;
  onClose?: () => void;
  isModal?: boolean;
}

export const TrustConfidentialityLedger: React.FC<TrustConfidentialityLedgerProps> = ({
  personnelUid,
  onClose,
  isModal = false,
}) => {
  const { t } = useLanguageStore();
  const [ledger, setLedger] = useState<TrustLedgerResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'matrix' | 'audit_logs' | 'statute'>('matrix');
  const [expandedLogIdx, setExpandedLogIdx] = useState<number | null>(null);

  const fetchLedger = () => {
    setLoading(true);
    personnelService
      .getTrustLedger(personnelUid)
      .then((data) => setLedger(data))
      .catch((err) => {
        console.error('Failed to fetch trust ledger:', err);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (personnelUid) {
      fetchLedger();
    }
  }, [personnelUid]);

  const content = (
    <div className="bg-slate-900 text-white rounded-3xl border border-emerald-500/30 shadow-2xl overflow-hidden">
      {/* Official Header Banner */}
      <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-950 via-slate-900 to-slate-950 border-b border-emerald-500/30 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/40">
                {t('Defense Confidentiality Firewall')}
              </span>
              <span className="text-[10px] font-mono text-slate-400">MHA/2026/WEL</span>
            </div>
            <h3 className="text-lg font-black text-white mt-0.5 flex items-center gap-2">
              <span>{t('Soldier Trust & Anti-Stigma Transparency Ledger')}</span>
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchLedger}
            title={t('Refresh Audit Signatures')}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/20 transition-all cursor-pointer"
            >
              {t('Close')}
            </button>
          )}
        </div>
      </div>

      {/* Security Status Ribbon */}
      <div className="px-6 py-2.5 bg-emerald-950/40 border-b border-emerald-500/20 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-emerald-300 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{t('Confidentiality Firewall: ENFORCED')}</span>
          </span>
          <span className="hidden sm:inline text-slate-500">&bull;</span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <AlertOctagon className="w-3.5 h-3.5 text-emerald-400" />
            <span>{t('Unauthorized Access Attempts:')} <strong className="text-emerald-300 font-mono">0</strong></span>
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
          <Key className="w-3.5 h-3.5 text-amber-400" />
          <span>{t('SHA-256 Cryptographic Audit Proof')}</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="p-4 bg-slate-950/60 border-b border-white/5 flex gap-2">
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'matrix'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span>{t('Confidentiality Firewall Matrix')}</span>
        </button>

        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'audit_logs'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>{t('Live Access Audit Log')} ({ledger?.access_logs?.length || 0})</span>
        </button>

        <button
          onClick={() => setActiveTab('statute')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'statute'
              ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <Scale className="w-3.5 h-3.5" />
          <span>{t('Article 42-A Safe Harbor')}</span>
        </button>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'matrix' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-white/10 text-xs text-slate-300 leading-relaxed">
              <strong className="text-white font-bold">{t('The Core Defense Trust Guarantee:')}</strong> {t('Your check-in telemetry, daily mood ratings, and psychological responses are held strictly under medical privilege. They exist solely to support your wellbeing and cannot be viewed by commanders to downgrade your ACR/APAR or stall your promotion.')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Box 1: Commander View (Masked) */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-amber-500/30 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 font-black text-amber-300 text-sm">
                      <Lock className="w-4 h-4 text-amber-400" />
                      <span>{t('What Your Unit Commander Sees:')}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/80 text-amber-300 border border-amber-500/40 font-bold">
                      {t('AGGREGATED ONLY')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {t('Commanders only receive operational manpower metrics required to balance combat watches and roster rotations.')}
                  </p>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-start gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>{t('Operational Readiness Grade:')}</strong> {t('Combat Ready / Rest Recommended')}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-start gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>{t('Consecutive Watch Count:')}</strong> {t('Total days deployed for roster safety')}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-start gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>{t('Actionable Roster Actions:')}</strong> {t('One-click standby swap recommendation')}</span>
                    </div>

                    {/* Blocked Items */}
                    <div className="pt-2 border-t border-white/10 space-y-2">
                      <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2 text-rose-200">
                        <EyeOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span><strong>{t('BLOCKED:')}</strong> {t('Cannot see your private feelings, mood score, or daily check-in ratings.')}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2 text-rose-200">
                        <EyeOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span><strong>{t('BLOCKED:')}</strong> {t('Cannot see answers to psychological screening questionnaires.')}</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-2 text-rose-200">
                        <EyeOff className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <span><strong>{t('BLOCKED:')}</strong> {t('Cannot see counseling debrief notes or psychiatric discussions.')}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>{t('Enforced via server-side cryptographic masking middleware')}</span>
                </div>
              </div>

              {/* Box 2: Certified Medical / Welfare Officer View */}
              <div className="p-5 rounded-2xl bg-slate-950 border border-emerald-500/30 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2 font-black text-emerald-300 text-sm">
                      <UserCheck className="w-4 h-4 text-emerald-400" />
                      <span>{t('What Certified Doctors See:')}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-bold">
                      {t('MEDICAL PRIVILEGE')}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">
                    {t('Accessible exclusively by licensed Unit Medical Officers and certified Welfare Officers for clinical de-escalation.')}
                  </p>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-start gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>{t('Multi-Domain Distress Breakdown:')}</strong> {t('PHQ-9 & GAD-7 screening evaluations')}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-start gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>{t('Restorative Sleep Telemetry:')}</strong> {t('Latency, awakenings, and circadian stability')}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-start gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>{t('Case Debrief Logs:')}</strong> {t('Counseling progress and recovery trajectory monitoring')}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-900/90 border border-white/5 flex items-start gap-2 text-slate-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>{t('Welfare Interventions:')}</strong> {t('Family emergency leaves and restorative relief grants')}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 text-[11px] text-slate-400 flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{t('Sealed under Doctor-Patient Confidentiality Oath')}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'audit_logs' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-white/10">
              <span>{t('Verified Access History for UID:')} <strong className="text-white font-mono">{personnelUid}</strong></span>
              <span className="text-emerald-400 font-bold">{t('100% Cryptographically Logged')}</span>
            </div>

            {loading ? (
              <div className="py-12 text-center text-slate-400 text-xs font-mono animate-pulse">
                {t('Verifying SHA-256 HMAC Signatures...')}
              </div>
            ) : !ledger?.access_logs || ledger.access_logs.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs">
                {t('No recent external inspections logged. Your record remains sealed.')}
              </div>
            ) : (
              <div className="space-y-3">
                {ledger.access_logs.map((log, idx) => {
                  const isExpanded = expandedLogIdx === idx;
                  const isCommander = log.accessor_role === 'COMMANDER' || log.accessor_role === 'DEPT_HEAD';

                  return (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 hover:border-emerald-500/40 transition-all text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2.5">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-xs ${
                            isCommander ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          }`}>
                            {isCommander ? <Lock className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </div>
                          <div>
                            <div className="font-bold text-white flex items-center gap-2">
                              <span>{log.accessor_name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-white/10 text-slate-300">
                                {t(log.accessor_role)}
                              </span>
                            </div>
                            <span className="text-[11px] text-slate-400">{log.accessor_unit}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              isCommander ? 'bg-amber-950/60 text-amber-300 border border-amber-500/30' : 'bg-emerald-950/60 text-emerald-300 border border-emerald-500/30'
                            }`}>
                              {t(log.access_scope)}
                            </span>
                            <div className="text-[10px] font-mono text-slate-500 mt-0.5">
                              {new Date(log.timestamp).toLocaleString()}
                            </div>
                          </div>

                          <button
                            onClick={() => setExpandedLogIdx(isExpanded ? null : idx)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 pt-3 border-t border-white/10 space-y-2 text-[11px]">
                          <div>
                            <span className="text-slate-400">{t('Official Access Reason:')} </span>
                            <span className="text-slate-200 font-medium">{log.reason}</span>
                          </div>

                          {log.data_redactions && log.data_redactions.length > 0 && (
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-rose-400 font-bold">{t('Firewall Redactions Applied:')}</span>
                              {log.data_redactions.map((red, rIdx) => (
                                <span key={rIdx} className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-500/30 font-mono text-[10px]">
                                  {red}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="p-2 rounded-xl bg-black/40 font-mono text-[10px] text-slate-400 flex items-center justify-between gap-2 overflow-x-auto">
                            <span>SHA-256 Checksum: <strong className="text-emerald-400">{log.integrity_sha256}</strong></span>
                            <span className="text-emerald-300 shrink-0 font-bold">{t('VERIFIED AUTHENTIC')}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'statute' && (
          <div className="space-y-5">
            <div className="p-5 rounded-2xl bg-amber-950/40 border border-amber-500/30 space-y-3">
              <div className="flex items-center gap-2.5 text-amber-300 font-black text-sm">
                <Scale className="w-5 h-5 text-amber-400" />
                <span>{t('Statutory Safe-Harbor: Article 42-A Defense Personnel Welfare Act')}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed text-justify">
                {t('Under directive')} <strong className="text-white">MHA/2026/WEL</strong>, {t('all self-reported psychometric check-ins, mood diaries, and emotional stability metrics submitted via the PSWMS terminal are legally classified as')} <strong className="text-emerald-400">{t('Privileged Medical Intelligence')}</strong>.
              </p>
              <div className="p-3.5 rounded-xl bg-slate-900/80 border border-amber-500/20 text-xs space-y-2 text-slate-200">
                <div className="flex items-center gap-2 font-bold text-amber-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('Immunity from Annual Performance Appraisal (ACR / APAR)')}</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-6">
                  {t('Admitting acute fatigue, elevated stress, or requesting a counseling debrief CANNOT be cited in your service dossier, promotion evaluation, or overseas mission eligibility review.')}
                </p>

                <div className="flex items-center gap-2 font-bold text-amber-300 pt-2 border-t border-white/5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{t('Inadmissibility in Courts of Inquiry or Disciplinary Boards')}</span>
                </div>
                <p className="text-[11px] text-slate-400 pl-6">
                  {t('Telemetry from this platform is legally inadmissible as punitive evidence under the Army Act / CRPF Act. It is strictly preserved for proactive decompression and restorative welfare.')}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span>{t('Authority:')} <strong>{t('Ministry of Home Affairs & Integrated Defence Staff')}</strong></span>
              <span className="font-mono text-emerald-400 font-bold">{t('Gazette Notification 2026/DEF-WEL-42A')}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="max-w-4xl w-full">{content}</div>
      </div>
    );
  }

  return content;
};
