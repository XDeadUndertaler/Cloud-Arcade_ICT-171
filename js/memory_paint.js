/* Memory Paint — Level Mode (fixed color bug + stable levels + saved progress) */

const floatingArea = document.getElementById("floatingShapes");
const gridEl = document.getElementById("grid");
const paletteEl = document.getElementById("palette");
const countdownEl = document.getElementById("countdown");
const previewMessage = document.getElementById("previewMessage");
const levelDisplay = document.getElementById("levelDisplay");
const resultEl = document.getElementById("result");
const checkBtn = document.getElementById("check");
const restartBtn = document.getElementById("restart");
const resetBtn = document.getElementById("resetProgress");
const confettiCanvas = document.getElementById("confetti");
const progressTracker = document.getElementById("progressTracker");

const LEVELS = [null, [1, 2], [2, 2], [3, 3], [4, 4], [5, 5], [6, 6]];
const MAX_LEVEL = 6;
let currentLevel = parseInt(localStorage.getItem("mp_highestLevel")) || 1;

let originalPattern = [];
let playerPattern = [];
let previewTimer = null;
let cleanupTimeout = null;
let runningPreview = false;
let selectedColor = "#FF0000";
let cellSize = 60;

/* Floating shapes animation */
const shapes = ["🎨", "🧠", "🕹️", "⭐"];
function createFloatingShape() {
  const s = document.createElement("span");
  s.textContent = shapes[Math.floor(Math.random() * shapes.length)];
  s.style.left = Math.random() * 100 + "vw";
  s.style.top = "100vh";
  s.style.fontSize = (14 + Math.random() * 28) + "px";
  s.style.animationDuration = (7 + Math.random() * 9) + "s";
  floatingArea.appendChild(s);
  setTimeout(() => s.remove(), 10000);
}
setInterval(createFloatingShape, 900);

/* Color palette */
const COLORS = [
  "#FF0000", "#00B050", "#0000FF", "#FFFF00",
  "#FF00FF", "#FFA500", "#00FFFF", "#FFFFFF"
];

function buildPalette() {
  paletteEl.innerHTML = "";
  COLORS.forEach(col => {
    const d = document.createElement("div");
    d.className = "color-option";
    d.style.backgroundColor = col;
    if (col === selectedColor) d.classList.add("selected");
    d.addEventListener("click", () => {
      selectedColor = col;
      document.querySelectorAll(".color-option").forEach(x => x.classList.remove("selected"));
      d.classList.add("selected");
    });
    paletteEl.appendChild(d);
  });
}

/* Progress tracker */
function updateProgressTracker() {
  progressTracker.innerHTML = "";
  for (let i = 1; i <= MAX_LEVEL; i++) {
    const step = document.createElement("div");
    step.className = "progress-step";
    step.textContent = i;
    if (i <= currentLevel) step.classList.add("active");
    progressTracker.appendChild(step);
  }
}

/* Start a level */
function startLevel(level) {
  clearTimers();
  currentLevel = Math.max(1, Math.min(level, MAX_LEVEL));
  updateProgressTracker();

  const [rows, cols] = LEVELS[currentLevel] || [1, 2];
  levelDisplay.textContent = `Level: ${currentLevel} (${rows} × ${cols})`;
  resultEl.textContent = "";
  buildPalette();

  // Adjust grid size
  const maxWidth = Math.min(window.innerWidth * 0.9, 720);
  cellSize = Math.floor(Math.min(72, (maxWidth - cols * 6) / cols));
  if (cellSize < 30) cellSize = 30;

  gridEl.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  gridEl.innerHTML = "";
  originalPattern = [];
  playerPattern = [];

  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) {
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const div = document.createElement("div");
      div.className = "cell";
      div.style.width = div.style.height = `${cellSize}px`;
      div.style.backgroundColor = color;
      div.dataset.r = r;
      div.dataset.c = c;
      row.push(color);
      gridEl.appendChild(div);
    }
    originalPattern.push(row);
  }

  playerPattern = Array.from({ length: rows }, () => Array(cols).fill("#FFFFFF"));

  // Preview timer
  runningPreview = true;
  let seconds = 5;
  countdownEl.textContent = seconds;
  previewMessage.style.display = "inline-block";
  previewTimer = setInterval(() => {
    seconds--;
    countdownEl.textContent = seconds;
    if (seconds <= 0) {
      clearInterval(previewTimer);
      previewTimer = null;
      hidePatternAndEnable();
    }
  }, 1000);
}

