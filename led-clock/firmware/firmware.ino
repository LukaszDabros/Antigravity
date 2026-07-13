#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>      // https://github.com/tzapu/WiFiManager
#include <ArduinoJson.h>     // Biblioteka ArduinoJson v6 lub v7
#include <NTPClient.h>        // https://github.com/taranais/NTPClient
#include <WiFiUdp.h>
#include <FastLED.h>          // https://github.com/FastLED/FastLED
#include <Wire.h>             // Obsługa magistrali I2C
#include <RTClib.h>           // Obsługa RTC DS3231 (Adafruit RTClib)
#include <OneWire.h>          // Protokół OneWire dla DS18B20
#include <DallasTemperature.h> // Obsługa czujnika temperatury DS18B20

// ==========================================
// KONFIGURACJA SPRZĘTOWA LED I CZUJNIKÓW
// ==========================================
#define UPPER_DATA_PIN    14  // GPIO14 (D5) - Rząd górny (Zegar)
#define LOWER_DATA_PIN    13  // GPIO13 (D7) - Rząd dolny (Wyniki)
#define ONE_WIRE_BUS      12  // GPIO12 (D6) - Czujnik temperatury DS18B20
#define RELAY_PIN         16  // GPIO16 (D0) - Przekaźnik sterujący buzzerem (Active LOW)
#define LDR_PIN           A0  // Analogowy sensor jasności LDR (nieużywany bez fizycznego czujnika)

// Inicjalizacja magistral i obiektów czujników
RTC_DS3231 rtc;
OneWire oneWire(ONE_WIRE_BUS);
DallasTemperature sensors(&oneWire);

// Rząd Górny (Małe cyfry zegara/stopera)
#define UPPER_NUM_DIGITS   4
#define UPPER_LEDS_PER_SEG 2  // 2 LEDy na segment (małe cyfry)
#define UPPER_COLON_LEDS   2  // 2 diody dla dwukropka
#define UPPER_LEDS_COUNT   (UPPER_NUM_DIGITS * 7 * UPPER_LEDS_PER_SEG + UPPER_COLON_LEDS) // 58 LED

// Rząd Dolny (Duże cyfry wyników)
#define LOWER_NUM_DIGITS   4
#define LOWER_LEDS_PER_SEG 3  // 3 LEDy na segment (duże cyfry)
#define LOWER_LEDS_COUNT   (LOWER_NUM_DIGITS * 7 * LOWER_LEDS_PER_SEG) // 84 LED

CRGB upperLeds[UPPER_LEDS_COUNT];
CRGB lowerLeds[LOWER_LEDS_COUNT];

// Mapowanie segmentów 7-segmentowych
// NOWA KOLEJNOŚĆ FIZYCZNA W ŁAŃCUCHU LED (bitów w tablicy):
//   [0]=A  [1]=B     [2]=C  [3]=D     [4]=E      [5]=F   [6]=G
//   środek  górny-L  górny  górny-P  dolny-P    dolny   dolny-L
// Taśma LED wchodzi do segmentu A (ŚRODEK), obraca się dookoła cyfry
// i wychodzi do środka kolejnej cyfry (A następnej).
const byte digitSegments[23][7] = {
  // A(śr)  B(gL)  C(góra) D(gP)  E(dP)  F(dół) G(dL)
  {0,     1,     1,     1,     1,     1,     1},  // 0
  {0,     0,     0,     1,     1,     0,     0},  // 1
  {1,     0,     1,     1,     0,     1,     1},  // 2
  {1,     0,     1,     1,     1,     1,     0},  // 3
  {1,     1,     0,     1,     1,     0,     0},  // 4
  {1,     1,     1,     0,     1,     1,     0},  // 5
  {1,     1,     1,     0,     1,     1,     1},  // 6
  {0,     0,     1,     1,     1,     0,     0},  // 7
  {1,     1,     1,     1,     1,     1,     1},  // 8
  {1,     1,     1,     1,     1,     1,     0},  // 9
  {0,     0,     0,     0,     0,     0,     0},  // 10: Spacja (pusty)
  {1,     0,     0,     0,     0,     0,     0},  // 11: Kreska / Minus
  {1,     1,     1,     1,     0,     0,     0},  // 12: Stopień (*)
  {0,     1,     1,     0,     0,     1,     1},  // 13: Litera C
  {1,     1,     1,     1,     0,     0,     1},  // 14: Litera P
  {1,     0,     0,     0,     0,     0,     1},  // 15: Litera r
  {1,     1,     1,     0,     1,     1,     1},  // 16: Litera G (jak 6)
  {1,     0,     0,     0,     1,     1,     1},  // 17: Litera o
  {1,     1,     1,     0,     0,     1,     1},  // 18: Litera E
  {1,     1,     1,     0,     0,     0,     1},  // 19: Litera F
  {1,     0,     0,     0,     1,     0,     1},  // 20: Litera n
  {1,     0,     0,     1,     1,     1,     1},  // 21: Litera d
  {1,     1,     0,     1,     1,     0,     1}   // 22: Litera H
};

