import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.risk_momentum_engine import RiskMomentumEngine

client = TestClient(app)


def get_token_for_role(email: str, password: str) -> str:
    res = client.post("/api/v1/authentication/login", json={"email": email, "password": password})
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]


def test_risk_momentum_acute_surge():
    """
    Test Risk Momentum Engine on an acute stress spike:
    A soldier whose stress jumped from 30 to 65 in 3 days is in ACUTE danger.
    """
    now = datetime.now(timezone.utc)
    history = [
        {"timestamp": (now - timedelta(days=3)).isoformat(), "stress_score": 30.0},
        {"timestamp": now.isoformat(), "stress_score": 65.0},
    ]
    momentum = RiskMomentumEngine.calculate_momentum(
        current_stress=65.0,
        historical_stress_history=history,
        consecutive_duty_days=8,
        leave_deferrals=2,
    )

    assert momentum["velocity_pts_per_day"] >= 10.0
    assert momentum["momentum_state"] == "ACUTE_SURGE"
    assert momentum["severity"] in ["CRITICAL", "HIGH"]
    assert momentum["days_to_critical_threshold"] is not None
    assert momentum["days_to_critical_threshold"] <= 3.0
    assert momentum["decision_support"] is not None
    assert "action_code" in momentum["decision_support"]


def test_risk_momentum_stable_vs_recovering():
    """
    Test steady vs recovering stress trajectories:
    - Steady at 65 is STABLE.
    - Decreasing from 80 to 45 is RECOVERING.
    """
    now = datetime.now(timezone.utc)
    stable_history = [
        {"timestamp": (now - timedelta(days=4)).isoformat(), "stress_score": 65.0},
        {"timestamp": now.isoformat(), "stress_score": 65.2},
    ]
    stable_res = RiskMomentumEngine.calculate_momentum(
        current_stress=65.2,
        historical_stress_history=stable_history,
    )
    assert stable_res["momentum_state"] in ["STABLE", "ACCELERATING"]

    recovering_history = [
        {"timestamp": (now - timedelta(days=5)).isoformat(), "stress_score": 80.0},
        {"timestamp": now.isoformat(), "stress_score": 45.0},
    ]
    recovering_res = RiskMomentumEngine.calculate_momentum(
        current_stress=45.0,
        historical_stress_history=recovering_history,
        consecutive_duty_days=0,
        leave_deferrals=0,
        sleep_hours=8.0,
    )
    assert recovering_res["velocity_pts_per_day"] < 0
    assert recovering_res["momentum_state"] in ["RECOVERING", "STABILIZING"]
    assert recovering_res["severity"] == "LOW"


def test_recovery_tracking_endpoint():
    """
    Verifies GET /api/v1/interventions/recovery-tracking returns
    the 14/30/60-day recovery curve and active recovery cohorts.
    """
    token = get_token_for_role("welfare@welfare.gov.in", "welfare123")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/interventions/recovery-tracking", headers=headers)
    assert res.status_code == 200
    data = res.json()

    assert "metrics" in data
    assert "return_to_readiness_rate" in data["metrics"]
    assert "relapse_detection_count" in data["metrics"]

    assert "longitudinal_trajectory_curve" in data
    curves = data["longitudinal_trajectory_curve"]
    assert len(curves) >= 4  # Day 0, Day 14, Day 30, Day 60

    assert "active_recovery_cohort" in data
    assert len(data["active_recovery_cohort"]) > 0


def test_policy_learning_endpoint():
    """
    Verifies GET /api/v1/analytics/policy-learning returns
    systemic root-cause intelligence and organizational policy impact matrix.
    """
    token = get_token_for_role("commander@welfare.gov.in", "commander123")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/analytics/policy-learning", headers=headers)
    assert res.status_code == 200
    data = res.json()

    assert "policy_impact_matrix" in data
    assert len(data["policy_impact_matrix"]) >= 3
    assert "projected_force_readiness_gain" in data
    assert "key_insight" in data

    first_policy = data["policy_impact_matrix"][0]
    assert "recommended_policy_change" in first_policy
    assert "empirical_burnout_impact" in first_policy


def test_personnel_api_enriches_risk_momentum():
    """
    Verifies GET /api/v1/personnel/{uid} provides risk_momentum
    with actionable decision directives.
    """
    token = get_token_for_role("commander@welfare.gov.in", "commander123")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/personnel/UID-EMP-012", headers=headers)
    assert res.status_code == 200
    data = res.json()

    assert "risk_momentum" in data
    momentum = data["risk_momentum"]
    assert "velocity_pts_per_day" in momentum
    assert "momentum_state" in momentum
    assert "decision_support" in momentum
    assert "recommended_action" in momentum["decision_support"]
