// script.js — your Week 8 project. One file, four days.
// Work on ONE day's section at a time. Save (commit and push) at every save point.

// ─────────────── DAY 1 · Say hello ───────────────
console.log("Watermark-> Akshaya Pedapudi");

// ─────────────── DAY 2 · Wire the click ───────────────
const button = document.querySelector("#action");
const output = document.querySelector("#output");

button.addEventListener("click", function () {
  const isVisible = output.classList.toggle("visible");
  button.textContent = isVisible ? "Hide links" : "Show links";
});

// ─────────────── DECA terms flashcards ───────────────
const decaTerms = [
  { category: "Organization basics", term: "DECA", definition: "A career and technical student organization that prepares emerging leaders and entrepreneurs in marketing, finance, hospitality, and management. It was originally “Distributive Education Clubs of America.”" },
  { category: "Organization basics", term: "CTSO (Career and Technical Student Organization)", definition: "A student organization tied to career and technical education classes. DECA is one of several." },
  { category: "Organization basics", term: "Chapter", definition: "The local DECA group at a school." },
  { category: "Organization basics", term: "Association", definition: "The state-level organization, such as Arizona DECA." },
  { category: "Organization basics", term: "Career Cluster", definition: "A category of related careers that events are grouped into (Marketing, Finance, Hospitality & Tourism, Business Management & Administration, Entrepreneurship, and Personal Financial Literacy)." },
  { category: "Conferences", term: "SCDC (State Career Development Conference)", definition: "The state competition where students qualify for internationals." },
  { category: "Conferences", term: "ICDC (International Career Development Conference)", definition: "The international competition for state qualifiers." },
  { category: "Conferences", term: "Qualifying", definition: "Earning a high enough placement at one level to advance to the next." },
  { category: "Competition terms", term: "Competitive Event", definition: "A specific contest a student enters, like Principles of Marketing or Sports and Entertainment Marketing." },
  { category: "Competition terms", term: "Role-Play", definition: "An event where you act as a business professional responding to a scenario, usually with a short prep time followed by a presentation to a judge." },
  { category: "Competition terms", term: "Case Study", definition: "A longer, more in-depth business problem you analyze and present solutions for." },
  { category: "Competition terms", term: "Judge", definition: "A business professional who scores your presentation." },
  { category: "Competition terms", term: "Performance Indicators (PIs)", definition: "The specific skills and knowledge a judge is looking for in your role-play." },
  { category: "Competition terms", term: "21st Century Skills", definition: "Broader skills judges also score, like communication, critical thinking, and collaboration." },
  { category: "Competition terms", term: "Rubric / Score Sheet", definition: "The scoring guide judges use to rate a presentation." },
  { category: "Competition terms", term: "Exam", definition: "The multiple-choice test that is part of most competitive events and often counts toward your total score." },
  { category: "Competition terms", term: "Prep Time", definition: "The short period before a role-play when you read the scenario and plan your response." },
  { category: "Competition terms", term: "Written Event", definition: "An event that requires submitting a written report or project before presenting it." },
  { category: "Competition terms", term: "Team Event", definition: "An event where two or three students compete together." },
  { category: "Competition terms", term: "Individual Event", definition: "An event where one student competes alone." },
  { category: "Chapter and leadership", term: "Chapter Officer", definition: "A student elected to lead the local chapter." },
  { category: "Chapter and leadership", term: "Advisor", definition: "The teacher who supports and oversees the chapter." },
  { category: "Chapter and leadership", term: "Professional Attire", definition: "The dress code for competitions." }
];

const termCategory = document.querySelector("#term-category");
const termName = document.querySelector("#term-name");
const termDefinition = document.querySelector("#term-definition");
const termCount = document.querySelector("#term-count");
let currentTermIndex = 0;

