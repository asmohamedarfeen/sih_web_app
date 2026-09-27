from datetime import datetime
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field


class EmpiricalDiscovery(BaseModel):
    id: str
    domain: str  # DEPLOYMENT_LENGTH, CIRCADIAN_WATCH, TRANSFER_POSTING, SLEEP_DEBT, LEAVE_DEFERRAL
    domain_label: str
    trigger_condition: str
    empirical_impact: str
    affected_metric: str
    impact_percentage: float
    direction: str  # UP, DOWN
    confidence_score: float  # e.g. 96.4
    p_value: float  # e.g. 0.0008
    sample_size: int  # e.g. 1420
    policy_recommendation: str
    suggested_order_code: str
    unprogrammed_discovery_badge: str = "Empirically Discovered by AI (Unprogrammed)"
    actionable_directive_draft: str


class MiningScanResponse(BaseModel):
    total_records_analyzed: int
    data_timespan: str
    scan_timestamp: datetime = Field(default_factory=datetime.utcnow)
    correlations_evaluated: int
    newly_verified_discoveries: List[EmpiricalDiscovery]


class DraftDirectiveRequest(BaseModel):
    discovery_id: str
    commander_remarks: Optional[str] = "Enact immediate standing policy update."


class PolicyDirectiveResponse(BaseModel):
    directive_code: str
    title: str
    discovery_id: str
    policy_directive_text: str
    commander_remarks: str
    authorizing_commander: str
    status: str = "DRAFTED_FOR_APPROVAL"
    issued_at: datetime = Field(default_factory=datetime.utcnow)
    empirical_evidence: Dict[str, Any]
