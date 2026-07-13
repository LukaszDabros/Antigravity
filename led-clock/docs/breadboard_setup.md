# Montaż na Płytce Stykowej i Pierwsze Uruchomienie

Poniższa instrukcja krok po kroku opisuje, jak połączyć wszystkie posiadane elementy na standardowej płytce stykowej (testowej) o długości 60 rzędów w celu przetestowania działania układu przed ostatecznym lutowaniem. Zawiera również procedurę bezpiecznego programowania mikrokontrolera przez port USB oraz konfigurację sieci WiFi ze smartfona.

---

## 1. Schemat Połączeń na Płytce Stykowej

Wykorzystujemy standardową płytkę stykową (widoczną na Twoim zdjęciu).
*   **Szyna czerwona (+)** to główna linia zasilania **+5V**.
*   **Szyna niebieska (-)** to wspólna linia masy **GND**.

### Krok 1: Wpięcie mikrokontrolera (WeMos D1 Mini)
Płytka WeMos D1 Mini ma szeroki rozstaw nóżek (0.8 cala). Wepnij ją okrakiem nad centralną rynienką w rzędy **od 15 do 22**:
*   **Lewa strona WeMosa** (RST, A0, D0, D5, D6, D7, D8, 3V3) musi wejść w **kolumnę B** (rzędy 15-22). Szeroka obudowa zasłoni kolumny C, D i E. Wolny dostęp do tych pinów zyskujesz **wyłącznie w kolumnie A** (rząd 15-22).
*   **Prawa strona WeMosa** (TX, RX, D1, D2, D3, D4, G, 5V) musi wejść w **kolumnę I** (rzędy 15-22). Obudowa zasłoni kolumny F, G i H. Wolny dostęp do tych pinów zyskujesz **wyłącznie w kolumnie J** (rząd 15-22).

### Krok 2: Połączenia zasilania i kondensatora
1.  Wepnij **kondensator elektrolityczny 1000 µF** bezpośrednio w szyny zasilające na skraju płytki:
    *   Dłuższą nóżkę (+) wepnij do czerwonej szyny **(+)**.
    *   Krótszą nóżkę (-) (z paskiem z minusem) wepnij do niebieskiej szyny **(-)**.
2.  Połącz zasilanie WeMosa z szynami:
    *   Poprowadź przewód z czerwonej szyny **(+)** do rzędu **22, kolumna J** (łączy się z pinem **5V** WeMosa).
    *   Poprowadź przewód z niebieskiej szyny **(-)** do rzędu **21, kolumna J** (łączy się z pinem **G** / GND WeMosa).

### Krok 3: Wpięcie i podłączenie modułów

#### A. Zegar czasu rzeczywistego (DS3231 RTC)
Wepnij moduł DS3231 w rzędy **od 30 do 35 w kolumnie C**:
*   Pin **VCC** (rząd 34) $\rightarrow$ przewód do czerwonej szyny **(+)**.
*   Pin **GND** (rząd 35) $\rightarrow$ przewód do niebieskiej szyny **(-)**.
*   Pin **SDA** (rząd 33) $\rightarrow$ przewód do rzędu **18, kolumna J** (łączy się z pinem **D2** WeMosa).
*   Pin **SCL** (rząd 32) $\rightarrow$ przewód do rzędu **17, kolumna J** (łączy się z pinem **D1** WeMosa).

#### B. Czujnik temperatury (DS18B20)
Wepnij 3-pinową płytkę czujnika w rzędy **od 40 do 42 w kolumnie C**:
*   Pin **VCC** (rząd 40) $\rightarrow$ przewód do rzędu **22, kolumna A** (łączy się z pinem **3V3** WeMosa dla zasilania 3.3V).
*   Pin **DQ** (rząd 41) $\rightarrow$ przewód do rzędu **19, kolumna A** (łączy się z pinem **D6** WeMosa).
*   Pin **GND** (rząd 42) $\rightarrow$ przewód do niebieskiej szyny **(-)**.

