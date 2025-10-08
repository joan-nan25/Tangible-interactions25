let player;
let orbs = [];
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
  createOrbs(15);
}

function draw() {
  background(245, 255, 250);

  if (!gameOver) {
    // update orbs
    for (let i = orbs.length - 1; i >= 0; i--) {
      orbs[i].move();
      orbs[i].display();

      if (player.hits(orbs[i])) {
        collectSound.play();
        createParticles(orbs[i].x, orbs[i].y, orbs[i].color);
        orbs.splice(i, 1);
        player.grow();
        score++;

        // GAME OVER trigger
        if (player.r > 180) {
          gameOver = true;
        }
      }
    }

    // update particles
    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].display();
      if (particles[i].isFinished()) {
        particles.splice(i, 1);
      }
    }

    player.move();
    player.display();

    drawUI();
  } else {
    // darken background
    fill(0, 150);
    rect(0, 0, width, height);

    // GAME OVER text
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
  if (key === ' ') {
    resetGame();
  }
}

function resetGame() {
  score = 0;
  gameOver = false;
  particles = [];
  player = new Player(width / 2, height / 2, 30);
  createOrbs(15);
}

function createOrbs(count) {
  orbs = [];
  for (let i = 0; i < count; i++) {
    orbs.push(new Orb(random(width), random(height), random(20, 40)));
  }
}

function createParticles(x, y, col) {
  for (let i = 0; i < 15; i++) {
    particles.push(new Particle(x, y, col));
  }
}

function drawUI() {
  // score
  fill(50);
  noStroke();
  textSize(24);
  textAlign(LEFT);
  text("🍗 Score: " + score, 20, 40);

  // instructions
  textSize(14);
  text("← ↑ ↓ → move | Space = reset", 20, height - 20);
}
