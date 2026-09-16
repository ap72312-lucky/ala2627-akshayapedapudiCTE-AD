// script.js — your Week 8 project. One file, four days.
// Work on ONE day's section at a time. Save (commit and push) at every save point.

// ─────────────── DAY 1 · Say hello ───────────────
console.log("Hello, World!");

// ─────────────── DAY 2 · Wire the click ───────────────
const button = document.querySelector("#action");
const output = document.querySelector("#output");

button.addEventListener("click", function () {
  const isVisible = output.classList.toggle("visible");
  button.textContent = isVisible ? "Hide links" : "Show links";
});

// ─────────────── Tetris mini-game ───────────────
const COLS = 10;
const ROWS = 16;
const BASE_SPEED = 550;
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
  isRunning = true;
  updateScore();
  setStatus("Use arrow keys to play. Press F to lock scrolling.");
  spawnPiece();
  renderBoard();

  clearInterval(dropTimer);
  dropTimer = setInterval(stepDown, BASE_SPEED);
  startStopButton.textContent = "Stop";
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
    return;
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

