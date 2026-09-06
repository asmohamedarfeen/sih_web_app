from pydantic import BaseModel, Field
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.user import User
from backend.app.models.assessment import Assessment
from backend.app.dependencies.auth import get_current_user, get_optional_current_user
from backend.app.services.ai_risk_engine import ai_risk_engine
from backend.app.services.hrms_client import hrms_service

router = APIRouter(prefix="/wellness", tags=["Wellness & Assessments"])


class AssessmentCreate(BaseModel):
    personnel_uid: str
    sleep_hours: float = Field(..., ge=1.0, le=14.0)
    fatigue_level: int = Field(..., ge=1, le=10)
    mood_score: int = Field(..., ge=1, le=10)
    workload_pressure: int = Field(..., ge=1, le=10)
    physical_strain: int = Field(..., ge=1, le=10)
    consecutive_duty_days: int = Field(default=1, ge=1, le=30)
    notes: Optional[str] = None


@router.get("/assessments")
def get_assessment_history(
    personnel_uid: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves assessment submission history.
    """
    query = db.query(Assessment)
    if personnel_uid:
        query = query.filter(Assessment.personnel_uid == personnel_uid)
    
    records = query.order_by(Assessment.submitted_at.desc()).limit(50).all()
    
    # Fallback to simulated sample assessments if database is freshly initialized
    if not records:
        return [
            {
                "id": 1,
                "personnel_uid": "UID-EMP-012",
                "personnel_name": "Havildar Ramesh Chand",
                "sleep_hours": 3.8,
                "fatigue_level": 9,
                "mood_score": 3,
                "workload_pressure": 9,
                "physical_strain": 8,
                "consecutive_duty_days": 8,
                "stress_score": 88.0,
                "risk_level": "CRITICAL",
                "submitted_at": "2026-09-04T06:30:00Z"
            },
            {
                "id": 2,
                "personnel_uid": "UID-EMP-013",
                "personnel_name": "Subedar Gurpreet Singh",
                "sleep_hours": 4.2,
                "fatigue_level": 8,
                "mood_score": 4,
                "workload_pressure": 8,
                "physical_strain": 7,
                "consecutive_duty_days": 5,
                "stress_score": 82.0,
                "risk_level": "HIGH",
                "submitted_at": "2026-09-04T07:15:00Z"
            },
            {
                "id": 3,
                "personnel_uid": "UID-EMP-010",
                "personnel_name": "Major Alex Morgan",
                "sleep_hours": 4.5,
                "fatigue_level": 7,
                "mood_score": 5,
                "workload_pressure": 8,
                "physical_strain": 7,
                "consecutive_duty_days": 6,
                "stress_score": 78.0,
                "risk_level": "HIGH",
                "submitted_at": "2026-09-04T08:00:00Z"
            },
            {
                "id": 4,
                "personnel_uid": "UID-EMP-011",
                "personnel_name": "Captain Sarah Connor",
                "sleep_hours": 7.5,
                "fatigue_level": 3,
                "mood_score": 8,
                "workload_pressure": 4,
                "physical_strain": 3,
                "consecutive_duty_days": 2,
                "stress_score": 42.0,
                "risk_level": "LOW",
                "submitted_at": "2026-09-04T08:45:00Z"
            }
        ]

    return records


@router.post("/assessments")
def submit_assessment(
    req: AssessmentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Submits a daily wellness telemetry check-in and computes AI diagnostic prediction.
    """
    personnel = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == req.personnel_uid), None)
    name = personnel["name"] if personnel else current_user.full_name
    rank = personnel["rank"] if personnel else current_user.rank
    unit = personnel["unit"] if personnel else current_user.unit
    branch = personnel["branch"] if personnel else current_user.branch

    assessment = Assessment(
        personnel_uid=req.personnel_uid,
        personnel_name=name,
        rank=rank,
        unit=unit,
        branch=branch,
        sleep_hours=req.sleep_hours,
        fatigue_level=req.fatigue_level,
        mood_score=req.mood_score,
        workload_pressure=req.workload_pressure,
        physical_strain=req.physical_strain,
        consecutive_duty_days=req.consecutive_duty_days,
        notes=req.notes
    )
    db.add(assessment)
    db.commit()
    db.refresh(assessment)

    # Dynamically update the soldier's sleep_quality telemetry in PERSONNEL_DATABASE
    target_personnel = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == req.personnel_uid), None)
    if target_personnel and "params" in target_personnel:
        sleep_strain = max(10, min(95, round(100 - (req.sleep_hours * 10))))
        target_personnel["sleep_hours"] = req.sleep_hours
        target_personnel["fatigue_level"] = req.fatigue_level
        target_personnel["params"]["sleep_quality"] = {
            "score": sleep_strain,
            "available": True,
            "source": "Soldier Mobile App (Sleep Telemetry)",
            "note": f"Logged via Soldier Mobile App ({req.sleep_hours}h sleep recorded, fatigue level {req.fatigue_level}/10)."
        }
        if "sleep_quality" in target_personnel.get("missing_telemetry", []):
            target_personnel["missing_telemetry"].remove("sleep_quality")
            target_personnel["data_completeness_pct"] = int((8 - len(target_personnel["missing_telemetry"])) / 8 * 100)
            if len(target_personnel["missing_telemetry"]) == 0:
                target_personnel["hrms_sync_status"] = "SYNCHRONIZED"

    # Compute AI Risk
    evaluation = ai_risk_engine.evaluate_risk(
        sleep_hours=req.sleep_hours,
        fatigue_level=req.fatigue_level,
        mood_score=req.mood_score,
        workload_pressure=req.workload_pressure,
        physical_strain=req.physical_strain,
        consecutive_duty_days=req.consecutive_duty_days
    )

    return {
        "status": "success",
        "message": "Wellness assessment logged successfully.",
        "assessment_id": assessment.id,
        "evaluation": evaluation
    }


