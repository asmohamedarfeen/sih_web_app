from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from backend.app.database.session import Base


class SystemAlert(Base):
    __tablename__ = "system_alerts"

    id = Column(Integer, primary_key=True, index=True)
    personnel_uid = Column(String(50), index=True, nullable=False)
    personnel_name = Column(String(255), nullable=False)
    rank = Column(String(100), nullable=True)
    unit = Column(String(100), nullable=True)
    
    alert_type = Column(String(100), nullable=False) # STRESS_SPIKE, BURNOUT_WARNING, CONSECUTIVE_SHIFTS, MISSED_ASSESSMENT
    severity = Column(String(50), nullable=False) # CRITICAL, HIGH, MEDIUM, LOW
    trigger_reason = Column(Text, nullable=False)
    recommendation = Column(Text, nullable=True)
    
    is_acknowledged = Column(Boolean, default=False)
    acknowledged_by = Column(String(255), nullable=True)
    acknowledged_at = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
