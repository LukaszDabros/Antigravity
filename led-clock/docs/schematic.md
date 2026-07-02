# Dokumentacja Techniczna i Schemat Połączeń

## 1. Wykaz Komponentów Elektronicznych
*   **Mikrokontroler:** ESP8266 (np. NodeMCU V3 lub Wemos D1 Mini).
*   **Paski LED:** Adresowalne WS2812B (zasilane 5V, najlepiej gęstość 60 LED/m).
    *   Rząd górny: $4 \times 7 \times 2\text{ LED} + 2\text{ LED (dwukropek)} = 58\text{ diod}$.
    *   Rząd dolny: $4 \times 7 \times 3\text{ LED} = 84\text{ diody}$.
    *   Suma diod: 142 LED.
*   **Zasilacz:** Zasilacz impulsowy stabilizowany 5V DC, minimum 8A (rekomendowany 5V 10A dla zapewnienia bezpiecznego zapasu mocy i stabilnej pracy przy dowolnym kolorze/jasności).
*   **Sensor jasności LDR:** Fotorezystor GL5528 (lub podobny) + rezystor $10\text{ k}\Omega$ (dzielnik napięcia).
*   **Kondensator filtrujący:** Elektrolityczny $1000\ \mu\text{F}$ / 6.3V (lub 10V) na wejściu zasilania pasków LED (chroni przed skokami napięcia).
*   **Rezystory zabezpieczające:** $2 \times 330\ \Omega$ (wpinane szeregowo w linie danych D5 i D6).

---

## 2. Schemat Połączeń (Wiring Diagram)

```
                       +-------------------+
                       |   Zasilacz 5V     |
                       |                   |
                       |  5V(+)    GND(-)  |
                       +---+---------+-----+
                           |         |
      +--------------------+---------+----------------------+
      |                    |         |                      |
      |   +----------------+         +-----------------+    |
      |   |                                            |    |
      |   |   +------------------------------------+   |    |
      |   |   |           ESP8266                  |   |    |
      |   |   |                                    |   |    |
      |   |   |   3V3   A0    GND   D5    D6   5V  |   |    |
      |   |   +----+----+----+----+----+----+----+   |    |
      |   |        |    |    |    |    |    |        |    |
      |   |        |    |    |    |    |    +--------+    |
      |   |        |    |    |    |    |                 |
      |   +--------|----+----+    |    +--[ 330 Ohm ]----+---> Rząd górny LED (D5)
      |            |    |         |                      |
      |            |    |         +------[ 330 Ohm ]-----+---> Rząd dolny LED (D6)
      |            |    |
      |      [LDR] |    +----+
      |            |         |
      +------------+      [10k Ohm]
                             |
                             +----+
                                  |
                                 GND
```

### Opis wyprowadzeń LDR:
*   Jedna nóżka fotorezystora **LDR** jest podłączona do **5V** (lub 3.3V).
*   Druga nóżka LDR jest połączona z pinem **A0** mikrokontrolera.
*   Od pinu **A0** idzie rezystor **10 kΩ** do **GND** (filtracja i ustalenie punktu pracy dzielnika).

### Połączenia pasków LED:
1.  **Rząd Górny (Zegar):**
    *   **5V** $\rightarrow$ Zasilanie 5V.
    *   **GND** $\rightarrow$ Wspólna masa (GND).
    *   **DIN** $\rightarrow$ Pin D5 (GPIO14) poprzez rezystor $330\ \Omega$.
2.  **Rząd Dolny (Tablica Wyników):**
    *   **5V** $\rightarrow$ Zasilanie 5V.
    *   **GND** $\rightarrow$ Wspólna masa (GND).
    *   **DIN** $\rightarrow$ Pin D6 (GPIO12) poprzez rezystor $330\ \Omega$.

> [!IMPORTANT]
> **Power Injection (Wstrzykiwanie zasilania):** Z uwagi na spadki napięcia na paskach LED, zasilanie 5V oraz GND należy doprowadzić do pasków z obu końców (szczególnie w przypadku dolnego paska z 84 diodami).

---

## 3. Schemat Konstrukcji "Sandwich" i Optyki

