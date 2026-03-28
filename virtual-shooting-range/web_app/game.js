const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Elementy UI
const uiLayer = document.getElementById('ui-layer');
const statusText = document.getElementById('status-text');
const startBtn = document.getElementById('start-btn');
const scoreText = document.getElementById('score-text');
const scoreEl = document.getElementById('score');

// Zmienne Gry
let score = 0;
let isPlaying = false;
let target = null;
const holes = []; // Przechowuje dziury po kulach: {x, y}
const TARGET_RADIUS = 50; // Trudność: promień tarczy

// Połączenie z systemem wizji maszynowej (Python)
let ws;
const WS_URL = 'ws://127.0.0.1:8080';

// Dostosowanie płótna do pełnego wymiaru monitora
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// ===================================
// WEBSOCKET LOGIKA (ODBIEr STRZAŁÓW Z PYTHON)
// ===================================

function initWebSocket() {
    statusText.innerText = "Łączenie z Kamerą i Detektorem Lasera...";
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
        statusText.innerText = "Kamera Połączona!";
        startBtn.style.display = "block"; // Pozwól zacząć grę
        const recommendedGear = document.getElementById('recommended-gear');
        if (recommendedGear) recommendedGear.style.display = "block";
        console.log("WebSocket do Pythona Otwarty!");
    };

    ws.onmessage = (event) => {
        try {
            const data = JSON.parse(event.data);

            // Reagujemy na STRZAŁ Z LASERA "SHOT"
            if (data.type === 'SHOT' && isPlaying) {
                handleShot(data.x, data.y);
            }
        } catch (e) {
            console.error("Błąd dekodowania JSON od pythona:", e);
        }
    };

    ws.onclose = () => {
        statusText.innerText = "Utracono połączenie z Kamerą! Włącz skrypt w Pythonie.";
        startBtn.style.display = "none";
        isPlaying = false;

        // Próba ponownego łączenia
        setTimeout(initWebSocket, 2000);
    };

    ws.onerror = (err) => {
        console.error("Błąd WebSocket: ", err);
    };
}

// Inicjalizuj na starcie
initWebSocket();

// ===================================
// LOGIKA GRY HTML5 CANVAS
// ===================================

startBtn.addEventListener('click', () => {
    // Włączenie trybu pełnoekranowego przeglądarki z punktu widzenia API!
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }

    // Ukryj zbędne menu, pokaż wynik
    startBtn.style.display = 'none';
    statusText.style.display = 'none';
    const recommendedGear = document.getElementById('recommended-gear');
    if (recommendedGear) recommendedGear.style.display = "none";
    scoreText.style.display = 'block';

    startGame();
});

function startGame() {
    score = 0;
    scoreEl.innerText = score;
    holes.length = 0; // Czyszczenie dziur po kulach
    isPlaying = true;

    // Stwórz pierwszą tarczę i uruchom Pętlę renderującą
    spawnNewTarget();
    requestAnimationFrame(gameLoop);
}

function spawnNewTarget() {
    // Losowanie na ekranie (z marginesem żeby nie wystawał)
    const margin = TARGET_RADIUS + 20;
    const x = Math.random() * (canvas.width - margin * 2) + margin;
    const y = Math.random() * (canvas.height - margin * 2) + margin;

    target = { x, y, radius: TARGET_RADIUS, timeCreated: Date.now() };
}

// Funkcja wywoływana tylko gdy z Python-a przyjdzie sygnał 'SHOT'
function handleShot(shotX, shotY) {
    if (!target) return;

    // Zapisujemy dziurę na ekranie strzelnicy by została na zawsze jako ślad gipsowy
    holes.push({ x: shotX, y: shotY });

    // Obliczanie matematycznej odległości między strzałem a środkiem tarczy (Pitogoras)
    const dist = Math.hypot(target.x - shotX, target.y - shotY);

    if (dist <= target.radius) {
        // TRAFIENIE!
        score += 10;
        scoreEl.innerText = score;
        scoreEl.style.color = '#10b981'; // Zielony flash
        setTimeout(() => scoreEl.style.color = '#3b82f6', 300);

        spawnNewTarget(); // Nowy cel od razu
    } else {
        // PUDŁO!
        score -= 2; // Kara
        scoreEl.innerText = score;
        scoreEl.style.color = '#ef4444'; // Czerwony Flash punktów
        setTimeout(() => scoreEl.style.color = '#3b82f6', 300);
    }
}


function drawTarget(ctx) {
    if (!target) return;

    // Główna Czerwona Obwódka
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.closePath();

    // Biały ring
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius * 0.7, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.closePath();

    // Czerwony środek (Bullseye)
    ctx.beginPath();
    ctx.arc(target.x, target.y, target.radius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = "#ef4444";
    ctx.fill();
    ctx.closePath();
}

function drawHoles(ctx) {
    // Rysowanie drobnych, wypixelowanych dziur po strzałach (ślady kul)
    for (let h of holes) {
        ctx.beginPath();
        ctx.arc(h.x, h.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#1e293b"; // Bardzo Ciemno szare
        ctx.fill();
        ctx.closePath();
    }
}

// Główna pętla renderująca Canvas 60 FPS
function gameLoop() {
    if (!isPlaying) return;

    // Czyszczenie całego ekranu (Odświeżanie klatki szarym cieniem)
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Krok 1: Narysuj Cel
    drawTarget(ctx);

    // Krok 2: Narysuj stare dziury po kulach
    drawHoles(ctx);

    // Cykl się powtarza non-stop w pętli renderowania HTML5!
    requestAnimationFrame(gameLoop);
}
