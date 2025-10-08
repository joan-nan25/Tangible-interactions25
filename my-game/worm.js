class Worm {
  constructor(x, y, len) {
    this.x = x;
    this.y = y;
    this.len = len; // number of segments
    this.headR = 9; // head radius baseline
    this.xSpeed = random(-1.4, 1.4);
    this.ySpeed = random(-1.2, 1.2);
    this.timeOffset = random(1000);

    // Neon palette for dark bg
    const neon = [
      color(0, 255, 200),   // aqua
      color(255, 80, 200),  // magenta-pink
      color(180, 255, 0),   // lime
      color(255, 160, 0),   // amber
      color(120, 180, 255)  // electric blue
    ];
    this.color = random(neon);
  }

  move() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;

    // Gentle wiggle by perturbing velocity a bit
    const t = frameCount * 0.02 + this.timeOffset;
    this.x += sin(t) * 0.6;
    this.y += cos(t * 1.3) * 0.4;

    // Bounce
    if (this.x < 0 || this.x > width)  this.xSpeed *= -1;
    if (this.y < 0 || this.y > height) this.ySpeed *= -1;
  }

  display() {
    noStroke();

    // Draw body from head backward
    for (let i = 0; i < this.len; i++) {
      const seg = i;
      const t = frameCount * 0.15 + seg * 0.5 + this.timeOffset;
      const wiggleX = sin(t) * 8;
      const wiggleY = cos(t * 0.7) * 3;

      const segX = this.x - seg * 7 + wiggleX;
      const segY = this.y + wiggleY;

      // Size tapers toward tail
      const s = this.headR * 2 - seg * 0.6;
      // Slight fade toward tail
      const a = map(seg, 0, this.len - 1, 255, 140);

      fill(red(this.color), green(this.color), blue(this.color), a);
      ellipse(segX, segY, max(2, s), max(2, s * 0.85));
    }

    // Optional bright head dot for readability
    fill(255, 255, 255, 220);
    ellipse(this.x, this.y, this.headR * 0.7);
  }

  // Rough bounding radius for collision
  getRadius() {
    return this.headR + this.len * 3.5;
  }

  hits(px, py, pr) {
    const d = dist(px, py, this.x, this.y);
    return d < pr + this.getRadius();
  }
}
