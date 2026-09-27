import os
import sys
import time
import glob
import subprocess
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3001"
OUTPUT_DIR = "/Users/asmohamedarfeen/Desktop/project/sih_webapp/recordings"
FFMPEG_PATH = "/opt/homebrew/bin/ffmpeg"

os.makedirs(OUTPUT_DIR, exist_ok=True)
RAW_DIR = os.path.join(OUTPUT_DIR, "raw")
os.makedirs(RAW_DIR, exist_ok=True)

# Commander auth token & payload
AUTH_PAYLOAD_JS = """
(() => {
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
  localStorage.setItem('pswms_token', token);
  localStorage.setItem('pswms_user', JSON.stringify(user));
})();
"""

CURSOR_INJECTION_JS = """
(() => {
  const initCursor = () => {
    if (document.getElementById('cinematic-cursor-root')) return;
    if (!document.body || !document.head) return;

    const style = document.createElement('style');
    style.id = 'cinematic-cursor-style';
    style.innerHTML = `
      #cinematic-cursor-root {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 2147483647;
        user-select: none;
        overflow: hidden;
      }
      #cinematic-cursor-pointer {
        position: absolute;
        top: 0;
        left: 0;
        width: 26px;
        height: 26px;
        transform: translate(-100px, -100px);
        transition: transform 0.65s cubic-bezier(0.25, 1, 0.35, 1);
        filter: drop-shadow(0 4px 8px rgba(0,0,0,0.5));
        pointer-events: none;
      }
      #cinematic-cursor-ring {
        position: absolute;
        top: 0;
        left: 0;
        width: 44px;
        height: 44px;
        margin-top: -22px;
        margin-left: -22px;
        border-radius: 50%;
        border: 2.5px solid rgba(212, 160, 23, 0.95);
        background: radial-gradient(circle, rgba(212, 160, 23, 0.35) 0%, rgba(212, 160, 23, 0) 70%);
        transform: scale(0);
        opacity: 0;
        transition: transform 0.45s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.45s ease-out;
        pointer-events: none;
      }
      #cinematic-cursor-ring.clicking {
        transform: scale(2.0);
        opacity: 1;
      }
    `;
    document.head.appendChild(style);

    const root = document.createElement('div');
    root.id = 'cinematic-cursor-root';
    root.innerHTML = `
      <div id="cinematic-cursor-pointer">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 2L18.5 16.5L12 17.5L8.5 22L4 2Z" fill="#0F172A" stroke="#FFFFFF" stroke-width="1.8" stroke-linejoin="round"/>
        </svg>
      </div>
      <div id="cinematic-cursor-ring"></div>
    `;
    document.body.appendChild(root);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCursor);
  } else {
    initCursor();
  }

  window.__cursorX = -100;
  window.__cursorY = -100;

  window.__cinematicCursor = {
    init: initCursor,
    moveTo: (x, y, durationMs = 600) => {
      initCursor();
      const el = document.getElementById('cinematic-cursor-pointer');
      if (!el) return;
      el.style.opacity = '1';
      el.style.transition = `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      el.style.transform = `translate(${x}px, ${y}px)`;
      window.__cursorX = x;
      window.__cursorY = y;
    },
    click: () => {
      initCursor();
      const ring = document.getElementById('cinematic-cursor-ring');
      if (!ring) return;
      ring.style.left = `${window.__cursorX}px`;
      ring.style.top = `${window.__cursorY}px`;
      ring.classList.add('clicking');
      setTimeout(() => {
        ring.classList.remove('clicking');
      }, 450);
    },
    hide: () => {
      initCursor();
      const el = document.getElementById('cinematic-cursor-pointer');
      if (el) el.style.opacity = '0';
    },
    show: () => {
      initCursor();
      const el = document.getElementById('cinematic-cursor-pointer');
      if (el) el.style.opacity = '1';
    }
  };
})();
"""

def setup_page(page, auth=True):
    page.add_init_script(CURSOR_INJECTION_JS)
    if auth:
        page.add_init_script(AUTH_PAYLOAD_JS)

