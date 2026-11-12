# Design Spec: Consent-Based Data Flow, Missing-Data Handling, Model Monitoring, Alert Human Review, and Subgroup Evaluation

**Date:** 2026-11-12  
**Status:** Approved  
**System:** AI-Powered Personnel Stress and Welfare Monitoring System (PSWMS)

---

## 1. Problem Statement & Scope

The system requires two interconnected pillars of trustworthy, ethical AI welfare engineering:
1. **Ethical Telemetry & Pipeline Integrity**:
   - Define a clear, consent-based data flow with granular opt-in/opt-out control and audit trails.
   - Robust missing-data handling (temporal forward-decay, multivariate/KNN imputation, and explicit missingness indicators) to ensure uninterrupted, reliable inference during high-tempo field operations.
   - Real-time model monitoring tracking population stability drift (PSI), inference latency, confidence calibration, and telemetry sparsity.
   - Human-in-the-loop clinical review path for tactical alerts with clinical disposition tagging and a closed-loop false-positive feedback channel.
2. **Empirical Algorithmic Fairness & Subgroup Evaluation**:
   - Quantitative evaluation across consented and synthetic cohorts (N=2,500+ records) stratified by military operational parameters (Ranks, Operational Terrains, Duty Rhythms, Demographics).
   - Strict reporting of False-Positive Rates (FPR), False-Discovery Rates (FDR), Disparate Impact, and Equalized Odds.
   - Comprehensive model limitations disclosure regarding sensor attrition, stigma bias, and operational deployment boundaries.

---

## 2. Architecture & Subsystems

### 2.1 Consent-Based Data Flow
```
User / Frontline Personnel
        │
        ├──(Sets / Revokes Preferences)──> /api/v1/consent/preferences
        │                                             │
        │                                             ▼
        │                                  [ ConsentRecord (DB) ]
        │                                  [ ConsentAuditTrail (DB) ]
        │                                             │
        ▼                                             ▼
Incoming Data Stream  ─────────────────>  [ Consent Firewall Middleware ]
 (Assessment, Roster, Wearables)                      │
                                                      ├── Stream Authorized?
                                                      │     ├─ YES ➔ Forward to Ingestion
                                                      │     └─ NO  ➔ Redact / Mask with Baseline Defaults
```
- **Consent Scopes**:
  - `SELF_ASSESSMENT`: Voluntary periodic psychological check-ins.
  - `DUTY_ROSTER_TELEMETRY`: Shift hours, deployment history, leave records.
  - `BIOMETRICS_WEARABLE`: Optional sleep and physiological metrics.
  - `AI_LONGITUDINAL_PROFILING`: Longitudinal digital twin trend analytics.
- **Data Models**:
  - `ConsentPreference`: Maps `personnel_uid` to individual scope booleans, consent version, granted timestamp, and revocation timestamp.
  - `ConsentAuditTrail`: Immutable log of every consent change with actor, IP, timestamp, and signature hash.

### 2.2 Missing-Data Handling Engine
```
Raw Telemetry Vector ──> [ Missing Data Profiler ]
                              │
                              ├── Sparse (>60% Missing)? ──> Flag High Uncertainty Interval
                              │
                              ▼
                         [ Imputation Cascade ]
                         ├─ Level 1: Historical Personal EWMA / Forward-Decay (<= 3 days)
                         ├─ Level 2: Subgroup Cohort Median Imputation
                         └─ Level 3: Missingness Indicator Generation (M_i ∈ {0, 1})
                              │
                              ▼
                    [ Imputed Feature Vector + Missingness Mask ] ──> AI Risk Engine
```
- Missingness is not ignored; an explicit boolean mask vector `[is_missing_sleep, is_missing_fatigue, ...]` is passed to model inference. This prevents distorted scores while treating missingness itself as a behavioral indicator.

### 2.3 Model Monitoring Subsystem
- **Engine Metrics**:
  - **Population Stability Index (PSI)**:
    $$\text{PSI} = \sum \left( (P_{\text{actual}} - P_{\text{expected}}) \times \ln\left(\frac{P_{\text{actual}}}{P_{\text{expected}}}\right) \right)$$
    - Thresholds: $\text{PSI} < 0.1$ (Stable / Green), $0.1 \le \text{PSI} < 0.2$ (Moderate Shift / Amber), $\text{PSI} \ge 0.2$ (Significant Drift / Red Alert).
  - **Telemetry Sparsity & Missingness Rate**: Rolling 7-day ratio of missing vs expected signals.
  - **Inference Latency & Throughput**: p50, p95, p99 latency in milliseconds.
  - **Prediction Calibration**: Risk distribution (Low, Moderate, High, Critical) vs historical baseline.
