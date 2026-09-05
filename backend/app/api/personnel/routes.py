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

