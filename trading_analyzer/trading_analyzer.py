import yfinance as yf
import pandas as pd
import pandas_ta as ta
import requests
from bs4 import BeautifulSoup
import logging
from typing import List, Dict, Optional
from datetime import datetime

# ==============================================================================
# ZASTRZEŻENIE EDUKACYJNE:
# Program ten jest wyłącznie narzędziem edukacyjnym i demonstracyjnym.
# Każda decyzja finansowa wiąże się z ryzykiem utraty kapitału. 
# Wyniki analizy nie stanowią porady inwestycyjnej. Używaj na własną 
# odpowiedzialność!
# ==============================================================================

# Konfiguracja logowania
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

class DataFetcher:
    """Odpowiada za pobieranie danych rynkowych oraz analizę sentymentu."""
    
    def __init__(self):
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }

    def fetch_ohlcv(self, symbol: str, interval: str = '1h', period: str = '1mo') -> Optional[pd.DataFrame]:
        """Pobiera dane historyczne OHLCV za pomocą yfinance."""
        try:
            ticker = yf.Ticker(symbol)
            df = ticker.history(interval=interval, period=period)
            if df.empty:
                logging.warning(f"Brak danych dla {symbol} na interwale {interval}")
                return None
            return df
        except Exception as e:
            logging.error(f"Błąd podczas pobierania danych dla {symbol}: {e}")
            return None

    def fetch_xapi_realtime(self, symbol: str):
        """
        Moduł pod XTB API (xAPI) dla danych w czasie rzeczywistym.
        Do integracji potrzebne są dane logowania oraz biblioteka klienta xAPI (np. xAPIConnector).
        Obecnie działa jako placeholder gotowy do podpięcia logiki WebSocketów.
        """
        logging.info(f"Moduł xAPI wywołany dla {symbol}. Oczekuje na konfigurację certyfikatów i autoryzację XTB.")
        # Tutaj znalazłby się kod inicjujący połączenie z XTB:
        # client = xAPIConnector.login(USER, PASSWORD)
        # data = client.getSymbol(symbol)
        pass

    def get_news_sentiment(self, symbol: str) -> float:
        """
        Prosty Web Scraping nagłówków (BeautifulSoup) do oceny sentymentu.
        Zwraca wartość sentymentu od -1.0 (Skrajnie Bearish) do 1.0 (Skrajnie Bullish).
        """
        try:
            # Próba scrapowania z Yahoo Finance
            url = f"https://finance.yahoo.com/quote/{symbol}/news"
            response = requests.get(url, headers=self.headers, timeout=5)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            headlines = soup.find_all('h3')
            
            texts = [h.text.lower() for h in headlines]
            
            # Jeśli bystrzejsze zabezpieczenia zablokują scrapowanie, używamy fallback z API
            if not texts:
                logging.debug(f"Pusta lista nagłówków dla {symbol}. Użycie fallback yfinance.")
                news = yf.Ticker(symbol).news
                texts = [item.get('title', '').lower() for item in news]

            if not texts:
                return 0.0
                
            bullish_words = ['up', 'growth', 'surge', 'jump', 'gain', 'positive', 'buy', 'higher', 'bull', 'beat', 'rally']
            bearish_words = ['down', 'drop', 'fall', 'plunge', 'loss', 'negative', 'sell', 'lower', 'bear', 'miss', 'crash']
            
            score = 0
            count = 0
            
            for text in texts:
                for word in bullish_words:
                    if word in text:
                        score += 1
                for word in bearish_words:
                    if word in text:
                        score -= 1
                count += 1
                
            # Normalizacja wyniku do przedziału [-1.0, 1.0]
            sentiment_ratio = score / max(count, 1)
            return max(min(sentiment_ratio, 1.0), -1.0)
            
        except Exception as e:
            logging.error(f"Błąd pobierania sentymentu dla {symbol} (Web Scraping): {e}")
            return 0.0

