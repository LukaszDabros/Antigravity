import eel
import os
import threading
import pyautogui
import time
from logic.bot_engine import BotEngine

# CONFIGURATION
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
eel.init(os.path.join(SCRIPT_DIR, 'web'))

bot = BotEngine(os.path.join(SCRIPT_DIR, 'web', 'assets'))

# --- TASK MAPPINGS ---
EXPLORER_TASK_MAP = {
    "short_treasure": ["szukanie_skarbu.png", "krotkie_poszukiwania.png", "wyslij_zielony.png"],
    "medium_treasure": ["szukanie_skarbu.png", "srednie_poszukiwania.png", "wyslij_zielony.png"],
    "long_treasure": ["szukanie_skarbu.png", "dlugie_poszukiwania.png", "wyslij_zielony.png"],
    "very_long_treasure": ["szukanie_skarbu.png", "bdlugie_poszukiwania.png", "wyslij_zielony.png"],
    "prolonged_treasure": ["szukanie_skarbu.png", "przedluzone_poszukiwania.png", "wyslij_zielony.png"],
    "artifact_treasure": ["szukanie_skarbu.png", "artefaktu_poszukiwania.png", "wyslij_zielony.png"],
    "adventure": ["szukanie_przygody.png", "wyslij_zielony.png"]
}

