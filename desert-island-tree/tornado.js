class Tornado {
  constructor(x, thunderSound, scenarioType) {
    this.pos = createVector(x, 150);
    this.vel = createVector(-2, 0); // make sure it's visible speed
    this.scenarioType = scenarioType;
    this.activated = false;
    this.thunderSound = thunderSound;
    this.flashAlpha = 0;
    this.raindrops = [];
  }

  update(trees) {
    // move tornado left across screen
    this.pos.add(this.vel);

    // create rain
    if (random(1) < 0.4) {
      this.raindrops.push({
        x: this.pos.x + random(-50, 50),
        y: this.pos.y + random(0, 50),
        speed: random(8, 12)
      });
    }

    for (let r of this.raindrops) r.y += r.speed;
    this.raindrops = this.raindrops.filter(r => r.y < height * 0.8);

    // trigger scenario once when tornado reaches the trees
    if (!this.activated && this.pos.x < width / 2) {
      this.activated = true;
      let good = this.scenarioType === "good";
      for (let t of trees) t.nourish(good);

      stormColorFactor = 1;
      this.flashAlpha = 180;

      if (this.thunderSound && getAudioContext().state === "running") {
        if (!this.thunderSound.isPlaying()) {
          this.thunderSound.setVolume(0.6);
          this.thunderSound.rate(random(0.9, 1.1));
          this.thunderSound.play();
        }
      }
    }

    // fade effects
    stormColorFactor = lerp(stormColorFactor, 0, 0.05);
    this.flashAlpha *= 0.9;
  }

  display() {
    // cloud
    noStroke();
    fill(100);
    ellipse(this.pos.x, this.pos.y, 140, 70);

    // funnel
    this.drawTornado();

    // rain
    stroke(150, 150, 255, 180);
    strokeWeight(2);
    for (let r of this.raindrops) {
      line(r.x, r.y, r.x, r.y + 12);
    }

    // lightning flash overlay
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
      let x = sin(frameCount * 0.2 + y * 0.3) * 6;
      vertex(x - w / 2, y);
      vertex(x + w / 2, y);
    }
    endShape();
    pop();
  }
}
