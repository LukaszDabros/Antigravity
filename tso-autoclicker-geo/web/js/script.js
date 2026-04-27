// CONFIGURATION
let explorers = [];
let targetExplorer = null; // null means bulk mode

// UI ELEMENTS
const explorerGrid = document.getElementById('explorerGrid');
const statusLine = document.getElementById('statusLine');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const btnSelectAll = document.getElementById('btnSelectAll');
const btnSetAllTasks = document.getElementById('btnSetAllTasks');
const settingsModal = document.getElementById('settingsModal');
const taskSelect = document.getElementById('taskSelect');
const btnSave = document.getElementById('saveTask');
const bulkTaskSelect = document.getElementById('bulkTaskSelect');

const lagBuffer = document.getElementById('lagBuffer');
const valLag = document.getElementById('valLag');
const toggleCalib = document.getElementById('toggleCalib');
const calibContent = document.getElementById('calibContent');
const chkTurbo = document.getElementById('chkTurbo');

let isAllSelected = false;

// INITIALIZE
async function init() {
    explorers = await eel.get_explorers()();
    // Default: all inactive and marble
    explorers.forEach(e => {
        e.active = false;
        e.task = "marble";
        e.task_label = "Marmur";
    });
    renderExplorers();
}

function renderExplorers() {
    explorerGrid.innerHTML = '';
    explorers.forEach((exp, index) => {
        const card = document.createElement('div');
        card.className = `explorer-card ${exp.active ? 'active' : ''}`;
        
        // Settings Button (⚙️)
        const btnSettings = document.createElement('div');
        btnSettings.className = 'btn-card-settings';
        btnSettings.innerHTML = '⚙️';
        btnSettings.title = 'Ustawienia indywidualne';
        btnSettings.onclick = (e) => {
            e.stopPropagation(); // Don't toggle selection when clicking gear
            targetExplorer = exp;
            taskSelect.value = exp.task;
            settingsModal.style.display = 'flex';
        };

        const content = document.createElement('div');
        content.innerHTML = `
            <div class="chk">${exp.active ? '✓' : ''}</div>
            <h3>${exp.name}</h3>
            <p class="task-label">${exp.task_label}</p>
        `;
        
        card.appendChild(btnSettings);
        card.appendChild(content);

        // Click on the rest of the card toggles selection
        card.onclick = () => {
            exp.active = !exp.active;
            renderExplorers();
        };
        explorerGrid.appendChild(card);
    });
}

btnSelectAll.onclick = () => {
    isAllSelected = !isAllSelected;
    explorers.forEach(e => e.active = isAllSelected);
    btnSelectAll.innerText = isAllSelected ? "ODZNACZ WSZYSTKICH" : "ZAZNACZ WSZYSTKICH";
    renderExplorers();
};

btnSetAllTasks.onclick = () => {
    const selectedTask = bulkTaskSelect.value;
    const selectedLabel = bulkTaskSelect.options[bulkTaskSelect.selectedIndex].text;
    explorers.forEach(e => {
        if (e.active) {
            e.task = selectedTask;
            e.task_label = selectedLabel;
        }
    });
    renderExplorers();
};

btnSave.onclick = () => {
    const taskVal = taskSelect.value;
    const taskLabel = taskSelect.options[taskSelect.selectedIndex].text;
    
    if (targetExplorer) {
        targetExplorer.task = taskVal;
        targetExplorer.task_label = taskLabel;
        targetExplorer.active = true; 
    }
    
    settingsModal.style.display = 'none';
    renderExplorers();
};

// BOT CONTROL
btnStart.onclick = async () => {
    const activeExplorers = explorers.filter(e => e.active);
    if (activeExplorers.length === 0) {
        alert("Wybierz przynajmniej jednego geologa!");
        return;
    }

    btnStart.disabled = true;
    btnStop.disabled = false;
    statusLine.innerText = "Uruchamianie... Przygotuj okno gry.";

    const config = {
        selectedExplorers: activeExplorers.map(e => e.name),
        globalTask: bulkTaskSelect.value,
        individualTasks: activeExplorers.map(e => ({name: e.name, task: e.task}))
    };
    
    await eel.run_bot(config)();
};

btnStop.onclick = async () => {
    statusLine.innerText = "Zatrzymywanie bota...";
    await eel.stop_bot()();
};

// EXPOSED TO PYTHON
eel.expose(on_bot_progress);
function on_bot_progress(count) {
    statusLine.innerText = `Wysłano: ${count}`;
}

eel.expose(on_status_update);
function on_status_update(text) {
    statusLine.innerText = text;
}

eel.expose(on_bot_finished);
function on_bot_finished(msg) {
    statusLine.innerText = msg;
    btnStart.disabled = false;
    btnStop.disabled = true;
}

// CALIBRATION HANDLERS
lagBuffer.oninput = () => {
    valLag.innerText = lagBuffer.value;
    eel.update_lag_buffer(parseFloat(lagBuffer.value));
};

toggleCalib.onclick = () => {
    const isCollapsed = calibContent.classList.toggle('collapsed');
    localStorage.setItem('calibCollapsed', isCollapsed);
};

chkTurbo.onchange = () => {
    eel.set_turbo_mode(chkTurbo.checked);
    localStorage.setItem('turboEnabled', chkTurbo.checked);
};

// LOAD PREFERENCES
function loadPrefs() {
    const isCollapsed = localStorage.getItem('calibCollapsed') === 'true';
    if (!isCollapsed) {
        calibContent.classList.remove('collapsed');
    }
    
    const turboEnabled = localStorage.getItem('turboEnabled') === 'true';
    chkTurbo.checked = turboEnabled;
    eel.set_turbo_mode(turboEnabled);
}

loadPrefs();
init();
