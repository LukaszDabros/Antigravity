import pyautogui
import time
import os
import sys
import urllib.request
import urllib.error

# ===============================================================
# KONFIGURACJA BOTA
# ===============================================================
START_DELAY = 5        # Zwiększono do 5 sekund byś miał spokojnie czas przełączyć okno na pełen ekran
ACTION_DELAY = 0.4     # Po kliknięciach (Skarb/Wariant/Wyślij) czekamy tylko 0.4s by przyspieszyć
# Scroll amount używane teraz jako pojedyncze mocne kliknięcie (ale zapętlone)
CONFIDENCE = 0.85      # Przywrócono do 0.85, żeby BOT nie pomylił i nie kliknął wyszarzonego (wysłanego) zwiadowcy!
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

# Adres repozytorium/gita z którego skrypt ma automatycznie pobierać brakujące grafiki (Wersja 1)
# TUTAJ WSTAW DOCELOWY ZDALNY ADRES PACZKI Z GRAFIKAMI, gdy go założysz (np. na GitHub)
ASSETS_BASE_URL = "https://raw.githubusercontent.com/TWOJ_GITHB/tso-bot-assets/main/"

# Zdefiniowane stałe elementy UI do pobrania
UI_ELEMENTY = [
    "gwiazda.png",
    "szukanie_skarbu.png",
    "przedluzone_poszukiwania.png",
    "wyslij_zielony.png",
    "ikona_x_zamknij.png",
    "pinezka.png",
    "pinezka_on.png"
]

