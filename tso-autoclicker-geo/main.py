import eel
import os
import threading
import pyautogui
import time
from logic.bot_engine import BotEngine

# CONFIGURATION
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
eel.init(os.path.join(SCRIPT_DIR, 'web'))

bot = BotEngine(SCRIPT_DIR)

# TASK MAPPINGS (Geologists only have one selection + Send)
TASK_MAP = {
    "stone": ["poszukiwanie_kamienia.png", "wyslij_zielony.png"],
    "copper": ["poszukiwanie_miedzi.png", "wyslij_zielony.png"],
    "marble": ["poszukiwanie_marmuru.png", "wyslij_zielony.png"],
    "iron": ["poszukiwanie_zelaza.png", "wyslij_zielony.png"],
    "coal": ["poszukiwanie_wegla.png", "wyslij_zielony.png"],
    "gold": ["poszukiwanie_zlota.png", "wyslij_zielony.png"],
    "titanium": ["poszukiwanie_tytanu.png", "wyslij_zielony.png"],
    "saltpeter": ["poszukiwanie_saletry.png", "wyslij_zielony.png"],
    "granite": ["poszukiwanie_granitu.png", "wyslij_zielony.png"]
}

# GEOLOGIST CATEGORIES
GEOLOGISTS_LIST = [
    {"name": "Zwykły", "files": ["zwykly_geolog.png"], "icon": "assets/zwykly_geolog.png"},
    {"name": "Wesoły", "files": ["wesoly_geolog.png"], "icon": "assets/wesoly_geolog.png"},
    {"name": "Sumienny", "files": ["sumienny_geolog.png"], "icon": "assets/sumienny_geolog.png"},
    {"name": "Pracowita", "files": ["pracowita_geolog.png"], "icon": "assets/pracowita_geolog.png"},
    {"name": "Archeologiczny", "files": ["archeologiczny_geolog.png"], "icon": "assets/archeologiczny_geolog.png"},
    {"name": "Biegły", "files": ["biegly_geolog.png"], "icon": "assets/biegly_geolog.png"},
    {"name": "Dokładny", "files": ["dokladny_geolog.png"], "icon": "assets/dokladny_geolog.png"},
    {"name": "Mumia", "files": ["mumia_geolog.png"], "icon": "assets/mumia_geolog.png"},
    {"name": "Niezłomny", "files": ["niezlomny_geolog.png"], "icon": "assets/niezlomny_geolog.png"},
    {"name": "Osmalony", "files": ["osmalony_geolog.png"], "icon": "assets/osmalony_geolog.png"},
    {"name": "Piernik", "files": ["piernik_geolog.png"], "icon": "assets/piernik_geolog.png"},
    {"name": "Przyjacielski", "files": ["przyjacielski_geolog.png"], "icon": "assets/przyjacielski_geolog.png"},
    {"name": "Wyrafinowany", "files": ["wyrafinowany_geolog.png"], "icon": "assets/wyrafinowany_geolog.png"},
    {"name": "Zimny", "files": ["zimny_geolog.png"], "icon": "assets/zimny_geolog.png"},
    {"name": "Złota", "files": ["zlota_geolog.png"], "icon": "assets/zlota_geolog.png"},
    {"name": "Zrównoważony", "files": ["zrownowazony_geolog.png"], "icon": "assets/zrownowazony_geolog.png"}
]

@eel.expose
def get_explorers(): # Keeping name for JS compatibility
    return GEOLOGISTS_LIST

@eel.expose
def update_calibration(offset_x, offset_y):
    bot.set_offsets(offset_x, offset_y)

@eel.expose
def update_lag_buffer(val):
    bot.set_lag_buffer(val)

@eel.expose
def set_turbo_mode(enabled):
    bot.set_turbo_mode(enabled)

@eel.expose
def run_bot(config):
    def run():
        try:
            # 1. Convert simple explorer names to filenames
            explorer_files = []
            for name in config["selectedExplorers"]:
                for entry in GEOLOGISTS_LIST:
                    if entry["name"] == name:
                        explorer_files.extend(entry["files"])
            
            # 2. Build global task steps
            task_steps = TASK_MAP.get(config["globalTask"], [])
            
            final_msg = bot.run_bot({
                "explorers": explorer_files,
                "task_steps": task_steps,
                "max_count": 999
            }, 
            on_progress=eel.on_bot_progress,
            on_status=eel.on_status_update)
            
        except pyautogui.FailSafeException:
            final_msg = "Błąd: Myszka w rogu (FailSafe)!"
        except Exception as e:
            final_msg = f"Błąd krytyczny: {str(e)}"
            
        eel.on_bot_finished(final_msg)

    threading.Thread(target=run).start()

@eel.expose
def stop_bot():
    bot.stop()

if __name__ == "__main__":
    print("Royal Geologist is ready. Opening UI...")
    try:
        # Increased window size to 750x850 for better visibility
        eel.start('index.html', size=(750, 850))
    except (SystemExit, KeyboardInterrupt):
        print("Closing...")
