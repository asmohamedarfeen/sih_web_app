from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from backend.app.dependencies.auth import get_current_user, require_roles
from backend.app.models.user import User, RoleEnum
from backend.app.services.mission_impact_simulator import MissionImpactSimulator
from backend.app.schemas.mission_impact import (
    MissionImpactPreset,
    MissionImpactSimulationRequest,
    MissionImpactSimulationResponse,
)

router = APIRouter(prefix="/mission-impact", tags=["Mission Impact Simulator"])

COMMAND_ROLES = [
    RoleEnum.COMMANDER,
    RoleEnum.SUPER_ADMIN,
    RoleEnum.ADMIN,
    RoleEnum.SYS_ADMIN,
    RoleEnum.DEPT_HEAD,
]


@router.get(
    "/presets",
    response_model=List[MissionImpactPreset],
    summary="Get pre-configured tactical command dilemmas"
)
def get_mission_impact_presets(
    current_user: User = Depends(require_roles(COMMAND_ROLES))
):
    """
    Returns built-in high-impact command questions such as:
    - 'What happens if I deploy Bravo Company for another 30 days?'
    - 'What if I rotate Platoon 3 after 15 days?'
    """
    return MissionImpactSimulator.get_presets()


@router.post(
    "/simulate",
    response_model=MissionImpactSimulationResponse,
    summary="Simulate the operational consequences of a command deployment decision"
)
def simulate_mission_decision(
    request: MissionImpactSimulationRequest,
    current_user: User = Depends(require_roles(COMMAND_ROLES))
):
    """
    Simulates readiness changes, burnout rates, leave surges, and predicted recovery times
    for specific operational choices before orders are issued.
    """
    try:
        result = MissionImpactSimulator.simulate_decision(
            unit_id=request.unit_id,
            sub_unit=request.sub_unit,
            additional_deployment_days=request.additional_deployment_days,
            rotation_strategy=request.rotation_strategy,
            rotation_day=request.rotation_day,
            operational_threat_level=request.operational_threat_level,
        )
        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to simulate mission impact: {str(e)}"
        )
