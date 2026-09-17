import re
import html
from typing import Any, Dict, List, Union, Optional


def sanitize_string(val: str) -> str:
    """Sanitizes strings against XSS and control character injection."""
    if not isinstance(val, str):
        return val
    # Strip dangerous HTML and escape entities
    cleaned = html.escape(val.strip())
    # Remove null bytes
    cleaned = cleaned.replace("\0", "")
    return cleaned


def mask_sensitive_pii(data: Union[Dict[str, Any], List[Any], Any], role: str) -> Any:
    """
    Applies Defense 'Need-to-Know' Data Masking & PII Redaction:
    - Masks bank account details, national IDs, and direct contact numbers.
    - Redacts private counseling notes for non-welfare roles.
    - Redacts armory / tactical serials for non-command roles.
    """
    if isinstance(data, list):
        return [mask_sensitive_pii(item, role) for item in data]
    
    if not isinstance(data, dict):
        return data

    sanitized = {}
    for key, value in data.items():
        # Recursively sanitize nested structures
        if isinstance(value, (dict, list)):
            sanitized[key] = mask_sensitive_pii(value, role)
            continue
        
        # Masking rules
        if key in ["bank_account", "bank_account_masked", "account_number"] and isinstance(value, str):
            sanitized[key] = "XXXX-XXXX-" + value[-4:] if len(value) >= 4 else "XXXX-XXXX-XXXX"
        elif key in ["aadhaar_number", "ssn", "national_id"] and isinstance(value, str):
            sanitized[key] = "XXXXXXXX" + value[-4:] if len(value) >= 4 else "XXXXXXXXXXXX"
        elif key in ["personal_phone", "mobile_private"] and isinstance(value, str):
            sanitized[key] = value[:3] + "XXXX" + value[-3:] if len(value) >= 7 else "XXXXXXXXXX"
        elif key in ["psychiatric_notes", "counseling_confidential_notes"] and role not in ["WELFARE_OFFICER", "MEDICAL_OFFICER"]:
            sanitized[key] = "[CONFIDENTIAL - MEDICAL / WELFARE ACCESS ONLY]"
        elif key in ["armory_serial", "butt_number_private"] and role not in ["COMMANDER", "SUPER_ADMIN", "ADMIN"]:
            sanitized[key] = "[RESTRICTED - COMMAND ACCESS ONLY]"
        else:
            sanitized[key] = sanitize_string(value) if isinstance(value, str) else value

    return sanitized


