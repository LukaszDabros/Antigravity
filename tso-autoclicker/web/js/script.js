let allExplorers = [];
let allGeologists = [];
let activeTab = 'explorer'; // 'explorer' or 'geologist'

// Local State
let selectedExplorers = new Set();
let selectedGeologists = new Set();
let individualTasks = {}; // name -> taskKey

// DOM Elements
const unitGrid = document.getElementById('unitGrid');
const statusLine = document.getElementById('statusLine');
const bulkTaskSelect = document.getElementById('bulkTaskSelect');
const btnStart = document.getElementById('btnStart');
const btnStop = document.getElementById('btnStop');
const chkTurbo = document.getElementById('chkTurbo');
const lagBuffer = document.getElementById('lagBuffer');
const valLag = document.getElementById('valLag');

// Task Definitions
const EXPLORER_TASKS = [
    {id: "short_treasure", name: "Krótkie Skarby"},
    {id: "medium_treasure", name: "Średnie Skarby"},
    {id: "long_treasure", name: "Długie Skarby"},
    {id: "very_long_treasure", name: "B. Długie Skarby"},
    {id: "prolonged_treasure", name: "Przedłużone Skarby"},
    {id: "artifact_treasure", name: "Artefakty"},
    {id: "adventure", name: "Przygody (Dowolne)"}
];

const GEOLOGIST_TASKS = [
    {id: "stone", name: "Kamień"},
    {id: "copper", name: "Miedź"},
    {id: "marble", name: "Marmur"},
    {id: "iron", name: "Żelazo"},
    {id: "coal", name: "Węgiel"},
    {id: "gold", name: "Złoto"},
    {id: "titanium", name: "Tytan"},
    {id: "saltpeter", name: "Saletra"},
    {id: "granite", name: "Granit"}
];

// INIT
async function init() {
    const data = await eel.get_initial_data()();
    allExplorers = data.explorers;
    allGeologists = data.geologists;
    
    // Load stored settings
    const storedTurbo = localStorage.getItem('turbo_mode') === 'true';
    chkTurbo.checked = storedTurbo;
    eel.set_turbo_mode(storedTurbo);
    
    const storedLag = localStorage.getItem('lag_buffer') || '0.5';
    lagBuffer.value = storedLag;
    valLag.innerText = storedLag;
    eel.update_lag_buffer(parseFloat(storedLag));

    switchTab('explorer');
}

function switchTab(tab) {
    activeTab = tab;
    document.getElementById('tabExplorer').classList.toggle('active', tab === 'explorer');
    document.getElementById('tabGeologist').classList.toggle('active', tab === 'geologist');
    
    // Update bulk select options
    const tasks = tab === 'explorer' ? EXPLORER_TASKS : GEOLOGIST_TASKS;
    bulkTaskSelect.innerHTML = tasks.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    
    renderGrid();
}

function renderGrid() {
    const list = activeTab === 'explorer' ? allExplorers : allGeologists;
    const taskNames = activeTab === 'explorer' ? EXPLORER_TASKS : GEOLOGIST_TASKS;
    const currentSet = activeTab === 'explorer' ? selectedExplorers : selectedGeologists;
    
    unitGrid.innerHTML = list.map(unit => {
        const isSelected = currentSet.has(unit.name);
        const taskKey = individualTasks[unit.name] || bulkTaskSelect.value;
        const taskName = taskNames.find(t => t.id === taskKey)?.name || "Domyślne";
        const defaultThumb = activeTab === 'explorer' ? 'assets/zwykly_odkrywca.png' : 'assets/zwykly_geolog.png';
        
        return `
            <div class="explorer-card ${isSelected ? 'selected' : ''} ${unit.is_dummy ? 'dummy-unit' : ''}" onclick="toggleUnit('${unit.name}')">
                <div class="card-header">
                    <img src="${unit.icon}" class="unit-thumb" onerror="this.src='${defaultThumb}'">
                    <div class="card-content">
                        <h3>${unit.name}</h3>
                        <div class="task-label">Zadanie: ${taskName}</div>
                        ${unit.is_dummy ? '<span class="dummy-badge">Brak grafiki</span>' : ''}
                    </div>
                </div>
                <button class="btn-settings" onclick="event.stopPropagation(); openSettings('${unit.name}')">⚙️</button>
            </div>
        `;
    }).join('');
}

