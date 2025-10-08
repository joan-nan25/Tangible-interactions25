class Player {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;       // base radius (design size)
    this.scale = 1;   // visual growth multiplier
    this.speed = 5;
    this.beakOpen = 0; // peck animation amplitude
  }

  effectiveRadius() {
    // Use scaled radius for collisions/constraints
    return this.r * this.scale;
  }

  move() {
    if (keyIsDown(LEFT_ARROW))  this.x -= this.speed;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.speed;
    if (keyIsDown(UP_ARROW))    this.y -= this.speed;
    if (keyIsDown(DOWN_ARROW))  this.y += this.speed;

    const R = this.effectiveRadius();
    this.x = constrain(this.x, R, width - R);
    this.y = constrain(this.y, R, height - R);
  }

  display() {
    push();
    translate(this.x, this.y);
    scale(this.scale);
    noStroke();

    // Head
    fill(255);
    ellipse(0, 0, this.r * 2);

    // Comb (red)
    fill(230, 20, 35);
    ellipse(-this.r * 0.3, -this.r * 1.1, this.r * 0.6, this.r * 0.6);
    ellipse(0,            -this.r * 1.25, this.r * 0.6, this.r * 0.6);
    ellipse( this.r * 0.3, -this.r * 1.1, this.r * 0.6, this.r * 0.6);

    // Eye
    fill(0);
    ellipse(this.r * 0.3, -this.r * 0.2, this.r * 0.32);
    fill(255);
    ellipse(this.r * 0.36, -this.r * 0.26, this.r * 0.1);

    // Beak (orange), animated open/close
    fill(255, 170, 0);
    const open = this.beakOpen;
    triangle(
      this.r * 0.4, 0,
      this.r * 1.15, -this.r * 0.2 - open,
      this.r * 1.15,  this.r * 0.2 + open
    );

    // Ease beak closed each frame
    this.beakOpen = lerp(this.beakOpen, 0, 0.1);

    pop();
  }

  grow() {
    // Visual growth and peck pop
    this.r += 2;
    this.scale += 0.05;
    this.beakOpen = this.r * 0.3;
  }
}
