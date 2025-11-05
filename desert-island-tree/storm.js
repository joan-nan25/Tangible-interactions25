class Storm {
  constructor(x, thunderSound, scenarioType) {
    this.pos = createVector(x, 150);
    this.vel = createVector(random(-1, -0.5), 0);
    this.scenarioType = scenarioType; // fixed for this run
    this.activated = false;
    this.thunderSound = thunderSound;
    this.flashAlpha = 0;
  }

  update(trees) {
    this.pos.add(p5.Vector.mult(this.vel, windSpeed));

    // When storm crosses trees, apply chosen scenario
    if (!this.activated && this.pos.x < width / 2) {
      this.activated = true;
      let good = this.scenarioType === "good";

      for (let t of trees) {
        t.nourish(good);
      }

      // Flash + thunder
      stormColorFactor = 1;
      this.flashAlpha = 200;
      if (this.thunderSound && userStartAudio) {
        if (!this.thunderSound.isPlaying()) {
          this.thunderSound.setVolume(0.6);
          this.thunderSound.rate(random(0.9, 1.1));
          this.thunderSound.play();
        }
      }
    }

    // Fade lightning
    stormColorFactor = lerp(stormColorFactor, 0, 0.05);
    this.flashAlpha *= 0.9;
  }

  display() {
    noStroke();
    fill(100);
    ellipse(this.pos.x, this.pos.y, 120, 60);

    if (this.flashAlpha > 5) {
      noStroke();
      fill(255, 255, 230, this.flashAlpha);
      rect(0, 0, width, height);
    }
  }
}