// ==========================================
// ZMIENNE SYSTEMOWE
// ==========================================
ESP8266WebServer server(80);
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "tempus1.gum.gov.pl", 7200, 86400000); // Polski serwer czasu NTP, UTC+2 (DST)

String clockMode = "time"; // "time", "stopwatch", "timer", "tabata"
String lowerMode = "score"; // "score", "temp", "date"

CRGB colorClock = CRGB::Red; // Kolor zegara (góra)
CRGB colorA = CRGB::Red;     // Kolor lewej strony (dolny rząd)
CRGB colorB = CRGB::Red;     // Kolor prawej strony (dolny rząd)

int scoreA = 0;
int scoreB = 0;
int temperatureVal = 22;
int dateDay = 1;
int dateMonth = 1;

// Stoper i Minutnik
unsigned long stopwatchStartMs = 0;
unsigned long stopwatchElapsedTime = 0;
bool stopwatchRunning = false;

unsigned long timerTargetTime = 0;
unsigned long timerRemainingMs = 60000;
bool timerRunning = false;

// Tabata
int tabataPrepareSec = 10;
int tabataWorkSec = 20;
int tabataRestSec = 10;
int tabataTotalRounds = 8;
int tabataCurrentRound = 1;

String tabataState = "idle"; // "idle", "prepare", "work", "rest", "finished"
unsigned long tabataTargetTime = 0;
unsigned long tabataRemainingMs = 0;
bool tabataRunning = false;
bool tabataPaused = false;

// Jasność
int ledBrightness = 150;
bool autoBrightness = false; // Wyłączone domyślnie (brak czujnika LDR)
unsigned long lastBrightnessCheck = 0;

// ==========================================
// OBSŁUGA BUZZERA I PRZEKAŹNIKA
// ==========================================

// Sterowanie stanem przekaźnika (Active LOW)
void setBuzzer(bool active) {
  digitalWrite(RELAY_PIN, active ? LOW : HIGH);
}

// Wyzwalanie piknięcia o określonym czasie trwania (w milisekundach)
void triggerBuzzer(int durationMs) {
  setBuzzer(true);
  delay(durationMs);
  setBuzzer(false);
}

// ==========================================
// OBSŁUGA STRUKTURY LED (7-SEGMENTOWEJ)
// ==========================================

// Wyświetla pojedynczy znak na wybranej cyfrze rzędu górnego
void drawUpperDigit(int digitIndex, char value, CRGB color) {
  int digitOffset = digitIndex * 7 * UPPER_LEDS_PER_SEG;
  // Dwukropek w środku paska (za 2 cyframi)
  if (digitIndex >= 2) {
    digitOffset += UPPER_COLON_LEDS;
  }
  
  byte charIndex = 10; // Domyślnie spacja
  if (value >= '0' && value <= '9') charIndex = value - '0';
  else if (value == '-') charIndex = 11;
  else if (value == '*') charIndex = 12;
  else if (value == 'C') charIndex = 13;
  else if (value == 'P') charIndex = 14;
  else if (value == 'r') charIndex = 15;
  else if (value == 'G') charIndex = 16;
  else if (value == 'o') charIndex = 17;
  else if (value == 'E') charIndex = 18;
  else if (value == 'F') charIndex = 19;
  else if (value == 'n') charIndex = 20;
  else if (value == 'd') charIndex = 21;
  else if (value == 'H') charIndex = 22;

  for (int seg = 0; seg < 7; seg++) {
    bool active = digitSegments[charIndex][seg];
    for (int l = 0; l < UPPER_LEDS_PER_SEG; l++) {
      int ledIndex = digitOffset + (seg * UPPER_LEDS_PER_SEG) + l;
      upperLeds[ledIndex] = active ? color : CRGB::Black;
    }
  }
}

// Kontrola dwukropka
void drawUpperColon(bool active, CRGB color) {
  int colonOffset = 2 * 7 * UPPER_LEDS_PER_SEG; // Za drugą cyfrą
  upperLeds[colonOffset] = active ? color : CRGB::Black;
  upperLeds[colonOffset + 1] = active ? color : CRGB::Black;
}

