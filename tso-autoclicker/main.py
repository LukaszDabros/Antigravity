import eel
import os
import threading
import win32gui
import win32con
import time
import pyautogui
from logic.bot_engine import BotEngine

# CONFIGURATION
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
eel.init(os.path.join(SCRIPT_DIR, 'web'))

bot = BotEngine(SCRIPT_DIR)

# TASK MAPPINGS (Files to find/click in sequence)
TASK_MAP = {
    "prolonged_treasure": ["szukanie_skarbu.png", "przedluzone_poszukiwania.png", "wyslij_zielony.png"],
    "short_treasure": ["szukanie_skarbu.png", "krotkie_poszukiwania.png", "wyslij_zielony.png"],
    "adventure": ["szukanie_przygody.png", "szukanie_przygody.png", "wyslij_zielony.png"] 
}

# EXPLORER CATEGORIES Mapping
EXPLORERS_LIST = [
    {"name": "Zwykły", "files": ["zwykly_odkrywca.png"]},
    {"name": "Szczęśliwy", "files": ["szczesliwy_odkrywca.png"]},
    {"name": "Nieustraszony", "files": ["nieustraszony_odkrywca.png"]},
    {"name": "Puszysty / Śnieżny", "files": ["sniezny_odkrywca.png", "puszysty_odkrywca.png"]},
    {"name": "Zakochany", "files": ["zakochany_odkrywca.png"]},
    {"name": "Królewski", "files": ["krolewski_odkrywca.png"]},
    {"name": "Zoe", "files": ["zoe_odkrywca.png"]},
    {"name": "Rina", "files": ["rina_odkrywca.png"]},
    {"name": "Żądna", "files": ["zadna_odkrywca.png"]},
    {"name": "Dobrotliwa", "files": ["dobrotliwa_odkrywca.png"]},
    {"name": "Dzielna", "files": ["dzielna_odkrywca.png"]},
    {"name": "Zauroczona", "files": ["zauroczona_odkrywca.png"]},
    {"name": "Romantyczny", "files": ["romantyczny_odkrywca.png"]},
    {"name": "Pokorny", "files": ["pokorny_odkrywca.png"]},
    {"name": "Śmiały", "files": ["smialy_odkrywca.png"]},
    {"name": "Uroczy", "files": ["uroczy_odkrywca.png"]},
    {"name": "Zuchwały", "files": ["zuchwaly_odkrywca.png"]},
    {"name": "Przestraszony", "files": ["przestraszony_odkrywca.png"]},
    {"name": "Zapalony", "files": ["zapalony_odkrywca.png"]}
]

@eel.expose
def get_explorers():
    return EXPLORERS_LIST

def minimize_window():
    """Minimizes ONLY the Eel window by searching for its title."""
    def find_and_min():
        time.sleep(1.0) # Wait for bot to start move mouse
        # Specific window title from index.html
        hwnd = win32gui.FindWindow(None, "TSO Royal Auto-Explorer")
        if hwnd:
            win32gui.ShowWindow(hwnd, win32con.SW_MINIMIZE)
        else:
            print(" [!] Could not find Eel window to minimize.")
    
    import time
    threading.Thread(target=find_and_min).start()

@eel.expose
def start_bot(selected_explorers):
    def run():
        bot.stop_requested = False # Global reset
        eel.update_status("Uruchamianie bota... Minimalizacja.")
        minimize_window()
        
        final_msg = "Praca zakończona."
        try:
            for exp in selected_explorers:
                if bot.stop_requested: break
                task_key = exp.get("task", "prolonged_treasure")
                steps = TASK_MAP.get(task_key, TASK_MAP["prolonged_treasure"])
                
                eel.update_status(f"Praca: {exp['name']} -> {task_key}")
                
                config = {
                    "explorers": exp["files"],
                    "task_steps": steps,
                    "max_count": 999
                }
                
                result = bot.run_bot(
                    config, 
                    on_progress=lambda n: eel.update_status(f"Wysłano {n} ({exp['name']})"),
                    on_status=eel.update_status
                )
                
                if isinstance(result, str):
                    eel.update_status(f"Przerwano: {result}")
                
                if bot.stop_requested: break
                
                # Lag buffer for server stability (Increased to 2.5s per user request)
                time.sleep(2.5)
                
            if not bot.stop_requested:
                final_msg = "Wysyłanie zakończone sukcesem!"
            else:
                final_msg = "Praca zatrzymana."
        except pyautogui.FailSafeException:
            final_msg = "Błąd: Myszka w rogu (FailSafe)!"
        except Exception as e:
            final_msg = f"Błąd krytyczny: {str(e)}"
            
        eel.on_bot_finished(final_msg)

    threading.Thread(target=run).start()

@eel.expose
def stop_bot():
    bot.stop()
    eel.on_bot_finished("Bot zatrzymany ręcznie.")

if __name__ == "__main__":
    print("Royal Explorer is ready. Opening UI...")
    try:
        eel.start('index.html', size=(650, 850))
    except (SystemExit, KeyboardInterrupt):
        print("Closing...")
