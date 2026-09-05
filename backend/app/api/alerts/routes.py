from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.user import User
from backend.app.models.alert import SystemAlert
from backend.app.dependencies.auth import get_current_user

router = APIRouter(prefix="/alerts", tags=["Alert Management"])


@router.get("/")
def list_alerts(
    severity: Optional[str] = None,
    unacknowledged_only: bool = False,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Lists system stress, burnout, and shift alert notifications.
    """
    query = db.query(SystemAlert)
    if severity:
        query = query.filter(SystemAlert.severity == severity.upper())
    if unacknowledged_only:
        query = query.filter(SystemAlert.is_acknowledged == False)
    
    alerts = query.order_by(SystemAlert.created_at.desc()).all()
    return alerts


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
