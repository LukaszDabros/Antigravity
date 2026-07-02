#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <WiFiManager.h>      // https://github.com/tzapu/WiFiManager
#include <ArduinoJson.h>     // Biblioteka ArduinoJson v6 lub v7
#include <NTPClient.h>        // https://github.com/taranais/NTPClient
#include <WiFiUdp.h>
#include <FastLED.h>          // https://github.com/FastLED/FastLED

// ==========================================
// KONFIGURACJA SPRZĘTOWA LED
// ==========================================
#define UPPER_DATA_PIN    14  // GPIO14 (D5) - Rząd górny (Zegar)
#define LOWER_DATA_PIN    12  // GPIO12 (D6) - Rząd dolny (Wyniki)
#define LDR_PIN           A0  // Analogowy sensor jasności LDR

// Rząd Górny (Małe cyfry zegara/stopera)
#define UPPER_NUM_DIGITS   4
#define UPPER_LEDS_PER_SEG 2  // 2 LEDy na segment (małe cyfry)
#define UPPER_COLON_LEDS   2  // 2 diody dla dwukropka
#define UPPER_LEDS_COUNT   (UPPER_NUM_DIGITS * 7 * UPPER_LEDS_PER_SEG + UPPER_COLON_LEDS) // 4x7x2 + 2 = 58 LED

// Rząd Dolny (Duże cyfry wyników)
#define LOWER_NUM_DIGITS   4
#define LOWER_LEDS_PER_SEG 3  // 3 LEDy na segment (duże cyfry)
#define LOWER_LEDS_COUNT   (LOWER_NUM_DIGITS * 7 * LOWER_LEDS_PER_SEG) // 4x7x3 = 84 LED

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
bool autoBrightness = true;
unsigned long lastBrightnessCheck = 0;

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

  // Inicjalizacja LED
  FastLED.addLeds<WS2812B, UPPER_DATA_PIN, GRB>(upperLeds, UPPER_LEDS_COUNT).setCorrection(TypicalLEDStrip);
  FastLED.addLeds<WS2812B, LOWER_DATA_PIN, GRB>(lowerLeds, LOWER_LEDS_COUNT).setCorrection(TypicalLEDStrip);
  FastLED.setBrightness(ledBrightness);

  // Pokaz powitalny (czerwone segmenty)
  fill_solid(upperLeds, UPPER_LEDS_COUNT, CRGB::Red);
  fill_solid(lowerLeds, LOWER_LEDS_COUNT, CRGB::Red);
  FastLED.show();
  delay(1000);
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

void renderUpperRow() {
  CRGB color = colorClock;

  if (clockMode == "time") {
    timeClient.update();
    int hrs = timeClient.getHours();
    int mins = timeClient.getMinutes();
    
    String hrsStr = String(hrs);
    if (hrs < 10) hrsStr = "0" + hrsStr;
    String minsStr = String(mins);
    if (mins < 10) minsStr = "0" + minsStr;

    drawUpperDigit(0, hrsStr[0], color);
    drawUpperDigit(1, hrsStr[1], color);
    drawUpperDigit(2, minsStr[0], color);
    drawUpperDigit(3, minsStr[1], color);

    // Miganie dwukropka zsynchronizowane z sekundami NTP
    bool blink = (timeClient.getSeconds() % 2 == 0);
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
    if (timerRunning) {
      remVal = (long)timerTargetTime - (long)millis();
      if (remVal <= 0) {
        timerRemainingMs = 0;
        timerRunning = false;
        remVal = 0;
      } else {
        timerRemainingMs = remVal;
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
      // Dolny rząd pokazuje "dO nE" (Done)
      drawLowerDigit(0, 'd', tabCol);
      drawLowerDigit(1, 'o', tabCol);
      drawLowerDigit(2, 'n', tabCol);
      drawLowerDigit(3, 'E', tabCol);
    } else {
      // Lewa strona: numer rundy, np. "r1" lub "r8" w idle
      int activeRound = (tabataState == "idle") ? tabataTotalRounds : tabataCurrentRound;
      drawLowerDigit(0, 'r', tabCol);
      drawLowerDigit(1, '0' + (activeRound % 10), tabCol);

      // Prawa strona: status fazy "Pr", "Go", "rE"
      if (tabataState == "idle" || tabataState == "prepare") {
        drawLowerDigit(2, 'P', tabCol);
        drawLowerDigit(3, 'r', tabCol);
      } else if (tabataState == "work") {
        drawLowerDigit(2, 'G', tabCol);
        drawLowerDigit(3, 'o', tabCol);
      } else if (tabataState == "rest") {
        drawLowerDigit(2, 'r', tabCol);
        drawLowerDigit(3, 'E', tabCol);
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
    // Symulacja czujnika temperatury (np. DS18B20 lub DHT22)
    // Płynna zmiana temperatury w czasie za pomocą funkcji sinus
    float baseTemp = 22.0;
    float wave = sin(now / 120000.0) * 1.5; // Zmiana o +/- 1.5 stopnia co 2 minuty
    temperatureVal = (int)round(baseTemp + wave);
  }
}

void updateTabata() {
  if (clockMode != "tabata" || !tabataRunning || tabataPaused) return;

  long remMs = (long)tabataTargetTime - (long)millis();
  if (remMs <= 0) {
    // Przejścia stanów maszyny Tabaty
    if (tabataState == "prepare") {
      tabataState = "work";
      tabataTargetTime = millis() + (unsigned long)tabataWorkSec * 1000;
    } else if (tabataState == "work") {
      if (tabataCurrentRound >= tabataTotalRounds) {
        tabataState = "finished";
        tabataRunning = false;
      } else {
        tabataState = "rest";
        tabataTargetTime = millis() + (unsigned long)tabataRestSec * 1000;
      }
    } else if (tabataState == "rest") {
      tabataState = "work";
      tabataCurrentRound++;
      tabataTargetTime = millis() + (unsigned long)tabataWorkSec * 1000;
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
