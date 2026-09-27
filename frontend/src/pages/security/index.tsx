import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  EyeOff,
  Key,
  FileCheck2,
  CheckCircle2,
  RefreshCw,
  HeartPulse,
  Users,
  Activity,
} from 'lucide-react';
import { SystemTrustMeterCard } from '../../components/trust/SystemTrustMeterCard';
import { TrustConfidentialityLedger } from '../../components/trust/TrustConfidentialityLedger';

export const SecurityPage: React.FC = () => {
  const [activePipelineStep, setActivePipelineStep] = useState<number>(1);
  const [isVerifying, setIsVerifying] = useState<boolean>(false);

  const pipelineSteps = [
    {
      id: 1,
      title: 'HRMS Ingestion',
      category: 'Data Source',
      icon: Users,
      badge: 'HRMS Roster & Shifts',
      status: 'Active & Verified',
      description: 'Encrypted ingestion of unit postings, operational watch durations, and leave histories directly from official Defense HRMS systems.',
      specs: ['REST TLS 1.3 Strict', 'OAuth 2.0 Mutual mTLS', 'SHA-256 Signed Ingest'],
    },
    {
      id: 2,
      title: 'Wellness & Self-Assessment',
      category: 'Psychological Inputs',
      icon: HeartPulse,
      badge: 'Voluntary Check-ins',
      status: 'Air-Gapped Enclave',
      description: 'Confidential soldier survey responses, subjective fatigue indices, and self-assessments stored strictly inside a protected clinical vault.',
      specs: ['Article 42-A Statutory Wall', 'Zero-Commander Direct Access', 'Zero-Stigma Assurance'],
    },
    {
      id: 3,
      title: 'Biometric Telemetry',
      category: 'Physiological Inputs',
      icon: Activity,
      badge: 'Continuous Edge Streams',
      status: 'Edge Filtered',
      description: 'Sleep actigraphy, resting heart rate variance (HRV), and duty tempo telemetry scrubbed for raw waveform leakage before cloud aggregation.',
      specs: ['Edge Noise Filtering', 'Rolling Window Vectorization', 'No Raw Waveform Storage'],
    },
    {
      id: 4,
      title: 'Anonymization Engine',
      category: 'Privacy Preserving',
      icon: EyeOff,
      badge: '&epsilon;-Differential Privacy',
      status: 'Laplace Noise Added',
      description: 'Removes service numbers and names. Applies mathematical differential privacy (&epsilon;=0.8) so individual jawans cannot be reverse-engineered.',
      specs: ['Pseudonymous UID Masking', 'Laplacian Differential Perturbation', 'K-Anonymity (k &ge; 25)'],
    },
    {
      id: 5,
      title: 'Military-Grade Encryption',
      category: 'Cryptographic Core',
      icon: Lock,
      badge: 'AES-256-GCM + HSM',
      status: 'Enforced at Rest & Transit',
      description: 'All state data encrypted with AES-256-GCM keys managed by Dedicated Hardware Security Modules (HSM) with automated hourly key rotation.',
      specs: ['Envelope Encryption Key Hierarchy', 'FIPS 140-3 Level 4 HSM', 'Post-Quantum Kyber-768 Ready'],
    },
    {
      id: 6,
      title: 'Role-Based Access (RBAC)',
      category: 'Zero-Trust Governance',
      icon: Key,
      badge: 'Zero-Trust Granular Matrix',
      status: 'Enforced by Token Claims',
      description: 'Commanders see unit-level readiness only. Welfare Officers see clinical trends. System administrators have zero access to psychological dossiers.',
      specs: ['Strict Separation of Duties', 'JWT HMAC-SHA256 Token Validation', 'Real-Time Revocation Watch'],
    },
    {
      id: 7,
      title: 'Real-Time Validation',
      category: 'Integrity Ledger',
      icon: FileCheck2,
      badge: 'Tamper-Proof Audit',
      status: 'Continuous Verification',
      description: 'Every inference and dataset transaction is cryptographically logged into an append-only ledger preventing retroactive tampering or redaction.',
      specs: ['Immutable Merkle Hash Chaining', 'Audit Log Signature Verification', '100% Non-Repudiation'],
    },
  ];

  const handleRunVerification = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
    }, 1200);
  };

  return (
    <div className="space-y-7">
      {/* Top Strategic Security Header */}
      <div className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-secondary-950 to-slate-950 text-white border border-emerald-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-primary-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-2.5">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.18em] bg-emerald-950/80 text-emerald-400 border border-emerald-500/40 shadow-sm flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Zero-Trust Security &amp; Privacy Architecture
              </span>
              <span className="text-xs text-slate-400 font-mono font-bold">&bull; Defense Directive 2026/SEC-WEL</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
              <span>Secure Data Processing &amp; Anonymization Enclave</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1.5 max-w-3xl font-medium leading-relaxed">
              Multi-source defense ingestion pipeline with hardware-enforced encryption, mathematical differential privacy, and air-gapped clinical confidentiality protocols.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleRunVerification}
              disabled={isVerifying}
              className="px-5 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-lg shadow-emerald-900/30 flex items-center gap-2 cursor-pointer transition-all duration-200 border border-emerald-400/40"
            >
              <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Auditing Security Chains...' : 'Verify Cryptographic Chains'}</span>
            </button>
          </div>
        </div>

        {/* Security Quick Stats Bar */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-extrabold uppercase text-slate-400">Encryption Standard</div>
            <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">AES-256-GCM (FIPS)</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-extrabold uppercase text-slate-400">Privacy Guarantee</div>
            <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">&epsilon;-Differential Privacy</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-extrabold uppercase text-slate-400">Access Governance</div>
            <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">Zero-Trust Multi-Role</div>
          </div>
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="text-[10px] font-extrabold uppercase text-slate-400">Confidentiality Wall</div>
            <div className="text-sm font-black text-emerald-400 font-mono mt-0.5">100% Medical Airgap</div>
          </div>
        </div>
      </div>

      {/* Dynamic Interactive Pipeline Architecture */}
      <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-primary font-mono">
              End-To-End Ingestion Flow
            </span>
            <h2 className="text-lg font-black text-slate-900 mt-0.5">
              Interactive Secure Processing Pipeline
            </h2>
            <p className="text-xs text-slate-500">
              Click any step to inspect the security enforcement mechanics and cryptographic guarantees.
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Hardware Enclave Live</span>
          </div>
        </div>

        {/* Step Carousel / Pills */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {pipelineSteps.map((step) => {
            const Icon = step.icon;
            const isSelected = activePipelineStep === step.id;
            return (
              <button
                key={step.id}
                onClick={() => setActivePipelineStep(step.id)}
                className={`p-3 rounded-2xl text-left transition-all duration-200 border cursor-pointer ${
                  isSelected
                    ? 'bg-slate-900 text-white border-emerald-500/80 shadow-md ring-2 ring-emerald-500/20'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded-xl ${isSelected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white text-slate-600 shadow-xs'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className={`text-[10px] font-mono font-bold ${isSelected ? 'text-emerald-400' : 'text-slate-400'}`}>
                    0{step.id}
                  </span>
                </div>
                <div className={`text-xs font-black truncate ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                  {step.title}
                </div>
                <div className={`text-[10px] truncate mt-0.5 ${isSelected ? 'text-slate-300' : 'text-slate-500'}`}>
                  {step.category}
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Step Detailed Inspector */}
        {(() => {
          const current = pipelineSteps.find((s) => s.id === activePipelineStep) || pipelineSteps[0];
          const Icon = current.icon;
          return (
            <div className="p-6 rounded-3xl bg-slate-900 text-white border border-emerald-500/30 shadow-lg space-y-4 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">
                        Step 0{current.id} &bull; {current.category}
                      </span>
                      <span className="text-xs font-mono text-slate-400">{current.badge}</span>
                    </div>
                    <h3 className="text-lg font-black text-white mt-1">{current.title}</h3>
                  </div>
                </div>

                <div className="px-3 py-1.5 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-mono font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Status: {current.status}</span>
                </div>
              </div>

              <p className="text-sm text-slate-300 font-medium leading-relaxed">
                {current.description}
              </p>

              <div className="pt-2">
                <div className="text-[11px] font-extrabold uppercase text-slate-400 mb-2">Cryptographic &amp; Security Specifications:</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {current.specs.map((spec, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="font-semibold text-slate-200">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Grid: 7 Core Security Components Showcased */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Component 1: HRMS Ingestion */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-primary-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-primary font-mono">01 &bull; Ingestion</span>
            <Users className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-black text-slate-900">HRMS Integration</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Direct authenticated synchronization with military personnel rosters, APAR performance ratings, and unit duty logs.
          </p>
          <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 inline-block font-bold">
            TLS 1.3 Certified
          </div>
        </div>

        {/* Component 2: Wellness Inputs */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 font-mono">02 &bull; Psychological</span>
            <HeartPulse className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-sm font-black text-slate-900">Wellness &amp; Surveys</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Periodic psychological health logs and subjective fatigue self-assessments segregated in an air-gapped vault.
          </p>
          <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 inline-block font-bold">
            Article 42-A Shield
          </div>
        </div>

        {/* Component 3: Biometric Inputs */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-sky-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-sky-600 font-mono">03 &bull; Telemetry</span>
            <Activity className="w-4 h-4 text-sky-600" />
          </div>
          <h3 className="text-sm font-black text-slate-900">Biometric Telemetry</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Edge-processed heart-rate variability, sleep architecture, and actigraphy with zero raw audio or GPS retention.
          </p>
          <div className="text-[10px] font-mono text-sky-700 bg-sky-50 px-2 py-1 rounded-md border border-sky-200 inline-block font-bold">
            On-Device Filtering
          </div>
        </div>

        {/* Component 4: Anonymization */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-purple-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-purple-600 font-mono">04 &bull; De-identification</span>
            <EyeOff className="w-4 h-4 text-purple-600" />
          </div>
          <h3 className="text-sm font-black text-slate-900">Differential Privacy</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Non-reversible SHA-256 pseudonymization with calibrated Laplacian noise to prevent reverse re-identification.
          </p>
          <div className="text-[10px] font-mono text-purple-700 bg-purple-50 px-2 py-1 rounded-md border border-purple-200 inline-block font-bold">
            &epsilon; = 0.8 Privacy Bound
          </div>
        </div>

        {/* Component 5: Encryption */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-amber-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-amber-600 font-mono">05 &bull; Cryptography</span>
            <Lock className="w-4 h-4 text-amber-600" />
          </div>
          <h3 className="text-sm font-black text-slate-900">AES-256-GCM</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            FIPS 140-3 Hardware Security Module key management with dynamic envelope encryption for all at-rest records.
          </p>
          <div className="text-[10px] font-mono text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200 inline-block font-bold">
            HSM Root of Trust
          </div>
        </div>

        {/* Component 6: RBAC */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-blue-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-blue-600 font-mono">06 &bull; Zero-Trust</span>
            <Key className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-sm font-black text-slate-900">Role-Based Access</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Fine-grained claim validation segregating Commander tactical readiness from Clinical welfare case management.
          </p>
          <div className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2 py-1 rounded-md border border-blue-200 inline-block font-bold">
            5 Distinct Enclaves
          </div>
        </div>

        {/* Component 7: Validation */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-emerald-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-emerald-600 font-mono">07 &bull; Verification</span>
            <FileCheck2 className="w-4 h-4 text-emerald-600" />
          </div>
          <h3 className="text-sm font-black text-slate-900">Cryptographic Validation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Append-only Merkle tree ledger recording all system inferences and access requests with instant tamper detection.
          </p>
          <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200 inline-block font-bold">
            100% Audit Verified
          </div>
        </div>

        {/* Component 8: System Trust */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-2 hover:border-primary-300 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase text-primary font-mono">08 &bull; Transparency</span>
            <ShieldCheck className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-sm font-black text-slate-900">Anti-Stigma Assurance</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Guaranteed protection from career stigmatization ensuring high troop voluntary participation across all units.
          </p>
          <div className="text-[10px] font-mono text-primary-700 bg-primary-50 px-2 py-1 rounded-md border border-primary-200 inline-block font-bold">
            95.2% Opt-In Retention
          </div>
        </div>
      </div>

      {/* Trust & Transparency Meter */}
      <SystemTrustMeterCard />

      {/* Embedded Confidentiality Ledger */}
      <TrustConfidentialityLedger personnelUid="UID-EMP-012" />
    </div>
  );
};

export default SecurityPage;
