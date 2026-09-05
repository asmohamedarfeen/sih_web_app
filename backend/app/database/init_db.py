from backend.app.database.session import engine, SessionLocal, Base
from backend.app.models.user import User, RoleEnum
from backend.app.security.passwords import get_password_hash


DEMO_USERS = [
    {
        "uid": "UID-SUP-001",
        "force_id": "DEF_001",
        "regimental_number": "ARMY-2005-9001",
        "email": "superadmin@forces.gov.in",
        "password": "superadmin123",
        "full_name": "Gen. Vikramaditya Rawat",
        "role": RoleEnum.SUPER_ADMIN,
        "rank": "General / Chief of Defence Staff",
        "unit": "Integrated Defence Staff (IDS) HQ",
        "branch": "Indian Army",
        "employee_id": "ADM-001",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-SYS-002",
        "force_id": "DEF_002",
        "regimental_number": "MOD-2010-8002",
        "email": "sysadmin@forces.gov.in",
        "password": "sysadmin123",
        "full_name": "SysAdmin K. Raman",
        "role": RoleEnum.SYS_ADMIN,
        "rank": "Director / IT & Systems",
        "unit": "Defence IT & Network Operations",
        "branch": "Ministry of Defence",
        "employee_id": "SYS-002",
        "avatar_url": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-SEC-003",
        "force_id": "DEF_003",
        "regimental_number": "CRPF-2009-8003",
        "email": "security@forces.gov.in",
        "password": "security123",
        "full_name": "Col. A. K. Mishra (CISO)",
        "role": RoleEnum.SECURITY_ADMIN,
        "rank": "Colonel / Chief Information Security Officer",
        "unit": "Cyber Security & Signals Wing",
        "branch": "CRPF",
        "employee_id": "SEC-003",
        "avatar_url": "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-HRO-004",
        "force_id": "DUM_3",
        "regimental_number": "CRPF-2008-8004",
        "email": "admin@company.com",
        "password": "admin123",
        "full_name": "Col. Kabir Khan",
        "role": RoleEnum.HR_OFFICER,
        "rank": "Colonel / HR Superintendent",
        "unit": "Force Personnel & Records Division",
        "branch": "CRPF",
        "employee_id": "HRO-201",
        "avatar_url": "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-HRO-004B",
        "force_id": "DUM_3",
        "regimental_number": "CRPF-2008-8004B",
        "email": "hr@forces.gov.in",
        "password": "hr123",
        "full_name": "Col. Kabir Khan (HR Officer)",
        "role": RoleEnum.HR_OFFICER,
        "rank": "Colonel / HR Director",
        "unit": "Personnel & Records Division",
        "branch": "CRPF",
        "employee_id": "HRO-202",
        "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-CMD-005",
        "force_id": "DEF_004",
        "regimental_number": "ARMY-2007-8005",
        "email": "commander@forces.gov.in",
        "password": "commander123",
        "full_name": "Brig. Santosh Babu",
        "role": RoleEnum.COMMANDER,
        "rank": "Brigadier / Formation Commander",
        "unit": "16 Corps Command Division",
        "branch": "Indian Army",
        "employee_id": "CMD-009",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-DPT-006",
        "force_id": "DEF_005",
        "regimental_number": "BSF-2011-8006",
        "email": "depthead@forces.gov.in",
        "password": "depthead123",
        "full_name": "DC Amitabh Verma",
        "role": RoleEnum.DEPT_HEAD,
        "rank": "Deputy Commandant / Sector Head",
        "unit": "Tactical Border Sector HQ",
        "branch": "BSF",
        "employee_id": "DPT-006",
        "avatar_url": "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-WEL-007",
        "force_id": "DEF_006",
        "regimental_number": "CRPF-2014-8007",
        "email": "welfare@forces.gov.in",
        "password": "welfare123",
        "full_name": "Welfare Offr. Priya Sharma",
        "role": RoleEnum.WELFARE_OFFICER,
        "rank": "Lt. Colonel / Chief Welfare Officer",
        "unit": "Psychological Support & Welfare Wing",
        "branch": "CRPF",
        "employee_id": "WLF-104",
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-TRN-008",
        "force_id": "DEF_007",
        "regimental_number": "ITBP-2012-8008",
        "email": "training@forces.gov.in",
        "password": "training123",
        "full_name": "Capt. Saurabh Kalia",
        "role": RoleEnum.TRAINING_OFFICER,
        "rank": "Captain / Training Commandant",
        "unit": "High Altitude Warfare Academy",
        "branch": "ITBP",
        "employee_id": "TRN-008",
        "avatar_url": "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-MED-009",
        "force_id": "DEF_008",
        "regimental_number": "AFMC-2010-8009",
        "email": "medical@forces.gov.in",
        "password": "medical123",
        "full_name": "Dr. (Col.) Anand Swaminathan",
        "role": RoleEnum.MEDICAL_OFFICER,
        "rank": "Colonel / Chief Medical Officer",
        "unit": "Armed Forces Medical Center",
        "branch": "AFMC",
        "employee_id": "MED-009",
        "avatar_url": "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-EMP-010",
        "force_id": "DUM_1",
        "regimental_number": "CRPF-2015-8010",
        "email": "alex@company.com",
        "password": "employee123",
        "full_name": "Major Alex Morgan",
        "role": RoleEnum.PERSONNEL,
        "rank": "Major / Field Ops Lead",
        "unit": "Rapid Action Battalion 1",
        "branch": "CRPF",
        "employee_id": "DUM_1",
        "avatar_url": "https://api.dicebear.com/7.x/adventurer/png?seed=DUM_1&size=128"
    },
    {
        "uid": "UID-EMP-011",
        "force_id": "DUM_2",
        "regimental_number": "CISF-2017-8011",
        "email": "sarah@company.com",
        "password": "employee123",
        "full_name": "Captain Sarah Connor",
        "role": RoleEnum.PERSONNEL,
        "rank": "Captain / Perimeter Security Incharge",
        "unit": "Special Security Wing",
        "branch": "CISF",
        "employee_id": "DUM_2",
        "avatar_url": "https://api.dicebear.com/7.x/adventurer/png?seed=DUM_2&size=128"
    },
    {
        "uid": "UID-SLD-015",
        "force_id": "DEF_015",
        "regimental_number": "ARMY-2021-9988",
        "email": "soldier@forces.gov.in",
        "password": "soldier123",
        "full_name": "Sepoy Amit Kumar",
        "role": RoleEnum.SOLDIER,
        "rank": "Sepoy / Commando",
        "unit": "10 Para Special Forces",
        "branch": "Indian Army",
        "employee_id": "SLD-015",
        "avatar_url": "https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80"
    },
    # Backwards-compatible aliases
    {
        "uid": "UID-LEG-001",
        "force_id": "DEF_LEG_001",
        "regimental_number": "MOD-LEG-001",
        "email": "admin@welfare.gov.in",
        "password": "admin123",
        "full_name": "Col. Rajesh Varma",
        "role": RoleEnum.ADMIN,
        "rank": "Colonel / Chief Administrator",
        "unit": "HQ Strategic Directorate",
        "branch": "Indian Army",
        "employee_id": "ADM-LEG-001",
        "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-LEG-002",
        "force_id": "DEF_LEG_002",
        "regimental_number": "CRPF-LEG-002",
        "email": "welfare@welfare.gov.in",
        "password": "welfare123",
        "full_name": "Lt. Col. Priya Sharma",
        "role": RoleEnum.WELFARE_OFFICER,
        "rank": "Lt. Colonel / Chief Welfare Officer",
        "unit": "Psychological Support & Welfare Wing",
        "branch": "CRPF",
        "employee_id": "WLF-LEG-002",
        "avatar_url": "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-LEG-003",
        "force_id": "DEF_LEG_003",
        "regimental_number": "ARMY-LEG-003",
        "email": "commander@welfare.gov.in",
        "password": "commander123",
        "full_name": "Brigadier Vikram Rathore",
        "role": RoleEnum.COMMANDER,
        "rank": "Brigadier / Formation Commander",
        "unit": "14 Corps Command Division",
        "branch": "Indian Army",
        "employee_id": "CMD-LEG-003",
        "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
        "uid": "UID-LEG-004",
        "force_id": "DEF_LEG_004",
        "regimental_number": "CRPF-LEG-004",
        "email": "hr@welfare.gov.in",
        "password": "hr123",
        "full_name": "Major Ananya Iyer",
        "role": RoleEnum.HR_OFFICER,
        "rank": "Major / Senior HR Superintendent",
        "unit": "Personnel & Records Division",
        "branch": "CRPF",
        "employee_id": "HRO-LEG-004",
        "avatar_url": "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80"
    },
]


