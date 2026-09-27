import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.mission_impact_simulator import MissionImpactSimulator

client = TestClient(app)


def get_commander_token() -> str:
    """Helper to authenticate as Commander."""
    res = client.post(
        "/api/v1/authentication/login",
        json={"email": "commander@welfare.gov.in", "password": "commander123"}
    )
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]


def test_scenario_deploy_bravo_company_30_days():
    """
    Test Scenario 1 from user prompt:
    Commander asks: What happens if I deploy Bravo Company for another 30 days?
    AI simulates:
      - Expected Readiness ↓
      - Expected Burnout ↑
      - Expected Leave Requests ↑
      - Predicted Recovery Time: 18 days
    """
    result = MissionImpactSimulator.simulate_decision(
        unit_id="coy-bravo",
        sub_unit=None,
        additional_deployment_days=30,
        rotation_strategy="NO_ROTATION",
        rotation_day=None,
        operational_threat_level="STANDARD"
    )

    # Readiness must decline (↓)
    assert result["readiness_metric"]["direction"] == "DOWN"
    assert result["readiness_metric"]["delta"] < 0

    # Burnout must increase (↑)
    assert result["burnout_metric"]["direction"] == "UP"
    assert result["burnout_metric"]["delta"] > 0

    # Leave requests must increase (↑)
    assert result["leave_requests_metric"]["direction"] == "UP"
    assert result["leave_requests_metric"]["delta"] > 0

    # Predicted recovery time should be around 18 days
    assert result["predicted_recovery_time_days"] >= 16
    assert result["predicted_recovery_time_days"] <= 20

    # Mission capability should be degraded under unmitigated 30d extension
    assert result["mission_capability"] in ["Degraded", "Severely Compromised"]


def test_scenario_rotate_platoon_3_after_15_days():
    """
    Test Scenario 2 from user prompt:
    What if I rotate Platoon 3 after 15 days?
    AI:
      - Readiness +12%
      - Burnout -18%
      - Mission Capability Maintained
    """
    result = MissionImpactSimulator.simulate_decision(
        unit_id="coy-bravo",
        sub_unit="Platoon 3",
        additional_deployment_days=30,
        rotation_strategy="ROTATE_PLATOON_15D",
        rotation_day=15,
        operational_threat_level="STANDARD"
    )

    # Readiness should show positive delta compared to non-rotated baseline (~+12%)
    assert result["readiness_metric"]["delta"] > 0
    assert result["readiness_metric"]["direction"] == "UP"
    assert 10.0 <= result["readiness_metric"]["delta"] <= 15.0

    # Burnout should show negative delta compared to non-rotated baseline (~-18%)
    assert result["burnout_metric"]["delta"] < 0
    assert result["burnout_metric"]["direction"] == "DOWN"
    assert -22.0 <= result["burnout_metric"]["delta"] <= -14.0

    # Mission capability maintained
    assert result["mission_capability"] == "Maintained"
    assert result["predicted_recovery_time_days"] <= 6


def test_mission_impact_presets():
    """Verify built-in presets load correctly."""
    presets = MissionImpactSimulator.get_presets()
    assert len(presets) >= 3
    preset_titles = [p["title"] for p in presets]
    assert any("Bravo Company" in t for t in preset_titles)
    assert any("Platoon 3" in t for t in preset_titles)


def test_mission_impact_api_endpoints():
    """Verify POST /api/v1/mission-impact/simulate endpoint integration."""
    token = get_commander_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. GET Presets
    presets_res = client.get("/api/v1/mission-impact/presets", headers=headers)
    assert presets_res.status_code == 200, presets_res.text
    presets_data = presets_res.json()
    assert len(presets_data) >= 3

    # 2. POST Simulate Scenario 1
    payload_1 = {
        "unit_id": "coy-bravo",
        "additional_deployment_days": 30,
        "rotation_strategy": "NO_ROTATION",
        "operational_threat_level": "STANDARD"
    }
    sim_res_1 = client.post("/api/v1/mission-impact/simulate", json=payload_1, headers=headers)
    assert sim_res_1.status_code == 200, sim_res_1.text
    data_1 = sim_res_1.json()
    assert data_1["predicted_recovery_time_days"] == 18
    assert data_1["readiness_metric"]["direction"] == "DOWN"
    assert data_1["burnout_metric"]["direction"] == "UP"

    # 3. POST Simulate Scenario 2
    payload_2 = {
        "unit_id": "coy-bravo",
        "sub_unit": "Platoon 3",
        "additional_deployment_days": 30,
        "rotation_strategy": "ROTATE_PLATOON_15D",
        "rotation_day": 15,
        "operational_threat_level": "STANDARD"
    }
    sim_res_2 = client.post("/api/v1/mission-impact/simulate", json=payload_2, headers=headers)
    assert sim_res_2.status_code == 200, sim_res_2.text
    data_2 = sim_res_2.json()
    assert data_2["mission_capability"] == "Maintained"
    assert data_2["readiness_metric"]["delta"] >= 10.0
    assert data_2["burnout_metric"]["delta"] <= -14.0
