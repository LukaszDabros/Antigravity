import cv2
import numpy as np
import pyautogui
import time
import os
import ctypes

# ===============================================================
# KONFIGURACJA PINY CLICKER
# ===============================================================
TARGET_COLOR_BGR = [255, 0, 255]
TOLERANCE = 30  # Zwiększono tolerancję dla lepszego wykrywania
ACTION_DELAY = 0.5 
CLICK_OFFSET_X = 0
CLICK_OFFSET_Y = 0

# Ścieżka do ikony zamykania (X)
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
X_ICON_PATH = os.path.join(SCRIPT_DIR, "ikona_x_zamknij.png")

# --- STRUKTURY WIN32 API (DirectInput) ---
PUL = ctypes.POINTER(ctypes.c_ulong)
class KeyBdInput(ctypes.Structure):
    _fields_ = [("wVk", ctypes.c_ushort), ("wScan", ctypes.c_ushort), 
                ("dwFlags", ctypes.c_ulong), ("time", ctypes.c_ulong), ("dwExtraInfo", PUL)]
class HardwareInput(ctypes.Structure):
    _fields_ = [("uMsg", ctypes.c_ulong), ("wParamL", ctypes.c_short), ("wParamH", ctypes.c_ushort)]
class MouseInput(ctypes.Structure):
    _fields_ = [("dx", ctypes.c_long), ("dy", ctypes.c_long), ("mouseData", ctypes.c_ulong),
                ("dwFlags", ctypes.c_ulong), ("time", ctypes.c_ulong), ("dwExtraInfo", PUL)]
class Input_I(ctypes.Union):
    _fields_ = [("ki", KeyBdInput), ("mi", MouseInput), ("hi", HardwareInput)]
class Input(ctypes.Structure):
    _fields_ = [("type", ctypes.c_ulong), ("ii", Input_I)]

# Mapa Kodów Skanowania (Standard 1-9)
SCAN_CODES = {
    "1": 0x02, "2": 0x03, "3": 0x04, "4": 0x05, "5": 0x06, 
    "6": 0x07, "7": 0x08, "8": 0x09, "9": 0x0A
}

def PressKey(hexKeyCode):
    extra = ctypes.c_ulong(0)
    ii_ = Input_I()
    ii_.ki = KeyBdInput(0, hexKeyCode, 0x0008, 0, ctypes.pointer(extra))
    x = Input(ctypes.c_ulong(1), ii_)
    ctypes.windll.user32.SendInput(1, ctypes.pointer(x), ctypes.sizeof(x))

def ReleaseKey(hexKeyCode):
    extra = ctypes.c_ulong(0)
    ii_ = Input_I()
    ii_.ki = KeyBdInput(0, hexKeyCode, 0x0008 | 0x0002, 0, ctypes.pointer(extra))
    x = Input(ctypes.c_ulong(1), ii_)
    ctypes.windll.user32.SendInput(1, ctypes.pointer(x), ctypes.sizeof(x))

def stworz_maske_koloru(img):
    lower = np.array([max(0, c - TOLERANCE) for c in TARGET_COLOR_BGR])
    upper = np.array([min(255, c + TOLERANCE) for c in TARGET_COLOR_BGR])
    mask = cv2.inRange(img, lower, upper)
    return mask

def znajdz_znajdki(mask):
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    punkty = []
    for cnt in contours:
        if cv2.contourArea(cnt) > 2:
            M = cv2.moments(cnt)
            if M["m00"] != 0:
                cX = int(M["m10"] / M["m00"])
                cY = int(M["m01"] / M["m00"])
                punkty.append((cX, cY))
    return punkty

def sprawdz_i_zamknij_okno():
    """Szuka ikony X i klika ją jeśli istnieje, aby odsłonić ekran."""
    if not os.path.exists(X_ICON_PATH):
        return False
    try:
        # Confidence 0.8 dla pewności
        pos = pyautogui.locateCenterOnScreen(X_ICON_PATH, confidence=0.8, grayscale=False)
        if pos:
            print(f" [!] Wykryto otwarte okno (X). Zamykam...")
            pyautogui.click(pos.x, pos.y)
            time.sleep(0.5) # Czekamy na animację zamknięcia
            return True
    except:
        pass
    return False