#### C. Przekaźnik i Buzzer Piezo (Sterowanie dźwiękiem)
1.  Wepnij piny sterujące przekaźnika (`VCC`, `IN1`, `GND`) w rzędy **od 48 do 50 w kolumnie C**:
    *   Pin **VCC** (rząd 48) $\rightarrow$ przewód do czerwonej szyny **(+)**.
    *   Pin **IN1** (rząd 49) $\rightarrow$ przewód do rzędu **17, kolumna A** (łączy się z pinem **D0** WeMosa).
    *   Pin **GND** (rząd 50) $\rightarrow$ przewód do niebieskiej szyny **(-)**.
2.  Złącze śrubowe przekaźnika (po prawej stronie płytki przekaźnika):
    *   Do zacisku **COM** doprowadź przewód z czerwonej szyny **(+)**.
    *   Do zacisku **NO** podłącz przewód idący bezpośrednio do dodatniej nóżki **(+)** buzzera.
3.  Buzzer piezoelektryczny wciśnij w wolne rzędy na płytce (np. **54** i **56**):
    *   Rząd 54 (nóżka dodatnia `+` z naklejką) $\rightarrow$ podłączona do zacisku **NO** przekaźnika.
    *   Rząd 56 (nóżka ujemna) $\rightarrow$ przewód do niebieskiej szyny **(-)**.

#### D. Paski LED (WS2812B)
1.  Zasilanie pasków LED (czerwone i czarne przewody z obu taśm) podłącz równolegle bezpośrednio do szyn zasilania płytki stykowej (czerwona szyna dla +5V, niebieska szyna dla GND).
2.  Podłączenie linii danych z rezystorami ochronnymi:
    *   Wepnij rezystor **330 Ω** pomiędzy rząd **18, kolumnę A** (łączy się z pinem **D5** WeMosa) a wolny rząd **25**. Z rzędu 25 wyprowadź przewód danych do linii `DIN` górnego paska LED.
    *   Wepnij drugi rezystor **330 Ω** pomiędzy rząd **20, kolumnę A** (łączy się z pinem **D7** WeMosa) a wolny rząd **27**. Z rzędu 27 wyprowadź przewód danych do linii `DIN` dolnego paska LED.

---

## 2. Instrukcja Programowania krok po kroku

> [!CAUTION]
> **Zasada jednego źródła zasilania:** Podczas podłączania WeMosa kablem USB do komputera w celu zaprogramowania, **zewnętrzny zasilacz 5V 10A musi być całkowicie wyłączony i odłączony od szyn zasilania**. WeMosa zasilamy w tym momencie wyłącznie z portu USB. 
> Próba jednoczesnego zasilania z USB oraz zewnętrznego zasilacza połączonych na pinie 5V może trwale uszkodzić port USB Twojego komputera!

