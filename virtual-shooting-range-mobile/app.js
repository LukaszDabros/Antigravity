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
    isArmed: true, // Czy system czeka na strzał
    threshold: 230, // Próg jasności (0-255)
    lastShotTime: 0
};

// 1. Inicjalizacja kamery
async function initCamera() {
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
    // Tymczasowo: Losowy wynik 7-10 dla demonstracji, dopóki kalibracja nie jest w pełni zapięta matematycznie
    return Math.floor(Math.random() * 4) + 7;
}

function drawHit(x, y) {
    uiCtx.beginPath();
    uiCtx.arc(x, y, 10, 0, Math.PI * 2);
    uiCtx.fillStyle = 'rgba(255, 0, 255, 0.8)';
    uiCtx.fill();
    uiCtx.strokeStyle = 'white';
    uiCtx.lineWidth = 2;
    uiCtx.stroke();
}

// 4. Kalibracja
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

function finishCalibration() {
    state.isCalibrating = false;
    calibrationOverlay.classList.remove('active');
    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    
    // Rysowanie obrysu tarczy
    uiCtx.strokeStyle = '#00f3ff';
    uiCtx.lineWidth = 3;
    uiCtx.beginPath();
    uiCtx.moveTo(state.corners[0].x, state.corners[0].y);
    uiCtx.lineTo(state.corners[1].x, state.corners[1].y);
    uiCtx.lineTo(state.corners[2].x, state.corners[2].y);
    uiCtx.lineTo(state.corners[3].x, state.corners[3].y);
    uiCtx.closePath();
    uiCtx.stroke();
}

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
