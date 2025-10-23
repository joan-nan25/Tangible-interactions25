class Bonus {
  constructor() {
    this.kind = random() < 0.5 ? 'triple' : 'shield';
    this.pos = createVector(random(30, W - 30), -20);
    this.speed = random(1.2, 2.0);
    this.dead = false;
  }
  update() {
    this.pos.y += this.speed;
    if (this.pos.y > H + 20) this.dead = true;
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    if (this.kind === 'shield') {
      fill(120, 190, 255);
      rectMode(CENTER);
      rect(0, 0, 20, 20, 5);
      textAlign(CENTER, CENTER);
      text('🛡️', 0, 1);
    } else {
      fill(255, 180, 120);
      rectMode(CENTER);
      rect(0, 0, 20, 20, 5);
      textAlign(CENTER, CENTER);
      text('🔱', 0, 1);
    }
    pop();
  }
}