```
+-----------------------------------------------------------+ 
| [Warstwa 1] Plexi Mleczna PMMA 4mm (Opal, LT ~40%)        | -> Front rozpraszający
+-----------------------------------------------------------+
| [Krawędzie mostków pomalowane na CZARNY MAT]              | -> Odcięcie światła
+-----------------------------------------------------------+
| [Warstwa 2] Rdzeń z płyty MDF 18mm                        | -> Korpus ze skośnymi
|   - Wyfrezowane leje 45° pomalowane wewnątrz na BIAŁO      |    lejami odbijającymi
+-----------------------------------------------------------+
| [Warstwa 3] Plecy z płyty HDF 3mm (Podłoże LED)           | -> Dno z przyklejonymi
|   - Paski WS2812B przyklejone taśmą dwustronną            |    paskami diodowymi
+-----------------------------------------------------------+
```

### Porada Montażowa BHP i Optyki:
1.  **Ekranowanie Światła (Bridges):** Pomiędzy wyfrezowanymi komorami segmentów MDF powstają płaskie mostki o szerokości 5 mm. Aby zapobiec przedostawaniu się światła do sąsiednich (wyłączonych) segmentów, wierzchołki mostków (które stykają się bezpośrednio z pleksą) malujemy **czarnym matowym markerem lub farbą**.
2.  **Maksymalizacja Odbicia (Wells):** Wnętrza wyfrezowanych skośnych lejów malujemy na **śnieżnobiały kolor** (najlepiej matowy), co świetnie miesza i odbija światło z poszczególnych diod, dając jednolity efekt świecenia segmentu na plexi.
3.  **Ładunki elektrostatyczne (Antistatic):** Przed ostatecznym skręceniem zegara dokładnie przemyj mleczną pleksę płynem antystatycznym (lub płynem do szyb z antystatykiem). MDF po frezowaniu pyli, a akryl silnie przyciąga drobinki pyłu, co po włączeniu LED byłoby widoczne jako brzydkie ciemne plamki.

---

## 4. Kolejność Adresowania Segmentów w Pasku LED

> [!IMPORTANT]
> **Nowe nazewnictwo segmentów (A = ŚRODEK = PIERWSZY W ŁAŃCUCHU LED)**  
> Zmieniono tradycyjne nazewnictwo 7-segmentowe, aby odzwierciedlało fizyczną kolejność lutowania taśmy LED.

### Schemat ASCII nowego nazewnictwa:

```
       +------[C]------+
       |               |
      [B]   GÓRA      [D]
       |               |
       +------[A]------+   <--- A = ŚRODEK (wejście DIN taśmy!)
       |               |
      [G]   DÓŁ       [E]
       |               |
       +------[F]------+
```

### Tabela Mapowania:

| Nr LED w segmencie | Nazwa (nowa) | Pozycja fizyczna | Opis |
|--------------------|-------------|------------------|------|
| 1. (PIERWSZE) | **A** | ŚRODEK | Poziomy segment środkowy |
| 2. | B | GÓRNY-LEWY | Pionowy segment górny lewy |
| 3. | C | GÓRNY | Poziomy segment górny |
| 4. | D | GÓRNY-PRAWY | Pionowy segment górny prawy |
| 5. | E | DOLNY-PRAWY | Pionowy segment dolny prawy |
| 6. | F | DOLNY | Poziomy segment dolny |
| 7. (OSTATNIE) | G | DOLNY-LEWY | Pionowy segment dolny lewy |

### Tor sygnału DIN w obrębie jednej cyfry:

```
DIN → [A] (śRODEK) → [B] (górny-L) → [C] (góra) → [D] (górny-P)
  → [E] (dolny-P) → [F] (dół) → [G] (dolny-L) → DOUT (do A następnej cyfry)
```

### Kolejność cyfr w całym rzędzie:

```
Rząd GÓRNY (D2/GPIO4):
  Cyfra 1 [A→G] → Cyfra 2 [A→G] → ":" [dwie diody] → Cyfra 3 [A→G] → Cyfra 4 [A→G]

Rząd DOLNY (D5/GPIO14):
  Cyfra 1 [A→G] → Cyfra 2 [A→G] → Cyfra 3 [A→G] → Cyfra 4 [A→G]
```

> [!NOTE]
> Ta kolejność różni się od tradycyjnego nazewnictwa 7-segmentowego, gdzie A=górny poziomy.
> Została zaprojektowana tak, aby DIN taśmy LED wchodził zawsze do środkowego segmentu cyfry
> co upraszcza trasę kabla i minimalizuje długość połączeń międzysegmentowych.
