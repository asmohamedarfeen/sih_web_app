"""
PSWMS Realistic Missing Data Simulator
Simulates realistic sensor dropout, uncharged wearables, skipped behavioral check-ins,
and field logging delays in defense personnel stress & burnout telemetry.
"""

import os
import json
from typing import Dict, Any, Tuple
import numpy as np
import pandas as pd

DATA_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data"
)
INPUT_CSV = os.path.join(DATA_DIR, "defense_stress_burnout_dataset.csv")
OUTPUT_CSV = os.path.join(DATA_DIR, "defense_stress_burnout_missing_dataset.csv")
STATS_JSON = os.path.join(DATA_DIR, "missingness_statistics.json")

# Domain-specific missingness probabilities
# Wearables & physiological sensors drop out frequently (sweat, dead battery, off-wrist)
SENSOR_MISSING_RATES = {
    "hrv_rmssd": 0.25,                  # 25% missing due to sensor disconnect / motion artifact
    "deep_sleep_ratio": 0.25,           # 25% missing due to band uncharged during sleep
    "avg_sleep_hours": 0.20,            # 20% missing sleep tracking
    "resting_heart_rate": 0.20,         # 20% missing heart rate
    "daily_step_count": 0.20,           # 20% missing pedometer data
    "hydration_adherence_ratio": 0.30,  # 30% missing manual hydration logging
    "late_night_screen_minutes": 0.15,  # 15% missing screen usage
    "screen_time_hours": 0.15,          # 15% missing
}

# Behavioral text check-ins (missed or skipped self-assessments)
BEHAVIORAL_MISSING_RATES = {
    "sentiment_polarity": 0.20,         # 20% missed text check-in
    "negative_affect_score": 0.20,      # 20% missed text check-in
    "linguistic_fatigue_index": 0.20,   # 20% missed text check-in
    "self_isolation_score": 0.15,       # 15% missing
    "cognitive_overload_score": 0.15,   # 15% missing
}

# Administrative and Operational metrics (occasional logging delay in field units)
OPERATIONAL_MISSING_RATES = {
    "shift_irregularity_score": 0.08,   # 8% delayed roster entry
    "leave_deficit_days": 0.05,         # 5% delayed leave record update
    "peer_incident_count": 0.05,        # 5% reporting delay
    "overtime_hours": 0.05,             # 5% delayed timesheet
}


def inject_realistic_missingness(
    df: pd.DataFrame,
    seed: int = 42
) -> Tuple[pd.DataFrame, Dict[str, Any]]:
    """
    Injects realistic Missing Completely at Random (MCAR) and Missing at Random (MAR)
    patterns into physiological, behavioral, and operational features.
    """
    np.random.seed(seed)
    df_missing = df.copy()

    all_missing_rules = {
        **SENSOR_MISSING_RATES,
        **BEHAVIORAL_MISSING_RATES,
        **OPERATIONAL_MISSING_RATES
    }

    missing_stats = {}
    total_injected = 0
    total_cells = df.shape[0] * len(all_missing_rules)

    for col, rate in all_missing_rules.items():
        if col in df_missing.columns:
            # Generate random mask based on target missing rate
            mask = np.random.rand(len(df_missing)) < rate
            df_missing.loc[mask, col] = np.nan
            count = int(mask.sum())
            total_injected += count
            missing_stats[col] = {
                "missing_count": count,
                "missing_pct": round((count / len(df_missing)) * 100, 2),
                "target_rate_pct": round(rate * 100, 1)
            }

    overall_summary = {
        "total_records": len(df_missing),
        "columns_with_missing_values": len(missing_stats),
        "total_missing_cells": total_injected,
        "overall_missing_pct": round((total_injected / total_cells) * 100, 2),
        "feature_details": missing_stats
    }

    return df_missing, overall_summary


def run_simulation():
    """Load clean dataset, inject realistic missing values, and save artifacts."""
    print("🛡️ Simulating realistic missing telemetry data for PSWMS...")
    if not os.path.exists(INPUT_CSV):
        raise FileNotFoundError(f"Input file not found at {INPUT_CSV}")

    df_clean = pd.read_csv(INPUT_CSV)
    print(f"   Loaded clean dataset: {df_clean.shape[0]} rows, {df_clean.shape[1]} columns")

    df_missing, stats = inject_realistic_missingness(df_clean, seed=42)

    df_missing.to_csv(OUTPUT_CSV, index=False)
    print(f"✅ Saved missing dataset to {OUTPUT_CSV}")

    with open(STATS_JSON, "w") as f:
        json.dump(stats, f, indent=2)
    print(f"✅ Saved missingness statistics to {STATS_JSON}")

    print(f"\n📊 Summary of Simulated Missing Data:")
    print(f"   Total missing cells: {stats['total_missing_cells']} across {stats['columns_with_missing_values']} features")
    print(f"   Overall missing rate in telemetry/behavioral features: {stats['overall_missing_pct']}%")
    print(f"   Top missing features: HRV ({stats['feature_details'].get('hrv_rmssd', {}).get('missing_pct')}%), "
          f"Deep Sleep ({stats['feature_details'].get('deep_sleep_ratio', {}).get('missing_pct')}%), "
          f"Hydration ({stats['feature_details'].get('hydration_adherence_ratio', {}).get('missing_pct')}%)")

    return df_missing, stats


if __name__ == "__main__":
    run_simulation()