function showTerm(index) {
  currentTermIndex = (index + decaTerms.length) % decaTerms.length;
  const currentTerm = decaTerms[currentTermIndex];
  termCategory.textContent = currentTerm.category;
  termName.textContent = currentTerm.term;
  termDefinition.textContent = currentTerm.definition;
  termCount.textContent = `${currentTermIndex + 1} / ${decaTerms.length}`;
}

document.querySelector("#term-prev").addEventListener("click", function () {
  showTerm(currentTermIndex - 1);
});

document.querySelector("#term-next").addEventListener("click", function () {
  showTerm(currentTermIndex + 1);
});

showTerm(currentTermIndex);

// ─────────────── Tetris mini-game ───────────────
const COLS = 10;
const ROWS = 16;
const BASE_SPEED = 900;
const TETROMINOES = [
  { name: "I", color: "#f4c95d", matrix: [[1, 1, 1, 1]] },
  { name: "O", color: "#f8fafc", matrix: [[1, 1], [1, 1]] },
  { name: "T", color: "#1d4ed8", matrix: [[0, 1, 0], [1, 1, 1]] },
  { name: "S", color: "#93c5fd", matrix: [[0, 1, 1], [1, 1, 0]] },
  { name: "Z", color: "#dbeafe", matrix: [[1, 1, 0], [0, 1, 1]] },
  { name: "J", color: "#60a5fa", matrix: [[1, 0, 0], [1, 1, 1]] },
  { name: "L", color: "#facc15", matrix: [[0, 0, 1], [1, 1, 1]] }
];

const boardEl = document.querySelector("#game-board");
const resetButton = document.querySelector("#reset-game");
const startStopButton = document.querySelector("#start-stop-game");
const scoreEl = document.querySelector("#score");
const statusEl = document.querySelector("#game-status");

let board = [];
let currentPiece = null;
let score = 0;
let gameOver = false;
let dropTimer = null;
let isRunning = true;
let scrollLocked = false;

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomPiece() {
  const template = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
  return {
    name: template.name,
    color: template.color,
    matrix: template.matrix.map((row) => [...row]),
    x: Math.floor(COLS / 2) - Math.ceil(template.matrix[0].length / 2),
    y: 0
  };
}

function updateScore() {
  scoreEl.textContent = String(score);
}

function setStatus(message) {
  statusEl.textContent = message;
}

function collides(piece, offsetX = 0, offsetY = 0, testMatrix = piece.matrix) {
  for (let row = 0; row < testMatrix.length; row += 1) {
    for (let col = 0; col < testMatrix[row].length; col += 1) {
      if (!testMatrix[row][col]) continue;

      const nextX = piece.x + col + offsetX;
      const nextY = piece.y + row + offsetY;

      if (nextX < 0 || nextX >= COLS || nextY >= ROWS) {
        return true;
      }

      if (nextY >= 0 && board[nextY][nextX]) {
        return true;
      }
    }
  }
  return false;
}

function mergePiece() {
  currentPiece.matrix.forEach((row, rowIndex) => {
    row.forEach((value, colIndex) => {
      if (!value) return;
      const boardRow = currentPiece.y + rowIndex;
      const boardCol = currentPiece.x + colIndex;
      if (boardRow >= 0) {
        board[boardRow][boardCol] = currentPiece.color;
      }
    });
  });
}

function clearLines() {
  let linesCleared = 0;

  for (let row = ROWS - 1; row >= 0; row -= 1) {
    if (board[row].every(Boolean)) {
      board.splice(row, 1);
      board.unshift(Array(COLS).fill(null));
      linesCleared += 1;
      row += 1;
    }
  }

  if (linesCleared > 0) {
    score += linesCleared * 100;
    updateScore();
    setStatus(`Nice! ${linesCleared} line${linesCleared > 1 ? "s" : ""} cleared.`);
  }
}

function spawnPiece() {
  currentPiece = randomPiece();

  if (collides(currentPiece, 0, 0)) {
    gameOver = true;
    setStatus("Game over! Press reset to play again.");
    clearInterval(dropTimer);
    renderBoard();
    return;
  }
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, index) => matrix.map((row) => row[index]).reverse());
}

