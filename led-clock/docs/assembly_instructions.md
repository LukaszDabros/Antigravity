# Instrukcja Montażu Elektroniki Krok po Kroku

Poniższa instrukcja krok po kroku pozwoli Ci prawidłowo i bezpiecznie zlutować oraz połączyć wszystkie komponenty elektroniczne Wielkoformatowego Zegara LED.

---

## 1. Narzędzia i Materiały Pomocnicze
Przed rozpoczęciem przygotuj następujące rzeczy:
*   **Stacja lutownicza** lub lutownica kolbowa (temperatura ok. 320–350°C).
*   **Cyna lutownicza** z topnikiem (najlepiej ołowiowa Sn60Pb40 ze względu na łatwiejsze lutowanie).
*   **Topnik w płynie lub żelu** (bardzo ułatwia lutowanie padów na paskach LED).
*   **Przewody montażowe:**
    *   **Przewody zasilające** (przekrój $1.0\text{ mm}^2$ lub $1.5\text{ mm}^2$, najlepiej czerwony dla +5V i czarny dla GND) do głównej szyny zasilającej.
    *   **Przewody sygnałowe** (przekrój $0.25\text{ mm}^2$ lub kable typu Kynar/Dupont) do łączenia segmentów i sygnałów danych.
*   **Koszulki termokurczliwe** (różne średnice) do zabezpieczania lutowanych połączeń.
*   **Opcjonalnie:** Trzecia ręka (uchwyt z lupą), cążki do cięcia przewodów i ściągacz izolacji.

---

## 2. Krok 1: Przygotowanie i Cięcie Pasków LED
Każdy segment zegara i tablicy wyników składa się z odpowiedniej liczby diod odciętych z rolki taśmy WS2812B.
*   **Taśma górnego rzędu (Zegar):** Wytnij 28 odcinków po **2 diody LED** (łącznie 56 diod dla 4 cyfr) oraz 1 odcinek z **2 diodami LED** (dwukropek).
*   **Taśma dolnego rzędu (Wyniki):** Wytnij 28 odcinków po **3 diody LED** (łącznie 84 diody dla 4 cyfr).

> **Ostrzeżenie:** Taśmę LED WS2812B można odcinać **tylko w wyznaczonych miejscach** (linia cięcia biegnąca dokładnie przez środek miedzianych padów lutowniczych). Użyj ostrych nożyczek.

---

## 3. Krok 2: Łączenie Segmentów w Cyfry
Każda cyfra składa się z 7 segmentów (A, B, C, D, E, F, G). Musisz połączyć je szeregowo tak, aby sygnał danych (Data) przechodził z jednego segmentu do kolejnego.

### Kierunek Przepływu Danych (Ważne!):
* Taśmy adresowalne WS2812B mają określony kierunek przepływu sygnału oznaczony **strzałkami na laminacie** (od `DI` / `DIN` - Data In do `DO` / `DOUT` - Data Out). 
* Zwróć szczególną uwagę, aby lutować wyjście `DO` poprzedniego segmentu z wejściem `DI` następnego segmentu. Odwrócenie kierunku spowoduje, że diody za błędem nie będą świecić!

### Schemat połączenia w pojedynczej cyfrze (propozycja układu wężykowego):
```
           [A] 
          +---+
      [F] |   | [B]
          +---+ <--- Wejście danych (DI) całej cyfry na dole segmentu B
      [E] | [G]| [C]
          +---+
           [D]
```
Połącz segmenty cienkim przewodem według kolejności:
`Wejście cyfry (DI)` -> **[B]** -> **[A]** -> **[F]** -> **[G]** -> **[E]** -> **[D]** -> **[C]** -> `Wyjście cyfry (DO) do kolejnej cyfry`.

### Proces lutowania segmentu:
1.  Nałóż odrobinę topnika na miedziane pady segmentu LED.
2.  Pobiel pady cyną (nałóż małą kropelkę cyny na każdy pad: `+5V`, `DI/DO`, `GND`).
3.  Zdejmij ok. 2 mm izolacji z przewodu sygnałowego, pobiel końcówkę cyną.
4.  Przytknij przewód do padu i krótko podgrzej lutownicą – cyna na przewodzie i padzie złączy się idealnie.
5.  **Mostki zasilania:** Oprócz linii danych (`DI`/`DO`), zlutuj ze sobą równolegle linie zasilania `5V` oraz `GND` wszystkich segmentów wewnątrz cyfry.

---

## 4. Krok 3: Przygotowanie Czujnika Światła LDR
Czujnik LDR (fotorezystor) pozwala na automatyczną regulację jasności ekranu. Montujemy go w dzielniku napięcia.
1.  Utnij kawałek rurki termokurczliwej i nasuń ją na jedną z nóżek fotorezystora LDR.
2.  Zlutuj jedną nóżkę LDR z przewodem biegnącym do napięcia **3.3V** (lub 5V) na płytce ESP8266.
3.  Zlutuj drugą nóżkę LDR z rezystorem **10 kΩ**. 
4.  W miejscu połączenia (pomiędzy LDR a rezystorem) przylutuj przewód sygnałowy, który podłączysz do pinu **A0** mikrokontrolera.
5.  Wolny koniec rezystora 10 kΩ zlutuj z przewodem biegnącym do **GND**.
6.  Zabezpiecz całe połączenie koszulką termokurczliwą, ogrzewając ją zapalniczką lub gorącym powietrzem.

---

