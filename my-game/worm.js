class Worm {
  constructor(x, y, len) {
    this.x = x;
    this.y = y;
    this.len = len; // number of segments
    this.xSpeed = random(-1.5, 1.5);
    this.ySpeed = random(-1.5, 1.5);
    this.color = color(random(200, 255), random(100, 200), random(100, 150));
    this.timeOffset = random(1000); // for wiggle variation
  }

  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // bounce off walls
    if (this.x < 0 || this.x > width) this.xSpeed *= -1;
    if (this.y < 0 || this.y > height) this.ySpeed *= -1;
  }

  display() {
    noStroke();
    fill(this.color);

    // draw a worm body made of small ellipses
    for (let i = 0; i < this.len; i++) {
      let t = frameCount * 0.1 + i * 0.5 + this.timeOffset;
      let wiggleX = sin(t) * 8;
      let segX = this.x - i * 6 + wiggleX;
      let segY = this.y + cos(t * 0.7) * 3;
      ellipse(segX, segY, 12 - i * 0.5, 10 - i * 0.5);
    }
  }

  // for collision with chicken’s head
  getRadius() {
    return this.len * 3; // rough bounding radius
  }

  hits(x, y, r) {
    let d = dist(x, y, this.x, this.y);
    return d < r + this.getRadius();
  }
}