/* Hide pattern and enable drawing */
function hidePatternAndEnable() {
  runningPreview = false;
  previewMessage.style.display = "none";
  gridEl.querySelectorAll(".cell").forEach(cell => {
    cell.style.backgroundColor = "#FFFFFF";
    cell.addEventListener("click", paintCell);
    cell.addEventListener("touchstart", paintCell);
  });
}

/* Paint cell */
function paintCell(e) {
  const cell = e.currentTarget;
  const r = +cell.dataset.r;
  const c = +cell.dataset.c;
  cell.style.backgroundColor = selectedColor;
  playerPattern[r][c] = selectedColor;
}

/* Check results */

function showComparison(pct, correct, total) {
  // overlay
  const overlay = document.createElement("div");
  overlay.className = "compare-overlay";
  overlay.style.position = "fixed";
  overlay.style.left = "0";
  overlay.style.top = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.background = "rgba(0,0,0,0.6)";
  overlay.style.zIndex = "9999";

  const box = document.createElement("div");
  box.style.background = "rgba(255,255,255,0.06)";
  box.style.padding = "18px";
  box.style.borderRadius = "12px";
  box.style.maxWidth = "95%";
  box.style.color = "#fff";
  box.style.textAlign = "center";

  const title = document.createElement("div");
  title.textContent = `Result: ${correct}/${total} (${pct}%)`;
  title.style.marginBottom = "10px";
  box.appendChild(title);

  const wrapper = document.createElement("div");
  wrapper.style.display = "flex";
  wrapper.style.gap = "16px";
  wrapper.style.justifyContent = "center";
  wrapper.style.flexWrap = "wrap";
  box.appendChild(wrapper);

  const rows = originalPattern.length;
  const cols = originalPattern[0].length;

  // original grid
  const origBox = document.createElement("div");
  origBox.style.display = "grid";
  origBox.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  origBox.style.gap = "6px";
  origBox.style.padding = "6px";
  origBox.style.background = "rgba(0,0,0,0.12)";
  origBox.style.borderRadius = "8px";
  const origTitle = document.createElement("div");
  origTitle.textContent = "Original";
  origTitle.style.marginBottom = "8px";
  origTitle.style.fontWeight = "700";
  origBox.appendChild(origTitle);

  // player grid
  const plyBox = document.createElement("div");
  plyBox.style.display = "grid";
  plyBox.style.gridTemplateColumns = `repeat(${cols}, ${cellSize}px)`;
  plyBox.style.gap = "6px";
  plyBox.style.padding = "6px";
  plyBox.style.background = "rgba(0,0,0,0.12)";
  plyBox.style.borderRadius = "8px";
  const plyTitle = document.createElement("div");
  plyTitle.textContent = "Yours";
  plyTitle.style.marginBottom = "8px";
  plyTitle.style.fontWeight = "700";
  plyBox.appendChild(plyTitle);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const o = document.createElement("div");
      o.style.width = `${cellSize}px`;
      o.style.height = `${cellSize}px`;
      o.style.backgroundColor = originalPattern[r][c];
      o.style.borderRadius = "6px";
      o.style.boxSizing = "border-box";
      o.style.border = "2px solid rgba(255,255,255,0.12)";
      origBox.appendChild(o);

      const p = document.createElement("div");
      p.style.width = `${cellSize}px`;
      p.style.height = `${cellSize}px`;
      p.style.backgroundColor = (playerPattern[r][c] || "#FFFFFF");
      p.style.borderRadius = "6px";
      p.style.boxSizing = "border-box";
      // highlight mismatch
      if ((playerPattern[r][c] || "#FFFFFF").toUpperCase() !== originalPattern[r][c].toUpperCase()) {
        p.style.outline = "3px solid rgba(255,0,0,0.75)";
      } else {
        p.style.outline = "3px solid rgba(0,255,0,0.35)";
      }
      plyBox.appendChild(p);
    }
  }

  // container for grids + titles
  const gridsWrap = document.createElement("div");
  gridsWrap.style.display = "flex";
  gridsWrap.style.gap = "14px";
  gridsWrap.style.justifyContent = "center";
  gridsWrap.style.flexWrap = "wrap";

  const origWrap = document.createElement("div");
  origWrap.appendChild(origTitle);
  origWrap.appendChild(origBox);

  const plyWrap = document.createElement("div");
  plyWrap.appendChild(plyTitle);
  plyWrap.appendChild(plyBox);

  gridsWrap.appendChild(origBox);
  gridsWrap.appendChild(plyBox);
  box.appendChild(gridsWrap);

  // continue button
  const cont = document.createElement("button");
  cont.textContent = "Continue";
  cont.style.marginTop = "12px";
  cont.style.padding = "8px 12px";
  cont.style.borderRadius = "8px";
  cont.style.border = "none";
  cont.style.background = "#8A2BE2";
  cont.style.color = "#fff";
  cont.addEventListener("click", () => {
    document.body.removeChild(overlay);
    // after closing comparison, handle level result
    if (pct >= 80) {
      if (currentLevel < MAX_LEVEL) {
        localStorage.setItem("mp_highestLevel", currentLevel + 1);
        startLevel(currentLevel + 1);
      } else {
        // finished all levels, stay on last level
      }
    } else {
      // replay same level
      startLevel(currentLevel);
    }
  });
  box.appendChild(cont);

  overlay.appendChild(box);
  document.body.appendChild(overlay);
}