class BatchSyncItem(BaseModel):
    client_id: Optional[str] = None
    personnel_uid: str
    sleep_hours: float = Field(..., ge=1.0, le=14.0)
    fatigue_level: int = Field(..., ge=1, le=10)
    mood_score: int = Field(..., ge=1, le=10)
    workload_pressure: int = Field(..., ge=1, le=10)
    physical_strain: int = Field(..., ge=1, le=10)
    consecutive_duty_days: int = Field(default=1, ge=1, le=30)
    notes: Optional[str] = None
    logged_at_offline: Optional[str] = None


class BatchSyncRequest(BaseModel):
    items: List[BatchSyncItem]


@router.post("/batch-sync")
def batch_sync_assessments(
    req: BatchSyncRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Receives an offline queue of wellness assessments from mobile client and syncs them to database.
    """
    synced_ids = []
    for item in req.items:
        personnel = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == item.personnel_uid), None)
        name = personnel["name"] if personnel else current_user.full_name
        rank = personnel["rank"] if personnel else current_user.rank
        unit = personnel["unit"] if personnel else current_user.unit
        branch = personnel["branch"] if personnel else current_user.branch

        assessment = Assessment(
            personnel_uid=item.personnel_uid,
            personnel_name=name,
            rank=rank,
            unit=unit,
            branch=branch,
            sleep_hours=item.sleep_hours,
            fatigue_level=item.fatigue_level,
            mood_score=item.mood_score,
            workload_pressure=item.workload_pressure,
            physical_strain=item.physical_strain,
            consecutive_duty_days=item.consecutive_duty_days,
            notes=f"[Mobile Offline Sync] {item.notes or ''}".strip()
        )
        db.add(assessment)
        db.commit()
        db.refresh(assessment)

        # Update telemetry in PERSONNEL_DATABASE
        if personnel and "params" in personnel:
            sleep_strain = max(10, min(95, round(100 - (item.sleep_hours * 10))))
            personnel["sleep_hours"] = item.sleep_hours
            personnel["fatigue_level"] = item.fatigue_level
            personnel["params"]["sleep_quality"] = {
                "score": sleep_strain,
                "available": True,
                "source": "Soldier Mobile App (Sleep Telemetry)",
                "note": f"Logged via Soldier Mobile App offline sync ({item.sleep_hours}h sleep recorded)."
            }
            if "sleep_quality" in personnel.get("missing_telemetry", []):
                personnel["missing_telemetry"].remove("sleep_quality")
                personnel["data_completeness_pct"] = int((8 - len(personnel["missing_telemetry"])) / 8 * 100)
                if len(personnel["missing_telemetry"]) == 0:
                    personnel["hrms_sync_status"] = "SYNCHRONIZED"

        synced_ids.append({
            "client_id": item.client_id,
            "server_id": assessment.id,
            "status": "SYNCED"
        })

    return {
        "status": "success",
        "synced_count": len(synced_ids),
        "results": synced_ids
    }


# ==============================================================================
# SCREEN TIME TELEMETRY & WELFARE ANALYTICS PIPELINE
# ==============================================================================

class AppUsageBreakdown(BaseModel):
    app_name: str
    category: str
    duration_minutes: int
    percentage: Optional[float] = None


class ScreenTimeSubmission(BaseModel):
    personnel_uid: str
    total_screen_time_minutes: int
    unlock_count: int = Field(default=42)
    night_exposure_minutes: int = Field(default=0)
    app_breakdown: List[AppUsageBreakdown]
    device_model: Optional[str] = "Defense Secured Terminal"
    notes: Optional[str] = None


# Persistent in-memory screen time registry with verified personnel entries
SCREEN_TIME_REGISTRY = [
    {
        "personnel_uid": "UID-SLD-015",
        "personnel_name": "Sepoy Amit Kumar",
        "rank": "Sepoy / Commando",
        "unit": "10 Para Special Forces",
        "branch": "Indian Army",
        "total_screen_time_minutes": 322, # 5h 22m
        "total_formatted": "5h 22m",
        "unlock_count": 48,
        "night_exposure_minutes": 95,
        "night_exposure_formatted": "1h 35m",
        "fatigue_risk_tag": "Elevated Night Exposure (High Fatigue Correlate)",
        "last_sync": "Just now",
        "device_model": "Mil-Spec Tactical Android 14",
        "app_breakdown": [
            {
                "app_name": "Tactical Comms & C3I",
                "category": "Mission Operations",
                "duration_minutes": 130,
                "duration_formatted": "2h 10m",
                "percentage": 40.4
            },
            {
                "app_name": "Defense GIS & Topo Maps",
                "category": "Navigation & Terrain",
                "duration_minutes": 85,
                "duration_formatted": "1h 25m",
                "percentage": 26.4
            },
            {
                "app_name": "Forces Secure Messenger",
                "category": "Secure Communication",
                "duration_minutes": 72,
                "duration_formatted": "1h 12m",
                "percentage": 22.4
            },
            {
                "app_name": "Defense News & Weather Radar",
                "category": "Information & Weather",
                "duration_minutes": 35,
                "duration_formatted": "35m",
                "percentage": 10.8
            }
        ]
    },
    {
        "personnel_uid": "UID-EMP-012",
        "personnel_name": "Havildar Ramesh Chand",
        "rank": "Havildar",
        "unit": "Rapid Action Battalion 1",
        "branch": "CRPF",
        "total_screen_time_minutes": 410, # 6h 50m
        "total_formatted": "6h 50m",
        "unlock_count": 62,
        "night_exposure_minutes": 140,
        "night_exposure_formatted": "2h 20m",
        "fatigue_risk_tag": "Critical Night Shift Exposure (High Burnout Risk)",
        "last_sync": "15 mins ago",
        "device_model": "CRPF Tactical Pad",
        "app_breakdown": [
            {
                "app_name": "Night Vigil Telemetry Terminal",
                "category": "Perimeter Surveillance",
                "duration_minutes": 220,
                "duration_formatted": "3h 40m",
                "percentage": 53.6
            },
            {
                "app_name": "Internal Logistics & Dispatch",
                "category": "Supply Chain",
                "duration_minutes": 110,
                "duration_formatted": "1h 50m",
                "percentage": 26.8
            },
            {
                "app_name": "Messaging & Family Contact",
                "category": "Personal Communication",
                "duration_minutes": 80,
                "duration_formatted": "1h 20m",
                "percentage": 19.6
            }
        ]
    },
    {
        "personnel_uid": "UID-EMP-010",
        "personnel_name": "Major Alex Morgan",
        "rank": "Major / Field Ops Lead",
        "unit": "Rapid Action Battalion 1",
        "branch": "CRPF",
        "total_screen_time_minutes": 290, # 4h 50m
        "total_formatted": "4h 50m",
        "unlock_count": 35,
        "night_exposure_minutes": 45,
        "night_exposure_formatted": "45m",
        "fatigue_risk_tag": "Nominal Usage (Balanced)",
        "last_sync": "1 hour ago",
        "device_model": "Encrypted Command Handset",
        "app_breakdown": [
            {
                "app_name": "Battalion Ops Console",
                "category": "Command & Control",
                "duration_minutes": 150,
                "duration_formatted": "2h 30m",
                "percentage": 51.7
            },
            {
                "app_name": "Encrypted Email Client",
                "category": "Official Correspondence",
                "duration_minutes": 85,
                "duration_formatted": "1h 25m",
                "percentage": 29.3
            },
            {
                "app_name": "Tactical Satellite Briefings",
                "category": "Intel Briefing",
                "duration_minutes": 55,
                "duration_formatted": "55m",
                "percentage": 19.0
            }
        ]
    },
    {
        "personnel_uid": "UID-EMP-013",
        "personnel_name": "Subedar Gurpreet Singh",
        "rank": "Subedar",
        "unit": "Field Artillery 3rd Bn",
        "branch": "Indian Army",
        "total_screen_time_minutes": 360, # 6h 00m
        "total_formatted": "6h 00m",
        "unlock_count": 55,
        "night_exposure_minutes": 110,
        "night_exposure_formatted": "1h 50m",
        "fatigue_risk_tag": "Elevated Night Exposure",
        "last_sync": "2 hours ago",
        "device_model": "Artillery Fire-Control Terminal",
        "app_breakdown": [
            {
                "app_name": "Ballistics & Range Calculator",
                "category": "Field Computing",
                "duration_minutes": 180,
                "duration_formatted": "3h 00m",
                "percentage": 50.0
            },
            {
                "app_name": "Battery Maintenance Portal",
                "category": "Equipment Logistics",
                "duration_minutes": 100,
                "duration_formatted": "1h 40m",
                "percentage": 27.8
            },
            {
                "app_name": "News & Family Call",
                "category": "Personal & Media",
                "duration_minutes": 80,
                "duration_formatted": "1h 20m",
                "percentage": 22.2
            }
        ]
    }
]


@router.post("/screen-time")
def submit_screen_time(
    req: ScreenTimeSubmission,
    current_user: User = Depends(get_current_user)
):
    """
    Ingests mobile device screen time telemetry and updates the Welfare Officer monitoring view.
    """
    personnel = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == req.personnel_uid), None)
    name = personnel["name"] if personnel else current_user.full_name
    rank = personnel["rank"] if personnel else current_user.rank
    unit = personnel["unit"] if personnel else current_user.unit
    branch = personnel["branch"] if personnel else current_user.branch

    hours = req.total_screen_time_minutes // 60
    mins = req.total_screen_time_minutes % 60
    total_fmt = f"{hours}h {mins}m" if hours > 0 else f"{mins}m"

    night_hours = req.night_exposure_minutes // 60
    night_mins = req.night_exposure_minutes % 60
    night_fmt = f"{night_hours}h {night_mins}m" if night_hours > 0 else f"{night_mins}m"

    fatigue_tag = "Critical Night Shift Exposure" if req.night_exposure_minutes > 120 else "Elevated Night Exposure" if req.night_exposure_minutes > 60 else "Nominal Usage"

    formatted_breakdown = []
    total_m = max(req.total_screen_time_minutes, 1)
    for app in req.app_breakdown:
        h = app.duration_minutes // 60
        m = app.duration_minutes % 60
        app_fmt = f"{h}h {m}m" if h > 0 else f"{m}m"
        formatted_breakdown.append({
            "app_name": app.app_name,
            "category": app.category,
            "duration_minutes": app.duration_minutes,
            "duration_formatted": app_fmt,
            "percentage": round((app.duration_minutes / total_m) * 100, 1)
        })

    record = {
        "personnel_uid": req.personnel_uid,
        "personnel_name": name,
        "rank": rank,
        "unit": unit,
        "branch": branch,
        "total_screen_time_minutes": req.total_screen_time_minutes,
        "total_formatted": total_fmt,
        "unlock_count": req.unlock_count,
        "night_exposure_minutes": req.night_exposure_minutes,
        "night_exposure_formatted": night_fmt,
        "fatigue_risk_tag": fatigue_tag,
        "last_sync": "Just now (Live Mobile Sync)",
        "device_model": req.device_model,
        "app_breakdown": formatted_breakdown
    }

    # Upsert into registry
    existing_idx = next((i for i, r in enumerate(SCREEN_TIME_REGISTRY) if r["personnel_uid"] == req.personnel_uid), -1)
    if existing_idx >= 0:
        SCREEN_TIME_REGISTRY[existing_idx] = record
    else:
        SCREEN_TIME_REGISTRY.insert(0, record)

    return {
        "status": "success",
        "message": "Screen time telemetry ingested and projected to Welfare Officer console.",
        "record": record
    }



# ==============================================================================
# 8-PARAMETER DEFENSE BURNOUT PREDICTION PIPELINE
# ==============================================================================

class BurnoutPredictionRequest(BaseModel):
    personnel_uid: Optional[str] = "UID-EMP-012"
    leave_patterns: float = Field(default=65.0, ge=0.0, le=100.0)
    overtime: float = Field(default=70.0, ge=0.0, le=100.0)
    workload_trend: float = Field(default=75.0, ge=0.0, le=100.0)
    deployment_duration: float = Field(default=80.0, ge=0.0, le=100.0)
    duty_schedule: float = Field(default=72.0, ge=0.0, le=100.0)
    sleep_quality: float = Field(default=78.0, ge=0.0, le=100.0)
    emotional_exhaustion: float = Field(default=76.0, ge=0.0, le=100.0)
    assessment_responses: float = Field(default=74.0, ge=0.0, le=100.0)


@router.post("/burnout-prediction/evaluate")
def evaluate_burnout_prediction(
    req: BurnoutPredictionRequest,
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Evaluates multi-variate Burnout Prediction using the standardized 8 defense parameters:
    1. Leave patterns
    2. Overtime
    3. Workload trend
    4. Deployment duration
    5. Duty schedule
    6. Sleep quality
    7. Emotional exhaustion score
    8. Assessment responses
    """
    personnel = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == req.personnel_uid), None)
    name = personnel["name"] if personnel else (current_user.full_name if current_user else "Havildar Ramesh Chand")
    rank = personnel["rank"] if personnel else (current_user.rank if current_user else "Havildar")
    unit = personnel["unit"] if personnel else (current_user.unit if current_user else "High Altitude Guard")

    result = ai_risk_engine.predict_burnout_from_8_parameters(
        leave_patterns=req.leave_patterns,
        overtime=req.overtime,
        workload_trend=req.workload_trend,
        deployment_duration=req.deployment_duration,
        duty_schedule=req.duty_schedule,
        sleep_quality=req.sleep_quality,
        emotional_exhaustion=req.emotional_exhaustion,
        assessment_responses=req.assessment_responses
    )

    result["personnel"] = {
        "uid": req.personnel_uid,
        "name": name,
        "rank": rank,
        "unit": unit
    }

    return {
        "status": "success",
        "data": result
    }


