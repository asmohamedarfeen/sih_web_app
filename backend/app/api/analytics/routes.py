from fastapi import APIRouter, Depends
from backend.app.models.user import User
from backend.app.dependencies.auth import get_current_user
from backend.app.services.hrms_client import hrms_service

router = APIRouter(prefix="/analytics", tags=["Multi-Dimensional Analytics"])


@router.get("/overview")
def get_analytics_overview(current_user: User = Depends(get_current_user)):
    """
    Returns aggregated analytics for unit stress heatmaps, workload correlation, and leave patterns.
    """
    return {
        "formation_wellness_index": 88.4,
        "stress_trend_7_days": [
            {"day": "Mon", "avg_stress": 38.2, "sleep_hours": 6.8},
            {"day": "Tue", "avg_stress": 41.5, "sleep_hours": 6.4},
            {"day": "Wed", "avg_stress": 46.0, "sleep_hours": 5.9},
            {"day": "Thu", "avg_stress": 44.8, "sleep_hours": 6.1},
            {"day": "Fri", "avg_stress": 52.3, "sleep_hours": 5.2},
            {"day": "Sat", "avg_stress": 48.0, "sleep_hours": 5.8},
            {"day": "Sun", "avg_stress": 39.5, "sleep_hours": 7.1}
        ],
        "unit_heatmaps": [
            {"unit": "High Altitude Guard", "stress_score": 78, "burnout_risk": "HIGH", "headcount": 280},
            {"unit": "Field Artillery 3rd Bn", "stress_score": 64, "burnout_risk": "MODERATE", "headcount": 310},
            {"unit": "Rapid Action Battalion 1", "stress_score": 58, "burnout_risk": "MODERATE", "headcount": 420},
            {"unit": "Signals & Telemetry Wing", "stress_score": 42, "burnout_risk": "LOW", "headcount": 238}
        ],
        "workload_strain_correlation": [
            {"consecutive_days": "1-3 Days", "avg_stress": 32.0, "recovery_pct": 98.0},
            {"consecutive_days": "4-5 Days", "avg_stress": 54.0, "recovery_pct": 86.0},
            {"consecutive_days": "6-7 Days", "avg_stress": 76.0, "recovery_pct": 68.0},
            {"consecutive_days": ">7 Days", "avg_stress": 89.0, "recovery_pct": 42.0}
        ],
        "recovery_intervention_success_rate": 92.5
    }
