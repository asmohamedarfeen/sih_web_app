from typing import List, Optional
from pydantic import BaseModel, Field


class CompanyTwinData(BaseModel):
    id: str
    name: str
    battalion: str
    commander_name: str
    commander_rank: str
    strength: int
    readiness: int  # 0 - 100
    fatigue: str  # Low, Medium, High, Critical
    training: str  # Excellent, Good, Adequate, Needs Refresher
    morale: str  # Resilient, Stable, Strained, Vulnerable
    deployment_pressure: str  # Low, Moderate, High, Surge
    leadership_stability: str  # Excellent, Strong, Developing, Volatile
    key_strengths: List[str] = Field(default_factory=list)
    vulnerabilities: List[str] = Field(default_factory=list)
    recent_deployment: str = "30 days ago"
    wear_tear_index: float = 24.5


class BattalionTwinData(BaseModel):
    id: str
    name: str
    strength: int
    average_readiness: float
    commanding_officer: str
    companies: List[CompanyTwinData]


class DimensionDelta(BaseModel):
    dimension: str
    val_a: str
    val_b: str
    advantage: str  # 'A', 'B', 'TIE'
    analysis: str


class AIComparativeVerdict(BaseModel):
    recommended_unit_id: str
    recommended_unit_name: str
    comparative_verdict: str
    operational_rationale: str
    deployment_suitability_score_a: int
    deployment_suitability_score_b: int
    tactical_mitigation_note: str


class UnitComparisonRequest(BaseModel):
    unit_a_id: str
    unit_b_id: str
    mission_context: Optional[str] = "Border Patrol"


class UnitComparisonResponse(BaseModel):
    unit_a: CompanyTwinData
    unit_b: CompanyTwinData
    mission_context: str
    dimension_deltas: List[DimensionDelta]
    ai_recommendation: AIComparativeVerdict


class UnitSimulationRequest(BaseModel):
    company_id: str
    days: int = Field(default=30, ge=7, le=90)
    operational_tempo: str = Field(default="STANDARD")  # STANDARD, HIGH_INTENSITY, SURGE_DEPLOYMENT, REST_CYCLE


class SimulationTimelinePoint(BaseModel):
    day: int
    projected_readiness: float
    projected_fatigue: str
    burnout_probability: float


class UnitSimulationResponse(BaseModel):
    company_id: str
    company_name: str
    operational_tempo: str
    projection_timeline: List[SimulationTimelinePoint]
    burnout_risk_day: Optional[int] = None
    recommended_mitigation: str
