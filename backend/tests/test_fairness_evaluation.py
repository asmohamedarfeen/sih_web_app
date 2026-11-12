import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.services.fairness_evaluation_engine import FairnessEvaluationEngine

client = TestClient(app)


def get_token_for_user(email: str, password: str) -> str:
    res = client.post("/api/v1/authentication/login", json={"email": email, "password": password})
    assert res.status_code == 200, f"Login failed: {res.text}"
    return res.json()["access_token"]


def test_fairness_evaluation_engine_metrics():
    """Verify evaluation engine generates synthetic cohort and computes FPR and subgroup breakdowns."""
    engine = FairnessEvaluationEngine(sample_size=1000)
    eval_result = engine.run_comprehensive_evaluation()

    assert "cohort_summary" in eval_result
    assert eval_result["cohort_summary"]["total_samples"] == 1000
    assert eval_result["cohort_summary"]["data_source"] in ["SYNTHETIC_CONSENTED_MILITARY_COHORT", "CONSENTED_TELEMETRY"]

    # Global Performance & False Positive Rate
    global_metrics = eval_result["global_metrics"]
    assert "false_positive_rate" in global_metrics
    assert "false_discovery_rate" in global_metrics
    assert "true_positive_rate" in global_metrics
    assert "precision" in global_metrics
    assert "f1_score" in global_metrics
    assert "roc_auc" in global_metrics
    assert 0.0 <= global_metrics["false_positive_rate"] <= 0.15  # Expected low FPR for welfare triage
    assert global_metrics["roc_auc"] >= 0.85

    # Subgroup Breakdowns
    subgroups = eval_result["subgroup_breakdowns"]
    assert "by_rank" in subgroups
    assert "by_terrain" in subgroups
    assert "by_gender" in subgroups
    assert "by_age" in subgroups

    # Check rank breakdown
    ranks = subgroups["by_rank"]
    assert len(ranks) >= 4
    for r in ranks:
        assert "subgroup_name" in r
        assert "sample_count" in r
        assert "false_positive_rate" in r
        assert "true_positive_rate" in r
        assert "disparate_impact_ratio" in r

    # Limitations & Governance
    assert "model_limitations" in eval_result
    limitations = eval_result["model_limitations"]
    assert len(limitations) >= 4
    assert any("Sensor" in lim["title"] or "Stigma" in lim["title"] for lim in limitations)


def test_fairness_api_endpoint():
    """Verify the API endpoint returns fairness and subgroup evaluation."""
    token = get_token_for_user("commander@forces.gov.in", "commander123")
    headers = {"Authorization": f"Bearer {token}"}

    res = client.get("/api/v1/monitoring/fairness", headers=headers)
    assert res.status_code == 200
    data = res.json()
    assert "global_metrics" in data
    assert "subgroup_breakdowns" in data
    assert "model_limitations" in data
