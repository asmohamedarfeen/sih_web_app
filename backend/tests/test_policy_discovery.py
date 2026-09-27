import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.policy_discovery_engine import PolicyDiscoveryEngine

client = TestClient(app)


def get_commander_token() -> str:
    """Helper to authenticate as Commander."""
    res = client.post(
        "/api/v1/authentication/login",
        json={"email": "commander@welfare.gov.in", "password": "commander123"}
    )
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]


def test_policy_discoveries_content():
    """
    Verify all 3 core discoveries from user prompt are discovered by the engine:
    1. Personnel deployed >120 days continuously -> Burnout increases 31%
    2. Three consecutive night duty cycles -> Readiness falls 18%
    3. Transfers within 8 months -> Higher welfare intervention rate
    """
    discoveries = PolicyDiscoveryEngine.get_all_discoveries()
    assert len(discoveries) >= 3

    # 1. Discovery >120 days
    disc_120d = next((d for d in discoveries if ">120 days" in d["trigger_condition"] or "120 days" in d["trigger_condition"]), None)
    assert disc_120d is not None, "Missing >120 days continuous deployment discovery"
    assert "31%" in disc_120d["empirical_impact"] or disc_120d["impact_percentage"] == 31.0
    assert "Burnout" in disc_120d["affected_metric"] or "burnout" in disc_120d["empirical_impact"].lower()

    # 2. Discovery 3 consecutive night duty cycles
    disc_night = next((d for d in discoveries if "night" in d["trigger_condition"].lower() and ("3" in d["trigger_condition"] or "three" in d["trigger_condition"].lower())), None)
    assert disc_night is not None, "Missing consecutive night duty discovery"
    assert "18%" in disc_night["empirical_impact"] or disc_night["impact_percentage"] == -18.0
    assert "Readiness" in disc_night["affected_metric"] or "readiness" in disc_night["empirical_impact"].lower()

    # 3. Discovery Transfers within 8 months
    disc_transfer = next((d for d in discoveries if "transfer" in d["trigger_condition"].lower() and "8 months" in d["trigger_condition"].lower()), None)
    assert disc_transfer is not None, "Missing transfer within 8 months discovery"
    assert "welfare" in disc_transfer["empirical_impact"].lower() or "intervention" in disc_transfer["empirical_impact"].lower()

    # Verify each discovery has empirical statistical metrics
    for d in discoveries:
        assert d["confidence_score"] >= 90.0
        assert d["sample_size"] >= 500
        assert "p_value" in d
        assert "policy_recommendation" in d
        assert "unprogrammed_discovery_badge" in d


def test_draft_policy_directive():
    """Verify commander can convert an AI discovery into an actionable military policy directive."""
    directive = PolicyDiscoveryEngine.draft_policy_directive(
        discovery_id="DISC-120D-BURNOUT",
        commander_name="Brig. Santosh Babu",
        commander_remarks="Enact immediate 90-day deployment rotation cap across all battalions."
    )
    assert directive["directive_code"].startswith("DIR-POL-")
    assert "90-day" in directive["commander_remarks"] or "rotation" in directive["policy_directive_text"].lower()
    assert directive["status"] == "DRAFTED_FOR_APPROVAL"
    assert "empirical_evidence" in directive


def test_policy_discovery_api_endpoints():
    """Verify backend API endpoints for Policy Discovery Engine."""
    token = get_commander_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. GET /api/v1/policy-discovery/discoveries
    res = client.get("/api/v1/policy-discovery/discoveries", headers=headers)
    assert res.status_code == 200, res.text
    discoveries = res.json()
    assert len(discoveries) >= 3

    # 2. POST /api/v1/policy-discovery/run-mining-scan
    scan_res = client.post("/api/v1/policy-discovery/run-mining-scan", headers=headers)
    assert scan_res.status_code == 200, scan_res.text
    scan_data = scan_res.json()
    assert scan_data["total_records_analyzed"] >= 5000
    assert len(scan_data["newly_verified_discoveries"]) >= 3

    # 3. POST /api/v1/policy-discovery/draft-directive
    draft_res = client.post(
        "/api/v1/policy-discovery/draft-directive",
        json={
            "discovery_id": "DISC-120D-BURNOUT",
            "commander_remarks": "Approved for Brigade Standing Order review."
        },
        headers=headers
    )
    assert draft_res.status_code == 200, draft_res.text
    directive_data = draft_res.json()
    assert directive_data["status"] == "DRAFTED_FOR_APPROVAL"
