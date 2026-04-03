import pyautogui
import time
import os
import ctypes
import json

class BotEngine:
    def __init__(self, script_dir):
        self.script_dir = script_dir
        self.confidence = 0.85
        self.action_delay = 0.4
        self.stop_requested = False
        
        # Calibration Offsets (Global)
        self.offset_x = 0
        self.offset_y = 0
        self.ignore_left = 260 # Ignore anything in the left 260px (TSO Notifications)
        
        # UI Elements
        self.UI_STAR = "gwiazda.png"
        self.UI_X = "ikona_x_zamknij.png"
        self.UI_PIN_OFF = "pinezka.png"
        self.UI_PIN_ON = "pinezka_on.png"
        self.UI_EKIPA = "ekipa.png"

        # TSO-style "FailSafe": corner of the screen
        pyautogui.FAILSAFE = True
        pyautogui.PAUSE = 0.01 
        
        # DPI Awareness for Windows (helps with coordinate calculation)
        try:
            import ctypes
            ctypes.windll.shcore.SetProcessDpiAwareness(1)
        except Exception:
            pass

    def set_offsets(self, x, y):
        """Updates global calibration offsets from UI."""
        self.offset_x = int(x)
        self.offset_y = int(y)

    def set_ignore_left(self, val):
        """Updates the left-side dead zone (to avoid notifications)."""
        self.ignore_left = int(val)

    def check_failsafe(self):
        """Checks if STOP was requested via UI or ESC key."""
        if self.stop_requested: return True
        # ESC Key (0x1B) check via User32
        import ctypes
        if ctypes.windll.user32.GetAsyncKeyState(0x1B) & 0x8000:
            self.stop_requested = True
            return True
        return False

    def sleep_with_failsafe(self, duration):
        """Responsive sleep that checks for ESC/Stop flag every 50ms."""
        start = time.time()
        while time.time() - start < duration:
            if self.check_failsafe(): break
            time.sleep(0.05)

    def _opencv_locate(self, needle_path, haystack_img, confidence=0.75):
        """Ultra-fast search for needle in pre-captured haystack image."""
        try:
            import cv2
            import numpy as np
            # Standard load as grayscale
            needle = cv2.imread(needle_path, cv2.IMREAD_GRAYSCALE)
            if needle is None: return None, 0.0
            
            # Haystack is RGB from pyautogui, convert correctly
            res = cv2.matchTemplate(haystack_img, needle, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, max_loc = cv2.minMaxLoc(res)
            
            if max_val >= confidence:
                h, w = needle.shape
                center_x = max_loc[0] + w // 2
                center_y = max_loc[1] + h // 2
                from collections import namedtuple
                Point = namedtuple('Point', ['x', 'y'])
                return Point(center_x, center_y), max_val
            return None, max_val
        except:
            return None, 0.0

    def stable_click(self, x, y, drag_protection=0.15, on_status=None):
        """Moves to (x,y), waits for UI stability, then clicks without drift."""
        # Ensure coordinates are integers
        x, y = int(x), int(y)
        
        # 1. Move to target
        pyautogui.moveTo(x, y, duration=0.1)
        
        # 2. Wait for UI/Hover effect to stabilize
        self.sleep_with_failsafe(drag_protection)
        
        # 3. Click with specific coordinate lock
        pyautogui.mouseDown(x=x, y=y)
        self.sleep_with_failsafe(0.2) # Key: wait while button is Down
        pyautogui.mouseUp(x=x, y=y)
        
        # 4. Small relief move to avoid tooltip blocking
        pyautogui.moveRel(30, 30, duration=0.1)
        self.sleep_with_failsafe(0.1)

    def find_and_click(self, image_name, timeout=5, offset_x=0, offset_y=0, on_status=None):
        """Ultra-fast search & click with 50px Edge Quarantine and persistent ESC."""
        if on_status: on_status(f"Szukam: {image_name}...")
        
        full_path = os.path.join(self.script_dir, image_name)
        if not os.path.exists(full_path):
            if on_status: on_status(f"Błąd: Brak pliku {image_name}")
            return False

        start_time = time.time()
        while time.time() - start_time < timeout:
            if self.check_failsafe(): return False
            
            import cv2
            import numpy as np
            # Capture as RGB, convert to Gray for OpenCV
            haystack_img = cv2.cvtColor(np.array(pyautogui.screenshot()), cv2.COLOR_RGB2GRAY)
            
            # Confidence levels - STOP at 0.70 to avoid false matches on dummy squares
            for conf in [0.82, 0.75, 0.70]: 
                pos, score = self._opencv_locate(full_path, haystack_img, confidence=conf)
                if pos:
                    # Filter out matches in the "Dead Zone" (Left 260px)
                    if pos.x < self.ignore_left:
                        if on_status: on_status(f"Pominięto (Strefa Powiadomień): {image_name}")
                        continue
                        
                    screen_w, screen_h = pyautogui.size()
                    if 50 <= pos.x < screen_w - 50 and 50 <= pos.y < screen_h - 50:
                        final_x = pos.x + offset_x + self.offset_x
                        final_y = pos.y + offset_y + self.offset_y
                        
                        if on_status: on_status(f"Klikam: {image_name} na ({final_x}, {final_y})")
                        
                        self.stable_click(final_x, final_y, on_status=on_status)
                        return pos
                    else:
                        if on_status: on_status(f"Marsz: ({pos.x}, {pos.y}) - POMINIĘTO")
            
            if on_status:
                _, best_score = self._opencv_locate(full_path, haystack_img, confidence=0.0)
                on_status(f"Szukam: {image_name} ({int(best_score*100)}%)")
            
            self.sleep_with_failsafe(0.5)
            
        return False

    def scroll_menu(self, star_pos):
        target_y = max(50, star_pos.y - 150)
        pyautogui.moveTo(star_pos.x, target_y, duration=0.2)
        for _ in range(4):
            if self.check_failsafe(): break
            pyautogui.scroll(-500)
            self.sleep_with_failsafe(0.05)
        self.sleep_with_failsafe(0.5)

    def scroll_top(self, star_pos):
        if not star_pos: return
        target_y = max(100, star_pos.y - 150)
        if star_pos.x == 0 and star_pos.y == 0: return
        
        pyautogui.moveTo(star_pos.x, target_y, duration=0.2)
        for _ in range(12): 
            if self.check_failsafe(): break
            pyautogui.scroll(600)
            self.sleep_with_failsafe(0.02)
        self.sleep_with_failsafe(0.5)

    def scan_for_explorer(self, explorer_files, on_status=None):
        """POOL SCAN: Searches for ANY of the provided files in one pass."""
        if on_status: on_status("Skanowanie listy...")
        
        import numpy as np
        import cv2
        haystack_img = cv2.cvtColor(np.array(pyautogui.screenshot()), cv2.COLOR_RGB2GRAY)
        
        best_match = {"score": 0.0, "file": ""}
        conf_levels = [0.80, 0.72] # Slightly lowered to be more liberal but still safe
        
        for conf in conf_levels:
            for plik in explorer_files:
                if self.check_failsafe(): return None
                full_path = os.path.join(self.script_dir, plik)
                if not os.path.exists(full_path): continue
                
                pos, score = self._opencv_locate(full_path, haystack_img, confidence=conf)
                if pos:
                    # Filter out matches in the "Dead Zone" (Left 260px)
                    if pos.x < self.ignore_left:
                        continue
                        
                    screen_w, screen_h = pyautogui.size()
                    if 50 <= pos.x < screen_w - 50 and 50 <= pos.y < screen_h - 50:
                        final_x = pos.x + self.offset_x
                        final_y = pos.y + self.offset_y
                        
                        if on_status: on_status(f"Wybieram: {plik}")
                        self.stable_click(final_x, final_y, on_status=on_status)
                        
                        self.last_explorer_pos = pos
                        self.sleep_with_failsafe(1.2) # Wait for menu recovery
                        return plik, pos
                
                if score > best_match["score"]:
                    best_match = {"score": score, "file": plik}
        
        if on_status and best_match["score"] > 0.4:
            on_status(f"Najbliższy: {best_match['file']} ({int(best_match['score']*100)}%)")
            
        return None

    def execute_task_cycle(self, explorer_files, task_steps, star_pos, on_status=None, retried_top=False):
        max_scrolls = 15
        found = None
        self.last_explorer_pos = None
        
        for i in range(max_scrolls):
            if self.check_failsafe(): break
            found = self.scan_for_explorer(explorer_files, on_status)
            if found: break
            if on_status: on_status(f"Przewijam ({i+1}/{max_scrolls})...")
            self.scroll_menu(star_pos)

        if not found and not retried_top and not self.check_failsafe():
            if on_status: on_status("Brak wyników. Wracam na górę...")
            self.scroll_top(star_pos)
            return self.execute_task_cycle(explorer_files, task_steps, star_pos, on_status, retried_top=True)

        if not found or self.check_failsafe():
            return False

        self.sleep_with_failsafe(0.5)

        for step in task_steps:
            if self.check_failsafe(): break
            if not self.find_and_click(step, timeout=3, on_status=on_status):
                if on_status: on_status(f"Przewijam listę zadań...")
                
                if self.last_explorer_pos:
                    pyautogui.moveTo(self.last_explorer_pos.x, self.last_explorer_pos.y, duration=0.2)
                else:
                    screen_w, screen_h = pyautogui.size()
                    pyautogui.moveTo(screen_w // 2, screen_h // 2, duration=0.2)
                
                for _ in range(3):
                    if self.check_failsafe(): break
                    pyautogui.scroll(-500)
                    self.sleep_with_failsafe(0.1)
                
                if not self.find_and_click(step, timeout=5, on_status=on_status):
                    if on_status: on_status(f"Błąd kroku: {step}.")
                    return True 
        
        return True

    def run_bot(self, config, on_progress=None, on_status=None):
        if on_status: on_status("Bot startuje...")
        if self.check_failsafe(): return "Zatrzymano (ESC)"
        
        star_pos = self.find_and_click(self.UI_STAR, timeout=10, on_status=on_status)
        if not star_pos:
            return "Nie znaleziono Menu Gwiazdy"

        if not self.find_and_click(self.UI_PIN_OFF, timeout=1, on_status=on_status):
            if self.check_failsafe(): return "Zatrzymano (ESC)"

        if not self.find_and_click(self.UI_EKIPA, timeout=2, on_status=on_status):
            return "Nie znaleziono zakładki Ekipa. Czy Menu Gwiazdy jest otwarte?"
            
        self.sleep_with_failsafe(0.5)
        self.scroll_top(star_pos)

        count = 0
        while count < config.get("max_count", 999):
            if self.stop_requested: break
            success = self.execute_task_cycle(config["explorers"], config["task_steps"], star_pos, on_status=on_status)
            if not success:
                break
            count += 1
            if on_progress:
                on_progress(count)
            self.sleep_with_failsafe(2.5) # Server lag buffer
            
        return f"Wysłano {count} odkrywców."

    def stop(self):
        self.stop_requested = True
