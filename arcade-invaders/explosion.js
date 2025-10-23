class Explosion {
  constructor(pos) {
    this.pos = pos.copy();
    this.birth = millis();
    this.life = 420;
    this.r = 70;
    this.dead = false;
  }
  alive() { return millis() - this.birth < this.life; }
  update() { if (!this.alive()) this.dead = true; }
  draw() {
    const t = constrain((millis() - this.birth) / this.life, 0, 1);
    const rr = lerp(8, this.r, t);
    noFill();
    stroke(255, 220, 140, lerp(180, 0, t));
    strokeWeight(3);
    circle(this.pos.x, this.pos.y, rr * 2);
  }
}
