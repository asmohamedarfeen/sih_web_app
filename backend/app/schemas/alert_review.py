from datetime import datetime
from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field


class AlertReviewSubmission(BaseModel):
    review_status: str = Field(
        ...,
        description="VALIDATED_ACTIONABLE, DISMISSED_FALSE_POSITIVE, ESCALATED_TO_MEDICAL, WELFARE_INTERVENTION_SCHEDULED, UNDER_REVIEW"
    )
    severity_override: Optional[str] = Field(default=None, description="CRITICAL, HIGH, MEDIUM, LOW")
    is_false_positive: bool = Field(default=False, description="Flag indicating model false alarm")
    false_positive_reason: Optional[str] = Field(
        default=None,
        description="SENSOR_ARTIFACT, ACUTE_MISSION_EXERTION, ROSTER_REPORTING_LAG, SUBJECTIVE_NORMALIZATION, OTHER"
    )
    clinical_notes: str = Field(..., description="Mandatory clinician / welfare rationale")


class AlertReviewAuditResponse(BaseModel):
    id: int
    alert_id: int
    reviewer_uid: str
    reviewer_name: str
    reviewer_role: str
    previous_status: str
    new_status: str
    severity_override: Optional[str]
    is_false_positive: bool
    false_positive_reason: Optional[str]
    clinical_notes: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class AlertTriageSummaryResponse(BaseModel):
    total_alerts: int
    pending_review_count: int
    validated_actionable_count: int
    false_positive_count: int
    false_positive_rate: float
    status_breakdown: Dict[str, int]
    false_positive_reasons_breakdown: Dict[str, int]
