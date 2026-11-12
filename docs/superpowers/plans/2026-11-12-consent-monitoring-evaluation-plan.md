# Consent Flow, Missing-Data Handling, Model Monitoring, Alert Review, & Fairness Evaluation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement a production-grade consent-based data flow, missing-data handling cascade, model observability & drift monitoring, human review triage path for alerts, and comprehensive fairness evaluation on synthetic/consented data with false-positive rates, subgroup breakdowns, and documented limitations.

**Architecture:** A unified fullstack implementation across FastAPI and React. The backend adds database models and services for consent tracking, an imputation cascade for missing data, a model monitoring and drift engine (PSI), a clinical alert review state machine, and a synthetic cohort fairness evaluation benchmark. The frontend exposes these capabilities through an enhanced Alert Triage Console, a Model Monitoring & Observability Dashboard, and a Model Fairness & Subgroups Center.

**Tech Stack:** Python 3.13, FastAPI, SQLAlchemy, Pydantic, NumPy, SciKit-Learn, Pytest, React 18, TypeScript, Tailwind CSS, Lucide React.

**Spec:** [2026-11-12-consent-monitoring-evaluation-design.md](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/docs/superpowers/specs/2026-11-12-consent-monitoring-evaluation-design.md)

## Global Constraints
- Strictly follow the repository structure in `AGENT.md`.
- No business logic inside API route handlers; isolate all business logic in `backend/app/services/` and database queries in `backend/app/repositories/` or services.
- Adhere to PEP 8, type hints, and write Pytest tests for every new backend feature.
- Frontend components must use TypeScript, Tailwind CSS, and keep components modular.
- Do not hardcode credentials or secrets.

---

### Task 1: Consent-Based Data Flow Subsystem

**Files:**
- Create: `backend/app/models/consent.py`
- Create: `backend/app/schemas/consent.py`
- Create: `backend/app/services/consent_service.py`
- Create: `backend/app/api/consent/routes.py`
- Modify: `backend/app/main.py`
- Modify: `backend/app/database/init_db.py`
- Test: `backend/tests/test_consent_flow.py`

**Interfaces:**
- Consumes: `backend.app.database.session.get_db`, `backend.app.models.user.User`
- Produces: `ConsentService.get_preferences(personnel_uid)`, `ConsentService.update_preferences(...)`, `ConsentService.filter_telemetry_by_consent(...)`, `GET /api/v1/consent/preferences`, `POST /api/v1/consent/preferences`

- [ ] **Step 1: Write the failing test for consent flow**
- [ ] **Step 2: Run pytest to verify test failure**
- [ ] **Step 3: Implement `backend/app/models/consent.py` and `schemas/consent.py`**
- [ ] **Step 4: Implement `backend/app/services/consent_service.py` with consent filtering & audit logging**
- [ ] **Step 5: Implement `backend/app/api/consent/routes.py` and register in `backend/app/main.py`**
- [ ] **Step 6: Run pytest to verify test passes**

---

### Task 2: Missing-Data Handling Engine

**Files:**
- Create: `backend/app/services/missing_data_engine.py`
- Modify: `backend/app/services/ai_risk_engine.py`
- Test: `backend/tests/test_missing_data_engine.py`

**Interfaces:**
- Consumes: Raw telemetry dictionaries or vectors from assessments and duty records
- Produces: `MissingDataEngine.impute_and_mask(telemetry_dict)` returning `{imputed_features: dict, missing_mask: dict, uncertainty_penalty: float, sparsity_ratio: float}`

- [ ] **Step 1: Write the failing test for missing-data handling**
- [ ] **Step 2: Run pytest to verify test failure**
- [ ] **Step 3: Implement `backend/app/services/missing_data_engine.py` (temporal decay fill, cohort median fallback, missingness indicator mask, and uncertainty estimation)**
- [ ] **Step 4: Integrate `MissingDataEngine` into `AIRiskEngine.assess_risk(...)`**
- [ ] **Step 5: Run pytest to verify test passes**

---

### Task 3: Human Review Path for Tactical Alerts

**Files:**
- Modify: `backend/app/models/alert.py`
- Create: `backend/app/schemas/alert_review.py`
- Create: `backend/app/services/alert_review_service.py`
- Modify: `backend/app/api/alerts/routes.py`
- Test: `backend/tests/test_alert_review.py`

