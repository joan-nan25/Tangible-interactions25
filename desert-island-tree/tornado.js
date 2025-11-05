update(trees, sliderSpeed = 2) {
  // horizontal movement based on slider
  this.pos.x -= sliderSpeed;

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

  // trigger scenario once when tornado reaches trees
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

  stormColorFactor = lerp(stormColorFactor, 0, 0.05);
  this.flashAlpha *= 0.9;
}
