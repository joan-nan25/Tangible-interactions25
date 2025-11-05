class Storm {
  constructor(x, thunderSound) {
    this.pos = createVector(x, 150);
    this.vel = createVector(random(-1, -0.5), 0);
    this.nutrientValue = random(-0.2, 0.3);
    this.lightning = false;
    this.lightningTimer = 0;
    this.raindrops = [];
    this.thunderSound = thunderSound;
    this.flashAlpha = 0;
  }

  update(trees) {
    this.pos.add(p5.Vector.mult(this.vel, windSpeed));

    // Rain
    if (random(1) < 0.3) {
      this.raindrops.push(createVector(this.pos.x + random(-40, 40), this.pos.y + 20));
    }
    for (let r of this.raindrops) r.y += 10;
    this.raindrops = this.raindrops.filter(r => r.y < height * 0.75);

    // Random lightning
    if (random(1) < 0.01 && this.lightningTimer <= 0) {
      this.lightning = true;
      this.lightningTimer = 10;
      stormColorFactor = 1;

      // Check each tree
      for (let t of trees) {
        if (abs(this.pos.x - t.pos.x) < 60) {
          t.strike(this.nutrientValue);
        }
      }

      // Play thunder (only after interaction)
      if (this.thunderSound && userStartAudio && getAudioContext().state === "running") {
        if (!this.thunderSound.isPlaying()) {
          this.thunderSound.rate(random(0.9, 1.2));
          this.thunderSound.setVolume(0.6);
          this.thunderSound.play();
        }
      }

      this.flashAlpha = 180;
    }

    if (this.lightningTimer > 0) {
      this.lightningTimer--;
      if (this.lightningTimer <= 0) {
        this.lightning = false;
        stormColorFactor = 0;
      }
    }

    // Fade flash
    this.flashAlpha *= 0.9;
  }

  display() {
    // Cloud
    noStroke();
    fill(100);
    ellipse(this.pos.x, this.pos.y, 120, 60);

    // Lightning
    if (this.lightning) {
      stroke(255, 255, 200);
      strokeWeight(3);
      for (let i = 0; i < 3; i++) {
        let lx = this.pos.x + random(-10, 10);
        line(lx, this.pos.y, lx + random(-20, 20), height * 0.75);
      }
    }

    // Rain
    stroke(150, 150, 255, 150);
    strokeWeight(2);
    for (let r of this.raindrops) {
      line(r.x, r.y, r.x, r.y + 10);
    }

    // Lightning flash
    if (this.flashAlpha > 5) {
      noStroke();
      fill(255, 255, 230, this.flashAlpha);
      rect(0, 0, width, height);
    }
  }
}
