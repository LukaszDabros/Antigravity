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
        
        # UI Elements
        self.UI_STAR = "gwiazda.png"
        self.UI_X = "ikona_x_zamknij.png"
        self.UI_PIN_OFF = "pinezka.png"
        self.UI_PIN_ON = "pinezka_on.png"
        self.UI_EKIPA = "ekipa.png"

        # TSO-style "FailSafe": corner of the screen
        pyautogui.FAILSAFE = True

    def find_and_click(self, image_name, timeout=5, offset_x=0, offset_y=0, on_status=None):
        """Finds and clicks with MouseDown/Up (Better for TSO) + Diagnostics."""
        if on_status: on_status(f"Szukam: {image_name}...")
        
        full_path = os.path.join(self.script_dir, image_name)
        if not os.path.exists(full_path):
            if on_status: on_status(f"Błąd: Brak pliku {image_name}")
            return False

        conf_levels = [0.75, 0.65] 
        start_time = time.time()
        
        while time.time() - start_time < timeout:
            if self.stop_requested: return False
            
            for conf in conf_levels:
                try:
                    pos = pyautogui.locateCenterOnScreen(full_path, confidence=conf, grayscale=True)
                    if pos is not None:
                        screen_w, screen_h = pyautogui.size()
                        target_x = max(10, min(screen_w - 10, pos.x + offset_x))
                        target_y = max(20, min(screen_h - 10, pos.y + offset_y))
                        
                        pyautogui.moveTo(target_x, target_y, duration=0.2)
                        pyautogui.mouseDown()
                        time.sleep(0.12)
                        pyautogui.mouseUp()
                        time.sleep(self.action_delay + 0.3) 
                        return pos
                except:
                    pass
            
            # DIAGNOSTICS: If we failed, let's see how close we were (using OpenCV)
            try:
                import cv2
                import numpy as np
                needle = cv2.imread(full_path, cv2.IMREAD_GRAYSCALE)
                haystack = cv2.cvtColor(np.array(pyautogui.screenshot()), cv2.COLOR_RGB2GRAY)
                res = cv2.matchTemplate(haystack, needle, cv2.TM_CCOEFF_NORMED)
                _, max_val, _, _ = cv2.minMaxLoc(res)
                if on_status: on_status(f"Szukam: {image_name} (Styk: {int(max_val*100)}%)")
            except:
                pass

            # Anti-Hover: Move mouse away slightly (Calmed down to 30px)
            pyautogui.moveRel(30, 30, duration=0.1)
            time.sleep(0.4)
            
        return False

    def scroll_menu(self, star_pos):
        """Scrolls the star menu down."""
        target_y = max(50, star_pos.y - 150)
        pyautogui.moveTo(star_pos.x, target_y, duration=0.2)
        for _ in range(4):
            pyautogui.scroll(-500)
            time.sleep(0.05)
        time.sleep(0.5)

    def scan_for_explorer(self, explorer_files, on_status=None):
        """Looks for any of the given explorer icons on screen."""
        if on_status: on_status("Szukam odkrywcy na liście...")
        for plik in explorer_files:
            full_path = os.path.join(self.script_dir, plik)
            if not os.path.exists(full_path): continue
            try:
                # Use grayscale here too for consistency
                pos = pyautogui.locateCenterOnScreen(full_path, confidence=self.confidence, grayscale=True)
                if pos:
                    pyautogui.moveTo(pos.x, pos.y, duration=0.1)
                    pyautogui.click()
                    # Store anchor for internal scroll
                    self.last_explorer_pos = pos
                    time.sleep(1.8) # Wait for specialist window
                    return plik, pos
            except:
                pass
        return None

    def execute_task_cycle(self, explorer_files, task_steps, star_pos, on_status=None):
        """One cycle with Intelligent Internal Scroll."""
        max_scrolls = 15
        found = None
        self.last_explorer_pos = None
        
        for i in range(max_scrolls):
            if self.stop_requested: break
            found = self.scan_for_explorer(explorer_files, on_status)
            if found: break
            if on_status: on_status(f"Przewijam menu ({i+1}/{max_scrolls})...")
            self.scroll_menu(star_pos)

        if not found:
            return False

        # STABILIZATION: Short wait before first task scan
        time.sleep(0.5)

        # Execute steps (e.g. click "Treasure", click "Prolonged", click "Send")
        for step in task_steps:
            if self.stop_requested: break
            
            # Initial search (Fast)
            if not self.find_and_click(step, timeout=3, on_status=on_status):
                # DEEP SCROLL: If not found, try to scroll inside the specialist window
                if on_status: on_status(f"Przewijam listę zadań w miejscu okna...")
                
                # Move to the last clicked explorer pos (Anchor)
                if self.last_explorer_pos:
                    pyautogui.moveTo(self.last_explorer_pos.x, self.last_explorer_pos.y, duration=0.2)
                else:
                    screen_w, screen_h = pyautogui.size()
                    pyautogui.moveTo(screen_w // 2, screen_h // 2, duration=0.2)
                
                for _ in range(3):
                    pyautogui.scroll(-500)
                    time.sleep(0.1)
                
                # Retry search (Final)
                if not self.find_and_click(step, timeout=5, on_status=on_status):
                    if on_status: on_status(f"Błąd kroku: {step}.")
                    return True 
        
        return True

    def run_bot(self, config, on_progress=None, on_status=None):
        self.stop_requested = False
        if on_status: on_status("Bot startuje...")
        
        # 1. Open Star Menu
        star_pos = self.find_and_click(self.UI_STAR, timeout=10, on_status=on_status)
        if not star_pos:
            return "Nie znaleziono Menu Gwiazdy"

        # 2. Check Pin
        self.find_and_click(self.UI_PIN_OFF, timeout=1, on_status=on_status)

        # 3. Switch to Specialists tab (Ekipa)
        self.find_and_click(self.UI_EKIPA, timeout=2, on_status=on_status)
        time.sleep(0.5) # Wait for tab to load items

        # 4. Main Loop
        count = 0
        while count < config.get("max_count", 999):
            if self.stop_requested: break
            
            success = self.execute_task_cycle(config["explorers"], config["task_steps"], star_pos, on_status=on_status)
            if not success:
                break
            
            count += 1
            if on_progress:
                on_progress(count)
            
            time.sleep(2.0) # Server lag buffer
            
        print(f"Bot finished. Sent {count} explorers.")
        return f"Wysłano {count} odkrywców."

    def stop(self):
        self.stop_requested = True
