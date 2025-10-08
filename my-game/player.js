class Player {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.speed = 5;
    this.scale = 1;
    this.beakOpen = 0; // how open the beak is
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
    push();
    translate(this.x, this.y);
    scale(this.scale);
    noStroke();

    // main head (white)
    fill(255);
    ellipse(0, 0, this.r * 2);

    // red comb (top)
    fill(220, 0, 0);
    ellipse(-this.r * 0.3, -this.r * 1.1, this.r * 0.6, this.r * 0.6);
    ellipse(0, -this.r * 1.2, this.r * 0.6, this.r * 0.6);
    ellipse(this.r * 0.3, -this.r * 1.1, this.r * 0.6, this.r * 0.6);

    // eye (black circle)
    fill(0);
    ellipse(this.r * 0.3, -this.r * 0.2, this.r * 0.3);

    // white highlight
    fill(255);
    ellipse(this.r * 0.35, -this.r * 0.25, this.r * 0.1);

    // beak (orange triangle)
    fill(255, 170, 0);
    let open = this.beakOpen;
    triangle(
      this.r * 0.4, 0,
      this.r * 1.1, -this.r * 0.2 - open,
      this.r * 1.1, this.r * 0.2 + open
    );

    // gradually close the beak
    this.beakOpen = lerp(this.beakOpen, 0, 0.1);

    pop();
  }

  hits(orb) {
    let d = dist(this.x, this.y, orb.x, orb.y);
    return d < this.r + orb.r;
  }

  grow() {
    this.r += 2;
    this.scale += 0.05;
    this.beakOpen = this.r * 0.3; // open beak when eating!
  }
}
