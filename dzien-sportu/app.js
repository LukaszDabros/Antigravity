// ==========================================================================
// STATE MANAGEMENT & SYNC CONFIG
// ==========================================================================

const APP_KEY = 'gei1clcs';
const SYNC_URL = 'https://keyvalue.immanuel.co/api/KeyVal';
const REFEREE_PASSWORD = 'tr@baJerychonska2026';

let tournamentState = null;
let currentActiveTab = 'timeline';
let currentActiveSport = 'volleyball';
let currentSelectedClass = null;
let currentActiveFilter = 'all';
let isReferee = false;
let pendingMatchIdAfterUnlock = null;

// Element Cache
const elements = {
  panels: {
    timeline: document.getElementById('panel-timeline'),
    sports: document.getElementById('panel-sports'),
    class: document.getElementById('panel-class')
  },
  tabs: {
    timeline: document.getElementById('tab-timeline'),
    sports: document.getElementById('tab-sports'),
    class: document.getElementById('tab-class')
  },
  timelineStream: document.getElementById('timeline-stream'),
  sportDetails: document.getElementById('sport-details-container'),
  classSelector: document.querySelector('.class-selector-grid'),
  classDashboard: document.getElementById('class-dashboard'),
  selectedClassLabel: document.getElementById('selected-class-label'),
  classMatchesList: document.getElementById('class-matches-list'),
  classStats: {
    total: document.getElementById('class-stat-total'),
    wins: document.getElementById('class-stat-wins'),
    points: document.getElementById('class-stat-points')
  },
  modal: document.getElementById('score-modal'),
  modalCloseBtn: document.getElementById('modal-close-btn'),
  modalTitle: document.getElementById('modal-title'),
  modalSubtitle: document.getElementById('modal-subtitle'),
  scoreForm: document.getElementById('score-form'),
  scoreTeam1: document.getElementById('score-team1'),
  scoreTeam2: document.getElementById('score-team2'),
  labelTeam1: document.getElementById('label-team1'),
  labelTeam2: document.getElementById('label-team2'),
  btnCancelScore: document.getElementById('btn-cancel-score'),
  toast: document.getElementById('toast'),
  themeToggleBtn: document.getElementById('theme-toggle-btn'),
  resetDataBtn: document.getElementById('reset-data-btn'),
  nextUpContainer: document.getElementById('next-up-container'),
  sportFilters: document.querySelector('.filter-badges-wrapper'),
  refereeLoginBtn: document.getElementById('referee-login-btn'),
  refereeBtnText: document.getElementById('referee-btn-text'),
  refereeModal: document.getElementById('referee-modal'),
  refereeModalClose: document.getElementById('referee-modal-close'),
  refereeForm: document.getElementById('referee-form'),
  refereePasswordInput: document.getElementById('referee-password'),
  btnCancelReferee: document.getElementById('btn-cancel-referee')
};

// Current open match in modal
let activeModalMatch = null;

// ==========================================================================
// INITIALIZATION & STATE LOAD
// ==========================================================================

function initApp() {
  // Check Referee Session
  if (sessionStorage.getItem('isReferee') === 'true') {
    isReferee = true;
  }
  updateRefereeUI();

  loadState();
  setupEventListeners();
  renderTimeline();
  renderLiveBanner();
  updateThemeIcon();
  
  // Set default sport active subtab
  document.getElementById(`subtab-${currentActiveSport}`).click();

  // Load from Cloud immediately, then start interval polling
  pullStateFromCloud(true);
  setInterval(() => {
    pullStateFromCloud(true);
  }, 15000); // Poll every 15 seconds
}

function loadState() {
  const savedState = localStorage.getItem('prezentki_sport_day_2025_state');
  if (savedState) {
    try {
      tournamentState = JSON.parse(savedState);
      
      // Auto-validate structure in case of older version saved
      if (!tournamentState.sports || !tournamentState.sports.volleyball) {
        throw new Error("Invalid structure");
      }
    } catch (e) {
      console.error("Error parsing saved state, resetting:", e);
      resetToDefault();
    }
  } else {
    resetToDefault();
  }
}

function resetToDefault() {
  // Deep copy raw data from data.js
  tournamentState = JSON.parse(JSON.stringify(SCHEDULE_DATA));
  
  // Add unique IDs to matches for easy lookups
  Object.keys(tournamentState.sports).forEach(sportId => {
    tournamentState.sports[sportId].matches.forEach((match, idx) => {
      match.id = `${sportId}_match_${idx}`;
      if (match.team1_score === undefined) match.team1_score = null;
      if (match.team2_score === undefined) match.team2_score = null;
      if (match.completed === undefined) match.completed = false;
    });
  });
  
  saveState();
}

function saveState() {
  localStorage.setItem('prezentki_sport_day_2025_state', JSON.stringify(tournamentState));
}

// ==========================================================================
// EVENT LISTENERS Setup
// ==========================================================================