def ensure_cursor_injected(page):
    page.evaluate(CURSOR_INJECTION_JS)

def move_cursor(page, x, y, duration_s=0.6, pause_after=0.2):
    page.evaluate(f"window.__cinematicCursor.moveTo({x}, {y}, {int(duration_s * 1000)})")
    time.sleep(duration_s + pause_after)

def move_to_element(page, selector, duration_s=0.6, pause_after=0.2):
    try:
        box = page.locator(selector).first.bounding_box()
        if box:
            cx = box['x'] + box['width'] / 2
            cy = box['y'] + box['height'] / 2
            move_cursor(page, cx, cy, duration_s, pause_after)
            return cx, cy
    except Exception as e:
        print(f"Warning: could not locate {selector}: {e}")
    return None

def click_element_cinematic(page, selector, duration_s=0.6, pause_before=0.3, pause_after=0.3):
    try:
        box = page.locator(selector).first.bounding_box()
        if box:
            cx = box['x'] + box['width'] / 2
            cy = box['y'] + box['height'] / 2
            move_cursor(page, cx, cy, duration_s, pause_before)
            page.evaluate("window.__cinematicCursor.click()")
            page.locator(selector).first.click()
            time.sleep(pause_after)
    except Exception as e:
        print(f"Warning: click failed on {selector}: {e}")

def smooth_scroll(page, target_y, duration_s=1.0):
    page.evaluate(f"""
        window.scrollTo({{
            top: {target_y},
            behavior: 'smooth'
        }});
    """)
    time.sleep(duration_s)

def smooth_scroll_container(page, container_selector, target_y, duration_s=1.0):
    page.evaluate(f"""
        const el = document.querySelector('div.overflow-y-auto') || document.querySelector('{container_selector}');
        if (el) el.scrollTo({{ top: {target_y}, behavior: 'smooth' }});
    """)
    time.sleep(duration_s)

def get_latest_webm(session_dir):
    files = glob.glob(os.path.join(session_dir, "*.webm"))
    if not files:
        raise RuntimeError(f"No webm found in {session_dir}")
    files.sort(key=os.path.getmtime, reverse=True)
    return files[0]

def convert_to_mp4(webm_path, mp4_name):
    final_mp4 = os.path.join(OUTPUT_DIR, mp4_name)
    root_mp4 = os.path.join("/Users/asmohamedarfeen/Desktop/project/sih_webapp", mp4_name)
    print(f"Encoding {mp4_name} to 1080p 60FPS...")
    cmd = [
        FFMPEG_PATH,
        "-y",
        "-i", webm_path,
        "-r", "60",
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "17",
        "-pix_fmt", "yuv420p",
        final_mp4
    ]
    subprocess.run(cmd, check=True)
    # Also copy to project root so both paths are immediately available
    subprocess.run(["cp", final_mp4, root_mp4], check=True)
    print(f"✓ Created: {final_mp4} & {root_mp4}")

# =============================================================================
# RECORDING SCRIPT FOR EACH SECTION
# =============================================================================

def record_section_1_hook(p):
    print("\n--- SECTION 1: Hook ---")
    session_dir = os.path.join(RAW_DIR, "01_hook")
    os.makedirs(session_dir, exist_ok=True)

    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=session_dir,
        record_video_size={"width": 1920, "height": 1080}
    )
    page = context.new_page()
    setup_page(page, auth=True)
    page.goto(f"{BASE_URL}/dashboard/commander")
    page.wait_for_load_state("networkidle")
    ensure_cursor_injected(page)
    time.sleep(1.0) # Pre-render settle

    # Keep cursor hidden/stationary initially
    page.evaluate("window.__cinematicCursor.hide()")
    
    # 1. Start with 1.0s still frame
    time.sleep(1.0)

    # Slowly reveal and pan attention across the military branding
    page.evaluate("window.__cinematicCursor.show()")
    move_cursor(page, 280, 32, duration_s=1.2, pause_after=0.4) # KAIZEN | AI Command Center
    move_cursor(page, 200, 160, duration_s=1.0, pause_after=0.5) # Formation Banner
    move_cursor(page, 960, 240, duration_s=1.0, pause_after=0.5) # Readiness 92% Indicator
    move_cursor(page, 1400, 240, duration_s=1.0, pause_after=0.4) # Strength 510
    
    # End with 1.0s still frame
    time.sleep(1.0)

    context.close()
    browser.close()
    convert_to_mp4(get_latest_webm(session_dir), "01_Hook.mp4")

