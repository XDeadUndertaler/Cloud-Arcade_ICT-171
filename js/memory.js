// Memory Match - full rewrite with automatic return to difficulty screen after win
const floatingArea = document.getElementById("floatingShapes");
const grid = document.getElementById("grid");
const movesEl = document.getElementById("moves");
const timeEl = document.getElementById("time");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const gameArea = document.getElementById("gameArea");
const difficultySelect = document.getElementById("difficultySelect");

let firstCard = null, secondCard = null;
let lockBoard = false;
let moves = 0, matched = 0;
let timer = null, seconds = 0;
let gridSize = 4;
let previewMode = false;
let returnTimeoutId = null;

// Floating shapes (background)
const shapes = ["🎮","⭐","🧩","💡"];
function createFloatingShape(){
  const s = document.createElement("span");
  s.textContent = shapes[Math.floor(Math.random()*shapes.length)];
  s.style.left = Math.random()*100 + "vw";
  s.style.top = "100vh";
  s.style.fontSize = (15 + Math.random()*30) + "px";
  s.style.animationDuration = (8 + Math.random()*8) + "s";
  floatingArea.appendChild(s);
  setTimeout(()=> s.remove(), 10000);
}
setInterval(createFloatingShape, 800);

// Emoji pool (enough for up to 8x8)
const emojis = ["🍎","🍌","🍇","🍓","🍒","🍉","🍋","🍍","🥝","🥥",
                "🍕","🍔","🍟","🌮","🍪","🍩","🍰","🎮","⭐","⚡",
                "🐶","🐱","🐭","🐼","🐸","🦋","🐢","🐙","🦄","🐝",
                "🌸","🍁","🍀","🍂","🌈","🔔","🎲","🎯","🔷","🔶"];

// Difficulty buttons - start game on click
document.querySelectorAll("#difficultySelect button").forEach(btn => {
  btn.addEventListener("click", () => {
    gridSize = parseInt(btn.dataset.size);
    previewMode = (gridSize === 4); // 4x4 uses preview
    difficultySelect.style.display = "none";
    gameArea.style.display = "block";
    startGame();
  });
});

// Start / build board
function startGame(){
  resetGameState();
  const totalCards = gridSize * gridSize;
  const pairCount = totalCards / 2;
  const pool = shuffle([...emojis]).slice(0, pairCount);
  const deck = shuffle([...pool, ...pool]);

  grid.innerHTML = "";
  grid.style.gridTemplateColumns = `repeat(${gridSize}, 70px)`;

  deck.forEach(symbol => {
    const c = document.createElement("div");
    c.className = "card";
    c.dataset.emoji = symbol;
    c.innerText = "?";
    c.setAttribute("role", "button");
    c.setAttribute("tabindex", "0");
    c.addEventListener("click", flipCard);
    c.addEventListener("keydown", e => { if(e.key === "Enter") flipCard.call(c); });
    grid.appendChild(c);
  });

  // Preview for easy mode
  if(previewMode){
    const all = grid.querySelectorAll(".card");
    all.forEach(card => {
      card.classList.add("flipped");
      card.innerText = card.dataset.emoji;
    });
    // show 3 seconds then hide and start timer
    setTimeout(()=>{
      all.forEach(card => {
        card.classList.remove("flipped");
        card.innerText = "?";
      });
      startTimer();
    }, 3000);
  } else {
    startTimer();
  }
}

// Flip logic
function flipCard(){
  if(lockBoard) return;
  if(this.classList.contains("flipped") || this.classList.contains("matched")) return;

  this.classList.add("flipped");
  this.innerText = this.dataset.emoji;

  if(!firstCard){
    firstCard = this;
    return;
  }
  secondCard = this;
  moves++;
  movesEl.textContent = moves;
  checkForMatch();
}

function checkForMatch(){
  if(firstCard.dataset.emoji === secondCard.dataset.emoji){
    // matched
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    matched += 2;
    firstCard = null;
    secondCard = null;
    if(matched === gridSize * gridSize){
      // WIN
      onWin();
    }
  } else {
    lockBoard = true;
    setTimeout(()=>{
      firstCard.classList.remove("flipped");
      secondCard.classList.remove("flipped");
      firstCard.innerText = "?";
      secondCard.innerText = "?";
      firstCard = null;
      secondCard = null;
      lockBoard = false;
    }, 800);
  }
}

function onWin(){
  message.textContent = "🎉 You Win!";
  triggerConfetti();
  clearInterval(timer);

  // After 3 seconds return to difficulty screen and fully reset
  returnTimeoutId = setTimeout(()=>{
    // cleanup UI
    gameArea.style.display = "none";
    difficultySelect.style.display = "block";
    resetGameState();
    message.textContent = "";
  }, 3000);
}

// Timer & utilities
function startTimer(){
  seconds = 0;
  timeEl.textContent = "0s";
  timer = setInterval(()=>{
    seconds++;
    timeEl.textContent = `${seconds}s`;
  }, 1000);
}

function resetGameState(){
  // stop timers, clear board variables
  clearInterval(timer);
  if(returnTimeoutId) { clearTimeout(returnTimeoutId); returnTimeoutId = null; }
  firstCard = null; secondCard = null; lockBoard = false;
  moves = 0; matched = 0; seconds = 0;
  movesEl.textContent = moves;
  timeEl.textContent = "0s";
  message.textContent = "";
  grid.innerHTML = "";
}

// Shuffle helper
function shuffle(arr){
  for(let i = arr.length -1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Restart button behavior - go back to difficulty menu
restartBtn.addEventListener("click", ()=>{
  // cancel timers and return to difficulty selector
  clearInterval(timer);
  if(returnTimeoutId) { clearTimeout(returnTimeoutId); returnTimeoutId = null; }
  gameArea.style.display = "none";
  difficultySelect.style.display = "block";
  resetGameState();
});
/* Confetti (same simple canvas confetti used elsewhere) */
function triggerConfetti(){
  const canvas = document.getElementById("confetti");
  if(!canvas) return;
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const confetti = Array.from({length: 120}, ()=>({
    x: Math.random()*canvas.width,
    y: Math.random()*canvas.height - canvas.height,
    r: Math.random()*4 + 1,
    d: Math.random()*10 + 5,
    color: `hsl(${Math.random()*360},100%,70%)`
  }));

  let running = true;
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confetti.forEach(c=>{
      ctx.beginPath();
      ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
      ctx.fillStyle = c.color;
      ctx.fill();
    });
    update();
    if(running) requestAnimationFrame(draw);
  }
  function update(){
    confetti.forEach(c=>{
      c.y += c.d * 0.5;
      if(c.y > canvas.height) c.y = -10;
    });
  }
  draw();
  setTimeout(()=>{ running=false; ctx.clearRect(0,0,canvas.width,canvas.height); }, 3000);
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
