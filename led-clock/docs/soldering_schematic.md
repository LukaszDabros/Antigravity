# Schemat Połączeń Bezpośrednich (Pająk / Point-to-Point)

Poniższy dokument przedstawia dokładny opis bezpośredniego łączenia przewodów (lutowania "w pająka" z użyciem koszulek termokurczliwych) komponentów elektronicznych bez użycia płytki drukowanej (PCB/perfboard). Taki montaż oszczędza miejsce w obudowie i jest wysoce niezawodny.

---

## 1. Wykaz wyprowadzeń i połączeń (Pinout)

Sterowanie zegarem opiera się na mikrokontrolerze **ESP8266** (np. NodeMCU V3 / Wemos D1 Mini) lub **ESP32**. Poniżej znajduje się schemat połączeń:

| Nazwa Komponentu | Pin na ESP8266 | Pin na ESP32 | Cel / Połączenie |
| :--- | :--- | :--- | :--- |
| **Pasek LED Górny (Zegar)** | `D5` (GPIO14) | `GPIO14` | Linia danych poprzez rezystor 330 $\Omega$ do `DIN` taśmy górnej |
| **Pasek LED Dolny (Wyniki)** | `D6` (GPIO12) | `GPIO12` | Linia danych poprzez rezystor 330 $\Omega$ do `DIN` taśmy dolnej |
| **Sensor LDR (Jasność)** | `A0` (ADC0) | `GPIO36` (VP) | Sygnał z dzielnika napięcia LDR + 10k $\Omega$ |
| **Zasilanie Mikrokontrolera** | `5V` / `VIN` | `5V` / `VIN` | Napięcie 5V z głównego zasilacza |
| **Masa Wspólna** | `GND` | `GND` | Połączona z masą zasilacza i masami pasków LED |

---

## 2. Graficzny schemat połączeń (Wiring Diagram - No PCB)

Poniższy rysunek przedstawia graficzny schemat połączeń bezpośrednich (bez użycia płytki drukowanej), gdzie wszystkie luty są zabezpieczone koszulkami termokurczliwymi:

![Wizualny schemat połączeń bez płytki drukowanej](C:\Users\dabro\.gemini\antigravity\brain\452313a3-fbeb-4282-9a3a-5c8adb1e4b4e\wiring_schematic_no_pcb_1783955883273.png)

---

## 3. Instrukcja Montażu Krok po Kroku (Lutowanie bezpośrednie)

> [!IMPORTANT]
> **Izolacja termokurczliwa:** Przed zlutowaniem jakichkolwiek dwóch przewodów lub nóżek elementów, pamiętaj o nasunięciu kawałka koszulki termokurczliwej na jeden z przewodów. Po zlutowaniu nasuń koszulkę na miejsce łączenia i ogrzej ją (np. zapalniczką lub gorącym powietrzem), aby trwale odizolować połączenie.

### Krok 1: Węzeł zasilania i kondensator filtrujący
1. Weź główny kabel zasilający 5V (czerwony) i GND (czarny) z zasilacza zewnętrznego.
2. Przylutuj kondensator elektrolityczny **1000 $\mu$F** bezpośrednio do kabli zasilających:
   * Nóżkę dodatnią (dłuższą, bez paska) zlutuj z kablem **+5V**.
   * Nóżkę ujemną (krótszą, oznaczona paskiem z minusem) zlutuj z kablem **GND**.
3. Od tego samego węzła wyprowadź:
   * Czerwony przewód 5V do pinu `VIN` / `5V` mikrokontrolera ESP.
   * Czarny przewód GND do pinu `GND` mikrokontrolera ESP.
   * Linie zasilania 5V i GND idące do pasków LED (magistrala).

### Krok 2: Lutowanie rezystorów na liniach danych
1. Weź rezystor **R1 (330 $\Omega$)**. Przylutuj jedną z jego nóżek bezpośrednio do pinu **D5** (GPIO14) na płytce mikrokontrolera.
2. Drugą nóżkę rezystora zlutuj z przewodem sygnałowym (zielonym/żółtym) biegnącym do wejścia danych `DIN` górnego paska LED.
3. Postąp tak samo z rezystorem **R2 (330 $\Omega$)**: przylutuj go do pinu **D6** (GPIO12) i połącz z linią danych dolnego paska LED.
4. Całe rezystory wraz z lutami zamknij w koszulkach termokurczliwych.

### Krok 3: Połączenie sensora LDR i rezystora 10k $\Omega$
1. Weź rezystor **R3 (10 k$\Omega$)**. Przylutuj go bezpośrednio pomiędzy pin **A0** a pin **GND** mikrokontrolera.
2. Przylutuj przewody sensora LDR:
   * Jeden przewód z sensora LDR przylutuj do pinu **3V3** (lub 5V) na ESP.
   * Drugi przewód z sensora LDR przylutuj bezpośrednio do pinu **A0** (do punktu połączenia z rezystorem R3).
3. Zabezpiecz nóżki LDR oraz luty przy ESP koszulkami termokurczliwymi.

---

## 4. Schemat Blokowy Przepływu Mocy i Sygnału

```
                       +-----------------------------+
                       |     Zasilacz 5V 10A         |
                       +------+---------------+------+
                              |               |
                              | +5V           | GND
                              v               v
                        ============================= [ power lines ]
                             |                 |
            +----------------+                 +---------------+
            |                                                  |
            |   +---------------------------------------+      |
            |   |           ESP8266 (NodeMCU)           |      |
            |   |                                       |      |
            +-->| VIN/5V                             GND|<-----+
                |                                       |
                |   3V3     A0          D5          D6  |
                +----+------+-----------+-----------+---+
                     |      |           |           |
                     |    [R3 10k]    [R1 330R]   [R2 330R]
                     |      |           |           |
                   [LDR]----+           |           |
                     |                  v           v
                     v                [DIN]       [DIN]
                  (do 3V3)          Zegar LED   Wyniki LED
```

> [!TIP]
> **Minimalizacja zakłóceń (EMI):** Stosując grube przewody zasilające ($1.5\text{ mm}^2$) oraz kondensator elektrolityczny $1000\ \mu\text{F}$ bardzo blisko złącza zasilania na płytce sterującej, skutecznie wygładzasz tętnienia prądu wywoływane przez szybkie przełączanie diod PWM w paskach WS2812B. Oddalenie zasilacza impulsowego dodatkowo eliminuje zakłócenia radiowe (RF), które mogłyby pogarszać zasięg anteny WiFi w ESP.
