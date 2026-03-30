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
    isCalibrating: false,
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
    isMultiplayer: true,
    
    // Sesje
    mode: 'FREE', // FREE, PRECISION, SPEED
    sessionState: 'IDLE', // IDLE, COUNTDOWN, ACTIVE
    timeLeft: 0,
    
    // Drag & Drop / Editing
    isEditing: false,
    isDragging: false,
    dragIndex: -1,
    dragOffset: { x: 0, y: 0 }
};

// Selektory pomocnicze
const settingsModal = document.getElementById('settings-modal');
const namesInputs = document.querySelectorAll('.name-input');
const playersList = document.getElementById('players-list');

// Ładowanie ustawień
function loadSettings() {
    const saved = localStorage.getItem('laser_range_calib');
    const savedZoom = localStorage.getItem('laser_range_zoom');
    const savedPlayers = localStorage.getItem('laser_range_players');
    const savedMulti = localStorage.getItem('laser_range_multi');
    
    if (saved) {
        state.corners = JSON.parse(saved);
        updateHandles();
        setTimeout(drawTarget, 500);
    } else {
        startCalibration();
    }
    
    if (savedZoom) {
        state.zoom = parseFloat(savedZoom);
        applyZoom();
    }
    
    if (savedPlayers) {
        state.players = JSON.parse(savedPlayers);
    }
    
    if (savedMulti !== null) {
        state.isMultiplayer = savedMulti === 'true';
    }

    updatePlayerButtons();
    syncSettingsUI();
}

