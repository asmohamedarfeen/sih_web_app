import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def get_token_for_user(email: str, password: str) -> str:
    res = client.post("/api/v1/authentication/login", json={"email": email, "password": password})
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]


def test_get_consent_preferences_default():
    """Verify default consent preferences for personnel."""
    token = get_token_for_user("soldier@forces.gov.in", "soldier123")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/consent/preferences", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "personnel_uid" in data
    assert "self_assessment" in data
    assert "duty_roster_telemetry" in data
    assert "biometrics_wearable" in data
    assert "ai_longitudinal_profiling" in data
    assert data["self_assessment"] is True


def test_update_consent_and_audit_trail():
    """Verify granular consent modification and immutable audit trail generation."""
    token = get_token_for_user("soldier@forces.gov.in", "soldier123")
    headers = {"Authorization": f"Bearer {token}"}

    # Revoke biometrics wearable consent
    update_payload = {
        "self_assessment": True,
        "duty_roster_telemetry": True,
        "biometrics_wearable": False,
        "ai_longitudinal_profiling": True,
        "consent_reason": "Soldier opted out of wearable biometric tracking"
    }

    res = client.post("/api/v1/consent/preferences", json=update_payload, headers=headers)
    assert res.status_code == 200
    updated = res.json()
    assert updated["biometrics_wearable"] is False

    # Check audit trail
    audit_res = client.get("/api/v1/consent/audit-log", headers=headers)
    assert audit_res.status_code == 200
    audit_records = audit_res.json()
    assert len(audit_records) >= 1
    latest = audit_records[0]
    assert "action" in latest
    assert "timestamp" in latest
    assert "audit_hash" in latest


def test_consent_filtering_enforcement():
    """Verify that when consent is revoked, service masks the restricted telemetry stream."""
    from backend.app.services.consent_service import ConsentService
    from backend.app.database.session import SessionLocal

    db = SessionLocal()
    try:
        service = ConsentService(db)
        # Explicitly revoke biometrics
        service.update_consent(
            personnel_uid="UID-EMP-012",
            self_assessment=True,
            duty_roster_telemetry=True,
            biometrics_wearable=False,
            ai_longitudinal_profiling=False,
            actor_name="Havildar Ramesh Chand"
        )

        telemetry = {
            "sleep_hours": 6.5,
            "fatigue_level": 7,
            "heart_rate_variability": 48.0,
            "skin_conductance_micro_siemens": 4.2,
            "consecutive_duty_days": 14
        }

        sanitized, blocked_streams = service.filter_telemetry_by_consent("UID-EMP-012", telemetry)
        assert "biometrics_wearable" in blocked_streams
        # Biometric sensors must be masked/omitted
        assert "heart_rate_variability" not in sanitized
        assert "skin_conductance_micro_siemens" not in sanitized
        # Self assessment & roster remain authorized
        assert "fatigue_level" in sanitized
        assert "consecutive_duty_days" in sanitized
    finally:
        db.close()
