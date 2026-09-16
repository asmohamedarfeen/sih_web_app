"""
PSWMS Data Loading & Preprocessing Pipeline
Prepares multi-modal features for XGBoost and benchmark models.
"""

import os
from typing import Tuple, List, Dict, Any
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder


DEFAULT_DATA_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "data",
    "defense_stress_burnout_dataset.csv"
)

# Feature Taxonomy
HR_FEATURES = [
    "rank_tier",
    "tenure_months",
    "overtime_hours",
    "leave_deficit_days",
    "deployment_risk_index",
    "duty_rotation_cycle",
    "peer_incident_count",
    "shift_irregularity_score",
]

BEHAVIORAL_FEATURES = [
    "sentiment_polarity",
    "negative_affect_score",
    "linguistic_fatigue_index",
    "self_isolation_score",
    "cognitive_overload_score",
]

WELLNESS_FEATURES = [
    "avg_sleep_hours",
    "deep_sleep_ratio",
    "hrv_rmssd",
    "resting_heart_rate",
    "daily_step_count",
    "hydration_adherence_ratio",
    "late_night_screen_minutes",
    "screen_time_hours",
]

CATEGORICAL_FEATURES = [
    "deployment_zone",
]


class DefenseStressDataLoader:
    """Loads, cleans, engineers features, and formats data for ML benchmarking."""

    def __init__(self, data_path: str = DEFAULT_DATA_PATH):
        self.data_path = data_path
        self.scaler = StandardScaler()
        self.label_encoder = LabelEncoder()
        self.feature_names: List[str] = []
        self.df: pd.DataFrame = pd.DataFrame()

    def load_raw_data(self) -> pd.DataFrame:
        """Load CSV dataset from disk."""
        if not os.path.exists(self.data_path):
            raise FileNotFoundError(f"Dataset not found at {self.data_path}. Run download_external_data.py first.")
        self.df = pd.read_csv(self.data_path)
        return self.df

    def prepare_features_and_targets(
        self,
        target_col: str = "risk_level"
    ) -> Tuple[pd.DataFrame, pd.Series]:
        """
        Extract multi-modal feature set and target column.
        Encodes categorical variables (e.g. deployment_zone) into dummy features.
        """
        if self.df.empty:
            self.load_raw_data()

        # Combine numerical features
        num_cols = HR_FEATURES + BEHAVIORAL_FEATURES + WELLNESS_FEATURES
        
        # One-hot encode categorical features
        cat_df = pd.get_dummies(self.df[CATEGORICAL_FEATURES], drop_first=True, dtype=float)
        
        X = pd.concat([self.df[num_cols], cat_df], axis=1)
        self.feature_names = list(X.columns)

        # Encode target
        if target_col == "risk_level":
            # Map LOW: 0, MEDIUM: 1, HIGH: 2
            label_map = {"LOW": 0, "MEDIUM": 1, "HIGH": 2}
            y = self.df[target_col].map(label_map)
        else:
            y = self.df[target_col]

        return X, y

    def get_train_test_split(
        self,
        test_size: float = 0.20,
        random_state: int = 42,
        scale_numeric: bool = False
    ) -> Dict[str, Any]:
        """
        Stratified train/test split.
        Returns both unscaled (ideal for tree models like XGBoost/RF)
        and scaled versions (for distance/margin models like SVM and Logistic Regression).
        """
        X, y = self.prepare_features_and_targets()

        X_train, X_test, y_train, y_test = train_test_split(
            X, y,
            test_size=test_size,
            random_state=random_state,
            stratify=y
        )

        # Create scaled copy
        X_train_scaled = pd.DataFrame(
            self.scaler.fit_transform(X_train),
            columns=self.feature_names,
            index=X_train.index
        )
        X_test_scaled = pd.DataFrame(
            self.scaler.transform(X_test),
            columns=self.feature_names,
            index=X_test.index
        )

        return {
            "X_train": X_train,
            "X_test": X_test,
            "X_train_scaled": X_train_scaled,
            "X_test_scaled": X_test_scaled,
            "y_train": y_train,
            "y_test": y_test,
            "feature_names": self.feature_names,
            "scaler": self.scaler,
            "class_names": ["LOW", "MEDIUM", "HIGH"],
            "raw_df": self.df
        }
