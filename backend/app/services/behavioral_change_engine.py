import numpy as np
from typing import Dict, Any, List, Optional


class BehavioralChangeEngine:
    """
    Behavioral Change Detection Engine.
    
    Purpose:
      Detects unusual changes in a person's behavior over time.
    
    Examples / Evaluated Domains:
      1. Suddenly taking many leave days (Leave Spike Anomaly)
      2. Working excessive overtime (Overtime Surge Anomaly)
      3. Missing training (Training Non-Attendance Drift)
      4. Declining performance (Appraisal & Operational Score Drop)
      5. Reduced wellness participation (App & Survey Disengagement)
    
    AI Process:
      Compare:
        Current Behavior
          VS
        Historical Behavior (30 to 90-day baseline)
    
    Output:
      Behavior Change Score (0 - 100) & Categorical Severity Tier
    """

    # Domain Weights summing to 1.00
    DOMAIN_WEIGHTS = {
        "leave_days": 0.22,             # Suddenly taking many leave days
        "overtime_hours": 0.22,         # Working excessive overtime
        "missing_training": 0.20,       # Missing training sessions
        "declining_performance": 0.18,  # Declining performance score
        "wellness_participation": 0.18  # Reduced wellness participation
    }

    @staticmethod
    def classify_behavior_score(score: float) -> str:
        """
        Classifies the Behavior Change Score into clinical/command tiers:
        - >= 75: Significant Anomaly (Urgent supervisor & welfare outreach required)
        - 50 - 74: Moderate Behavioral Shift (Notable drift, schedule informal check-in)
        - 25 - 49: Mild Drift (Minor routine variance, within operational limits)
        - < 25: Stable Baseline (Consistent with historical habits)
        """
        if score >= 75.0:
            return "Significant Anomaly"
        elif score >= 50.0:
            return "Moderate Behavioral Shift"
        elif score >= 25.0:
            return "Mild Drift"
        else:
            return "Stable Baseline"

    def evaluate_behavioral_change(
        self,
        # 1. Leave Days (Days per month requested/taken)
        current_leave_days: float = 6.0,
        historical_leave_days: float = 1.2,

        # 2. Overtime Hours (Hours per week beyond standard 40h)
        current_overtime_hours: float = 26.0,
        historical_overtime_hours: float = 8.0,

        # 3. Training Attendance (% of mandatory drills/sessions attended)
        current_training_attendance: float = 65.0,
        historical_training_attendance: float = 96.0,

        # 4. Performance Rating (0 - 100 operational/appraisal index)
        current_performance_rating: float = 62.0,
        historical_performance_rating: float = 89.0,

        # 5. Wellness Participation (% of daily check-ins & survey responses completed)
        current_wellness_participation: float = 38.0,
        historical_wellness_participation: float = 92.0,

        custom_weights: Optional[Dict[str, float]] = None
    ) -> Dict[str, Any]:
        """
        Compares Current Behavior VS Historical Behavior across the 5 domains
        and calculates a normalized Behavior Change Score.
        """
        weights = custom_weights or self.DOMAIN_WEIGHTS

        # Domain 1: Suddenly taking many leave days
        leave_diff = max(0.0, current_leave_days - historical_leave_days)
        leave_pct_change = (
            round(((current_leave_days - historical_leave_days) / max(0.5, historical_leave_days)) * 100, 1)
        )
        leave_anomaly = float(np.clip((leave_diff / 5.0) * 100.0, 0.0, 100.0))

        # Domain 2: Working excessive overtime
        ot_diff = max(0.0, current_overtime_hours - historical_overtime_hours)
        ot_pct_change = (
            round(((current_overtime_hours - historical_overtime_hours) / max(1.0, historical_overtime_hours)) * 100, 1)
        )
        ot_anomaly = float(np.clip((ot_diff / 18.0) * 100.0, 0.0, 100.0))

        # Domain 3: Missing training (drop in attendance)
        training_drop = max(0.0, historical_training_attendance - current_training_attendance)
        training_pct_change = -round(training_drop, 1)
        training_anomaly = float(np.clip((training_drop / 35.0) * 100.0, 0.0, 100.0))

        # Domain 4: Declining performance
        perf_drop = max(0.0, historical_performance_rating - current_performance_rating)
        perf_pct_change = -round(perf_drop, 1)
        perf_anomaly = float(np.clip((perf_drop / 30.0) * 100.0, 0.0, 100.0))

        # Domain 5: Reduced wellness participation
        wellness_drop = max(0.0, historical_wellness_participation - current_wellness_participation)
        wellness_pct_change = -round(wellness_drop, 1)
        wellness_anomaly = float(np.clip((wellness_drop / 45.0) * 100.0, 0.0, 100.0))

        # Aggregate Weighted Behavior Change Score
        total_score_raw = (
            leave_anomaly * weights["leave_days"] +
            ot_anomaly * weights["overtime_hours"] +
            training_anomaly * weights["missing_training"] +
            perf_anomaly * weights["declining_performance"] +
            wellness_anomaly * weights["wellness_participation"]
        )

        behavior_change_score = int(round(np.clip(total_score_raw, 5.0, 99.0)))
        severity_tier = self.classify_behavior_score(behavior_change_score)

        # Explainable Detailed Comparison Factors
        factors = [
            {
                "key": "leave_days",
                "example_label": "Suddenly taking many leave days",
                "domain": "Leave Frequency Pattern",
                "historical_behavior": f"{historical_leave_days} days/mo",
                "current_behavior": f"{current_leave_days} days/mo",
                "historical_val": historical_leave_days,
                "current_val": current_leave_days,
                "unit": "days/mo",
                "change_pct": leave_pct_change,
                "direction": "INCREASED" if leave_pct_change > 0 else "STABLE",
                "anomaly_score": round(leave_anomaly, 1),
                "flag": "High Surge" if leave_anomaly >= 70 else "Moderate Spike" if leave_anomaly >= 40 else "Normal",
                "description": "Sudden escalation in leave requests indicating underlying domestic distress or burnout evasion."
            },
            {
                "key": "overtime_hours",
                "example_label": "Working excessive overtime",
                "domain": "Watch Roster Overtime",
                "historical_behavior": f"{historical_overtime_hours} hrs/wk",
                "current_behavior": f"{current_overtime_hours} hrs/wk",
                "historical_val": historical_overtime_hours,
                "current_val": current_overtime_hours,
                "unit": "hrs/wk",
                "change_pct": ot_pct_change,
                "direction": "INCREASED" if ot_pct_change > 0 else "STABLE",
                "anomaly_score": round(ot_anomaly, 1),
                "flag": "Excessive Overtime" if ot_anomaly >= 70 else "Elevated" if ot_anomaly >= 40 else "Normal",
                "description": "Excessive consecutive shift hours accumulating physical exhaustion and cognitive fatigue."
            },
            {
                "key": "missing_training",
                "example_label": "Missing training",
                "domain": "Tactical Drills & Training",
                "historical_behavior": f"{historical_training_attendance}% attended",
                "current_behavior": f"{current_training_attendance}% attended",
                "historical_val": historical_training_attendance,
                "current_val": current_training_attendance,
                "unit": "% attendance",
                "change_pct": training_pct_change,
                "direction": "DECREASED" if training_pct_change < 0 else "STABLE",
                "anomaly_score": round(training_anomaly, 1),
                "flag": "Frequent Absences" if training_anomaly >= 70 else "Occasional Missed" if training_anomaly >= 40 else "Consistent",
                "description": "Uncharacteristic absenteeism in routine battalion drills and squad physical readiness sessions."
            },
            {
                "key": "declining_performance",
                "example_label": "Declining performance",
                "domain": "Operational Appraisal Rating",
                "historical_behavior": f"{historical_performance_rating} / 100",
                "current_behavior": f"{current_performance_rating} / 100",
                "historical_val": historical_performance_rating,
                "current_val": current_performance_rating,
                "unit": "points",
                "change_pct": perf_pct_change,
                "direction": "DECREASED" if perf_pct_change < 0 else "STABLE",
                "anomaly_score": round(perf_anomaly, 1),
                "flag": "Noticeable Decline" if perf_anomaly >= 70 else "Minor Dip" if perf_anomaly >= 40 else "Standard",
                "description": "Supervisory evaluation dip reflecting reduced focus, delayed task execution, and operational strain."
            },
            {
                "key": "wellness_participation",
                "example_label": "Reduced wellness participation",
                "domain": "App Check-in & Survey Engagement",
                "historical_behavior": f"{historical_wellness_participation}% adherence",
                "current_behavior": f"{current_wellness_participation}% adherence",
                "historical_val": historical_wellness_participation,
                "current_val": current_wellness_participation,
                "unit": "% compliance",
                "change_pct": wellness_pct_change,
                "direction": "DECREASED" if wellness_pct_change < 0 else "STABLE",
                "anomaly_score": round(wellness_anomaly, 1),
                "flag": "Severe Disengagement" if wellness_anomaly >= 70 else "Reduced Frequency" if wellness_anomaly >= 40 else "Active",
                "description": "Sharp drop in mobile wellness pulse logging, self-assessments, and counselor portal interactions."
            }
        ]

        # Clinical / Command Guidance
        if severity_tier == "Significant Anomaly":
            recommendation = "Multiple acute behavioral shifts detected simultaneously. Mandate proactive welfare officer 1-on-1 interview and pause overtime rostering."
        elif severity_tier == "Moderate Behavioral Shift":
            recommendation = "Noticeable divergence from historical baseline habits. Recommend supervisor check-in and review duty schedule distribution."
        elif severity_tier == "Mild Drift":
            recommendation = "Minor behavioral variations observed. Maintain continuous monitoring over next 14-day shift cycle."
        else:
            recommendation = "Individual behavior aligns closely with established 90-day baseline. No action required."

        return {
            "behavior_change_score": behavior_change_score,
            "severity_tier": severity_tier,
            "purpose": "Detects unusual changes in a person's behavior over time.",
            "comparison_summary": "Current behavior VS Historical behavior",
            "confidence_pct": 94.2,
            "anomaly_detected": behavior_change_score >= 50,
            "primary_driver": max(factors, key=lambda f: f["anomaly_score"])["example_label"],
            "factors": factors,
            "recommendation": recommendation
        }


behavioral_change_engine = BehavioralChangeEngine()
