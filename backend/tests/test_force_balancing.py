import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.force_balancing_engine import AdaptiveForceBalancingEngine

client = TestClient(app)


def get_commander_token() -> str:
    """Helper to authenticate as Commander."""
    res = client.post(
        "/api/v1/authentication/login",
        json={"email": "commander@welfare.gov.in", "password": "commander123"}
    )
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]


def test_force_balancing_engine_plan():
    """
    Verify the Adaptive Force Balancing Engine correctly captures:
    1. Current readiness: Alpha 92%, Bravo 71%, Charlie 95%, Delta 68%
    2. Recommendations: Transfer 8 personnel, Rotate 2 units, Delay leave 3 days, Advance relief 4 days
    3. Outcome: Every company stays within the optimal band (80% - 88%)
    """
    plan = AdaptiveForceBalancingEngine.get_current_plan()
    
    # 1. Initial Companies & Readiness
    units = plan["units_initial"]
    readiness_map = {u["unit_name"]: u["current_readiness"] for u in units}
    assert readiness_map["Company Alpha"] == 92.0
    assert readiness_map["Company Bravo"] == 71.0
    assert readiness_map["Company Charlie"] == 95.0
    assert readiness_map["Company Delta"] == 68.0

    # 2. Recommendations
    actions = plan["recommended_actions"]
    assert len(actions) == 4
    
    act_transfer = next((a for a in actions if a["action_type"] == "TRANSFER"), None)
    assert act_transfer is not None
    assert "8 personnel" in act_transfer["title"] or act_transfer["quantity"] == 8

    act_rotate = next((a for a in actions if a["action_type"] == "ROTATE"), None)
    assert act_rotate is not None
    assert "2 units" in act_rotate["title"] or act_rotate["quantity"] == 2

    act_leave = next((a for a in actions if a["action_type"] == "DELAY_LEAVE"), None)
    assert act_leave is not None
    assert "3 days" in act_leave["title"] or act_leave["quantity"] == 3

    act_relief = next((a for a in actions if a["action_type"] == "ADVANCE_RELIEF"), None)
    assert act_relief is not None
    assert "4 days" in act_relief["title"] or act_relief["quantity"] == 4

    # 3. Projected Outcomes within Optimal Band (80% - 88%)
    outcomes = plan["projected_outcomes"]
    assert len(outcomes) == 4
    for outcome in outcomes:
        assert outcome["in_optimal_band"] is True
        assert 80.0 <= outcome["projected_readiness"] <= 88.0

    # 4. Variance reduction
    assert plan["projected_variance"] < plan["initial_variance"]


def test_force_balancing_plan_execution():
    """Verify execution of the balancing plan generates a receipt and order ID."""
    receipt = AdaptiveForceBalancingEngine.execute_balancing_plan(
        plan_id="PLAN-FORCE-BAL-2026",
        commander_authorization_code="CMD-AUTH-BAL-2026"
    )
    assert receipt["order_id"].startswith("ORD-BAL-")
    assert receipt["status"] == "TRANSMITTED_TO_BRIGADE"
    assert receipt["dispatched_actions_count"] == 4
    assert len(receipt["units_synchronized"]) == 4


def test_force_balancing_api_endpoints():
    """Verify API endpoints for Force Balancing."""
    token = get_commander_token()
    headers = {"Authorization": f"Bearer {token}"}

    # 1. GET /api/v1/force-balancing/plan
    res = client.get("/api/v1/force-balancing/plan", headers=headers)
    assert res.status_code == 200, res.text
    plan_data = res.json()
    assert plan_data["plan_id"] == "PLAN-FORCE-BAL-2026"
    assert len(plan_data["units_initial"]) == 4
    assert len(plan_data["recommended_actions"]) == 4
    assert len(plan_data["projected_outcomes"]) == 4

    # 2. POST /api/v1/force-balancing/execute
    exec_res = client.post(
        "/api/v1/force-balancing/execute",
        json={
            "plan_id": "PLAN-FORCE-BAL-2026",
            "commander_authorization_code": "CMD-AUTH-BAL-2026",
            "notes": "Approved for 19th Infantry Division deployment roster."
        },
        headers=headers
    )
    assert exec_res.status_code == 200, exec_res.text
    receipt_data = exec_res.json()
    assert receipt_data["status"] == "TRANSMITTED_TO_BRIGADE"
    assert receipt_data["order_id"].startswith("ORD-BAL-")
