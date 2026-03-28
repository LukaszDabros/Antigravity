import cv2
import numpy as np
import asyncio
import websockets
import json
import tkinter as tk # Do pobrania rozdzielczości bez pyautogui

# Konfiguracja Serwera WebSocket
HOST = "localhost"
PORT = 8080

# Globalne zmienne synchronizujące wątki
connected_clients = set()
homography_matrix = None
screen_w = 1920
screen_h = 1080

async def broadcast_shot(x, y):
    """Wysyła współrzędne strzału do wszystkich podłączonych przeglądarek HTML5"""
    if connected_clients:
        message = json.dumps({"type": "SHOT", "x": x, "y": y})
        # Wypchnięcie komunikatu asynchronicznie do gry
        await asyncio.gather(*[client.send(message) for client in connected_clients])

async def websocket_handler(websocket):
    """Rejestruje nową przeglądarkę podłączoną do serwera gry"""
    connected_clients.add(websocket)
    try:
        # Nasłuchujemy (choć w tej wersji gra HTML niczego nie okyesyła z powrotem)
        async for message in websocket:
            pass 
    except websockets.exceptions.ConnectionClosed:
        pass
    finally:
        connected_clients.remove(websocket)

async def camera_loop():
    """Główna pętla OpenCV obsługująca kamerę i kalibrację asynchronicznie"""
    global homography_matrix, screen_w, screen_h
    
    # Próba pobrania natywnej rozdzielczości (zastępuje pyautogui)
    try:
        root = tk.Tk()
        screen_w = root.winfo_screenwidth()
        screen_h = root.winfo_screenheight()
        root.destroy()
    except Exception as e:
        print("Nie mogłem pobrać rozdzielczości automatycznie. Wpisane na sztywno 1920x1080.")

    print(f"Wirtualna Strzelnica - Silnik uruchomiony. Ekran: {screen_w}x{screen_h}")

    margin = 100
    screen_pts = [
        [margin, margin],                    
        [screen_w - margin, margin],         
        [screen_w - margin, screen_h - margin], 
        [margin, screen_h - margin]          
    ]
    
    current_target_idx = 0
    camera_pts = []
    
    CALIBRATING = 0
    TRACKING = 1
    state = CALIBRATING
    laser_is_on = False

    cap = cv2.VideoCapture(0)
    
    cv2.namedWindow('Wirtualna Strzelnica', cv2.WND_PROP_FULLSCREEN)
    cv2.setWindowProperty('Wirtualna Strzelnica', cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_FULLSCREEN)

    print("STATUS: Oczekujemy na 4 strzały kalibracyjne...")

    while True:
        # Asynchroniczny sleep oddający czas na wysłanie pakietów sieciowych
        await asyncio.sleep(0.01) 
        
        ret, frame = cap.read()
        if not ret:
            break
            
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        _, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)
        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        laser_pos = None
        if contours:
            largest_contour = max(contours, key=cv2.contourArea)
            if cv2.contourArea(largest_contour) > 2: 
                M = cv2.moments(largest_contour)
                if M["m00"] != 0:
                    laser_pos = (int(M["m10"] / M["m00"]), int(M["m01"] / M["m00"]))
                    
        if not laser_pos:
            laser_is_on = False

        if state == CALIBRATING:
            calib_frame = np.zeros((screen_h, screen_w, 3), dtype=np.uint8)
            cv2.putText(calib_frame, "KALIBRACJA STRZELNICY", (int(screen_w/2) - 300, int(screen_h/2) - 50), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (255, 255, 255), 3)
            
            if current_target_idx < 4:
                target = screen_pts[current_target_idx]
                cv2.circle(calib_frame, (target[0], target[1]), 30, (0, 0, 255), -1) 
                cv2.circle(calib_frame, (target[0], target[1]), 10, (255, 255, 255), -1) 
            
            cv2.imshow('Wirtualna Strzelnica', calib_frame)

            if laser_pos and not laser_is_on:
                print(f"[{current_target_idx + 1}/4] Złapano!")
                camera_pts.append(list(laser_pos))
                current_target_idx += 1
                laser_is_on = True 
                print('\a')
                
                if current_target_idx >= 4:
                    print("Kalibracja Ukończona. Obliczanie macierzy...")
                    hm, status = cv2.findHomography(np.array(camera_pts), np.array(screen_pts))
                    homography_matrix = hm
                    state = TRACKING
                    
                    # Minimalizowanie okna CV, by odsłonić pulpit z przeglądarką z Grą WEB
                    cv2.setWindowProperty('Wirtualna Strzelnica', cv2.WND_PROP_FULLSCREEN, cv2.WINDOW_NORMAL)
                    cv2.resizeWindow('Wirtualna Strzelnica', 400, 300)
                    print("\nGOTOWE! Otworz plik index.html z folderu web_app w przegladarce Edge/Chrome i strzelaj!")

        elif state == TRACKING:
            if laser_pos and homography_matrix is not None:
                pt = np.array([[[laser_pos[0], laser_pos[1]]]], dtype=np.float32)
                transformed_pt = cv2.perspectiveTransform(pt, homography_matrix)
                
                screen_x = int(transformed_pt[0][0][0])
                screen_y = int(transformed_pt[0][0][1])
                
                # WYKRYTO STRZAŁ! Jeśli to nie jest tylko 'przeciągnięcię' plamki
                if not laser_is_on:
                    print(f"BAM! -> Strzal na X:{screen_x} Y:{screen_y}")
                    laser_is_on = True # Zablokowanie do czasu "puszczenia" lasera
                    
                    # -------------------------------------------------------------
                    # ZAMIAST PYAUTOGUI - WYSYŁAMY PAKIET JSON PRZEZ WEBSOCKET
                    # -------------------------------------------------------------
                    await broadcast_shot(screen_x, screen_y)

                cv2.drawMarker(frame, laser_pos, (0, 255, 0), cv2.MARKER_CROSS, 20, 2)
            
            cv2.imshow('Wirtualna Strzelnica', frame)
            
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

async def main():
    print(f"Otwieram serwer gier WebSocket na porcie {PORT}...")
    # Start serwera WebSocket w tle
    async with websockets.serve(websocket_handler, HOST, PORT):
        # Start nieskończonej pętli kamery
        await camera_loop()

if __name__ == "__main__":
    asyncio.run(main())
