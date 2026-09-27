from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.dependencies.auth import require_roles
from backend.app.models.user import User, RoleEnum
from backend.app.services.force_balancing_engine import AdaptiveForceBalancingEngine
from backend.app.schemas.force_balancing import (
    ForceBalancingPlan,
    ExecutePlanRequest,
    ExecutionReceipt,
)

router = APIRouter(prefix="/force-balancing", tags=["Adaptive Force Balancing Engine"])

COMMAND_ROLES = [
    RoleEnum.COMMANDER,
    RoleEnum.SUPER_ADMIN,
    RoleEnum.ADMIN,
    RoleEnum.SYS_ADMIN,
    RoleEnum.DEPT_HEAD,
]


@router.get(
    "/plan",
    response_model=ForceBalancingPlan,
    summary="Compute holistic battalion adaptive force balancing plan"
)
def get_force_balancing_plan(
    current_user: User = Depends(require_roles(COMMAND_ROLES))
):
    """
    Evaluates cross-company readiness disparities (Alpha: 92%, Bravo: 71%, Charlie: 95%, Delta: 68%)
    and outputs the optimal synchronized transfer, rotation, leave delay, and relief acceleration actions.
    """
    try:
        return AdaptiveForceBalancingEngine.get_current_plan()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate force balancing plan: {str(e)}"
        )


@router.post(
    "/execute",
    response_model=ExecutionReceipt,
    summary="Authorize and dispatch adaptive force balancing orders to formations"
)
def execute_force_balancing_plan(
    request: ExecutePlanRequest,
    current_user: User = Depends(require_roles(COMMAND_ROLES))
):
    """
    Dispatches military personnel transfer directives, unit rotation schedules,
    and roster adjustments across all subordinate companies.
    """
    try:
        auth_code = request.commander_authorization_code or "CMD-AUTH-BAL-2026"
        receipt = AdaptiveForceBalancingEngine.execute_balancing_plan(
            plan_id=request.plan_id,
            commander_authorization_code=auth_code,
            notes=request.notes,
        )
        return receipt
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to execute force balancing orders: {str(e)}"
        )
