from typing import List, Dict, Any, Optional

COMPANY_TWIN_CATALOG: Dict[str, Dict[str, Any]] = {
    "coy-alpha": {
        "id": "coy-alpha",
        "name": "Alpha Company",
        "battalion": "Alpha Battalion",
        "commander_name": "Major Arvind Saxena",
        "commander_rank": "Major",
        "strength": 105,
        "readiness": 88,
        "fatigue": "Low",
        "training": "Excellent",
        "morale": "Resilient",
        "deployment_pressure": "Moderate",
        "leadership_stability": "Strong",
        "key_strengths": ["Mountain Warfare", "Night Navigation", "Sniper Team Certified"],
        "vulnerabilities": ["Minor supply delay on cold weather gear"],
        "recent_deployment": "Peace station rotation 45 days ago",
        "wear_tear_index": 18.2,
    },
    "coy-bravo": {
        "id": "coy-bravo",
        "name": "Bravo Company",
        "battalion": "Alpha Battalion",
        "commander_name": "Major K. V. Sharma",
        "commander_rank": "Major",
        "strength": 102,
        "readiness": 74,
        "fatigue": "High",
        "training": "Good",
        "morale": "Strained",
        "deployment_pressure": "Surge",
        "leadership_stability": "Developing",
        "key_strengths": ["Rapid Urban Cordon", "Signals Intercept"],
        "vulnerabilities": ["Accumulated sleep deficit over 18 night watches", "Deferred leave requests"],
        "recent_deployment": "Intensive forward post watch 8 days ago",
        "wear_tear_index": 44.8,
    },
    "coy-charlie": {
        "id": "coy-charlie",
        "name": "Charlie Company",
        "battalion": "Alpha Battalion",
        "commander_name": "Captain Rohit Sen",
        "commander_rank": "Captain",
        "strength": 98,
        "readiness": 79,
        "fatigue": "Medium",
        "training": "Adequate",
        "morale": "Stable",
        "deployment_pressure": "Moderate",
        "leadership_stability": "Strong",
        "key_strengths": ["Mechanized Transport", "Perimeter Security"],
        "vulnerabilities": ["NCO transition in 2nd Platoon"],
        "recent_deployment": "Convoy escort 20 days ago",
        "wear_tear_index": 28.1,
    },
    "coy-delta": {
        "id": "coy-delta",
        "name": "Delta Company",
        "battalion": "Alpha Battalion",
        "commander_name": "Major Vikram Rathore",
        "commander_rank": "Major",
        "strength": 104,
        "readiness": 82,
        "fatigue": "Medium",
        "training": "Good",
        "morale": "Stable",
        "deployment_pressure": "High",
        "leadership_stability": "Excellent",
        "key_strengths": ["High-Vigilance Border Patrol", "Disciplined Watch Cycle", "High NCO Retention"],
        "vulnerabilities": ["Approaching fatigue threshold in 14 days if un-rotated"],
        "recent_deployment": "Forward Sector Observation 16 days ago",
        "wear_tear_index": 31.4,
    },
    "coy-echo": {
        "id": "coy-echo",
        "name": "Echo Company",
        "battalion": "Alpha Battalion",
        "commander_name": "Major Gurpreet Singh",
        "commander_rank": "Major",
        "strength": 101,
        "readiness": 91,
        "fatigue": "Low",
        "training": "Excellent",
        "morale": "Resilient",
        "deployment_pressure": "Low",
        "leadership_stability": "Excellent",
        "key_strengths": ["Quick Reaction Team", "Amphibious Assault", "Counter-Drone Tactics"],
        "vulnerabilities": ["None identified - SHAPE-1 Strategic Reserve"],
        "recent_deployment": "Tactical Reconditioning & Firing Range 30 days ago",
        "wear_tear_index": 12.0,
    },
}

SCORE_MAP = {
    "fatigue": {"Low": 95, "Medium": 75, "High": 50, "Critical": 25},
    "training": {"Excellent": 95, "Good": 80, "Adequate": 60, "Needs Refresher": 40},
    "morale": {"Resilient": 95, "Stable": 80, "Strained": 55, "Vulnerable": 30},
    "deployment_pressure": {"Low": 95, "Moderate": 80, "High": 60, "Surge": 40},
    "leadership_stability": {"Excellent": 95, "Strong": 80, "Developing": 60, "Volatile": 40},
}


