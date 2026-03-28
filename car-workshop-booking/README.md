# Instrukcja uruchomienia projektu "MOTOFIX"

Gratulacje! Strona Twojego warsztatu wraz z systemem rezerwacji została przygotowana lokalnie. 
Aby zacząć w pełni z niej korzystać i testować rezerwacje wizyt połączone z Firebase, wykonaj poniższe kroki.

## 1. Utworzenie bazy danych Firebase
Projekt oparty jest na chmurze Firebase firmy Google (bezpłatny pakiet Spark jest w 100% wystarczający do Twoich celów).
1. Wejdź na stronę [Firebase Console](https://console.firebase.google.com/) i zaloguj się kontem Google.
2. Kliknij **„Dodaj projekt” (Add project)**, wpisz nazwę (np. "Motofix-App") i dokończ proces.
3. W menu po lewej stronie wybierz **Firestore Database** i kliknij **„Utwórz bazę danych” (Create database)**.
4. Wybierz lokalizację serwera (najlepiej docelowo `eur3` (Europa)) i rozpocznij w trybie **testowym (Test mode)** (pozwala na odczyt/zapis przez pierwsze 30 dni be zabezpieczeń - idealne do developmentu).
5. Teraz z Menu bocznego Firebase wybierz ikonę ⚙️ **Ustawienia projektu (Project variables)**.
6. Na dole w sekcji "Twoje aplikacje" (Your apps) kliknij ikonę **</>** (Web app), aby zarejestrować aplikację. Nadaj jej nazwę (np. "motofix-web").
7. Pokaże Ci się ostateczny fragment kodu `const firebaseConfig = { ... }`. Skopiuj same wartości.

## 2. Podpięcie kluczy API do aplikacji
Te klucze weryfikują Twoją stronę internetową w chmurze Google. **Kluczy tych nie wolno udostępniać w publicznych repozytoriach**.

W głównym folderze projektu (tam gdzie znajduje się `package.json`), posiadasz (lub utwórz) plik o nazwie `.env.local`. 
Wklej tam zmienne z dopiskiem na początku `NEXT_PUBLIC_` w taki sposób, podmieniając wartości na te wyciągnięte z Twojego Firebase:

```env
NEXT_PUBLIC_FIREBASE_API_KEY="AIzaSyA..."
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="motofix-123.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="motofix-123"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="motofix-123.appspot.com"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="123456789"
NEXT_PUBLIC_FIREBASE_APP_ID="1:123456789:web:abcdef"
```

Aplikacja ma skonfigurowany plik `src/lib/firebase/config.ts`, który bezpiecznie pobierze te wartości.

## 3. Inicjacja kolekcji na start (Istotne!)
Twój kod działa na dwóch zasobach. Zanim strona będzie działać poprawnie, musimy zainicjować "Ustawienia Warsztatu".

Aplikacja jest już zaprogramowana do autogenerowania ich, wystarczy że wejdziesz w Panel Admina (`/admin/calendar`) jako pierwszą czynność po poprawnej konfiguracji pliku `.env.local`. Kod sam uwierzytelni się i wyśle do Firestore dokument o nazwie bazowej `workshop_settings`.

## 4. Uruchomienie lokalnie z podpiętą bazą
Aby włączyć stronę lokalnie w trybie przeglądania:

1. Otwórz terminal w konsoli systemu operacyjnego lub w VSCode.
2. Upewnij się, że jesteś w folderze `C:\Users\dabro\.gemini\antigravity\scratch\car-workshop-booking`.
3. Uruchom wiersz komend:
```bash
npm run dev
```
*(Windows czasem wymaga `npm.cmd run dev`)*

Strona od teraz nasłuchuje pod adresem **`http://localhost:3000`**. Odwiedź ten link w dowolnej przeglądarce i zacznij korzystać z panelu Landing Page, formularza `http://localhost:3000/rezerwacja` oraz panelu do zarządzania wizytami `http://localhost:3000/admin`. Wszelkie rezerwacje utworzone z perspektywy kalendarza będą lądować real-time w Twojej bazie danych Firebase.
