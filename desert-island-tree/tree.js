class Tree {
  constructor(x, y, colorShift = 0) {
    this.pos = createVector(x, y);
    this.health = 1;
    this.height = 120;
    this.dead = false;
    this.angle = 0;
    this.regrowthPulse = 0;
    this.colorShift = colorShift;
  }

  update() {
    if (!this.dead) {
      this.health -= 0.0005;
      this.health = constrain(this.health, 0, 1);
      if (this.health <= 0.01) this.dead = true;
    } else {
      this.angle = lerp(this.angle, PI / 2, 0.02);
    }
    this.regrowthPulse *= 0.9;
  }

  strike(nutrientValue) {
    if (!this.dead) {
      let oldHealth = this.health;
      this.health += nutrientValue;
      this.health = constrain(this.health, 0, 1);
      if (this.health > oldHealth) this.regrowthPulse = 1;
      if (this.health <= 0.01) this.dead = true;
    } else if (this.health > 0.1) {
      this.dead = false;
      this.angle = 0;
      this.regrowthPulse = 1;
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(-this.angle);

    // Colors based on health
    let trunkColor = lerpColor(color(80, 50, 30), color(150, 100, 50), this.health);
    let leafColor = lerpColor(
      color(60 + this.colorShift, 40, 40),
      color(40, 150 + this.colorShift, 60),
      this.health
    );

    // Regrowth glow
    if (this.regrowthPulse > 0.05) {
      let glow = map(this.regrowthPulse, 0, 1, 0, 120);
      fill(120, 255, 180, glow);
      noStroke();
      ellipse(0, -this.height * this.health, 100 * this.health, 100 * this.health);
    }

    // Trunk
    stroke(trunkColor);
    strokeWeight(10);
    line(0, 0, 0, -this.height * this.health);

    // Canopy
    noStroke();
    fill(leafColor);
    let leafGrow = map(this.regrowthPulse, 0, 1, 0, 10);
    ellipse(0, -this.height * this.health, 80 * this.health + leafGrow, 60 * this.health + leafGrow);

    pop();
  }
}
