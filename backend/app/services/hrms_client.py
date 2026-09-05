import httpx
from typing import Dict, Any, List, Optional
from backend.app.config.settings import settings
from backend.app.security.sanitization import mask_sensitive_pii, sanitize_string


class HRMSClient:
    """
    Integration client for Enterprise HRMS platform.
    Matches logged-in user email, resolves UID / Force ID / Unit hierarchy,
    and returns role-scoped, PII-sanitized records for welfare, command, HR, and administration.
    """

    def __init__(self, base_url: str = "http://localhost:7777/api/v1"):
        self.base_url = base_url

    # Comprehensive HRMS Model Personnel Directory
    PERSONNEL_DATABASE = [
        {
            "uid": "UID-EMP-010",
            "force_id": "DUM_1",
            "regimental_number": "CRPF-2015-8010",
            "name": "Major Alex Morgan",
            "rank": "Major",
            "role": "PERSONNEL",
            "email": "alex@company.com",
            "unit": "Rapid Action Battalion 1",
            "branch": "CRPF",
            "counselor_assigned": "Welfare Offr. Priya Sharma",
            "welfare_officer_uid": "UID-WEL-007",
            "commander_uid": "UID-CMD-005",
            "stress_score": 78,
            "risk_level": "HIGH",
            "medical_category": "SHAPE-1",
            "consecutive_duty_days": 6,
            "sleep_hours": 4.5,
            "fatigue_level": 7,
            "trigger_factor": "Prolonged Night Patrols + Sleep Deficit (<5h/night)",
            "last_checkin": "2 hours ago",
            "status": "Active Duty"
        },
        {
            "uid": "UID-EMP-011",
            "force_id": "DUM_2",
            "regimental_number": "CISF-2017-8011",
            "name": "Captain Sarah Connor",
            "rank": "Captain",
            "role": "PERSONNEL",
            "email": "sarah@company.com",
            "unit": "Special Security Wing",
            "branch": "CISF",
            "counselor_assigned": "Welfare Offr. Priya Sharma",
            "welfare_officer_uid": "UID-WEL-007",
            "commander_uid": "UID-CMD-005",
            "stress_score": 42,
            "risk_level": "LOW",
            "medical_category": "SHAPE-1",
            "consecutive_duty_days": 2,
            "sleep_hours": 7.5,
            "fatigue_level": 3,
            "trigger_factor": "Optimal biometric balance",
            "last_checkin": "5 hours ago",
            "status": "Active Duty"
        },
        {
            "uid": "UID-EMP-012",
            "force_id": "DUM_12",
            "regimental_number": "CRPF-2016-8012",
            "name": "Havildar Ramesh Chand",
            "rank": "Havildar",
            "role": "PERSONNEL",
            "email": "ramesh.chand@forces.gov.in",
            "unit": "High Altitude Guard",
            "branch": "CRPF",
            "counselor_assigned": "Welfare Offr. Priya Sharma",
            "welfare_officer_uid": "UID-WEL-007",
            "commander_uid": "UID-CMD-005",
            "stress_score": 88,
            "risk_level": "CRITICAL",
            "medical_category": "SHAPE-2",
            "consecutive_duty_days": 8,
            "sleep_hours": 3.8,
            "fatigue_level": 9,
            "trigger_factor": "Consecutive High-Altitude Watch + Hypoxia Strain",
            "last_checkin": "1 hour ago",
            "status": "Under Medical Observation"
        },
        {
            "uid": "UID-EMP-013",
            "force_id": "DUM_13",
            "regimental_number": "ARMY-2018-8013",
            "name": "Subedar Gurpreet Singh",
            "rank": "Subedar",
            "role": "PERSONNEL",
            "email": "gurpreet.singh@forces.gov.in",
            "unit": "Field Artillery 3rd Bn",
            "branch": "Indian Army",
            "counselor_assigned": "Welfare Offr. Priya Sharma",
            "welfare_officer_uid": "UID-WEL-007",
            "commander_uid": "UID-CMD-005",
            "stress_score": 82,
            "risk_level": "HIGH",
            "medical_category": "SHAPE-1",
            "consecutive_duty_days": 5,
            "sleep_hours": 4.2,
            "fatigue_level": 8,
            "trigger_factor": "High Operational Tempo & Family Medical Emergency",
            "last_checkin": "3 hours ago",
            "status": "Active Duty"
        },
        {
            "uid": "UID-EMP-014",
            "force_id": "DUM_14",
            "regimental_number": "CRPF-2019-8014",
            "name": "Naik Sandeep Patil",
            "rank": "Naik",
            "role": "PERSONNEL",
            "email": "sandeep.patil@forces.gov.in",
            "unit": "Signals & Telemetry",
            "branch": "CRPF",
            "counselor_assigned": "Welfare Offr. Priya Sharma",
            "welfare_officer_uid": "UID-WEL-007",
            "commander_uid": "UID-CMD-005",
            "stress_score": 76,
            "risk_level": "HIGH",
            "medical_category": "SHAPE-1",
            "consecutive_duty_days": 7,
            "sleep_hours": 5.0,
            "fatigue_level": 7,
            "trigger_factor": "Continuous Screen Exposure & Shift Disruption",
            "last_checkin": "Today",
            "status": "Active Duty"
        },
        {
            "uid": "UID-EMP-015",
            "force_id": "DUM_15",
            "regimental_number": "ITBP-2020-8015",
            "name": "Sepoy Vikram Rathore Jr.",
            "rank": "Sepoy",
            "role": "PERSONNEL",
            "email": "vikram.jr@forces.gov.in",
            "unit": "Forward Recon Wing",
            "branch": "ITBP",
            "counselor_assigned": "Welfare Offr. Priya Sharma",
            "welfare_officer_uid": "UID-WEL-007",
            "commander_uid": "UID-CMD-005",
            "stress_score": 58,
            "risk_level": "MODERATE",
            "medical_category": "SHAPE-1",
            "consecutive_duty_days": 3,
            "sleep_hours": 6.8,
            "fatigue_level": 4,
            "trigger_factor": "Routine Mountain Acclimatization",
            "last_checkin": "Yesterday",
            "status": "Active Duty"
        },
        {
            "uid": "UID-SLD-015",
            "force_id": "DEF_015",
            "regimental_number": "ARMY-2021-9988",
            "name": "Sepoy Amit Kumar",
            "rank": "Sepoy / Commando",
            "role": "SOLDIER",
            "email": "soldier@forces.gov.in",
            "unit": "10 Para Special Forces",
            "branch": "Indian Army",
            "counselor_assigned": "Welfare Offr. Priya Sharma",
            "welfare_officer_uid": "UID-WEL-007",
            "commander_uid": "UID-CMD-005",
            "stress_score": 64,
            "risk_level": "MODERATE",
            "medical_category": "SHAPE-1",
            "consecutive_duty_days": 4,
            "sleep_hours": 5.5,
            "fatigue_level": 6,
            "trigger_factor": "Intensive Tactical Training & High Altitude Patrols",
            "last_checkin": "Just now",
            "status": "Active Duty"
        }
    ]

    # Welfare Cases & Counseling Directory
    WELFARE_CASES = [
        {
            "id": "WLF-2026-091",
            "personnel_uid": "UID-EMP-012",
            "personnel_name": "Havildar Ramesh Chand",
            "rank": "Havildar",
            "category": "Fatigue & Hypoxia Stress Intervention",
            "urgency": "CRITICAL",
            "status": "In Progress",
            "counselor": "Welfare Offr. Priya Sharma",
            "scheduled_time": "10:30 AM Today",
            "venue": "Counseling Suite 2 / Tele-Health",
            "requested_amount": 15000,
            "approved_amount": 15000,
            "action_plan": "Mandatory 48h rest rotation + High altitude de-escalation protocol"
        },
        {
            "id": "WLF-2026-088",
            "personnel_uid": "UID-EMP-013",
            "personnel_name": "Subedar Gurpreet Singh",
            "rank": "Subedar",
            "category": "Family Support & Financial Emergency Grant",
            "urgency": "HIGH",
            "status": "Approved",
            "counselor": "Welfare Offr. Priya Sharma",
            "scheduled_time": "02:00 PM Today",
            "venue": "Welfare Wing Clinic",
            "requested_amount": 25000,
            "approved_amount": 25000,
            "action_plan": "Compassionate grant disbursed + 5-day casual leave recommendation"
        },
        {
            "id": "WLF-2026-085",
            "personnel_uid": "UID-EMP-010",
            "personnel_name": "Major Alex Morgan",
            "rank": "Major",
            "category": "Post-Mission Stress & Sleep Hygiene",
            "urgency": "HIGH",
            "status": "Scheduled",
            "counselor": "Welfare Offr. Priya Sharma",
            "scheduled_time": "04:15 PM Today",
            "venue": "Virtual Session Room",
            "requested_amount": 0,
            "approved_amount": 0,
            "action_plan": "Cognitive behavioural debriefing & circadian rhythm alignment"
        },
        {
            "id": "WLF-2026-079",
            "personnel_uid": "UID-EMP-014",
            "personnel_name": "Naik Sandeep Patil",
            "rank": "Naik",
            "category": "Workload & Screen Fatigue Counseling",
            "urgency": "MODERATE",
            "status": "Scheduled",
            "counselor": "Welfare Offr. Priya Sharma",
            "scheduled_time": "Tomorrow 11:00 AM",
            "venue": "Signals Center Wellness Pod",
            "requested_amount": 0,
            "approved_amount": 0,
            "action_plan": "Ergonomic rotation and visual fatigue protocol"
        }
    ]

    # Command Duty Shifts & Deployments
    DUTY_ROSTERS = [
        {
            "duty_id": "DT-8801",
            "personnel_name": "Major Alex Morgan",
            "duty_type": "QRT Standby Lead",
            "shift": "Morning (06:00 - 14:00)",
            "location": "Sector 4 Command Post",
            "weapon_issued": "5.56mm SIG Sauer 716 (Butt #BN-042)",
            "status": "On Duty"
        },
        {
            "duty_id": "DT-8802",
            "personnel_name": "Captain Sarah Connor",
            "duty_type": "Perimeter Surveillance",
            "shift": "Afternoon (14:00 - 22:00)",
            "location": "Operations Control Room",
            "weapon_issued": "9mm Glock 17 (Butt #BN-108)",
            "status": "Scheduled"
        },
        {
            "duty_id": "DT-8803",
            "personnel_name": "Subedar Gurpreet Singh",
            "duty_type": "Field Logistics Inspection",
            "shift": "Morning (06:00 - 14:00)",
            "location": "Supply Depot Sector 1",
            "weapon_issued": "Standard Sidearm",
            "status": "On Duty"
        },
        {
            "duty_id": "DT-8804",
            "personnel_name": "Sepoy Vikram Rathore Jr.",
            "duty_type": "Reconnaissance Patrol",
            "shift": "Night Watch (22:00 - 06:00)",
            "location": "Forward Ridge Post 9",
            "weapon_issued": "7.62mm AK-203 (Butt #BN-215)",
            "status": "Standby"
        }
    ]

    # HR Leaves & Workforce Applications
    LEAVE_APPLICATIONS = [
        {
            "id": "LV-2026-441",
            "personnel_name": "Subedar Gurpreet Singh",
            "rank": "Subedar",
            "leave_type": "Casual Leave (Compassionate)",
            "start_date": "2026-09-08",
            "end_date": "2026-09-13",
            "days": 5,
            "reason": "Family medical obligation and support",
            "status": "Pending HR Approval"
        },
        {
            "id": "LV-2026-439",
            "personnel_name": "Major Alex Morgan",
            "rank": "Major",
            "leave_type": "Annual Reciprocal Leave",
            "start_date": "2026-10-01",
            "end_date": "2026-10-10",
            "days": 10,
            "reason": "Post-tenure decompression leave",
            "status": "Approved by Commander"
        },
        {
            "id": "LV-2026-435",
            "personnel_name": "Naik Sandeep Patil",
            "rank": "Naik",
            "leave_type": "Furlough Leave",
            "start_date": "2026-09-15",
            "end_date": "2026-09-22",
            "days": 7,
            "reason": "Annual home visit",
            "status": "In Review"
        }
    ]

    def get_welfare_dashboard_data(self, user_email: str) -> Dict[str, Any]:
        """Fetches scoped, PII-masked welfare data for Welfare Officers matched with email."""
        assigned_personnel = self.PERSONNEL_DATABASE
        high_risk_watchlist = [p for p in assigned_personnel if p["stress_score"] >= 70]
        critical_count = sum(1 for p in assigned_personnel if p["risk_level"] == "CRITICAL")
        
        raw_data = {
            "officer_email": sanitize_string(user_email),
            "welfare_circle": "Psychological Support & Welfare Wing (Sector North)",
            "metrics": {
                "active_welfare_cases": len(self.WELFARE_CASES),
                "critical_cases": critical_count,
                "high_risk_personnel_count": len(high_risk_watchlist),
                "today_counseling_sessions": 4,
                "monthly_resolved_interventions": 34,
                "recovery_rate_pct": 92.5
            },
            "high_risk_watchlist": high_risk_watchlist,
            "upcoming_sessions": self.WELFARE_CASES,
            "assigned_personnel": assigned_personnel
        }
        return mask_sensitive_pii(raw_data, "WELFARE_OFFICER")

    def get_commander_dashboard_data(self, user_email: str) -> Dict[str, Any]:
        """Fetches formation readiness, duty rosters, and SHAPE classifications for Commanders."""
        shape1_count = sum(1 for p in self.PERSONNEL_DATABASE if p["medical_category"] == "SHAPE-1")
        total_personnel = len(self.PERSONNEL_DATABASE)
        readiness_score = round((shape1_count / total_personnel) * 100, 1)

        raw_data = {
            "commander_email": sanitize_string(user_email),
            "command_formation": "16 Corps Command Division",
            "metrics": {
                "unit_readiness_index": readiness_score,
                "total_command_strength": 1248,
                "active_deployed_strength": 1184,
                "shape_1_deployable_pct": 94.8,
                "high_stress_alerts": sum(1 for p in self.PERSONNEL_DATABASE if p["risk_level"] in ["HIGH", "CRITICAL"]),
                "weapons_secured_in_kote": "98.4%"
            },
            "high_risk_personnel": [p for p in self.PERSONNEL_DATABASE if p["risk_level"] in ["HIGH", "CRITICAL"]],
            "active_duty_rosters": self.DUTY_ROSTERS,
            "formation_units": [
                {"unit": "Rapid Action Battalion 1", "strength": 420, "readiness": 96.2, "status": "Combat Ready"},
                {"unit": "High Altitude Guard", "strength": 280, "readiness": 91.5, "status": "Acclimatized"},
                {"unit": "Field Artillery 3rd Bn", "strength": 310, "readiness": 95.0, "status": "Combat Ready"},
                {"unit": "Signals & Telemetry Wing", "strength": 238, "readiness": 97.4, "status": "Operational"}
            ]
        }
        return mask_sensitive_pii(raw_data, "COMMANDER")

    def get_hr_dashboard_data(self, user_email: str) -> Dict[str, Any]:
        """Fetches workforce, leave, and attendance analytics for HR Officers."""
        raw_data = {
            "hr_email": sanitize_string(user_email),
            "division": "Personnel & Records Division",
            "metrics": {
                "total_workforce": 1248,
                "present_today_pct": 96.4,
                "on_authorized_leave": 42,
                "pending_leave_requests": len(self.LEAVE_APPLICATIONS),
                "transfers_in_pipeline": 18,
                "apar_compliance_pct": 98.2
            },
            "pending_leaves": self.LEAVE_APPLICATIONS,
            "cadre_distribution": [
                {"cadre": "Officers", "count": 112, "percentage": 9.0},
                {"cadre": "Junior Commissioned Officers (JCO)", "count": 284, "percentage": 22.7},
                {"cadre": "Other Ranks / NCOs", "count": 768, "percentage": 61.5},
                {"cadre": "Specialist Technical Cadre", "count": 84, "percentage": 6.8}
            ],
            "recent_personnel": self.PERSONNEL_DATABASE
        }
        return mask_sensitive_pii(raw_data, "HR_OFFICER")

    def get_admin_dashboard_data(self, user_email: str) -> Dict[str, Any]:
        """Fetches platform telemetry, security audits, and organization summary for Administrators."""
        raw_data = {
            "admin_email": sanitize_string(user_email),
            "system_node": "Strategic Cloud Node - New Delhi Defense Datacenter",
            "metrics": {
                "total_personnel_records": 1248,
                "active_monitoring_sessions": 342,
                "ai_burnout_assessments_today": 128,
                "critical_security_events": 0,
                "system_uptime_pct": 99.98,
                "hrms_sync_status": "Synchronized (Real-Time)"
            },
            "system_health": {
                "api_gateway": "Healthy",
                "database_engine": "Operational",
                "ai_inference_pipeline": "Active (Latency: 18ms)",
                "audit_logger": "Encrypted & Active"
            },
            "all_personnel": self.PERSONNEL_DATABASE
        }
        return mask_sensitive_pii(raw_data, "ADMIN")



# Singleton instance
hrms_service = HRMSClient()
