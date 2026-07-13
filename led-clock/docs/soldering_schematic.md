# Schemat Połączeń Bezpośrednich (Bez PCB)

Poniższy dokument przedstawia dokładny opis bezpośredniego łączenia przewodów (lutowania "w pająka" z użyciem koszulek termokurczliwych) dla kompletnego zestawu komponentów sterujących zegarem LED.

Zasilacz impulsowy 5V 10A jest zamontowany w odległości, aby nie wywoływał zakłóceń elektromagnetycznych (EMI/RF) w pracy modułu bezprzewodowego oraz czujników.

> [!IMPORTANT]
> **Analiza Roli Przekaźnika (Sterowanie Buzzerem):**
> Mikrokontroler ESP8266 (WeMos D1 Mini) na swoich pinach wejścia/wyjścia (GPIO) operuje na napięciu **3.3V** o bardzo małym maksymalnym prądzie (ok. 12mA na pin). 
> Podłączenie głośnego buzzera 5V bezpośrednio pod pin ESP skutkuje bardzo cichym dźwiękiem (lub całkowitym brakiem działania) i przeciąża port procesora. 
> **Rozwiązanie:** Używamy przekaźnika 1-kanałowego jako klucza. Pin sterujący ESP (`D8`) przełącza wejście przekaźnika (`IN1`), a przekaźnik zwiera pełną linię **5V** bezpośrednio do buzzera. Dzięki temu buzzer zasilany jest pełną mocą i działa z maksymalną głośnością.

---

## 1. Wykaz wyprowadzeń i połączeń (Pinout)

Sterowanie opiera się na mikrokontrolerze **WeMos D1 Mini** (ESP8266). Poniżej znajduje się schemat połączeń dla wszystkich modułów:

| Nazwa Komponentu | Pin na WeMos D1 Mini | Typ sygnału | Rola / Cel połączenia |
| :--- | :--- | :--- | :--- |
| **Pasek LED Górny (Zegar)** | `D5` (GPIO14) | Wyjście cyfrowe | Poprzez rezystor 330 $\Omega$ do `DIN` taśmy górnej |
| **Pasek LED Dolny (Wyniki)** | `D7` (GPIO13) | Wyjście cyfrowe | Poprzez rezystor 330 $\Omega$ do `DIN` taśmy dolnej |
| **Zegar RTC DS3231 (SDA)** | `D2` (GPIO4) | Magistrala I2C | Dane czasu rzeczywistego (podtrzymanie bateryjne) |
| **Zegar RTC DS3231 (SCL)** | `D1` (GPIO5) | Magistrala I2C | Taktowanie szyny danych czasu |
| **Sensor Temp. DS18B20** | `D6` (GPIO12) | Magistrala 1-Wire | Odczyt temperatury (płytka posiada rezystor pull-up) |
| **Moduł przekaźnika (IN1)** | `D8` (GPIO15) | Wyjście cyfrowe | Sterowanie cewką przekaźnika (załączanie buzzera) |
| **Zasilanie komponentów** | `5V` (zasilacz) | Zasilanie główne | Zasilanie 5V do WeMos, RTC, cewki przekaźnika i styków roboczych |
| **Zasilanie sensora temp.** | `3V3` (z WeMosa) | Zasilanie pomocnicze| Zasilanie czujnika temperatury stabilnym napięciem 3.3V |
| **Masa Wspólna** | `GND` / `G` | Masa (GND) | Połączenie mas wszystkich modułów i pasków LED |

---

## 2. Graficzny schemat połączeń bezpośrednich (Wiring Diagram)

Poniższy rysunek przedstawia przejrzysty schemat połączeń wszystkich komponentów z płytek sterujących, sensora temperatury, modułu zegara podtrzymującego RTC DS3231, przekaźnika oraz zasilacza 5V 10A:

![Kompletny czytelny schemat połączeń bezpośrednich](C:\Users\dabro\.gemini\antigravity\brain\452313a3-fbeb-4282-9a3a-5c8adb1e4b4e\clear_wiring_schematic_fixed_1783958308276.png)

---

## 3. Instrukcja Montażu Krok po Kroku (Lutowanie bezpośrednie)

> [!IMPORTANT]
> **Izolowanie połączeń:** Zawsze nakładaj rurki termokurczliwe na przewody przed lutowaniem. Ponieważ wszystkie moduły lutujemy bezpośrednio "w pająku", izolowanie odsłoniętych lutów zapobiegnie powstawaniu zwarć wewnątrz ciasnej obudowy.

### Krok 1: Węzeł zasilania 5V i kondensator
1. Weź wyjście zasilacza (+5V i GND). Zlutuj kondensator elektrolityczny **1000 $\mu$F** bezpośrednio na linii zasilania 5V z zasilacza (dłuższa nóżka do plusa, krótsza z szarym paskiem do minusa GND).
2. Od pinu dodatniego kondensatora odprowadź przewody zasilające do:
   * Pinu **5V** na płytce WeMos D1 Mini.
   * Pinu **VCC** modułu zegara RTC DS3231.
   * Pinu **VCC** modułu przekaźnika (Relay).
   * Styku wspólnego (**COM**) na złączu śrubowym przekaźnika.
   * Linii zasilających **+5V** obu pasków LED.
