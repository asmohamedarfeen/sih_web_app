import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def get_token_for_role(email: str, password: str) -> str:
    res = client.post("/api/v1/authentication/login", json={"email": email, "password": password})
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]


def test_commander_confidentiality_firewall():
    """
    Verifies that when a Commander queries a personnel dossier:
    - Raw clinical distress parameters (PHQ/GAD/mood/psychiatric notes) are REDACTED under Medical Privilege.
    - Aggregated Operational Readiness and roster stand-down recommendations ARE provided.
    """
    token = get_token_for_role("commander@welfare.gov.in", "commander123")
    headers = {"Authorization": f"Bearer {token}"}

    # Query soldier UID-EMP-012 (Havildar Ramesh Chand)
    res = client.get("/api/v1/personnel/UID-EMP-012", headers=headers)
    assert res.status_code == 200
    data = res.json()

    # Verify Confidentiality Firewall seal
    assert "confidentiality_firewall" in data
    assert data["confidentiality_firewall"]["status"] == "ACTIVE_COMMAND_FIREWALL"
    assert data["confidentiality_firewall"]["clinical_data_masked"] is True

    # Verify clinical psychological distress params are redacted
    psych_params = data.get("psychological_distress_params", {})
    assert psych_params.get("confidentiality_status") == "SEALED_UNDER_MEDICAL_PRIVILEGE"
    assert "operational_readiness_status" in psych_params
    assert "tactical_command_action" in psych_params


def test_welfare_officer_clinical_access():
    """
    Verifies that Certified Welfare Officers retain privileged clinical access
    to psychological distress parameters for counseling and de-escalation.
    """
    token = get_token_for_role("welfare@welfare.gov.in", "welfare123")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/personnel/UID-EMP-012", headers=headers)
    assert res.status_code == 200
    data = res.json()

    # Clinical details are intact for welfare officer
    psych_params = data.get("psychological_distress_params", {})
    assert "mood_assessments" in psych_params
    assert "anxiety_questions" in psych_params
    assert psych_params["mood_assessments"]["score"] > 0


def test_soldier_trust_ledger_endpoint():
    """
    Verifies that a soldier can inspect their own cryptographic Trust & Access Audit Ledger.
    """
    # Login as Havildar Ramesh Chand (Personnel) or Major Alex Morgan
    token = get_token_for_role("alex@company.com", "employee123")
    headers = {"Authorization": f"Bearer {token}"}

    # Get user profile to check UID
    me_res = client.get("/api/v1/authentication/me", headers=headers)
    assert me_res.status_code == 200
    my_uid = me_res.json()["uid"]

    # Retrieve trust ledger
    res = client.get(f"/api/v1/personnel/{my_uid}/trust-ledger", headers=headers)
    assert res.status_code == 200
    ledger = res.json()

    assert ledger["confidentiality_firewall_status"] == "ENFORCED"
    assert ledger["unauthorized_access_attempts"] == 0
    assert "article_42a_protection" in ledger
    assert "access_logs" in ledger
    assert len(ledger["access_logs"]) > 0


def test_soldier_forbidden_from_other_dossier():
    """
    Verifies that a soldier cannot view other soldiers' dossiers (anti-surveillance protection).
    """
    token = get_token_for_role("alex@company.com", "employee123")
    headers = {"Authorization": f"Bearer {token}"}

    # Attempt to query someone else's dossier
    res = client.get("/api/v1/personnel/UID-EMP-012", headers=headers)
    # Alex's UID is UID-EMP-010, so accessing UID-EMP-012 should be 403 Forbidden
    assert res.status_code == 403
