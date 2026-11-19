const COLS = 10;
const ROWS = 16;
const BASE_SPEED = 900;
const TETROMINOES = [
  { color: "#f4c95d", matrix: [[1, 1, 1, 1]] },
  { color: "#f8fafc", matrix: [[1, 1], [1, 1]] },
  { color: "#1d4ed8", matrix: [[0, 1, 0], [1, 1, 1]] },
  { color: "#93c5fd", matrix: [[0, 1, 1], [1, 1, 0]] },
  { color: "#dbeafe", matrix: [[1, 1, 0], [0, 1, 1]] },
  { color: "#60a5fa", matrix: [[1, 0, 0], [1, 1, 1]] },
  { color: "#facc15", matrix: [[0, 0, 1], [1, 1, 1]] }
];

const boardEl = document.querySelector("#game-board");
const resetButton = document.querySelector("#reset-game");
const startStopButton = document.querySelector("#start-stop-game");
const scoreEl = document.querySelector("#score");
const statusEl = document.querySelector("#game-status");
const musicToggle = document.querySelector("#music-toggle");
const musicPlayer = document.querySelector("#music-player");

let board = [];
let currentPiece = null;
let score = 0;
let gameOver = false;
let dropTimer = null;
let isRunning = false;
let scrollLocked = false;
let lastDownPressTime = 0;

function createBoard() {
  return Array.from({ length: ROWS }, () => Array(COLS).fill(null));
}

function randomPiece() {
  const template = TETROMINOES[Math.floor(Math.random() * TETROMINOES.length)];
  return {
    color: template.color,
    matrix: template.matrix.map((row) => [...row]),
    x: Math.floor(COLS / 2) - Math.ceil(template.matrix[0].length / 2),
    y: 0
  };
}

function setStatus(message) {
  statusEl.textContent = message;
}

function updateScore() {
  scoreEl.textContent = String(score);
}