function setupEventListeners() {
  // Main Navigation tabs switching
  Object.keys(elements.tabs).forEach(tabId => {
    elements.tabs[tabId].addEventListener('click', () => switchTab(tabId));
  });

  // Theme toggle
  elements.themeToggleBtn.addEventListener('click', toggleTheme);

  // Referee Login / Logout
  elements.refereeLoginBtn.addEventListener('click', handleRefereeLoginBtn);

  // Reset database
  elements.resetDataBtn.addEventListener('click', () => {
    if (!isReferee) {
      pendingMatchIdAfterUnlock = 'reset';
      elements.refereePasswordInput.value = '';
      elements.refereeModal.classList.remove('hidden');
      elements.refereePasswordInput.focus();
      return;
    }
    triggerReset();
  });

  // Referee Modal Controls
  elements.refereeModalClose.addEventListener('click', closeRefereeModal);
  elements.btnCancelReferee.addEventListener('click', closeRefereeModal);
  elements.refereeForm.addEventListener('submit', handleRefereeSubmit);

  elements.refereeModal.addEventListener('click', (e) => {
    if (e.target === elements.refereeModal) closeRefereeModal();
  });

  // Timeline sport filter badges
  if (elements.sportFilters) {
    elements.sportFilters.addEventListener('click', (e) => {
      const badge = e.target.closest('.sport-filter-badge');
      if (!badge) return;
      
      // Toggle active class
      elements.sportFilters.querySelectorAll('.sport-filter-badge').forEach(b => b.classList.remove('active'));
      badge.classList.add('active');
      
      currentActiveFilter = badge.dataset.filter;
      renderTimeline();
    });
  }

  // Sport sub-tabs selector
  document.querySelectorAll('.sport-sub-tab').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.sport-sub-tab').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentActiveSport = btn.dataset.sport;
      renderSportView(currentActiveSport);
    });
  });

  // Class selection grid
  elements.classSelector.addEventListener('click', (e) => {
    const btn = e.target.closest('.class-btn');
    if (!btn) return;
    
    document.querySelectorAll('.class-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    currentSelectedClass = btn.dataset.class;
    selectClass(currentSelectedClass);
  });

  // Modal Controls
  elements.modalCloseBtn.addEventListener('click', closeModal);
  elements.btnCancelScore.addEventListener('click', closeModal);
  elements.scoreForm.addEventListener('submit', saveScoreForm);

  // Close modal on click outside content
  elements.modal.addEventListener('click', (e) => {
    if (e.target === elements.modal) closeModal();
  });
}

// ==========================================================================
// THEME, REFEREE & CORE NAVIGATION LOGIC
// ==========================================================================

function toggleTheme() {
  const isDark = document.body.classList.toggle('dark-theme');
  document.body.classList.toggle('light-theme', !isDark);
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
  updateThemeIcon();
}

function updateThemeIcon() {
  const isDark = document.body.classList.contains('dark-theme');
  const icon = elements.themeToggleBtn.querySelector('i');
  if (isDark) {
    icon.className = 'fa-solid fa-sun';
  } else {
    icon.className = 'fa-solid fa-moon';
  }
}

// Read theme on load
(function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    document.body.classList.remove('dark-theme');
    document.body.classList.add('light-theme');
  } else {
    document.body.classList.add('dark-theme');
    document.body.classList.remove('light-theme');
  }
})();

function switchTab(tabId) {
  currentActiveTab = tabId;
  
  // Toggle buttons
  Object.keys(elements.tabs).forEach(id => {
    const active = id === tabId;
    elements.tabs[id].classList.toggle('active', active);
    elements.tabs[id].setAttribute('aria-selected', active ? 'true' : 'false');
  });
  
  // Toggle panels
  Object.keys(elements.panels).forEach(id => {
    elements.panels[id].classList.toggle('active', id === tabId);
  });

  // Render when visible
  if (tabId === 'timeline') renderTimeline();
  else if (tabId === 'sports') renderSportView(currentActiveSport);
  else if (tabId === 'class' && currentSelectedClass) selectClass(currentSelectedClass);
}

function handleRefereeLoginBtn() {
  if (isReferee) {
    // Log out
    isReferee = false;
    sessionStorage.removeItem('isReferee');
    updateRefereeUI();
    showToast("Wylogowano sędziego!");
    
    // Refresh timeline views to update edit locks
    if (currentActiveTab === 'timeline') renderTimeline();
  } else {
    // Open Referee Login Modal
    pendingMatchIdAfterUnlock = null;
    elements.refereePasswordInput.value = '';
    elements.refereeModal.classList.remove('hidden');
    elements.refereePasswordInput.focus();
  }
}

function closeRefereeModal() {
  elements.refereeModal.classList.add('hidden');
  pendingMatchIdAfterUnlock = null;
}

function handleRefereeSubmit(e) {
  e.preventDefault();
  const pass = elements.refereePasswordInput.value.trim();
  
  if (pass === REFEREE_PASSWORD) {
    isReferee = true;
    sessionStorage.setItem('isReferee', 'true');
    updateRefereeUI();
    closeRefereeModal();
    showToast("Zalogowano pomyślnie jako sędzia! 🔓");
    
    // Refresh timeline views to update edit locks
    if (currentActiveTab === 'timeline') renderTimeline();

    // Perform pending action
    if (pendingMatchIdAfterUnlock === 'reset') {
      triggerReset();
    } else if (pendingMatchIdAfterUnlock) {
      openScoreModal(pendingMatchIdAfterUnlock);
    }
  } else {
    alert("Błędne hasło!");
    elements.refereePasswordInput.value = '';
    elements.refereePasswordInput.focus();
  }
}