- **Routes**:
  - `GET /api/v1/monitoring/overview`: Aggregated health metrics.
  - `GET /api/v1/monitoring/drift`: Feature-level and prediction-level PSI scores.
  - `GET /api/v1/monitoring/telemetry`: Sparsity and imputation frequencies.

### 2.4 Human Review Path for Tactical Alerts
```
[ Trigger SystemAlert ]
          │
          ▼
Status: PENDING_REVIEW ──(Welfare / Medical Officer Opens Triage Drawer)
          │
          ├── Reviews Trigger Signals, SHAP Factors, Personnel Context
          │
          ├── Submits Clinical Disposition:
          │     ├─ VALIDATED_ACTIONABLE ➔ Schedule Welfare Intervention
          │     ├─ DISMISSED_FALSE_POSITIVE ➔ Log Root Cause (Artifact, Shift Lag, etc.)
          │     └─ ESCALATED_TO_MEDICAL ➔ Immediate Psychiatric / Physician Referral
          │
          ▼
[ AlertReview Audit Record Saved ] ──> False-Positive Rate Updated in Monitoring Engine
```
- **Data Models**:
  - `AlertReview`: Foreign key to `SystemAlert`, `reviewer_uid`, `review_status`, `clinical_severity_override`, `is_false_positive`, `false_positive_reason`, `clinical_notes`, `created_at`.

### 2.5 Evaluation on Consented & Synthetic Data with Subgroup Breakdown
- **Synthetic Population Generator**:
  - Generates realistic Indian Uniformed Forces population ($N=2,500$) with validated psychometric distributions, shift anomalies, and stress triggers across:
    - **Ranks**: Sepoy / Rifleman, Havildar / NCO, Subedar / JCO, Officer.
    - **Terrains**: High Altitude (LoC/LAC), Counter-Insurgency (J&K/NE), Peace Station, Tactical Field HQ.
    - **Demographics**: Gender (Male, Female, Special Forces), Age cohorts (18-25, 26-35, 36-45, 46+).
- **Fairness & Disaggregated Evaluation Metrics**:
  - False Positive Rate: $\text{FPR} = \frac{\text{FP}}{\text{FP} + \text{TN}}$.
  - False Discovery Rate: $\text{FDR} = \frac{\text{FP}}{\text{FP} + \text{TP}}$.
  - True Positive Rate (Recall / Sensitivity), Specificity, Precision, F1-Score, ROC-AUC.
  - Subgroup Parity: Disparate Impact Ratio ($\text{Selection Rate}_{\text{unprivileged}} / \text{Selection Rate}_{\text{privileged}}$), Equalized Odds differences.
- **Model Limitations & Governance Framework**:
  - Explicit documentation of technical boundary conditions, cold-start latency, adversarial gaming / response stigma, and offline synchronization boundaries.

---

## 3. API Contract Specifications

1. `POST /api/v1/consent/preferences`: Update soldier consent settings.
2. `GET /api/v1/consent/preferences/{uid}`: Retrieve current consent settings.
3. `GET /api/v1/consent/audit-log`: List cryptographic consent audit logs.
4. `POST /api/v1/alerts/{id}/review`: Submit a human clinical review for an alert.
5. `GET /api/v1/alerts/{id}/review-history`: Get human review audit trail for an alert.
6. `GET /api/v1/monitoring/health`: Model health status and operational telemetry.
7. `GET /api/v1/monitoring/drift`: Drift metrics (PSI, KS tests).
8. `GET /api/v1/monitoring/fairness`: Disaggregated subgroup metrics, FPRs, and limitations.
9. `POST /api/v1/ai-model/evaluate`: Trigger comprehensive benchmark evaluation on synthetic/consented data.

---

## 4. Frontend Experience Specifications

1. **Consent & Privacy Center (`/security` & `/settings` & profile drawer)**:
   - Granular toggles for each data stream with clear risk/benefit explanations.
   - Visual data flow diagram indicating active vs blocked channels.
2. **Alert Management & Human Review Console (`/alerts`)**:
   - Status filters: All, Pending Human Review, Actionable, Dismissed False Positives.
   - Interactive Triage Review Modal: allows welfare officers to view SHAP breakdown, enter clinical notes, override severity, and flag false positives.
3. **Observability & Model Monitoring Dashboard (`/monitoring`)**:
   - Production replacement for placeholder page: PSI drift gauges, latency sparklines, prediction distribution comparisons, and telemetry sparsity indicators.
4. **Model Fairness, Subgroups & Limitations Dossier (`/analytics` & `/monitoring`)**:
   - Subgroup breakdown matrix (Ranks, Terrains, Demographics).
   - False Positive Rate vs Recall tradeoffs.
   - Comprehensive system limitations & governance report cards.
