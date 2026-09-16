from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, Text
from backend.app.database.session import Base


class DutyRoster(Base):
    __tablename__ = "duty_rosters"

    id = Column(Integer, primary_key=True, index=True)
    roster_id = Column(String(50), unique=True, index=True, nullable=False)
    personnel_uid = Column(String(50), index=True, nullable=False)
    personnel_name = Column(String(255), nullable=False)
    rank = Column(String(100), nullable=True)
    unit = Column(String(100), nullable=True)
    
    duty_role = Column(String(100), nullable=False)  # e.g., "Perimeter Night Guard", "High Altitude Sentry", "QRT Escort"
    shift_type = Column(String(50), nullable=False)  # e.g., "Night Watch", "Day Patrol", "24h Standby"
    post_location = Column(String(255), nullable=True) # e.g., "Observation Post Siachen B-4", "Border Outpost 12"
    consecutive_days = Column(Integer, default=1)
    status = Column(String(50), default="ACTIVE")    # ACTIVE, STAND_DOWN, SWAPPED, COMPLETED
    
    swap_recommended = Column(Boolean, default=False)
    swap_candidate_uid = Column(String(50), nullable=True)
    swap_candidate_name = Column(String(255), nullable=True)
    swapped_at = Column(DateTime, nullable=True)
    swapped_by = Column(String(255), nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class LeaveApplication(Base):
    __tablename__ = "leave_applications"

    id = Column(Integer, primary_key=True, index=True)
    application_number = Column(String(50), unique=True, index=True, nullable=False)
    personnel_uid = Column(String(50), index=True, nullable=False)
    personnel_name = Column(String(255), nullable=False)
    rank = Column(String(100), nullable=True)
    unit = Column(String(100), nullable=True)
    
    leave_type = Column(String(100), nullable=False) # "Casual Leave", "Annual Furlough", "Compassionate Family Leave"
    duration_days = Column(Integer, default=5)
    start_date = Column(String(50), nullable=True)
    status = Column(String(50), default="PENDING")   # PENDING, APPROVED, EXPEDITED, REJECTED
    reason = Column(Text, nullable=True)
    
    applied_at = Column(DateTime, default=datetime.utcnow)
    reviewed_by = Column(String(255), nullable=True)
    reviewed_at = Column(DateTime, nullable=True)
