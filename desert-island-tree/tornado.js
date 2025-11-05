class Tornado {
  constructor(x, thunderSound, scenarioType) {
    this.pos = createVector(x, 150);
    this.scenarioType = scenarioType;
    this.activated = false;
    this.thunderSound = thunderSound;
    this.flashAlpha = 0;
    this.raindrops = [];
    this.spinOffset = random(1000); // unique per tornado for noise variation
  }

  update(trees, sliderSpeed = 2) {
    // move tornado left across screen
    this.pos.x -= sliderSpeed;

    // generate rain
    if (random(1) < 0.4) {
      this.raindrops.push({
        x: this.pos.x + random(-50, 50),
        y: this.pos.y + random(0, 50),
        speed: random(8, 12)
      });
    }

    // update rain
    for (let r of this.raindrops) r.y += r.speed;
    this.raindrops = this.raindrops.filter(r => r.y < height * 0.8);

    // trigger event once when tornado passes center
    if (!this.activated && this.pos.x < width / 2) {
      this.activated = true;
      let good = this.scenarioType === "good";
      for (let t of trees) t.nourish(good);

      // lightning + thunder
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

  display(sliderSpeed = 2) {
    // draw cloud
    noStroke();
    fill(100);
    ellipse(this.pos.x, this.pos.y, 140, 70);

    // draw tornado funnel below
    this.drawTornado(sliderSpeed);

    // draw rain
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

  drawTornado(sliderSpeed) {
    push();
    translate(this.pos.x, this.pos.y + 35);
    noFill();

    // spin speed increases with tornado speed
    let spinRate = map(sliderSpeed, 0.5, 5, 0.1, 0.6);
    stroke(180, 180, 200, 180);
    strokeWeight(3);

    // draw funnel as curved lines that twist more when faster
    beginShape();
    for (let y = 0; y < 150; y += 10) {
      let w = map(y, 0, 150, 40, 5);
      // spin pattern tied to frameCount and slider speed
      let x = sin(frameCount * spinRate + y * 0.3 + this.spinOffset) * 6;
      vertex(x - w / 2, y);
      vertex(x + w / 2, y);
    }
    endShape();

    pop();
  }
}