function checkResult() {
  if (runningPreview) return;
  const rows = originalPattern.length;
  const cols = originalPattern[0].length;
  let correct = 0;
  const total = rows * cols;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (originalPattern[r][c].toUpperCase() === (playerPattern[r][c] || "#FFFFFF").toUpperCase()) {
        correct++;
      }
    }
  }
  const pct = Math.round((correct / total) * 100);
  // show comparison overlay
  showComparison(pct, correct, total);
}


/* Restart level */
function restartLevel() {
  startLevel(currentLevel);
}

/* Reset progress */
function resetProgress() {
  localStorage.removeItem("mp_highestLevel");
  currentLevel = 1;
  startLevel(currentLevel);
}

/* Confetti effect */
function triggerConfetti() {
  const ctx = confettiCanvas.getContext("2d");
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  const particles = Array.from({ length: 100 }, () => ({
    x: Math.random() * confettiCanvas.width,
    y: Math.random() * confettiCanvas.height - confettiCanvas.height,
    r: Math.random() * 4 + 1,
    d: Math.random() * 10 + 5,
    color: `hsl(${Math.random() * 360}, 100%, 70%)`
  }));

  let running = true;
  function draw() {
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    particles.forEach(p => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    particles.forEach(p => {
      p.y += p.d * 0.5;
      if (p.y > confettiCanvas.height) p.y = -10;
    });
    if (running) requestAnimationFrame(draw);
  }
  draw();
  setTimeout(() => {
    running = false;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  }, 2500);
}

/* Timer cleanup */
function clearTimers() {
  if (previewTimer) clearInterval(previewTimer);
  if (cleanupTimeout) clearTimeout(cleanupTimeout);
  previewTimer = null;
  cleanupTimeout = null;
}

/* Initialize */
buildPalette();
updateProgressTracker();
startLevel(currentLevel);

/* Buttons */
checkBtn.addEventListener("click", checkResult);
restartBtn.addEventListener("click", restartLevel);
resetBtn.addEventListener("click", resetProgress);



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
