/**
 * Polski Quiz Sportowy - Logika Aplikacji
 * Współpracuje z bazą pytań w questions.js
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // STAN APLIKACJI (STATE)
  // ==========================================
  let selectedQuestions = {}; // Mapa: { [questionId]: { answered: true, correct: true/false, chosenOption: 0-3 } }
  let currentQuestionId = null;
  let activeFilters = {
    category: 'all',
    difficulty: 'all',
    status: 'all'
  };
  let searchQuery = '';

  // Timer State
  let timerLimit = 30; // Domyślny limit (sekundy)
  let timerInterval = null;
  let timeLeft = 30;

  // Elementy DOM
  const gridContainer = document.getElementById('questions-grid');
  const noResultsEl = document.getElementById('no-results');
  const searchInput = document.getElementById('search-input');
  const timerSelect = document.getElementById('timer-select');
  
  // Modale
  const questionModal = document.getElementById('question-modal');
  const resetModal = document.getElementById('reset-modal');
  const modalCloseX = document.getElementById('modal-close-x');
  
  // Elementy Statystyk
  const statAnswered = document.getElementById('stat-answered');
  const statCorrect = document.getElementById('stat-correct');
  const statIncorrect = document.getElementById('stat-incorrect');
  const statRatio = document.getElementById('stat-ratio');
  const progressFill = document.getElementById('progress-fill');

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

  const DIFFICULTY_NAMES = {
    latwe: 'Łatwe',
    srednie: 'Średnie',
    trudne: 'Trudne'
  };

  // Ładowanie stanu z localStorage
  function loadGameState() {
    const savedState = localStorage.getItem('sports_quiz_selected');
    if (savedState) {
      try {
        selectedQuestions = JSON.parse(savedState);
      } catch (e) {
        console.error("Błąd podczas odczytu stanu gry:", e);
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
  }

  // Zapisywanie stanu do localStorage
  function saveGameState() {
    localStorage.setItem('sports_quiz_selected', JSON.stringify(selectedQuestions));
  }

  // Aktualizacja panelu statystyk
  function updateStats() {
    const totalQuestions = questions.length;
    const answeredKeys = Object.keys(selectedQuestions);
    const answeredCount = answeredKeys.length;
    
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
    
    // Animowana/płynna aktualizacja liczb
    statAnswered.textContent = answeredCount;
    statCorrect.textContent = correctCount;
    statIncorrect.textContent = incorrectCount;
    statRatio.textContent = `${successRatio}%`;
    
    // Procent postępu
    const progressPercent = Math.min(100, (answeredCount / totalQuestions) * 100);
    progressFill.style.width = `${progressPercent}%`;
  }

  // ==========================================
  // RENDEROWANIE GRIDU PYTAŃ
  // ==========================================
  function renderGrid() {
    gridContainer.innerHTML = '';
    
    // Filtrowanie pytań
    const filteredQuestions = questions.filter(q => {
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

    // Pokaż/ukryj info o braku wyników
    if (filteredQuestions.length === 0) {
      noResultsEl.classList.remove('hidden');
    } else {
      noResultsEl.classList.add('hidden');
    }

    // Renderowanie kart
    filteredQuestions.forEach(q => {
      const card = document.createElement('div');
      card.className = 'q-card';
      card.setAttribute('data-id', q.id);
      card.setAttribute('data-category', q.category);
      card.setAttribute('data-difficulty', q.difficulty);
      
      const isAnswered = selectedQuestions[q.id];
      if (isAnswered) {
        card.classList.add('disabled');
        if (isAnswered.correct) {
          card.classList.add('answered-correct');
        } else {
          card.classList.add('answered-incorrect');
        }
      }

      // Numer na środku, kropka kategorii na dole (trudność ukryta)
      card.innerHTML = `
        <span class="q-number">${q.id}</span>
        <span class="q-category-dot" title="Kategoria: ${CATEGORY_NAMES[q.category]}"></span>
      `;

      // Event listener dla kliknięcia
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
    const q = questions.find(item => item.id === id);
    if (!q) return;

    currentQuestionId = id;
    
    // Ustawienie danych pytania w modalu
    modalQuestionId.textContent = q.id;
    modalQuestionText.textContent = q.question;
    
    // Kategoria
    modalCategory.textContent = CATEGORY_NAMES[q.category];
    // Reset klas kategorii i ustawienie właściwej
    modalCategory.className = 'category-badge'; 
    modalCategory.classList.add(`badge-${q.category}`);

    // Reset stanu kontenera objaśnienia i przycisku zamknięcia
    explanationContainer.classList.add('hidden');
    explanationContainer.className = 'explanation-box'; // Reset specyficznych klas
    btnModalClose.classList.add('hidden');

    // Generowanie opcji
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

    // Inicjalizacja i uruchomienie timera
    resetAndStartTimer(q);

    // Pokazanie modalu
    questionModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Zablokowanie przewijania strony w tle
  }

  // Licznik czasu - obsługa paska i odliczania
  function resetAndStartTimer(questionObj) {
    clearInterval(timerInterval);
    
    if (timerLimit > 0) {
      // Pokaż UI timera
      modalTimerContainer.classList.remove('hidden');
      modalTimerText.classList.remove('hidden');
      
      // Ukryj przycisk zamknięcia "X" - mechanizm anty-ucieczkowy
      modalCloseX.classList.add('hidden');
      
      // Reset wizualny paska i licznika
      timeLeft = timerLimit;
      modalTimerText.textContent = `${timeLeft}s`;
      modalTimerText.className = 'timer-text-badge';
      modalTimerBar.className = 'modal-timer-bar';
      modalTimerBar.style.transform = 'scaleX(1)';
      
      // Uruchomienie interwału co 100ms dla płynnej animacji paska
      let startTime = Date.now();
      const endTime = startTime + (timerLimit * 1000);
      
      timerInterval = setInterval(() => {
        const now = Date.now();
        const remainingMs = Math.max(0, endTime - now);
        timeLeft = Math.ceil(remainingMs / 1000);
        
        // Tekst sekund
        modalTimerText.textContent = `${timeLeft}s`;
        
        // Skalowanie paska
        const ratio = remainingMs / (timerLimit * 1000);
        modalTimerBar.style.transform = `scaleX(${ratio})`;
        
        // Klasy ostrzegawcze
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
      // Ukryj UI timera, pokaż "X"
      modalTimerContainer.classList.add('hidden');
      modalTimerText.classList.add('hidden');
      modalCloseX.classList.remove('hidden');
    }
  }

  // Uruchamiane po upływie czasu
  function handleTimeout(questionObj) {
    // Pokazanie przycisku zamknięcia "X"
    modalCloseX.classList.remove('hidden');
    
    // Zapis stanu odpowiedzi jako błędna (timeout)
    selectedQuestions[questionObj.id] = {
      answered: true,
      correct: false,
      chosenOption: null,
      timeout: true
    };
    saveGameState();

    // Zablokowanie opcji i zaznaczenie poprawnej odpowiedzi
    const optionButtons = optionsContainer.querySelectorAll('.option-btn');
    optionButtons.forEach((btn, idx) => {
      btn.classList.add('answered');
      if (idx === questionObj.correct) {
        btn.classList.add('correct');
      } else {
        btn.classList.add('unselected');
      }
    });

    // Aktualizacja kafelka na planszy w tle
    const cardEl = document.querySelector(`.q-card[data-id="${questionObj.id}"]`);
    if (cardEl) {
      cardEl.classList.add('disabled');
      cardEl.classList.add('answered-incorrect');
      const newCardEl = cardEl.cloneNode(true);
      cardEl.parentNode.replaceChild(newCardEl, cardEl);
    }

    // Pokaż wyjaśnienie z nagłówkiem o upływie czasu
    explanationContainer.classList.remove('hidden');
    explanationContainer.classList.add('incorrect-alert');
    explanationStatusText.textContent = 'Czas minął!';
    explanationText.innerHTML = `<strong>Czas na odpowiedź minął.</strong> ${questionObj.explanation}`;
    
    explanationIcon.innerHTML = `
      <circle cx="12" cy="12" r="10"></circle>
      <polyline points="12 6 12 12 16 14"></polyline>
    `;
    explanationIcon.style.stroke = 'var(--danger)';

    // Pokaż przycisk zamknięcia modalu
    btnModalClose.classList.remove('hidden');
    
    // Odświeżenie statystyk
    updateStats();
  }

  function handleAnswerSelection(selectedIdx, questionObj) {
    // Zatrzymanie odliczania i pokazanie przycisku X
    clearInterval(timerInterval);
    modalCloseX.classList.remove('hidden');

    const isCorrect = selectedIdx === questionObj.correct;
    
    // Zapis stanu odpowiedzi
    selectedQuestions[questionObj.id] = {
      answered: true,
      correct: isCorrect,
      chosenOption: selectedIdx
    };
    saveGameState();
    
    // Aktualizacja kafelka pod spodem od razu w tle
    const cardEl = document.querySelector(`.q-card[data-id="${questionObj.id}"]`);
    if (cardEl) {
      cardEl.classList.add('disabled');
      cardEl.classList.add(isCorrect ? 'answered-correct' : 'answered-incorrect');
      // Usunięcie listenera kliknięcia
      const newCardEl = cardEl.cloneNode(true);
      cardEl.parentNode.replaceChild(newCardEl, cardEl);
    }

    // Blokowanie opcji i kolorowanie
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

    // Pokaż wyjaśnienie
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

    // Pokaż przycisk zamknięcia
    btnModalClose.classList.remove('hidden');
    
    // Odświeżenie statystyk na dashboardzie
    updateStats();
  }

  function closeQuestionModal() {
    clearInterval(timerInterval);
    questionModal.classList.add('hidden');
    document.body.style.overflow = ''; // Przywrócenie przewijania
    currentQuestionId = null;
    
    // Na wszelki wypadek odświeżamy grid, aby zaktualizować filtry
    renderGrid();
  }

  // ==========================================
  // FILTROWANIE - LISTENERY
  // ==========================================
  
  // Wyszukiwarka
  searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderGrid();
  });

  // Ustawienie limitu czasu
  timerSelect.addEventListener('change', (e) => {
    timerLimit = parseInt(e.target.value, 10);
    localStorage.setItem('sports_quiz_timer_limit', timerLimit);
  });

  // Kategorie
  document.getElementById('category-filters').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      const parent = document.getElementById('category-filters');
      parent.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      
      e.target.classList.add('active');
      activeFilters.category = e.target.getAttribute('data-category');
      renderGrid();
    }
  });


  // Status (dostępne/wyszarzone)
  document.getElementById('status-filters').addEventListener('click', (e) => {
    if (e.target.classList.contains('filter-btn')) {
      const parent = document.getElementById('status-filters');
      parent.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
      
      e.target.classList.add('active');
      activeFilters.status = e.target.getAttribute('data-status');
      renderGrid();
    }
  });

  // Modale close events
  document.getElementById('modal-close-x').addEventListener('click', closeQuestionModal);
  btnModalClose.addEventListener('click', closeQuestionModal);

  // Kliknięcie poza modalem zamyka go (tylko jeśli pytanie zostało już odpowiedziane i zablokowane)
  questionModal.addEventListener('click', (e) => {
    if (e.target === questionModal && currentQuestionId !== null) {
      // Sprawdzamy czy na bieżące pytanie udzielono odpowiedzi
      if (selectedQuestions[currentQuestionId]) {
        closeQuestionModal();
      }
    }
  });

  // ==========================================
  // RESETOWANIE QUIZU
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

  // Kliknięcie poza reset modalem
  resetModal.addEventListener('click', (e) => {
    if (e.target === resetModal) {
      resetModal.classList.add('hidden');
      document.body.style.overflow = '';
    }
  });

  btnResetConfirm.addEventListener('click', () => {
    selectedQuestions = {};
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
  updateStats();
  renderGrid();
});
