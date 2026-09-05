import enum
from datetime import datetime
from sqlalchemy import Column, String, Boolean, DateTime, Enum, Integer
from backend.app.database.session import Base


class RoleEnum(str, enum.Enum):
    SUPER_ADMIN = "SUPER_ADMIN"
    SYS_ADMIN = "SYS_ADMIN"
    SECURITY_ADMIN = "SECURITY_ADMIN"
    ADMIN = "ADMIN"
    WELFARE_OFFICER = "WELFARE_OFFICER"
    COMMANDER = "COMMANDER"
    HR_OFFICER = "HR_OFFICER"
    DEPT_HEAD = "DEPT_HEAD"
    TRAINING_OFFICER = "TRAINING_OFFICER"
    MEDICAL_OFFICER = "MEDICAL_OFFICER"
    PERSONNEL = "PERSONNEL"
    SOLDIER = "SOLDIER"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    uid = Column(String(50), unique=True, index=True, nullable=True)  # e.g., UID-WEL-007
    force_id = Column(String(50), index=True, nullable=True)          # e.g., DEF_006 / DUM_1
    regimental_number = Column(String(50), index=True, nullable=True) # e.g., CRPF-2014-8007
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(Enum(RoleEnum), nullable=False, default=RoleEnum.PERSONNEL)
    rank = Column(String(100), nullable=True)
    unit = Column(String(100), nullable=True)
    branch = Column(String(100), nullable=True)
    employee_id = Column(String(50), unique=True, index=True, nullable=True)
    avatar_url = Column(String(500), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
