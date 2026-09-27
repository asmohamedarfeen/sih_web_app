# Mission-Aware Personnel Recommendation Engine Specification

## 1. System Overview
The **Mission-Aware Personnel Recommendation Engine** is an advanced operational decision-support system for military commanders. Instead of traditional static availability checks ("Who is free?"), it optimizes personnel allocation by synthesizing:
- Biometric & clinical stress trends (21-day velocity and recovery trajectories)
- Operational fatigue & sleep debt telemetry
- Mission criticality & strategic reserve preservation policies
- Tactical skills, rank balance, and team cohesion

## 2. Supported Mission Types & Policy Matrix
| Mission Type | Criticality Tier | Target Readiness Band | Strategic Reserve Policy | Key Skill Demands |
|---|---|---|---|---|
| **Border Patrol** | HIGH | 80 - 100 | Zero tolerance for 21-day stress decline; exclude acute fatigue | High altitude, surveillance, vigilance |
| **Counter Insurgency** | CRITICAL | 85 - 100 | Requires peak resilience; exclude rapid burnout indicators | Urban combat, tactical breach, quick reaction |
| **Election Duty** | MEDIUM | 55 - 75 | **Preserve Strategic Reserves**: Intentionally allocate medium readiness; protect elite units for high threat | Crowd management, de-escalation, liaison |
| **VIP Security** | HIGH | 78 - 100 | High emotional stability and steady stress velocity required | Close protection, defensive driving, protocol |
| **Flood Rescue** | MEDIUM | 60 - 85 | High physical endurance, amphibious skills | Disaster response, water rescue, medical first aid |
| **Disaster Relief** | MEDIUM | 55 - 80 | Balanced endurance and logistics support | Heavy equipment, casualty care, shelter logistics |
| **Training Camp** | LOW | 50 - 75 | Ideal for recovering personnel to rebuild operational stamina | Instruction, mentoring, physical conditioning |

## 3. Core Engine Architecture (`backend/app/services/mission_recommendation_engine.py`)
1. **Candidate Assessment**:
   - Scores each soldier (0-100) based on suitability to mission requirements.
   - Computes:
     - `suitability_score`: Composite metric weighting readiness, stress momentum, sleep deficit, and skill matching.
     - `recommendation_tier`: `HIGHLY_RECOMMENDED`, `SUITABLE`, `RESERVE_CANDIDATE`, `EXCLUDED`.
     - `ai_rationale`: Human-readable explanation of why the soldier was recommended or held back.
2. **Exclusion Guardrails**:
   - Detects negative 21-day stress trajectories, acute surge velocity, sleep debt (<4.5h), or extreme fatigue.
   - Generates Commander Advisory: *"Avoid assigning X personnel whose readiness declined over the last 21 days."*
3. **Strategic Reserve Protection**:
   - For Medium/Low criticality assignments (e.g. Election Duty), actively flags:
     *"Personnel with medium readiness can safely perform this assignment. Preserving N highly mission-ready personnel for strategic high-criticality deployments."*

## 4. API Endpoints
- `GET /api/v1/missions/types`: List available mission types with criteria.
- `POST /api/v1/missions/recommendations`: Calculate AI recommendations for chosen mission, headcount, unit.
- `POST /api/v1/missions/deploy`: Commit roster allocation, save deployment manifest, and log audit entry.
- `GET /api/v1/missions/manifests`: List historical deployment manifests with download/print support.

## 5. UI Implementation
- Top-level page `/mission-planner` accessible to commanders.
- Real-time mission selection with dynamic policy indicators.
- Commander Guidance Banner with explainable AI strategic advice.
- Squad Assembly Roster with candidate suitability badges, radar metrics, and candidate replacement.
- Exclusion / Safety Alerts Panel.
- Interactive Official Deployment Manifest with printable military dispatch format.
