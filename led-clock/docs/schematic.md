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