class RiskManager:
    """Odpowiada za zarządzanie ryzykiem: wyznaczanie poziomów Stop Loss i Take Profit."""
    
    def __init__(self, risk_reward_ratio: float = 2.0):
        self.rr_ratio = risk_reward_ratio

    def calculate_levels(self, entry_price: float, atr: float, signal_type: str) -> Dict[str, float]:
        """
        Oblicza poziomy Stop Loss (SL) oraz Take Profit (TP).
        SL = odległość 1.5x ATR
        TP = SL * R:R ratio (min 1:2)
        """
        risk_distance = 1.5 * atr
        reward_distance = risk_distance * self.rr_ratio

        if signal_type == "BUY":
            stop_loss = entry_price - risk_distance
            take_profit = entry_price + reward_distance
        elif signal_type == "SELL":
            stop_loss = entry_price + risk_distance
            take_profit = entry_price - reward_distance
        else:
            stop_loss = entry_price
            take_profit = entry_price
            
        return {
            "entry": round(entry_price, 4),
            "stop_loss": round(stop_loss, 4),
            "take_profit": round(take_profit, 4),
            "risk_reward": self.rr_ratio
        }

class Analyst:
    """Moduł analityczny kompilujący wskaźniki techniczne z zachowaniem rynku w 24-48h."""
    
    def __init__(self, data_fetcher: DataFetcher, risk_manager: RiskManager):
        self.fetcher = data_fetcher
        self.risk = risk_manager

    def compute_indicators(self, df: pd.DataFrame) -> pd.DataFrame:
        """Oblicza m.in EMA 12/26, RSI H1/H4, ATR, Bollinger Bands, Rel. Volume."""
        if df is None or len(df) < 50:
            return df

        # Wykorzystanie pandas-ta do wyliczeń wskaźników
        # 1. EMA 12/26
        df.ta.ema(length=12, append=True)
        df.ta.ema(length=26, append=True)
        
        # 2. RSI (14)
        df.ta.rsi(length=14, append=True)
        
        # 3. Zmienność ATR (14)
        df.ta.atr(length=14, append=True)
        
        # 4. Konsolidacja / Wybicie z Bollinger Bands (20 okresów, 2 stałe odchylenia)
        df.ta.bbands(length=20, std=2, append=True)
        
        # 5. Wolumen Obrotu - Relative Volume
        df['SMA_Volume_20'] = df['Volume'].rolling(window=20).mean()
        # Zabezpieczenie na wypadek rynków bez danych wolumenu np. niektóre forex z YF
        df['SMA_Volume_20'] = df['SMA_Volume_20'].replace(0, 1) # Unikaj dzielenia przez zero
        df['Relative_Volume'] = df['Volume'] / df['SMA_Volume_20']
        
        return df

    def evaluate_symbol(self, symbol: str) -> Optional[Dict]:
        """
        Główna logika decyzyjna.
        Zwraca propozycję wejścia jeżeli instrument spełnia wymogi kierunkowe.
        """
        logging.info(f"Skanowanie aktywa: {symbol}...")
        
        # Pobieranie interwałów - H1 dla triggerów, H4 dla szerszego kontekstu
        df_h1 = self.fetcher.fetch_ohlcv(symbol, interval='1h', period='1mo')
        df_h4 = self.fetcher.fetch_ohlcv(symbol, interval='4h', period='1mo')
        
        if df_h1 is None or df_h4 is None:
            return None
            
        df_h1 = self.compute_indicators(df_h1)
        df_h4 = self.compute_indicators(df_h4)
        
        if df_h1 is None or df_h4 is None or len(df_h1) < 20 or len(df_h4) < 20:
            return None

        last_h1 = df_h1.iloc[-1]
        last_h4 = df_h4.iloc[-1]
        
        # Wyciąganie wartości analitycznych
        ema_12 = last_h1.get('EMA_12', 0)
        ema_26 = last_h1.get('EMA_26', 0)
        rsi_h1 = last_h1.get('RSI_14', 50)
        rsi_h4 = last_h4.get('RSI_14', 50)
        atr_h1 = last_h1.get('ATRr_14', 0)
        close_price = last_h1.get('Close', 0)
        rel_vol = last_h1.get('Relative_Volume', 1)
        
        bb_upper = last_h1.get('BBU_20_2.0', 0)
        bb_lower = last_h1.get('BBL_20_2.0', 0)
        
        # === Volatility Scanner ===
        # Procentowy udział ATR w cenie pomaga zidentyfikować najbardziej rozbujane rynki
        atr_pct = (atr_h1 / close_price) * 100 if close_price else 0
        
        # Inicjalizacja ewaluacji
        signal = "NEUTRAL"
        score = 0
        
        is_bullish_ema = ema_12 > ema_26
        is_bearish_ema = ema_12 < ema_26
        
        # Weryfikacja wybicia szerokości z wstęg (Bollinger Bands Breakout)
        is_up_breakout = close_price > bb_upper
        is_down_breakout = close_price < bb_lower
        
        # === Logika Sygnałów (Skala 24-48h) ===
        
        # Szukanie okazji: BUY
        if is_bullish_ema and rsi_h1 < 70 and rsi_h4 < 70:
            score += 1
            if is_up_breakout: 
                score += 2  # Dodatkowe punkty za wybicie
            if rel_vol > 1.2: 
                score += 1  # Wzmożony wolumen (potwierdzenie)
            if rsi_h1 < 40: # Odbicie od strefy wyprzedania to też byczy sygnał
                score += 1

            if score >= 3:
                signal = "BUY"
                
        # Szukanie okazji: SELL
        elif is_bearish_ema and rsi_h1 > 30 and rsi_h4 > 30:
            score_sell = 1
            if is_down_breakout: 
                score_sell += 2
            if rel_vol > 1.2: 
                score_sell += 1
            if rsi_h1 > 60:
                score_sell += 1
                
            if score_sell >= 3:
                signal = "SELL"
                score = score_sell

        if signal == "NEUTRAL":
            return None
            
        # Analiza sentymentu jako filtr końcowy
        sentiment = self.fetcher.get_news_sentiment(symbol)
        
        # Blokowaine wejść sprzecznych z fundamentalnym sentymentem
        if signal == "BUY" and sentiment <= -0.5:
            logging.info(f"Odrzucono sygnał BUY dla {symbol} z powodu skrajnie negatywnego sentymentu.")
            return None 
        if signal == "SELL" and sentiment >= 0.5:
            logging.info(f"Odrzucono sygnał SELL dla {symbol} z powodu skrajnie pozytywnego sentymentu.")
            return None

        # Obliczanie Stop Loss / Take profit z zachowaniem wymaganego ryzyka
        risk_levels = self.risk.calculate_levels(close_price, atr_h1, signal)
        
        return {
            "Symbol": symbol,
            "Signal": signal,
            "Score": score,
            "ATR_Percent": round(atr_pct, 2),
            "Sentiment": round(sentiment, 2),
            "RSI_H1": round(rsi_h1, 1),
            "RSI_H4": round(rsi_h4, 1),
            "Rel_Volume": round(rel_vol, 2),
            "Entry": risk_levels['entry'],
            "StopLoss": risk_levels['stop_loss'],
            "TakeProfit": risk_levels['take_profit'],
            "RiskTotal": f"1:{self.risk.rr_ratio}"
        }