function toggleUnit(name) {
    const set = activeTab === 'explorer' ? selectedExplorers : selectedGeologists;
    if (set.has(name)) set.delete(name);
    else set.add(name);
    renderGrid();
}

// BULK ACTIONS
document.getElementById('btnSelectAll').onclick = () => {
    const list = activeTab === 'explorer' ? allExplorers : allGeologists;
    const set = activeTab === 'explorer' ? selectedExplorers : selectedGeologists;
    const allActiveNames = list.map(u => u.name);
    const areAllSelected = allActiveNames.every(n => set.has(n));
    
    if (areAllSelected) allActiveNames.forEach(n => set.delete(n));
    else allActiveNames.forEach(n => set.add(n));
    
    renderGrid();
};

document.getElementById('btnSetAllTasks').onclick = () => {
    const list = activeTab === 'explorer' ? allExplorers : allGeologists;
    const set = activeTab === 'explorer' ? selectedExplorers : selectedGeologists;
    list.forEach(u => {
        if (set.has(u.name)) {
            individualTasks[u.name] = bulkTaskSelect.value;
        }
    });
    renderGrid();
};

// TAB SWITCHING
document.getElementById('tabExplorer').onclick = () => switchTab('explorer');
document.getElementById('tabGeologist').onclick = () => switchTab('geologist');

// SETTINGS MODAL
let currentSettingsUnit = null;
function openSettings(name) {
    currentSettingsUnit = name;
    const modal = document.getElementById('settingsModal');
    const taskSelect = document.getElementById('taskSelect');
    const tasks = activeTab === 'explorer' ? EXPLORER_TASKS : GEOLOGIST_TASKS;
    
    taskSelect.innerHTML = tasks.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
    taskSelect.value = individualTasks[name] || bulkTaskSelect.value;
    
    modal.style.display = 'flex';
}

document.getElementById('saveTask').onclick = () => {
    if (currentSettingsUnit) {
        individualTasks[currentSettingsUnit] = document.getElementById('taskSelect').value;
        // Auto-select when individual task is set
        const set = activeTab === 'explorer' ? selectedExplorers : selectedGeologists;
        set.add(currentSettingsUnit);
    }
    document.getElementById('settingsModal').style.display = 'none';
    renderGrid();
};

// BOT CONTROL
btnStart.onclick = async () => {
    const set = activeTab === 'explorer' ? selectedExplorers : selectedGeologists;
    const list = activeTab === 'explorer' ? allExplorers : allGeologists;
    const activeUnits = list.filter(u => set.has(u.name));
    
    if (activeUnits.length === 0) {
        const typePlural = activeTab === 'explorer' ? 'odkrywcy' : 'geologa';
        alert(`Wybierz przynajmniej jednego ${typePlural}!`);
        return;
    }

    const config = {
        type: activeTab,
        selectedUnits: activeUnits.map(u => u.name),
        globalTask: bulkTaskSelect.value,
        individualTasks: activeUnits.map(u => ({name: u.name, task: individualTasks[u.name] || bulkTaskSelect.value}))
    };

    btnStart.disabled = true;
    btnStop.disabled = false;
    statusLine.innerText = "Bot pracuje...";
    
    await eel.run_bot(config)();
};

btnStop.onclick = () => {
    eel.stop_bot()();
    statusLine.innerText = "Zatrzymywanie...";
};

// SETTINGS SYNC
chkTurbo.onchange = () => {
    localStorage.setItem('turbo_mode', chkTurbo.checked);
    eel.set_turbo_mode(chkTurbo.checked);
};

lagBuffer.oninput = () => {
    valLag.innerText = lagBuffer.value;
};

lagBuffer.onchange = () => {
    localStorage.setItem('lag_buffer', lagBuffer.value);
    eel.update_lag_buffer(parseFloat(lagBuffer.value));
};

// EEL CALLBACKS
eel.expose(on_bot_progress);
function on_bot_progress(count) {
    statusLine.innerText = `Wysłano: ${count}`;
}

eel.expose(on_bot_finished);
function on_bot_finished(msg) {
    btnStart.disabled = false;
    btnStop.disabled = true;
    statusLine.innerText = msg;
}

eel.expose(on_status_update);
function on_status_update(msg) {
    statusLine.innerText = msg;
}

// TOGGLE CALIBRATION PANEL
document.getElementById('toggleCalib').onclick = () => {
    const panel = document.getElementById('calibContent');
    panel.classList.toggle('collapsed');
};

// Start
init();
