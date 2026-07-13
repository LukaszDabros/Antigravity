# Schemat Lutowania i Połączeń Sterownika

Poniższy dokument przedstawia dokładny opis montażu i lutowania elementów na uniwersalnej płytce prototypowej (stripboard / perfboard) o wymiarach 50x70 mm, przeznaczonej do umieszczenia w zaprojektowanej obudowie 3D.

---

## 1. Wykaz wyprowadzeń i połączeń (Pinout)

Sterowanie zegarem opiera się na mikrokontrolerze **ESP8266** (np. NodeMCU V3 / Wemos D1 Mini) lub **ESP32** (zgodnie z nową specyfikacją). Poniżej znajduje się schemat logiczny połączeń na płytce:

| Nazwa Komponentu | Pin na ESP8266 | Pin na ESP32 | Cel / Połączenie |
| :--- | :--- | :--- | :--- |
| **Pasek LED Górny (Zegar)** | `D5` (GPIO14) | `GPIO14` | Linia danych poprzez rezystor 330 $\Omega$ do `DIN` taśmy górnej |
| **Pasek LED Dolny (Wyniki)** | `D6` (GPIO12) | `GPIO12` | Linia danych poprzez rezystor 330 $\Omega$ do `DIN` taśmy dolnej |
| **Sensor LDR (Jasność)** | `A0` (ADC0) | `GPIO36` (VP) | Sygnał z dzielnika napięcia LDR + 10k $\Omega$ |
| **Zasilanie Mikrokontrolera** | `5V` / `VIN` | `5V` / `VIN` | Napięcie 5V z głównego zasilacza (szyny zasilania) |
| **Masa Wspólna** | `GND` | `GND` | Połączona z masą zasilacza i masami pasków LED |

---

## 2. Graficzny układ montażowy elementów (Płytka 50x70 mm)

Poniższy schemat przedstawia rozkład elementów na płytce uniwersalnej (widok od góry, od strony elementów).

```
   +-------------------------------------------------------------+
   |  [5V IN]  [GND IN] <-- Złącze śrubowe ARK (Zasilanie 5V)    |
   |     |        |                                              |
   |     +--[+]   |      +---------------------------+           |
   |     |  (Kondensator |                           |           |
   |     |  1000uF)      |      MIKROKONTROLER       |           |
   |     +--[-]   |      |      ESP8266 / ESP32      |           |
   |     |        |      |                           |           |
   |     |        |      | 3V3   A0   GND   D5   D6  |           |
   |     |        |      +--+----+----+----+----+----+           |
   |     |        |         |    |    |    |    |              |
   |     |        |         |    |    |  [R1]  [R2]              |
   |     |        |         |    |    | 330R  330R             |
   |     |        |         |    |    |    |    |              |
   |     |        |         |    |    |    |    +--> [DATA DOL] |
   |     |        |      [LDR]   |    |    +-------> [DATA GOR] |
   |     |        |         |    |    |                      |
   |     +--------+---------+    +----+                      |
   |     |                       |                           |
   |     |                    [R3 10k]                       |
   |     |                       |                           |
   |     +-----------------------+                           |
   |                                                         |
   |  [5V OUT] [GND OUT] <-- Złącze śrubowe ARK (Wyjście LED) |
   +-------------------------------------------------------------+
```

---

## 3. Instrukcja Lutowania Krok po Kroku

> [!IMPORTANT]
> **Polaryzacja kondensatora:** Kondensator elektrolityczny 1000 $\mu$F posiada określoną biegunowość. Pasek na boku obudowy (zazwyczaj szary lub biały z minusami) wskazuje nóżkę ujemną (**GND**). Druga, dłuższa nóżka to dodatnia (**+5V**). Odwrotne wlutowanie grozi uszkodzeniem kondensatora!

### Krok 1: Montaż złącz śrubowych i szyn zasilania
1. Wlutuj złącza śrubowe typu ARK (rozstaw pinów 5.08 mm) na skrajach płytki:
   * **ARK 1 (Zasilanie wejściowe 5V):** Dla kabla zasilacza zewnętrznego.
   * **ARK 2 (Wyjście zasilania na LED):** Do zasilenia pasków bezpośrednio z płytki sterownika (najkrótsza droga).
