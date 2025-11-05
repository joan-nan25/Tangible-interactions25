class Tree {
  constructor(x, y, colorShift = 0) {
    this.pos = createVector(x, y);
    this.health = 1; // 1 = healthy
    this.baseWidth = 14;
    this.width = this.baseWidth;
    this.height = 160;
    this.fallen = false;
    this.angle = 0;
    this.regrowthPulse = 0;
    this.colorShift = colorShift;
    this.hasFruit = false;
  }

  nourish(good) {
    // Good storm: grow lush and bear fruit
    if (good) {
      this.health = 1;
      this.hasFruit = true;
      this.regrowthPulse = 1;
      this.width = this.baseWidth + random(3, 6);
      this.fallen = false;
      this.angle = 0;
    } 
    // Bad storm: weaken and fall
    else {
      this.health = 0.5;
      this.width = this.baseWidth - random(4, 6);
      this.fallen = true;
      this.hasFruit = false;
    }
  }

  update() {
    // Animate regrowth pulse
    this.regrowthPulse *= 0.9;

    // Animate falling if weakened
    if (this.fallen) {
      this.angle = lerp(this.angle, PI / 2, 0.02);
    } else {
      this.angle = lerp(this.angle, 0, 0.05);
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(-this.angle);

    // Colors based on health
    let trunkColor = lerpColor(color(90, 60, 40), color(160, 110, 60), this.health);
    let leafColor = lerpColor(
      color(80 + this.colorShift, 50, 50),
      color(40, 160 + this.colorShift, 70),
      this.health
    );

    // Trunk
    stroke(trunkColor);
    strokeWeight(this.width);
    line(0, 0, 0, -this.height);

    // Leaves
    noStroke();
    fill(leafColor);
    let leafGrow = map(this.regrowthPulse, 0, 1, 0, 10);
    ellipse(0, -this.height, 90 + leafGrow, 70 + leafGrow);

    // Fruit (visible only if nourished)
    if (this.hasFruit) {
      fill(255, 50, 50);
      ellipse(-15, -this.height + 20, 12, 12);
      ellipse(10, -this.height + 15, 10, 10);
      ellipse(5, -this.height + 25, 9, 9);
    }

    pop();
  }
}
