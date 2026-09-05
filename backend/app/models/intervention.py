from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from backend.app.database.session import Base


class Intervention(Base):
    __tablename__ = "welfare_interventions"

    id = Column(Integer, primary_key=True, index=True)
    case_number = Column(String(50), unique=True, index=True, nullable=False)
    personnel_uid = Column(String(50), index=True, nullable=False)
    personnel_name = Column(String(255), nullable=False)
    rank = Column(String(100), nullable=True)
    unit = Column(String(100), nullable=True)
    
    officer_uid = Column(String(50), index=True, nullable=True)
    counselor_name = Column(String(255), nullable=True)
    
    category = Column(String(100), nullable=False)
    urgency = Column(String(50), nullable=False) # CRITICAL, HIGH, MODERATE, ROUTINE
    status = Column(String(50), default="IN_PROGRESS") # OPEN, IN_PROGRESS, RESOLVED, CLOSED
    
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    action_plan = Column(Text, nullable=True)
    
    requested_amount = Column(Float, default=0.0)
    approved_amount = Column(Float, default=0.0)
    
    counseling_date = Column(String(100), nullable=True)
    venue = Column(String(255), nullable=True)
    
    timeline = Column(JSON, nullable=True) # list of milestones
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
