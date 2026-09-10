const choices = document.querySelectorAll(".choice");
const playerDisplay = document.getElementById("player-display");
const computerDisplay = document.getElementById("computer-display");
const resultDisplay = document.getElementById("result");
const playerScoreEl = document.getElementById("player-score");
const computerScoreEl = document.getElementById("computer-score");
const restartBtn = document.getElementById("restart");
const status = document.getElementById("status");

let playerScore = 0;
let computerScore = 0;
const options = ["rock", "paper", "scissors"];
const icons = { rock: "✊", paper: "✋", scissors: "✌️" };

// Floating background
const shapes = ["✊", "✋", "✌️", "⭐"];
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
setInterval(createFloatingShape, 700);

choices.forEach(choice => {
  choice.addEventListener("click", () => {
    const player = choice.dataset.choice;
    choices.forEach(c => c.classList.remove("active"));
    choice.classList.add("active");

    status.textContent = "Computer is choosing...";
    setTimeout(() => {
      const computer = options[Math.floor(Math.random() * options.length)];
      playRound(player, computer);
    }, 1000);
  });
});

function playRound(player, computer) {
  playerDisplay.textContent = icons[player];
  computerDisplay.textContent = icons[computer];

  if (player === computer) {
    resultDisplay.textContent = "It's a Tie!";
    resultDisplay.style.color = "#FFD700";
  } else if (
    (player === "rock" && computer === "scissors") ||
    (player === "paper" && computer === "rock") ||
    (player === "scissors" && computer === "paper")
  ) {
    resultDisplay.textContent = "You Win This Round!";
    resultDisplay.style.color = "#32CD32";
    playerScore++;
  } else {
    resultDisplay.textContent = "Computer Wins This Round!";
    resultDisplay.style.color = "#FF4500";
    computerScore++;
  }

  playerScoreEl.textContent = playerScore;
  computerScoreEl.textContent = computerScore;

  checkWinner();
}

function checkWinner() {
  if (playerScore === 2 || computerScore === 2) {
    if (playerScore > computerScore) {
      resultDisplay.textContent = "🎉 You’re the Champion! 🎉";
      triggerConfetti();
    } else {
      resultDisplay.textContent = "💻 Computer Wins the Match!";
    }
    choices.forEach(btn => btn.disabled = true);
    restartBtn.style.display = "block";
    status.textContent = "Match Over!";
  } else {
    status.textContent = "Next Round!";
  }
}

restartBtn.addEventListener("click", () => {
  playerScore = 0;
  computerScore = 0;
  playerScoreEl.textContent = 0;
  computerScoreEl.textContent = 0;
  playerDisplay.textContent = "❓";
  computerDisplay.textContent = "❓";
  resultDisplay.textContent = "";
  choices.forEach(btn => { btn.disabled = false; btn.classList.remove("active"); });
  restartBtn.style.display = "none";
  status.textContent = "Make Your Move!";
});

// Simple confetti
function triggerConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 4 + 1,
    d: Math.random() * 10 + 5,
    color: `hsl(${Math.random() * 360},100%,70%)`
  }));

  let animation;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti.forEach(c => {
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
    update();
    animation = requestAnimationFrame(draw);
  }

  function update() {
    confetti.forEach(c => {
      c.y += c.d * 0.5;
      if (c.y > canvas.height) c.y = -10;
    });
  }

  draw();
  setTimeout(() => cancelAnimationFrame(animation), 4000);
}



function triggerConfetti() {
  const canvas = document.getElementById("confetti");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.style.opacity = "1";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height - canvas.height,
    r: Math.random() * 4 + 1,
    d: Math.random() * 10 + 5,
    color: `hsl(${Math.random() * 360},100%,70%)`
  }));

  let running = true;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    particles.forEach(p => {
      p.y += p.d * 0.5;
      if (p.y > canvas.height) p.y = -10;
    });
    if (running) requestAnimationFrame(draw);
  }
  draw();
  // fade out
  setTimeout(() => {
    let op = 1.0;
    const fade = setInterval(() => {
      op -= 0.05;
      if (op <= 0) {
        canvas.style.opacity = "0";
        clearInterval(fade);
        running = false;
        ctx.clearRect(0,0,canvas.width,canvas.height);
      } else {
        canvas.style.opacity = String(op);
      }
    }, 50);
  }, 1200);
}
