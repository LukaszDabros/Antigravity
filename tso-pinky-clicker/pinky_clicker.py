import cv2
import numpy as np
import pyautogui
import time
import os

# ===============================================================
# KONFIGURACJA PINY CLICKER
# ===============================================================
# Kolor Magenta: #FF00FF (RGB 255, 0, 255)
# W OpenCV kolory są w formacie BGR, więc (255, 0, 255)
TARGET_COLOR_BGR = [255, 0, 255]
TOLERANCE = 20  # Jak bardzo kolor może się różnić od ideału

# Parametry klikania
ACTION_DELAY = 0.5  # Sekundy przerwy między kliknięciami
CLICK_OFFSET_X = 0   # Jeśli Pinky nie trafia w środek różu
CLICK_OFFSET_Y = 0

def stworz_maske_koloru(img):
    """Filtruje obraz pozostawiając tylko piksele w kolorze Magenta."""
    # Definiujemy zakres koloru (dolny i górny próg)
    lower = np.array([TARGET_COLOR_BGR[0] - TOLERANCE, 
                     TARGET_COLOR_BGR[1] - TOLERANCE, 
                     TARGET_COLOR_BGR[2] - TOLERANCE])
    upper = np.array([TARGET_COLOR_BGR[0] + TOLERANCE, 
                     TARGET_COLOR_BGR[1] + TOLERANCE, 
                     TARGET_COLOR_BGR[2] + TOLERANCE])
    
    # Przycina wartości do zakresu 0-255
    lower = np.clip(lower, 0, 255)
    upper = np.clip(upper, 0, 255)
    
    mask = cv2.inRange(img, lower, upper)
    return mask

def znajdz_znajdki(mask):
    """Zwraca listę punktów (x, y) czyli środków różowych plam."""
    # Znajdujemy kontury (wyspy koloru)
    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    punkty = []
    for cnt in contours:
        # Ignorujemy zbyt małe szumy (np. pojedynczy różowy piksel)
        if cv2.contourArea(cnt) > 2:
            # Liczymy środek ciężkości (Moment) konturu
            M = cv2.moments(cnt)
            if M["m00"] != 0:
                cX = int(M["m10"] / M["m00"])
                cY = int(M["m01"] / M["m00"])
                punkty.append((cX, cY))
    
    return punkty

def obsłuż_widok(numer_widoku=None):
    """Skanuje obecny widok i klika znalezione znajdki."""
    if numer_widoku:
        print(f"\n--- Widok [{numer_widoku}] ---")
        # Solidniejsze naciśnięcie klawisza (keyDown -> keyUp) dla gier WebGL
        pyautogui.keyDown(str(numer_widoku))
        time.sleep(0.1)
        pyautogui.keyUp(str(numer_widoku))
        time.sleep(0.5) # Wydłużone o 0.2s by mapa zdążyła się przesunąć
    
    # 1. Zrób zrzut
    screenshot = pyautogui.screenshot()
    img = cv2.cvtColor(np.array(screenshot), cv2.COLOR_RGB2BGR)
    
    # 2. Przetwórz obraz
    mask = stworz_maske_koloru(img)
    punkty = znajdz_znajdki(mask)
    
    if punkty:
        print(f" [+] Wykryto {len(punkty)} znajdziek.")
        # 3. Klikaj po kolei
        for i, (p_x, p_y) in enumerate(punkty):
            print(f"    [{i+1}/{len(punkty)}] Klikam ({p_x}, {p_y})")
            pyautogui.moveTo(p_x + CLICK_OFFSET_X, p_y + CLICK_OFFSET_Y, duration=0.1)
            pyautogui.click()
            time.sleep(ACTION_DELAY)
    else:
        print(" [-] Brak znajdziek w tym widoku.")
    return len(punkty)

def uruchom_auto_cykl():
    print("\n--- AUTO-CYKL (Widoki 1-9) ---")
    ile_petli = input("Ile pełnych okrążeń wyspy (1-9) mam wykonać? (Wpisz 0 dla nieskończoności) > ") or "1"
    ile_petli = int(ile_petli)
    
    print("\nUWAGA: Bot ruszy za 3 sekundy. Przejdź do okna gry!")
    time.sleep(3)
    
    # Krok 0. Fokusujemy okno klikając w bezpieczne miejsce (nieco niżej niż pasek adresu)
    # To sprawia, że przeglądarka 'podchwyci' naciśnięcia klawiszy 1-9
    screen_w, screen_h = pyautogui.size()
    pyautogui.click(screen_w // 2, 200) # Klik w 200px od góry (bezpieczniej niż 50px)
    time.sleep(0.5)
    
    licznik_petli = 0
    try:
        while True:
            licznik_petli += 1
            print(f"\n>>> ROZPOCZYNAM OKRĄŻENIE #{licznik_petli} <<<")
            
            suma_znalezionych = 0
            for klawisz in "123456789":
                suma_znalezionych += obsłuż_widok(klawisz)
            
            print(f"\nZakończono okrążenie. Znaleziono łącznie: {suma_znalezionych}")
            
            if ile_petli > 0 and licznik_petli >= ile_petli:
                print("\nWykonano zadaną liczbę okrążeń. Kończę.")
                break
                
            print("Chwila oddechu przed kolejnym okrążeniem (3s)...")
            time.sleep(3)
            
    except pyautogui.FailSafeException:
        print("\n[!!!] BEZPIECZNIK AWARYJNY: Machnąłeś myszką! Bot zatrzymany.")

def uruchom_klikera():
    print("====================================")
    print(" TSO PINKY CLICKER - AUTO-ZBIERACZ")
    print("====================================")
    print("Upewnij się, że Twoje znajdki są widoczne na mapie.")
    print("Wybierz tryb:")
    print(" [1] Tryb TEST (pokazuje co widzi bot - maska)")
    print(" [2] Tryb OSTRE (klikanie w obecnym widoku)")
    print(" [3] Tryb AUTO-CYKL (przełączanie 1-9 i zbieranie)")
    
    wybor = input("> Wybór: ")
    
    if wybor == "1":
        print("\nRobienie zrzutu... (masz 2 sekundy na przejście do gry)")
        time.sleep(2)
        screenshot = pyautogui.screenshot()
        img = cv2.cvtColor(np.array(screenshot), cv2.COLOR_RGB2BGR)
        mask = stworz_maske_koloru(img)
        punkty = znajdz_znajdki(mask)
        print(f"Znaleziono {len(punkty)} potencjalnych znajdziek.")
        for (x, y) in punkty:
            cv2.circle(img, (x, y), 10, (0, 255, 0), 2)
        cv2.imshow("TEST - Co widzi bot (punkty w zielonych kolkach)", img)
        cv2.waitKey(0)
        cv2.destroyAllWindows()
        
    elif wybor == "2":
        print("\nUWAGA: Bot ruszy za 3 sekundy. Przejdź do okna gry!")
        time.sleep(3)
        obsłuż_widok()
        print("\nKoniec zbierania tury.")
        
    elif wybor == "3":
        uruchom_auto_cykl()
    else:
        print("Nieprawidłowy wybór.")

if __name__ == "__main__":
    pyautogui.FAILSAFE = True
    try:
        uruchom_klikera()
    except Exception as e:
        print(f"Błąd: {e}")
    finally:
        input("\n[ Naciśnij ENTER, by zamknąć... ]")
