const startBtn = document.getElementById("startBtn");
const player1Input = document.getElementById("player1");
const player2Input = document.getElementById("player2");
const setupDiv = document.getElementById("player-setup");
const gameArea = document.getElementById("game-area");

const cells = document.querySelectorAll(".cell");
const result = document.getElementById("result");
const resetBtn = document.getElementById("resetBtn");
const turnText = document.querySelector(".turn-text");

let player1 = "";
let player2 = "";
let currentPlayer = "";
let currentSymbol = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let isGameActive = true;
let vsComputer = false;

const winningCombinations = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

startBtn.addEventListener("click", () => {
  player1 = player1Input.value.trim() || "Player 1";
  player2 = player2Input.value.trim() || "Computer";
  vsComputer = player2.toLowerCase() === "computer" || player2Input.value.trim() === "";

  currentPlayer = player1;
  turnText.textContent = `${currentPlayer}'s Turn (X)`;

  setupDiv.style.display = "none";
  gameArea.style.display = "block";
});

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleClick(cell, index));
});

function handleClick(cell, index) {
  if (board[index] !== "" || !isGameActive) return;

  board[index] = currentSymbol;
  cell.textContent = currentSymbol;

  if (checkWinner()) return endGame(`${currentPlayer} Wins!`, getWinningCombo());
  if (board.every(c => c !== "")) return endGame("It's a Draw!");

  switchPlayer();

  // If playing vs Computer
  if (vsComputer && currentPlayer === player2 && isGameActive) {
    setTimeout(computerMove, 500);
  }
}

function switchPlayer() {
  if (currentSymbol === "X") {
    currentSymbol = "O";
    currentPlayer = player2;
  } else {
    currentSymbol = "X";
    currentPlayer = player1;
  }
  turnText.textContent = `${currentPlayer}'s Turn (${currentSymbol})`;
}

function checkWinner() {
  return winningCombinations.some(combo => {
    const [a, b, c] = combo;
    return board[a] && board[a] === board[b] && board[a] === board[c];
  });
}

function getWinningCombo() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return combo;
    }
  }
  return null;
}

function endGame(message, combo = null) {
  result.textContent = `🎉 ${message}`;
  isGameActive = false;
  turnText.textContent = "";

  if (combo) {
    combo.forEach(i => cells[i].classList.add("win"));
  }

  // celebration
  try { triggerConfetti(); } catch(e){}

  // after 3s, clear win highlight and reset board for next game
  setTimeout(() => {
    cells.forEach(c => c.classList.remove("win"));
    resetBoard();
  }, 3000);
}

function computerMove() {
  let available = board.map((val, i) => (val === "" ? i : null)).filter(v => v !== null);
  const move = available[Math.floor(Math.random() * available.length)];
  if (move === undefined) return;

  const cell = cells[move];
  board[move] = currentSymbol;
  cell.textContent = currentSymbol;

  if (checkWinner()) return endGame(`${currentPlayer} Wins!`, getWinningCombo());
  if (board.every(c => c !== "")) return endGame("It's a Draw!");

  switchPlayer();
}

resetBtn.addEventListener("click", () => {
  board = ["", "", "", "", "", "", "", "", ""];
  isGameActive = true;
  currentSymbol = "X";
  currentPlayer = player1;
  result.textContent = "";
  turnText.textContent = `${currentPlayer}'s Turn (X)`;
  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("win");
  });
});
// Floating background animation
const shapes = ["❌", "⭕", "⭐", "⬤", "✦"];
const floatingArea = document.getElementById("floatingShapes");

function createFloatingShape() {
  const shape = document.createElement("span");
  shape.textContent = shapes[Math.floor(Math.random() * shapes.length)];
  shape.style.left = Math.random() * 100 + "vw";
  shape.style.top = "100vh";
  shape.style.fontSize = Math.random() * 25 + 15 + "px";
  shape.style.animationDuration = (8 + Math.random() * 8) + "s";
  floatingArea.appendChild(shape);

  setTimeout(() => shape.remove(), 10000);
}

setInterval(createFloatingShape, 600);

