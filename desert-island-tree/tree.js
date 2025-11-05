class Tree {
  constructor(x, y, colorShift = 0) {
    this.pos = createVector(x, y);
    this.health = 1;
    this.baseWidth = 14;
    this.width = this.baseWidth;
    this.height = 160;
    this.fallen = false;
    this.angle = 0;
    this.colorShift = colorShift;
    this.hasFruit = false;
    this.fruits = []; // fallen fruit positions
  }

  nourish(good) {
    this.fruits = []; // clear old fruits

    if (good) {
      // Good nutrients
      this.health = 1;
      this.width = this.baseWidth + random(3, 6);
      this.fallen = false;
      this.angle = 0;
      this.hasFruit = true;
    } else {
      // Bad nutrients
      this.health = 0.5;
      this.width = this.baseWidth - random(4, 6);
      this.fallen = true;
      this.hasFruit = false;

      // Drop fruit to ground
      for (let i = 0; i < 3; i++) {
        this.fruits.push({
          x: this.pos.x + random(-20, 20),
          y: this.pos.y - this.height + 20,
          speed: random(2, 4),
          fallen: false
        });
      }
    }
  }

  update() {
    // Animate fallen fruit
    for (let f of this.fruits) {
      if (!f.fallen) {
        f.y += f.speed;
        if (f.y >= height * 0.75) {
          f.y = height * 0.75;
          f.fallen = true;
        }
      }
    }

    // Animate fall if weakened
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

    // Colors
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
    ellipse(0, -this.height, 90, 70);

    // Fruits on healthy tree
    if (this.hasFruit) {
      fill(255, 50, 50);
      ellipse(-15, -this.height + 20, 12, 12);
      ellipse(10, -this.height + 15, 10, 10);
      ellipse(5, -this.height + 25, 9, 9);
    }

    pop();

    // Fallen fruits on the ground
    noStroke();
    fill(255, 50, 50);
    for (let f of this.fruits) {
      ellipse(f.x, f.y, 10, 10);
    }
  }
}