function collides(piece, offsetX = 0, offsetY = 0, testMatrix = piece.matrix) {
  for (let row = 0; row < testMatrix.length; row += 1) {
    for (let col = 0; col < testMatrix[row].length; col += 1) {
      if (!testMatrix[row][col]) continue;
      const nextX = piece.x + col + offsetX;
      const nextY = piece.y + row + offsetY;
      if (nextX < 0 || nextX >= COLS || nextY >= ROWS) return true;
      if (nextY >= 0 && board[nextY][nextX]) return true;
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
      if (boardRow >= 0) board[boardRow][boardCol] = currentPiece.color;
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
  if (collides(currentPiece)) {
    gameOver = true;
    setStatus("Game over! Press reset to play again.");
    clearInterval(dropTimer);
  }
}

function rotateMatrix(matrix) {
  return matrix[0].map((_, index) => matrix.map((row) => row[index]).reverse());
}

function rotatePiece() {
  if (gameOver) return;
  const rotated = rotateMatrix(currentPiece.matrix);
  if (!collides(currentPiece, 0, 0, rotated)) {
    currentPiece.matrix = rotated;
    return;
  }
  for (const offset of [-1, 1, -2, 2]) {
    if (!collides(currentPiece, offset, 0, rotated)) {
      currentPiece.x += offset;
      currentPiece.matrix = rotated;
      return;
    }
  }
}

function movePiece(direction) {
  if (!gameOver && !collides(currentPiece, direction, 0)) {
    currentPiece.x += direction;
    renderBoard();
  }
}

function stepDown() {
  if (gameOver) return;
  if (!collides(currentPiece, 0, 1)) {
    currentPiece.y += 1;
  } else {
    mergePiece();
    clearLines();
    spawnPiece();
  }
  renderBoard();
}

function hardDrop() {
  if (gameOver) return;
  while (!collides(currentPiece, 0, 1)) currentPiece.y += 1;
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
  if (gameOver) resetGame();
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

document.addEventListener("keydown", (event) => {
  const controlKeys = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", " "];
  if (scrollLocked && controlKeys.includes(event.key)) event.preventDefault();
  if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    toggleScrollLock();
    return;
  }
  if (!isRunning || gameOver) return;
  if (event.key === "ArrowLeft") movePiece(-1);
  if (event.key === "ArrowRight") movePiece(1);
  if (event.key === "ArrowDown") {
    const now = Date.now();
    if (now - lastDownPressTime < 250) hardDrop();
    else stepDown();
    lastDownPressTime = now;
  }
  if (event.key === "ArrowUp") {
    rotatePiece();
    renderBoard();
  }
  if (event.key === " ") hardDrop();
});

startStopButton.addEventListener("click", () => {
  if (isRunning) stopGame();
  else startGame();
});

resetButton.addEventListener("click", resetGame);

const moleButtons = document.querySelectorAll(".mole-hole");
const moleScore = document.querySelector(".mole-score");
const moleStartButton = document.querySelector(".mole-button");
if (moleButtons.length && moleScore && moleStartButton) {
  let moleScoreValue = 0;
  let moleTimer = null;
  let gameRunning = false;

  function clearMoles() {
    moleButtons.forEach((button) => button.classList.remove("is-active"));
  }

  function popMole() {
    if (!gameRunning) return;
    clearMoles();
    const randomIndex = Math.floor(Math.random() * moleButtons.length);
    moleButtons[randomIndex].classList.add("is-active");
  }

  function startMoleGame() {
    if (gameRunning) return;
    gameRunning = true;
    moleScoreValue = 0;
    moleScore.textContent = String(moleScoreValue);
    moleStartButton.textContent = "Playing...";
    clearMoles();
    popMole();
    moleTimer = window.setInterval(popMole, 700);
  }

  function stopMoleGame() {
    gameRunning = false;
    window.clearInterval(moleTimer);
    clearMoles();
    moleStartButton.textContent = "Play again";
  }

  moleButtons.forEach((button) => {
    button.addEventListener("click", () => {
      if (!gameRunning || !button.classList.contains("is-active")) return;
      moleScoreValue += 1;
      moleScore.textContent = String(moleScoreValue);
      button.classList.remove("is-active");
    });
  });

  moleStartButton.addEventListener("click", () => {
    if (gameRunning) stopMoleGame();
    else startMoleGame();
  });
}

musicToggle.addEventListener("click", () => {
  const isPlaying = musicToggle.getAttribute("aria-pressed") === "true";
  if (isPlaying) {
    musicPlayer.contentWindow.postMessage('{"event":"command","func":"pauseVideo","args":[]}', "*");
    musicToggle.textContent = "Play background music";
    musicToggle.setAttribute("aria-pressed", "false");
  } else {
    musicPlayer.contentWindow.postMessage('{"event":"command","func":"playVideo","args":[]}', "*");
    musicToggle.textContent = "Stop background music";
    musicToggle.setAttribute("aria-pressed", "true");
  }
});

resetGame();

const dinoStage = document.querySelector(".dino-stage");
if (dinoStage) {
  const dinoRunner = document.querySelector(".dino-runner");
  const dinoStartButton = document.querySelector(".dino-start-button");
  const dinoJumpButton = document.querySelector(".dino-jump-button");
  const currentScoreEl = document.querySelector(".dino-current-score");
  const bestRunEl = document.querySelector(".dino-best-run");
  const speedEl = document.querySelector(".dino-speed");
  const cactusNodes = document.querySelectorAll(".dino-cactus");
  const storageKey = "dino-best-score";

  let isDinoJumping = false;
  let isGameRunning = false;
  let gameFrame = null;
  let score = 0;
  let bestScore = Number(localStorage.getItem(storageKey) || 0);
  let lastTime = 0;
  let speedMultiplier = 1;
  let cactusPositions = [];
  let jumpTimer = null;

  function formatDinoScore(value) {
    return String(Math.floor(value)).padStart(4, "0");
  }

  function renderDinoScores() {
    currentScoreEl.textContent = formatDinoScore(score);
    bestRunEl.textContent = formatDinoScore(bestScore);
    speedEl.textContent = `${speedMultiplier.toFixed(1)}x`;
  }

  function resetCacti() {
    const stageWidth = dinoStage.clientWidth;
    cactusPositions = [stageWidth + 80, stageWidth + 520];
    cactusNodes.forEach((cactus, index) => {
      cactus.style.animation = "none";
      cactus.style.left = `${cactusPositions[index]}px`;
      cactus.style.right = "auto";
    });
  }

  function endDinoGame() {
    isGameRunning = false;
    isDinoJumping = false;
    if (jumpTimer) clearTimeout(jumpTimer);
    dinoRunner.classList.remove("dino-jump");
    if (gameFrame) cancelAnimationFrame(gameFrame);
    gameFrame = null;
    dinoStage.classList.remove("is-running");
    dinoStage.classList.add("is-idle");
    dinoJumpButton.disabled = true;
    dinoStartButton.textContent = "Start";
    if (score > bestScore) {
      bestScore = Math.floor(score);
      localStorage.setItem(storageKey, String(bestScore));
    }
    score = 0;
    speedMultiplier = 1;
    renderDinoScores();
  }

  function triggerDinoJump() {
    if (!isGameRunning) return;
    isDinoJumping = true;
    if (jumpTimer) clearTimeout(jumpTimer);
    dinoRunner.classList.remove("dino-jump");
    void dinoRunner.offsetWidth;
    dinoRunner.classList.add("dino-jump");
    jumpTimer = window.setTimeout(() => {
      dinoRunner.classList.remove("dino-jump");
      isDinoJumping = false;
    }, 800);
  }

  function checkDinoCollision() {
    const runnerRect = dinoRunner.getBoundingClientRect();
    const stageRect = dinoStage.getBoundingClientRect();
    return Array.from(cactusNodes).some((cactus) => {
      const cactusRect = cactus.getBoundingClientRect();
      const overlapX = runnerRect.right > cactusRect.left + 6 && runnerRect.left < cactusRect.right - 6;
      const overlapY = runnerRect.bottom > cactusRect.top + 6 && runnerRect.top < cactusRect.bottom - 6;
      return overlapX && overlapY && runnerRect.bottom > stageRect.top;
    });
  }

  function moveCacti(delta) {
    const distance = delta * (0.24 + speedMultiplier * 0.08);
    const stageWidth = dinoStage.clientWidth;
    cactusPositions = cactusPositions.map((position, index) => {
      let nextPosition = position - distance;
      if (nextPosition < -80) {
        const otherPosition = cactusPositions[index === 0 ? 1 : 0];
        nextPosition = Math.max(stageWidth + 180, otherPosition + 300 + Math.random() * 220);
      }
      cactusNodes[index].style.left = `${nextPosition}px`;
      return nextPosition;
    });
  }

  function dinoGameLoop(timestamp) {
    if (!isGameRunning) return;
    if (!lastTime) lastTime = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;
    score += delta * 0.01;
    speedMultiplier = 1 + score * 0.04;
    moveCacti(delta);
    renderDinoScores();
    if (checkDinoCollision()) {
      endDinoGame();
      return;
    }
    if (score > bestScore) {
      bestScore = Math.floor(score);
      localStorage.setItem(storageKey, String(bestScore));
    }
    gameFrame = requestAnimationFrame(dinoGameLoop);
  }

  dinoStartButton.addEventListener("click", () => {
    if (isGameRunning) {
      endDinoGame();
      return;
    }
    score = 0;
    lastTime = 0;
    speedMultiplier = 1;
    isDinoJumping = false;
    if (jumpTimer) clearTimeout(jumpTimer);
    dinoRunner.classList.remove("dino-jump");
    isGameRunning = true;
    dinoStage.classList.add("is-running");
    dinoStage.classList.remove("is-idle");
    resetCacti();
    dinoJumpButton.disabled = false;
    dinoStartButton.textContent = "End";
    if (gameFrame) cancelAnimationFrame(gameFrame);
    gameFrame = requestAnimationFrame(dinoGameLoop);
  });

  dinoJumpButton.addEventListener("click", triggerDinoJump);
  document.addEventListener("keydown", (event) => {
    if (event.code !== "Space") return;
    event.preventDefault();
    if (isGameRunning) triggerDinoJump();
  });

  dinoStage.classList.add("is-idle");
  renderDinoScores();
}
