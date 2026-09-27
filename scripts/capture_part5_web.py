import os
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3001"
OUTPUT_DIR = "/Users/asmohamedarfeen/Desktop/project/sih_webapp/screenshots/part5"

AUTH_JS = """() => {
    const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjb21tYW5kZXJAZm9yY2VzLmdvdi5pbiIsInVzZXJfaWQiOjEwLCJ1aWQiOiJVSUQtQ01ELTAwNSIsImZvcmNlX2lkIjoiREVGXzAwNCIsInJlZ2ltZW50YWxfbnVtYmVyIjoiQVJNWS0yMDA3LTgwMDUiLCJyb2xlIjoiQ09NTUFOREVSIiwiZnVsbF9uYW1lIjoiQnJpZy4gU2FudG9zaCBCYWJ1IiwidW5pdCI6IjE2IENvcnBzIENvbW1hbmQgRGl2aXNpb24iLCJicmFuY2giOiJJbmRpYW4gQXJteSIsImV4cCI6MTc5MDg2NDAxOCwiaWF0IjoxNzkwMjU5MjE4fQ.HSxZNywJQAKxzu_UDU-IzLOY74yh2vKWd7iGHUCMiI4";
    const user = {
        id: 10,
        uid: "UID-CMD-005",
        force_id: "DEF_004",
        regimental_number: "ARMY-2007-8005",
        email: "commander@forces.gov.in",
        full_name: "Brig. Santosh Babu",
        role: "COMMANDER",
        rank: "Brigadier / Formation Commander",
        unit: "16 Corps Command Division",
        branch: "Indian Army",
        employee_id: "CMD-009",
        avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
        is_active: true
    };
    localStorage.setItem("pswms_token", token);
    localStorage.setItem("pswms_user", JSON.stringify(user));
}"""

