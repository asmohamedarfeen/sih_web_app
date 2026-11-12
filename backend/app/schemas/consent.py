from datetime import datetime
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class ConsentPreferenceBase(BaseModel):
    self_assessment: bool = Field(default=True, description="Voluntary psychological self-assessment telemetry")
    duty_roster_telemetry: bool = Field(default=True, description="Deployment shifts, night duties, and leave history")
    biometrics_wearable: bool = Field(default=True, description="Optional smart-band sleep and heart telemetry")
    ai_longitudinal_profiling: bool = Field(default=True, description="Longitudinal stress trend and digital twin modelling")


class ConsentUpdateRequest(ConsentPreferenceBase):
    consent_reason: Optional[str] = Field(default=None, description="Optional soldier reason for consent revision")


class ConsentResponse(ConsentPreferenceBase):
    personnel_uid: str
    version: str
    last_updated_at: datetime

    class Config:
        from_attributes = True


class ConsentAuditResponse(BaseModel):
    id: int
    personnel_uid: str
    action: str
    scope_snapshot: Dict[str, Any]
    actor_name: str
    reason: Optional[str]
    audit_hash: str
    timestamp: datetime

    class Config:
        from_attributes = True