function rotatePiece() {
  if (gameOver) return;

  const rotated = rotateMatrix(currentPiece.matrix);
  const originalX = currentPiece.x;

  if (!collides(currentPiece, 0, 0, rotated)) {
    currentPiece.matrix = rotated;
    return;
  }

  const kicks = [-1, 1, -2, 2];
  for (const offset of kicks) {
    if (!collides(currentPiece, offset, 0, rotated)) {
      currentPiece.x += offset;
      currentPiece.matrix = rotated;
      return;
    }
  }

  currentPiece.x = originalX;
}

function movePiece(direction) {
  if (gameOver) return;

  if (!collides(currentPiece, direction, 0)) {
    currentPiece.x += direction;
    renderBoard();
  }
}

function stepDown() {
  if (gameOver) return;

  if (!collides(currentPiece, 0, 1)) {
    currentPiece.y += 1;
    renderBoard();
    return;
  }

  mergePiece();
  clearLines();
  spawnPiece();
  renderBoard();
}

function hardDrop() {
  if (gameOver) return;

  while (!collides(currentPiece, 0, 1)) {
    currentPiece.y += 1;
  }

  mergePiece();
  clearLines();
  spawnPiece();
  renderBoard();
}

function renderBoard() {
  boardEl.innerHTML = "";

  const displayBoard = board.map((row) => [...row]);

  if (currentPiece) {
    currentPiece.matrix.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        if (!value) return;
        const boardRow = currentPiece.y + rowIndex;
        const boardCol = currentPiece.x + colIndex;
        if (boardRow >= 0 && boardRow < ROWS && boardCol >= 0 && boardCol < COLS) {
          displayBoard[boardRow][boardCol] = currentPiece.color;
        }
      });
    });
  }

  displayBoard.forEach((row) => {
    row.forEach((cell) => {
      const square = document.createElement("div");
      square.className = "board-cell";
      if (cell) {
        square.classList.add("filled");
        square.style.setProperty("--cell-color", cell);
      }
      boardEl.appendChild(square);
    });
  });
}

function resetGame() {
  board = createBoard();
  score = 0;
  gameOver = false;
  isRunning = false;
  updateScore();
  setStatus("Press Start to play.");
  spawnPiece();
  renderBoard();

  clearInterval(dropTimer);
  startStopButton.textContent = "Start";
}

function stopGame() {
  isRunning = false;
  clearInterval(dropTimer);
  setStatus("Game paused. Press Start to continue.");
  startStopButton.textContent = "Start";
}

function startGame() {
  if (gameOver) {
    resetGame();
  }

  if (!isRunning) {
    isRunning = true;
    setStatus("Use arrow keys to play. Press F to lock scrolling.");
    dropTimer = setInterval(stepDown, BASE_SPEED);
    startStopButton.textContent = "Stop";
  }
}

function toggleScrollLock() {
  scrollLocked = !scrollLocked;
  document.body.classList.toggle("scroll-locked", scrollLocked);
  setStatus(scrollLocked ? "Scroll locked. Use F to unlock." : "Scroll unlocked.");
}

let lastDownPressTime = 0;

document.addEventListener("keydown", (event) => {
  const controlKeys = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "];
  if (scrollLocked && controlKeys.includes(event.key)) {
    event.preventDefault();
  }

  if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    toggleScrollLock();
    return;
  }

  if (!isRunning || gameOver) return;

  if (event.key === "ArrowLeft") {
    movePiece(-1);
  } else if (event.key === "ArrowRight") {
    movePiece(1);
  } else if (event.key === "ArrowDown") {
    const now = Date.now();
    if (now - lastDownPressTime < 250) {
      hardDrop();
    } else {
      stepDown();
    }
    lastDownPressTime = now;
  } else if (event.key === "ArrowUp") {
    rotatePiece();
    renderBoard();
  } else if (event.key === " ") {
    hardDrop();
  }
});

