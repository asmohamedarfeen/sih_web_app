"""
PSWMS SHAP Explainability Engine for Welfare Officers
Computes TreeSHAP attributions for the trained XGBoost model and generates
global summary plots, local waterfall dossiers, and human-interpretable clinical narratives.
"""

import os
import sys
import joblib
from typing import Dict, Any, List, Tuple
import numpy as np
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import seaborn as sns
import shap

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
WHY_DIR = os.path.dirname(BASE_DIR)
MODELS_DIR = os.path.join(WHY_DIR, "models")
DATA_DIR = os.path.join(WHY_DIR, "data")
REPORTS_DIR = os.path.join(BASE_DIR, "reports")


class ShapExplainerEngine:
    """Calculates TreeSHAP values and generates global and local explanations."""

    def __init__(
        self,
        model_path: str = os.path.join(MODELS_DIR, "xgboost_risk_model.joblib"),
        data_path: str = os.path.join(DATA_DIR, "defense_stress_burnout_dataset.csv")
    ):
        os.makedirs(REPORTS_DIR, exist_ok=True)
        self.model = joblib.load(model_path)
        self.raw_df = pd.read_csv(data_path)
        self.X, self.feature_names = self._prepare_features()
        self.explainer = shap.TreeExplainer(self.model)
        self.shap_values = None
        self.class_names = ["LOW", "MEDIUM", "HIGH"]

    def _prepare_features(self) -> Tuple[pd.DataFrame, List[str]]:
        """Align features exactly with the trained model schema."""
        HR_FEATURES = [
            "rank_tier", "tenure_months", "overtime_hours", "leave_deficit_days",
            "deployment_risk_index", "duty_rotation_cycle", "peer_incident_count", "shift_irregularity_score"
        ]
        BEHAVIORAL_FEATURES = [
            "sentiment_polarity", "negative_affect_score", "linguistic_fatigue_index",
            "self_isolation_score", "cognitive_overload_score"
        ]
        WELLNESS_FEATURES = [
            "avg_sleep_hours", "deep_sleep_ratio", "hrv_rmssd", "resting_heart_rate",
            "daily_step_count", "hydration_adherence_ratio", "late_night_screen_minutes", "screen_time_hours"
        ]
        cat_df = pd.get_dummies(self.raw_df[["deployment_zone"]], drop_first=True, dtype=float)
        X = pd.concat([self.raw_df[HR_FEATURES + BEHAVIORAL_FEATURES + WELLNESS_FEATURES], cat_df], axis=1)
        return X, list(X.columns)

    def compute_shap_values(self, max_samples: int = 1000) -> shap.Explanation:
        """Compute TreeSHAP values across sample records."""
        sample_X = self.X.iloc[:max_samples]
        print(f"⏳ Computing TreeSHAP values for {len(sample_X)} personnel records...")
        self.shap_values = self.explainer(sample_X)
        print("✅ TreeSHAP values computation complete.")
        return self.shap_values

    def plot_global_summary_beeswarm(self, class_idx: int = 2):
        """
        Generate SHAP Beeswarm Plot for High Risk Class (class_idx=2).
        Shows both the magnitude of importance and directionality (high vs low feature values).
        """
        if self.shap_values is None:
            self.compute_shap_values()

        plt.figure(figsize=(12, 8))
        shap_slice = self.shap_values[:, :, class_idx]
        shap.plots.beeswarm(shap_slice, max_display=15, show=False)
        plt.title(
            f"Global SHAP Beeswarm Summary: Drivers of '{self.class_names[class_idx]}' Classification",
            fontsize=13, weight="bold", pad=12
        )
        out_path = os.path.join(REPORTS_DIR, "shap_summary_beeswarm.png")
        plt.savefig(out_path, bbox_inches="tight", dpi=300)
        plt.close()
        print(f"✅ Global Beeswarm plot saved to {out_path}")

    def plot_feature_importance_bar(self, class_idx: int = 2):
        """Plot Mean Absolute SHAP values across features."""
        if self.shap_values is None:
            self.compute_shap_values()

        plt.figure(figsize=(11, 7))
        shap_slice = self.shap_values[:, :, class_idx]
        shap.plots.bar(shap_slice, max_display=15, show=False)
        plt.title(
            f"Global Feature Importance: Mean |SHAP| Value ({self.class_names[class_idx]} Risk)",
            fontsize=13, weight="bold", pad=12
        )
        out_path = os.path.join(REPORTS_DIR, "shap_feature_importance_bar.png")
        plt.savefig(out_path, bbox_inches="tight", dpi=300)
        plt.close()
        print(f"✅ SHAP Feature Importance bar chart saved to {out_path}")

    def plot_dependence_interaction(self):
        """Plot SHAP Dependence Scatter: Sleep Duration colored by Overtime."""
        if self.shap_values is None:
            self.compute_shap_values()

        plt.figure(figsize=(10, 6.5))
        shap_slice = self.shap_values[:, :, 2] # High risk
        shap.plots.scatter(
            shap_slice[:, "avg_sleep_hours"],
            color=shap_slice[:, "overtime_hours"],
            show=False
        )
        plt.title("SHAP Non-Linear Dependence: Sleep Duration vs. Overtime Hours", fontsize=13, weight="bold", pad=12)
        out_path = os.path.join(REPORTS_DIR, "shap_dependence_interaction.png")
        plt.savefig(out_path, bbox_inches="tight", dpi=300)
        plt.close()
        print(f"✅ SHAP dependence interaction plot saved to {out_path}")

    def generate_soldier_waterfall_dossier(self, record_idx: int, soldier_name: str, filename: str):
        """
        Generate Local Explanation Waterfall Plot for an individual soldier.
        Decomposes baseline log-odds f(x) and exact contribution (+/-) of each feature.
        """
        if self.shap_values is None:
            self.compute_shap_values()

        plt.figure(figsize=(10, 6.5))
        shap_slice = self.shap_values[record_idx, :, 2] # High risk attribution
        shap.plots.waterfall(shap_slice, max_display=12, show=False)
        plt.title(f"Local AI Explanation Dossier: {soldier_name} (High Risk Decision Path)", fontsize=13, weight="bold", pad=12)
        out_path = os.path.join(REPORTS_DIR, filename)
        plt.savefig(out_path, bbox_inches="tight", dpi=300)
        plt.close()
        print(f"✅ Soldier waterfall plot saved to {out_path}")

    def generate_welfare_officer_narrative(self, record_idx: int, soldier_name: str) -> str:
        """
        Translates raw mathematical SHAP values into an actionable,
        clinical and operational narrative for Unit Welfare Officers and Commanders.
        """
        row = self.X.iloc[record_idx]
        probs = self.model.predict_proba(row.to_frame().T)[0]
        predicted_idx = int(np.argmax(probs))
        predicted_label = self.class_names[predicted_idx]
        conf = probs[predicted_idx] * 100

        # Extract SHAP contributions for the predicted class
        sv_row = self.shap_values[record_idx, :, predicted_idx].values
        feat_contrib = sorted(
            zip(self.feature_names, sv_row, row.values),
            key=lambda x: abs(x[1]),
            reverse=True
        )

        escalators = [fc for fc in feat_contrib if fc[1] > 0][:3]
        buffers = [fc for fc in feat_contrib if fc[1] < 0][:2]

        narrative = f"""### 🎖️ Clinical & Operational AI Dossier: {soldier_name}
- **Assigned Risk Classification**: **{predicted_label}** (Model Confidence: {conf:.1f}%)
- **Base Model Expected Value**: {self.shap_values.base_values[record_idx, predicted_idx]:.2f} (Cohort Average)
- **Individual Output Value f(x)**: {self.shap_values.values[record_idx, :, predicted_idx].sum() + self.shap_values.base_values[record_idx, predicted_idx]:.2f}

#### ⚠️ Primary Risk Escalators (Factors driving risk upward):
"""
        for feat, shap_v, val in escalators:
            narrative += f"1. **{feat.replace('_', ' ').title()}** (Observed Value: `{val:.1f}`): Contributed **+{abs(shap_v):.3f}** to risk escalation.\n"

        narrative += "\n#### 🛡️ Protective Resilience Buffers (Factors mitigating risk downward):\n"
        for feat, shap_v, val in buffers:
            narrative += f"1. **{feat.replace('_', ' ').title()}** (Observed Value: `{val:.1f}`): Contributed **-{abs(shap_v):.3f}** to operational resilience.\n"

        narrative += "\n#### 👨‍⚕️ Actionable Welfare Recommendation:\n"
        if predicted_label == "HIGH":
            narrative += "- **Priority 1 Intervention**: Mandatory 48-hour sleep reset and duty off-load.\n- **Priority 2 Action**: Psychological counseling session with Regimental Welfare Officer.\n- **Priority 3 Monitoring**: Daily nocturnal HRV smartband tracking to detect autonomic nervous system recovery."
        elif predicted_label == "MEDIUM":
            narrative += "- **Proactive Adjustment**: Shift roster restructuring to prevent overtime exceeding 20 hours/week.\n- **Hydration & Sleep Check**: Recommend 7+ hours rest and peer check-in."
        else:
            narrative += "- **Status**: Retain on active operational status with routine bi-weekly health screening."

        return narrative


if __name__ == "__main__":
    engine = ShapExplainerEngine()
    engine.compute_shap_values(max_samples=1000)
    engine.plot_global_summary_beeswarm(class_idx=2)
    engine.plot_feature_importance_bar(class_idx=2)
    engine.plot_dependence_interaction()

    # Find a High Risk soldier and a Low Risk soldier in the dataset
    high_risk_idx = engine.raw_df[engine.raw_df["risk_level"] == "HIGH"].index[0]
    low_risk_idx = engine.raw_df[engine.raw_df["risk_level"] == "LOW"].index[0]

    engine.generate_soldier_waterfall_dossier(
        high_risk_idx, "Sepoy Amit Kumar (DEF-10014)", "shap_local_waterfall_high_risk.png"
    )
    engine.generate_soldier_waterfall_dossier(
        low_risk_idx, "Havildar Priya Sharma (DEF-10002)", "shap_local_waterfall_low_risk.png"
    )

    narrative = engine.generate_welfare_officer_narrative(high_risk_idx, "Sepoy Amit Kumar")
    print("\n" + narrative)
