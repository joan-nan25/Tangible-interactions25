class Tree {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.health = 1; // 1 = full health, 0 = dead
    this.height = 120;
  }

  update() {
    // slow decay if no storm
    this.health -= 0.0005;
    this.health = constrain(this.health, 0, 1);
  }

  strike(nutrientValue) {
    this.health += nutrientValue;
    this.health = constrain(this.health, 0, 1);
  }

  display() {
    push();
    translate(this.pos.x, this.pos.y);

    // tree color based on health
    let trunkColor = lerpColor(color(80, 50, 30), color(150, 100, 50), this.health);
    let leafColor = lerpColor(color(60, 40, 40), color(40, 150, 60), this.health);

    // trunk
    stroke(trunkColor);
    strokeWeight(10);
    line(0, 0, 0, -this.height * this.health);

    // simple leafy canopy
    noStroke();
    fill(leafColor);
    ellipse(0, -this.height * this.health, 80 * this.health + 10, 60 * this.health + 10);

    pop();
  }
}
