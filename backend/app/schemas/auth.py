from typing import Optional
from pydantic import BaseModel, EmailStr
from backend.app.models.user import RoleEnum


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    uid: Optional[str] = None
    force_id: Optional[str] = None
    regimental_number: Optional[str] = None
    email: str
    full_name: str
    role: RoleEnum
    rank: Optional[str] = None
    unit: Optional[str] = None
    branch: Optional[str] = None
    employee_id: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool

    class Config:
        from_attributes = True


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class DemoAccount(BaseModel):
    uid: str
    force_id: str
    regimental_number: str
    role: RoleEnum
    role_label: str
    email: str
    password: str
    full_name: str
    rank: str
    unit: str
    branch: str
    description: str
    dashboard_route: str
