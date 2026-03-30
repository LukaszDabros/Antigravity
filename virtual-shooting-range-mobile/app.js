/*
 * LASER RANGE MOBILE - CORE ENGINE
 */

const video = document.getElementById('camera-feed');
const detectionCanvas = document.getElementById('detection-canvas');
const uiCanvas = document.getElementById('ui-canvas');
const dCtx = detectionCanvas.getContext('2d', { willReadFrequently: true });
const uiCtx = uiCanvas.getContext('2d');
const shotSound = document.getElementById('shot-sound');

const scoreEl = document.getElementById('score-val');
const shotsEl = document.getElementById('shots-val');
const lastValEl = document.getElementById('last-val');
const calibrationOverlay = document.getElementById('calibration-overlay');
const dots = document.querySelectorAll('.dot');

// Stan aplikacji
let state = {
    isCalibrating: true,
    calibrationStep: 0,
    corners: [], // [tl, tr, br, bl]
    score: 0,
    shots: 0,
    isArmed: true, 
    threshold: 230,
    lastShotTime: 0
};

// Ładowanie kalibracji z pamięci
function loadSettings() {
    const saved = localStorage.getItem('laser_range_calib');
    if (saved) {
        state.corners = JSON.parse(saved);
        state.isCalibrating = false;
        calibrationOverlay.classList.remove('active');
        setTimeout(drawTarget, 500); // Rysuj po zainicjowaniu canvasa
    }
}

// 1. Inicjalizacja kamery
async function initCamera() {
    loadSettings();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment', // Tylna kamera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        video.srcObject = stream;
        
        video.onloadedmetadata = () => {
            uiCanvas.width = video.videoWidth;
            uiCanvas.height = video.videoHeight;
            detectionCanvas.width = video.videoWidth / 4; // Zmniejszenie dla wydajności
            detectionCanvas.height = video.videoHeight / 4;
            
            // Próba ustawienia niskiej ekspozycji (Android/Chrome only)
            const track = stream.getVideoTracks()[0];
            const caps = track.getCapabilities();
            if (caps.exposureMode && caps.exposureMode.includes('manual')) {
                track.applyConstraints({
                    advanced: [{ exposureMode: 'manual', exposureTime: 10 }]
                });
            }
            
            requestAnimationFrame(detectionLoop);
        };
    } catch (err) {
        console.error("Camera error:", err);
        alert("Błąd dostępu do kamery. Upewnij się, że używasz HTTPS.");
    }
}

// 2. Główna pętla detekcji
function detectionLoop() {
    // Rysowanie do analizy
    dCtx.drawImage(video, 0, 0, detectionCanvas.width, detectionCanvas.height);
    const frame = dCtx.getImageData(0, 0, detectionCanvas.width, detectionCanvas.height);
    const data = frame.data;
    
    let brightestX = -1;
    let brightestY = -1;
    let maxBrightness = 0;

    // Szukanie najjaśniejszego piksela
    for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i+1];
        const b = data[i+2];
        const brightness = (r + g + b) / 3;

        if (brightness > state.threshold && brightness > maxBrightness) {
            maxBrightness = brightness;
            const pixelIndex = i / 4;
            brightestX = pixelIndex % detectionCanvas.width;
            brightestY = Math.floor(pixelIndex / detectionCanvas.width);
        }
    }

    // Obsługa strzału
    if (brightestX !== -1 && state.isArmed && !state.isCalibrating) {
        processShot(brightestX * 4, brightestY * 4); // Powrót do pełnej rozdzielczości
        state.isArmed = false; // Rozbrojenie do czasu zniknięcia plamki
    } else if (brightestX === -1) {
        state.isArmed = true; // Uzbrojenie, gdy laser nie jest widoczny
    }

    requestAnimationFrame(detectionLoop);
}

// 3. Przetwarzanie strzału i punktacja
function processShot(x, y) {
    if (Date.now() - state.lastShotTime < 500) return; // Debounce

    state.shots++;
    shotsEl.innerText = state.shots;
    state.lastShotTime = Date.now();

    // Dźwięk
    shotSound.currentTime = 0;
    shotSound.play().catch(() => {});

    // Obliczanie punktów (uproszczony model tarczy)
    // TODO: Zastosować homografię na podstawie state.corners
    const points = calculateScore(x, y);
    state.score += points;
    scoreEl.innerText = state.score;
    lastValEl.innerText = points;

    // Wizualizacja trafienia
    drawHit(x, y);
}