function triggerReset() {
  if (confirm("Czy na pewno chcesz zresetować wszystkie wyniki do wartości początkowych na wszystkich urządzeniach?")) {
    resetToDefault();
    pushStateToCloud();
    showToast("Zresetowano dane rozgrywek!");
    
    // Refresh current active views
    renderLiveBanner();
    if (currentActiveTab === 'timeline') renderTimeline();
    else if (currentActiveTab === 'sports') renderSportView(currentActiveSport);
    else if (currentActiveTab === 'class' && currentSelectedClass) selectClass(currentSelectedClass);
  }
}

function updateRefereeUI() {
  const icon = elements.refereeLoginBtn.querySelector('i');
  if (isReferee) {
    elements.refereeLoginBtn.classList.add('active');
    elements.refereeLoginBtn.style.color = '#10b981'; // Green
    elements.refereeLoginBtn.title = "Panel sędziego (odblokowany)";
    icon.className = 'fa-solid fa-lock-open';
    elements.refereeBtnText.textContent = "Sędzia: Zalogowany";
  } else {
    elements.refereeLoginBtn.classList.remove('active');
    elements.refereeLoginBtn.style.color = '';
    elements.refereeLoginBtn.title = "Panel sędziego (zablokowany)";
    icon.className = 'fa-solid fa-lock';
    elements.refereeBtnText.textContent = "Sędzia";
  }
}

// ==========================================================================
// RENDERERS: LIVE BANNER
// ==========================================================================

function renderLiveBanner() {
  const allMatches = [];
  
  Object.keys(tournamentState.sports).forEach(sportId => {
    const sport = tournamentState.sports[sportId];
    sport.matches.forEach(match => {
      allMatches.push({ ...match, sportId, sportName: sport.name });
    });
  });

  // Filter completed and pending
  const completed = allMatches.filter(m => m.completed);
  const pending = allMatches.filter(m => !m.completed);
  
  // Sort pending by time, completed by time descending
  pending.sort((a,b) => a.time.localeCompare(b.time));
  completed.sort((a,b) => b.time.localeCompare(a.time));

  // Combine: show last 2 completed (results) and next 4 pending
  const displayMatches = [...completed.slice(0, 2).reverse(), ...pending.slice(0, 5)];

  if (displayMatches.length === 0) {
    elements.nextUpContainer.innerHTML = `<span class="text-muted">Brak meczów do wyświetlenia</span>`;
    return;
  }

  elements.nextUpContainer.innerHTML = displayMatches.map(match => {
    const scoreStr = match.completed 
      ? `<span class="score-wrap">${match.team1_score}:${match.team2_score}</span>`
      : `<span class="score-wrap" style="background:rgba(255,255,255,0.05);color:var(--text-secondary)">--</span>`;
    
    // Check if placeholder name
    const t1 = match.team1 || match.placeholder1 || "???";
    const t2 = match.team2 || match.placeholder2 || "???";
    
    return `
      <div class="live-preview-card" onclick="openScoreModal('${match.id}')" style="cursor:pointer;">
        <span class="sport-indicator ${match.sportId}"></span>
        <span class="text-muted" style="font-size: 11px;">${match.time}</span>
        <span class="teams-wrap">${t1} vs ${t2}</span>
        ${scoreStr}
      </div>
    `;
  }).join('');
}

// ==========================================================================
// RENDERERS: TIMELINE STREAM
// ==========================================================================