3. Od pinu ujemnego kondensatora odprowadź przewody masowe do:
   * Pinu **GND / G** na płytce WeMos D1 Mini.
   * Pinu **GND** modułu zegara RTC DS3231.
   * Pinu **GND** modułu przekaźnika (Relay).
   * Pinu ujemnego (-) buzzera piezoelektrycznego.
   * Pinu **GND** modułu sensora temperatury DS18B20.
   * Linii masowych **GND** obu pasków LED.

### Krok 2: Podłączenie modułu RTC DS3231
Zegar RTC DS3231 pozwala utrzymać dokładną godzinę bez dostępu do Internetu.
1. Przylutuj pin **SDA** modułu RTC do pinu **D2** na WeMos D1 Mini.
2. Przylutuj pin **SCL** modułu RTC do pinu **D1** na WeMos D1 Mini.

### Krok 3: Podłączenie czujnika temperatury DS18B20
Czujnik temperatury zintegrowany jest na płytce z własnym rezystorem podciągającym (pull-up), dzięki czemu wymaga tylko bezpośredniego połączenia.
1. Przylutuj pin **VCC** czujnika do pinu **3V3** na WeMos D1 Mini.
2. Przylutuj pin **DQ** (dane) czujnika bezpośrednio do pinu **D6** na WeMos D1 Mini.

### Krok 4: Połączenie Buzzera przez Przekaźnik
Buzzer zasilany jest pełnym napięciem 5V poprzez styki przekaźnika.
1. Przylutuj pin **IN1** (wejście sterujące cewki przekaźnika) bezpośrednio do pinu **D8** (GPIO15) na WeMos D1 Mini.
2. Podłącz styk normalnie otwarty (**NO**) przekaźnika do nóżki dodatniej ( oznaczonej jako **+** ) buzzera.
3. Nóżkę ujemną (-) buzzera połącz z masą wspólną **GND**.

### Krok 5: Linie danych pasków LED (D5, D7)
1. Przylutuj rezystor **330 $\Omega$** szeregowo do pinu **D5** na WeMos D1 Mini. Drugi koniec rezystora połącz z linią sygnałową danych `DIN` pierwszego segmentu górnego paska LED (Zegar).
2. Przylutuj drugi rezystor **330 $\Omega$** szeregowo do pinu **D7** na WeMos D1 Mini. Drugi koniec rezystora połącz z linią sygnałową danych `DIN` dolnego paska LED (Wyniki).

---

## 4. Schemat Blokowy Przepływu Zasilania i Sygnałów

```
                          +-----------------------------+
                          |      Zasilacz 5V 10A        |
                          +------+---------------+------+
                                 |               |
                                 | +5V           | GND
                                 v               v
                           ======[ Szyna Zasilania 5V/GND ]======
                                /                 \
           +-------------------+                   +---------------+
           |                                                       |
           |    +-------------------------------------------+      |
           |    |            WeMos D1 Mini (ESP8266)        |      |
           |    |                                           |      |
           +--->| 5V                                     GND|<-----+
                | 3V3  D0   D1   D2   D5   D6   D7   D8     |
                +-+-+-+--+--+-+--+-+--+-+--+-+--+-+--+-+----+
                  | |    | |  | |  | |  | |  | |  | |  | |
                  | |    | |  | |  | |  | |  | |  | |  +-------> Relay (IN1)
                  | |    | |  | |  | |  | |  | |  +------------> [R 330R] -> DIN Dolny LED
                  | |    | |  | |  | |  | |  +-----------------> Sensor Temp. (DQ)
                  | |    | |  | |  | |  +----------------------> [R 330R] -> DIN Górny LED
                  | |    | |  | |  +---------------------------> RTC DS3231 (SDA)
                  | |    | |  +--------------------------------> RTC DS3231 (SCL)
                  | |    +-------------------------------------> [Nie używany D0]
                  | +----------------------------------------> Sensor Temp. (VCC 3.3V)
                  
                  
       +======================================+
       |   OBWÓD STEROWANIA BUZZEREM (5V):    |
       |                                      |
       |  5V (Szyna) ---> [Relay COM]         |
       |  [Relay NO] ---> Buzzer (+)          |
       |  Buzzer (-) ---> GND                 |
       +======================================+
```

> [!TIP]
> **Minimalizacja zakłóceń (EMI):** Stosując grube przewody zasilające ($1.5\text{ mm}^2$) oraz kondensator elektrolityczny $1000\ \mu\text{F}$ bardzo blisko złącza zasilania na płytce sterującej, skutecznie wygładzasz tętnienia prądu wywoływane przez szybkie przełączanie diod PWM w paskach WS2812B. Oddalenie zasilacza impulsowego dodatkowo eliminuje zakłócenia radiowe (RF), które mogłyby pogarszać zasięg anteny WiFi w ESP.


> [!TIP]
> **Minimalizacja zakłóceń (EMI):** Stosując grube przewody zasilające ($1.5\text{ mm}^2$) oraz kondensator elektrolityczny $1000\ \mu\text{F}$ bardzo blisko złącza zasilania na płytce sterującej, skutecznie wygładzasz tętnienia prądu wywoływane przez szybkie przełączanie diod PWM w paskach WS2812B. Oddalenie zasilacza impulsowego dodatkowo eliminuje zakłócenia radiowe (RF), które mogłyby pogarszać zasięg anteny WiFi w ESP.
