// ==========================================================================
// STATE MANAGEMENT & SYNC CONFIG
// ==========================================================================

const APP_KEY = 'gei1clcs';
const SYNC_URL = 'https://keyvalue.immanuel.co/api/KeyVal';

// PBKDF2 hash of password 'tr@baJerychonska2026' with salt 'prezentki_salt_2025' and 100000 iterations
const REFEREE_PASSWORD_HASH = '3bd7eaa9907aad1908a3582399f074f7e7c93852f90454c8e3a55ff80ffa7f9a';
const REFEREE_PASSWORD_SALT = 'prezentki_salt_2025';
const REFEREE_PASSWORD_ITERATIONS = 100000;

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
  nextToggleBtn: null, // placeholder if any
  nextUpContainer: document.getElementById('next-up-container'),
  bannerScrollLeftBtn: document.getElementById('banner-scroll-left-btn'),
  bannerScrollRightBtn: document.getElementById('banner-scroll-right-btn'),
  sportFilters: document.querySelector('.filter-badges-wrapper'),
  refereeLoginBtn: document.getElementById('referee-login-btn'),
  refereeBtnText: document.getElementById('referee-btn-text'),
  refereeModal: document.getElementById('referee-modal'),
  refereeModalClose: document.getElementById('referee-modal-close'),
  refereeForm: document.getElementById('referee-form'),
  refereePasswordInput: document.getElementById('referee-password'),
  btnCancelReferee: document.getElementById('btn-cancel-referee'),
  
  // Backups Panel
  backupsBtn: document.getElementById('backups-btn'),
  backupsModal: document.getElementById('backups-modal'),
  backupsModalClose: document.getElementById('backups-modal-close'),
  refereeBackupsActions: document.getElementById('referee-backups-actions'),
  btnCreateManualBackup: document.getElementById('btn-create-manual-backup'),
  backupsListContainer: document.getElementById('backups-list-container')
};

// Current open match in modal
let activeModalMatch = null;

// ==========================================================================
// INITIALIZATION & STATE LOAD
// ==========================================================================

function initApp() {
  // Obsługa animacji powitalnej przy pierwszej wizycie
  const hasVisited = localStorage.getItem('prezentki_sport_day_2025_visited');
  const splash = document.getElementById('welcome-splash');
  if (!hasVisited && splash) {
    splash.classList.remove('hidden');
    setTimeout(() => {
      splash.classList.add('hidden');
      localStorage.setItem('prezentki_sport_day_2025_visited', 'true');
    }, 2000); // 2 sekundy animacji
  } else if (splash) {
    splash.style.display = 'none';
  }

  // Check Referee Session
  if (sessionStorage.getItem('isReferee') === 'true') {
    isReferee = true;
  }
  updateRefereeUI();

  loadState();

  // Recalculate standings and seeding for all sports on startup
  if (tournamentState && tournamentState.sports) {
    Object.keys(tournamentState.sports).forEach(sportId => {
      updateStandingsAndSeeding(sportId);
    });
  }

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

  // Periodically refresh the live banner to update active matches and indicators as time passes
  setInterval(() => {
    renderLiveBanner();
  }, 30000); // Every 30 seconds
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
      if (tournamentState.resetTime === undefined) {
        tournamentState.resetTime = 0;
      }

      // Rebuild matches and sports lists to keep data.js as the source of truth, while preserving scores.
      Object.keys(SCHEDULE_DATA.sports).forEach(sportId => {
        if (tournamentState.sports[sportId]) {
          const oldMatches = tournamentState.sports[sportId].matches || [];
          
          tournamentState.sports[sportId].rules = SCHEDULE_DATA.sports[sportId].rules;
          tournamentState.sports[sportId].name = SCHEDULE_DATA.sports[sportId].name;
          tournamentState.sports[sportId].groups = JSON.parse(JSON.stringify(SCHEDULE_DATA.sports[sportId].groups));
          
          // Rebuild matches from data.js, copying scores from matching old matches
          tournamentState.sports[sportId].matches = SCHEDULE_DATA.sports[sportId].matches.map((defaultMatch, idx) => {
            const matchCopy = JSON.parse(JSON.stringify(defaultMatch));
            matchCopy.id = `${sportId}_match_${idx}`;
            
            const foundOld = oldMatches.find(old => {
              if (matchCopy.group !== 'Finały' && old.group !== 'Finały') {
                return old.group === matchCopy.group &&
                       old.stage === matchCopy.stage &&
                       old.team1 === matchCopy.team1 &&
                       old.team2 === matchCopy.team2;
              }
              if (matchCopy.group === 'Finały' && old.group === 'Finały') {
                const p1Match = (matchCopy.placeholder1 === old.placeholder1) || (matchCopy.team1 === old.team1);
                const p2Match = (matchCopy.placeholder2 === old.placeholder2) || (matchCopy.team2 === old.team2);
                return old.stage === matchCopy.stage && p1Match && p2Match;
              }
              return false;
            });
            
            if (foundOld) {
              matchCopy.completed = foundOld.completed;
              matchCopy.team1_score = foundOld.team1_score;
              matchCopy.team2_score = foundOld.team2_score;
              if (foundOld.team1 && isRealTeamInSport(SCHEDULE_DATA.sports[sportId], foundOld.team1)) {
                matchCopy.team1 = foundOld.team1;
              }
              if (foundOld.team2 && isRealTeamInSport(SCHEDULE_DATA.sports[sportId], foundOld.team2)) {
                matchCopy.team2 = foundOld.team2;
              }
            }
            
            return matchCopy;
          });
        } else {
          // If sport was added, initialize it completely
          tournamentState.sports[sportId] = JSON.parse(JSON.stringify(SCHEDULE_DATA.sports[sportId]));
          tournamentState.sports[sportId].matches.forEach((match, idx) => {
            match.id = `${sportId}_match_${idx}`;
          });
        }
      });
      
      // Remove any sports no longer in SCHEDULE_DATA
      Object.keys(tournamentState.sports).forEach(sportId => {
        if (!SCHEDULE_DATA.sports[sportId]) {
          delete tournamentState.sports[sportId];
        }
      });
      
      if (SCHEDULE_DATA.other_events) {
        tournamentState.other_events = JSON.parse(JSON.stringify(SCHEDULE_DATA.other_events));
      }
      saveState();
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
  
  tournamentState.resetTime = Date.now();
  saveState();
}

