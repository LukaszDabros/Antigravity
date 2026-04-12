# Instrukcja Lutowania: Moduł Laserowy V2 (z trybem ciągłym)

Poniższa instrukcja opisuje montaż układu wyzwalającego laser za pomocą czujnika piezoelektrycznego, z dodanym przełącznikiem umożliwiającym stałe świecenie do kalibracji.

## Lista Komponentów
*   **Laser:** 5mW 650nm (czerwony)
*   **Tranzystor:** MOSFET 2N7000
*   **Czujnik:** Piezoelektryczny (blaszka)
*   **Kondensator:** 10µF (elektrolityczny)
*   **Rezystor:** 10kΩ
*   **Zasilanie:** Bateria CR2032 (3V) + koszyk
*   **Przełącznik:** Bistabilny typu ON-ON (2 sekcje po 3 piny lub 3-pinowy)

---

## 1. Schemat Połączeń (ASCII)

```text
       [ BATERY + ] ----------------------------+---------- ( LASER + )
       (  3.0V    )                             |
                                                |
       [ BATERY - ] -----------+                |
                               |                |
         (Source)              |                |
       +---------+             |                |
       | 2N7000  |-------------+                |
       +---------+             |                |
         (Gate)                |                |
           |                   |                |
           +-------+-----------+                |
           |       |           |                |
        [56kΩ]  [10µF]      ( PIEZO - )         |
           |       |                            |
           +-------+---------( PIEZO + )        |
                                                |
         (Drain)                                |
           |                                    |
           |      / [ PRZEŁACZNIK ]             |
           +---- o                              |
                 o -----------------------------+---------- ( LASER - )
           +---- o
           |
           +------------------- [ BATERY - ]
```

---

## 2. Pinologia i Orientacja

### Tranzystor 2N7000 (TO-92)
Patrząc na płaską stronę tranzystora (napisy do Ciebie), nóżki od lewej to:
1.  **S (Source)** - Masa (Minus baterii)
2.  **G (Gate)** - Wejście sygnału (Piezo / Kondensator)
3.  **D (Drain)** - Wyjście (Do lasera / przełącznika)

### Kondensator 10µF
*   **Dłuższa nóżka:** Plus (+) -> Do Gate tranzystora.
*   **Krótsza nóżka (z paskiem):** Minus (-) -> Do Source tranzystora (Masa).

### Przełącznik (Bistabilny ON-ON)
Używamy jednej sekcji (3 piny) do wyboru źródła "masy" dla lasera:
*   **Środkowy pin:** Łączymy z **Minusem Lasera**.
*   **Boczny pin 1 (Tryb VR):** Łączymy z **Drain (D)** tranzystora.
*   **Boczny pin 2 (Kalibracja):** Łączymy bezpośrednio z **Minusem Baterii**.

---

## 3. Instrukcja Krok po Kroku

1.  **Przygotowanie Bazy:** Przylutuj nóżkę **Source (1)** tranzystora do minusa baterii.
2.  **Układ Czasowy:** Przylutuj **rezystor 10kΩ** oraz **kondensator 10µF** równolegle między **Gate (2)** a **Source (1)**. Pamiętaj o polaryzacji kondensatora!
3.  **Czujnik Piezo:** Przylutuj kabelki z blaszki piezo:
    *   Czerwony (środek piezo) do **Gate (2)**.
    *   Czarny (brzeg piezo) do **Source (1)**.
4.  **Zasilanie Lasera:** Przylutuj **Plus lasera** bezpośrednio do **Plusa baterii**.
5.  **Montaż Przełącznika:**
    *   **Minus lasera** przylutuj do środkowego pinu przełącznika.
    *   Jeden z bocznych pinów połącz z nóżką **Drain (3)** tranzystora. To będzie tryb strzału.
    *   Drugi boczny pin połącz z **Minusem baterii**. To będzie tryb kalibracji (laser świeci ciągle).

---

## 4. Testowanie i Regulacja

*   **Tryb Kalibracji:** Przesuń przełącznik. Laser powinien świecić światłem ciągłym. Ustaw kamerę i skalibruj system.
*   **Tryb Strzału:** Przełącz z powrotem. Uderz lekko w blaszkę piezo (lub potrząśnij repliką). Laser powinien mignąć na około 0.1 sekundy.
*   **Dostrajanie:** Jeśli błysk jest za krótki, możesz zmienić rezystor na większy (np. 20kΩ - 56kΩ). 10kΩ zapewnia bardzo "ostry" strzał bez efektu smużenia.

> [!TIP]
> Zamontuj blaszkę piezo wewnątrz repliki (np. w chwycie lub w pobliżu spustu/kurka) za pomocą taśmy dwustronnej. Najlepsze efekty daje twarde połączenie z szkieletem repliki.

> [!CAUTION]
> Pamiętaj, aby nie patrzeć bezpośrednio w wiązkę lasera i nie celować w ludzi ani zwierzęta!
