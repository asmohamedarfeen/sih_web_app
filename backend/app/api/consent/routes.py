from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Request
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.user import User
from backend.app.dependencies.auth import get_current_user
from backend.app.services.consent_service import ConsentService
from backend.app.schemas.consent import (
    ConsentResponse,
    ConsentUpdateRequest,
    ConsentAuditResponse
)

router = APIRouter(prefix="/consent", tags=["Consent & Data Governance"])


@router.get("/preferences", response_model=ConsentResponse)
def get_consent_preferences(
    personnel_uid: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves granular consent preferences for the authenticated personnel
    or targeted personnel if authorized (Welfare / Medical / Admin).
    """
    target_uid = personnel_uid if personnel_uid and current_user.role in [
        "ADMIN", "SUPER_ADMIN", "WELFARE_OFFICER", "MEDICAL_OFFICER"
    ] else current_user.uid

    if not target_uid:
        target_uid = current_user.uid or f"UID-EMP-{current_user.id:03d}"

    service = ConsentService(db)
    return service.get_or_create_consent(target_uid)


@router.post("/preferences", response_model=ConsentResponse)
def update_consent_preferences(
    payload: ConsentUpdateRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Updates the soldier's granular consent preferences with cryptographic audit trail.
    """
    target_uid = current_user.uid or f"UID-EMP-{current_user.id:03d}"
    client_ip = request.client.host if request.client else "127.0.0.1"

    service = ConsentService(db)
    return service.update_consent(
        personnel_uid=target_uid,
        self_assessment=payload.self_assessment,
        duty_roster_telemetry=payload.duty_roster_telemetry,
        biometrics_wearable=payload.biometrics_wearable,
        ai_longitudinal_profiling=payload.ai_longitudinal_profiling,
        actor_name=current_user.full_name,
        reason=payload.consent_reason,
        ip_address=client_ip
    )


@router.get("/audit-log", response_model=List[ConsentAuditResponse])
def get_consent_audit_log(
    personnel_uid: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves the immutable cryptographic audit trail of consent grants and revocations.
    """
    target_uid = None
    if current_user.role not in ["ADMIN", "SUPER_ADMIN", "SECURITY_ADMIN", "WELFARE_OFFICER"]:
        target_uid = current_user.uid or f"UID-EMP-{current_user.id:03d}"
    elif personnel_uid:
        target_uid = personnel_uid

    service = ConsentService(db)
    return service.get_audit_trail(target_uid)


@router.get("/data-flow")
def get_consent_data_flow_map(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Provides a formal, transparent mapping of how personnel telemetry flows through
    the system under active consent agreements, encryption guarantees, and data minimization.
    """
    target_uid = current_user.uid or f"UID-EMP-{current_user.id:03d}"
    service = ConsentService(db)
    pref = service.get_or_create_consent(target_uid)

    return {
        "personnel_uid": target_uid,
        "governance_standard": "Digital Personal Data Protection Act (DPDPA) & Military Medical Ethics",
        "streams": [
            {
                "stream_id": "self_assessment",
                "name": "Psychological Self-Check-Ins",
                "description": "Voluntary subjective mood, fatigue, and stress ratings",
                "is_active": pref.self_assessment,
                "retention_policy": "Rolling 90-day window",
                "encryption": "AES-256 at rest, TLS 1.3 in transit",
                "privileged_recipients": ["WELFARE_OFFICER", "MEDICAL_OFFICER"]
            },
            {
                "stream_id": "duty_roster_telemetry",
                "name": "Deployment & Shift Logs",
                "description": "Duty rosters, night shifts, and leave records from HRMS",
                "is_active": pref.duty_roster_telemetry,
                "retention_policy": "Service duration",
                "encryption": "AES-256 at rest",
                "privileged_recipients": ["COMMANDER", "HR_OFFICER", "WELFARE_OFFICER"]
            },
            {
                "stream_id": "biometrics_wearable",
                "name": "Smart-Band Physiological Metrics",
                "description": "Resting heart rate, HRV, and sleep stages",
                "is_active": pref.biometrics_wearable,
                "retention_policy": "Rolling 30-day cache; raw waves discarded",
                "encryption": "End-to-End Encrypted (E2EE)",
                "privileged_recipients": ["PERSONNEL_SELF", "MEDICAL_OFFICER"]
            },
            {
                "stream_id": "ai_longitudinal_profiling",
                "name": "Predictive Burnout & Digital Twin Analytics",
                "description": "EWMA baseline drift and early fatigue alerts",
                "is_active": pref.ai_longitudinal_profiling,
                "retention_policy": "Aggregated statistical parameters only",
                "encryption": "Pseudonymized with Cryptographic UID",
                "privileged_recipients": ["WELFARE_OFFICER"]
            }
        ]
    }
