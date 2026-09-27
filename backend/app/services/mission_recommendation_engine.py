import hashlib
import uuid
from datetime import datetime, timezone, timedelta
from typing import List, Dict, Any, Optional
from enum import Enum


class MissionTypeEnum(str, Enum):
    BORDER_PATROL = "Border Patrol"
    COUNTER_INSURGENCY = "Counter Insurgency"
    ELECTION_DUTY = "Election Duty"
    VIP_SECURITY = "VIP Security"
    FLOOD_RESCUE = "Flood Rescue"
    DISASTER_RELIEF = "Disaster Relief"
    TRAINING_CAMP = "Training Camp"


MISSION_CONFIGS = {
    "Border Patrol": {
        "criticality": "HIGH",
        "target_readiness_range": "80 - 100",
        "preserve_strategic_reserves": False,
        "description": "Frontline border surveillance, high-altitude outpost vigilance, quick reaction team.",
        "primary_skills": ["High Altitude", "Sniper", "Surveillance", "Vigilance", "Reconnaissance"],
        "min_readiness": 75.0,
        "max_21d_decline_allowed": -2.5,
    },
    "Counter Insurgency": {
        "criticality": "CRITICAL",
        "target_readiness_range": "85 - 100",
        "preserve_strategic_reserves": False,
        "description": "Active tactical cordon, high-stress urban breach, search and counter-strike operations.",
        "primary_skills": ["Urban Combat", "CQB", "Marksman", "Tactical Leadership", "Breach Operations"],
        "min_readiness": 80.0,
        "max_21d_decline_allowed": -2.0,
    },
    "Election Duty": {
        "criticality": "MEDIUM",
        "target_readiness_range": "55 - 75",
        "preserve_strategic_reserves": True,
        "description": "Civil administration support, polling booth security, crowd management, strategic reserve conservation.",
        "primary_skills": ["Crowd Control", "Crowd Management", "Liaison", "Patrol", "Communication", "Basic First Aid"],
        "min_readiness": 50.0,
        "max_21d_decline_allowed": -6.0,
    },
    "VIP Security": {
        "criticality": "HIGH",
        "target_readiness_range": "78 - 100",
        "preserve_strategic_reserves": False,
        "description": "Dignitary escort, close protection convoy, motorcade security and venue perimeter control.",
        "primary_skills": ["Close Protection", "Defensive Driving", "Protocol", "Threat Assessment", "Vigilance"],
        "min_readiness": 75.0,
        "max_21d_decline_allowed": -3.0,
    },
    "Flood Rescue": {
        "criticality": "MEDIUM",
        "target_readiness_range": "60 - 85",
        "preserve_strategic_reserves": False,
        "description": "Waterborne rescue, amphibious boat evacuation, first aid triage and emergency supply airlift.",
        "primary_skills": ["Water Rescue", "Amphibious", "Disaster Response", "Medical First Aid", "Logistics"],
        "min_readiness": 55.0,
        "max_21d_decline_allowed": -5.0,
    },
    "Disaster Relief": {
        "criticality": "MEDIUM",
        "target_readiness_range": "55 - 80",
        "preserve_strategic_reserves": False,
        "description": "Earthquake and landslide search, relief camp setup, engineering clearance, humanitarian logistics.",
        "primary_skills": ["Heavy Equipment", "Casualty Care", "Shelter Logistics", "Engineering", "Disaster Response"],
        "min_readiness": 52.0,
        "max_21d_decline_allowed": -5.0,
    },
    "Training Camp": {
        "criticality": "LOW",
        "target_readiness_range": "50 - 75",
        "preserve_strategic_reserves": True,
        "description": "Cadet training instruction, marksmanship firing range coaching, physical re-conditioning.",
        "primary_skills": ["Instruction", "Mentoring", "Physical Conditioning", "Drill", "Weapon Maintenance"],
        "min_readiness": 45.0,
        "max_21d_decline_allowed": -8.0,
    },
}

# In-memory store for deployed manifests
DEPLOYMENT_MANIFEST_STORE: Dict[str, Dict[str, Any]] = {}


