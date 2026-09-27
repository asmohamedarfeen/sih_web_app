from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from backend.app.dependencies.auth import get_current_user, require_roles
from backend.app.models.user import User, RoleEnum
from backend.app.services.policy_discovery_engine import PolicyDiscoveryEngine
from backend.app.schemas.policy_discovery import (
    EmpiricalDiscovery,
    MiningScanResponse,
    DraftDirectiveRequest,
    PolicyDirectiveResponse,
)

router = APIRouter(prefix="/policy-discovery", tags=["AI Organizational Policy Discovery Engine"])

COMMAND_ROLES = [
    RoleEnum.COMMANDER,
    RoleEnum.SUPER_ADMIN,
    RoleEnum.ADMIN,
    RoleEnum.SYS_ADMIN,
    RoleEnum.DEPT_HEAD,
]


@router.get(
    "/discoveries",
    response_model=List[EmpiricalDiscovery],
    summary="Get all unprogrammed empirical policy discoveries"
)
def get_all_discoveries(
    current_user: User = Depends(require_roles(COMMAND_ROLES))
):
    """
    Returns empirical discoveries uncovered by AI pattern mining across operational telemetry.
    These are data-derived institutional insights that were never pre-programmed.
    """
    return PolicyDiscoveryEngine.get_all_discoveries()


@router.post(
    "/run-mining-scan",
    response_model=MiningScanResponse,
    summary="Execute real-time empirical correlation mining over operational telemetry"
)
def run_mining_scan(
    domain_filter: Optional[str] = Query(None, description="Filter by operational domain"),
    current_user: User = Depends(require_roles(COMMAND_ROLES))
):
    """
    Scans recent operational records, biometric trends, duty rosters, and welfare flags
    to statistically validate causal relationship hypotheses.
    """
    try:
        return PolicyDiscoveryEngine.run_mining_scan(domain_filter=domain_filter)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Mining scan failed: {str(e)}"
        )


@router.post(
    "/draft-directive",
    response_model=PolicyDirectiveResponse,
    summary="Convert an empirical discovery into an actionable military policy directive"
)
def draft_policy_directive(
    request: DraftDirectiveRequest,
    current_user: User = Depends(require_roles(COMMAND_ROLES))
):
    """
    Translates an AI statistical finding into a formal Standing Military Directive draft
    with full empirical audit citation ready for Brigade/Command authorization.
    """
    try:
        commander_name = getattr(current_user, "full_name", None) or "Brig. Santosh Babu"
        directive = PolicyDiscoveryEngine.draft_policy_directive(
            discovery_id=request.discovery_id,
            commander_name=commander_name,
            commander_remarks=request.commander_remarks
        )
        return directive
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to draft policy directive: {str(e)}"
        )
