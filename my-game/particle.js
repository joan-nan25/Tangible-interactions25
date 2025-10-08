class Particle {
  constructor(x, y, col) {
    this.x = x;
    this.y = y;
    this.vx = random(-2.2, 2.2);
    this.vy = random(-2.2, 2.2);
    this.alpha = 255;
    this.size = random(3, 7);
    this.color = col;
    this.drag = 0.98;
    this.gravity = 0.05;
  }

  update() {
    this.vx *= this.drag;
    this.vy = this.vy * this.drag + this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 6;
  }

  display() {
    noStroke();
    fill(red(this.color), green(this.color), blue(this.color), this.alpha);
    ellipse(this.x, this.y, this.size);
  }

  isFinished() {
    return this.alpha <= 0;
  }
}
