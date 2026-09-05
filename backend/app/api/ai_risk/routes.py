from pydantic import BaseModel, Field
from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.models.user import User
from backend.app.dependencies.auth import get_current_user
from backend.app.services.ai_risk_engine import ai_risk_engine
from backend.app.services.hrms_client import hrms_service

router = APIRouter(prefix="/ai-risk", tags=["AI Risk Assessment"])


class PredictRequest(BaseModel):
    personnel_uid: str
    sleep_hours: float = Field(..., ge=1.0, le=14.0)
    fatigue_level: int = Field(..., ge=1, le=10)
    mood_score: int = Field(..., ge=1, le=10)
    workload_pressure: int = Field(..., ge=1, le=10)
    physical_strain: int = Field(..., ge=1, le=10)
    consecutive_duty_days: int = Field(default=1, ge=1, le=30)


@router.post("/predict")
def compute_ai_risk(
    req: PredictRequest,
    current_user: User = Depends(get_current_user)
):
    """
    Computes explainable AI stress prediction, burnout probability, and clinical guidance.
    """
    evaluation = ai_risk_engine.evaluate_risk(
        sleep_hours=req.sleep_hours,
        fatigue_level=req.fatigue_level,
        mood_score=req.mood_score,
        workload_pressure=req.workload_pressure,
        physical_strain=req.physical_strain,
        consecutive_duty_days=req.consecutive_duty_days
    )

    return {
        "personnel_uid": req.personnel_uid,
        "evaluation": evaluation
    }


@router.get("/analytics")
def get_risk_distribution(current_user: User = Depends(get_current_user)):
    """
    Returns organization-wide stress risk distribution and key trigger factors.
    """
    personnel = hrms_service.PERSONNEL_DATABASE
    total = len(personnel)
    
    critical = sum(1 for p in personnel if p["risk_level"] == "CRITICAL")
    high = sum(1 for p in personnel if p["risk_level"] == "HIGH")
    moderate = sum(1 for p in personnel if p["risk_level"] == "MODERATE")
    low = sum(1 for p in personnel if p["risk_level"] == "LOW")

    return {
        "total_monitored": total,
        "distribution": {
            "CRITICAL": {"count": critical, "percentage": round((critical / total) * 100, 1)},
            "HIGH": {"count": high, "percentage": round((high / total) * 100, 1)},
            "MODERATE": {"count": moderate, "percentage": round((moderate / total) * 100, 1)},
            "LOW": {"count": low, "percentage": round((low / total) * 100, 1)}
        },
        "top_contributing_triggers": [
            {"trigger": "Hypoxia / Extreme Altitude Night Watch", "affected_count": 2, "severity": "CRITICAL"},
            {"trigger": "Chronic Sleep Deficit (<4.5 hours)", "affected_count": 3, "severity": "HIGH"},
            {"trigger": "Consecutive High-Tempo Shifts (>6 days)", "affected_count": 2, "severity": "HIGH"},
            {"trigger": "Prolonged Screen & Radar Monitoring", "affected_count": 1, "severity": "MODERATE"}
        ]
    }
