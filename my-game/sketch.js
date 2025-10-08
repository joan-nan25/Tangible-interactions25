let player;
let worms = [];
let particles = [];
let collectSound;
let score = 0;
let gameOver = false;

function preload() {
  collectSound = loadSound('data/collect.wav');
}

function setup() {
  createCanvas(800, 600);
  player = new Player(width / 2, height / 2, 30);
  createWorms(12);
}

function draw() {
  // Dark theme
  background(20, 25, 40);

  if (!gameOver) {
    // Worms
    for (let i = worms.length - 1; i >= 0; i--) {
      worms[i].move();
      worms[i].display();

      if (worms[i].hits(player.x, player.y, player.effectiveRadius())) {
        collectSound.play();
        createParticles(worms[i].x, worms[i].y, worms[i].color);
        worms.splice(i, 1);
        player.grow();
        score++;

        if (player.r > 180) {
          gameOver = true;
        }
      }
    }

    // Particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].display();
      if (particles[i].isFinished()) particles.splice(i, 1);
    }

    // Player
    player.move();
    player.display();

    // UI
    drawUI();
  } else {
    // Game Over overlay
    fill(0, 180);
    noStroke();
    rect(0, 0, width, height);
    textAlign(CENTER, CENTER);
    fill(255);
    textSize(48);
    text("🥚 GAME OVER 🐔", width / 2, height / 2 - 40);
    textSize(24);
    text("Your score: " + score, width / 2, height / 2 + 10);
    textSize(18);
    text("Press SPACE to restart", width / 2, height / 2 + 50);
  }
}

function keyPressed() {
  if (key === ' ') resetGame();
}

function mousePressed() {
  // Ensure audio context is unlocked on first interaction
  userStartAudio();
}

function resetGame() {
  score = 0;
  gameOver = false;
  particles = [];
  player = new Player(width / 2, height / 2, 30);
  createWorms(12);
}

function createWorms(count) {
  worms = [];
  for (let i = 0; i < count; i++) {
    worms.push(new Worm(random(width), random(height), int(random(9, 15))));
  }
}

function createParticles(x, y, col) {
  for (let i = 0; i < 16; i++) {
    particles.push(new Particle(x, y, col));
  }
}

function drawUI() {
  // Score
  fill(255);
  noStroke();
  textSize(24);
  textAlign(LEFT, TOP);
  text("🍗 Score: " + score, 20, 20);

  // Instructions
  fill(200);
  textSize(14);
  text("← ↑ ↓ → move | Space = reset", 20, height - 28);
}
