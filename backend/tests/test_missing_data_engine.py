import pytest
from backend.app.services.missing_data_engine import MissingDataEngine


def test_missing_data_imputation_and_masking():
    """Verify missing data engine detects missing fields and imputes with indicators."""
    engine = MissingDataEngine()

    partial_input = {
        "sleep_hours": None,       # Missing
        "fatigue_level": 8,        # Present
        "mood_score": None,        # Missing
        "workload_pressure": 9,    # Present
        "physical_strain": 7,      # Present
        "consecutive_duty_days": None # Missing
    }

    result = engine.impute_and_mask(
        telemetry=partial_input,
        deployment_zone="High Altitude (Siachen/Ladakh)",
        personnel_history={"sleep_hours": 5.5, "mood_score": 4} # 1 day ago
    )

    imputed = result["imputed_features"]
    mask = result["missing_mask"]

    # Verify missing fields are masked as True
    assert mask["sleep_hours"] is True
    assert mask["mood_score"] is True
    assert mask["consecutive_duty_days"] is True
    assert mask["fatigue_level"] is False
    assert mask["workload_pressure"] is False

    # Verify imputation values are reasonable
    assert 4.0 <= imputed["sleep_hours"] <= 7.0
    assert 1 <= imputed["mood_score"] <= 10
    assert imputed["fatigue_level"] == 8
    assert imputed["workload_pressure"] == 9

    # Verify sparsity and uncertainty metrics
    assert result["sparsity_ratio"] == 0.5  # 3 out of 6 missing
    assert result["uncertainty_delta"] > 0.05
    assert "imputation_audit" in result


def test_ai_risk_engine_handles_none_values_gracefully():
    """Verify AIRiskEngine runs inference smoothly on sparse / missing inputs."""
    from backend.app.services.ai_risk_engine import AIRiskEngine

    risk_engine = AIRiskEngine()
    result = risk_engine.assess_risk_robust(
        sleep_hours=None,
        fatigue_level=None,
        mood_score=6,
        workload_pressure=None,
        physical_strain=5,
        consecutive_duty_days=None,
        deployment_zone="Peace Station"
    )

    assert "stress_score" in result
    assert "burnout_probability" in result
    assert "risk_level" in result
    assert "missing_data_telemetry" in result
    assert result["missing_data_telemetry"]["sparsity_ratio"] > 0.0
    assert "uncertainty_range" in result["missing_data_telemetry"]
