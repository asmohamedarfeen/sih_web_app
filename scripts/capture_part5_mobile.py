import os
import time
import subprocess
import cv2
import numpy as np
from PIL import Image

OUTPUT_DIR = "/Users/asmohamedarfeen/Desktop/project/sih_webapp/screenshots/part5/02_soldier_mobile"
os.makedirs(OUTPUT_DIR, exist_ok=True)

def adb(cmd):
    full_cmd = f"adb {cmd}"
    res = subprocess.run(full_cmd, shell=True, capture_output=True, text=True)
    return res.stdout.strip()

def screencap(path):
    cmd = f"adb exec-out screencap -p > '{path}'"
    subprocess.run(cmd, shell=True, check=True)

def swipe(x1, y1, x2, y2, duration_ms=350):
    adb(f"shell input swipe {x1} {y1} {x2} {y2} {duration_ms}")
    time.sleep(0.8)

def tap(x, y):
    adb(f"shell input tap {x} {y}")
    time.sleep(0.8)

def scroll_to_top():
    print("Resetting to top of dashboard...")
    for _ in range(6):
        adb("shell input swipe 540 600 540 2100 150")
        time.sleep(0.2)
    time.sleep(1.0)

def capture_focused_sections():
    print("\n--- CAPTURING FOCUSED MOBILE SECTIONS ---")

    # 1. Back to Dashboard & top
    tap(135, 2300) # Tap Dashboard tab
    scroll_to_top()

    # Section: AI Wellness Score (top view)
    ai_score_path = os.path.join(OUTPUT_DIR, "02_soldier_ai_wellness_score.png")
    screencap(ai_score_path)
    print(f"  ✓ Saved AI Wellness Score: {ai_score_path}")

    # Section: Today's Summary
    swipe(540, 1600, 540, 800, 300)
    summary_path = os.path.join(OUTPUT_DIR, "03_soldier_todays_summary.png")
    screencap(summary_path)
    print(f"  ✓ Saved Today's Summary: {summary_path}")

    # Section: Wellness Coach & Tactical Box Breathing
    swipe(540, 1700, 540, 700, 300)
    coach_path = os.path.join(OUTPUT_DIR, "04_soldier_wellness_coach.png")
    screencap(coach_path)
    print(f"  ✓ Saved Wellness Coach: {coach_path}")

    # Section: Wellness Timeline (Weekly Trend & Mood Timeline)
    swipe(540, 1800, 540, 700, 300)
    timeline_path = os.path.join(OUTPUT_DIR, "06_soldier_wellness_timeline.png")
    screencap(timeline_path)
    print(f"  ✓ Saved Wellness Timeline: {timeline_path}")

    # Section: Self Assessment (Check-in assessment screen)
    print("\nNavigating to Self Assessment (Check-in)...")
    tap(405, 2300) # Tap Check-in tab
    time.sleep(1.2)
    self_assess_path = os.path.join(OUTPUT_DIR, "05_soldier_self_assessment.png")
    screencap(self_assess_path)
    print(f"  ✓ Saved Self Assessment: {self_assess_path}")

    # Return to Dashboard tab
    tap(135, 2300)
    time.sleep(1.0)

def capture_and_stitch_full_dashboard():
    print("\n--- GENERATING FULL STITCHED LONG SCREENSHOT OF SOLDIER DASHBOARD ---")
    scroll_to_top()

    raw_frames = []
    temp_dir = "/tmp/mobile_stitch_frames"
    os.makedirs(temp_dir, exist_ok=True)

    # Header top bound and footer bottom bound
    # Top bar is y=0 to 220
    # Bottom bar is y=2180 to 2400
    HEADER_H = 220
    FOOTER_H = 220
    CONTENT_TOP = 220
    CONTENT_BOTTOM = 2400 - FOOTER_H

    # Capture sequence of scrolling frames
    print("Capturing scroll progression...")
    for idx in range(8):
        frame_path = os.path.join(temp_dir, f"frame_{idx}.png")
        screencap(frame_path)
        img = cv2.imread(frame_path)
        raw_frames.append(img)
        print(f"  Captured frame {idx}")
        # Scroll down
        swipe(540, 1800, 540, 800, 400)

    # Stitching algorithm using template matching in content area
    print("Stitching frames seamlessly...")
    header_crop = raw_frames[0][:CONTENT_TOP, :]
    footer_crop = raw_frames[-1][CONTENT_BOTTOM:, :]

    # We start with the content area of frame 0
    stitched_content = raw_frames[0][CONTENT_TOP:CONTENT_BOTTOM, :]

    for i in range(1, len(raw_frames)):
        curr_frame = raw_frames[i]
        curr_content = curr_frame[CONTENT_TOP:CONTENT_BOTTOM, :]

        # Take template from top portion of curr_content (e.g. height 150px)
        template_h = 160
        template = curr_content[40:40+template_h, 80:-80]

        # Match template in the lower half of stitched_content
        search_region = stitched_content[-1600:, 80:-80]
        res = cv2.matchTemplate(search_region, template, cv2.TM_CCOEFF_NORMED)
        min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)

        if max_val > 0.65:
            # Overlap found!
            # The match y in stitched_content:
            overlap_y_in_search = max_loc[1]
            overlap_y_in_stitched = (stitched_content.shape[0] - 1600) + overlap_y_in_search
            # In curr_content, the template started at y=40
            cut_in_curr = 40 + template_h
            cut_in_stitched = overlap_y_in_stitched + template_h

            # Append the non-overlapping portion of curr_content
            new_part = curr_content[cut_in_curr:, :]
            stitched_content = np.vstack([stitched_content[:cut_in_stitched, :], new_part])
            print(f"  Merged frame {i} with match confidence {max_val:.3f}")
        else:
            print(f"  Warning: Lower match confidence {max_val:.3f} for frame {i}, blending standard offset")
            # If template match fails (e.g. end of scroll reached), skip or add remainder
            continue

    # Assemble final image: Header + Full Stitched Content + Footer
    final_full_image = np.vstack([header_crop, stitched_content, footer_crop])

    long_dash_path = os.path.join(OUTPUT_DIR, "01_soldier_dashboard_full_long.png")
    cv2.imwrite(long_dash_path, final_full_image)
    print(f"  ✓ Saved Full Stitched Long Mobile Screenshot ({final_full_image.shape[1]}x{final_full_image.shape[0]}): {long_dash_path}")

    # Return to top
    scroll_to_top()

if __name__ == "__main__":
    capture_focused_sections()
    capture_and_stitch_full_dashboard()
    print("\n--- ALL MOBILE SCREENSHOTS CAPTURED SUCCESSFULLY ---")
