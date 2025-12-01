class Tornado {
  constructor(x, thunderSound, scenarioType) {
    this.pos = createVector(x, 150);
    this.scenarioType = scenarioType;
    this.activated = false;
    this.thunderSound = thunderSound;
    this.flashAlpha = 0;
    this.raindrops = [];
    this.spinOffset = random(1000);
    this.alpha = 255; // for fade-out
  }

  update(trees, sliderSpeed = 2) {
    // Move left across the screen
    this.pos.x -= sliderSpeed;

    // Generate rain under the cloud
    if (random(1) < 0.4) {
      this.raindrops.push({
        x: this.pos.x + random(-50, 50),
        y: this.pos.y + random(0, 50),
        speed: random(8, 12)
      });
    }

    // Update rain positions
    for (let r of this.raindrops) {
      r.y += r.speed;
    }
    this.raindrops = this.raindrops.filter(r => r.y < height * 0.8);

    // Trigger the scenario once when tornado reaches the trees
    if (!this.activated && this.pos.x < width / 2) {
      this.activated = true;
      const good = this.scenarioType === "good";
      for (let t of trees) t.nourish(good);

      stormColorFactor = 1;
      this.flashAlpha = 180;

      if (this.thunderSound && getAudioContext().state === "running") {
        this.thunderSound.stop();
        this.thunderSound.setVolume(0.7);
        this.thunderSound.rate(random(0.9, 1.1));
        this.thunderSound.play();
      }
    }

    // Fade lightning flash and sky effect
    stormColorFactor = lerp(stormColorFactor, 0, 0.05);
    this.flashAlpha *= 0.9;

    // Fade tornado out after passing well beyond trees
    if (this.pos.x < width / 2 - 200) {
      this.alpha = max(0, this.alpha - 6);
    }
  }

  display(sliderSpeed = 2) {
    // Cloud
    noStroke();
    fill(100, this.alpha);
    ellipse(this.pos.x, this.pos.y, 140, 70);

    // Tornado funnel
    this.drawTornado(sliderSpeed);

    // Rain
    stroke(150, 150, 255, 180);
    strokeWeight(2);
    for (let r of this.raindrops) {
      line(r.x, r.y, r.x, r.y + 12);
    }

    // Lightning flash overlay
    if (this.flashAlpha > 5) {
      noStroke();
      fill(255, 255, 230, this.flashAlpha);
      rect(0, 0, width, height);
    }
  }

  drawTornado(sliderSpeed) {
    push();
    translate(this.pos.x, this.pos.y + 35);
    noFill();

    let spinRate = map(sliderSpeed, 0.5, 5, 0.1, 0.6);
    stroke(180, 180, 200, this.alpha);
    strokeWeight(3);

    beginShape();
    for (let y = 0; y < 150; y += 10) {
      let w = map(y, 0, 150, 40, 5);
      let x = sin(frameCount * spinRate + y * 0.3 + this.spinOffset) * 6;
      vertex(x - w / 2, y);
      vertex(x + w / 2, y);
    }
    endShape();

    pop();
  }
}
