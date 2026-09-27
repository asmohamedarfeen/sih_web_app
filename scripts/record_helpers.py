import os
import time
import subprocess
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:3001"
OUTPUT_DIR = "/Users/asmohamedarfeen/Desktop/project/sih_webapp/recordings"
FFMPEG_PATH = "/opt/homebrew/bin/ffmpeg"

os.makedirs(OUTPUT_DIR, exist_ok=True)
os.makedirs(os.path.join(OUTPUT_DIR, "raw"), exist_ok=True)

CURSOR_INJECTION_JS = """
(() => {
  if (document.getElementById('cinematic-cursor-root')) return;

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
      width: 28px;
      height: 28px;
      transform: translate(-100px, -100px);
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.35, 1);
      filter: drop-shadow(0 3px 6px rgba(0,0,0,0.45));
      pointer-events: none;
    }
    #cinematic-cursor-ring {
      position: absolute;
      top: 0;
      left: 0;
      width: 40px;
      height: 40px;
      margin-top: -20px;
      margin-left: -20px;
      border-radius: 50%;
      border: 2.5px solid rgba(212, 160, 23, 0.95);
      background: radial-gradient(circle, rgba(212, 160, 23, 0.35) 0%, rgba(212, 160, 23, 0) 70%);
      transform: scale(0);
      opacity: 0;
      transition: transform 0.45s cubic-bezier(0.1, 0.9, 0.2, 1), opacity 0.45s ease-out;
      pointer-events: none;
    }
    #cinematic-cursor-ring.clicking {
      transform: scale(1.8);
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

  window.__cursorX = -100;
  window.__cursorY = -100;

  window.__cinematicCursor = {
    moveTo: (x, y, durationMs = 600) => {
      const el = document.getElementById('cinematic-cursor-pointer');
      if (!el) return;
      el.style.transition = `transform ${durationMs}ms cubic-bezier(0.22, 1, 0.36, 1)`;
      el.style.transform = `translate(${x}px, ${y}px)`;
      window.__cursorX = x;
      window.__cursorY = y;
    },
    click: () => {
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
      const el = document.getElementById('cinematic-cursor-pointer');
      if (el) el.style.opacity = '0';
    },
    show: () => {
      const el = document.getElementById('cinematic-cursor-pointer');
      if (el) el.style.opacity = '1';
    }
  };
})();
"""

def setup_page_cursor(page):
    page.add_init_script(CURSOR_INJECTION_JS)

def move_cursor(page, x, y, duration_s=0.6, pause_after=0.2):
    page.evaluate(f"window.__cinematicCursor.moveTo({x}, {y}, {int(duration_s * 1000)})")
    time.sleep(duration_s + pause_after)

def move_to_element(page, selector, duration_s=0.6, pause_after=0.2):
    box = page.locator(selector).first.bounding_box()
    if box:
        cx = box['x'] + box['width'] / 2
        cy = box['y'] + box['height'] / 2
        move_cursor(page, cx, cy, duration_s, pause_after)
        return cx, cy
    return None

def click_element_cinematic(page, selector, duration_s=0.6, pause_before=0.3, pause_after=0.3):
    box = page.locator(selector).first.bounding_box()
    if box:
        cx = box['x'] + box['width'] / 2
        cy = box['y'] + box['height'] / 2
        move_cursor(page, cx, cy, duration_s, pause_before)
        page.evaluate("window.__cinematicCursor.click()")
        page.locator(selector).first.click()
        time.sleep(pause_after)

def type_natural(page, selector, text, delay=0.08):
    for char in text:
        page.locator(selector).press_sequentially(char, delay=int(delay * 1000))
        time.sleep(delay)

def convert_to_mp4(webm_path, mp4_path):
    print(f"Converting {webm_path} -> {mp4_path} at 60 FPS...")
    cmd = [
        FFMPEG_PATH,
        "-y",
        "-i", webm_path,
        "-r", "60",
        "-c:v", "libx264",
        "-preset", "slow",
        "-crf", "17",
        "-pix_fmt", "yuv420p",
        mp4_path
    ]
    subprocess.run(cmd, check=True)
    print(f"Saved: {mp4_path}")

print("Cinematic recorder helper module ready.")
