# Trading Analyzer - Instrukcja Instalacji i Uruchomienia

Ten projekt zawiera skrypt służący do analizy krótko-terminowej inwestycji na rynkach klasycznych. Wyszukuje sygnały dla Akcji, Surowców i rynku Forex za pomocą bibliotek w języku Python.

## Wymagania
Python 3.8+ 

## Instalacja Zależności
Aby skrypt mógł poprawnie pobierać dane rynkowe z YFinance oraz przeliczać wskaźniki techniczne, przed uruchomieniem niezbędne jest zainstalowanie bibliotek Pythonowych. Należy wywołać to w Twoim środowisku poprzez:

```bash
pip install -r requirements.txt
```

Albo jako bezpośredni link (jeśli nie używasz pliku requirements):
```bash
pip install yfinance pandas pandas-ta requests beautifulsoup4
```

## Uruchomienie

Aby zacząć skaner wejdź w konsoli do lokalizacji z projektem i wpisz:
```bash
python trading_analyzer.py
```

## Zmiana Aktywów
Otwórz plik `trading_analyzer.py` i w funkcji `main()` odnajdziesz tablicę `symbols = [...]`. Możesz dopisać tam inne odpowiedniki tickerów zgodnie ze składnią z Yahoo Finance.

> **ZASTRZEŻENIE**: 
> Narzędzie ma charakter wyłącznie edukacyjny. Kalkulacje oparte o parametry historyczne. Decyzje o ewentualnym wejściu na rynek są ponoszone z ryzykiem utraty kapitału własnego!
