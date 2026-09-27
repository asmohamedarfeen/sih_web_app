from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class ImpactMetricDelta(BaseModel):
    metric_name: str
    baseline_value: float
    projected_value: float
    delta: float
    delta_percentage: float
    direction: str  # "UP", "DOWN", "STABLE"
    sentiment: str  # "POSITIVE", "NEGATIVE", "NEUTRAL"


class SimulationCurvePoint(BaseModel):
    day: int
    readiness: float
    burnout_rate: float
    leave_pressure: float


class MissionImpactPreset(BaseModel):
    id: str
    title: str
    description: str
    unit_id: str
    sub_unit: Optional[str] = None
    additional_deployment_days: int
    rotation_strategy: str
    rotation_day: Optional[int] = None
    operational_threat_level: str


class MissionImpactSimulationRequest(BaseModel):
    unit_id: str = Field(..., example="coy-bravo")
    sub_unit: Optional[str] = Field(default=None, example="Platoon 3")
    additional_deployment_days: int = Field(default=30, ge=1, le=120)
    rotation_strategy: str = Field(default="NO_ROTATION")  # NO_ROTATION, ROTATE_PLATOON_15D, CIRCADIAN_REST, STAGGERED_WATCH
    rotation_day: Optional[int] = Field(default=None, ge=1, le=90)
    operational_threat_level: str = Field(default="STANDARD")  # STANDARD, HIGH_ALTITUDE, URBAN_CORDON, COUNTER_INSURGENCY


class MissionImpactSimulationResponse(BaseModel):
    scenario_title: str
    unit_name: str
    sub_unit: Optional[str] = None
    additional_days: int
    rotation_applied: Optional[str] = None
    readiness_metric: ImpactMetricDelta
    burnout_metric: ImpactMetricDelta
    leave_requests_metric: ImpactMetricDelta
    predicted_recovery_time_days: int
    mission_capability: str  # "Maintained", "Degraded", "Severely Compromised"
    decision_score: int  # 0 - 100
    ai_tactical_assessment: str
    recommendation_headline: str
    counter_scenario_summary: str
    projection_curve: List[SimulationCurvePoint]
