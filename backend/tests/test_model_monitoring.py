import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.model_monitoring_engine import ModelMonitoringEngine

client = TestClient(app)


def get_token_for_user(email: str, password: str) -> str:
    res = client.post("/api/v1/authentication/login", json={"email": email, "password": password})
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]


def test_psi_calculation_accuracy():
    """Verify PSI calculation for drift detection."""
    engine = ModelMonitoringEngine()
    
    # Identical distributions -> PSI ~ 0.0
    baseline = [0.1, 0.2, 0.4, 0.2, 0.1]
    actual_same = [0.1, 0.2, 0.4, 0.2, 0.1]
    psi_stable = engine.calculate_psi(baseline, actual_same)
    assert psi_stable < 0.05
    assert engine.classify_psi(psi_stable) == "HEALTHY_STABLE"

    # Heavily shifted distribution -> PSI > 0.2
    actual_drifted = [0.4, 0.3, 0.15, 0.1, 0.05]
    psi_drifted = engine.calculate_psi(baseline, actual_drifted)
    assert psi_drifted > 0.20
    assert engine.classify_psi(psi_drifted) == "CRITICAL_DRIFT"


def test_monitoring_api_endpoints():
    """Verify monitoring health, drift, and telemetry endpoints."""
    token = get_token_for_user("commander@forces.gov.in", "commander123")
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Health Overview
    res = client.get("/api/v1/monitoring/health", headers=headers)
    assert res.status_code == 200
    health = res.json()
    assert "status" in health
    assert "model_version" in health
    assert "overall_psi" in health
    assert "p95_latency_ms" in health
    assert "telemetry_sparsity_rate" in health

    # 2. Drift Breakdown
    res_drift = client.get("/api/v1/monitoring/drift", headers=headers)
    assert res_drift.status_code == 200
    drift_data = res_drift.json()
    assert "prediction_drift_psi" in drift_data
    assert "feature_drifts" in drift_data
    assert len(drift_data["feature_drifts"]) > 0
    assert "feature_name" in drift_data["feature_drifts"][0]

    # 3. Telemetry Sparsity and Quality
    res_telemetry = client.get("/api/v1/monitoring/telemetry", headers=headers)
    assert res_telemetry.status_code == 200
    telemetry_data = res_telemetry.json()
    assert "average_sparsity_rate" in telemetry_data
    assert "stream_reliability" in telemetry_data
    assert "imputation_distribution" in telemetry_data
