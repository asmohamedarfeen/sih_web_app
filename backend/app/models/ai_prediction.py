from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, Text, JSON
from backend.app.database.session import Base


class AIPrediction(Base):
    __tablename__ = "ai_predictions"

    id = Column(Integer, primary_key=True, index=True)
    personnel_uid = Column(String(50), index=True, nullable=False)
    personnel_name = Column(String(255), nullable=False)
    assessment_id = Column(Integer, nullable=True)
    
    stress_score = Column(Float, nullable=False)  # 0 to 100
    burnout_probability = Column(Float, nullable=False) # 0.0 to 1.0
    risk_level = Column(String(50), nullable=False) # LOW, MODERATE, HIGH, CRITICAL
    
    primary_triggers = Column(JSON, nullable=True) # list of trigger factors
    ai_recommendations = Column(JSON, nullable=True) # actionable guidance
    confidence_score = Column(Float, default=0.94)
    computed_at = Column(DateTime, default=datetime.utcnow)
