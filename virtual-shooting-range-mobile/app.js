/*
 * LASER RANGE MOBILE - CORE ENGINE
 */

const video = document.getElementById('camera-feed');
const detectionCanvas = document.getElementById('detection-canvas');
const uiCanvas = document.getElementById('ui-canvas');
const dCtx = detectionCanvas.getContext('2d', { willReadFrequently: true });
const uiCtx = uiCanvas.getContext('2d');
const shotSound = document.getElementById('shot-sound');

const avgValEl = document.getElementById('avg-val');
const scoreEl = document.getElementById('score-val');
const maxValEl = document.getElementById('max-val');
const lastValEl = document.getElementById('last-val');
const calibrationOverlay = document.getElementById('calibration-overlay');
const dots = document.querySelectorAll('.dot');
const zoomInBtn = document.getElementById('zoom-in');
const zoomOutBtn = document.getElementById('zoom-out');

// Stan aplikacji
let state = {
    isCalibrating: true,
    calibrationStep: 0,
    corners: [], // [tl, tr, br, bl]
    score: 0,
    shots: 0,
    maxScore: 0,
    avgScore: 0,
    isArmed: true, 
    threshold: 230,
    lastShotTime: 0,
    zoom: 1.0,
    isDragging: false,
    dragIndex: -1
};

// Ładowanie ustawień
function loadSettings() {
    const saved = localStorage.getItem('laser_range_calib');
    const savedZoom = localStorage.getItem('laser_range_zoom');
    if (saved) {
        state.corners = JSON.parse(saved);
        state.isCalibrating = false;
        calibrationOverlay.classList.remove('active');
        updateHandles();
        setTimeout(drawTarget, 500);
    }
    if (savedZoom) {
        state.zoom = parseFloat(savedZoom);
        applyZoom();
    }
}

// 1. Inicjalizacja kamery
async function initCamera() {
    loadSettings();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'environment',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        video.srcObject = stream;
        
        video.onloadedmetadata = () => {
            uiCanvas.width = video.videoWidth;
            uiCanvas.height = video.videoHeight;
            detectionCanvas.width = video.videoWidth / 4;
            detectionCanvas.height = video.videoHeight / 4;
            
            requestAnimationFrame(detectionLoop);
        };
    } catch (err) {
        console.error("Camera error:", err);
    }
}

// Zoom
function applyZoom() {
    video.style.transform = `scale(${state.zoom})`;
    localStorage.setItem('laser_range_zoom', state.zoom);
}

zoomInBtn.onclick = () => { state.zoom += 0.2; applyZoom(); };
zoomOutBtn.onclick = () => { if(state.zoom > 1) state.zoom -= 0.2; applyZoom(); };

// 2. Detekcja
function detectionLoop() {
    dCtx.drawImage(video, 0, 0, detectionCanvas.width, detectionCanvas.height);
    const data = dCtx.getImageData(0, 0, detectionCanvas.width, detectionCanvas.height).data;
    
    let brightestX = -1, brightestY = -1, maxBrightness = 0;

    for (let i = 0; i < data.length; i += 4) {
        const brightness = (data[i] + data[i+1] + data[i+2]) / 3;
        if (brightness > state.threshold && brightness > maxBrightness) {
            maxBrightness = brightness;
            brightestX = (i / 4) % detectionCanvas.width;
            brightestY = Math.floor((i / 4) / detectionCanvas.width);
        }
    }

    if (brightestX !== -1 && state.isArmed && !state.isCalibrating) {
        processShot(brightestX * 4, brightestY * 4);
        state.isArmed = false;
    } else if (brightestX === -1) {
        state.isArmed = true;
    }
    requestAnimationFrame(detectionLoop);
}

// 3. Punktacja PPN 10m (17x17cm)
function calculateScore(x, y) {
    if (state.corners.length < 4) return 0;
    
    const centerX = (state.corners[0].x + state.corners[1].x + state.corners[2].x + state.corners[3].x) / 4;
    const centerY = (state.corners[0].y + state.corners[1].y + state.corners[2].y + state.corners[3].y) / 4;
    
    const w1 = Math.sqrt(Math.pow(state.corners[1].x - state.corners[0].x, 2) + Math.pow(state.corners[1].y - state.corners[0].y, 2));
    const targetRadius = w1 / 2; // Połowa szerokości tarczy (85mm w skali 170mm)

    const dist = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const relDist = dist / targetRadius; 

    // Promienie PPN 10m względem promienia tarczy (85mm)
    const ppnRadii = [5.75, 13.75, 21.75, 29.75, 37.75, 45.75, 53.75, 61.75, 69.75, 77.75].map(r => r / 85);

    for (let i = 0; i < ppnRadii.length; i++) {
        if (relDist <= ppnRadii[i]) return 10 - i;
    }
    return 0;
}