def init_database_and_seed():
    """Initializes tables and seeds initial role accounts with HRMS metadata."""
    Base.metadata.create_all(bind=engine)

    # Automatically ensure new columns exist in SQLite users table
    with engine.connect() as conn:
        from sqlalchemy import text
        cursor = conn.execute(text("PRAGMA table_info(users)"))
        existing_cols = {row[1] for row in cursor.fetchall()}
        
        new_cols = {
            "uid": "VARCHAR(50)",
            "force_id": "VARCHAR(50)",
            "regimental_number": "VARCHAR(50)",
            "branch": "VARCHAR(100)",
        }
        for col, col_type in new_cols.items():
            if col not in existing_cols:
                conn.execute(text(f"ALTER TABLE users ADD COLUMN {col} {col_type}"))
        conn.commit()

    db = SessionLocal()
    try:
        for user_data in DEMO_USERS:
            existing = db.query(User).filter(User.email == user_data["email"]).first()
            if not existing:
                existing_emp = db.query(User).filter(User.employee_id == user_data["employee_id"]).first()
                emp_id = user_data["employee_id"] if not existing_emp else f"{user_data['employee_id']}-NEW"
                
                user = User(
                    uid=user_data.get("uid"),
                    force_id=user_data.get("force_id"),
                    regimental_number=user_data.get("regimental_number"),
                    email=user_data["email"],
                    hashed_password=get_password_hash(user_data["password"]),
                    full_name=user_data["full_name"],
                    role=user_data["role"],
                    rank=user_data.get("rank"),
                    unit=user_data.get("unit"),
                    branch=user_data.get("branch"),
                    employee_id=emp_id,
                    avatar_url=user_data.get("avatar_url"),
                    is_active=True
                )
                db.add(user)
            else:
                existing.uid = user_data.get("uid", existing.uid)
                existing.force_id = user_data.get("force_id", existing.force_id)
                existing.regimental_number = user_data.get("regimental_number", existing.regimental_number)
                existing.branch = user_data.get("branch", existing.branch)
                existing.unit = user_data.get("unit", existing.unit)
                existing.rank = user_data.get("rank", existing.rank)
                existing.role = user_data.get("role", existing.role)
                existing.employee_id = user_data.get("employee_id", existing.employee_id)
        
        # Seed Initial Interventions if empty
        from backend.app.models.intervention import Intervention
        if db.query(Intervention).count() == 0:
            db.add_all([
                Intervention(
                    case_number="WLF-2026-091",
                    personnel_uid="UID-EMP-012",
                    personnel_name="Havildar Ramesh Chand",
                    rank="Havildar",
                    unit="High Altitude Guard",
                    officer_uid="UID-WEL-007",
                    counselor_name="Welfare Offr. Priya Sharma",
                    category="Fatigue & Hypoxia Stress Intervention",
                    urgency="CRITICAL",
                    status="IN_PROGRESS",
                    title="Mandatory Rest & De-escalation Protocol",
                    description="Patient showed extreme biometric fatigue score (88/100) after 8 consecutive high-altitude night shifts.",
                    action_plan="Mandatory 48h rest rotation + High altitude de-escalation protocol",
                    requested_amount=15000.0,
                    approved_amount=15000.0,
                    counseling_date="Today 10:30 AM",
                    venue="Counseling Suite 2 / Tele-Health",
                    timeline=[{"date": "2026-09-04 06:00", "event": "Telemetry alert triggered"}, {"date": "2026-09-04 08:30", "event": "Case accepted by Chief Welfare Officer"}]
                ),
                Intervention(
                    case_number="WLF-2026-088",
                    personnel_uid="UID-EMP-013",
                    personnel_name="Subedar Gurpreet Singh",
                    rank="Subedar",
                    unit="Field Artillery 3rd Bn",
                    officer_uid="UID-WEL-007",
                    counselor_name="Welfare Offr. Priya Sharma",
                    category="Family Support & Financial Emergency Grant",
                    urgency="HIGH",
                    status="RESOLVED",
                    title="Compassionate Financial Grant & Emergency Leave",
                    description="Severe family medical emergency causing acute sleep deficit and focus disruption.",
                    action_plan="Compassionate grant disbursed + 5-day casual leave recommendation",
                    requested_amount=25000.0,
                    approved_amount=25000.0,
                    counseling_date="Today 02:00 PM",
                    venue="Welfare Wing Clinic",
                    timeline=[{"date": "2026-09-02 14:00", "event": "Application submitted"}, {"date": "2026-09-03 10:00", "event": "Financial grant cleared"}]
                ),
                Intervention(
                    case_number="WLF-2026-085",
                    personnel_uid="UID-EMP-010",
                    personnel_name="Major Alex Morgan",
                    rank="Major",
                    unit="Rapid Action Battalion 1",
                    officer_uid="UID-WEL-007",
                    counselor_name="Welfare Offr. Priya Sharma",
                    category="Post-Mission Stress & Sleep Hygiene",
                    urgency="HIGH",
                    status="IN_PROGRESS",
                    title="Cognitive Circadian Re-alignment Protocol",
                    description="Prolonged Night Patrols + Sleep Deficit (<4.5h/night) leading to stress index spike.",
                    action_plan="Cognitive behavioural debriefing & circadian rhythm alignment",
                    requested_amount=0.0,
                    approved_amount=0.0,
                    counseling_date="Today 04:15 PM",
                    venue="Virtual Session Room",
                    timeline=[{"date": "2026-09-04 09:00", "event": "Assessment reviewed"}]
                )
            ])

        # Seed Initial Alerts if empty
        from backend.app.models.alert import SystemAlert
        if db.query(SystemAlert).count() == 0:
            db.add_all([
                SystemAlert(
                    personnel_uid="UID-EMP-012",
                    personnel_name="Havildar Ramesh Chand",
                    rank="Havildar",
                    unit="High Altitude Guard",
                    alert_type="CRITICAL_STRESS_SPIKE",
                    severity="CRITICAL",
                    trigger_reason="Consecutive 8 days High Altitude Night Watch + Hypoxia biometric strain (Score 88/100)",
                    recommendation="Mandatory 48h rest rotation and immediate medical examination."
                ),
                SystemAlert(
                    personnel_uid="UID-EMP-013",
                    personnel_name="Subedar Gurpreet Singh",
                    rank="Subedar",
                    unit="Field Artillery 3rd Bn",
                    alert_type="BURNOUT_WARNING",
                    severity="HIGH",
                    trigger_reason="Sleep duration dropped below 4.2 hours with high workload strain (Score 82/100)",
                    recommendation="Reassign day patrol and approve 5-day compassionate leave."
                ),
                SystemAlert(
                    personnel_uid="UID-EMP-010",
                    personnel_name="Major Alex Morgan",
                    rank="Major",
                    unit="Rapid Action Battalion 1",
                    alert_type="SHIFT_FATIGUE_FLAG",
                    severity="HIGH",
                    trigger_reason="6 consecutive night shifts with sleep deficit (Score 78/100)",
                    recommendation="Schedule cognitive debrief session with Welfare Officer."
                )
            ])

        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    init_database_and_seed()
    print("Database tables initialized and HRMS defense role accounts seeded successfully.")

