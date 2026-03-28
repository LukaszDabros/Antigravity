# Wirtualna Strzelnica

Wirtualna Strzelnica to projekt łączący skrypt Python (wykorzystujący OpenCV) do śledzenia punktu lasera z interaktywną aplikacją w przeglądarce działającą w HTML5 Canvas.

## Architektura
1. **`laser_tracker.py`** - Skrypt wykorzystujący kamerę internetową do śledzenia wskaźnika laserowego. Po kalibracji ekranu przelicza współrzędne z kamery na pozycję kursora na ekranie gracza i wysyła informacje o strzale asynchronicznie przez protokół WebSocket do aplikacji webowej.
2. **`web_app/`** - Aplikacja przeglądarkowa HTML5 (Canvas, Vanilla JS). Słucha sygnałów z serwera WebSocket i wyświetla tarcze oraz rejestruje punkty trafień.

## Przeznaczenie i Zalecany Sprzęt
Uruchomienie wirtualnej strzelnicy wymaga wskaźnika laserowego. Aby w pełni doświadczyć immersji, zaleca się zastosowanie dedykowanych replik ASG (pistoletów lub karabinków) wyposażonych w moduły laserowe.

**Najlepsze rozwiązanie: Moduły Lasera Wibracyjnego (Plug & Play)**
Zamiast skomplikowanych i inwazyjnych przeróbek replik, najbardziej polecaną opcją jest zakup tzw. **Lasera Wibracyjnego ASG** (np. z popularnych portali jak AliExpress - [Link przykładowy](https://pl.aliexpress.com/item/1005007444230543.html)). 
Taki moduł montuje się banalnie prosto na szynie akcesoryjnej pod lufą pistoletu lub na końcu lufy karabinu (zamiast np. tłumika płomienia). Posiada on wbudowany mikrofon/przetwornik piezoelektryczny, który reaguje na mechaniczne "szarpnięcie" i uderzenie elementów repliki strzelającej "na sucho". Emituje wtedy idealny, krótki błysk lasera. **Nie wymaga to absolutnie żadnej integracji z mechanizmem repliki.**

W połączeniu z tym rozwiązaniem polecamy następujące repliki:
* **Karabinek M4 SOPMOD Block 3 11.5" Sports Line ETU [S&T]**
  Idealny wybór do treningu taktyki CQB. Kompaktowe wymiary zapewniają manewrowość, a liczne szyny w standardzie M-LOCK i Picatinny bez problemu pozwolą na zamocowanie modułu wibracyjnego na lufie lub osłonie.
  [🔗 Link do sklepu - M4 SOPMOD](https://www.taiwangun.com/pl/karabin-szturmowy-aeg/replika-karabinka-m4-sopmod-block-3-11-5-sports-line-etu-s-t)

* **Pistolet PT24/7 CO2 [KWC]**
  Wierna polimerowa replika pistoletu. Brak systemu blow-back sprawia, że jest bardzo trwała i tania w eksploatacji. Jego mocne uderzenie zaworu z pewnością bezbłędnie wzbudzi zamontowany na nim laser wibracyjny.
  [🔗 Link do sklepu - PT24/7 CO2](https://www.taiwangun.com/pl/pistolet-co2/pt24-7-co2-kwc)

## Zalecana Kamera do Śledzenia Lasera
Kluczem do niezawodnego działania domowej strzelnicy jest wychwycenie krótkich błysków lasera na wyświetlanym obrazie. Zwykłe kamery 30 FPS mogą czasem "zgubić" bardzo krótki strzał. 
Najbardziej polecane parametry to:
1. **Wysoka częstotliwość odświeżania (FPS)**: Minimum 60 FPS (najlepiej 120 FPS). Im szybciej kamera rejestruje obraz, tym większa pewność, że zarejestruje ułamek sekundy, w którym laser pojawia się na ścianie/ekranie.
2. **Manualna kontrola ekspozycji**: Zdolność do programowego przyciemnienia obrazu sterownikami. Dzięki temu projektowany obraz gry staje się ciemny, a laser jest jedynym "jasnym punktem", co ułatwia komputerowi jego detekcję.

**Nasz faworyt: Sony PlayStation 3 Eye (PS3 Eye Camera)**
* Legendarna kamera w środowisku hakerskim. Potrafi rejestrować obraz z prędkością **120 FPS** (przy 320x240) lub **60 FPS** (przy 640x480).
* Można ją kupić używaną za dosłownie "grosze" (ok. 20-30 zł na portalach aukcyjnych).
* Do działania na Windowsie wymaga instalacji darmowych sterowników CL-Eye Driver.
* *Alternatywa:* Dowolna nowoczesna kamera internetowa obsługująca 60 FPS (np. Logitech C922, StreamCam).

### Czy kamerę PS3 Eye trzeba przerabiać?
**W standardowej konfiguracji z widzialnym laserem (Czerwonym/Zielonym) - NIE trzeba**.
Wystarczy w sterownikach CL-Eye Test (lub OBS) maksymalnie obniżyć suwak "Exposure" (Ekspozycja) oraz "Gain" (Czułość). Obraz z rzutnika stanie się czarny, a kamera będzie widziała wyłącznie jaskrawy czerwony/zielony punkt lasera. Nasz skrypt `laser_tracker.py` został domyślnie napisany właśnie pod taką najprostszą konfigurację bez przeróbek.

**Kiedy przeróbka jest wskazana?**
Jeśli planujesz wykorzystać laser emitujący **niewidzialne światło podczerwone (IR - Infrared)**. Robi się to w zaawansowanych projektach po to, by gracz w ogóle nie widział kropki lasera na ścianie podczas celowania (trudniejszy trening). 
Wtedy z kamery PS3 należy fizycznie wyłamać filtr blokujący podczerwień ("IR Cut Filter"). Na rynku występowały dwa modele tej kamery:
1. **Model SLEH-00448 (Dobra, z płaską soczewką)** - Idealna do modyfikacji. Filtr IR to oddzielna szklana płytka za soczewką główną, którą można łatwo zdrapać lub zbić.
2. **Model SLEH-00201 (Zła, z wypukłą soczewką)** - Trudna do modyfikacji. Filtr IR jest napylony na wewnętrzną stronę pierwszej soczewki. Próba jego nałożenia/usunięcia często niszczy obiektyw.

## Uruchomienie
1. Zainstaluj niezbędne biblioteki Pythona: `pip install opencv-python numpy websockets asyncio`
2. Uruchom skrypt pythona: `python laser_tracker.py`
3. Skrypt poprosi o kalibrację 4 rożdeczków ekranu poprzez oddanie "strzałów" we wskazane miejsca.
4. Otwórz plik `web_app/index.html` w swojej ulubionej przeglądarce (np. Edge, Chrome).
5. Kliknij "Rozpocznij Grę" i ciesz się domową strzelnicą.
