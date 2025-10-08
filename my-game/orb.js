class Orb {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.xSpeed = random(-2, 2);
    this.ySpeed = random(-2, 2);
    this.color = color(random(150, 255), random(50, 200), random(100, 255));
  }

  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // bounce off walls
    if (this.x < this.r || this.x > width - this.r) this.xSpeed *= -1;
    if (this.y < this.r || this.y > height - this.r) this.ySpeed *= -1;
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.r * 2);
  }
}
