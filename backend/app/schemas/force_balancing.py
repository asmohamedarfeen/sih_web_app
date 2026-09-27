from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class UnitReadinessStatus(BaseModel):
    unit_id: str
    unit_name: str
    current_readiness: float  # e.g. 92.0
    status_label: str  # "Over-Strained", "Optimal", "Degraded", "Critical"
    headcount: int
    fatigue_index: float
    burnout_risk: str
    leave_queue_count: int


class BalancingAction(BaseModel):
    id: str
    action_type: str  # TRANSFER, ROTATE, DELAY_LEAVE, ADVANCE_RELIEF
    title: str
    description: str
    source_unit: Optional[str] = None
    target_unit: Optional[str] = None
    quantity: int  # e.g. 8 personnel, 2 units, 3 days, 4 days
    unit_measure: str  # "personnel", "units", "days"
    impact_summary: str
    urgency: str  # "IMMEDIATE", "SCHEDULED", "TACTICAL"


class BalancedUnitOutcome(BaseModel):
    unit_id: str
    unit_name: str
    initial_readiness: float
    projected_readiness: float
    delta: float
    in_optimal_band: bool
    burnout_reduction_pct: float


class ForceBalancingPlan(BaseModel):
    plan_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    optimal_band_min: float = 80.0
    optimal_band_max: float = 88.0
    initial_variance: float
    projected_variance: float
    units_initial: List[UnitReadinessStatus]
    recommended_actions: List[BalancingAction]
    projected_outcomes: List[BalancedUnitOutcome]
    executive_summary: str
    total_personnel_transferred: int
    total_units_rotated: int
    leave_delay_days: int
    relief_advance_days: int


class ExecutePlanRequest(BaseModel):
    plan_id: str
    commander_authorization_code: Optional[str] = "CMD-AUTH-BAL-2026"
    notes: Optional[str] = "Approved for formation execution."


class ExecutionReceipt(BaseModel):
    order_id: str
    plan_id: str
    status: str = "TRANSMITTED_TO_BRIGADE"
    executed_at: datetime = Field(default_factory=datetime.utcnow)
    commander_authorization_code: str
    dispatched_actions_count: int
    units_synchronized: List[str]
    message: str