def apply_confidentiality_firewall(
    data: Union[Dict[str, Any], List[Any], Any],
    role: str,
    current_user_uid: Optional[str] = None
) -> Any:
    """
    Defense Trust Architecture & Confidentiality Firewall (MHA Directive 2026/WEL):
    - COMMAND ROLES (COMMANDER, DEPT_HEAD, HR_OFFICER):
        * STRICT CONFIDENTIALITY WALL: Clinical psychometrics, PHQ-9 depression, GAD-7 anxiety,
          subjective mood logs, and clinical debrief notes are REDACTED.
        * Replaced with Aggregated Operational Readiness: SHAPE-1 deployment status,
          consecutive watch fatigue, and tactical roster rotation actions.
    - CLINICAL ROLES (WELFARE_OFFICER, MEDICAL_OFFICER, SUPER_ADMIN):
        * Retain full clinical access to multi-domain distress parameters, therapy notes,
          and recovery trajectories under medical confidentiality privilege.
    - PERSONNEL ROLE (SOLDIER):
        * Retain self-audit visibility over their own wellness data and access audit logs.
    """
    # 1. Base PII and XSS sanitization
    sanitized = mask_sensitive_pii(data, role)

    command_roles = ["COMMANDER", "DEPT_HEAD", "HR_OFFICER", "TRAINING_OFFICER"]
    is_command = role in command_roles

    if isinstance(sanitized, list):
        return [apply_confidentiality_firewall(item, role, current_user_uid) for item in sanitized]

    if not isinstance(sanitized, dict):
        return sanitized

    firewalled = dict(sanitized)

    # Apply Command Confidentiality Barrier
    if is_command:
        # Redact raw clinical psychological distress parameters
        if "psychological_distress_params" in firewalled:
            risk = firewalled.get("risk_level", "MODERATE")
            firewalled["psychological_distress_params"] = {
                "confidentiality_status": "SEALED_UNDER_MEDICAL_PRIVILEGE",
                "statutory_authority": "Article 42-A Defense Personnel Welfare Directive MHA/2026/WEL",
                "notice": "Psychometric screening items, mood tracking, and psychiatric parameters are strictly restricted to Certified Medical & Welfare Officers to protect soldier trust and career confidentiality.",
                "operational_readiness_status": "STAND_DOWN_RECOMMENDED" if risk in ["HIGH", "CRITICAL"] else ("MONITOR_FATIGUE" if risk == "MODERATE" else "COMBAT_READY"),
                "tactical_command_action": "Actionable Roster Swap & Fatigue Decompression Rotation" if risk in ["HIGH", "CRITICAL"] else "Standard Watch Roster"
            }

        # Redact subjective mood and clinical exhaustion
        if "params" in firewalled and isinstance(firewalled["params"], dict):
            params_copy = dict(firewalled["params"])
            if "emotional_exhaustion" in params_copy:
                params_copy["emotional_exhaustion"] = {
                    "score": "[SEALED]",
                    "available": False,
                    "source": "Medical Branch",
                    "note": "[Protected under Article 42-A Medical Privilege]"
                }
            if "assessment_responses" in params_copy:
                params_copy["assessment_responses"] = {
                    "score": "[SEALED]",
                    "available": False,
                    "source": "Personnel Mobile Terminal",
                    "note": "[Protected Self-Assessment - Command Access Redacted]"
                }
            firewalled["params"] = params_copy

        # Redact emotional stability deep metrics
        if "emotional_stability" in firewalled and isinstance(firewalled["emotional_stability"], dict):
            firewalled["emotional_stability"] = {
                "confidentiality_status": "PROTECTED_CLINICAL_INDEX",
                "operational_vitality_index": firewalled.get("consecutive_duty_days", 4),
                "notice": "Acoustic vocal tremor and emotional valence metrics sealed under medical confidentiality."
            }

        # Redact subjective notes in assessments
        if "notes" in firewalled and firewalled["notes"]:
            firewalled["notes"] = "[CONFIDENTIAL PERSONAL LOG - SEALED]"

        if "mood_score" in firewalled:
            firewalled["mood_score"] = "[CONFIDENTIAL]"

        # Redact clinical narrative in dossiers to an operational command brief
        if "clinical_narrative" in firewalled and isinstance(firewalled["clinical_narrative"], dict):
            narrative = dict(firewalled["clinical_narrative"])
            personnel_name = firewalled.get("personnel", {}).get("name") or firewalled.get("name", "Subject")
            narrative["narrative_paragraph"] = (
                f"OPERATIONAL READINESS BRIEFING: {personnel_name} displays elevated operational fatigue "
                f"driven by consecutive duty shifts and delayed furlough. Command Action: Implement duty stand-down "
                f"and rotational roster swap. [Detailed psychiatric telemetry and clinical risk factors are sealed under Article 42-A Medical Privilege]."
            )
            firewalled["clinical_narrative"] = narrative

        # Redact private counseling sessions in active interventions
        if "active_interventions" in firewalled and isinstance(firewalled["active_interventions"], list):
            redacted_invs = []
            for inv in firewalled["active_interventions"]:
                if isinstance(inv, dict):
                    inv_copy = dict(inv)
                    inv_copy["sessions_history"] = "[CONFIDENTIAL - MEDICAL DEBRIEFS SEALED]"
                    inv_copy["counseling_notes"] = "[SEALED - WELFARE OFFICER ONLY]"
                    redacted_invs.append(inv_copy)
                else:
                    redacted_invs.append(inv)
            firewalled["active_interventions"] = redacted_invs

        # Mark confidentiality seal
        firewalled["confidentiality_firewall"] = {
            "status": "ACTIVE_COMMAND_FIREWALL",
            "scope": "OPERATIONAL_READINESS_ONLY",
            "clinical_data_masked": True,
            "statutory_protection": "MHA Directive 2026/WEL (Article 42-A Safe Harbor)"
        }

    return firewalled