function saveState() {
  localStorage.setItem('prezentki_sport_day_2025_state', JSON.stringify(tournamentState));
  if (typeof checkAndCreateAutoBackup === 'function') {
    checkAndCreateAutoBackup();
  }
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

  // Backups Panel Controls
  if (elements.backupsBtn) {
    elements.backupsBtn.addEventListener('click', openBackupsModal);
  }
  if (elements.backupsModalClose) {
    elements.backupsModalClose.addEventListener('click', closeBackupsModal);
  }
  if (elements.backupsModal) {
    elements.backupsModal.addEventListener('click', (e) => {
      if (e.target === elements.backupsModal) closeBackupsModal();
    });
  }
  if (elements.btnCreateManualBackup) {
    elements.btnCreateManualBackup.addEventListener('click', () => {
      if (!isReferee) {
        alert("Musisz być zalogowany jako sędzia!");
        return;
      }
      createBackup('manual');
      showToast("Utworzono ręczną kopię zapasową! 💾");
    });
  }

  // Live Banner scroll buttons
  if (elements.bannerScrollLeftBtn && elements.bannerScrollRightBtn && elements.nextUpContainer) {
    elements.bannerScrollLeftBtn.addEventListener('click', () => {
      elements.nextUpContainer.scrollBy({
        left: -320,
        behavior: 'smooth'
      });
    });
    elements.bannerScrollRightBtn.addEventListener('click', () => {
      elements.nextUpContainer.scrollBy({
        left: 320,
        behavior: 'smooth'
      });
    });
  }
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

async function verifyInputPassword(password) {
  try {
    const encoder = new TextEncoder();
    const passwordKey = await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveBits"]
    );
    const saltBytes = encoder.encode(REFEREE_PASSWORD_SALT);
    const derivedBits = await crypto.subtle.deriveBits(
      {
        name: "PBKDF2",
        salt: saltBytes,
        iterations: REFEREE_PASSWORD_ITERATIONS,
        hash: "SHA-256"
      },
      passwordKey,
      256 // length in bits (32 bytes)
    );
    const hashArray = Array.from(new Uint8Array(derivedBits));
    const computedHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return computedHash === REFEREE_PASSWORD_HASH;
  } catch (e) {
    console.error("Error verifying password:", e);
    return false;
  }
}

