class Player {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = 5;
    this.color = color(0, 200, 255);
  }

  move() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    if (keyIsDown(UP_ARROW)) this.y -= this.speed;
    if (keyIsDown(DOWN_ARROW)) this.y += this.speed;

    this.x = constrain(this.x, this.r, width - this.r);
    this.y = constrain(this.y, this.r, height - this.r);
  }

  display() {
    noStroke();
    fill(this.color);
    ellipse(this.x, this.y, this.r * 2);
  }

  hits(orb) {
    let d = dist(this.x, this.y, orb.x, orb.y);
    return d < this.r + orb.r;
  }

  grow() {
    this.r += 2;
    this.color = color(random(100, 255), random(100, 255), 255);
  }
}