startStopButton.addEventListener("click", () => {
  if (isRunning) {
    stopGame();
  } else {
    startGame();
  }
});

resetButton.addEventListener("click", resetGame);
resetGame();

const musicToggle = document.querySelector("#music-toggle");
const musicPlayer = document.querySelector("#music-player");

musicToggle.addEventListener("click", () => {
  const isPlaying = musicToggle.getAttribute("aria-pressed") === "true";

  if (isPlaying) {
    musicPlayer.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":[]}', "*");
    musicToggle.textContent = "Play background music";
    musicToggle.setAttribute("aria-pressed", "false");
    return;
  }

  musicPlayer.contentWindow.postMessage('{"event":"command","func":"playVideo","args":[]}', "*");
  musicToggle.textContent = "Stop background music";
  musicToggle.setAttribute("aria-pressed", "true");
});

const calendarMonth = document.querySelector("#calendar-month");
const calendarDays = document.querySelector("#calendar-days");
const calendarSelection = document.querySelector("#calendar-selection");
const today = new Date();
let displayedMonth = new Date(today.getFullYear(), today.getMonth(), 1);
let selectedDate = formatCalendarDate(today);
const eventForm = document.querySelector("#event-form");
const eventTitleInput = document.querySelector("#event-title");
const eventCategoryInput = document.querySelector("#event-category");
const eventDateInput = document.querySelector("#event-date");
const addEventToggle = document.querySelector("#add-event-toggle");
const calendarStorageKey = "deca-calendar-events";
const eventCategories = {
  general: "General",
  marketing: "Marketing",
  business: "Business Management + Administration",
  hospitality: "Hospitality + Tourism",
  finance: "Finance",
  entrepreneurship: "Entrepreneurship",
  holiday: "Holiday"
};
// Organizer-managed events stay separate from visitor-added events.
const recurringTuesdayEvents = [];
const firstAlternatingTuesday = new Date(2026, 8, 29, 12);
const lastSchoolTuesday = new Date(2027, 4, 18, 12);
let tuesdayNumber = 0;

for (let date = new Date(firstAlternatingTuesday); date <= lastSchoolTuesday; date.setDate(date.getDate() + 7)) {
  const category = tuesdayNumber % 2 === 0 ? "marketing" : "finance";
  recurringTuesdayEvents.push({
    date: formatCalendarDate(date),
    title: eventCategories[category],
    category
  });
  tuesdayNumber += 1;
}

const fixedCalendarEvents = [
  {
    date: "2026-10-01", title: "Entrepreneurship", category: "entrepreneurship",
    dateLabel: "October 1, 2026", time: "3:00–3:30 PM"
  },
  {
    date: "2026-10-12", title: "Columbus Day", category: "holiday",
    dateLabel: "October 12, 2026"
  },
  {
    date: "2026-10-15", title: "Entrepreneurship", category: "entrepreneurship",
    dateLabel: "October 15, 2026", time: "3:00–3:30 PM"
  },
  {
    date: "2026-10-31", title: "Halloween", category: "holiday",
    dateLabel: "October 31, 2026"
  },
  {
    date: "2026-11-11", title: "Veterans Day", category: "holiday",
    dateLabel: "November 11, 2026"
  },
  {
    date: "2026-11-26", title: "Thanksgiving Day", category: "holiday",
    dateLabel: "November 26, 2026"
  },
  {
    date: "2026-12-24", title: "Christmas Eve", category: "holiday",
    dateLabel: "December 24, 2026"
  },
  {
    date: "2026-12-25", title: "Christmas Day", category: "holiday",
    dateLabel: "December 25, 2026"
  },
  {
    date: "2027-01-01", title: "New Year's Day", category: "holiday",
    dateLabel: "January 1, 2027"
  },
  {
    date: "2027-01-18", title: "Martin Luther King Jr. Day", category: "holiday",
    dateLabel: "January 18, 2027"
  },
  {
    date: "2027-02-14", title: "Valentine's Day", category: "holiday",
    dateLabel: "February 14, 2027"
  },
  {
    date: "2027-02-15", title: "Presidents' Day", category: "holiday",
    dateLabel: "February 15, 2027"
  },
  {
    date: "2027-05-20", title: "Last Day of School!", category: "holiday",
    dateLabel: "May 20, 2027"
  },
  {
    date: "2026-11-13", title: "Red Zone Leadership Conference", category: "general",
    dateLabel: "November 13, 2026", location: "Glendale, AZ"
  },
  {
    date: "2026-11-20", endDate: "2026-11-22", title: "Ultimate DECA Power Trip", category: "general",
    dateLabel: "November 20–22, 2026", location: "Louisville, KY"
  },
  {
    date: "2027-02-25", endDate: "2027-02-27", title: "State Career Development Conference", category: "general",
    dateLabel: "February 25–27, 2027", location: "Phoenix"
  },
  {
    date: "2027-04-16", endDate: "2027-04-21", title: "International Career Development Conference", category: "general",
    dateLabel: "April 16–21, 2027", location: "Anaheim"
  },
  ...recurringTuesdayEvents
];
let userCalendarEvents = [];