async function handleRefereeSubmit(e) {
  e.preventDefault();
  const pass = elements.refereePasswordInput.value.trim();
  
  const isValid = await verifyInputPassword(pass);
  if (isValid) {
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

function updateRefereeUI() {
  const icon = elements.refereeLoginBtn.querySelector('i');
  if (isReferee) {
    elements.refereeLoginBtn.classList.add('active');
    elements.refereeLoginBtn.style.color = '#10b981'; // Green
    elements.refereeLoginBtn.title = "Panel sędziego (odblokowany)";
    icon.className = 'fa-solid fa-lock-open';
    elements.refereeBtnText.textContent = "Sędzia: Zalogowany";
    
    // Show referee backup actions
    if (elements.refereeBackupsActions) {
      elements.refereeBackupsActions.classList.remove('hidden');
    }
  } else {
    elements.refereeLoginBtn.classList.remove('active');
    elements.refereeLoginBtn.style.color = '';
    elements.refereeLoginBtn.title = "Panel sędziego (zablokowany)";
    icon.className = 'fa-solid fa-lock';
    elements.refereeBtnText.textContent = "Sędzia";
    
    // Hide referee backup actions
    if (elements.refereeBackupsActions) {
      elements.refereeBackupsActions.classList.add('hidden');
    }
  }
  
  // Re-render backups list to enable/disable restore and delete buttons appropriately
  if (typeof renderBackupsList === 'function') {
    renderBackupsList();
  }
}

function triggerReset() {
  if (confirm("Czy na pewno chcesz zresetować wszystkie wyniki do wartości początkowych na wszystkich urządzeniach?")) {
    resetToDefault();
    pushStateToCloud();
    showToast("Zresetowano dane rozgrywek!");
    
    // Refresh current active views
    lastScrolledActiveId = null;
    renderLiveBanner();
    if (currentActiveTab === 'timeline') renderTimeline();
    else if (currentActiveTab === 'sports') renderSportView(currentActiveSport);
    else if (currentActiveTab === 'class' && currentSelectedClass) selectClass(currentSelectedClass);
  }
}

// ==========================================================================
// RENDERERS: LIVE BANNER
// ==========================================================================

let lastScrolledActiveId = null;

function scrollToActiveMatch(smooth = true, force = false) {
  const container = elements.nextUpContainer;
  if (!container) return;

  const activeCard = container.querySelector('.live-preview-card.active');
  if (activeCard) {
    const matchId = activeCard.getAttribute('data-match-id');
    
    // Only scroll if active match changed, or if forced (e.g. after score change)
    if (!force && lastScrolledActiveId === matchId) {
      return;
    }
    
    const containerWidth = container.clientWidth;
    const cardOffsetLeft = activeCard.offsetLeft;
    const cardWidth = activeCard.clientWidth;
    
    const scrollTarget = cardOffsetLeft - (containerWidth / 2) + (cardWidth / 2);
    container.scrollTo({
      left: scrollTarget,
      behavior: smooth ? 'smooth' : 'auto'
    });
    
    lastScrolledActiveId = matchId;
  } else {
    // If all matches completed, scroll to the end
    if (force || lastScrolledActiveId !== 'end') {
      const lastCard = container.querySelector('.live-preview-card:last-child');
      if (lastCard) {
        container.scrollTo({
          left: lastCard.offsetLeft,
          behavior: smooth ? 'smooth' : 'auto'
        });
        lastScrolledActiveId = 'end';
      }
    }
  }
}

function renderLiveBanner() {
  const allMatches = [];
  
  Object.keys(tournamentState.sports).forEach(sportId => {
    const sport = tournamentState.sports[sportId];
    sport.matches.forEach(match => {
      allMatches.push({ ...match, sportId, sportName: sport.name });
    });
  });

  if (allMatches.length === 0) {
    elements.nextUpContainer.innerHTML = `<span class="text-muted">Brak meczów do wyświetlenia</span>`;
    return;
  }

  // Sort all matches chronologically by time, then by id for stability
  allMatches.sort((a, b) => {
    const timeCompare = a.time.localeCompare(b.time);
    if (timeCompare !== 0) return timeCompare;
    return a.id.localeCompare(b.id);
  });

  // Calculate the active match time based on current system time
  const now = new Date();
  const nowStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  // 1. First uncompleted match starting now or in the future
  let activeIdx = allMatches.findIndex(m => !m.completed && m.time >= nowStr);
  
  // 2. If none, first uncompleted match (e.g. from the past but still outstanding)
  if (activeIdx === -1) {
    activeIdx = allMatches.findIndex(m => !m.completed);
  }
  
  // 3. If still none (all completed), point to the last match
  if (activeIdx === -1) {
    activeIdx = allMatches.length - 1;
  }

  const activeTime = activeIdx !== -1 ? allMatches[activeIdx].time : null;

  elements.nextUpContainer.innerHTML = allMatches.map(match => {
    const scoreStr = match.completed 
      ? `<span class="score-wrap">${match.team1_score}:${match.team2_score}</span>`
      : `<span class="score-wrap" style="background:rgba(255,255,255,0.05);color:var(--text-secondary)">--</span>`;
    
    // Check if placeholder name
    const t1 = match.team1 || match.placeholder1 || "???";
    const t2 = match.team2 || match.placeholder2 || "???";
    
    const isActive = activeTime && match.time === activeTime && !match.completed;
    
    let activeClass = '';
    let badgeStyle = '';
    
    if (isActive) {
      activeClass = ' active';
      const isLive = match.time <= nowStr;
      const badgeText = isLive ? 'NA ŻYWO' : 'NASTĘPNY';
      const badgeColor = isLive ? '#ef4444' : 'var(--primary-color)';
      const badgeBorder = isLive ? 'rgba(239, 68, 68, 0.5)' : 'var(--border-hover-color)';
      badgeStyle = ` data-badge-text="${badgeText}" style="--badge-color:${badgeColor}; --badge-border:${badgeBorder}; cursor:pointer;"`;
    } else {
      badgeStyle = ` style="cursor:pointer;"`;
    }
    
    return `
      <div class="live-preview-card${activeClass}" data-match-id="${match.id}" onclick="openScoreModal('${match.id}')"${badgeStyle}>
        <span class="sport-indicator ${match.sportId}"></span>
        <span class="text-muted" style="font-size: 11px;">${match.time}</span>
        <span class="teams-wrap">${t1} vs ${t2}</span>
        ${scoreStr}
      </div>
    `;
  }).join('');

  // Automatically scroll to the active match. Use a timeout to ensure element widths/offsets are calculated correctly
  setTimeout(() => {
    scrollToActiveMatch(false, false);
  }, 100);
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

  // Determine rules and advancement details based on sport
  let phaseHtml = '';
  let promotionHtml = '';

  if (sportId === 'volleyball') {
    phaseHtml = 'Rozgrywki w dwóch grupach (A i B), mecze każdy z każdym.';
    promotionHtml = 'Zwycięzcy obu grup (1. miejsca) grają w <strong>Wielkim Finale</strong> o 1. miejsce. Drużyny z drugich miejsc z obu grup grają w <strong>Małym Finale</strong> o 3. miejsce.';
  } else if (sportId === 'soccer') {
    phaseHtml = 'Jedna wspólna tabela (system każdy z każdym).';
    promotionHtml = 'Dwie pierwsze drużyny z tabeli grają w <strong>Wielkim Finale</strong> o 1. miejsce. Drużyny z miejsc 3. i 4. grają w <strong>Małym Finale</strong> o 3. miejsce.';
  } else if (sportId === 'basketball') {
    phaseHtml = 'Jedna wspólna tabela (system każdy z każdym).';
    promotionHtml = 'Brak fazy pucharowej. Końcowa tabela po fazie grupowej wyłania bezpośrednich zwycięzców turnieju (miejsca 1-4).';
  } else {
    phaseHtml = 'System kołowy (każdy z każdym).';
    promotionHtml = 'Zwycięzcy grup awansują do meczów finałowych.';
  }

  // Render Layout
  let sidebarHtml = `
    <div class="glass-card rules-card">
      <h3><i class="fa-solid fa-circle-info text-highlight"></i> Zasady rozgrywek</h3>
      <ul class="rules-list">
        <li><strong>Dyscyplina:</strong> ${sport.name}</li>
        <li><strong>Czas trwania meczu:</strong> ${sport.rules}</li>
        <li><strong>Faza grupowa:</strong> ${phaseHtml}</li>
        <li><strong>Finały i awanse:</strong> ${promotionHtml}</li>
      </ul>
    </div>
  `;

  // Render Group Tables
  const groupsHtml = Object.keys(sport.groups).map(groupName => {
    const standings = sport.standings[groupName];
    const rowsHtml = standings.map((teamData, index) => {
      const isQualified = sportId !== 'basketball' && index < 2; // top 2 go to finals (except for basketball which has no finals)
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

  const bracketHtml = finalsMatches.length > 0 ? `
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
  ` : '';

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
  `;  // Get final standings
  const finalStandings = getFinalStandings(sportId);

  const finalStandingsHtml = `
    <div class="glass-card final-classification-card" style="padding: 24px;">
      <h3 class="bracket-title"><i class="fa-solid fa-ranking-star text-highlight"></i> Klasyfikacja Końcowa</h3>
      <div class="table-wrapper">
        <table class="standings-table final-standings-table">
          <thead>
            <tr>
              <th style="text-align:center; width: 60px;">M-ce</th>
              <th>Klasa</th>
              <th>Status / Etap</th>
              <th>Mecze (Grupa)</th>
              <th>Z</th>
              ${sportId === 'soccer' ? '<th>R</th>' : ''}
              <th>P</th>
              <th>Bilans (Grupa)</th>
              <th>Pkt (Grupa)</th>
            </tr>
          </thead>
          <tbody>
            ${finalStandings.map(row => {
              let medalIcon = '';
              if (row.rank === 1 && (row.status === 'Mistrz' || row.status === '1. miejsce')) {
                medalIcon = '<i class="fa-solid fa-medal" style="color: #eab308; font-size: 18px; margin-right: 6px;"></i>';
              } else if (row.rank === 2 && (row.status === 'Wicemistrz' || row.status === '2. miejsce')) {
                medalIcon = '<i class="fa-solid fa-medal" style="color: #cbd5e1; font-size: 18px; margin-right: 6px;"></i>';
              } else if (row.rank === 3 && (row.status === '3. miejsce' || row.status === '3. miejsce (w grze)')) {
                medalIcon = '<i class="fa-solid fa-medal" style="color: #cd7f32; font-size: 18px; margin-right: 6px;"></i>';
              }
              
              let statusClass = 'muted';
              let statusLabel = row.status;
              if (row.status === 'Mistrz') {
                statusClass = 'gold';
                statusLabel = 'Mistrz 🏆';
              } else if (row.status === 'Wicemistrz') {
                statusClass = 'silver';
                statusLabel = 'Wicemistrz 🥈';
              } else if (row.status === '3. miejsce') {
                statusClass = 'bronze';
                statusLabel = '3. miejsce 🥉';
              } else if (row.status === '4. miejsce') {
                statusClass = 'gray';
                statusLabel = '4. miejsce';
              } else if (row.status === '1. miejsce') {
                statusClass = 'gold';
                statusLabel = '1. miejsce';
              } else if (row.status === '2. miejsce') {
                statusClass = 'silver';
                statusLabel = '2. miejsce';
              } else if (row.status === '3. miejsce (w grze)') {
                statusClass = 'bronze';
                statusLabel = '3. miejsce';
              } else if (row.status === '4. miejsce (w grze)') {
                statusClass = 'gray';
                statusLabel = '4. miejsce';
              } else if (row.status === 'Finał') {
                statusClass = 'info';
                statusLabel = 'Finał (w grze)';
              } else if (row.status === 'Mecz o 3. miejsce') {
                statusClass = 'info';
                statusLabel = 'Mecz o 3. m-ce (w grze)';
              } else if (row.status === 'Faza grupowa') {
                statusClass = 'muted';
                statusLabel = 'Faza grupowa';
              }

              const scoreDiff = row.scored - row.conceded;
              const scoreDiffStr = scoreDiff > 0 ? `+${scoreDiff}` : scoreDiff;
              const drawCol = sportId === 'soccer' ? `<td>${row.draws}</td>` : '';

              return `
                <tr>
                  <td class="rank-col" style="text-align:center;">
                    ${medalIcon ? medalIcon : row.rank}
                  </td>
                  <td class="team-col">${row.team}</td>
                  <td>
                    <span class="badge-status ${statusClass}">${statusLabel}</span>
                  </td>
                  <td>${row.played}</td>
                  <td>${row.wins}</td>
                  ${drawCol}
                  <td>${row.losses}</td>
                  <td>${row.scored}:${row.conceded} (${scoreDiffStr})</td>
                  <td style="font-weight:700; color:var(--primary-color);">${row.points}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
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
    ${finalStandingsHtml}
  `;
}

// Helper to check if a team is a real team (and not a placeholder) in a sport
function isRealTeamInSport(sport, teamName) {
  if (!teamName) return false;
  return Object.values(sport.groups).some(groupTeams => groupTeams.includes(teamName));
}

// Helper to get overall final standings
function getFinalStandings(sportId) {
  const sport = tournamentState.sports[sportId];
  if (!sport || !sport.standings) return [];

  // Gather all group stage statistics
  const allTeams = [];
  Object.keys(sport.groups).forEach(groupName => {
    const groupStandings = sport.standings[groupName] || [];
    groupStandings.forEach(teamData => {
      allTeams.push({
        ...teamData,
        group: groupName
      });
    });
  });

  // Sort initially by group stage statistics
  allTeams.sort((a, b) => {
    // 1. Points
    if (b.points !== a.points) return b.points - a.points;
    
    // 2. Score Difference (scored - conceded)
    const diffA = a.scored - a.conceded;
    const diffB = b.scored - b.conceded;
    if (diffB !== diffA) return diffB - diffA;
    
    // 3. Scored
    if (b.scored !== a.scored) return b.scored - a.scored;
    
    // 4. Alphabetical
    return a.team.localeCompare(b.team);
  });

  const hasFinalsMatches = sport.matches.some(m => m.group === 'Finały');
  if (!hasFinalsMatches) {
    const allGroupMatchesCompleted = sport.matches.every(m => m.completed);
    const rankedList = allTeams.map((t, idx) => {
      let status = 'Faza grupowa';
      if (allGroupMatchesCompleted) {
        if (idx === 0) status = 'Mistrz';
        else if (idx === 1) status = 'Wicemistrz';
        else if (idx === 2) status = '3. miejsce';
        else if (idx === 3) status = '4. miejsce';
      } else {
        if (idx === 0) status = '1. miejsce';
        else if (idx === 1) status = '2. miejsce';
        else if (idx === 2) status = '3. miejsce (w grze)';
        else if (idx === 3) status = '4. miejsce (w grze)';
        else status = `${idx + 1}. miejsce (w grze)`;
      }
      return { team: t.team, status };
    });

    return rankedList.map((item, idx) => {
      const stats = allTeams.find(t => t.team === item.team) || {
        played: 0, wins: 0, draws: 0, losses: 0, scored: 0, conceded: 0, points: 0
      };
      return {
        rank: idx + 1,
        team: item.team,
        status: item.status,
        ...stats
      };
    });
  }

  // Find finals matches
  const finalMatch = sport.matches.find(m => m.group === 'Finały' && (m.stage.includes('Finał') || m.stage.includes('1-2') || m.stage.includes('m-ce 1')));
  const thirdMatch = sport.matches.find(m => m.group === 'Finały' && (m.stage.includes('3. miejsce') || m.stage.includes('m-ce 3')));

  let p1 = null, p2 = null, p3 = null, p4 = null;
  const finalTeams = new Set();

  const isRealTeam = (teamName) => teamName && allTeams.some(t => t.team === teamName);

  // Check Final Match
  if (finalMatch) {
    const isT1Real = isRealTeam(finalMatch.team1);
    const isT2Real = isRealTeam(finalMatch.team2);
    if (finalMatch.completed) {
      const s1 = Number(finalMatch.team1_score);
      const s2 = Number(finalMatch.team2_score);
      if (s1 > s2) {
        p1 = finalMatch.team1;
        p2 = finalMatch.team2;
      } else {
        p1 = finalMatch.team2;
        p2 = finalMatch.team1;
      }
      finalTeams.add(finalMatch.team1);
      finalTeams.add(finalMatch.team2);
    } else if (isT1Real && isT2Real) {
      const idx1 = allTeams.findIndex(t => t.team === finalMatch.team1);
      const idx2 = allTeams.findIndex(t => t.team === finalMatch.team2);
      if (idx1 < idx2) {
        p1 = finalMatch.team1;
        p2 = finalMatch.team2;
      } else {
        p1 = finalMatch.team2;
        p2 = finalMatch.team1;
      }
      finalTeams.add(finalMatch.team1);
      finalTeams.add(finalMatch.team2);
    }
  }

  // Check 3rd Place Match
  if (thirdMatch) {
    const isT1Real = isRealTeam(thirdMatch.team1);
    const isT2Real = isRealTeam(thirdMatch.team2);
    if (thirdMatch.completed) {
      const s1 = Number(thirdMatch.team1_score);
      const s2 = Number(thirdMatch.team2_score);
      if (s1 > s2) {
        p3 = thirdMatch.team1;
        p4 = thirdMatch.team2;
      } else {
        p3 = thirdMatch.team2;
        p4 = thirdMatch.team1;
      }
      finalTeams.add(thirdMatch.team1);
      finalTeams.add(thirdMatch.team2);
    } else if (isT1Real && isT2Real) {
      const idx1 = allTeams.findIndex(t => t.team === thirdMatch.team1);
      const idx2 = allTeams.findIndex(t => t.team === thirdMatch.team2);
      if (idx1 < idx2) {
        p3 = thirdMatch.team1;
        p4 = thirdMatch.team2;
      } else {
        p3 = thirdMatch.team2;
        p4 = thirdMatch.team1;
      }
      finalTeams.add(thirdMatch.team1);
      finalTeams.add(thirdMatch.team2);
    }
  }

  // Get remaining teams in their group stage sort order
  const remaining = allTeams.filter(t => !finalTeams.has(t.team));

  const rankedList = [];
  if (p1) rankedList.push({ team: p1, status: finalMatch.completed ? 'Mistrz' : 'Finał' });
  if (p2) rankedList.push({ team: p2, status: finalMatch.completed ? 'Wicemistrz' : 'Finał' });
  if (p3) rankedList.push({ team: p3, status: thirdMatch.completed ? '3. miejsce' : 'Mecz o 3. miejsce' });
  if (p4) rankedList.push({ team: p4, status: thirdMatch.completed ? '4. miejsce' : 'Mecz o 3. miejsce' });

  remaining.forEach(t => {
    rankedList.push({ team: t.team, status: 'Faza grupowa' });
  });

  // Map each ranked team to their complete stats
  return rankedList.map((item, idx) => {
    const stats = allTeams.find(t => t.team === item.team) || {
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      scored: 0,
      conceded: 0,
      points: 0
    };
    return {
      rank: idx + 1,
      team: item.team,
      status: item.status,
      ...stats
    };
  });
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

    // Find team data in any group's standings
    let team1Data = null;
    let team2Data = null;
    Object.keys(sport.standings).forEach(gName => {
      const tData1 = sport.standings[gName].find(t => t.team === t1);
      if (tData1) team1Data = tData1;
      const tData2 = sport.standings[gName].find(t => t.team === t2);
      if (tData2) team2Data = tData2;
    });

    if (!team1Data && !team2Data) return;

    const s1 = Number(match.team1_score);
    const s2 = Number(match.team2_score);

    // Update played and scores
    if (team1Data) {
      team1Data.played += 1;
      team1Data.scored += s1;
      team1Data.conceded += s2;
      if (s1 > s2) {
        team1Data.wins += 1;
        team1Data.points += sportId === 'soccer' ? 3 : 2; // soccer: 3 for win, others: 2
      } else if (s2 > s1) {
        team1Data.losses += 1;
      } else {
        team1Data.draws += 1;
        team1Data.points += 1;
      }
    }

    if (team2Data) {
      team2Data.played += 1;
      team2Data.scored += s2;
      team2Data.conceded += s1;
      if (s2 > s1) {
        team2Data.wins += 1;
        team2Data.points += sportId === 'soccer' ? 3 : 2;
      } else if (s1 > s2) {
        team2Data.losses += 1;
      } else {
        team2Data.draws += 1;
        team2Data.points += 1;
      }
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
      if (match.group === 'Finały') {
        const needsSeeding = !match.completed || !isRealTeamInSport(sport, match.team1) || !isRealTeamInSport(sport, match.team2);
        if (needsSeeding) {
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
      }
    });
  } else if (groupAStandings) {
    const firstA = groupAStandings[0].team;
    const secondA = groupAStandings.length > 1 ? groupAStandings[1].team : "???";
    const thirdA = groupAStandings.length > 2 ? groupAStandings[2].team : "???";
    const fourthA = groupAStandings.length > 3 ? groupAStandings[3].team : "???";

    // Seeding final matches for single group
    sport.matches.forEach(match => {
      if (match.group === 'Finały' && !match.completed) {
        if (match.stage.includes('3. miejsce') || match.stage.includes('m-ce 3')) {
          match.team1 = thirdA;
          match.team2 = fourthA;
        } else if (match.stage.includes('Finał') || match.stage.includes('1-2') || match.stage.includes('m-ce 1')) {
          match.team1 = firstA;
          match.team2 = secondA;
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
  lastScrolledActiveId = null;
  renderLiveBanner();
  if (currentActiveTab === 'timeline') renderTimeline();
  else if (currentActiveTab === 'sports') renderSportView(currentActiveSport);
  else if (currentActiveTab === 'class' && currentSelectedClass) selectClass(currentSelectedClass);
}

// ==========================================================================
// CLOUD SYNCHRONIZATION (Base64 + keyvalue.immanuel.co)
// ==========================================================================

const SPORT_MAP = {
  'volleyball': 'v',
  'basketball': 'b',
  'soccer': 's'
};
const SPORT_MAP_REV = {
  'v': 'volleyball',
  'b': 'basketball',
  's': 'soccer'
};

function compressResults(results) {
  const compressed = {};
  for (const [matchId, score] of Object.entries(results)) {
    const parts = matchId.split('_match_');
    if (parts.length === 2) {
      const sportAbbr = SPORT_MAP[parts[0]] || parts[0];
      compressed[`${sportAbbr}${parts[1]}`] = score;
    } else {
      compressed[matchId] = score;
    }
  }
  return compressed;
}

function decompressResults(compressed) {
  const decompressed = {};
  for (const [key, score] of Object.entries(compressed)) {
    const match = key.match(/^([vbs])(\d+)$/);
    if (match) {
      const sportId = SPORT_MAP_REV[match[1]];
      decompressed[`${sportId}_match_${match[2]}`] = score;
    } else {
      decompressed[key] = score;
    }
  }
  return decompressed;
}

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
    const payload = {
      r: compressResults(results),
      t: tournamentState.resetTime || 0
    };
    const jsonStr = JSON.stringify(payload);
    // URL-safe Base64 encoding
    const base64 = btoa(unescape(encodeURIComponent(jsonStr)))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, ''); // strip padding

    // Use query parameter to bypass IIS path segment length limit (260 characters)
    const url = `${SYNC_URL}/UpdateValue/${APP_KEY}/results?value=${base64}`;
    
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
      const cloudData = JSON.parse(jsonStr);

      let cloudResults = {};
      let cloudResetTime = 0;

      if (cloudData && cloudData.r !== undefined) {
        cloudResults = decompressResults(cloudData.r);
        cloudResetTime = cloudData.t || 0;
      } else {
        // Fallback for old format
        cloudResults = cloudData || {};
        cloudResetTime = 0;
      }

      // Check for remote database reset
      if (cloudResetTime > (tournamentState.resetTime || 0)) {
        console.log("Remote database reset detected, resetting local state...");
        // Do a clean reset to default template
        tournamentState = JSON.parse(JSON.stringify(SCHEDULE_DATA));
        Object.keys(tournamentState.sports).forEach(sportId => {
          tournamentState.sports[sportId].matches.forEach((match, idx) => {
            match.id = `${sportId}_match_${idx}`;
            match.team1_score = null;
            match.team2_score = null;
            match.completed = false;
          });
        });
        tournamentState.resetTime = cloudResetTime;
        saveState();
      }

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
          }
          // Do NOT wipe local completed matches if they are not in the cloud results,
          // since a local change may simply be ahead of the cloud push/pull sync.
        });
      });

      if (hasChanges || cloudResetTime > (tournamentState.resetTime || 0)) {
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

// ==========================================================================
// BACKUP & SNAPSHOT LOGIC
// ==========================================================================

const AUTO_BACKUP_INTERVAL = 15 * 60 * 1000; // 15 minutes in ms
const MAX_BACKUPS = 50; // Limit to 50 backups to protect localStorage size

function getBackups() {
  const data = localStorage.getItem('prezentki_sport_day_2025_backups');
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch (e) {
    console.error("Error parsing backups:", e);
    return [];
  }
}

function saveBackups(backups) {
  localStorage.setItem('prezentki_sport_day_2025_backups', JSON.stringify(backups));
}

function countCompletedMatches(state) {
  let count = 0;
  if (state && state.sports) {
    Object.keys(state.sports).forEach(sportId => {
      const sport = state.sports[sportId];
      if (sport.matches) {
        sport.matches.forEach(m => {
          if (m.completed) count++;
        });
      }
    });
  }
  return count;
}

function createBackup(type = 'auto') {
  const backups = getBackups();
  const now = new Date();
  
  const pad = (num) => String(num).padStart(2, '0');
  const timeStr = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;
  const dateStr = `${pad(now.getDate())}.${pad(now.getMonth() + 1)}.${now.getFullYear()}`;
  
  const newBackup = {
    id: `backup_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
    timestamp: Date.now(),
    timeStr: timeStr,
    dateStr: dateStr,
    type: type,
    state: JSON.parse(JSON.stringify(tournamentState)),
    matchCount: countCompletedMatches(tournamentState)
  };
  
  // Insert at beginning (newest first)
  backups.unshift(newBackup);
  
  // Enforce size limit
  if (backups.length > MAX_BACKUPS) {
    backups.length = MAX_BACKUPS;
  }
  
  saveBackups(backups);
  renderBackupsList();
  console.log(`${type === 'auto' ? 'Automatic' : 'Manual'} backup created.`);
}

function checkAndCreateAutoBackup() {
  const backups = getBackups();
  const now = Date.now();
  
  const autoBackups = backups.filter(b => b.type === 'auto');
  const lastAuto = autoBackups.length > 0 ? autoBackups[0] : null;
  
  if (!lastAuto || (now - lastAuto.timestamp >= AUTO_BACKUP_INTERVAL)) {
    // Check if the current state differs from the last backup
    const currentStateStr = JSON.stringify(tournamentState);
    const lastStateStr = lastAuto ? JSON.stringify(lastAuto.state) : "";
    
    if (currentStateStr !== lastStateStr) {
      createBackup('auto');
    }
  }
}

function restoreBackup(backupId) {
  const backups = getBackups();
  const backup = backups.find(b => b.id === backupId);
  if (!backup) {
    alert("Nie znaleziono wybranej kopii zapasowej!");
    return;
  }
  
  const desc = `${backup.type === 'auto' ? 'Automatyczny' : 'Ręczny'} zapis z ${backup.dateStr} o ${backup.timeStr}`;
  if (!confirm(`Czy na pewno chcesz przywrócić stan z: ${desc}?\nBieżące wyniki zostaną zastąpione!`)) {
    return;
  }
  
  // Restore state
  tournamentState = JSON.parse(JSON.stringify(backup.state));
  
  // Save locally and push to cloud
  saveState();
  pushStateToCloud();
  
  // Close backups modal
  closeBackupsModal();
  
  // Recompute standings
  Object.keys(tournamentState.sports).forEach(sportId => {
    updateStandingsAndSeeding(sportId);
  });
  
  // Refresh views
  lastScrolledActiveId = null;
  renderLiveBanner();
  if (currentActiveTab === 'timeline') renderTimeline();
  else if (currentActiveTab === 'sports') renderSportView(currentActiveSport);
  else if (currentActiveTab === 'class' && currentSelectedClass) selectClass(currentSelectedClass);
  
  showToast("Przywrócono stan z kopii zapasowej! 🔄");
}

function deleteBackup(backupId) {
  let backups = getBackups();
  const backup = backups.find(b => b.id === backupId);
  if (!backup) return;
  
  const desc = `${backup.type === 'auto' ? 'Automatyczny' : 'Ręczny'} zapis z ${backup.dateStr} o ${backup.timeStr}`;
  if (!confirm(`Czy na pewno chcesz usunąć tę kopię: ${desc}?`)) {
    return;
  }
  
  backups = backups.filter(b => b.id !== backupId);
  saveBackups(backups);
  renderBackupsList();
  showToast("Usunięto punkt przywracania.");
}

function renderBackupsList() {
  const backups = getBackups();
  const container = elements.backupsListContainer;
  
  if (!container) return;
  
  if (backups.length === 0) {
    container.innerHTML = `
      <div class="backups-empty">
        <i class="fa-solid fa-clock-rotate-left"></i>
        <p>Brak zapisanych punktów przywracania.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = backups.map(b => {
    const isAuto = b.type === 'auto';
    const iconClass = isAuto ? 'fa-clock auto' : 'fa-user manual';
    const titleText = isAuto ? 'Automatyczny zapis' : 'Ręczny zapis';
    
    // Disable buttons if not referee
    const disabledAttr = isReferee ? '' : 'disabled';
    const disabledTitle = isReferee ? '' : ' title="Zaloguj się jako sędzia, aby przywrócić/usunąć"';
    
    return `
      <div class="backup-item">
        <div class="backup-info">
          <div class="backup-icon ${b.type}">
            <i class="fa-solid ${iconClass}"></i>
          </div>
          <div class="backup-details">
            <span class="backup-title">${titleText}</span>
            <span class="backup-meta">${b.dateStr} o godz. ${b.timeStr} • Rozegrano meczów: ${b.matchCount}</span>
          </div>
        </div>
        <div class="backup-actions">
          <button class="btn-small-icon btn-restore" onclick="restoreBackup('${b.id}')" ${disabledAttr}${disabledTitle} aria-label="Przywróć tę kopię">
            <i class="fa-solid fa-arrow-rotate-left"></i>
          </button>
          <button class="btn-small-icon btn-delete" onclick="deleteBackup('${b.id}')" ${disabledAttr}${disabledTitle} aria-label="Usuń tę kopię">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      </div>
    `;
  }).join('');
}

function openBackupsModal() {
  renderBackupsList();
  elements.backupsModal.classList.remove('hidden');
}

function closeBackupsModal() {
  elements.backupsModal.classList.add('hidden');
}

// Expose backup functions to window for global access
window.restoreBackup = restoreBackup;
window.deleteBackup = deleteBackup;
window.checkAndCreateAutoBackup = checkAndCreateAutoBackup;

// Start Application
window.addEventListener('DOMContentLoaded', initApp);