def record_section_2_login(p):
    print("\n--- SECTION 2: Login ---")
    session_dir = os.path.join(RAW_DIR, "02_login")
    os.makedirs(session_dir, exist_ok=True)

    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=session_dir,
        record_video_size={"width": 1920, "height": 1080}
    )
    page = context.new_page()
    setup_page(page, auth=False) # Start unauthenticated
    page.goto(f"{BASE_URL}/login")
    page.wait_for_load_state("networkidle")
    ensure_cursor_injected(page)
    time.sleep(0.5)

    # 1. 1.0s initial still frame
    time.sleep(1.0)

    # Move cursor smoothly to email input
    email_box = page.locator("input[type='email']").bounding_box()
    if email_box:
        move_cursor(page, email_box['x'] + 50, email_box['y'] + 15, duration_s=0.7, pause_after=0.25)
        page.evaluate("window.__cinematicCursor.click()")
        page.locator("input[type='email']").click()
        time.sleep(0.15)
        
        # Natural typing
        email_str = "commander@forces.gov.in"
        for ch in email_str:
            page.keyboard.type(ch)
            time.sleep(0.045)
    
    time.sleep(0.2)

    # Move to password input
    pw_box = page.locator("input[type='password']").bounding_box()
    if pw_box:
        move_cursor(page, pw_box['x'] + 50, pw_box['y'] + 15, duration_s=0.5, pause_after=0.2)
        page.evaluate("window.__cinematicCursor.click()")
        page.locator("input[type='password']").click()
        time.sleep(0.15)
        
        pw_str = "commander123"
        for ch in pw_str:
            page.keyboard.type(ch)
            time.sleep(0.055)

    time.sleep(0.25)

    # Move to Authenticate & Access Command button
    btn_box = page.locator("button[type='submit']").bounding_box()
    if btn_box:
        move_cursor(page, btn_box['x'] + btn_box['width'] / 2, btn_box['y'] + btn_box['height'] / 2, duration_s=0.6, pause_after=0.3)
        page.evaluate("window.__cinematicCursor.click()")
        page.locator("button[type='submit']").click()

    # Wait until dashboard loads completely
    page.wait_for_url("**/dashboard/commander", timeout=8000)
    page.wait_for_load_state("networkidle")
    ensure_cursor_injected(page)

    # 1.0s still frame after loading
    time.sleep(1.0)

    context.close()
    browser.close()
    convert_to_mp4(get_latest_webm(session_dir), "02_Login.mp4")