# ==============================================================================
# 7-PARAMETER PSYCHOLOGICAL DISTRESS PREDICTION PIPELINE
# ==============================================================================

class PsychologicalDistressPredictionRequest(BaseModel):
    personnel_uid: Optional[str] = "UID-EMP-013"
    mood_assessments: float = Field(default=60.0, ge=0.0, le=100.0)
    anxiety_questions: float = Field(default=65.0, ge=0.0, le=100.0)
    depression_indicators: float = Field(default=58.0, ge=0.0, le=100.0)
    sleep_quality: float = Field(default=72.0, ge=0.0, le=100.0)
    social_isolation: float = Field(default=50.0, ge=0.0, le=100.0)
    traumatic_exposure: float = Field(default=55.0, ge=0.0, le=100.0)
    wellness_survey: float = Field(default=62.0, ge=0.0, le=100.0)


@router.post("/psychological-distress/evaluate")
def evaluate_psychological_distress(
    req: PsychologicalDistressPredictionRequest,
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Evaluates multi-variate Psychological Distress Prediction using the 7 clinical & operational parameters:
    1. Mood assessments (15%)
    2. Anxiety questions (16%)
    3. Depression indicators (18%)
    4. Sleep quality (14%)
    5. Social isolation (12%)
    6. Traumatic exposure (13%)
    7. Wellness survey (12%)
    """
    personnel = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == req.personnel_uid), None)
    name = personnel["name"] if personnel else (current_user.full_name if current_user else "Subedar Gurpreet Singh")
    rank = personnel["rank"] if personnel else (current_user.rank if current_user else "Subedar")
    unit = personnel["unit"] if personnel else (current_user.unit if current_user else "Field Artillery 3rd Bn")

    result = ai_risk_engine.predict_psychological_distress(
        mood_assessments=req.mood_assessments,
        anxiety_questions=req.anxiety_questions,
        depression_indicators=req.depression_indicators,
        sleep_quality=req.sleep_quality,
        social_isolation=req.social_isolation,
        traumatic_exposure=req.traumatic_exposure,
        wellness_survey=req.wellness_survey
    )

    result["personnel"] = {
        "uid": req.personnel_uid,
        "name": name,
        "rank": rank,
        "unit": unit
    }

    return {
        "status": "success",
        "data": result
    }


# ==============================================================================
# AI-POWERED ADAPTIVE SELF-ASSESSMENT PIPELINE (GEMINI ENGINE)
# ==============================================================================

from backend.app.services.gemini_assessment_engine import gemini_engine, SELF_ASSESSMENT_REGISTRY


class AssessmentQuestionGenRequest(BaseModel):
    personnel_uid: str
    personnel_name: Optional[str] = None
    rank: Optional[str] = None
    unit: Optional[str] = None
    mode: Optional[str] = "daily"
    recent_sleep: Optional[float] = 6.0
    recent_fatigue: Optional[int] = 5
    consecutive_duty_days: Optional[int] = 3


class SelfAssessmentAnswer(BaseModel):
    question_id: str
    domain_id: str
    domain: Optional[str] = None
    score: int = Field(..., ge=1, le=5)
    is_reverse_scored: Optional[bool] = False


class SelfAssessmentSubmission(BaseModel):
    personnel_uid: str
    answers: List[SelfAssessmentAnswer]
    notes: Optional[str] = None


@router.post("/self-assessment/generate-questions")
async def generate_assessment_questions(
    req: AssessmentQuestionGenRequest,
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Generates dynamic, AI-powered contextual psychological self-assessment questions
    using Gemini API with structured clinical domain fallback.
    """
    personnel = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == req.personnel_uid), None)
    name = req.personnel_name or (personnel["name"] if personnel else (current_user.full_name if current_user else "Sepoy Amit Kumar"))
    rank = req.rank or (personnel["rank"] if personnel else (current_user.rank if current_user else "Sepoy"))
    unit = req.unit or (personnel["unit"] if personnel else (current_user.unit if current_user else "10 Para SF"))

    questions = await gemini_engine.generate_dynamic_questions(
        personnel_uid=req.personnel_uid,
        personnel_name=name,
        rank=rank,
        unit=unit,
        mode=req.mode or "daily",
        recent_sleep=req.recent_sleep or 6.0,
        recent_fatigue=req.recent_fatigue or 5,
        consecutive_duty_days=req.consecutive_duty_days or 3
    )

    return {
        "status": "success",
        "personnel_uid": req.personnel_uid,
        "personnel_name": name,
        "mode": req.mode or "daily",
        "question_count": len(questions),
        "questions": questions
    }


