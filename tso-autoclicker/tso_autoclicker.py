import pyautogui
import time
import os
import sys

# ===============================================================
# KONFIGURACJA BOTA
# ===============================================================
START_DELAY = 3        # Czas po uruchomieniu skryptu na przełączenie okna (w sek.)
ACTION_DELAY = 1.2     # Pauza po każdym kliknięciu aby gra nadążyła renderować
SCROLL_AMOUNT = -300   # O ile piktogramów w dół przeskrolować menu przy jednym ruchu kółkiem
CONFIDENCE = 0.85      # Czułość rozpoznywania (1.0 = idealnie, 0.8 = dopuszcza filtry/rozmycie)

# Definicje dostępnych dla bota obrazków rodzajów odkrywców do poszukiwania.
# Będziesz musiał wyciąć po jednej ikonie (avatarze) dla każdego rodzaju odkrywcy i zapisać w .png
KATEGORIE_ODKRYWCOW = {
    "1": {"nazwa": "Zwykli Odkrywcy", "pliki": ["zwykly_odkrywca.png"]},
    "2": {"nazwa": "Szczęśliwi Odkrywcy", "pliki": ["szczesliwy_odkrywca.png"]},
    "3": {"nazwa": "Nieustraszeni Odkrywcy", "pliki": ["nieustraszony_odkrywca.png"]},
    "4": {"nazwa": "Puszystki / Śnieżni", "pliki": ["sniezny_odkrywca.png"]},
    # "Wszyscy" iteruje przez cały zweryfikowany zbiór obrazków
}

def pobierz_liste_wszystkich_zdjec():
    wszystkie = []
    for kat in KATEGORIE_ODKRYWCOW.values():
        wszystkie.extend(kat["pliki"])
    return wszystkie

def center_mouse_on_star_menu(pozycja_gwiazdy):
    """
    Kieruje myszkę trochę nad gwiazdę w pole z avatarami, aby Scroll działał poprawnie.
    """
    pyautogui.moveTo(pozycja_gwiazdy.x, pozycja_gwiazdy.y - 200, duration=0.2)
    
def find_and_click(image_name, offset_x=0, offset_y=0, timeout=5, clicks=1):
    """Szuka konkretnego obrazka i ewentualnie go klika."""
    if not os.path.exists(image_name):
        return False

    start_time = time.time()
    while True:
        try:
            pos = pyautogui.locateCenterOnScreen(image_name, confidence=CONFIDENCE, grayscale=True)
            if pos is not None:
                pyautogui.moveTo(pos.x + offset_x, pos.y + offset_y, duration=0.2, tween=pyautogui.easeInOutQuad)
                time.sleep(0.1)
                pyautogui.click(clicks=clicks)
                time.sleep(ACTION_DELAY)
                return pos
        except pyautogui.ImageNotFoundException:
            pass
            
        current_time = time.time()
        if current_time - start_time > timeout:
            return False
        time.sleep(0.3)

def scan_for_any_of_explorers(lista_plikow):
    """Szuka JAKIEGOKOLWIEK z podanych plików obrazków odkrywców i klika w pierwszy znaleziony."""
    for plik in lista_plikow:
        # Pomiń szukanie plików, których w ogóle nie stworzyłeś w folderze (zabezpieczenie)
        if not os.path.exists(plik):
            continue
            
        pozycja = find_and_click(plik, timeout=1) 
        if pozycja:
            return (plik, pozycja)
    return False

