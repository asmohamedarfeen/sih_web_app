from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, ForeignKey
from backend.app.database.session import Base


class SystemAlert(Base):
    __tablename__ = "system_alerts"

    id = Column(Integer, primary_key=True, index=True)
    personnel_uid = Column(String(50), index=True, nullable=False)
    personnel_name = Column(String(255), nullable=False)
    rank = Column(String(100), nullable=True)
    unit = Column(String(100), nullable=True)
    
    alert_type = Column(String(100), nullable=False) # STRESS_SPIKE, BURNOUT_WARNING, CONSECUTIVE_SHIFTS, MISSED_ASSESSMENT
    severity = Column(String(50), nullable=False) # CRITICAL, HIGH, MEDIUM, LOW
    trigger_reason = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=True)
    
    is_acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String(255), nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)

    # Human Review & Clinical Triage Path
    review_status = Column(String(50), default="PENDING_REVIEW") # PENDING_REVIEW, UNDER_REVIEW, VALIDATED_ACTIONABLE, DISMISSED_FALSE_POSITIVE, ESCALATED_TO_MEDICAL, WELFARE_INTERVENTION_SCHEDULED
    severity_override = Column(String(50), nullable=True)
    is_false_positive = Column(Boolean, default=False)
    false_positive_reason = Column(String(100), nullable=True) # SENSOR_ARTIFACT, ACUTE_MISSION_EXERTION, ROSTER_REPORTING_LAG, SUBJECTIVE_NORMALIZATION, OTHER
    clinical_notes = Column(Text, nullable=True)
    reviewed_by = Column(String(255), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)


class AlertReviewAudit(Base):
    __tablename__ = "alert_review_audits"

    id = Column(Integer, primary_key=True, index=True)
    alert_id = Column(Integer, ForeignKey("system_alerts.id"), index=True, nullable=False)
    reviewer_uid = Column(String(50), nullable=False)
    reviewer_name = Column(String(255), nullable=False)
    reviewer_role = Column(String(100), nullable=False)
    
    previous_status = Column(String(50), nullable=False)
    new_status = Column(String(50), nullable=False)
    severity_override = Column(String(50), nullable=True)
    
    is_false_positive = Column(Boolean, default=False)
    false_positive_reason = Column(String(100), nullable=True)
    clinical_notes = Column(Text, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
