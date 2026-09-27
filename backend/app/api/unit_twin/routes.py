from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.dependencies.auth import get_current_user, require_roles
from backend.app.models.user import User, RoleEnum
from backend.app.services.unit_digital_twin_engine import UnitDigitalTwinEngine
from backend.app.schemas.unit_digital_twin import (
    BattalionTwinData,
    CompanyTwinData,
    UnitComparisonRequest,
    UnitComparisonResponse,
    UnitSimulationRequest,
    UnitSimulationResponse,
)

router = APIRouter(prefix="/unit-twin", tags=["AI Unit Digital Twin"])

COMMAND_ROLES = [
    RoleEnum.COMMANDER,
    RoleEnum.SUPER_ADMIN,
    RoleEnum.ADMIN,
    RoleEnum.SYS_ADMIN,
    RoleEnum.DEPT_HEAD,
]


@router.get(
    "/battalions",
    response_model=List[BattalionTwinData],
    summary="Get complete digital twin telemetry for all battalions and companies"
)
def get_battalions_twin(
    current_user: User = Depends(require_roles(COMMAND_ROLES))
):
    """
    Returns full digital twins across all companies in the battalion,
    including readiness, fatigue, training, morale, deployment pressure, and leadership stability.
    """
    return UnitDigitalTwinEngine.get_battalions_data()


@router.get(
    "/company/{company_id}",
    response_model=CompanyTwinData,
    summary="Get digital twin profile of a specific company"
)
def get_company_twin(
    company_id: str,
    current_user: User = Depends(require_roles(COMMAND_ROLES))
):
    company = UnitDigitalTwinEngine.get_company_by_id(company_id)
    if not company:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Company Digital Twin '{company_id}' not found."
        )
    return company


@router.post(
    "/compare",
    response_model=UnitComparisonResponse,
    summary="Compare Company A vs Company B head-to-head before operational deployment"
)
def compare_companies(
    request: UnitComparisonRequest,
    current_user: User = Depends(require_roles(COMMAND_ROLES))
):
    """
    Produces side-by-side dimensional deltas and AI Operational Recommendation
    evaluating which unit is optimal for mission deployment.
    """
    return UnitDigitalTwinEngine.compare_units(
        company_a_id=request.unit_a_id,
        company_b_id=request.unit_b_id,
        mission_context=request.mission_context or "Border Patrol",
    )


@router.post(
    "/simulate",
    response_model=UnitSimulationResponse,
    summary="Simulate unit readiness trajectory under varying operational tempo"
)
def simulate_company_readiness(
    request: UnitSimulationRequest,
    current_user: User = Depends(require_roles(COMMAND_ROLES))
):
    """
    Continuously projects company health, wear-and-tear, and identifies
    burnout inflection days over the requested time horizon.
    """
    return UnitDigitalTwinEngine.simulate_unit_trajectory(
        company_id=request.company_id,
        days=request.days,
        operational_tempo=request.operational_tempo,
    )