try {
  userCalendarEvents = JSON.parse(localStorage.getItem(calendarStorageKey) || "[]");
  if (!Array.isArray(userCalendarEvents)) userCalendarEvents = [];
} catch {
  userCalendarEvents = [];
}

function formatCalendarDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function eventOccursOnDate(event, date) {
  if (!event.endDate) return event.date === date;
  return event.date <= date && event.endDate >= date;
}

function saveCalendarEvents() {
  localStorage.setItem(calendarStorageKey, JSON.stringify(userCalendarEvents));
}

function renderSelectedDate() {
  const date = new Date(`${selectedDate}T12:00:00`);
  const title = document.createElement("p");
  title.className = "selected-date-title";
  title.textContent = date.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  calendarSelection.replaceChildren(title);

  const eventsForDate = [
    ...fixedCalendarEvents.map((event) => ({ ...event, isFixed: true })),
    ...userCalendarEvents.map((event) => ({ ...event, isFixed: false }))
  ].filter((event) => eventOccursOnDate(event, selectedDate));
  if (eventsForDate.length === 0) {
    const emptyMessage = document.createElement("span");
    emptyMessage.textContent = "No events yet.";
    calendarSelection.appendChild(emptyMessage);
    return;
  }

  const eventList = document.createElement("ul");
  eventList.className = "event-list";
  eventsForDate.forEach((event) => {
    const item = document.createElement("li");
    const details = document.createElement("span");
    details.className = "event-details";
    const category = eventCategories[event.category] ? event.category : "general";
    const swatch = document.createElement("span");
    swatch.className = `event-category-swatch category-${category}`;
    swatch.setAttribute("aria-hidden", "true");
    const name = document.createElement("span");
    name.className = "event-title-text";
    name.textContent = event.title;
    const copy = document.createElement("span");
    copy.className = "event-copy";
    copy.appendChild(name);
    const meta = [event.dateLabel, event.time, event.location, event.description].filter(Boolean).join(" · ");
    if (meta) {
      const eventMeta = document.createElement("span");
      eventMeta.className = "event-meta";
      eventMeta.textContent = meta;
      copy.appendChild(eventMeta);
    }
    details.append(swatch, copy);
    item.appendChild(details);

    if (event.isFixed) {
      const source = document.createElement("span");
      source.className = "event-source";
      source.textContent = "Main event";
      item.appendChild(source);
    } else {
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "event-delete";
      deleteButton.textContent = "Remove";
      deleteButton.setAttribute("aria-label", `Remove ${event.title}`);
      deleteButton.addEventListener("click", () => {
        userCalendarEvents = userCalendarEvents.filter((savedEvent) => savedEvent.id !== event.id);
        saveCalendarEvents();
        renderCalendar();
        renderSelectedDate();
      });
      item.appendChild(deleteButton);
    }
    eventList.appendChild(item);
  });
  calendarSelection.appendChild(eventList);
}

