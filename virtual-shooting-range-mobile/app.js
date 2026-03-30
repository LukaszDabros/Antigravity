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
const avgValEl = document.getElementById('avg-val');
const modeValEl = document.getElementById('mode-val');
const lastValEl = document.getElementById('last-val');
const sessionCountdown = document.getElementById('session-countdown');
const resultModal = document.getElementById('result-modal');
const resScoreEl = document.getElementById('res-score');
const resShotsEl = document.getElementById('res-shots');
const resAvgEl = document.getElementById('res-avg');
const calibrationOverlay = document.getElementById('calibration-overlay');

// Stan aplikacji
let state = {
    isCalibrating: true,
    calibrationStep: 0,
    corners: [], // [tl, tr, br, bl]
    isArmed: true, 
    threshold: 230,
    lastShotTime: 0,
    zoom: 1.0,
    
    // Gracze
    players: [
        { name: "Gracz 1", score: 0, shots: 0, hits: [] },
        { name: "Gracz 2", score: 0, shots: 0, hits: [] },
        { name: "Gracz 3", score: 0, shots: 0, hits: [] },
        { name: "Gracz 4", score: 0, shots: 0, hits: [] },
        { name: "Gracz 5", score: 0, shots: 0, hits: [] }
    ],
    activePlayer: 0,
    
    // Sesje
    mode: 'FREE', // FREE, PRECISION, SPEED
    sessionState: 'IDLE', // IDLE, COUNTDOWN, ACTIVE
    timeLeft: 0,
    
    // Drag & Drop
    isEditing: false,
    isDragging: false,
    dragIndex: -1,
    dragOffset: { x: 0, y: 0 }
};

// Ładowanie ustawień
function loadSettings() {
    const saved = localStorage.getItem('laser_range_calib');
    const savedZoom = localStorage.getItem('laser_range_zoom');
    const savedPlayers = localStorage.getItem('laser_range_players');
    
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
    if (savedPlayers) {
        state.players = JSON.parse(savedPlayers);
        updatePlayerButtons();
    }
}

// 1. Inicjalizacja kamery i Zoomu
async function initCamera() {
    loadSettings();
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        video.srcObject = stream;
        video.onloadedmetadata = () => {
            uiCanvas.width = video.videoWidth;
            uiCanvas.height = video.videoHeight;
            detectionCanvas.width = video.videoWidth / 4;
            detectionCanvas.height = video.videoHeight / 4;
            requestAnimationFrame(detectionLoop);
        };
    } catch (err) { console.error(err); }
}

function applyZoom() {
    video.style.transform = `scale(${state.zoom})`;
    localStorage.setItem('laser_range_zoom', state.zoom);
}

document.getElementById('zoom-in').onclick = () => { state.zoom += 0.2; applyZoom(); if(navigator.vibrate) navigator.vibrate(20); };
document.getElementById('zoom-out').onclick = () => { if(state.zoom > 1) state.zoom -= 0.2; applyZoom(); if(navigator.vibrate) navigator.vibrate(20); };