def record_section_3_commander_dashboard(p):
    print("\n--- SECTION 3: Commander Dashboard ---")
    session_dir = os.path.join(RAW_DIR, "03_commander_dashboard")
    os.makedirs(session_dir, exist_ok=True)

    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=session_dir,
        record_video_size={"width": 1920, "height": 1080}
    )
    page = context.new_page()
    setup_page(page, auth=True)
    page.goto(f"{BASE_URL}/dashboard/commander")
    page.wait_for_load_state("networkidle")
    ensure_cursor_injected(page)
    time.sleep(0.8)

    # 1.0s initial still frame
    time.sleep(1.0)

    # Presenter-like cursor sweeping across key metrics
    move_cursor(page, 400, 220, duration_s=0.9, pause_after=0.6) # Overall Readiness 92%
    move_cursor(page, 720, 220, duration_s=0.8, pause_after=0.5) # Formation Strength 510
    move_cursor(page, 1050, 220, duration_s=0.8, pause_after=0.5) # Risk Tier High
    move_cursor(page, 1400, 220, duration_s=0.8, pause_after=0.6) # Key Concern

    # Hover over Trend graph & battalion charts
    move_cursor(page, 600, 420, duration_s=1.0, pause_after=0.8)
    move_cursor(page, 1200, 420, duration_s=1.0, pause_after=0.8)

    # Smooth scroll down to reveal flagged personnel list
    smooth_scroll(page, 620, duration_s=1.2)
    time.sleep(0.4)

    # Hover over Subedar R. N. Yadav card & momentum badge
    move_cursor(page, 500, 520, duration_s=0.9, pause_after=0.6)
    move_cursor(page, 950, 520, duration_s=0.7, pause_after=0.7) # Accelerating momentum

    # Smooth scroll down further to battalion companies & drilldown
    smooth_scroll(page, 950, duration_s=1.0)
    time.sleep(0.4)

    # Click battalion drilldown button or personnel profile
    btn = page.locator("text=Company Breakdown & Drilldown").first
    if btn.is_visible():
        box = btn.bounding_box()
        if box:
            move_cursor(page, box['x'] + box['width']/2, box['y'] + box['height']/2, duration_s=0.7, pause_after=0.4)
            page.evaluate("window.__cinematicCursor.click()")
            btn.click()
            time.sleep(1.2)
    else:
        time.sleep(1.5)

    # 1.0s still frame at end
    time.sleep(1.0)

    context.close()
    browser.close()
    convert_to_mp4(get_latest_webm(session_dir), "03_CommanderDashboard.mp4")

def record_section_4_personnel_profile(p):
    print("\n--- SECTION 4: Personnel Profile ---")
    session_dir = os.path.join(RAW_DIR, "04_personnel_profile")
    os.makedirs(session_dir, exist_ok=True)

    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=session_dir,
        record_video_size={"width": 1920, "height": 1080}
    )
    page = context.new_page()
    setup_page(page, auth=True)
    page.goto(f"{BASE_URL}/personnel")
    page.wait_for_load_state("networkidle")
    ensure_cursor_injected(page)
    time.sleep(0.8)

    # Open Havildar Ramesh Chand's dossier modal
    dossier_btn = page.locator("button:has-text('Dossier')").first
    dossier_btn.click()
    time.sleep(0.8) # Wait for modal animation

    # 1.0s still frame on opened profile
    time.sleep(1.0)

    # Hover over soldier identity & rank
    move_cursor(page, 820, 240, duration_s=0.8, pause_after=0.5)

    # Hover over 4 key metric cards: Medical SHAPE, Sleep Avg, Shift Days, Fatigue
    move_cursor(page, 720, 310, duration_s=0.7, pause_after=0.4)
    move_cursor(page, 880, 310, duration_s=0.6, pause_after=0.4)
    move_cursor(page, 1040, 310, duration_s=0.6, pause_after=0.4)
    move_cursor(page, 1200, 310, duration_s=0.6, pause_after=0.5)

    # Hover over 30-Day ML Risk Horizon
    move_cursor(page, 960, 420, duration_s=0.8, pause_after=0.6)
    
    # Hover across trajectory milestones
    move_cursor(page, 780, 510, duration_s=0.7, pause_after=0.4)
    move_cursor(page, 1140, 510, duration_s=0.7, pause_after=0.5)

    # Smooth scroll modal just enough to reveal remaining profile
    smooth_scroll_container(page, "div.overflow-y-auto", 340, duration_s=1.0)
    time.sleep(0.4)

    # Hover over Proactive Decision Support action
    move_cursor(page, 960, 680, duration_s=0.8, pause_after=0.8)

    # 1.0s still frame at end
    time.sleep(1.0)

    context.close()
    browser.close()
    convert_to_mp4(get_latest_webm(session_dir), "04_PersonnelProfile.mp4")

