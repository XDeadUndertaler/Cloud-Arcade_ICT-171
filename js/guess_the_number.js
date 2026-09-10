const modeSelect = document.getElementById("modeSelect");
const basicModeBtn = document.getElementById("basicMode");
const challengeModeBtn = document.getElementById("challengeMode");
const gameArea = document.getElementById("gameArea");
const instructions = document.getElementById("instructionsText");
const guessInput = document.getElementById("guessInput");
const submitBtn = document.getElementById("submitGuess");
const feedback = document.getElementById("feedback");
const attemptsEl = document.getElementById("attempts");
const attemptText = document.getElementById("attemptText");
const restartBtn = document.getElementById("restart");
const status = document.getElementById("status");
const floatingArea = document.getElementById("floatingShapes");

let randomNumber, attempts, timer, timeLeft, gameOver = false, mode = "";

// Floating background
const shapes = ["🎮", "⭐", "💡", "🔢"];
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
setInterval(createFloatingShape, 800);

// Mode selection
basicModeBtn.addEventListener("click", () => startGame("basic"));
challengeModeBtn.addEventListener("click", () => startGame("challenge"));

function startGame(selectedMode) {
  mode = selectedMode;
  modeSelect.style.display = "none";
  gameArea.style.display = "block";
  randomNumber = Math.floor(Math.random() * 100) + 1;
  attempts = 10;
  gameOver = false;
  feedback.textContent = "";
  restartBtn.style.display = "none";
  submitBtn.disabled = false;
  guessInput.value = "";
  guessInput.focus();

  if (mode === "basic") {
    instructions.innerHTML = "🧩 You have 10 attempts to guess the number between <strong>1</strong> and <strong>100</strong>!";
    attemptText.style.display = "block";
    attemptsEl.textContent = attempts;
  } else {
    instructions.innerHTML = "⚡ Guess the number between <strong>1</strong> and <strong>100</strong> before time runs out!";
    attemptText.style.display = "none";
    timeLeft = 30;
    status.textContent = `⏱️ Time left: ${timeLeft}s`;
    timer = setInterval(() => {
      timeLeft--;
      status.textContent = `⏱️ Time left: ${timeLeft}s`;
      if (timeLeft <= 0) {
        feedback.textContent = `⏰ Time's up! The number was ${randomNumber}.`;
        feedback.style.color = "#FF4500";
        endGame();
      }
    }, 1000);
  }
}

submitBtn.addEventListener("click", () => {
  if (gameOver) return;
  const guess = Number(guessInput.value);

  if (!guess || guess < 1 || guess > 100) {
    feedback.textContent = "❌ Enter a number between 1 and 100!";
    feedback.style.color = "#FFD700";
    return;
  }

  if (mode === "basic") attempts--;

  if (guess === randomNumber) {
    feedback.textContent = `🎉 Correct! The number was ${randomNumber}.`;
    feedback.style.color = "#32CD32";
    triggerConfetti();
    endGame();
  } else if (mode === "basic" && attempts === 0) {
    feedback.textContent = `😢 Out of attempts! The number was ${randomNumber}.`;
    feedback.style.color = "#FF4500";
    endGame();
  } else if (guess < randomNumber) {
    feedback.textContent = "📉 Too low! Try a higher number.";
    feedback.style.color = "#87CEFA";
  } else {
    feedback.textContent = "📈 Too high! Try a lower number.";
    feedback.style.color = "#FFA500";
  }

  attemptsEl.textContent = attempts;
  guessInput.value = "";
  guessInput.focus();
});

function endGame() {
  gameOver = true;
  submitBtn.disabled = true;
  restartBtn.style.display = "block";
  clearInterval(timer);
}

restartBtn.addEventListener("click", () => {
  clearInterval(timer);
  modeSelect.style.display = "block";
  gameArea.style.display = "none";
  status.textContent = "";
});

// Confetti animation
function triggerConfetti() {
  const canvas = document.getElementById("confetti");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = Array.from({ length: 120 }, () => ({
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
