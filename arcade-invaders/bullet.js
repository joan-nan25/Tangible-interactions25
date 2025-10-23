class Bullet {
  constructor(pos, vel) {
    this.pos = pos.copy();
    this.vel = vel.copy();
    this.dead = false;
  }
  update() {
    this.pos.add(this.vel);
    if (this.pos.y < -20) this.dead = true;
  }
  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke(); fill(255, 240, 150);
    rectMode(CENTER);
    rect(0, 0, 4, 10, 2);
    pop();
  }
}
