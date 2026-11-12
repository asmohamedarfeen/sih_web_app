from datetime import datetime
from typing import Dict, Any, Tuple, List, Optional
from sqlalchemy.orm import Session
from backend.app.models.consent import ConsentPreference, ConsentAuditTrail


BIOMETRIC_FIELDS = {
    "heart_rate_variability",
    "skin_conductance_micro_siemens",
    "resting_heart_rate",
    "peripheral_temp_celsius",
    "wearable_sleep_efficiency",
    "biometric_spo2"
}

ROSTER_FIELDS = {
    "consecutive_duty_days",
    "night_shift_frequency",
    "deployment_zone_risk",
    "leave_deficit_days"
}

ASSESSMENT_FIELDS = {
    "fatigue_level",
    "mood_score",
    "workload_pressure",
    "physical_strain",
    "sleep_hours",
    "notes"
}


class ConsentService:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create_consent(self, personnel_uid: str) -> ConsentPreference:
        """Retrieves existing consent preferences or seeds active default permissions."""
        pref = self.db.query(ConsentPreference).filter(ConsentPreference.personnel_uid == personnel_uid).first()
        if not pref:
            pref = ConsentPreference(
                personnel_uid=personnel_uid,
                self_assessment=True,
                duty_roster_telemetry=True,
                biometrics_wearable=True,
                ai_longitudinal_profiling=True,
                version="2.0-CONSENT"
            )
            self.db.add(pref)
            self.db.commit()
            self.db.refresh(pref)
        return pref

    def update_consent(
        self,
        personnel_uid: str,
        self_assessment: bool,
        duty_roster_telemetry: bool,
        biometrics_wearable: bool,
        ai_longitudinal_profiling: bool,
        actor_name: str,
        reason: Optional[str] = None,
        ip_address: str = "127.0.0.1"
    ) -> ConsentPreference:
        """Updates consent flags and writes an immutable cryptographically hashed audit entry."""
        pref = self.get_or_create_consent(personnel_uid)
        
        pref.self_assessment = self_assessment
        pref.duty_roster_telemetry = duty_roster_telemetry
        pref.biometrics_wearable = biometrics_wearable
        pref.ai_longitudinal_profiling = ai_longitudinal_profiling
        pref.last_updated_by = actor_name
        pref.last_updated_at = datetime.utcnow()

        scopes = {
            "self_assessment": self_assessment,
            "duty_roster_telemetry": duty_roster_telemetry,
            "biometrics_wearable": biometrics_wearable,
            "ai_longitudinal_profiling": ai_longitudinal_profiling
        }
        
        timestamp_str = pref.last_updated_at.isoformat()
        audit_hash = ConsentAuditTrail.generate_hash(
            personnel_uid=personnel_uid,
            action="CONSENT_MODIFIED",
            scopes=scopes,
            timestamp_str=timestamp_str
        )

        audit_entry = ConsentAuditTrail(
            personnel_uid=personnel_uid,
            action="CONSENT_MODIFIED",
            scope_snapshot=scopes,
            actor_name=actor_name,
            reason=reason,
            ip_address=ip_address,
            audit_hash=audit_hash,
            timestamp=pref.last_updated_at
        )

        self.db.add(audit_entry)
        self.db.commit()
        self.db.refresh(pref)
        return pref

    def get_audit_trail(self, personnel_uid: Optional[str] = None) -> List[ConsentAuditTrail]:
        """Fetches audit logs filtered by personnel or all."""
        query = self.db.query(ConsentAuditTrail)
        if personnel_uid:
            query = query.filter(ConsentAuditTrail.personnel_uid == personnel_uid)
        return query.order_by(ConsentAuditTrail.timestamp.desc()).all()

    def filter_telemetry_by_consent(
        self,
        personnel_uid: str,
        telemetry: Dict[str, Any]
    ) -> Tuple[Dict[str, Any], List[str]]:
        """
        Enforces consent gating on an incoming telemetry dictionary.
        Masks / redacts channels where consent is withheld.
        """
        pref = self.get_or_create_consent(personnel_uid)
        sanitized = dict(telemetry)
        blocked_streams: List[str] = []

        if not pref.biometrics_wearable:
            blocked_streams.append("biometrics_wearable")
            for field in BIOMETRIC_FIELDS:
                sanitized.pop(field, None)

        if not pref.duty_roster_telemetry:
            blocked_streams.append("duty_roster_telemetry")
            for field in ROSTER_FIELDS:
                sanitized.pop(field, None)

        if not pref.self_assessment:
            blocked_streams.append("self_assessment")
            for field in ASSESSMENT_FIELDS:
                sanitized.pop(field, None)

        return sanitized, blocked_streams
