let p1 = { progress: 0, target: 0, y: 120, col: null };
let p2 = { progress: 0, target: 0, y: 380, col: null };

let currentPlayer = 1;
let gameActive = true;
let winner = null;

let cooldown = false;
let cooldownTimer = 0;
let message = "";

let particles = [];

function setup() {
  createCanvas(800, 500);
  textAlign(CENTER, CENTER);

  p1.col = color(255, 80, 80);
  p2.col = color(80, 120, 255);
}

function draw() {
  background(15);

  drawTrack();
  updatePlayers();
  drawPlayers();
  drawParticles();
  drawUI();

  if (!gameActive) {
    drawGameOver();
    return;
  }

  if (cooldown && millis() - cooldownTimer > 500) {
    cooldown = false;
    message = "";
  }
}

//TRACK
function drawTrack() {
  stroke(80);
  line(60, 80, width - 60, 80);
  line(60, height - 80, width - 60, height - 80);

  // finish line
  for (let i = 0; i < 12; i++) {
    fill(i % 2 === 0 ? 255 : 0);
    noStroke();
    rect(width - 70, 80 + i * 20, 10, 20);
    rect(width - 50, 80 + i * 20, 10, 20);
  }

  stroke(255, 40);
  line(60, height / 2, width - 60, height / 2);
}

// PLAYERS
function updatePlayers() {
  // smooth animation toward target
  p1.progress = lerp(p1.progress, p1.target, 0.12);
  p2.progress = lerp(p2.progress, p2.target, 0.12);

  // win check
  if (p1.target >= 100) endGame(1);
  if (p2.target >= 100) endGame(2);
}

function drawPlayers() {
  drawCar(p1);
  drawCar(p2);
}

function drawCar(p) {
  let x = map(p.progress, 0, 100, 80, width - 100);

  // trail particle spawn
  if (random() < 0.2 && gameActive) {
    particles.push({
      x: x,
      y: p.y,
      vx: random(-1, 1),
      vy: random(-1, 1),
      life: 255,
      col: p.col
    });
  }

  // glow
  noStroke();
  fill(red(p.col), green(p.col), blue(p.col), 60);
  ellipse(x, p.y, 60, 30);

  // body
  fill(p.col);
  stroke(255);
  rect(x - 20, p.y - 12, 40, 24, 6);

  // wheels
  fill(30);
  noStroke();
  ellipse(x - 12, p.y - 10, 10);
  ellipse(x + 12, p.y - 10, 10);
  ellipse(x - 12, p.y + 10, 10);
  ellipse(x + 12, p.y + 10, 10);

  // label
  fill(255);
  textSize(12);
  text("P" + (p === p1 ? 1 : 2), x, p.y);
}

//PARTICLES
function drawParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 6;

    fill(red(p.col), green(p.col), blue(p.col), p.life);
    noStroke();
    ellipse(p.x, p.y, 6);

    if (p.life <= 0) particles.splice(i, 1);
  }
}

//INPUT
function keyPressed() {
  if (key === 'r' || key === 'R') restart();

  if (key === ' ' && gameActive && !cooldown) {
    takeTurn();
  }
}

function takeTurn() {
  let move = random(5, 25);

  let player = currentPlayer === 1 ? p1 : p2;
  let old = player.target;

  // risk/reward mechanic
  let risk = random();
  if (risk > 0.85) move *= 1.8; // lucky boost
  if (risk < 0.1) move *= 0.5;  // slow penalty

  player.target = min(player.target + move, 100);

  message =
    "P" +
    currentPlayer +
    (move > 20 ? " BOOST!" : " moved " + floor(move) + "%");

  cooldown = true;
  cooldownTimer = millis();

  currentPlayer = currentPlayer === 1 ? 2 : 1;
}

// UI
function drawUI() {
  fill(255);
  textSize(18);

  text(
    currentPlayer === 1 ? "PLAYER 1 TURN" : "PLAYER 2 TURN",
    width / 2,
    30
  );

  textSize(14);
  fill(180);
  text("SPACE = move | R = restart", width / 2, height - 20);

  fill(255, 200, 80);
  text(message, width / 2, 60);

  // progress bars
  drawBar(20, 80, p1.progress, color(255, 80, 80));
  drawBar(20, height - 60, p2.progress, color(80, 120, 255));
}

function drawBar(x, y, val, col) {
  fill(50);
  rect(x, y, 200, 10);

  fill(col);
  rect(x, y, map(val, 0, 100, 0, 200), 10);
}

//GAME STATE
function endGame(w) {
  gameActive = false;
  winner = w;
}

function drawGameOver() {
  fill(255, 220, 100);
  textSize(42);
  text("PLAYER " + winner + " WINS!", width / 2, height / 2);

  fill(200);
  textSize(16);
  text("Press R to restart", width / 2, height / 2 + 50);
}

function restart() {
  p1.progress = p1.target = 0;
  p2.progress = p2.target = 0;

  currentPlayer = 1;
  gameActive = true;
  winner = null;
  message = "";
  particles = [];
}