function renderTimeline() {
  // 1. Gather all timeline slots
  const timelineMap = {};
  
  // Group sport matches
  Object.keys(tournamentState.sports).forEach(sportId => {
    const sport = tournamentState.sports[sportId];
    sport.matches.forEach(match => {
      // Filter check
      if (currentActiveFilter !== 'all' && currentActiveFilter !== sportId) return;
      
      if (!timelineMap[match.time]) {
        timelineMap[match.time] = [];
      }
      timelineMap[match.time].push({
        ...match,
        sportId: sportId,
        sportName: sport.name
      });
    });
  });

  // Group other general events
  if (currentActiveFilter === 'all' || currentActiveFilter === 'general') {
    tournamentState.other_events.forEach(event => {
      if (!timelineMap[event.time]) {
        timelineMap[event.time] = [];
      }
      timelineMap[event.time].push({
        ...event,
        sportId: 'general',
        sportName: 'Inne',
        isGeneral: true
      });
    });
  }

  // 2. Sort times
  const sortedTimes = Object.keys(timelineMap).sort();

  if (sortedTimes.length === 0) {
    elements.timelineStream.innerHTML = `
      <div class="glass-card" style="padding: 40px; text-align: center; color: var(--text-secondary);">
        <i class="fa-solid fa-calendar-xmark" style="font-size: 40px; margin-bottom: 16px; color: var(--text-muted);"></i>
        <p>Brak wydarzeń dla wybranych filtrów.</p>
      </div>
    `;
    return;
  }

  // 3. Render HTML
  elements.timelineStream.innerHTML = sortedTimes.map(time => {
    const items = timelineMap[time];
    
    // Sort items so finals are first in the list, then group stages
    items.sort((a,b) => {
      const scoreA = a.stage && a.stage.includes('Finał') ? 2 : (a.stage && a.stage.includes('m-ce') ? 1 : 0);
      const scoreB = b.stage && b.stage.includes('Finał') ? 2 : (b.stage && b.stage.includes('m-ce') ? 1 : 0);
      return scoreB - scoreA;
    });

    const itemsHtml = items.map(item => {
      if (item.isGeneral) {
        return `
          <div class="glass-card match-card general">
            <div class="card-top">
              <span class="sport-meta"><i class="fa-solid fa-flag"></i> ${item.sportName}</span>
              <span class="court-badge">${item.court}</span>
            </div>
            <div class="general-event-title">${item.name}</div>
            <div class="card-bottom">
              <span>${item.stage}</span>
              <span>Wszyscy uczestnicy</span>
            </div>
          </div>
        `;
      }

      // Check for winner class
      const hasScore = item.completed;
      const t1WinnerClass = hasScore && Number(item.team1_score) > Number(item.team2_score) ? 'winner' : '';
      const t2WinnerClass = hasScore && Number(item.team2_score) > Number(item.team1_score) ? 'winner' : '';
      
      const team1Display = item.team1 || item.placeholder1 || "???";
      const team2Display = item.team2 || item.placeholder2 || "???";
      
      const score1Display = hasScore ? item.team1_score : '';
      const score2Display = hasScore ? item.team2_score : '';

      const isFinal = item.stage && (item.stage.includes('Finał') || item.stage.includes('miejsce') || item.stage.includes('m-ce'));
      const stageBadgeClass = isFinal ? 'stage-badge' : 'court-badge';

      return `
        <div class="glass-card match-card ${item.sportId} ${hasScore ? 'completed' : ''}" onclick="openScoreModal('${item.id}')">
          <div class="card-top">
            <span class="sport-meta">
              <i class="fa-solid ${getSportIcon(item.sportId)}"></i> ${item.sportName}
            </span>
            <span class="${stageBadgeClass}">${item.stage} • ${item.court}</span>
          </div>
          <div class="card-middle">
            <div class="team-block ${t1WinnerClass}">
              <span class="team-name">${team1Display}</span>
              ${item.placeholder1 && item.team1 ? `<span class="team-placeholder">(${item.placeholder1})</span>` : ''}
            </div>
            <div class="team-score">${score1Display}</div>
            <div class="score-divider">vs</div>
            <div class="team-score">${score2Display}</div>
            <div class="team-block ${t2WinnerClass}">
              <span class="team-name">${team2Display}</span>
              ${item.placeholder2 && item.team2 ? `<span class="team-placeholder">(${item.placeholder2})</span>` : ''}
            </div>
          </div>
          <div class="card-bottom">
            <span>Zasady: ${tournamentState.sports[item.sportId].rules}</span>
            <span class="edit-hint"><i class="fa-solid ${isReferee ? 'fa-pen-to-square' : 'fa-lock'}"></i> ${isReferee ? 'Wprowadź wynik' : 'Zablokowane'}</span>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="timeline-slot">
        <div class="time-header">${time}</div>
        <div class="matches-grid">
          ${itemsHtml}
        </div>
      </div>
    `;
  }).join('');
}

function getSportIcon(sportId) {
  switch (sportId) {
    case 'volleyball': return 'fa-volleyball';
    case 'basketball': return 'fa-basketball';
    case 'soccer': return 'fa-futbol';
    default: return 'fa-trophy';
  }
}

// ==========================================================================
// RENDERERS: SPORTS DETAILS & AUTOMATIC STANDINGS
// ==========================================================================

function renderSportView(sportId) {
  const sport = tournamentState.sports[sportId];
  
  // Recalculate standings and dynamically populate finals placeholders if needed!
  updateStandingsAndSeeding(sportId);

  // Render Layout
  let sidebarHtml = `
    <div class="glass-card rules-card">
      <h3><i class="fa-solid fa-circle-info text-highlight"></i> Zasady rozgrywek</h3>
      <ul class="rules-list">
        <li><strong>Czas trwania:</strong> ${sport.rules}</li>
        <li><strong>Dyscyplina:</strong> ${sport.name}</li>
        <li><strong>Faza grupowa:</strong> System kołowy (każdy z każdym).</li>
        <li><strong>Awanse:</strong> Zwycięzcy grup grają w wielkim finale o 1. miejsce. Drużyny z drugich miejsc grają w meczu o 3. miejsce.</li>
      </ul>
    </div>
  `;

  // Render Group Tables
  const groupsHtml = Object.keys(sport.groups).map(groupName => {
    const standings = sport.standings[groupName];
    const rowsHtml = standings.map((teamData, index) => {
      const isQualified = index < 2; // top 2 go to finals
      const rowClass = isQualified ? 'qualified-row' : '';
      
      // Select appropriate stats headers based on sport
      const scoreDiff = teamData.scored - teamData.conceded;
      const scoreDiffStr = scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff;
      
      // Soccer uses Draw (R), Volleyball/Basketball do not
      const drawCol = sportId === 'soccer' ? `<td>${teamData.draws}</td>` : '';
      
      return `
        <tr class="${rowClass}">
          <td class="rank-col">${index + 1}</td>
          <td class="team-col">${teamData.team}</td>
          <td>${teamData.played}</td>
          <td>${teamData.wins}</td>
          ${drawCol}
          <td>${teamData.losses}</td>
          <td>${teamData.scored}:${teamData.conceded} (${scoreDiffStr})</td>
          <td style="font-weight:700; color:var(--primary-color);">${teamData.points}</td>
        </tr>
      `;
    }).join('');

    const drawHeader = sportId === 'soccer' ? '<th>R</th>' : '';

    return `
      <div class="glass-card group-section" style="padding:20px;">
        <div class="group-title">
          <span>Grupa ${groupName}</span>
          <span class="court-badge" style="background:var(--bg-tertiary)">Mecze na ${groupName === 'A' ? 'Boisku 1' : 'Boisku 2'}</span>
        </div>
        <div class="table-wrapper">
          <table class="standings-table">
            <thead>
              <tr>
                <th style="text-align:center;">Poz</th>
                <th>Klasa</th>
                <th>M</th>
                <th>Z</th>
                ${drawHeader}
                <th>P</th>
                <th>Punkty (male)</th>
                <th>Pkt</th>
              </tr>
            </thead>
            <tbody>
              ${rowsHtml}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }).join('');

  // Render Finals Bracket
  const finalsMatches = sport.matches.filter(m => m.group === 'Finały');
  finalsMatches.sort((a,b) => a.time.localeCompare(b.time)); // 3rd place usually first, then final

  const bracketHtml = `
    <div class="glass-card finals-bracket-card">
      <h3 class="bracket-title"><i class="fa-solid fa-sitemap text-highlight"></i> Runda Finałowa</h3>
      <div class="bracket-stream">
        ${finalsMatches.map(match => {
          const hasScore = match.completed;
          const t1WinnerClass = hasScore && Number(match.team1_score) > Number(match.team2_score) ? 'winner' : '';
          const t2WinnerClass = hasScore && Number(match.team2_score) > Number(match.team1_score) ? 'winner' : '';
          
          const team1Display = match.team1 || match.placeholder1 || "???";
          const team2Display = match.team2 || match.placeholder2 || "???";
          
          const score1Display = hasScore ? match.team1_score : '';
          const score2Display = hasScore ? match.team2_score : '';
          
          return `
            <div class="glass-card match-card ${sportId} ${hasScore ? 'completed' : ''}" onclick="openScoreModal('${match.id}')" style="min-height:120px;">
              <div class="card-top">
                <span class="sport-meta">${match.stage}</span>
                <span class="court-badge">${match.time} • ${match.court}</span>
              </div>
              <div class="card-middle" style="margin:8px 0;">
                <div class="team-block ${t1WinnerClass}">
                  <span class="team-name" style="font-size:15px;">${team1Display}</span>
                  ${match.placeholder1 && match.team1 ? `<span class="team-placeholder" style="font-size:10px;">(${match.placeholder1})</span>` : ''}
                </div>
                <div class="team-score" style="width:36px; height:36px; font-size:18px;">${score1Display}</div>
                <div class="score-divider" style="font-size:12px;">vs</div>
                <div class="team-score" style="width:36px; height:36px; font-size:18px;">${score2Display}</div>
                <div class="team-block ${t2WinnerClass}">
                  <span class="team-name" style="font-size:15px;">${team2Display}</span>
                  ${match.placeholder2 && match.team2 ? `<span class="team-placeholder" style="font-size:10px;">(${match.placeholder2})</span>` : ''}
                </div>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  // Render Group Matches List
  const groupMatches = sport.matches.filter(m => m.group !== 'Finały');
  groupMatches.sort((a,b) => a.time.localeCompare(b.time));

  const matchesListHtml = `
    <div class="glass-card" style="padding: 24px;">
      <h3 style="margin-bottom: 20px;"><i class="fa-solid fa-list-ol text-highlight"></i> Terminarz Spotkań</h3>
      <div class="timeline-stream" style="gap:12px; margin-bottom: 0;">
        ${groupMatches.map(match => {
          const hasScore = match.completed;
          const team1Display = match.team1 || match.placeholder1 || "???";
          const team2Display = match.team2 || match.placeholder2 || "???";
          const scoreStr = hasScore 
            ? `<span class="score-wrap" style="padding: 4px 10px; border-radius: 4px; font-size: 16px; font-weight:800; background:var(--primary-color); color:white">${match.team1_score} : ${match.team2_score}</span>`
            : `<span class="score-wrap" style="padding: 4px 10px; border-radius: 4px; font-size: 14px; font-weight:600; background:var(--bg-secondary); color:var(--text-muted)">vs</span>`;
          
          return `
            <div class="glass-card live-preview-card" onclick="openScoreModal('${match.id}')" style="cursor:pointer; display:flex; justify-content:space-between; padding:12px 20px; font-size:15px;">
              <div style="display:flex; align-items:center; gap:16px;">
                <span class="text-muted" style="font-weight:700; width:45px;">${match.time}</span>
                <span class="court-badge">${match.court}</span>
                <span class="court-badge" style="border-color:transparent; background:rgba(99,102,241,0.05); color:var(--primary-color)">Grup. ${match.group}</span>
              </div>
              <div style="display:flex; align-items:center; gap:20px; justify-content:flex-end;">
                <span style="font-weight:700; font-family:'Outfit', sans-serif;">${team1Display}</span>
                ${scoreStr}
                <span style="font-weight:700; font-family:'Outfit', sans-serif;">${team2Display}</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </div>
  `;

  elements.sportDetails.innerHTML = `
    <div class="sport-grid">
      <div class="sport-sidebar">
        ${sidebarHtml}
        ${groupsHtml}
      </div>
      <div class="sport-main-content" style="display:flex; flex-direction:column; gap:24px;">
        ${bracketHtml}
        ${matchesListHtml}
      </div>
    </div>
  `;
}

// Helper to compute standings dynamically
function updateStandingsAndSeeding(sportId) {
  const sport = tournamentState.sports[sportId];
  sport.standings = {};

  // Initialize empty standings for each group
  Object.keys(sport.groups).forEach(groupName => {
    sport.standings[groupName] = sport.groups[groupName].map(team => ({
      team: team,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      scored: 0,
      conceded: 0,
      points: 0
    }));
  });

  // Calculate stats based on group matches
  sport.matches.forEach(match => {
    if (match.group === 'Finały' || !match.completed) return;
    
    // Find groups
    const t1 = match.team1;
    const t2 = match.team2;
    const groupName = match.group;

    const groupTable = sport.standings[groupName];
    if (!groupTable) return;

    const team1Data = groupTable.find(t => t.team === t1);
    const team2Data = groupTable.find(t => t.team === t2);

    if (!team1Data || !team2Data) return;

    const s1 = Number(match.team1_score);
    const s2 = Number(match.team2_score);

    // Update played and scores
    team1Data.played += 1;
    team2Data.played += 1;
    team1Data.scored += s1;
    team1Data.conceded += s2;
    team2Data.scored += s2;
    team2Data.conceded += s1;

    if (s1 > s2) {
      team1Data.wins += 1;
      team2Data.losses += 1;
      team1Data.points += sportId === 'soccer' ? 3 : 2; // soccer: 3 for win, others: 2
    } else if (s2 > s1) {
      team2Data.wins += 1;
      team1Data.losses += 1;
      team2Data.points += sportId === 'soccer' ? 3 : 2;
    } else {
      // Draw (only makes sense in soccer, but handle anyway)
      team1Data.draws += 1;
      team2Data.draws += 1;
      team1Data.points += 1;
      team2Data.points += 1;
    }
  });

  // Sort tables
  Object.keys(sport.standings).forEach(groupName => {
    sport.standings[groupName].sort((a, b) => {
      // 1. Points
      if (b.points !== a.points) return b.points - a.points;
      
      // 2. Score Difference (scored - conceded)
      const diffA = a.scored - a.conceded;
      const diffB = b.scored - b.conceded;
      if (diffB !== diffA) return diffB - diffA;
      
      // 3. Scored
      if (b.scored !== a.scored) return b.scored - a.scored;
      
      // 4. Alphabetical (just to have deterministic sorting)
      return a.team.localeCompare(b.team);
    });
  });

  // DYNAMIC SEEDING FOR FINALS:
  // Dynamically populate finals matches based on current standings.
  const groupStageMatches = sport.matches.filter(m => m.group !== 'Finały');
  
  // Get top teams
  const groupAStandings = sport.standings['A'];
  const groupBStandings = sport.standings['B'];

  if (groupAStandings && groupBStandings) {
    const firstA = groupAStandings[0].team;
    const secondA = groupAStandings[1].team;
    const firstB = groupBStandings[0].team;
    const secondB = groupBStandings[1].team;

    // Seeding final matches
    sport.matches.forEach(match => {
      if (match.group === 'Finały' && !match.completed) {
        // For Volleyball: if no group matches are played yet, preserve the default pre-filled sheet teams (3C, 1B, 3A, 3B)
        const hasAnyGroupMatchesPlayed = groupStageMatches.some(m => m.completed);
        if (sportId === 'volleyball' && !hasAnyGroupMatchesPlayed) {
          return;
        }

        if (match.stage.includes('3. miejsce') || match.stage.includes('m-ce 3')) {
          match.team1 = secondA;
          match.team2 = secondB;
        } else if (match.stage.includes('Finał') || match.stage.includes('1-2') || match.stage.includes('m-ce 1')) {
          match.team1 = firstA;
          match.team2 = firstB;
        }
      }
    });
  }
}

// ==========================================================================
// RENDERERS: CLASS DASHBOARD
// ==========================================================================

function selectClass(classId) {
  elements.selectedClassLabel.textContent = classId;
  elements.classDashboard.classList.remove('hidden');

  // Find all matches for this class
  const classMatches = [];
  let totalPlayed = 0;
  let totalWins = 0;
  let strengthPoints = 0;

  Object.keys(tournamentState.sports).forEach(sportId => {
    const sport = tournamentState.sports[sportId];
    
    // Standings points
    // Let's find this team's points in the standings
    Object.keys(sport.standings || {}).forEach(groupName => {
      const standings = sport.standings[groupName];
      const teamStat = standings.find(t => t.team === classId);
      if (teamStat) {
        strengthPoints += teamStat.points;
      }
    });

    sport.matches.forEach(match => {
      if (match.team1 === classId || match.team2 === classId) {
        classMatches.push({
          ...match,
          sportId: sportId,
          sportName: sport.name
        });

        if (match.completed) {
          totalPlayed++;
          const score1 = Number(match.team1_score);
          const score2 = Number(match.team2_score);
          if (match.team1 === classId && score1 > score2) totalWins++;
          if (match.team2 === classId && score2 > score1) totalWins++;
        }
      }
    });
  });

  // Sort matches by time
  classMatches.sort((a, b) => a.time.localeCompare(b.time));

  // Render stats
  elements.classStats.total.textContent = totalPlayed;
  elements.classStats.wins.textContent = totalWins;
  elements.classStats.points.textContent = strengthPoints;

  // Render match list
  if (classMatches.length === 0) {
    elements.classMatchesList.innerHTML = `
      <div class="glass-card" style="padding: 24px; text-align: center; color: var(--text-secondary);">
        Ta klasa nie ma przypisanych meczów grupowych.
      </div>
    `;
    return;
  }

  elements.classMatchesList.innerHTML = classMatches.map(item => {
    const hasScore = item.completed;
    const t1WinnerClass = hasScore && Number(item.team1_score) > Number(item.team2_score) ? 'winner' : '';
    const t2WinnerClass = hasScore && Number(item.team2_score) > Number(item.team1_score) ? 'winner' : '';
    
    const team1Display = item.team1 || item.placeholder1 || "???";
    const team2Display = item.team2 || item.placeholder2 || "???";
    
    const score1Display = hasScore ? item.team1_score : '';
    const score2Display = hasScore ? item.team2_score : '';

    const isTeam1CurrentClass = item.team1 === classId;
    const isTeam2CurrentClass = item.team2 === classId;
    
    const t1Highlight = isTeam1CurrentClass ? 'text-highlight' : '';
    const t2Highlight = isTeam2CurrentClass ? 'text-highlight' : '';

    return `
      <div class="timeline-slot" style="grid-template-columns: 70px 1fr; gap: 16px;">
        <div class="time-header" style="font-size: 16px; top: 0; padding-top: 4px; background:transparent;">${item.time}</div>
        <div class="matches-grid" style="grid-template-columns: 1fr;">
          <div class="glass-card match-card ${item.sportId} ${hasScore ? 'completed' : ''}" onclick="openScoreModal('${item.id}')" style="min-height:100px; padding:12px 16px;">
            <div class="card-top" style="margin-bottom:8px;">
              <span class="sport-meta" style="font-size:11px;">
                <i class="fa-solid ${getSportIcon(item.sportId)}"></i> ${item.sportName}
              </span>
              <span class="court-badge" style="font-size:10px; padding:2px 6px;">${item.stage} • ${item.court}</span>
            </div>
            <div class="card-middle" style="margin:4px 0;">
              <div class="team-block ${t1WinnerClass}">
                <span class="team-name ${t1Highlight}" style="font-size:14px;">${team1Display}</span>
              </div>
              <div class="team-score" style="width:34px; height:34px; font-size:18px;">${score1Display}</div>
              <div class="score-divider" style="font-size:11px;">vs</div>
              <div class="team-score" style="width:34px; height:34px; font-size:18px;">${score2Display}</div>
              <div class="team-block ${t2WinnerClass}">
                <span class="team-name ${t2Highlight}" style="font-size:14px;">${team2Display}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// ==========================================================================
// MODAL DIALOG (SCORE RECORDER) INTERACTIVITY & REFEREE VERIFICATION
// ==========================================================================

function openScoreModal(matchId) {
  // Find match across all sports
  let foundMatch = null;
  let foundSport = null;

  Object.keys(tournamentState.sports).forEach(sportId => {
    const sport = tournamentState.sports[sportId];
    const match = sport.matches.find(m => m.id === matchId);
    if (match) {
      foundMatch = match;
      foundSport = sport;
    }
  });

  if (!foundMatch) return; // General events or not found matches are ignored
  
  // If match requires team assignments that are not seeded yet, block editing
  if (!foundMatch.team1 && !foundMatch.placeholder1) {
    alert("Przed wpisaniem wyniku tego meczu, muszą zakończyć się rozgrywki grupowe, aby wyłonić finalistów!");
    return;
  }

  // Referee validation
  if (!isReferee) {
    pendingMatchIdAfterUnlock = matchId;
    elements.refereePasswordInput.value = '';
    elements.refereeModal.classList.remove('hidden');
    elements.refereePasswordInput.focus();
    return;
  }

  activeModalMatch = foundMatch;

  // Set titles
  elements.modalTitle.textContent = "Wprowadź wynik meczu";
  elements.modalSubtitle.textContent = `${foundSport.name} • ${foundMatch.court} • Godz. ${foundMatch.time}`;
  
  // Set labels
  elements.labelTeam1.textContent = foundMatch.team1 || foundMatch.placeholder1 || "Drużyna 1";
  elements.labelTeam2.textContent = foundMatch.team2 || foundMatch.placeholder2 || "Drużyna 2";

  // Set input values
  elements.scoreTeam1.value = foundMatch.completed ? foundMatch.team1_score : '';
  elements.scoreTeam2.value = foundMatch.completed ? foundMatch.team2_score : '';

  // Show Modal
  elements.modal.classList.remove('hidden');
  elements.scoreTeam1.focus();
}

function closeModal() {
  elements.modal.classList.add('hidden');
  activeModalMatch = null;
}

function saveScoreForm(e) {
  e.preventDefault();
  if (!activeModalMatch) return;

  const score1 = elements.scoreTeam1.value.trim();
  const score2 = elements.scoreTeam2.value.trim();

  if (score1 === '' || score2 === '') {
    alert("Wprowadź poprawne wyniki!");
    return;
  }

  // Update State
  activeModalMatch.team1_score = parseInt(score1, 10);
  activeModalMatch.team2_score = parseInt(score2, 10);
  activeModalMatch.completed = true;

  saveState();
  closeModal();

  // Show confirmation Toast
  showToast(`Zapisano wynik: ${score1} - ${score2}!`);

  // Recompute standings
  Object.keys(tournamentState.sports).forEach(sportId => {
    updateStandingsAndSeeding(sportId);
  });
  
  // Save locally
  saveState();

  // Push to Cloud for multi-device sync
  pushStateToCloud();

  // Refresh Views
  renderLiveBanner();
  if (currentActiveTab === 'timeline') renderTimeline();
  else if (currentActiveTab === 'sports') renderSportView(currentActiveSport);
  else if (currentActiveTab === 'class' && currentSelectedClass) selectClass(currentSelectedClass);
}

// ==========================================================================
// CLOUD SYNCHRONIZATION (Base64 + keyvalue.immanuel.co)
// ==========================================================================

function pushStateToCloud() {
  // Extract only scores of completed matches to minimize data size and URL path length
  const results = {};
  Object.keys(tournamentState.sports).forEach(sportId => {
    tournamentState.sports[sportId].matches.forEach(match => {
      if (match.completed) {
        results[match.id] = [match.team1_score, match.team2_score];
      }
    });
  });

  try {
    const jsonStr = JSON.stringify(results);
    // URL-safe Base64 encoding
    const base64 = btoa(unescape(encodeURIComponent(jsonStr)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, ''); // strip padding

    const url = `${SYNC_URL}/UpdateValue/${APP_KEY}/results/${base64}`;
    
    fetch(url, { method: 'POST' })
      .then(response => {
        if (!response.ok) throw new Error("Cloud update failed");
        console.log("Cloud sync pushed successfully");
      })
      .catch(err => {
        console.error("Cloud push failed:", err);
      });
  } catch (e) {
    console.error("Error preparing sync payload:", e);
  }
}

let lastCloudRawValue = "";

function pullStateFromCloud(silent = false) {
  const url = `${SYNC_URL}/GetValue/${APP_KEY}/results?_nocache=${Date.now()}`;
  
  fetch(url)
    .then(response => {
      if (!response.ok) throw new Error("Cloud fetch failed");
      return response.text();
    })
    .then(rawText => {
      let val = rawText.trim();
      // Clean leading and trailing quotes if returned by server
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.slice(1, -1);
      }
      
      // If nothing returned or empty
      if (!val || val === "null") return;
      
      // Check if value changed
      if (val === lastCloudRawValue) return;
      lastCloudRawValue = val;

      // Restore base64 padding
      let base64 = val;
      while (base64.length % 4) base64 += '=';
      base64 = base64.replace(/-/g, '+').replace(/_/g, '/');

      // Decode base64
      const jsonStr = decodeURIComponent(escape(atob(base64)));
      const cloudResults = JSON.parse(jsonStr);

      // Merge results back
      let hasChanges = false;
      
      Object.keys(tournamentState.sports).forEach(sportId => {
        tournamentState.sports[sportId].matches.forEach(match => {
          const score = cloudResults[match.id];
          if (score) {
            const s1 = score[0];
            const s2 = score[1];
            if (match.team1_score !== s1 || match.team2_score !== s2 || !match.completed) {
              match.team1_score = s1;
              match.team2_score = s2;
              match.completed = true;
              hasChanges = true;
            }
          } else if (match.completed) {
            // Match is marked completed locally but not in cloud, reset it (e.g. after cloud reset)
            match.team1_score = null;
            match.team2_score = null;
            match.completed = false;
            hasChanges = true;
          }
        });
      });

      if (hasChanges) {
        saveState();
        
        // Recompute standings
        Object.keys(tournamentState.sports).forEach(sportId => {
          updateStandingsAndSeeding(sportId);
        });

        // Re-render active views
        renderLiveBanner();
        if (currentActiveTab === 'timeline') renderTimeline();
        else if (currentActiveTab === 'sports') renderSportView(currentActiveSport);
        else if (currentActiveTab === 'class' && currentSelectedClass) selectClass(currentSelectedClass);

        if (!silent) {
          showToast("Zsynchronizowano nowe wyniki z chmury! 🔄");
        }
        console.log("Cloud sync pulled and merged successfully");
      }
    })
    .catch(err => {
      console.warn("Could not pull state from cloud:", err);
    });
}

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================

let toastTimeout = null;
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.remove('hidden');
  
  if (toastTimeout) clearTimeout(toastTimeout);
  
  toastTimeout = setTimeout(() => {
    elements.toast.classList.add('hidden');
  }, 3000);
}

// Start Application
window.addEventListener('DOMContentLoaded', initApp);