def record_section_5_privacy(p):
    print("\n--- SECTION 5: Privacy & Secure Processing ---")
    session_dir = os.path.join(RAW_DIR, "05_privacy")
    os.makedirs(session_dir, exist_ok=True)

    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=session_dir,
        record_video_size={"width": 1920, "height": 1080}
    )
    page = context.new_page()
    setup_page(page, auth=True)
    page.goto(f"{BASE_URL}/security")
    page.wait_for_load_state("networkidle")
    ensure_cursor_injected(page)
    time.sleep(0.8)

    # 1.0s still frame
    time.sleep(1.0)

    # Sweep across security header: AES-256-GCM, Differential Privacy, RBAC, Airgap
    move_cursor(page, 450, 160, duration_s=0.9, pause_after=0.5)
    move_cursor(page, 850, 260, duration_s=0.8, pause_after=0.4)

    # Step through Pipeline tabs: Step 4 (Anonymization)
    step_4 = page.locator("button:has-text('Anonymization')").first
    if step_4.is_visible():
        box = step_4.bounding_box()
        if box:
            move_cursor(page, box['x'] + box['width']/2, box['y'] + box['height']/2, duration_s=0.7, pause_after=0.3)
            page.evaluate("window.__cinematicCursor.click()")
            step_4.click()
            time.sleep(0.8)

    # Step 5 (Military Encryption)
    step_5 = page.locator("button:has-text('Encryption')").first
    if step_5.is_visible():
        box = step_5.bounding_box()
        if box:
            move_cursor(page, box['x'] + box['width']/2, box['y'] + box['height']/2, duration_s=0.6, pause_after=0.3)
            page.evaluate("window.__cinematicCursor.click()")
            step_5.click()
            time.sleep(0.8)

    # Smooth scroll to System Trust & Anti-Stigma Gauge
    smooth_scroll(page, 620, duration_s=1.0)
    time.sleep(0.4)

    # Hover over Voluntary Check-ins & Medical Airgap
    move_cursor(page, 520, 680, duration_s=0.7, pause_after=0.5)
    move_cursor(page, 1400, 680, duration_s=0.7, pause_after=0.6)

    # 1.0s still frame at end
    time.sleep(1.0)

    context.close()
    browser.close()
    convert_to_mp4(get_latest_webm(session_dir), "05_Privacy.mp4")

def record_section_6_ai_analysis(p):
    print("\n--- SECTION 6: AI Intelligence Engine ---")
    session_dir = os.path.join(RAW_DIR, "06_ai_analysis")
    os.makedirs(session_dir, exist_ok=True)

    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=session_dir,
        record_video_size={"width": 1920, "height": 1080}
    )
    page = context.new_page()
    setup_page(page, auth=True)
    page.goto(f"{BASE_URL}/ai-risk")
    page.wait_for_load_state("networkidle")
    ensure_cursor_injected(page)
    time.sleep(0.8)

    # 1.0s initial still frame
    time.sleep(1.0)

    # Hover over top AI diagnostic banner
    move_cursor(page, 500, 160, duration_s=0.8, pause_after=0.5)

    # Move to Biometric Simulator Sliders
    move_cursor(page, 480, 310, duration_s=0.8, pause_after=0.5) # Sleep Duration
    move_cursor(page, 480, 400, duration_s=0.6, pause_after=0.4) # Fatigue
    move_cursor(page, 480, 490, duration_s=0.6, pause_after=0.4) # Workload Pressure
    move_cursor(page, 480, 580, duration_s=0.6, pause_after=0.4) # Shifts

    # Click Re-compute AI Diagnostic button
    compute_btn = page.locator("button:has-text('Re-compute AI Diagnostic')").first
    box = compute_btn.bounding_box()
    if box:
        move_cursor(page, box['x'] + box['width']/2, box['y'] + box['height']/2, duration_s=0.7, pause_after=0.4)
        page.evaluate("window.__cinematicCursor.click()")
        compute_btn.click()
        time.sleep(1.2) # Allow diagnostic animation to finish

    # Move to Right Panel: Predicted Stress Index 86/100 & Burnout Probability
    move_cursor(page, 1200, 310, duration_s=0.8, pause_after=0.6)
    move_cursor(page, 1420, 310, duration_s=0.6, pause_after=0.6)

    # Hover over Primary Risk Drivers
    move_cursor(page, 1300, 420, duration_s=0.7, pause_after=0.6)

    # Hover over 30-Day ML Trajectory
    move_cursor(page, 1300, 560, duration_s=0.8, pause_after=0.8)

    # 1.0s still frame at end
    time.sleep(1.0)

    context.close()
    browser.close()
    convert_to_mp4(get_latest_webm(session_dir), "06_AIAnalysis.mp4")

