from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.user import User, RoleEnum
from backend.app.security.passwords import verify_password
from backend.app.security.jwt import create_access_token
from backend.app.schemas.auth import LoginRequest, TokenResponse, UserResponse, DemoAccount
from backend.app.dependencies.auth import get_current_user

router = APIRouter(prefix="/authentication", tags=["Authentication"])


ROLE_DASHBOARDS = {
    RoleEnum.SUPER_ADMIN: "/dashboard/admin",
    RoleEnum.SYS_ADMIN: "/dashboard/admin",
    RoleEnum.SECURITY_ADMIN: "/dashboard/admin",
    RoleEnum.ADMIN: "/dashboard/admin",
    RoleEnum.WELFARE_OFFICER: "/dashboard/welfare",
    RoleEnum.COMMANDER: "/dashboard/commander",
    RoleEnum.HR_OFFICER: "/dashboard/hr",
    RoleEnum.DEPT_HEAD: "/dashboard/commander",
    RoleEnum.TRAINING_OFFICER: "/dashboard/hr",
    RoleEnum.MEDICAL_OFFICER: "/dashboard/welfare",
    RoleEnum.PERSONNEL: "/dashboard/welfare",
}


@router.post("/login", response_model=TokenResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Authenticates user credentials against HRMS identity registry and issues a JWT token.
    Identifies user role, unit, and UID.
    """
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password. Please check your credentials.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account has been suspended or deactivated. Contact system administrator.",
        )

    token_payload = {
        "sub": user.email,
        "user_id": user.id,
        "uid": user.uid,
        "force_id": user.force_id,
        "regimental_number": user.regimental_number,
        "role": user.role.value,
        "full_name": user.full_name,
        "unit": user.unit,
        "branch": user.branch
    }
    access_token = create_access_token(data=token_payload)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user)
    )


@router.get("/me", response_model=UserResponse)
def get_current_user_profile(current_user: User = Depends(get_current_user)):
    """Returns the authenticated user profile and active role."""
    return UserResponse.model_validate(current_user)


@router.get("/demo-accounts", response_model=List[DemoAccount])
def get_demo_accounts():
    """Provides the complete official Defense HRMS accounts for instant switching."""
    return [
        DemoAccount(
            uid="UID-WEL-007",
            force_id="DEF_006",
            regimental_number="CRPF-2014-8007",
            role=RoleEnum.WELFARE_OFFICER,
            role_label="Welfare Officer",
            email="welfare@forces.gov.in",
            password="welfare123",
            full_name="Welfare Offr. Priya Sharma",
            rank="Lt. Colonel / Chief Welfare Officer",
            unit="Psychological Support & Welfare Wing",
            branch="CRPF",
            description="Active welfare cases, counseling calendar, AI stress alerts, and assigned personnel monitoring.",
            dashboard_route="/dashboard/welfare"
        ),
        DemoAccount(
            uid="UID-CMD-005",
            force_id="DEF_004",
            regimental_number="ARMY-2007-8005",
            role=RoleEnum.COMMANDER,
            role_label="Commander",
            email="commander@forces.gov.in",
            password="commander123",
            full_name="Brig. Santosh Babu",
            rank="Brigadier / Formation Commander",
            unit="16 Corps Command Division",
            branch="Indian Army",
            description="Formation readiness index, unit duty rosters, high-risk alert feeds, and SHAPE-1 deployment status.",
            dashboard_route="/dashboard/commander"
        ),
        DemoAccount(
            uid="UID-HRO-004B",
            force_id="DUM_3",
            regimental_number="CRPF-2008-8004B",
            role=RoleEnum.HR_OFFICER,
            role_label="HR Officer",
            email="hr@forces.gov.in",
            password="hr123",
            full_name="Col. Kabir Khan (HR Officer)",
            rank="Colonel / HR Director",
            unit="Personnel & Records Division",
            branch="CRPF",
            description="Workforce distribution, leave approvals, attendance rosters, and APAR compliance records.",
            dashboard_route="/dashboard/hr"
        ),
        DemoAccount(
            uid="UID-SUP-001",
            force_id="DEF_001",
            regimental_number="ARMY-2005-9001",
            role=RoleEnum.SUPER_ADMIN,
            role_label="Super Administrator",
            email="superadmin@forces.gov.in",
            password="superadmin123",
            full_name="Gen. Vikramaditya Rawat",
            rank="General / Chief of Defence Staff",
            unit="Integrated Defence Staff (IDS) HQ",
            branch="Indian Army",
            description="Complete strategic oversight, cross-wing health, security audits, and cloud node telemetry.",
            dashboard_route="/dashboard/admin"
        ),
        DemoAccount(
            uid="UID-EMP-010",
            force_id="DUM_1",
            regimental_number="CRPF-2015-8010",
            role=RoleEnum.PERSONNEL,
            role_label="Personnel / Officer",
            email="alex@company.com",
            password="employee123",
            full_name="Major Alex Morgan",
            rank="Major / Field Ops Lead",
            unit="Rapid Action Battalion 1",
            branch="CRPF",
            description="Self-service biometrics, duty shifts, weapon custody, leave applications, and stress surveys.",
            dashboard_route="/dashboard/welfare"
        ),
    ]


@router.post("/logout")
def logout(current_user: User = Depends(get_current_user)):
    """Logs out current user session."""
    return {"message": "Successfully logged out.", "status": "success"}
