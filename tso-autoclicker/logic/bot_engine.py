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

    def find_and_click(self, image_name, timeout=5, offset_x=0, offset_y=0):
        """Finds and clicks an image relative to the script directory."""
        full_path = os.path.join(self.script_dir, image_name)
        if not os.path.exists(full_path):
            print(f" [!!!] Error: Missing {image_name}")
            return False

        start_time = time.time()
        while time.time() - start_time < timeout:
            if self.stop_requested: return False
            try:
                pos = pyautogui.locateCenterOnScreen(full_path, confidence=self.confidence)
                if pos is not None:
                    # CLAMP: Ensure mouse doesn't go below 10px or above screen size
                    screen_w, screen_h = pyautogui.size()
                    target_x = max(10, min(screen_w - 10, pos.x + offset_x))
                    target_y = max(20, min(screen_h - 10, pos.y + offset_y))
                    
                    pyautogui.moveTo(target_x, target_y, duration=0.2)
                    pyautogui.click()
                    time.sleep(self.action_delay)
                    return pos
            except:
                pass
            time.sleep(0.1)
        return False

    def scroll_menu(self, star_pos):
        """Scrolls the star menu down."""
        # CLAMP: Ensure we are at least 50px above the star button, but not off-screen
        target_y = max(50, star_pos.y - 150)
        pyautogui.moveTo(star_pos.x, target_y, duration=0.2)
        for _ in range(4):
            pyautogui.scroll(-500)
            time.sleep(0.02)
        time.sleep(0.3)

    def scan_for_explorer(self, explorer_files):
        """Looks for any of the given explorer icons on screen."""
        for plik in explorer_files:
            full_path = os.path.join(self.script_dir, plik)
            if not os.path.exists(full_path): continue
            try:
                pos = pyautogui.locateCenterOnScreen(full_path, confidence=self.confidence)
                if pos:
                    pyautogui.moveTo(pos.x, pos.y, duration=0.1)
                    pyautogui.click()
                    time.sleep(self.action_delay + 1.0) # Buffer for server lag
                    return plik, pos
            except:
                pass
        return None

    def execute_task_cycle(self, explorer_files, task_steps, star_pos):
        """One cycle: find an explorer, execute sub-steps."""
        max_scrolls = 15
        found = None
        
        for _ in range(max_scrolls):
            if self.stop_requested: break
            found = self.scan_for_explorer(explorer_files)
            if found: break
            self.scroll_menu(star_pos)

        if not found:
            return False

        # Execute steps (e.g. click "Treasure", click "Prolonged", click "Send")
        for step in task_steps:
            if self.stop_requested: break
            if not self.find_and_click(step, timeout=4):
                # If step fails, try to close the window to reset
                self.find_and_click(self.UI_X, timeout=1)
                return True # Continue to next explorer
        
        return True

    def run_bot(self, config, on_progress=None):
        """
        config = {
            "explorers": ["name.png"],
            "task_steps": ["step1.png", "step2.png"],
            "max_count": 999
        }
        """
        self.stop_requested = False
        print("Bot started...")
        
        # 1. Open Star Menu
        star_pos = self.find_and_click(self.UI_STAR, timeout=10)
        if not star_pos:
            return "Nie znaleziono Menu Gwiazdy"

        # 2. Check Pin
        self.find_and_click(self.UI_PIN_OFF, timeout=1)

        # 3. Switch to Specialists tab (Ekipa)
        self.find_and_click(self.UI_EKIPA, timeout=2)

        # 4. Main Loop
        count = 0
        while count < config.get("max_count", 999):
            if self.stop_requested: break
            
            success = self.execute_task_cycle(config["explorers"], config["task_steps"], star_pos)
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
