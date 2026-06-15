# Polski Quiz Sportowy - 100 Pytań

Nowoczesna, interaktywna aplikacja internetowa z quizem sportowym składającym się ze **100 różnorodnych pytań** (podzielonych na kategorie tematyczne). Projekt charakteryzuje się nowoczesnym interfejsem w stylu **Glassmorphism**, dynamicznym timerem oraz pełnym zapisem stanu rozgrywki.

## 🌟 Główne Funkcje

* **Siatka 100 pytań**: Interaktywna plansza z numerowanymi kafelkami. Każde pytanie można wybrać tylko raz.
* **Mechanizm blokowania i wyszarzania**: Po otwarciu i udzieleniu odpowiedzi na pytanie (lub upływie czasu), kafelek na planszy głównej zostaje wyszarzony i zablokowany. Pokazuje również wynik (zielony ptaszek `✓` za poprawną odpowiedź, czerwony krzyżyk `✗` za błędną).
* **Konfigurowalny Timer**: Możliwość ustawienia limitu czasu na pytanie bezpośrednio z poziomu panelu głównego (Brak limitu, 10s, 15s, 30s, 45s, 60s). Pasek odliczania zmniejsza się w sposób płynny (odświeżanie co 100ms) i zmienia kolory przy niskim poziomie czasu.
* **Mechanizm anty-ucieczkowy**: Gdy gracz otworzy pytanie z limitem czasu, nie może zamknąć okna, dopóki nie odpowie lub czas nie minie.
* **Zapisywanie stanu (LocalStorage)**: Stan zablokowanych pytań oraz punkty gracza są trwale zapisywane w pamięci przeglądarki. Odświeżenie strony nie powoduje utraty postępów.
* **Filtrowanie i wyszukiwanie**: Możliwość dynamicznego filtrowania pytań według kategorii tematycznych (Historia, Przepisy, Wyniki, Olimpijczycy, Ogólne) oraz statusu (Dostępne/Zablokowane), a także pełnotekstowa wyszukiwarka pytań.

## 🛠️ Technologia

Projekt został wykonany w klasycznym i ultralekkim stosie technologicznym:
* **HTML5** — Semantyczna struktura dokumentu.
* **Vanilla CSS3** — Zaawansowane style UI w duchu modern glassmorphism (neonowe poświaty, rozmycia teł backdrop-filter, płynne animacje).
* **Vanilla JavaScript (ES6)** — Logika gry, zarządzanie stanem i obsługa localStorage.

## 🚀 Jak Uruchomić Projekt

Aplikacja jest w pełni statyczna i nie wymaga instalacji żadnych zależności czy serwerów.
1. Sklonuj lub pobierz repozytorium.
2. Otwórz plik `index.html` w dowolnej nowoczesnej przeglądarce internetowej (klikając go dwukrotnie).