def capture_web_screenshots():
    print("--- STARTING WEB SCREENSHOTS GENERATION ---")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # 1920x1080 at 2x DPI for crisp 4K retina captures
        context = browser.new_context(
            viewport={"width": 1920, "height": 1080},
            device_scale_factor=2
        )
        page = context.new_page()

        # Initialize Auth
        page.goto(f"{BASE_URL}/login")
        page.evaluate(AUTH_JS)

        # -------------------------------------------------------------
        # 1. COMMANDER DASHBOARD & HOOK
        # -------------------------------------------------------------
        print("\n[1/5] Processing Commander Dashboard & Hook...")
        page.goto(f"{BASE_URL}/dashboard/commander")
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        # HOOK: Executive Command Center Overview
        hook_path = os.path.join(OUTPUT_DIR, "01_hook", "01_hook_command_center_overview.png")
        page.screenshot(path=hook_path, full_page=False)
        print(f"  ✓ Saved HOOK: {hook_path}")

        # Commander: Full Long Screenshot
        cmd_full_path = os.path.join(OUTPUT_DIR, "03_commander_web", "00_commander_dashboard_full_long.png")
        page.screenshot(path=cmd_full_path, full_page=True)
        print(f"  ✓ Saved Commander Full Long: {cmd_full_path}")

        # Commander: BORI (Battalion Operational Readiness Index)
        # Scroll to Formation Readiness Matrix
        page.evaluate("window.scrollTo(0, 1050)")
        time.sleep(1)
        bori_path = os.path.join(OUTPUT_DIR, "03_commander_web", "01_commander_bori_readiness_index.png")
        page.screenshot(path=bori_path, full_page=False)
        print(f"  ✓ Saved BORI Readiness Index: {bori_path}")

        # Commander: Silent High Performer Protection ⭐ (Risk Momentum & Stand-Down Swaps)
        page.evaluate("window.scrollTo(0, 450)")
        time.sleep(1)
        shp_path = os.path.join(OUTPUT_DIR, "03_commander_web", "06_commander_silent_high_performer_protection.png")
        page.screenshot(path=shp_path, full_page=False)
        print(f"  ✓ Saved Silent High Performer Protection: {shp_path}")

        # Commander: Explainable AI Recommendation ⭐
        page.evaluate("window.scrollTo(0, 2400)")
        time.sleep(1)
        xai_path = os.path.join(OUTPUT_DIR, "03_commander_web", "07_commander_explainable_ai_recommendation.png")
        page.screenshot(path=xai_path, full_page=False)
        print(f"  ✓ Saved Explainable AI Recommendation: {xai_path}")

        # ENDING: Consolidated Strategic Summary
        ending_path = os.path.join(OUTPUT_DIR, "05_ending", "01_ending_command_welfare_summary.png")
        page.evaluate("window.scrollTo(0, 0)")
        time.sleep(1)
        page.screenshot(path=ending_path, full_page=False)
        print(f"  ✓ Saved ENDING: {ending_path}")

        # -------------------------------------------------------------
        # 2. MISSION PLANNER (Mission Creation & AI Personnel Recommendation)
        # -------------------------------------------------------------
        print("\n[2/5] Processing Mission Planner...")
        page.goto(f"{BASE_URL}/mission-planner")
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        # Full long screenshot of Mission Planner
        mp_full_path = os.path.join(OUTPUT_DIR, "03_commander_web", "02_mission_planner_full_long.png")
        page.screenshot(path=mp_full_path, full_page=True)
        print(f"  ✓ Saved Mission Planner Full Long: {mp_full_path}")

        # Mission Creation Form (top section)
        page.evaluate("window.scrollTo(0, 0)")
        time.sleep(1)
        mc_path = os.path.join(OUTPUT_DIR, "03_commander_web", "02_commander_mission_creation.png")
        page.screenshot(path=mc_path, full_page=False)
        print(f"  ✓ Saved Mission Creation: {mc_path}")

        # AI Personnel Recommendation Engine ⭐ (scroll to candidate list)
        page.evaluate("window.scrollTo(0, 520)")
        time.sleep(1)
        rec_path = os.path.join(OUTPUT_DIR, "03_commander_web", "03_commander_ai_personnel_recommendation.png")
        page.screenshot(path=rec_path, full_page=False)
        print(f"  ✓ Saved AI Personnel Recommendation: {rec_path}")

        # -------------------------------------------------------------
        # 3. MISSION IMPACT SIMULATOR ⭐
        # -------------------------------------------------------------
        print("\n[3/5] Processing Mission Impact Simulator...")
        page.goto(f"{BASE_URL}/mission-impact")
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        mis_path = os.path.join(OUTPUT_DIR, "03_commander_web", "04_commander_mission_impact_simulator.png")
        page.screenshot(path=mis_path, full_page=True)
        print(f"  ✓ Saved Mission Impact Simulator: {mis_path}")

        # -------------------------------------------------------------
        # 4. DUTY FAIRNESS ENGINE ⭐ (Force Balancing)
        # -------------------------------------------------------------
        print("\n[4/5] Processing Duty Fairness Engine...")
        page.goto(f"{BASE_URL}/force-balancing")
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        dfe_path = os.path.join(OUTPUT_DIR, "03_commander_web", "05_commander_duty_fairness_engine.png")
        page.screenshot(path=dfe_path, full_page=True)
        print(f"  ✓ Saved Duty Fairness Engine: {dfe_path}")

        # -------------------------------------------------------------
        # 5. WELFARE OFFICER DASHBOARD
        # -------------------------------------------------------------
        print("\n[5/5] Processing Welfare Officer Dashboard...")
        page.goto(f"{BASE_URL}/dashboard/welfare")
        page.wait_for_load_state("networkidle")
        time.sleep(2)

        # Full long screenshot of Welfare Officer Dashboard
        welfare_full_path = os.path.join(OUTPUT_DIR, "04_welfare_officer_web", "00_welfare_dashboard_full_long.png")
        page.screenshot(path=welfare_full_path, full_page=True)
        print(f"  ✓ Saved Welfare Dashboard Full Long: {welfare_full_path}")

        # High-Risk Queue (Triage Table)
        page.evaluate("window.scrollTo(0, 0)")
        time.sleep(1)
        hrq_path = os.path.join(OUTPUT_DIR, "04_welfare_officer_web", "01_welfare_high_risk_queue.png")
        page.screenshot(path=hrq_path, full_page=False)
        print(f"  ✓ Saved High-Risk Queue: {hrq_path}")

        # Personnel Profile (Clinical dossier / profile of selected soldier)
        page.evaluate("window.scrollTo(0, 480)")
        time.sleep(1)
        prof_path = os.path.join(OUTPUT_DIR, "04_welfare_officer_web", "02_welfare_personnel_profile.png")
        page.screenshot(path=prof_path, full_page=False)
        print(f"  ✓ Saved Personnel Profile: {prof_path}")

        # AI Intervention Plan (Precision recommendations & clinical narrative)
        page.evaluate("window.scrollTo(0, 1150)")
        time.sleep(1)
        aip_path = os.path.join(OUTPUT_DIR, "04_welfare_officer_web", "03_welfare_ai_intervention_plan.png")
        page.screenshot(path=aip_path, full_page=False)
        print(f"  ✓ Saved AI Intervention Plan: {aip_path}")

        # Recovery Tracking (Closed-Loop Recovery Tracker)
        page.evaluate("window.scrollTo(0, 2050)")
        time.sleep(1)
        rec_trk_path = os.path.join(OUTPUT_DIR, "04_welfare_officer_web", "04_welfare_recovery_tracking.png")
        page.screenshot(path=rec_trk_path, full_page=False)
        print(f"  ✓ Saved Recovery Tracking: {rec_trk_path}")

        browser.close()
        print("\n--- ALL WEB SCREENSHOTS GENERATED SUCCESSFULLY ---")

if __name__ == "__main__":
    capture_web_screenshots()
