class Tree {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.health = 1;
    this.height = 120;
    this.dead = false;
    this.angle = 0;
  }

  update() {
    if (!this.dead) {
      this.health -= 0.0005;
      this.health = constrain(this.health, 0, 1);
      if (this.health <= 0.01) this.dead = true;
    } else {
      // Death animation: tree falls slowly
      this.angle = lerp(this.angle, PI / 2, 0.02);
    }
  }

  strike(nutrientValue) {
    if (!this.dead) {
      this.health += nutrientValue;
      this.health = constrain(this.health, 0, 1);
      if (this.health <= 0.01) this.dead = true;
    }
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);
    rotate(-this.angle);

    let trunkColor = lerpColor(color(80, 50, 30), color(150, 100, 50), this.health);
    let leafColor = lerpColor(color(60, 40, 40), color(40, 150, 60), this.health);

    stroke(trunkColor);
    strokeWeight(10);
    line(0, 0, 0, -this.height * this.health);

    noStroke();
    fill(leafColor);
    ellipse(0, -this.height * this.health, 80 * this.health + 10, 60 * this.health + 10);

    pop();
  }
}