**Interfaces:**
- Consumes: `SystemAlert` model and reviewer user credentials
- Produces: `AlertReviewService.submit_review(alert_id, review_data, reviewer)`, `AlertReviewService.get_review_history(alert_id)`, `POST /api/v1/alerts/{id}/review`

- [ ] **Step 1: Write the failing test for human alert review**
- [ ] **Step 2: Run pytest to verify test failure**
- [ ] **Step 3: Update `SystemAlert` model with clinical review fields and create `AlertReview` model**
- [ ] **Step 4: Implement `alert_review_service.py` handling state transitions and false-positive tracking**
- [ ] **Step 5: Extend `backend/app/api/alerts/routes.py` with review and triage endpoints**
- [ ] **Step 6: Run pytest to verify test passes**

---

### Task 4: Model Monitoring & Observability Engine

**Files:**
- Create: `backend/app/services/model_monitoring_engine.py`
- Modify: `backend/app/api/monitoring/routes.py`
- Test: `backend/tests/test_model_monitoring.py`

**Interfaces:**
- Consumes: Historical baseline predictions, live inference inputs, and alert reviews
- Produces: `ModelMonitoringEngine.calculate_psi(...)`, `ModelMonitoringEngine.get_health_metrics()`, `ModelMonitoringEngine.get_feature_drift()`, `GET /api/v1/monitoring/health`, `GET /api/v1/monitoring/drift`

- [ ] **Step 1: Write the failing test for model monitoring and drift metrics**
- [ ] **Step 2: Run pytest to verify test failure**
- [ ] **Step 3: Implement `model_monitoring_engine.py` (PSI calculation, latency tracking, calibration, false-positive metrics)**
- [ ] **Step 4: Update `backend/app/api/monitoring/routes.py` to serve comprehensive observability metrics**
- [ ] **Step 5: Run pytest to verify test passes**

---

### Task 5: Evaluation on Consented/Synthetic Data with Subgroup Breakdowns & Limitations

**Files:**
- Create: `backend/app/services/fairness_evaluation_engine.py`
- Create: `backend/app/api/ai_risk/evaluation_routes.py` or extend `backend/app/api/ai_risk/routes.py`
- Test: `backend/tests/test_fairness_evaluation.py`

**Interfaces:**
- Consumes: Synthetic/consented cohort data generator
- Produces: `FairnessEvaluationEngine.run_comprehensive_evaluation()`, disaggregated False-Positive Rates (FPR), True-Positive Rates, Subgroup metrics (Ranks, Terrains, Demographics), Disparate Impact, and Model Limitations report

- [ ] **Step 1: Write the failing test for fairness evaluation, FPR, and subgroup metrics**
- [ ] **Step 2: Run pytest to verify test failure**
- [ ] **Step 3: Implement `fairness_evaluation_engine.py` with stratified synthetic generator ($N=2,500$), confusion matrix metrics, subgroup slices, and limitations report**
- [ ] **Step 4: Add `/api/v1/ai-risk/fairness-evaluation` endpoint and connect to monitoring**
- [ ] **Step 5: Run pytest to verify test passes**

---

### Task 6: Frontend Experience Integration

**Files:**
- Create: `frontend/src/services/consentService.ts`
- Create: `frontend/src/services/monitoringService.ts`
- Modify: `frontend/src/services/alertService.ts`
- Modify: `frontend/src/pages/alerts/index.tsx` (Human Review & Triage Drawer)
- Modify: `frontend/src/pages/monitoring/index.tsx` (Model Observability Dashboard & Fairness Subgroup Explorer)
- Modify: `frontend/src/routes/AppRoutes.tsx` (Ensure `/monitoring` is routed)
- Modify: `frontend/src/layouts/DashboardLayout.tsx` (Navigation entry for Monitoring)

- [ ] **Step 1: Create frontend services for consent and model monitoring**
- [ ] **Step 2: Upgrade `/alerts` with Human Review Triage modal, False-Positive categorization, and review history**
- [ ] **Step 3: Build interactive `/monitoring` dashboard displaying Model Health, PSI Drift, Sparsity, and Subgroup Fairness Evaluation**
- [ ] **Step 4: Verify frontend build compiles without errors (`npm run build`)**

---

### Task 7: Full System Verification & Regression Suite

**Files:**
- Run: Entire Pytest suite (`pytest backend/tests`)
- Run: Frontend build & TypeScript validation
- Verify: All requirements from user prompt are completely met and documented