class UnitDigitalTwinEngine:
    """
    Unit Digital Twin Simulation & Operational Decision Engine.
    Simulates battalion/company-level health, fatigue, readiness, and enables
    direct head-to-head operational comparisons for commanders.
    """

    @classmethod
    def get_all_companies(cls, battalion: Optional[str] = None) -> List[Dict[str, Any]]:
        companies = list(COMPANY_TWIN_CATALOG.values())
        if battalion:
            companies = [c for c in companies if c["battalion"].lower() == battalion.lower()]
        return companies

    @classmethod
    def get_company_by_id(cls, company_id: str) -> Optional[Dict[str, Any]]:
        return COMPANY_TWIN_CATALOG.get(company_id)

    @classmethod
    def get_battalions_data(cls) -> List[Dict[str, Any]]:
        companies = list(COMPANY_TWIN_CATALOG.values())
        avg_readiness = sum(c["readiness"] for c in companies) / len(companies)
        return [
            {
                "id": "bn-alpha",
                "name": "Alpha Battalion (16th Infantry)",
                "strength": sum(c["strength"] for c in companies),
                "average_readiness": round(avg_readiness, 1),
                "commanding_officer": "Col. Kabir Khan",
                "companies": companies,
            }
        ]

    @classmethod
    def compare_units(
        cls,
        company_a_id: str,
        company_b_id: str,
        mission_context: str = "Border Patrol"
    ) -> Dict[str, Any]:
        """
        Performs head-to-head operational comparison between Company A and Company B.
        Generates dimension-by-dimension deltas and AI Commander Verdict.
        """
        unit_a = COMPANY_TWIN_CATALOG.get(company_a_id, COMPANY_TWIN_CATALOG["coy-alpha"])
        unit_b = COMPANY_TWIN_CATALOG.get(company_b_id, COMPANY_TWIN_CATALOG["coy-delta"])

        dimensions = [
            "readiness",
            "fatigue",
            "training",
            "morale",
            "deployment_pressure",
            "leadership_stability",
        ]

        deltas = []
        score_a_sum = 0
        score_b_sum = 0

        for dim in dimensions:
            if dim == "readiness":
                val_a = f"{unit_a['readiness']}%"
                val_b = f"{unit_b['readiness']}%"
                num_a = unit_a["readiness"]
                num_b = unit_b["readiness"]
            else:
                val_a = unit_a[dim]
                val_b = unit_b[dim]
                num_a = SCORE_MAP[dim].get(val_a, 70)
                num_b = SCORE_MAP[dim].get(val_b, 70)

            score_a_sum += num_a
            score_b_sum += num_b

            if num_a > num_b:
                adv = "A"
                analysis = f"{unit_a['name']} holds operational superiority in {dim.replace('_', ' ')}."
            elif num_b > num_a:
                adv = "B"
                analysis = f"{unit_b['name']} holds operational superiority in {dim.replace('_', ' ')}."
            else:
                adv = "TIE"
                analysis = f"Both units demonstrate equivalent {dim.replace('_', ' ')} index."

            deltas.append({
                "dimension": dim.replace("_", " ").title(),
                "val_a": val_a,
                "val_b": val_b,
                "advantage": adv,
                "analysis": analysis,
            })

        suitability_a = int(round(score_a_sum / 6.0))
        suitability_b = int(round(score_b_sum / 6.0))

        if suitability_a >= suitability_b:
            rec_id = unit_a["id"]
            rec_name = unit_a["name"]
            diff = suitability_a - suitability_b
            verdict = f"Deploy {unit_a['name']} ({suitability_a}% Suitability vs {suitability_b}%)"
            rationale = (
                f"{unit_a['name']} is recommended for {mission_context}. It maintains {diff}% higher overall operational "
                f"resilience, lower fatigue burden, and superior training cohesion. Deploying {unit_a['name']} preserves {unit_b['name']} "
                f"for scheduled recovery and tactical rebalancing."
            )
            mitigation = f"Ensure {unit_b['name']} receives 48-72h decompression rest to avert cumulative sleep debt."
        else:
            rec_id = unit_b["id"]
            rec_name = unit_b["name"]
            diff = suitability_b - suitability_a
            verdict = f"Deploy {unit_b['name']} ({suitability_b}% Suitability vs {suitability_a}%)"
            rationale = (
                f"{unit_b['name']} is recommended for {mission_context}. It demonstrates {diff}% superior operational readiness "
                f"and stable leadership continuity. Deploying {unit_b['name']} avoids over-straining {unit_a['name']}."
            )
            mitigation = f"Place {unit_a['name']} on local security perimeter rotation to mitigate strain."

        return {
            "unit_a": unit_a,
            "unit_b": unit_b,
            "mission_context": mission_context,
            "dimension_deltas": deltas,
            "ai_recommendation": {
                "recommended_unit_id": rec_id,
                "recommended_unit_name": rec_name,
                "comparative_verdict": verdict,
                "operational_rationale": rationale,
                "deployment_suitability_score_a": suitability_a,
                "deployment_suitability_score_b": suitability_b,
                "tactical_mitigation_note": mitigation,
            },
        }

    @classmethod
    def simulate_unit_trajectory(
        cls,
        company_id: str,
        days: int = 30,
        operational_tempo: str = "STANDARD"
    ) -> Dict[str, Any]:
        """
        Continuously simulates unit health, wear-and-tear, and readiness over 7 to 90 days.
        """
        company = COMPANY_TWIN_CATALOG.get(company_id, COMPANY_TWIN_CATALOG["coy-delta"])
        base_readiness = float(company["readiness"])

        decay_rate = {
            "STANDARD": 0.25,
            "HIGH_INTENSITY": 0.85,
            "SURGE_DEPLOYMENT": 1.35,
            "REST_CYCLE": -0.65,
        }.get(operational_tempo, 0.3)

        timeline = []
        current_readiness = base_readiness
        burnout_day = None

        for d in range(1, days + 1):
            current_readiness -= decay_rate
            current_readiness = max(25.0, min(99.0, current_readiness))

            if current_readiness >= 80:
                fatigue = "Low"
                burnout_prob = 0.08
            elif current_readiness >= 70:
                fatigue = "Medium"
                burnout_prob = 0.25
            elif current_readiness >= 55:
                fatigue = "High"
                burnout_prob = 0.65
            else:
                fatigue = "Critical"
                burnout_prob = 0.92

            if current_readiness < 65.0 and burnout_day is None:
                burnout_day = d

            timeline.append({
                "day": d,
                "projected_readiness": round(current_readiness, 1),
                "projected_fatigue": fatigue,
                "burnout_probability": round(burnout_prob, 2),
            })

        if burnout_day:
            mitigation = f"Critical inflection point detected at Day {burnout_day}. Rotate 30% of sentry personnel before Day {max(1, burnout_day - 3)}."
        else:
            mitigation = "Unit maintains stable operational readiness across projected deployment horizon."

        return {
            "company_id": company["id"],
            "company_name": company["name"],
            "operational_tempo": operational_tempo,
            "projection_timeline": timeline,
            "burnout_risk_day": burnout_day,
            "recommended_mitigation": mitigation,
        }