def record_section_7_explainable_ai(p):
    print("\n--- SECTION 7: Explainable AI ---")
    session_dir = os.path.join(RAW_DIR, "07_explainable_ai")
    os.makedirs(session_dir, exist_ok=True)

    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=session_dir,
        record_video_size={"width": 1920, "height": 1080}
    )
    page = context.new_page()
    setup_page(page, auth=True)
    page.goto(f"{BASE_URL}/dashboard/welfare")
    page.wait_for_load_state("networkidle")
    ensure_cursor_injected(page)
    time.sleep(0.8)

    # Scroll directly to SHAP / Explainable AI section
    smooth_scroll(page, 1350, duration_s=1.0)
    time.sleep(0.5)

    # 1.0s initial still frame on SHAP card
    time.sleep(1.0)

    # Hover over SHAP Analysis badge
    move_cursor(page, 520, 350, duration_s=0.8, pause_after=0.5)

    # Hover across the contributing factor bars
    move_cursor(page, 380, 430, duration_s=0.7, pause_after=0.5) # Factor 1: High Impact
    move_cursor(page, 380, 490, duration_s=0.6, pause_after=0.5) # Factor 2: Medium Impact
    move_cursor(page, 380, 550, duration_s=0.6, pause_after=0.5) # Factor 3: Medium Impact

    # Move to Why AI Flagged accordion button
    why_btn = page.locator("button:has-text('Why AI flagged')").first
    if why_btn.is_visible():
        box = why_btn.bounding_box()
        if box:
            move_cursor(page, box['x'] + box['width']/2, box['y'] + box['height']/2, duration_s=0.7, pause_after=0.4)
            page.evaluate("window.__cinematicCursor.click()")
            why_btn.click()
            time.sleep(0.8)

    # Hover over expanded explanation points
    move_cursor(page, 380, 720, duration_s=0.7, pause_after=0.6)

    # Click on the top factor to open the deep-dive feature detail modal
    factor_el = page.locator("text=Continuous High-Altitude Watch Hours").first
    if factor_el.is_visible():
        box = factor_el.bounding_box()
        if box:
            move_cursor(page, box['x'] + 50, box['y'] + 10, duration_s=0.7, pause_after=0.4)
            page.evaluate("window.__cinematicCursor.click()")
            factor_el.click()
            time.sleep(1.2) # Feature modal opens

            # Hover over SHAP Framework Compliance
            move_cursor(page, 960, 520, duration_s=0.8, pause_after=0.8)

    # 1.0s still frame at end
    time.sleep(1.0)

    context.close()
    browser.close()
    convert_to_mp4(get_latest_webm(session_dir), "07_ExplainableAI.mp4")