## 5. Krok 4: Przygotowanie Płytki Sterownika (ESP8266)
Sterownik integruje mikrokontroler, kondensator oraz rezystory ochronne. Najwygodniej zlutować to na małym fragmencie uniwersalnej płytki drukowanej (prototypowej) lub bezpośrednio na pinach ESP.

1.  **Rezystory ochronne na liniach danych:**
    *   Przylutuj rezystor **330 Ω** do pinu **D5 (GPIO14)**. Drugi koniec rezystora połącz z wejściem danych `DI` pierwszego segmentu górnego rzędu (Zegar).
    *   Przylutuj drugi rezystor **330 Ω** do pinu **D6 (GPIO12)**. Drugi koniec rezystora połącz z wejściem danych `DI` pierwszego segmentu dolnego rzędu (Wyniki).
    *   *Rola rezystorów:* Chronią one pierwsze diody w pasku przed uszkodzeniem wywołanym szpilkami napięcia na linii danych.
2.  **Kondensator filtrujący:**
    *   Przylutuj kondensator elektrolityczny **1000 µF** bezpośrednio pomiędzy pin **VIN / 5V** a **GND** na płytce ESP8266.
    *   **Uwaga na polaryzację!** Kondensator elektrolityczny ma zaznaczony minus (szary pasek z minusem na obudowie i krótsza nóżka). Minus podłącz do **GND**, a plus (dłuższa nóżka) do **5V / VIN**. Odwrotne podłączenie zniszczy kondensator!

---

## 6. Krok 5: Główne Zasilanie i Magistrala (Szyna Mocy)
Przy poborze prądu do 10A, paski LED wykazują duże spadki napięcia na fabrycznym laminacie, co objawia się zmianą kolorów na końcu paska (np. biały przechodzi w żółty/czerwony). Zapobiegamy temu stosując tzw. **Power Injection** (Wstrzykiwanie zasilania).

1.  Poprowadź gruby dwużyłowy przewód ($1.0 - 1.5\text{ mm}^2$) od zasilacza 5V wzdłuż całego zegara (jest to nasza główna szyna zasilająca).
2.  **Górny rząd (Zegar):** Przylutuj przewody zasilające +5V i GND z szyny zasilającej na początku rzędu (cyfra 1) oraz na końcu rzędu (cyfra 4).
3.  **Dolny rząd (Wyniki):** Zrób dokładnie to samo: wstrzyknij +5V i GND z szyny zasilającej na początku lewej strony, na środku (przy dwukropku) oraz na końcu prawej strony.
4.  Podłącz zasilanie ESP8266: poprowadź osobne przewody od szyny zasilającej 5V/GND do pinów **5V/VIN** oraz **GND** na płytce ESP.

---

## 7. Krok 6: Podłączenie Zasilacza 5V 10A
Zasilacze przemysłowe (metalowe typu "Mesh") posiadają terminale śrubowe.

```
 Terminale zasilacza:
 [ L ] [ N ] [ PE ] [ -V / GND ] [ -V / GND ] [ +V ] [ +V ] [ +V ADJ ]
   |     |     |          |             |        |      |
  AC   AC   Uziemienie  Masa(GND)    Masa(GND)  +5V    +5V
 230V  230V   (PE)       do LED        do ESP   do LED do ESP
```

1.  **Strona 230V (Niebezpieczne napięcie!):**
    *   Podłącz brązowy przewód kabla zasilającego (Faza) do zacisku **L**.
    *   Podłącz niebieski przewód kabla zasilającego (Neutralny) do zacisku **N**.
    *   Podłącz żółto-zielony przewód (Uziemienie ochronne) do zacisku **PE** (lub symbolu uziemienia).
2.  **Strona niskiego napięcia (5V DC):**
    *   Podłącz czerwone przewody od szyny zasilającej zegara do zacisków **+V** (lub `+V`).
    *   Podłącz czarne przewody od szyny zasilającej zegara do zacisków **-V** (lub `COM` / `GND`).

> **Ważne:** Przed włączeniem zasilacza do sieci 230V upewnij się dwukrotnie, że przewody sieciowe nie dotykają obudowy, a wszystkie zaciski śrubowe są mocno dokręcone. Zabezpiecz zaciski 230V dedykowaną plastikową klapką ochronną dołączoną do zasilacza.

---

## 8. Krok 7: Pierwsze Uruchomienie i Diagnostyka
1.  Upewnij się, że nie ma zwarcia między liniami +5V i GND (zmierz oporność multimetrem na szynie zasilającej – powinna rosnąć w miarę ładowania kondensatorów).
2.  Włącz zasilacz do sieci. Na płytce ESP8266 powinna na chwilę błysnąć niebieska dioda.
3.  Zegar uruchomi się w trybie punktu dostępowego WiFi (jeśli nie był wcześniej konfigurowany) i diody LED rozbłysną domyślnym czerwonym kolorem.
4.  **Rozwiązywanie problemów (Troubleshooting):**
    *   *Żadna dioda nie świeci:* Sprawdź miernikiem napięcie 5V na szynie. Sprawdź, czy ESP8266 otrzymuje zasilanie na pinie VIN.
    *   *Świeci tylko pierwsza dioda/segment:* Prawdopodobnie sygnał danych został przylutowany odwrotnie (do wyjścia DO zamiast wejścia DI) lub uszkodzona jest linia sygnałowa między pierwszym a drugim segmentem.
    *   *Diody na końcu paska świecą na żółtawo/słabiej:* Brak wystarczającego wstrzykiwania zasilania (Power Injection). Dlutuj dodatkowe przewody zasilające bezpośrednio z zasilacza do końcowych segmentów.