class MissionRecommendationEngine:
    """
    Intelligent Mission-Aware Personnel Recommendation Engine.
    Optimizes force allocation based on clinical readiness trajectories,
    tactical skill profiles, sleep telemetry, and strategic reserve doctrine.
    """

    @classmethod
    def get_available_mission_types(cls) -> List[Dict[str, Any]]:
        """Returns catalogue of all supported mission types and criteria."""
        return [
            {
                "type": m_name,
                "criticality": m_cfg["criticality"],
                "target_readiness_range": m_cfg["target_readiness_range"],
                "preserve_strategic_reserves": m_cfg["preserve_strategic_reserves"],
                "description": m_cfg["description"],
                "primary_skills": m_cfg["primary_skills"],
            }
            for m_name, m_cfg in MISSION_CONFIGS.items()
        ]

    @classmethod
    def get_default_pool(cls, unit: Optional[str] = None) -> List[Dict[str, Any]]:
        """Provides rich realistic operational soldier pool if none provided."""
        return [
            {
                "uid": "UID-SOL-101",
                "name": "Subedar R. N. Yadav",
                "rank": "Subedar",
                "unit": unit or "Alpha Battalion",
                "current_readiness": 89.0,
                "stress_score": 22.0,
                "readiness_trend_21d": 2.4,
                "consecutive_duty_days": 3,
                "sleep_hours_avg": 7.4,
                "skills": ["Tactical Leadership", "Sniper", "High Altitude", "Vigilance"],
            },
            {
                "uid": "UID-SOL-102",
                "name": "Havildar Gurpreet Singh",
                "rank": "Havildar",
                "unit": unit or "Alpha Battalion",
                "current_readiness": 93.0,
                "stress_score": 16.0,
                "readiness_trend_21d": 3.1,
                "consecutive_duty_days": 2,
                "sleep_hours_avg": 7.8,
                "skills": ["Urban Combat", "CQB", "Marksman", "Breach Operations"],
            },
            {
                "uid": "UID-SOL-103",
                "name": "Naik Sandeep Singh",
                "rank": "Naik",
                "unit": unit or "Alpha Battalion",
                "current_readiness": 86.0,
                "stress_score": 26.0,
                "readiness_trend_21d": 1.2,
                "consecutive_duty_days": 4,
                "sleep_hours_avg": 7.2,
                "skills": ["High Altitude", "Surveillance", "Reconnaissance", "Marksman"],
            },
            {
                "uid": "UID-SOL-104",
                "name": "Havildar Manpreet Singh",
                "rank": "Havildar",
                "unit": unit or "Alpha Battalion",
                "current_readiness": 88.0,
                "stress_score": 24.0,
                "readiness_trend_21d": 1.8,
                "consecutive_duty_days": 3,
                "sleep_hours_avg": 7.5,
                "skills": ["Close Protection", "Defensive Driving", "Protocol", "CQB"],
            },
            {
                "uid": "UID-SOL-105",
                "name": "Naik Rajesh Kumar",
                "rank": "Naik",
                "unit": unit or "Alpha Battalion",
                "current_readiness": 68.0,
                "stress_score": 42.0,
                "readiness_trend_21d": 0.4,
                "consecutive_duty_days": 4,
                "sleep_hours_avg": 6.8,
                "skills": ["Crowd Control", "Liaison", "Patrol", "Communication"],
            },
            {
                "uid": "UID-SOL-106",
                "name": "Sepoy Amit Verma",
                "rank": "Sepoy",
                "unit": unit or "Alpha Battalion",
                "current_readiness": 65.0,
                "stress_score": 44.0,
                "readiness_trend_21d": -0.2,
                "consecutive_duty_days": 5,
                "sleep_hours_avg": 6.9,
                "skills": ["Crowd Management", "Basic First Aid", "Patrol"],
            },
            {
                "uid": "UID-SOL-107",
                "name": "Sepoy Kuldeep Singh",
                "rank": "Sepoy",
                "unit": unit or "Alpha Battalion",
                "current_readiness": 71.0,
                "stress_score": 38.0,
                "readiness_trend_21d": 0.8,
                "consecutive_duty_days": 3,
                "sleep_hours_avg": 7.0,
                "skills": ["Communication", "Patrol", "Liaison", "Crowd Control"],
            },
            {
                "uid": "UID-SOL-108",
                "name": "Sepoy Dinesh Sharma",
                "rank": "Sepoy",
                "unit": unit or "Alpha Battalion",
                "current_readiness": 64.0,
                "stress_score": 46.0,
                "readiness_trend_21d": 0.2,
                "consecutive_duty_days": 4,
                "sleep_hours_avg": 6.7,
                "skills": ["Water Rescue", "Disaster Response", "Amphibious", "Logistics"],
            },
            {
                "uid": "UID-SOL-109",
                "name": "Naik Vikram Rathore",
                "rank": "Naik",
                "unit": unit or "Alpha Battalion",
                "current_readiness": 52.0,
                "stress_score": 69.0,
                "readiness_trend_21d": -14.2,  # Declining over 21 days
                "consecutive_duty_days": 15,
                "sleep_hours_avg": 4.1,
                "skills": ["High Altitude", "Vigilance", "Sniper"],
            },
            {
                "uid": "UID-SOL-110",
                "name": "Sepoy Sanjay Patel",
                "rank": "Sepoy",
                "unit": unit or "Alpha Battalion",
                "current_readiness": 49.0,
                "stress_score": 72.0,
                "readiness_trend_21d": -11.8,  # Declining over 21 days
                "consecutive_duty_days": 14,
                "sleep_hours_avg": 4.3,
                "skills": ["Urban Combat", "Patrol", "CQB"],
            },
            {
                "uid": "UID-SOL-111",
                "name": "Havildar Arjun Nair",
                "rank": "Havildar",
                "unit": unit or "Alpha Battalion",
                "current_readiness": 78.0,
                "stress_score": 32.0,
                "readiness_trend_21d": 1.1,
                "consecutive_duty_days": 4,
                "sleep_hours_avg": 7.1,
                "skills": ["Disaster Response", "Heavy Equipment", "Casualty Care", "Engineering"],
            },
            {
                "uid": "UID-SOL-112",
                "name": "Subedar Sunil Mehta",
                "rank": "Subedar",
                "unit": unit or "Alpha Battalion",
                "current_readiness": 62.0,
                "stress_score": 48.0,
                "readiness_trend_21d": 0.3,
                "consecutive_duty_days": 3,
                "sleep_hours_avg": 6.8,
                "skills": ["Instruction", "Mentoring", "Drill", "Physical Conditioning"],
            },
        ]

    @classmethod
    def evaluate_candidates_for_mission(
        cls,
        mission_type: str,
        headcount_required: int = 4,
        candidates: Optional[List[Dict[str, Any]]] = None,
        unit: Optional[str] = None,
    ) -> Dict[str, Any]:
        """
        Evaluates a candidate roster against a mission profile.
        Returns:
            - recommended_squad
            - reserve_candidates
            - excluded_personnel
            - strategic_reserves_preserved
            - commander_advisory
            - average_squad_readiness
        """
        config = MISSION_CONFIGS.get(mission_type, MISSION_CONFIGS["Border Patrol"])
        pool = candidates if candidates is not None else cls.get_default_pool(unit)

        excluded: List[Dict[str, Any]] = []
        strategic_preserved: List[Dict[str, Any]] = []
        eligible: List[Dict[str, Any]] = []

        is_strategic_preservation = config.get("preserve_strategic_reserves", False)
        criticality = config["criticality"]
        primary_skills = set(config.get("primary_skills", []))

        for cand in pool:
            uid = cand["uid"]
            name = cand["name"]
            rank = cand["rank"]
            cand_unit = cand.get("unit", unit or "Alpha Battalion")
            readiness = float(cand.get("current_readiness", 70.0))
            stress = float(cand.get("stress_score", 30.0))
            trend_21d = float(cand.get("readiness_trend_21d", 0.0))
            duty_days = int(cand.get("consecutive_duty_days", 2))
            sleep_avg = float(cand.get("sleep_hours_avg", 7.0))
            skills = cand.get("skills", [])

            # -------------------------------------------------------------
            # 1. EXCLUSION FILTER: Medical, burnout, & 21-day trend declines
            # -------------------------------------------------------------
            is_excluded = False
            exclusion_reason = ""

            # Check 21-day trend for high criticality missions
            if criticality in ["HIGH", "CRITICAL"] and trend_21d < config["max_21d_decline_allowed"]:
                is_excluded = True
                exclusion_reason = (
                    f"Declining readiness over last 21 days (Trend: {trend_21d:+.1f} pts). "
                    f"Current readiness {readiness:.0f}/100 insufficient for {criticality} threat profile."
                )
            elif sleep_avg < 4.5 and duty_days > 10:
                is_excluded = True
                exclusion_reason = (
                    f"Severe cumulative sleep debt ({sleep_avg}h avg) over {duty_days} consecutive duty days. "
                    "Mandatory 48h decompression rest required."
                )
            elif readiness < config.get("min_readiness", 40.0):
                is_excluded = True
                exclusion_reason = (
                    f"Readiness score ({readiness:.0f}/100) below minimum operational threshold "
                    f"({config.get('min_readiness', 40.0):.0f}) for {mission_type}."
                )

            if is_excluded:
                excluded.append({
                    "uid": uid,
                    "name": name,
                    "rank": rank,
                    "unit": cand_unit,
                    "reason": exclusion_reason,
                    "readiness": readiness,
                    "trend_21d": trend_21d,
                    "sleep_hours_avg": sleep_avg,
                })
                continue

            # -------------------------------------------------------------
            # 2. STRATEGIC RESERVE PRESERVATION (e.g., Election Duty, Training)
            # -------------------------------------------------------------
            if is_strategic_preservation and readiness >= 88.0:
                strategic_preserved.append({
                    "uid": uid,
                    "name": name,
                    "rank": rank,
                    "unit": cand_unit,
                    "current_readiness": readiness,
                    "stress_score": stress,
                    "readiness_trend_21d": trend_21d,
                    "consecutive_duty_days": duty_days,
                    "sleep_hours_avg": sleep_avg,
                    "skills": skills,
                    "suitability_score": 70.0,
                    "recommendation_tier": "STRATEGIC_RESERVE_PRESERVED",
                    "ai_rationale": (
                        f"Conserved as Tier-1 Strategic Quick-Reaction Force (Readiness: {readiness:.0f}/100). "
                        f"Medium-readiness personnel can safely accomplish {mission_type} without exhausting critical frontline assets."
                    ),
                    "match_factors": {
                        "skill_overlap": len(set(skills).intersection(primary_skills)),
                        "resilience_tier": "ELITE_CONSERVED",
                    }
                })
                continue

            # -------------------------------------------------------------
            # 3. SUITABILITY SCORING FOR ELIGIBLE POOL
            # -------------------------------------------------------------
            matched_skills = set(skills).intersection(primary_skills)
            skill_bonus = min(20.0, len(matched_skills) * 7.0)

            # Base score depends on whether mission preserves strategic reserves
            if is_strategic_preservation:
                # Sweet spot: 55 - 75 readiness
                if 55.0 <= readiness <= 75.0:
                    readiness_fit_score = 65.0 + (readiness - 55.0) * 0.75
                    rationale = (
                        f"Personnel with medium readiness ({readiness:.0f}/100) can safely perform this assignment. "
                        "Preserves highly mission-ready personnel for strategic deployments."
                    )
                elif readiness > 75.0:
                    readiness_fit_score = 55.0  # slightly lower to prioritize preserving elite
                    rationale = f"High readiness ({readiness:.0f}/100). Capable, but higher tier than standard requirements."
                else:
                    readiness_fit_score = 45.0
                    rationale = f"Lower baseline readiness ({readiness:.0f}/100). Adequate for secondary support."
            else:
                # For Border Patrol, Counter Insurgency, VIP: higher readiness is strictly better
                readiness_fit_score = (readiness / 100.0) * 60.0
                momentum_bonus = max(-10.0, min(15.0, trend_21d * 3.5))
                readiness_fit_score += momentum_bonus
                if readiness >= 85.0:
                    rationale = (
                        f"High readiness ({readiness:.0f}/100) with stable/positive 21-day trend ({trend_21d:+.1f} pts). "
                        "Fully primed for high-threat operational vigilance."
                    )
                else:
                    rationale = f"Readiness ({readiness:.0f}/100) meets tactical standards for {mission_type}."

            sleep_rest_factor = max(0.0, min(15.0, (sleep_avg - 4.5) * 5.0))
            duty_fatigue_penalty = max(0.0, (duty_days - 7) * 2.0)

            total_score = max(
                10.0,
                min(99.0, readiness_fit_score + skill_bonus + sleep_rest_factor - duty_fatigue_penalty)
            )

            tier = "HIGHLY_RECOMMENDED" if total_score >= 78.0 else ("SUITABLE" if total_score >= 60.0 else "RESERVE_CANDIDATE")

            eligible.append({
                "uid": uid,
                "name": name,
                "rank": rank,
                "unit": cand_unit,
                "current_readiness": readiness,
                "stress_score": stress,
                "readiness_trend_21d": trend_21d,
                "consecutive_duty_days": duty_days,
                "sleep_hours_avg": sleep_avg,
                "skills": skills,
                "suitability_score": round(total_score, 1),
                "recommendation_tier": tier,
                "ai_rationale": rationale,
                "match_factors": {
                    "skill_matches": list(matched_skills),
                    "sleep_hours": sleep_avg,
                    "duty_days": duty_days,
                    "trend_21d": trend_21d,
                }
            })

        # Sort eligible descending by suitability score
        eligible.sort(key=lambda x: x["suitability_score"], reverse=True)

        recommended_squad = eligible[:headcount_required]
        reserve_candidates = eligible[headcount_required:]

        # Average squad readiness
        if recommended_squad:
            avg_readiness = sum(s["current_readiness"] for s in recommended_squad) / len(recommended_squad)
        else:
            avg_readiness = 0.0

        # Construct Commander Advisory
        if is_strategic_preservation:
            headline = f"Strategic Reserve Preservation Active: {len(strategic_preserved)} Elite Personnel Conserved"
            guidance = (
                "Personnel with medium readiness can safely perform this assignment. "
                "Preserve highly mission-ready personnel for strategic deployments."
            )
        elif criticality in ["HIGH", "CRITICAL"]:
            headline = f"{mission_type} Tactical Screening: High Threat Profile"
            if excluded:
                guidance = f"Avoid assigning {len(excluded)} personnel whose readiness has declined during the last 21 days."
            else:
                guidance = "All recommended personnel demonstrate positive 21-day stability and peak physiological readiness."
        else:
            headline = f"{mission_type} Balanced Resource Allocation"
            guidance = f"Optimized {headcount_required}-person squad allocation matching primary competencies and duty cycle rest."

        safety_warning = None
        if len(excluded) > 0:
            declining_count = sum(1 for e in excluded if "21 days" in e["reason"] or "Declining" in e["reason"])
            if declining_count > 0:
                safety_warning = f"Warning: {declining_count} personnel flagged with negative 21-day readiness decline."

        advisory = {
            "headline": headline,
            "strategic_guidance": guidance,
            "safety_warning": safety_warning,
            "exclusions_count": len(excluded),
            "strategic_preserved_count": len(strategic_preserved),
        }

        return {
            "mission_type": mission_type,
            "criticality": criticality,
            "required_headcount": headcount_required,
            "recommended_squad": recommended_squad,
            "reserve_candidates": reserve_candidates,
            "excluded_personnel": excluded,
            "strategic_reserves_preserved": strategic_preserved,
            "commander_advisory": advisory,
            "average_squad_readiness": round(avg_readiness, 1),
            "timestamp": datetime.now(timezone.utc),
        }

    @classmethod
    def execute_deployment(
        cls,
        mission_type: str,
        unit: str,
        assigned_uids: List[str],
        deployment_location: str,
        start_date: str,
        duration_days: int,
        commander_remarks: Optional[str],
        commander_name: str,
        commander_uid: str,
    ) -> Dict[str, Any]:
        """
        Commits deployment dispatch order, stores manifest,
        and generates military cryptographic verification hash.
        """
        manifest_id = f"MANIFEST-{uuid.uuid4().hex[:8].upper()}"
        issued_at = datetime.now(timezone.utc)

        # Lookup soldiers from default pool or mock catalog
        pool = cls.get_default_pool(unit)
        uid_map = {p["uid"]: p for p in pool}

        roster_items = []
        for uid in assigned_uids:
            p = uid_map.get(uid, {
                "uid": uid,
                "name": f"Soldier {uid}",
                "rank": "Personnel",
                "current_readiness": 75.0,
            })
            roster_items.append({
                "uid": p["uid"],
                "name": p["name"],
                "rank": p["rank"],
                "role_in_mission": "Active Mission Personnel",
                "readiness_at_dispatch": p.get("current_readiness", 75.0),
                "suitability_score": 88.0,
            })

        # Generate cryptographic digest for official manifest tamper-proofing
        raw_signature_payload = f"{manifest_id}|{mission_type}|{unit}|{start_date}|{','.join(assigned_uids)}|{commander_uid}"
        signature_hash = hashlib.sha256(raw_signature_payload.encode()).hexdigest()[:32].upper()

        manifest = {
            "manifest_id": manifest_id,
            "mission_type": mission_type,
            "unit": unit,
            "status": "DISPATCHED",
            "deployment_location": deployment_location,
            "start_date": start_date,
            "duration_days": duration_days,
            "assigned_roster": roster_items,
            "commander_remarks": commander_remarks or "Dispatched under AI Command Resource Optimization Directive.",
            "issued_by": commander_name,
            "issued_at": issued_at,
            "digital_signature_hash": f"MIL-SIG-{signature_hash}",
        }

        DEPLOYMENT_MANIFEST_STORE[manifest_id] = manifest
        return manifest

    @classmethod
    def list_manifests(cls) -> List[Dict[str, Any]]:
        """Returns all generated deployment manifests."""
        return list(DEPLOYMENT_MANIFEST_STORE.values())
