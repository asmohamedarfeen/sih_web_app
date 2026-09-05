import re
import html
from typing import Any, Dict, List, Union


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
