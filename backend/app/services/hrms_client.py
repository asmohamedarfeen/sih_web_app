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
    # Comprehensive HRMS Model Personnel Directory with 8-Parameter Telemetry & Sync Tracking
    PERSONNEL_DATABASE = [
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
            "medical_category": "SHAPE-1 (Temporary P2)",
            "consecutive_duty_days": 8,
            "sleep_hours": 3.8,
            "fatigue_level": 9,
            "trigger_factor": "Consecutive High-Altitude Watch + Hypoxia Strain",
            "last_checkin": "1 hour ago",
            "status": "Under Medical Observation",
            "hrms_sync_status": "SYNCHRONIZED",
            "last_sync_timestamp": "2026-09-06T06:15:00Z",
            "data_completeness_pct": 100,
            "missing_telemetry": [],
            "params": {
                "leave_patterns": {"score": 80, "available": True, "source": "HRMS Leave Portal", "note": "3 consecutive leave applications deferred due to forward vigil deployment."},
                "overtime": {"score": 92, "available": True, "source": "HRMS Watch Roster", "note": "48 duty hours logged in past 5 days (64% over standard roster)."},
                "workload_trend": {"score": 88, "available": True, "source": "Command Operations Log", "note": "High task escalation slope with double perimeter watch shifts."},
                "deployment_duration": {"score": 95, "available": True, "source": "Service Dossier Database", "note": "14 continuous months stationed in extreme sub-zero forward sector."},
                "duty_schedule": {"score": 84, "available": True, "source": "Battalion Roster", "note": "8 consecutive night vigils with irregular sleep window rotation."},
                "sleep_quality": {"score": 92, "available": True, "source": "Biometric Wearable Telemetry", "note": "Severe nocturnal sleep deficit (<3.8h recorded on biometric tracker)."},
                "emotional_exhaustion": {"score": 82, "available": True, "source": "Clinical MBI-GS Telemetry", "note": "Maslach affective depletion index elevated; high somatic weariness."},
                "assessment_responses": {"score": 76, "available": True, "source": "AI Psychological Twin Assessment", "note": "AI self-assessment flagged cognitive fatigue and high vigilance strain."}
            }
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
            "status": "Active Duty (Command)",
            "hrms_sync_status": "SYNCHRONIZED",
            "last_sync_timestamp": "2026-09-06T06:14:30Z",
            "data_completeness_pct": 100,
            "missing_telemetry": [],
            "params": {
                "leave_patterns": {"score": 88, "available": True, "source": "HRMS Leave Portal", "note": "Family medical leave pending; urgent domestic distress reported."},
                "overtime": {"score": 78, "available": True, "source": "Battery Duty Roster", "note": "Command logistics management beyond standard battery shifts."},
                "workload_trend": {"score": 84, "available": True, "source": "Field Operations Log", "note": "Field artillery exercise coordination under condensed timeline."},
                "deployment_duration": {"score": 75, "available": True, "source": "Service Dossier Database", "note": "8 continuous months in active artillery forward battery line."},
                "duty_schedule": {"score": 78, "available": True, "source": "Battalion Roster", "note": "Split shifts with early dawn drill inspections and night logistics."},
                "sleep_quality": {"score": 82, "available": True, "source": "Biometric Wearable Telemetry", "note": "High latency sleep fragmentation; restless off-duty periods."},
                "emotional_exhaustion": {"score": 80, "available": True, "source": "Clinical MBI-GS Telemetry", "note": "Cumulative command burden combined with caregiver strain."},
                "assessment_responses": {"score": 74, "available": True, "source": "AI Psychological Twin Assessment", "note": "Distress score 75/100 on Kessler-10 AI behavioral evaluation."}
            }
        },
        {
            "uid": "UID-EMP-014",
            "force_id": "DUM_14",
            "regimental_number": "BSF-2019-8014",
            "name": "Naik Sandeep Patil",
            "rank": "Naik",
            "role": "PERSONNEL",
            "email": "sandeep.patil@forces.gov.in",
            "unit": "Signals & Telemetry",
            "branch": "BSF",
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
            "status": "Active Duty",
            "hrms_sync_status": "SYNCHRONIZED",
            "last_sync_timestamp": "2026-09-06T06:10:00Z",
            "data_completeness_pct": 100,
            "missing_telemetry": [],
            "params": {
                "leave_patterns": {"score": 55, "available": True, "source": "HRMS Leave Portal", "note": "Annual leave taken 4 months ago; nominal leave status."},
                "overtime": {"score": 82, "available": True, "source": "Console Watch Roster", "note": "Prolonged communications console monitoring duty (12h shifts)."},
                "workload_trend": {"score": 72, "available": True, "source": "Signals Traffic Engine", "note": "Increased signal traffic and perimeter radar maintenance calls."},
                "deployment_duration": {"score": 60, "available": True, "source": "Service Dossier Database", "note": "6 months in border telemetry outpost station."},
                "duty_schedule": {"score": 85, "available": True, "source": "Shift Telemetry", "note": "Continuous rotational night console shifts causing circadian shift."},
                "sleep_quality": {"score": 75, "available": True, "source": "Biometric Wearable Telemetry", "note": "Blue light screen latency and disturbed deep sleep cycles."},
                "emotional_exhaustion": {"score": 68, "available": True, "source": "Clinical MBI-GS Telemetry", "note": "Moderate sensory overload and isolation weariness."},
                "assessment_responses": {"score": 62, "available": True, "source": "AI Psychological Twin Assessment", "note": "Responses reflect high mental focus requirements with mild strain."}
            }
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
            "medical_category": "SHAPE-1 (S1H1A1P1E1)",
            "consecutive_duty_days": 4,
            "sleep_hours": 5.5,
            "fatigue_level": 6,
            "trigger_factor": "Intensive Tactical Training & High Altitude Patrols",
            "last_checkin": "Just now",
            "status": "Active Frontline Patrol",
            "hrms_sync_status": "SYNCHRONIZED",
            "last_sync_timestamp": "2026-09-06T06:17:15Z",
            "data_completeness_pct": 100,
            "missing_telemetry": [],
            "params": {
                "leave_patterns": {"score": 60, "available": True, "source": "HRMS Leave Portal", "note": "Leave scheduled next month; currently on tactical patrol roster."},
                "overtime": {"score": 68, "available": True, "source": "Tactical Patrol Roster", "note": "Tactical reconnaissance exercises and high-tempo patrol duties."},
                "workload_trend": {"score": 70, "available": True, "source": "Operations Command Log", "note": "Physical training and live field deployment drills."},
                "deployment_duration": {"score": 65, "available": True, "source": "Service Dossier Database", "note": "7 months forward stationing with high operational focus."},
                "duty_schedule": {"score": 66, "available": True, "source": "Patrol Schedule Matrix", "note": "Variable tactical patrol timings with standard debrief recovery."},
                "sleep_quality": {"score": 58, "available": True, "source": "Biometric Wearable Telemetry", "note": "Moderate sleep variability; high cardiovascular bounce-back."},
                "emotional_exhaustion": {"score": 62, "available": True, "source": "Clinical MBI-GS Telemetry", "note": "Tactical vigilance maintenance; strong squad peer camaraderie."},
                "assessment_responses": {"score": 64, "available": True, "source": "Gemini AI Self-Assessment", "note": "Valid psychometric self-assessment score 64.2/100 (Moderate)."}
            }
        },
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
            "status": "Active Command Duty",
            "hrms_sync_status": "SYNCHRONIZED",
            "last_sync_timestamp": "2026-09-06T06:12:00Z",
            "data_completeness_pct": 100,
            "missing_telemetry": [],
            "params": {
                "leave_patterns": {"score": 72, "available": True, "source": "HRMS Leave Portal", "note": "Consecutive operational deployments delaying annual furlough."},
                "overtime": {"score": 80, "available": True, "source": "Command Watch Roster", "note": "Prolonged night sector sweeps and battalion operational reviews."},
                "workload_trend": {"score": 76, "available": True, "source": "Operations Command Log", "note": "High leadership tempo and operational briefing load."},
                "deployment_duration": {"score": 70, "available": True, "source": "Service Dossier Database", "note": "9 months forward command post deployment."},
                "duty_schedule": {"score": 74, "available": True, "source": "Patrol Schedule Matrix", "note": "Irregular operational call-outs during recovery intervals."},
                "sleep_quality": {"score": 78, "available": True, "source": "Biometric Wearable Telemetry", "note": "Average 4.9 hours sleep recorded per night; elevated cortisol."},
                "emotional_exhaustion": {"score": 75, "available": True, "source": "Clinical MBI-GS Telemetry", "note": "High responsibility load; resilience score remains robust."},
                "assessment_responses": {"score": 72, "available": True, "source": "AI Psychological Twin Assessment", "note": "Assessment reflects sustained command vigilance with early strain."}
            }
        },
        {
            "uid": "UID-EMP-011",
            "force_id": "DUM_2",
            "regimental_number": "CISF-2017-8011",
            "name": "Captain Sarah Connor",
            "rank": "Captain",
            "role": "PERSONNEL",
            "email": "sarah@company.com",
            "unit": "Air Defense Command",
            "branch": "Indian Air Force",
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
            "status": "Active Nominal Duty",
            "hrms_sync_status": "SYNCHRONIZED",
            "last_sync_timestamp": "2026-09-06T06:05:00Z",
            "data_completeness_pct": 100,
            "missing_telemetry": [],
            "params": {
                "leave_patterns": {"score": 25, "available": True, "source": "HRMS Leave Portal", "note": "Regular furlough balance maintained; leave taken on schedule."},
                "overtime": {"score": 30, "available": True, "source": "Air Defense Watch Roster", "note": "Standard radar watch cycles with mandatory 12h rest interval."},
                "workload_trend": {"score": 32, "available": True, "source": "Operations Command Log", "note": "Balanced air traffic management and simulation schedules."},
                "deployment_duration": {"score": 20, "available": True, "source": "Service Dossier Database", "note": "3 months in peace-station technical command hub."},
                "duty_schedule": {"score": 28, "available": True, "source": "Roster Matrix", "note": "Consistent daylight and evening rotation with full rest days."},
                "sleep_quality": {"score": 24, "available": True, "source": "Biometric Wearable Telemetry", "note": "Optimal restorative sleep (7.4h average, >90 min deep sleep)."},
                "emotional_exhaustion": {"score": 30, "available": True, "source": "Clinical MBI-GS Telemetry", "note": "High job satisfaction, excellent morale, low somatic stress."},
                "assessment_responses": {"score": 28, "available": True, "source": "AI Psychological Twin Assessment", "note": "Assessment score 28.4/100 indicating prime mental wellness."}
            }
        },
        {
            "uid": "UID-EMP-015",
            "force_id": "DUM_15",
            "regimental_number": "ITBP-2020-8015",
            "name": "Sepoy Vikram Rathore Jr.",
            "rank": "Sepoy",
            "role": "PERSONNEL",
            "email": "vikram.jr@forces.gov.in",
            "unit": "Northern Border Patrol",
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
            "status": "Active Duty",
            "hrms_sync_status": "SYNCHRONIZED",
            "last_sync_timestamp": "2026-09-06T05:50:00Z",
            "data_completeness_pct": 100,
            "missing_telemetry": [],
            "params": {
                "leave_patterns": {"score": 50, "available": True, "source": "HRMS Leave Portal", "note": "Furlough approved for next cycle; awaiting replacement."},
                "overtime": {"score": 55, "available": True, "source": "Mountain Patrol Roster", "note": "Moderate patrol duration in mountain passes."},
                "workload_trend": {"score": 54, "available": True, "source": "Operations Log", "note": "Standard patrol routines with regular acclimatization stops."},
                "deployment_duration": {"score": 60, "available": True, "source": "Service Dossier Database", "note": "5 months at forward border outpost."},
                "duty_schedule": {"score": 52, "available": True, "source": "Roster Matrix", "note": "Rotational 8-hour patrol watches with squad partner."},
                "sleep_quality": {"score": 50, "available": True, "source": "Biometric Wearable Telemetry", "note": "Moderate sleep quality with mild altitude-related awakening."},
                "emotional_exhaustion": {"score": 48, "available": True, "source": "Clinical MBI-GS Telemetry", "note": "Good buddy-system support and recreational morale."},
                "assessment_responses": {"score": 52, "available": True, "source": "AI Psychological Twin Assessment", "note": "Self-assessment indicates balanced coping in extreme terrain."}
            }
        },
        {
            "uid": "UID-EMP-016",
            "force_id": "DUM_16",
            "regimental_number": "CISF-2021-8016",
            "name": "Lance Naik Deepak Verma",
            "rank": "Lance Naik",
            "role": "PERSONNEL",
            "email": "deepak.verma@forces.gov.in",
            "unit": "Aviation Security Wing",
            "branch": "CISF",
            "counselor_assigned": "Welfare Offr. Priya Sharma",
            "welfare_officer_uid": "UID-WEL-007",
            "commander_uid": "UID-CMD-005",
            "stress_score": 48,
            "risk_level": "MODERATE",
            "medical_category": "SHAPE-1",
            "consecutive_duty_days": 3,
            "sleep_hours": 6.5,
            "fatigue_level": 4,
            "trigger_factor": "Airport terminal security shifts",
            "last_checkin": "4 hours ago",
            "status": "Active Duty",
            "hrms_sync_status": "PARTIAL_SYNC",
            "last_sync_timestamp": "2026-09-06T04:30:00Z",
            "data_completeness_pct": 75,
            "missing_telemetry": ["sleep_quality", "assessment_responses"],
            "params": {
                "leave_patterns": {"score": 45, "available": True, "source": "HRMS Leave Portal", "note": "Casual leave utilized last month; steady roster."},
                "overtime": {"score": 50, "available": True, "source": "Airport Security Roster", "note": "Terminal surveillance watches during high airport footfall."},
                "workload_trend": {"score": 48, "available": True, "source": "Operations Log", "note": "Standard security screening shifts with rotations."},
                "deployment_duration": {"score": 40, "available": True, "source": "Service Dossier Database", "note": "4 months at metropolitan airport unit."},
                "duty_schedule": {"score": 55, "available": True, "source": "Shift Roster", "note": "Rotational morning/evening shifts with standard breaks."},
                "sleep_quality": {"score": 46, "available": False, "source": "Pending Wearable Sync", "note": "Wearable biometric sleep tracker not synced in last 48 hours."},
                "emotional_exhaustion": {"score": 44, "available": True, "source": "Clinical MBI-GS Telemetry", "note": "Good peer morale and stable welfare support."},
                "assessment_responses": {"score": 48, "available": False, "source": "Pending Self-Assessment", "note": "Soldier self-assessment questionnaire pending completion."}
            }
        },
        {
            "uid": "UID-EMP-017",
            "force_id": "DUM_17",
            "regimental_number": "AR-2022-8017",
            "name": "Rifleman Rajesh Rawat",
            "rank": "Rifleman",
            "role": "PERSONNEL",
            "email": "rajesh.rawat@forces.gov.in",
            "unit": "Counter-Insurgency Force",
            "branch": "Assam Rifles",
            "counselor_assigned": "Welfare Offr. Priya Sharma",
            "welfare_officer_uid": "UID-WEL-007",
            "commander_uid": "UID-CMD-005",
            "stress_score": 72,
            "risk_level": "HIGH",
            "medical_category": "SHAPE-1",
            "consecutive_duty_days": 6,
            "sleep_hours": 4.8,
            "fatigue_level": 7,
            "trigger_factor": "Dense terrain search operations",
            "last_checkin": "3 hours ago",
            "status": "Field Deployment",
            "hrms_sync_status": "SYNCHRONIZED",
            "last_sync_timestamp": "2026-09-06T05:20:00Z",
            "data_completeness_pct": 100,
            "missing_telemetry": [],
            "params": {
                "leave_patterns": {"score": 75, "available": True, "source": "HRMS Leave Portal", "note": "Leave delayed by 2 months due to operational cordon duties."},
                "overtime": {"score": 76, "available": True, "source": "Field Operations Roster", "note": "Extensive jungle patrol watches in remote hill sectors."},
                "workload_trend": {"score": 74, "available": True, "source": "Command Operations Log", "note": "High-tempo tactical cordon and search operations."},
                "deployment_duration": {"score": 72, "available": True, "source": "Service Dossier Database", "note": "8 continuous months in dense terrain remote post."},
                "duty_schedule": {"score": 70, "available": True, "source": "Battalion Roster", "note": "Irregular operational schedules with rapid alerts."},
                "sleep_quality": {"score": 74, "available": True, "source": "Biometric Wearable Telemetry", "note": "Interrupted sleep cycles with high vigilance latency."},
                "emotional_exhaustion": {"score": 68, "available": True, "source": "Clinical MBI-GS Telemetry", "note": "High environmental fatigue; relies on squad support."},
                "assessment_responses": {"score": 70, "available": True, "source": "AI Psychological Twin Assessment", "note": "Evaluation score 72.4/100 (High strain, priority review)."}
            }
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