def record_section_8_recommendations(p):
    print("\n--- SECTION 8: Recommendations ---")
    session_dir = os.path.join(RAW_DIR, "08_recommendations")
    os.makedirs(session_dir, exist_ok=True)

    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=session_dir,
        record_video_size={"width": 1920, "height": 1080}
    )
    page = context.new_page()
    setup_page(page, auth=True)
    page.goto(f"{BASE_URL}/dashboard/welfare")
    page.wait_for_load_state("networkidle")
    ensure_cursor_injected(page)
    time.sleep(0.8)

    # Scroll directly to WelfarePrecisionRecommendationsCard
    smooth_scroll(page, 850, duration_s=1.0)
    time.sleep(0.5)

    # 1.0s initial still frame
    time.sleep(1.0)

    # Hover over title: Welfare Precision Recommendations
    move_cursor(page, 520, 280, duration_s=0.8, pause_after=0.5)

    # Hover over Tier 1 - Immediate Clinical: Neuro-Psychosomatic Stabilisation
    move_cursor(page, 520, 420, duration_s=0.8, pause_after=0.6)
    # Hover over precision score (98.6%)
    move_cursor(page, 1400, 420, duration_s=0.7, pause_after=0.5)

    # Hover over action items: guided HRV breathing, restorative rest interval
    move_cursor(page, 650, 580, duration_s=0.8, pause_after=0.6)

    # Smooth scroll slightly to show Tier 2 and Tier 3
    smooth_scroll(page, 1150, duration_s=1.0)
    time.sleep(0.4)

    # Hover over Tier 2: Operational Watch Pacing & Tactical Roster Rebalance
    move_cursor(page, 650, 480, duration_s=0.7, pause_after=0.6)

    # Hover over Tier 3: Compassionate Leave Fast-Track & Family Support Connect
    move_cursor(page, 650, 620, duration_s=0.7, pause_after=0.8)

    # 1.0s still frame at end
    time.sleep(1.0)

    context.close()
    browser.close()
    convert_to_mp4(get_latest_webm(session_dir), "08_Recommendations.mp4")

def record_section_9_alerts(p):
    print("\n--- SECTION 9: Alerts ---")
    session_dir = os.path.join(RAW_DIR, "09_alerts")
    os.makedirs(session_dir, exist_ok=True)

    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=session_dir,
        record_video_size={"width": 1920, "height": 1080}
    )
    page = context.new_page()
    setup_page(page, auth=True)
    page.goto(f"{BASE_URL}/alerts")
    page.wait_for_load_state("networkidle")
    ensure_cursor_injected(page)
    time.sleep(0.8)

    # 1.0s initial still frame
    time.sleep(1.0)

    # Sweep across Tactical Alert Matrix banner
    move_cursor(page, 520, 160, duration_s=0.8, pause_after=0.5)

    # Hover over Critical Alert card: Subedar R. N. Yadav
    move_cursor(page, 480, 270, duration_s=0.8, pause_after=0.5)
    move_cursor(page, 620, 310, duration_s=0.7, pause_after=0.5) # Trigger reason & recommendation

    # Move cursor to Acknowledge button
    ack_btn = page.locator("button:has-text('Acknowledge')").first
    if ack_btn.is_visible():
        box = ack_btn.bounding_box()
        if box:
            move_cursor(page, box['x'] + box['width']/2, box['y'] + box['height']/2, duration_s=0.7, pause_after=0.4)
            page.evaluate("window.__cinematicCursor.click()")
            ack_btn.click()
            time.sleep(1.0) # Confirmed acknowledged with green badge

    # Move to the second high-risk alert
    move_cursor(page, 480, 410, duration_s=0.7, pause_after=0.7)

    # 1.0s still frame at end
    time.sleep(1.0)

    context.close()
    browser.close()
    convert_to_mp4(get_latest_webm(session_dir), "09_Alerts.mp4")

def record_section_10_recovery(p):
    print("\n--- SECTION 10: Recovery Tracking ---")
    session_dir = os.path.join(RAW_DIR, "10_recovery")
    os.makedirs(session_dir, exist_ok=True)

    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=session_dir,
        record_video_size={"width": 1920, "height": 1080}
    )
    page = context.new_page()
    setup_page(page, auth=True)
    page.goto(f"{BASE_URL}/dashboard/welfare")
    page.wait_for_load_state("networkidle")
    ensure_cursor_injected(page)
    time.sleep(0.8)

    # Scroll directly to ClosedLoopRecoveryTracker
    smooth_scroll(page, 450, duration_s=1.0)
    time.sleep(0.5)

    # 1.0s initial still frame
    time.sleep(1.0)

    # Hover over header: Longitudinal Recovery & Relapse Intelligence
    move_cursor(page, 1400, 340, duration_s=0.8, pause_after=0.5)
    move_cursor(page, 1600, 340, duration_s=0.6, pause_after=0.4) # Return-to-readiness 88.4%

    # Hover across the 4-Stage Post-Intervention Decompression Trajectory
    move_cursor(page, 1200, 430, duration_s=0.7, pause_after=0.5) # Day 0 -> Day 14
    move_cursor(page, 1550, 430, duration_s=0.7, pause_after=0.5) # Day 30 -> Day 60

    # Hover over Active Recovery Cohort Monitoring
    move_cursor(page, 1350, 560, duration_s=0.7, pause_after=0.6) # Pre/Post Score & Next Review

    # 1.0s still frame at end
    time.sleep(1.0)

    context.close()
    browser.close()
    convert_to_mp4(get_latest_webm(session_dir), "10_Recovery.mp4")