# Definicje dostępnych dla bota obrazków rodzajów odkrywców do poszukiwania.
# Będziesz musiał wyciąć po jednej ikonie (avatarze) dla każdego rodzaju odkrywcy i zapisać w .png
KATEGORIE_ODKRYWCOW = {
    "1": {"nazwa": "Zwykli / Tawerniani", "pliki": ["zwykly_odkrywca.png"]},
    "2": {"nazwa": "Szczęśliwi", "pliki": ["szczesliwy_odkrywca.png"]},
    "3": {"nazwa": "Nieustraszeni", "pliki": ["nieustraszony_odkrywca.png"]},
    "4": {"nazwa": "Puszystki / Śnieżni", "pliki": ["sniezny_odkrywca.png"]},
    "5": {"nazwa": "Zakochani", "pliki": ["zakochany_odkrywca.png"]},
    "6": {"nazwa": "Śmiali", "pliki": ["smialy_odkrywca.png"]},
    "7": {"nazwa": "Odważni", "pliki": ["odwazny_odkrywca.png"]},
    "8": {"nazwa": "Zuchwali", "pliki": ["zuchwaly_odkrywca.png"]},
    "9": {"nazwa": "Uroczy", "pliki": ["uroczy_odkrywca.png"]},
    "10": {"nazwa": "Bystrzy", "pliki": ["bystry_odkrywca.png"]},
    "11": {"nazwa": "Przestraszeni", "pliki": ["przestraszony_odkrywca.png"]},
    "12": {"nazwa": "Pokorni", "pliki": ["pokorny_odkrywca.png"]},
    "13": {"nazwa": "Romantyczni", "pliki": ["romantyczny_odkrywca.png"]},
    # "Wszyscy" iteruje przez całą tę listę w poszukiwaniu jakiegokolwiek zdjęcia, które wyciąłeś
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
    full_path = os.path.join(SCRIPT_DIR, image_name)
    
    if not os.path.exists(full_path):
        print(f" [!!!] KRYTYCZNY BŁĄD: Plik obrazka nie istnieje na dysku: '{full_path}'")
        print(f"       Upewnij się, że wycięty plik ma dokładnie nazwę '{image_name}' bez ukrytych podwójnych rozszerzeń np. .png.png")
        return False

    start_time = time.time()
    while True:
        try:
            # grayscale=False by kolory miały znaczenie (np. złota gwiazda), zmniejszona confidence
            pos = pyautogui.locateCenterOnScreen(full_path, confidence=CONFIDENCE, grayscale=False)
            if pos is not None:
                print(f" [+] Znalazłem '{image_name}' na kordach: {pos.x}, {pos.y}")
                pyautogui.moveTo(pos.x + offset_x, pos.y + offset_y, duration=0.2, tween=pyautogui.easeInOutQuad)
                time.sleep(0.1)
                pyautogui.click(clicks=clicks)
                time.sleep(ACTION_DELAY)
                return pos
        except pyautogui.ImageNotFoundException:
            pass
            
        current_time = time.time()
        if current_time - start_time > timeout:
            komunikat = f"Nie mogłem znaleźć obrazka: '{image_name}' na ekranie po {timeout} sekundach."
            print(f" [-] Timeout! {komunikat}")
            # Widoczne okienko na wierzchu ekranu!
            pyautogui.alert(text=f"Brak Kalibracji lub obrazek został przysłonięty:\n\n{image_name}\n\nSprawdź, czy okno gry jest na pewno na wierzchu i czy ten obrazek faktycznie na nim teraz widać.", title="Błąd TSO Auto-Odkrywca")
            return False
        time.sleep(0.1) # Skróciliśmy z 0.3 na 0.1, dzięki temu jeśli przycisk zlaguje, bot kliknie go od razu jak tylko mignie!

def scan_for_any_of_explorers(lista_plikow):
    """Szybkie błyskawiczne sprawdzenie wszystkich dostępnych plików bez czekania (timeout) by przyspieszyć scroll."""
    for plik in lista_plikow:
        # Pomiń szukanie plików, których w ogóle nie stworzyłeś w folderze (zabezpieczenie)
        full_path = os.path.join(SCRIPT_DIR, plik)
        if not os.path.exists(full_path):
            continue
            
        try:
            pos = pyautogui.locateCenterOnScreen(full_path, confidence=CONFIDENCE, grayscale=False)
            if pos is not None:
                print(f" [+] Skan Szybki znalazł: '{plik}'")
                pyautogui.moveTo(pos.x, pos.y, duration=0.1, tween=pyautogui.easeInOutQuad)
                time.sleep(0.2) # Dajmy mu ułamek sekundy na reakcję UI po najechaniu
                pyautogui.click()
                time.sleep(ACTION_DELAY + 0.5) # Poszukiwacz często otwiera menu ciut wolniej, z dużym lagiem od serwera
                return (plik, pos)
        except pyautogui.ImageNotFoundException:
            pass
            
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
            print("-> Nie widzę na tej stronie. Przewijam Menu Gwiazdy w dół (TURBO)...")
            center_mouse_on_star_menu(menu_pos)
            # W przeglądarowych grach WebGL wielki scroll bywa ignorowany. Symulujemy ostre, 4-krotne pokręcenie kółkiem myszy
            for _ in range(4):
                pyautogui.scroll(-500)
                time.sleep(0.02)
            time.sleep(0.3) # BARDZO krótkie oczekiwanie po scrollnięciu (przyspieszone)
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

    if not find_and_click('przedluzone_poszukiwania.png', timeout=4):
        print("X Błąd: Nie odnaleziono przycisku 'Przedłużonych poszukiwań'.")
        find_and_click('ikona_x_zamknij.png', timeout=1)
        return True

    if not find_and_click('wyslij_zielony.png', timeout=4):
        print("X Błąd: Nie odnaleziono ZIELONEGO ZATWIERDZENIA.")
        find_and_click('ikona_x_zamknij.png', timeout=1)
        return True
       
    print(f"==> Wysłano Odkrywcę Pomyślnie! <==")
    
    # Bardzo ważny serwerowy LAG. Gra ma opóźnienie, w którym chłopek zmienia się na szaro. DAJEMY grze równe 2.0 sekundy!
    time.sleep(2.0)
    return True

def sprawdz_i_pobierz_grafiki():
    """Wersja 1: Automatyczne pobieranie brakujących obrazków (Avatary + Interfejs)"""
    print("====================================")
    print(" SZYBKI START (Wersja 1: Auto-Pobieranie Obrazków)")
    print("====================================")
    
    brakujace = []
    wszystkie_potrzebne = pobierz_liste_wszystkich_zdjec() + UI_ELEMENTY
    
    for plik in wszystkie_potrzebne:
        full_path = os.path.join(SCRIPT_DIR, plik)
        if not os.path.exists(full_path):
            brakujace.append(plik)
            
    if not brakujace:
        print("Wszystkie grafiki (.png) są gotowe do pracy na dysku. Pomijam pobieranie.")
        return True
        
    print(f"Brakuje {len(brakujace)} plików (.png). Próbuję pobrać z chmury...")
    
    for plik in brakujace:
        url = ASSETS_BASE_URL + plik
        print(f"Pobieranie {plik} ...", end=" ")
        try:
            # Tworzymy zapytanie wyglądające jak przeglądarka
            req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
            out_path = os.path.join(SCRIPT_DIR, plik)
            with urllib.request.urlopen(req, timeout=5) as response, open(out_path, 'wb') as out_file:
                out_file.write(response.read())
            print("[OK]")
        except urllib.error.URLError as e:
            print(f"[BŁĄD]")
            print(f"(!) Nie udało się pobrać pliku {plik}. Błąd: {e}")
            print("(!) Upewnij się, że ASSETS_BASE_URL wskazuje na poprawne otwarte repozytorium!")
            return False
        except Exception as e:
            print(f"[BŁĄD SYSTEMOWY] {e}")
            return False
            
    print("Zakończono proces przygotowywania grafik!\n")
    return True

def uruchom_robocza_petle():
    if not sprawdz_i_pobierz_grafiki():
        print("\nOstrzeżenie: Nie pobrano wszystkich grafik. Bot może nie działać prawidłowo.")
        print("Zaktualizuj link ASSETS_BASE_URL w kodzie skryptu do swojej żywej bazy kalibracji.\n")
        
    print("====================================")
    print(" TSO Auto-Odkrywca + SCROLL + KATEGORIE")
    print("====================================")
    print("Jakich odkrywców mam wysłać? (Użyj cyfry lub 0 dla wszystkich)")
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

    ile_powtorzen_input = input("\nMaksymalna ilość odkrywców na ekranie do wydelegowania?\n (Wpisz cyfrę N, albo '0' aby wysyłać bez limitu poki gra na to pozwala) > ") or "0"
    if ile_powtorzen_input == "0" or not ile_powtorzen_input.isdigit():
        ile_powtorzen = 999
        print(" Opcja do oporu: Skrypt zatrzyma się samoczynnie dopiero na dnie scrolla jak braknie chłopków.")
    else:
        ile_powtorzen = int(ile_powtorzen_input)
    
    print(f"\nPrzejdź do okna gry w ciągu {START_DELAY} sekund...")
    time.sleep(START_DELAY)
    
    # Krok 0. Najpierw kliknij menu Gwiazdy JEDEN RAZ by upewnić się, że to my jesteśmy jako 1. okienko na wierzchu i otworzyć okno
    print("\nOtwieram Menu Gwiazdy...")
    pos = find_and_click('gwiazda.png', timeout=5)
    if not pos:
        print("KRYTYCZNE: Nie znalazłem elementu Menu Gwiazdy na ekranie! Kończę pracę.")
        return
        
    time.sleep(1.5) # sekunda na uniesienie panelu
    
    # Krok 1 (Opcjonalny). Przypięcie okna za pomocą Pinezki
    print("\nSprawdzam status Pinezki okna...")
    pinezka_on_path = os.path.join(SCRIPT_DIR, 'pinezka_on.png')
    pinezka_off_path = os.path.join(SCRIPT_DIR, 'pinezka.png')
    
    juz_przypieta = False
    # Najpierw szukamy wciśniętej pinezki
    if os.path.exists(pinezka_on_path):
        try:
            if pyautogui.locateCenterOnScreen(pinezka_on_path, confidence=0.8, grayscale=False):
                print(" [+] Znaleziono PIN-ON (Pinezka jest już wciśnięta! Zostawiam menu otwarte).")
                juz_przypieta = True
        except pyautogui.ImageNotFoundException:
            pass

    # Jeżeli nie jest przypięta, szukamy pinezki odpiętej i ją klikamy
    if not juz_przypieta and os.path.exists(pinezka_off_path):
        try:
            pin_pos = pyautogui.locateCenterOnScreen(pinezka_off_path, confidence=0.8, grayscale=False)
            if pin_pos:
                print(" [+] Znalazłem PIN-OFF (wolną Pinezkę)! Przypinam okno.")
                pyautogui.moveTo(pin_pos.x, pin_pos.y, duration=0.2)
                pyautogui.click()
                time.sleep(0.5)
            else:
                print(" [-] Pinezka niewidoczna na ekranie.")
        except pyautogui.ImageNotFoundException:
            pass
    elif not juz_przypieta:
        print(" [!] Opcja pinezki zignorowana (brak wyciętych plików 'pinezka.png' na dysku). Działam dalej.")
        
    for i in range(1, ile_powtorzen + 1):
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
    finally:
        input("\n[ Naciśnij ENTER, aby zamknąć to okienko... ]")
