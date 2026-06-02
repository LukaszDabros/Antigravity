import os
import cv2
import numpy as np
import pyautogui
from collections import namedtuple

# Keep resolution awareness
try:
    import ctypes
    ctypes.windll.shcore.SetProcessDpiAwareness(1)
except Exception:
    pass

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def _opencv_locate(needle_path, haystack_img, confidence=0.75):
    try:
        needle = cv2.imread(needle_path, cv2.IMREAD_GRAYSCALE)
        if needle is None:
            return None, 0.0
        
        res = cv2.matchTemplate(haystack_img, needle, cv2.TM_CCOEFF_NORMED)
        _, max_val, _, max_loc = cv2.minMaxLoc(res)
        
        if max_val >= confidence:
            h, w = needle.shape
            center_x = max_loc[0] + w // 2
            center_y = max_loc[1] + h // 2
            Point = namedtuple('Point', ['x', 'y'])
            return Point(center_x, center_y), max_val
        return None, max_val
    except Exception as e:
        print(f"Error in locate: {e}")
        return None, 0.0

def test():
    print("=== TSO Auto-Clicker Debug Test ===")
    
    # 1. Take screenshot
    try:
        screen = pyautogui.screenshot()
        haystack = cv2.cvtColor(np.array(screen), cv2.COLOR_RGB2GRAY)
        print(f"Screenshot taken successfully. Resolution: {screen.size}")
    except Exception as e:
        print(f"Failed to capture screenshot: {e}")
        return

    # 2. Check UI elements
    ui_elements = ["gwiazda.png", "ekipa.png", "pinezka.png", "wyslij_zielony.png"]
    print("\n--- Testing UI Elements ---")
    for ui in ui_elements:
        full_path = os.path.join(SCRIPT_DIR, ui)
        exists = os.path.exists(full_path)
        print(f"File '{ui}': {'Exists' if exists else 'MISSING'}")
        if exists:
            pos, val = _opencv_locate(full_path, haystack, confidence=0.0)
            print(f"  Best match score: {val:.4f} (at {pos.x if pos else 'None'}, {pos.y if pos else 'None'})")

    # 3. Check some explorer files
    explorers = ["zwykly_odkrywca.png", "doswiadczony_odkrywca.png", "zoe_odkrywca.png", "mumia_geolog.png", "zwykly_geolog.png"]
    print("\n--- Testing Select Specialists ---")
    for exp in explorers:
        full_path = os.path.join(SCRIPT_DIR, exp)
        exists = os.path.exists(full_path)
        if exists:
            size = os.path.getsize(full_path)
            print(f"File '{exp}': Size {size} bytes")
            pos, val = _opencv_locate(full_path, haystack, confidence=0.0)
            print(f"  Best match score: {val:.4f}")
        else:
            print(f"File '{exp}': MISSING")

if __name__ == "__main__":
    test()
