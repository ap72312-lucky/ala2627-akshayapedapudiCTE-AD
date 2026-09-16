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

// ─────────────── DAY 3 / DAY 4 · Mini-game addition ───────────────
const BOARD_SIZE = 8;
const pieceLibrary = [
  { name: "dot", color: "#f4c95d", cells: [[0, 0]] },
  { name: "line2", color: "#ff6b6b", cells: [[0, 0], [0, 1]] },
  { name: "line3", color: "#4ecdc4", cells: [[0, 0], [0, 1], [0, 2]] },
  { name: "square2", color: "#7bdff2", cells: [[0, 0], [0, 1], [1, 0], [1, 1]] },
  { name: "L", color: "#ff9f1c", cells: [[0, 0], [1, 0], [2, 0], [2, 1]] },
  { name: "zig", color: "#a78bfa", cells: [[0, 0], [0, 1], [1, 1], [1, 2]] },
  { name: "tall", color: "#34d399", cells: [[0, 0], [1, 0], [2, 0], [1, 1]] },
  { name: "corner", color: "#fb7185", cells: [[0, 0], [1, 0], [1, 1], [2, 1]] }
];

const boardEl = document.querySelector("#game-board");
const piecePanelEl = document.querySelector("#piece-panel");
const resetButton = document.querySelector("#reset-game");
const scoreEl = document.querySelector("#score");
const statusEl = document.querySelector("#game-status");

let board = [];
let pieces = [];
let selectedPieceIndex = null;
let score = 0;

function createRandomPiece() {
  const template = pieceLibrary[Math.floor(Math.random() * pieceLibrary.length)];
  return {
    name: template.name,
    color: template.color,
    cells: template.cells.map(([row, col]) => [row, col])
  };
}

function createBoard() {
  board = Array(BOARD_SIZE * BOARD_SIZE).fill(0);
}

function refillPieces() {
  while (pieces.length < 3) {
    pieces.push(createRandomPiece());
  }
}

function updateScore() {
  scoreEl.textContent = String(score);
}

function setStatus(message) {
  statusEl.textContent = message;
}

function canPlacePiece(piece, startRow, startCol) {
  return piece.cells.every(([rowOffset, colOffset]) => {
    const row = startRow + rowOffset;
    const col = startCol + colOffset;

    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return false;
    }

    return board[row * BOARD_SIZE + col] === 0;
  });
}

function clearCompleteLines() {
  const cellsToClear = new Set();

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    const startIndex = row * BOARD_SIZE;
    const rowIsFull = Array.from({ length: BOARD_SIZE }, (_, col) => board[startIndex + col]).every(Boolean);

    if (rowIsFull) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        cellsToClear.add(startIndex + col);
      }
    }
  }

  for (let col = 0; col < BOARD_SIZE; col += 1) {
    const colIsFull = Array.from({ length: BOARD_SIZE }, (_, row) => board[row * BOARD_SIZE + col]).every(Boolean);

    if (colIsFull) {
      for (let row = 0; row < BOARD_SIZE; row += 1) {
        cellsToClear.add(row * BOARD_SIZE + col);
      }
    }
  }

  if (cellsToClear.size > 0) {
    cellsToClear.forEach((index) => {
      board[index] = 0;
    });

    score += cellsToClear.size * 15;
    updateScore();
    setStatus(`Blast! ${cellsToClear.size} blocks cleared.`);
  }
}

function canPlaceAnyPiece() {
  return pieces.some((piece) => {
    for (let row = 0; row < BOARD_SIZE; row += 1) {
      for (let col = 0; col < BOARD_SIZE; col += 1) {
        if (canPlacePiece(piece, row, col)) {
          return true;
        }
      }
    }
    return false;
  });
}

function renderBoard() {
  boardEl.innerHTML = "";

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = "board-cell";
      cell.setAttribute("aria-label", `Board row ${row + 1}, column ${col + 1}`);

      const index = row * BOARD_SIZE + col;
      const value = board[index];

      if (value) {
        cell.classList.add("filled");
        cell.style.setProperty("--cell-color", value);
      }

      cell.addEventListener("click", () => {
        if (selectedPieceIndex === null) {
          setStatus("Pick a block first.");
          return;
        }

        const piece = pieces[selectedPieceIndex];

        if (!canPlacePiece(piece, row, col)) {
          setStatus("That shape cannot go there.");
          return;
        }

        piece.cells.forEach(([rowOffset, colOffset]) => {
          const currentRow = row + rowOffset;
          const currentCol = col + colOffset;
          board[currentRow * BOARD_SIZE + currentCol] = piece.color;
        });

        score += piece.cells.length * 10;
        updateScore();

        pieces.splice(selectedPieceIndex, 1);
        selectedPieceIndex = null;
        clearCompleteLines();
        refillPieces();
        renderBoard();
        renderPiecePanel();

        if (!canPlaceAnyPiece()) {
          setStatus("Game over! No more moves left.");
        } else {
          setStatus("Nice move! Pick another block.");
        }
      });

      boardEl.appendChild(cell);
    }
  }
}

function renderPiecePanel() {
  piecePanelEl.innerHTML = "";

  pieces.forEach((piece, index) => {
    const pieceButton = document.createElement("button");
    pieceButton.type = "button";
    pieceButton.className = "piece-button";
    if (selectedPieceIndex === index) {
      pieceButton.classList.add("selected");
    }

    const mini = document.createElement("div");
    mini.className = "piece-mini";

    const maxRow = Math.max(...piece.cells.map(([row]) => row));
    const maxCol = Math.max(...piece.cells.map(([, col]) => col));

    for (let row = 0; row <= maxRow; row += 1) {
      for (let col = 0; col <= maxCol; col += 1) {
        const cell = document.createElement("span");
        cell.className = "piece-mini-cell";

        const filled = piece.cells.some(([cellRow, cellCol]) => cellRow === row && cellCol === col);
        if (filled) {
          cell.classList.add("filled");
          cell.style.setProperty("--piece-color", piece.color);
        }

        mini.appendChild(cell);
      }
    }

    pieceButton.appendChild(mini);
    pieceButton.addEventListener("click", () => {
      if (selectedPieceIndex === index) {
        selectedPieceIndex = null;
        setStatus("Selection cleared.");
      } else {
        selectedPieceIndex = index;
        setStatus("Now choose a space on the board.");
      }
      renderPiecePanel();
    });

    piecePanelEl.appendChild(pieceButton);
  });
}

function resetGame() {
  score = 0;
  selectedPieceIndex = null;
  createBoard();
  pieces = [];
  refillPieces();
  updateScore();
  renderBoard();
  renderPiecePanel();
  setStatus("Select a block to begin.");
}

resetButton.addEventListener("click", resetGame);
resetGame();

