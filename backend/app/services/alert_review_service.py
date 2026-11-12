from datetime import datetime
from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from backend.app.models.alert import SystemAlert, AlertReviewAudit
from backend.app.models.user import User
from backend.app.schemas.alert_review import AlertReviewSubmission


class AlertReviewService:
    def __init__(self, db: Session):
        self.db = db

    def submit_review(
        self,
        alert_id: int,
        review_data: AlertReviewSubmission,
        reviewer: User
    ) -> SystemAlert:
        """
        Executes human clinical triage review for a tactical alert,
        recording clinical rationale, false positive flags, and creating an audit record.
        """
        alert = self.db.query(SystemAlert).filter(SystemAlert.id == alert_id).first()
        if not alert:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Alert with ID {alert_id} not found."
            )

        previous_status = alert.review_status or "PENDING_REVIEW"
        new_status = review_data.review_status

        # Update SystemAlert state
        alert.review_status = new_status
        alert.clinical_notes = review_data.clinical_notes
        alert.is_false_positive = review_data.is_false_positive
        alert.false_positive_reason = review_data.false_positive_reason
        alert.reviewed_by = reviewer.full_name
        alert.reviewed_at = datetime.utcnow()

        if review_data.severity_override:
            alert.severity_override = review_data.severity_override.upper()

        # Mark acknowledged automatically upon human review
        alert.is_acknowledged = True
        if not alert.acknowledged_by:
            alert.acknowledged_by = reviewer.full_name
            alert.acknowledged_at = datetime.utcnow()

        # Record Audit Trail
        audit_entry = AlertReviewAudit(
            alert_id=alert.id,
            reviewer_uid=reviewer.uid or f"UID-EMP-{reviewer.id:03d}",
            reviewer_name=reviewer.full_name,
            reviewer_role=str(reviewer.role.value if hasattr(reviewer.role, 'value') else reviewer.role),
            previous_status=previous_status,
            new_status=new_status,
            severity_override=review_data.severity_override,
            is_false_positive=review_data.is_false_positive,
            false_positive_reason=review_data.false_positive_reason,
            clinical_notes=review_data.clinical_notes,
            created_at=datetime.utcnow()
        )

        self.db.add(audit_entry)
        self.db.commit()
        self.db.refresh(alert)
        return alert

    def get_review_history(self, alert_id: int) -> List[AlertReviewAudit]:
        """Fetches chronological clinical review history for an alert."""
        return (
            self.db.query(AlertReviewAudit)
            .filter(AlertReviewAudit.alert_id == alert_id)
            .order_by(AlertReviewAudit.created_at.desc())
            .all()
        )

    def get_triage_summary(self) -> Dict[str, Any]:
        """
        Computes aggregate metrics across all alerts:
        pending reviews, validated actionable alerts, false positive count & rates,
        and root-cause false positive distribution.
        """
        alerts = self.db.query(SystemAlert).all()
        total_alerts = len(alerts)
        if total_alerts == 0:
            return {
                "total_alerts": 0,
                "pending_review_count": 0,
                "validated_actionable_count": 0,
                "false_positive_count": 0,
                "false_positive_rate": 0.0,
                "status_breakdown": {},
                "false_positive_reasons_breakdown": {}
            }

        status_breakdown: Dict[str, int] = {}
        false_positive_reasons: Dict[str, int] = {}
        pending_count = 0
        validated_count = 0
        false_positive_count = 0
        reviewed_count = 0

        for a in alerts:
            st = a.review_status or "PENDING_REVIEW"
            status_breakdown[st] = status_breakdown.get(st, 0) + 1

            if st == "PENDING_REVIEW":
                pending_count += 1
            else:
                reviewed_count += 1

            if a.is_false_positive:
                false_positive_count += 1
                reason = a.false_positive_reason or "UNSPECIFIED"
                false_positive_reasons[reason] = false_positive_reasons.get(reason, 0) + 1

            if st == "VALIDATED_ACTIONABLE":
                validated_count += 1

        # False positive rate relative to total reviewed alerts (or total if none reviewed)
        denominator = reviewed_count if reviewed_count > 0 else total_alerts
        fpr = round(false_positive_count / denominator, 3)

        return {
            "total_alerts": total_alerts,
            "pending_review_count": pending_count,
            "validated_actionable_count": validated_count,
            "false_positive_count": false_positive_count,
            "false_positive_rate": fpr,
            "status_breakdown": status_breakdown,
            "false_positive_reasons_breakdown": false_positive_reasons
        }
