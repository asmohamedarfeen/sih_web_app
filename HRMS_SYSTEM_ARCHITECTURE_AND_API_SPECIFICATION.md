# 🛡️ Enterprise Defense & Strategic HRMS Platform
## Complete System Architecture, Mobile Client Integration Guide & API Specification

**Document Version:** `2.5.0-Enterprise-Defense`  
**Purpose:** Blueprint for Full System Recreation & Companion Mobile App Development (Flutter / React Native / Android / iOS)  
**Date:** September 3, 2026  

---

## 📑 Table of Contents
1. [System Topology & Host Environment](#1-system-topology--host-environment)
2. [Default Credentials & Role Hierarchy](#2-default-credentials--role-hierarchy)
3. [Full-Stack Architecture & Data Flow](#3-full-stack-architecture--data-flow)
4. [Database Models & Schemas (SQLAlchemy / SQLite)](#4-database-models--schemas)
5. [Authentication & Mobile Authorization Protocol](#5-authentication--mobile-authorization-protocol)
6. [Complete REST API Specification (68 Endpoints)](#6-complete-rest-api-specification)
   - [Authentication Endpoints](#61-authentication-endpoints)
   - [Personnel & Profile Endpoints](#62-personnel--profile-endpoints)
   - [Attendance & Geolocation Endpoints](#63-attendance--geolocation-endpoints)
   - [Leaves Management Endpoints](#64-leaves-management-endpoints)
   - [Duty Rosters & Shift Endpoints](#65-duty-rosters--shift-endpoints)
   - [Deployments & Missions Endpoints](#66-deployments--missions-endpoints)
   - [Medical & SHAPE Classification Endpoints](#67-medical--shape-classification-endpoints)
   - [Service Book, APAR & Awards Endpoints](#68-service-book-apar--awards-endpoints)
   - [7th CPC Payroll & Pension Endpoints](#69-7th-cpc-payroll--pension-endpoints)
   - [Armory & Tactical Assets Endpoints](#610-armory--tactical-assets-endpoints)
   - [Transfers & Posting Preferences Endpoints](#611-transfers--posting-preferences-endpoints)
   - [Training, Certifications & Firing Endpoints](#612-training-certifications--firing-endpoints)
   - [Family & Nominees Endpoints](#613-family--nominees-endpoints)
   - [Encrypted Document Vault Endpoints](#614-encrypted-document-vault-endpoints)
   - [Welfare & Counseling Endpoints](#615-welfare--counseling-endpoints)
   - [AI Stress Prediction & Wellness Endpoints](#616-ai-stress-prediction--wellness-endpoints)
   - [Grievance & Complaints Endpoints](#617-grievance--complaints-endpoints)
   - [Secure Messaging & Emergency Siren Endpoints](#618-secure-messaging--emergency-siren-endpoints)
   - [AI Assistant Natural Language Chat Endpoints](#619-ai-assistant-natural-language-chat-endpoints)
7. [Mobile Client Development & Integration Guide](#7-mobile-client-development--integration-guide)
8. [Step-by-Step System Recreation & Execution Guide](#8-step-by-step-system-recreation--execution-guide)

---

## 1. SYSTEM TOPOLOGY & HOST ENVIRONMENT

```
+-------------------------------------------------------------------------------+
|                             CLIENT APPS LAYER                                |
|  React 18 Web App (Port 3000)  <--->  Companion Mobile App (Flutter/React Nat)|
+-------------------------------------------------------------------------------+
                                      |
                      HTTP / REST / JSON / Bearer JWT
                                      |
+-------------------------------------------------------------------------------+
|                      BACKEND GATEWAY (FastAPI / Port 7777)                   |
|  Prefix: /api/v1                                                              |
|  CORS: http://localhost:3000, http://127.0.0.1:3000, Mobile Origins (*)       |
|  Auth: JWT HMAC-SHA256 (7-day validity)                                       |
+-------------------------------------------------------------------------------+
                                      |
                         SQLAlchemy 2.0 ORM Engine
                                      |
+-------------------------------------------------------------------------------+
|                         DATABASE (SQLite: hrms.db)                            |
|  26 Relational Tables • StaticPool Connection Pool • Auto-Migrations          |
+-------------------------------------------------------------------------------+
```

| Service | Technology | Port | Base URL |
| :--- | :--- | :---: | :--- |
| **Backend REST API** | FastAPI / Python 3.12 | `7777` | `http://localhost:7777/api/v1` (or `http://<LAN-IP>:7777/api/v1` for Mobile) |
| **Frontend Web App** | React 18 / Vite / TS | `3000` | `http://localhost:3000` |
| **Database** | SQLite 3 (`hrms.db`) | File | `sqlite:///./hrms.db` |

---

## 2. DEFAULT CREDENTIALS & ROLE HIERARCHY

| Email | Password | Role | Name & Rank | Scoped Permissions |
| :--- | :--- | :---: | :--- | :--- |
| `admin@company.com` | `admin123` | **`HR`** | HR Administrator / Commander (Col. Kabir Khan) | Full unit oversight, roster creation, payroll batch run, APAR grading, armory handover, siren broadcasts |
| `alex@company.com` | `employee123` | **`EMPLOYEE`** | Major Alex Morgan (ID: `DUM_1`) | Self-service medical file, payslips, weapon custody, station preferences, leave applications, AI burnout survey |
| `sarah@company.com` | `employee123` | **`EMPLOYEE`** | Captain Sarah Connor (ID: `DUM_2`) | Self-service personnel view, mission logs, duty shifts, grievance filing |

---

## 3. FULL-STACK ARCHITECTURE & DATA FLOW

### 1. Request Lifecycle
1. **Client Request:** Web or Mobile client dispatches an HTTP request with `Authorization: Bearer <jwt_token>`.
2. **Security Interceptor:** FastAPI executes dependency `get_current_user_optional` (or `get_current_user`), verifying token signature against `SECRET_KEY`.
3. **Domain Router:** The router matches `/api/v1/<domain>/*`, injects the `db: Session` from connection pool, and executes business logic.
4. **Data Serialization:** Pydantic DTO schemas validate request bodies on input and serialize ORM models to JSON on response.

---

## 4. DATABASE MODELS & SCHEMAS

The SQLite database (`hrms.db`) contains **26 relational models** defined under `backend/app/models/`:

### Core Entities:
1. **`users` (`user.py`)**: `id`, `email`, `hashed_password`, `role` (`HR` | `EMPLOYEE`), `full_name`, `employee_id`, `avatar`.
2. **`employees` (`employee.py`)**: `id`, `full_name`, `email`, `role`, `department`, `status`, `avatar`, `location`, `joined_date`.
3. **`attendance` (`attendance.py`)**: `id`, `employee_id`, `date`, `status`, `check_in_time`, `check_out_time`, `work_hours`, `location_lat`, `location_lng`.
4. **`leave_requests` (`leave.py`)**: `id`, `employee_id`, `leave_type`, `start_date`, `end_date`, `days`, `reason`, `status` (`Pending` | `Approved` | `Rejected` | `Cancelled`), `reviewed_by`.

### Force Management Entities:
5. **`duty_assignments` (`duty.py`)**: `id`, `personnel_id`, `duty_type`, `shift_name`, `date`, `start_time`, `end_time`, `location`, `status`.
6. **`deployment_records` (`deployment.py`)**: `id`, `personnel_id`, `mission_name`, `deployment_type`, `location`, `role`, `start_date`, `end_date`, `status`.
7. **`welfare_requests` (`welfare.py`)**: `id`, `personnel_id`, `category`, `urgency`, `title`, `description`, `requested_amount`, `approved_amount`, `status`, `counselor_assigned`.
8. **`complaints` (`complaint.py`)**: `id`, `personnel_id`, `is_anonymous`, `category`, `urgency`, `subject`, `details`, `status`.
9. **`secure_messages` (`message.py`)**: `id`, `sender_id`, `channel`, `priority`, `title`, `content`, `is_emergency_alert`, `acknowledged_by`.
10. **`wellness_checkins` (`wellness.py`)**: `id`, `personnel_id`, `sleep_hours`, `fatigue_level`, `workload_pressure`, `emotional_wellbeing`, `physical_strain`, `consecutive_duty_days`, `stress_score`, `risk_level`, `ai_analysis`.

### Extended Enterprise Entities:
11. **`medical_profiles` (`medical.py`)**: `id`, `personnel_id`, `service_number`, `medical_category` (`SHAPE-1` to `SHAPE-5`), `blood_group`, `height_cm`, `weight_kg`, `bmi`, `blood_pressure_sys`, `blood_pressure_dia`, `vision_left`, `vision_right`, `hearing_grade`, `ecg_status`, `chronic_conditions`, `allergies`, `next_exam_due_date`.
12. **`medical_examinations` (`medical.py`)**: `id`, `personnel_id`, `exam_type`, `exam_date`, `examining_officer`, `hospital_unit`, `findings`, `category_awarded`, `validity_date`.
13. **`vaccination_records` (`medical.py`)**: `id`, `personnel_id`, `vaccine_name`, `dose_number`, `date_administered`, `batch_number`, `administering_facility`, `next_due_date`.
14. **`service_books` (`career.py`)**: `id`, `personnel_id`, `service_number`, `cadre`, `service_branch`, `battalion`, `company`, `platoon`, `rank`, `joining_date`, `commission_date`, `retirement_date_projected`, `total_service_years`.
15. **`apar_evaluations` (`career.py`)**: `id`, `personnel_id`, `financial_year`, `self_appraisal_summary`, `reporting_officer`, `reporting_score`, `reviewing_officer`, `reviewing_score`, `final_grade`, `integrity_certificate`.
16. **`awards_citations` (`career.py`)**: `id`, `personnel_id`, `award_name`, `category`, `citation_text`, `date_awarded`, `gazette_ref_no`.
17. **`disciplinary_records` (`career.py`)**: `id`, `personnel_id`, `incident_date`, `offense_type`, `inquiry_officer`, `findings`, `penalty_awarded`, `status`.
18. **`salary_structures` (`payroll.py`)**: `id`, `personnel_id`, `pay_level`, `basic_pay`, `military_service_pay`, `dearness_allowance_pct`, `house_rent_allowance_pct`, `transport_allowance`, `field_hardship_allowance`, `nps_deduction_pct`, `income_tax_tds`, `bank_account_masked`, `ifsc_code`.
19. **`monthly_payslips` (`payroll.py`)**: `id`, `personnel_id`, `month`, `year`, `basic_pay`, `military_service_pay`, `da_amount`, `hra_amount`, `transport_allowance`, `field_allowance`, `gross_earnings`, `nps_deduction`, `income_tax_deduction`, `welfare_deduction`, `total_deductions`, `net_salary_disbursed`, `payment_status`.
20. **`pension_settlements` (`payroll.py`)**: `id`, `personnel_id`, `projected_retirement_date`, `ppo_number`, `qualifying_service_years`, `basic_pension`, `commuted_amount`, `death_cum_retirement_gratuity`, `leave_encashment_amount`, `status`.
21. **`tactical_assets` (`asset.py`)**: `id`, `asset_name`, `category`, `serial_number`, `butt_number`, `caliber`, `armory_location`, `condition`, `assigned_personnel_id`, `assigned_personnel_name`, `last_inspection_date`.
22. **`asset_issue_logs` (`asset.py`)**: `id`, `asset_id`, `asset_name`, `butt_number`, `personnel_id`, `duty_type`, `rounds_issued`, `rounds_returned`, `issued_at`, `returned_at`, `issuing_armorer`, `remarks`.
23. **`transfer_orders` (`transfer.py`)**: `id`, `order_number`, `personnel_id`, `from_unit`, `to_unit`, `from_location`, `to_location`, `transfer_type`, `issue_date`, `relieving_date`, `reporting_deadline`, `approving_authority`, `status`.
24. **`posting_preferences` (`transfer.py`)**: `id`, `personnel_id`, `current_tenure_months`, `choice_1_station`, `choice_2_station`, `choice_3_station`, `reason`, `compassionate_ground`, `submission_date`, `board_status`.
25. **`training_courses` / `personnel_certifications` / `firing_records` (`training.py`)**: Tactical courses, grades, and marksmanship shooting scores.
26. **`family_members` / `benefit_nominees` / `personnel_documents` (`family.py`, `document.py`)**: NOK registry, nominee percentage shares, and SHA-256 verified documents.

---

## 5. AUTHENTICATION & MOBILE AUTHORIZATION PROTOCOL

### 1. Login Request
`POST http://localhost:7777/api/v1/auth/login`
```json
// Headers: Content-Type: application/json
{
  "email": "alex@company.com",
  "password": "employee123"
}
```

### 2. Login Response
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "user": {
    "id": "usr_emp_alex",
    "email": "alex@company.com",
    "fullName": "Alex Morgan",
    "role": "EMPLOYEE",
    "employeeId": "DUM_1",
    "avatar": "https://api.dicebear.com/7.x/adventurer/png?seed=DUM_1&size=128"
  }
}
```

### 3. Authenticated Request Header Pattern (Mobile / Web)
All subsequent requests MUST include:
```http
Authorization: Bearer <access_token>
Content-Type: application/json
```

---

## 6. COMPLETE REST API SPECIFICATION (68 ENDPOINTS)

### 6.1 Authentication Endpoints
- `POST /api/v1/auth/login` — Authenticate user and issue JWT.
- `GET /api/v1/auth/me` — Return current authenticated user profile.

### 6.2 Personnel & Profile Endpoints
- `GET /api/v1/employees/` — List all personnel (search: `?search=alex`, filter: `?department=Engineering`).
- `POST /api/v1/employees/` — Register new employee.
- `PUT /api/v1/employees/{id}` — Update employee bio-data.
- `DELETE /api/v1/employees/{id}` — Decommission employee profile.

### 6.3 Attendance & Geolocation Endpoints
- `GET /api/v1/attendance/?date=2026-09-03` — Query daily attendance roster.
- `POST /api/v1/attendance/check-in` — Check in personnel with GPS coordinates.
  ```json
  { "employee_id": "DUM_1", "location_lat": 28.6139, "location_lng": 77.2090 }
  ```
- `POST /api/v1/attendance/check-out` — Check out and record duration.

### 6.4 Leaves Management Endpoints
- `GET /api/v1/leaves/?employee_id=DUM_1` — Query leave history.
- `POST /api/v1/leaves/` — Apply for leave.
  ```json
  {
    "employee_id": "DUM_1",
    "employee_name": "Alex Morgan",
    "leave_type": "Annual Leave",
    "start_date": "2026-10-01",
    "end_date": "2026-10-05",
    "days": 5,
    "reason": "Family obligation"
  }
  ```
- `PATCH /api/v1/leaves/{id}/review` — Approve/Reject leave (Commander only).
  ```json
  { "status": "Approved", "admin_notes": "Granted with full pay" }
  ```

### 6.5 Duty Rosters & Shift Endpoints
- `GET /api/v1/duties/?personnel_id=DUM_1` — Retrieve shift schedule.
- `POST /api/v1/duties/` — Schedule duty shift.
  ```json
  {
    "personnel_id": "DUM_1",
    "personnel_name": "Alex Morgan",
    "duty_type": "Routine Shift",
    "shift_name": "Morning (06:00 - 14:00)",
    "date": "2026-09-04",
    "start_time": "06:00",
    "end_time": "14:00",
    "location": "Operations Control Room",
    "hours": 8,
    "notes": "Perimeter monitoring"
  }
  ```

### 6.6 Deployments & Missions Endpoints
- `GET /api/v1/deployments/?personnel_id=DUM_1` — List tactical deployments.
- `POST /api/v1/deployments/` — Record operational deployment.

### 6.7 Medical & SHAPE Classification Endpoints
- `GET /api/v1/medical/profiles?personnel_id=DUM_1` — Fetch SHAPE medical profile.
- `POST /api/v1/medical/profiles` — Create or update biometrics.
- `GET /api/v1/medical/examinations?personnel_id=DUM_1` — List Annual Medical Exams (AME).
- `POST /api/v1/medical/examinations` — Log AME exam result.
  ```json
  {
    "personnel_id": "DUM_1",
    "personnel_name": "Alex Morgan",
    "exam_type": "Annual Medical Examination (AME)",
    "exam_date": "2026-09-03",
    "examining_officer": "Lt. Col. Dr. V. Rao",
    "hospital_unit": "Military Base Hospital Sector 1",
    "findings": "Cardiovascular and physical endurance optimal.",
    "category_awarded": "SHAPE-1 (Direct Combat Deployable)",
    "validity_date": "2027-09-03"
  }
  ```
- `GET /api/v1/medical/vaccinations?personnel_id=DUM_1` — Immunization records.
- `POST /api/v1/medical/vaccinations` — Log vaccine dose.

### 6.8 Service Book, APAR & Awards Endpoints
- `GET /api/v1/career/service-books?personnel_id=DUM_1` — Retrieve military service book dossier.
- `GET /api/v1/career/apar?personnel_id=DUM_1` — Query APAR performance evaluations.
- `POST /api/v1/career/apar` — Submit APAR grading.
  ```json
  {
    "personnel_id": "DUM_1",
    "personnel_name": "Alex Morgan",
    "financial_year": "2026-2027",
    "self_appraisal_summary": "Managed encrypted data backbone with zero downtime.",
    "reporting_officer": "Col. R. Sharma",
    "reporting_score": 9.4,
    "reporting_remarks": "Outstanding initiative and leadership.",
    "reviewing_officer": "Brig. S. Mehta",
    "reviewing_score": 9.2,
    "reviewing_remarks": "Highly recommended for promotion.",
    "final_grade": "Outstanding (9.0 - 10.0)"
  }
  ```
- `GET /api/v1/career/awards?personnel_id=DUM_1` — Commendations & citations.
- `GET /api/v1/career/disciplinary?personnel_id=DUM_1` — Court of inquiry records.

### 6.9 7th CPC Payroll & Pension Endpoints
- `GET /api/v1/payroll/structures?personnel_id=DUM_1` — Fetch salary scale.
- `GET /api/v1/payroll/payslips?personnel_id=DUM_1` — Fetch disbursed monthly payslips.
- `POST /api/v1/payroll/generate-batch?month=September&year=2026` — Trigger unit batch payroll calculation.
- `GET /api/v1/payroll/pensions?personnel_id=DUM_1` — Projected PPO pension & gratuity settlements.

### 6.10 Armory & Tactical Assets Endpoints
- `GET /api/v1/assets/inventory` — Query firearms, night vision optics, and vehicle assets.
- `POST /api/v1/assets/inventory` — Add firearm/equipment.
- `GET /api/v1/assets/logs?personnel_id=DUM_1` — Armory issue and return handover history.
- `POST /api/v1/assets/issue` — Issue firearm and ammunition.
  ```json
  {
    "asset_id": "ast_1",
    "asset_name": "5.56mm SIG Sauer 716 Patrol Rifle",
    "butt_number": "BN-042",
    "personnel_id": "DUM_1",
    "personnel_name": "Alex Morgan",
    "duty_type": "QRT Standby Duty",
    "rounds_issued": 60,
    "rounds_returned": 0,
    "issued_at": "2026-09-03 06:00",
    "issuing_armorer": "Havildar Kote Incharge"
  }
  ```
- `PATCH /api/v1/assets/logs/{id}/return?returned_at=2026-09-03%2014:00&rounds_returned=60` — Reconcile ammunition & return weapon to armory.

### 6.11 Transfers & Posting Preferences Endpoints
- `GET /api/v1/transfers/orders?personnel_id=DUM_1` — Promulgated rotation transfer orders.
- `POST /api/v1/transfers/orders` — Issue transfer order.
- `GET /api/v1/transfers/preferences?personnel_id=DUM_1` — Personnel station choices.
- `POST /api/v1/transfers/preferences` — Submit 3 posting preferences.
  ```json
  {
    "personnel_id": "DUM_1",
    "personnel_name": "Alex Morgan",
    "current_tenure_months": 28,
    "choice_1_station": "Pune (Southern Command)",
    "choice_2_station": "Bengaluru (Tech Depot)",
    "choice_3_station": "Delhi (Army HQ)",
    "reason": "Completed forward area tenure. Requesting R&D posting.",
    "compassionate_ground": "Tenure Completed",
    "submission_date": "2026-09-03"
  }
  ```

### 6.12 Training, Certifications & Firing Endpoints
- `GET /api/v1/training/courses` — Military training course catalog.
- `GET /api/v1/training/certifications?personnel_id=DUM_1` — Qualification certificates.
- `POST /api/v1/training/certifications` — Award qualification certificate.
- `GET /api/v1/training/firing?personnel_id=DUM_1` — Marksmanship scores.
- `POST /api/v1/training/firing` — Log shooting range accuracy score.
  ```json
  {
    "personnel_id": "DUM_1",
    "personnel_name": "Alex Morgan",
    "weapon_type": "7.62mm SIG Sauer 716",
    "range_location": "Sector 4 Field Firing Range",
    "rounds_fired": 40,
    "score_points": 39,
    "accuracy_percentage": 97.5,
    "classification": "Marksman / Sniper Grade",
    "firing_date": "2026-09-03",
    "range_officer": "Maj. D. Rawat"
  }
  ```

### 6.13 Family & Nominees Endpoints
- `GET /api/v1/family/members?personnel_id=DUM_1` — Next-of-Kin (NOK) emergency directory.
- `POST /api/v1/family/members` — Add dependent / NOK.
- `GET /api/v1/family/nominees?personnel_id=DUM_1` — AGIF & gratuity nominee shares.
- `POST /api/v1/family/nominees` — Register terminal benefit nominee.

### 6.14 Encrypted Document Vault Endpoints
- `GET /api/v1/documents?personnel_id=DUM_1` — Verified digital service dossier.
- `POST /api/v1/documents` — Register document with SHA-256 hash.
- `PATCH /api/v1/documents/{id}/verify` — Verify document in chain of command.

### 6.15 Welfare & Counseling Endpoints
- `GET /api/v1/welfare/?personnel_id=DUM_1` — Welfare & aid requests.
- `POST /api/v1/welfare/` — Submit grant / counseling request.

### 6.16 AI Stress Prediction & Wellness Endpoints
- `GET /api/v1/stress/assessments?personnel_id=DUM_1` — AI stress diagnostic history.
- `POST /api/v1/stress/assessments` — Compute biometric burnout survey.
  ```json
  {
    "personnel_id": "DUM_1",
    "personnel_name": "Alex Morgan",
    "sleep_hours": 7.5,
    "fatigue_level": 3,
    "workload_pressure": 4,
    "emotional_wellbeing": 8,
    "physical_strain": 3,
    "consecutive_duty_days": 2
  }
  ```

### 6.17 Grievance & Complaints Endpoints
- `GET /api/v1/complaints/?personnel_id=DUM_1` — Grievance cases.
- `POST /api/v1/complaints/` — Submit grievance (can be anonymous).

### 6.18 Secure Messaging & Emergency Siren Endpoints
- `GET /api/v1/messages/` — Fetch communications and broadcast notices.
- `POST /api/v1/messages/` — Broadcast siren alert / announcement.
- `PATCH /api/v1/messages/{id}/acknowledge` — Acknowledge emergency siren alert.

### 6.19 AI Assistant Natural Language Chat Endpoints
- `POST /api/v1/chat/` — Query natural language HR assistant chatbot.
  ```json
  { "messages": [{ "role": "user", "content": "What is the policy for Casual Leave?" }] }
  ```

---

## 7. MOBILE CLIENT DEVELOPMENT & INTEGRATION GUIDE

For building a mobile application (Flutter / React Native / Kotlin / Swift):

### 1. Connection Configuration
- **Local Emulator (Android):** Use `http://10.0.2.2:7777/api/v1`
- **Local Simulator (iOS):** Use `http://localhost:7777/api/v1`
- **Physical Device over Wi-Fi:** Use `http://<YOUR_COMPUTER_LAN_IP>:7777/api/v1` (ensure phone & computer are on same Wi-Fi)

### 2. State & Token Persistence
- Store `access_token` in `FlutterSecureStorage` (Flutter) or `EncryptedSharedPreferences` / `AsyncStorage` (React Native).
- Attach an HTTP Interceptor that automatically injects `Authorization: Bearer <access_token>`.

### 3. Recommended Mobile App Architecture
```
mobile_app/
├── lib/ (or src/)
│   ├── api/
│   │   ├── api_client.dart       # Dio / Axios HTTP interceptor
│   │   ├── auth_service.dart     # /api/v1/auth/*
│   │   ├── medical_service.dart  # /api/v1/medical/*
│   │   ├── payroll_service.dart  # /api/v1/payroll/*
│   │   ├── armory_service.dart   # /api/v1/assets/*
│   │   └── wellness_service.dart # /api/v1/stress/*
│   ├── screens/
│   │   ├── login_screen.dart
│   │   ├── dashboard_screen.dart
│   │   ├── medical_screen.dart
│   │   ├── payslip_screen.dart
│   │   ├── armory_screen.dart
│   │   └── emergency_siren_banner.dart
```

---

## 8. STEP-BY-STEP SYSTEM RECREATION & EXECUTION GUIDE

To run or recreate the platform on any workstation:

### 1. Backend Setup (FastAPI & SQLite)
```bash
cd backend
# Create & activate environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install fastapi uvicorn[standard] sqlalchemy pydantic python-jose passlib[bcrypt] pydantic-settings httpx

# Start backend server (Port 7777)
uvicorn app.main:app --reload --port 7777
```
*Note: SQLite database `hrms.db` and demo defense records are created automatically on startup.*

### 2. Frontend Setup (React 18 & Vite)
```bash
cd frontend
# Install dependencies
npm install

# Start Vite dev server (Port 3000)
npm run dev
```

### 3. Verification
- Open `http://localhost:3000` in browser.
- Login as Commander: `admin@company.com` / `admin123`.
- Login as Personnel: `alex@company.com` / `employee123`.
