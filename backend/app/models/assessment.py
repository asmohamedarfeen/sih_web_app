from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text
from backend.app.database.session import Base


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    personnel_uid = Column(String(50), index=True, nullable=False)
    personnel_name = Column(String(255), nullable=False)
    rank = Column(String(100), nullable=True)
    unit = Column(String(100), nullable=True)
    branch = Column(String(100), nullable=True)
    
    # Biometric & Subjective Indicators (Scale 1-10 or hours)
    sleep_hours = Column(Float, nullable=False)
    fatigue_level = Column(Integer, nullable=False)  # 1 to 10
    mood_score = Column(Integer, nullable=False)     # 1 to 10
    workload_pressure = Column(Integer, nullable=False) # 1 to 10
    physical_strain = Column(Integer, nullable=False) # 1 to 10
    consecutive_duty_days = Column(Integer, default=1)
    
    notes = Column(Text, nullable=True)
    submitted_at = Column(DateTime, default=datetime.utcnow)
