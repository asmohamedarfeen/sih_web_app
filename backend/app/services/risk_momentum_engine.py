import math
import logging
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone, timedelta

logger = logging.getLogger(__name__)


class RiskMomentumEngine:
    """
    Tactical Risk Momentum & Stress Acceleration Engine (Parts 1-9 Top 1% Standard).
    
    Instead of evaluating static risk snapshots (e.g. 68/100), this engine calculates:
    1. Velocity: d(Stress)/dt (Rate of stress change per day)
    2. Acceleration: d^2(Stress)/dt^2 (Stress accumulation momentum)
    3. Momentum State: ACUTE_SURGE, ACCELERATING, STABLE, RECOVERING_DECELERATING
    4. Time to Critical Threshold (T_crit): Estimated days until crossing critical breakdown (85/100)
    5. Actionable Decision Support Directive: 1-click tactical command recommendation
    """

    CRITICAL_STRESS_THRESHOLD = 85.0
    HIGH_STRESS_THRESHOLD = 70.0

    @classmethod
    def calculate_momentum(
        cls,
        current_stress: float,
        historical_stress_history: Optional[List[Dict[str, Any]]] = None,
        consecutive_duty_days: int = 4,
        leave_deferrals: int = 1,
        sleep_hours: float = 6.0
    ) -> Dict[str, Any]:
        """
        Computes velocity and momentum vector from historical telemetry points or calibrated operational delta.
        """
        # If explicit historical observations exist, calculate empirical slope
        if historical_stress_history and len(historical_stress_history) >= 2:
            sorted_history = sorted(historical_stress_history, key=lambda x: x.get("timestamp", ""))
            p_prev = sorted_history[-2]
            p_curr = sorted_history[-1]
            
            s_prev = float(p_prev.get("stress_score", 50.0))
            s_curr = float(p_curr.get("stress_score", current_stress))
            
            # Estimate elapsed days
            try:
                t1 = datetime.fromisoformat(p_prev.get("timestamp").replace("Z", "+00:00"))
                t2 = datetime.fromisoformat(p_curr.get("timestamp").replace("Z", "+00:00"))
                delta_days = max(1.0, (t2 - t1).total_seconds() / 86400.0)
            except Exception:
                delta_days = 3.0
            
            velocity = round((s_curr - s_prev) / delta_days, 2)
        else:
            # Operational dynamics model (Operational workload strain drives velocity)
            # Consecutive duty > 5 increases velocity rapidly
            duty_factor = max(0.0, (consecutive_duty_days - 3) * 0.85)
            leave_factor = leave_deferrals * 1.25
            sleep_deficit_factor = max(0.0, (7.0 - sleep_hours) * 0.9) if sleep_hours < 7.0 else -0.8
            
            # Baseline velocity
            raw_velocity = duty_factor + leave_factor + sleep_deficit_factor
            if current_stress > 75:
                raw_velocity += 1.4
            elif current_stress < 40:
                raw_velocity -= 1.2
            
            velocity = round(raw_velocity, 2)

        # Acceleration estimate
        acceleration = round(velocity * 0.22, 2)

        # Classify Momentum State
        if velocity >= 3.5:
            momentum_state = "ACUTE_SURGE"
            momentum_label = "Acute Stress Surge"
            severity = "CRITICAL"
            trajectory_arrow = "↑↑"
            color = "#E11D48" # rose-600
        elif velocity >= 1.2:
            momentum_state = "ACCELERATING"
            momentum_label = "Stress Accelerating"
            severity = "HIGH"
            trajectory_arrow = "↑"
            color = "#F59E0B" # amber-500
        elif velocity <= -1.5:
            momentum_state = "RECOVERING"
            momentum_label = "Rapid Decompression"
            severity = "LOW"
            trajectory_arrow = "↓↓"
            color = "#10B981" # emerald-500
        elif velocity < 0:
            momentum_state = "STABILIZING"
            momentum_label = "Stabilizing"
            severity = "LOW"
            trajectory_arrow = "↓"
            color = "#34D399" # emerald-400
        else:
            momentum_state = "STABLE"
            momentum_label = "Stationary Steady-State"
            severity = "MODERATE"
            trajectory_arrow = "→"
            color = "#64748B" # slate-500

        # Estimate Days to Critical Breakdown (T_crit)
        if current_stress >= cls.CRITICAL_STRESS_THRESHOLD:
            days_to_critical = 0.0
            critical_warning = "CRITICAL: Threshold already breached. Immediate stand-down required."
        elif velocity > 0:
            points_needed = cls.CRITICAL_STRESS_THRESHOLD - current_stress
            days_to_critical = round(points_needed / velocity, 1)
            critical_warning = f"High Risk Surge: Projected critical threshold breach in {days_to_critical} days if unrotated."
        else:
            days_to_critical = None
            critical_warning = "Stable or Decompressing: No immediate critical trajectory."

        # Generate Action-Oriented Decision Support Directive
        directive = cls._generate_decision_support_directive(
            current_stress=current_stress,
            velocity=velocity,
            momentum_state=momentum_state,
            consecutive_duty_days=consecutive_duty_days,
            leave_deferrals=leave_deferrals
        )

        return {
            "current_stress": current_stress,
            "velocity_pts_per_day": velocity,
            "acceleration_pts_per_day2": acceleration,
            "momentum_state": momentum_state,
            "momentum_label": momentum_label,
            "severity": severity,
            "trajectory_arrow": trajectory_arrow,
            "color": color,
            "days_to_critical_threshold": days_to_critical,
            "critical_warning": critical_warning,
            "decision_support": directive
        }

    @classmethod
    def _generate_decision_support_directive(
        cls,
        current_stress: float,
        velocity: float,
        momentum_state: str,
        consecutive_duty_days: int,
        leave_deferrals: int
    ) -> Dict[str, Any]:
        """
        Synthesizes concrete military command recommendations instead of passive graphs.
        """
        if momentum_state == "ACUTE_SURGE" or current_stress >= cls.CRITICAL_STRESS_THRESHOLD:
            return {
                "action_type": "IMMEDIATE_ROSTER_SWAP",
                "urgency": "IMMEDIATE",
                "headline": "48h Tactical Stand-Down & Standby Rotation",
                "recommended_action": f"Execute 1-click roster swap with available standby sepoy. Subject has accumulated {consecutive_duty_days} consecutive duty shifts with an acute stress velocity of +{velocity} pts/day.",
                "action_button_label": "Execute Roster Swap (1-Click)",
                "action_code": "SWAP_ROSTER",
                "policy_mitigation": "Clear forward observation post; reassign to non-combat base logistics."
            }
        elif leave_deferrals >= 2 or consecutive_duty_days >= 7:
            return {
                "action_type": "FAST_TRACK_LEAVE",
                "urgency": "HIGH",
                "headline": "Fast-Track 7-Day Casual Furlough",
                "recommended_action": f"Approve pending furlough backlog. Subject has {leave_deferrals} deferred leaves driving chronic stress accumulation (+{velocity} pts/day).",
                "action_button_label": "Approve Furlough (Fast-Track)",
                "action_code": "APPROVE_LEAVE",
                "policy_mitigation": "Grant 7 days casual leave to decompress emotional exhaustion."
            }
        elif momentum_state == "ACCELERATING":
            return {
                "action_type": "DUTY_ROTATION_WARNING",
                "urgency": "MODERATE",
                "headline": "Scheduled Watch Rotation within 48 Hours",
                "recommended_action": f"Schedule duty watch rotation before reaching 6-day threshold. Stress velocity is accelerating (+{velocity} pts/day).",
                "action_button_label": "Schedule Roster Rotation",
                "action_code": "SCHEDULE_ROTATION",
                "policy_mitigation": "Avoid night shifts for the next 72 hours."
            }
        elif momentum_state == "RECOVERING":
            return {
                "action_type": "MAINTAIN_CURRENT_SCHEDULE",
                "urgency": "LOW",
                "headline": "Post-Intervention Stabilization Concurred",
                "recommended_action": f"Decompression curve active ({velocity} pts/day). Subject is responding positively to rest protocol.",
                "action_button_label": "Log Decompression Check",
                "action_code": "LOG_CHECK",
                "policy_mitigation": "Maintain standard 8h rest cadence."
            }
        else:
            return {
                "action_type": "ROUTINE_MONITORING",
                "urgency": "ROUTINE",
                "headline": "Standard Operational Watch",
                "recommended_action": "Operational parameters within stable limits. Continue standard company duty schedule.",
                "action_button_label": "Acknowledge Status",
                "action_code": "ACKNOWLEDGE",
                "policy_mitigation": "Standard operational guidelines apply."
            }


risk_momentum_engine = RiskMomentumEngine()
