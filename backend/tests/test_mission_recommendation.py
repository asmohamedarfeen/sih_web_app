import pytest
from datetime import datetime, timezone, timedelta
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.mission_recommendation_engine import (
    MissionRecommendationEngine,
    MissionTypeEnum,
)

client = TestClient(app)


def get_commander_token() -> str:
    """Helper to authenticate as Commander."""
    res = client.post(
        "/api/v1/authentication/login",
        json={"email": "commander@welfare.gov.in", "password": "commander123"}
    )
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]


def test_mission_types_registry():
    """Verify all 7 military mission types are registered with correct criticality."""
    missions = MissionRecommendationEngine.get_available_mission_types()
    mission_keys = [m["type"] for m in missions]
    
    expected_missions = [
        "Border Patrol",
        "Counter Insurgency",
        "Election Duty",
        "VIP Security",
        "Flood Rescue",
        "Disaster Relief",
        "Training Camp"
    ]
    for expected in expected_missions:
        assert expected in mission_keys, f"Missing mission type: {expected}"

    # Verify Election Duty has MEDIUM criticality and strategic preservation
    election_mission = next(m for m in missions if m["type"] == "Election Duty")
    assert election_mission["criticality"] == "MEDIUM"
    assert election_mission["preserve_strategic_reserves"] is True

    # Verify Border Patrol has HIGH criticality
    border_mission = next(m for m in missions if m["type"] == "Border Patrol")
    assert border_mission["criticality"] == "HIGH"


def test_election_duty_strategic_reserve_preservation():
    """
    Test Election Duty logic:
    AI should allocate medium-readiness personnel (55-75 readiness) and explicitly
    preserve top-tier strategic personnel (>85 readiness) for critical deployments.
    """
    mock_candidates = [
        # 2 Elite / Peak readiness soldiers
        {
            "uid": "SOL-001",
            "name": "Havildar Rajesh Kumar",
            "rank": "Havildar",
            "current_readiness": 94.0,
            "stress_score": 18.0,
            "readiness_trend_21d": 2.5,  # improving
            "consecutive_duty_days": 2,
            "sleep_hours_avg": 7.8,
            "skills": ["Urban Combat", "Marksman", "CQB"],
            "unit": "Alpha Battalion"
        },
        {
            "uid": "SOL-002",
            "name": "Subedar Vikramaditya",
            "rank": "Subedar",
            "current_readiness": 91.0,
            "stress_score": 22.0,
            "readiness_trend_21d": 1.8,
            "consecutive_duty_days": 3,
            "sleep_hours_avg": 7.5,
            "skills": ["Tactical Leadership", "Sniper"],
            "unit": "Alpha Battalion"
        },
        # 3 Medium-readiness soldiers (perfect for Election Duty)
        {
            "uid": "SOL-003",
            "name": "Naik Ramesh Chand",
            "rank": "Naik",
            "current_readiness": 68.0,
            "stress_score": 42.0,
            "readiness_trend_21d": 0.5,  # steady
            "consecutive_duty_days": 5,
            "sleep_hours_avg": 6.8,
            "skills": ["Crowd Control", "Liaison", "Patrol"],
            "unit": "Alpha Battalion"
        },
        {
            "uid": "SOL-004",
            "name": "Sepoy Amit Verma",
            "rank": "Sepoy",
            "current_readiness": 65.0,
            "stress_score": 45.0,
            "readiness_trend_21d": -0.2,
            "consecutive_duty_days": 4,
            "sleep_hours_avg": 6.9,
            "skills": ["Crowd Management", "Basic First Aid"],
            "unit": "Alpha Battalion"
        },
        {
            "uid": "SOL-005",
            "name": "Sepoy Kuldeep Singh",
            "rank": "Sepoy",
            "current_readiness": 70.0,
            "stress_score": 38.0,
            "readiness_trend_21d": 1.0,
            "consecutive_duty_days": 3,
            "sleep_hours_avg": 7.0,
            "skills": ["Communication", "Patrol"],
            "unit": "Alpha Battalion"
        },
    ]

    result = MissionRecommendationEngine.evaluate_candidates_for_mission(
        mission_type="Election Duty",
        headcount_required=2,
        candidates=mock_candidates
    )

    # Must advise commander to preserve strategic personnel
    assert "Preserve highly mission-ready personnel" in result["commander_advisory"]["strategic_guidance"] or \
           "medium readiness" in result["commander_advisory"]["strategic_guidance"].lower()

    # Recommended squad should prioritize medium readiness over elite reserves
    recommended_uids = [s["uid"] for s in result["recommended_squad"]]
    assert "SOL-003" in recommended_uids or "SOL-004" in recommended_uids or "SOL-005" in recommended_uids

    # SOL-001 or SOL-002 should be in strategic_reserves_preserved
    preserved_uids = [s["uid"] for s in result["strategic_reserves_preserved"]]
    assert "SOL-001" in preserved_uids or "SOL-002" in preserved_uids


