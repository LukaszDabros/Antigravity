# TSO Auto-Clicker (Sikuli-Style Python Bot)

Prosty i niezawodny bot (autoclicker) do zautomatyzowanego zarządzania okienkami i wysyłania badaczy na poszukiwania. Gra "The Settlers Online" jest aplikacją opartą w całości o rzeźbione obiekty WebGL (Canvas), przez co tradycyjne DOM-boty nie działają. Z tego powodu **bocik bazuje całkowicie na analizie pikseli obrazu i fizycznych ruchach kursora myszy.**

Oryginalnie napisany w PyAutoGUI ze wsparciem OpenCV do optymalnego szukania ścieżek obrazu. Posiada auto-scrollowanie długiego menu Gwiazdy, dzielenie na kategorie a także sprzętowy killswitch (zawór bezpieczeństwa).

## Wymagania

Należy posiadać zainstalowanego [Pythona 3.8+](https://www.python.org/downloads/). Wymagania bibliotek dla bota znajdziesz w pliku bazowym:

```bash
pip install -r requirements.txt
```

## Jak Używać (Instrukcja Zrób-to-Sam)

Uruchom grę na cały ekran, pobierz tzw. „Półfabrykaty" – czyli precyzyjne małe wyrywki ze zrzutów ekranu ze swojego panelu gry (najlepiej kwadraty, jak najciaśniej przylegające do ikon), a następnie skopiuj je tu we własnym folderze `tso-autoclicker`.

### Wymagane „Wycinki" Graficzne
Zawsze upewnij się, że rozszerzenie małych plików to `.png`:
* `gwiazda.png` - Główny panel gwiazdy na dolnym pasku
* `szukanie_skarbu.png` - Ikona dla konkretnego poszukiwania (lub przygody)
* `krotkie_poszukiwania.png` - Konkretny fragment w liście poszukiwań
* `wyslij_zielony.png` - Duży haczyk oznaczający „zatwierdź/wyślij"
* `ikona_x_zamknij.png` - Ikona zamykania podglądu okna/gwiazdy (by skrypt resetował usterki/lag)

### Odkrywcy (Klucze)
Zależnie od tego, jakim rodzajem zwiadowców dysponujesz, potrzebujesz wyciąć plik dla każdego typu awatara. Te podstawowe wczytane są domyślnie, w razie czego możesz modyfikować słownik `KATEGORIE_ODKRYWCOW` w pliku `.py`:
* `zwykly_odkrywca.png`
* `szczesliwy_odkrywca.png`
* `nieustraszony_odkrywca.png`
* `sniezny_odkrywca.png`

## Środki Ostrożności (Failsafe) 🚨
Skrypt ten przejmuje twardą kontrolę nad Twoją systemową gałką myszki (w przeciwieństwie do wirtualnego okna). Jeżeli bot nie trafi na wybrany cel i zacznie szaleć z poruszaniem wirtualnym ekranem na komputerze, w każdym momencie wystarczy, że mocno **uderzysz myszką fizycznie w jakikolwiek RÓG Twojego monitora!** Zastopuje to proces natychmiastowo zrzucając tak zwany alarm ratunkowy w konsoli kodowania (FailSafeException).
