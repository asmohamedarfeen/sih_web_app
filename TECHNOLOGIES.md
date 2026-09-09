# 🛠️ Technologies & Hardware Specifications

For the complete, formatted specification with system topology diagrams, see:
👉 **[docs/architecture/TECHNOLOGY_STACK.md](file:///Users/asmohamedarfeen/Desktop/project/sih_webapp/docs/architecture/TECHNOLOGY_STACK.md)**

---

## Quick Reference Summary

### 1. Programming Languages
- **Python 3.12+**: Asynchronous backend REST API, AI/ML services, psychometric scoring algorithms.
- **TypeScript 5.4+ / JavaScript (ES2022+)**: Strict type-safe frontend web portal development.
- **Dart 3.13+**: Cross-platform soldier companion mobile application (Android & iOS).
- **SQL**: Relational persistence and schema migrations across PostgreSQL & SQLite.
- **HTML5 & CSS3**: Semantic layouts, responsive UI styling, and accessibility compliance.
- **Bash / POSIX Shell**: Automated environment deployment, container orchestration scripts.

### 2. Software Frameworks & Libraries
- **Frontend Web Portal**:
  - React 18.3+, Vite 5.2+, Tailwind CSS 3.4+, Zustand 4.5+, Axios 1.7+, Recharts 2.12+, Lucide React.
- **Backend API Gateway**:
  - FastAPI 0.111+, Uvicorn 0.30+, Pydantic v2.7+, SQLAlchemy 2.0+, Alembic 1.13+, python-jose, bcrypt, passlib, websockets.
- **AI & Machine Learning**:
  - Scikit-Learn 1.5+, XGBoost 2.0+, SHAP 0.45+ (Explainable AI), Pandas 2.2+, NumPy 1.26+, SciPy 1.13+, Joblib 1.4+, Google Gemini 1.5 Flash API.
- **Mobile Application**:
  - Flutter 3.13+ SDK, Provider 6.1+, Shared Preferences 2.2+, Connectivity Plus 6.0+.
- **Testing & Quality Assurance**:
  - Pytest 8.2+, Pytest-asyncio, ESLint, TypeScript Compiler (`tsc`).

### 3. Database & Caching
- **PostgreSQL 15+**: Enterprise relational database for production environments.
- **SQLite 3**: Embedded database (`hrms.db`) for tactical edge / air-gapped field deployments.
- **Redis 7+**: In-memory caching, rate limiting, and real-time alert pub/sub broker.

### 4. Hardware Specifications
- **Host / Production Servers**:
  - *Minimum:* 4 Cores (x86_64/ARM64), 8 GB RAM, 100 GB SSD.
  * *Recommended Production:* 16-32 Cores (Intel Xeon / AMD EPYC), 64-128 GB ECC RAM, 1-2 TB Enterprise NVMe SSD (RAID 10), Dual 10 Gbps bonded network cards.
  * *AI Inference Accelerator (Target):* NVIDIA T4 / A10G / L4 (16GB VRAM) for on-premise local model inference.
  * *Hardware Security:* TPM 2.0 chip and Hardware Security Module (HSM).
- **Client Terminals / Workstations**:
  - Desktop / Laptop / Secure Thin-Client (Intel Core i5 / AMD Ryzen 5 / Apple M-series), 8 GB RAM, 1080p display, Chrome 100+ / Edge / Firefox / Safari.
- **Soldier Mobile Hardware**:
  - Android (Android 9.0+ / API 28+) & iOS (iOS 14.0+) smartphones.
  - Sensors: Biometric fingerprint / Face recognition, GNSS / GPS receiver, accelerometer, gyroscope, battery/screen timer telemetry.
- **Tactical Field Edge & IoT Wearables**:
  - Ruggedized field tablets (MIL-STD-810H, IP65/IP68 rated) for extreme weather and forward base command.
  - Biometric base entry kiosks (optical fingerprint scanner, smart card reader).
  - Health wearables (BLE 5.0+ pulse oximeter, heart rate variability, sleep cycle sensor).

### 5. DevOps & Containerization
- **Docker & Docker Compose**: Microservice containerization and isolated local stack execution.
- **Nginx**: Reverse proxy, TLS 1.3 termination, rate-limiting, and security headers.
