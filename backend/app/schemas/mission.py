from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class MissionTypeInfo(BaseModel):
    type: str = Field(..., description="Mission designation")
    criticality: str = Field(..., description="CRITICAL, HIGH, MEDIUM, LOW")
    target_readiness_range: str = Field(..., description="Optimal readiness score range")
    preserve_strategic_reserves: bool = Field(..., description="Whether to conserve elite personnel")
    description: str
    primary_skills: List[str]


class CandidateAssessment(BaseModel):
    uid: str
    name: str
    rank: str
    unit: str
    current_readiness: float
    stress_score: float
    readiness_trend_21d: float
    consecutive_duty_days: int
    sleep_hours_avg: float
    skills: List[str]
    suitability_score: float
    recommendation_tier: str  # HIGHLY_RECOMMENDED, SUITABLE, RESERVE_CANDIDATE, EXCLUDED
    ai_rationale: str
    match_factors: Dict[str, Any] = Field(default_factory=dict)


class ExcludedCandidate(BaseModel):
    uid: str
    name: str
    rank: str
    unit: str
    reason: str
    readiness: float
    trend_21d: float
    sleep_hours_avg: float


class CommanderAdvisory(BaseModel):
    headline: str
    strategic_guidance: str
    safety_warning: Optional[str] = None
    exclusions_count: int
    strategic_preserved_count: int


class MissionRecommendationRequest(BaseModel):
    mission_type: str = Field(..., example="Border Patrol")
    headcount_required: int = Field(default=4, ge=1, le=50)
    unit: Optional[str] = Field(default=None, example="Alpha Battalion")
    start_date: Optional[str] = None
    duration_days: Optional[int] = Field(default=14, ge=1, le=365)
    mission_notes: Optional[str] = None


class MissionRecommendationResponse(BaseModel):
    mission_type: str
    criticality: str
    required_headcount: int
    recommended_squad: List[CandidateAssessment]
    reserve_candidates: List[CandidateAssessment]
    excluded_personnel: List[ExcludedCandidate]
    strategic_reserves_preserved: List[CandidateAssessment]
    commander_advisory: CommanderAdvisory
    average_squad_readiness: float
    timestamp: datetime = Field(default_factory=datetime.utcnow)


class MissionDeploymentRequest(BaseModel):
    mission_type: str
    unit: str
    assigned_personnel_uids: List[str]
    deployment_location: str
    start_date: str
    duration_days: int
    commander_remarks: Optional[str] = None


class DeploymentManifestRosterItem(BaseModel):
    uid: str
    name: str
    rank: str
    role_in_mission: str
    readiness_at_dispatch: float
    suitability_score: float


class MissionDeploymentManifest(BaseModel):
    manifest_id: str
    mission_type: str
    unit: str
    status: str = "DISPATCHED"
    deployment_location: str
    start_date: str
    duration_days: int
    assigned_roster: List[DeploymentManifestRosterItem]
    commander_remarks: Optional[str] = None
    issued_by: str
    issued_at: datetime
    digital_signature_hash: str
