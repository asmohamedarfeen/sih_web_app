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
    pre_intervention_score: Optional[float] = 78.0


class StatusUpdate(BaseModel):
    status: str = Field(..., description="OPEN, IN_PROGRESS, RESOLVED, CLOSED")
    notes: Optional[str] = None


class SessionDebriefRequest(BaseModel):
    counselor_notes: str = Field(..., description="Clinical / Welfare session observation debrief notes")
    observed_stress_score: float = Field(..., ge=10.0, le=99.0, description="Measured post-session stress reading")
    recovery_status: str = Field(default="IMPROVING", description="IMPROVING, STABLE, RELAPSE_RISK, RECOVERED")
    next_review_date: Optional[str] = "Next Week"
    coping_rating: Optional[int] = Field(default=8, ge=1, le=10, description="Observed adaptive coping response (1-10)")


@router.get("/")
def list_interventions(
    status_filter: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lists active and resolved welfare intervention cases with full recovery milestones.
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
    Creates a new welfare intervention case with baseline pre-intervention telemetry.
    """
    personnel = next((p for p in hrms_service.PERSONNEL_DATABASE if p["uid"] == req.personnel_uid), None)
    name = personnel["name"] if personnel else "Personnel Officer"
    rank = personnel["rank"] if personnel else "Officer"
    unit = personnel["unit"] if personnel else current_user.unit
    baseline_stress = float(personnel.get("stress_score", req.pre_intervention_score or 78.0)) if personnel else float(req.pre_intervention_score or 78.0)

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
        pre_intervention_score=baseline_stress,
        post_intervention_score=None,
        recovery_status="IN_PROGRESS",
        sessions_log=[],
        next_review_date="Scheduled 7-Day Review",
        timeline=[
            {"date": datetime.utcnow().strftime("%Y-%m-%d %H:%M"), "event": f"Case opened by {current_user.full_name} with Baseline Stress: {baseline_stress}/100"}
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


@router.post("/{id}/sessions")
def log_counseling_session(
    id: int,
    req: SessionDebriefRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Closed-Loop Clinical Recovery Engine:
    Logs a follow-up counseling session, updates post-intervention stress reading,
    computes stress reduction delta, and registers recovery milestone.
    """
    case = db.query(Intervention).filter(Intervention.id == id).first()
    if not case:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Intervention case with ID {id} not found."
        )

    # Calculate stress delta
    pre_score = float(case.pre_intervention_score or 78.0)
    post_score = float(req.observed_stress_score)
    delta_pct = round(((pre_score - post_score) / pre_score) * 100.0, 1)

    case.post_intervention_score = post_score
    case.recovery_status = req.recovery_status.upper()
    case.next_review_date = req.next_review_date

    # Auto-resolve if clinically stabilized
    if post_score <= 45.0 and case.status != "RESOLVED":
        case.status = "RESOLVED"

    # Append to sessions log
    current_sessions = list(case.sessions_log or [])
    current_sessions.append({
        "session_number": len(current_sessions) + 1,
        "date": datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
        "counselor": current_user.full_name,
        "notes": req.counselor_notes,
        "stress_reading": post_score,
        "coping_rating": req.coping_rating,
        "recovery_status": req.recovery_status.upper(),
        "stress_reduction_pct": delta_pct
    })
    case.sessions_log = current_sessions

    # Append to timeline
    current_timeline = list(case.timeline or [])
    current_timeline.append({
        "date": datetime.utcnow().strftime("%Y-%m-%d %H:%M"),
        "event": f"Session #{len(current_sessions)} debrief logged by {current_user.full_name}: Stress dropped from {pre_score} to {post_score} ({delta_pct}% improvement). Status: {req.recovery_status.upper()}."
    })
    case.timeline = current_timeline

    db.commit()
    db.refresh(case)

    return {
        "status": "success",
        "message": f"Counseling session debrief recorded. Observed {delta_pct}% stress reduction.",
        "case": case,
        "recovery_metrics": {
            "pre_intervention_score": pre_score,
            "post_intervention_score": post_score,
            "stress_reduction_pct": delta_pct,
            "recovery_status": req.recovery_status.upper(),
            "total_sessions_completed": len(current_sessions)
        }
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
