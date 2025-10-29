class Storm {
  constructor(x) {
    this.pos = createVector(x, 150);
    this.vel = createVector(random(-1, -0.5), 0);
    this.nutrientValue = random(-0.2, 0.3);
    this.lightning = false;
    this.lightningTimer = 0;
  }

  update(tree) {
    this.pos.add(p5.Vector.mult(this.vel, windSpeed));

    // Random chance for lightning
    if (random(1) < 0.01 && this.lightningTimer <= 0) {
      this.lightning = true;
      this.lightningTimer = 10;
      stormColorFactor = 1; // darken sky for flash

      // If close to tree, strike it
      if (abs(this.pos.x - tree.pos.x) < 50) {
        tree.strike(this.nutrientValue);
      }
    }

    if (this.lightningTimer > 0) {
      this.lightningTimer--;
      if (this.lightningTimer <= 0) {
        this.lightning = false;
        stormColorFactor = 0;
      }
    }
  }

  display() {
    // cloud
    noStroke();
    fill(100);
    ellipse(this.pos.x, this.pos.y, 120, 60);

    // lightning flash
    if (this.lightning) {
      stroke(255, 255, 200);
      strokeWeight(3);
      for (let i = 0; i < 3; i++) {
        let lx = this.pos.x + random(-10, 10);
        line(lx, this.pos.y, lx + random(-20, 20), height * 0.75);
      }
    }
  }
}
