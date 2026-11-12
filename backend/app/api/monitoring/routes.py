from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.database.session import get_db
from backend.app.models.user import User
from backend.app.dependencies.auth import get_current_user
from backend.app.services.model_monitoring_engine import ModelMonitoringEngine
from backend.app.services.fairness_evaluation_engine import FairnessEvaluationEngine

router = APIRouter(prefix="/monitoring", tags=["Model Monitoring & Observability"])

engine = ModelMonitoringEngine()
fairness_engine = FairnessEvaluationEngine(sample_size=2000)


@router.get("/")
def get_monitoring_overview():
    return {
        "module": "monitoring",
        "subsystems": ["health", "drift", "telemetry", "fairness"],
        "status": "active"
    }


@router.get("/health")
def get_model_health(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns real-time model health, drift status, inference latency profile,
    and telemetry sparsity.
    """
    return engine.get_health_metrics(db)


@router.get("/drift")
def get_drift_analytics(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns Population Stability Index (PSI) and feature-level drift statistics.
    """
    return engine.get_drift_report(db)


@router.get("/telemetry")
def get_telemetry_quality_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns telemetry stream completion rates, missing-data sparsity,
    and imputation distribution breakdown.
    """
    return engine.get_telemetry_quality(db)


@router.get("/fairness")
def get_model_fairness_and_subgroups(
    sample_size: int = 1500,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """
    Returns empirical evaluation on synthetic / consented cohort data,
    including false-positive rates, disaggregated subgroup breakdowns across
    ranks, terrains, demographics, and documented model limitations.
    """
    eval_runner = FairnessEvaluationEngine(sample_size=sample_size)
    return eval_runner.run_comprehensive_evaluation()
