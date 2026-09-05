import uuid
from datetime import datetime
from pydantic import BaseModel, Field
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.user import User
from backend.app.models.intervention import Intervention
from backend.app.dependencies.auth import get_current_user
from backend.app.services.hrms_client import hrms_service

router = APIRouter(prefix="/interventions", tags=["Intervention Management"])


class InterventionCreate(BaseModel):
    personnel_uid: str
    category: str
    urgency: str = Field(default="HIGH", description="CRITICAL, HIGH, MODERATE, ROUTINE")
    title: str
    description: Optional[str] = None
    action_plan: Optional[str] = None
    requested_amount: Optional[float] = 0.0
    counseling_date: Optional[str] = None
    venue: Optional[str] = None


class StatusUpdate(BaseModel):
    status: str = Field(..., description="OPEN, IN_PROGRESS, RESOLVED, CLOSED")
    notes: Optional[str] = None


@router.get("/")
def list_interventions(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lists active and resolved welfare intervention cases.
    """
    query = db.query(Intervention)
    if status_filter:
        query = query.filter(Intervention.status == status_filter.upper())
    
    cases = query.order_by(Intervention.created_at.desc()).all()
    return cases


@router.post("/")
def create_intervention(
    req: InterventionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Creates a new welfare intervention case.
    """
    personnel = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == req.personnel_uid), None)
    name = personnel["name"] if personnel else "Personnel Officer"
    rank = personnel["rank"] if personnel else "Officer"
    unit = personnel["unit"] if personnel else current_user.unit

    case_num = f"WLF-2026-{str(uuid.uuid4().hex[:4]).upper()}"

    case = Intervention(
        case_number=case_num,
        personnel_uid=req.personnel_uid,
        personnel_name=name,
        rank=rank,
        unit=unit,
        officer_uid=current_user.uid or "UID-WEL-007",
        counselor_name=current_user.full_name,
        category=req.category,
        urgency=req.urgency.upper(),
        status="IN_PROGRESS",
        title=req.title,
        description=req.description,
        action_plan=req.action_plan,
        requested_amount=req.requested_amount or 0.0,
        approved_amount=req.requested_amount or 0.0,
        counseling_date=req.counseling_date or "Scheduled",
        venue=req.venue or "Welfare Support Clinic",
        timeline=[
            {"date": datetime.utcnow().strftime("%Y-%m-%d %H:%M"), "event": f"Case opened by {current_user.full_name}"}
        ]
    )
    db.add(case)
    db.commit()
    db.refresh(case)

    return {
        "status": "success",
        "message": "Welfare intervention case initiated.",
        "case": case
    }


@router.patch("/{id}/status")
def update_case_status(
    id: int,
    req: StatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Updates the status of an intervention case (e.g. mark RESOLVED or CLOSED).
    """
    case = db.query(Intervention).filter(Intervention.id == id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Intervention case with ID {id} not found."
        )

    case.status = req.status.upper()
    
    # Append to timeline
    current_timeline = list(case.timeline or [])
    current_timeline.append({
        "date": datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
        "event": f"Status updated to {req.status.upper()} by {current_user.full_name}. Notes: {req.notes or 'None'}"
    })
    case.timeline = current_timeline
    
    db.commit()
    db.refresh(case)

    return {
        "status": "success",
        "message": f"Case status updated to {case.status}.",
        "case": case
    }
