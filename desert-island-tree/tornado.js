class Tornado {
  constructor(x, thunderSound, scenarioType) {
    this.pos = createVector(x, 150);
    this.vel = createVector(random(-1, -0.5), 0);
    this.scenarioType = scenarioType;
    this.activated = false;
    this.thunderSound = thunderSound;
    this.flashAlpha = 0;
    this.raindrops = [];
  }

  update(trees) {
    this.pos.add(p5.Vector.mult(this.vel, windSpeed));

    // Generate rain particles
    if (random(1) < 0.4) {
      this.raindrops.push({
        x: this.pos.x + random(-50, 50),
        y: this.pos.y + random(0, 50),
        speed: random(8, 12)
      });
    }

    for (let r of this.raindrops) {
      r.y += r.speed;
    }
    this.raindrops = this.raindrops.filter(r => r.y < height * 0.8);

    // When tornado passes center, trigger event
    if (!this.activated && this.pos.x < width / 2) {
      this.activated = true;
      let good = this.scenarioType === "good";
      for (let t of trees) t.nourish(good);

      stormColorFactor = 1;
      this.flashAlpha = 150;

      if (this.thunderSound && userStartAudio) {
        if (!this.thunderSound.isPlaying()) {
          this.thunderSound.setVolume(0.6);
          this.thunderSound.rate(random(0.9, 1.1));
          this.thunderSound.play();
        }
      }
    }

    stormColorFactor = lerp(stormColorFactor, 0, 0.05);
    this.flashAlpha *= 0.9;
  }

  display() {
    // Cloud
    noStroke();
    fill(100);
    ellipse(this.pos.x, this.pos.y, 140, 70);

    // Tornado funnel
    this.drawTornado();

    // Rain
    stroke(150, 150, 255, 180);
    strokeWeight(2);
    for (let r of this.raindrops) {
      line(r.x, r.y, r.x, r.y + 12);
    }

    // Flash
    if (this.flashAlpha > 5) {
      noStroke();
      fill(255, 255, 230, this.flashAlpha);
      rect(0, 0, width, height);
    }
  }

  drawTornado() {
    push();
    translate(this.pos.x, this.pos.y + 35);
    noFill();
    stroke(180, 180, 200, 180);
    strokeWeight(3);
    beginShape();
    for (let y = 0; y < 150; y += 10) {
      let w = map(y, 0, 150, 40, 5);
      let x = sin(frameCount * 0.1 + y * 0.3) * 5;
      vertex(x - w / 2, y);
      vertex(x + w / 2, y);
    }
    endShape();
    pop();
  }
}
