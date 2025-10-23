class Player {
  constructor() {
    this.pos = createVector(W / 2, H - 80);
    this.speed = 6;
    this.cooldown = 0;
    this.fireDelay = 10;
    this.score = 0;
    this.lives = 3;
    this.shieldUntil = 0;
    this.tripleUntil = 0;
  }

  update() {
    if (leftHeld) this.pos.x -= this.speed;
    if (rightHeld) this.pos.x += this.speed;
    this.pos.x = constrain(this.pos.x, 24, W - 24);
    if (this.cooldown > 0) this.cooldown--;
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    fill(140, 190, 255);
    triangle(-16, 16, 16, 16, 0, -22);
    fill(255);
    ellipse(0, 0, 12, 10);
    if (this.hasShield()) {
      noFill(); stroke(120, 190, 255, 150);
      circle(0, 0, 50 + sin(frameCount * 0.2) * 4);
    }
    pop();
  }

  shoot() {
    if (this.cooldown > 0) return;
    this.cooldown = this.fireDelay;
    bullets.push(new Bullet(createVector(this.pos.x, this.pos.y - 26), createVector(0, -10)));
    if (this.hasTriple()) {
      bullets.push(new Bullet(createVector(this.pos.x, this.pos.y - 26), createVector(-2, -10)));
      bullets.push(new Bullet(createVector(this.pos.x, this.pos.y - 26), createVector(2, -10)));
    }
  }

  addScore(n) { this.score += n; }
  hasShield() { return millis() < this.shieldUntil; }
  hasTriple() { return millis() < this.tripleUntil; }

  applyBonus(kind) {
    if (kind === 'shield') this.shieldUntil = millis() + 8000;
    if (kind === 'triple') this.tripleUntil = millis() + 10000;
  }
}
