from typing import Dict, Any, Optional, Tuple, List
import math


class MissingDataEngine:
    """
    Robust Missing-Data Handling Engine for High-Tempo Military Operations.
    Implements multi-tiered imputation:
    1. Historical personal exponential decay fill (short gaps)
    2. Operational terrain / deployment zone stratified medians
    3. Missingness indicator feature masking (informative missingness)
    4. Uncertainty interval expansion for downstream risk bounds
    """

    # Validated population reference baselines (Armed Forces & CAPF norms)
    GLOBAL_POPULATION_MEDIANS: Dict[str, float] = {
        "sleep_hours": 6.2,
        "fatigue_level": 4.0,
        "mood_score": 6.5,
        "workload_pressure": 5.0,
        "physical_strain": 4.5,
        "consecutive_duty_days": 3.0,
        "rank_tier": 2.0,
        "tenure_months": 48.0
    }

    # Terrain-specific physiological and workload adjustments
    TERRAIN_PRIORS: Dict[str, Dict[str, float]] = {
        "High Altitude (Siachen/Ladakh)": {
            "sleep_hours": 5.4,
            "fatigue_level": 5.8,
            "physical_strain": 6.2,
            "workload_pressure": 6.0
        },
        "Field Outpost": {
            "sleep_hours": 5.8,
            "fatigue_level": 5.2,
            "physical_strain": 5.5,
            "workload_pressure": 5.8
        },
        "Peace Station": {
            "sleep_hours": 7.0,
            "fatigue_level": 3.2,
            "physical_strain": 3.5,
            "workload_pressure": 4.0
        }
    }

    def __init__(self, decay_rate_per_day: float = 0.85):
        self.decay_rate_per_day = decay_rate_per_day

    def impute_and_mask(
        self,
        telemetry: Dict[str, Any],
        deployment_zone: str = "Peace Station",
        personnel_history: Optional[Dict[str, float]] = None,
        days_since_last_record: int = 1,
        tracked_keys: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """
        Takes raw/sparse telemetry dictionary, identifies missing fields,
        performs stratified imputation, and outputs missingness indicator masks.
        """
        personnel_history = personnel_history or {}
        terrain_offsets = self.TERRAIN_PRIORS.get(deployment_zone, {})
        
        imputed_features: Dict[str, Any] = {}
        missing_mask: Dict[str, bool] = {}
        imputation_audit: Dict[str, str] = {}

        keys_to_evaluate = tracked_keys if tracked_keys is not None else list(telemetry.keys()) if telemetry else list(self.GLOBAL_POPULATION_MEDIANS.keys())
        missing_count = 0

        for key in keys_to_evaluate:
            raw_val = telemetry.get(key)
            is_missing = (raw_val is None or (isinstance(raw_val, float) and math.isnan(raw_val)))
            missing_mask[key] = is_missing

            if not is_missing:
                imputed_features[key] = raw_val
                imputation_audit[key] = "OBSERVED_DIRECT"
            else:
                missing_count += 1
                default_baseline = self.GLOBAL_POPULATION_MEDIANS.get(key, 5.0)
                # Strategy 1: Exponential decay from historical baseline if available
                if key in personnel_history and personnel_history[key] is not None:
                    hist_val = float(personnel_history[key])
                    terrain_prior = terrain_offsets.get(key, default_baseline)
                    # decay weight towards population prior
                    weight = self.decay_rate_per_day ** max(1, days_since_last_record)
                    decayed_val = (weight * hist_val) + ((1.0 - weight) * terrain_prior)
                    imputed_features[key] = round(decayed_val, 2)
                    imputation_audit[key] = f"HISTORICAL_DECAY_FILL (t={days_since_last_record}d)"
                # Strategy 2: Stratified terrain-specific median prior
                elif key in terrain_offsets:
                    imputed_features[key] = terrain_offsets[key]
                    imputation_audit[key] = "TERRAIN_STRATIFIED_PRIOR"
                # Strategy 3: Global population benchmark default
                else:
                    imputed_features[key] = default_baseline
                    imputation_audit[key] = "GLOBAL_POPULATION_MEDIAN"

        total_count = max(1, len(keys_to_evaluate))
        sparsity_ratio = round(missing_count / total_count, 3)

        # Calculate uncertainty interval penalty (higher sparsity expands confidence bounds)
        uncertainty_delta = round(0.25 * sparsity_ratio, 3)

        return {
            "imputed_features": imputed_features,
            "missing_mask": missing_mask,
            "missing_count": missing_count,
            "total_features": total_count,
            "sparsity_ratio": sparsity_ratio,
            "uncertainty_delta": uncertainty_delta,
            "imputation_audit": imputation_audit
        }