function renderCalendar() {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();
  const firstWeekday = (new Date(year, month, 1).getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarMonth.textContent = displayedMonth.toLocaleDateString(undefined, {
    month: "long",
    year: "numeric"
  });
  calendarDays.replaceChildren();

  for (let blank = 0; blank < firstWeekday; blank += 1) {
    const emptyDay = document.createElement("span");
    emptyDay.className = "calendar-empty";
    emptyDay.setAttribute("aria-hidden", "true");
    calendarDays.appendChild(emptyDay);
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateButton = document.createElement("button");
    const date = new Date(year, month, day);
    dateButton.type = "button";
    dateButton.className = "calendar-day";
    dateButton.textContent = String(day);
    dateButton.setAttribute("aria-label", date.toLocaleDateString(undefined, {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric"
    }));

    const dateKey = formatCalendarDate(date);
    const eventsForDate = [
      ...fixedCalendarEvents,
      ...userCalendarEvents
    ].filter((event) => eventOccursOnDate(event, dateKey));
    if (eventsForDate.length > 0) {
      dateButton.setAttribute("aria-label", `${dateButton.getAttribute("aria-label")}, events: ${eventsForDate.map((event) => event.title).join(", ")}`);
    }

    const markedEvents = eventsForDate.filter((event) => !event.hideDot);
    if (markedEvents.length > 0) {
      dateButton.classList.add("has-event");
      const markers = document.createElement("span");
      markers.className = "calendar-event-markers";
      markers.setAttribute("aria-hidden", "true");
      const categories = [...new Set(markedEvents.map((event) => (
        eventCategories[event.category] ? event.category : "general"
      )))];
      categories.forEach((category) => {
        const dot = document.createElement("span");
        dot.className = `calendar-event-dot category-${category}`;
        markers.appendChild(dot);
      });
      dateButton.appendChild(markers);
    }

    if (date.toDateString() === today.toDateString()) {
      dateButton.classList.add("is-today");
      dateButton.setAttribute("aria-current", "date");
    }

    if (dateKey === selectedDate) dateButton.classList.add("is-selected");

    dateButton.addEventListener("click", () => {
      selectedDate = dateKey;
      eventDateInput.value = selectedDate;
      renderCalendar();
      renderSelectedDate();
    });

    calendarDays.appendChild(dateButton);
  }
}

document.querySelector("#calendar-prev").addEventListener("click", () => {
  displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() - 1, 1);
  renderCalendar();
});

document.querySelector("#calendar-next").addEventListener("click", () => {
  displayedMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1, 1);
  renderCalendar();
});

addEventToggle.addEventListener("click", () => {
  const willOpen = eventForm.hidden;
  eventForm.hidden = !willOpen;
  addEventToggle.setAttribute("aria-expanded", String(willOpen));
  if (willOpen) {
    eventDateInput.value = selectedDate;
    eventTitleInput.focus();
  }
});

document.querySelector("#cancel-event").addEventListener("click", () => {
  eventForm.reset();
  eventForm.hidden = true;
  addEventToggle.setAttribute("aria-expanded", "false");
  addEventToggle.focus();
});

eventForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const title = eventTitleInput.value.trim();
  const category = eventCategoryInput.value;
  const date = eventDateInput.value;
  if (!title || !date || !eventCategories[category]) return;

  userCalendarEvents.push({ id: `${Date.now()}-${Math.random()}`, title, category, date });
  selectedDate = date;
  displayedMonth = new Date(`${date}T12:00:00`);
  displayedMonth.setDate(1);
  saveCalendarEvents();
  eventForm.reset();
  eventForm.hidden = true;
  addEventToggle.setAttribute("aria-expanded", "false");
  renderCalendar();
  renderSelectedDate();
  addEventToggle.focus();
});

renderCalendar();
renderSelectedDate();