### Krok 1: Przygotowanie środowiska Arduino IDE
1.  Pobierz i zainstaluj program [Arduino IDE](https://www.arduino.cc/en/software).
2.  Dodaj obsługę ESP8266:
    *   Otwórz *Plik* $\rightarrow$ *Preferencje*.
    *   W polu *Dodatkowe adresy URL menedżera płytek* wklej:
        `http://arduino.esp8266.com/stable/package_esp8266com_index.json`
    *   Wejdź w *Narzędzia* $\rightarrow$ *Płytka* $\rightarrow$ *Menedżer płytek*, wyszukaj **esp8266** i zainstaluj najnowszą wersję.
3.  Wybierz płytkę: *Narzędzia* $\rightarrow$ *Płytka* $\rightarrow$ *ESP8266 Boards* $\rightarrow$ **LOLIN(WEMOS) D1 R2 & mini**.

### Krok 2: Instalacja wymaganych bibliotek
Wejdź w *Szkic* $\rightarrow$ *Dołącz bibliotekę* $\rightarrow$ *Zarządzaj bibliotekami*, a następnie wyszukaj i zainstaluj:
1.  **FastLED** (autorstwa Daniel Garcia).
2.  **RTClib** (autorstwa Adafruit) – do obsługi zegara RTC DS3231.
3.  **OneWire** (autorstwa Paul Stoffregen) – do komunikacji z czujnikiem temperatury.
4.  **DallasTemperature** (autorstwa Miles Burton) – do odczytu stopni Celsjusza.
5.  **ArduinoJson** (wersja 6.x lub 7.x, autorstwa Benoit Blanchon).
6.  **NTPClient** (autorstwa Taranais).
7.  **WiFiManager** (autorstwa tzapu).

### Krok 3: Wgranie programu do WeMos D1 Mini
1.  Odłącz zewnętrzny zasilacz 5V od szyn zasilających płytki stykowej.
2.  Podłącz WeMos D1 Mini kablem micro-USB bezpośrednio do komputera.
3.  Otwórz plik [`firmware/firmware.ino`](file:///c:/Users/dabro/.antigravity/led-clock/firmware/firmware.ino) w Arduino IDE.
4.  Wybierz odpowiedni port COM: *Narzędzia* $\rightarrow$ *Port* (wybierz numer portu przypisany do podłączonego WeMosa).
5.  Kliknij przycisk **Wgraj** (strzałka w prawą stronę w górnym menu). Odczekaj, aż kompilacja dobiegnie końca, a program zostanie przesłany (zobaczysz komunikat `Done uploading`).
6.  Po udanym wgraniu odłącz kabel USB od komputera.
7.  Teraz możesz bezpiecznie podłączyć zewnętrzny zasilacz 5V 10A do szyn płytki stykowej i uruchomić cały system.

---

## 3. Pierwsze Uruchomienie i Połączenie WiFi ze Smartfona

Zegar po wgraniu nowego programu nie ma zapisanych danych Twojej sieci domowej. Uruchomi się w trybie konfiguratora.

### Krok 1: Połączenie z punktem dostępowym zegara
1.  Włącz zasilanie układu. Buzzer powinien wydać krótkie powitalne piknięcie, a diody LED zaświecić na czerwono.
2.  Weź smartfon (Android lub iOS) i wejdź w ustawienia sieci WiFi.
3.  Wyszukaj nową otwartą sieć o nazwie **`LED-Clock-Setup`** i połącz się z nią.

### Krok 2: Konfiguracja sieci domowej
1.  Po połączeniu z siecią zegara na telefonie powinno automatycznie pojawić się okno przeglądarki z portalem konfiguracyjnym (jeśli nie wyskoczy automatycznie, otwórz przeglądarkę i wpisz adres: `192.168.4.1`).
2.  W portalu kliknij przycisk **Configure WiFi**.
3.  Zegar przeskanuje otoczenie i wyświetli listę dostępnych sieci WiFi. Wybierz swoją domową sieć i wpisz do niej hasło.
4.  Kliknij **Save** (Zapisz).
5.  Mikrokontroler zapisze hasło w pamięci flash, wyłączy sieć konfiguracji i połączy się z Twoim domowym routerem. Zegar zsynchronizuje czas przez NTP oraz zaktualizuje RTC.

### Krok 3: Sterowanie zegarem z telefonu
1.  Po połączeniu z domową siecią router przydzieli zegarowi lokalny adres IP (np. `192.168.1.150`).
2.  Aby poznać ten adres, możesz sprawdzić listę urządzeń podłączonych w panelu konfiguracyjnym Twojego routera (urządzenie będzie widoczne jako ESP/WeMos) lub podejrzeć go w Monitorze Portu Szeregowego w Arduino IDE podczas uruchomienia.
3.  Upewnij się, że Twój telefon jest podłączony do tej samej domowej sieci WiFi.
4.  Otwórz przeglądarkę w telefonie (Chrome, Safari itp.) i wpisz adres IP zegara (np. `http://192.168.1.150`).
5.  Wyświetli się wirtualny pulpit sterujący, z poziomu którego możesz na bieżąco przełączać tryby (Zegar / Stoper / Tabata), zmieniać kolory RGB, kontrolować rundy oraz zarządzać jasnością.