def main():
    print("=========================================================")
    print("   🗠  SHORT-TERM TRADING ANALYZER (24-48h Scale)         ")
    print("=========================================================")
    
    # Przykładowe instrumenty (Akcje, Commodities, Forex)
    symbols = [
        "AAPL", "MSFT", "TSLA", "NVDA",  # Akcje US
        "GC=F", "CL=F", "SI=F",          # Surowce (Złoto, Ropa, Srebro)
        "EURUSD=X", "GBPUSD=X"           # Forex
    ]

    fetcher = DataFetcher()
    # Narzucamy stosunek ryzyka r/r min 1:2 dla kalkulacji
    risk_mgr = RiskManager(risk_reward_ratio=2.0)
    analyst = Analyst(fetcher, risk_mgr)
    
    opportunities = []

    for sym in symbols:
        res = analyst.evaluate_symbol(sym)
        if res:
            opportunities.append(res)
            
    # Sortowanie Top 5 wyselekcjonowanych na podstawie Siły sygnału oraz wskaźnika ATR%
    opportunities.sort(key=lambda x: (x['Score'], x['ATR_Percent']), reverse=True)
    top_5 = opportunities[:5]
    
    print("\n[ TOP 5 OPPORTUNITY ]")
    if not top_5:
        print("Obecnie brak silnych sygnałów na obserwowanych instrumentach.")
    else:
        for idx, opp in enumerate(top_5, 1):
            print(f"\n{idx}. {opp['Symbol']} | Akcja: >> {opp['Signal']} << (Siła: {opp['Score']}/5)")
            print(f"   ► Wejście: {opp['Entry']} | SL: {opp['StopLoss']} | TP: {opp['TakeProfit']} (Risk/Reward: {opp['RiskTotal']})")
            print(f"   ► Sentyment: {opp['Sentiment']} | RSI H1/H4: {opp['RSI_H1']}/{opp['RSI_H4']} | Vol: x{opp['Rel_Volume']}")
            print(f"   ► Volatility (Zmienność ATR): {opp['ATR_Percent']}% ceny")

if __name__ == "__main__":
    main()
