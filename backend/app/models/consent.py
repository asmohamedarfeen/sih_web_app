import hashlib
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, JSON
from backend.app.database.session import Base


class ConsentPreference(Base):
    __tablename__ = "consent_preferences"

    id = Column(Integer, primary_key=True, index=True)
    personnel_uid = Column(String(50), unique=True, index=True, nullable=False)
    
    # Granular Scope Permissions
    self_assessment = Column(Boolean, default=True, nullable=False)
    duty_roster_telemetry = Column(Boolean, default=True, nullable=False)
    biometrics_wearable = Column(Boolean, default=True, nullable=False)
    ai_longitudinal_profiling = Column(Boolean, default=True, nullable=False)
    
    version = Column(String(20), default="2.0-CONSENT", nullable=False)
    last_updated_by = Column(String(255), nullable=True)
    last_updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)


class ConsentAuditTrail(Base):
    __tablename__ = "consent_audit_trails"

    id = Column(Integer, primary_key=True, index=True)
    personnel_uid = Column(String(50), index=True, nullable=False)
    action = Column(String(100), nullable=False)  # GRANTED, REVOKED, MODIFIED, EXPORTED
    scope_snapshot = Column(JSON, nullable=False)
    actor_name = Column(String(255), nullable=False)
    reason = Column(Text, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    audit_hash = Column(String(64), nullable=False)  # SHA-256 integrity signature
    timestamp = Column(DateTime, default=datetime.utcnow)

    @staticmethod
    def generate_hash(personnel_uid: str, action: str, scopes: dict, timestamp_str: str) -> str:
        payload = f"{personnel_uid}|{action}|{sorted(scopes.items())}|{timestamp_str}"
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()