def wyslij_odkrywce(kategoria_obrazki, numer, menu_pos):
    """Proces wysyłania pojedynczego znalezionego odkrywcy"""
    print(f"\n--- Próba: {numer} ---")
    
    # Próba znalezienia Odkrywcy na ekranie. Jak nie ma, Scroll down!
    znaleziony_odkrywca = False
    proby_przewijania = 0
    max_przewiniec = 15 # Jak głęboko w menu dół ma zjeżdżać (zależnie ilu masz ludzi wgry)

    while not znaleziony_odkrywca and proby_przewijania < max_przewiniec:
        wynik = scan_for_any_of_explorers(kategoria_obrazki)
        if wynik:
            znaleziony_odkrywca = True
            nazwa_pliku, pos = wynik
            print(f"-> Znalazłem wolnego: [{nazwa_pliku}]")
        else:
            # Scroll Down! (Zakładamy, że jesteśmy w Gwieździe)
            print("-> Nie widzę na tej stronie. Przewijam Menu Gwiazdy o stopień w dół...")
            center_mouse_on_star_menu(menu_pos)
            pyautogui.scroll(SCROLL_AMOUNT)
            time.sleep(1.0) # Poczekaj na wczytanie ui po scrollu
            proby_przewijania += 1

    if not znaleziony_odkrywca:
        print("!!! Osiągnięto koniec menu lub brak wolnych podanych odkrywców !!!")
        return False
        
    # ------------- WYBÓR ZADAŃ (Przykład Poszukiwania) -------------
    # UWAGA: Te nazwy plików muszą być fizycznie w folderze skryptu!
    
    if not find_and_click('szukanie_skarbu.png', timeout=4):
        print("X Błąd: Nie odnaleziono przycisku wyboru np. Skarbu lub Przygody.")
        # Jeśli nie znalazł to odkrywca pewnie się zacina / coś zasłania.
        # Odkliknij zamykając podstronę X aby zresetować menu
        find_and_click('ikona_x_zamknij.png', timeout=1)
        return True # Próbuje przejść do kolejnego

    if not find_and_click('krotkie_poszukiwania.png', timeout=4):
        print("X Błąd: Nie odnaleziono przycisku 'Krótkich poszukiwań'.")
        find_and_click('ikona_x_zamknij.png', timeout=1)
        return True

    if not find_and_click('wyslij_zielony.png', timeout=4):
        print("X Błąd: Nie odnaleziono ZIELONEGO ZATWIERDZENIA.")
        find_and_click('ikona_x_zamknij.png', timeout=1)
        return True
       
    print(f"==> Wysłano Odkrywcę Pomyślnie! <==")
    return True

def uruchom_robocza_petle():
    print("====================================")
    print(" TSO Auto-Odkrywca + SCROLL + KATEGORIE")
    print("====================================")
    print("Jakich odkrywców mam wysłać? (Użyj klawiszy 1-4 lub 0)")
    for klucz, dane in KATEGORIE_ODKRYWCOW.items():
        print(f" [{klucz}] = {dane['nazwa']}")
    print(" [0] = Wszystkich Odkrywców jakich znajdziesz")
    
    wybor = input("> Wybór: ")
    
    obrazki_do_szukania = []
    if wybor == '0':
        obrazki_do_szukania = pobierz_liste_wszystkich_zdjec()
        print("Opcja: WYŚLIJ WSZYSTKICH WYMIENIONYCH!")
    elif wybor in KATEGORIE_ODKRYWCOW:
        obrazki_do_szukania = KATEGORIE_ODKRYWCOW[wybor]["pliki"]
        print(f"Opcja: {KATEGORIE_ODKRYWCOW[wybor]['nazwa']}")
    else:
        print("Zły wybór, startuję opcję domyślną [0] Wszyscy.")
        obrazki_do_szukania = pobierz_liste_wszystkich_zdjec()

    ile_powtorzen = int(input("\nMaksymalna ilość odkrywców tej grupy u Ciebie? (wpisz cyfrę) > ") or 10)
    
    print(f"\nPrzejdź do okna gry w ciągu {START_DELAY} sekund...")
    time.sleep(START_DELAY)
    
    for i in range(1, ile_powtorzen + 1):
        # Najpierw kliknij menu Gwiazdy by upewnić się, że to my jesteśmy jako 1. okienko na wierzchu.
        # Wiele klientów potrzebuje potwierdzenia przez ponowne kliknięcie.  
        pos = find_and_click('gwiazda.png', timeout=5)
        if not pos:
            print("KRYTYCZNE: Nie znalazłem elementu Menu Gwiazdy na ekranie! Kończę pracę.")
            break
            
        time.sleep(1) # sekunda na uniesienie panelu
            
        # Przeprowadź proces wysyłki na pojedynczym Odkrywcy dla obecnej Iteracji.
        sukces = wyslij_odkrywce(obrazki_do_szukania, i, pos)
        if not sukces:
            # False oznacza brak w ogóle odkrywców na liście do scrola
            break

if __name__ == "__main__":
    pyautogui.FAILSAFE = True
    print("\nINFO: Aby natychmiast zatrzymać - pociągnij myszkę do któregoś rogu monitora!!!\n")
    try:
        uruchom_robocza_petle()
        print("\nPraca zakończona.")
    except KeyboardInterrupt:
        print("\nPrzerwane ręcznie.")
    except pyautogui.FailSafeException:
        print("\n\n[!!!] BEZPIECZNIK AWARYJNY AKTYWOWANY [!!!] Bot Zatrzymał Się!")
    except Exception as e:
        print(f"\nBłąd bota! {e}")