def record_section_11_end_screen(p):
    print("\n--- SECTION 11: Final Dashboard ---")
    session_dir = os.path.join(RAW_DIR, "11_endscreen")
    os.makedirs(session_dir, exist_ok=True)

    browser = p.chromium.launch(headless=True)
    context = browser.new_context(
        viewport={"width": 1920, "height": 1080},
        record_video_dir=session_dir,
        record_video_size={"width": 1920, "height": 1080}
    )
    page = context.new_page()
    setup_page(page, auth=True)
    page.goto(f"{BASE_URL}/dashboard/commander")
    page.wait_for_load_state("networkidle")
    ensure_cursor_injected(page)
    time.sleep(0.5)

    # Keep cursor completely hidden or stationary in executive bar
    page.evaluate("window.__cinematicCursor.hide()")

    # 4.0 seconds crisp, centered, still frame of the KAIZEN Commander Dashboard
    time.sleep(4.0)

    context.close()
    browser.close()
    convert_to_mp4(get_latest_webm(session_dir), "11_EndScreen.mp4")

def main():
    print("==================================================================")
    print("KAIZEN DEMO CINEMATOGRAPHER: RECORDING ALL 11 CLIPS")
    print("Resolution: 1920x1080 (Full HD) | Frame Rate: 60 FPS")
    print("==================================================================")

    tasks = [
        ("01_Hook.mp4", record_section_1_hook),
        ("02_Login.mp4", record_section_2_login),
        ("03_CommanderDashboard.mp4", record_section_3_commander_dashboard),
        ("04_PersonnelProfile.mp4", record_section_4_personnel_profile),
        ("05_Privacy.mp4", record_section_5_privacy),
        ("06_AIAnalysis.mp4", record_section_6_ai_analysis),
        ("07_ExplainableAI.mp4", record_section_7_explainable_ai),
        ("08_Recommendations.mp4", record_section_8_recommendations),
        ("09_Alerts.mp4", record_section_9_alerts),
        ("10_Recovery.mp4", record_section_10_recovery),
        ("11_EndScreen.mp4", record_section_11_end_screen),
    ]

    selected_indices = None
    force = "--force" in sys.argv
    args = [a for a in sys.argv[1:] if a != "--force"]

    if args:
        selected_indices = [int(a) - 1 for a in args if a.isdigit()]

    with sync_playwright() as p:
        for idx, (filename, func) in enumerate(tasks):
            if selected_indices is not None and idx not in selected_indices:
                continue

            target_path = os.path.join(OUTPUT_DIR, filename)
            if os.path.exists(target_path) and not force and selected_indices is None:
                print(f"\n[SKIP] {filename} already exists. Pass --force or section number to overwrite.")
                continue

            func(p)

    print("\n==================================================================")
    print("PROCESSING COMPLETED! CURRENT STATUS OF DELIVERABLES:")
    for filename, _ in tasks:
        target_path = os.path.join(OUTPUT_DIR, filename)
        status = "✓ READY" if os.path.exists(target_path) else "✗ MISSING"
        print(f"  {status} -> {filename}")
    print("==================================================================")

if __name__ == "__main__":
    main()