def obsłuż_widok(numer_widoku=None):
    """Skanuje obecny widok i klika znalezione znajdki."""
    if numer_widoku and numer_widoku in SCAN_CODES:
        print(f"\n--- Widok [{numer_widoku}] ---")
        # 1. Wymuszenie fokusu (klik w bezpieczne miejsce)
        screen_w, screen_h = pyautogui.size()
        pyautogui.click(screen_w // 2, 200) 
        time.sleep(0.1)
        
        # 2. Użycie DirectInput API dla niezawodności
        code = SCAN_CODES[numer_widoku]
        PressKey(code)
        time.sleep(0.1)
        ReleaseKey(code)
        
        # 3. Czekamy na animację przesunięcia mapy
        time.sleep(0.6) 
    
    # 3.5. Zanim zrobimy zdjęcie, upewnijmy się, że nic nie zasłania (np. otwarty budynek)
    sprawdz_i_zamknij_okno()

    screenshot = pyautogui.screenshot()
    img = cv2.cvtColor(np.array(screenshot), cv2.COLOR_RGB2BGR)
    mask = stworz_maske_koloru(img)
    punkty = znajdz_znajdki(mask)
    
    if punkty:
        print(f" [+] Wykryto {len(punkty)} znajdziek.")
        for i, (p_x, p_y) in enumerate(punkty):
            # 4. Sprawdź czy okno nie zasłania PRZED KAŻDYM kliknięciem (na wypadek misclicka)
            sprawdz_i_zamknij_okno()
            
            print(f"    [{i+1}/{len(punkty)}] Klikam ({p_x}, {p_y})")
            pyautogui.moveTo(p_x + CLICK_OFFSET_X, p_y + CLICK_OFFSET_Y, duration=0.1)
            pyautogui.click()
            time.sleep(ACTION_DELAY)
    else:
        print(" [-] Brak znajdziek w tym widoku.")
    return len(punkty)

def uruchom_auto_cykl():
    print("\n--- AUTO-CYKL (Widoki 1-9) ---")
    ile_petli = input("Ile okrążeń wyspy? (0 dla ∞) > ") or "0"
    ile_petli = int(ile_petli)
    
    print("\nUWAGA: Bot ruszy za 3 sekundy. Przejdź do okna gry!")
    time.sleep(3)
    
    licznik_petli = 0
    try:
        while True:
            licznik_petli += 1
            print(f"\n>>> ROZPOCZYNAM OKRĄŻENIE #{licznik_petli} <<<")
            suma = 0
            for klawisz in "123456789":
                suma += obsłuż_widok(klawisz)
            if ile_petli > 0 and licznik_petli >= ile_petli:
                break
            print(f"Suma w cyklu: {suma}. Oddech 3s...")
            time.sleep(3)
    except pyautogui.FailSafeException:
        print("\n[!!!] AWARYJNE ZATRZYMANIE!")

def uruchom_klikera():
    print("====================================")
    print(" TSO PINKY CLICKER v3.0 (DirectInput)")
    print("====================================")
    print("Wybierz tryb:")
    print(" [1] TEST (Podgląd maski)")
    print(" [2] OSTRE (Ten widok)")
    print(" [3] AUTO-CYKL (1-9)")
    
    wybor = input("> Wybór: ")
    if wybor == "1":
        print("Skan za 2s...")
        time.sleep(2)
        screenshot = pyautogui.screenshot()
        img = cv2.cvtColor(np.array(screenshot), cv2.COLOR_RGB2BGR)
        mask = stworz_maske_koloru(img)
        punkty = znajdz_znajdki(mask)
        for (x, y) in punkty:
            cv2.circle(img, (x, y), 10, (0, 255, 0), 2)
        cv2.imshow("TEST", img)
        cv2.waitKey(0)
    elif wybor == "2":
        time.sleep(2)
        obsłuż_widok()
    elif wybor == "3":
        uruchom_auto_cykl()

if __name__ == "__main__":
    pyautogui.FAILSAFE = True
    try:
        uruchom_klikera()
    except Exception as e:
        print(f"Błąd: {e}")
    finally:
        input("\n--- KONIEC (ENTER) ---")
