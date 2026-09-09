# 🛠️ Comprehensive Technology Stack & Hardware Specification

**Document Version:** `1.0.0-Enterprise-Defense`  
**System Name:** Personnel Stress & Welfare Monitoring System (PSWMS)  
**Target Environment:** Secure Defense Enclaves, On-Premise Cloud & Tactical Edge Deployments  

---

## 1. System Architectural Overview

The Personnel Stress & Welfare Monitoring System (PSWMS) is structured as a multi-tier, defense-grade platform. It integrates Web Command Portals, Native Mobile Soldier Clients, High-Throughput REST APIs, Machine Learning Inference Engines, and Hardware Biometric/IoT Telemetry.

```
+-----------------------------------------------------------------------------------------+
|                                    CLIENT TIER                                          |
|   Commander / Admin Web Portal        Soldier Mobile Companion        Ruggedized Field  |
|   (React 18 + TypeScript + Vite)     (Flutter 3 + Dart 3 Client)      Tactical Tablets  |
+-----------------------------------------------------------------------------------------+
                                             │
                          TLS 1.3 / HTTPS / REST / WebSockets / JWT
                                             │
+-----------------------------------------------------------------------------------------+
|                                  API GATEWAY TIER                                       |
|               FastAPI (Python 3.12) • Uvicorn ASGI • Nginx Reverse Proxy                |
|               Rate Limiting • Security Headers • Non-Repudiation Audit Logs              |
+-----------------------------------------------------------------------------------------+
                         │                                    │
                         ▼                                    ▼
+------------------------------------+   +------------------------------------------------+
|          DATABASE TIER             |   |                 AI / ML TIER                   |
|  PostgreSQL 15+ (Production)       |   |  Scikit-Learn • XGBoost • SHAP (Explainability)|
|  SQLite 3 (Local / Tactical Cache) |   |  Pandas • NumPy • Google Gemini 1.5 Flash      |
|  Redis 7+ (In-Memory Cache)        |   |  Burnout Diagnostic & Stress Risk Predictor    |
+------------------------------------+   +------------------------------------------------+
                                             │
+-----------------------------------------------------------------------------------------+
|                           HARDWARE & PHYSICAL SENSOR LAYER                              |
|   Host Production Servers • Biometric Terminals • Wearable Sleep/HR Telemetry • TPM 2.0 |
+-----------------------------------------------------------------------------------------+
```

---

## 2. Programming Languages

| Language | Version | Ecosystem / Layer | Role & Usage |
| :--- | :---: | :--- | :--- |
| **Python** | `3.12+` | Backend API, AI/ML Services, Data Pipelines | High-performance asynchronous REST API routing, data science modeling, psychometric calculation, and backend microservices. |
| **TypeScript** | `5.4+` | Frontend Web Portal | Type-safe enterprise web application logic, interface contracts, state management, and API client integration. |
| **Dart** | `3.13+` | Mobile Application | Cross-platform soldier mobile application (Android & iOS) enabling offline check-ins and screen time tracking. |
| **SQL** | ANSI / PostgreSQL | Database Layer | Relational data persistence, indexed query execution, relational integrity constraints, and transaction management. |
| **HTML5 & CSS3** | Modern Standards | UI / Web Presentation | Semantic layout structures, accessible web components, and responsive mobile-first responsive rendering. |
| **Bash / Shell** | POSIX / Bash 5+ | DevOps & Automation | Container startup entrypoints, environment provisioning scripts, and automated deployment sequences. |

---

## 3. Software Frameworks & Libraries

