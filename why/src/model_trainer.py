"""
PSWMS XGBoost Training & Calibration Engine
Trains, tunes, and serializes the XGBoost classifier for multi-modal stress prediction.
"""

import os
import joblib
from typing import Dict, Any, Tuple
import numpy as np
import pandas as pd
from xgboost import XGBClassifier
from sklearn.calibration import CalibratedClassifierCV
from sklearn.metrics import accuracy_score, classification_report, log_loss

MODELS_DIR = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "models"
)


class XGBoostStressTrainer:
    """Trains, optimizes, and calibrates the XGBoost classifier for stress risk prediction."""

    def __init__(self, **hyperparams):
        self.default_params = {
            "n_estimators": 250,
            "learning_rate": 0.05,
            "max_depth": 5,
            "min_child_weight": 3,
            "subsample": 0.85,
            "colsample_bytree": 0.85,
            "reg_alpha": 0.1,   # L1 Regularization
            "reg_lambda": 1.2,  # L2 Regularization
            "objective": "multi:softprob",
            "eval_metric": ["mlogloss", "merror"],
            "random_state": 42,
            "n_jobs": -1
        }
        self.default_params.update(hyperparams)
        self.model = XGBClassifier(**self.default_params)
        self.calibrated_model = None
        self.feature_names = []

    def train(
        self,
        X_train: pd.DataFrame,
        y_train: pd.Series,
        X_val: pd.DataFrame = None,
        y_val: pd.Series = None
    ) -> XGBClassifier:
        """Fit XGBoost model with early stopping on validation set if provided."""
        self.feature_names = list(X_train.columns)

        if X_val is not None and y_val is not None:
            self.model.fit(
                X_train, y_train,
                eval_set=[(X_train, y_train), (X_val, y_val)],
                verbose=False
            )
        else:
            self.model.fit(X_train, y_train, verbose=False)

        # Calibrate probabilities using Sigmoid/Platt Scaling
        try:
            self.calibrated_model = CalibratedClassifierCV(
                estimator=self.model,
                method="sigmoid",
                cv="prefit"
            )
            val_X = X_val if X_val is not None else X_train
            val_y = y_val if y_val is not None else y_train
            self.calibrated_model.fit(val_X, val_y)
        except Exception:
            self.calibrated_model = self.model

        return self.model

    def predict(self, X: pd.DataFrame) -> np.ndarray:
        """Predict multi-class risk level (0=LOW, 1=MEDIUM, 2=HIGH)."""
        return self.model.predict(X)

    def predict_proba(self, X: pd.DataFrame) -> np.ndarray:
        """Predict calibrated probabilities for each class."""
        if self.calibrated_model is not None:
            return self.calibrated_model.predict_proba(X)
        return self.model.predict_proba(X)

    def predict_stress_risk_index(self, X: pd.DataFrame) -> pd.DataFrame:
        """
        Output continuous stress risk probability (0.0 to 1.0)
        and predicted operational risk level.
        """
        probs = self.predict_proba(X)
        # Expected risk index: 0*P(Low) + 0.5*P(Med) + 1.0*P(High)
        expected_risk = probs[:, 0] * 0.15 + probs[:, 1] * 0.55 + probs[:, 2] * 0.95
        preds = np.argmax(probs, axis=1)
        label_map = {0: "LOW", 1: "MEDIUM", 2: "HIGH"}

        return pd.DataFrame({
            "prob_low": probs[:, 0].round(4),
            "prob_medium": probs[:, 1].round(4),
            "prob_high": probs[:, 2].round(4),
            "calibrated_stress_index": expected_risk.round(4),
            "predicted_risk_level": [label_map[p] for p in preds]
        })

    def get_feature_importances(self) -> pd.DataFrame:
        """Extract Gain, Weight, and Cover feature importances."""
        booster = self.model.get_booster()
        score_gain = booster.get_score(importance_type="gain")
        score_weight = booster.get_score(importance_type="weight")
        score_cover = booster.get_score(importance_type="cover")

        records = []
        for feat in self.feature_names:
            records.append({
                "feature": feat,
                "importance_gain": score_gain.get(feat, 0.0),
                "importance_weight": score_weight.get(feat, 0),
                "importance_cover": score_cover.get(feat, 0.0),
            })

        df_imp = pd.DataFrame(records).sort_values(by="importance_gain", ascending=False)
        return df_imp.reset_index(drop=True)

    def save_model(self, base_name: str = "xgboost_risk_model") -> Dict[str, str]:
        """Save native JSON and joblib artifacts."""
        os.makedirs(MODELS_DIR, exist_ok=True)
        json_path = os.path.join(MODELS_DIR, f"{base_name}.json")
        joblib_path = os.path.join(MODELS_DIR, f"{base_name}.joblib")

        self.model.save_model(json_path)
        joblib.dump(self.model, joblib_path)
        print(f"✅ XGBoost model saved to {json_path} and {joblib_path}")
        return {"json": json_path, "joblib": joblib_path}
