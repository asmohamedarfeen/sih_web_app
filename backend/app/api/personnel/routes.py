from typing import List, Optional
from fastapi import APIRouter, Depends, Query, HTTPException, status
from backend.app.models.user import User, RoleEnum
from backend.app.dependencies.auth import get_current_user, require_roles
from backend.app.services.hrms_client import hrms_service
from backend.app.security.sanitization import mask_sensitive_pii, sanitize_string
from backend.app.security.audit_logger import audit_logger

router = APIRouter(prefix="/personnel", tags=["Personnel Management"])

OFFICER_ROLES = [
    RoleEnum.WELFARE_OFFICER,
    RoleEnum.COMMANDER,
    RoleEnum.HR_OFFICER,
    RoleEnum.SUPER_ADMIN,
    RoleEnum.SYS_ADMIN,
    RoleEnum.SECURITY_ADMIN,
    RoleEnum.ADMIN,
    RoleEnum.DEPT_HEAD,
    RoleEnum.MEDICAL_OFFICER,
    RoleEnum.TRAINING_OFFICER,
]


@router.get("/")
def list_personnel(
    search: Optional[str] = Query(None, description="Search by name, UID, or regimental number"),
    unit: Optional[str] = Query(None, description="Filter by military unit"),
    risk_level: Optional[str] = Query(None, description="Filter by risk level (LOW, MODERATE, HIGH, CRITICAL)"),
    current_user: User = Depends(require_roles(OFFICER_ROLES))
):
    """
    Lists personnel directory with role-scoped filtering and anti-tampering sanitization.
    """
    records = hrms_service.PERSONNEL_DATABASE

    if search:
        s = sanitize_string(search.lower())
        records = [
            r for r in records
            if s in r["name"].lower() or s in r["uid"].lower() or s in r["regimental_number"].lower()
        ]

    if unit:
        u = sanitize_string(unit.lower())
        records = [r for r in records if u in r["unit"].lower()]

    if risk_level:
        rl = sanitize_string(risk_level.upper())
        records = [r for r in records if r["risk_level"] == rl]

    return mask_sensitive_pii(records, current_user.role.value)


@router.get("/{uid}")
def get_personnel_dossier(
    uid: str,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves full verified personnel profile dossier.
    """
    clean_uid = sanitize_string(uid)

    # Personnel can only view their own dossier; officers can view all
    if current_user.role == RoleEnum.PERSONNEL and current_user.uid != clean_uid:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Personnel can only access their own dossier."
        )

    record = next((r for r in hrms_service.PERSONNEL_DATABASE if r["uid"] == clean_uid), None)

    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Personnel record with UID '{clean_uid}' not found."
        )

    # Attach related duty, leave, and welfare case records
    dossier = dict(record)
    dossier["duty_shifts"] = [d for d in hrms_service.DUTY_ROSTERS if d["personnel_name"] == record["name"]]
    dossier["welfare_history"] = [w for w in hrms_service.WELFARE_CASES if w["personnel_uid"] == clean_uid]
    dossier["leave_history"] = [l for l in hrms_service.LEAVE_APPLICATIONS if l["personnel_name"] == record["name"]]

    return mask_sensitive_pii(dossier, current_user.role.value)


from pydantic import BaseModel, Field
from datetime import datetime
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.roster_leave import DutyRoster


class RosterSwapRequest(BaseModel):
    source_personnel_uid: str = Field(..., description="UID of high-fatigue soldier to stand down")
    target_personnel_uid: str = Field(..., description="UID of fresh replacement soldier")
    reason: Optional[str] = "Tactical Fatigue De-escalation & Stand-Down Rotation"


@router.post("/roster-swap")
def execute_roster_swap(
    req: RosterSwapRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles([
        RoleEnum.COMMANDER,
        RoleEnum.SUPER_ADMIN,
        RoleEnum.ADMIN,
        RoleEnum.DEPT_HEAD,
        RoleEnum.WELFARE_OFFICER
    ]))
):
    """
    Executes an immediate tactical duty roster swap:
    Reassigns a fatigued or high-risk jawan to Stand-Down status,
    promotes the available replacement to active watch,
    resets consecutive shift counter, and creates an audit record.
    """
    source_p = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == req.source_personnel_uid), None)
    target_p = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == req.target_personnel_uid), None)

    source_name = source_p["name"] if source_p else req.source_personnel_uid
    target_name = target_p["name"] if target_p else req.target_personnel_uid

    # Find or update in database
    roster_entry = db.query(DutyRoster).filter(
        DutyRoster.personnel_uid == req.source_personnel_uid,
        DutyRoster.status == "ACTIVE"
    ).first()

    if roster_entry:
        roster_entry.status = "STAND_DOWN"
        roster_entry.swap_candidate_uid = req.target_personnel_uid
        roster_entry.swap_candidate_name = target_name
        roster_entry.swapped_at = datetime.utcnow()
        roster_entry.swapped_by = current_user.full_name

        # Create replacement active roster
        new_roster = DutyRoster(
            roster_id=f"RST-SWP-{int(datetime.utcnow().timestamp())}",
            personnel_uid=req.target_personnel_uid,
            personnel_name=target_name,
            rank=target_p.get("rank") if target_p else "Sepoy",
            unit=source_p.get("unit") if source_p else "HQ Unit",
            duty_role=roster_entry.duty_role,
            shift_type=roster_entry.shift_type,
            post_location=roster_entry.post_location,
            consecutive_days=1,
            status="ACTIVE",
            swap_recommended=False
        )
        db.add(new_roster)
        db.commit()

    # Also update in-memory telemetry for immediate HUD feedback
    if source_p:
        source_p["consecutive_duty_days"] = 1
        source_p["status"] = "Stand-Down Rest Rotation"
        source_p["fatigue_level"] = max(2, source_p.get("fatigue_level", 8) - 4)
        source_p["stress_score"] = max(35.0, source_p.get("stress_score", 88.0) - 26.0)
        source_p["risk_level"] = "MODERATE" if source_p["stress_score"] > 45 else "LOW"

    # Log operational audit event
    audit_logger.log_security_event(
        event_type="TACTICAL_ROSTER_SWAP",
        user_email=current_user.email,
        details=f"Commander {current_user.full_name} swapped {source_name} (Stood Down) with {target_name} ({req.reason})"
    )

    return {
        "status": "success",
        "message": f"Tactical Roster Swap confirmed: {source_name} stood down for 48h rest rotation; {target_name} deployed to active watch.",
        "relieved_personnel": {
            "uid": req.source_personnel_uid,
            "name": source_name,
            "new_status": "Stand-Down Rest Rotation",
            "consecutive_days": 1
        },
        "deployed_personnel": {
            "uid": req.target_personnel_uid,
            "name": target_name,
            "new_status": "Active Duty Watch"
        },
        "executed_by": current_user.full_name,
        "timestamp": datetime.utcnow().isoformat()
    }


