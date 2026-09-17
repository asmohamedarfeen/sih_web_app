import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)


def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"


def test_get_demo_accounts():
    response = client.get("/api/v1/authentication/demo-accounts")
    assert response.status_code == 200
    accounts = response.json()
    assert len(accounts) >= 4
    roles = [a["role"] for a in accounts]
    assert "SUPER_ADMIN" in roles or "ADMIN" in roles
    assert "WELFARE_OFFICER" in roles
    assert "COMMANDER" in roles
    assert "HR_OFFICER" in roles


@pytest.mark.parametrize("email,password,expected_role", [
    ("admin@welfare.gov.in", "admin123", "ADMIN"),
    ("welfare@welfare.gov.in", "welfare123", "WELFARE_OFFICER"),
    ("commander@welfare.gov.in", "commander123", "COMMANDER"),
    ("hr@welfare.gov.in", "hr123", "HR_OFFICER"),
])
def test_login_success_for_all_roles(email, password, expected_role):
    response = client.post(
        "/api/v1/authentication/login",
        json={"email": email, "password": password}
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"
    assert data["user"]["email"] == email
    assert data["user"]["role"] == expected_role


def test_login_invalid_password():
    response = client.post(
        "/api/v1/authentication/login",
        json={"email": "admin@welfare.gov.in", "password": "wrongpassword"}
    )
    assert response.status_code == 401


def test_get_current_user_me_endpoint():
    # Login first
    login_resp = client.post(
        "/api/v1/authentication/login",
        json={"email": "commander@welfare.gov.in", "password": "commander123"}
    )
    token = login_resp.json()["access_token"]

    # Call /me with Bearer token
    me_resp = client.get(
        "/api/v1/authentication/me",
        headers={"Authorization": f"Bearer {token}"}
    )
    assert me_resp.status_code == 200
    user_data = me_resp.json()
    assert user_data["email"] == "commander@welfare.gov.in"
    assert user_data["role"] == "COMMANDER"
