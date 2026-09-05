from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.models.user import User
from backend.app.dependencies.auth import get_current_user
from backend.app.services.hrms_client import hrms_service
from backend.app.security.sanitization import mask_sensitive_pii, sanitize_string

router = APIRouter(prefix="/reports", tags=["Reports & Dossiers"])


@router.get("/dossier/{uid}")
def generate_personnel_dossier_report(
    uid: str,
    current_user: User = Depends(get_current_user)
):
    """
    Generates a structured, printable defense personnel wellness & operational dossier.
    """
    clean_uid = sanitize_string(uid)
    personnel = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == clean_uid), None)
    
    if not personnel:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Personnel record '{clean_uid}' not found."
        )

    dossier = {
        "report_id": f"RPT-DEF-{clean_uid}-2026",
        "generated_at": datetime.utcnow().isoformat(),
        "generated_by": f"{current_user.full_name} ({current_user.rank})",
        "classification": "CONFIDENTIAL // DEFENSE SENSITIVE",
        "personnel": personnel,
        "operational_readiness": {
            "shape_category": personnel.get("medical_category", "SHAPE-1"),
            "readiness_status": "COMBAT DEPLOYABLE" if personnel.get("medical_category") == "SHAPE-1" else "RESTRICTED",
            "consecutive_shifts": personnel.get("consecutive_duty_days", 1),
            "stress_index": personnel.get("stress_score", 45),
            "burnout_risk": personnel.get("risk_level", "LOW")
        },
        "duty_assignments": [d for d in hrms_service.DUTY_ROSTERS if d["personnel_name"] == personnel["name"]],
        "active_interventions": [w for w in hrms_service.WELFARE_CASES if w["personnel_uid"] == clean_uid],
        "authorized_leaves": [l for l in hrms_service.LEAVE_APPLICATIONS if l["personnel_name"] == personnel["name"]]
    }

    return mask_sensitive_pii(dossier, current_user.role.value)


@router.get("/unit-summary")
def generate_unit_summary_report(current_user: User = Depends(get_current_user)):
    """
    Generates unit-wide health, readiness, and stress compliance report.
    """
    return {
        "report_title": "Formation Operational Readiness & Stress Diagnostic Dossier",
        "division": "16 Corps Command Division",
        "generated_at": datetime.utcnow().isoformat(),
        "overall_readiness": "94.2%",
        "total_strength": 1248,
        "high_risk_personnel_count": 4,
        "kote_armory_secure_pct": "98.4%",
        "active_cases": 4,
        "recommendation": "Maintain scheduled rotational rest for High Altitude Guard unit."
    }
