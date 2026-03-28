// config.js
// Zmień to na adres swojej domeny po wgraniu na 7m.pl (np. 'https://twojadomena.7m.pl/api')
// W środowisku produkcyjnym domyślnie używa 'api' ze ścieżki względnej
// Ponieważ używamy HashRouter (np. /#/admin) to relatywne połączanie do 'api/get_...'
// musi iść z bazowego URL-a! Wpisz z przodu slash:
export const API_BASE_URL = 'https://edb.7m.pl/api';