// Wyświetla pojedynczy znak na wybranej cyfrze rzędu dolnego (duże cyfry)
void drawLowerDigit(int digitIndex, char value, CRGB color) {
  int digitOffset = digitIndex * 7 * LOWER_LEDS_PER_SEG;
  
  byte charIndex = 10; // Domyślnie spacja
  if (value >= '0' && value <= '9') charIndex = value - '0';
  else if (value == '-') charIndex = 11;
  else if (value == '*') charIndex = 12;
  else if (value == 'C') charIndex = 13;
  else if (value == 'P') charIndex = 14;
  else if (value == 'r') charIndex = 15;
  else if (value == 'G') charIndex = 16;
  else if (value == 'o') charIndex = 17;
  else if (value == 'E') charIndex = 18;
  else if (value == 'F') charIndex = 19;
  else if (value == 'n') charIndex = 20;
  else if (value == 'd') charIndex = 21;
  else if (value == 'H') charIndex = 22;

  for (int seg = 0; seg < 7; seg++) {
    bool active = digitSegments[charIndex][seg];
    for (int l = 0; l < LOWER_LEDS_PER_SEG; l++) {
      int ledIndex = digitOffset + (seg * LOWER_LEDS_PER_SEG) + l;
      lowerLeds[ledIndex] = active ? color : CRGB::Black;
    }
  }
}

// Specjalna wersja dla litery G - srodkowy segment (A) swieci tylko
// JEDNA DIODA PO PRAWEJ STRONIE (l=2), co upodabnia do prawdziwego G.
void drawLowerDigitG(int digitIndex, CRGB color) {
  int digitOffset = digitIndex * 7 * LOWER_LEDS_PER_SEG;
  byte charIndex = 16; // G

  for (int seg = 0; seg < 7; seg++) {
    bool active = digitSegments[charIndex][seg];
    for (int l = 0; l < LOWER_LEDS_PER_SEG; l++) {
      int ledIndex = digitOffset + (seg * LOWER_LEDS_PER_SEG) + l;
      if (seg == 0 && active) {
        // Segment A (srodkowy): tylko ostatnia dioda (prawa strona)
        lowerLeds[ledIndex] = (l == LOWER_LEDS_PER_SEG - 1) ? color : CRGB::Black;
      } else {
        lowerLeds[ledIndex] = active ? color : CRGB::Black;
      }
    }
  }
}

// ==========================================
// REST API & CORS
// ==========================================

void setCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "POST,GET,OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void handleOptions() {
  setCorsHeaders();
  server.send(200, "text/plain", "");
}

