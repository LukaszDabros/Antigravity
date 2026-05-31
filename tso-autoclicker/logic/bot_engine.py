import pyautogui
import time
import os
import ctypes
import json
import cv2
import numpy as np

class BotEngine:
    def __init__(self, script_dir):
        self.script_dir = script_dir
        self.confidence = 0.85
        self.action_delay = 0.4
        self.stop_requested = False
        
        # Calibration Offsets (Global)
        self.offset_x = 0
        self.offset_y = 0
        self.ignore_left = 0   # Default: no ignore zone (replaces hardcoded 260px which blocked Star Menu)
        self.lag_buffer = 0.5   # Configurable lag buffer (s) - optimized thanks to click_history tracking
        
        # UI Elements
        self.UI_STAR = "gwiazda.png"
        self.UI_X = "ikona_x_zamknij.png"
        self.UI_PIN_OFF = "pinezka.png"
        self.UI_PIN_ON = "pinezka_on.png"
        self.UI_EKIPA = "ekipa.png"
        
        self.click_history = [] # List of (x, y, timestamp)
        self.blacklisted_coords = [] # List of (x, y) for specialists who failed to dispatch in this session
        self.scroll_step_y = 140 # Typical vertical scroll distance in pixels for TSO Star Menu scroll
        self.turbo_mode = False

        # TSO-style "FailSafe": corner of the screen
        pyautogui.FAILSAFE = True
        pyautogui.PAUSE = 0.01 
        
        # DPI Awareness removed to align with Windows logical coordinates (fixing offset clicks)
        pass

    def set_offsets(self, x, y):
        """Updates global calibration offsets from UI."""
        self.offset_x = int(x)
        self.offset_y = int(y)

    def set_ignore_left(self, val):
        """Updates the left-side dead zone (to avoid notifications)."""
        self.ignore_left = int(val)

    def set_lag_buffer(self, val):
        """Updates the server lag buffer from UI."""
        self.lag_buffer = float(val)

    def set_turbo_mode(self, enabled):
        """Toggles Turbo Mode (batch dispatch without lag wait)."""
        self.turbo_mode = bool(enabled)
        if not enabled: self.click_history = []

    def is_recently_clicked(self, x, y, radius_x=25, radius_y=70, duration=10):
        """Checks if (x,y) was clicked recently, with tolerance for vertical scrolling."""
        import time
        now = time.time()
        # Clean up old history
        self.click_history = [h for h in self.click_history if now - h[2] < duration]
        
        for h_x, h_y, h_time in self.click_history:
            if abs(x - h_x) < radius_x and abs(y - h_y) < radius_y:
                return True
        return False

    def is_blacklisted(self, x, y, radius_x=25, radius_y=70):
        """Checks if (x,y) is close to any coordinate in the session blacklist with custom grid tolerance."""
        for bx, by in self.blacklisted_coords:
            if abs(x - bx) < radius_x and abs(y - by) < radius_y:
                return True
        return False

    def shift_blacklist(self, delta_y):
        """Shifts all blacklisted coordinates vertically to track screen scrolling."""
        updated = []
        for bx, by in self.blacklisted_coords:
            updated.append((bx, by + delta_y))
        self.blacklisted_coords = updated
        
        # Also shift click history to keep recently clicked items aligned
        updated_history = []
        for h_x, h_y, h_time in self.click_history:
            updated_history.append((h_x, h_y + delta_y, h_time))
        self.click_history = updated_history

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

    def _opencv_locate_all(self, needle_path, haystack_img, confidence=0.75):
        """Returns ALL unique matches found in the haystack."""
        try:
            import cv2
            import numpy as np
            if not hasattr(self, 'templates'):
                self.templates = {}
            if needle_path not in self.templates:
                needle = cv2.imread(needle_path, cv2.IMREAD_COLOR)
                if needle is None: return []
                self.templates[needle_path] = needle
            else:
                needle = self.templates[needle_path]
            
            h, w = needle.shape[:2]
            res = cv2.matchTemplate(haystack_img, needle, cv2.TM_CCOEFF_NORMED)
            loc = np.where(res >= confidence)
            
            # Guard against massive false-positives (flat dummy templates matching flat backgrounds)
            if len(loc[0]) > 1000:
                return []
            
            points = []
            for pt in zip(*loc[::-1]): # switch x, y
                center_x = pt[0] + w // 2
                center_y = pt[1] + h // 2
                # Deduplicate close points (radius 20)
                if not any(abs(center_x - p[0]) < 20 and abs(center_y - p[1]) < 20 for p in points):
                    points.append((center_x, center_y))
            return points
        except:
            return []

    def _opencv_locate(self, needle_path, haystack_img, confidence=0.75):
        """Ultra-fast search for needle in pre-captured haystack image."""
        try:
            import cv2
            import numpy as np
            if not hasattr(self, 'templates'):
                self.templates = {}
            if needle_path not in self.templates:
                needle = cv2.imread(needle_path, cv2.IMREAD_COLOR)
                if needle is None: return None, 0.0
                self.templates[needle_path] = needle
            else:
                needle = self.templates[needle_path]
            
            # Haystack is RGB from pyautogui, convert correctly
            res = cv2.matchTemplate(haystack_img, needle, cv2.TM_CCOEFF_NORMED)
            _, max_val, _, max_loc = cv2.minMaxLoc(res)
            
            if max_val >= confidence:
                h, w = needle.shape[:2]
                center_x = max_loc[0] + w // 2
                center_y = max_loc[1] + h // 2
                from collections import namedtuple
                Point = namedtuple('Point', ['x', 'y'])
                return Point(center_x, center_y), max_val
            return None, max_val
        except:
            return None, 0.0

    def stable_click(self, x, y, drag_protection=0.08, on_status=None, relief_move=False):
        """Moves to (x,y), waits for UI stability, then clicks without drift."""
        # Ensure coordinates are integers
        x, y = int(x), int(y)
        
        # 1. Move to target
        pyautogui.moveTo(x, y, duration=0.04)
        
        # 2. Wait for UI/Hover effect to stabilize
        self.sleep_with_failsafe(drag_protection)
        
        # 3. Click with specific coordinate lock
        pyautogui.mouseDown(x=x, y=y)
        self.sleep_with_failsafe(0.05) # Key: wait while button is Down
        pyautogui.mouseUp(x=x, y=y)
        
        # 4. Optional relief move to avoid tooltip blocking
        if relief_move:
            pyautogui.moveRel(30, 30, duration=0.04)
            self.sleep_with_failsafe(0.04)

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
            
            # Capture as RGB, convert to BGR for OpenCV
            haystack_img = cv2.cvtColor(np.array(pyautogui.screenshot()), cv2.COLOR_RGB2BGR)
            
            # Run locate with 0.0 confidence to get the best match score and position in one go
            pos, score = self._opencv_locate(full_path, haystack_img, confidence=0.0)
            
            if pos and score >= 0.80:
                # Filter out matches in the "Dead Zone" (Left 260px)
                if pos.x < self.ignore_left:
                    if on_status: on_status(f"Pominięto (Strefa Powiadomień): {image_name}")
                    continue
                    
                final_x = pos.x + offset_x + self.offset_x
                final_y = pos.y + offset_y + self.offset_y
                
                if on_status: on_status(f"Klikam: {image_name} na ({final_x}, {final_y})")
                
                # Default is relief_move=False, which is fast and does not trigger hover tooltips
                self.stable_click(final_x, final_y, on_status=on_status)
                return pos
            
            if on_status and score is not None:
                on_status(f"Szukam: {image_name} ({int(score*100)}%) - [Cel: >80%]")
            
            self.sleep_with_failsafe(0.05) # React faster
            
        return False

    def scroll_menu(self, star_pos):
        target_y = max(50, star_pos.y - 150)
        pyautogui.moveTo(star_pos.x, target_y, duration=0.2)
        for _ in range(8):
            if self.check_failsafe(): break
            pyautogui.scroll(-500)
            self.sleep_with_failsafe(0.02)
        self.sleep_with_failsafe(0.1)

    def scroll_top(self, star_pos):
        if not star_pos: return
        target_y = max(100, star_pos.y - 200)
        pyautogui.moveTo(star_pos.x, target_y, duration=0.2)
        # Just hover, don't click to avoid accidental closing
        self.sleep_with_failsafe(0.1)
        
        for _ in range(24): 
            if self.check_failsafe(): break
            pyautogui.scroll(500)
            self.sleep_with_failsafe(0.02)
        self.sleep_with_failsafe(0.1)
        
    def scroll_bottom(self, star_pos):
        if not star_pos: return
        target_y = max(100, star_pos.y - 200) 
        pyautogui.moveTo(star_pos.x, target_y, duration=0.3)
        # Just hover, don't click to avoid accidental closing
        self.sleep_with_failsafe(0.1)
        
        # Increased range to ensure we hit the real bottom
        for _ in range(48):
            if self.check_failsafe(): break
            pyautogui.scroll(-500)
            self.sleep_with_failsafe(0.01)
        
        self.sleep_with_failsafe(0.2)

    def scan_for_explorer(self, explorer_files, on_status=None):
        """POOL SCAN: Searches for ANY of the provided files in one pass, optimized to run matchTemplate once per file."""
        if on_status: on_status("Skanowanie listy...")
        
        import numpy as np
        import cv2
        haystack_img = cv2.cvtColor(np.array(pyautogui.screenshot()), cv2.COLOR_RGB2BGR)
        
        # We will collect the match results for each file
        file_results = {}
        for plik in explorer_files:
            if self.check_failsafe(): return None
            full_path = os.path.join(self.script_dir, plik)
            if not os.path.exists(full_path): continue
            if os.path.getsize(full_path) < 500: continue
            
            # Load template
            if not hasattr(self, 'templates'):
                self.templates = {}
            if plik not in self.templates:
                needle = cv2.imread(full_path, cv2.IMREAD_COLOR)
                if needle is None: continue
                self.templates[plik] = needle
            else:
                needle = self.templates[plik]
            
            res = cv2.matchTemplate(haystack_img, needle, cv2.TM_CCOEFF_NORMED)
            file_results[plik] = (res, needle.shape[:2])
        
        # Now evaluate conf_levels: 0.90, 0.85, 0.81 (optimized to ignore gray but capture all active units)
        best_match = {"score": 0.0, "file": ""}
        conf_levels = [0.90, 0.85, 0.81]
        
        for conf in conf_levels:
            for plik, (res, shape) in file_results.items():
                if self.check_failsafe(): return None
                
                h, w = shape
                loc = np.where(res >= conf)
                
                # Guard against massive false-positives (flat dummy templates matching flat backgrounds)
                if len(loc[0]) > 1000:
                    continue
                
                # Find the first valid match
                for pt in zip(*loc[::-1]): # switch x, y
                    pos_x = pt[0] + w // 2
                    pos_y = pt[1] + h // 2
                    
                    if pos_x < self.ignore_left: continue
                    if self.is_blacklisted(pos_x, pos_y):
                        if on_status: on_status(f"Omijam zablokowanego specjalistę na ({pos_x}, {pos_y})")
                        continue
                    if self.is_recently_clicked(pos_x, pos_y):
                        continue
                    
                    final_x = pos_x + self.offset_x
                    final_y = pos_y + self.offset_y
                    
                    if on_status: on_status(f"Wybieram: {plik}")
                    self.stable_click(final_x, final_y, on_status=on_status, relief_move=True)
                    
                    # Always track clicks in history to prevent double-clicking active units before the game UI refreshes
                    import time
                    self.click_history.append((pos_x, pos_y, time.time()))

                    from collections import namedtuple
                    Point = namedtuple('Point', ['x', 'y'])
                    pos = Point(pos_x, pos_y)
                    
                    self.last_explorer_pos = pos
                    self.sleep_with_failsafe(0.5) # Wait for sub-menu popup
                    return plik, pos
                
                # For status fallback, find the maximum match value
                if conf == 0.80 and not loc[0].size:
                    _, max_val, _, _ = cv2.minMaxLoc(res)
                    if max_val > best_match["score"]:
                        best_match = {"score": max_val, "file": plik}
        
        if on_status and best_match["score"] > 0.4:
            on_status(f"Najbliższy: {best_match['file']} ({int(best_match['score']*100)}%) - [Cel: >82%]")
            
        return None

    def execute_task_cycle(self, explorer_files, explorer_tasks, star_pos, bot_type="explorer", on_status=None, retried_opposite=False):
        max_scrolls = 12 # Sufficient for even very large lists and reduces scan times when empty
        found = None
        self.last_explorer_pos = None
        
        # Ensure mouse is over the Star Menu for scrolling
        target_y = max(100, star_pos.y - 200)
        pyautogui.moveTo(star_pos.x, target_y, duration=0.2)
        
        for i in range(max_scrolls):
            if self.check_failsafe(): break
            found = self.scan_for_explorer(explorer_files, on_status)
            if found: break
            
            direction = "w górę" if bot_type == "geologist" else "w dół"
            if on_status: on_status(f"Szukanie {direction} ({i+1}/{max_scrolls})...")
            
            # Scroll logic
            if bot_type == "geologist":
                for _ in range(4):
                    pyautogui.scroll(500)
                    self.sleep_with_failsafe(0.02)
                self.shift_blacklist(self.scroll_step_y) # Geologists move down, Y increases
            else:
                for _ in range(4):
                    pyautogui.scroll(-500)
                    self.sleep_with_failsafe(0.02)
                self.shift_blacklist(-self.scroll_step_y) # Explorers move up, Y decreases
            self.sleep_with_failsafe(0.15)

        if not found and not retried_opposite and not self.check_failsafe():
            if on_status: on_status("Weryfikacja przeciwnego końca listy...")
            if bot_type == "geologist":
                self.scroll_bottom(star_pos)
            else:
                self.scroll_top(star_pos)
            return self.execute_task_cycle(explorer_files, explorer_tasks, star_pos, bot_type, on_status, retried_opposite=True)

        if not found or self.check_failsafe():
            return False

        plik_found, pos = found
        task_steps = explorer_tasks.get(plik_found, [])
        
        self.sleep_with_failsafe(0.1)

        success = True
        for idx, step in enumerate(task_steps):
            if self.check_failsafe():
                success = False
                break
            # First step (opening the menu) gets 4 seconds timeout. Submenu steps get 1.5 seconds.
            current_timeout = 4 if idx == 0 else 1.5
            if not self.find_and_click(step, timeout=current_timeout, on_status=on_status):
                if on_status: on_status(f"Błąd: Brak {step} dla {plik_found}. Zamykanie okna...")
                
                # Close the specialist window (click the highest close button to avoid closing the Star Menu)
                import cv2
                import numpy as np
                haystack = cv2.cvtColor(np.array(pyautogui.screenshot()), cv2.COLOR_RGB2BGR)
                # Lower threshold to 0.53 to reliably find both close buttons
                matches = self._opencv_locate_all(self.UI_X, haystack, confidence=0.53)
                
                # If idx > 0, the specialist window is guaranteed to be open because the first step succeeded.
                # In this case we only need at least 1 close button to safely close it.
                # If idx == 0, we need at least 2 close buttons to prevent closing the Star Menu by mistake.
                required_matches = 1 if idx > 0 else 2
                
                if len(matches) >= required_matches:
                    # Filter for buttons in the upper 60% of the screen (specialist window)
                    import pyautogui
                    screen_height = pyautogui.size()[1]
                    specialist_close_buttons = [pt for pt in matches if pt[1] < screen_height * 0.60]
                    
                    if specialist_close_buttons:
                        specialist_close_buttons.sort(key=lambda pt: pt[1]) # Sort by Y ascending (highest)
                        target_x, target_y = specialist_close_buttons[0]
                        if on_status: on_status(f"Zamykam okno specjalisty na ({target_x}, {target_y})")
                        self.stable_click(target_x + self.offset_x, target_y + self.offset_y, on_status=on_status)
                    else:
                        # Fallback: if we know the window is open (idx > 0) but didn't pass the height filter,
                        # just click the highest detected button on the screen
                        if idx > 0 and matches:
                            matches.sort(key=lambda pt: pt[1])
                            hx, hy = matches[0]
                            if on_status: on_status(f"Zamykam okno specjalisty (fallback highest) na ({hx}, {hy})")
                            self.stable_click(hx + self.offset_x, hy + self.offset_y, on_status=on_status)
                        else:
                            if on_status: on_status("Okno specjalisty nie wydaje się być otwarte. Pomijam zamykanie.")
                else:
                    if on_status: on_status("Okno specjalisty nie wydaje się być otwarte. Pomijam zamykanie.")
                pyautogui.moveRel(30, 30, duration=0.1)
                
                success = False
                break
        
        if not success:
            import time
            self.click_history.append((pos.x, pos.y, time.time()))
            self.blacklisted_coords.append((pos.x, pos.y))
            return "RETRY_SAME_PAGE"
        
        return True

    def run_bot(self, config, on_progress=None, on_status=None):
        self.stop_requested = False
        self.click_history = []
        self.blacklisted_coords = []
        
        if on_status: on_status("Bot startuje...")
        if self.check_failsafe(): return "Zatrzymano (ESC)"
        
        star_pos = self.find_and_click(self.UI_STAR, timeout=10, on_status=on_status)
        if not star_pos:
            return "Nie znaleziono Menu Gwiazdy"

        # ENSURE PIN IS ON (Menu won't close accidentally)
        if self.find_and_click(self.UI_PIN_ON, timeout=1, on_status=on_status):
            if on_status: on_status("Menu jest już przypięte.")
        else:
            if not self.find_and_click(self.UI_PIN_OFF, timeout=2, on_status=on_status):
                if on_status: on_status("Nie udało się przypiąć menu (może już jest?)")
            if self.check_failsafe(): return "Zatrzymano (ESC)"

        if not self.find_and_click(self.UI_EKIPA, timeout=2, on_status=on_status):
            return "Nie znaleziono zakładki Ekipa. Czy Menu Gwiazdy jest otwarte?"
            
        self.sleep_with_failsafe(0.2)
        
        bot_type = config.get("type", "explorer")
        if bot_type == "geologist":
            self.scroll_bottom(star_pos)
        else:
            self.scroll_top(star_pos)

        count = 0
        explorer_files = config.get("explorers", [])
        explorer_tasks = config.get("explorer_tasks", {}) 
        
        if not explorer_tasks and "task_steps" in config:
            explorer_tasks = {f: config["task_steps"] for f in explorer_files}

        while count < config.get("max_count", 999):
            if self.stop_requested: break
            result = self.execute_task_cycle(explorer_files, explorer_tasks, star_pos, bot_type=bot_type, on_status=on_status)
            
            if result == "RETRY_SAME_PAGE":
                self.sleep_with_failsafe(0.1)
                continue
                
            if not result:
                break
                
            count += 1
            if on_progress:
                on_progress(count)
            
            if self.turbo_mode:
                self.sleep_with_failsafe(0.2)
            else:
                self.sleep_with_failsafe(self.lag_buffer)
            
        pyautogui.moveTo(100, 100, duration=0.5)
        unit_name = "geologów" if bot_type == "geologist" else "odkrywców"
        return f"Wysłano {count} {unit_name}."

    def stop(self):
        self.stop_requested = True
