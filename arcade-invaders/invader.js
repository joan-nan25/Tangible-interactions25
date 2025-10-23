class Invader {
  constructor() {
    this.super = random() < 0.08;
    this.pos = createVector(random(30, W - 30), -30);
    this.r = this.super ? 20 : 16;
    this.hp = this.super ? 2 : 1;
    this.speed = 1.6 + random(0.4, 1.2);
    this.dead = false;
    this.wobble = random(TWO_PI);
  }

  update() {
    this.pos.y += this.speed;
    this.pos.x += sin((frameCount * 0.03) + this.wobble) * (this.super ? 1.8 : 1.2);
    if (this.pos.y > H + 30) {
      this.dead = true;
      loseLife();
    }
  }

  draw() {
    push();
    translate(this.pos.x, this.pos.y);
    noStroke();
    fill(this.super ? color(182, 128, 255) : color(255, 120, 120));
    ellipse(0, 0, this.r * 2, this.r * 1.4);
    rectMode(CENTER);
    rect(0, this.r * 0.2, this.r * 1.2, this.r * 0.6, 3);
    pop();
  }

  hit(fromExplosion = false) {
    this.hp--;
    explosions.push(new Explosion(this.pos));
    if (this.hp <= 0) {
      player.addScore(this.super ? 3 : 1);
      this.dead = true;
    }
  }
}