GEOLOGIST_TASK_MAP = {
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

# --- LISTS ---
EXPLORERS_LIST = [
    {"name": "Zwykły Odkrywca", "files": ["zwykly_odkrywca.png"], "icon": "assets/zwykly_odkrywca.png"},
    {"name": "Tubylczy Zwiadowca", "files": ["tubylczy_zwiadowca.png", "szybki_odkrywca.png"], "icon": "assets/tubylczy_zwiadowca.png"},
    {"name": "Doświadczony Odkrywca", "files": ["doswiadczony_odkrywca.png"], "icon": "assets/doswiadczony_odkrywca.png"},
    {"name": "Szczęśliwy Odkrywca", "files": ["szczesliwy_odkrywca.png"], "icon": "assets/szczesliwy_odkrywca.png"},
    {"name": "Nieustraszona Odkrywczyni", "files": ["nieustraszony_odkrywca.png"], "icon": "assets/nieustraszony_odkrywca.png"},
    {"name": "Dzielna Odkrywczyni", "files": ["dzielna_odkrywca.png"], "icon": "assets/dzielna_odkrywca.png"},
    {"name": "Staranny Odkrywca", "files": ["staranny_odkrywca.png"], "icon": "assets/staranny_odkrywca.png"},
    {"name": "Urocza Odkrywczyni", "files": ["uroczy_odkrywca.png"], "icon": "assets/uroczy_odkrywca.png"},
    {"name": "Księżniczka Zoe", "files": ["zoe_odkrywca.png"], "icon": "assets/zoe_odkrywca.png"},
    {"name": "Żądna Przygód Odkrywczyni", "files": ["zadna_odkrywca.png"], "icon": "assets/zadna_odkrywca.png"},
    {"name": "Stanowcza Odkrywczyni", "files": ["stanowczy_odkrywca.png"], "icon": "assets/stanowczy_odkrywca.png"},
    {"name": "Zauroczona Odkrywczyni", "files": ["zauroczona_odkrywca.png"], "icon": "assets/zauroczona_odkrywca.png"},
    {"name": "Pokorny Odkrywca", "files": ["pokorny_odkrywca.png"], "icon": "assets/pokorny_odkrywca.png"},
    {"name": "Zapalona Odkrywczyni", "files": ["zapalony_odkrywca.png"], "icon": "assets/zapalony_odkrywca.png"},
    {"name": "Śmiały Odkrywca", "files": ["smialy_odkrywca.png"], "icon": "assets/smialy_odkrywca.png"},
    {"name": "Przestraszony Odkrywca", "files": ["przestraszony_odkrywca.png"], "icon": "assets/przestraszony_odkrywca.png"},
    {"name": "Śnieżny Odkrywca", "files": ["sniezny_odkrywca.png"], "icon": "assets/sniezny_odkrywca.png"},
    {"name": "Romantyczny Odkrywca", "files": ["romantyczny_odkrywca.png"], "icon": "assets/romantyczny_odkrywca.png"},
    {"name": "Macierzyńska Odkrywczyni", "files": ["macierzynska_odkrywca.png"], "icon": "assets/macierzynska_odkrywca.png"},
    {"name": "Dobrotliwa Odkrywczyni", "files": ["dobrotliwa_odkrywca.png"], "icon": "assets/dobrotliwa_odkrywca.png"},
    {"name": "Królewski Odkrywca", "files": ["krolewski_odkrywca.png"], "icon": "assets/krolewski_odkrywca.png"},
    {"name": "Odkrywca Pirat", "files": ["pirat_odkrywca.png"], "icon": "assets/pirat_odkrywca.png"},
    {"name": "Puszysty Odkrywca", "files": ["puszysty_odkrywca.png"], "icon": "assets/puszysty_odkrywca.png"},
    {"name": "Odkrywczyni Rina", "files": ["rina_odkrywca.png"], "icon": "assets/rina_odkrywca.png"},
    {"name": "Zakochany Odkrywca", "files": ["zakochany_odkrywca.png"], "icon": "assets/zakochany_odkrywca.png"},
    {"name": "Odkrywczyni Czarnodrzewiu", "files": ["czarnodrzewu_odkrywca.png"], "icon": "assets/czarnodrzewu_odkrywca.png"},
    {"name": "Przyjacielski Odkrywca", "files": ["przyjacielski_odkrywca.png"], "icon": "assets/przyjacielski_odkrywca.png"},
    {"name": "Widmowy Odkrywca", "files": ["widmowy_odkrywca.png"], "icon": "assets/widmowy_odkrywca.png"},
    {"name": "Odkrywczyni Nora", "files": ["nora_odkrywca.png"], "icon": "assets/nora_odkrywca.png"}
]

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
def get_initial_data():
    enriched_explorers = []
    for exp in EXPLORERS_LIST:
        is_dummy = True
        for file in exp["files"]:
            path = os.path.join(SCRIPT_DIR, 'web', 'assets', file)
            if os.path.exists(path) and os.path.getsize(path) >= 500:
                is_dummy = False
                break
        enriched_explorers.append({**exp, "is_dummy": is_dummy})

    enriched_geologists = []
    for geo in GEOLOGISTS_LIST:
        is_dummy = True
        for file in geo["files"]:
            path = os.path.join(SCRIPT_DIR, 'web', 'assets', file)
            if os.path.exists(path) and os.path.getsize(path) >= 500:
                is_dummy = False
                break
        enriched_geologists.append({**geo, "is_dummy": is_dummy})

    return {
        "explorers": enriched_explorers,
        "geologists": enriched_geologists
    }

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
            bot_type = config.get("type", "explorer")
            active_list = EXPLORERS_LIST if bot_type == "explorer" else GEOLOGISTS_LIST
            task_map = EXPLORER_TASK_MAP if bot_type == "explorer" else GEOLOGIST_TASK_MAP
            
            # 1. Build a mapping: filename -> task_steps
            explorer_tasks = {}
            explorer_files = []
            
            name_to_files = {e["name"]: e["files"] for e in active_list}
            assignments = {a["name"]: a["task"] for a in config.get("individualTasks", [])}
            
            for name in config["selectedUnits"]:
                files = name_to_files.get(name, [])
                task_key = assignments.get(name, config["globalTask"])
                steps = task_map.get(task_key, [])
                
                for f in files:
                    explorer_files.append(f)
                    explorer_tasks[f] = steps
            
            final_msg = bot.run_bot({
                "type": bot_type,
                "explorers": explorer_files,
                "explorer_tasks": explorer_tasks,
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
    print("Royal Dispatcher Unified is ready.")
    try:
        eel.start('index.html', size=(750, 850))
    except (SystemExit, KeyboardInterrupt):
        print("Closing...")
