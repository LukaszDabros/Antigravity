import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="animate-fade-in">
            <header className="glass-panel" style={{ padding: '3rem 2rem', marginBottom: '3rem', textAlign: 'center' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Polityka Prywatności i Pliki Cookies</h1>
                <div style={{ width: '60px', height: '4px', background: 'var(--primary)', margin: '0 auto', borderRadius: '2px' }}></div>
            </header>

            <div className="container" style={{ maxWidth: '800px' }}>
                <div className="glass-panel page-content" style={{ padding: '3rem', minHeight: '400px', lineHeight: '1.8', display: 'flow-root' }}>

                    <h2>1. Informacje Ogólne</h2>
                    <p>
                        Zgodnie z wymogami Rozporządzenia Parlamentu Europejskiego i Rady (UE) 2016/679 (RODO) oraz Prawa Telekomunikacyjnego,
                        niniejsza polityka określa zasady gromadzenia, przetwarzania oraz ochrony danych osobowych użytkowników, a także zasady
                        korzystania z plików cookies w serwisie edukacyjnym EDB.
                    </p>

                    <h2>2. Przetwarzanie Danych Osobowych</h2>
                    <p>
                        Serwis ma charakter edukacyjny. Korzystanie z publicznej części serwisu (przeglądanie materiałów, czytanie stron)
                        nie wymaga podawania danych osobowych. W przypadku przesyłania zadań poprzez formularz (jeśli Twoje imię, nazwisko
                        lub adres widnieje w przesłanym zadaniu), dane te służą wyłącznie do weryfikacji zadania przez nauczyciela i ulegają
                        kasacji po procesie oceniania.
                    </p>

                    <h2>3. Logi Serwera</h2>
                    <p>
                        Podczas odwiedzin serwisu automatycznie zapisywane są standardowe logi systemowe (adres IP, data i czas wizyty, rodzaj przeglądarki).
                        Logi te służą wyłącznie do celów technicznych i administracyjnych dla zapewnienia bezpieczeństwa oraz stabilności serwisu,
                        nie są kojarzone z konkretnymi osobami przeglądającymi portal.
                    </p>

                    <h2>4. Polityka Cookies (Ciasteczka)</h2>
                    <p>
                        Serwis automatycznie zbiera informacje zawarte w plikach cookies. Są to pliki tekstowe wysyłane przez serwer
                        i zapisywane po stronie urządzenia końcowego użytkownika (np. na komputerze, tablecie, smartfonie).
                    </p>
                    <ul>
                        <li><strong>Cookies sesyjne:</strong> pliki tymczasowe, służące do utrzymania logowania (w przypadku panelu administratora) i prawidłowego układu strony do momentu wyłączenia przeglądarki.</li>
                        <li><strong>Cookies statystyczne:</strong> mogą być stosowane w celu zrozumienia w jaki sposób użytkownicy zachowują się na stronie, co pozwala na ulepszanie jej struktury i zawartości.</li>
                        <li><strong>Pliki zewnętrzne:</strong> wyświetlane w serwisie materiały (np. Prezentacje Google, filmy YouTube) mogą wymagać osadzania treści zewnętrznych. Mogą one zapisywać w przeglądarce własne ciasteczka, nad którymi serwis EDB nie ma kontroli - podlegają one regulaminom usługodawców zewnętrznych.</li>
                    </ul>

                    <h2>5. Zarządzanie Plikami Cookies</h2>
                    <p>
                        Korzystanie z serwisu bez zmiany ustawień przeglądarki oznacza zgodę na umieszczanie plików cookies.
                        W każdym momencie można samodzielnie zmienić ustawienia obsługi cookies w opcjach swojej przeglądarki internetowej
                        (np. zablokować ich przyjmowanie). Zablokowanie ciasteczek może wpłynąć negatywnie na działanie niektórych elementów strony.
                    </p>

                    <h2>6. Odnośniki do innych stron</h2>
                    <p>
                        Serwis zawiera odnośniki do innych stron internetowych oraz edukacyjnych prezentacji w zewnętrznym środowisku Google.
                        Administrator nie ponosi odpowiedzialności za zasady zachowania prywatności obowiązujące na tych stronach.
                    </p>
                </div>
            </div>
        </div>
    );
}