function syncSettingsUI() {
    namesInputs.forEach((input, i) => {
        input.value = state.players[i].name;
    });
    
    document.getElementById('solo-mode-btn').classList.toggle('active', !state.isMultiplayer);
    document.getElementById('multi-mode-btn').classList.toggle('active', state.isMultiplayer);
    playersList.style.display = state.isMultiplayer ? 'flex' : 'none';
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

// 3. Zarządzanie Graczami i Ustawienia
function updatePlayerButtons() {
    const btns = document.querySelectorAll('.player-btn');

    if (!state.isMultiplayer) {
        // SOLO – tylko gracz 1
        btns.forEach((btn, i) => {
            if (i === 0) {
                const p = state.players[0];
                const initial = p.name ? p.name.charAt(0).toUpperCase() : 'G';
                btn.innerText = `1. ${initial}`;
                btn.classList.add('active');
                btn.style.display = 'flex';
                btn.onclick = () => switchPlayer(0);
            } else {
                btn.style.display = 'none';
            }
        });
        return;
    }

    // GRUPA – pokaż tylko graczy z wpisanym niestandardowym imieniem
    // "Gracz N" = domyślne, puste lub niezmodyfikowane
    let visibleCount = 0;
    btns.forEach((btn, i) => {
        const p = state.players[i];
        const isCustomName = p.name && p.name.trim() !== '' && p.name !== `Gracz ${i + 1}`;

        if (isCustomName) {
            const initial = p.name.charAt(0).toUpperCase();
            btn.innerText = `${i + 1}. ${initial}`;
            btn.classList.toggle('active', i === state.activePlayer);
            btn.style.display = 'flex';
            btn.onclick = () => switchPlayer(i);
            visibleCount++;
        } else {
            btn.style.display = 'none';
        }
    });

    // Minimum 1 gracz zawsze widoczny (gracz 1 jako fallback)
    if (visibleCount === 0) {
        const btn = btns[0];
        const p = state.players[0];
        btn.innerText = `1. G`;
        btn.classList.add('active');
        btn.style.display = 'flex';
        btn.onclick = () => switchPlayer(0);
    }
}

function switchPlayer(index) {
    if (state.sessionState === 'ACTIVE') return;
    state.activePlayer = index;
    updatePlayerButtons();
    updateUI();
    drawTarget();
    if(navigator.vibrate) navigator.vibrate(20);
}

// Obsługa Menu
document.getElementById('settings-open-btn').onclick = () => {
    settingsModal.classList.add('active');
    if(navigator.vibrate) navigator.vibrate(20);
};

document.getElementById('settings-close-btn').onclick = () => {
    settingsModal.classList.remove('active');
    if(navigator.vibrate) navigator.vibrate(20);
};

// Edycja imion w menu
namesInputs.forEach((input, i) => {
    input.oninput = () => {
        state.players[i].name = input.value || `Gracz ${i+1}`;
        localStorage.setItem('laser_range_players', JSON.stringify(state.players));
        updatePlayerButtons();
    };
});

// Solo vs Multi
document.getElementById('solo-mode-btn').onclick = () => {
    state.isMultiplayer = false;
    localStorage.setItem('laser_range_multi', 'false');
    syncSettingsUI();
    switchPlayer(0);
};

document.getElementById('multi-mode-btn').onclick = () => {
    state.isMultiplayer = true;
    localStorage.setItem('laser_range_multi', 'true');
    syncSettingsUI();
};

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
    if (confirm("Wyczyścić wyniki aktualnego gracza?")) {
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

// =======================================================
// 4. Kalibracja + Drag & Drop
// =======================================================

function getMousePos(e) {
    if (!e) return { x: 0, y: 0 };
    const clientX = e.clientX !== undefined ? e.clientX : (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
    const clientY = e.clientY !== undefined ? e.clientY : (e.touches && e.touches[0] ? e.touches[0].clientY : 0);
    
    const rect = video.getBoundingClientRect();
    const videoRatio = (video.videoWidth || 16) / (video.videoHeight || 9);
    const containerRatio = rect.width / rect.height;

    let scale, offsetX = 0, offsetY = 0;

    // Logika object-fit: cover
    if (containerRatio > videoRatio) {
        // Kontener jest szerszy niż wideo (paski góra/dół w contain, tutaj ucięte boki?)
        // W cover: wideo rozciągnięte do szerokości kontenera, góra/dół ucięte
        scale = rect.width / video.videoWidth;
        offsetY = (rect.height - video.videoHeight * scale) / 2;
    } else {
        // Kontener jest węższy (ucięte boki w cover)
        scale = rect.height / video.videoHeight;
        offsetX = (rect.width - video.videoWidth * scale) / 2;
    }

    return {
        x: (clientX - rect.left - offsetX) / scale,
        y: (clientY - rect.top - offsetY) / scale
    };
}

// Rejestruje punkt kalibracji (niezaleznie od sposobu dotknięcia)
function registerCalibTap(clientX, clientY) {
    if (!state.isCalibrating) return;
    
    const w  = video.getBoundingClientRect().width  || window.innerWidth;
    const h  = video.getBoundingClientRect().height || window.innerHeight;
    const cw = uiCanvas.width  || window.innerWidth;
    const ch = uiCanvas.height || window.innerHeight;
    const rx = video.getBoundingClientRect().left;
    const ry = video.getBoundingClientRect().top;
    
    const pos = {
        x: (clientX - rx) / w * cw,
        y: (clientY - ry) / h * ch
    };
    
    state.corners.push(pos);
    const dots = document.querySelectorAll('.dot');
    if (dots[state.corners.length - 1]) {
        dots[state.corners.length - 1].classList.add('active');
    }
    if (navigator.vibrate) navigator.vibrate(30);
    if (state.corners.length >= 4) finishCalibration();
}

function startDrag(e) {
    if (!e) return;
    
    // Kalibracja obsługiwana przez registerCalibTap – ignoruj tutaj
    if (state.isCalibrating) return;
    if (!state.isEditing) return;
    
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
    if (state.isDragging) {
        localStorage.setItem('laser_range_calib', JSON.stringify(state.corners));
    }
    state.isDragging = false;
    state.dragIndex = -1;
}

function updateHandles() {
    document.querySelectorAll('.calib-handle').forEach(h => h.remove());
    if (state.isCalibrating || !state.isEditing || state.corners.length < 4) return;

    const rect = video.getBoundingClientRect();
    const videoRatio = video.videoWidth / video.videoHeight;
    const containerRatio = rect.width / rect.height;

    let scale, offsetX = 0, offsetY = 0;
    if (containerRatio > videoRatio) {
        scale = rect.width / video.videoWidth;
        offsetY = (rect.height - video.videoHeight * scale) / 2;
    } else {
        scale = rect.height / video.videoHeight;
        offsetX = (rect.width - video.videoWidth * scale) / 2;
    }

    state.corners.forEach((p, i) => {
        const handle = document.createElement('div');
        handle.className = 'calib-handle';
        handle.style.left = (p.x * scale + rect.left + offsetX) + 'px';
        handle.style.top = (p.y * scale + rect.top + offsetY) + 'px';
        handle.style.pointerEvents = 'auto'; // Muszą być klikalne by drag działał precyzyjnie
        document.body.appendChild(handle);
    });
}

function startCalibration() {
    state.isCalibrating = true;
    state.corners = [];
    document.getElementById('calibration-overlay').classList.add('active');
    settingsModal.classList.remove('active');
}

function finishCalibration() {
    state.isCalibrating = false;
    state.isEditing = true; // Włączamy edycję po kalibracji by móc korygować
    document.getElementById('calibration-overlay').classList.remove('active');
    // Zapisz kalibrację do localStorage!
    localStorage.setItem('laser_range_calib', JSON.stringify(state.corners));
    updateHandles();
    drawTarget();
}

document.getElementById('full-reset-btn').onclick = () => {
    if (confirm("UWAGA: To wyczyści kalibrację i WSZYSTKIE wyniki! Kontynuować?")) {
        localStorage.clear();
        location.reload();
    }
};

document.getElementById('calibrate-btn').onclick = () => startCalibration();

document.getElementById('close-result').onclick = () => {
    resultModal.classList.remove('active');
    if (navigator.vibrate) navigator.vibrate(20);
};

// =================== AUTO KALIBRACJA ===================

const autoCalibOverlay = document.getElementById('auto-calib-overlay');
const autoCalibStatus  = document.getElementById('auto-calib-status');
const cornerHandlesEl  = document.getElementById('corner-handles');

let autoCorners = []; // Tymczasowe rogi do korekty
let dragCornerIdx = -1;
let dragCornerStart = { x: 0, y: 0 };

/**
 * Analizuje klatkę wideo — adaptywny próg jasności.
 * Zwraca tablicę [TL, TR, BR, BL] lub defaultowe narożniki jeśli nie znaleziono.
 */
function detectTarget() {
    const SCALE = 6;
    const w = Math.floor((video.videoWidth  || window.innerWidth)  / SCALE);
    const h = Math.floor((video.videoHeight || window.innerHeight) / SCALE);
    if (w < 10 || h < 10) return null;

    const tmp = document.createElement('canvas');
    tmp.width = w; tmp.height = h;
    const ctx = tmp.getContext('2d');
    ctx.drawImage(video, 0, 0, w, h);
    const data = ctx.getImageData(0, 0, w, h).data;

    // 1. Znajdź max jasność w kadrze
    let maxBright = 0;
    for (let i = 0; i < data.length; i += 4) {
        const b = (data[i] + data[i+1] + data[i+2]) / 3;
        if (b > maxBright) maxBright = b;
    }

    // 2. Adaptywny próg: 75% maksimum (był 82% - zwiększamy czułość)
    const THRESH = Math.max(130, maxBright * 0.75);

    let minX = w, maxX = 0, minY = h, maxY = 0, cnt = 0;
    const MARGIN = 2;

    for (let y = MARGIN; y < h - MARGIN; y++) {
        for (let x = MARGIN; x < w - MARGIN; x++) {
            const i = (y * w + x) * 4;
            const bright = (data[i] + data[i+1] + data[i+2]) / 3;
            if (bright > THRESH) {
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                cnt++;
            }
        }
    }

    const coverage = cnt / (w * h);
    // Odrzuc jeśli za mało lub za dużo (cała scena jest jasna)
    if (coverage < 0.01 || coverage > 0.80) return null;
    if ((maxX - minX) < w * 0.05 || (maxY - minY) < h * 0.05) return null;

    const cw = uiCanvas.width  || window.innerWidth;
    const ch = uiCanvas.height || window.innerHeight;
    const scaleW = cw / (video.videoWidth  || window.innerWidth);
    const scaleH = ch / (video.videoHeight || window.innerHeight);

    return [
        { x: minX * SCALE * scaleW, y: minY * SCALE * scaleH }, // TL
        { x: maxX * SCALE * scaleW, y: minY * SCALE * scaleH }, // TR
        { x: maxX * SCALE * scaleW, y: maxY * SCALE * scaleH }, // BR
        { x: minX * SCALE * scaleW, y: maxY * SCALE * scaleH }  // BL
    ];
}

/** Domyślne narożniki (25% margines od krawędzi ekranu) */
function defaultCorners() {
    const cw = uiCanvas.width  || window.innerWidth;
    const ch = uiCanvas.height || window.innerHeight;
    const mx = cw * 0.15, my = ch * 0.15;
    return [
        { x: mx,      y: my      }, // TL
        { x: cw - mx, y: my      }, // TR
        { x: cw - mx, y: ch - my }, // BR
        { x: mx,      y: ch - my }  // BL
    ];
}

function drawPreviewRect() {
    if (!autoCorners || autoCorners.length < 4) return;
    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    uiCtx.strokeStyle = '#00f3ff';
    uiCtx.lineWidth = 3;
    uiCtx.beginPath();
    uiCtx.moveTo(autoCorners[0].x, autoCorners[0].y);
    uiCtx.lineTo(autoCorners[1].x, autoCorners[1].y);
    uiCtx.lineTo(autoCorners[2].x, autoCorners[2].y);
    uiCtx.lineTo(autoCorners[3].x, autoCorners[3].y);
    uiCtx.closePath();
    uiCtx.stroke();
    
    // Dodatkowo narysuj małe punkty w rogach
    uiCtx.fillStyle = '#00f3ff';
    autoCorners.forEach(p => {
        uiCtx.beginPath();
        uiCtx.arc(p.x, p.y, 5, 0, Math.PI*2);
        uiCtx.fill();
    });
}

/** Renderuje 4 uchwyty rogów w overlaycie auto-kalibracji */
function renderCornerHandles() {
    cornerHandlesEl.innerHTML = '';
    const labels = ['LG','PG','PD','LD'];
    const sw = window.innerWidth, sh = window.innerHeight;
    const cw = uiCanvas.width  || sw;
    const ch = uiCanvas.height || sh;

    autoCorners.forEach((c, i) => {
        const el = document.createElement('div');
        el.className = 'corner-handle';
        el.textContent = labels[i];
        // Przelicz z wideo-space → screen-space (analogicznie do updateHandles)
        const rect = video.getBoundingClientRect();
        const videoRatio = video.videoWidth / video.videoHeight;
        const containerRatio = rect.width / rect.height;
        let scale, offsetX = 0, offsetY = 0;
        if (containerRatio > videoRatio) {
            scale = rect.width / video.videoWidth;
            offsetY = (rect.height - video.videoHeight * scale) / 2;
        } else {
            scale = rect.height / video.videoHeight;
            offsetX = (rect.width - video.videoWidth * scale) / 2;
        }

        el.style.left = (c.x * scale + rect.left + offsetX) + 'px';
        el.style.top  = (c.y * scale + rect.top + offsetY) + 'px';

        // Obsługa ciągnięcia (touch)
        el.addEventListener('touchstart', (e) => {
            e.stopPropagation();
            dragCornerIdx = i;
            const t = e.changedTouches[0];
            dragCornerStart = { x: t.clientX, y: t.clientY };
        }, { passive: true });

        // Obsługa ciągnięcia (mouse)
        el.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            dragCornerIdx = i;
            dragCornerStart = { x: e.clientX, y: e.clientY };
        });

        cornerHandlesEl.appendChild(el);
    });
}

// Move handles globally
window.addEventListener('touchmove', (e) => {
    if (dragCornerIdx < 0 || !autoCalibOverlay.classList.contains('active')) return;
    const t = e.changedTouches[0];
    moveCorner(t.clientX, t.clientY);
}, { passive: true });

window.addEventListener('mousemove', (e) => {
    if (dragCornerIdx < 0 || !autoCalibOverlay.classList.contains('active')) return;
    moveCorner(e.clientX, e.clientY);
});

window.addEventListener('touchend', () => { dragCornerIdx = -1; });
window.addEventListener('mouseup',   () => { dragCornerIdx = -1; });

function moveCorner(clientX, clientY) {
    if (dragCornerIdx < 0) return;
    const sw = window.innerWidth, sh = window.innerHeight;
    const cw = uiCanvas.width  || sw;
    const ch = uiCanvas.height || sh;
    autoCorners[dragCornerIdx] = {
        x: Math.max(0, Math.min(cw, clientX / sw * cw)),
        y: Math.max(0, Math.min(ch, clientY / sh * ch))
    };
    renderCornerHandles();
    drawPreviewRect();
}

/** Uruchamia automatyczną kalibrację */
function startAutoCalibration() {
    settingsModal.classList.remove('active');
    state.isEditing = true; // Umożliwiamy edycję
    autoCorners = defaultCorners(); 
    autoCalibOverlay.classList.add('active');
    autoCalibStatus.textContent = '🔍 Szukam tarczy...';
    
    renderCornerHandles();
    drawPreviewRect();

    // Dajemy chwilę na ustabilizowanie obrazu
    setTimeout(() => {
        const result = detectTarget();
        if (result) {
            autoCorners = result;
            autoCalibStatus.textContent = '✓ Wykryto tarczę! Możesz teraz ręcznie poprawić punkty.';
        } else {
            autoCalibStatus.textContent = '⚠ Nie wykryto tarczy. Przeciągnij kółka ręcznie na rogi tarczy.';
        }
        renderCornerHandles();
        drawPreviewRect();
    }, 1000);
}

document.getElementById('auto-calib-btn').onclick = startAutoCalibration;

document.getElementById('auto-calib-retry').onclick = () => {
    autoCalibStatus.textContent = '\uD83D\uDD0D Szukam tarczy\u2026';
    autoCorners = defaultCorners();
    renderCornerHandles();
    drawPreviewRect();
    setTimeout(() => {
        const result = detectTarget();
        if (result) {
            autoCorners = result;
            autoCalibStatus.textContent = '\u2713 Tarcza wykryta! Przeci\u0105gnij r\u00F3g by poprawi\u0107.';
        } else {
            autoCalibStatus.textContent = '\u26A0 Nie wykryto. Przeci\u0105gnij rogi r\u0119cznie.';
        }
        renderCornerHandles();
        drawPreviewRect();
    }, 700);
};

document.getElementById('auto-calib-confirm').onclick = () => {
    if (autoCorners.length < 4) {
        autoCalibStatus.textContent = '⚠ Najpierw wykryj lub ustaw 4 rogi.';
        return;
    }
    state.corners = [...autoCorners];
    localStorage.setItem('laser_range_calib', JSON.stringify(state.corners));
    autoCalibOverlay.classList.remove('active');
    cornerHandlesEl.innerHTML = '';
    uiCtx.clearRect(0, 0, uiCanvas.width, uiCanvas.height);
    drawTarget();
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
};

document.getElementById('auto-calib-manual').onclick = () => {
    autoCalibOverlay.classList.remove('active');
    cornerHandlesEl.innerHTML = '';
    startCalibration(); // Przełącz na ręczną
};

// =================== Bezpośredni handler kalibracji ===================
// WAŻNE: używane zamiast window events dla niezawodnego działania na Androidzie
const calibOverlay = document.getElementById('calibration-overlay');

calibOverlay.addEventListener('click', (e) => {
    registerCalibTap(e.clientX, e.clientY);
});

calibOverlay.addEventListener('touchstart', (e) => {
    e.preventDefault(); // Blokuj generowanie click po dotknięciu
    const t = e.changedTouches[0] || e.touches[0];
    if (t) registerCalibTap(t.clientX, t.clientY);
}, { passive: false });

// =================== Globalne eventy (drag kalibracji rogow) ===================
window.addEventListener('mousedown', startDrag);
window.addEventListener('touchstart', (e) => {
    const t = e.changedTouches[0] || e.touches[0];
    if (t) startDrag(t);
});
window.addEventListener('mousemove', doDrag);
window.addEventListener('touchmove', (e) => {
    e.preventDefault();
    const t = e.changedTouches[0] || e.touches[0];
    if (t) doDrag(t);
}, { passive: false });
window.addEventListener('mouseup', stopDrag);
window.addEventListener('touchend', stopDrag);

updatePlayerButtons();
initCamera();