// 2. Detekcja
function detectionLoop() {
    dCtx.drawImage(video, 0, 0, detectionCanvas.width, detectionCanvas.height);
    const data = dCtx.getImageData(0, 0, detectionCanvas.width, detectionCanvas.height).data;
    
    let brightestX = -1, brightestY = -1, maxBrightness = 0;
    for (let i = 0; i < data.length; i += 4) {
        const b = (data[i] + data[i+1] + data[i+2]) / 3;
        if (b > state.threshold && b > maxBrightness) {
            maxBrightness = b;
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

// 3. Zarządzanie Graczami
function updatePlayerButtons() {
    const btns = document.querySelectorAll('.player-btn');
    btns.forEach((btn, i) => {
        const p = state.players[i];
        // Inicjał z imienia (np. "Adam" -> "1. A")
        const initial = p.name ? p.name.charAt(0).toUpperCase() : '?';
        btn.innerText = `${i+1}. ${initial}`;
        btn.classList.toggle('active', i === state.activePlayer);
        
        // Zdarzenia dla przycisków graczy
        btn.onclick = () => switchPlayer(i);
        
        // Długie naciśnięcie dla edycji imienia
        let timer;
        btn.onmousedown = btn.ontouchstart = () => {
            timer = setTimeout(() => editPlayerName(i), 800);
        };
        btn.onmouseup = btn.ontouchend = () => clearTimeout(timer);
    });
}

function switchPlayer(index) {
    if (state.sessionState === 'ACTIVE') return alert("Zakończ sesję przed zmianą gracza!");
    state.activePlayer = index;
    updatePlayerButtons();
    updateUI();
    drawTarget();
    if(navigator.vibrate) navigator.vibrate(20);
}

function editPlayerName(index) {
    const newName = prompt("Wpisz imię zawodnika:", state.players[index].name);
    if (newName && newName.trim().length > 0) {
        state.players[index].name = newName.trim();
        localStorage.setItem('laser_range_players', JSON.stringify(state.players));
        updatePlayerButtons();
    }
}

// 4. Punktacja i Sesje
function processShot(x, y) {
    if (Date.now() - state.lastShotTime < 400) return;
    if (state.sessionState !== 'ACTIVE' && state.mode !== 'FREE') return;

    const points = calculateScore(x, y);
    if (points === 0) return;

    // Dodanie trefienia do aktywnego gracza
    const p = state.players[state.activePlayer];
    p.shots++;
    p.score += points;
    p.hits.push({ x, y, points, time: Date.now() });

    updateUI();
    shotSound.currentTime = 0;
    shotSound.play().catch(() => {});
    drawHit(x, y);
    state.lastShotTime = Date.now();

    if (state.mode === 'PRECISION' && p.shots >= 10) {
        endSession();
    }
}

function updateUI() {
    const p = state.players[state.activePlayer];
    scoreEl.innerText = p.score;
    avgValEl.innerText = p.shots > 0 ? (p.score / p.shots).toFixed(1) : "0.0";
    modeValEl.innerText = state.mode;
    lastValEl.innerText = p.hits.length > 0 ? p.hits[p.hits.length - 1].points : "0";
}

document.getElementById('mode-selector').onclick = () => {
    const modes = ['FREE', 'PRECISION', 'SPEED'];
    let idx = modes.indexOf(state.mode);
    state.mode = modes[(idx + 1) % modes.length];
    updateUI();
    if(navigator.vibrate) navigator.vibrate(30);
};

document.getElementById('reset-session-btn').onclick = () => {
    if (confirm("Wyczyścić tarcze i wyniki tylko dla tego gracza?")) {
        const p = state.players[state.activePlayer];
        p.score = 0;
        p.shots = 0;
        p.hits = [];
        updateUI();
        drawTarget();
        if(navigator.vibrate) navigator.vibrate(50);
    }
};

document.getElementById('start-session-btn').onclick = startSession;

function startSession() {
    if (state.isCalibrating) return alert("Najpierw skalibruj tarczę!");
    
    state.sessionState = 'COUNTDOWN';
    // Czyścimy wyniki sesji dla aktywnego gracza jeśli tryb tego wymaga
    const p = state.players[state.activePlayer];
    if (state.mode !== 'FREE') {
        p.score = 0;
        p.shots = 0;
        p.hits = [];
    }
    
    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height); 
    drawTarget();
    
    let count = 3;
    const countEl = sessionCountdown.querySelector('.huge-text');
    sessionCountdown.classList.add('active');
    countEl.classList.add('animating');
    
    const timer = setInterval(() => {
        countEl.innerText = count > 0 ? count : "START!";
        if (count === 0) {
            clearInterval(timer);
            state.sessionState = 'ACTIVE';
            setTimeout(() => { 
                sessionCountdown.classList.remove('active'); 
                countEl.classList.remove('animating');
            }, 600);
            if (state.mode === 'SPEED') startSpeedTimer();
        }
        count--;
    }, 1000);
    if(navigator.vibrate) navigator.vibrate(50);
}

function startSpeedTimer() {
    state.timeLeft = 30;
    const timer = setInterval(() => {
        state.timeLeft--;
        if (state.timeLeft <= 0 || state.sessionState !== 'ACTIVE') {
            clearInterval(timer);
            if (state.sessionState === 'ACTIVE') endSession();
        }
    }, 1000);
}

function endSession() {
    state.sessionState = 'IDLE';
    const p = state.players[state.activePlayer];
    resScoreEl.innerText = p.score;
    resShotsEl.innerText = p.shots;
    resAvgEl.innerText = p.shots > 0 ? (p.score / p.shots).toFixed(1) : "0.0";
    resultModal.classList.add('active');
}

document.getElementById('close-result').onclick = () => {
    resultModal.classList.remove('active');
    if(navigator.vibrate) navigator.vibrate(20);
};

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

    // Rysowanie trafień aktywnego gracza
    const p = state.players[state.activePlayer];
    p.hits.forEach(hit => drawHit(hit.x, hit.y));

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

// 4. Drag & Drop (Poprawione dla Motorola G85 - contain fit)
function getMousePos(e) {
    const rect = video.getBoundingClientRect();
    
    // Logika dla object-fit: contain
    const videoRatio = video.videoWidth / video.videoHeight;
    const containerRatio = rect.width / rect.height;
    
    let actualWidth, actualHeight, offsetX = 0, offsetY = 0;
    
    if (containerRatio > videoRatio) {
        actualHeight = rect.height;
        actualWidth = actualHeight * videoRatio;
        offsetX = (rect.width - actualWidth) / 2;
    } else {
        actualWidth = rect.width;
        actualHeight = actualWidth / videoRatio;
        offsetY = (rect.height - actualHeight) / 2;
    }

    const x = ((e.clientX - rect.left - offsetX) / actualWidth) * uiCanvas.width;
    const y = ((e.clientY - rect.top - offsetY) / actualHeight) * uiCanvas.height;
    
    return { x, y };
}

function startDrag(e) {
    if (state.isCalibrating) {
        const pos = getMousePos(e);
        state.corners.push(pos);
        
        const dots = document.querySelectorAll('.dot');
        if (dots[state.corners.length - 1]) dots[state.corners.length - 1].classList.add('active');
        
        if (state.corners.length === 4) finishCalibration();
        return;
    }

    if (!state.isEditing) return; // Zablokowane
    
    const pos = getMousePos(e);
    state.corners.forEach((p, i) => {
        const d = Math.sqrt(Math.pow(pos.x - p.x, 2) + Math.pow(pos.y - p.y, 2));
        if (d < 60) {
            state.isDragging = true;
            state.dragIndex = i;
            state.dragOffset = { x: pos.x - p.x, y: pos.y - p.y };
        }
    });
}

function doDrag(e) {
    if (!state.isDragging) return;
    const pos = getMousePos(e);
    state.corners[state.dragIndex] = { x: pos.x - state.dragOffset.x, y: pos.y - state.dragOffset.y };
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
    if (state.isCalibrating || !state.isEditing) return;

    state.corners.forEach((p, i) => {
        const handle = document.createElement('div');
        handle.className = 'calib-handle';
        const rect = video.getBoundingClientRect();
        
        // Obliczanie pozycji z uwzględnieniem contain fit
        const videoRatio = video.videoWidth / video.videoHeight;
        const containerRatio = rect.width / rect.height;
        let actualWidth, actualHeight, offsetX = 0, offsetY = 0;
        if (containerRatio > videoRatio) {
            actualHeight = rect.height;
            actualWidth = actualHeight * videoRatio;
            offsetX = (rect.width - actualWidth) / 2;
        } else {
            actualWidth = rect.width;
            actualHeight = actualWidth / videoRatio;
            offsetY = (rect.height - actualHeight) / 2;
        }

        handle.style.left = (p.x / uiCanvas.width * actualWidth + rect.left + offsetX) + 'px';
        handle.style.top = (p.y / uiCanvas.height * actualHeight + rect.top + offsetY) + 'px';
        document.body.appendChild(handle);
    });
}

function finishCalibration() {
    state.isCalibrating = false;
    state.isEditing = false;
    calibrationOverlay.classList.remove('active');
    localStorage.setItem('laser_range_calib', JSON.stringify(state.corners));
    updateHandles();
    drawTarget();
}

document.getElementById('reset-btn').onclick = () => { 
    if (confirm("Czy na pewno chcesz zresetować wszystkie ustawienia i kalibrację?")) {
        localStorage.clear(); 
        location.reload(); 
    }
};

document.getElementById('calibrate-btn').onclick = () => {
    if(navigator.vibrate) navigator.vibrate(20);
    state.isEditing = !state.isEditing;
    const btn = document.getElementById('calibrate-btn');
    if (state.isEditing) {
        btn.classList.add('editing');
        btn.innerText = "ZAKOŃCZ";
    } else {
        btn.classList.remove('editing');
        btn.innerText = "KALIBRACJA";
    }
    updateHandles();
};

// Event Listeners
window.addEventListener('mousedown', startDrag);
window.addEventListener('touchstart', (e) => startDrag(e.touches[0]));
window.addEventListener('mousemove', doDrag);
window.addEventListener('touchmove', (e) => { e.preventDefault(); doDrag(e.touches[0]); }, {passive: false});
window.addEventListener('mouseup', stopDrag);
window.addEventListener('touchend', stopDrag);

// Inicjalizacja przycisków na starcie
updatePlayerButtons();
initCamera();