2. Wyznacz dwie linie (szyny) na płytce prototypowej:
   * **Szyna 5V:** Łączy pin dodatni złącza wejściowego, dodatnią nóżkę kondensatora 1000 $\mu$F, pin `5V/VIN` mikrokontrolera oraz pin dodatni złącza wyjściowego.
   * **Szyna GND:** Łączy pin ujemny złącza wejściowego, ujemną nóżkę kondensatora, pin `GND` mikrokontrolera, dolną nóżkę rezystora 10k $\Omega$ oraz pin ujemny złącza wyjściowego.

### Krok 2: Montaż mikrokontrolera (ESP)
1. Przylutuj żeńskie gniazda kołkowe (goldpiny) w rozstawie nóżek mikrokontrolera. Ułatwi to wpięcie/wymianę ESP bez konieczności ponownego lutowania samego modułu.
2. Wepnij mikrokontroler w gniazda.

### Krok 3: Rezystory ochronne linii danych (R1, R2)
1. Wlutuj rezystor **R1 (330 $\Omega$)** pomiędzy pin **D5** (GPIO14) na ESP a wyprowadzenie przewodu danych `DIN` dla górnego paska LED.
2. Wlutuj rezystor **R2 (330 $\Omega$)** pomiędzy pin **D6** (GPIO12) na ESP a wyprowadzenie przewodu danych `DIN` dla dolnego paska LED.
3. *Wskazówka:* Użyj koszulek termokurczliwych na przewodach wyjściowych linii danych, aby uniknąć przypadkowego zwarcia.

### Krok 4: Układ dzielnika napięcia czujnika LDR
Fotorezystor LDR potrzebuje rezystora referencyjnego 10k $\Omega$ do poprawnego odczytu wartości natężenia światła przez pin analogowy `A0`.
1. Przylutuj rezystor **R3 (10 k$\Omega$)** jednym końcem do szyny **GND**, a drugim bezpośrednio do pinu **A0** mikrokontrolera.
2. Wyprowadź dwa przewody do zewnętrznego sensora LDR:
   * Jeden przewód podłącz do szyny **3.3V** (lub 5V) na ESP.
   * Drugi przewód podłącz bezpośrednio do pinu **A0** (wspólny punkt połączenia z rezystorem R3).
3. Przylutuj sensor LDR na końcu tych przewodów (zabezpieczając połączenie koszulką termokurczliwą).

---

## 4. Połączenie z Zasilaczem i Magistralą LED

```
                      +-----------------------------+
                      |     Zasilacz 5V 10A         |
                      | (Zamontowany w odległości)  |
                      +------+---------------+------+
                             |               |
             +---------------+               +---------------+
             | (Gruby kabel 1.5mm2)          | (Gruby kabel 1.5mm2)
             |                               |
             v                               v
      +--------------+               +---------------+
      |    +5V IN    |               |    GND IN     |
      |              |               |               |
      |   [ARK 1]    |               |    [ARK 1]    |
      +---+----------+               +-------+-------+
          |                                  |
          |       Płytka Sterowania          |
          |                                  |
      +---+----------+               +-------+-------+
      |   [ARK 2]    |               |    [ARK 2]    |
      |  +5V OUT     |               |    GND OUT    |
      +---+----------+               +-------+-------+
          |                                  |
          +-----------> Do pasków LED <------+
                        (+5V i GND magistrali)
```

> [!TIP]
> **Minimalizacja zakłóceń (EMI):** Stosując grube przewody zasilające ($1.5\text{ mm}^2$) oraz kondensator elektrolityczny $1000\ \mu\text{F}$ bardzo blisko złącza zasilania na płytce sterującej, skutecznie wygładzasz tętnienia prądu wywoływane przez szybkie przełączanie diod PWM w paskach WS2812B. Oddalenie zasilacza impulsowego dodatkowo eliminuje zakłócenia radiowe (RF), które mogłyby pogarszać zasięg anteny WiFi w ESP.
