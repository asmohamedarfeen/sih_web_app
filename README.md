# Personnel Stress & Welfare Monitoring System (PSWMS)
## Enterprise Web Application

An AI-driven enterprise defense & strategic welfare monitoring platform designed to assess, predict, and support the mental wellness, operational readiness, and stress resilience of defense and organizational personnel.

---

## 🏗️ Folder Structure Overview

```text
web-application/
├── frontend/                        # React + TypeScript + Vite + Tailwind CSS Web App
│   ├── public/
│   ├── src/
│   │   ├── app/                     # App initialization
│   │   ├── assets/                  # Media & Fonts
│   │   ├── components/              # Atomic UI components
│   │   ├── layouts/                 # Dashboard layouts
│   │   ├── pages/                   # 25 domain feature views
│   │   ├── hooks/                   # Custom React hooks
│   │   ├── services/                # API communication layer
│   │   ├── store/                   # Global state (Zustand / Redux)
│   │   ├── routes/                  # App routing
│   │   └── styles/                  # Tailwind & global CSS
│   └── tests/
│
├── backend/                         # Python FastAPI REST API Gateway
│   ├── app/
│   │   ├── api/                     # 23 domain route controllers
│   │   ├── core/ & config/          # App settings & security
│   │   ├── database/                # SQLAlchemy session & ORM
│   │   ├── models/ & schemas/       # Database models & Pydantic DTOs
│   │   ├── repositories/            # Data access layer
│   │   ├── services/                # Business logic & workflows
│   │   └── ai/                      # AI integration layer
│   └── tests/
│
├── database/                        # PostgreSQL / SQLite migrations, seeders & scripts
├── ai-services/                     # ML pipelines for stress, burnout & explainable AI
├── docs/                            # PRD, Architecture, Security & API Documentation
├── deployment/                      # Docker, Nginx, deployment scripts & environments
├── shared/                          # Cross-tier constants, enums, permissions & types
└── resources/                       # Brand icons, logos, mock-data & fonts
```

---

## 🚀 Getting Started

### 1. Backend Service
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 2. Frontend Application
```bash
cd frontend
npm install
npm run dev
```

### 3. AI Services
```bash
cd ai-services
pip install -r requirements.txt
```
