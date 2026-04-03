# TSO Royal Auto-Explorer 👑

Profesjonalny i niezawodny bot (autoclicker) do zautomatyzowanego zarządzania okienkami i wysyłania odkrywców w grze "The Settlers Online". Projekt przeszedł ewolucję z prostego skryptu PyAutoGUI do zaawansowanego silnika **OpenCV**, przystosowanego do pracy w warunkach ekstremalnych lagów serwera.

## ✨ Kluczowe Funkcje (Wersja Royal)

- **🚀 OpenCV Fast-Scan**: Silnik bota wykonuje jeden zrzut ekranu na cykl i przeszukuje go błyskawicznie w pamięci RAM. Eliminuje to "mrożenie" myszki i zapewnia natychmiastową reakcję na polecenia.
- **🛡️ Kwarantanna Brzegowa (50px)**: Bot całkowicie ignoruje obszary znajdujące się bliżej niż 50 pikseli od każdej krawędzi ekranu. Zapobiega to przypadkowym kliknięciom w pasek zadań, obramowania przeglądarki czy "uciekaniu" myszki w róg ekranu (0,0).
- **🛑 Panic Button (ESC)**: Reakcja na klawisz ESC jest sprawdzana co 50ms. Uderzenie w ESC natychmiast przerywa pracę bota na każdym etapie.
- **🔍 Triple-Tier Confidence**: Bot szuka ikon na trzech poziomach pewności (75%, 60%, 50%). Pozwala to na skuteczne wykrywanie odkrywców (np. Zapalonego) nawet przy rozmytych animacjach lub zmiennym tle Menu Gwiazdy.
- **⏳ Lag Buffer 2.5s**: Wbudowane opóźnienie między cyklami wysyłki, które chroni bota przed błędami wynikającymi z wolnego odświeżania się interfejsu gry TSO.
- **📊 FailSafe UI**: Bot komunikuje się z użytkownikiem poprzez interfejs Eel, wyświetlając jasne komunikaty o stanie pracy, procentach dopasowania ikon oraz ewentualnym zadziałaniu zabezpieczeń (np. FailSafe przy ruchu w róg ekranu).

## 🛠️ Wymagania

- [Python 3.8+](https://www.python.org/downloads/)
- Biblioteki wymienione w `requirements.txt` (OpenCV, PyAutoGUI, Eel, PyWin32, Cryptography).

Instalacja:
```bash
pip install -r requirements.txt
```

## 📖 Instrukcja Obsługi

1.  **Przygotowanie**: Upewnij się, że gra działa w przeglądarce i Menu Gwiazdy jest widoczne.
2.  **Uruchomienie**: Odpal plik `main.py`. Otworzy się panel sterowania "Royal Explorer".
3.  **Wybór**: Zaznacz odkrywców, których chcesz wysłać, i wybierz rodzaj zadania.
4.  **Start**: Kliknij START. Okno bota zminimalizuje się automatycznie, a proces wysyłki ruszy.

### 🚨 Bezpieczeństwo (Killswitch)
Jeśli bot zacznie zachowywać się nieprzewidywalnie:
1.  **Naciśnij ESC** na klawiaturze.
2.  LUB **Gwałtownie przesuń myszkę w dowolny RÓG monitora** (zadziała systemowy FailSafe).

## 📁 Struktura i Grafiki
Bot bazuje na plikach `.png` w folderze głównym. Kluczowe elementy interfejsu to:
- `gwiazda.png` - Menu Gwiazdy
- `ekipa.png` - Zakładka specjalistów
- `pinezka.png` - Ikona blokady okna
- `zapalony_odkrywca.png`, `uroczy_odkrywca.png` itp. - Ikony konkretnych specjalistów.

---
*Projekt zoptymalizowany pod kątem wydajności i bezpieczeństwa użytkownika.*