@router.post("/self-assessment/submit")
def submit_self_assessment(
    req: SelfAssessmentSubmission,
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Submits a completed soldier self-assessment, computes multi-dimensional psychological scores,
    and publishes the categorical results to the Welfare Officer console.
    """
    personnel = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == req.personnel_uid), None)
    name = personnel["name"] if personnel else (current_user.full_name if current_user else "Sepoy Amit Kumar")
    rank = personnel["rank"] if personnel else (current_user.rank if current_user else "Sepoy / Commando")
    unit = personnel["unit"] if personnel else (current_user.unit if current_user else "10 Para Special Forces")
    branch = personnel["branch"] if personnel else (current_user.branch if current_user else "Indian Army")

    answers_payload = [
        {
            "question_id": a.question_id,
            "domain_id": a.domain_id,
            "domain": a.domain,
            "score": a.score,
            "is_reverse_scored": a.is_reverse_scored
        }
        for a in req.answers
    ]

    record = gemini_engine.evaluate_assessment(
        personnel_uid=req.personnel_uid,
        personnel_name=name,
        rank=rank,
        unit=unit,
        branch=branch,
        answers=answers_payload,
        notes=req.notes
    )

    # Upsert into SELF_ASSESSMENT_REGISTRY
    existing_idx = next((i for i, r in enumerate(SELF_ASSESSMENT_REGISTRY) if r["personnel_uid"] == req.personnel_uid), -1)
    if existing_idx >= 0:
        SELF_ASSESSMENT_REGISTRY[existing_idx] = record
    else:
        SELF_ASSESSMENT_REGISTRY.insert(0, record)

    # Dynamically update the soldier's assessment_responses telemetry strictly with burnout question results
    burnout_domain = next((c for c in record.get("categorical_breakdown", []) if c["domain_id"] == "burnout"), None)
    burnout_strain = round(100.0 - (burnout_domain["score"] if burnout_domain else 50.0), 1)
    burnout_level = burnout_domain.get("risk_level", "MODERATE") if burnout_domain else "MODERATE"

    target_personnel = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == req.personnel_uid), None)
    if target_personnel and "params" in target_personnel:
        target_personnel["params"]["assessment_responses"] = {
            "score": burnout_strain,
            "available": True,
            "source": "Soldier Mobile App (Burnout Questions)",
            "note": f"Live mobile assessment: Burnout questions strain {burnout_strain}% ({burnout_level} hazard)."
        }
        if "assessment_responses" in target_personnel.get("missing_telemetry", []):
            target_personnel["missing_telemetry"].remove("assessment_responses")
            target_personnel["data_completeness_pct"] = int((8 - len(target_personnel["missing_telemetry"])) / 8 * 100)
            if len(target_personnel["missing_telemetry"]) == 0:
                target_personnel["hrms_sync_status"] = "SYNCHRONIZED"

    return {
        "status": "success",
        "message": "Self-assessment evaluated and categorical test scores recorded.",
        "record": record
    }


@router.get("/self-assessment")
def get_all_self_assessments(
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Retrieves all personnel self-assessment score summaries and categorical breakdowns
    for the Welfare Officer console.
    """
    return SELF_ASSESSMENT_REGISTRY


@router.get("/self-assessment/{personnel_uid}")
def get_personnel_self_assessment(
    personnel_uid: str,
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    """
    Retrieves detailed categorical psychological test scores for a specific soldier.
    """
    record = next((r for r in SELF_ASSESSMENT_REGISTRY if r["personnel_uid"] == personnel_uid), None)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Self-assessment record not found for personnel {personnel_uid}"
        )
    return record