function processShot(x, y) {
    if (Date.now() - state.lastShotTime < 400) return;

    const points = calculateScore(x, y);
    if (points === 0) return;

    state.shots++;
    state.score += points;
    if (points > state.maxScore) state.maxScore = points;
    state.avgScore = (state.score / state.shots).toFixed(1);

    scoreEl.innerText = state.score;
    avgValEl.innerText = state.avgScore;
    maxValEl.innerText = state.maxScore;
    lastValEl.innerText = points;
    
    shotSound.currentTime = 0;
    shotSound.play().catch(() => {});
    drawHit(x, y);
}

function drawTarget() {
    if (state.corners.length < 4) return;
    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    
    const centerX = (state.corners[0].x + state.corners[1].x + state.corners[2].x + state.corners[3].x) / 4;
    const centerY = (state.corners[0].y + state.corners[1].y + state.corners[2].y + state.corners[3].y) / 4;
    const w = Math.sqrt(Math.pow(state.corners[1].x - state.corners[0].x, 2) + Math.pow(state.corners[1].y - state.corners[0].y, 2));
    const R = w / 2;

    const ppnRadii = [5.75, 13.75, 21.75, 29.75, 37.75, 45.75, 53.75, 61.75, 69.75, 77.75].map(r => (r / 85) * R);

    uiCtx.lineWidth = 1;
    ppnRadii.reverse().forEach((r, i) => {
        uiCtx.beginPath();
        uiCtx.arc(centerX, centerY, r, 0, Math.PI * 2);
        uiCtx.strokeStyle = (10-i) >= 7 ? 'rgba(0, 243, 255, 0.4)' : 'rgba(255, 255, 255, 0.1)';
        uiCtx.stroke();
    });

    uiCtx.strokeStyle = 'cyan';
    uiCtx.lineWidth = 2;
    uiCtx.beginPath();
    uiCtx.moveTo(state.corners[0].x, state.corners[0].y);
    state.corners.forEach(p => uiCtx.lineTo(p.x, p.y));
    uiCtx.closePath();
    uiCtx.stroke();
}

function drawHit(x, y) {
    uiCtx.beginPath();
    uiCtx.arc(x, y, 5, 0, Math.PI * 2);
    uiCtx.fillStyle = '#ff00ff';
    uiCtx.fill();
}

// 4. Kalibracja i Drag & Drop
window.addEventListener('mousedown', startDrag);
window.addEventListener('touchstart', (e) => startDrag(e.touches[0]));
window.addEventListener('mousemove', doDrag);
window.addEventListener('touchmove', (e) => { e.preventDefault(); doDrag(e.touches[0]); }, {passive: false});
window.addEventListener('mouseup', stopDrag);
window.addEventListener('touchend', stopDrag);

function startDrag(e) {
    if (state.isCalibrating) {
        handleFirstCalibration(e);
        return;
    }
    
    const rect = uiCanvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * uiCanvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * uiCanvas.height;

    state.corners.forEach((p, i) => {
        const dist = Math.sqrt(Math.pow(x - p.x, 2) + Math.pow(y - p.y, 2));
        if (dist < 50) { 
            state.isDragging = true;
            state.dragIndex = i;
        }
    });
}

function handleFirstCalibration(e) {
    const rect = uiCanvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * uiCanvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * uiCanvas.height;

    state.corners.push({x, y});
    dots[state.calibrationStep].classList.add('active');
    state.calibrationStep++;
    if (state.calibrationStep === 4) finishCalibration();
}

function doDrag(e) {
    if (!state.isDragging) return;
    const rect = uiCanvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * uiCanvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * uiCanvas.height;

    state.corners[state.dragIndex] = {x, y};
    updateHandles();
    drawTarget();
}

function stopDrag() {
    if (state.isDragging) localStorage.setItem('laser_range_calib', JSON.stringify(state.corners));
    state.isDragging = false;
    state.dragIndex = -1;
}

function updateHandles() {
    document.querySelectorAll('.calib-handle').forEach(h => h.remove());
    if (state.isCalibrating) return;

    state.corners.forEach((p, i) => {
        const handle = document.createElement('div');
        handle.className = 'calib-handle';
        const rect = uiCanvas.getBoundingClientRect();
        handle.style.left = (p.x / uiCanvas.width * rect.width + rect.left) + 'px';
        handle.style.top = (p.y / uiCanvas.height * rect.height + rect.top) + 'px';
        document.body.appendChild(handle);
    });
}

function finishCalibration() {
    state.isCalibrating = false;
    calibrationOverlay.classList.remove('active');
    localStorage.setItem('laser_range_calib', JSON.stringify(state.corners));
    updateHandles();
    drawTarget();
}

document.getElementById('reset-btn').onclick = () => { localStorage.clear(); location.reload(); };
document.getElementById('calibrate-btn').onclick = () => {
    state.isCalibrating = true;
    state.calibrationStep = 0;
    state.corners = [];
    calibrationOverlay.classList.add('active');
    updateHandles();
};

initCamera();
