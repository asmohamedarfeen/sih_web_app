import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def get_token_for_user(email: str, password: str) -> str:
    res = client.post("/api/v1/authentication/login", json={"email": email, "password": password})
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]


def test_alert_human_review_and_false_positive_triage():
    """Verify human-in-the-loop clinical review path for alerts with false-positive logging."""
    token = get_token_for_user("welfare@forces.gov.in", "welfare123")
    headers = {"Authorization": f"Bearer {token}"}

    # 1. Fetch alerts
    res = client.get("/api/v1/alerts/", headers=headers)
    assert res.status_code == 200
    alerts = res.json()
    assert len(alerts) > 0
    target_alert = alerts[0]
    alert_id = target_alert["id"]

    # 2. Submit clinical human review marking as DISMISSED_FALSE_POSITIVE
    review_payload = {
        "review_status": "DISMISSED_FALSE_POSITIVE",
        "severity_override": "LOW",
        "is_false_positive": True,
        "false_positive_reason": "ACUTE_MISSION_EXERTION",
        "clinical_notes": "Soldier completed 72-hour border ambush operation with anticipated transient physical fatigue. Vital signs stable, mental resilience strong."
    }

    review_res = client.post(f"/api/v1/alerts/{alert_id}/review", json=review_payload, headers=headers)
    assert review_res.status_code == 200
    updated_alert = review_res.json()["alert"]
    assert updated_alert["review_status"] == "DISMISSED_FALSE_POSITIVE"
    assert updated_alert["is_false_positive"] is True
    assert updated_alert["false_positive_reason"] == "ACUTE_MISSION_EXERTION"
    assert updated_alert["is_acknowledged"] is True
    assert "reviewed_by" in updated_alert

    # 3. Check review history audit trail
    history_res = client.get(f"/api/v1/alerts/{alert_id}/review-history", headers=headers)
    assert history_res.status_code == 200
    history = history_res.json()
    assert len(history) >= 1
    assert history[0]["new_status"] == "DISMISSED_FALSE_POSITIVE"
    assert "ACUTE_MISSION_EXERTION" in history[0]["false_positive_reason"]


def test_alert_triage_summary_stats():
    """Verify alert triage summary returns false positive rates and review status breakdown."""
    token = get_token_for_user("welfare@forces.gov.in", "welfare123")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/alerts/triage-summary", headers=headers)
    assert res.status_code == 200
    summary = res.json()
    assert "total_alerts" in summary
    assert "pending_review_count" in summary
    assert "false_positive_count" in summary
    assert "false_positive_rate" in summary
    assert "status_breakdown" in summary
