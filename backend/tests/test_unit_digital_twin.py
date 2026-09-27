import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.unit_digital_twin_engine import UnitDigitalTwinEngine

client = TestClient(app)


def get_commander_token() -> str:
    """Helper to authenticate as Commander."""
    res = client.post(
        "/api/v1/authentication/login",
        json={"email": "commander@welfare.gov.in", "password": "commander123"}
    )
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]


def test_unit_digital_twin_companies_data():
    """Verify all companies have complete digital twin dimensions matching specification."""
    companies = UnitDigitalTwinEngine.get_all_companies("Alpha Battalion")
    assert len(companies) >= 5, "Alpha Battalion should have at least 5 companies (A, B, C, D, E)"

    company_names = [c["name"] for c in companies]
    assert "Delta Company" in company_names or any("Delta" in name for name in company_names)

    # Check required 6 digital twin dimensions
    for c in companies:
        assert "readiness" in c, "Missing readiness score"
        assert 0 <= c["readiness"] <= 100
        assert c["fatigue"] in ["Low", "Medium", "High", "Critical"]
        assert c["training"] in ["Excellent", "Good", "Adequate", "Needs Refresher"]
        assert c["morale"] in ["Resilient", "Stable", "Strained", "Vulnerable"]
        assert c["deployment_pressure"] in ["Low", "Moderate", "High", "Surge"]
        assert c["leadership_stability"] in ["Excellent", "Strong", "Developing", "Volatile"]
        assert "strength" in c
        assert "commander_name" in c


def test_delta_company_digital_twin_metrics():
    """Verify Delta Company reflects the exact dimensions and health profile."""
    delta = UnitDigitalTwinEngine.get_company_by_id("coy-delta")
    assert delta is not None
    assert delta["name"] == "Delta Company"
    assert delta["readiness"] == 82
    assert delta["fatigue"] == "Medium"
    assert delta["training"] == "Good"
    assert delta["morale"] == "Stable"
    assert delta["deployment_pressure"] == "High"
    assert delta["leadership_stability"] == "Excellent"


def test_unit_comparison_engine():
    """Test Head-to-Head Company A vs Company B comparison with AI operational verdict."""
    comparison = UnitDigitalTwinEngine.compare_units(
        company_a_id="coy-alpha",
        company_b_id="coy-delta",
        mission_context="Border Patrol"
    )

    assert "unit_a" in comparison
    assert "unit_b" in comparison
    assert "dimension_deltas" in comparison
    assert "ai_recommendation" in comparison
    assert "recommended_unit_id" in comparison["ai_recommendation"]
    assert "operational_rationale" in comparison["ai_recommendation"]
    assert "comparative_verdict" in comparison["ai_recommendation"]
    assert len(comparison["dimension_deltas"]) == 6


def test_unit_simulation_projection():
    """Test continuous readiness simulation under operational strain over 30 days."""
    sim = UnitDigitalTwinEngine.simulate_unit_trajectory(
        company_id="coy-delta",
        days=30,
        operational_tempo="HIGH_INTENSITY"
    )

    assert sim["company_id"] == "coy-delta"
    assert len(sim["projection_timeline"]) == 30
    assert "burnout_risk_day" in sim
    assert "recommended_mitigation" in sim
    # Readiness should decline under sustained HIGH_INTENSITY tempo
    day_1_readiness = sim["projection_timeline"][0]["projected_readiness"]
    day_30_readiness = sim["projection_timeline"][-1]["projected_readiness"]
    assert day_30_readiness < day_1_readiness


def test_unit_digital_twin_api_endpoints():
    """Verify backend API endpoints for Unit Digital Twin."""
    token = get_commander_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. GET /api/v1/unit-twin/battalions
    res = client.get("/api/v1/unit-twin/battalions", headers=headers)
    assert res.status_code == 200, res.text
    battalions = res.json()
    assert len(battalions) >= 1
    assert "companies" in battalions[0]

    # 2. POST /api/v1/unit-twin/compare
    compare_res = client.post(
        "/api/v1/unit-twin/compare",
        json={"unit_a_id": "coy-alpha", "unit_b_id": "coy-delta", "mission_context": "Border Patrol"},
        headers=headers
    )
    assert compare_res.status_code == 200, compare_res.text
    comp_data = compare_res.json()
    assert comp_data["unit_a"]["id"] == "coy-alpha"
    assert comp_data["unit_b"]["id"] == "coy-delta"
    assert "ai_recommendation" in comp_data

    # 3. POST /api/v1/unit-twin/simulate
    sim_res = client.post(
        "/api/v1/unit-twin/simulate",
        json={"company_id": "coy-delta", "days": 30, "operational_tempo": "HIGH_INTENSITY"},
        headers=headers
    )
    assert sim_res.status_code == 200, sim_res.text
    sim_data = sim_res.json()
    assert sim_data["company_id"] == "coy-delta"
    assert len(sim_data["projection_timeline"]) == 30
