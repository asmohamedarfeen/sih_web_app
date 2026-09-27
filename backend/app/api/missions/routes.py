from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.dependencies.auth import get_current_user, require_roles
from backend.app.models.user import User, RoleEnum
from backend.app.services.mission_recommendation_engine import (
    MissionRecommendationEngine,
)
from backend.app.schemas.mission import (
    MissionTypeInfo,
    MissionRecommendationRequest,
    MissionRecommendationResponse,
    MissionDeploymentRequest,
    MissionDeploymentManifest,
)

router = APIRouter(prefix="/missions", tags=["Mission Recommendation & Deployment"])

ALLOWED_MISSION_ROLES = [
    RoleEnum.COMMANDER,
    RoleEnum.SUPER_ADMIN,
    RoleEnum.ADMIN,
    RoleEnum.SYS_ADMIN,
    RoleEnum.SECURITY_ADMIN,
    RoleEnum.DEPT_HEAD,
]


@router.get(
    "/types",
    response_model=List[MissionTypeInfo],
    summary="Get all supported tactical mission types and operational criteria"
)
def get_mission_types(
    current_user: User = Depends(get_current_user)
):
    """
    Returns catalogue of standard military mission types, criticality profiles,
    and strategic reserve conservation policies.
    """
    return MissionRecommendationEngine.get_available_mission_types()


@router.post(
    "/recommendations",
    response_model=MissionRecommendationResponse,
    summary="Compute AI-optimized personnel recommendation roster for mission"
)
def generate_mission_recommendations(
    request: MissionRecommendationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(ALLOWED_MISSION_ROLES)),
):
    """
    Evaluates personnel pool against operational parameters:
    - 21-day stress trajectory screening (penalizes or excludes declining soldiers)
    - Fatigue and sleep debt telemetry guardrails
    - Strategic reserve preservation (protects elite assets during non-kinetic missions)
    - Role and tactical skill matching
    """
    try:
        recommendations = MissionRecommendationEngine.evaluate_candidates_for_mission(
            mission_type=request.mission_type,
            headcount_required=request.headcount_required,
            unit=request.unit or current_user.unit or "Alpha Battalion",
        )
        return recommendations
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate mission recommendations: {str(e)}"
        )


@router.post(
    "/deploy",
    response_model=MissionDeploymentManifest,
    summary="Execute operational deployment order and generate cryptographically signed manifest"
)
def execute_mission_deployment(
    request: MissionDeploymentRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(ALLOWED_MISSION_ROLES)),
):
    """
    Commits squad assignment, records deployment manifest, and applies
    tamper-evident digital signature for official military dispatch.
    """
    if not request.assigned_personnel_uids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one personnel UID must be specified for deployment."
        )

    manifest = MissionRecommendationEngine.execute_deployment(
        mission_type=request.mission_type,
        unit=request.unit or current_user.unit or "Alpha Battalion",
        assigned_uids=request.assigned_personnel_uids,
        deployment_location=request.deployment_location,
        start_date=request.start_date,
        duration_days=request.duration_days,
        commander_remarks=request.commander_remarks,
        commander_name=current_user.full_name or "Commanding Officer",
        commander_uid=current_user.uid,
    )

    return manifest


@router.get(
    "/manifests",
    response_model=List[MissionDeploymentManifest],
    summary="List all executed deployment manifests"
)
def list_deployment_manifests(
    current_user: User = Depends(require_roles(ALLOWED_MISSION_ROLES)),
):
    """
    Retrieves history of issued mission deployment orders and verification digests.
    """
    return MissionRecommendationEngine.list_manifests()