// Endpoint POST /api/state
void handlePostState() {
  setCorsHeaders();
  if (server.hasArg("plain") == false) {
    server.send(400, "application/json", "{\"error\":\"Missing body\"}");
    return;
  }
  
  String body = server.arg("plain");
  StaticJsonDocument<512> doc;
  DeserializationError error = deserializeJson(doc, body);

  if (error) {
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  if (doc.containsKey("mode")) {
    clockMode = doc["mode"].as<String>();
  }
  if (doc.containsKey("scoreA")) {
    scoreA = doc["scoreA"].as<int>();
  }
  if (doc.containsKey("scoreB")) {
    scoreB = doc["scoreB"].as<int>();
  }
  if (doc.containsKey("stopwatchMs")) {
    unsigned long ms = doc["stopwatchMs"].as<unsigned long>();
    if (ms == 0) {
      stopwatchElapsedTime = 0;
      stopwatchRunning = false;
    } else {
      stopwatchElapsedTime = ms;
      stopwatchStartMs = millis() - stopwatchElapsedTime;
      stopwatchRunning = true;
    }
  }
  if (doc.containsKey("timerRem")) {
    timerRemainingMs = doc["timerRem"].as<unsigned long>() * 1000;
  }
  if (doc.containsKey("timerRemMs")) {
    timerRemainingMs = doc["timerRemMs"].as<unsigned long>();
  }
  if (doc.containsKey("timerRunning")) {
    timerRunning = doc["timerRunning"].as<bool>();
    if (timerRunning) {
      timerTargetTime = millis() + timerRemainingMs;
    }
  }
  if (doc.containsKey("lowerMode")) {
    lowerMode = doc["lowerMode"].as<String>();
  }
  if (doc.containsKey("tempVal")) {
    temperatureVal = doc["tempVal"].as<int>();
  }
  if (doc.containsKey("dateDay")) {
    dateDay = doc["dateDay"].as<int>();
  }
  if (doc.containsKey("dateMonth")) {
    dateMonth = doc["dateMonth"].as<int>();
  }
  if (doc.containsKey("colorClock")) {
    JsonArray arr = doc["colorClock"].as<JsonArray>();
    colorClock = CRGB(arr[0].as<byte>(), arr[1].as<byte>(), arr[2].as<byte>());
  }
  if (doc.containsKey("colorA")) {
    JsonArray arr = doc["colorA"].as<JsonArray>();
    colorA = CRGB(arr[0].as<byte>(), arr[1].as<byte>(), arr[2].as<byte>());
  }
  if (doc.containsKey("colorB")) {
    JsonArray arr = doc["colorB"].as<JsonArray>();
    colorB = CRGB(arr[0].as<byte>(), arr[1].as<byte>(), arr[2].as<byte>());
  }

  // Obsługa Tabaty
  if (doc.containsKey("tabataPrepare")) {
    tabataPrepareSec = doc["tabataPrepare"].as<int>();
  }
  if (doc.containsKey("tabataWork")) {
    tabataWorkSec = doc["tabataWork"].as<int>();
  }
  if (doc.containsKey("tabataRest")) {
    tabataRestSec = doc["tabataRest"].as<int>();
  }
  if (doc.containsKey("tabataRounds")) {
    tabataTotalRounds = doc["tabataRounds"].as<int>();
  }
  if (doc.containsKey("tabataAction")) {
    String action = doc["tabataAction"].as<String>();
    if (action == "start") {
      if (tabataState == "idle" || tabataState == "finished") {
        tabataState = "prepare";
        tabataCurrentRound = 1;
        tabataTargetTime = millis() + (unsigned long)tabataPrepareSec * 1000;
        tabataRemainingMs = (unsigned long)tabataPrepareSec * 1000;
      } else if (tabataPaused) {
        tabataPaused = false;
        tabataTargetTime = millis() + tabataRemainingMs;
      }
      tabataRunning = true;
    } else if (action == "pause") {
      if (tabataRunning && !tabataPaused) {
        tabataPaused = true;
        tabataRemainingMs = tabataTargetTime - millis();
      }
    } else if (action == "reset") {
      tabataRunning = false;
      tabataPaused = false;
      tabataState = "idle";
      tabataCurrentRound = 1;
      tabataRemainingMs = 0;
    }
  }

  server.send(200, "application/json", "{\"status\":\"ok\"}");
}

// Endpoint POST /api/settings
void handlePostSettings() {
  setCorsHeaders();
  if (server.hasArg("plain") == false) {
    server.send(400, "application/json", "{\"error\":\"Missing body\"}");
    return;
  }

  String body = server.arg("plain");
  StaticJsonDocument<128> doc;
  DeserializationError error = deserializeJson(doc, body);

  if (error) {
    server.send(400, "application/json", "{\"error\":\"Invalid JSON\"}");
    return;
  }

  if (doc.containsKey("brightness")) {
    ledBrightness = doc["brightness"].as<int>();
    if (!autoBrightness) {
      FastLED.setBrightness(ledBrightness);
    }
  }
  if (doc.containsKey("auto")) {
    autoBrightness = doc["auto"].as<int>() == 1;
  }

  server.send(200, "application/json", "{\"status\":\"ok\"}");
}

// Endpoint GET /api/status
void handleGetStatus() {
  setCorsHeaders();
  StaticJsonDocument<512> doc;
  doc["mode"] = clockMode;
  doc["lowerMode"] = lowerMode;
  doc["scoreA"] = scoreA;
  doc["scoreB"] = scoreB;
  doc["tempVal"] = temperatureVal;
  doc["dateDay"] = dateDay;
  doc["dateMonth"] = dateMonth;
  doc["brightness"] = ledBrightness;
  doc["auto"] = autoBrightness ? 1 : 0;
  
  // Tabata status
  doc["tabataState"] = tabataState;
  doc["tabataRound"] = tabataCurrentRound;
  doc["tabataRounds"] = tabataTotalRounds;
  doc["tabataRemMs"] = tabataRunning && !tabataPaused ? (tabataTargetTime - millis()) : tabataRemainingMs;
  doc["tabataRunning"] = tabataRunning ? 1 : 0;
  doc["tabataPaused"] = tabataPaused ? 1 : 0;
  
  String output;
  serializeJson(doc, output);
  server.send(200, "application/json", output);
}

// ==========================================
// FUNKCJE STANDARDOWE
// ==========================================

void setup() {
  Serial.begin(115200);

  // Konfiguracja przekaźnika (D0) i wyłączenie buzzera na starcie (Active LOW)
  pinMode(RELAY_PIN, OUTPUT);
  digitalWrite(RELAY_PIN, HIGH);

  // Inicjalizacja I2C dla RTC DS3231 (SDA=D2, SCL=D1)
  Wire.begin(4, 5);
  if (!rtc.begin()) {
    Serial.println("Nie znaleziono RTC DS3231!");
  } else {
    Serial.println("Inicjalizacja RTC powiodła się.");
    if (rtc.lostPower()) {
      Serial.println("RTC utraciło zasilanie, synchronizacja z czasem kompilacji...");
      rtc.adjust(DateTime(F(__DATE__), F(__TIME__)));
    }
  }

  // Inicjalizacja czujnika temperatury DS18B20 (D6)
  sensors.begin();
  sensors.setWaitForConversion(false); // Odczyt nieblokujący

  // Inicjalizacja LED
  FastLED.addLeds<WS2812B, UPPER_DATA_PIN, GRB>(upperLeds, UPPER_LEDS_COUNT).setCorrection(TypicalLEDStrip);
  FastLED.addLeds<WS2812B, LOWER_DATA_PIN, GRB>(lowerLeds, LOWER_LEDS_COUNT).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(ledBrightness);

  // Pokaz powitalny i piknięcie buzzera
  fill_solid(upperLeds, UPPER_LEDS_COUNT, CRGB::Red);
  fill_solid(lowerLeds, LOWER_LEDS_COUNT, CRGB::Red);
  FastLED.show();
  triggerBuzzer(150); // Krótkie piknięcie powitalne
  delay(850);
  FastLED.clear(true);

  // WiFiManager konfiguruje portal połączalności
  WiFiManager wm;
  // Próba automatycznego łączenia, jeśli się nie uda - otwiera AP o nazwie "LED-Clock-Setup"
  if (!wm.autoConnect("LED-Clock-Setup")) {
    Serial.println("Nie udało się połączyć, restart...");
    delay(3000);
    ESP.restart();
  }

  Serial.println("Połączono z WiFi!");
  timeClient.begin();

  // Konfiguracja serwera REST API
  server.on("/api/state", HTTP_POST, handlePostState);
  server.on("/api/settings", HTTP_POST, handlePostSettings);
  server.on("/api/status", HTTP_GET, handleGetStatus);
  
  // Włączenie obsługi zapytań preflight OPTIONS (CORS)
  server.on("/api/state", HTTP_OPTIONS, handleOptions);
  server.on("/api/settings", HTTP_OPTIONS, handleOptions);
  server.on("/api/status", HTTP_OPTIONS, handleOptions);

  server.begin();
  Serial.println("Serwer HTTP uruchomiony!");
}

void updateBrightness() {
  if (!autoBrightness) return;

  unsigned long now = millis();
  if (now - lastBrightnessCheck > 2000) { // Weryfikacja co 2 sekundy
    lastBrightnessCheck = now;
    int rawLdr = analogRead(LDR_PIN);
    // Przeliczenie LDR na zakres jasności FastLED (15 - 255)
    // Założenie: Niski odczyt LDR = ciemno, Wysoki = jasno
    int targetBrightness = map(rawLdr, 100, 900, 15, 255);
    targetBrightness = constrain(targetBrightness, 15, 255);
    FastLED.setBrightness(targetBrightness);
  }
}

void getLocalTime(int &hrs, int &mins, int &secs) {
  // Jeśli połączono z WiFi, synchronizujemy NTP i uaktualniamy RTC co godzinę
  if (WiFi.status() == WL_CONNECTED) {
    timeClient.update();
    hrs = timeClient.getHours();
    mins = timeClient.getMinutes();
    secs = timeClient.getSeconds();

    static unsigned long lastRtcSync = 0;
    if (millis() - lastRtcSync > 3600000 || lastRtcSync == 0) { // Co 1 godzinę
      lastRtcSync = millis();
      unsigned long epochTime = timeClient.getEpochTime();
      rtc.adjust(DateTime(epochTime));
      Serial.println("Zsynchronizowano zegar RTC z serwerem czasu NTP.");
    }
  } else {
    // Brak połączenia WiFi -> czytamy bezpośrednio z modułu RTC
    DateTime now = rtc.now();
    hrs = now.hour();
    mins = now.minute();
    secs = now.second();
  }
}

void renderUpperRow() {
  CRGB color = colorClock;

  if (clockMode == "time") {
    int hrs, mins, secs;
    getLocalTime(hrs, mins, secs);
    
    String hrsStr = String(hrs);
    if (hrs < 10) hrsStr = "0" + hrsStr;
    String minsStr = String(mins);
    if (mins < 10) minsStr = "0" + minsStr;

    drawUpperDigit(0, hrsStr[0], color);
    drawUpperDigit(1, hrsStr[1], color);
    drawUpperDigit(2, minsStr[0], color);
    drawUpperDigit(3, minsStr[1], color);

    // Miganie dwukropka zsynchronizowane z sekundami
    bool blink = (secs % 2 == 0);
    drawUpperColon(blink, color);

  } else if (clockMode == "stopwatch") {
    // Renderowanie stopera
    unsigned long elapsed = stopwatchElapsedTime;
    if (stopwatchRunning) {
      elapsed = millis() - stopwatchStartMs;
    }
    
    unsigned long totalSec = elapsed / 1000;
    unsigned long mins = totalSec / 60;
    unsigned long secs = totalSec % 60;
    unsigned long centis = (elapsed % 1000) / 10;

    if (mins > 0) {
      // Format MM:SS
      String mStr = String(mins);
      if (mins < 10) mStr = "0" + mStr;
      String sStr = String(secs);
      if (secs < 10) sStr = "0" + sStr;
      
      drawUpperDigit(0, mStr[0], color);
      drawUpperDigit(1, mStr[1], color);
      drawUpperDigit(2, sStr[0], color);
      drawUpperDigit(3, sStr[1], color);
    } else {
      // Format SS:CC (Sekundy i setne części sekundy)
      String sStr = String(secs);
      if (secs < 10) sStr = "0" + sStr;
      String cStr = String(centis);
      if (centis < 10) cStr = "0" + cStr;
      
      drawUpperDigit(0, sStr[0], color);
      drawUpperDigit(1, sStr[1], color);
      drawUpperDigit(2, cStr[0], color);
      drawUpperDigit(3, cStr[1], color);
    }
    // Miganie dwukropka zsynchronizowane z sekundami stopera
    bool blink = !stopwatchRunning || (secs % 2 == 0);
    drawUpperColon(blink, color);

  } else if (clockMode == "timer") {
    // Minutnik
    long remVal = timerRemainingMs;
    static unsigned long timerAlarmEndTime = 0;

    if (timerRunning) {
      remVal = (long)timerTargetTime - (long)millis();
      if (remVal <= 0) {
        timerRemainingMs = 0;
        timerRunning = false;
        remVal = 0;
        // Aktywacja alarmu na 3 sekundy
        timerAlarmEndTime = millis() + 3000;
      } else {
        timerRemainingMs = remVal;
      }
    }

    // Sprawdzenie czy trwa alarm po zakończeniu odliczania (przez 3 sekundy)
    bool isAlarmActive = false;
    if (timerRemainingMs == 0 && timerAlarmEndTime > 0) {
      if (millis() < timerAlarmEndTime) {
        isAlarmActive = true;
        // Naprzemienne miganie Biały / Czerwony co 150 ms
        bool activeCycle = ((millis() / 150) % 2 == 0);
        color = activeCycle ? CRGB::White : CRGB::Red;
        setBuzzer(activeCycle); // Buzzer bipa razem z miganiem na biało
      } else {
        timerAlarmEndTime = 0; // Koniec alarmu
        setBuzzer(false); // Upewnij się, że wyłączysz buzzer
      }
    }

    if (remVal < 60000) {
      // Format SS:CC (Sekundy i setne sekundy)
      unsigned long secs = remVal / 1000;
      unsigned long centis = (remVal % 1000) / 10;

      String sStr = String(secs);
      if (secs < 10) sStr = "0" + sStr;
      String cStr = String(centis);
      if (centis < 10) cStr = "0" + cStr;

      drawUpperDigit(0, sStr[0], color);
      drawUpperDigit(1, sStr[1], color);
      drawUpperDigit(2, cStr[0], color);
      drawUpperDigit(3, cStr[1], color);
      
      // Miganie dwukropka zsynchronizowane z sekundami minutnika
      bool blink = !timerRunning || (secs % 2 == 0);
      drawUpperColon(blink, color);
    } else {
      // Format MM:SS (Minuty i sekundy)
      unsigned long mins = remVal / 60000;
      unsigned long secs = (remVal % 60000) / 1000;

      String mStr = String(mins);
      if (mins < 10) mStr = "0" + mStr;
      String sStr = String(secs);
      if (secs < 10) sStr = "0" + sStr;

      drawUpperDigit(0, mStr[0], color);
      drawUpperDigit(1, mStr[1], color);
      drawUpperDigit(2, sStr[0], color);
      drawUpperDigit(3, sStr[1], color);

      // Miganie dwukropka zsynchronizowane z sekundami minutnika
      bool blink = !timerRunning || (secs % 2 == 0);
      drawUpperColon(blink, color);
    }
  } else if (clockMode == "tabata") {
    unsigned long remMs = 0;
    if (tabataState == "idle") {
      remMs = (unsigned long)tabataPrepareSec * 1000;
    } else if (tabataState == "finished") {
      remMs = 0;
    } else if (tabataRunning && !tabataPaused) {
      long val = (long)tabataTargetTime - (long)millis();
      remMs = (val > 0) ? val : 0;
    } else {
      remMs = tabataRemainingMs;
    }

    unsigned long totalSec = remMs / 1000;
    unsigned long mins = totalSec / 60;
    unsigned long secs = totalSec % 60;

    String mStr = String(mins);
    if (mins < 10) mStr = "0" + mStr;
    String sStr = String(secs);
    if (secs < 10) sStr = "0" + sStr;

    // Dobór koloru na bazie fazy Tabaty
    CRGB tabCol = CRGB::Cyan;
    if (tabataState == "work") tabCol = CRGB::Red;
    else if (tabataState == "rest") tabCol = CRGB::Green;
    else if (tabataState == "finished") tabCol = ((millis() / 250) % 2 == 0) ? CRGB::Magenta : CRGB::Black;
    else if (tabataState == "idle") tabCol = colorClock;

    drawUpperDigit(0, mStr[0], tabCol);
    drawUpperDigit(1, mStr[1], tabCol);
    drawUpperDigit(2, sStr[0], tabCol);
    drawUpperDigit(3, sStr[1], tabCol);

    // Dwukropek mruga w takt sekund
    bool blink = (tabataState == "idle" || tabataPaused) || (secs % 2 == 0);
    drawUpperColon(blink, tabCol);
  }
}

void renderLowerRow() {
  if (clockMode == "tabata") {
    CRGB tabCol = CRGB::Cyan;
    if (tabataState == "work") tabCol = CRGB::Red;
    else if (tabataState == "rest") tabCol = CRGB::Green;
    else if (tabataState == "finished") tabCol = ((millis() / 250) % 2 == 0) ? CRGB::Magenta : CRGB::Black;
    else if (tabataState == "idle") tabCol = colorClock;

    if (tabataState == "finished") {
      // Dolny rząd pokazuje " EnD" (End)
      drawLowerDigit(0, ' ', tabCol);
      drawLowerDigit(1, 'E', tabCol);
      drawLowerDigit(2, 'n', tabCol);
      drawLowerDigit(3, 'd', tabCol);
    } else {
      // Lewa strona: numer rundy, np. "r1" lub "r8" w idle
      int activeRound = (tabataState == "idle") ? tabataTotalRounds : tabataCurrentRound;
      drawLowerDigit(0, 'r', tabCol);
      drawLowerDigit(1, '0' + (activeRound % 10), tabCol);

      // Prawa strona: status fazy "PR", "GO", "--"
      if (tabataState == "idle" || tabataState == "prepare") {
        drawLowerDigit(2, 'P', tabCol);
        drawLowerDigit(3, 'r', tabCol); // r = najblizsze R na 7-seg
      } else if (tabataState == "work") {
        drawLowerDigitG(2, tabCol); // G ze skróconym środkiem (1 dioda po prawej)
        drawLowerDigit(3, '0', tabCol); // '0' = duze O na 7-seg
      } else if (tabataState == "rest") {
        drawLowerDigit(2, '-', tabCol);
        drawLowerDigit(3, '-', tabCol);
      }
    }
    return;
  }

  String currentMode = lowerMode;
  if (lowerMode == "cycle") {
    // Automatyczne przełączanie: 5 sekund temperatura, 5 sekund data
    currentMode = ((millis() / 5000) % 2 == 0) ? "temp" : "date";
  }

  if (currentMode == "score") {
    // Gospodarze (Home) - 2 lewe cyfry dolnego rzędu
    String scoreAStr = String(scoreA);
    if (scoreA < 10) scoreAStr = " " + scoreAStr; // Wyrównanie do prawej (puste wiodące)
    drawLowerDigit(0, scoreAStr[0], colorA);
    drawLowerDigit(1, scoreAStr[1], colorA);

    // Goście (Away) - 2 prawe cyfry dolnego rzędu
    String scoreBStr = String(scoreB);
    if (scoreB < 10) scoreBStr = " " + scoreBStr;
    drawLowerDigit(2, scoreBStr[0], colorB);
    drawLowerDigit(3, scoreBStr[1], colorB);
  } 
  else if (currentMode == "temp") {
    // Temperatura, np. "22*C" lub "-5*C"
    String tempStr = String(temperatureVal);
    if (temperatureVal >= 0 && temperatureVal < 10) {
      tempStr = " " + tempStr; // Wyrównanie do prawej
    }
    drawLowerDigit(0, tempStr[0], colorA);
    drawLowerDigit(1, tempStr[1], colorA);
    
    // Znak stopnia (*) i litera C (C)
    drawLowerDigit(2, '*', colorB);
    drawLowerDigit(3, 'C', colorB);
  } 
  else if (currentMode == "date") {
    // Data - dzień i miesiąc, np. "02 07"
    String dayStr = String(dateDay);
    if (dateDay < 10) dayStr = "0" + dayStr;
    drawLowerDigit(0, dayStr[0], colorA);
    drawLowerDigit(1, dayStr[1], colorA);

    String monthStr = String(dateMonth);
    if (dateMonth < 10) monthStr = "0" + monthStr;
    drawLowerDigit(2, monthStr[0], colorB);
    drawLowerDigit(3, monthStr[1], colorB);
  }
}

unsigned long lastTempUpdate = 0;
void updateTemperature() {
  unsigned long now = millis();
  if (now - lastTempUpdate > 10000 || lastTempUpdate == 0) {
    lastTempUpdate = now;
    sensors.requestTemperatures();
    float tempC = sensors.getTempCByIndex(0);
    
    // Jeśli czujnik jest prawidłowo podłączony
    if (tempC != DEVICE_DISCONNECTED_C && tempC > -50.0 && tempC < 80.0) {
      temperatureVal = (int)round(tempC);
    } else {
      Serial.println("Błąd odczytu DS18B20!");
    }
  }
}

void updateTabata() {
  if (clockMode != "tabata" || !tabataRunning || tabataPaused) return;

  long remMs = (long)tabataTargetTime - (long)millis();
  
  // Odliczanie ostatnich 3 sekund faz przygotowania lub odpoczynku (krótkie piknięcie na sekundy 3, 2, 1)
  static int lastSecBuzzed = -1;
  int currentSecRemaining = remMs / 1000;
  if (tabataState == "prepare" || tabataState == "rest") {
    if (remMs > 0 && currentSecRemaining <= 3 && currentSecRemaining > 0 && currentSecRemaining != lastSecBuzzed) {
      lastSecBuzzed = currentSecRemaining;
      triggerBuzzer(100);
    }
  }

  if (remMs <= 0) {
    lastSecBuzzed = -1; // Reset pamięci odliczania sekundy
    // Przejścia stanów maszyny Tabaty
    if (tabataState == "prepare") {
      tabataState = "work";
      tabataTargetTime = millis() + (unsigned long)tabataWorkSec * 1000;
      triggerBuzzer(500); // 1 długi sygnał na start wysiłku
    } else if (tabataState == "work") {
      if (tabataCurrentRound >= tabataTotalRounds) {
        tabataState = "finished";
        tabataRunning = false;
        // Koniec treningu - 3 wyraźne sygnały
        for (int i = 0; i < 3; i++) {
          triggerBuzzer(300);
          if (i < 2) delay(150);
        }
      } else {
        tabataState = "rest";
        tabataTargetTime = millis() + (unsigned long)tabataRestSec * 1000;
        // Start odpoczynku - 2 krótkie sygnały
        triggerBuzzer(150);
        delay(100);
        triggerBuzzer(150);
      }
    } else if (tabataState == "rest") {
      tabataState = "work";
      tabataCurrentRound++;
      tabataTargetTime = millis() + (unsigned long)tabataWorkSec * 1000;
      triggerBuzzer(500); // 1 długi sygnał na start wysiłku
    }
  }
}

void loop() {
  server.handleClient();
  updateTemperature();
  updateBrightness();
  updateTabata();

  renderUpperRow();
  renderLowerRow();

  FastLED.show();
  delay(30); // Ok. 33 FPS odświeżania taśm LED
}