### 3.1. Frontend Web Frameworks & Libraries
* **Core Framework:** [React 18.3+](https://react.dev/) (Component-driven architecture using functional components and hooks).
* **Build System:** [Vite 5.2+](https://vitejs.dev/) (Next-generation ultra-fast frontend bundling and hot module replacement).
* **Styling & Design System:**
  * [Tailwind CSS 3.4+](https://tailwindcss.com/) (Utility-first responsive CSS design system).
  * `clsx` & `tailwind-merge` (Dynamic conditional class name merging).
* **State Management:** [Zustand 4.5+](https://zustand-demo.pmnd.rs/) (Lightweight, unopinionated client-side state store for session and role states).
* **Routing & Navigation:** [React Router DOM 6.23+](https://reactrouter.com/) (Client-side routing with role-based protected route wrappers).
* **HTTP Client:** [Axios 1.7+](https://axios-http.com/) (Configured with request interceptors, automatic JWT injection, and 10s request timeout).
* **Data Visualization & Analytics:** [Recharts 2.12+](https://recharts.org/) (Composable SVG charts for radar charts, stress curves, and readiness trends).
* **Iconography:** [Lucide React 0.395+](https://lucide.dev/) (Consistent, clean vector iconography).

### 3.2. Backend Frameworks & Runtimes
* **Web Framework:** [FastAPI 0.111+](https://fastapi.tiangolo.com/) (High-performance, async-native Python web framework based on Starlette).
* **ASGI Server:** [Uvicorn 0.30+](https://www.uvicorn.org/) (Lightning-fast ASGI web server implementation).
* **Data Validation & Schemas:** [Pydantic v2.7+](https://docs.pydantic.dev/) and `pydantic-settings` (Strict type validation and environment configuration).
* **Object-Relational Mapping (ORM):** [SQLAlchemy 2.0+](https://www.sqlalchemy.org/) (Enterprise database abstractions and parameterized queries).
* **Database Migrations:** [Alembic 1.13+](https://alembic.sqlalchemy.org/) (Schema evolution tracking and migration management).
* **Security & Token Management:**
  * `python-jose[cryptography] 3.3+` (HMAC-SHA256 JWT access token encoding and decoding).
  * `passlib[bcrypt] 1.7+` and `bcrypt 4.0+` (Secure cryptographic password hashing with adaptive salt).
* **Networking & HTTP Utilities:**
  * `httpx 0.27+` (Async HTTP client for external integrations and AI gateways).
  * `requests 2.32+` (Synchronous HTTP utilities).
  * `websockets 12.0+` (Bidirectional communication for real-time telemetry and alerts).

### 3.3. Artificial Intelligence & Machine Learning Frameworks
* **Predictive ML Engines:**
  * [Scikit-Learn 1.5+](https://scikit-learn.org/) (Random Forest, Logistic Regression, and Support Vector Classifiers for stress categorization).
  * [XGBoost 2.0+](https://xgboost.readthedocs.io/) (Gradient-boosted decision trees for multi-factor burnout risk scoring).
* **Explainable AI (XAI):** [SHAP 0.45+](https://shap.readthedocs.io/) (SHapley Additive exPlanations to provide commanders with interpretable factor attributions).
* **Scientific Computing & Data Prep:**
  * [Pandas 2.2+](https://pandas.pydata.org/) (High-density telemetry aggregation, duty log normalization).
  * [NumPy 1.26+](https://numpy.org/) & [SciPy 1.13+](https://scipy.org/) (Matrix computation and psychological baseline normal distribution calculations).
  * [Joblib 1.4+](https://joblib.readthedocs.io/) (Fast model serialization and pipeline persistence).
* **Generative & Natural Language AI:** [Google Gemini 1.5 Flash API](https://ai.google.dev/) (Multilingual natural language assistant for welfare queries, mental wellness conversational guidance, and report summarization).

### 3.4. Mobile Application Frameworks
* **Mobile Framework:** [Flutter 3.13+ SDK](https://flutter.dev/) (Single-codebase cross-platform native compilation for iOS and Android).
* **State Management:** [Provider 6.1+](https://pub.dev/packages/provider) (Scoped state management for authentication, check-ins, and screen time).
* **Device Storage:** [shared_preferences 2.2+](https://pub.dev/packages/shared_preferences) (Encrypted local mobile key-value storage).
* **Hardware & Connectivity:**
  * [connectivity_plus 6.0+](https://pub.dev/packages/connectivity_plus) (Monitors offline vs online tactical network status).
  * Device Screen Time & Sensor APIs (Captures usage patterns, sleep timing, and battery/app telemetry).

---

## 4. Databases, Caching & Storage Technologies

| Component | Technology | Version | Purpose in Application |
| :--- | :--- | :---: | :--- |
| **Primary Relational Database** | **PostgreSQL** | `15+` | Production transactional database storing 26+ relational schemas including personnel dossiers, medical SHAPE classifications, duty rosters, and leave ledgers. |
| **Development & Tactical Database** | **SQLite** | `3.40+` | Zero-configuration embedded database (`hrms.db`) used for isolated testing, development, and tactical air-gapped field deployments. |
| **In-Memory Cache & Broker** | **Redis** | `7.0+` | API rate limiting store, user session caching, dashboard metric memoization, and WebSocket pub/sub messaging. |
| **File & Document Storage** | **Local Vault / MinIO** | Current | Secure file vault storing encrypted service books, APAR evaluation records, and PDF wellness dossiers. |

---

## 5. Hardware Specifications & Infrastructure Requirements

To ensure reliable operation across headquarters, command posts, and forward-deployed military bases, the following hardware requirements are established:

### 5.1. Server & Host Infrastructure Hardware (Headquarters / On-Premise Cloud)

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                          HEADQUARTERS SERVER SPECIFICATIONS                            │
│                                                                                        │
│   Component                 Minimum (Dev / Lab)         Recommended (Production / HQ)  │
│   ──────────────────────────────────────────────────────────────────────────────────   │
│   Processor (CPU)           4 Cores (x86_64 / ARM64)    16-32 Cores (Intel Xeon / EPYC)│
│   System Memory (RAM)       8 GB DDR4                   64 GB - 128 GB ECC DDR4/DDR5   │
│   Persistent Storage        100 GB SSD                  1 TB - 2 TB NVMe SSD (RAID 10) │
│   Network Interface Card    1 Gbps Ethernet             Dual 10 Gbps SFP+ (Bonded)     │
│   AI Accelerator (Optional) None (CPU inference)        NVIDIA T4 / A10G / L4 (16GB VRAM│
│   Security Hardware         TPM 2.0 Enabled             Hardware Security Module (HSM) │
│   Power Supply              Single Standard             Redundant Dual PSUs with UPS   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

* **Processor (CPU):** 64-bit Architecture (x86_64 or ARM64 Ampere/Graviton). Server class (Intel Xeon Scalable 3rd/4th Gen or AMD EPYC).
* **System Memory (RAM):**
  * *Minimum:* 8 GB RAM (Development, containerized prototype, single base).
  * *Production:* 64 GB ECC RAM (Supports concurrent REST queries, background ML inference, Redis cache, and Postgres pooling).
* **Storage Systems:**
  * High-speed Enterprise NVMe SSD configured in **RAID 10** for fault tolerance and rapid I/O operations.
* **AI Acceleration (Optional / Target):**
  * Dedicated GPU with Tensor Cores (NVIDIA RTX 4000 Ada, A10G, or T4) for local inference of on-premise Large Language Models and heavy XGBoost matrix training.
* **Hardware Security:**
  * **TPM 2.0 (Trusted Platform Module):** For hardware-level cryptographic key protection and measured boot attestation.
  * **Hardware Security Module (HSM):** Dedicated tamper-resistant appliance for root certificate and JWT signing key storage.

---

### 5.2. Client Workstations & Terminals (Commanders & HR Desks)

* **Form Factor:** Standard Desktop PCs, Laptops, or Secure Thin-Client Terminals.
* **Processor (CPU):** Intel Core i5 / AMD Ryzen 5 or Apple Silicon (M-series) (quad-core or higher).
* **System Memory (RAM):** Minimum 4 GB RAM; 8 GB RAM recommended.
* **Display Resolution:** 1920 × 1080 (Full HD) or higher for optimal data dashboard viewing.
* **Compatible Browsers:** Chromium-based browsers (Google Chrome 100+, Microsoft Edge 100+), Mozilla Firefox 100+, Apple Safari 15+.
* **Peripheral Support:** Smart card / Common Access Card (CAC) readers for biometric multi-factor authentication.

---

### 5.3. Mobile & Handheld Hardware (Soldier & Field App)

* **Supported Devices:**
  * **Android Devices:** Any smartphone running **Android 9.0 (API Level 28)** up to **Android 14/15**. Minimum 2 GB RAM; 4 GB RAM recommended.
  * **iOS Devices:** Apple iPhone models supporting **iOS 14.0** or later.
* **On-Board Hardware Sensors Utilized:**
  * **Biometric Hardware:** Fingerprint scanner (Touch ID / In-display optical/capacitive sensor) or Facial Recognition (Face ID / Android BiometricPrompt API).
  * **Navigation Hardware:** Integrated GNSS / GPS receiver for geofenced duty check-ins and operational location reporting.
  * **Accelerometer & Gyroscope:** Detection of physical activity, step cadence, and sleep restlessness.
  * **Screen / Battery Hardware Monitors:** Telemetry for active screen-on time vs sleep duration analysis.

---

### 5.4. Tactical Field Edge Hardware (Forward Bases & Air-Gapped Units)

```
                    TACTICAL ENCLAVE HARDWARE SETUP
                    
   +───────────────────────────────────+       +───────────────────────────────────+
   |   Ruggedized Commander Tablet     |       |    Biometric Kiosk Terminal       |
   |   • MIL-STD-810H / IP65 Protected |  ◄──► |    • Optical Fingerprint Scanner  |
   |   • Offline-first Local Database  |       |    • Contactless Smart Card Reader|
   |   • Solar / Vehicular 24V Powered |       |    • Iris Scanner (Optional)      |
   +───────────────────────────────────+       +───────────────────────────────────+
```

* **Ruggedized Tablets / Field Laptops:**
  * Certified to **MIL-STD-810H** and **IP65/IP68** water/dust ingress resistance (e.g., Panasonic Toughbook, Dell Latitude Rugged).
  * Operable in extreme temperature ranges (-20°C to +55°C) and high altitudes.
  * Sunlight-readable high-nit touchscreens responsive to gloved operation.
* **Wearables & Telemetry Bands (Field Integration):**
  * Support for Bluetooth Low Energy (BLE 5.0+) commercial and defense-issue smart bands.
  * Captures real-time **Photoplethysmography (PPG)** for Heart Rate (HR), Heart Rate Variability (HRV), and Pulse Oximetry ($SpO_2$) sleep monitoring.
* **Biometric Attendance Kiosks:**
  * Fixed terminal units with FBI PIV / STQC certified optical fingerprint scanners and thermal imaging cameras for base entry verification.

---

## 6. DevOps, Networking & Infrastructure Technologies

| Tool / Technology | Category | Purpose |
| :--- | :--- | :--- |
| **Docker** | Containerization | Builds lightweight, reproducible container images for frontend, backend, and AI services. |
| **Docker Compose** | Multi-Container Orchestration | Local orchestration linking backend API, frontend web, database, and Redis cache. |
| **Nginx** | Reverse Proxy & Web Server | Handles TLS/SSL termination, HTTP security headers, static asset serving, and reverse proxying to FastAPI. |
| **Git / GitHub** | Version Control | Source code versioning, commit message enforcement, and branch security policies. |
| **Pytest & Pytest-asyncio** | Automated Testing | Comprehensive backend test runner validating API routes, database transactions, and ML modules. |
| **ESLint & TypeScript Compiler** | Static Code Analysis | Enforces frontend code quality, lint rules, and compile-time type safety. |

---

## 7. Network Protocols & Communication Standards

* **Application Protocol:** `HTTP/2` and `HTTP/1.1` over `TLS 1.3` (mandatory encryption in transit).
* **Data Serialization:** `JSON` (JavaScript Object Notation) with strict UTF-8 character encoding.
* **Real-Time Transmission:** `WebSockets (WSS)` for instantaneous commander distress sirens and live risk alerts.
* **Authentication Standard:** OAuth 2.0 Bearer Token standard encapsulating RFC 7519 JSON Web Tokens (JWT).
* **Local Data Ingestion:** RESTful batch endpoints accepting sensor telemetry with local store-and-forward queueing.

---

## 8. Summary: Technology Traceability Matrix

| Requirement | Software / Library Selected | Hardware Component Utilized |
| :--- | :--- | :--- |
| **Personnel Web Portal** | React 18, Vite 5, Tailwind CSS | Commander PC, HR Workstation, Full HD Display |
| **Soldier Companion App** | Flutter 3, Dart 3, Provider | Android / iOS Handset, Biometric Sensor, GPS |
| **API & Business Logic** | Python 3.12, FastAPI, Pydantic | Application Server (4-32 Core x86_64/ARM64) |
| **Psychometric Stress AI** | Scikit-Learn, XGBoost, SHAP | Server CPU / NVIDIA GPU (CUDA Acceleration) |
| **Relational Data Storage** | PostgreSQL 15 / SQLite 3 | Enterprise NVMe SSD Storage (RAID 10) |
| **Tamper-Evident Security** | SHA-256 Hashes, Bcrypt, PyJose | TPM 2.0 Cryptographic Chip, HSM |
| **Vitals & Sleep Capture** | Mobile Native Sensor Telemetry | Smartband (BLE), Mobile Accelerometer, Screen Timer |