function calculateScore(x, y) {
    if (state.corners.length < 4) return 0;
    
    // Obliczanie środka tarczy (punkt 10)
    const centerX = (state.corners[0].x + state.corners[1].x + state.corners[2].x + state.corners[3].x) / 4;
    const centerY = (state.corners[0].y + state.corners[1].y + state.corners[2].y + state.corners[3].y) / 4;
    
    // Obliczanie przybliżonego "promienia" tarczy (połowa średniej szerokości)
    const w1 = Math.sqrt(Math.pow(state.corners[1].x - state.corners[0].x, 2) + Math.pow(state.corners[1].y - state.corners[0].y, 2));
    const w2 = Math.sqrt(Math.pow(state.corners[2].x - state.corners[3].x, 2) + Math.pow(state.corners[2].y - state.corners[3].y, 2));
    const avgW = (w1 + w2) / 2;
    const targetRadius = avgW / 2;

    // Odległość trafienia od środka
    const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const relDist = dist / targetRadius; // 0.0 to środek, 1.0 to krawędź tarczy (50cm)

    // Logika pierścieni TS-2 (promienie 25mm, 50mm, 75mm... w skali 500mm)
    // tzn. 10 punktów to relDist < 0.1 (średnica 10 to 50mm / 500mm = 0.1)
    for (let p = 10; p >= 1; p--) {
        const ringRadius = (11 - p) * 0.1; // 10: 0.1, 9: 0.2, 8: 0.3...
        // W tarczy TS-2 pistoletowej promienie idą co 25mm (co 0.1 skali tarczy 500mm)
        if (relDist <= ringRadius / 2) return p;
    }

    return 0;
}

function drawTarget() {
    if (state.corners.length < 4) return;
    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    
    const centerX = (state.corners[0].x + state.corners[1].x + state.corners[2].x + state.corners[3].x) / 4;
    const centerY = (state.corners[0].y + state.corners[1].y + state.corners[2].y + state.corners[3].y) / 4;
    
    const w1 = Math.sqrt(Math.pow(state.corners[1].x - state.corners[0].x, 2) + Math.pow(state.corners[1].y - state.corners[0].y, 2));
    const targetRadius = w1 / 2;

    // Rysowanie pierścieni (1-10)
    uiCtx.lineWidth = 1;
    for (let p = 1; p <= 10; p++) {
        const r = (targetRadius * (11 - p)) / 10;
        uiCtx.beginPath();
        uiCtx.arc(centerX, centerY, r, 0, Math.PI * 2);
        uiCtx.strokeStyle = p >= 7 ? 'rgba(0, 243, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)';
        uiCtx.stroke();
        if (p === 10) {
            uiCtx.fillStyle = 'rgba(0, 243, 255, 0.2)';
            uiCtx.fill();
        }
    }

    // Rysowanie obrysu zewnętrznego
    uiCtx.strokeStyle = 'cyan';
    uiCtx.lineWidth = 2;
    uiCtx.beginPath();
    uiCtx.moveTo(state.corners[0].x, state.corners[0].y);
    uiCtx.lineTo(state.corners[1].x, state.corners[1].y);
    uiCtx.lineTo(state.corners[2].x, state.corners[2].y);
    uiCtx.lineTo(state.corners[3].x, state.corners[3].y);
    uiCtx.closePath();
    uiCtx.stroke();
}

function drawHit(x, y) {
    // Rysowanie trwałego śladu na warstwie UI
    uiCtx.beginPath();
    uiCtx.arc(x, y, 4, 0, Math.PI * 2);
    uiCtx.fillStyle = '#ff00ff';
    uiCtx.shadowBlur = 10;
    uiCtx.shadowColor = '#ff00ff';
    uiCtx.fill();
    uiCtx.shadowBlur = 0;
}

function finishCalibration() {
    state.isCalibrating = false;
    calibrationOverlay.classList.remove('active');
    
    // Zapisywanie do pamięci
    localStorage.setItem('laser_range_calib', JSON.stringify(state.corners));
    
    drawTarget();
}

// 4. Obsługa kliknięć (Kalibracja)
window.addEventListener('click', (e) => {
    if (!state.isCalibrating) return;

    const rect = uiCanvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * uiCanvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * uiCanvas.height;

    state.corners.push({x, y});
    dots[state.calibrationStep].classList.add('active');
    state.calibrationStep++;

    if (state.calibrationStep === 4) {
        finishCalibration();
    }
});

document.getElementById('reset-btn').onclick = () => location.reload();
document.getElementById('calibrate-btn').onclick = () => {
    state.isCalibrating = true;
    state.calibrationStep = 0;
    state.corners = [];
    calibrationOverlay.classList.add('active');
    dots.forEach(d => d.classList.remove('active'));
};

// Start
initCamera();
