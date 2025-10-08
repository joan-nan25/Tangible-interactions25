let player;
let orbs = [];
let collectSound;

function preload() {
  collectSound = loadSound('data/collect.wav');
}

function setup() {
  createCanvas(800, 600);
  player = new Player(width / 2, height / 2, 30);

  for (let i = 0; i < 15; i++) {
    orbs.push(new Orb(random(width), random(height), random(20, 40)));
  }
}

function draw() {
  background(20, 25, 40);

  for (let i = orbs.length - 1; i >= 0; i--) {
    orbs[i].move();
    orbs[i].display();

    if (player.hits(orbs[i])) {
      collectSound.play(); // play sound when collecting
      orbs.splice(i, 1);
      player.grow();
    }
  }

  player.move();
  player.display();

  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT);
  text("← ↑ ↓ → to move | Collect the orbs! | Space = reset", 20, 30);
}

function keyPressed() {
  if (key === ' ') {
    resetGame();
  }
}

function resetGame() {
  player = new Player(width / 2, height / 2, 30);
  orbs = [];
  for (let i = 0; i < 15; i++) {
    orbs.push(new Orb(random(width), random(height), random(20, 40)));
  }
}
