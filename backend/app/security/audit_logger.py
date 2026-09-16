import hashlib
import json
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any

# Configure structured security audit logger
logger = logging.getLogger("security.audit")
logger.setLevel(logging.INFO)


class AuditLogger:
    """
    Cryptographic Security Audit Logger for HRMS Data Pipelines.
    Creates tamper-evident log records with SHA-256 integrity checksums.
    """

    @staticmethod
    def log_data_access(
        user_email: str,
        user_role: str,
        user_uid: Optional[str],
        endpoint: str,
        action: str,
        client_ip: str,
        status_code: int = 200,
        extra_metadata: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        timestamp = datetime.now(timezone.utc).isoformat()
        
        log_payload = {
            "timestamp": timestamp,
            "user_email": user_email,
            "user_role": user_role,
            "user_uid": user_uid or "UNSPECIFIED",
            "endpoint": endpoint,
            "action": action,
            "client_ip": client_ip,
            "status_code": status_code,
            "metadata": extra_metadata or {}
        }
        
        # Generate SHA-256 integrity hash for the log entry
        payload_str = json.dumps(log_payload, sort_keys=True)
        log_hash = hashlib.sha256(payload_str.encode("utf-8")).hexdigest()
        log_payload["integrity_sha256"] = log_hash

        logger.info(f"AUDIT_EVENT: {json.dumps(log_payload)}")
        return log_payload

    @staticmethod
    def log_security_event(event_type: str, user_email: str, details: str, extra_metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        return AuditLogger.log_data_access(
            user_email=user_email,
            user_role="OFFICER",
            user_uid=None,
            endpoint=f"/security/{event_type.lower()}",
            action=event_type,
            client_ip="INTERNAL_DISPATCH",
            extra_metadata={"details": details, **(extra_metadata or {})}
        )


audit_logger = AuditLogger()
