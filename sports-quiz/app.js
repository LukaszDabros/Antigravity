/**
 * Polski Quiz Sportowy - Logika Aplikacji
 * Obsługa trybu Solo oraz Rywalizacji Drużynowej z systemem rundowym
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // STAN APLIKACJI (STATE)
  // ==========================================
  let selectedQuestions = {}; // Mapa: { [questionId]: { answered: true, correct: true/false, chosenOption: 0-3, timeout: bool } }
  let currentQuestionId = null;
  let activeFilters = {
    category: 'all',
    status: 'all'
  };
  let searchQuery = '';

  // Timer State
  let timerLimit = 30; // Domyślny limit (sekundy)
  let timerInterval = null;
  let timeLeft = 30;

  // Tryb gry i Drużyny
  let gameStarted = false;
  let gameMode = 'solo'; // 'solo' lub 'multi'
  let teams = []; // Tablica obiektów: { id, name, score, answeredCount, color }
  let activeTeamIndex = 0;

  // System rundowy
  let questionsPerRound = 10;
  let roundQuestionsAnswered = 0;
  let roundScores = 0;
  let pendingTeamIndex = null; // Dla ręcznej zmiany tury

  // Aktywne wylosowane pytania (100 z 150)
  let activeQuestionIds = [];
  let questionSet = 'standard'; // 'standard' lub 'kids'
  let tempQuestionSet = 'standard';

  // Stan tymczasowy dla Lobby
  let tempGameMode = 'solo';
  let tempTeams = [
    { name: 'Drużyna A' },
    { name: 'Drużyna B' }
  ];

  const TEAM_COLORS = [
    '#06b6d4', // Cyan
    '#a855f7', // Purple
    '#10b981', // Emerald
    '#f43f5e', // Rose
    '#f59e0b', // Amber
    '#6366f1', // Indigo
    '#f97316', // Orange
    '#0ea5e9', // Sky
    '#ec4899', // Pink
    '#84cc16'  // Lime
  ];

  // Elementy DOM
  const gridContainer = document.getElementById('questions-grid');
  const noResultsEl = document.getElementById('no-results');
  const searchInput = document.getElementById('search-input');
  const timerSelect = document.getElementById('timer-select');
  const questionSetSelect = document.getElementById('question-set-select');
  const headerTotalQuestions = document.getElementById('header-total-questions');
  const statTotal = document.querySelector('.stat-total');
  
  // Modale systemowe
  const questionModal = document.getElementById('question-modal');
  const resetModal = document.getElementById('reset-modal');
  const modalCloseX = document.getElementById('modal-close-x');
  
  // Elementy Statystyk Solo
  const statsSoloContainer = document.getElementById('stats-solo-container');
  const statAnswered = document.getElementById('stat-answered');
  const statCorrect = document.getElementById('stat-correct');
  const statIncorrect = document.getElementById('stat-incorrect');
  const statRatio = document.getElementById('stat-ratio');
  const progressFill = document.getElementById('progress-fill');

  // Elementy Statystyk Multiplayer
  const statsTeamsWrapper = document.getElementById('stats-teams-wrapper');
  const statsTeamsContainer = document.getElementById('stats-teams-container');
  const btnEndGame = document.getElementById('btn-end-game');

  // Wskaźnik postępu rundy na pulpicie
  const roundActiveTeam = document.getElementById('round-active-team');
  const roundCurrentQuestion = document.getElementById('round-current-question');
  const roundTotalQuestions = document.getElementById('round-total-questions');

  // Elementy Modalu Pytania
  const modalCategory = document.getElementById('modal-category');
  const modalQuestionId = document.getElementById('modal-question-id');
  const modalQuestionText = document.getElementById('modal-question-text');
  const optionsContainer = document.getElementById('options-container');
  const explanationContainer = document.getElementById('explanation-container');
  const explanationIcon = document.getElementById('explanation-icon');
  const explanationStatusText = document.getElementById('explanation-status-text');
  const explanationText = document.getElementById('explanation-text');
  const btnModalClose = document.getElementById('btn-modal-close');

  // Elementy Timera w Modalu
  const modalTimerContainer = document.getElementById('modal-timer-container');
  const modalTimerBar = document.getElementById('modal-timer-bar');
  const modalTimerText = document.getElementById('modal-timer-text');

  // Wskaźnik Aktywnej Tury w Modalu
  const modalActiveTeamRow = document.getElementById('modal-active-team-row');
  const modalActiveTeamName = document.getElementById('modal-active-team-name');

  // Modale Lobby & Podium
  const lobbyModal = document.getElementById('lobby-modal');
  const tabSolo = document.getElementById('tab-solo');
  const tabMulti = document.getElementById('tab-multi');
  const lobbySetupSolo = document.getElementById('lobby-setup-solo');
  const lobbySetupMulti = document.getElementById('lobby-setup-multi');
  const roundQuestionsSelect = document.getElementById('round-questions-select');
  const teamsSetupList = document.getElementById('teams-setup-list');
  const btnAddTeam = document.getElementById('btn-add-team');
  const btnStartGame = document.getElementById('btn-start-game');

  const resultsModal = document.getElementById('results-modal');
  const resultsPodium = document.getElementById('results-podium');
  const resultsTableBody = document.getElementById('results-table-body');
  const btnResultsRestart = document.getElementById('btn-results-restart');

  // Modale Rundowe (Nowe)
  const roundSummaryModal = document.getElementById('round-summary-modal');
  const summaryTeamName = document.getElementById('summary-team-name');
  const summaryRoundScore = document.getElementById('summary-round-score');
  const summaryRoundRatio = document.getElementById('summary-round-ratio');
  const summaryTotalScore = document.getElementById('summary-total-score');
  const btnRoundSummaryNext = document.getElementById('btn-round-summary-next');

  const teamSelectModal = document.getElementById('team-select-modal');
  const teamSelectGrid = document.getElementById('team-select-grid');

  const confirmTeamSwitchModal = document.getElementById('confirm-team-switch-modal');
  const confirmSwitchTeamName = document.getElementById('confirm-switch-team-name');
  const btnConfirmSwitchCancel = document.getElementById('btn-confirm-switch-cancel');
  const btnConfirmSwitchOk = document.getElementById('btn-confirm-switch-ok');

  // ==========================================
  // FUNKCJE POMOCNICZE / TRANSLACJE
  // ==========================================
  const CATEGORY_NAMES = {
    historia: 'Historia',
    przepisy: 'Przepisy Gry',
    wyniki: 'Wyniki i Rekordy',
    olimpijczycy: 'Olimpijczycy',
    ogolne: 'Ogólne'
  };

  // Ładowanie stanu z localStorage
  function loadGameState() {
    const savedStarted = localStorage.getItem('sports_quiz_game_started');
    if (savedStarted) {
      gameStarted = JSON.parse(savedStarted);
    }

    const savedMode = localStorage.getItem('sports_quiz_game_mode');
    if (savedMode) {
      gameMode = savedMode;
    }

    const savedTeams = localStorage.getItem('sports_quiz_teams');
    if (savedTeams) {
      try {
        teams = JSON.parse(savedTeams);
      } catch (e) {
        teams = [];
      }
    }

    const savedActiveIndex = localStorage.getItem('sports_quiz_active_team_index');
    if (savedActiveIndex !== null) {
      activeTeamIndex = parseInt(savedActiveIndex, 10);
    }

    // Odczyt stanów rundowych
    const savedQuestionsPerRound = localStorage.getItem('sports_quiz_questions_per_round');
    if (savedQuestionsPerRound !== null) {
      questionsPerRound = parseInt(savedQuestionsPerRound, 10);
    }
    const savedRoundQuestionsAnswered = localStorage.getItem('sports_quiz_round_questions_answered');
    if (savedRoundQuestionsAnswered !== null) {
      roundQuestionsAnswered = parseInt(savedRoundQuestionsAnswered, 10);
    }
    const savedRoundScores = localStorage.getItem('sports_quiz_round_scores');
    if (savedRoundScores !== null) {
      roundScores = parseInt(savedRoundScores, 10);
    }

    const savedState = localStorage.getItem('sports_quiz_selected');
    if (savedState) {
      try {
        selectedQuestions = JSON.parse(savedState);
      } catch (e) {
        selectedQuestions = {};
      }
    } else {
      selectedQuestions = {};
    }

    // Wczytanie limitu czasu
    const savedTimer = localStorage.getItem('sports_quiz_timer_limit');
    if (savedTimer !== null) {
      timerLimit = parseInt(savedTimer, 10);
      timerSelect.value = timerLimit;
    } else {
      timerLimit = 30; // Domyślnie 30s
      timerSelect.value = 30;
    }

    // Wczytanie wybranego zestawu pytań
    const savedQuestionSet = localStorage.getItem('sports_quiz_question_set');
    if (savedQuestionSet) {
      questionSet = savedQuestionSet;
      tempQuestionSet = savedQuestionSet;
      if (questionSetSelect) {
        questionSetSelect.value = savedQuestionSet;
      }
    } else {
      questionSet = 'standard';
      tempQuestionSet = 'standard';
      if (questionSetSelect) {
        questionSetSelect.value = 'standard';
      }
    }

    // Wczytanie wylosowanych pytań
    const savedActiveIds = localStorage.getItem('sports_quiz_active_question_ids');
    if (savedActiveIds) {
      try {
        activeQuestionIds = JSON.parse(savedActiveIds);
      } catch (e) {
        activeQuestionIds = [];
      }
    }
    
    const expectedLength = questionSet === 'kids' ? 80 : 100;
    if (!activeQuestionIds || activeQuestionIds.length !== expectedLength) {
      generateActiveQuestionIds();
    }
  }

  function getActiveQuestionDatabase() {
    return questionSet === 'kids' ? kidsQuestions : questions;
  }

  // Funkcja generująca nową losową pulę pytań
  function generateActiveQuestionIds() {
    const db = getActiveQuestionDatabase();
    const allIds = db.map(q => q.id);
    for (let i = allIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = allIds[i];
      allIds[i] = allIds[j];
      allIds[j] = temp;
    }
    const limit = questionSet === 'kids' ? 80 : 100;
    activeQuestionIds = allIds.slice(0, limit);
    localStorage.setItem('sports_quiz_active_question_ids', JSON.stringify(activeQuestionIds));
  }

  // Zapisywanie stanu do localStorage
  function saveGameState() {
    localStorage.setItem('sports_quiz_selected', JSON.stringify(selectedQuestions));
    localStorage.setItem('sports_quiz_game_started', JSON.stringify(gameStarted));
    localStorage.setItem('sports_quiz_game_mode', gameMode);
    localStorage.setItem('sports_quiz_teams', JSON.stringify(teams));
    localStorage.setItem('sports_quiz_active_team_index', activeTeamIndex);
    localStorage.setItem('sports_quiz_question_set', questionSet);

    // Zapisz stany rundy
    localStorage.setItem('sports_quiz_questions_per_round', questionsPerRound);
    localStorage.setItem('sports_quiz_round_questions_answered', roundQuestionsAnswered);
    localStorage.setItem('sports_quiz_round_scores', roundScores);

    // Zapisz pulę aktywnych pytań
    localStorage.setItem('sports_quiz_active_question_ids', JSON.stringify(activeQuestionIds));
  }

  // Ustawienie odpowiednich kontenerów w zależności od trybu gry
  function setupUIForMode() {
    if (!gameStarted) {
      lobbyModal.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
      renderLobbyTeams();
      return;
    }

    lobbyModal.classList.add('hidden');
    document.body.style.overflow = '';

    if (gameMode === 'solo') {
      statsSoloContainer.classList.remove('hidden');
      statsTeamsWrapper.classList.add('hidden');
      btnEndGame.classList.add('hidden');
    } else {
      statsSoloContainer.classList.add('hidden');
      statsTeamsWrapper.classList.remove('hidden');
      btnEndGame.classList.remove('hidden');
    }
  }

  // Aktualizacja panelu statystyk (Solo / Multiplayer)
  function updateStats() {
    const totalQuestions = activeQuestionIds.length;
    const answeredKeys = Object.keys(selectedQuestions);
    const answeredCount = answeredKeys.length;

    // Dynamicznie zaktualizuj tekst / 100 lub / 80 w widoku Solo
    if (statTotal) {
      statTotal.textContent = `/ ${totalQuestions}`;
    }
    
    // Dynamicznie zaktualizuj nagłówek i tytuł strony
    if (headerTotalQuestions) {
      headerTotalQuestions.textContent = totalQuestions;
    }
    document.title = `Polski Quiz Sportowy - ${totalQuestions} Pytań`;

    // Dynamicznie zaktualizuj opis resetu w modalu
    const resetConfirmP = document.querySelector('.reset-confirm-content p');
    if (resetConfirmP) {
      resetConfirmP.innerHTML = `Spowoduje to wyzerowanie wyników oraz odblokowanie wszystkich ${totalQuestions} pytań na tablicy. Tego kroku nie można cofnąć.`;
    }
    
    if (gameMode === 'solo') {
      // Logika Solo
      let correctCount = 0;
      let incorrectCount = 0;
      
      answeredKeys.forEach(key => {
        if (selectedQuestions[key].correct) {
          correctCount++;
        } else {
          incorrectCount++;
        }
      });

      const successRatio = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;
      
      statAnswered.textContent = answeredCount;
      statCorrect.textContent = correctCount;
      statIncorrect.textContent = incorrectCount;
      statRatio.textContent = `${successRatio}%`;
      
      const progressPercent = Math.min(100, (answeredCount / totalQuestions) * 100);
      progressFill.style.width = `${progressPercent}%`;
    } else {
      // Logika Rywalizacji Drużynowej
      
      // 1. Wskaźnik rundy na pulpicie
      if (teams.length > 0) {
        const activeTeam = teams[activeTeamIndex];
        roundActiveTeam.textContent = activeTeam.name;
        roundActiveTeam.style.backgroundColor = activeTeam.color;
        roundCurrentQuestion.textContent = roundQuestionsAnswered;
        roundTotalQuestions.textContent = questionsPerRound;
      }

      // 2. Renderowanie kart drużyn
      statsTeamsContainer.innerHTML = '';
      
      teams.forEach((team, idx) => {
        const card = document.createElement('div');
        card.className = 'team-score-card';
        card.setAttribute('data-index', idx);
        
        card.style.borderColor = team.color;
        
        const isActive = idx === activeTeamIndex;
        if (isActive) {
          card.classList.add('active-team');
          card.style.boxShadow = `0 0 14px ${team.color}80`;
        } else {
          card.style.boxShadow = '';
          
          // Umożliwienie ręcznej zmiany drużyny po kliknięciu na jej kartę
          card.addEventListener('click', () => {
            triggerManualTeamSwitch(idx);
          });
        }

        const accuracy = team.answeredCount > 0 ? Math.round((team.score / team.answeredCount) * 100) : 0;

        card.innerHTML = `
          <span class="team-color-indicator" style="color: ${team.color}; background-color: ${team.color}"></span>
          <div class="team-card-info">
            <span class="team-card-name" title="${team.name}">${team.name}</span>
            <div class="team-card-score-row">
              Wynik: <span class="team-card-score-val">${team.score}</span> 
              <span class="team-card-accuracy">(${accuracy}%)</span>
            </div>
          </div>
        `;
        
        statsTeamsContainer.appendChild(card);
      });
    }

    // Automatyczne podsumowanie jeśli wszystkie pytania odpowiedziane
    if (answeredCount >= totalQuestions && gameStarted) {
      showResults();
    }
  }

  // Obsługa ręcznej zmiany tury
  function triggerManualTeamSwitch(index) {
    pendingTeamIndex = index;
    confirmSwitchTeamName.textContent = teams[index].name;
    confirmSwitchTeamName.style.color = teams[index].color;
    confirmTeamSwitchModal.classList.remove('hidden');
  }

  btnConfirmSwitchCancel.addEventListener('click', () => {
    confirmTeamSwitchModal.classList.add('hidden');
    pendingTeamIndex = null;
  });

  btnConfirmSwitchOk.addEventListener('click', () => {
    if (pendingTeamIndex !== null) {
      activeTeamIndex = pendingTeamIndex;
      roundQuestionsAnswered = 0;
      roundScores = 0;
      saveGameState();
      confirmTeamSwitchModal.classList.add('hidden');
      pendingTeamIndex = null;
      updateStats();
      renderGrid();
    }
  });

  // ==========================================
  // RENDEROWANIE LOBBY
  // ==========================================
  function renderLobbyTeams() {
    teamsSetupList.innerHTML = '';
    
    tempTeams.forEach((team, idx) => {
      const color = TEAM_COLORS[idx % TEAM_COLORS.length];
      const row = document.createElement('div');
      row.className = 'team-setup-row';
      
      row.innerHTML = `
        <span class="team-setup-color-dot" style="color: ${color}; background-color: ${color}"></span>
        <input type="text" value="${team.name}" placeholder="Nazwa drużyny ${idx + 1}" data-index="${idx}">
        ${tempTeams.length > 2 ? `
          <button class="btn-delete-team" data-index="${idx}" title="Usuń drużynę">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        ` : ''}
      `;

      // Event listener dla inputu
      row.querySelector('input').addEventListener('input', (e) => {
        const index = parseInt(e.target.getAttribute('data-index'), 10);
        tempTeams[index].name = e.target.value;
      });

      // Event listener dla usuwania
      if (tempTeams.length > 2) {
        row.querySelector('.btn-delete-team').addEventListener('click', (e) => {
          const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
          tempTeams.splice(index, 1);
          renderLobbyTeams();
        });
      }

      teamsSetupList.appendChild(row);
    });
  }

  // Obsługa zakładek w lobby
  tabSolo.addEventListener('click', () => {
    tabSolo.classList.add('active');
    tabMulti.classList.remove('active');
    lobbySetupSolo.classList.remove('hidden');
    lobbySetupMulti.classList.add('hidden');
    tempGameMode = 'solo';
  });

  tabMulti.addEventListener('click', () => {
    tabMulti.classList.add('active');
    tabSolo.classList.remove('active');
    lobbySetupSolo.classList.add('hidden');
    lobbySetupMulti.classList.remove('hidden');
    tempGameMode = 'multi';
  });

  // Dodawanie nowej drużyny
  btnAddTeam.addEventListener('click', () => {
    if (tempTeams.length < 10) {
      tempTeams.push({ name: `Drużyna ${String.fromCharCode(65 + tempTeams.length)}` }); // Drużyna C, D...
      renderLobbyTeams();
      setTimeout(() => {
        teamsSetupList.scrollTop = teamsSetupList.scrollHeight;
      }, 50);
    }
  });

  // Uruchomienie gry z Lobby
  btnStartGame.addEventListener('click', () => {
    gameMode = tempGameMode;
    questionSet = tempQuestionSet;
    gameStarted = true;

    // Wygeneruj nową pulę pytań dla wybranego zestawu
    generateActiveQuestionIds();
    
    if (gameMode === 'multi') {
      teams = tempTeams.map((team, idx) => {
        const finalName = team.name.trim() !== '' ? team.name.trim() : `Drużyna ${idx + 1}`;
        return {
          id: idx,
          name: finalName,
          score: 0,
          answeredCount: 0,
          color: TEAM_COLORS[idx % TEAM_COLORS.length]
        };
      });
      activeTeamIndex = 0;
      questionsPerRound = parseInt(roundQuestionsSelect.value, 10);
      roundQuestionsAnswered = 0;
      roundScores = 0;
    } else {
      teams = [];
      activeTeamIndex = 0;
    }

    saveGameState();
    setupUIForMode();
    updateStats();
    renderGrid();
  });

  // ==========================================
  // RENDEROWANIE GRIDU PYTAŃ
  // ==========================================
  function renderGrid() {
    gridContainer.innerHTML = '';
    
    // Zmapuj wylosowane ID pytań na pełne obiekty pytań, zachowując kolejność wylosowaną w activeQuestionIds
    const db = getActiveQuestionDatabase();
    const activeQuestions = activeQuestionIds.map(id => db.find(q => q.id === id)).filter(q => q !== undefined);
    
    const filteredQuestions = activeQuestions.filter(q => {
      // 1. Filtrowanie wyszukiwarki
      const normalizedQuery = searchQuery.toLowerCase().trim();
      const matchesSearch = normalizedQuery === '' || 
        q.question.toLowerCase().includes(normalizedQuery) ||
        q.options.some(opt => opt.toLowerCase().includes(normalizedQuery));

      // 2. Filtrowanie kategorii
      const matchesCategory = activeFilters.category === 'all' || q.category === activeFilters.category;

      // 3. Filtrowanie trudności (usunięte z UI)
      const matchesDifficulty = true;

      // 4. Filtrowanie statusu
      const isAnswered = !!selectedQuestions[q.id];
      const matchesStatus = activeFilters.status === 'all' || 
        (activeFilters.status === 'available' && !isAnswered) ||
        (activeFilters.status === 'disabled' && isAnswered);

      return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
    });

    if (filteredQuestions.length === 0) {
      noResultsEl.classList.remove('hidden');
    } else {
      noResultsEl.classList.add('hidden');
    }

    filteredQuestions.forEach(q => {
      const card = document.createElement('div');
      card.className = 'q-card';
      card.setAttribute('data-id', q.id);
      card.setAttribute('data-category', q.category);
      
      const isAnswered = selectedQuestions[q.id];
      if (isAnswered) {
        card.classList.add('disabled');
        if (isAnswered.correct) {
          card.classList.add('answered-correct');
        } else {
          card.classList.add('answered-incorrect');
        }
      }

      // Numer na kafelku to jego pozycja w tablicy activeQuestionIds + 1 (zawsze 1-100)
      const displayIndex = activeQuestionIds.indexOf(q.id) + 1;

      card.innerHTML = `
        <span class="q-number">${displayIndex}</span>
        <span class="q-category-dot" title="Kategoria: ${CATEGORY_NAMES[q.category]}"></span>
      `;

      if (!isAnswered) {
        card.addEventListener('click', () => {
          openQuestionModal(q.id);
        });
      }

      gridContainer.appendChild(card);
    });
  }

  // ==========================================
  // OBSŁUGA MODALU ODPOWIEDZI
  // ==========================================
  function openQuestionModal(id) {
    const db = getActiveQuestionDatabase();
    const q = db.find(item => item.id === id);
    if (!q) return;

    currentQuestionId = id;
    
    modalQuestionId.textContent = q.id;
    modalQuestionText.textContent = q.question;
    
    // Kategoria
    modalCategory.textContent = CATEGORY_NAMES[q.category];
    modalCategory.className = 'category-badge'; 
    modalCategory.classList.add(`badge-${q.category}`);

    // Obsługa wskaźnika aktywnej tury w oknie pytania
    if (gameMode === 'multi' && teams.length > 0) {
      modalActiveTeamRow.classList.remove('hidden');
      const activeTeam = teams[activeTeamIndex];
      modalActiveTeamName.textContent = activeTeam.name;
      modalActiveTeamName.style.backgroundColor = activeTeam.color;
      modalActiveTeamName.style.boxShadow = `0 0 10px ${activeTeam.color}`;
      modalActiveTeamName.style.color = '#020617';
    } else {
      modalActiveTeamRow.classList.add('hidden');
    }

    explanationContainer.classList.add('hidden');
    explanationContainer.className = 'explanation-box';
    btnModalClose.classList.add('hidden');

    optionsContainer.innerHTML = '';
    const letters = ['A', 'B', 'C', 'D'];
    
    q.options.forEach((optionText, idx) => {
      const button = document.createElement('button');
      button.className = 'option-btn';
      button.setAttribute('data-index', idx);
      
      button.innerHTML = `
        <span>${optionText}</span>
        <span class="option-badge">${letters[idx]}</span>
      `;

      button.addEventListener('click', () => {
        handleAnswerSelection(idx, q);
      });

      optionsContainer.appendChild(button);
    });

    resetAndStartTimer(q);

    questionModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  // Licznik czasu
  function resetAndStartTimer(questionObj) {
    clearInterval(timerInterval);
    
    if (timerLimit > 0) {
      modalTimerContainer.classList.remove('hidden');
      modalTimerText.classList.remove('hidden');
      
      modalCloseX.classList.add('hidden');
      
      timeLeft = timerLimit;
      modalTimerText.textContent = `${timeLeft}s`;
      modalTimerText.className = 'timer-text-badge';
      modalTimerBar.className = 'modal-timer-bar';
      modalTimerBar.style.transform = 'scaleX(1)';
      
      let startTime = Date.now();
      const endTime = startTime + (timerLimit * 1000);
      
      timerInterval = setInterval(() => {
        const now = Date.now();
        const remainingMs = Math.max(0, endTime - now);
        timeLeft = Math.ceil(remainingMs / 1000);
        
        modalTimerText.textContent = `${timeLeft}s`;
        
        const ratio = remainingMs / (timerLimit * 1000);
        modalTimerBar.style.transform = `scaleX(${ratio})`;
        
        if (timeLeft <= 5) {
          modalTimerText.className = 'timer-text-badge danger';
          modalTimerBar.className = 'modal-timer-bar danger';
        } else if (timeLeft <= timerLimit * 0.4) {
          modalTimerText.className = 'timer-text-badge warning';
          modalTimerBar.className = 'modal-timer-bar warning';
        }
        
        if (remainingMs <= 0) {
          clearInterval(timerInterval);
          handleTimeout(questionObj);
        }
      }, 100);
    } else {
      modalTimerContainer.classList.add('hidden');
      modalTimerText.classList.add('hidden');
      modalCloseX.classList.remove('hidden');
    }
  }

  // Upływ limitu czasu
  function handleTimeout(questionObj) {
    modalCloseX.classList.remove('hidden');
    
    // Zapisz stan jako błędny
    selectedQuestions[questionObj.id] = {
      answered: true,
      correct: false,
      chosenOption: null,
      timeout: true
    };

    // Obsługa rywalizacji
    if (gameMode === 'multi') {
      teams[activeTeamIndex].answeredCount++;
      roundQuestionsAnswered++;
    }
    saveGameState();

    const optionButtons = optionsContainer.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, idx) => {
      btn.classList.add('answered');
      if (idx === questionObj.correct) {
        btn.classList.add('correct');
      } else {
        btn.classList.add('unselected');
      }
    });

    const cardEl = document.querySelector(`.q-card[data-id="${questionObj.id}"]`);
    if (cardEl) {
      cardEl.classList.add('disabled');
      cardEl.classList.add('answered-incorrect');
      const newCardEl = cardEl.cloneNode(true);
      cardEl.parentNode.replaceChild(newCardEl, cardEl);
    }

    explanationContainer.classList.remove('hidden');
    explanationContainer.classList.add('incorrect-alert');
    explanationStatusText.textContent = 'Czas minął!';
    explanationText.innerHTML = `<strong>Czas na odpowiedź minął.</strong> ${questionObj.explanation}`;
    
    explanationIcon.innerHTML = `
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    `;
    explanationIcon.style.stroke = 'var(--danger)';

    btnModalClose.classList.remove('hidden');
    updateStats();
  }

  // Wybór odpowiedzi przez użytkownika
  function handleAnswerSelection(selectedIdx, questionObj) {
    clearInterval(timerInterval);
    modalCloseX.classList.remove('hidden');

    const isCorrect = selectedIdx === questionObj.correct;
    
    selectedQuestions[questionObj.id] = {
      answered: true,
      correct: isCorrect,
      chosenOption: selectedIdx
    };

    // Obsługa rywalizacji multiplayer
    if (gameMode === 'multi') {
      teams[activeTeamIndex].answeredCount++;
      roundQuestionsAnswered++;
      if (isCorrect) {
        teams[activeTeamIndex].score++;
        roundScores++;
      }
    }
    saveGameState();
    
    const cardEl = document.querySelector(`.q-card[data-id="${questionObj.id}"]`);
    if (cardEl) {
      cardEl.classList.add('disabled');
      cardEl.classList.add(isCorrect ? 'answered-correct' : 'answered-incorrect');
      const newCardEl = cardEl.cloneNode(true);
      cardEl.parentNode.replaceChild(newCardEl, cardEl);
    }

    const optionButtons = optionsContainer.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, idx) => {
      btn.classList.add('answered');
      
      if (idx === questionObj.correct) {
        btn.classList.add('correct');
      } else if (idx === selectedIdx) {
        btn.classList.add('incorrect');
      } else {
        btn.classList.add('unselected');
      }
    });

    explanationContainer.classList.remove('hidden');
    explanationText.textContent = questionObj.explanation;

    if (isCorrect) {
      explanationContainer.classList.add('correct-alert');
      explanationStatusText.textContent = 'Poprawna odpowiedź!';
      explanationIcon.innerHTML = `
        <polyline points="20 6 9 17 4 12"></polyline>
      `;
      explanationIcon.style.stroke = 'var(--success)';
    } else {
      explanationContainer.classList.add('incorrect-alert');
      const correctLetter = ['A', 'B', 'C', 'D'][questionObj.correct];
      explanationStatusText.textContent = `Błędna odpowiedź! Prawidłowa to: ${correctLetter}`;
      explanationIcon.innerHTML = `
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      `;
      explanationIcon.style.stroke = 'var(--danger)';
    }

    btnModalClose.classList.remove('hidden');
    updateStats();
  }

  // Zamknięcie okna pytania
  function closeQuestionModal() {
    clearInterval(timerInterval);
    questionModal.classList.add('hidden');
    document.body.style.overflow = '';
    
    // Sprawdzenie czy to tryb drużynowy i czy tura/runda została ukończona
    if (gameMode === 'multi' && gameStarted && currentQuestionId !== null) {
      if (selectedQuestions[currentQuestionId]) {
        // Pytanie zostało odpowiedziane w tej turze
        if (roundQuestionsAnswered >= questionsPerRound) {
          // Koniec serii pytań dla drużyny -> Pokaż Podsumowanie Rundy!
          showRoundSummary();
          currentQuestionId = null;
          return;
        }
      }
    }

    currentQuestionId = null;
    saveGameState();
    updateStats();
    renderGrid();
  }

  // ==========================================
  // PODSUMOWANIE RUNDY & WYBÓR RĘCZNY DRUŻYNY
  // ==========================================
  function showRoundSummary() {
    const activeTeam = teams[activeTeamIndex];
    summaryTeamName.textContent = activeTeam.name;
    summaryTeamName.style.color = activeTeam.color;
    
    summaryRoundScore.textContent = `${roundScores} / ${questionsPerRound}`;
    const roundRatio = Math.round((roundScores / questionsPerRound) * 100);
    summaryRoundRatio.textContent = `${roundRatio}%`;
    summaryTotalScore.textContent = `${activeTeam.score} pkt`;

    roundSummaryModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  btnRoundSummaryNext.addEventListener('click', () => {
    roundSummaryModal.classList.add('hidden');
    openTeamSelector();
  });

  // Otwarcie okna ręcznego wyboru drużyny do kolejnej rundy
  function openTeamSelector() {
    teamSelectGrid.innerHTML = '';
    
    teams.forEach((team, idx) => {
      const btn = document.createElement('button');
      btn.className = 'team-select-btn';
      btn.innerHTML = `
        <span class="team-select-btn-dot" style="color: ${team.color}; background-color: ${team.color}"></span>
        <span>${team.name} (Suma: ${team.score} pkt)</span>
      `;
      
      btn.addEventListener('click', () => {
        selectTeamForNextRound(idx);
      });

      teamSelectGrid.appendChild(btn);
    });

    teamSelectModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function selectTeamForNextRound(idx) {
    activeTeamIndex = idx;
    roundQuestionsAnswered = 0;
    roundScores = 0;
    saveGameState();

    teamSelectModal.classList.add('hidden');
    document.body.style.overflow = '';
    
    updateStats();
    renderGrid();
  }

  // ==========================================
  // EKRAN WYNIKÓW I PODJĘCIA PODIUM (RESULTS)
  // ==========================================
  function showResults() {
    clearInterval(timerInterval);
    questionModal.classList.add('hidden');
    roundSummaryModal.classList.add('hidden');
    teamSelectModal.classList.add('hidden');
    resultsModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    let sortedRankings = [];
    if (gameMode === 'multi') {
      sortedRankings = [...teams].sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        const accA = a.answeredCount > 0 ? a.score / a.answeredCount : 0;
        const accB = b.answeredCount > 0 ? b.score / b.answeredCount : 0;
        return accB - accA;
      });
    } else {
      let correctCount = 0;
      Object.keys(selectedQuestions).forEach(key => {
        if (selectedQuestions[key].correct) correctCount++;
      });
      sortedRankings = [{
        name: 'Twój Wynik',
        score: correctCount,
        answeredCount: Object.keys(selectedQuestions).length,
        color: '#06b6d4'
      }];
    }

    // 1. Renderowanie Podium 3D
    resultsPodium.innerHTML = '';
    
    const podiumOrder = []; // [2nd, 1st, 3rd]
    if (sortedRankings.length >= 2) podiumOrder.push({ team: sortedRankings[1], rank: '2nd' });
    if (sortedRankings.length >= 1) podiumOrder.push({ team: sortedRankings[0], rank: '1st' });
    if (sortedRankings.length >= 3) podiumOrder.push({ team: sortedRankings[2], rank: '3rd' });

    if (gameMode === 'solo') {
      podiumOrder.length = 0;
      podiumOrder.push({ team: sortedRankings[0], rank: '1st' });
    }

    podiumOrder.forEach(item => {
      const col = document.createElement('div');
      col.className = `podium-column podium-column-${item.rank}`;
      
      const accuracy = item.team.answeredCount > 0 ? Math.round((item.team.score / item.team.answeredCount) * 100) : 0;

      col.innerHTML = `
        ${item.rank === '1st' ? '<span class="podium-crown">👑</span>' : ''}
        <span class="podium-team-name" style="color: ${item.team.color}">${item.team.name}</span>
        <span class="podium-score">${item.team.score} pkt (${accuracy}%)</span>
        <div class="podium-pillar" style="background: linear-gradient(180deg, ${item.team.color}40 0%, ${item.team.color}05 100%); border-color: ${item.team.color}60">
          <span class="podium-rank">${item.rank === '1st' ? '1' : item.rank === '2nd' ? '2' : '3'}</span>
        </div>
      `;
      resultsPodium.appendChild(col);
    });

    // 2. Tabela klasyfikacji
    resultsTableBody.innerHTML = '';
    sortedRankings.forEach((team, idx) => {
      const row = document.createElement('tr');
      const accuracy = team.answeredCount > 0 ? Math.round((team.score / team.answeredCount) * 100) : 0;
      
      row.innerHTML = `
        <td><strong>${idx + 1}</strong></td>
        <td>
          <span class="team-color-indicator" style="display: inline-block; width: 8px; height: 8px; border-radius: 50%; margin-right: 8px; background-color: ${team.color}"></span>
          ${team.name}
        </td>
        <td><strong>${team.score}</strong></td>
        <td>${team.score} z ${team.answeredCount} (${accuracy}%)</td>
      `;
      resultsTableBody.appendChild(row);
    });
  }

  function restartGameFromResults() {
    // Reset gry
    localStorage.removeItem('sports_quiz_selected');
    localStorage.removeItem('sports_quiz_game_started');
    localStorage.removeItem('sports_quiz_game_mode');
    localStorage.removeItem('sports_quiz_teams');
    localStorage.removeItem('sports_quiz_active_team_index');
    localStorage.removeItem('sports_quiz_questions_per_round');
    localStorage.removeItem('sports_quiz_round_questions_answered');
    localStorage.removeItem('sports_quiz_round_scores');
    localStorage.removeItem('sports_quiz_active_question_ids');
    
    selectedQuestions = {};
    teams = [];
    activeTeamIndex = 0;
    questionsPerRound = 10;
    roundQuestionsAnswered = 0;
    roundScores = 0;
    gameStarted = false;
    
    // Zsynchronizuj select w Lobby z aktualnym questionSet
    if (questionSetSelect) {
      questionSetSelect.value = questionSet;
    }
    tempQuestionSet = questionSet;

    activeQuestionIds = [];
    generateActiveQuestionIds();
    
    resultsModal.classList.add('hidden');
    lobbyModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    // Reset Lobby UI
    tempGameMode = 'solo';
    tabSolo.classList.add('active');
    tabMulti.classList.remove('active');
    lobbySetupSolo.classList.remove('hidden');
    lobbySetupMulti.classList.add('hidden');
    
    tempTeams = [
      { name: 'Drużyna A' },
      { name: 'Drużyna B' }
    ];
    renderLobbyTeams();
  }

  // ==========================================
  // FILTROWANIE - LISTENERY
  // ==========================================
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGrid();
  });

  timerSelect.addEventListener('change', (e) => {
    timerLimit = parseInt(e.target.value, 10);
    localStorage.setItem('sports_quiz_timer_limit', timerLimit);
  });

  if (questionSetSelect) {
    questionSetSelect.addEventListener('change', (e) => {
      tempQuestionSet = e.target.value;
    });
  }

  document.getElementById('category-filters').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      const parent = document.getElementById('category-filters');
      parent.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      
      e.target.classList.add('active');
      activeFilters.category = e.target.getAttribute('data-category');
      renderGrid();
    }
  });

  document.getElementById('status-filters').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      const parent = document.getElementById('status-filters');
      parent.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      
      e.target.classList.add('active');
      activeFilters.status = e.target.getAttribute('data-status');
      renderGrid();
    }
  });

  // Modal close buttons
  document.getElementById('modal-close-x').addEventListener('click', closeQuestionModal);
  btnModalClose.addEventListener('click', closeQuestionModal);

  questionModal.addEventListener('click', (e) => {
    if (e.target === questionModal && currentQuestionId !== null) {
      if (selectedQuestions[currentQuestionId]) {
        closeQuestionModal();
      }
    }
  });

  // End Game
  btnEndGame.addEventListener('click', () => {
    showResults();
  });

  btnResultsRestart.addEventListener('click', restartGameFromResults);

  // ==========================================
  // RESETOWANIE QUIZU (W TRAKCIE GRY)
  // ==========================================
  const btnReset = document.getElementById('btn-reset');
  const btnResetCancel = document.getElementById('btn-reset-cancel');
  const btnResetConfirm = document.getElementById('btn-reset-confirm');

  btnReset.addEventListener('click', () => {
    resetModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  });

  btnResetCancel.addEventListener('click', () => {
    resetModal.classList.add('hidden');
    document.body.style.overflow = '';
  });

  resetModal.addEventListener('click', (e) => {
    if (e.target === resetModal) {
      resetModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  btnResetConfirm.addEventListener('click', () => {
    selectedQuestions = {};
    if (gameMode === 'multi') {
      teams.forEach(team => {
        team.score = 0;
        team.answeredCount = 0;
      });
      activeTeamIndex = 0;
      roundQuestionsAnswered = 0;
      roundScores = 0;
    }
    generateActiveQuestionIds();
    saveGameState();
    updateStats();
    renderGrid();
    resetModal.classList.add('hidden');
    document.body.style.overflow = '';
  });

  // ==========================================
  // INICJALIZACJA GRY
  // ==========================================
  loadGameState();
  setupUIForMode();
  updateStats();
  renderGrid();
});
