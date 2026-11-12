from datetime import datetime
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.user import User
from backend.app.models.alert import SystemAlert
from backend.app.dependencies.auth import get_current_user
from backend.app.schemas.alert_review import (
    AlertReviewSubmission,
    AlertReviewAuditResponse,
    AlertTriageSummaryResponse
)
from backend.app.services.alert_review_service import AlertReviewService

router = APIRouter(prefix="/alerts", tags=["Alert Management"])


@router.get("/")
def list_alerts(
    severity: Optional[str] = None,
    unacknowledged_only: bool = False,
    review_status: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lists system stress, burnout, and shift alert notifications with clinical review status.
    """
    query = db.query(SystemAlert)
    if severity:
        query = query.filter(SystemAlert.severity == severity.upper())
    if unacknowledged_only:
        query = query.filter(SystemAlert.is_acknowledged == False)
    if review_status:
        query = query.filter(SystemAlert.review_status == review_status.upper())
    
    alerts = query.order_by(SystemAlert.created_at.desc()).all()
    return alerts


@router.get("/triage-summary", response_model=AlertTriageSummaryResponse)
def get_alert_triage_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Aggregates clinical triage statistics: pending reviews, false-positive counts and rates.
    """
    service = AlertReviewService(db)
    return service.get_triage_summary()


@router.post("/{id}/acknowledge")
def acknowledge_alert(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Acknowledges an active alert and records the acknowledging officer.
    """
    alert = db.query(SystemAlert).filter(SystemAlert.id == id).first()
    if not alert:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Alert with ID {id} not found."
        )

    alert.is_acknowledged = True
    alert.acknowledged_by = current_user.full_name
    alert.acknowledged_at = datetime.utcnow()
    
    db.commit()
    db.refresh(alert)

    return {
        "status": "success",
        "message": "Alert acknowledged successfully.",
        "alert": alert
    }


@router.post("/{id}/review")
def submit_human_review(
    id: int,
    payload: AlertReviewSubmission,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Records a human clinical review for an alert with disposition and false-positive logging.
    """
    service = AlertReviewService(db)
    updated_alert = service.submit_review(
        alert_id=id,
        review_data=payload,
        reviewer=current_user
    )
    return {
        "status": "success",
        "message": "Human review recorded successfully.",
        "alert": updated_alert
    }


@router.get("/{id}/review-history", response_model=List[AlertReviewAuditResponse])
def get_alert_review_history(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns full chronological audit trail of human clinical reviews for an alert.
    """
    service = AlertReviewService(db)
    return service.get_review_history(id)
