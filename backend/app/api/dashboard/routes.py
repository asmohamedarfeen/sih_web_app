from fastapi import APIRouter, Depends, Request, HTTPException, status
from backend.app.models.user import User, RoleEnum
from backend.app.dependencies.auth import get_current_user, require_roles
from backend.app.services.hrms_client import hrms_service
from backend.app.security.audit_logger import audit_logger

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/overview")
def get_dashboard_overview(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Returns role-scoped dashboard data matching the authenticated user's email and role.
    Logs access telemetry with cryptographic SHA-256 integrity hash.
    """
    role = current_user.role
    client_ip = request.client.host if request.client else "unknown"

    audit_logger.log_data_access(
        user_email=current_user.email,
        user_role=current_user.role.value,
        user_uid=current_user.uid,
        endpoint="/dashboard/overview",
        action="RETRIEVE_OVERVIEW_METRICS",
        client_ip=client_ip
    )

    if role in [RoleEnum.WELFARE_OFFICER, RoleEnum.MEDICAL_OFFICER]:
        data = hrms_service.get_welfare_dashboard_data(current_user.email)
    elif role in [RoleEnum.COMMANDER, RoleEnum.DEPT_HEAD]:
        data = hrms_service.get_commander_dashboard_data(current_user.email)
    elif role in [RoleEnum.HR_OFFICER, RoleEnum.TRAINING_OFFICER]:
        data = hrms_service.get_hr_dashboard_data(current_user.email)
    elif role in [RoleEnum.SUPER_ADMIN, RoleEnum.SYS_ADMIN, RoleEnum.SECURITY_ADMIN, RoleEnum.ADMIN]:
        data = hrms_service.get_admin_dashboard_data(current_user.email)
    else:
        data = hrms_service.get_welfare_dashboard_data(current_user.email)

    return {
        "role": role.value,
        "user_email": current_user.email,
        "full_name": current_user.full_name,
        "uid": current_user.uid,
        "force_id": current_user.force_id,
        "regimental_number": current_user.regimental_number,
        "data": data
    }


@router.get(
    "/welfare",
    dependencies=[
        Depends(
            require_roles([
                RoleEnum.WELFARE_OFFICER,
                RoleEnum.MEDICAL_OFFICER,
                RoleEnum.SUPER_ADMIN,
                RoleEnum.ADMIN,
            ])
        )
    ]
)
def get_welfare_dashboard(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves welfare cases, high-risk personnel watchlist, and counseling sessions
    for authorized Welfare Officers.
    """
    client_ip = request.client.host if request.client else "unknown"
    audit_logger.log_data_access(
        user_email=current_user.email,
        user_role=current_user.role.value,
        user_uid=current_user.uid,
        endpoint="/dashboard/welfare",
        action="RETRIEVE_WELFARE_CASES_AND_STRESS_WATCHLIST",
        client_ip=client_ip
    )
    return hrms_service.get_welfare_dashboard_data(current_user.email)


@router.get(
    "/commander",
    dependencies=[
        Depends(
            require_roles([
                RoleEnum.COMMANDER,
                RoleEnum.DEPT_HEAD,
                RoleEnum.SUPER_ADMIN,
                RoleEnum.ADMIN,
            ])
        )
    ]
)
def get_commander_dashboard(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves unit readiness, active duty rosters, and high-risk stress alerts
    for authorized Commanders.
    """
    client_ip = request.client.host if request.client else "unknown"
    audit_logger.log_data_access(
        user_email=current_user.email,
        user_role=current_user.role.value,
        user_uid=current_user.uid,
        endpoint="/dashboard/commander",
        action="RETRIEVE_COMMAND_READINESS_AND_DUTY_ROSTERS",
        client_ip=client_ip
    )
    return hrms_service.get_commander_dashboard_data(current_user.email)


@router.get(
    "/hr",
    dependencies=[
        Depends(
            require_roles([
                RoleEnum.HR_OFFICER,
                RoleEnum.TRAINING_OFFICER,
                RoleEnum.SUPER_ADMIN,
                RoleEnum.ADMIN,
            ])
        )
    ]
)
def get_hr_dashboard(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves workforce statistics, leave applications, and attendance rate
    for authorized HR Officers.
    """
    client_ip = request.client.host if request.client else "unknown"
    audit_logger.log_data_access(
        user_email=current_user.email,
        user_role=current_user.role.value,
        user_uid=current_user.uid,
        endpoint="/dashboard/hr",
        action="RETRIEVE_WORKFORCE_AND_LEAVE_PIPELINE",
        client_ip=client_ip
    )
    return hrms_service.get_hr_dashboard_data(current_user.email)


@router.get(
    "/admin",
    dependencies=[
        Depends(
            require_roles([
                RoleEnum.SUPER_ADMIN,
                RoleEnum.SYS_ADMIN,
                RoleEnum.SECURITY_ADMIN,
                RoleEnum.ADMIN,
            ])
        )
    ]
)
def get_admin_dashboard(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """
    Retrieves system-wide telemetry, security audit status, and cloud node health
    for authorized Administrators.
    """
    client_ip = request.client.host if request.client else "unknown"
    audit_logger.log_data_access(
        user_email=current_user.email,
        user_role=current_user.role.value,
        user_uid=current_user.uid,
        endpoint="/dashboard/admin",
        action="RETRIEVE_SYSTEM_ADMIN_TELEMETRY",
        client_ip=client_ip
    )
    return hrms_service.get_admin_dashboard_data(current_user.email)
