import os
import sys
import time
import traceback
import pyautogui
from logic.bot_engine import BotEngine

# Redirect output to both console and file
class Logger(object):
    def __init__(self):
        self.terminal = sys.stdout
        self.log = open("debug_log.txt", "w", encoding="utf-8")

    def write(self, message):
        self.terminal.write(message)
        self.log.write(message)
        self.log.flush()

    def flush(self):
        self.terminal.flush()
        self.log.flush()

sys.stdout = Logger()
sys.stderr = sys.stdout

def run_diagnostics():
    print("=== TSO BOT DIAGNOSTICS START ===")
    print("WARNING: You have 5 seconds to switch to the game window and make sure the Star Menu is visible!")
    for i in range(5, 0, -1):
        print(f"Starting in {i}...")
        time.sleep(1)
        
    print(f"Time: {time.strftime('%Y-%m-%d %H:%M:%S')}")
    print(f"Screen resolution: {pyautogui.size()}")
    
    script_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'web', 'assets')
    print(f"Script directory: {script_dir}")
    
    bot = BotEngine(script_dir)
    # Enable turbo mode to see if it makes a difference, or keep it standard
    bot.set_turbo_mode(False)
    
    # We will simulate searching for explorers
    # Let's check files existence
    print("\n--- Checking Asset Files ---")
    essential_assets = ["gwiazda.png", "ekipa.png", "ikona_x_zamknij.png"]
    for asset in essential_assets:
        path = os.path.join(script_dir, asset)
        exists = os.path.exists(path)
        size = os.path.getsize(path) if exists else 0
        print(f"Asset '{asset}': Exists={exists}, Size={size} bytes")

    # List all explorer assets we support
    explorer_assets = [
        "zwykly_odkrywca.png", "doswiadczony_odkrywca.png", "zuchwaly_odkrywca.png",
        "szybki_odkrywca.png", "rina_odkrywca.png", "zoe_odkrywca.png",
        "szczesliwy_odkrywca.png", "smialy_odkrywca.png"
    ]
    for asset in explorer_assets:
        path = os.path.join(script_dir, asset)
        if os.path.exists(path):
            print(f"Explorer asset '{asset}': Exists (Size: {os.path.getsize(path)} bytes)")
        else:
            print(f"Explorer asset '{asset}': MISSING")

    def status_callback(msg):
        print(f"[STATUS] {msg}")

    def progress_callback(count):
        print(f"[PROGRESS] Dispatched: {count}")

    print("\n--- Starting Bot Cycle Simulation ---")
    try:
        # We will mock the config
        # Let's search for Zoe and Ordinary Explorers as an example
        active_explorers = [f for f in explorer_assets if os.path.exists(os.path.join(script_dir, f))]
        
        # Build tasks: artifact treasure search
        # artifact_treasure task: ["szukanie_skarbu.png", "artefaktu_poszukiwania.png", "wyslij_zielony.png"]
        # Make sure these assets exist
        task_assets = ["szukanie_skarbu.png", "artefaktu_poszukiwania.png", "wyslij_zielony.png"]
        print("\nChecking Task Assets:")
        for ta in task_assets:
            print(f"Task asset '{ta}': Exists={os.path.exists(os.path.join(script_dir, ta))}")
            
        explorer_tasks = {f: task_assets for f in active_explorers}

        print("\nInvoking bot.run_bot...")
        result = bot.run_bot(
            {
                "type": "explorer",
                "explorers": active_explorers,
                "explorer_tasks": explorer_tasks,
                "max_count": 2 # just process up to 2 for testing
            },
            on_progress=progress_callback,
            on_status=status_callback
        )
        print(f"\nResult: {result}")
        
    except Exception as e:
        print("\n!!! EXCEPTION CAUGHT !!!")
        traceback.print_exc()
        
    print("\n=== DIAGNOSTICS END ===")

if __name__ == "__main__":
    run_diagnostics()