def test_border_patrol_declining_trend_exclusion():
    """
    Test Border Patrol logic:
    Soldiers with declining readiness over the last 21 days must be excluded
    and explicitly flagged under commander exclusion advisory:
    "Avoid assigning X personnel whose readiness has declined during the last 21 days."
    """
    mock_candidates = [
        # Soldier with declining readiness over 21 days (-12.0 pts)
        {
            "uid": "SOL-DECLINE-01",
            "name": "Sepoy Mohan Lal",
            "rank": "Sepoy",
            "current_readiness": 54.0,
            "stress_score": 68.0,
            "readiness_trend_21d": -14.5,  # Severely declining
            "consecutive_duty_days": 16,
            "sleep_hours_avg": 4.1,
            "skills": ["High Altitude", "Vigilance"],
            "unit": "Bravo Battalion"
        },
        # Fit, stable soldier
        {
            "uid": "SOL-READY-02",
            "name": "Naik Surinder Singh",
            "rank": "Naik",
            "current_readiness": 88.0,
            "stress_score": 24.0,
            "readiness_trend_21d": 2.0,
            "consecutive_duty_days": 4,
            "sleep_hours_avg": 7.4,
            "skills": ["High Altitude", "Sniper", "Surveillance"],
            "unit": "Bravo Battalion"
        },
        # Fit, stable soldier 2
        {
            "uid": "SOL-READY-03",
            "name": "Havildar Gurmeet Singh",
            "rank": "Havildar",
            "current_readiness": 90.0,
            "stress_score": 20.0,
            "readiness_trend_21d": 1.5,
            "consecutive_duty_days": 2,
            "sleep_hours_avg": 7.6,
            "skills": ["Border Surveillance", "Reconnaissance"],
            "unit": "Bravo Battalion"
        }
    ]

    result = MissionRecommendationEngine.evaluate_candidates_for_mission(
        mission_type="Border Patrol",
        headcount_required=2,
        candidates=mock_candidates
    )

    # SOL-DECLINE-01 must be in excluded_personnel
    excluded_uids = [e["uid"] for e in result["excluded_personnel"]]
    assert "SOL-DECLINE-01" in excluded_uids
    
    # Commander advisory must flag 21-day decline warning
    exclusion_reasons = [e["reason"] for e in result["excluded_personnel"]]
    assert any("21 days" in r or "declined" in r.lower() for r in exclusion_reasons)
    
    # Recommended squad should only include ready candidates
    recommended_uids = [s["uid"] for s in result["recommended_squad"]]
    assert "SOL-DECLINE-01" not in recommended_uids
    assert "SOL-READY-02" in recommended_uids
    assert "SOL-READY-03" in recommended_uids


def test_mission_recommendations_api():
    """Verify POST /api/v1/missions/recommendations endpoint integration."""
    token = get_commander_token()
    headers = {"Authorization": f"Bearer {token}"}

    payload = {
        "mission_type": "Border Patrol",
        "headcount_required": 4,
        "unit": "Alpha Battalion",
        "start_date": datetime.now(timezone.utc).strftime("%Y-%m-%d"),
        "duration_days": 14,
        "mission_notes": "Forward post high-vigilance sector patrol"
    }

    response = client.post("/api/v1/missions/recommendations", json=payload, headers=headers)
    assert response.status_code == 200, f"Recommendation request failed: {response.text}"
    
    data = response.json()
    assert "mission_type" in data
    assert data["mission_type"] == "Border Patrol"
    assert "recommended_squad" in data
    assert len(data["recommended_squad"]) <= 4
    assert "excluded_personnel" in data
    assert "commander_advisory" in data
    assert "average_squad_readiness" in data


def test_mission_deployment_order_api():
    """Verify POST /api/v1/missions/deploy endpoint creates official deployment manifest."""
    token = get_commander_token()
    headers = {"Authorization": f"Bearer {token}"}

    # First get recommendations
    rec_res = client.post(
        "/api/v1/missions/recommendations",
        json={"mission_type": "Election Duty", "headcount_required": 3, "unit": "Alpha Battalion"},
        headers=headers
    )
    assert rec_res.status_code == 200
    rec_data = rec_res.json()
    selected_uids = [p["uid"] for p in rec_data["recommended_squad"][:3]]

    deploy_payload = {
        "mission_type": "Election Duty",
        "unit": "Alpha Battalion",
        "assigned_personnel_uids": selected_uids,
        "deployment_location": "Sector 4 Polling Zone",
        "start_date": (datetime.now(timezone.utc) + timedelta(days=2)).strftime("%Y-%m-%d"),
        "duration_days": 7,
        "commander_remarks": "Deployment optimized by AI to preserve Tier-1 quick reaction reserves."
    }

    deploy_res = client.post("/api/v1/missions/deploy", json=deploy_payload, headers=headers)
    assert deploy_res.status_code == 200, f"Deployment failed: {deploy_res.text}"
    
    manifest = deploy_res.json()
    assert "manifest_id" in manifest
    assert manifest["status"] == "DISPATCHED"
    assert manifest["mission_type"] == "Election Duty"
    assert len(manifest["assigned_roster"]) == len(selected_uids)
    assert "digital_signature_hash" in manifest
    assert "issued_at" in manifest
