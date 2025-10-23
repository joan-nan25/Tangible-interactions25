const W = 800, H = 800;
let player, bullets, invaders, explosions, bonuses;
let scoreEl, livesEl, levelEl;
let spawnCounter = 0, spawnInterval = 120;
let leftHeld = false, rightHeld = false;
let gameOver = false, level = 1;

function setup() {
  createCanvas(W, H);
  scoreEl = select('#score');
  livesEl = select('#lives');
  levelEl = select('#level');
  resetGame();
}

function resetGame() {
  player = new Player();
  bullets = [];
  invaders = [];
  explosions = [];
  bonuses = [];
  spawnCounter = 0;
  spawnInterval = 120;
  gameOver = false;
  updateUI();
}

function draw() {
  background(10, 12, 20);

  if (gameOver) {
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(32);
    text('GAME OVER\nPress R to Restart', W / 2, H / 2);
    return;
  }

  player.update();
  player.draw();

  // spawn invaders
  spawnCounter++;
  if (spawnCounter >= spawnInterval) {
    invaders.push(new Invader());
    spawnCounter = 0;
  }

  // bonuses chance
  if (random() < 0.005) bonuses.push(new Bonus());

  // update arrays
  bullets.forEach(b => { b.update(); b.draw(); });
  invaders.forEach(i => { i.update(); i.draw(); });
  explosions.forEach(e => { e.update(); e.draw(); });
  bonuses.forEach(bn => { bn.update(); bn.draw(); });

  // filter dead
  bullets = bullets.filter(b => !b.dead);
  invaders = invaders.filter(i => !i.dead);
  explosions = explosions.filter(e => !e.dead);
  bonuses = bonuses.filter(b => !b.dead);

  // collisions
  handleCollisions();

  spawnInterval = max(24, 120 - floor(player.score / 10) * 6);
  level = 1 + floor(player.score / 25);
  updateUI();
}

function handleCollisions() {
  // bullet vs invader
  for (let b of bullets) {
    for (let i of invaders) {
      if (!b.dead && !i.dead && dist(b.pos.x, b.pos.y, i.pos.x, i.pos.y) < i.r) {
        b.dead = true;
        i.hit();
      }
    }
  }

  // explosion vs invader
  for (let ex of explosions) {
    for (let i of invaders) {
      if (!i.dead && ex.alive() && dist(ex.pos.x, ex.pos.y, i.pos.x, i.pos.y) < ex.r) {
        i.hit(true);
      }
    }
  }

  // player vs invader
  for (let i of invaders) {
    if (!i.dead && dist(i.pos.x, i.pos.y, player.pos.x, player.pos.y) < i.r + 18) {
      if (!player.hasShield()) loseLife();
      i.dead = true;
      explosions.push(new Explosion(i.pos));
    }
  }

  // player vs bonus
  for (let bn of bonuses) {
    if (!bn.dead && dist(bn.pos.x, bn.pos.y, player.pos.x, player.pos.y) < 20) {
      player.applyBonus(bn.kind);
      bn.dead = true;
    }
  }
}

function loseLife() {
  player.lives--;
  if (player.lives <= 0) gameOver = true;
}

function updateUI() {
  scoreEl.html(player.score);
  livesEl.html(player.lives);
  levelEl.html(level);
}

function keyPressed() {
  if (key === ' ') player.shoot();
  if (key === 'r' || key === 'R') resetGame();
  if (keyCode === LEFT_ARROW) leftHeld = true;
  if (keyCode === RIGHT_ARROW) rightHeld = true;
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) leftHeld = false;
  if (keyCode === RIGHT_ARROW) rightHeld = false;
}
